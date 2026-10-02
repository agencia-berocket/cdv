# Plano de implantação — Casa de Vídeo

Atualizado em 02/10/2026. Escopo: Hub, SEO, GEO e Google Ads. O login e a senha existentes foram preservados por decisão do responsável.

## 1. Resultado esperado

Um único portal, com dados das fontes oficiais, atualização automática, filtros reais e indicação da última coleta válida. Falha de API não pode virar zero nem simulação. Metas, planejamento e estimativas ficam fora dos resultados medidos.

A origem editável é `Clientes/Casa de Vídeo/Mkt`. `public/mkt`, `mkt` e `dist/mkt` são saídas geradas. Não editar essas cópias nem publicar pelo checkout antigo `scratch/cdv-repo`.

## 2. Etapas e critérios de aceite

| Etapa | Entrega | Situação |
|---|---|---|
| 1. Credenciais | Retirar chave das pastas públicas, excluir segredos do build/Docker | Implementado localmente; verificar eventual exposição anterior em produção e substituir a chave se necessário |
| 2. Coleta | GA4, realtime, Search Console, Google Ads, CrUX, rodadas GEO | Implementado; disponibilidade real depende dos acessos descritos abaixo |
| 3. Dados | Cache por fonte/período, datas, última leitura válida e histórico privado | Implementado |
| 4. Interface | Quatro páginas compartilhando dados e estados, períodos reais e navegação consistente | Implementado |
| 5. Operação | Anamnese original, rascunho local e download em Markdown | Implementado; compartilhar o Markdown não publica campanhas |
| 6. Conteúdo | Retirar varejo, scores sem provas e dados institucionais presumidos | Implementado nos entregáveis ativos; documentos históricos não comprovam situação atual |
| 7. Validação | Testes de falhas, datas, precisão, persistência, navegador e build | Executar os comandos abaixo e registrar resultados |
| 8. Produção | Configurar variáveis, volume persistente, publicar e validar endpoints | Pendente de implantação no Coolify |

## 3. Funcionamento da atualização

- Navegador consulta `/api/cdv/metrics` a cada 60 segundos quando a aba está visível. Retomar a aba dispara nova consulta.
- Servidor mantém coleta automática dos últimos sete dias, mesmo sem navegador aberto. Outros períodos são consultados e atualizados enquanto estiverem sendo visualizados.
- GA4 histórico: cache de 5 minutos. Consulta de totais separada das linhas diárias para não somar usuários repetidos.
- GA4 realtime: cache de 1 minuto, janela de 30 minutos, independente do período histórico escolhido.
- Search Console: cache de 1 hora, dados finalizados pelo Google. A tabela mostra as principais consultas retornadas, não um inventário completo de todas as pesquisas.
- Google Ads: cache de 15 minutos via API própria. Conversões fracionárias são preservadas. Não se presume que toda conversão seja lead qualificado ou receita.
- CrUX: consulta diária, campo mobile, percentil 75. Pode não existir amostra para a origem; nesse caso aparece indisponível.
- GEO: revalida o arquivo de rodadas a cada minuto. A medição ocorre na data da rodada, não a cada minuto. Não simula respostas de plataformas sem credenciais.
- Filtros aceitam até 366 dias, sem data futura. GA4/Ads seguem os fusos das respectivas propriedades; estes são mostrados nas telas.
- Fontes independentes: a ausência de Ads não impede dados do GA4.
- Falhas preservam somente o cache do mesmo período e mostram estado desatualizado. Nunca se reaproveita o resultado de outro filtro.
- Cache fica em `CDV_DATA_DIR/snapshot.json`; histórico em arquivos diários `history-AAAA-MM-DD.jsonl`. Estes arquivos não são públicos e devem receber backup e política de retenção no volume do servidor.

## 4. Credenciais e configuração

Não colar chaves em HTML, JSON público, Git ou chat. Configurar no ambiente do servidor. Para uso local, criar `.env.local` na raiz, ignorado pelo Git.

### GA4 — credencial existente

Uma cópia da credencial foi preservada em `.private/cdv/google-service-account.json`, com permissão de leitura restrita. A consulta real já confirmou acesso à propriedade `555545561`. A chave não entra no Docker: em produção é necessário montá-la como segredo ou configurar o JSON em variável privada.

```dotenv
CDV_GA4_PROPERTY_ID=555545561
CDV_GOOGLE_CREDENTIALS=/run/secrets/cdv-google-service-account.json
# Alternativa: CDV_GOOGLE_SERVICE_ACCOUNT_JSON com o JSON completo, somente no servidor.
```

A conta de serviço precisa de acesso de leitura à propriedade e a Google Analytics Data API precisa estar habilitada no projeto Google Cloud. O identificador `G-QF8MC5BX95` é a tag de medição; não substitui o ID numérico da API.

### Search Console

Diagnóstico real em 02/10/2026: HTTP 403 com motivo `SERVICE_DISABLED`. Primeiro habilitar a Search Console API no projeto da conta de serviço; depois validar o acesso à propriedade.

