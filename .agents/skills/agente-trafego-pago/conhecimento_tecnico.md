# 🧠 Conhecimento Técnico & Diretrizes Operacionais — Agente Tráfego Pago (Google Ads)

Este documento centraliza a arquitetura de rastreamento (GTM), metodologia STAG, matriz de lances inteligentes (Smart Bidding), fórmulas de Ad Rank, estratégias de IA para 2026, métricas financeiras (POAS) e prevenção de erros em campanhas de Google Ads acumuladas pelo **Agente Tráfego Pago**. **Atualizado continuamente.**

---

## 🛠️ PASSO 1: INFRAESTRUTURA DE DADOS & RASTREAMENTO IMPECÁVEL (GTM)

### 1.1 Configuração do Painel
* Garantir que a conta do cliente esteja no **Modo Especialista**, habilitando acesso a estratégias avançadas de lances, relatórios detalhados de consultas e automações.

### 1.2 Instalação via Google Tag Manager (GTM)
* **Tag Global do Google Ads:** Configurar a tag base com a ID de conversão (`AW-XXXXXXXXX`) disparada em *Todas as Páginas (All Pages)*.
* **Vinculador de Conversões (Conversion Linker):** Instalar e ativar o Vinculador de Conversões em todas as páginas para garantir atribuição correta via cookies *first-party*.

### 1.3 Configuração e Disparo de Ações de Conversão
* **ID e Rótulo de Conversão (Hash):** Criar cada ação de conversão no painel (`Metas > Conversões > Resumo`) e extrair ID e Rótulo específicos.
* **Definição de Contagem:**
  * *Geração de Leads:* Selecionar **"Uma conversão"** (evita contagem duplicada se o usuário reenviar o formulário).
  * *E-commerce / Vendas:* Selecionar **"Todas as conversões"** para contabilizar cada transação individualmente.
* **Configuração de Acionadores (Triggers) no GTM:**
  * *Página de Agradecimento (Thank You Page):* Acionador de *Exibição de Página* onde `Page URL` contém `/obrigado` ou `/confirmacao`.
  * *Botão de WhatsApp / Links Externos:* **NUNCA** utilizar o acionador "Todos os Cliques". Restringir o acionador para *Alguns Cliques em Links* usando `Click Classes` ou `Click Element`.
  * *Formulários Dinâmicos:* Utilizar o acionador de *Envio de Formulário (Form Submission)* ou capturar eventos customizados via `dataLayer`.

### 1.4 Hierarquia de Metas Primárias e Secundárias
* Definir a ação de conversão principal do negócio como **Ação Primária** (usada para otimização do algoritmo de lances).
* Manter ações secundárias (ex: tempo na página, cliques em redes sociais) como **Ações Secundárias** (apenas para análise).

### 1.5 Importação de Conversões Offline e CRM
* Capturar o `GCLID` (*Google Click ID*) em campo oculto no formulário da LP, enviar para o CRM do cliente e realizar importação offline via **Data Manager** quando o lead for qualificado ou convertido em venda.

---

## 🏛️ PASSO 2: ARQUITETURA DE CONTA & METODOLOGIA STAG

### 2.1 Padrão Estrito de Nomenclatura
* Adotar a convenção: `[Rede] | [Objetivo] | [Tema/Produto] | [Região]`
* *Exemplo:* `Search | Lead | Treinamento-Executivo | Brasil`

### 2.2 Divisão Estratégica das Campanhas
1. **Campanha de Marca (Branded):** Termos contendo a marca do cliente (alto índice de qualidade, CPC baixo, proteção contra concorrentes).
2. **Campanha de Serviço/Produto Principal:** Termos diretos de alta intenção comercial.
3. **Campanha de Concorrentes:** Termos com nomes de concorrentes diretos (ofertas comparativas e orçamento isolado).
4. **Campanha Performance Max (PMax):** Multicanal (Search, Shopping, YouTube, Display, Maps, Gmail) orientada por sinais de público de dados próprios (*First-Party Data*).

### 2.3 Agrupamento Temático (STAG - Single Theme Ad Groups)
* Abandonar SKAGs (um grupo por palavra) para não fragmentar o aprendizado do algoritmo.
* Adotar a metodologia **STAG**: agrupar entre **5 e 20 palavras-chave** que compartilhem exatamente o mesmo conceito e intenção de busca.
* Toda palavra-chave do grupo deve ser diretamente respondida pelos títulos dos Anúncios Responsivos de Pesquisa (RSA).

---

## ⛔ PASSO 3: GESTÃO DE PALAVRAS-CHAVE E NEGATIVAGEM EM CAMADAS

### 3.1 Tipos de Correspondência
* **Correspondência Exata `[termo]`:** Captura a intenção exata e protege o orçamento em palavras de alto valor.
* **Correspondência de Frase `"termo"`:** Captura variações do termo sem perder a ordem sintática essencial.
* **Correspondência Ampla (Broad Match):** **NÃO utilizar em contas novas.** Usar apenas em contas maduras com mais de 30-50 conversões/mês e obrigatoriamente combinada com *Smart Bidding*.

### 3.2 Listas de Palavras-Chave Negativas Compartilhadas
Criar e aplicar listas globais de negativagem em nível de conta e campanha:
* **Gratuidade / Emprego:** `gratis`, `gratuito`, `free`, `vaga`, `emprego`, `concurso`, `pdf`, `curso gratuito`, `salario`, `o que e`, `significado`.
* **Reputação / SAC:** `reclame aqui`, `suporte`, `telefone sac`, `login`, `atestado`.
* **Amadoras / Tutoriais:** `como fazer`, `diy`, `passo a passo`, `template gratis`, `caseiro`, `barato`.

