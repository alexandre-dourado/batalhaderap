import { useLiveQuery } from 'dexie-react-hooks';
import { useNavigate } from 'react-router-dom';
import { db } from '../core/db/db';
import { generateBracket } from '../core/engine/tournament';

export function Home() {
  const navigate = useNavigate();
  const events = useLiveQuery(() => db.events.toArray());

  const loadDemo = async () => {
    const demoId = `demo_${Date.now()}`;
    const mcNames = ['NEO', 'KADU', 'L7', 'SHARK', 'MAGO', 'DEX', 'NIX', 'RATO', 'GOMA', 'BK', 'ZERO', 'MALOKA', 'JOTA', 'DREW', 'CAIO', 'VEX'];

    const shuffled = [...mcNames].sort(() => Math.random() - 0.5);
    const participants = shuffled.map((name, index) => ({
      id: `mc_${index}_${Date.now()}`,
      name,
      seed: index
    }));

    const battles = generateBracket(demoId, participants);
    
    await db.battles.bulkAdd(battles);
    await db.events.add({
      id: demoId,
      name: 'Batalha Demo',
      date: Date.now(),
      settings: { participantsCount: 16, roundTime: 45, format: '1v1' },
      participants: participants as any,
      state: 'active',
      createdAt: Date.now()
    });

    navigate(`/event/${demoId}`);
  };

  const handleExport = async (eventId: string) => {
    const event = await db.events.get(eventId);
    if (!event) return;
    const blob = new Blob([JSON.stringify(event, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `batalha-evento-${eventId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const imported = JSON.parse(ev.target?.result as string);
        if (imported.id && imported.name && imported.participants) {
          await db.events.put(imported);
          alert('Evento importado com sucesso!');
        } else {
          alert('Arquivo inválido. Verifique se é um backup do BATALHA.');
        }
      } catch {
        alert('Erro ao importar: JSON inválido.');
      }
    };
    reader.readAsText(file);
  };

  if (!events) return (
    <div className="flex items-center justify-center h-screen">
      <p className="font-display text-2xl animate-pulse" style={{ color: 'var(--color-gray)' }}>CARREGANDO...</p>
    </div>
  );

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-4"
      style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-offwhite)' }}
    >
      {/* Hero */}
      <img src="/assets/logo-batalha.png" alt="BATALHA RAP" className="w-full max-w-2xl mb-2 px-4" />
      <p className="text-base md:text-xl mb-12 uppercase tracking-widest" style={{ color: 'var(--color-gray)' }}>
        Organize. Rime. Julgue. Avance.
      </p>

      {events.length === 0 ? (
        <div
          className="flex flex-col items-center p-8 max-w-md w-full mb-8"
          style={{ border: '2px solid var(--color-gray)' }}
        >
          <h2 className="text-2xl font-display mb-4 text-center">AINDA NÃO HÁ BATALHAS</h2>
          <p className="text-center mb-8" style={{ color: 'var(--color-gray)' }}>
            Crie seu primeiro campeonato para começar.
          </p>
          <button
            onClick={() => navigate('/create')}
            className="w-full font-display text-xl py-4 transition-colors"
            style={{ backgroundColor: 'var(--color-offwhite)', color: 'var(--color-background)', border: '2px solid var(--color-offwhite)' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-acid)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-offwhite)'}
          >
            CRIAR BATALHA
          </button>
        </div>
      ) : (
        <div className="w-full max-w-md flex flex-col gap-4 mb-8">
          <h2 className="text-2xl font-display text-center mb-4">SEUS CAMPEONATOS</h2>
          {events.map(ev => (
            <div key={ev.id} className="flex flex-col" style={{ border: '2px solid var(--color-offwhite)' }}>
              <button
                onClick={() => navigate(`/event/${ev.id}`)}
                className="w-full text-left p-4 flex justify-between items-center transition-colors"
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-offwhite)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--color-background)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = 'var(--color-offwhite)';
                }}
              >
                <div>
                  <div className="font-display text-xl">{ev.name}</div>
                  <div className="text-sm opacity-60">
                    {new Date(ev.createdAt).toLocaleDateString('pt-BR')} — {ev.participants.length} MCs
                  </div>
                </div>
                <div className="text-2xl">→</div>
              </button>
              <div className="flex" style={{ borderTop: '2px solid var(--color-offwhite)' }}>
                <button
                  onClick={() => handleExport(ev.id)}
                  className="flex-1 py-2 text-sm font-display uppercase transition-colors"
                  style={{ borderRight: '1px solid var(--color-offwhite)', color: 'var(--color-offwhite)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(244,240,232,0.1)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
                >
                  Exportar
                </button>
                <button
                  onClick={async () => {
                    if (confirm(`Excluir "${ev.name}"? Esta ação não pode ser desfeita.`)) {
                      await db.battles.where('eventId').equals(ev.id).delete();
                      await db.events.delete(ev.id);
                    }
                  }}
                  className="flex-1 py-2 text-sm font-display uppercase transition-colors"
                  style={{ color: 'var(--color-red)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,48,48,0.1)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={() => navigate('/create')}
            className="w-full font-display text-xl py-4 mt-4 transition-colors"
            style={{ backgroundColor: 'var(--color-offwhite)', color: 'var(--color-background)', border: '2px solid var(--color-offwhite)' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-acid)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-offwhite)'}
          >
            + NOVA BATALHA
          </button>
        </div>
      )}

      {/* Footer actions */}
      <div className="flex gap-8 mt-4">
        <button
          onClick={loadDemo}
          className="text-sm font-display tracking-widest underline underline-offset-4"
          style={{ color: 'var(--color-gray)' }}
          onMouseEnter={e => (e.target as HTMLElement).style.color = 'var(--color-offwhite)'}
          onMouseLeave={e => (e.target as HTMLElement).style.color = 'var(--color-gray)'}
        >
          CARREGAR DEMO
        </button>

        <div className="relative">
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="absolute inset-0 opacity-0 cursor-pointer w-full"
          />
          <button
            className="text-sm font-display tracking-widest underline underline-offset-4"
            style={{ color: 'var(--color-gray)' }}
          >
            IMPORTAR BACKUP
          </button>
        </div>
      </div>

      <div className="mt-8 text-xs font-display tracking-widest flex items-center gap-2" style={{ color: 'var(--color-gray)' }}>
        <span
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: 'var(--color-acid)' }}
        />
        OFFLINE FIRST — DADOS LOCAIS
      </div>
    </div>
  );
}