1. No Search Console, abrir a propriedade exata do site.
2. Em usuários e permissões, conceder acesso à conta de serviço existente (o endereço `client_email` está no arquivo privado).
3. Habilitar Search Console API no projeto Google Cloud se ainda estiver desativada.
4. Opcionalmente definir `CDV_GSC_SITE_URL=sc-domain:casadevideo.com.br`. Para propriedade por prefixo, usar a URL completa exata, com protocolo e barra final.
5. Sem variável, o serviço procura propriedades Casa de Vídeo às quais a conta de serviço já tenha acesso. Não seleciona propriedades de outros clientes.
6. Executar `npm run cdv:check` e confirmar a primeira coleta válida.

### Google Ads — acesso ainda necessário

O código não cria campanhas nem altera orçamento. A integração é somente de leitura.

```dotenv
CDV_ADS_CUSTOMER_ID=1234567890
CDV_ADS_DEVELOPER_TOKEN=preencher_no_servidor
CDV_ADS_CLIENT_ID=preencher_no_servidor
CDV_ADS_CLIENT_SECRET=preencher_no_servidor
CDV_ADS_REFRESH_TOKEN=preencher_no_servidor
# Se houver conta administradora/MCC:
CDV_ADS_LOGIN_CUSTOMER_ID=1234567890
CDV_ADS_API_VERSION=v23
```

1. Obter o Customer ID da conta de anúncios (dez dígitos; a tag `AW-...` não serve).
2. Obter developer token com acesso compatível com a conta real pelo API Center da conta administradora.
3. Configurar um cliente OAuth no projeto Google Cloud e autorizar um usuário com acesso à conta, com escopo `https://www.googleapis.com/auth/adwords` e acesso offline.
4. Armazenar client ID, client secret e refresh token no ambiente privado do servidor. Não expor esses valores ao navegador.
5. Confirmar a conta administradora usada no cabeçalho, se aplicável.
6. Executar o diagnóstico e comparar investimento, cliques e conversões de um período fechado com a interface do Google Ads, usando o mesmo fuso.
7. Validar ações de conversão, valores e eventos do formulário antes de interpretar custo por conversão como CPL ou valor de conversão como receita.

### Core Web Vitals de campo

Habilitar Chrome UX Report API e definir `CDV_CRUX_API_KEY` no servidor. Uma chave válida não garante amostra suficiente. Não substituir ausência de dados por estimativas.

### GEO — evidências antes de indicadores

Os scores antigos 84/75 e a citabilidade de 75% foram retirados porque o JSON não continha os testes comprobatórios. Relatórios HTML antigos continuam acessíveis pelos links originais, identificados como documentos históricos sem comprovação dos indicadores atuais.

Para uma nova rodada, registrar as respostas efetivamente obtidas nas plataformas. Formato mínimo:

```json
{
  "id": "rodada-unica",
  "measuredAt": "2026-10-02T12:00:00Z",
  "methodology": "Descrever conjunto de prompts, contexto, critérios de citação e limitações",
  "prompts": [
    {
      "id": "prompt-01",
      "provider": "nome-da-plataforma",
      "model": "modelo-ou-versao-utilizada",
      "prompt": "Pergunta realmente enviada",
      "response": "Resposta efetivamente recebida",
      "evidence": "Referência do registro ou arquivo comprobatório",
      "cited": false
    }
  ]
}
```

O exemplo acima é apenas formato: substituir pelo registro real antes de importar. `cited` deve refletir a resposta, não a meta. Score é opcional; exige `pillars` com `points`, `max`, `evidence` e `methodology`. A citabilidade é calculada das respostas, nunca aceita como percentual digitado.

```sh
node scripts/cdv-import-geo.cjs /caminho/rodada-real.json
```

Em produção, definir `CDV_GEO_ROUNDS_FILE=/app/.runtime/cdv/rodadas_verificadas.json` em volume persistente e importar ali. Para automatizar a execução das rodadas nas plataformas, ainda serão necessários os acessos dos provedores e a definição de prompts, frequência e orçamento. Consultar uma API de modelo não comprova, por si só, a experiência de busca do produto ChatGPT/Gemini/Claude/Perplexity; a metodologia deve descrever o ambiente efetivamente testado.

## 5. Execução local e testes

```sh
npm run cdv:dev
# http://localhost:3100/mkt/

npm run cdv:check
npm run test:cdv
npm run test:cdv:browser
npm run build
```

Para trabalhar também na aplicação React, manter `cdv:dev` na porta 3100 e `npm run dev` na porta 3000. Vite encaminha `/api/cdv` ao serviço local. Abrir o HTML via `file://` ou um servidor apenas estático não executa a coleta.

## 6. Implantação em produção

