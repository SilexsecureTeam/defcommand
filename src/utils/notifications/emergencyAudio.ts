const emergencyAudio = {
  audio: null as HTMLAudioElement | null,
  isPlaying: false,

  play(src: string) {
    if (this.isPlaying) return;
    this.audio = new Audio(src);
    this.audio.loop = true;
    this.audio.play().catch(console.warn);
    this.isPlaying = true;
  },

  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
    }
    this.isPlaying = false;
  },
};

export default emergencyAudio;
