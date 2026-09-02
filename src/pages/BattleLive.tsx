import { useParams, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../core/db/db';
import { advanceWinner } from '../core/engine/tournament';
import { useState, useEffect, useRef } from 'react';
import type { Beat } from '../core/types';

type RoundStep = 
  | 'IDLE_A' | 'COUNTDOWN_A' | 'ACTIVE_A' 
  | 'IDLE_B' | 'COUNTDOWN_B' | 'ACTIVE_B' 
  | 'ROUND_END';

export function BattleLive() {
  const { id } = useParams();
  const navigate = useNavigate();

  const data = useLiveQuery(async () => {
    const battleId = id!;
    const battle = await db.battles.get(battleId);
    if (!battle) return { event: null, battle: null, mcA: null, mcB: null };
    const event = await db.events.get(battle.eventId);
    if (!event) return { event: null, battle: null, mcA: null, mcB: null };
    
    const mcA = event.participants.find(p => p.id === battle.mcAId);
    const mcB = event.participants.find(p => p.id === battle.mcBId);
    return { event, battle, mcA, mcB };
  }, [id]);

  const beats = useLiveQuery(() => db.beats.toArray(), []);

  const getRoundTime = () => data?.event?.settings.roundTime || 30;

  // Timer state
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [activeMC, setActiveMC] = useState<'A' | 'B'>('A');
  const [round, setRound] = useState(1);
  const [judging, setJudging] = useState(false);
  const [roundStep, setRoundStep] = useState<RoundStep>('IDLE_A');
  const [countdown, setCountdown] = useState<number | null>(null);
  
  const [score, setScore] = useState({ A: 0, B: 0 });
  const [history, setHistory] = useState<any[]>([]);

  // Beat state
  const [selectedBeat, setSelectedBeat] = useState<Beat | null>(null);
  const [beatPlaying, setBeatPlaying] = useState(false);
  const [beatVolume, setBeatVolume] = useState(0.7);
  const [showBeatPicker, setShowBeatPicker] = useState(false);
  const [beatObjectUrl, setBeatObjectUrl] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastTimeRef = useRef<number>(0);
  const countdownIntervalRef = useRef<number | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);
  const audioCtxRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  // Sync timeLeft when event loads
  useEffect(() => {
    if (data && timeLeft === 30 && roundStep === 'IDLE_A') {
      setTimeLeft(getRoundTime() || 30);
    }
  }, [data]);

  // Cleanup audio object url on change
  useEffect(() => {
    return () => {
      if (beatObjectUrl) URL.revokeObjectURL(beatObjectUrl);
    };
  }, [beatObjectUrl]);

  // Sync audio volume ONLY when not fading
  const targetVolumeRef = useRef<number>(beatVolume);
  useEffect(() => {
    targetVolumeRef.current = beatVolume;
    if (audioRef.current && beatPlaying) {
      audioRef.current.volume = beatVolume;
    }
  }, [beatVolume]);

  const playBeep = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(330, ctx.currentTime); // E4
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.5); // Drop
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.warn("AudioContext não suportado ou bloqueado.");
    }
  };

  const fadeAudio = (toVolume: number, duration: number, callback?: () => void) => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }

    if (!audioRef.current) {
      if (callback) callback();
      return;
    }
    const startVol = audioRef.current.volume;
    const steps = 20;
    const stepTime = duration / steps;
    const volStep = (toVolume - startVol) / steps;
    let currentStep = 0;
    
    if (toVolume > 0 && audioRef.current.paused) {
      audioRef.current.volume = 0;
      audioRef.current.play().then(() => setBeatPlaying(true)).catch(() => {});
    }

    fadeIntervalRef.current = window.setInterval(() => {
      currentStep++;
      if (audioRef.current) {
        audioRef.current.volume = Math.max(0, Math.min(1, startVol + volStep * currentStep));
      }
      if (currentStep >= steps) {
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
        if (toVolume === 0 && audioRef.current) {
          audioRef.current.pause();
          setBeatPlaying(false);
        } else if (audioRef.current) {
           audioRef.current.volume = toVolume;
        }
        if (callback) callback();
      }
    }, stepTime);
  };

  const handleStartCountdown = (targetStep: 'COUNTDOWN_A' | 'COUNTDOWN_B') => {
    setRoundStep(targetStep);
    setCountdown(3);
    if (audioRef.current) {
      // fade in over 3 seconds
      fadeAudio(targetVolumeRef.current, 3000);
    }
    
    let count = 3;
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    countdownIntervalRef.current = window.setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(countdownIntervalRef.current!);
        setCountdown(null);
        setRoundStep(targetStep === 'COUNTDOWN_A' ? 'ACTIVE_A' : 'ACTIVE_B');
        setTimerActive(true);
        lastTimeRef.current = performance.now();
      }
    }, 1000);
  };

  // Timer effect
  useEffect(() => {
    if (!timerActive) return;
    let raf: number;
    const tick = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const delta = time - lastTimeRef.current;
      if (delta >= 1000) {
        lastTimeRef.current = time;
        setTimeLeft(prev => {
          const next = Math.max(0, prev - 1);
          if (next === 0) {
            setTimerActive(false);
            playBeep();
            fadeAudio(0, 1000);
            setRoundStep(current =>
              current === 'ACTIVE_A' ? 'IDLE_B' : current === 'ACTIVE_B' ? 'ROUND_END' : current
            );
          }
          return next;
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [timerActive]);

  useEffect(() => {
    if (timeLeft === 0 && !timerActive) {
       if (roundStep === 'IDLE_B') {
         setActiveMC('B');
         setTimeLeft(getRoundTime());
       }
    }
  }, [timeLeft, timerActive, roundStep, getRoundTime]);

  // Set live state on mount
  useEffect(() => {
    if (!data?.event || !data?.battle) return;
    const { battle } = data;
    if (battle.state === 'pending' || battle.state === 'ready') {
      db.battles.update(battle.id, { state: 'live' });
    }
  }, [data]);

  // Early returns after all hooks
  if (data === undefined) return (
    <div className="flex items-center justify-center h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <p className="font-display text-2xl animate-pulse" style={{ color: 'var(--color-gray)' }}>CARREGANDO...</p>
    </div>
  );
  if (!data || !data.event || !data.battle) return (
    <div className="flex items-center justify-center h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <p className="font-display text-2xl" style={{ color: 'var(--color-red)' }}>BATALHA NÃO ENCONTRADA</p>
    </div>
  );

  const { event, battle, mcA, mcB } = data;

  // --- Beat handlers ---
  const selectBeat = (beat: Beat) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (beatObjectUrl) URL.revokeObjectURL(beatObjectUrl);

    const url = URL.createObjectURL(beat.audioData);
    setBeatObjectUrl(url);
    setSelectedBeat(beat);
    setBeatPlaying(false);
    setShowBeatPicker(false);

    const audio = new Audio(url);
    audio.volume = beatVolume;
    audio.loop = true;
    audioRef.current = audio;
  };

  const toggleBeat = () => {
    if (!audioRef.current) return;
    if (beatPlaying) {
      fadeAudio(0, 500);
    } else {
      fadeAudio(targetVolumeRef.current, 500);
    }
  };

  const stopBeat = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setBeatPlaying(false);
    }
  };

  // --- Timer handlers ---
  const toggleTimer = () => {
    if (!timerActive) lastTimeRef.current = performance.now();
    setTimerActive(!timerActive);
  };

  const resetTimer = (seconds = getRoundTime()) => {
    setTimerActive(false);
    setTimeLeft(seconds || 30); // 0 treated as free, but ui logic treats as 30 if undefined. Actually if getRoundTime is 0, we can just let it run negative or hide it.
    // For MVP, if it's 0 (Livre), we just set a very high number.
    if (seconds === 0) setTimeLeft(9999);
  };

  const sortearInicio = () => {
    const startsWithA = Math.random() > 0.5;
    setActiveMC(startsWithA ? 'A' : 'B');
    setRoundStep(startsWithA ? 'IDLE_A' : 'IDLE_B');
    resetTimer(getRoundTime());
  };

  const alternarMC = () => {
    const nextMC = activeMC === 'A' ? 'B' : 'A';
    setActiveMC(nextMC);
    setRoundStep(nextMC === 'A' ? 'IDLE_A' : 'IDLE_B');
    resetTimer(getRoundTime());
  };

  const proximoRound = () => {
    setRound(prev => prev + 1);
    setActiveMC('A');
    setRoundStep('IDLE_A');
    resetTimer(getRoundTime());
  };

  const handleVote = async (decision: 'A' | 'B' | 'DRAW') => {
    if (decision === 'DRAW') {
      if (battle.isTiebreaker) {
        alert('Não pode haver empate no desempate! Escolha um vencedor.');
        return;
      }
      stopBeat();
      setJudging(false);
      setRound(3);
      setActiveMC('A');
      setRoundStep('IDLE_A');
      resetTimer(getRoundTime());

      await db.battles.update(battle.id, { isTiebreaker: true, state: 'tiebreaker' });
      return;
    }

    const newWinnerId = decision === 'A' ? battle.mcAId : battle.mcBId;
    if (newWinnerId) {
      stopBeat();
      const allBattles = await db.battles.where('eventId').equals(event.id).toArray();
      const newBattles = advanceWinner(allBattles, battle.id, newWinnerId);
      await db.battles.bulkPut(newBattles);
      navigate(`/event/${event.id}`);
    }
  };

  const handleStartJudging = async () => {
    setTimerActive(false);
    fadeAudio(0, 1000);
    setJudging(true);
    await db.battles.update(battle.id, { state: 'judging' });
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    setScore(prev);
    setRound(r => Math.max(1, r - 1));
    setJudging(false);
    setActiveMC('A');
    setRoundStep('IDLE_A');
    resetTimer(getRoundTime());
  };

  const handleReset = () => {
    setScore({ A: 0, B: 0 });
    setHistory([]);
    setRound(1);
    setJudging(false);
    setActiveMC('A');
    setRoundStep('IDLE_A');
    setCountdown(null);
    resetTimer(getRoundTime());
    stopBeat();
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
  };

  const hasBeats = beats && beats.length > 0;

  // Colors based on colors from participant, fallback to Acid for A and Offwhite for B if not specified.
  
  // Custom CSS colors injected for blue since it's not in the original palette, or we just map it.
  // Actually, we don't have --color-blue defined in index.css yet!
  // I will use hex for blue to be safe, or assume standard colors.
  const getMcColor = (mcKey: 'A' | 'B') => {
    const mc = mcKey === 'A' ? mcA : mcB;
    if (mc?.color === 'red') return '#FF3030';
    if (mc?.color === 'blue') return '#3050FF';
    return mcKey === 'A' ? 'var(--color-acid)' : 'var(--color-offwhite)';
  };

  const currentMcColor = getMcColor(activeMC);

  return (
    <div
      className="flex flex-col h-screen overflow-hidden p-4 md:p-6"
      style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-offwhite)' }}
    >
      {/* Header */}
      <header className="flex justify-between items-center mb-4 pb-4 shrink-0" style={{ borderBottom: '2px solid var(--color-gray)' }}>
        <div>
          <button
            onClick={() => navigate(`/event/${event.id}`)}
            className="mb-1 text-sm font-display tracking-widest uppercase flex items-center gap-2 transition-colors"
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
            <img src="/assets/batalha/navigation/icon-arrow-left.png" alt="Voltar" className="h-4 object-contain transition-all" />
            VOLTAR PRO BRACKET
          </button>
          <div className="text-lg font-display tracking-widest uppercase" style={{ color: 'var(--color-gray)' }}>
            {battle.phase}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="font-display text-2xl md:text-4xl uppercase" style={{ color: 'var(--color-acid)' }}>
            ROUND {round}{battle.isTiebreaker && <span style={{ color: 'var(--color-red)', fontSize: '0.6em' }}> (DESEMPATE)</span>}
          </div>
          {/* Score HUD */}
          <div className="flex items-center gap-3 font-display text-2xl md:text-3xl">
            <span style={{ color: getMcColor('A'), textShadow: score.A > score.B ? `0 0 12px ${getMcColor('A')}` : 'none' }}>
              {score.A}
            </span>
            <span style={{ color: 'var(--color-gray)', fontSize: '0.7em' }}>×</span>
            <span style={{ color: getMcColor('B'), textShadow: score.B > score.A ? `0 0 12px ${getMcColor('B')}` : 'none' }}>
              {score.B}
            </span>
          </div>
        </div>
      </header>

      {judging ? (
        /* Judging screen */
        <div className="flex-1 flex flex-col items-center justify-center gap-8 relative">
          {/* Trophy Animation could go here */}
          <h2 className="text-4xl md:text-5xl font-display z-10">QUEM VENCEU?</h2>
          <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl z-10">
            {[{ label: mcA?.name || '?', key: 'A' as const, color: getMcColor('A') }, { label: mcB?.name || '?', key: 'B' as const, color: getMcColor('B') }].map(({ label, key, color }) => (
              <button
                key={key}
                onClick={() => handleVote(key)}
                className="flex-1 font-display py-16 transition-all"
                style={{
                  border: `4px solid ${color}`,
                  backgroundColor: 'var(--color-background)',
                  color: color,
                  fontSize: 'clamp(2rem, 6vw, 4rem)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = color;
                  (e.currentTarget as HTMLElement).style.color = 'var(--color-background)';
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-background)';
                  (e.currentTarget as HTMLElement).style.color = color;
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                }}
              >
                {label}
              </button>
            ))}
          </div>
          {!battle.isTiebreaker && (
            <button
              onClick={() => handleVote('DRAW')}
              className="font-display text-3xl py-6 px-16 transition-colors z-10"
              style={{ border: '2px solid var(--color-gray)', color: 'var(--color-gray)', backgroundColor: 'var(--color-background)' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-acid)';
                (e.currentTarget as HTMLElement).style.color = 'var(--color-acid)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-gray)';
                (e.currentTarget as HTMLElement).style.color = 'var(--color-gray)';
              }}
            >
              EMPATE
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Main battle arena */}
          <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0 relative">
            
            {/* Giant Countdown Overlay */}
            {countdown !== null && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="font-display animate-ping" style={{ fontSize: '20rem', color: currentMcColor, textShadow: `0 0 40px ${currentMcColor}` }}>
                  {countdown}
                </div>
              </div>
            )}

            {/* MC A */}
            <div
              className="flex-1 flex flex-col transition-all"
              style={{
                border: `4px solid ${activeMC === 'A' ? getMcColor('A') : 'var(--color-gray)'}`,
                opacity: activeMC === 'A' ? 1 : 0.45
              }}
            >
              <div
                className="flex-1 flex items-center justify-center font-display uppercase p-4 text-center break-words"
                style={{
                  fontSize: 'clamp(2.5rem, 7vw, 6rem)',
                  color: activeMC === 'A' ? getMcColor('A') : 'var(--color-gray)'
                }}
              >
                {mcA?.name || '?'}
              </div>
              {activeMC === 'A' && (
                <div className="font-display text-xl p-3 text-center" style={{ backgroundColor: getMcColor('A'), color: 'var(--color-background)' }}>
                  {roundStep === 'IDLE_A' ? 'AGUARDANDO' : roundStep === 'COUNTDOWN_A' ? 'PREPARA...' : 'RIMANDO'}
                </div>
              )}
            </div>

            {/* Center — Timer + Beat */}
            <div className="w-full md:w-60 lg:w-72 flex flex-col items-center justify-between gap-3 shrink-0 py-2">
              {/* Timer & Round Control */}
              <div className="flex flex-col items-center gap-2 w-full">
                <div
                  className="font-display tracking-tighter"
                  style={{
                    fontSize: 'clamp(4rem, 12vw, 7rem)',
                    color: timeLeft <= 5 && timerActive ? 'var(--color-red)' : 'var(--color-offwhite)',
                    lineHeight: 1
                  }}
                >
                  {timeLeft > 9000 ? '∞' : timeLeft.toString().padStart(2, '0')}
                </div>

                {/* Progress bar */}
                {timeLeft <= 9000 && (
                  <div className="w-full h-2 rounded-none" style={{ backgroundColor: 'var(--color-gray)' }}>
                    <div
                      className="h-2 transition-all duration-1000"
                      style={{
                        width: `${(timeLeft / getRoundTime()) * 100}%`,
                        backgroundColor: timeLeft <= 5 && timerActive ? 'var(--color-red)' : currentMcColor
                      }}
                    />
                  </div>
                )}

                {/* Contextual Action Button based on strict round step */}
                <div className="w-full mt-2">
                  {roundStep === 'IDLE_A' && (
                    <button
                      onClick={() => handleStartCountdown('COUNTDOWN_A')}
                      className="w-full py-4 font-display text-2xl animate-pulse"
                      style={{ backgroundColor: getMcColor('A'), color: 'var(--color-background)' }}
                    >
                      SOLTA O BEAT (A)
                    </button>
                  )}
                  {roundStep === 'IDLE_B' && (
                    <button
                      onClick={() => handleStartCountdown('COUNTDOWN_B')}
                      className="w-full py-4 font-display text-2xl animate-pulse"
                      style={{ backgroundColor: getMcColor('B'), color: 'var(--color-background)' }}
                    >
                      RESPOSTA (B)
                    </button>
                  )}
                  {roundStep === 'ROUND_END' && (
                    <button
                      onClick={handleStartJudging}
                      className="w-full py-4 font-display text-2xl"
                      style={{ backgroundColor: 'var(--color-acid)', color: 'var(--color-background)' }}
                    >
                      IR PARA JULGAMENTO
                    </button>
                  )}
                  {(roundStep === 'ACTIVE_A' || roundStep === 'ACTIVE_B') && (
                     <div className="flex gap-2 w-full">
                       <button
                         onClick={toggleTimer}
                         className="flex-1 py-3 font-display text-lg"
                         style={{
                           border: `2px solid ${timerActive ? 'var(--color-red)' : 'var(--color-offwhite)'}`,
                           backgroundColor: timerActive ? 'var(--color-red)' : 'transparent',
                           color: 'var(--color-offwhite)'
                         }}
                       >
                         {timerActive ? '⏸ PAUSAR' : '▶ PLAY'}
                       </button>
                       <button
                         onClick={() => {
                           // Manual skip to end of this person's turn
                           if (roundStep === 'ACTIVE_A') {
                              setRoundStep('IDLE_B');
                              setActiveMC('B');
                              setTimeLeft(getRoundTime());
                              fadeAudio(0, 1000);
                              setTimerActive(false);
                           } else {
                              setRoundStep('ROUND_END');
                              fadeAudio(0, 1000);
                              setTimerActive(false);
                           }
                         }}
                         className="py-3 px-4 font-display text-lg"
                         style={{ border: '2px solid var(--color-gray)', color: 'var(--color-gray)' }}
                         title="Pular turno"
                       >
                         ⏭
                       </button>
                     </div>
                  )}
                </div>
              </div>

              {/* Beat Player */}
              <div className="w-full flex flex-col gap-2 mt-auto">
                <div
                  className="text-xs font-display tracking-widest uppercase mb-1"
                  style={{ color: 'var(--color-gray)' }}
                >
                  🎵 BEAT
                </div>

                {selectedBeat ? (
                  <div className="flex flex-col gap-2">
                    {/* Beat name */}
                    <div
                      className="font-display text-sm uppercase truncate p-2"
                      style={{ border: '1px solid var(--color-gray)', color: 'var(--color-acid)' }}
                    >
                      {selectedBeat.name}
                    </div>

                    {/* Beat controls */}
                    <div className="flex gap-2">
                      <button
                        onClick={toggleBeat}
                        className="flex-1 py-1 flex items-center justify-center transition-colors"
                        style={{
                          border: `2px solid ${beatPlaying ? 'var(--color-acid)' : 'var(--color-gray)'}`,
                          backgroundColor: beatPlaying ? 'rgba(245,230,0,0.1)' : 'transparent',
                        }}
                      >
                        <img src={beatPlaying ? "/assets/batalha/icons/icon-pause.png" : "/assets/batalha/icons/icon-play.png"} alt="Play/Pause" className="h-10 object-contain" style={{ filter: beatPlaying ? 'drop-shadow(0 0 4px var(--color-acid))' : 'none' }} />
                      </button>
                      <button
                        onClick={stopBeat}
                        className="py-1 px-2 flex items-center justify-center transition-colors"
                        style={{ border: '2px solid var(--color-gray)' }}
                        title="Parar beat"
                        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-offwhite)')}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-gray)')}
                      >
                        <img src="/assets/batalha/icons/icon-stop.png" alt="Stop" className="h-10 object-contain opacity-70 hover:opacity-100 transition-opacity" />
                      </button>
                      <button
                        onClick={() => setShowBeatPicker(true)}
                        className="py-1 px-2 flex items-center justify-center transition-colors"
                        style={{ border: '2px solid var(--color-gray)' }}
                        title="Trocar beat"
                        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-offwhite)')}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-gray)')}
                      >
                        <img src="/assets/batalha/icons/icon-swap.png" alt="Swap" className="h-10 object-contain opacity-70 hover:opacity-100 transition-opacity" />
                      </button>
                    </div>

                    {/* Volume */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-display" style={{ color: 'var(--color-gray)' }}>VOL</span>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={beatVolume}
                        onChange={e => setBeatVolume(Number(e.target.value))}
                        className="flex-1 accent-yellow-300 h-1"
                        style={{ accentColor: 'var(--color-acid)' }}
                      />
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => hasBeats ? setShowBeatPicker(true) : navigate('/beats')}
                    className="w-full py-3 font-display text-sm uppercase"
                    style={{ border: `2px dashed ${hasBeats ? 'var(--color-gray)' : 'var(--color-red)'}`, color: hasBeats ? 'var(--color-gray)' : 'var(--color-red)' }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-acid)';
                      (e.currentTarget as HTMLElement).style.color = 'var(--color-acid)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = hasBeats ? 'var(--color-gray)' : 'var(--color-red)';
                      (e.currentTarget as HTMLElement).style.color = hasBeats ? 'var(--color-gray)' : 'var(--color-red)';
                    }}
                  >
                    {hasBeats ? '+ ESCOLHER BEAT' : '⚠ IMPORTAR BEAT'}
                  </button>
                )}
              </div>
            </div>

            {/* MC B */}
            <div
              className="flex-1 flex flex-col transition-all"
              style={{
                border: `4px solid ${activeMC === 'B' ? getMcColor('B') : 'var(--color-gray)'}`,
                opacity: activeMC === 'B' ? 1 : 0.45
              }}
            >
              <div
                className="flex-1 flex items-center justify-center font-display uppercase p-4 text-center break-words"
                style={{
                  fontSize: 'clamp(2.5rem, 7vw, 6rem)',
                  color: activeMC === 'B' ? getMcColor('B') : 'var(--color-gray)'
                }}
              >
                {mcB?.name || '?'}
              </div>
              {activeMC === 'B' && (
                <div className="font-display text-xl p-3 text-center" style={{ backgroundColor: getMcColor('B'), color: 'var(--color-background)' }}>
                  {roundStep === 'IDLE_B' ? 'AGUARDANDO' : roundStep === 'COUNTDOWN_B' ? 'PREPARA...' : 'RIMANDO'}
                </div>
              )}
            </div>
          </div>

          {/* Action bar */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0">
            {[
              { label: 'SORTEAR INÍCIO', icon: '/assets/batalha/icons/icon-dice.png', action: sortearInicio },
              { label: 'ALTERNAR MC', icon: '/assets/batalha/icons/icon-switch-mc.png', action: alternarMC },
              { label: 'PRÓXIMO ROUND', icon: '/assets/batalha/icons/icon-check.png', action: proximoRound },
            ].map(btn => (
              <button
                key={btn.label}
                onClick={btn.action}
                className="py-2 flex flex-col items-center justify-center gap-1 font-display text-xs"
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
                <img src={btn.icon} alt={btn.label} className="h-8 object-contain transition-all" />
                {btn.label}
              </button>
            ))}
            <button
              onClick={handleStartJudging}
              className="py-2 flex flex-col items-center justify-center gap-1 font-display text-xs transition-colors"
              style={{ border: '2px solid var(--color-offwhite)', backgroundColor: 'var(--color-offwhite)', color: 'var(--color-background)' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-acid)';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-acid)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-offwhite)';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-offwhite)';
              }}
            >
              <img src="/assets/batalha/icons/icon-judge.png" alt="Julgamento" className="h-8 object-contain" style={{ filter: 'invert(1)' }} />
              JULGAMENTO
            </button>
          </div>

          {/* Manual override buttons */}
          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 shrink-0">
            <button
              onClick={() => handleVote('A')}
              className="py-2 font-display text-xs uppercase transition-colors"
              style={{ border: `2px solid ${getMcColor('A')}`, color: getMcColor('A') }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = getMcColor('A');
                (e.currentTarget as HTMLElement).style.color = 'var(--color-background)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                (e.currentTarget as HTMLElement).style.color = getMcColor('A');
              }}
            >
              🏆 VENCE A
            </button>
            <button
              onClick={() => handleVote('B')}
              className="py-2 font-display text-xs uppercase transition-colors"
              style={{ border: `2px solid ${getMcColor('B')}`, color: getMcColor('B') }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = getMcColor('B');
                (e.currentTarget as HTMLElement).style.color = 'var(--color-background)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                (e.currentTarget as HTMLElement).style.color = getMcColor('B');
              }}
            >
              🏆 VENCE B
            </button>
            <button
              onClick={handleUndo}
              disabled={history.length === 0}
              className="py-2 font-display text-xs uppercase transition-colors"
              style={{
                border: `2px solid ${history.length === 0 ? 'var(--color-gray)' : 'var(--color-offwhite)'}`,
                color: history.length === 0 ? 'var(--color-gray)' : 'var(--color-offwhite)',
                opacity: history.length === 0 ? 0.4 : 1,
              }}
            >
              ⟲ UNDO
            </button>
            <button
              onClick={handleReset}
              className="py-2 font-display text-xs uppercase transition-colors"
              style={{ border: '2px solid var(--color-red)', color: 'var(--color-red)' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-red)';
                (e.currentTarget as HTMLElement).style.color = 'var(--color-background)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                (e.currentTarget as HTMLElement).style.color = 'var(--color-red)';
              }}
            >
              ↺ RESET
            </button>
          </div>
        </>
      )}

      {/* Beat Picker Modal */}
      {showBeatPicker && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-8"
          style={{ backgroundColor: 'rgba(9,9,9,0.92)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowBeatPicker(false); }}
        >
          <div
            className="w-full md:max-w-xl flex flex-col max-h-[80vh]"
            style={{ backgroundColor: 'var(--color-background)', border: '2px solid var(--color-offwhite)' }}
          >
            {/* Modal header */}
            <div
              className="flex justify-between items-center p-4 shrink-0"
              style={{ borderBottom: '2px solid var(--color-gray)' }}
            >
              <h2 className="font-display text-2xl" style={{ color: 'var(--color-acid)' }}>ESCOLHER BEAT</h2>
              <button
                onClick={() => setShowBeatPicker(false)}
                className="font-display text-xl px-3 py-1"
                style={{ border: '2px solid var(--color-gray)', color: 'var(--color-gray)' }}
              >
                X
              </button>
            </div>

            {/* Beat list */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {beats && beats.length > 0 ? beats.map(beat => (
                <button
                  key={beat.id}
                  onClick={() => selectBeat(beat)}
                  className="w-full text-left p-4 font-display text-xl uppercase transition-all flex justify-between items-center"
                  style={{
                    border: `2px solid ${selectedBeat?.id === beat.id ? 'var(--color-acid)' : 'var(--color-gray)'}`,
                    color: selectedBeat?.id === beat.id ? 'var(--color-acid)' : 'var(--color-offwhite)',
                    backgroundColor: selectedBeat?.id === beat.id ? 'rgba(245,230,0,0.05)' : 'transparent'
                  }}
                  onMouseEnter={e => {
                    if (selectedBeat?.id !== beat.id) {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-offwhite)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (selectedBeat?.id !== beat.id) {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-gray)';
                    }
                  }}
                >
                  <span className="truncate">{beat.name}</span>
                  {selectedBeat?.id === beat.id && <span>✓</span>}
                </button>
              )) : (
                <div className="text-center py-8" style={{ color: 'var(--color-gray)' }}>
                  <p className="font-display text-xl mb-4">NENHUM BEAT IMPORTADO</p>
                  <button
                    onClick={() => { setShowBeatPicker(false); navigate('/beats'); }}
                    className="font-display text-sm py-2 px-6"
                    style={{ border: '2px solid var(--color-offwhite)', color: 'var(--color-offwhite)' }}
                  >
                    IR PARA BEATS
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
