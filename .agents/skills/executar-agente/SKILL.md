---
name: executar-agente
description: Skill orquestradora universal para executar agentes de Marketing Digital em clientes da agência. Suporta o comando: Execute Agente "[SEO|Trafego_Pago|GEO]" para o cliente [Nome_do_Cliente].
---

# 🚀 Skill Orquestradora — Executar Agente no Cliente

## 📌 Sintaxe do Comando
Para acionar qualquer agente para um cliente específico, utilize o comando:
`Execute Agente "[SEO|Trafego_Pago|GEO]" para o cliente [Nome_do_Cliente]`

---

## 🛠️ Workflow de Orquestração

Quando o comando for acionado:

### Passo 1: Mapeamento do Cliente e Contexto
1. Verifica se a pasta `Clientes/[Nome_do_Cliente]/` existe.
2. Se a pasta do cliente **não existir**:
   - Cria o diretório `Clientes/[Nome_do_Cliente]/`
   - Cria as subpastas `Mkt/Google_Ads`, `Mkt/SEO`, `Mkt/GEO`.
   - Inicializa `contexto.json` e `aprendizados_cliente.md`.
3. Carrega os dados de `Clientes/[Nome_do_Cliente]/contexto.json`.

### Passo 2: Invocação do Agente Especialista
De acordo com o parâmetro especificado:

- **Se Agente GEO**:
  - Invoca a skill [agente-geo](file:///Users/guilhermerossi/Documents/b.rocket/.agents/skills/agente-geo/SKILL.md).
  - Executa a auditoria de citabilidade utilizando o motor b.rocket (`geo-diagnostic-engine.cjs`).
  - Atualiza `llms.txt`, Schemas JSON-LD e dashboards em `Clientes/[Nome_do_Cliente]/Mkt/GEO/`.

- **Se Agente SEO**:
  - Invoca a skill [agente-seo](file:///Users/guilhermerossi/Documents/b.rocket/.agents/skills/agente-seo/SKILL.md).
  - Executa a auditoria SEO On-Page, Core Web Vitals e Google Meu Negócio.
  - Atualiza `checklist_onpage.json` e dashboards em `Clientes/[Nome_do_Cliente]/Mkt/SEO/`.

- **Se Agente Tráfego Pago**:
  - Invoca a skill [agente-trafego-pago](file:///Users/guilhermerossi/Documents/b.rocket/.agents/skills/agente-trafego-pago/SKILL.md).
  - Executa o planejamento de campanhas Search/PMax, tagging e negativação de termos.
  - Atualiza a estrutura de campanhas e dashboards em `Clientes/[Nome_do_Cliente]/Mkt/Google_Ads/`.

### Passo 3: Atualização do Aprendizado em 2 Camadas
1. **Camada Técnica (Agente)**: Salva novos frameworks ou técnicas aprendidas em `.agents/skills/<agente>/conhecimento_tecnico.md`.
2. **Camada de Negócio (Cliente)**: Salva particularidades, objeções ou dados do cliente em `Clientes/[Nome_do_Cliente]/aprendizados_cliente.md`.

### Passo 4: Retorno ao Usuário
Entrega o relatório de execução no chat em **português do Brasil**, fornecendo links clicáveis de 1 clique para todos os arquivos e dashboards gerados ou atualizados.
