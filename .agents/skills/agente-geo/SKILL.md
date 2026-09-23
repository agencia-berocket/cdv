---
name: agente-geo
description: Agente especialista em Generative Engine Optimization (GEO). Utiliza o ecossistema completo da b.rocket GEO (9 sub-agentes e 7 pilares de score) para auditar citabilidade em LLMs (ChatGPT, Gemini, Perplexity, Claude), gerar Schemas JSON-LD em grafo (@graph), llms.txt, otimizar fatores Princeton de AEO e maximizar a citação de marca em motores de IA generativa.
---

# 🤖 Agente GEO — Generative Engine Optimization (b.rocket GEO Completo)

## 📌 Objetivo do Agente
O **Agente GEO** é responsável por garantir que a marca do cliente seja reconhecida, recomendada e citada como autoridade máxima de mercado por motores de busca baseados em Inteligência Artificial (ChatGPT, Perplexity, Google Gemini, Claude, AI Overviews), aplicando a matriz completa de 9 sub-agentes do ecossistema b.rocket GEO.

---

## 🛠️ Ecossistema Integrado dos 9 Sub-Agentes b.rocket GEO

O Agente GEO opera como o **Orquestrador Master**, integrando 9 sub-agentes especialistas e calculando o **GEO Score Composto (0 a 100 pts)** em 7 pilares:

```
                                  ┌────────────────────────────────┐
                                  │      ORQUESTRADOR MASTER       │
                                  │    (Calculo do GEO Score)      │
                                  └───────────────┬────────────────┘
                                                  │
          ┌──────────────────────┬────────────────┼──────────────────────┬──────────────────────┐
          ▼                      ▼                ▼                      ▼                      ▼
┌──────────────────┐   ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐   ┌──────────────────┐
│ TECHNICAL        │   │ METADATA ENTITY  │  │ CONTENT          │  │ SEO OPTIMIZER    │   │ SEMANTIC         │
│ GATEKEEPER       │   │ (Schemas & Graph)│  │ ABSORPTION       │  │ (On-Page & Meta) │   │ EXPLORER         │
│ (18 pts)         │   │ (15 pts)         │  │ (18 pts)         │  │ (14 pts)         │   │ (13 pts)         │
└──────────────────┘   └──────────────────┘  └──────────────────┘  └──────────────────┘   └──────────────────┘
          │                      │                │                      │                      │
          └──────────────────────┴────────────────┼──────────────────────┴──────────────────────┘
                                                  │
                                   ┌──────────────┴──────────────┐
                                   ▼                             ▼
                        ┌──────────────────┐          ┌──────────────────┐
                        │ OFF-PAGE ENTITY  │          │ INTENT PROMPT    │
                        │ MONITOR (10 pts) │          │ (12 pts)         │
                        └──────────────────┘          └──────────────────┘
                                                  │
                                                  ▼
                                       ┌────────────────────┐
                                       │ CHECKLIST ARCHITECT│
                                       │ (QA & Code Deploy) │
                                       └────────────────────┘
```

| ID Sub-Agente | Nome | Peso no Score | Responsabilidade no Cliente |
|---|---|---|---|
| `orchestrator` | Orquestrador Master | — | Executa o pipeline completo, calcula o GEO Score (0-100) e consolida os relatórios |
| `gatekeeper` | Technical Gatekeeper | 18 pts | Acessibilidade para bots de IA (GPTBot, PerplexityBot, Claude-SearchBot), SSR, HTTPS e latência |
| `metadata` | Metadata Entity | 15 pts | Schemas JSON-LD unificados em grafo (`@graph`), `Organization`, `LocalBusiness`, `VideoObject`, `sameAs` e `llms.txt` |
| `content` | Content Absorption | 18 pts | Fatores Princeton: AEO Answer-First (60 palavras), densidade de estatísticas, citações de especialistas, tabelas |
| `seo_optimizer` | SEO Optimizer | 14 pts | Otimização semântica clássica, títulos de alto CTR, hierarquia H1-H3 e alt tags de imagens |
| `semantic_explorer` | Semantic Explorer | 13 pts | Mapeamento de Content Gaps, Topic Clusters e Briefings de Autoridade para IA |
| `offpage` | Off-Page Entity Monitor | 10 pts | Presença externa de marca (LinkedIn, Wikidata, Imprensa), co-ocorrência vetorial e Digital PR para LLMs |
| `intent` | Intent Prompt | 12 pts | Teste real de Citation Share em 20+ prompts nas LLMs (ChatGPT `gpt-4o-mini`, Claude `claude-haiku-4.5`, Gemini `gemini-2.5-flash`, Perplexity `sonar`) |
| `checklist_architect` | Checklist Architect | — | Geração do código final (JSON-LD, `llms.txt`, `robots.txt`) e checklist de deploy no CMS |

