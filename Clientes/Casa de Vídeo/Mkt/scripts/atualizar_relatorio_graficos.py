#!/usr/bin/env python3
"""Atualiza os dados do Relatorio_Graficos.html (GA4, Search Console e Google Ads) via Composio CLI.

Uso semanal:  python3 scripts/atualizar_relatorio_graficos.py
"""
import json
import re
import subprocess
import time
from datetime import date, timedelta
from pathlib import Path

GA4_PROPERTY = "properties/555545561"
GSC_SITE = "https://casadevideo.com.br/"
ADS_CUSTOMER = "7130247433"
ADS_ACCOUNT = "googleads_glore-bigot"
ADS_API = "v24"
INICIO = "2026-09-01"  # antes do início de todas as plataformas; dias sem dados são descartados
HOJE = (date.today() - timedelta(days=1)).isoformat()  # último dia completo
IAS = {"chatgpt": "ChatGPT", "openai": "ChatGPT", "perplexity": "Perplexity", "gemini": "Gemini", "bard": "Gemini",
       "copilot": "Copilot", "claude": "Claude", "deepseek": "DeepSeek", "meta.ai": "Meta AI", "grok": "Grok"}
FONTES_IA = ".*(chatgpt|openai|perplexity|gemini|bard|copilot|claude|deepseek|meta\\.ai|grok).*"
HTML = Path(__file__).resolve().parent.parent / "Relatorio_Graficos.html"


def composio(*args, max_retries=3, delay=3):
    for attempt in range(1, max_retries + 1):
        out = subprocess.run(["composio", *args], capture_output=True, text=True, cwd=Path.home())
        raw = out.stdout.strip()
        # Find start of JSON object or array if any preamble was printed
        idx_obj = raw.find("{")
        idx_arr = raw.find("[")
        idx = -1
        if idx_obj != -1 and idx_arr != -1:
            idx = min(idx_obj, idx_arr)
        elif idx_obj != -1:
            idx = idx_obj
        elif idx_arr != -1:
            idx = idx_arr

        if idx != -1:
            try:
                data = json.loads(raw[idx:])
                if isinstance(data, dict) and not data.get("successful", True) and data.get("error"):
                    print(f"[Aviso] Tentativa {attempt}/{max_retries} falhou com erro: {data.get('error')}")
                    if attempt < max_retries:
                        time.sleep(delay)
                        continue
                return data
            except json.JSONDecodeError:
                pass

        if attempt < max_retries:
            print(f"[Aviso] Falha de decodificação na tentativa {attempt}/{max_retries}. Tentando novamente em {delay}s...")
            time.sleep(delay)
        else:
            raise SystemExit(f"Falha em composio {args[:2]}:\nSTDOUT:\n{out.stdout}\nSTDERR:\n{out.stderr}")


def ga4(body):
    body = {"property": GA4_PROPERTY, "dateRanges": [{"startDate": INICIO, "endDate": HOJE}], "limit": 1000, **body}
    res = composio("execute", "GOOGLE_ANALYTICS_RUN_REPORT", "-d", json.dumps(body))
    if not isinstance(res, dict) or not res.get("data"):
        print(f"[Aviso GA4] Resposta inesperada: {res}")
        return []
    return res["data"].get("rows", []) or []


def iso(yyyymmdd):
    return f"{yyyymmdd[:4]}-{yyyymmdd[4:6]}-{yyyymmdd[6:]}"


