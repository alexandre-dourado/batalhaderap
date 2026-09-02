import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../core/db/db';
import type { TournamentSettings } from '../core/types';

export function CreateEvent() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [count, setCount] = useState<16 | 4 | 8 | 32 | 64>(16);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const eventId = `evt_${Date.now()}`;
    const settings: TournamentSettings = { participantsCount: count, format: '1v1' };

    await db.events.add({
      id: eventId,
      name: name.trim().toUpperCase(),
      city,
      settings,
      participants: [],
      state: 'setup',
      createdAt: Date.now()
    });

    navigate(`/event/${eventId}/setup`);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: 'var(--color-background)',
    border: '2px solid var(--color-gray)',
    padding: '1rem',
    fontSize: '1.25rem',
    color: 'var(--color-offwhite)',
    outline: 'none',
    fontFamily: 'inherit',
  };

  return (
    <div
      className="max-w-2xl mx-auto w-full p-4 md:p-8 pt-12"
      style={{ color: 'var(--color-offwhite)' }}
    >
      <button
        onClick={() => navigate('/')}
        className="mb-8 text-sm font-display tracking-widest uppercase"
        style={{ color: 'var(--color-gray)' }}
        onMouseEnter={e => (e.target as HTMLElement).style.color = 'var(--color-offwhite)'}
        onMouseLeave={e => (e.target as HTMLElement).style.color = 'var(--color-gray)'}
      >
        ← Voltar
      </button>

      <h1
        className="text-4xl md:text-5xl font-display mb-8 uppercase pb-4"
        style={{ color: 'var(--color-red)', borderBottom: '2px solid var(--color-red)' }}
      >
        Criar Campeonato
      </h1>

      <form onSubmit={handleCreate} className="flex flex-col gap-8">
        <div>
          <label className="block font-display text-xl mb-2">Nome do evento *</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ex: Batalha da Praça #01"
            required
            style={{
              ...inputStyle,
              borderColor: name ? 'var(--color-offwhite)' : 'var(--color-gray)'
            }}
            onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--color-acid)'}
            onBlur={e => (e.target as HTMLElement).style.borderColor = name ? 'var(--color-offwhite)' : 'var(--color-gray)'}
          />
        </div>

        <div>
          <label className="block font-display text-xl mb-2">Cidade <span style={{ color: 'var(--color-gray)' }}>(Opcional)</span></label>
          <input
            type="text"
            value={city}
            onChange={e => setCity(e.target.value)}
            placeholder="Ex: Montes Claros"
            style={inputStyle}
            onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--color-acid)'}
            onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--color-gray)'}
          />
        </div>

        <div>
          <label className="block font-display text-xl mb-4">Participantes</label>
          <div className="flex gap-3 flex-wrap">
            {[4, 8, 16, 32, 64].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => setCount(num as 4 | 8 | 16 | 32 | 64)}
                className="flex-1 py-4 text-xl font-display min-w-[60px] transition-colors"
                style={{
                  border: '2px solid var(--color-offwhite)',
                  backgroundColor: count === num ? 'var(--color-acid)' : 'transparent',
                  color: count === num ? 'var(--color-background)' : 'var(--color-offwhite)',
                  borderColor: count === num ? 'var(--color-acid)' : 'var(--color-offwhite)',
                }}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full font-display text-2xl py-6 mt-4 transition-colors"
          style={{
            backgroundColor: name.trim() ? 'var(--color-red)' : 'var(--color-gray)',
            color: 'var(--color-offwhite)',
            border: `2px solid ${name.trim() ? 'var(--color-red)' : 'var(--color-gray)'}`,
            cursor: name.trim() ? 'pointer' : 'not-allowed',
          }}
          onMouseEnter={e => { if (name.trim()) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-acid)'; }}
          onMouseLeave={e => { if (name.trim()) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-red)'; }}
        >
          CONTINUAR →
        </button>
      </form>
    </div>
  );
}
