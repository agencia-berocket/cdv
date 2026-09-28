#!/usr/bin/env python3
import os
import sys
import json

PATH_KEY = os.path.abspath(os.path.join(os.path.dirname(__file__), "../data/google_service_account_key.json"))
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = PATH_KEY

PROPERTY_ID = "555545561"

def consultar_ga4_live():
    print(f"📡 Testando consulta à GA4 Data API para propriedade properties/{PROPERTY_ID}...")
    try:
        from google.analytics.data_v1beta import BetaAnalyticsDataClient
        from google.analytics.data_v1beta.types import RunReportRequest, DateRange, Metric, Dimension

        client = BetaAnalyticsDataClient()

        # Report request for last 7 days
        req = RunReportRequest(
            property=f"properties/{PROPERTY_ID}",
            date_ranges=[DateRange(start_date="7daysAgo", end_date="today")],
            metrics=[
                Metric(name="activeUsers"),
                Metric(name="sessions"),
                Metric(name="eventCount"),
                Metric(name="userEngagementDuration"),
                Metric(name="bounceRate")
            ],
            dimensions=[Dimension(name="date")]
        )

        resp = client.run_report(req)
        print("✅ Conexão GA4 Data API realizada com SUCESSO ABSOLUTO!")
        print(f"Linhas retornadas do GA4: {len(resp.rows)}")
        
        total_usuarios = 0
        total_sessoes = 0
        total_eventos = 0
        
        for row in resp.rows:
            data_str = row.dimension_values[0].value
            active_users = int(row.metric_values[0].value)
            sessions = int(row.metric_values[1].value)
            events = int(row.metric_values[2].value)
            total_usuarios += active_users
            total_sessoes += sessions
            total_eventos += events
            print(f" Data {data_str}: {active_users} usuários ativos, {sessions} sessões, {events} eventos")
            
        print(f"\n📊 Totais acumulados: {total_usuarios} Usuários, {total_sessoes} Sessões, {total_eventos} Eventos.")
        return {
            "total_usuarios": total_usuarios,
            "total_sessoes": total_sessoes,
            "total_eventos": total_eventos
        }
    except Exception as e:
        print(f"❌ Erro ao consultar GA4: {e}")
        return None

if __name__ == "__main__":
    consultar_ga4_live()
