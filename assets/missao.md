JESONEL — MISSÃO: INTEGRAR ASSET LIBRARY DO BATALHA RAP

========================================================



OBJETIVO



Temos uma grande prancha visual de assets criada especificamente para o

aplicativo BATALHA RAP.



Sua missão é transformar essa prancha em uma biblioteca profissional de

assets reais dentro do projeto.



Não faça simplesmente um recorte automático.



Você deve:



1\. localizar a imagem-fonte;

2\. analisar visualmente toda a prancha;

3\. identificar cada asset individual;

4\. recortar com bounding boxes precisos;

5\. preservar completamente o canal alpha;

6\. remover espaços transparentes excessivos;

7\. aplicar padding visual consistente;

8\. nomear semanticamente cada asset;

9\. organizar os arquivos na estrutura correta;

10\. integrar os assets ao código existente;

11\. substituir emojis/placeholders existentes pelos novos assets quando

&#x20;   isso fizer sentido;

12\. revisar visualmente o resultado;

13\. corrigir qualquer recorte defeituoso;

14\. garantir que nada seja quebrado.



IMPORTANTE:



Não destrua, sobrescreva ou reorganize arbitrariamente o projeto existente.



Primeiro faça uma auditoria.



========================================================

FASE 0 — AUDITORIA DO PROJETO

========================================================



Antes de modificar qualquer arquivo:



\- descubra a estrutura do projeto;

\- identifique framework e stack;

\- localize public/, src/, assets/ ou equivalentes;

\- procure referências a:

&#x20; - emoji

&#x20; - ícones

&#x20; - logo

&#x20; - favicon

&#x20; - manifest

&#x20; - OpenGraph

&#x20; - PWA

&#x20; - botões da mesa do DJ

&#x20; - tela inicial

&#x20; - header

&#x20; - controles de batalha;

\- descubra como os assets atualmente são carregados;

\- verifique se existe algum sistema de design ou componente reutilizável.



Não altere nada ainda.



Produza mentalmente um mapa:



PROJECT

├── assets

├── components

├── pages

├── styles

├── PWA

├── metadata

└── battle controls





========================================================

FASE 1 — LOCALIZAR A IMAGEM-FONTE

========================================================



Procure a prancha de assets disponível no workspace.



Se houver mais de uma imagem candidata:



\- identifique dimensões;

\- formato;

\- transparência;

\- conteúdo visual;

\- escolha a que corresponde à prancha BATALHA RAP.



A imagem tem aproximadamente 1536x1024px e contém:



\- logo BATALHA RAP;

\- ícones PWA;

\- pôster social;

\- ícones de batalha;

\- ícones de navegação;

\- texturas;

\- elementos gráficos decorativos.



NÃO altere a imagem-fonte original.



Crie uma cópia de trabalho somente se necessário.





========================================================

FASE 2 — ANÁLISE VISUAL

========================================================



Antes do slicing automático, analise a composição inteira.



A biblioteca visual esperada contém aproximadamente:



\--------------------------------------------------------

01 — LOGOTIPO

\--------------------------------------------------------



Asset principal:



logo-batalha



Características:



\- BATALHA RAP;

\- tipografia pesada;

\- amarelo ácido;

\- vermelho;

\- microfone;

\- estética brutalista/street;

\- fundo transparente.



Criar:



public/assets/batalha/logo-batalha.png



Se houver uma versão SVG vetorial realmente disponível ou se for seguro

vetorizar sem perda visual, ela poderá ser criada posteriormente.



NÃO invente SVG falso apenas trocando extensão.





\--------------------------------------------------------

02 — PWA

\--------------------------------------------------------



Criar:



icon-512.png

icon-192.png



Características:



\- fundo preto;

\- B gigante;

\- amarelo ácido;

\- detalhes vermelhos;

\- composição quadrada;

\- legibilidade em tamanho pequeno.



IMPORTANTE:



Esses dois arquivos devem ser realmente preparados para os tamanhos

512x512 e 192x192.



Se o asset-fonte não possuir exatamente essas proporções, recorte a

marca preservando proporção e faça composição sobre fundo preto.



Não distorça.





\--------------------------------------------------------

03 — OPENGRAPH