def coletar():
    dias = {}

    def dia(d):
        return dias.setdefault(d, {})

    print("[1/5] Coletando métricas gerais do GA4...")
    for r in ga4({"dimensions": [{"name": "date"}],
                  "metrics": [{"name": n} for n in ("activeUsers", "sessions", "screenPageViews", "engagedSessions")]}):
        u, s, v, e = (int(m["value"]) for m in r["metricValues"])
        dia(iso(r["dimensionValues"][0]["value"])).update(ga_usuarios=u, ga_sessoes=s, ga_views=v, ga_engajadas=e)

    print("[2/5] Coletando cliques de WhatsApp do GA4...")
    for r in ga4({"dimensions": [{"name": "date"}], "metrics": [{"name": "eventCount"}],
                  "dimensionFilter": {"filter": {"fieldName": "eventName", "stringFilter": {"value": "whatsapp_click"}}}}):
        dia(iso(r["dimensionValues"][0]["value"]))["ga_whatsapp"] = int(r["metricValues"][0]["value"])

    print("[3/5] Coletando origens de IA (GEO) do GA4...")
    for r in ga4({"dimensions": [{"name": "date"}, {"name": "sessionSource"}],
                  "metrics": [{"name": "sessions"}, {"name": "engagedSessions"}],
                  "dimensionFilter": {"filter": {"fieldName": "sessionSource",
                                                 "stringFilter": {"matchType": "FULL_REGEXP", "caseSensitive": False, "value": FONTES_IA}}}}):
        fonte = r["dimensionValues"][1]["value"].lower()
        nome = next((n for chave, n in IAS.items() if chave in fonte), "Outras IAs")
        s, e = (int(m["value"]) for m in r["metricValues"])
        d = dia(iso(r["dimensionValues"][0]["value"]))
        d.setdefault("ia", {})[nome] = d.get("ia", {}).get(nome, 0) + s
        d["ia_engajadas"] = d.get("ia_engajadas", 0) + e

    print("[4/5] Coletando dados do Google Search Console...")
    gsc = composio("execute", "GOOGLE_SEARCH_CONSOLE_SEARCH_ANALYTICS_QUERY", "-d", json.dumps(
        {"site_url": GSC_SITE, "start_date": INICIO, "end_date": HOJE, "dimensions": ["date"], "data_state": "all", "row_limit": 1000}))
    for r in (gsc.get("data", {}).get("rows", []) or []):
        if r.get("impressions"):
            dia(r["keys"][0]).update(sc_cliques=r["clicks"], sc_impressoes=r["impressions"], sc_posicao=round(r["position"], 2))

    print("[5/5] Coletando dados do Google Ads...")
    q = ("SELECT segments.date, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions "
         f"FROM customer WHERE segments.date BETWEEN '{INICIO}' AND '{HOJE}' ORDER BY segments.date")
    ads = composio("proxy", f"https://googleads.googleapis.com/{ADS_API}/customers/{ADS_CUSTOMER}/googleAds:search",
                   "-t", "googleads", "--account", ADS_ACCOUNT, "-X", "POST",
                   "-H", "content-type: application/json", "-d", json.dumps({"query": q}))
    if "results" not in ads and "error" in ads:
        raise SystemExit(f"Google Ads: {ads['error'].get('message')} (verifique ADS_API)")
    for r in ads.get("results", []):
        m = r["metrics"]
        if int(m.get("impressions", 0)):
            dia(r["segments"]["date"]).update(
                ads_cliques=int(m.get("clicks", 0)), ads_impressoes=int(m["impressions"]),
                ads_gasto=round(int(m.get("costMicros", 0)) / 1e6, 2), ads_conversoes=round(float(m.get("conversions", 0)), 2))

    return [{"data": d, **dias[d]} for d in sorted(dias)]


def main():
    dados = {"atualizado_em": HOJE, "dias": coletar()}
    html = HTML.read_text(encoding="utf-8")
    bloco = "/*DADOS_INICIO*/" + json.dumps(dados, ensure_ascii=False) + "/*DADOS_FIM*/"
    html, n = re.subn(r"/\*DADOS_INICIO\*/.*?/\*DADOS_FIM\*/", lambda _: bloco, html, flags=re.S)
    if n != 1:
        raise SystemExit("Marcadores DADOS_INICIO/DADOS_FIM não encontrados no HTML")
    HTML.write_text(html, encoding="utf-8")
    print(f"OK: {len(dados['dias'])} dias gravados em {HTML.name} ({dados['dias'][0]['data']} → {dados['dias'][-1]['data']})")


if __name__ == "__main__":
    main()
