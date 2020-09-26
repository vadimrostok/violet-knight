import 'regenerator-runtime/runtime.js';

import { Clock, BoxBufferGeometry, Vector3, Mesh } from 'three';
import throttle from 'lodash/throttle';

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

class Launcher {
  clock = new Clock()
  time = 0
  stats = null
  
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

  showInfo = () => {}

  generateTargets(targetCount) {
    for (let i = 0; i < targetCount; i++) {
      const target = graphicsInstance.createRandomizedTarget(i);

      physicsWorkerInterfaceInstance.addTarget(
        target.position, target.quaternion, target.geometry.attributes.position.array, i,
      );
    }
  }

  generateAgent() {
    const agent = graphicsInstance.createAgent(agentRadius);
    agent.position.set(...initialAgentPosition);

    physicsWorkerInterfaceInstance.setAgentPhysicsBody(initialAgentPosition);

    setAgent(agent);
  }

  pause() {}
  resume() {}

  async init() {

    await physicsWorkerInterfaceInstance.init();

    graphicsInstance.init();

    this.generateTargets(20);
    this.generateAgent();

    this.loop();

    startSettingsBlock();

    if (isTouchDevice()) {
      controlEventsHandlerInstance.touchInit();
      this.touchUIInit();
    } else {
      controlEventsHandlerInstance.mouseInit();
      this.browserUIInit();
    }
  }
  touchUIInit() {
    const startButton = document.getElementById('start');
    const settingsBlock = document.getElementById('settings');
    const gameBlock = document.getElementById('container');
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
  }
  browserUIInit() {
    const startButton = document.getElementById('start');
    const settingsBlock = document.getElementById('settings');
    const gameBlock = document.getElementById('container');
    const helpOverlay = document.getElementById('help-container');
    const gameOverlay = document.getElementById('game-controls-container');

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
  }
};

const launcherInstance = new Launcher();

export default launcherInstance;