\--------------------------------------------------------



Criar:



og-image.webp



Tamanho final:



1200x630



É uma composição própria para preview social.



Não recortar simplesmente qualquer região quadrada.



Preservar:



\- BATALHA RAP;

\- estética brutalista;

\- grade;

\- vermelho;

\- amarelo ácido;

\- elementos gráficos;

\- textos existentes quando forem legíveis.





\--------------------------------------------------------

04 — TEXTURAS

\--------------------------------------------------------



Separar os elementos de textura existentes.



Sugestões de nomes:



texture-halftone.png

texture-noise.png

texture-splatter-yellow.png

texture-splatter-red.png

texture-scratches.png

texture-brush-black.png

texture-brush-red.png

texture-brush-yellow.png



Se algum desses elementos NÃO existir claramente na imagem:



NÃO inventar.



Use somente o que realmente estiver presente.





========================================================

FASE 3 — ÍCONES DE BATALHA

========================================================



Criar biblioteca:



public/assets/batalha/icons/



Arquivos:



icon-play.png

icon-pause.png

icon-stop.png

icon-swap.png

icon-dice.png

icon-switch-mc.png

icon-judge.png

icon-check.png



Correspondência:



PLAY

→ triângulo



PAUSE

→ duas barras



STOP

→ quadrado



SWAP

→ duas setas horizontais



DICE

→ dado



SWITCH MC

→ troca circular



JUDGE

→ balança



CHECK

→ check agressivo



Cada arquivo deve:



\- possuir fundo transparente;

\- ter bounding box justo;

\- possuir padding consistente;

\- manter o mesmo peso visual;

\- preservar as cores originais;

\- funcionar em 48px e 64px.



NÃO misturar dois ícones no mesmo arquivo.





========================================================

FASE 4 — NAVEGAÇÃO

========================================================



Criar:



public/assets/batalha/navigation/



icon-arrow-left.png

icon-screen.png

icon-vinyl.png



Cada asset deve existir isoladamente.



Se houver versão com placa e versão sem placa:



\- preservar a versão mais útil para UI;

\- se ambas forem visualmente relevantes, guardar ambas com nomes

&#x20; distintos.





========================================================

FASE 5 — ELEMENTOS DECORATIVOS

========================================================



Criar:



public/assets/batalha/decor/



Separar elementos como:



\- crown;

\- microphone;

\- lightning;

\- arrows;

\- X;

\- brush strokes;

\- spray;

\- circles;

\- technical lines;

\- brackets;

\- badges;

\- hazard stripes;

\- small stars;

\- sound waves;

\- cables.



Nomenclatura:



decor-crown-01.png

decor-microphone-01.png

decor-lightning-01.png

decor-arrow-01.png

decor-brush-red-01.png

etc.



Se existirem múltiplas variações genuinamente distintas, preserve-as.





========================================================

FASE 6 — ELEMENTOS TIPOGRÁFICOS

========================================================



Separar palavras que sejam úteis como elementos gráficos:



BATALHA

RAP

BEAT

RIMA

RESPEITO

ROUND

MC

JUIZ

VENCEDOR

BATALHA FINAL

MESA DE CONTROLE

OFFLINE-FIRST



IMPORTANTE:



Não recriar texto através de uma fonte arbitrária.



Se o texto aparece como parte do artwork, recorte o artwork.



Se a qualidade não for suficiente para uso real, registre isso no manifest

em vez de fingir que o asset está perfeito.





========================================================

FASE 7 — SLICING

========================================================



Crie:



scripts/slice\_batalha\_assets.py



Use Pillow.



Se OpenCV estiver disponível, pode utilizá-lo.



O algoritmo deve:



1\. detectar alpha;

2\. encontrar componentes visuais;

3\. agrupar componentes que pertencem ao mesmo asset;

4\. evitar separar partes internas do mesmo logo;

5\. evitar unir assets independentes;

6\. gerar bounding boxes;

7\. aplicar padding;

8\. remover espaço transparente desnecessário;

9\. exportar PNG RGBA.



IMPORTANTE:



A detecção automática é apenas o PRIMEIRO PASSO.



Depois de gerar os recortes:



