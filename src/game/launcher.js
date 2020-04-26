import 'regenerator-runtime/runtime.js';
import * as THREE from 'three';
import throttle from 'lodash/throttle';
import { OBJLoader } from '../../node_modules/three/examples/jsm/loaders/OBJLoader.js';

import physicsInstance from './../physics/physics.js';
import graphicsInstance from './../graphics/graphics.js';
import { levelMaterial } from './../graphics/materials.js';
import controlsInstance from './controls.js';

const initialAgentPosition = [70,70,70];

function quaternion(xyz, angle) {
  const half_angle = angle * 0.5;
  const sin_a = Math.sin(half_angle);
  return new THREE.Quaternion(xyz[0] * sin_a, xyz[1] * sin_a, xyz[2] * sin_a, Math.cos(half_angle));
}

const azimuthalRotationQuaternion = quaternion([0,1,0],0);
window.azimuthalRotationQuaternion =azimuthalRotationQuaternion;

const finalQuaternion = new THREE.Quaternion();
window.finalQuaternion = finalQuaternion;

let moveUp = false;
let moveDown = false;
let moveSide = false;
let moveRightSide = false;
let rollUp = false;
let rollDown = false;
window.addEventListener( 'keydown', ( event ) => {
  switch ( event.keyCode ) {
    case 65://a
      moveSide = true;
      break;
    case 68://d
      moveRightSide = true;
      break;
    case 87://w
      moveUp = true;
      break;
    case 83://w
      moveDown = true;
      break;
    case 81://q
      rollUp = true;
      break;
    case 69://e
      rollDown = true;
      break;
  }
}, false );

window.addEventListener( 'keyup', ( event ) => {
  switch ( event.keyCode ) {
    case 65://a
      moveSide = false;
      break;
    case 87://w
      moveUp = false;
      break;
    case 68://d
      moveRightSide = false;
      break;
    case 83://w
      moveDown = false;
      break;
    case 81://q
      rollUp = false;
      break;
    case 69://e
      rollDown = false;
      break;
  }
  
}, false );

window.azimuthalRotation = new THREE.Matrix4();
window.polarRotation = new THREE.Matrix4();
window.debugRotation = new THREE.Matrix4();

window.cubeVRotation = 0;
window.cubeRotation = 0;

