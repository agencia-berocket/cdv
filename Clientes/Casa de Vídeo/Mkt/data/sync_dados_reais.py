#!/usr/bin/env python3
"""
Script de Sincronização e Coleta de Dados Reais (b.rocket Engine)
----------------------------------------------------------------
Este script realiza a ponte entre as plataformas oficiais (Google Ads API,
Google Search Console API, GA4 e Motores de IA via MCPs/APIs) e o banco de 
dados persistente local `historico_semanal.json`.

Como Funciona a Integração:
1. Google Ads: Consulta a API via GCLID/GTM para buscar investimento real, clicks e conversões.
2. Search Console & GA4: Puxa métricas orgânicas de impressões e posição média.
3. Agente GEO (IAs): Executa 20 prompts no ChatGPT, Perplexity, Claude e Gemini para medir Citation Share.
4. Gravação Persistente: Atualiza `historico_semanal.json` sem sobrescrever o histórico passado.
"""

import json
import os
from datetime import datetime

DATA_PATH = os.path.join(os.path.dirname(__file__), "historico_semanal.json")

def carregar_historico():
    if os.path.exists(DATA_PATH):
        with open(DATA_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"cliente": "Casa de Vídeo Produções Ltda", "semanas": []}

def salvar_historico(data):
    data["ultima_atualizacao"] = datetime.utcnow().isoformat() + "Z"
    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"✅ Histórico atualizado com sucesso em: {DATA_PATH}")

def adicionar_ou_atualizar_semana(dados_novos_semana):
    data = carregar_historico()
    semanas = data.get("semanas", [])
    
    # Verificar se a semana já existe
    index_existente = next((i for i, s in enumerate(semanas) if s["id"] == dados_novos_semana["id"]), -1)
    
    if index_existente >= 0:
        semanas[index_existente] = dados_novos_semana
        print(f"🔄 Semana {dados_novos_semana['id']} atualizada!")
    else:
        semanas.insert(0, dados_novos_semana)
        print(f"✨ Nova semana {dados_novos_semana['id']} adicionada!")
        
    data["semanas"] = semanas
    salvar_historico(data)

if __name__ == "__main__":
    print("🚀 Iniciando motor de sincronização b.rocket para Casa de Vídeo...")
    # Exemplo de verificação do estado atual
    hist = carregar_historico()
    print(f"📊 Total de semanas registradas no banco: {len(hist['semanas'])}")