ABRA / INSPECIONE O CONTACT SHEET.



Se um logo estiver dividido em vários pedaços,

CORRIJA.



Se dois assets estiverem juntos,

CORRIJA.



Se houver pedaços de outro asset dentro do bounding box,

CORRIJA.



Se o recorte cortar sombra, spray, cabo ou contorno pertencente ao asset,

CORRIJA.





========================================================

FASE 8 — CONTACT SHEET

========================================================



Gerar:



public/assets/batalha/CONTACT-SHEET.png



A contact sheet deve mostrar todos os assets exportados com:



\- ID;

\- nome;

\- miniatura;

\- transparência visível;

\- organização por categoria.



Use-a como ferramenta de QA.





========================================================

FASE 9 — MANIFEST

========================================================



Criar:



public/assets/batalha/manifest.json



Estrutura aproximada:



{

&#x20; "brand": "BATALHA RAP",

&#x20; "version": "1.0.0",

&#x20; "source": "...",

&#x20; "assets": \[

&#x20;   {

&#x20;     "id": "logo-batalha",

&#x20;     "category": "brand",

&#x20;     "file": "logo-batalha.png",

&#x20;     "type": "image",

&#x20;     "width": 600,

&#x20;     "height": 200,

&#x20;     "transparent": true

&#x20;   }

&#x20; ]

}



Para cada asset registrar:



\- id;

\- category;

\- file;

\- width;

\- height;

\- transparent;

\- source bounding box;

\- crop bounding box;

\- descrição;

\- uso sugerido.





========================================================

FASE 10 — INTEGRAÇÃO COM O APP

========================================================



Agora examine o código.



Procure especificamente por:



🎲

🔄

⚖️

▶

⏸

✓



e por componentes equivalentes.



Substitua os emojis pelos novos assets quando isso melhorar a UI.



NÃO faça substituição textual cega.



Respeite:



\- tamanho dos botões;

\- acessibilidade;

\- aria-label;

\- keyboard navigation;

\- hover;

\- active;

\- disabled;

\- responsive;

\- dark mode se existir.



Os ícones devem continuar funcionando mesmo se a imagem não carregar.



Use alt vazio para imagens puramente decorativas.



Para controles:



aria-label="Play"

aria-label="Pause"

aria-label="Stop"

etc.





========================================================

FASE 11 — LOGO / HEADER

========================================================



Localize o logo atual.



Se houver logo placeholder:



substituir pelo novo logo-batalha.



Não aumentar o header desnecessariamente.



Preservar:



\- alinhamento;

\- responsive;

\- área clicável;

\- contraste.





========================================================

FASE 12 — PWA

========================================================



Localize:



manifest.webmanifest

manifest.json

vite.config

next.config

ou equivalente.



Atualize:



icons:



192x192

512x512



e, se necessário:



apple-touch-icon

favicon



Não quebrar caminhos existentes.





========================================================

FASE 13 — OPENGRAPH

========================================================



Localize metadata social.



Atualize para:



og-image.webp



Verifique:



og:title

og:description

og:image



Não alterar metadata sem necessidade.





========================================================

FASE 14 — PERFORMANCE

========================================================



Verifique tamanho dos assets.



Regras:



\- PNG para transparência;

\- WebP para imagens sem necessidade de alpha;

\- não usar PNG gigantes quando WebP resolver;

\- ícones pequenos devem continuar leves;

\- não converter logos transparentes para JPG.



Não sacrificar qualidade visual excessivamente.





========================================================

FASE 15 — QA VISUAL

========================================================



Faça uma revisão final.



Checklist:



\[ ] logo não está cortado

\[ ] microfone não está cortado

\[ ] sombras não foram cortadas

\[ ] respingos pertencentes ao asset foram preservados

\[ ] nenhum asset possui pedaço de outro asset

\[ ] transparência funciona

\[ ] PWA 192x192 correto

\[ ] PWA 512x512 correto

\[ ] OG 1200x630 correto

\[ ] ícones possuem tamanhos coerentes

\[ ] emojis antigos relevantes foram substituídos

\[ ] botões continuam clicáveis

\[ ] mobile continua funcionando

\[ ] desktop continua funcionando

