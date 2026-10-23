# Bela Cookie — versão instalável (PWA)

Esta pasta é o mesmo app publicado no Claude, com a camada de instalação:
ícone da logo, manifesto, service worker e funcionamento sem internet.
O layout, as telas e as funções são os mesmos.

## O que tem aqui

| Arquivo | Para que serve |
|---|---|
| `index.html` | O app, idêntico ao do Claude, com as tags de instalação no `<head>` |
| `manifest.webmanifest` | Nome, cores, modo `standalone` e ícones para o Android |
| `sw.js` | Service worker: abre como app, funciona offline, cache versionado |
| `icons/apple-touch-icon.png` | Ícone do iPhone, 180 × 180, sem transparência |
| `icons/icon-192.png`, `icons/icon-512.png` | Ícones do Android |
| `icons/icon-maskable-512.png` | Ícone adaptável do Android (logo dentro da zona segura) |
| `icons/favicon-32.png`, `icons/favicon-48.png` | Ícone da aba do navegador |
| `nuvem/` | Atalho opcional com a logo que abre o link do Claude (mantém os dados na nuvem) |

## Publicar no GitHub Pages

1. Crie um repositório chamado `bela-cookie` (ou use o seu site do GitHub Pages e crie uma pasta `bela-cookie`).
2. Envie todo o conteúdo desta pasta, mantendo as subpastas `icons` e `nuvem`.
3. Em Settings > Pages, escolha Deploy from a branch, branch `main`, pasta `/ (root)`.
4. O app fica em `https://SEU-USUARIO.github.io/bela-cookie/`.
   O atalho da nuvem fica em `https://SEU-USUARIO.github.io/bela-cookie/nuvem/`.

Todos os caminhos são relativos, então funciona em qualquer pasta. Precisa ser HTTPS (o GitHub Pages já é).

## Instalar e testar

**Android (Chrome)**
1. Abra o endereço no Chrome e espere a página carregar.
2. Menu de três pontos > Instalar app (ou Adicionar à tela inicial > Instalar).
3. O ícone deve ser a logo em fundo marrom. Ao abrir, não aparece barra do navegador.
4. Teste offline: ative o modo avião e abra o app pela tela inicial.

**iPhone (Safari)**
1. Abra o endereço no Safari (precisa ser o Safari).
2. Botão Compartilhar > Adicionar à Tela de Início. O nome sugerido é Bela Cookie.
3. O ícone deve ser a logo em fundo marrom. Ao abrir, não aparece barra do Safari.

## Dados na nuvem (Supabase)

Fora do Claude, o app guarda tudo no Supabase do projeto da Bela Cookie.
- `supabase.sql`: rode uma vez no SQL Editor do Supabase (cria a tabela `docs` com acesso só para o usuário logado).
- Crie o usuário em Authentication > Users > Add user (e-mail e senha, marque Auto Confirm User).
- No primeiro uso o app pede e-mail e senha; depois fica logado no aparelho.
- Sem internet o app continua funcionando e envia as alterações quando a conexão volta (o selo mostra "Pendente").
- A URL e a chave publishable ficam no começo do bloco "Supabase" do `index.html`. A chave secret nunca deve entrar aqui.

## Dados (sem Supabase)

Fora do Claude, o app salva os dados no próprio aparelho (o selo no topo mostra "Neste aparelho").
Os dados não sincronizam entre celulares. Para levar os dados do link do Claude para cá:
no app do Claude, Mais > Backup > Copiar backup como texto; no app instalado, Mais > Backup > Restaurar.

No iPhone, o app da tela inicial tem armazenamento separado do Safari. Restaure o backup
dentro do app já instalado, e não no Safari.

## Atualizar ícones ou o app

1. Troque os arquivos em `icons/` mantendo os mesmos nomes.
2. Troque `?v=1` por `?v=2` no `index.html`, no `manifest.webmanifest` e no `sw.js`.
3. No `sw.js`, troque `const VERSAO = 'v1'` por `'v2'`.
4. Publique. O service worker novo apaga o cache antigo sozinho.

Só o `index.html` mudou (sem trocar ícones)? Basta publicar: a página é buscada na internet
primeiro, então a versão nova aparece na próxima vez que o app abrir com internet.

**Quando é preciso remover o atalho e adicionar de novo**
- iPhone: sempre que o ícone ou o nome mudarem. O iOS guarda o ícone no momento em que você adiciona e não atualiza depois.
- Android, app instalado pelo Chrome: não precisa. O Chrome confere o manifesto de tempos em tempos (cerca de uma vez por dia, quando o app é aberto) e atualiza o ícone. Em versões recentes ele pode pedir confirmação.
- Android, atalho simples (criado por outro navegador, ou pelo "Adicionar à tela inicial" sem instalar): precisa remover e adicionar de novo.
- O atalho antigo do link do Claude não vira este app. Ele é de outro endereço: remova-o e instale este.
