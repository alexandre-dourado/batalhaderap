import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../core/db/db';

export function BracketView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = useLiveQuery(async () => {
    const event = await db.events.get(id!);
    if (!event) return { event: null, battles: [] };
    const battles = await db.battles.where('eventId').equals(id!).toArray();
    return { event, battles };
  }, [id]);

  const [editingMc, setEditingMc] = useState<{ battleId: string, mcSlot: 'A'|'B', currentId: string|null } | null>(null);
  const [substituteName, setSubstituteName] = useState('');

  if (data === undefined) return (
    <div className="flex items-center justify-center h-screen">
      <p className="font-display text-2xl animate-pulse" style={{ color: 'var(--color-gray)' }}>CARREGANDO...</p>
    </div>
  );
  if (!data?.event) return (
    <div className="flex items-center justify-center h-screen">
      <p className="font-display text-2xl" style={{ color: 'var(--color-red)' }}>EVENTO NÃO ENCONTRADO</p>
    </div>
  );

  const { event, battles } = data;

  const phasesSeen = new Set<string>();
  const phases: string[] = [];
  for (const b of battles) {
    if (!phasesSeen.has(b.phase)) {
      phasesSeen.add(b.phase);
      phases.push(b.phase);
    }
  }

  const getMC = (mcId: string | null) => {
    if (!mcId) return null;
    return event.participants.find(p => p.id === mcId);
  };

  const handleSubstitute = async () => {
    if (!editingMc || !substituteName.trim()) return;
    const { battleId, mcSlot } = editingMc;
    
    // add new participant
    const newMcId = `mc_sub_${Date.now()}`;
    const newParticipant = {
      id: newMcId,
      name: substituteName.trim().toUpperCase(),
      seed: event.participants.length,
      color: '#FFFFFF' // default fallback
    };
    
    await db.events.update(event.id, {
      participants: [...event.participants, newParticipant]
    });
    
    if (mcSlot === 'A') {
      await db.battles.update(battleId, { mcAId: newMcId });
    } else {
      await db.battles.update(battleId, { mcBId: newMcId });
    }
    
    setEditingMc(null);
    setSubstituteName('');
  };

  const handleWO = async () => {
    if (!editingMc) return;
    const { battleId, mcSlot } = editingMc;
    
    const battle = battles.find(b => b.id === battleId);
    if (!battle) return;
    
    const opponentId = mcSlot === 'A' ? battle.mcBId : battle.mcAId;
    
    // auto-advance opponent
    await db.battles.update(battleId, {
      state: 'finished',
      winnerId: opponentId
    });
    
    if (battle.nextBattleId && opponentId) {
       const nextBattle = battles.find(b => b.id === battle.nextBattleId);
       if (nextBattle) {
         if (!nextBattle.mcAId) {
            await db.battles.update(battle.nextBattleId, { mcAId: opponentId, state: nextBattle.mcBId ? 'ready' : 'pending' });
         } else {
            await db.battles.update(battle.nextBattleId, { mcBId: opponentId, state: 'ready' });
         }
       }
    }
    
    setEditingMc(null);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ backgroundColor: 'var(--color-background)' }}>
      <header className="p-4 md:p-6 flex justify-between items-center shrink-0" style={{ borderBottom: '2px solid var(--color-gray)' }}>
        <div>
          <button onClick={() => navigate('/')} className="mb-2 flex items-center gap-2 text-xs font-display tracking-widest transition-colors" style={{ color: 'var(--color-gray)' }}>
            INÍCIO
          </button>
          <h1 className="text-2xl md:text-3xl font-display uppercase" style={{ color: 'var(--color-acid)' }}>
            {event.name}
          </h1>
        </div>
        <div className="flex gap-4">
          <button onClick={() => window.open(`/live/${event.id}`, '_blank')} className="px-4 py-2 flex items-center justify-center gap-2 font-display text-sm transition-colors" style={{ border: '2px solid var(--color-offwhite)', color: 'var(--color-offwhite)' }}>
            TELÃO
          </button>
          <button onClick={() => navigate('/beats')} className="px-4 py-2 flex items-center justify-center gap-2 font-display text-sm transition-colors" style={{ border: '2px solid var(--color-gray)', color: 'var(--color-gray)' }}>
            BEATS
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-x-auto p-4 md:p-8 flex gap-8 md:gap-16 items-start">
        {phases.map((phase, phaseIdx) => {
          const phaseBattles = battles.filter(b => b.phase === phase);
          return (
            <div key={phase} className="flex flex-col gap-4 min-w-[280px]">
              <h2 className="text-xl font-display mb-4 tracking-widest pb-2" style={{ color: 'var(--color-gray)', borderBottom: '2px solid var(--color-gray)' }}>
                {phase}
              </h2>

              <div className="flex flex-col gap-6" style={{ marginTop: `${phaseIdx * 48}px` }}>
                {phaseBattles.map(battle => {
                  const mcA = getMC(battle.mcAId);
                  const mcB = getMC(battle.mcBId);

                  const isReady = battle.state === 'ready';
                  const isFinished = battle.state === 'finished';
                  const isLive = battle.state === 'live' || battle.state === 'judging' || battle.state === 'tiebreaker';
                  const isPending = battle.state === 'pending';

                  const getBorderColor = () => {
                    if (isLive) return 'var(--color-red)';
                    if (isReady) return 'var(--color-offwhite)';
                    return 'var(--color-gray)';
                  };

                  return (
                    <div key={battle.id} className="relative transition-all flex flex-col" style={{ border: `2px solid ${getBorderColor()}`, opacity: isFinished ? 0.5 : 1, backgroundColor: isLive ? 'rgba(255,48,48,0.05)' : 'transparent' }}>
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-display text-xs opacity-50">BATALHA {(battle.matchIndex + 1).toString().padStart(2, '0')}</span>
                          {isLive && <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-red)' }} />}
                          {isPending && <span className="font-display text-xs opacity-40">AGUARDANDO</span>}
                          {isReady && <span className="font-display text-xs" style={{ color: 'var(--color-acid)' }}>PRONTA</span>}
                          {isFinished && <span className="font-display text-xs">FINALIZADA</span>}
                        </div>

                        <div className="flex flex-col gap-2 font-display text-xl uppercase">
                          <div 
                            className="flex justify-between items-center cursor-pointer hover:opacity-70" 
                            onClick={() => (isReady || isPending) && setEditingMc({ battleId: battle.id, mcSlot: 'A', currentId: battle.mcAId })}
                          >
                            <span style={{ color: battle.winnerId === battle.mcAId && isFinished ? 'var(--color-acid)' : mcA?.color || 'inherit' }}>
                              {mcA?.name || '?'}
                            </span>
                          </div>
                          <div className="w-full h-px opacity-20" style={{ backgroundColor: 'currentColor' }} />
                          <div 
                            className="flex justify-between items-center cursor-pointer hover:opacity-70"
                            onClick={() => (isReady || isPending) && setEditingMc({ battleId: battle.id, mcSlot: 'B', currentId: battle.mcBId })}
                          >
                            <span style={{ color: battle.winnerId === battle.mcBId && isFinished ? 'var(--color-acid)' : mcB?.color || 'inherit' }}>
                              {mcB?.name || '?'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {(isReady || isLive) && (
                        <button 
                          onClick={() => navigate(`/battle/${battle.id}`)}
                          className="w-full py-2 font-display text-sm bg-white text-black hover:bg-gray-200 transition-colors text-center"
                        >
                          IR PARA BATALHA
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {editingMc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}>
          <div className="w-full max-w-md p-6 flex flex-col gap-6" style={{ backgroundColor: 'var(--color-background)', border: '2px solid var(--color-acid)' }}>
            <div className="flex justify-between items-center">
              <h2 className="font-display text-2xl" style={{ color: 'var(--color-acid)' }}>AÇÕES DO MC</h2>
              <button onClick={() => setEditingMc(null)} className="font-display text-2xl text-gray-400">X</button>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="font-display">SUBSTITUIR MC (Novo Nome):</label>
              <input 
                type="text" 
                value={substituteName} 
                onChange={e => setSubstituteName(e.target.value)} 
                className="font-display p-2 uppercase" 
                style={{ backgroundColor: 'transparent', border: '1px solid var(--color-offwhite)', color: 'var(--color-offwhite)' }}
              />
              <button onClick={handleSubstitute} className="py-2 mt-2 font-display bg-white text-black uppercase">SUBSTITUIR</button>
            </div>

            <div className="w-full h-px opacity-20" style={{ backgroundColor: 'var(--color-gray)' }} />

            <button onClick={handleWO} className="py-3 font-display border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white uppercase transition-colors">
              DECLARAR W.O. (AVANÇAR ADVERSÁRIO)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