\[ ] nenhuma rota quebrou

\[ ] nenhum import quebrou

\[ ] build funciona





========================================================

FASE 16 — BUILD

========================================================



Execute o processo de build/teste existente.



Corrija:



\- imports;

\- paths;

\- tipos;

\- referências quebradas;

\- assets inexistentes;

\- erros de build.



Não considere a missão concluída enquanto o projeto não compilar.





========================================================

REGRA FUNDAMENTAL

========================================================



NÃO faça uma implementação "aproximada".



O objetivo é transformar a prancha em uma ASSET LIBRARY REAL.



Se algo não puder ser determinado automaticamente:



1\. examine visualmente;

2\. procure evidências na própria imagem;

3\. use bounding boxes específicos;

4\. registre a decisão no manifest.



Não invente assets que não existem.



Não altere a identidade visual.



Não substitua os assets por ícones genéricos do Lucide,

FontAwesome, Material Icons etc.



Os assets desta prancha devem ser a identidade visual principal.





========================================================

RESULTADO FINAL ESPERADO

========================================================



Ao terminar, quero algo aproximadamente assim:



public/

├── favicon.ico

├── icons/

│   ├── icon-192.png

│   └── icon-512.png

│

└── assets/

&#x20;   └── batalha/

&#x20;       ├── logo-batalha.png

&#x20;       ├── og-image.webp

&#x20;       ├── manifest.json

&#x20;       ├── CONTACT-SHEET.png

&#x20;       │

&#x20;       ├── icons/

&#x20;       │   ├── icon-play.png

&#x20;       │   ├── icon-pause.png

&#x20;       │   ├── icon-stop.png

&#x20;       │   ├── icon-swap.png

&#x20;       │   ├── icon-dice.png

&#x20;       │   ├── icon-switch-mc.png

&#x20;       │   ├── icon-judge.png

&#x20;       │   └── icon-check.png

&#x20;       │

&#x20;       ├── navigation/

&#x20;       │   ├── icon-arrow-left.png

&#x20;       │   ├── icon-screen.png

&#x20;       │   └── icon-vinyl.png

&#x20;       │

&#x20;       ├── textures/

&#x20;       │   ├── texture-halftone.png

&#x20;       │   ├── texture-noise.png

&#x20;       │   └── ...

&#x20;       │

&#x20;       └── decor/

&#x20;           ├── decor-crown-01.png

&#x20;           ├── decor-microphone-01.png

&#x20;           ├── decor-lightning-01.png

&#x20;           └── ...





========================================================

ENTREGA

========================================================



Ao final, informe:



1\. quantos assets foram encontrados;

2\. quantos foram exportados;

3\. quantos foram considerados utilizáveis;

4\. quais foram integrados ao app;

5\. quais emojis/placeholders foram substituídos;

6\. onde estão os arquivos;

7\. onde está o manifest;

8\. onde está o contact sheet;

9\. resultado do build;

10\. eventuais limitações da imagem-fonte.



Não faça apenas um relatório.



A missão só está concluída quando os assets estiverem efetivamente

integrados ao projeto e o build estiver funcionando.



\----





```

Uma melhoria importante para o seu caso



Eu não faria o AGY transformar todos os elementos em SVG automaticamente.



Para esses assets com textura, spray, halftone, desgaste e bordas orgânicas, PNG transparente é melhor. SVG faz sentido para os ícones geométricos simples, mas não necessariamente para o artwork.



A arquitetura ideal seria:



PNG transparente

→ logo, texturas, graffiti, typography, decorativos.



SVG

→ play, pause, stop, swap, dice, switch, judge, check, arrow, screen etc., caso o AGY consiga redesenhá-los fielmente como vetores.



Isso deixa o app muito mais leve e permite alterar stroke, fill, tamanho e estados via CSS.



E há uma segunda etapa que vale muito a pena: depois do AGY fazer o slicing, ele pode criar automaticamente um AssetGallery interno no próprio app, uma rota tipo /dev/assets, exibindo todos os assets com nome, categoria, dimensões, caminho e exemplos de uso. Isso transforma a própria biblioteca em um mini design system visual do Batalha Rap, facilitando muito a evolução posterior da UI.```

