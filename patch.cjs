const fs = require('fs');

let content = fs.readFileSync('src/pages/BattleLive.tsx', 'utf-8');

content = content.replace(
  'const [countdown, setCountdown] = useState<number | null>(null);',
  `const [countdown, setCountdown] = useState<number | null>(null);
  
  const [score, setScore] = useState({ A: 0, B: 0 });
  const [history, setHistory] = useState<any[]>([]);`
);

const old_vote = `  const handleVote = async (winnerId: string | 'draw') => {
    if (winnerId === 'draw') {
      setJudging(false);
      setRound(prev => prev + 1);
      setRoundStep('IDLE_A');
      setTimeLeft(getRoundTime());
      setActiveMC('A');
      await db.battles.update(battle.id, { state: 'tiebreaker' });
    } else {
      await advanceWinner(battle, winnerId);
      navigate(\`/event/\${event.id}\`);
    }
  };`;

const new_vote = `  const handleRoundVote = async (winner: 'A' | 'B' | 'draw') => {
    setHistory(prev => [...prev, { score, round }]);
    
    let newScore = { ...score };
    if (winner === 'A') {
      newScore.A += 1;
      setScore(newScore);
    } else if (winner === 'B') {
      newScore.B += 1;
      setScore(newScore);
    }
    
    setJudging(false);
    setRoundStep('IDLE_A');
    setTimeLeft(getRoundTime());
    setActiveMC('A');
    setRound(prev => prev + 1);
    
    if (newScore.A === 1 && newScore.B === 1) {
       await db.battles.update(battle.id, { state: 'tiebreaker' });
    }
  };

  const handleDeclareWinner = async (winnerId: string) => {
    await advanceWinner(battle, winnerId);
    navigate(\`/event/\${event.id}\`);
  };

  const handleUndo = () => {
     const last = history[history.length - 1];
     if (last) {
        setScore(last.score);
        setRound(last.round);
        setHistory(prev => prev.slice(0, -1));
        setJudging(false);
        setRoundStep('IDLE_A');
     }
  };

  const handleResetBattle = async () => {
     if (confirm("Resetar batalha do zero?")) {
        setScore({ A: 0, B: 0 });
        setHistory([]);
        setRound(1);
        setRoundStep('IDLE_A');
        setTimeLeft(getRoundTime());
        setActiveMC('A');
        setJudging(false);
        setBeatPlaying(false);
        setCountdown(null);
        setTimerActive(false);
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        await db.battles.update(battle.id, { state: 'live', winnerId: undefined });
     }
  };`;

content = content.replace(old_vote, new_vote);

const old_judging_ui = `        {/* Judging Overlay */}
        {judging && (
          <div className="absolute inset-0 z-30 flex flex-col p-8" style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}>
            <h2 className="text-3xl font-display mb-8 text-center" style={{ color: 'var(--color-acid)' }}>
              VOTAÇÃO FINAL
            </h2>
            
            <div className="flex flex-col gap-4 flex-1 justify-center">
              <button
                onClick={() => handleVote(mcA.id)}
                className="w-full py-6 font-display text-2xl uppercase transition-colors"
                style={{ border: \`2px solid \${getMcColor('A')}\`, color: getMcColor('A') }}
              >
                VENCEDOR: {mcA.name}
              </button>
              
              <button
                onClick={() => handleVote(mcB.id)}
                className="w-full py-6 font-display text-2xl uppercase transition-colors"
                style={{ border: \`2px solid \${getMcColor('B')}\`, color: getMcColor('B') }}
              >
                VENCEDOR: {mcB.name}
              </button>

              <div className="flex items-center gap-4 my-2">
                <div className="flex-1 h-px bg-white opacity-20" />
                <span className="font-display text-sm opacity-50">OU</span>
                <div className="flex-1 h-px bg-white opacity-20" />
              </div>

              <button
                onClick={() => handleVote('draw')}
                className="w-full py-4 font-display text-xl uppercase transition-colors"
                style={{ backgroundColor: 'var(--color-offwhite)', color: 'var(--color-background)' }}
              >
                EMPATE (3º ROUND)
              </button>
            </div>
          </div>
        )}`;

const new_judging_ui = `        {/* Judging Overlay */}
        {judging && (
          <div className="absolute inset-0 z-30 flex flex-col p-8" style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}>
            <h2 className="text-3xl font-display mb-8 text-center" style={{ color: 'var(--color-acid)' }}>
              VOTAÇÃO - ROUND {round}
            </h2>
            
            <div className="flex flex-col gap-4 flex-1 justify-center">
              <button
                onClick={() => handleRoundVote('A')}
                className="w-full py-6 font-display text-2xl uppercase transition-colors"
                style={{ border: \`2px solid \${getMcColor('A')}\`, color: getMcColor('A') }}
              >
                VITÓRIA: {mcA.name}
              </button>
              
              <button
                onClick={() => handleRoundVote('B')}
                className="w-full py-6 font-display text-2xl uppercase transition-colors"
                style={{ border: \`2px solid \${getMcColor('B')}\`, color: getMcColor('B') }}
              >
                VITÓRIA: {mcB.name}
              </button>

              <div className="flex items-center gap-4 my-2">
                <div className="flex-1 h-px bg-white opacity-20" />
                <span className="font-display text-sm opacity-50">OU</span>
                <div className="flex-1 h-px bg-white opacity-20" />
              </div>

              <button
                onClick={() => handleRoundVote('draw')}
                className="w-full py-4 font-display text-xl uppercase transition-colors"
                style={{ backgroundColor: 'var(--color-offwhite)', color: 'var(--color-background)' }}
              >
                EMPATE NO ROUND
              </button>
            </div>
            
            <button onClick={() => setJudging(false)} className="mt-4 font-display text-gray-400">CANCELAR VOTAÇÃO</button>
          </div>
        )}`;

