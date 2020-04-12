import * as THREE from 'three';
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js';

class Controls {
  controlsInstance = null

  get() {
    return this.controlsInstance;
  }

  init(graphicsInstance, actions) {
    const { generateObject } = actions;
    this.controlsInstance = new OrbitControls(
      graphicsInstance.camera,
      graphicsInstance.renderer.domElement,
    );

    window.addEventListener( 'keydown', function ( event ) {
      let ret = false;
      switch ( event.keyCode ) {
        case 66://b
          generateObject();
          break;
      }
    }, false );
  }
};

const controlsInstance = new Controls();

export default controlsInstance;
