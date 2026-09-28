#!/usr/bin/env python3
"""
Robô de Atualização Automática Contínua (GA4 API -> Hub Central Casa de Vídeo)
Executa a consulta oficial à GA4 Data API a cada 1 hora e atualiza historico_semanal.json.
"""

import time
import os
import sys
from datetime import datetime

# Adiciona diretório pai ao sys.path
sys.path.append(os.path.dirname(__file__))

from conectar_apis_google_live import executar_sincronizacao_live

def loop_sincronizacao_continua(intervalo_segundos=3600):
    print(f"🤖 Robô de Sincronização Live GA4 iniciado. Atualizando a cada {intervalo_segundos//60} minutos...")
    while True:
        try:
            print(f"\n⏰ [{datetime.utcnow().strftime('%d/%m/%Y %H:%M:%S UTC')}] Rodando sincronização automática...")
            sucesso = executar_sincronizacao_live()
            if sucesso:
                print("✅ Painel atualizado com dados ao vivo da GA4 Data API!")
        except Exception as e:
            print(f"⚠️ Erro no ciclo de sincronização: {e}")
            
        print(f"💤 Aguardando próximo ciclo em {intervalo_segundos//60} minutos...")
        time.sleep(intervalo_segundos)

if __name__ == "__main__":
    loop_sincronizacao_continua()
