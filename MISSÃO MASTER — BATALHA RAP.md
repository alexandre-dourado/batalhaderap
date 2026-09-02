# MISSÃO MASTER — BATALHA RAP
## Offline-first Tournament & Live Battle App
### Codename: BATALHA

Você é o **agente principal de produto, UX/UI, engenharia, QA e empacotamento** responsável por construir, em uma única execução coordenada, um MVP funcional de uma aplicação para organização e operação de batalhas de rap freestyle.

O objetivo não é produzir um mockup.

O objetivo é entregar um **produto executável, navegável, testável e distribuível offline**, capaz de conduzir uma batalha real de 1x1 do início ao fim.

---

# 0. REGRA SUPREMA

Não construa uma apresentação sobre o produto.

**CONSTRUA O PRODUTO.**

Ao final desta missão deve existir uma aplicação funcional que possa ser:

1. executada localmente;
2. utilizada sem internet depois da instalação/carregamento inicial;
3. instalada como PWA;
4. utilizada em celular, tablet e desktop;
5. utilizada durante uma batalha real;
6. carregada com dados de demonstração;
7. exportada/baixada para uso local;
8. reinstalada sem perder a capacidade de funcionar offline.

Não deixe funcionalidades críticas como placeholders.

Se alguma decisão não estiver especificada, escolha a solução mais simples, robusta e coerente com um MVP offline-first.

---

# 1. NOME E POSICIONAMENTO

Nome do produto:

# BATALHA

Subtítulo:

**Organize. Rime. Julgue. Avance.**

Conceito:

> Uma cabine de controle digital para batalhas de freestyle.

O produto substitui, em um fluxo integrado:

- lista de participantes;
- sorteio;
- chaveamento;
- cronômetro;
- player de beat;
- controle dos rounds;
- julgamento;
- desempate;
- atualização da chave;
- placar;
- telão.

Não transforme o produto em rede social.

Não criar feed.

Não criar chat.

Não criar sistema de seguidores.

Não criar marketplace.

Não criar ranking nacional nesta versão.

---

# 2. EQUIPE DE SUBAGENTES

Antes da implementação, organize internamente o trabalho em subagentes especializados.

Utilize subagentes quando isso reduzir erros ou acelerar a execução.

## SUBAGENTE 01 — PRODUCT ARCHITECT

Responsabilidades:

- consolidar requisitos;
- definir entidades;
- definir estados;
- definir fluxos;
- definir regras;
- identificar ambiguidades;
- produzir uma arquitetura mínima.

Entregável interno:

`PRODUCT_SPEC.md`

---

## SUBAGENTE 02 — UX ARCHITECT

Responsabilidades:

Mapear:

- onboarding;
- criação de evento;
- cadastro;
- sorteio;
- bracket;
- batalha;
- julgamento;
- resultado;
- telão;
- configurações.

Entregável:

`UX_FLOW.md`

---

## SUBAGENTE 03 — VISUAL DESIGNER

Responsabilidades:

Criar:

- identidade visual;
- design system;
- tipografia;
- cores;
- componentes;
- estados;
- hierarquia visual;
- linguagem do produto.

Entregável:

`DESIGN_SYSTEM.md`

---

## SUBAGENTE 04 — UI IMPLEMENTER

Responsável por transformar o design system em componentes reais.

---

## SUBAGENTE 05 — TOURNAMENT ENGINEER

Responsável exclusivamente pela lógica:

- sorteio;
- bracket;
- rounds;
- vitórias;
- empates;
- desempates;
- progressão;
- estados.

---

## SUBAGENTE 06 — OFFLINE/PWA ENGINEER

Responsável por:

- IndexedDB;
- persistência;
- service worker;
- cache;
- instalação;
- offline;
- exportação;
- importação;
- recuperação após fechamento.

---

## SUBAGENTE 07 — AUDIO ENGINEER

Responsável por:

