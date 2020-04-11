import * as THREE from 'three';
import throttle from 'lodash/throttle';

window.THREE = THREE;

//import Stats from './jsm/libs/stats.module.js';

//import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
import { STLLoader } from '../node_modules/three/examples/jsm/loaders/STLLoader.js';
import { OBJLoader } from '../node_modules/three/examples/jsm/loaders/OBJLoader.js';

window.STLLoader = STLLoader;

// Heightfield parameters
var terrainWidthExtents = 100;
var terrainDepthExtents = 100;
var terrainWidth = 128;
var terrainDepth = 128;
var terrainHalfWidth = terrainWidth / 2;
var terrainHalfDepth = terrainDepth / 2;
var terrainMaxHeight = 8;
var terrainMinHeight = - 2;

// Graphics variables
var container, stats;
var camera, scene, renderer;
var terrainMesh;
var clock = new THREE.Clock();

// Physics variables
var collisionConfiguration;
var dispatcher;
var broadphase;
var solver;
var physicsWorld;
var dynamicObjects = [];
window.dynamicObjects =dynamicObjects;
var transformAux1;

var time = 0;
var objectTimePeriod = 3;
var timeNextSpawn = time + objectTimePeriod;
var maxNumObjects = 30;

let Ammo;

if (typeof window.Ammo === 'function') {
  window.Ammo().then( function ( AmmoLib ) {

    Ammo = AmmoLib;

    init();

  });

}

function init() {

  initGraphics();

}

function initGraphics() {

  container = document.getElementById( 'container' );

  renderer = new THREE.WebGLRenderer();
  renderer.shadowMapEnabled = true;
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = true;
  container.appendChild( renderer.domElement );

  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.2, 2000 );

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xbfd1e5 );

  camera.position.y = 70;
  camera.position.x = 70;

  camera.position.z = 70;
  camera.lookAt( 0, 0, 0 );

  var controls = new OrbitControls( camera, renderer.domElement );

  window.controls = controls;



  var manager = new THREE.LoadingManager();
  var material = new THREE.MeshPhysicalMaterial( { color: 0xff5533, specular: 0x111111, shininess: 200 } );
  var material2 = new THREE.LineDashedMaterial( {
    color: 0xff0000,
    linewidth: 1,
    scale: 1,
    dashSize: 3,
    gapSize: 1,
  } );

  new OBJLoader( manager )
    .setPath( './stl/' )
    .load( 'one.obj', function ( object ) {

      var axesHelper = new THREE.AxesHelper( 5 );
      scene.add( axesHelper );

      //console.log('obj', object);

      const mesh = object.children[0];
      //material.side = THREE.DoubleSide;
      mesh.material = material;

      console.log('1=', mesh.geometry.attributes.position.array[0]);
      mesh.geometry.scale( 1.3, 1.3, 1.3 );
      // let angle = -0.03;
      // mesh.geometry.rotateX(angle);
      // window.setTimeout(() => {
      //   window.setInterval(() => {
      //     angle += 0.03;
      //     mesh.geometry.rotateX(angle);
      //   }, 1000);
      // }, 3000);
      //mesh.geometry.translate(0,-20,0);
      console.log('2=', mesh.geometry.attributes.position.array[0]);
      //object.scale.set( 15, 15, 15 );
      object.position.set(0,0,0);

      mesh.geometry.rotateX( Math.PI);
      //object.rotateX( Math.PI / 2 );

      //mesh.visible=false;
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      var box = new THREE.Box3().setFromObject( mesh );
      const width = box.max.x - box.min.x;
      const depth = box.max.y - box.min.y;
      //console.log( 'box', box, box.min, box.max, box.getSize() );


      const arr = mesh.geometry.attributes.position.array;
      const l = arr.length/3;

      // for (let i = 0; i < l; i++){
      //   //console.log(i, arr[i*3], arr[i*3+1], arr[i*3+2]);
      //   var g = new THREE.SphereGeometry( 1, 32, 32 );
      //   var m = new THREE.MeshBasicMaterial( {color: 0xff00ff} );
      //   var s = new THREE.Mesh( g, m );
      //   s.position.set( arr[i*3], arr[i*3+1], arr[i*3+2]);
      //   scene.add( s );
      // }

      console.log('object', object);
      

      //object.position.y = - 95;
      scene.add( object );

      initPhysics(mesh);

      animate();
      generateObject();

    });

  var light = new THREE.DirectionalLight( 0xffffff, 1 );
  light.position.set( 100, 100, 50 );
  light.castShadow = true;
  var dLight = 200;
  var sLight = dLight * 0.25;
  light.shadow.camera.left = - sLight;
  light.shadow.camera.right = sLight;
  light.shadow.camera.top = sLight;
  light.shadow.camera.bottom = - sLight;

  light.shadow.camera.near = dLight / 30;
  light.shadow.camera.far = dLight;

  light.shadow.mapSize.x = 1024 * 2;
  light.shadow.mapSize.y = 1024 * 2;

  scene.add( light );


  window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}
let groundPhysicsBody;
let ground;
let hinge;

