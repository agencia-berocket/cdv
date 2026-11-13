# Implementação da API de Escrita — Campanhas em Rascunho

## Objetivo

Permitir que o Agente Google Ads transforme uma estrutura aprovada em recursos reais dentro da conta `713-024-7433`, mantendo campanhas e anúncios pausados para revisão humana.

## Separação de responsabilidades

### MCP Google Ads

Usado para leitura: contas acessíveis, campanhas, métricas, termos, conversões e status.

### Cliente de escrita Google Ads API

Usado somente após aprovação para criar:

- orçamento;
- campanha Search;
- grupos de anúncios;
- palavras-chave;
- anúncios responsivos;
- extensões e recursos compatíveis.

## Fluxo obrigatório

```text
Blueprint do cliente
        ↓
Validação de limites, URLs, orçamento e políticas
        ↓
Dry-run com payload completo
        ↓
Aprovação humana explícita
        ↓
Mutate API com status PAUSED
        ↓
Consulta de confirmação
        ↓
Relatório com IDs e erros
```

## Regras de segurança

- O padrão é `dry-run`; o agente não escreve por iniciativa própria.
- Nenhuma campanha pode ser criada como `ENABLED`.
- Nenhuma campanha pausada pode ser ativada pelo agente sem uma aprovação separada.
- O orçamento deve ser validado contra o teto de R$ 1.200 mensais.
- O crédito promocional não pode ser usado para justificar orçamento recorrente maior.
- Client Secret, refresh token e ADC ficam fora do repositório e do chat.
- Toda execução deve registrar hora, usuário aprovador, payload resumido, IDs criados e erros.

## O que ainda falta para habilitar a escrita

- Confirmar a biblioteca/cliente de escrita compatível com o acesso atual do projeto Google Cloud.
- Implementar o adaptador de autenticação sem expor o ADC.
- Implementar `dry-run` e validações de payload.
- Implementar operações de criação com `PAUSED`.
- Testar em ambiente seguro antes de usar a conta real.
- Fazer uma criação controlada com a campanha de marca, após aprovação.

## Primeiro pacote de criação

O primeiro pacote deverá conter somente:

1. campanha Search de marca;
2. campanha Search de serviços;
3. grupos STAG aprovados;
4. palavras exatas e de frase;
5. anúncios responsivos aprovados;
6. orçamento diário total de aproximadamente R$ 40;
7. status `PAUSED`.

Concorrentes e Performance Max não entram neste primeiro pacote.

