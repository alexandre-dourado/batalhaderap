# PRODUCT SPEC - BATALHA

## 1. Visão Geral
O aplicativo BATALHA é uma "mesa de controle" para eventos de rap freestyle 1x1. O produto substitui ferramentas manuais e dispersas (papel, whatsapp, cronômetro de celular isolado) por um sistema integrado, offline-first.

## 2. Entidades Principais
- **Tournament/Event**: O campeonato em si. Possui configurações de quantidade de MCs e estado atual.
- **Participant (MC)**: Os competidores da batalha.
- **Battle**: O confronto entre dois MCs.
- **Round**: Os ciclos de rimas dentro de uma batalha.
- **Beat**: Arquivo de áudio utilizado como base musical.
- **Judge/Vote**: Registro do julgamento e vencedores de batalhas.

## 3. Estados da Aplicação
- **Setup**: Configurando evento, cadastrando MCs.
- **Tournament Active**: Sorteio realizado, o bracket está vivo.
- **Battle Live**: Cronômetro ativo, beat tocando.
- **Judging**: Votação em andamento.
- **Tiebreaker**: Desempate (Round 3).
- **Finished**: Campeão declarado.
