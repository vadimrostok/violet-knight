import 'regenerator-runtime/runtime.js';
import * as THREE from 'three';
import { OBJLoader } from '../../node_modules/three/examples/jsm/loaders/OBJLoader.js';

import physicsInstance from './../physics/physics.js';
import graphicsInstance from './../graphics/graphics.js';
import { levelMaterial } from './../graphics/materials.js';
import controlsInstance from './controls.js';

class Launcher {
  meshLoadingManager = new THREE.LoadingManager()

  clock = new THREE.Clock()
  time = 0
  loop = () => {
    requestAnimationFrame( this.loop );

    const deltaTime = this.clock.getDelta();

    physicsInstance.update(deltaTime, controlsInstance);

    graphicsInstance.renderer.render(graphicsInstance.scene, graphicsInstance.camera);

    this.time += deltaTime;
  }

  loadLevel(levelId) {
    return new Promise((resolve, reject) => {
      new OBJLoader(this.meshLoadingManager)
        .setPath('./models/')
        .load(`level${levelId}.obj`, function (object) {

          const mesh = object.children[0];

          //material.side = THREE.DoubleSide;
          mesh.material = levelMaterial;

          const levelSizeMultiplier = 5;

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
    controlsInstance.init(graphicsInstance, {
      generateObject: this.addAgent,
    });

    const levelMesh = await this.loadLevel(levelId);

    physicsInstance.createLevel(levelMesh);

    graphicsInstance.scene.add(levelMesh);

    this.loop();

    this.addAgent();
  }

  addAgent() {
    const radius = 3;
    const { x, y, z} = controlsInstance.get().object.position;
    const agentMesh = graphicsInstance.createAgent(radius);
    agentMesh.position.set(x,y,z);
    physicsInstance.addAgent(agentMesh, radius);
  }

  pause() {}
  resume() {}
  init() {
    this.initLevel(`1`);
  }
};

const launcherInstance = new Launcher();

export default launcherInstance;
