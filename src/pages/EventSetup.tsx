import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../core/db/db';
import { generateBracket } from '../core/engine/tournament';
import type { Participant } from '../core/types';

const PALETTE = [
  '#FF3030', // Red
  '#F5E600', // Acid Yellow
  '#00F0FF', // Cyber Blue
  '#39FF14', // Toxic Green
  '#FF00FF', // Hot Pink
  '#FF8C00', // Orange
  '#9D00FF', // Purple
  '#FFFFFF'  // White
];

type ParticipantDraft = {
  id: string;
  name: string;
  color: string;
  avatar: string;
};

export function EventSetup() {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = useLiveQuery(() => db.events.get(id!));

  const [drafts, setDrafts] = useState<ParticipantDraft[]>([]);
  const [inputText, setInputText] = useState('');
  
  const [bracketMode, setBracketMode] = useState<'random' | 'manual'>('random');
  const [roundTime, setRoundTime] = useState<number>(30);
  
  const [step, setStep] = useState<'input' | 'manual_pairing'>('input');
  const [manualPairs, setManualPairs] = useState<string[]>([]);
  
  // Avatar Modal State
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const remaining = targetCount - drafts.length;
  const isReady = drafts.length <= targetCount && drafts.length > 1; 
  const isOver = drafts.length > targetCount;

  const handleAddNames = (names: string[]) => {
    const startIndex = drafts.length;
    const newDrafts = names.map((n, i) => {
      const idx = startIndex + i;
      return {
        id: `draft_${Date.now()}_${i}`,
        name: n,
        color: PALETTE[idx % PALETTE.length],
        avatar: `/assets/characters/${(idx % 8) + 1}.webp`
      };
    });
    setDrafts(prev => [...prev, ...newDrafts]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputText.trim()) {
      handleAddNames([inputText.trim().toUpperCase()]);
      setInputText('');
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const names = pastedText.split('\n').map(n => n.trim().toUpperCase()).filter(n => n.length > 0);
    handleAddNames(names);
  };

  const removeDraft = (id: string) => {
    setDrafts(prev => prev.filter(d => d.id !== id));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingDraftId) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target?.result as string;
        setDrafts(prev => prev.map(d => d.id === editingDraftId ? { ...d, avatar: base64 } : d));
        setEditingDraftId(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectGenericAvatar = (num: number) => {
    if (editingDraftId) {
      setDrafts(prev => prev.map(d => d.id === editingDraftId ? { ...d, avatar: `/assets/characters/${num}.webp` } : d));
      setEditingDraftId(null);
    }
  };

  function hasGhostPair(slots: string[], targetCount: number): boolean {
    for (let i = 0; i < targetCount; i += 2) {
      if (!slots[i] && !slots[i + 1]) return true;
    }
    return false;
  }

  const handleGoToPairing = () => {
    if (isOver) {
      alert(`O limite é ${targetCount} participantes.`);
      return;
    }
    const uniqueNames = [...new Set(drafts.map(d => d.name))];
    if (uniqueNames.length !== drafts.length) {
      alert(`Nomes duplicados encontrados. Verifique a lista.`);
      return;
    }
    setStep('manual_pairing');
    setManualPairs([]);
  };

  const handleStartTournament = async (finalNames: string[]) => {
    if (hasGhostPair(finalNames, targetCount)) {
      alert("Reorganize os nomes — dois slots vazios não podem se enfrentar diretamente (Ghost Match).");
      return;
    }

    const participants: (Participant | null)[] = [];
    
    for (let i = 0; i < targetCount; i++) {
      const name = finalNames[i];
      if (name) {
        const draft = drafts.find(d => d.name === name);
        participants.push({
          id: `mc_${i}_${Date.now()}`,
          name,
          seed: i,
          color: draft?.color,
          avatar: draft?.avatar
        });
      } else {
        participants.push(null);
      }
    }

    const updatedSettings = { ...event.settings, roundTime };
    const battles = generateBracket(event.id, participants);

    await db.battles.bulkAdd(battles);
    await db.events.update(event.id, {
      settings: updatedSettings,
      participants: participants.filter(Boolean) as Participant[],
      state: 'active'
    });

    navigate(`/event/${event.id}`);
  };

  const handleGenerateRandom = () => {
    if (isOver) {
      alert(`O limite é ${targetCount} participantes.`);
      return;
    }
    const uniqueNames = [...new Set(drafts.map(d => d.name))];
    if (uniqueNames.length !== drafts.length) {
      alert(`Nomes duplicados encontrados.`);
      return;
    }
    
    let shuffled: string[] = [];
    let attempts = 0;
    let valid = false;

    while (!valid && attempts < 100) {
      shuffled = [...uniqueNames].sort(() => Math.random() - 0.5);
      while (shuffled.length < targetCount) {
        shuffled.push('');
      }
      valid = !hasGhostPair(shuffled, targetCount);
      attempts++;
    }

    if (!valid) {
      alert("Erro ao sortear: não foi possível gerar chaves válidas sem confrontos vazios.");
      return;
    }

    handleStartTournament(shuffled);
  };

  const getCounterColor = () => {
    if (isReady && drafts.length === targetCount) return 'var(--color-acid)';
    if (isReady && drafts.length < targetCount) return 'var(--color-offwhite)';
    if (isOver) return 'var(--color-red)';
    return 'var(--color-gray)';
  };

  const getStatusLabel = () => {
    if (isReady && drafts.length === targetCount) return 'COMPLETO';
    if (isReady && drafts.length < targetCount) return `FALTAM ${remaining} (BYEs GERADOS)`;
    if (isOver) return `${Math.abs(remaining)} A MAIS`;
    return 'ADICIONE OS NOMES';
  };

  if (step === 'manual_pairing') {
    const available = drafts.map(d => d.name).filter(n => !manualPairs.includes(n));
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
                >
                  {mc}
                </button>
              ))}
            </div>
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
                    style={{ border: '2px solid', borderColor: m.mcA ? 'var(--color-offwhite)' : 'var(--color-gray)' }}
                  >
                    <span>{m.mcA || '--- VAZIO (BYE) ---'}</span>
                  </button>

                  <div className="text-center font-display text-xs" style={{ color: 'var(--color-acid)' }}>VS</div>

                  <button
                    onClick={() => m.mcB && handleSlotClick(m.idxB)}
                    className="w-full text-left px-4 py-3 font-display text-xl uppercase transition-colors flex justify-between items-center"
                    style={{ border: '2px solid', borderColor: m.mcB ? 'var(--color-offwhite)' : 'var(--color-gray)' }}
                  >
                    <span>{m.mcB || '--- VAZIO (BYE) ---'}</span>
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
          Digite o nome e pressione Enter, ou cole uma lista. Clique na foto para alterar.
        </p>

        <div className="flex flex-col gap-4 mb-4">
          <input 
            type="text" 
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder="Adicionar MC..."
            className="font-display text-2xl p-4 uppercase w-full"
            style={{ backgroundColor: 'var(--color-background)', border: '2px solid var(--color-gray)', color: 'var(--color-offwhite)', outline: 'none' }}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {drafts.map(draft => (
            <div key={draft.id} className="flex flex-col items-center p-2 relative" style={{ border: `2px solid ${draft.color}` }}>
              <button 
                onClick={() => removeDraft(draft.id)}
                className="absolute top-1 right-1 text-xs w-6 h-6 flex items-center justify-center"
                style={{ backgroundColor: 'var(--color-red)', color: 'var(--color-offwhite)' }}
              >X</button>
              <div 
                className="w-20 h-20 bg-gray-800 rounded-full mb-2 cursor-pointer overflow-hidden border-2" 
                style={{ borderColor: draft.color }}
                onClick={() => setEditingDraftId(draft.id)}
              >
                <img 
                  src={draft.avatar} 
                  alt="avatar" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <span className="font-display uppercase text-lg truncate w-full text-center" style={{ color: draft.color }}>{draft.name}</span>
            </div>
          ))}
        </div>

      </div>

      <div className="w-full md:w-80 flex flex-col justify-end gap-6">
        <div
          className="flex flex-col items-center justify-center p-8"
          style={{ border: '2px solid var(--color-gray)' }}
        >
          <div className="font-display mb-2" style={{ fontSize: '4rem', lineHeight: 1 }}>
            <span style={{ color: isOver ? 'var(--color-red)' : 'var(--color-offwhite)' }}>{drafts.length}</span>
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
          >
            MONTAR CHAVES
          </button>
        )}
      </div>

      {editingDraftId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}>
          <div className="w-full max-w-2xl p-6 flex flex-col gap-6" style={{ backgroundColor: 'var(--color-background)', border: '2px solid var(--color-acid)' }}>
            <div className="flex justify-between items-center">
              <h2 className="font-display text-2xl" style={{ color: 'var(--color-acid)' }}>ESCOLHER PERSONAGEM</h2>
              <button onClick={() => setEditingDraftId(null)} className="font-display text-2xl text-gray-400">X</button>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {[1,2,3,4,5,6,7,8].map(num => (
                <button key={num} onClick={() => selectGenericAvatar(num)} className="border-2 border-gray-600 hover:border-white p-2">
                  <img src={`/assets/characters/${num}.webp`} alt={`char-${num}`} className="w-full h-auto" />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 pt-4" style={{ borderTop: '2px solid var(--color-gray)' }}>
              <span className="font-display">OU ENVIAR FOTO:</span>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 font-display uppercase border-2 border-white hover:bg-white hover:text-black transition-colors"
              >
                UPLOAD DA CÂMERA / ARQUIVO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
