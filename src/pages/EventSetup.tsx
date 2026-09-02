import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../core/db/db';
import { generateBracket } from '../core/engine/tournament';
import type { Participant } from '../core/types';

export function EventSetup() {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = useLiveQuery(() => db.events.get(id!));

  const [textList, setTextList] = useState('');
  const [bracketMode, setBracketMode] = useState<'random' | 'manual'>('random');
  const [roundTime, setRoundTime] = useState<number>(30);
  
  const [step, setStep] = useState<'input' | 'manual_pairing'>('input');
  const [manualPairs, setManualPairs] = useState<string[]>([]);

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

  const targetCount = event.settings.participantsCount;
  const currentLines = textList.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const remaining = targetCount - currentLines.length;
  const isReady = currentLines.length <= targetCount && currentLines.length > 1; 
  const isOver = currentLines.length > targetCount;

  const handleGoToPairing = () => {
    if (isOver) {
      alert(`O limite é ${targetCount} participantes.`);
      return;
    }
    const uniqueNames = [...new Set(currentLines.map(n => n.toUpperCase()))];
    if (uniqueNames.length !== currentLines.length) {
      alert(`Nomes duplicados encontrados. Verifique a lista.`);
      return;
    }
    setStep('manual_pairing');
    setManualPairs([]);
  };

  const handleStartTournament = async (finalNames: string[]) => {
    const participants: (Participant | null)[] = [];
    
    for (let i = 0; i < targetCount; i++) {
      const name = finalNames[i];
      if (name) {
        participants.push({
          id: `mc_${i}_${Date.now()}`,
          name,
          seed: i
        });
      } else {
        participants.push(null);
      }
    }

    const updatedSettings = {
      ...event.settings,
      roundTime
    };

    const battles = generateBracket(event.id, participants);

    await db.events.update(event.id, {
      settings: updatedSettings,
      participants: participants.filter(Boolean) as Participant[],
      battles,
      state: 'active'
    });

    navigate(`/event/${event.id}`);
  };

  const handleGenerateRandom = () => {
    if (isOver) {
      alert(`O limite é ${targetCount} participantes.`);
      return;
    }
    const uniqueNames = [...new Set(currentLines.map(n => n.toUpperCase()))];
    if (uniqueNames.length !== currentLines.length) {
      alert(`Nomes duplicados encontrados. Verifique a lista.`);
      return;
    }
    
    const shuffled = [...uniqueNames].sort(() => Math.random() - 0.5);
    while (shuffled.length < targetCount) {
      shuffled.push('');
    }
    handleStartTournament(shuffled);
  };

  const getCounterColor = () => {
    if (isReady && currentLines.length === targetCount) return 'var(--color-acid)';
    if (isReady && currentLines.length < targetCount) return 'var(--color-offwhite)';
    if (isOver) return 'var(--color-red)';
    return 'var(--color-gray)';
  };

  const getStatusLabel = () => {
    if (isReady && currentLines.length === targetCount) return 'COMPLETO';
    if (isReady && currentLines.length < targetCount) return `FALTAM ${remaining} (BYEs GERADOS)`;
    if (isOver) return `${Math.abs(remaining)} A MAIS`;
    return 'DIGITE OS NOMES';
  };

  if (step === 'manual_pairing') {
    const uniqueNames = [...new Set(currentLines.map(n => n.toUpperCase()))];
    const available = uniqueNames.filter(n => !manualPairs.includes(n));
    const isPairingComplete = available.length === 0;

    const handlePoolClick = (name: string) => {
      const newPairs = [...manualPairs];
      const emptyIdx = newPairs.findIndex(p => p === '');
      if (emptyIdx !== -1) {
        newPairs[emptyIdx] = name;
        setManualPairs(newPairs);
      } else {
        setManualPairs([...newPairs, name]);
      }
    };

    const handleSlotClick = (index: number) => {
      const newPairs = [...manualPairs];
      newPairs[index] = '';
      setManualPairs(newPairs);
    };

    const handleFinishManual = () => {
      const finalSlots = [];
      for (let i = 0; i < targetCount; i++) {
        finalSlots.push(manualPairs[i] || '');
      }
      handleStartTournament(finalSlots);
    };

    const matches = [];
    for (let i = 0; i < targetCount / 2; i++) {
      matches.push({
        idxA: i * 2,
        idxB: i * 2 + 1,
        mcA: manualPairs[i * 2] || null,
        mcB: manualPairs[i * 2 + 1] || null,
      });
    }

    return (
      <div className="max-w-6xl mx-auto w-full p-4 md:p-8 pt-12 flex flex-col min-h-screen" style={{ color: 'var(--color-offwhite)' }}>
        <div className="flex justify-between items-center mb-8">
          <div>
            <button onClick={() => setStep('input')} className="mb-4 text-sm font-display tracking-widest uppercase text-gray-500 hover:text-white transition-colors" style={{ color: 'var(--color-gray)' }}>
              ← VOLTAR PARA LISTA
            </button>
            <h1 className="text-4xl font-display uppercase" style={{ color: 'var(--color-acid)' }}>CHAVEAMENTO MANUAL</h1>
          </div>
          <button
            onClick={handleFinishManual}
            disabled={!isPairingComplete}
            className="font-display text-2xl py-4 px-8 transition-colors"
            style={{
              backgroundColor: isPairingComplete ? 'var(--color-acid)' : 'var(--color-gray)',
              color: 'var(--color-background)',
              border: `2px solid ${isPairingComplete ? 'var(--color-acid)' : 'var(--color-gray)'}`,
              cursor: isPairingComplete ? 'pointer' : 'not-allowed',
            }}
          >
            INICIAR CAMPEONATO
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            <h2 className="font-display text-2xl">MCs DISPONÍVEIS ({available.length})</h2>
            <div className="flex flex-wrap gap-2 p-4 min-h-32" style={{ border: '2px solid var(--color-gray)' }}>
              {available.map(mc => (
                <button
                  key={mc}
                  onClick={() => handlePoolClick(mc)}
                  className="px-4 py-2 font-display text-lg uppercase transition-colors"
                  style={{ backgroundColor: 'var(--color-background)', border: '2px solid var(--color-acid)', color: 'var(--color-acid)' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-acid)'; e.currentTarget.style.color = 'var(--color-background)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--color-background)'; e.currentTarget.style.color = 'var(--color-acid)'; }}
                >
                  {mc}
                </button>
              ))}
              {available.length === 0 && <p className="text-sm text-gray-500 my-auto mx-auto" style={{ color: 'var(--color-gray)' }}>TODOS ALOCADOS</p>}
            </div>
            <p className="text-sm" style={{ color: 'var(--color-gray)' }}>Clique em um MC para alocá-lo na próxima vaga disponível.</p>
          </div>

          <div className="w-full lg:w-2/3">
            <h2 className="font-display text-2xl mb-4">CONFRONTOS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matches.map((m, i) => (
                <div key={i} className="flex flex-col p-4 gap-2" style={{ border: '2px solid var(--color-gray)' }}>
                  <div className="text-sm font-display tracking-widest mb-1" style={{ color: 'var(--color-gray)' }}>BATALHA {i + 1}</div>
                  
                  <button
                    onClick={() => m.mcA && handleSlotClick(m.idxA)}
                    className="w-full text-left px-4 py-3 font-display text-xl uppercase transition-colors flex justify-between items-center"
                    style={{
                      border: '2px solid',
                      borderColor: m.mcA ? 'var(--color-offwhite)' : 'var(--color-gray)',
                      color: m.mcA ? 'var(--color-offwhite)' : 'var(--color-gray)',
                      cursor: m.mcA ? 'pointer' : 'default'
                    }}
                  >
                    <span>{m.mcA || '--- VAZIO (BYE) ---'}</span>
                    {m.mcA && <span className="text-xs">✕</span>}
                  </button>

                  <div className="text-center font-display text-xs" style={{ color: 'var(--color-acid)' }}>VS</div>

                  <button
                    onClick={() => m.mcB && handleSlotClick(m.idxB)}
                    className="w-full text-left px-4 py-3 font-display text-xl uppercase transition-colors flex justify-between items-center"
                    style={{
                      border: '2px solid',
                      borderColor: m.mcB ? 'var(--color-offwhite)' : 'var(--color-gray)',
                      color: m.mcB ? 'var(--color-offwhite)' : 'var(--color-gray)',
                      cursor: m.mcB ? 'pointer' : 'default'
                    }}
                  >
                    <span>{m.mcB || '--- VAZIO (BYE) ---'}</span>
                    {m.mcB && <span className="text-xs">✕</span>}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="max-w-6xl mx-auto w-full p-4 md:p-8 pt-12 flex flex-col md:flex-row gap-8 min-h-screen"
      style={{ color: 'var(--color-offwhite)' }}
    >
      <div className="flex-1 flex flex-col">
        <button
          onClick={() => navigate('/')}
          className="mb-8 text-sm font-display tracking-widest uppercase self-start"
          style={{ color: 'var(--color-gray)' }}
          onMouseEnter={e => (e.target as HTMLElement).style.color = 'var(--color-offwhite)'}
          onMouseLeave={e => (e.target as HTMLElement).style.color = 'var(--color-gray)'}
        >
          ← Início
        </button>

        <h1 className="text-4xl font-display mb-1 uppercase" style={{ color: 'var(--color-acid)' }}>
          {event.name}
        </h1>
        <p className="text-xl mb-8" style={{ color: 'var(--color-gray)' }}>
          FORMATO {targetCount} MCs
        </p>

        <div className="flex flex-col md:flex-row gap-8 mb-8 p-6" style={{ border: '2px solid var(--color-gray)' }}>
          <div className="flex-1">
            <label className="block font-display text-lg mb-4" style={{ color: 'var(--color-acid)' }}>TEMPO DO ROUND</label>
            <div className="flex flex-wrap gap-2">
              {[30, 45, 60, 0].map(val => (
                <button
                  key={val}
                  onClick={() => setRoundTime(val)}
                  className="px-4 py-2 font-display text-sm uppercase transition-colors"
                  style={{
                    border: '2px solid',
                    borderColor: roundTime === val ? 'var(--color-acid)' : 'var(--color-gray)',
                    color: roundTime === val ? 'var(--color-background)' : 'var(--color-gray)',
                    backgroundColor: roundTime === val ? 'var(--color-acid)' : 'transparent',
                  }}
                >
                  {val === 0 ? 'Livre' : `${val}s`}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <label className="block font-display text-lg mb-4" style={{ color: 'var(--color-acid)' }}>MODO DE CHAVEAMENTO</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setBracketMode('random')}
                className="px-4 py-2 font-display text-sm uppercase transition-colors"
                style={{
                  border: '2px solid',
                  borderColor: bracketMode === 'random' ? 'var(--color-acid)' : 'var(--color-gray)',
                  color: bracketMode === 'random' ? 'var(--color-background)' : 'var(--color-gray)',
                  backgroundColor: bracketMode === 'random' ? 'var(--color-acid)' : 'transparent',
                }}
              >
                Aleatório
              </button>
              <button
                onClick={() => setBracketMode('manual')}
                className="px-4 py-2 font-display text-sm uppercase transition-colors"
                style={{
                  border: '2px solid',
                  borderColor: bracketMode === 'manual' ? 'var(--color-acid)' : 'var(--color-gray)',
                  color: bracketMode === 'manual' ? 'var(--color-background)' : 'var(--color-gray)',
                  backgroundColor: bracketMode === 'manual' ? 'var(--color-acid)' : 'transparent',
                }}
              >
                Manual
              </button>
            </div>
          </div>
        </div>

        <label className="block font-display text-2xl mb-2">LISTA DE MCs</label>
        <p className="mb-4 text-sm" style={{ color: 'var(--color-gray)' }}>
          Um nome por linha. Caso o número de MCs seja menor que {targetCount}, chaves automáticas com "BYE" serão geradas.
        </p>

        <textarea
          value={textList}
          onChange={e => setTextList(e.target.value)}
          className="flex-1 min-h-96 font-body uppercase text-xl resize-none"
          placeholder={'Ex:\nNEO\nKADU\nL7\nSHARK'}
          style={{
            backgroundColor: 'var(--color-background)',
            border: '2px solid var(--color-gray)',
            padding: '1rem',
            color: 'var(--color-offwhite)',
            outline: 'none',
          }}
          onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--color-acid)'}
          onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--color-gray)'}
        />
      </div>

      <div className="w-full md:w-80 flex flex-col justify-end gap-6">
        <div
          className="flex flex-col items-center justify-center p-8"
          style={{ border: '2px solid var(--color-gray)' }}
        >
          <div className="font-display mb-2" style={{ fontSize: '4rem', lineHeight: 1 }}>
            <span style={{ color: isOver ? 'var(--color-red)' : 'var(--color-offwhite)' }}>{currentLines.length}</span>
            <span style={{ fontSize: '2rem', color: 'var(--color-gray)' }}> / {targetCount}</span>
          </div>
          <div
            className="text-sm font-display tracking-widest uppercase text-center"
            style={{ color: getCounterColor() }}
          >
            {getStatusLabel()}
          </div>
        </div>

        {bracketMode === 'random' ? (
          <button
            onClick={handleGenerateRandom}
            disabled={!isReady}
            className="w-full font-display text-2xl py-6 transition-colors"
            style={{
              backgroundColor: isReady ? 'var(--color-acid)' : 'var(--color-gray)',
              color: 'var(--color-background)',
              border: `2px solid ${isReady ? 'var(--color-acid)' : 'var(--color-gray)'}`,
              cursor: isReady ? 'pointer' : 'not-allowed',
            }}
            onMouseEnter={e => { if (isReady) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-offwhite)'; }}
            onMouseLeave={e => { if (isReady) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-acid)'; }}
          >
            SORTEAR CHAVES
          </button>
        ) : (
          <button
            onClick={handleGoToPairing}
            disabled={!isReady}
            className="w-full font-display text-2xl py-6 transition-colors"
            style={{
              backgroundColor: isReady ? 'var(--color-acid)' : 'var(--color-gray)',
              color: 'var(--color-background)',
              border: `2px solid ${isReady ? 'var(--color-acid)' : 'var(--color-gray)'}`,
              cursor: isReady ? 'pointer' : 'not-allowed',
            }}
            onMouseEnter={e => { if (isReady) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-offwhite)'; }}
            onMouseLeave={e => { if (isReady) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-acid)'; }}
          >
            MONTAR CHAVES
          </button>
        )}
      </div>
    </div>
  );
}
