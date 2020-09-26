import 'regenerator-runtime/runtime.js';

import * as THREE from 'three';
import throttle from 'lodash/throttle';

import { ConvexObjectBreaker } from '../../node_modules/three/examples/jsm/misc/ConvexObjectBreaker.js';
import { OBJLoader } from '../../node_modules/three/examples/jsm/loaders/OBJLoader.js';
import {
  agentRadius,
  boundingSphereRadius,
  initialAgentPosition,
  targetMass
} from '../constants';
import {
  getAgent,
  getScene,
  setAgent,
  setLevel,
  setTarget
} from './gameObjectsStore';
import { getTargetMaterial } from '../graphics/materials';
import { isTouchDevice } from '../helpers';
import { levelMaterial } from './../graphics/materials.js';
import {
  start as startSettingsBlock,
  stop as stopSettingsBlock,
} from './settings';
import Stats from '../../node_modules/three/examples/jsm/libs/stats.module.js';
import audioInstance from './audio.js';
import controlEventsHandlerInstance from './controlEventsHandler.js';
import graphicsInstance from './../graphics/graphics.js';
import mainLoopBody from './mainLoopBody.js';
import physicsInstance from './../physics/physics.js';
import physicsWorkerInterfaceInstance from './../physics/workerInterfaceModule.js';

function buildInfoHtml(obj) {
  return Object.keys(obj).reduce(
    (str, key) => (typeof obj[key] === 'object') ?
      `${str}<br/>${key} : <p class="log-sub-tree">${buildInfoHtml(obj[key])}</p>` :
      `${str}<br/>${key} : ${obj[key]}`,
    ''
  );
}

const raycaster = new THREE.Raycaster();

class Launcher {
  meshLoadingManager = new THREE.LoadingManager()

  clock = new THREE.Clock()
  time = 0
  stats = null
  convexBreaker = new ConvexObjectBreaker();
  
  loop = () => {
    requestAnimationFrame( this.loop );

    const deltaTime = this.clock.getDelta();

    mainLoopBody(deltaTime);

    if (this.stats) {
      this.stats.update();
    }

    this.time += deltaTime;
  }

  infoNode = document.getElementById('info')

  showInfo = () => {
    this.infoNode.innerHTML = buildInfoHtml(controlEventsHandlerInstance.info);
  }

  generateTargets(targetCount) {
    for (let i = 0; i < targetCount; i++) {
      const [targetX, targetY, targetZ] = [1 + Math.random()*i*10,
                                           1 + Math.random()*i*10,
                                           1 + Math.random()*i*10];
      const targetGeometry = new THREE.BoxBufferGeometry(
        targetX, targetY, targetZ
      );
      const xInvert = (i % 2 === 0 ? 1 : -1);
      const yInvert = (i % 6 > 3 ? 1 : -1);
      const zInvert = (i % 4 >= 2 ? 1 : -1);
      const targetLocation = new THREE.Vector3(
        50 + xInvert*i*10 + xInvert*Math.random()*i*10,
        50 + yInvert*i*10 + zInvert*Math.random()*i*10,
        50 + zInvert*i*10 + zInvert*Math.random()*i*10,
      );
      const target = new THREE.Mesh( targetGeometry, getTargetMaterial() );
      target.position.copy(targetLocation);
      target.receiveShadow = true;

      getScene().add(target);
      this.convexBreaker.prepareBreakableObject(
        target, targetMass, new self.THREE.Vector3(), new self.THREE.Vector3(), true,
      );
      setTarget(i, target);
      physicsWorkerInterfaceInstance.addTarget(
        target.position, target.quaternion, target.geometry.attributes.position.array, i,
      );
    }
  }

  generateAgent() {
    const agent = graphicsInstance.createAgent(agentRadius);
    agent.position.set(...initialAgentPosition);

    physicsWorkerInterfaceInstance.setAgentPhysicsBody(initialAgentPosition);
    // physicsInstance.setAgentPhysicsBody(agent);

    setAgent(agent);

    // FIXME:
    window.agent = agent;
  }

  pause() {}
  resume() {}

  async init() {

    const startButton = document.getElementById('start');
    const settingsBlock = document.getElementById('settings');
    const gameBlock = document.getElementById('container');

    const helpOverlay = document.getElementById('help-container');
    const gameOverlay = document.getElementById('game-controls-container');

    // await physicsInstance.init();

    await physicsWorkerInterfaceInstance.init();

    graphicsInstance.init();
    // physicsInstance.initPhysics();

    this.generateTargets(10);
    this.generateAgent(10);

    this.loop();

    startSettingsBlock();

    if (isTouchDevice()) {

      controlEventsHandlerInstance.touchInit();

      const mobileHelpOverlay = document.getElementById('mobile-help-container');
      const mobileGameOverlay = document.getElementById('mobile-game-controls-container');
      document.querySelectorAll('.browser-controls').forEach(node => {
        node.classList.add('hidden');
      });
      document.querySelectorAll('.mobile-controls').forEach(node => {
        node.classList.remove('hidden');
      });
      document.querySelectorAll('.mobile-toggle-help').forEach(node => {
        node.addEventListener('click', () => {
          mobileHelpOverlay.classList.toggle('hidden');
          mobileGameOverlay.classList.toggle('hidden');
        });
      });
      mobileGameOverlay.classList.add('hidden');

      const startGame = () => {
        stopSettingsBlock();
        settingsBlock.classList.add('hidden');
        gameBlock.classList.remove('hidden');
        mobileHelpOverlay.classList.add('hidden');
        mobileGameOverlay.classList.remove('hidden');
        audioInstance.newGame();
      };

      startButton.addEventListener('click', startGame);

    } else {

      controlEventsHandlerInstance.mouseInit();

      this.stats = new Stats();
      this.stats.domElement.style.position = 'absolute';
      this.stats.domElement.style.top = '0px';
       gameBlock.appendChild( this.stats.domElement );

      controlEventsHandlerInstance.init({
        showInfo: this.showInfo,
      });

      const startGame = () => {
        stopSettingsBlock();
        settingsBlock.classList.add('hidden');
        gameBlock.classList.remove('hidden');
        helpOverlay.classList.add('hidden');
        gameOverlay.classList.remove('hidden');
        audioInstance.newGame();
      };

      startButton.addEventListener('click', startGame);

      // FIXME:
      startGame();

    }
  }
};

const launcherInstance = new Launcher();

export default launcherInstance;
