# 🧠 Conhecimento Técnico & Diretrizes Operacionais — Agente SEO

Este documento centraliza as regras técnicas, padrões semânticos, diretrizes de performance web, estruturas de dados em grafo e estratégias de SEO acumuladas pelo **Agente SEO**. **Atualizado continuamente.**

---

## 🏛️ MÓDULO 1: ON-PAGE SEO, REDAÇÃO ANSWER-FIRST & ARQUITETURA DE CONTEÚDO

### 1.1 Hierarquia e Otimização de Tags HTML
* **Título (Title Tag)**:
  * Comprimento: **50 a 60 caracteres** (máximo 65).
  * Posicionar a palavra-chave principal na primeira metade da frase e incluir um diferencial claro ou nome da marca.
  * *Estrutura Ideal*: `[Palavra-Chave Principal] | [Diferencial ou Serviço] — [Marca]`
* **Meta Description**:
  * Comprimento: **150 a 160 caracteres**.
  * Escrever com promessa clara e chamada para ação (CTA) persuasiva para maximizar a taxa de cliques (CTR) na SERP.
* **URLs Amigáveis**:
  * Curtas, descritivas, totalmente em minúsculas, separadas por hífens e com a palavra-chave principal. Sem caracteres especiais ou parâmetros numéricos aleatórios.
* **Estrutura de Headings**:
  * Utilizar exatamente **um único H1 por página**, contendo a palavra-chave principal e a intenção primária da página.
  * Organizar os blocos de conteúdo em **H2** (subtópicos e intenções secundárias) e **H3** (desdobramentos dos H2s) sem pular níveis na hierarquia semântica.
  * Nunca utilizar tags de heading apenas para formatação visual (usar CSS para estilo).
* **Redação Answer-First (Para Posição Zero / Featured Snippets)**:
  * Abrir cada seção principal com uma resposta direta e objetiva de **40 a 60 palavras** posicionada imediatamente abaixo do H2.
  * Essa estrutura maximiza a conquista de *Featured Snippets* no Google e citações diretas em mecanismos de IA.

### 1.2 Arquitetura de Silo e Topic Clusters
* **Modelo de Topic Cluster**:
  * Estruturar o site em torno de uma **Página Pilar (Pillar Page)** ampla que aborda o tópico central de forma exaustiva.
* **Artigos-Satélite (Cluster Content)**:
  * Criar conteúdos aprofundados para palavras-chave de cauda longa (*long-tail*) focadas em intenções de busca específicas do segmento.
* **Links Internos Contextuais**:
  * Incluir pelo menos **3 links internos contextuais** por artigo utilizando textos-âncora descritivos baseados em palavras-chave.
  * Todo artigo-satélite deve linkar de volta para a página pilar do cluster logo na introdução, e a página pilar deve distribuir autoridade para os conteúdos aprofundados.
  * Evitar âncoras genéricas como "clique aqui" ou "saiba mais".
  * Garantir que não existam **páginas órfãs** (páginas sem nenhum link interno apontando para elas).

---

## ⚙️ MÓDULO 2: SEO TÉCNICO, PERFORMANCE & RASTREABILIDADE

### 2.1 Rastreamento, Indexação e Códigos de Status
* **Status HTTP**:
  * `200 OK`: Resposta limpa para páginas ativas.
  * `301 Permanent Redirect`: Redirecionamento definitivo (evitar cadeias como `A -> B -> C`).
  * `404 Not Found` / `410 Gone`: Para páginas intencionalmente removidas.
  * `503 Service Unavailable`: Durante manutenções temporárias.
* **Arquivo `robots.txt`**:
  * Configurar na raiz do domínio para gerenciar o orçamento de rastreamento (*crawl budget*) sem bloquear arquivos CSS, JS ou recursos cruciais de renderização.
  * Declarar explicitamente a URL do `sitemap.xml`.
  * *Atenção*: O `robots.txt` impede o rastreamento, mas não a indexação. Para impedir a indexação, aplicar a tag `<meta name="robots" content="noindex">` no HTML.
* **Sitemap XML**:
  * Manter o sitemap limpo, contendo apenas URLs canônicas com status `200 OK`. Excluir páginas com `noindex`, telas de busca interna e páginas administrativas.
  * Submeter o sitemap no **Google Search Console** e **Bing Webmaster Tools**.
* **URLs Canônicas (Tags `canonical`)**:
  * Aplicar tags `<link rel="canonical" href="URL_PREFERENCIAL">` em todas as páginas para evitar canibalização e duplicidade de conteúdo.

### 2.2 Core Web Vitals & Otimização de Mídia
* **Limites Oficiais das Core Web Vitals**:
  * **LCP (Largest Contentful Paint)**: Carregamento do maior elemento visível em até **2,5 segundos**.
  * **INP (Interaction to Next Paint)**: Responsividade a cliques e interações abaixo de **200 milissegundos**.
  * **CLS (Cumulative Layout Shift)**: Estabilidade visual durante o carregamento com índice abaixo de **0,1**.
* **Otimização de Imagens**:
  * Converter imagens para formatos modernos (preferencialmente **WebP** ou **AVIF**) com tamanho máximo recomendado de **200 KB** por imagem.
  * Nomear arquivos de forma descritiva antes do upload (ex: `camera-cinema-4k-profissional.webp`) usando hífens.
  * Adicionar o atributo `alt` (texto alternativo) semântico e descritivo em todas as imagens.
  * Definir dimensões explícitas de largura e altura (`width` e `height`) no código e ativar carregamento tardio (*lazy loading*) em elementos fora da primeira dobra.