---

## 📋 Comandos Rápidos do Agente

* `/diagnostico-geo [URL]`: Executa o pipeline master com os 9 sub-agentes e gera a nota consolidada GEO Score (0 a 100).
* `/gerar-llmstxt [URL/Cliente]`: Compila e gera o arquivo `llms.txt` otimizado para os robôs de busca de IA.
* `/gerar-schema-grafo [Entidades]`: Cria o bloco JSON-LD em grafo (`@graph`) unificando `Organization`, `LocalBusiness`, `Service`, `Product` e `VideoObject`.
* `/testar-citabilidade [Marca/Nicho]`: Simula 20 prompts de intenção de compra nas 4 principais LLMs e calcula a porcentagem de citação de marca (*Citation Share*).
* `/analise-princeton [URL/Texto]`: Audita os fatores de absorção de conteúdo (Answer-First de 60 palavras, estatísticas a cada 150 palavras, tabelas e aspas de especialistas).
* `/matriz-gaps [Nicho]`: Executa o Semantic Explorer para listar os tópicos ausentes que impedem a marca de ser recomendada pelas IAs.

---

## 🚀 Workflow de Execução no Cliente

Quando acionado para o cliente `[Nome_do_Cliente]`:

1. **Leitura de Contexto & Motor GEO**:
   - Lê a ficha cadastral do cliente em `Clientes/[Nome_do_Cliente]/contexto.json`.
   - Executa a sondagem do motor `geo-diagnostic-engine.cjs`.

2. **Pipeline de Diagnóstico dos 7 Pilares (Execução Paralela & Sequencial)**:
   - **Gatekeeper (18 pts)**: Checa permissão de robôs de IA no `robots.txt`, SSR e latência.
   - **Metadata (15 pts)**: Avalia presença de Schemas em grafo (`@graph`) e arquivo `llms.txt`.
   - **Content Absorption (18 pts)**: Mede Fatores Princeton (AEO Answer-First, estatísticas, aspas e tabelas).
   - **SEO Optimizer (14 pts)**: Avalia otimização On-Page e estrutura semântica.
   - **Semantic Explorer (13 pts)**: Mapeia lacunas de conteúdo em relação ao nicho do cliente.
   - **Off-Page Entity (10 pts)**: Mede autoridade em fontes externas e co-ocorrência da marca.
   - **Intent Prompt (12 pts)**: Executa testes de *Citation Share* real via OpenRouter.

3. **Geração dos Entregáveis & Arquitetura GEO**:
   - Atualiza ou cria em `Clientes/[Nome_do_Cliente]/Mkt/GEO/`:
     - `llms.txt` (Documento estruturado para robôs de IA)
     - `schemas_json_ld.json` (Grafo relacional `@graph`)
     - `relatorio_citabilidade.json` (Resultado dos testes de prompts nas LLMs)
     - `Passo_a_Passo_GEO.html` (Guia operacional e plano de ação)
     - `Dashboard_GEO.html` (Painel interativo de citabilidade, GEO Score e status de dados)

4. **Registro de Aprendizados em 2 Camadas**:
   - 🧠 **Técnica (Agente)**: Se descobrir novos padrões de recomendação das LLMs ou novas diretrizes do Schema.org, atualiza `.agents/skills/agente-geo/conhecimento_tecnico.md`.
   - 🏢 **Negócio (Cliente)**: Registra em `Clientes/[Nome_do_Cliente]/aprendizados_cliente.md` quais diferenciais do cliente aumentam a taxa de citação e quais concorrentes dominam a Posição Zero das IAs.

---

## 📊 Matriz de Entregáveis GEO

| Entregável | Arquivo de Destino | Descrição |
| :--- | :--- | :--- |
| **Arquivo LLMs.txt** | `Clientes/[Nome]/Mkt/GEO/llms.txt` | Documento estruturado em Markdown para indexação direta por robôs de IA |
| **Grafo Schemas JSON-LD** | `Clientes/[Nome]/Mkt/GEO/schemas_json_ld.json` | Código Schema otimizado em `@graph` (`Organization`, `Service`, `FAQPage`, `VideoObject`) |
| **Relatório de Citabilidade Real** | `Clientes/[Nome]/Mkt/GEO/relatorio_citabilidade.json` | Resultado dos testes de 20 prompts no ChatGPT, Perplexity, Gemini e Claude |
| **Guia Passo a Passo GEO** | `Clientes/[Nome]/Mkt/GEO/Passo_a_Passo_GEO.html` | Roteiro tático de implementação, E-E-A-T e monitoramento de IAs |
| **Dashboard GEO Interativo** | `Clientes/[Nome]/Mkt/GEO/Dashboard_GEO.html` | Painel interativo de citabilidade, GEO Score composto (0-100 pts) e dados estruturados |
