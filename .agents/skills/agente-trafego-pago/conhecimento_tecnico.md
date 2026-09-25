# 🧠 Conhecimento Técnico & Diretrizes Operacionais — Agente Tráfego Pago (Google Ads & Nova Gestão de Tráfego)

Este documento centraliza 100% da metodologia da **Nova Gestão de Tráfego** (Sobral Framework), arquitetura de rastreamento (GTM), metodologia STAG, matriz de lances inteligentes (Smart Bidding), fórmulas de Ad Rank, estratégias de IA para 2026, métricas financeiras (POAS, CPL, CAC) e governança de campanhas acumuladas pelo **Agente Tráfego Pago**. **Atualizado continuamente.**

---

## 🔺 0. O TRIÂNGULO DE OURO DAS VENDAS & A LÓGICA DO "BOLO DE CENOURA FOFINHO"

### 0.1 O Triângulo de Ouro das Vendas
O sucesso do tráfego pago baseia-se na sustentação equilibrada de 3 pilares interdependentes:
1. **OFERTA (Landing Page & Promessa):** O produto/serviço precisa ter uma proposta única de valor clara, diferenciais competitivos e uma Landing Page rápida (load < 3s), sem distrações de navegação.
2. **TRÁFEGO (Google Ads & Meta Ads):** Atrair o público certo no momento certo. No Google Ads, capturamos a intenção direta de compra; no Meta Ads, geramos demanda e autoridade.
3. **CONVERSÃO (Atendimento Comercial 1:1 & CRM):** O lead gerado precisa ser atendido em tempo recorde no WhatsApp/CRM com um protocolo de vendas alinhado. Se o atendimento falha, o retorno do tráfego desmorona.

### 0.2 A Lógica do "Bolo de Cenoura Fofinho" (Intenção Direta no Google)
Diferente das redes sociais (onde adivinhamos o desejo do usuário por comportamento e interesses), no **Google Ads o cliente nos diz exatamente o que quer**. 
* Quando alguém pesquisa *"produtora de vídeo b2b sp"* ou *"bolo de cenoura fofinho"*, a intenção de contratação é imediata.
* Nossa missão é estar em **1º Lugar no Google Search** respondendo com máxima precisão à pesquisa realizada.

---

## 🏛️ 1. AS 4 CAMPANHAS DE OURO DA NOVA GESTÃO DE TRÁFEGO

Toda conta de anúncios de alta performance deve ser estruturada sobre **4 Campanhas Fundamentais**:

1. **CAMPANHA 1 — SEGUIDORES QUALIFICADOS / CONSTRUÇÃO DE AUDIÊNCIA (Topo de Funil):**
   * *Objetivo:* Atrair pessoas qualificadas para o perfil do cliente e gerar base de remarketing.
2. **CAMPANHA 2 — VENDAS 1:1 / WHATSAPP & CRM (Fundo/Meio de Funil):**
   * *Objetivo:* Gerar conversas diretas no WhatsApp e formulários de orçamento para fechamento comercial rápido.
3. **CAMPANHA 3 — DOMINAÇÃO TOP 1 NO GOOGLE (Branded & Proteção de Marca):**
   * *Objetivo:* Garantir que 100% das buscas pelo nome do cliente ou termos da marca fiquem na 1ª Posição do Google, impedindo que concorrentes roubem o tráfego.
4. **CAMPANHA 4 — VENDAS NO GOOGLE (Alta Intenção Comercial & PMax Showreel):**
   * *Objetivo:* Capturar buscas de fundo de funil por serviços específicos e escalar visualmente no YouTube, Display e Gmail com a Performance Max (PMax).

---

## 📋 2. OS 10 PASSOS INFALÍVEIS PARA CAMPANHAS DE PESQUISA NO GOOGLE ADS

Toda campanha de pesquisa deve seguir estritamente o protocolo dos 10 passos:

1. **OBJETIVO E TIPO DE CAMPANHA:**
   * Objetivo: *Vendas* ou *Geração de Leads*. Tipo: *Rede de Pesquisa*.
2. **META E NOMENCLATURA PADRONIZADA:**
   * Convenção obrigatória: `[Rede] | [Objetivo] | [Tema/Produto] | [Região]`
   * *Exemplo:* `Search | Lead | Produtora-Video-B2B | SP`
3. **ESTRATÉGIA DE LANCES & EVOLUÇÃO:**
   * *Fase 1 (Conta Nova / 0 a 30 conversões/mês):* **Maximizar Cliques** ou **Maximizar Conversões**.
   * *Fase 2 (Conta Maturada / 30+ conversões/mês):* Migrar para **CPA Desejado (tCPA)** ou **tCPL**.
4. **REDES & TRAVAS DE PROTEÇÃO:**
   * Ativar: *Rede de Pesquisa do Google*.
   * **NUNCA ATIVAR:** *Rede de Display* dentro da campanha de busca (manter sempre desativada para não diluir a verba em blogs acidentais).