function initPhysics(mesh) {

  // Physics configuration

  collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
  dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration );
  broadphase = new Ammo.btDbvtBroadphase();
  solver = new Ammo.btSequentialImpulseConstraintSolver();
  physicsWorld = new Ammo.btDiscreteDynamicsWorld( dispatcher, broadphase, solver, collisionConfiguration );
  physicsWorld.setGravity( new Ammo.btVector3( 0, 0, 0 ) );

  // Create the terrain body

  //var groundShape = createTerrainShape(mesh);

  var ammoMesh = new Ammo.btTriangleMesh(true, true);
  window.ammoMesh = ammoMesh;
  console.log('ammoMesh', ammoMesh);
  const arr = mesh.geometry.attributes.position.array;

  for (let i = 0, l = arr.length/9; i < l; i++) {
    ammoMesh.addTriangle(
      new Ammo.btVector3(arr[i*9], arr[i*9+1], arr[i*9+2]),
      new Ammo.btVector3(arr[i*9+3], arr[i*9+4], arr[i*9+5]),
      new Ammo.btVector3(arr[i*9+6], arr[i*9+7], arr[i*9+8]),
      false
    );    
  }

  var groundShape = new Ammo.btBvhTriangleMeshShape(ammoMesh, true, true);

  var groundTransform = new Ammo.btTransform();
  groundTransform.setIdentity();
  // Shifts the terrain, since bullet re-centers it on its bounding box.
  groundTransform.setOrigin( new Ammo.btVector3( 0, 0, 0 ) );
  var groundMass = 0;
  var groundLocalInertia = new Ammo.btVector3( 100000, 100000, 100000 );
  var groundMotionState = new Ammo.btDefaultMotionState( groundTransform );
  var groundBody = new Ammo.btRigidBody( new Ammo.btRigidBodyConstructionInfo( groundMass, groundMotionState, groundShape, groundLocalInertia ) );

  physicsWorld.addRigidBody( groundBody );

  groundBody.setGravity(new Ammo.btVector3( 0, 0, 0 ));

  mesh.userData.physicsBody = groundBody;
  ground = mesh;
  groundPhysicsBody = groundBody;
  ground = mesh;
  window.ground = mesh;

  dynamicObjects.push(mesh);

  //ground.userData.physicsBody.setLinearVelocity(new Ammo.btVector3(0.5,0,0));

  //ground.userData.physicsBody.setAngularVelocity(new Ammo.btVector3(1.5,0,0));
  // setTimeout(() => { ground.userData.physicsBody.setAngularVelocity(new Ammo.btVector3(0.5,0,0)); }, 1000);

  transformAux1 = new Ammo.btTransform();



  // Hinge constraint to move the arm
  // var pivotA = new Ammo.btVector3( 0, 0.5, 0 );
  // var pivotB = new Ammo.btVector3( 0, -0.5, 0 );
  // var axis = new Ammo.btVector3( 0, 1, 0 );
  // hinge = new Ammo.btHingeConstraint( pylon.userData.physicsBody, arm.userData.physicsBody, pivotA, pivotB, axis, axis, true );
  // physicsWorld.addConstraint( hinge, true );

}

//let i = 1;

function generateObject() {
  var numTypes = 4;
  var objectType = Math.ceil( Math.random() * numTypes );

  var threeObject = null;
  var shape = null;

  var objectSize = 3;
  var margin = 0.05;

  var radius = objectSize;
  threeObject = new THREE.Mesh( new THREE.SphereBufferGeometry( radius, 20, 20 ), createObjectMaterial() );
  shape = new Ammo.btSphereShape( radius );
  shape.setMargin( margin );

  const { x,y,z} = window.controls.object.position;
  threeObject.position.set(x,y,z);

  var mass = 1;
  //var mass = 10000;
  //var mass = 0.00001;
  // var mass = Math.pow(2,i);
  // i++;
  // console.log(i, mass);
  //var localInertia = new Ammo.btVector3( 1, 1, 1 );
  //var localInertia = new Ammo.btVector3( 100, 100, 100 );
  var localInertia = new Ammo.btVector3( 0, 0, 0 );
  shape.calculateLocalInertia( mass, localInertia );
  var transform = new Ammo.btTransform();
  transform.setIdentity();
  var pos = threeObject.position;
  transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
  var motionState = new Ammo.btDefaultMotionState( transform );
  var rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, shape, localInertia );
  var body = new Ammo.btRigidBody( rbInfo );

  threeObject.userData.physicsBody = body;

  threeObject.receiveShadow = true;
  threeObject.castShadow = true;

  scene.add( threeObject );
  dynamicObjects.push( threeObject );

  physicsWorld.addRigidBody( body );
}

function createObjectMaterial() {
  var c = Math.floor( Math.random() * ( 1 << 24 ) );
  return new THREE.MeshPhongMaterial( { color: c } );
}

function animate() {
  requestAnimationFrame( animate );

  render();
}

let deltaTime;

function render() {

  deltaTime = clock.getDelta();

  updatePhysics( deltaTime );

  renderer.render( scene, camera );

  time += deltaTime;

}

