# BATALHA RAP — Relatório de Arquitetura e Código (V2.0.0)

Este documento foi gerado pelo **Antigravity (Google)** para auditoria de código e entendimento da V2.
Abaixo está o "Raio-X" do repositório `batalhaderap`, documentando a nova arquitetura, estado, lógicas de domínio, stack e o modelo estrito de turnos implementado.

## 1. Visão Geral (Stack)
- **Framework:** React 18
- **Build Tool:** Vite
- **Linguagem:** TypeScript
- **Estilos:** Tailwind CSS v4 (Via `@theme` em `index.css`, sem `tailwind.config.js`).
- **Banco de Dados Local:** Dexie.js (IndexedDB wrapper)
- **Persistência / PWA:** vite-plugin-pwa (Service Workers, offline-first)

---

## 2. Estrutura de Diretórios
```
batalhaderap/
├── public/                 # Assets públicos, ícones PWA e favicon
│   ├── assets/             # Imagens da UI (logo, botões exportados via script de prancha)
│   └── beats/              # Beats convertidos para formato .opus (~96kbps)
├── src/
│   ├── core/
│   │   ├── db/             # Dexie.js setup (db.ts) e Seed de Beats (seedBeats.ts)
│   │   ├── engine/         # Lógica de torneio (tournament.ts) e avance manual
│   │   └── types/          # Interfaces TypeScript (index.ts) com suporte a 'color' e 'roundTime'
│   ├── pages/              # Telas (Home, CreateEvent, EventSetup, BracketView, BattleLive, LiveScreen, BeatsLibrary)
│   ├── App.tsx             # Rotas (react-router-dom)
│   └── main.tsx            # Ponto de entrada e chamada do seedBeats
```

---

## 3. Core Data (Estado e Persistência)
O app não utiliza Redux ou Zustand. Todo o estado global vive no **IndexedDB** acessado pelos hooks reativos `useLiveQuery` do `dexie-react-hooks`. 
Qualquer mudança no banco atualiza as telas automaticamente (reatividade DB-driven).

**Evoluções da V2 (`db.ts` / `types/index.ts`):**
- **Settings**: Adicionado suporte ao `roundTime` (padrão 30s, suportando modos como 45s, 60s ou 'Livre').
- **Participant**: Adicionado atributo opcional `color` ('red', 'blue', 'random') para dinamizar a interface de quem está batalhando.
- O modelo continua processando Beats offline salvando os Blobs localmente.

---

## 4. Lógicas de Domínio (Engine e Setup)
**`tournament.ts`**
- **`generateBracket(eventId, participants)`:** Adaptado na V2 para suportar perfeitamente os "BYEs" (slots nulos/ausentes caso a chave não feche potência de 2 perfeita ou haja um setup manual irregular). A função agora varre os confrontos gerados em Phase 0 e aplica auto-advance para o MC que não tem oponente.
- **`advanceWinner(battles, battleId, winnerId)`:** Encontra o confronto atual e avança o ganhador para a próxima fase preenchendo adequadamente o slot `mcAId` ou `mcBId`.

**`EventSetup.tsx`**
- Refatorado completamente para a V2:
  - Permite a escolha do **Tempo de Round**.
  - Permite escolher entre chaveamento **Aleatório** (automático) e **Manual**.
  - O chaveamento Manual exibe um painel lado a lado (estilo "Bracket Builder") onde os MCs ficam numa pool à esquerda e podem ser alocados em chaves específicas (BATALHA 1, BATALHA 2) à direita.

---

## 5. Máquina de Estados Estrita da Batalha (BattleLive.tsx)
A V2 reimaginou a tela do organizador, abandonando o timer passivo e criando uma Máquina de Estados (`roundStep`) estrita:

1. **IDLE_A**: Aguarda o toque no botão "SOLTA O BEAT (A)".
2. **COUNTDOWN_A**: Modal sobreposto conta 3, 2, 1 enquanto o beat recebe um **Fade-In** via Audio API de 3 segundos.
3. **ACTIVE_A**: O tempo (ex: 30s) conta regressivamente. Quando atinge 0, o audio recebe um **Fade-Out** suave de 1 segundo e o Web Audio API dispara uma **Sirene Eletrônica (Beep Sawtooth caindo de 330Hz para 110Hz)** avisando do encerramento.
4. **IDLE_B**: Aguarda o botão de "RESPOSTA (B)" ser tocado.
5. **COUNTDOWN_B** -> **ACTIVE_B**: Processo se repete.
6. **ROUND_END**: Habilita botões para transitar ao "Julgamento" ou ir para um "Próximo Round" consecutivo caso a batalha exija extensão.

A interface responde de forma adaptativa, iluminando os botões com a cor atribuída do respectivo MC (`currentMcColor`).

---

## 6. CSS e Estilização (Tailwind v4)
- Os estilos globais de paleta estão no `index.css` via `@theme` (`var(--color-acid)`, `var(--color-red)`, `var(--color-background)`, etc).
- Os componentes fazem uso de cores literais aplicadas via estilo `inline` para a troca viva de lados dos MCs. 
- Transições dramáticas (opacidade e borders brutais) refletem quem está com o microfone ativo na BattleLive.

---

## 7. Foco da Auditoria do Claude
Para sua revisão e apontamento de refatoração, focar em:
1. **Lógica de Estado do `BattleLive.tsx`:** Analisar se a mecânica do `AudioContext` para a sirene e os hooks/intervalos para o Fade in/out de áudio (através do `audioRef.current.volume`) estão robustos e não gerarão memory leaks.
2. **Setup Manual do Bracket:** Validar a eficácia de como o React constrói e salva as escolhas de alocação de pares no `EventSetup.tsx`.
3. **Propagação do BYE:** Verificar a arquitetura inserida no `tournament.ts` para subir automaticamente o vencedor das chaves vazias e se existe algum edge case perdido.
