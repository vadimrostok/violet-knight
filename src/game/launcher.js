import 'regenerator-runtime/runtime.js';
import * as THREE from 'three';
import throttle from 'lodash/throttle';
import { OBJLoader } from '../../node_modules/three/examples/jsm/loaders/OBJLoader.js';

import physicsInstance from './../physics/physics.js';
import graphicsInstance from './../graphics/graphics.js';
import { levelMaterial } from './../graphics/materials.js';
import controlsInstance from './controls.js';

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
  lastAgent = null;
  loop = () => {
    requestAnimationFrame( this.loop );

    const deltaTime = this.clock.getDelta();

    controlsInstance.update(deltaTime, this.lastAgent);

    physicsInstance.update(deltaTime, controlsInstance);

    graphicsInstance.renderer.render(graphicsInstance.scene, graphicsInstance.camera);

    this.time += deltaTime;
  }

  infoNode = document.getElementById('info')


  //showInfo = throttle(() => {
  showInfo = () => {
    this.infoNode.innerHTML = buildInfoHtml(controlsInstance.info);
  }
  //}, 250);

  loadLevel(levelId) {
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

    physicsInstance.init();

    graphicsInstance.init();

    const levelMesh = await this.loadLevel(levelId);

    physicsInstance.createLevel(levelMesh);

    graphicsInstance.scene.add(levelMesh);

    controlsInstance.init(graphicsInstance, {
      addAgent: this.addAgent,
      enableGravity: physicsInstance.enableGravity,
      setGravityMultiplier: physicsInstance.setGravityMultiplier,
      getGravityMultiplier: physicsInstance.getGravityMultiplier,
      showInfo: this.showInfo,
    });

    // var geometry = new THREE.BoxGeometry( 50, 50, 50 );
    // var material = new THREE.MeshPhongMaterial( { color: 0xff5533 } );
    // var cube = new THREE.Mesh( geometry, material );
    // cube.position.set( 0, 0, 0 );
    // graphicsInstance.scene.add( cube );
    // window.cube = cube



    var axesHelper = new THREE.AxesHelper( 500 );
    graphicsInstance.scene.add( axesHelper );

    this.loop();
  }

  addAgent = (agentMesh) => {
    const radius = 3;
    // const agentMesh = graphicsInstance.createAgent(radius);

    //agentMesh.position.set(...initialAgentPosition);

    // const { x, y, z } = controlsInstance.camera.position;
    // agentMesh.position.set(x - 2*radius, y - 2*radius, z - 2*radius);

    physicsInstance.addAgent(agentMesh, radius);

    this.lastAgent = agentMesh;

    return agentMesh;
  }

  pause() {}
  resume() {}
  init() {
    this.initLevel(`1`);
    window.debugLauncher = this;
    window.debugControlsInstance = controlsInstance;
  }
};

const launcherInstance = new Launcher();

export default launcherInstance;
