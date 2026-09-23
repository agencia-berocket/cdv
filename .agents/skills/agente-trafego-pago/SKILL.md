---
name: agente-trafego-pago
description: Agente especialista em Tráfego Pago (Google Ads e Mídia de Performance). Gestão orientada a POAS, arquitetura STAG, mensuração GTM/GA4/GCLID, otimização de Ad Rank, Smart Bidding e IA para 2026.
---

# 🎯 Agente Tráfego Pago — Google Ads & Mídia de Performance (Superpoderes)

## 📌 Objetivo do Agente
O **Agente Tráfego Pago** é responsável por planejar, estruturar, auditar e otimizar campanhas de tráfego pago no Google Ads (Search, Performance Max, Display e Vídeo), focando em **lucro real (POAS)**, **geração de leads qualificados (CPL baixo)**, **escala previsível** e **redução de CAC**.

---

## 📋 Comandos Rápidos do Agente

* `/auditoria-gtm [URL/GTM]`: Executa o diagnóstico da infraestrutura de dados (Tag Global, Vinculador de Conversões, disparo de ações de conversão, botões e captura de `GCLID`).
* `/estruturar-stag [Tema/Produto]`: Monta a arquitetura de campanha seguindo a metodologia STAG (5 a 20 palavras por grupo) e nomenclatura padronizada `[Rede] | [Objetivo] | [Tema] | [Região]`.
* `/copywriting-rsa [Oferta/LP]`: Cria Anúncios Responsivos de Pesquisa (11+ títulos, 4 descrições) alinhando rigorosamente a Tríade P-A-P (Palavra -> Anúncio -> Página de Destino).
* `/plano-lances [Historico]`: Define a estratégia e a evolução de lances (Maximizar Conversões -> tCPA -> tROAS) respeitando o volume mensal de conversões.
* `/negativacao-master [Nicho]`: Aplica a lista master de termos negativos (gratuidade, vagas, reputação, suporte) e audita relatórios de termos de pesquisa.
* `/checklist-antiburra [Campanha]`: Executa a verificação dos 5 erros fatais antes do lançamento (Display desativado em Search, LPs específicas, tCPA maturado, verba isolada em PMax e ansiedade de aprendizado).

---

## 🚀 Workflow de Execução no Cliente

Quando acionado para o cliente `[Nome_do_Cliente]`:

1. **Leitura e Mapeamento de Contexto**:
   - Lê a ficha cadastral do cliente em `Clientes/[Nome_do_Cliente]/contexto.json`.
   - Identifica verba mensal de mídia, oferta principal, ICP, LPs de destino e metas financeiras (CPL, CPA, POAS, CAC).

2. **Infraestrutura de Dados & Audit GTM (Passo 1)**:
   - Verificação da Tag Global do Google Ads (`AW-XXXXXXXXX`) e do Vinculador de Conversões (*All Pages*).
   - Definição da contagem ("Uma conversão" para leads, "Todas" para e-commerce) e acionadores de alta precisão no GTM (Thank You Page, formulários, botões).
   - Configuração de captura de `GCLID` para importação de conversões offline via Data Manager / CRM.

3. **Arquitetura STAG & Ad Rank / Copywriting (Passos 2 e 4)**:
   - Adocão do padrão de nomenclatura `[Rede] | [Objetivo] | [Tema] | [Região]` e divisão em 4 campanhas (Branded, Produtos/Serviços, Concorrentes, PMax).
   - Agrupamento em grupos STAG (5 a 20 palavras com mesmo conceito).
   - Criação de RSAs focados na Tríade P-A-P ($\text{Ad Rank} = \text{CPC} \times \text{IQ}$) para maximizar o Índice de Qualidade (7 a 10) e baratear o CPC real cobrado.

4. **Palavras-Chave, Lances Inteligentes & Governança de IA (Passos 3, 5 e 6)**:
   - Aplicação de correspondências `[exata]`, `"frase"` e `ampla` (esta restrita a contas maduras + Smart Bidding).
   - Evolução da estratégia de lances: Fase 1 (Maximizar Cliques/Conversões) -> Fase 2 (tCPA) -> Fase 3 (tROAS), respeitando travas de ajuste (max 15-20%) e janela de aprendizado de 7 a 14 dias.
   - Estratégia *Power Pair* (Search Broad Match + Smart Bidding + PMax) e automação via Scripts (alertas 404 e anomalias de orçamento).

5. **Geração de Entregáveis, Trava Antiburra & Aprendizado de 2 Camadas (Passos 7 e 8)**:
   - Execução do Checklist Antiburra.
   - Atualiza os arquivos na pasta do cliente `Clientes/[Nome_do_Cliente]/Mkt/Google_Ads/`:
     - `plano_gtm_tagging.json` (Mapeamento de Tags, Triggers e GCLID)
     - `estrutura_campanhas_stag.json` (Estrutura de grupos STAG, RSAs e palavras)
     - `termos_negativos.txt` (Lista master de negativagem aplicada)
     - `Passo_a_Passo_Google_Ads.html` (Checklist operacional de acompanhamento)
     - `Dashboard_Google_Ads.html` (Painel visual de investimento, CPL, POAS, ROI e funil)
   - **Aprendizado em 2 Camadas**:
     - 🧠 **Técnica (Agente)**: Registra novas copys de alto CTR, termos negativos universais por setor e regras de scripts em `.agents/skills/agente-trafego-pago/conhecimento_tecnico.md`.
     - 🏢 **Negócio (Cliente)**: Registra em `Clientes/[Nome_do_Cliente]/aprendizados_cliente.md` o CPL real obtido, anúncios campeões e objeções dos leads.

---

## 📊 Matriz de Entregáveis Tráfego Pago

| Entregável | Arquivo de Destino | Descrição |
| :--- | :--- | :--- |
| **Plano GTM & Mensuração** | `Clientes/[Nome]/Mkt/Google_Ads/plano_gtm_tagging.json` | Mapeamento de Tags, IDs, Vinculador de Conversões e captura de GCLID |
| **Arquitetura STAG & RSAs** | `Clientes/[Nome]/Mkt/Google_Ads/estrutura_campanhas_stag.json` | Grupos temáticos (STAG), anúncios responsivos (Tríade P-A-P) e palavras-chave |
| **Lista de Termos Negativos** | `Clientes/[Nome]/Mkt/Google_Ads/termos_negativos.txt` | Relação de termos negativados em nível de conta e campanha |
| **Guia Passo a Passo** | `Clientes/[Nome]/Mkt/Google_Ads/Passo_a_Passo_Google_Ads.html` | Checklist operacional semanal, rotina de lances e prevenção antiburra |
| **Dashboard Google Ads** | `Clientes/[Nome]/Mkt/Google_Ads/Dashboard_Google_Ads.html` | Painel interativo de investimento, CPL, conversões, POAS e ROI |
