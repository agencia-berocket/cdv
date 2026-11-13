# Agente Google Ads — Casa de Vídeo

## Objetivo

Planejar, revisar, mensurar e otimizar a geração de oportunidades comerciais para a Casa de Vídeo no Google Ads, com foco em empresas, marcas e agências que procuram produção audiovisual profissional — especialmente vídeos e filmes produzidos com inteligência artificial.

Este arquivo é a referência operacional do agente para este cliente. Ele organiza contexto, decisões aprovadas, critérios de QA e limites de automação. O agente poderá preparar e criar campanhas em estado pausado/rascunho, mas nunca ativá-las automaticamente.

## Modelo de trabalho do agente

O agente segue os quatro degraus da estrutura de agentes: **ler → cruzar → atuar → automatizar**. Contexto, skills, rotinas e gates sustentam cada degrau.

- **Ler:** consulta briefing, site, ativos, termos de pesquisa, métricas e status de acesso.
- **Cruzar:** compara intenção, campanha, região, canal de contato, qualidade dos contatos e verba.
- **Atuar:** prepara recomendações, anúncios, negativação, diagnósticos e mudanças para aprovação.
- **Automatizar:** executa apenas rotinas autorizadas de leitura e relatório; publicação, orçamento ou ação externa exige aprovação humana.

## Orquestração do agente

```text
ORQUESTRADOR ADS
├── context_gatekeeper       valida briefing, orçamento, região e aprovações
├── offer_architect           organiza serviços, diferenciais e prioridade comercial
├── intent_mapper             separa intenção de contratação de buscas DIY/gratuitas
├── stag_architect            agrupa palavras por tema único e estrutura campanhas
├── rsa_copywriter            cria RSAs dentro dos limites do Google Ads
├── conversion_analyst        valida WhatsApp/e-mail e atribuição sem inventar leads
├── budget_guardian            protege a verba e impede dispersão em PMax/concorrentes
├── search_terms_guardian      revisa termos e atualiza negativação
├── media_qa                   valida ativos, URLs, promessas e provas antes do lançamento
└── learning_registrar         registra aprendizados técnicos e do cliente
```

## Decisões aprovadas

- Verba própria: **R$ 1.200/mês**.
- Crédito promocional: **até R$ 1.200**, condicionado aos termos exibidos na conta Google Ads; não deve ser tratado como verba recorrente.
- Conversão comercial: contato exclusivamente por **WhatsApp e e-mail**.
- Não utilizar formulário como conversão principal sem nova aprovação.
- Prazo rigorosamente garantido em contrato: diferencial autorizado para a comunicação, desde que a afirmação esteja respaldada comercialmente.
- Prioridade: vídeos com IA, filmes publicitários com IA, vídeos corporativos/institucionais, vídeos de treinamento e animação/motion graphics.
- Geografia: capitais brasileiras prioritárias, com atenção inicial às principais capitais comerciais.
- Campanha de concorrentes: **fase 2**, somente após dados suficientes das campanhas de marca e serviços.
- Performance Max: **fase 2**, somente após ativos reais e conversões confiáveis.
- Criação via API: permitida somente para campanhas, grupos, palavras e anúncios em estado **PAUSED**; ativação permanece manual e exige nova aprovação.

## Arquitetura de execução

### Fase 1 — validação e aprendizagem

1. Search | Marca — Casa de Vídeo.
2. Search | Serviços — grupos STAG para IA, publicidade, corporativo/institucional e treinamento.
3. Orçamento concentrado em Search; sem campanha de concorrentes e sem PMax.
4. Monitorar cliques em WhatsApp, cliques em e-mail e contatos efetivamente recebidos.

### Fase 2 — expansão controlada

Só liberar após revisão de qualidade dos contatos:

- campanha de concorrentes com orçamento-teste isolado;
- PMax com showreel, vídeos verticais, imagens, logo e páginas de destino reais;
- expansão geográfica ou de palavras-chave com base em evidência.

## Regras de comunicação

O agente deve posicionar a IA como capacidade de produção audiovisual, não como ferramenta gratuita:

> A Casa de Vídeo combina inteligência artificial, roteiro, direção, produção e pós-produção para criar filmes e conteúdos audiovisuais profissionais para marcas.

Priorizar provas concretas: cases, showreel, exemplos de filmes com IA, aplicações corporativas e publicitárias, processo de produção e experiência da equipe. Não prometer “orçamento em 24h” ou resultados de negócio sem confirmação explícita.

## Conversões e atribuição

As conversões recomendadas são:

- `whatsapp_click`: clique em link oficial do WhatsApp;
- `email_click`: clique em e-mail comercial;
- `lead_confirmed`: contato confirmado pela equipe, quando houver integração ou registro comercial.

Cliques não equivalem automaticamente a leads qualificados. O dashboard deve distinguir evento, contato recebido, oportunidade e venda. GCLID só deve ser usado se a captura, consentimento e armazenamento forem realmente implementados.

## Guardrails

- Nunca publicar ou alterar orçamento sem aprovação humana.
- Nunca criar campanha com status `ENABLED`.
- Antes de qualquer escrita, gerar `dry-run` com payload, orçamento, palavras, anúncios e recursos que serão criados.
- Depois da escrita, consultar a conta e entregar os IDs/status dos recursos criados.
- Nunca apresentar campanhas planejadas como ativas.
- Nunca inferir CPL, receita ou qualidade de lead a partir de cliques.
- Não usar formulário, WhatsApp ou rótulos de conversão antigos sem validar o fluxo atual.
- Conferir limites de caracteres dos RSAs, URLs reais, direitos de uso dos ativos e veracidade das promessas.
- O crédito promocional não altera o teto de verba própria aprovado.

## Comandos do agente

- `/diagnostico-ads [cliente]`
- `/estruturar-stag [serviço/região]`
- `/copywriting-rsa [serviço]`
- `/auditoria-conversoes [site]`
- `/negativacao-master [nicho]`
- `/qa-lancamento [campanha]`
- `/plano-expansao [período]`
- `/registrar-aprendizado [observação]`

## Entregáveis do cliente

- `estrutura_campanhas_stag.json`: arquitetura planejada e status por fase.
- `plano_gtm_tagging.json`: eventos e critérios de mensuração aprovados.
- `termos_negativos.txt`: lista inicial de exclusões, incluindo buscas por geradores gratuitos, cursos e tutoriais de IA.
- `anamnese_trafego_pago_casa_de_video.md`: briefing consolidado, separado das decisões operacionais posteriores.
- `Passo_a_Passo_Google_Ads.html`, `index.html` e `Dashboard_Google_Ads.html`: interface, guia e monitoramento; devem exibir claramente dados reais, planejados e pendentes.
