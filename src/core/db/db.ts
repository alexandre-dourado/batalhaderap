import Dexie, { type Table } from 'dexie';
import type { TournamentEvent, Beat, Battle } from '../types';

export class BatalhaDB extends Dexie {
  events!: Table<TournamentEvent, string>;
  battles!: Table<Battle, string>;
  beats!: Table<Beat, string>;

  constructor() {
    super('batalha_db');
    
    this.version(1).stores({
      events: 'id, name, createdAt, state',
      beats: 'id, name, createdAt'
    });

    this.version(2).stores({
      events: 'id, name, createdAt, state',
      battles: 'id, eventId, phase, state, nextBattleId',
      beats: 'id, name, createdAt'
    }).upgrade(async tx => {
      // Migração V2: mover event.battles[] para a tabela independente battles
      const events = await tx.table('events').toArray();
      for (const ev of events) {
        if (ev.battles && ev.battles.length > 0) {
          await tx.table('battles').bulkAdd(ev.battles);
          // Omit battles do evento
          delete ev.battles;
          await tx.table('events').put(ev);
        }
      }
    });
  }
}

export const db = new BatalhaDB();
