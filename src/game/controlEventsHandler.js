import * as THREE from 'three';

import { agentRadius, initialAgentPosition } from '../constants';
import { getAgent, getCamera, getScene } from './gameObjectsStore';
import { quaternion } from '../helpers';

// FIXME: debug:
window.THREE = THREE;

import throttle from 'lodash/throttle';

const distanceToAgent = 50;
const initialCameraRotation = [0,0,0];
const rotationQuaternion = new THREE.Quaternion();
rotationQuaternion.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), -Math.PI / 2 );

// FIXME: debug:
window.rotationQuaternion = rotationQuaternion;

class ControlEventsHandler {
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

  camera = null
  cameraBallJoint = null
  cameraBallJointRotationQuaternion = new THREE.Quaternion()

  updateInfo() {
    this.info = {
      ...this.info,
      // cameraBallJointRotationFlags: this.cameraBallJointRotationFlags,
      // cameraBallJointRotationQuaternion: this.cameraBallJointRotationQuaternion,
      // cameraBallJointMovementFlags: this.cameraBallJointMovementFlags,
    };
    this.showInfo();
  }

  init({ enableGravity, showInfo }) {

    this.showInfo = showInfo;

    // ball joint
    this.cameraBallJoint = new THREE.Group();
    this.cameraBallJoint.position.set(...initialAgentPosition);

    getCamera().position.set(100, 0, 0);
    getCamera().lookAt(0, 0, 0);

    this.cameraBallJoint.add(getCamera());

    getScene().add(this.cameraBallJoint);

    // FIXME: debug:
    window.cameraBallJoint=this.cameraBallJoint;

    const pushMultiplier = 50;

    window.addEventListener( 'keydown', ( event ) => {
      switch ( event.keyCode ) {
      // case 66://b
      //   addAgent();
      //   break;
      case 71://g
        enableGravity(this.cameraBallJointRotationQuaternion);
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
        const up = new THREE.Vector3(0, 1*pushMultiplier, 0);
        up.applyQuaternion(this.cameraBallJointRotationQuaternion);
        getAgent().userData.physicsBody.applyForce(new window.Ammo.btVector3(up.x, up.y, up.z));
        //this.cameraBallJointMovementFlags.forward = true;
        break;
      case 40://down
        const down = new THREE.Vector3(0, -1*pushMultiplier, 0);
        down.applyQuaternion(this.cameraBallJointRotationQuaternion);
        getAgent().userData.physicsBody.applyForce(new window.Ammo.btVector3(down.x, down.y, down.z));
        //this.cameraBallJointMovementFlags.backward = true;
        break;
      case 37://left
        const left = new THREE.Vector3(0, 0, 1*pushMultiplier);
        left.applyQuaternion(this.cameraBallJointRotationQuaternion);
        getAgent().userData.physicsBody.applyForce(new window.Ammo.btVector3(left.x, left.y, left.z));
        //this.cameraBallJointMovementFlags.leftward = true;
        break;
      case 39://right
        const right = new THREE.Vector3(0, 0, -1*pushMultiplier);
        right.applyQuaternion(this.cameraBallJointRotationQuaternion);
        getAgent().userData.physicsBody.applyForce(new window.Ammo.btVector3(right.x, right.y, right.z));
        //this.cameraBallJointMovementFlags.rightward = true;
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
      // case 38://up
      //   this.cameraBallJointMovementFlags.forward = false;
      //   break;
      // case 40://down
      //   this.cameraBallJointMovementFlags.backward = false;
      //   break;
      // case 37://left
      //   this.cameraBallJointMovementFlags.leftward = false;
      //   break;
      // case 39://right
      //   this.cameraBallJointMovementFlags.rightward = false;
      //   break;
      }
      this.updateInfo();
    }, false );
  }

  transformAux = null

  update = (deltaTime, lastAgent) => {
    const { left, right, up, down, rollUp, rollDown } = this.cameraBallJointRotationFlags;
    const { forward, backward, leftward, rightward } = this.cameraBallJointMovementFlags;

    if (forward || backward) {
      const v = new THREE.Vector3(0, (forward ? 1 : -1) * 100 * deltaTime, 0);
      v.applyQuaternion(this.cameraBallJointRotationQuaternion);
      getAgent().position.add(v);
      this.cameraBallJoint.position.copy(getAgent().position);

      if (!this.transformAux) {
        this.transformAux = new window.Ammo.btTransform();
      }

      const motionState = getAgent().userData.physicsBody.getMotionState();
      const { x, y, z } = getAgent().position;

      if (motionState) {
        this.transformAux.setIdentity();
        this.transformAux.setOrigin( new window.Ammo.btVector3( x, y, z ) );
        motionState.setWorldTransform( this.transformAux );
        getAgent().userData.physicsBody.setMotionState(motionState);
        //getAgent().userData.physicsBody.setWorldTransform( this.transformAux );
      }
    }

    if (leftward || rightward) {
      const v = new THREE.Vector3(0, 0, (leftward ? 1 : -1) * 100 * deltaTime);
      v.applyQuaternion(this.cameraBallJointRotationQuaternion);
      getAgent().position.add(v);
      this.cameraBallJoint.position.copy(getAgent().position);

      if (!this.transformAux) {
        this.transformAux = new window.Ammo.btTransform();
      }

      const motionState = getAgent().userData.physicsBody.getMotionState();
      const { x, y, z } = getAgent().position;

      if (motionState) {
        this.transformAux.setIdentity();
        this.transformAux.setOrigin( new window.Ammo.btVector3( x, y, z ) );
        //motionState.setWorldTransform( this.transformAux );
        //getAgent().userData.physicsBody.setMotionState(motionState);
        getAgent().userData.physicsBody.setWorldTransform( this.transformAux );
      }
    }

    if (left || right) {
      this.cameraBallJointRotationQuaternion.multiply(
        quaternion([0, 1, 0], (right ? 1 : -1) * deltaTime),
      );
    }

    if (up || down) {
      this.cameraBallJointRotationQuaternion.multiply(
        quaternion([0, 0, 1], (down ? -1 : 1) * deltaTime),
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

const controlEventsHandlerInstance = new ControlEventsHandler();

export default controlEventsHandlerInstance;
