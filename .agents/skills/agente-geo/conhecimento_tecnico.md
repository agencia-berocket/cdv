# 🧠 Conhecimento Técnico & Diretrizes Operacionais — Agente GEO (Generative Engine Optimization)

Este documento centraliza as regras de citabilidade em motores de IA, a arquitetura de 9 sub-agentes do **b.rocket GEO**, o cálculo do GEO Score Composto (7 pilares) e as diretrizes de dados estruturados em grafo (`@graph`). **Atualizado continuamente.**

---

## 🏛️ A ARQUITETURA DOS 9 SUB-AGENTES b.rocket GEO

### 1. `orchestrator` — Orquestrador Master
* Executa o pipeline de auditoria, aciona a execução em paralelo dos especialistas técnicos e sequencial dos testes de intenção.
* Consolida a nota **GEO Score Composto (0 a 100 pts)** e monta a matriz de priorização de ações.

### 2. `gatekeeper` — Technical Gatekeeper (18 pts no Score)
* **Robots.txt AI Bots (7 pts)**: Valida a liberação explícita para `GPTBot`, `PerplexityBot`, `Claude-SearchBot`, `OAI-SearchBot`, `Google-Extended` e `CCBot`.
* **SSR / Renderização sem JS (6 pts)**: Avalia se o conteúdo textual principal é entregue diretamente no HTML sem depender de execução JS no browser do bot.
* **Preços & Transparência Visíveis (5 pts)**: Verifica se tabelas ou estimativas numéricas de valores estão legíveis no HTML original.
* **Latência & HTTPS**: Monitora tempo de resposta do servidor (< 500ms) e presença de SSL válido.

### 3. `metadata` — Metadata Entity & Graph (15 pts no Score)
* **Organization / LocalBusiness Schema (6 pts)**: Validação do nó principal com nome, logo, contato e propriedades institucionais.
* **Person Schema (3 pts)**: Credenciais de autores e fundadores para alavancagem de E-E-A-T.
* **llms.txt Publicado (4 pts)**: Arquivo `/llms.txt` presente na raiz do domínio com resumo corporativo e sintaxe Markdown limpa.
* **Propriedades `sameAs` (2 pts)**: Links para perfis oficiais verificáveis (LinkedIn, Wikidata, Crunchbase, Wikipedia, Google Maps).

### 4. `content` — Content Absorption & Fatores Princeton (18 pts no Score)
Baseado em pesquisas de otimização para motores generativos:
* **AEO / Answer-First (5 pts)**: Resposta direta de 40 a 60 palavras posiciolada nas primeiras 80 palavras de cada seção principal (logo abaixo dos H2s).
* **Densidade de Estatísticas (5 pts)**: Ocorrência de dados quantitativos ou métricas a cada ~150 a 200 palavras.
* **Citações de Especialistas (5 pts)**: Presença de declarações de especialistas e aspas em tags semânticas (`<blockquote>`).
* **Tabelas HTML Comparativas (3 pts)**: Uso de tags `<table>` para organizar comparações estruturadas que os LLMs leem com prioridade.

### 5. `seo_optimizer` — SEO Optimizer (14 pts no Score)
* **Title & Meta Description**: Relevância e CTR em snippets clássicos.
* **Estrutura Semântica (H1-H3)**: Hierarquia semântica limpa e sem saltos.
* **Alt Tags e Mídia**: Descrição semântica em imagens e vídeos.

### 6. `semantic_explorer` — Semantic Explorer (13 pts no Score)
* **Content Gaps**: Identificação de sub-tópicos do nicho ausentes no site do cliente.
* **Topic Clusters**: Sugestão de arquitetura de conteúdo em Páginas Pilar + Artigos-Satélite.

### 7. `offpage` — Off-Page Entity Monitor (10 pts no Score)
* **External Footprint**: Mapeamento da presença da marca em portais de notícias, Wikidata, Crunchbase e redes profissionais.
* **Co-Ocorrência Vetorial**: Associação direta do nome da marca com palavras-chave estratégicas do setor.
* **Digital PR para IAs**: Construção de autoridade de imprensa que alimenta a base de conhecimento dos LLMs.

### 8. `intent` — Intent Prompt (12 pts no Score)
* **Matriz de Testes de Prompts**: Executa 20 buscas reais de intenção comercial/institucional através de 4 modelos de LLM via OpenRouter:
  - `openai/gpt-4o-mini` (ChatGPT)
  - `anthropic/claude-haiku-4.5` (Claude)
  - `google/gemini-2.5-flash` (Gemini)
  - `perplexity/sonar` (Perplexity)
* **Métricas**: Taxa de citação da marca (*Citation Share %*) e análise de sentimento (Positivo, Neutro ou Negativo).

### 9. `checklist_architect` — Checklist Architect
* Gera o código compilado pronto para deploy (`JSON-LD`, `llms.txt`, ajustes em `robots.txt`) e fornece o checklist de verificação de QA para a equipe do cliente.

---

## 🧮 FÓRMULA DO GEO SCORE COMPOSTO (7 PILARES)

$$\text{GEO Score} = \text{Clamp}\left(\text{Gatekeeper}(18) + \text{Metadata}(15) + \text{Content}(18) + \text{SEO}(14) + \text{Semantic}(13) + \text{OffPage}(10) + \text{Intent}(12), 0, 100\right)$$
