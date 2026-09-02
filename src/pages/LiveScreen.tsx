import { useParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../core/db/db';

export function LiveScreen() {
  const { id } = useParams();

  const data = useLiveQuery(async () => {
    const event = await db.events.get(id!);
    if (!event) return { event: null, battles: [] };
    const battles = await db.battles.where('eventId').equals(id!).toArray();
    
    const activeBattle = battles.find(b =>
      b.state === 'live' || b.state === 'judging' || b.state === 'tiebreaker'
    );

    if (!activeBattle) return { event, battles, battle: null, mcA: null, mcB: null };

    const mcA = event.participants.find(p => p.id === activeBattle.mcAId);
    const mcB = event.participants.find(p => p.id === activeBattle.mcBId);

    return { event, battle: activeBattle, mcA, mcB };
  }, [id]);

  if (data === undefined) return (
    <div className="h-screen w-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
      <p className="font-display text-4xl animate-pulse" style={{ color: 'var(--color-gray)' }}>CARREGANDO...</p>
    </div>
  );
  if (!data?.event) return (
    <div className="h-screen w-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
      <p className="font-display text-4xl" style={{ color: 'var(--color-red)' }}>EVENTO NÃO ENCONTRADO</p>
    </div>
  );

  const { event, battle, mcA, mcB } = data;

  return (
    <div
      className="h-screen w-screen overflow-hidden flex flex-col p-8"
      style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-offwhite)', cursor: 'none', userSelect: 'none' }}
    >
      {/* Header */}
      <header className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-4xl font-display uppercase" style={{ color: 'var(--color-acid)' }}>
            {event.name}
          </h1>
          <div className="text-2xl font-display uppercase tracking-widest" style={{ color: 'var(--color-gray)' }}>
            {battle?.phase || 'CHAVEAMENTO'}
          </div>
        </div>
        <div
          className="font-display px-6 py-2 text-3xl animate-pulse"
          style={{ border: '4px solid var(--color-red)', color: 'var(--color-red)' }}
        >
          AO VIVO
        </div>
      </header>

      {/* Main content */}
      {battle ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          {battle.state === 'judging' ? (
            <div className="text-center">
              <h2
                className="font-display mb-8 animate-pulse"
                style={{ fontSize: 'clamp(4rem, 12vw, 10rem)', color: 'var(--color-acid)' }}
              >
                VOTAÇÃO
              </h2>
              <p className="text-4xl font-display uppercase" style={{ color: 'var(--color-gray)' }}>
                Jurados decidindo...
              </p>
            </div>
          ) : (
            <div className="flex w-full items-center justify-between">
              {/* MC A */}
              <div className="flex-1 text-left overflow-hidden">
                <div
                  className="font-display uppercase leading-none truncate"
                  style={{ fontSize: 'clamp(4rem, 10vw, 12rem)', color: 'var(--color-offwhite)' }}
                >
                  {mcA?.name || '?'}
                </div>
              </div>

              {/* VS */}
              <div className="flex flex-col items-center px-8 shrink-0">
                <div className="font-display italic" style={{ fontSize: '4rem', color: 'var(--color-gray)' }}>
                  VS
                </div>
                {battle.isTiebreaker && (
                  <div
                    className="mt-4 font-display px-4 py-2 text-2xl"
                    style={{ backgroundColor: 'var(--color-red)', color: 'var(--color-offwhite)' }}
                  >
                    DESEMPATE
                  </div>
                )}
              </div>

              {/* MC B */}
              <div className="flex-1 text-right overflow-hidden">
                <div
                  className="font-display uppercase leading-none truncate"
                  style={{ fontSize: 'clamp(4rem, 10vw, 12rem)', color: 'var(--color-offwhite)' }}
                >
                  {mcB?.name || '?'}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-4xl md:text-6xl font-display uppercase text-center" style={{ color: 'var(--color-gray)' }}>
            Aguardando próxima batalha...
          </div>
        </div>
      )}

      {/* Footer */}
      <footer
        className="mt-auto pt-6 flex justify-between"
        style={{ borderTop: '2px solid rgba(119,119,119,0.3)' }}
      >
        <div className="font-display text-xl" style={{ color: 'var(--color-gray)' }}>BATALHA RAP SYSTEM V1</div>
        <div className="font-display text-xl" style={{ color: 'var(--color-gray)' }}>MESA DE CONTROLE</div>
      </footer>
    </div>
  );
}
