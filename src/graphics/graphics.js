import * as THREE from 'three';

import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js';
import { createAgentMaterial } from './materials';

class Graphics {
  renderer = null
  camera = null
  scene = null
  controls = null
  container = document.getElementById('container')

  onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }
  init() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.shadowMapEnabled = true;
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.shadowMap.enabled = true;

    this.container.appendChild( this.renderer.domElement );

    this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.2, 2000 );

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xbfd1e5 );

    this.camera.position.y = 70;
    this.camera.position.x = 70;

    this.camera.position.z = 70;
    this.camera.lookAt( 0, 0, 0 );

    const light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set( 100, 100, 50 );
    light.castShadow = true;
    const dLight = 200;
    const sLight = dLight * 0.25;
    light.shadow.camera.left = - sLight;
    light.shadow.camera.right = sLight;
    light.shadow.camera.top = sLight;
    light.shadow.camera.bottom = - sLight;

    light.shadow.camera.near = dLight / 30;
    light.shadow.camera.far = dLight;

    light.shadow.mapSize.x = 1024 * 2;
    light.shadow.mapSize.y = 1024 * 2;

    this.scene.add( light );

    window.addEventListener( 'resize', this.onWindowResize, false );
  }
  createAgent(radius) {
    const agentMesh = new THREE.Mesh(
      new THREE.SphereBufferGeometry( radius, 20, 20 ),
      createAgentMaterial()
    );

    agentMesh.receiveShadow = true;
    agentMesh.castShadow = true;

    this.scene.add(agentMesh);

    return agentMesh;
  }
};

const graphicsInstance = new Graphics();

export default graphicsInstance;
