# Conexa Network · site

Site institucional da Conexa Network: redes corporativas, Wi-Fi profissional, firewall e monitoramento.

## Estrutura

```
index.html            páginas do site (rotas por âncora: #inicio, #servicos, #projetos, #planos, #sobre, #duvidas, #contato)
favicon.svg           ícone da aba (também usado para medir a latência do visitante)
assets/css/style.css  estilos
assets/js/main.js     conteúdo dinâmico, cenas 3D e interações
assets/js/world-data.js  mapa-múndi compactado do globo (Natural Earth 1:110m, domínio público)
images/               fotos dos projetos (pasta já existente no repositório)
```

Não há etapa de build. Basta publicar a pasta como site estático (GitHub Pages, Netlify, Vercel ou qualquer servidor web).

## Dependências externas

- Three.js r128 via cdnjs (cenas 3D). Se não carregar, o site continua funcionando sem o 3D.
- Fontes Unbounded, IBM Plex Sans e JetBrains Mono via Google Fonts.

## Configurações

Em `assets/js/main.js`:

- `PING_URL`: arquivo ou endpoint usado para medir a latência do visitante. Padrão: `favicon.svg`. Em servidor próprio, prefira um endpoint leve (ex.: `/ping` respondendo 204).
- Número do WhatsApp do formulário: procure por `wa.me/5569993645405`.

## Teste local

Abra com um servidor local para que a medição de latência use o próprio site:

```
python3 -m http.server 8080
```

Depois acesse http://localhost:8080.

## Arquivos do repositório que não mudam

`CNAME`, `robots.txt`, `.nojekyll`, `.well-known/` e `images/` continuam como estão.

## Segurança

A página mantém uma Content-Security-Policy no `<head>`. Ela libera apenas: scripts do próprio site e do cdnjs (Three.js), fontes do Google, imagens do próprio site e requisições ao próprio site (medição de latência). Os links externos aceitos são WhatsApp, Facebook e Speedtest.
