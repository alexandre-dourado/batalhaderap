
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../core/db/db';
import { useNavigate } from 'react-router-dom';

export function BeatsLibrary() {
  const navigate = useNavigate();
  const beats = useLiveQuery(() => db.beats.toArray());

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const id = `beat_${Date.now()}`;
    await db.beats.add({
      id,
      name: file.name.replace(/\.[^/.]+$/, ""),
      filename: file.name,
      duration: 0, // Simplified for MVP
      createdAt: Date.now(),
      audioData: file
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Remover este beat?')) {
      await db.beats.delete(id);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-4 md:p-8 pt-12">
      <button onClick={() => navigate(-1)} className="text-gray hover:text-white mb-8 text-sm font-display tracking-widest uppercase">
        ← Voltar
      </button>

      <h1 className="text-4xl md:text-5xl font-display mb-8 uppercase text-acid border-b-2 border-acid pb-4">
        BEATS
      </h1>

      <div className="mb-8 border-2 border-gray border-dashed p-8 text-center hover:border-offwhite transition-colors cursor-pointer relative">
        <input 
          type="file" 
          accept="audio/*" 
          onChange={handleUpload}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <div className="text-2xl font-display text-gray uppercase">
          + Importar Beat (MP3/WAV)
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {beats?.map(beat => {
          const audioUrl = URL.createObjectURL(beat.audioData);
          
          return (
            <div key={beat.id} className="border-2 border-offwhite p-4 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="font-display text-xl uppercase truncate flex-1 w-full">{beat.name}</div>
              
              <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                <audio 
                  src={audioUrl} 
                  controls 
                  className="h-10 max-w-[200px] md:max-w-xs"
                />
                <button 
                  onClick={() => handleDelete(beat.id)}
                  className="text-red hover:text-white font-display text-xl"
                  title="Excluir"
                >
                  X
                </button>
              </div>
            </div>
          );
        })}
        {beats?.length === 0 && (
          <div className="text-center text-gray p-8 border-2 border-gray">
            NENHUM BEAT ADICIONADO
          </div>
        )}
      </div>
    </div>
  );
}
