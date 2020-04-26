import * as THREE from 'three';

// debug:
window.THREE = THREE;

import throttle from 'lodash/throttle';
//import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js';
import { TrackballControls } from '../../node_modules/three/examples/jsm/controls/TrackballControls.js';

const distanceToAgent = 50;
const initialCameraRotation = [0,0,0];
const rotationQuaternion = new THREE.Quaternion();
rotationQuaternion.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), -Math.PI / 2 );

window.rotationQuaternion= rotationQuaternion;

class Controls {
  info = {
    gravityMultiplier: 0,
  }

  moveLeft = false
  moveRight = false
  moveTop = false
  moveBottom = false

  horizontalAngle = 0

  init(graphicsInstance, actions) {
    const { generateObject, setGravityMultiplier, getGravityMultiplier, updateInfo } = actions;

    //this.trackballControlsInstance = new OrbitControls(
    // this.trackballControlsInstance = new TrackballControls(
    //    graphicsInstance.camera,
    //    graphicsInstance.renderer.domElement,
    // );


    graphicsInstance.camera.position.set(100,100,100);
    graphicsInstance.camera.lookAt(0,0,0);
    graphicsInstance.camera.rotation.set(...initialCameraRotation);

    this.camera = graphicsInstance.camera;

    // this.trackballControlsInstance.rotateSpeed = 5;
    // this.trackballControlsInstance.zoomSpeed = 1.2;
    // this.trackballControlsInstance.panSpeed = 5;

    // this.trackballControlsInstance.keys = [ 65, 83, 68 ];

    window.addEventListener( 'keydown', ( event ) => {
      let ret = false;
      console.log('event.keyCode');
      switch ( event.keyCode ) {
        case 66://b
          generateObject();
          break;
        case 65://a
          this.moveLeft = true;
          break;
        case 68://d
          this.moveRight = true;
          break;
        case 87://w
          this.moveTop = true;
          break;
        case 83://s
          this.moveBottom = true;
          break;
      }
    }, false );

    window.addEventListener( 'keyup', ( event ) => {
      this.moveLeft = this.moveRight = this.moveTop = this.moveBottom = false;
    }, false );

    const wheelMultiplier = 0.3;
    document.addEventListener( 'wheel', ( event ) => {
      const newGravityMultiplier = getGravityMultiplier() + (event.wheelDelta < 0 ? 1 : -1)*wheelMultiplier;
      setGravityMultiplier(newGravityMultiplier);
      this.info.gravityMultiplier = newGravityMultiplier;
      this.info.horizontalAngle = this.horizontalAngle;
      updateInfo();
    }, true );
  }

  update = (deltaTime, lastAgent) => {
    return;

    if (lastAgent) {
      const { x,y,z } = lastAgent.position;
      const camera = this.camera;
      //this.trackballControlsInstance.target.set(x,y,z);

      const vector = new THREE.Vector3( distanceToAgent, distanceToAgent, distanceToAgent );
      vector.applyQuaternion( rotationQuaternion );

      camera.position.set(x,y,z);
      camera.position.add(vector);

      camera.lookAt(x,y,z);
    }

    if (this.moveLeft) {
      console.log('move left', this.horizontalAngle, new THREE.Vector3(1,0,0));
      this.horizontalAngle += 1*deltaTime;
      rotationQuaternion.setFromAxisAngle(new THREE.Vector3(1,0,0), this.horizontalAngle);
    }
  }
  //}, 250)
};

const controlsInstance = new Controls();

export default controlsInstance;
