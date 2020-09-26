import { BufferLoader } from '../helpers';

class Audio {
  context = null

  isFinishedLoading = false 
  
  constructor() {
    // Fix up prefixing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.context = new window.AudioContext();

    const montyPythonSounds = [
      'nonepass', 'bestman', 'bitelegs', 'fart', 'ni', 'noo',
      'pigdog', 'strprson', 'thatcase', 'victory', 'wipe',
    ];

    this.buffersPromise = new Promise((resolve, reject) => {
      const bufferLoader = new BufferLoader(
        this.context,
        [
          `/public/punch.wav.m4a`,
          ...montyPythonSounds.map(id => `/public/mp/${id}.wav.m4a`)
        ],
        buffers => resolve(buffers.map(buffer => {
          let source = this.context.createBufferSource();
          source.buffer = buffer;
          source.connect(this.context.destination);

          source.play = () => {
            source.start(0);
            source = this.context.createBufferSource();
            source.buffer = buffer;
            source.connect(this.context.destination);
          };
          return source;
        })),
      );

      bufferLoader.load();
    });
  }

  targets = []
  async greeting() {
    const [punch, greeting] = await this.buffersPromise;

    greeting.play();
  }
  async punch() {
    const [punch] = await this.buffersPromise;

    punch.play();
  }
  async nextTarget() {
    const [punch, greeting, ...targetBuffers] = await this.buffersPromise;

    targetBuffers[this.targets.pop()].play();

    if (!this.targets.length) {
      this.setAndShuffleTargets();
    }
  }
  setAndShuffleTargets() {
    this.targets = [];
    for (let i = 0; i < 10; i++) {
      this.targets.push(i);
    }

    // Shuffle:
    for(let i = this.targets.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = this.targets[i];
      this.targets[i] = this.targets[j];
      this.targets[j] = temp;
    } 
  }
  newGame() {
    this.setAndShuffleTargets();

    // Initial sound:
    this.greeting();
  }
}

const audioInstance = new Audio();
window.audioInstance=audioInstance;
export default audioInstance;
