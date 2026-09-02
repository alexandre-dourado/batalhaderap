export interface TournamentSettings {
  participantsCount: 4 | 8 | 16 | 32 | 64;
  format: '1v1';
  roundTime?: number; // em segundos, 0 ou undefined para livre
}

export interface Participant {
  id: string;
  name: string;
  seed: number;
  color?: 'red' | 'blue' | 'random';
}

export interface Vote {
  decision: 'A' | 'B' | 'DRAW';
}

export type BattleState = 'pending' | 'ready' | 'live' | 'judging' | 'tiebreaker' | 'finished';

export interface Battle {
  id: string;
  eventId: string;
  phase: string;
  matchIndex: number;
  mcAId: string | null;
  mcBId: string | null;
  winnerId: string | null;
  state: BattleState;
  votes: Vote[];
  nextBattleId: string | null;
  isTiebreaker: boolean;
}

export interface TournamentEvent {
  id: string;
  name: string;
  city?: string;
  date?: number;
  settings: TournamentSettings;
  participants: Participant[];
  battles: Battle[];
  state: 'setup' | 'active' | 'finished';
  createdAt: number;
  randomSeed?: number;
}

export interface Beat {
  id: string;
  name: string;
  filename: string;
  duration: number;
  createdAt: number;
  audioData: Blob;
}
