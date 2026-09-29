export const AudioManager = {
  activeAudios: new Set<HTMLAudioElement>(),
  
  register(audio: HTMLAudioElement) {
    this.activeAudios.add(audio);
    
    const handlePlay = () => this.pauseOthers(audio);
    const handleEnded = () => this.activeAudios.delete(audio);
    
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('ended', handleEnded);
      this.activeAudios.delete(audio);
    };
  },
  
  pauseOthers(currentAudio: HTMLAudioElement) {
    // Pause tracked programmatic audios
    this.activeAudios.forEach(a => {
      if (a !== currentAudio && !a.paused) {
        a.pause();
      }
    });
    
    // Pause DOM audios
    const domAudios = document.getElementsByTagName('audio');
    for (let i = 0; i < domAudios.length; i++) {
      if (domAudios[i] !== currentAudio && !domAudios[i].paused) {
        domAudios[i].pause();
      }
    }
  },

  pauseAll() {
    this.activeAudios.forEach(a => {
      if (!a.paused) a.pause();
    });
    const domAudios = document.getElementsByTagName('audio');
    for (let i = 0; i < domAudios.length; i++) {
      if (!domAudios[i].paused) domAudios[i].pause();
    }
  }
};

// Hook for DOM audios
if (typeof document !== 'undefined') {
  document.addEventListener('play', (e) => {
    if (e.target instanceof HTMLAudioElement) {
      AudioManager.pauseOthers(e.target);
    }
  }, true);
}