5. **LOCALIZAÇÃO & IDIOMAS:**
   * Configuração geográfica estrita baseada na área real de atendimento (ex: São Paulo + Raio Metropolitano 25km). Marcar a opção de presença física *"Pessoas localizadas na sua região"*.
6. **SIMPLIFICAÇÃO & FOCO NO ESSENCIAL:**
   * Eliminar alterações desnecessárias. Focar em Palavras-chave de alta intenção, Copywriting do anúncio, Oferta e velocidade da Landing Page.
7. **PROGRAMAÇÃO DE HORÁRIOS:**
   * Alinhar o disparo dos anúncios aos horários em que a equipe comercial está ativa no WhatsApp/CRM (ex: Seg-Sex das 8h às 20h).
8. **PALAVRAS-CHAVE STAG (Single Theme Ad Groups):**
   * Grupos temáticos de 5 a 20 palavras com mesmo conceito. Usar correspondências `[exata]` e `"frase"`.
9. **ANÚNCIOS RESPONSIVOS DE PESQUISA (RSA) & TRÍADE P-A-P:**
   * Preencher 11 a 15 títulos e 4 descrições. Garantir a Tríade: Palavra-Chave no Título 1 + Benefício/Oferta na Descrição + Landing Page Direta.
10. **EXTENSÕES / RECURSOS DE ANÚNCIO:**
    * Inclusão obrigatória de Sitelinks (mínimo 4), Frases de Destaque, Snippets Estruturados, Chamadas telefônicas e Recursos de Imagem.

---

## 🛠️ 3. INFRAESTRUTURA DE DADOS & RASTREAMENTO IMPECÁVEL (GTM & GCLID)

### 3.1 Tagging via Google Tag Manager (GTM)
* **Tag Global do Google Ads:** Configurada com a ID `AW-XXXXXXXXX` disparada em *All Pages*.
* **Vinculador de Conversões (Conversion Linker):** Ativo em todas as páginas para atribuição por cookie first-party.
* **Contagem de Conversões:** Selecionar **"Uma conversão"** para Leads (evitando contagens duplicadas) e **"Todas"** para E-commerce.

### 3.2 Captura de GCLID e Atribuição Offline no CRM
* Capturar o parâmetro `?gclid=` na URL e armazenar em cookie *first-party* por 30 dias.
* Injetar automaticamente no campo oculto `gclid_field` dos formulários de proposta.
* Quando o contrato é assinado no CRM do cliente, realizar a importação offline via **Data Manager** para retroalimentar os lances inteligentes da IA do Google Ads.

---

## 💬 4. PROTOCOLO DE ATENDIMENTO COMERCIAL NO WHATSAPP (CONVERSÃO 1:1)

Conforme o **Manual Prático de Atendimento no WhatsApp**, a conversão depende da execução imediata do script:
1. **Tempo de Resposta Recorde:** Atender em menos de 5 minutos após o clique do anúncio.
2. **Abordagem Humanizada & Consultiva:** Cumprimentar pelo nome, confirmar a solicitação de orçamento e demonstrar autoridade.
3. **Qualificação em 3 Perguntas Rápidas:**
   * Qual o objetivo do vídeo (corporativo, institucional, comercial de TV)?
   * Qual o prazo previsto para veiculação?
   * Já possuem roteiro ou precisam de desenvolvimento completo?
4. **Envio de Proposta Comercial em 24 Horas:** Enviar apresentação executiva com valores e agendar reunião de briefing.

---

## 🤖 5. PROTOCOLO MCP SERVER (MODEL CONTEXT PROTOCOL) & GOOGLE ADS API

O ecossistema b.rocket opera via **MCP Server (Google Ads Bridge)**:
1. **Aprovação no Portal:** O cliente aprova o briefing e a matriz de anúncios.
2. **Validação de Schemas:** O MCP Server valida a estrutura JSON das 4 campanhas e as tags GTM.
3. **Sincronização via API:** O MCP envia as campanhas, palavras e RSAs diretamente para a API do Google Ads (`AW-XXXXXXXXX`).
4. **Retroalimentação do Dashboard:** O MCP puxa dados de impressões, cliques, CTR, CPL e conversões em tempo real para o Dashboard.

---

## 💰 6. CHECKLIST ANTIBURRA DE MÍDIA (5 ERROS FATAIS)

1. ❌ **Rede de Display ativada em Campanhas de Pesquisa:** Desmarcar sempre!
2. ❌ **Enviar tráfego para a Homepage genérica:** Sempre direcionar para Landing Pages dedicadas.
3. ❌ **Definição prematura de tCPA / tROAS:** Nunca ativar sem histórico de 30+ conversões no mês.
4. ❌ **Orçamentos compartilhados na PMax:** Isolamento total da verba da PMax Showreel.
5. ❌ **Ansiedade e alterações diárias:** Respeitar a janela de aprendizado de 7 a 14 dias da IA.
