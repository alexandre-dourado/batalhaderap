# Plano de Refatoração UI & Assets V3

## 1. Exibição dos Avatares (Telão)
Atualmente a `BattleLive` está renderizando apenas o **nome** do MC no centro do card. 
- **Proposta:** Vou alterar a estrutura do telão (`BattleLive.tsx`) para incluir a imagem `<img src={mc.avatar}>` acima do nome.
- **Remoção de Filtros:** Havia um filtro antigo no `EventSetup` que forçava os avatares padrão para tons de cinza (`grayscale(100%)`). Vou deletar esse código para que as imagens carreguem com suas cores originais!

## 2. Cores Dinâmicas e Rotativas para os MCs
Hoje, o código usa a cor Vermelha (`--color-red`) sempre para o "MC A" e a cor Creme (`--color-offwhite`) sempre para o "MC B". O problema é que, no chaveamento, se o "Fluxo" for o MC A na oitava, ele é vermelho, e se for o MC B na quartas, ele fica creme. 
- **Proposta:** Quando os participantes forem inscritos no `EventSetup`, vou atribuir uma **cor fixa única e randômica (ciclada)** para cada participante.
- Vou expandir a paleta de cores no `index.css` de 4 para 8 cores brutais e vibrantes (Neon Red, Acid Yellow, Cyber Blue, Toxic Green, Hot Pink, etc). Assim a cor vira a "identidade visual" do MC durante todo aquele torneio.

## 3. WebP nos Avatares
- Vou alterar todas as referências do código (`EventSetup.tsx` e Banco de Dados) para procurar por `/assets/characters/X.webp` em vez de `.png`. 
- **O que você precisará fazer:** Converter os arquivos que estão na pasta `public/assets/characters/` de PNG para WebP para que o app continue os exibindo (há ferramentas web gratuitas para isso se não quiser usar o Photoshop).

---

## 4. O Guia Molde (Mockup) e os Slices
O HTML que eu gerei anteriormente não era pra ser usado no app! Era apenas um "esboço estrutural bruto" para ilustrar onde os botões iriam ficar (por isso "Mockup").
Já que você tem esses assets riquíssimos (como o `asset-014.png` lotado de botões, sprays, rabiscos e raios) e quer integrá-los no projeto de forma customizada, preparei um **Guia de Dimensões e Posições** abaixo.

### 📜 GUIA DE RECORTE DE IMAGENS (Para Photoshop/Figma)

Você precisará recortar e exportar individualmente os elementos daqueles PSDs/PNGs crus. Salve-os em `public/assets/ui/` no formato `.webp`. Segue a lista do que o código vai esperar:

1. **`btn-voltar.webp` (Aprox. 64x64px):** A seta ou botão de retorno para o Bracket.
2. **`btn-play-beat.webp` (Aprox. 120x120px):** O ícone de disco/toca disco para acionar a escolha dos beats.
3. **`frame-avatar.webp` (Aprox. 300x300px):** Uma moldura estilizada (grafite, listrada ou rabiscada) para colocar EM VOLTA da foto do MC na arena. (Pode usar os sprays do `asset-014` para compor isso).
4. **`badge-coroa-vencedor.webp` (Aprox. 100x100px):** A coroa (amarela ou vermelha) que aparece acima do MC quando ele vence a batalha final.
5. **`fx-spray-vermelho.webp` / `fx-spray-amarelo.webp` (Tamanho livre):** Linhas de spray isoladas para usarmos de separadores visuais no meio da tela (por trás do timer, por exemplo).
6. **`bg-arena.webp` (1920x1080px):** Fundo principal da batalha. (Pode usar a textura com tinta escorrendo do `asset-015`).
7. **`deco-listras-pb.webp` / `deco-listras-amarelas.webp`:** Faixas listradas (asset-016, 017) para usarmos nos rodapés (Action Bar) ou cabeçalhos.

> *Assim que você salvar esses recortes na pasta, me avise e eu atualizarei o código React para posicioná-los como background ou tags `<img>` nas coordenadas corretas!*

---

## 5. Prompt para IA de UI (Google Stitch / Midjourney / DALL-E)

Se você quer gerar uma proposta visual completa para se inspirar antes de montar as peças no Photoshop, copie e cole o prompt abaixo na sua IA geradora de imagens favorita:

> **PROMPT:**
> "A UI UX design for a mobile and desktop web application called 'Batalha de Rap' (Rap Battle Tournament). The visual style is aggressive, urban, and brutalist. Dark theme, pitch black background (#090909) with high contrast neon accents (Acid Yellow, Cyberpunk Red, Electric Blue). The typography is bold, massive, sans-serif, and condensed. The screen shows a 1v1 battle arena. On the left, MC A's card with a gritty hip-hop avatar surrounded by a spray-painted frame and a glowing crown graffiti. On the right, MC B's card. In the center, a huge digital timer (0:45) painted like a street stencil, and a glowing vinyl record button for selecting beats. The interface features textured elements like dripping paint, torn caution tape, and raw marker scribbles. Highly detailed, dribbble style, 8k resolution, flat UI elements mixed with grunge textures."

---

## Próximos Passos
Se aprovar este plano (botão **Proceed**), eu irei **imediatamente**:
1. Implementar as 8 cores dinâmicas no CSS.
2. Alterar o sistema de cadastro (`EventSetup.tsx`) para ciclar essas cores e gravar nos MCs.
3. Adicionar o Avatar no telão (`BattleLive.tsx`), usando `.webp` e sem escalas de cinza.
