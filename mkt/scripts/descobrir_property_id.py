#!/usr/bin/env python3
import os
import sys

PATH_KEY = os.path.abspath(os.path.join(os.path.dirname(__file__), "../data/google_service_account_key.json"))
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = PATH_KEY

try:
    from google.analytics.admin_v1alpha import AnalyticsAdminServiceClient
    client = AnalyticsAdminServiceClient()
    print("📡 Buscando propriedades GA4 acessíveis pela Conta de Serviço...")
    for account_summary in client.list_account_summaries():
        print(f"Conta: {account_summary.display_name} ({account_summary.account})")
        for prop in account_summary.property_summaries:
            print(f"  👉 Propriedade GA4: {prop.display_name} -> ID: {prop.property} (Measurement ID / Stream disponível)")
except Exception as e:
    print(f"⚠️ Erro Admin API: {e}")
