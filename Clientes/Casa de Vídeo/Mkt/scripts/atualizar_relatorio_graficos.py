#!/usr/bin/env python3
"""Atualiza os dados do Relatorio_Graficos.html (GA4, Search Console e Google Ads) via Composio CLI.

Uso semanal:  python3 scripts/atualizar_relatorio_graficos.py
"""
import json
import re
import subprocess
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


def composio(*args):
    out = subprocess.run(["composio", *args], capture_output=True, text=True, cwd=Path.home())
    try:
        return json.loads(out.stdout)
    except json.JSONDecodeError:
        raise SystemExit(f"Falha em composio {args[:2]}:\n{out.stdout}\n{out.stderr}")


def ga4(body):
    body = {"property": GA4_PROPERTY, "dateRanges": [{"startDate": INICIO, "endDate": HOJE}], "limit": 1000, **body}
    res = composio("execute", "GOOGLE_ANALYTICS_RUN_REPORT", "-d", json.dumps(body))
    return res["data"].get("rows", [])


def iso(yyyymmdd):
    return f"{yyyymmdd[:4]}-{yyyymmdd[4:6]}-{yyyymmdd[6:]}"


def coletar():
    dias = {}

    def dia(d):
        return dias.setdefault(d, {})

    for r in ga4({"dimensions": [{"name": "date"}],
                  "metrics": [{"name": n} for n in ("activeUsers", "sessions", "screenPageViews", "engagedSessions")]}):
        u, s, v, e = (int(m["value"]) for m in r["metricValues"])
        dia(iso(r["dimensionValues"][0]["value"])).update(ga_usuarios=u, ga_sessoes=s, ga_views=v, ga_engajadas=e)

    for r in ga4({"dimensions": [{"name": "date"}], "metrics": [{"name": "eventCount"}],
                  "dimensionFilter": {"filter": {"fieldName": "eventName", "stringFilter": {"value": "whatsapp_click"}}}}):
        dia(iso(r["dimensionValues"][0]["value"]))["ga_whatsapp"] = int(r["metricValues"][0]["value"])

    # GEO: visitas vindas de assistentes de IA (origem identificável no GA4)
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

    gsc = composio("execute", "GOOGLE_SEARCH_CONSOLE_SEARCH_ANALYTICS_QUERY", "-d", json.dumps(
        {"site_url": GSC_SITE, "start_date": INICIO, "end_date": HOJE, "dimensions": ["date"], "data_state": "all", "row_limit": 1000}))
    for r in gsc["data"].get("rows", []):
        if r["impressions"]:
            dia(r["keys"][0]).update(sc_cliques=r["clicks"], sc_impressoes=r["impressions"], sc_posicao=round(r["position"], 2))

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