- upload de beats;
- armazenamento local;
- reprodução;
- pause;
- volume;
- seleção;
- controle durante rounds.

---

## SUBAGENTE 08 — QA ENGINEER

Testar:

- lógica;
- interface;
- responsividade;
- timer;
- áudio;
- empate;
- bracket;
- persistência;
- offline;
- recuperação.

---

# 3. ORDEM DE EXECUÇÃO

Execute em fases.

Não pule diretamente para UI.

## FASE 01
Discovery + arquitetura

## FASE 02
Design system

## FASE 03
Arquitetura técnica

## FASE 04
Tournament Engine

## FASE 05
Persistência offline

## FASE 06
UI principal

## FASE 07
Audio + Timer

## FASE 08
Judging

## FASE 09
Live screen

## FASE 10
PWA + exportação

## FASE 11
QA

## FASE 12
Build final

---

# 4. STACK

Priorize uma arquitetura simples.

Preferência:

- React
- TypeScript
- Vite
- Tailwind CSS ou CSS modular
- IndexedDB
- Service Worker
- PWA
- Web Audio / HTML5 Audio
- localStorage apenas para configurações pequenas

Não utilizar backend obrigatório.

Não depender de:

- Firebase;
- Supabase;
- APIs externas;
- autenticação externa;
- banco remoto;
- CDN obrigatório;
- internet para funcionalidades essenciais.

O aplicativo deve funcionar como um **sistema local**.

---

# 5. PRINCÍPIO OFFLINE-FIRST

Esta é uma exigência estrutural.

A aplicação deve seguir:

> **Local-first, não online-first com fallback offline.**

Toda informação essencial deve existir localmente.

Persistir:

```text
events
participants
judges
battles
rounds
votes
results
beats metadata
settings
app state
```

Utilizar IndexedDB para dados estruturados.

---

# 6. EXPORTAÇÃO E IMPORTAÇÃO

Criar:

## EXPORTAR EVENTO

Gerar arquivo:

`batalha-evento.json`

Contendo:

- evento;
- participantes;
- bracket;
- resultados;
- configurações;
- metadados;
- votos;
- histórico.

Criar:

## IMPORTAR EVENTO

O usuário seleciona um `.json`.

O sistema:

1. valida;
2. mostra resumo;
3. confirma;
4. restaura o campeonato.

---

# 7. BACKUP

Adicionar:

### EXPORTAR BACKUP

e:

### IMPORTAR BACKUP

Também criar:

### AUTO-SAVE

Após cada alteração importante.

Exemplos:

- participante adicionado;
- sorteio;
- início de batalha;
- fim de round;
- voto;
- resultado;
- alteração de configuração.

---

# 8. FORMATO DO MVP

Implementar:

# 1 × 1 FREESTYLE

Sistema:

**eliminação simples**

Suportar:

- 4 participantes;
- 8;
- 16;
- 32;
- 64.

---

# 9. CONFIGURAÇÃO DO EVENTO

Tela:

`Criar campeonato`

Campos:

### Nome

Exemplo:

`Batalha da Praça #01`

### Local

Opcional.

### Data

Opcional.

### Quantidade

4 / 8 / 16 / 32 / 64

### Formato

MVP:

`1 × 1`

---

# 10. PARTICIPANTES

Permitir:

### adicionar individualmente

ou:

### colar lista

Exemplo:

```text
Neo
Kadu
L7
Shark
Mago
Dex
```

Transformar automaticamente em participantes.

Validar:

- nome vazio;
- duplicados;
- quantidade;
- nomes muito longos.

Permitir editar/remover antes do sorteio.

Depois do início do campeonato:

**bloquear alterações estruturais**, salvo ação explícita de reset.

---

# 11. SORTEIO

Criar uma tela de sorteio visual.

Fluxo:

```text
PARTICIPANTES
      ↓
SORTEAR
      ↓
CHAVE
```

O sorteio deve ser aleatório.

Registrar:

- timestamp;
- participantes;
- seed/random state quando possível.

