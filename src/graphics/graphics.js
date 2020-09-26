import {
  BoxBufferGeometry, Mesh, Vector3, Shape, CubeGeometry, MeshBasicMaterial,
  SphereGeometry, DoubleSide, ImageUtils, BackSide, MeshFaceMaterial, WebGLRenderer,
  Color, PerspectiveCamera, DirectionalLight, PointLight, ShapeGeometry, Group,
  BufferGeometry, BufferAttribute, SphereBufferGeometry, Scene,
} from 'three';
import { ConvexObjectBreaker } from '../../node_modules/three/examples/jsm/misc/ConvexObjectBreaker.js';

import {
  agentMaterial,
  createAgentMaterial,
  getTargetMaterial,
  guideMaterial,
  shaderMaterial,
} from './materials';
import {
  cameraPositionRelativeToAgent,
  guideLength,
  guidePositionY,
  initialAgentPosition,
  targetMass,
} from '../constants';
import { quaternion } from '../helpers';
import {
  setCamera,
  setCameraBallJoint,
  setGuide,
  setPointLight,
  setScene,
  setTarget,
} from '../game/gameObjectsStore';

function getArrowShape(guideWidth, guideLength, guideConeWidth, guideConeHeight) {
  const arrow = new Shape();
  
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
  convexBreaker = new ConvexObjectBreaker();
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
    var skyGeometry = new CubeGeometry( 5000, 5000, 5000 );
    
    var materialArray = [];
    for (var i = 0; i < 6; i++)
      materialArray.push( new MeshBasicMaterial({
	map: ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
	side: BackSide,
      }));
    var skyMaterial = new MeshFaceMaterial( materialArray );
    var skyBox = new Mesh( skyGeometry, skyMaterial );
    this.scene.add( skyBox );
  }

  createRandomizedTarget(index) {
    const [targetX, targetY, targetZ] = [
      10 + (index % 2)*10 + Math.random()*index*10,
      10 + (index % 6)*10 + Math.random()*index*10,
      10 + (index % 5)*10 + Math.random()*index*10
    ];
    const targetGeometry = new BoxBufferGeometry(
      targetX, targetY, targetZ
    );
    const xInvert = (index % 2 === 0 ? 1 : -1);
    const yInvert = (index % 6 > 3 ? 1 : -1);
    const zInvert = (index % 4 >= 2 ? 1 : -1);
    const multiplier = 30;
    const targetLocation = new Vector3(
      50 + xInvert*index*multiplier + xInvert*Math.random()*index*multiplier,
      50 + yInvert*index*multiplier + zInvert*Math.random()*index*multiplier,
      50 + zInvert*index*multiplier + zInvert*Math.random()*index*multiplier,
    );
    const target = new Mesh( targetGeometry, getTargetMaterial() );

    target.position.copy(targetLocation);
    target.castShadow = false;
    target.receiveShadow = false;

    this.scene.add(target);
    this.convexBreaker.prepareBreakableObject(
      target, targetMass, new Vector3(), new Vector3(), true,
    );
    setTarget(index, target);

    return target;
  }

  init() {

    // Renderer:

    this.renderer = new WebGLRenderer();
    this.renderer.shadowMapEnabled = true;
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.shadowMap.enabled = true;

    this.container.appendChild( this.renderer.domElement );

    // Scene:

    this.scene = new Scene();
    this.scene.background = new Color( 0xbfd1e5 );
    setScene(this.scene);

    // Camera:

    this.camera = new PerspectiveCamera( 73, window.innerWidth / window.innerHeight, 0.2, 10000 );
    this.camera.position.x = 70;
    this.camera.position.y = 70;
    this.camera.position.z = 70;
    this.camera.lookAt( 0, 0, 0 );
    setCamera(this.camera);

    // Lights:

    const light = new DirectionalLight( 0xffffff, 1 );
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
    light.shadow.mapSize.x = 1024 * 1;
    light.shadow.mapSize.y = 1024 * 1;
    this.scene.add( light );

    var plight = new PointLight( 0xff00ff, 1, 100 );
    plight.position.set( 50, 50, 50 );
    this.scene.add( plight );
    setPointLight(plight);


    // Camera ball joint:

    this.cameraBallJoint = new Group();
    this.cameraBallJoint.position.set(...initialAgentPosition);

    this.camera.position.set(...cameraPositionRelativeToAgent);
    this.camera.lookAt(0, 0, 0);

    // Guide:

    const lineGeometry = new ShapeGeometry(
      getArrowShape(1, guideLength, 3, 5)
    );
    //lineGeometry.rotation.set(Math.PI/2, Math.PI/2, Math.PI/2);
    //lineGeometry.rotateX(this.camera.rotation.x);

    this.guide = new Mesh( lineGeometry, shaderMaterial);

    this.guide.visible = false;
    this.guide.position.x = 15;
    this.guide.position.y = guidePositionY;

    this.guide.rotation.set(0, Math.PI/2, 0);
    this.guide.quaternion.multiply(quaternion([1, 0, 0], -Math.PI/4));

    setGuide(this.guide);

    this.cameraBallJoint.add(this.camera);
    this.cameraBallJoint.add(this.guide);

    this.scene.add(this.cameraBallJoint);

    setCameraBallJoint(this.cameraBallJoint);

    window.addEventListener( 'resize', this.onWindowResize, false );

    this.initSkyBox();
  }
  addDebugBall(x,y,z,color=0xffff00, radius=0.5) {
    var geometry = new SphereGeometry( radius, 5, 5 );
    var material = new MeshBasicMaterial( {color, side: DoubleSide} );
    var sphere = new Mesh( geometry, material );
    sphere.position.set(x,y,z);
    this.scene.add( sphere );
  }
  addDebugTriangle(x1,y1,z1,x2,y2,z2,x3,y3,z3) {
    var geometry = new BufferGeometry();
    // create a simple square shape. We duplicate the top left and bottom right
    // vertices because each vertex needs to appear once per triangle.
    var vertices = new Float32Array( [
      x1,y1,z1,x2,y2,z2,x3,y3,z3,
    ] );

    // itemSize = 3 because there are 3 values (components) per vertex
    geometry.addAttribute( 'position', new BufferAttribute( vertices, 3 ) );

    const material = new MeshBasicMaterial( {
      color: Math.floor( Math.random() * ( 1 << 24 ) ),
      side: DoubleSide,
    } );

    const mesh = new Mesh( geometry, material );

    this.scene.add( mesh );
  }
  createAgent(radius) {
    const agentMesh = new Mesh(
      new SphereBufferGeometry( radius, 20, 20 ),
      agentMaterial,
    );

    agentMesh.receiveShadow = false;
    agentMesh.castShadow = false;

    this.scene.add(agentMesh);

    return agentMesh;
  }
  update() {
    this.renderer.render(this.scene, this.camera);
  }
};

const graphicsInstance = new Graphics();

export default graphicsInstance;