### 2.3 UX, Responsividade e Profundidade
* **Mobile-First Indexing**: Garantir que a versão mobile do site contenha exatamente os mesmos textos, dados estruturados e links internos da versão desktop.
* **Profundidade de Navegação**: Toda página estratégica deve ser acessível em no máximo **3 cliques a partir da página inicial (Home)**.

---

## 🏷️ MÓDULO 3: DADOS ESTRUTURADOS (SCHEMA.ORG JSON-LD EM GRAFO)

### 3.1 Implementação Semântica em Grafo (`@graph`)
* **Sintaxe Recomendada**: Inserir os dados estruturados no formato **JSON-LD** via bloco `<script type="application/ld+json">`.
* **Arquitetura Unificada (`@graph`)**: Unificar os metadados em um único grafo relacional para explicitar o contexto completo da entidade:
  * `@id: "https://site.com/#organization"` -> Define a `Organization` / `Corporation` (nome, logo, dados de contato, redes sociais via `sameAs`).
  * `@id: "https://site.com/#website"` -> Define o `WebSite` apontando `publisher` para a organização.
  * Entidades Complementares: `TechArticle` / `BlogPosting` para conteúdos, `FAQPage` para seções de perguntas e respostas, `BreadcrumbList` para a estrutura de navegação, `Product` para e-commerce e `LocalBusiness` para empresas físicas.
* **Fidelidade Visível**: Garantir que todos os dados declarados no JSON-LD estejam rigorosamente visíveis na interface do usuário. Validar no Schema Markup Validator e no Rich Results Test.

---

## 📜 MÓDULO 4: E-E-A-T, QUALIDADE DE CONTEÚDO & LINK BUILDING ÉTICO

### 4.1 Consolidação do E-E-A-T (Experiência, Especialização, Autoridade e Confiança)
* **Experiência e Especialização**: Incluir biografias detalhadas de autores em todos os artigos, ressaltando credenciais profissionais, anos de experiência e links para perfis verificáveis.
* **Confiança (Trust - Pilar Central)**:
  * Exibir páginas institucionais completas ("Quem Somos", "Contato"), Termos de Uso, Política de Privacidade e certificado de segurança **HTTPS**.
  * Exibir a data de "Última Atualização" no topo dos artigos e revisar conteúdos legados periodicamente.
* **Rigor YMYL (*Your Money or Your Life*)**: Aplicar checagem rigorosa de fatos e citação de fontes primárias/estudos verificáveis em conteúdos financeiros, de saúde, jurídicos e de segurança.

### 4.2 Link Building Ético & PR Digital (SEO Off-Page)
* **Qualidade vs. Quantidade**: Um único backlink dofollow de um portal de alta autoridade e relevância temática vale mais do que centenas de links irrelevantes.
* **Estratégias de Aquisição Ética**:
  * **Digital PR e Assessoria de Imprensa**: Desenvolver pesquisas, dados inéditos e pautas jornalísticas para atrair citações orgânicas na imprensa.
  * **Conteúdo Referencial (*Link Magnets*)**: Criar guias definitivos, calculadoras e estudos de caso cativeiros que outros portais citem naturalmente.
  * **Guest Posts Qualificados & Co-Marketing**: Estabelecer parcerias estratégicas para troca de artigos sem recorrer a redes manipulativas (PBNs) ou compra de links.
  * **Menções de Marca e Nofollow**: Monitorar menções de marca sem link e links nofollow, que atuam como sinais reais de reputação perante os algoritmos.

---

## 🏪 MÓDULO 5: SEO ESPECIALIZADO, AUDITORIA & FLUXOS DE TRABALHO

### 5.1 SEO para E-commerce
* **Estrutura de Categorias**: Hierarquia intuitiva: `Home > Categoria > Subcategoria > Produto`.
* **Páginas de Produto (PDP)**: Descrições originais (sem copiar do fabricante), especificações técnicas completas, imagens leves em WebP, avaliações de clientes e informações claras sobre frete e garantia.
* **Schema `Product` e Google Merchant Center**: Implementar marcação `Product` completa e manter o feed do Merchant Center 100% sincronizado.
* **Gestão de Filtros**: Aplicar `noindex` ou bloqueio de canonicals em combinações infinitas de filtros e parâmetros de ordenação para preservar o *crawl budget*.

### 5.2 SEO Local para PMEs
* **Google Business Profile (GBP)**:
  * Manter dados **NAP** (Nome, Endereço e Telefone) 100% idênticos no perfil do Google e no rodapé do site.
  * Preencher categorias corretas, horários de atendimento, fotos reais dos trabalhos e responder a 100% das avaliações recebidas.
* **Otimização On-Page Local**: Criar landing pages de serviços locais com palavras-chave geolocalizadas, casos de sucesso da região e dados estruturados `LocalBusiness`.

### 5.3 Checklist de Auditoria Técnica e Diagnóstico (em 4 Fases)
1. **Fase 1: Diagnóstico de Saúde e Rastreabilidade**: Verificar indexação via comando `site:domain.com`, relatórios do Google Search Console, arquivo `robots.txt` e `sitemap.xml`.
2. **Fase 2: Auditoria de Performance e Segurança**: Testar no PageSpeed Insights, validar Core Web Vitals (LCP, INP, CLS) e redirecionamentos HTTPS/SSL.
3. **Fase 3: Auditoria On-Page & Conteúdo**: Mapear meta tags ausentes/duplicadas, erros 404, imagens sem alt text e hierarquia de headings (H1-H3).
4. **Fase 4: Análise de Dados e Otimização Semântica**: Acompanhar tráfego orgânico, CTR e impressões no Search Console e GA4, priorizando a re-otimização de páginas posicionadas entre a 5ª e a 15ª posição.