const azimuthalRotationParams = [0,1,0];
window.azimuthalRotationParams=azimuthalRotationParams;
const polarRotationParams = [0,0,1];
window.polarRotationParams=polarRotationParams;

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


    //window.cubeRotation = window.cubeRotation ? window.cubeRotation + 1*deltaTime : 0.01;
    if (moveSide || moveRightSide) {
      //window.cubeRotation += (moveRightSide ? -1 : 1)*deltaTime;

      // polarRotationParams[0] = Math.sin(window.cubeRotation);
      // polarRotationParams[2] = Math.cos(window.cubeRotation);

      //console.log('azimuthalRotationParams', azimuthalRotationParams);

      finalQuaternion.multiply(
        quaternion(azimuthalRotationParams, (moveRightSide ? 1 : -1)*deltaTime),
      );
    }

    if (moveUp || moveDown) {
      window.cubeVRotation += (moveDown ? -1:1)*deltaTime;

      // const v = new THREE.Vector3(
      //   Math.sin(window.cubeVRotation)*Math.cos(window.cubeRotation),
      //   Math.cos(window.cubeVRotation),
      //   Math.sin(window.cubeVRotation)*Math.sin(window.cubeRotation)
      // );
      // v.normalize();
      // azimuthalRotationParams[0] = v.x;
      // azimuthalRotationParams[1] = v.y;
      // azimuthalRotationParams[2] = v.z;

      // azimuthalRotationParams[0] = Math.sin(window.cubeVRotation);
      // azimuthalRotationParams[1] = Math.cos(window.cubeVRotation);

      finalQuaternion.multiply(
        quaternion(polarRotationParams, (moveDown ? -1:1)*deltaTime),
      );
    }

    if (rollUp || rollDown) {
      finalQuaternion.multiply(
        quaternion([1, 0, 0], (rollDown ? -1:1)*deltaTime),
      );
    }

    // azimuthal rotation


    // finalQuaternion.multiplyQuaternions(
    //   quaternion(azimuthalRotationParams,window.cubeRotation),
    //   quaternion(polarRotationParams,window.cubeVRotation),
    // );
    window.smallcubeWrapper.quaternion.copy(finalQuaternion);
    //window.smallcubeWrapper.quaternion.copy(quaternion(azimuthalRotationParams, window.cubeRotation));
    //window.smallcubeWrapper.quaternion.clone(azimuthalRotationQuaternion);

    //window.camera.quaternion.setFromRotationMatrix(window.azimuthalRotation);
    //window.camera.lookAt(0,0,0);

    // window.smallcube.position.set(
    //   150*Math.cos(window.cubeRotation),//*Math.cos(window.cubeVRotation),// + 150*Math.sin(window.cubeVRotation),
    //   0,
    //   150*Math.sin(window.cubeRotation),
    // );

    // const dist = 80;
    // window.smallcube.position.set(
    //   dist*Math.cos(window.cubeRotation)*Math.cos(window.cubeVRotation),
    //   dist*Math.sin(window.cubeVRotation)*Math.cos(window.cubeRotation),
    //   dist*Math.sin(window.cubeRotation),
    // );

    // const dist = 80;
    // window.smallcubeWrapper.rotation.set(
    //   window.cubeRotation,
    //   window.cubeVRotation,
    //   0,//dist*Math.sin(window.cubeRotation),
    // );

    // polar rotation:

  }

  infoNode = document.getElementById('info')
  
  
  //showInfo = throttle(() => {
  showInfo = () => {
    this.infoNode.innerHTML = Object.keys(controlsInstance.info).reduce(
      (str, key) => `${str}<br/>${key} : ${controlsInstance.info[key]}`,
      ''
    );
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

          //const levelSizeMultiplier = 5;
          // FXIME:
          const levelSizeMultiplier = 0.005;

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
      setGravityMultiplier: physicsInstance.setGravityMultiplier,
      getGravityMultiplier: physicsInstance.getGravityMultiplier,
      updateInfo: this.showInfo,
    });

    const levelMesh = await this.loadLevel(levelId);

    physicsInstance.createLevel(levelMesh);

    graphicsInstance.scene.add(levelMesh);

    var geometry = new THREE.BoxGeometry( 50, 50, 50 );
    var material = new THREE.MeshPhongMaterial( { color: 0xff5533 } );
    var cube = new THREE.Mesh( geometry, material );
    cube.position.set( 0, 0, 0 );
    graphicsInstance.scene.add( cube );
    window.cube = cube;

    var smallgeometry = new THREE.BoxGeometry( 10, 10, 10 );
    var smallmaterial = new THREE.MeshPhongMaterial( { color: 0x2255ff } );
    var smallcube = new THREE.Mesh( smallgeometry, smallmaterial );
    smallcube.position.set( 70, 0, 0);
    smallcube.visible = false;

    var smallcubeWrapper = new THREE.Group();
    smallcubeWrapper.position.set( 0, 0, 0);
    smallcubeWrapper.add(smallcube);
    smallcubeWrapper.add(controlsInstance.camera);

    graphicsInstance.scene.add( smallcubeWrapper );

    // var smallcubeWrapperBox = new THREE.BoxHelper( smallcubeWrapper, 0xffff00 );
    // //graphicsInstance.scene.add( smallcubeWrapperBox );
    // smallcubeWrapper.add(smallcubeWrapperBox);

    window.smallcube = smallcube;
    window.smallcubeWrapper = smallcubeWrapper;

    window.camera = controlsInstance.camera;

    controlsInstance.camera.position.set(100,0,0);
    controlsInstance.camera.lookAt(0,0,0);

    // var group = new THREE.Group();
    // group.add( cube );
    // group.add( controlsInstance.camera );
    // graphicsInstance.scene.add( group );
    // window.group = group;

    var axesHelper = new THREE.AxesHelper( 500 );
    graphicsInstance.scene.add( axesHelper );

    this.loop();

    this.addAgent();
  }

  addAgent = () => {
    const radius = 3;
    const agentMesh = graphicsInstance.createAgent(radius);

    agentMesh.position.set(...initialAgentPosition);

    // const { x, y, z } = controlsInstance.get().object.position;
    // agentMesh.position.set(x - 2*radius, y - 2*radius, z - 2*radius);

    physicsInstance.addAgent(agentMesh, radius);
    // FIXME:
    agentMesh.visible = false;
    this.lastAgent = agentMesh;
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