Permitir:

`Refazer sorteio`

somente antes do início da primeira batalha.

---

# 12. BRACKET

Criar bracket visual.

Exemplo:

```text
OITAVAS

Neo ─────┐
         ├── ?
Kadu ────┘

L7 ──────┐
         ├── ?
Shark ───┘
```

Evoluir automaticamente:

```text
OITAVAS
   ↓
QUARTAS
   ↓
SEMIFINAL
   ↓
FINAL
```

O bracket deve refletir resultados em tempo real.

---

# 13. MOTOR DE BATALHA

Criar uma máquina de estados clara.

Exemplo:

```text
READY
↓
DRAW_STARTER
↓
ROUND_READY
↓
MC_A_ACTIVE
↓
MC_A_FINISHED
↓
MC_B_ACTIVE
↓
MC_B_FINISHED
↓
ROUND_FINISHED
↓
NEXT_ROUND
↓
JUDGING
↓
RESULT
↓
ADVANCE
```

Empate:

```text
JUDGING
↓
DRAW
↓
TIEBREAKER
↓
ROUND_EXTRA
↓
JUDGING
```

Nunca utilizar lógica espalhada aleatoriamente pelos componentes React.

Centralizar a lógica.

---

# 14. CONFIGURAÇÃO DOS ROUNDS

Default:

## ROUND 1

MC A: 30s

MC B: 30s

## ROUND 2

MC A: 30s

MC B: 30s

## EMPATE

ROUND 3:

MC A: 30s

MC B: 30s

Permitir configurar:

- 15s;
- 30s;
- 45s;
- 60s;
- custom.

---

# 15. QUEM COMEÇA

Criar botão:

# 🎲 SORTEAR QUEM COMEÇA

Animação curta.

Resultado:

```text
NEO COMEÇA
```

Configurações:

```text
Sorteio no início
Alternância
Organizador decide
Sorteio por round
```

Default:

**sorteio no início da batalha.**

---

# 16. TIMER

O timer é uma funcionalidade crítica.

Requisitos:

- contagem regressiva;
- precisão razoável;
- pausa;
- continuar;
- reset;
- indicação visual;
- indicação sonora;
- mudança automática de MC;
- finalização automática.

Não implementar o timer apenas utilizando decremento ingênuo de estado React.

Utilizar timestamp/performance clock para evitar drift.

Estados:

```text
30
29
28
...
03
02
01
00
```

Ao chegar a zero:

### TEMPO!

Reproduzir sinal sonoro.

---

# 17. BEATS

Criar biblioteca local.

Tela:

# BEATS

Permitir:

- importar áudio;
- nomear beat;
- excluir;
- reproduzir;
- pausar;
- volume;
- selecionar.

Metadados:

```text
id
name
filename
duration
createdAt
```

Os arquivos devem ser armazenados localmente quando tecnicamente possível.

Não depender de URL externa.

---

# 18. PLAYER

Durante a batalha:

```text
BEAT
────────────────

▶  Dark Boom Bap

00:14 / 03:27

[⏮] [▶/Ⅱ] [⏭]

Volume ───────
```

O player deve continuar funcional enquanto o timer opera.

---

# 19. TELA PRINCIPAL DA BATALHA

Essa é a tela mais importante.

Desktop:

```text
┌─────────────────────────────────────────────┐
│ BATALHA #03                     OITAVAS      │
├─────────────────────────────────────────────┤
│                                             │
│       NEO             VS            KADU    │
│                                             │
│                  ROUND 01                   │
│                                             │
│                    00:27                    │
│                                             │
│               ███████████░░                 │
│                                             │
│              🎵 DARK BOOM BAP               │
│                                             │
│       [ PLAY ]          [ PAUSAR ]          │
│                                             │
│               NEO COMEÇA                    │
│                                             │
└─────────────────────────────────────────────┘
```

Mobile deve reorganizar a hierarquia.

---

# 20. CONTROLES DO OPERADOR