### 3.3 Auditoria Semanal do Relatório de Termos de Pesquisa
* Analisar as consultas reais (*Search Terms*) semanalmente.
* Negativar consultas irrelevantes e promover termos de alta conversão para palavras-chave oficiais.

---

## 📈 PASSO 4: OTIMIZAÇÃO DO AD RANK & TRÍADE DO ÍNDICE DE QUALIDADE (P-A-P)

O leilão do Google Ads é determinado pela fórmula:
$$\text{Ad Rank} = \text{Lance Máximo (CPC)} \times \text{Índice de Qualidade}$$

Um **Índice de Qualidade (IQ)** alto (notas de 7 a 10) reduz o valor real pago por clique:
$$\text{CPC Real} = \frac{\text{Ad Rank do Concorrente Abaixo}}{\text{Seu IQ}} + R\$ 0,01$$

### 4.1 A Tríade do Índice de Qualidade (Palavra -> Anúncio -> Página)
1. **Taxa de Cliques Esperada (CTR Esperada):**
   * Incluir CTAs fortes, ofertas claras e adicione todos os recursos disponíveis (Sitelinks, Frases de Destaque, Snippets Estruturados, Chamadas).
2. **Relevância do Anúncio:**
   * Garantir que a palavra-chave pesquisada apareça no **Título 1** do Anúncio Responsivo de Pesquisa (RSA).
   * Preencher pelo menos 11 títulos e 4 descrições persuasivas por RSA.
3. **Experiência na Página de Destino (Landing Page):**
   * Alinhar a promessa do anúncio com a dobra principal da Landing Page.
   * Garantir tempo de carregamento inferior a 3 segundos em dispositivos móveis e eliminar distrações de navegação.

---

## 📊 PASSO 5: MATRIZ DE LANCES INTELIGENTES (SMART BIDDING) & EVOLUÇÃO

### 5.1 Matriz de Evolução da Estratégia de Lances
* **Fase 1 (Conta Nova / 0 a 30 conversões/mês):**
  * Usar **Maximizar Cliques** (para atrair tráfego inicial) ou **Maximizar Conversões** (sem limite de CPA).
* **Fase 2 (Geração de Leads B2B / Serviços - Após 30+ conversões/mês):**
  * Migrar para **CPA Desejado (tCPA)**.
  * *Cálculo do tCPA:* Calcular a média real do CPA dos últimos 30 dias e ajustar a meta com margem de 10% a 20%.
* **Fase 3 (E-commerce / Focado em Receita - Após 50+ conversões/mês com valor dinâmico):**
  * Migrar para **Maximizar o Valor da Conversão** e em seguida para **ROAS Desejado (tROAS)**.

### 5.2 Regras Estritas de Ajuste
* **Fase de Aprendizado:** Aguardar de 7 a 14 dias após qualquer alteração estrutural antes de realizar novas modificações.
* **Ajuste Gradual de Metas:** Ao alterar tCPA ou tROAS, **nunca modificar mais do que 15% a 20% por vez** para evitar a reinicialização do aprendizado da IA.

---

## 🤖 PASSO 6: DIRETRIZES AVANÇADAS DE IA PARA 2026

### 6.1 Estratégia Power Pair
* Combinar campanhas de **Pesquisa em Correspondência Ampla + Smart Bidding** com campanhas **Performance Max (PMax)** para capturar toda a jornada de busca e novas consultas do mercado.

### 6.2 Governança de AI Max e Expansão de URL Final
* Auditar periodicamente as URLs finais selecionadas pela IA em campanhas com *AI Max*, garantindo que páginas institucionais ou de blog não consumam verba de vendas.

### 6.3 Automação por Scripts do Google Ads
Configure scripts na aba `Ferramentas > Scripts` para:
* Alertas automáticos por e-mail sobre quebra de links e erros 404.
* Alertas de anomalias no orçamento (gastos atípicos).
* Pausa automática de anúncios ou palavras-chave sem desempenho.

---

## 💰 PASSO 7: MÉTRICAS FINANCEIRAS & CHECKLIST ANTIBURRA

### 7.1 Métricas de Sucesso Financeiro Real
* **POAS (Profit on Ad Spend):** Lucro bruto gerado dividido pelo investimento em anúncios.
* **CAC (Custo de Aquisição de Cliente):** Custo total de mídia e operação dividido pelo número de novos clientes pagantes.
* **LTV Preditivo:** Valor gerado pelo cliente ao longo do seu ciclo de vida no negócio.

### 7.2 Checklist Antiburra (5 Erros Fatais a Bloquear)
1. ❌ **Rede de Display ativada em Campanhas de Pesquisa:** Desmarcar sempre a opção "Incluir Rede de Display do Google" nas configurações da campanha de busca.
2. ❌ **Tráfego pago enviado para a Homepage:** Sempre direcionar cliques para Landing Pages específicas e focadas na oferta.
3. ❌ **Definição prematura de tCPA ou tROAS:** Nunca ativar metas de tCPA/tROAS sem histórico consistente de conversões na conta.
4. ❌ **Orçamentos compartilhados em PMax:** Manter a verba da campanha Performance Max isolada para não canibalizar as pesquisas tradicionais.
5. ❌ **Alterações diárias e ansiosas:** Respeitar a janela de aprendizado de 7 a 14 dias da IA antes de julgar o desempenho.
