#!/usr/bin/env python3
import os
import json
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import RunReportRequest, DateRange, Metric, Dimension, RunRealtimeReportRequest

PATH_KEY = os.path.abspath(os.path.join(os.path.dirname(__file__), "../data/google_service_account_key.json"))
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = PATH_KEY

PROPERTY_ID = "555545561"

print(f"📡 Testando consulta live à API do GA4 na Propriedade properties/{PROPERTY_ID}...")

client = BetaAnalyticsDataClient()

# 1. Teste de Relatório Real-time
try:
    request_rt = RunRealtimeReportRequest(
        property=f"properties/{PROPERTY_ID}",
        dimensions=[Dimension(name="unifiedScreenName")],
        metrics=[Metric(name="activeUsers")]
    )
    res_rt = client.run_realtime_report(request_rt)
    print("✅ GA4 Realtime API Resposta com sucesso!")
    print(f"Total de linhas no Realtime: {len(res_rt.rows)}")
    for row in res_rt.rows:
        print(f"Página: {row.dimension_values[0].value} | Usuários Ativos: {row.metric_values[0].value}")
except Exception as e:
    print(f"⚠️ Erro ao consultar GA4 Realtime: {e}")

# 2. Teste de Relatório dos últimos 7 dias
try:
    request_7d = RunReportRequest(
        property=f"properties/{PROPERTY_ID}",
        date_ranges=[DateRange(start_date="7daysAgo", end_date="today")],
        metrics=[Metric(name="activeUsers"), Metric(name="sessions"), Metric(name="eventCount")]
    )
    res_7d = client.run_report(request_7d)
    print("\n✅ GA4 7-Days Report API Resposta com sucesso!")
    for row in res_7d.rows:
        print(f"Usuários Ativos (7d): {row.metric_values[0].value} | Sessões: {row.metric_values[1].value} | Eventos: {row.metric_values[2].value}")
except Exception as e:
    print(f"⚠️ Erro ao consultar GA4 7-Days Report: {e}")
