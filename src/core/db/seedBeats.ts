import { db } from './db';

const FACTORY_BEATS = [
  { id: 'factory_bittersweet',      name: 'Bittersweet',         file: '/beats/bittersweet.opus' },
  { id: 'factory_buried',           name: 'Buried',              file: '/beats/buried.opus' },
  { id: 'factory_cold_heat',        name: 'Cold Heat',           file: '/beats/cold-heat.opus' },
  { id: 'factory_i_love_u_baby',    name: 'I Love U Baby',       file: '/beats/i-love-u-baby.opus' },
  { id: 'factory_lab_classic',      name: 'Lab Classic',         file: '/beats/lab-classic.opus' },
  { id: 'factory_laws_of_movement', name: 'Laws of Movement',    file: '/beats/laws-of-movement.opus' },
  { id: 'factory_let_bass_kick',    name: 'Let The Bass Kick',   file: '/beats/let-the-bass-kick.opus' },
  { id: 'factory_like_a_ho',        name: 'Like a Ho',           file: '/beats/like-a-ho.opus' },
  { id: 'factory_my_obstacles',     name: 'My Obstacles',        file: '/beats/my-obstacles.opus' },
  { id: 'factory_narc',             name: 'NARC',                file: '/beats/narc.opus' },
  { id: 'factory_sense_technique',  name: 'Sense and Technique', file: '/beats/sense-and-technique.opus' },
  { id: 'factory_art_of_soul',      name: 'The Art of Soul',     file: '/beats/the-art-of-soul.opus' },
  { id: 'factory_untouchable',      name: 'Untouchable',         file: '/beats/untouchable.opus' },
  { id: 'factory_mo_blues',         name: "Mo' Blues",           file: '/beats/mo-blues.opus' },
  { id: 'factory_cynical_plans',    name: 'Cynical Plans',       file: '/beats/cynical-plans.opus' },
];

const SEED_KEY = 'batalha_factory_beats_v2';

export async function seedFactoryBeats(): Promise<void> {
  // Runs only once per device
  if (localStorage.getItem(SEED_KEY)) return;

  try {
    let seededCount = 0;
    for (const beat of FACTORY_BEATS) {
      const existing = await db.beats.get(beat.id);
      if (existing) continue;

      const res = await fetch(beat.file);
      if (!res.ok) {
        console.warn(`[BATALHA] Beat não encontrado: ${beat.file}`);
        continue;
      }

      const blob = await res.blob();
      await db.beats.add({
        id: beat.id,
        name: beat.name,
        filename: beat.file,
        duration: 0,
        createdAt: Date.now(),
        audioData: blob,
      });
      seededCount++;
    }

    if (seededCount > 0 || FACTORY_BEATS.length === 0) {
      localStorage.setItem(SEED_KEY, '1');
      console.info(`[BATALHA] ${seededCount} beats de fábrica carregados com sucesso.`);
    } else {
      console.warn('[BATALHA] Nenhum beat foi carregado, tentando novamente na próxima carga.');
    }
  } catch (err) {
    // Silent fail — user can always import manually
    console.warn('[BATALHA] Seed de beats falhou silenciosamente:', err);
  }
}