Durante a batalha:

- iniciar;
- pausar;
- continuar;
- encerrar round;
- reiniciar round;
- trocar beat;
- alterar volume;
- sortear início;
- avançar;
- abrir julgamento;
- cancelar/resetar ação com confirmação.

Evitar botões perigosos próximos uns dos outros.

---

# 21. JURADOS

Configurar:

1 jurado;
3 jurados;
5 jurados.

No MVP, votação simples.

Cada jurado escolhe:

```text
NEO
KADU
```

Opcional:

```text
EMPATE
```

---

# 22. MODO JURADO

Criar interface extremamente simples.

```text
BATALHA #03

NEO

VS

KADU

──────────────

QUEM VENCEU?

[ NEO ]

[ KADU ]

[ EMPATE ]
```

Após votar:

```text
✓ VOTO REGISTRADO
```

Bloquear voto duplicado.

---

# 23. RESULTADO

Mostrar:

```text
RESULTADO

NEO      2
KADU     1

━━━━━━━━━━

VENCEDOR

NEO

[ AVANÇAR ]
```

Se empate:

```text
EMPATE

ROUND EXTRA

[ INICIAR ]
```

---

# 24. HISTÓRICO

Cada batalha deve registrar:

- adversários;
- rounds;
- quem começou;
- beats usados;
- duração;
- votos;
- vencedor;
- timestamp.

Isso permitirá estatísticas futuramente.

---

# 25. TELÃO

Criar rota:

`/live/:eventId`

Interface sem controles administrativos.

Mostrar:

- evento;
- fase;
- MCs;
- round;
- timer;
- beat;
- vencedor;
- próximo confronto.

Ideal para:

- TV;
- projetor;
- notebook;
- segundo monitor.

Criar modo:

# FULLSCREEN

---

# 26. DESIGN SYSTEM

A estética deve fugir do visual genérico de SaaS.

Direção:

# STREET × SPORTS × BRUTALIST DIGITAL

Misturar:

- cultura de batalha;
- cartaz de evento;
- scoreboard esportivo;
- tipografia editorial;
- interface de controle;
- estética underground.

Não fazer uma estética "hip hop infantil".

Não exagerar em grafites, correntes, notas de dinheiro, boomboxes ou clichês visuais.

---

# 27. IDENTIDADE VISUAL

Paleta base:

### Preto
`#090909`

### Off-white
`#F4F0E8`

### Vermelho
`#FF3030`

### Amarelo ácido
`#F5E600`

### Cinza
`#777777`

Utilizar vermelho/amarelo como estados de ação.

Interface predominantemente preta/off-white.

---

# 28. TIPOGRAFIA

Utilizar uma fonte display condensada/brutalista para:

- nomes dos MCs;
- rounds;
- resultados;
- placar.

Fonte secundária limpa para:

- controles;
- menus;
- configurações.

Priorizar fontes disponíveis localmente ou empacotáveis.

Evitar dependência de Google Fonts online.

---

# 29. LINGUAGEM VISUAL

Elementos:

- grids;
- linhas;
- números gigantes;
- labels técnicos;
- bordas;
- blocos;
- alto contraste;
- pequenos indicadores;
- textura sutil.

Criar sensação de:

> **placar esportivo + cabine de DJ + cartaz de batalha.**

---

# 30. MICROINTERAÇÕES

Adicionar somente onde melhoram a experiência:

- sorteio;
- início do round;
- mudança de MC;
- tempo acabando;
- voto registrado;
- vencedor;
- avanço no bracket.

Não transformar a aplicação em um parque de animações.

---

# 31. IMAGENS GERADAS

Você pode utilizar no máximo:

# 4 imagens geradas.

Use geração de imagem apenas onde realmente houver ganho visual.

## IMAGEM 01 — HERO / IDENTIDADE

Criar uma composição abstrata inspirada em:

- microfone;
- ondas sonoras;
- tipografia;
- textura urbana;
- cartaz de batalha;
- brutalismo;
- preto/off-white/vermelho/amarelo.

Não utilizar pessoas reais.

Não colocar texto ilegível gerado pela IA.

Usar como asset visual de identidade.

---

## IMAGEM 02 — TEXTURA

Criar textura abstrata:

- papel;
- xerox;
- ruído;
- impressão;
- halftone;
- desgaste;
- street poster.

Usar como textura sutil do sistema.

---

## IMAGEM 03 — BEAT LIBRARY

Criar uma arte abstrata para representar a biblioteca de beats.

Sem texto.

Formato quadrado.

---

## IMAGEM 04 — EVENT COVER

Criar uma arte vertical para capa de campeonato.

Permitir que o nome do evento seja sobreposto pelo CSS.

Sem depender de texto gerado na imagem.

As imagens devem ser tratadas como assets locais.

Se o ambiente não suportar geração automática de imagens, criar placeholders vetoriais/gradientes equivalentes e continuar a implementação.

**Não bloquear o projeto pela ausência das imagens.**

---

# 32. RESPONSIVIDADE

Prioridades:

### 1º celular

Uso do operador pode ocorrer segurando o celular.

### 2º tablet

Ideal para operação.

### 3º desktop

Ideal para configuração.

### 4º telão

Ideal para live view.

Criar breakpoints coerentes.

---

# 33. ACESSIBILIDADE

Implementar:

- contraste adequado;
- foco visível;
- navegação por teclado;
- labels;
- aria quando necessário;
- botões grandes no modo batalha;
- não depender apenas de cor para indicar estado.

---

# 34. DADOS DE DEMONSTRAÇÃO

Criar botão:

# CARREGAR DEMO

Gerar campeonato:

**BATALHA DA PRAÇA #01**

16 participantes fictícios:

```text
NEO
KADU
L7
SHARK
MAGO
DEX
NIX
RATO
GOMA
BK
ZERO
MALOKA
JOTA
DREW
CAIO
VEX
```

Criar alguns beats demo, preferencialmente com arquivos de áudio locais mínimos ou placeholders funcionais se não houver áudio fornecido.

A demo deve permitir testar o fluxo completo.

---

# 35. MODO DE TESTE

Criar uma forma rápida de testar rounds.

Nas configurações de desenvolvimento/demo:

```text
Timer demo:
5 segundos
```

Assim o QA consegue testar uma batalha completa rapidamente.

Não expor isso como configuração normal ao público final.

---

# 36. ERROS E RECUPERAÇÃO

O sistema deve sobreviver a:

- refresh;
- fechar aba;
- reabrir aplicação;
- perda momentânea de internet;
- tentativa de importar arquivo inválido;
- áudio inexistente;
- votação incompleta;
- round interrompido.

Se o usuário fechar durante uma batalha:

Ao reabrir:

```text
BATALHA EM ANDAMENTO

NEO vs KADU

Deseja continuar?

[ CONTINUAR ]
[ ABANDONAR ]
```

---

# 37. CONFIRMAÇÕES

Ações destrutivas precisam de confirmação:

- excluir evento;
- apagar participante;
- resetar campeonato;
- apagar beat;
- abandonar batalha;
- apagar backup.

---

# 38. ARQUITETURA DE COMPONENTES

Estruturar componentes aproximadamente assim:

```text
src/
├── app/
├── components/
│   ├── ui/
│   ├── bracket/
│   ├── battle/
│   ├── timer/
│   ├── audio/
│   ├── judging/
│   └── live/
├── features/
│   ├── tournament/
│   ├── participants/
│   ├── battles/
│   ├── judging/
│   └── beats/
├── engine/
│   ├── tournament/
│   ├── battle/
│   ├── rules/
│   └── random/
├── storage/
│   ├── indexeddb/
│   ├── export/
│   └── import/
├── hooks/
├── types/
├── utils/
└── assets/
```

A estrutura pode ser modificada se houver justificativa técnica.