content = content.replace(old_judging_ui, new_judging_ui);

const old_header = `        {/* HUD Header */}
        <div className="absolute top-8 left-8 right-8 flex justify-between items-start z-10">
          <button
            onClick={() => navigate(\`/event/\${event.id}\`)}
            className="text-xs font-display tracking-widest uppercase transition-colors"
            style={{ color: 'var(--color-gray)' }}
            onMouseEnter={e => (e.target as HTMLElement).style.color = 'var(--color-offwhite)'}
            onMouseLeave={e => (e.target as HTMLElement).style.color = 'var(--color-gray)'}
          >
            ← VOLTAR
          </button>
          
          <div className="flex flex-col items-center">
            <div 
              className="px-4 py-1 font-display text-sm uppercase tracking-widest mb-2"
              style={{ border: '1px solid var(--color-gray)', color: 'var(--color-gray)' }}
            >
              {battle.state === 'tiebreaker' ? 'DESEMPATE' : \`ROUND \${round}\`}
            </div>
          </div>
          
          <button
            onClick={() => setShowBeatPicker(true)}
            className="text-xs font-display tracking-widest uppercase transition-colors"
            style={{ color: 'var(--color-acid)' }}
          >
            TROCAR BEAT ♫
          </button>
        </div>`;

const new_header = `        {/* HUD Header */}
        <div className="absolute top-8 left-8 right-8 flex justify-between items-start z-10">
          <button
            onClick={() => navigate(\`/event/\${event.id}\`)}
            className="text-xs font-display tracking-widest uppercase transition-colors"
            style={{ color: 'var(--color-gray)' }}
            onMouseEnter={e => (e.target as HTMLElement).style.color = 'var(--color-offwhite)'}
            onMouseLeave={e => (e.target as HTMLElement).style.color = 'var(--color-gray)'}
          >
            ← VOLTAR
          </button>
          
          <div className="flex flex-col items-center">
            <div 
              className="px-4 py-1 font-display text-sm uppercase tracking-widest mb-2"
              style={{ border: '1px solid var(--color-gray)', color: 'var(--color-gray)' }}
            >
              {battle.state === 'tiebreaker' ? 'DESEMPATE' : \`ROUND \${round}\`}
            </div>
            
            <div className="flex items-center gap-4 text-2xl font-display">
              <span style={{ color: getMcColor('A') }}>{score.A}</span>
              <span className="text-sm text-gray-500">VS</span>
              <span style={{ color: getMcColor('B') }}>{score.B}</span>
            </div>
          </div>
          
          <button
            onClick={() => setShowBeatPicker(true)}
            className="text-xs font-display tracking-widest uppercase transition-colors"
            style={{ color: 'var(--color-acid)' }}
          >
            TROCAR BEAT ♫
          </button>
        </div>`;

content = content.replace(old_header, new_header);

const old_control_panel = `        <div className="flex flex-col gap-6">
          <div className="flex gap-4">
            {/* Control Panel */}
            <div className="flex-1 flex flex-col gap-4">`;

const new_control_panel = `        <div className="flex flex-col gap-6">
          <div className="flex gap-4">
            {/* Control Panel */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex gap-2 mb-2">
                <button onClick={() => handleDeclareWinner(mcA.id)} className="flex-1 py-2 text-xs font-display bg-gray-900 border border-gray-700 hover:border-white transition-colors uppercase">Vence {mcA.name}</button>
                <button onClick={() => handleDeclareWinner(mcB.id)} className="flex-1 py-2 text-xs font-display bg-gray-900 border border-gray-700 hover:border-white transition-colors uppercase">Vence {mcB.name}</button>
                <button onClick={handleUndo} disabled={history.length === 0} className="px-4 py-2 text-xs font-display bg-gray-900 border border-gray-700 hover:border-white transition-colors disabled:opacity-50">⟲ UNDO</button>
                <button onClick={handleResetBattle} className="px-4 py-2 text-xs font-display bg-gray-900 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors">RESET</button>
              </div>`;

content = content.replace(old_control_panel, new_control_panel);

const old_avatars_a = `                <div 
                  className="w-32 h-32 rounded-full mb-4 opacity-50"
                  style={{ border: \`2px solid \${getMcColor('A')}\`, backgroundColor: 'var(--color-gray)' }}
                />`;
const new_avatars_a = `                <div 
                  className="w-32 h-32 rounded-full mb-4 overflow-hidden"
                  style={{ border: \`2px solid \${getMcColor('A')}\`, backgroundColor: 'var(--color-gray)' }}
                >
                  {mcA.avatar && <img src={mcA.avatar} alt="A" className="w-full h-full object-cover" style={{ filter: mcA.avatar.includes('characters') ? 'grayscale(100%)' : 'none' }} />}
                </div>`;

const old_avatars_b = `                <div 
                  className="w-32 h-32 rounded-full mb-4 opacity-50"
                  style={{ border: \`2px solid \${getMcColor('B')}\`, backgroundColor: 'var(--color-gray)' }}
                />`;
const new_avatars_b = `                <div 
                  className="w-32 h-32 rounded-full mb-4 overflow-hidden"
                  style={{ border: \`2px solid \${getMcColor('B')}\`, backgroundColor: 'var(--color-gray)' }}
                >
                  {mcB.avatar && <img src={mcB.avatar} alt="B" className="w-full h-full object-cover" style={{ filter: mcB.avatar.includes('characters') ? 'grayscale(100%)' : 'none' }} />}
                </div>`;

content = content.replace(old_avatars_a, new_avatars_a);
content = content.replace(old_avatars_b, new_avatars_b);

fs.writeFileSync('src/pages/BattleLive.tsx', content, 'utf-8');
