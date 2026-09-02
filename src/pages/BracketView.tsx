import { useParams, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../core/db/db';

export function BracketView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = useLiveQuery(() => db.events.get(id!));

  if (event === undefined) return (
    <div className="flex items-center justify-center h-screen">
      <p className="font-display text-2xl animate-pulse" style={{ color: 'var(--color-gray)' }}>CARREGANDO...</p>
    </div>
  );
  if (!event) return (
    <div className="flex items-center justify-center h-screen">
      <p className="font-display text-2xl" style={{ color: 'var(--color-red)' }}>EVENTO NÃO ENCONTRADO</p>
    </div>
  );

  // Maintain phase order by first appearance in battles array
  const phasesSeen = new Set<string>();
  const phases: string[] = [];
  for (const b of event.battles) {
    if (!phasesSeen.has(b.phase)) {
      phasesSeen.add(b.phase);
      phases.push(b.phase);
    }
  }

  const getMCName = (mcId: string | null) => {
    if (!mcId) return '?';
    return event.participants.find(p => p.id === mcId)?.name || '?';
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Header */}
      <header
        className="p-4 md:p-6 flex justify-between items-center shrink-0"
        style={{ borderBottom: '2px solid var(--color-gray)' }}
      >
        <div>
          <button
            onClick={() => navigate('/')}
            className="mb-2 text-xs font-display tracking-widest uppercase flex items-center gap-2 transition-colors"
            style={{ color: 'var(--color-gray)' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = 'white';
              (e.currentTarget.querySelector('img') as HTMLElement).style.filter = 'drop-shadow(0 0 2px white)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = 'var(--color-gray)';
              (e.currentTarget.querySelector('img') as HTMLElement).style.filter = 'none';
            }}
          >
            <img src="/assets/batalha/navigation/icon-arrow-left.png" alt="Início" className="h-4 object-contain transition-all" />
            INÍCIO
          </button>
          <h1 className="text-2xl md:text-3xl font-display uppercase" style={{ color: 'var(--color-acid)' }}>
            {event.name}
          </h1>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => window.open(`/live/${event.id}`, '_blank')}
            className="px-4 py-2 flex items-center justify-center gap-2 font-display text-sm transition-colors"
            style={{ border: '2px solid var(--color-offwhite)', color: 'var(--color-offwhite)' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-offwhite)';
              (e.currentTarget as HTMLElement).style.color = 'var(--color-background)';
              (e.currentTarget.querySelector('img') as HTMLElement).style.filter = 'invert(1)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
              (e.currentTarget as HTMLElement).style.color = 'var(--color-offwhite)';
              (e.currentTarget.querySelector('img') as HTMLElement).style.filter = 'none';
            }}
          >
            <img src="/assets/batalha/navigation/icon-screen.png" alt="Telão" className="h-6 object-contain transition-all" />
            TELÃO
          </button>
          <button
            onClick={() => navigate('/beats')}
            className="px-4 py-2 flex items-center justify-center gap-2 font-display text-sm transition-colors"
            style={{ border: '2px solid var(--color-gray)', color: 'var(--color-gray)' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-offwhite)';
              (e.currentTarget as HTMLElement).style.color = 'var(--color-offwhite)';
              (e.currentTarget.querySelector('img') as HTMLElement).style.filter = 'drop-shadow(0 0 2px var(--color-offwhite))';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-gray)';
              (e.currentTarget as HTMLElement).style.color = 'var(--color-gray)';
              (e.currentTarget.querySelector('img') as HTMLElement).style.filter = 'none';
            }}
          >
            <img src="/assets/batalha/navigation/icon-vinyl.png" alt="Beats" className="h-6 object-contain opacity-70 transition-all" />
            BEATS
          </button>
        </div>
      </header>

      {/* Bracket scroll area */}
      <div className="flex-1 overflow-x-auto p-4 md:p-8 flex gap-8 md:gap-16 items-start">
        {phases.map((phase, phaseIdx) => {
          const phaseBattles = event.battles.filter(b => b.phase === phase);

          return (
            <div key={phase} className="flex flex-col gap-4 min-w-[280px]">
              <h2
                className="text-xl font-display mb-4 tracking-widest pb-2"
                style={{ color: 'var(--color-gray)', borderBottom: '2px solid var(--color-gray)' }}
              >
                {phase}
              </h2>

              <div className="flex flex-col gap-6" style={{ marginTop: `${phaseIdx * 48}px` }}>
                {phaseBattles.map(battle => {
                  const mcA = getMCName(battle.mcAId);
                  const mcB = getMCName(battle.mcBId);

                  const isReady = battle.state === 'ready';
                  const isFinished = battle.state === 'finished';
                  const isLive = battle.state === 'live' || battle.state === 'judging' || battle.state === 'tiebreaker';
                  const isPending = battle.state === 'pending';

                  const getBorderColor = () => {
                    if (isLive) return 'var(--color-red)';
                    if (isReady) return 'var(--color-offwhite)';
                    return 'var(--color-gray)';
                  };

                  const getTextColor = () => {
                    if (isLive) return 'var(--color-red)';
                    if (isReady) return 'var(--color-offwhite)';
                    return 'var(--color-gray)';
                  };

                  return (
                    <div
                      key={battle.id}
                      onClick={() => (isReady || isLive) && navigate(`/battle/${battle.id}`)}
                      className="p-4 relative transition-all"
                      style={{
                        border: `2px solid ${getBorderColor()}`,
                        color: getTextColor(),
                        opacity: isFinished ? 0.5 : 1,
                        cursor: (isReady || isLive) ? 'pointer' : 'default',
                        backgroundColor: isLive ? 'rgba(255,48,48,0.05)' : 'transparent'
                      }}
                    >
                      {/* Status line */}
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-display text-xs opacity-50">
                          BATALHA {(battle.matchIndex + 1).toString().padStart(2, '0')}
                        </span>
                        {isLive && (
                          <span
                            className="w-2 h-2 rounded-full animate-pulse"
                            style={{ backgroundColor: 'var(--color-red)' }}
                          />
                        )}
                        {isPending && (
                          <span className="font-display text-xs opacity-40">AGUARDANDO</span>
                        )}
                        {isReady && (
                          <span className="font-display text-xs" style={{ color: 'var(--color-acid)' }}>PRONTA</span>
                        )}
                        {isFinished && (
                          <span className="font-display text-xs">FINALIZADA</span>
                        )}
                      </div>

                      {/* MCs */}
                      <div className="flex flex-col gap-2 font-display text-xl uppercase">
                        <div className="flex justify-between items-center">
                          <span style={{ color: battle.winnerId === battle.mcAId && isFinished ? 'var(--color-acid)' : undefined }}>
                            {mcA}
                          </span>
                          {battle.winnerId === battle.mcAId && isFinished && (
                            <span style={{ color: 'var(--color-acid)' }}>✓ VENCEDOR</span>
                          )}
                        </div>
                        <div className="w-full h-px opacity-20" style={{ backgroundColor: 'currentColor' }} />
                        <div className="flex justify-between items-center">
                          <span style={{ color: battle.winnerId === battle.mcBId && isFinished ? 'var(--color-acid)' : undefined }}>
                            {mcB}
                          </span>
                          {battle.winnerId === battle.mcBId && isFinished && (
                            <span style={{ color: 'var(--color-acid)' }}>✓ VENCEDOR</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
