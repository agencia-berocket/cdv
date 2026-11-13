# Plano de Implantação — Google Ads

## Casa de Vídeo · b.rocket

Este plano organiza o que falta para sair do planejamento e chegar às primeiras campanhas Search aprovadas, mensuradas e acompanhadas com segurança.

## Princípio de implantação

O trabalho seguirá quatro estágios:

1. **Ler:** conectar fontes e validar dados, inicialmente em modo somente leitura.
2. **Cruzar:** conferir conta, site, GTM, GA4, canais de contato, ativos e plano de campanhas.
3. **Atuar:** preparar tags, conversões, campanhas, anúncios e negativas para aprovação.
4. **Automatizar:** criar rotinas de leitura e relatório; qualquer publicação ou alteração de verba exige aprovação humana.

## Fase 0 — decisões já registradas

- Verba própria: R$ 1.200/mês.
- Crédito promocional: até R$ 1.200, condicionado à oferta e não recorrente.
- Canais de contato: WhatsApp e e-mail.
- Prioridade: vídeos com IA, filmes publicitários com IA, corporativo/institucional, treinamento e motion graphics.
- Primeira fase: Search Marca + Search Serviços.
- Concorrentes e Performance Max: segunda fase.
- Site: https://casadevideo.com.br

## Fase 1 — acessos e diagnóstico somente leitura

### Google Ads

- [x] Customer ID da conta de anúncios: `713-024-7433`.
- [x] Acesso do usuário responsável ou conexão OAuth — `berocket@berocket.com.br` confirmado como administrador pelo responsável.
- [x] Usuário `berocket@berocket.com.br` possui acesso a várias contas individuais; MCC não confirmada e não é necessária para trabalhar diretamente na conta `713-024-7433`.
- [ ] Confirmar crédito promocional e regras de elegibilidade.
- [ ] Ler campanhas, conversões, histórico e configurações atuais.

### Google Tag Manager, GA4 e Search Console

- [ ] Confirmar container GTM `GTM-K7QVV6C8`.
- [ ] Confirmar GA4 `G-QF8MC5BX95` / propriedade registrada.
- [ ] Validar acesso ao GTM e GA4.
- [ ] Validar a propriedade do Search Console.
- [ ] Conferir se há tags antigas ou conversões conflitantes.

### Conexão técnica

- [x] Conexão operacional definida via Composio Google Ads, com OAuth gerenciado; o MCP local permanece como alternativa técnica de leitura.
- [x] Google Ads API já estava habilitada no projeto Google Cloud; no MCP atual, Developer Token não é obrigatório.
- [x] Composio CLI instalado e autenticado para `berocket@berocket.com.br`; toolkit `googleads` com conexão ativa.
- [x] Consulta de leitura validada: conta `713-024-7433` / `BE | Casa de Video`, moeda BRL, fuso `America/Sao_Paulo`, conta não gerenciadora e não é conta de teste.
- [x] Projeto Google Cloud localizado: `Casa de Vídeo - Marketing`.
- [x] ID do projeto registrado: `casa-de-video-marketing`.
- [x] Número do projeto registrado: `381808191681`.
- [x] Cliente OAuth localizado: `Portal Casa de Vídeo`.
- [x] Tipo do cliente OAuth confirmado: **Aplicativo da Web**.
- [x] Tela OAuth localizada: app externo em modo **Teste**.
- [x] Adicionar `berocket@berocket.com.br` como usuário de teste.
- [ ] Confirmar escopo Google Ads durante a autorização.
- [x] Google Cloud CLI instalado localmente no projeto.
- [x] ADC autenticado com `berocket@berocket.com.br` e validado sem exibir token.
- [x] Servidor MCP oficial testado localmente e respondendo ao protocolo em modo somente leitura.
- [x] Configuração do Codex corrigida para executar o MCP via `uv run` com Python 3.12 e dependência compatível.
- [ ] Manter a primeira etapa em modo somente leitura.
- [ ] Nunca enviar credenciais, tokens ou refresh tokens no chat ou em arquivos públicos.
- [ ] Armazenar segredos somente no ambiente privado da integração.

## Fase 2 — conversões e canais comerciais

- [ ] Confirmar URL oficial do WhatsApp.
- [ ] Confirmar e-mail comercial definitivo.
- [ ] Implementar evento `whatsapp_click`.
- [ ] Implementar evento `email_click`.
- [ ] Confirmar se os eventos chegam ao GA4.
- [ ] Criar/importar ações de conversão no Google Ads.
- [ ] Definir como a equipe registrará contatos recebidos.
- [ ] Separar clique, contato, lead qualificado, proposta e venda.
- [ ] Reavaliar GCLID somente se houver local seguro para armazená-lo.

## Fase 3 — site, oferta e ativos

- [ ] Confirmar URLs reais de portfólio, contato e serviços.
- [ ] Confirmar página ou seção sobre vídeos com IA.
- [ ] Confirmar cases e exemplos autorizados.
- [ ] Confirmar o link real da pasta do Drive — o link da anamnese contém “exemplo”.
- [ ] Organizar showreel, vídeos com IA, filmes publicitários, corporativos, treinamento, motion e logos.
- [ ] Confirmar direitos de uso dos vídeos, imagens, logos e nomes de clientes.
- [ ] Validar experiência mobile e velocidade das páginas de destino.

## Fase 4 — configuração das primeiras campanhas

- [ ] Criar Search Marca.
- [ ] Criar Search Serviços.
- [ ] Criar grupos STAG por intenção.
- [ ] Inserir palavras exatas e de frase.
- [ ] Inserir termos negativos gerais e específicos de IA.
- [ ] Criar RSAs e extensões.
- [ ] Definir capitais prioritárias.
- [ ] Configurar orçamento diário aproximado de R$ 6 para marca e R$ 34 para serviços.
- [ ] Fazer revisão final de limites, URLs e promessas.