---

# 39. TIPOS

Criar tipos explícitos para:

```text
Event
Participant
Judge
Battle
Round
Vote
Beat
TournamentSettings
BattleSettings
Bracket
TournamentState
```

Evitar `any`.

---

# 40. TESTES AUTOMATIZADOS

Criar testes para:

### Tournament Engine

- 4 participantes;
- 8;
- 16;
- 32;
- 64;
- progressão;
- vencedor;
- derrota;
- empate;
- round extra;
- final.

### Random

- todos participantes aparecem;
- nenhum duplicado;
- quantidade correta.

### Timer

- inicia;
- pausa;
- continua;
- termina;
- reset.

### Judging

- voto válido;
- voto duplicado bloqueado;
- maioria;
- empate;
- desempate.

### Storage

- salvar;
- recuperar;
- exportar;
- importar.

---

# 41. TESTE MANUAL PRINCIPAL

Executar mentalmente e/ou automaticamente este cenário:

```text
CRIAR EVENTO
↓
16 PARTICIPANTES
↓
SORTEAR
↓
ABRIR BRACKET
↓
INICIAR BATALHA
↓
SORTEAR COMEÇO
↓
PLAY BEAT
↓
ROUND 1
↓
ROUND 2
↓
JURADOS
↓
EMPATE
↓
ROUND 3
↓
JURADOS
↓
VENCEDOR
↓
PRÓXIMA BATALHA
↓
BRACKET ATUALIZADO
↓
REFRESH
↓
ESTADO PRESERVADO
↓
OFFLINE
↓
CONTINUAR
```

Esse fluxo deve funcionar.

---

# 42. INSTALAÇÃO PWA

Configurar:

- manifest;
- ícone;
- splash quando suportado;
- service worker;
- cache;
- instalação.

Nome:

**BATALHA**

Descrição:

**Organize, conduza e julgue batalhas de freestyle.**

---

# 43. ÍCONE

Criar ícone simples.

Conceito:

### B

ou

### microfone + bracket

Evitar detalhes pequenos.

Precisa funcionar em:

- favicon;
- PWA;
- celular.

---

# 44. OFFLINE INDICATOR

Mostrar discretamente:

```text
● ONLINE
```

ou:

```text
● OFFLINE
```

Mas a aplicação deve continuar funcionando.

Quando offline:

```text
MODO OFFLINE
Todos os dados estão salvos neste dispositivo.
```

Não apresentar isso como erro.

Offline é um estado normal do produto.

---

# 45. SEGURANÇA DE DADOS

Não armazenar dados sensíveis.

Não pedir:

- CPF;
- endereço;
- telefone;
- documento.

O MVP trabalha com nomes artísticos.

---

# 46. NÃO IMPLEMENTAR

Explicitamente fora do escopo:

- login;
- cadastro de usuários;
- cloud sync;
- rede social;
- comentários;
- ranking global;
- pagamentos;
- anúncios;
- IA julgadora;
- transcrição;
- análise automática de rimas;
- streaming externo;
- 2x2;
- 3x3;
- crew;
- liga;
- temporadas.

Mas a arquitetura deve permitir essas extensões futuramente.

---

# 47. PREPARAÇÃO PARA V2

Não implementar agora, mas criar abstrações para:

```text
BattleFormat
Team
ScoringSystem
AudienceVoting
League
Ranking
```

O formato não deve estar hardcoded em dezenas de componentes.

Exemplo conceitual:

```ts
interface BattleFormat {
  id: string
  name: string
  participantsPerSide: number
  rounds: RoundRule[]
  judging: JudgingRule
  tiebreaker: TiebreakerRule
}
```

A V1 utiliza:

```text
1v1
```

---

# 48. PRINCÍPIO DE UX

Durante uma batalha, o operador não pode precisar pensar.

A interface deve responder:

> O que está acontecendo?

> Quem está rimando?

> Quanto tempo falta?

> Qual beat está tocando?

