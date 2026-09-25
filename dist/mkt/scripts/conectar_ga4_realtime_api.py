#!/usr/bin/env python3
"""
Conector Live Google Analytics 4 (GA4 Data API v1beta)
Executa a chamada oficial ao endpoint :runRealtimeReport do Google Analytics 4
Propriedade: GA | BE | Casa de Video
"""

import json
import os
import sys

# ID da Propriedade do GA4 do cliente (visível no painel do Google Analytics)
GA4_PROPERTY_ID = "G-QF8MC5BX95"  # Ou ID Numérico da Propriedade no GA4 (ex: 412345678)

def consultar_realtime_ga4(service_account_json_path=None):
    """
    Consulta a API oficial do Google Analytics Realtime.
    Endpoint Google: POST https://analyticsdata.googleapis.com/v1beta/properties/{propertyId}:runRealtimeReport
    """
    print(f"📡 Iniciando chamada à Google Analytics Data API v1beta para Propriedade {GA4_PROPERTY_ID}...")
    
    if not service_account_json_path or not os.path.exists(service_account_json_path):
        print("\n⚠️ AVISO DE CONEXÃO DIRETA COM O GOOGLE:")
        print("Para que o Python ou Servidor MCP consulte a API do Google sem abrir browser:")
        print("1. É necessário a Chave de Conta de Serviço (.json) do Google Cloud Console.")
        print("2. O e-mail da Conta de Serviço deve ser adicionado no GA4 como 'Leitor'.")
        print("\nRetornando estrutura de relatório de teste da API:")
        
        # Estrutura exatamente idêntica ao retorno JSON oficial da API do Google Analytics 4
        resposta_oficial_google_api = {
          "dimensionHeaders": [{"name": "country"}, {"name": "city"}],
          "metricHeaders": [{"name": "activeUsers", "type": "TYPE_INTEGER"}],
          "rows": [
            {
              "dimensionValues": [{"value": "Brazil"}, {"value": "Sao Paulo"}],
              "metricValues": [{"value": "1"}]
            }
          ],
          "rowCount": 1,
          "metadata": {
            "currencyCode": "BRL",
            "timeZone": "America/Sao_Paulo"
          }
        }
        return resposta_oficial_google_api

    # Exemplo de chamada nativa usando a SDK oficial `google-analytics-data`
    try:
        from google.analytics.data_v1beta import BetaAnalyticsDataClient
        from google.analytics.data_v1beta.types import RunRealtimeReportRequest, Metric, Dimension

        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = service_account_json_path
        client = BetaAnalyticsDataClient()

        request = RunRealtimeReportRequest(
            property=f"properties/{GA4_PROPERTY_ID}",
            dimensions=[Dimension(name="country"), Dimension(name="city")],
            metrics=[Metric(name="activeUsers")]
        )
        response = client.run_realtime_report(request)
        
        print("✅ Dados recebidos ao vivo da Google Analytics Data API!")
        return response
    except Exception as e:
        print(f"❌ Erro ao consultar a API do Google: {e}")
        return None

if __name__ == "__main__":
    path_key = sys.argv[1] if len(sys.argv) > 1 else None
    res = consultar_realtime_ga4(path_key)
    print(json.dumps(res, indent=2, ensure_ascii=False))
