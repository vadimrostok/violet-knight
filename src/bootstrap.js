import GameLauncher from './game/launcher.js';
//import _ from './example.js';
//import _ from './example-cannon.js';

GameLauncher.init();

if (module.onReload) {
  module.onReload(() => {
    window.location.reload();
  });
}