> O que faço agora?

> Quem venceu?

A tela de batalha deve ser a interface mais simples de todo o aplicativo.

---

# 49. ESTADOS VISUAIS

Definir claramente:

- idle;
- ready;
- live;
- paused;
- warning;
- finished;
- judging;
- draw;
- winner;
- error;
- offline.

---

# 50. EMPTY STATES

Criar estados úteis:

Sem eventos:

```text
AINDA NÃO HÁ BATALHAS

Crie seu primeiro campeonato.
[ CRIAR BATALHA ]
```

Sem beats:

```text
NENHUM BEAT ADICIONADO

Importe seus beats para usar durante as batalhas.
[ IMPORTAR BEAT ]
```

Sem participantes:

```text
ADICIONE OS MCs
```

---

# 51. FINALIZAÇÃO

Ao terminar a implementação:

1. executar testes;
2. corrigir erros;
3. executar build;
4. verificar PWA;
5. verificar offline;
6. verificar IndexedDB;
7. verificar exportação;
8. verificar importação;
9. testar responsividade;
10. testar fluxo demo;
11. remover console errors;
12. remover placeholders desnecessários;
13. verificar acessibilidade básica.

---

# 52. DOCUMENTAÇÃO

Criar:

```text
README.md
PRODUCT_SPEC.md
UX_FLOW.md
DESIGN_SYSTEM.md
ARCHITECTURE.md
TESTING.md
```

README deve explicar:

- o que é;
- como executar;
- como gerar build;
- como instalar;
- como utilizar offline;
- como exportar;
- como importar;
- como carregar demo.

---

# 53. CRITÉRIOS DE ACEITE

O produto só é considerado pronto se:

### FUNCIONAL

[ ] criar campeonato

[ ] cadastrar participantes

[ ] colar lista

[ ] gerar bracket

[ ] sortear

[ ] iniciar batalha

[ ] sortear quem começa

[ ] tocar beat

[ ] timer funcionar

[ ] trocar MC automaticamente

[ ] executar round 2

[ ] julgar

[ ] detectar empate

[ ] executar round extra

[ ] declarar vencedor

[ ] atualizar bracket

[ ] avançar campeonato

[ ] mostrar telão

---

### OFFLINE

[ ] persistência local

[ ] refresh não destrói estado

[ ] fechar/reabrir mantém dados

[ ] funcionamento sem internet

[ ] PWA instalável

[ ] exportação JSON

[ ] importação JSON

---

### UI

[ ] mobile

[ ] tablet

[ ] desktop

[ ] telão

[ ] modo fullscreen

[ ] estados visuais

[ ] acessibilidade básica

---

### QUALIDADE

[ ] sem erros críticos no console

[ ] build funcionando

[ ] testes principais passando

[ ] dados demo funcionando

[ ] README completo

---

# 54. PRINCÍPIO FINAL DE IMPLEMENTAÇÃO

Se houver conflito entre:

**mais funcionalidades**

e

**maior confiabilidade**

escolha:

# CONFIABILIDADE.

Se houver conflito entre:

**design chamativo**

e

**legibilidade durante uma batalha**

escolha:

# LEGIBILIDADE.

Se houver conflito entre:

**arquitetura sofisticada**

e

**MVP funcionando**

escolha:

# MVP FUNCIONANDO.

---

# 55. DEFINITION OF DONE

A missão termina somente quando você puder responder:

> "Consigo pegar um notebook ou celular sem internet, abrir o BATALHA, criar um campeonato de 16 MCs, sortear a chave, conduzir uma batalha com beat e cronômetro, receber votos dos jurados, resolver um empate com round extra, declarar o vencedor e avançar o campeonato?"

Se a resposta for **sim**, o MVP está pronto.

Se a resposta for **não**, continue implementando e corrigindo.

Não pare na documentação.

Não pare no mockup.

Não pare no design.

# ENTREGUE O SOFTWARE FUNCIONANDO.