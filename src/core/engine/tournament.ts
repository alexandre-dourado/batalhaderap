import type { Battle, Participant } from '../types';

export function getPhaseName(matchCountInPhase: number): string {
  if (matchCountInPhase === 1) return 'FINAL';
  if (matchCountInPhase === 2) return 'SEMIFINAL';
  if (matchCountInPhase === 4) return 'QUARTAS';
  if (matchCountInPhase === 8) return 'OITAVAS';
  if (matchCountInPhase === 16) return '16 AVOS';
  if (matchCountInPhase === 32) return '32 AVOS';
  return `FASE DE ${matchCountInPhase * 2}`;
}

export function generateBracket(eventId: string, participants: (Participant | null)[]): Battle[] {
  const battles: Battle[] = [];
  let totalParticipants = participants.length;
  
  // Create all battles phase by phase
  let currentPhaseMatches = totalParticipants / 2;
  let phaseIndex = 0;
  
  // Temporary storage to link next battles
  const phases: Battle[][] = [];
  
  while (currentPhaseMatches >= 1) {
    const phaseName = getPhaseName(currentPhaseMatches);
    const phaseBattles: Battle[] = [];
    
    for (let i = 0; i < currentPhaseMatches; i++) {
      phaseBattles.push({
        id: `battle_${phaseIndex}_${i}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        eventId,
        phase: phaseName,
        matchIndex: i,
        mcAId: null,
        mcBId: null,
        winnerId: null,
        state: 'pending',
        votes: [],
        nextBattleId: null,
        isTiebreaker: false
      });
    }
    
    phases.push(phaseBattles);
    currentPhaseMatches = currentPhaseMatches / 2;
    phaseIndex++;
  }
  
  // Link nextBattleId and populate first phase
  for (let p = 0; p < phases.length; p++) {
    const currentPhase = phases[p];
    const nextPhase = phases[p + 1];
    
    for (let i = 0; i < currentPhase.length; i++) {
      const battle = currentPhase[i];
      
      // Populate Phase 0 with actual participants
      if (p === 0) {
        battle.mcAId = participants[i * 2]?.id || null;
        battle.mcBId = participants[i * 2 + 1]?.id || null;
        
        // Handle BYE logic (auto-advance if one is missing)
        if (battle.mcAId && battle.mcBId) {
          battle.state = 'ready'; // Ready to start
        } else if (battle.mcAId && !battle.mcBId) {
          // A gets a BYE
          battle.winnerId = battle.mcAId;
          battle.state = 'finished';
        } else if (!battle.mcAId && battle.mcBId) {
          // B gets a BYE
          battle.winnerId = battle.mcBId;
          battle.state = 'finished';
        } else {
          // Both null? Shouldn't happen ideally, but if so, it's a finished ghost match
          battle.state = 'finished';
        }
      }
      
      // Link to next phase
      if (nextPhase) {
        const nextBattleIndex = Math.floor(i / 2);
        battle.nextBattleId = nextPhase[nextBattleIndex].id;
      }
      
      battles.push(battle);
    }
  }

  // Auto-advance BYE winners
  for (const b of battles) {
    if (b.phase !== getPhaseName(totalParticipants / 2)) continue; // Only phase 0
    if (b.state === 'finished' && b.winnerId && b.nextBattleId) {
      const nextBattle = battles.find(x => x.id === b.nextBattleId);
      if (nextBattle) {
        if (b.matchIndex % 2 === 0) {
          nextBattle.mcAId = b.winnerId;
        } else {
          nextBattle.mcBId = b.winnerId;
        }
        if (nextBattle.mcAId && nextBattle.mcBId) {
          nextBattle.state = 'ready';
        }
      }
    }
  }
  
  return battles;
}

export function advanceWinner(battles: Battle[], battleId: string, winnerId: string): Battle[] {
  const newBattles = JSON.parse(JSON.stringify(battles)) as Battle[];
  
  const currentBattle = newBattles.find(b => b.id === battleId);
  if (!currentBattle || !currentBattle.nextBattleId) {
    if (currentBattle) {
      currentBattle.winnerId = winnerId;
      currentBattle.state = 'finished';
    }
    return newBattles; // It was the final
  }
  
  currentBattle.winnerId = winnerId;
  currentBattle.state = 'finished';
  
  const nextBattle = newBattles.find(b => b.id === currentBattle.nextBattleId);
  if (nextBattle) {
    // If it's the first match feeding into the next battle, put as mcAId, else mcBId
    // Because two matches feed into one next battle.
    // Match index 0 and 1 feed into index 0. Match 0 -> mcA, Match 1 -> mcB
    if (currentBattle.matchIndex % 2 === 0) {
      nextBattle.mcAId = winnerId;
    } else {
      nextBattle.mcBId = winnerId;
    }
    
    // Check if both are ready
    if (nextBattle.mcAId && nextBattle.mcBId) {
      nextBattle.state = 'ready';
    }
  }
  
  return newBattles;
}
