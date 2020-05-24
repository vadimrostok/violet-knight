import { Quaternion, Vector3 } from 'three';

import { getAgent, getCameraBallJoint } from './gameObjectsStore';
import { pushMultiplier } from '../constants';
import { quaternion } from '../helpers';
import controlEventsHandlerInstance from './controlEventsHandler.js';
import graphicsInstance from './../graphics/graphics.js';
import physicsInstance from './../physics/physics.js';

const cameraBallJointRotationQuaternion = new Quaternion();

function actOnCameraBallJoint(deltaTime) {
  const {
    left, right, up, down, rollUp, rollDown,
  } = controlEventsHandlerInstance.cameraBallJointRotationFlags;

  if (left || right) {
    cameraBallJointRotationQuaternion.multiply(
      quaternion([0, 1, 0], (right ? 1 : -1) * deltaTime),
    );
  }

  if (up || down) {
    cameraBallJointRotationQuaternion.multiply(
      quaternion([0, 0, 1], (down ? -1 : 1) * deltaTime),
    );
  }

  if (rollUp || rollDown) {
    cameraBallJointRotationQuaternion.multiply(
      quaternion([1, 0, 0], (rollDown ? 1 : -1) * deltaTime),
    );
  }

  getCameraBallJoint().quaternion.copy(cameraBallJointRotationQuaternion);
}


let transformAux;

function actOnAgent(deltaTime) {
  const {
    up, down, left, right,
  } = controlEventsHandlerInstance.pushFlags;

  if (up) {
    const up = new Vector3(0, 1*pushMultiplier, 0);
    up.applyQuaternion(cameraBallJointRotationQuaternion);
    getAgent().userData.physicsBody.applyForce(new window.Ammo.btVector3(up.x, up.y, up.z));
    controlEventsHandlerInstance.pushFlags.up = false;
  } else if (down) {
    const down = new Vector3(0, -1*pushMultiplier, 0);
    down.applyQuaternion(cameraBallJointRotationQuaternion);
    getAgent().userData.physicsBody.applyForce(new window.Ammo.btVector3(down.x, down.y, down.z));
    controlEventsHandlerInstance.pushFlags.down = false;
  } else if (left) {
    const left = new Vector3(0, 0, 1*pushMultiplier);
    left.applyQuaternion(cameraBallJointRotationQuaternion);
    getAgent().userData.physicsBody.applyForce(new window.Ammo.btVector3(left.x, left.y, left.z));
    controlEventsHandlerInstance.pushFlags.left = false;
  } else if (right) {
    const right = new Vector3(0, 0, -1*pushMultiplier);
    right.applyQuaternion(cameraBallJointRotationQuaternion);
    getAgent().userData.physicsBody.applyForce(new window.Ammo.btVector3(right.x, right.y, right.z));
    controlEventsHandlerInstance.pushFlags.right = false;
  }
}

let gravityEnabled = controlEventsHandlerInstance.actionFlags.toggleGravity;
function actOnActions() {
  const { toggleGravity, punch } = controlEventsHandlerInstance.actionFlags;

  if (toggleGravity !== gravityEnabled) {
    gravityEnabled = toggleGravity;
    physicsInstance.setGravity(cameraBallJointRotationQuaternion, gravityEnabled ? -10 : 0);
  }

  if (punch) {
    const forward = new Vector3(-pushMultiplier*10, 0, 0);
    forward.applyQuaternion(cameraBallJointRotationQuaternion);
    getAgent().userData.physicsBody.applyForce(new window.Ammo.btVector3(forward.x, forward.y, forward.z));
    controlEventsHandlerInstance.actionFlags.punch = false;
  }
}

function ensureLocalObjects() {
  if (!transformAux) {
    transformAux = new window.Ammo.btTransform();
  }
}

export default function(deltaTime) {
  ensureLocalObjects();
  actOnCameraBallJoint(deltaTime);
  actOnAgent(deltaTime);
  actOnActions();

  physicsInstance.update(deltaTime);

  graphicsInstance.update();
}
