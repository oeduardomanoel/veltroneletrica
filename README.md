# Veltron Elétrica

Site da Veltron Elétrica, eletricista em Balneário Camboriú (SC), atendimento 24h.

Site estático (HTML + CSS + JS puro, sem build). Pode ir para GitHub Pages, Netlify, Vercel, Cloudflare Pages ou qualquer hospedagem comum.

## Estrutura

| Arquivo | Função |
|---|---|
| `index.html` | Página única com SEO local, Open Graph e dados estruturados (Electrician, WebSite, WebPage, FAQPage) |
| `robots.txt` | Libera buscadores e crawlers de IA (GPTBot, ClaudeBot, PerplexityBot, Google-Extended etc.) |
| `sitemap.xml` | Mapa do site para Google e Bing |
| `llms.txt` | Resumo do negócio em texto para ChatGPT, Claude, Perplexity e afins (GEO) |
| `site.webmanifest` | Ícones e cor do app quando salvo na tela inicial |
| `404.html` | Página de erro |
| `assets/` | Logo, ícones, imagem de compartilhamento, fontes, CSS e JS |

## Antes de publicar

1. O domínio usado em todo o site é `https://veltroneletrica.com.br/`. Se for outro, troque em `index.html`, `robots.txt`, `sitemap.xml` e `llms.txt` (buscar e substituir).
2. Cadastre o domínio no Google Search Console e envie o `sitemap.xml`.
3. Crie ou reivindique o Perfil da Empresa no Google (Google Meu Negócio) com o mesmo nome, endereço e telefone do site.

## Rastreamento de conversão

Todo botão de WhatsApp e de ligação tem `data-track`. Ao clicar, o site envia `contato_click` para o `dataLayer` e, se existirem, dispara `generate_lead` no GA4 e `Contact` no Meta Pixel. É só instalar a tag do GA4/GTM ou do Pixel no `<head>`.
