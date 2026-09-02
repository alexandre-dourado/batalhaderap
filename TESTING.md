# TESTING - BATALHA

## 1. Testes Manuais Frequentes (QA)
Sempre validar:
- Criação e sorteio com 4, 8, e 16 MCs.
- Execução de uma Batalha do início ao fim (Timer, Beat, Alternância de MC).
- Registro de um empate (Criação de Round 3) e posterior desempate.
- Fechar e abrir a aba (garantir persistência da batalha).
- Desconectar a internet e garantir navegação fluída.

## 2. Testes Automatizados (Futuro)
- **Unitários**: Regras do torneio (engine). Se 16 participantes, gera 8 batalhas de Oitavas de Final.
- **Unitários**: Timer. Validar formato de contagem regressiva e eventos ao zerar.
