import { Quaternion, Vector3, Object3D, Euler } from 'three';

import {
  agentRadius,
  cameraPositionRelativeToAgent,
  guideMovementInterval,
  guidePositionY,
  pushMultiplier
} from '../constants';
import {
  getAgent,
  getCamera,
  getCameraBallJoint,
  getGuide,
  getPointLight
} from './gameObjectsStore';
import { quaternion, toRadians } from '../helpers';
import { shaderMaterial } from '../graphics/materials.js';
import controlEventsHandlerInstance from './controlEventsHandler.js';
import graphicsInstance from './../graphics/graphics.js';
// import physicsInstance from './../physics/physics.js';
import physicsWorkerInterfaceInstance from './../physics/workerInterfaceModule.js';
import audioInstance from './audio';

const cameraBallJointRotationQuaternion = new Quaternion();

function actOnCameraBallJoint(deltaTime) {
  const { isMoving } = controlEventsHandlerInstance.pointer;
  if (isMoving) {
    const { delta: { x, y } } = controlEventsHandlerInstance.pointer;
    cameraBallJointRotationQuaternion.multiply(
      quaternion([0, 1, 0], x / 10 * deltaTime),
    );
    cameraBallJointRotationQuaternion.multiply(
      quaternion([0, 0, 1], -y / 10 * deltaTime),
    );
    getCameraBallJoint().quaternion.copy(cameraBallJointRotationQuaternion);
  } else {
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
}


function actOnAgent(deltaTime) {

  const agent = getAgent();
  const forward = new Vector3(-agentRadius, 0, 0);
  forward.applyQuaternion(cameraBallJointRotationQuaternion);
  forward.add(agent.position);

  getPointLight().position.copy(forward);
}

let time = 0;
let gravityEnabled = controlEventsHandlerInstance.actionFlags.toggleGravity;
function actOnActions() {
  const {
    toggleGravity, showPunchControls, hidePunchControls, punchControlsActive, punch,
    help, freeze, restart,
  } = controlEventsHandlerInstance.actionFlags;

  if (showPunchControls) {
    time = 0.0001;
    getGuide().visible = true;
    controlEventsHandlerInstance.actionFlags.showPunchControls = false;
  }

  if (hidePunchControls) {
    getGuide().visible = false;
    controlEventsHandlerInstance.actionFlags.hidePunchControls = false;
  }

  if (punchControlsActive) {
    // shaderMaterial.uniforms.time.value = time * 25;
    getGuide().position.y = guidePositionY - (time % guideMovementInterval)*5;
    controlEventsHandlerInstance.actionFlags.hidePunchControls = false;
  }

  if (punch) {
    const forward = new Vector3(-pushMultiplier*(time % guideMovementInterval)*10, 0, 0);
    forward.applyQuaternion(cameraBallJointRotationQuaternion);
    physicsWorkerInterfaceInstance.punch(forward);
    audioInstance.punch();
    controlEventsHandlerInstance.actionFlags.punch = false;
  }

  if (help) {
    controlEventsHandlerInstance.actionFlags.help = false;
    const helpOverlay = document.getElementById('help-container');
    const gameOverlay = document.getElementById('game-controls-container');
    helpOverlay.classList.toggle('hidden');
    gameOverlay.classList.toggle('hidden');
  }

  if (freeze) {
    controlEventsHandlerInstance.actionFlags.freeze = false;
    physicsWorkerInterfaceInstance.freeze();
  }

  if (restart) {
    // console.log('restart');
  }
}

export default function(deltaTime) {
  actOnCameraBallJoint(deltaTime);
  actOnAgent(deltaTime);
  actOnActions();

  graphicsInstance.update();

  time += deltaTime;
  shaderMaterial.uniforms.time.value = time * 25;
}
