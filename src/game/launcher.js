import 'regenerator-runtime/runtime.js';

import * as THREE from 'three';
import throttle from 'lodash/throttle';

import { OBJLoader } from '../../node_modules/three/examples/jsm/loaders/OBJLoader.js';
import {
  agentRadius,
  boundingSphereRadius,
  initialAgentPosition
} from '../constants';
import { getAgent, getScene, setAgent, setLevel } from './gameObjectsStore';
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
  physicsWorker = new Worker('/src/physics/worker.js');
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


  //showInfo = throttle(() => {
  showInfo = () => {
    this.infoNode.innerHTML = buildInfoHtml(controlEventsHandlerInstance.info);
  }
  //}, 250);

  getLevelMesh(levelId) {
    return new Promise((resolve, reject) => {
      new OBJLoader(this.meshLoadingManager)
        .setPath('./models/')
        .load(`level${levelId}.obj`, function (object) {

          const mesh = object.children[0];

          //material.side = THREE.DoubleSide;
          mesh.material = levelMaterial;

          const levelSizeMultiplier = 5;
          //const levelSizeMultiplier = 0.0005;

          mesh.geometry.scale( levelSizeMultiplier, levelSizeMultiplier, levelSizeMultiplier );
          object.position.set(0,0,0);

          mesh.castShadow = true;
          mesh.receiveShadow = true;

          resolve(mesh);
        });
    });
  }

  async initLevel(targetCount) {

    /*
    async initLevel(levelId) {
    // Create level:

    const level = await this.getLevelMesh(levelId);
    physicsInstance.setLevelPhysicsBody(level);
    setLevel(level);
    getScene().add(level);

    */

    physicsInstance.initPhysics();


    /*
    const targetGeometry = new THREE.BoxBufferGeometry(
      150,
      152,
      154,
    );
    const targetLocation = new THREE.Vector3(
      -150,
      0,
      0
    );
    const target = new THREE.Mesh( targetGeometry, getTargetMaterial() );
    target.position.copy(targetLocation);
    getScene().add( target );
    physicsInstance.addTarget(target, 0);

    */

    
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

      // will add at physics
      // getScene().add( target );

      physicsInstance.addTarget_new(target, i, { targetX, targetY, targetZ });
    }


    //window.debugLevelMesh = level;

    // Create agent:

    const agent = graphicsInstance.createAgent(agentRadius);
    agent.position.set(...initialAgentPosition);

    // const boundingSphere = new THREE.Mesh(
    //   new THREE.SphereBufferGeometry( boundingSphereRadius, 30, 30 ),
    //   new THREE.MeshBasicMaterial( {
    //     color: 0xffffff,
    //     side: THREE.DoubleSide,
    //     wireframe: true,
    //   } ),
    // );
    // getScene().add(boundingSphere);
    // physicsInstance.addBoundingSphere(boundingSphere);

    physicsInstance.setAgentPhysicsBody(agent);
    setAgent(agent);

    // FIXME:
    window.agent = agent;

    // const axesHelper = new THREE.AxesHelper( 500 );
    // getScene().add( axesHelper );

    this.loop();
  }

  pause() {}
  resume() {}
  async init() {

    const startButton = document.getElementById('start');
    const settingsBlock = document.getElementById('settings');
    const gameBlock = document.getElementById('container');

    const helpOverlay = document.getElementById('help-container');
    const gameOverlay = document.getElementById('game-controls-container');

    await physicsInstance.init();
    this.physicsWorker.postMessage({ task: 'init' });

    graphicsInstance.init();

    this.initLevel(10);

    startSettingsBlock();

    if (isTouchDevice()) {

      controlEventsHandlerInstance.mobileInit();

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

      this.stats = new Stats();
      this.stats.domElement.style.position = 'absolute';
      this.stats.domElement.style.top = '0px';
       gameBlock.appendChild( this.stats.domElement );

      controlEventsHandlerInstance.init({
        enableGravity: physicsInstance.enableGravity,
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

    // // FIXME: debug:
    // window.debugLauncher = this;
    // window.debugControlsInstance = controlEventsHandlerInstance;
  }
};

const launcherInstance = new Launcher();

export default launcherInstance;