let shift = 0;

let moveLeft = false;
let speed = 0;
let moveRight = false;


//let ammoTmpPos = null, ammoTmpQuat = null;

// const updateAngularVelocity = throttle(() => {
//   console.log('updateAngularVelocity', speed*(moveLeft?-1:1));
//   ground.userData.physicsBody.setAngularVelocity(new Ammo.btVector3(moveLeft?-1:1,0,0));
// }, 500);
const updateAngularVelocity = () => {
  let speed = 0;
  if (moveLeft) {
    speed = -1;
  } else if (moveRight) {
    speed = 1;
  }
  console.log('setAngularVelocity', speed);
  ground.userData.physicsBody.setAngularVelocity(new Ammo.btVector3(speed,0,0));
  ground.userData.physicsBody.setAngularFactor(1);
};

let angle = 0;
window.addEventListener( 'keydown', function ( event ) {
  let ret = false;
  switch ( event.keyCode ) {
    case 88://x
      //physicsWorld.setGravity( new Ammo.btVector3( 0, 6, 0 ) );
      console.log('apply');
      // const impulse = new Ammo.btVector3(1000,50,0);
      // const rel_pos = new Ammo.btVector3(10,10,10);
      // ground.userData.physicsBody.applyImpulse(impulse, rel_pos);
      break;
    case 66://b
      generateObject();
      break;
    case 67://c
      moveLeft = true;
      break;
    case 86://v
      moveRight = true;
      break;
    default:
      ret = true;
  }
  if (ret) {
    return;
  }
  //updateAngularVelocity();
}, false );
window.addEventListener( 'keyup', function ( event ) {
  //speed = 3;
  if (moveLeft || moveRight) {
    moveLeft = false;
    moveRight = false;
    //updateAngularVelocity(); 
  }
}, false );



let firstRun = true;
let tmpPos, tmpQuat, ammoTmpPos, ammoTmpQuat, tmpTrans;
//tmpQuat;
const setGravityByCamera = throttle((polarAngle, azimuthalAngle) => {
  const polarGravity = polarAngle - Math.PI/2;
  //console.log(polarGravity);
  const multiplier = 10;
  //const multiplier = 1;
  physicsWorld.setGravity( new Ammo.btVector3(
    -Math.sin(azimuthalAngle)*Math.cos(polarGravity)*multiplier,
    polarGravity*multiplier,
    -Math.cos(azimuthalAngle)*Math.cos(polarGravity)*multiplier
  ) );
}, 250);

function updatePhysics( deltaTime ) {
  if (firstRun) {
    console.log('call on initial run');
    //ground.userData.physicsBody.setAngularVelocity(new Ammo.btVector3(-1, 0, 0));

    tmpTrans = new Ammo.btTransform();

    ammoTmpPos = new Ammo.btVector3(0,0,0);
    ammoTmpQuat = new Ammo.btQuaternion(0,0,0,1);
    tmpPos = new THREE.Vector3();
    window.tmpQuat = tmpQuat = new THREE.Quaternion();

    //let translateFactor = tmpPos.set(moveX, moveY, moveZ);

    firstRun = false;
  }

  if (moveLeft) {
    angle -= deltaTime*10;
  }
  if (moveRight) {
    angle += deltaTime*10;
  }

  const polarAngle = window.controls.getPolarAngle();
  const azimuthalAngle = window.controls.getAzimuthalAngle();
  setGravityByCamera(polarAngle, azimuthalAngle);

  //setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), Math.PI / 2 );

  //ground.rotateX(Math.sin(shift));
  ground.rotation.set(angle,0,0);
  ground.getWorldQuaternion(tmpQuat);
  //ammoTmpQuat.setValue( q.x, q.y, q.z, q.w);

  // ground.getWorldQuaternion(tmpQuat);
  ammoTmpQuat.setValue( tmpQuat.x, tmpQuat.y, tmpQuat.z, tmpQuat.w);


  const groundMs = ground.userData.physicsBody.getMotionState();

  tmpTrans.setIdentity();
  tmpTrans.setOrigin( ammoTmpPos ); 
  tmpTrans.setRotation( ammoTmpQuat );

  ground.userData.physicsBody.setWorldTransform(tmpTrans);
  groundMs.setWorldTransform(tmpTrans);

  physicsWorld.stepSimulation( deltaTime*10, 10 );
  //physicsWorld.stepSimulation( deltaTime*2, 10 );

  shift += deltaTime*0.1;

  // Update objects
  for ( var i = 0, il = dynamicObjects.length; i < il; i ++ ) {

    var objThree = dynamicObjects[ i ];
    var objPhys = objThree.userData.physicsBody;
    objPhys.activate();
    var ms = objPhys.getMotionState();
    if ( ms ) {

      ms.getWorldTransform( transformAux1 );
      var p = transformAux1.getOrigin();
      var q = transformAux1.getRotation();
      objThree.position.set( p.x(), p.y(), p.z() );
      //console.log('set', q.x(), q.y(), q.z());
      objThree.quaternion.set( q.x(), q.y(), q.z(), q.w() );
    }
  }
}

export default {};
