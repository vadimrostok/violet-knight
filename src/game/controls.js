import * as THREE from 'three';
import { quaternion } from '../helpers';

// debug:
window.THREE = THREE;

import throttle from 'lodash/throttle';

const distanceToAgent = 50;
const initialCameraRotation = [0,0,0];
const rotationQuaternion = new THREE.Quaternion();
rotationQuaternion.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), -Math.PI / 2 );

window.rotationQuaternion = rotationQuaternion;

class Controls {
  info = {
    gravityMultiplier: 0,
  }

  cameraBallJointRotationFlags = {
    left: false,
    right: false,
    up: false,
    down: false,
    rollUp: false,
    rollDown: false
  }
  cameraBallJointMovementFlags = {
    forward: false,
    backward: false,
    leftward: false,
    rightward: false,
  }

  horizontalAngle = 0

  agent = null
  camera = null
  cameraBallJoint = null
  cameraBallJointRotationQuaternion = new THREE.Quaternion()

  updateInfo() {
    this.info = {
      ...this.info,
      cameraBallJointRotationFlags: this.cameraBallJointRotationFlags,
      cameraBallJointRotationQuaternion: this.cameraBallJointRotationQuaternion,
      cameraBallJointMovementFlags: this.cameraBallJointMovementFlags,
    };
    this.showInfo();
  }

  init(graphicsInstance, actions) {
    const { addAgent, enableGravity, setGravityMultiplier, getGravityMultiplier, showInfo } = actions;
    this.showInfo = showInfo;

    // ball joint
    const radius = 3;
    this.agent = graphicsInstance.createAgent(radius);
    //this.agent.visible = false;
    this.agent.position.set( 0, 0, 0);

    this.cameraBallJoint = new THREE.Group();
    this.cameraBallJoint.position.set( 0, 20, 0);

    this.cameraBallJoint.add(this.agent);

    graphicsInstance.camera.position.set(50,0,0);
    graphicsInstance.camera.lookAt(0,0,0);

    this.cameraBallJoint.add(graphicsInstance.camera);

    graphicsInstance.scene.add(this.cameraBallJoint);
    window.cameraBallJoint=this.cameraBallJoint;

    this.cameraBallJoint.agent = this.agent;

    addAgent(this.cameraBallJoint);

    //graphicsInstance.camera.rotation.set(...initialCameraRotation);

    this.camera = graphicsInstance.camera;

    window.addEventListener( 'keydown', ( event ) => {
      switch ( event.keyCode ) {
      case 66://b
        addAgent();
        break;
      case 71://g
        enableGravity();
        break;
      case 65://a
        this.cameraBallJointRotationFlags.left = true;
        break;
      case 68://d
        this.cameraBallJointRotationFlags.right = true;
        break;
        case 87://w
        this.cameraBallJointRotationFlags.up = true;
        break;
      case 83://s
        this.cameraBallJointRotationFlags.down = true;
        break;
      case 81://q
        this.cameraBallJointRotationFlags.rollUp = true;
        break;
      case 69://e
        this.cameraBallJointRotationFlags.rollDown = true;
        break;
      case 38://up
        this.cameraBallJointMovementFlags.forward = true;
        break;
      case 40://down
        this.cameraBallJointMovementFlags.backward = true;
        break;
      case 37://left
        this.cameraBallJointMovementFlags.leftward = true;
        break;
      case 39://right
        this.cameraBallJointMovementFlags.rightward = true;
        break;
      }
      this.updateInfo();
    }, false);

    window.addEventListener( 'keyup', ( event ) => {
      switch ( event.keyCode ) {
      case 65://a
        this.cameraBallJointRotationFlags.left = false;
        break;
      case 68://d
        this.cameraBallJointRotationFlags.right = false;
        break;
      case 87://w
        this.cameraBallJointRotationFlags.up = false;
        break;
      case 83://s
        this.cameraBallJointRotationFlags.down = false;
        break;
      case 81://q
        this.cameraBallJointRotationFlags.rollUp = false;
        break;
      case 69://e
        this.cameraBallJointRotationFlags.rollDown = false;
        break;
      case 38://up
        this.cameraBallJointMovementFlags.forward = false;
        break;
      case 40://down
        this.cameraBallJointMovementFlags.backward = false;
        break;
      case 37://left
        this.cameraBallJointMovementFlags.leftward = false;
        break;
      case 39://right
        this.cameraBallJointMovementFlags.rightward = false;
        break;
      }
      this.updateInfo();
    }, false );

    const wheelMultiplier = 0.3;
    document.addEventListener( 'wheel', ( event ) => {
      const newGravityMultiplier = getGravityMultiplier() + (event.wheelDelta < 0 ? 1 : -1)*wheelMultiplier;
      setGravityMultiplier(newGravityMultiplier);
      this.info.gravityMultiplier = newGravityMultiplier;
      this.info.horizontalAngle = this.horizontalAngle;
      this.updateInfo();
    }, true );
  }

  update = (deltaTime, lastAgent) => {
    const { left, right, up, down, rollUp, rollDown } = this.cameraBallJointRotationFlags;
    const { forward, backward, leftward, rightward } = this.cameraBallJointMovementFlags;

    if (forward || backward) {
      //const v = new THREE.Vector3((backward ? 1 : -1) * 100 * deltaTime, 0, 0);
      const v = new THREE.Vector3(0, (forward ? 1 : -1) * 100 * deltaTime, 0);
      v.applyQuaternion(this.cameraBallJointRotationQuaternion);
      this.cameraBallJoint.position.add(v);
    }

    if (leftward || rightward) {
      const v = new THREE.Vector3(0, 0, (leftward ? 1 : -1) * 100 * deltaTime);
      //const v = new THREE.Vector3(0, 0, (rightward ? 1 : -1) * 100 * deltaTime);
      v.applyQuaternion(this.cameraBallJointRotationQuaternion);
      this.cameraBallJoint.position.add(v);
    }

    if (left || right) {
      this.cameraBallJointRotationQuaternion.multiply(
        quaternion([0, 1, 0], (right ? 1 : -1) * deltaTime),
      );
    }

    if (up || down) {
      this.cameraBallJointRotationQuaternion.multiply(
        quaternion([0, 0, 1], (down ? 1 : -1) * deltaTime),
      );
    }

    if (rollUp || rollDown) {
      this.cameraBallJointRotationQuaternion.multiply(
        quaternion([1, 0, 0], (rollDown ? 1 : -1) * deltaTime),
      );
    }

    this.cameraBallJoint.quaternion.copy(this.cameraBallJointRotationQuaternion);

  }
};

const controlsInstance = new Controls();

export default controlsInstance;
