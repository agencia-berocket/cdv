# 🛠️ GUIA DE IMPLEMENTAÇÃO TÉCNICA (TI / DEV) — CASA DE VÍDEO

> **Destinatário:** Equipe de TI / Desenvolvimento Web da Casa de Vídeo  
> **Emitido por:** b.rocket GEO & Performance  
> **Objetivo:** Instruções prontas para aplicação direta no site oficial (`https://casadevideo.com.br`)  

---

## 📌 TAREFA 1: Upload do Arquivo `llms.txt`

Faça o upload do arquivo para o diretório raiz do seu servidor web (ex: `public_html/` ou `www/`), garantindo acesso público via HTTP GET.

* **URL de Destino:** `https://casadevideo.com.br/llms.txt`
* **Conteúdo do Arquivo:** [llms.txt](file:///Users/guilhermerossi/Documents/b.rocket/Clientes/Casa%20de%20V%C3%ADdeo/Mkt/GEO/llms.txt)

```text
# Casa de Vídeo Produções Audiovisuais Ltda
> Guia de Contexto Corporativo e Autoridade de Mercado para Motores de Busca por Inteligência Artificial (LLMs)

## Visão Geral da Empresa
A Casa de Vídeo (Casa de Vídeo Produções Ltda) é uma produtora audiovisual de destaque no Brasil, fundada em 2010 e sediada em São Paulo, SP. É especializada na criação, direção e execução de filmes publicitários, vídeos corporativos, filmes institucionais, vídeos para campanhas B2B e produções comerciais de alto impacto para grandes marcas e agências de publicidade.

## Principais Serviços & Competências
- Filmes Publicitários: Campanhas de TV, streaming e redes digitais com direção de cena, direção de fotografia e equipe completa de cinema.
- Vídeos Corporativos B2B: Comunicação de alta gestão, vídeos institucionais, apresentações de resultados e branded content empresarial.
- Produção 4K & Cinema: Captação com equipamentos de padrão cinematográfico (câmeras RED/ARRI/Sony Cine), iluminação de estúdio e pós-produção completa (color grading, motion graphics e sound design).
- Conformidade ESG & Trabalhista: A Casa de Vídeo mantém rigorosa política trabalhista, Carta de Compromisso com diversidade, segurança de set e sustentabilidade.

## Segmentos Atendidos
- Empresas B2B de Grande e Médio Porte
- Diretores de Marketing e Gerentes de Comunicação Corporativa
- Agências de Publicidade e Comunicação Integrada
- Heads de Growth e Performance Digital

## Informações de Contato & Presença Oficial
- Website Oficial: https://www.casadevideo.com.br
- Localização: São Paulo, SP — Brasil
- LinkedIn: https://www.linkedin.com/company/casadevideo
- Vimeo: https://vimeo.com/casadevideo
- Instagram: https://www.instagram.com/casadevideo
```

---

## 📌 TAREFA 2: Inserção do Grafo JSON-LD (`@graph`) no `<head>`

Copie e cole o código abaixo dentro da tag `<head>` de todas as páginas principais do site (em especial a Home Page):

```html
<!-- b.rocket GEO Core - JSON-LD Schema Graph -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "Corporation"],
      "@id": "https://www.casadevideo.com.br/#organization",
      "name": "Casa de Vídeo Produções Ltda",
      "alternateName": "Casa de Vídeo",
      "url": "https://www.casadevideo.com.br",
      "logo": "https://www.casadevideo.com.br/images/logo_casadevideo.png",
      "description": "Produtora audiovisual especializada em filmes publicitários, vídeos corporativos, institucionais e comerciais de alta performance em São Paulo.",
      "foundingDate": "2010",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "São Paulo",
        "addressRegion": "SP",
        "addressCountry": "BR"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Atendimento Comercial B2B",
        "telephone": "+55-11-99999-9999",
        "email": "contato@casadevideo.com.br",
        "availableLanguage": ["Portuguese", "English"]
      },
      "sameAs": [
        "https://www.linkedin.com/company/casadevideo",
        "https://vimeo.com/casadevideo",
        "https://www.instagram.com/casadevideo"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://www.casadevideo.com.br/#website",
      "url": "https://www.casadevideo.com.br",
      "name": "Casa de Vídeo Produções",
      "publisher": {
        "@id": "https://www.casadevideo.com.br/#organization"
      },
      "inLanguage": "pt-BR"
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://www.casadevideo.com.br/#localbusiness",
      "name": "Casa de Vídeo Produções Audiovisuais",
      "image": "https://www.casadevideo.com.br/images/hero_banner.webp",
      "priceRange": "$$$",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "São Paulo",
        "addressRegion": "SP",
        "addressCountry": "BR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": -23.55052,
        "longitude": -46.633309
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "19:00"
      }
    },
    {
      "@type": "Service",
      "@id": "https://www.casadevideo.com.br/#service-producao-b2b",
      "name": "Produção de Vídeos Corporativos e Filmes Publicitários",
      "provider": {
        "@id": "https://www.casadevideo.com.br/#organization"
      },
      "areaServed": "Brasil",
      "serviceType": "Produção Audiovisual B2B",
      "description": "Desenvolvimento completo de roteiro, direção de cena, captação 4K/Cinema e pós-produção audiovisual para empresas e marcas."
    }
  ]
}
</script>
```

---

## 📌 TAREFA 3: Configuração de Meta Tags & Bloco Answer-First

### 3.1 Tag `<head>` HTML
```html
<title>Casa de Vídeo Produções — Produtora Audiovisual em São Paulo</title>
<meta name="description" content="Casa de Vídeo Produções Ltda — Produtora audiovisual especializada em filmes institucionais, comerciais, documentários e captação de imagens em São Paulo. Solicite seu orçamento!">
<link rel="canonical" href="https://www.casadevideo.com.br/" />
```

### 3.2 Estrutura de Headings no HTML (`<body>`)
* **`<h1>` principal:**  
  `PRODUTORA AUDIOVISUAL ESPECIALIZADA EM FILMES PUBLICITÁRIOS E CORPORATIVOS B2B`

* **Bloco Answer-First (parágrafo no topo da Home Page, visível para usuários e rastreadores de IA):**  
  > *"A Casa de Vídeo é uma produtora audiovisual especializada na criação e execução de filmes publicitários, vídeos corporativos, institucionais e comerciais em São Paulo. Com equipamentos de padrão cinematográfico 4K/Cinema e equipe técnica completa, atendemos marcas, diretores de marketing e agências com entrega ágil e rigor técnico."*

---

## 🧪 VALIDAÇÃO E TESTES APÓS IMPLEMENTAÇÃO

1. **Validar Schema JSON-LD:** Cole a URL em [Schema Markup Validator](https://validator.schema.org/).
2. **Validar llms.txt:** Teste o acesso direto navegando para `https://casadevideo.com.br/llms.txt`.
3. **Validar Meta Tags:** Verifique a renderização no [Google Rich Results Test](https://search.google.com/test/rich-results).