1. Revisar alterações e resultados dos testes. Confirmar a aplicação e os domínios de destino no Coolify.
2. Configurar credenciais exclusivamente como variáveis privadas ou segredo montado. O JSON privado local não será enviado pelo Git nem pelo build.
3. Configurar `CDV_DATA_DIR=/app/.runtime/cdv` e montar volume persistente nessa pasta. Definir também `CDV_GEO_ROUNDS_FILE` se houver rodadas.
4. Publicar o projeto completo com o Dockerfile Node existente e `npm start`; hospedagem somente estática não atende esta arquitetura.
5. O build gera uma lista explícita de arquivos públicos, sem scripts Python, dados de coleta legados ou chaves; inclui apenas os documentos explicitamente autorizados na lista do build.
6. Nos hosts `cdv.berocket.com.br` e `dashboard.berocket.com.br`, o servidor abre o portal na raiz. Em outros hosts, ele fica em `/mkt/`, preservando o site da agência.
7. Validar que caminhos antigos de credenciais e scripts retornem 404. Verificar a eventual exposição anterior da chave e rotacioná-la quando necessário.
8. Abrir Hub, SEO, GEO e Ads. Confirmar fonte/data/estado e comparar um período com a plataforma original.
9. Simular uma falha de API em ambiente de teste: mostrar última coleta válida, sem zerar resultados.
10. Reiniciar o serviço e verificar preservação do cache. Validar volume, backup e retenção antes de considerar a operação concluída.

Não foi feito deploy automaticamente apenas por concluir o código local. A ativação de cada fonte depende da configuração acima.

## 7. Referências oficiais

- [GA4 — relatórios](https://developers.google.com/analytics/devguides/reporting/data/v1/basics)
- [GA4 — métricas e dimensões](https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema)
- [GA4 — realtime](https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runRealtimeReport)
- [Search Console — consulta e limites](https://developers.google.com/webmaster-tools/v1/searchanalytics/query)
- [Google Ads — versões](https://developers.google.com/google-ads/api/docs/release-notes)

## 8. Validação realizada em 02/10/2026

- GA4 real, período 26/09 a 02/10/2026: 23 usuários ativos e 39 sessões no momento da consulta.
- GA4 realtime: 0 usuários ativos nos últimos 30 minutos no momento da consulta. Estes números são um registro da validação, não valores fixos do portal.
- Search Console: API desabilitada no projeto (`SERVICE_DISABLED`, HTTP 403).
- Google Ads e CrUX: aguardam configuração das credenciais próprias.
- GEO: nenhuma rodada comprovada importada; nenhum score apresentado como medido.
- 11 testes automatizados de dados passaram.
- Teste Chrome nas quatro páginas em desktop e mobile passou: sem erros JS, filtros efetivos, Anamnese com rascunho persistente, download Markdown e endpoints privados bloqueados.
- Build de produção, TypeScript (`npm run lint`) e verificação do diff passaram.
- Login e controle de sessão originais preservados.
- Publicação e validação do volume persistente em produção ainda não executadas.

## 9. Preservação da experiência original

Após esclarecimento de escopo, o layout original das quatro páginas foi restaurado. As classes, estilos, identidade visual, abas, cartões, tooltips, guias, simulador e modal de campanhas foram preservados. A seção Anamnese conserva integralmente seu HTML original: 28 campos, textos, ordem, botões e exportação Markdown.

A integração acontece no adaptador `js/portal.js`, que preenche os componentes existentes com a API. Números não comprovados são substituídos por indisponibilidade; isso não exige reorganizar as telas. Não usar o redesign anterior como referência para próximas alterações.

O salvamento automático mantém os valores no navegador e recupera os rascunhos já existentes. A exportação original em Markdown permanece o fluxo de compartilhamento. Login e senha continuam inalterados.

Validação da restauração: 13 testes automatizados passaram, incluindo comparação dos estilos originais e da seção integral da Anamnese. O teste Chrome confirmou as quatro páginas em desktop/mobile, as abas, a prévia de campanha, o download Markdown, a persistência dos campos e os filtros reais. Build e TypeScript também passaram.


## Search Console conectado localmente — 02/10/2026

- Projeto: `casa-de-video-marketing`.
- Conta: `cdv-portal@casa-de-video-marketing.iam.gserviceaccount.com`, com acesso restrito à propriedade `https://casadevideo.com.br/`.
- Credencial exclusiva via `CDV_GSC_CREDENTIALS` (ou `CDV_GSC_SERVICE_ACCOUNT_JSON`); GA4 mantém sua conta anterior. Chave em `.private/cdv/gsc-service-account.json`, ignorada pelo Git e pelo Docker, com permissão 600.
- Configuração local em `.env.local`: propriedade exata e caminho privado.
- Consulta real de 03/09 a 02/10/2026: 10 cliques, 177 impressões; última data retornada: 29/09/2026. GA4 validado no mesmo período: 28 usuários ativos e 47 sessões.
- 12 testes do conector passaram, incluindo isolamento das identidades GSC/GA4.
- Esta conexão ainda não foi publicada. Em produção, fornecer a credencial privada e as variáveis GSC no servidor; não incluir a chave no build. Layout e Anamnese não foram alterados nesta etapa.