## Fase 5 — aprovação e lançamento

### Diagnóstico ao vivo validado via Composio — 22/10/2026

- Conta confirmada: `713-024-7433` — **BE | Casa de Video**.
- Existe uma única campanha: `Off - Apenas para Iniciar`, tipo Performance Max, status `PAUSED`, veiculação `SUSPENDED`.
- Não existem grupos de anúncios nem anúncios retornados na conta.
- Orçamento associado à campanha: **R$ 26,78/dia** (`26.780.000` micros), abaixo do planejamento de aproximadamente R$ 40/dia.
- Últimos 30 dias: **0 impressões, 0 cliques, R$ 0,00 de custo e 0 conversões**.
- Ações de conversão encontradas: visualização de página ativa; ações de YouTube ativas; ações de lead/compra importadas do GA4 estão ocultas (`HIDDEN`) e precisam de validação antes de serem usadas como objetivo principal.
- Conclusão operacional: a conta está praticamente sem operação ativa. A implantação de Search Marca + Serviços continua recomendada, mas deve começar com revisão das conversões e definição do orçamento diário aprovado.
- Bloqueio para criação via Composio: o toolkit conectado não expõe uma ferramenta de criação de `campaign_budget`. O único orçamento existente (`Off - Apenas para Iniciar`, R$ 26,78/dia) é exclusivo (`explicitly_shared = false`) e está vinculado à campanha antiga; ele não será reutilizado nem alterado.
- Próximo passo técnico: criar os novos orçamentos na interface do Google Ads ou disponibilizar uma conexão/API de escrita que exponha `campaignBudgets:mutate`; depois disso, a estrutura pausada poderá ser criada em lote.

### Estrutura criada como rascunho pausado — 22/10/2026

- Orçamento compartilhado: `customers/7130247433/campaignBudgets/15968210631` — R$ 40,00/dia.
- Campanha Marca: `Search | Marca | Casa de Vídeo | Rascunho` — ID `24384388766`.
- Campanha Serviços: `Search | Serviços | Vídeo e IA | Rascunho` — ID `24384388769`.
- Grupos criados: Marca, Produção de Vídeos e Vídeos com IA — todos pausados.
- Foram incluídas 10 palavras-chave iniciais em correspondência de frase.
- Foram criados 3 anúncios responsivos, um por grupo, todos pausados.
- URL provisória dos anúncios: `https://casadevideo.com.br`; deve ser revisada antes da aprovação.
- Orçamento Marca separado: `customers/7130247433/campaignBudgets/15968210631`.
- Orçamento Serviços separado: `customers/7130247433/campaignBudgets/15968255748`.
- Anúncios responsivos ampliados para 12 títulos e 4 descrições por grupo; anúncios iniciais removidos para evitar duplicidade.
- Termos negativos adicionados aos grupos: gratuitos, cursos, tutoriais, vagas, empregos, faculdade, software, aplicativos, downloads e similares.
- Segmentação geográfica ainda precisa ser configurada para as capitais aprovadas; a conexão Composio disponível não expõe, nesta sessão, uma ferramenta de mutação de localização de campanha.
- Mensuração GTM ainda pendente: não há conexão Composio ativa para Google Tag Manager. O plano é medir clique no WhatsApp como conversão principal inicial, clique no e-mail como conversão secundária e contato confirmado como conversão qualificada/offline.

- [ ] Apresentar estrutura ao cliente.
- [ ] Registrar aprovação de verba, textos, regiões e conversões.
- [ ] Publicar somente após aprovação explícita.
- [ ] Confirmar status real na conta.
- [ ] Fazer teste de clique e conversão.
- [ ] Registrar data e horário de início.

## Fase 5A — criação controlada em rascunho/pausado

- [ ] Disponibilizar cliente de escrita da Google Ads API em ambiente privado.
- [x] Composio oferece ferramentas de leitura e mutação, mas nenhuma mutação será executada sem aprovação humana explícita no momento da operação.
- [x] Gate atual: leitura habilitada; criação/alteração/publicação permanece bloqueada.
- [ ] Implementar modo `dry-run` obrigatório antes da escrita.
- [ ] Criar campanhas novas sempre com status `PAUSED`.
- [ ] Criar grupos, palavras-chave, anúncios e extensões pausados quando a plataforma permitir.
- [ ] Exibir ao responsável o payload e a lista de recursos antes da execução.
- [ ] Registrar aprovação humana para a criação pausada.
- [ ] Executar a escrita somente após aprovação.
- [ ] Consultar os recursos criados e registrar IDs, status e erros.
- [ ] Nunca promover ou ativar a campanha automaticamente.

## Fase 6 — primeiro mês de otimização

- Revisar termos de pesquisa semanalmente.
- Atualizar negativos.
- Conferir cliques em WhatsApp e e-mail.
- Conferir contatos efetivamente recebidos.
- Comparar desempenho por serviço e capital.
- Não alterar orçamento de forma relevante sem aprovação.
- Preparar relatório de 7, 14 e 30 dias.

## Fase 7 — expansão

Só avaliar concorrentes ou Performance Max depois de validar conversões, qualidade dos contatos, ativos e capacidade comercial.

## Portão de segurança

As conexões iniciais podem ser feitas para leitura e diagnóstico. Criação de campanhas, alteração de orçamento, publicação de anúncios, mudança de lances ou ativação de conversões são ações de escrita e exigem aprovação humana imediatamente antes da execução.
