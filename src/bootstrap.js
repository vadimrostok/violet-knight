import Game from './entry.js';
import _ from './example.js';
//import _ from './example-cannon.js';

const game = new Game();

game.initialize();

const animate = function() {
  if (game.onFrame()) {
    window.requestAnimationFrame(animate);
  } else {
    game.onReastart(animate);
  };
};

animate();

if (module.onReload) {
  module.onReload(() => {
    window.location.reload();
  });
}
