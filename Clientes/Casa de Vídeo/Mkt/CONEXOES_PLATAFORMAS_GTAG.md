# Plataformas e identificadores — Casa de Vídeo

Identificadores encontrados no projeto não comprovam uma conexão ativa.

| Uso | Identificador registrado | Validação |
|---|---|---|
| GA4 Data API | `555545561` | Confirmar autorização com uma coleta válida |
| Tag GA4 do site | `G-QF8MC5BX95` | Validar no site; não é o ID numérico da API |
| Container GTM | `GTM-K7QVV6C8` | Validar no Tag Assistant |
| Tag de conversão Ads | `AW-18470288256` | Não substitui Customer ID da conta Ads |
| Google Ads API | Pendente | Customer ID, developer token e OAuth |
| Search Console | Pendente | Propriedade exata e acesso da conta de serviço |

O portal consulta a API do servidor. GA4 e Search Console usam conta de serviço; Google Ads usa OAuth e developer token. A instalação de GTM não cria acesso às APIs.

Conversões devem representar eventos confirmados. Não reutilizar rótulos antigos sem validação na plataforma. O escopo preferido do cliente é formulário no site; WhatsApp não deve ser ativado automaticamente.

Consulte `PLANO_IMPLANTACAO_DADOS_REAIS.md` para configuração e testes.
