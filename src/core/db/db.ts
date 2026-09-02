import Dexie, { type Table } from 'dexie';
import type { TournamentEvent, Beat } from '../types';

export class BatalhaDB extends Dexie {
  events!: Table<TournamentEvent, string>;
  beats!: Table<Beat, string>;

  constructor() {
    super('batalha_db');
    
    this.version(1).stores({
      events: 'id, name, createdAt, state',
      beats: 'id, name, createdAt'
    });
  }
}

export const db = new BatalhaDB();
