import * as THREE from 'three';

import {
  cameraPositionRelativeToAgent,
  guidePositionY,
  initialAgentPosition,
  guideLength,
} from '../constants';
import {
  createAgentMaterial,
  guideMaterial,
  shaderMaterial,
  agentMaterial,
} from './materials';
import { quaternion } from '../helpers';
import {
  setCamera,
  setCameraBallJoint,
  setGuide,
  setScene,
  setPointLight,
} from '../game/gameObjectsStore';

function getArrowShape(guideWidth, guideLength, guideConeWidth, guideConeHeight) {
  const arrow = new THREE.Shape();
  
  arrow.moveTo(guideWidth/2, 0);
  arrow.lineTo(guideWidth/2, guideLength/2 - guideConeHeight);
  arrow.lineTo(guideConeWidth/2, guideLength/2 - guideConeHeight);
  arrow.lineTo(0, guideLength/2);
  arrow.lineTo(-guideConeWidth/2, guideLength/2 - guideConeHeight);
  arrow.lineTo(-guideWidth/2, guideLength/2 - guideConeHeight);

  arrow.lineTo(-guideWidth/2, 0);

  return arrow;
}

class Graphics {
  renderer = null
  camera = null
  cameraBallJoint = null
  scene = null
  guide = null
  container = document.getElementById('container')

  onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }
  initSkyBox = () => {
    var imagePrefix = "/public/cubemap/";
    var directions  = ["px", "nx", "py", "ny", "pz", "nz"];
    var imageSuffix = ".png";
    var skyGeometry = new THREE.CubeGeometry( 5000, 5000, 5000 );
    
    var materialArray = [];
    for (var i = 0; i < 6; i++)
      materialArray.push( new THREE.MeshBasicMaterial({
	map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
	side: THREE.BackSide,
        receiveShadow: false,
      }));
    var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
    var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
    this.scene.add( skyBox );
  }
  init() {

    // Renderer:

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.shadowMapEnabled = true;
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.shadowMap.enabled = true;

    this.container.appendChild( this.renderer.domElement );

    // Scene:

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xbfd1e5 );
    setScene(this.scene);

    // Camera:

    this.camera = new THREE.PerspectiveCamera( 73, window.innerWidth / window.innerHeight, 0.2, 10000 );
    this.camera.position.x = 70;
    this.camera.position.y = 70;
    this.camera.position.z = 70;
    this.camera.lookAt( 0, 0, 0 );
    setCamera(this.camera);

    // Lights:

    const light = new THREE.DirectionalLight( 0xffffff, 1 );
    //light.position.set( 500, 500, 500 );
    light.position.set( 300, 300, 300 );
    light.castShadow = true;
    const dLight = 1500;
    const sLight = dLight * 0.25;
    light.shadow.camera.left = - sLight;
    light.shadow.camera.right = sLight;
    light.shadow.camera.top = sLight;
    light.shadow.camera.bottom = - sLight;
    light.shadow.camera.near = dLight / 30;
    light.shadow.camera.far = dLight;
    light.shadow.mapSize.x = 1024 * 5;
    light.shadow.mapSize.y = 1024 * 5;
    this.scene.add( light );

    // var helper = new THREE.DirectionalLightHelper( light, 5 );
    // this.scene.add( helper );

    var plight = new THREE.PointLight( 0xff00ff, 1, 100 );
    plight.position.set( 50, 50, 50 );
    this.scene.add( plight );
    setPointLight(plight);

    // var alight = new THREE.AmbientLight( 0x404040 ); // soft white light
    // this.scene.add( alight );


    // Camera ball joint:

    this.cameraBallJoint = new THREE.Group();
    this.cameraBallJoint.position.set(...initialAgentPosition);

    this.camera.position.set(...cameraPositionRelativeToAgent);
    this.camera.lookAt(0, 0, 0);

    // FIXME: debug
    window.camera = this.camera;



    // Guide:

    const lineGeometry = new THREE.ShapeGeometry(
      getArrowShape(1, guideLength, 3, 5)
    );
    //lineGeometry.rotation.set(Math.PI/2, Math.PI/2, Math.PI/2);
    //lineGeometry.rotateX(this.camera.rotation.x);

    this.guide = new THREE.Mesh( lineGeometry, shaderMaterial);

    this.guide.visible = false;
    this.guide.position.x = 15;
    this.guide.position.y = guidePositionY;

    this.guide.rotation.set(0, Math.PI/2, 0);
    this.guide.quaternion.multiply(quaternion([1, 0, 0], -Math.PI/4));

    setGuide(this.guide);

    //FIXME: debug
    window.guide = this.guide;


    this.cameraBallJoint.add(this.camera);
    this.cameraBallJoint.add(this.guide);

    this.scene.add(this.cameraBallJoint);

    setCameraBallJoint(this.cameraBallJoint);

    window.addEventListener( 'resize', this.onWindowResize, false );

    this.initSkyBox();
  }
  addDebugBall(x,y,z,color=0xffff00, radius=0.5) {
    var geometry = new THREE.SphereGeometry( radius, 5, 5 );
    var material = new THREE.MeshBasicMaterial( {color, side: THREE.DoubleSide} );
    var sphere = new THREE.Mesh( geometry, material );
    sphere.position.set(x,y,z);
    this.scene.add( sphere );
  }
  addDebugTriangle(x1,y1,z1,x2,y2,z2,x3,y3,z3) {
    console.log('addDebugTriangle', x1,y1,z1,x2,y2,z2,x3,y3,z3);
    var geometry = new THREE.BufferGeometry();
    // create a simple square shape. We duplicate the top left and bottom right
    // vertices because each vertex needs to appear once per triangle.
    var vertices = new Float32Array( [
      x1,y1,z1,x2,y2,z2,x3,y3,z3,
    ] );

    // itemSize = 3 because there are 3 values (components) per vertex
    geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

    const material = new THREE.MeshBasicMaterial( {
      color: Math.floor( Math.random() * ( 1 << 24 ) ),
      side: THREE.DoubleSide,
    } );

    const mesh = new THREE.Mesh( geometry, material );

    this.scene.add( mesh );
    //alert('wait');
  }
  createAgent(radius) {
    const agentMesh = new THREE.Mesh(
      new THREE.SphereBufferGeometry( radius, 20, 20 ),
      agentMaterial,
    );

    agentMesh.receiveShadow = true;
    agentMesh.castShadow = true;

    this.scene.add(agentMesh);

    return agentMesh;
  }
  update() {
    this.renderer.render(this.scene, this.camera);
  }
};

const graphicsInstance = new Graphics();

export default graphicsInstance;
