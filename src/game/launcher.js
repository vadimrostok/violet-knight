import 'regenerator-runtime/runtime.js';

import * as THREE from 'three';
import throttle from 'lodash/throttle';

import { OBJLoader } from '../../node_modules/three/examples/jsm/loaders/OBJLoader.js';
import { agentRadius, initialAgentPosition } from '../constants';
import { getAgent, getScene, setAgent, setLevel } from './gameObjectsStore';
import { levelMaterial } from './../graphics/materials.js';
import controlEventsHandlerInstance from './controlEventsHandler.js';
import graphicsInstance from './../graphics/graphics.js';
import physicsInstance from './../physics/physics.js';
import mainLoopBody from './mainLoopBody.js';

function buildInfoHtml(obj) {
  return Object.keys(obj).reduce(
    (str, key) => (typeof obj[key] === 'object') ?
      `${str}<br/>${key} : <p class="log-sub-tree">${buildInfoHtml(obj[key])}</p>` :
      `${str}<br/>${key} : ${obj[key]}`,
    ''
  );
}

class Launcher {
  meshLoadingManager = new THREE.LoadingManager()

  clock = new THREE.Clock()
  time = 0
  loop = () => {
    requestAnimationFrame( this.loop );

    const deltaTime = this.clock.getDelta();

    mainLoopBody(deltaTime);

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

  async initLevel(levelId) {

    // Create level:

    const level = await this.getLevelMesh(levelId);
    physicsInstance.setLevelPhysicsBody(level);
    setLevel(level);
    getScene().add(level);

    for (let i = 0; i < 10; i++) {
      const targetGeometry = new THREE.BoxBufferGeometry(
        1 + Math.random()*i*10,
        1 + Math.random()*i*10,
        1 + Math.random()*i*10
      );
      const targetLocation = new THREE.Vector3(
        50 + i*10 + Math.random()*i*10
      );
      const material = new THREE.MeshBasicMaterial({ color: 0xaa3355 });
      const target = new THREE.Mesh( targetGeometry, material );
      target.position.copy(targetLocation);
      getScene().add( target );
      physicsInstance.addTarget(target, i);
    }

    window.debugLevelMesh = level;

    // Create agent:

    const agent = graphicsInstance.createAgent(agentRadius);
    agent.position.set(...initialAgentPosition);

    // // FIXME: debug:
    // window.debugAgent = agent;

    physicsInstance.setAgentPhysicsBody(agent);
    setAgent(agent);

    const axesHelper = new THREE.AxesHelper( 500 );
    getScene().add( axesHelper );

    this.loop();
  }

  pause() {}
  resume() {}
  async init() {
    await physicsInstance.init();
    graphicsInstance.init();
    controlEventsHandlerInstance.init({
      enableGravity: physicsInstance.enableGravity,
      showInfo: this.showInfo,
    });

    this.initLevel(`1`);
    

    // // FIXME: debug:
    // window.debugLauncher = this;
    // window.debugControlsInstance = controlEventsHandlerInstance;
  }
};

const launcherInstance = new Launcher();

export default launcherInstance;
