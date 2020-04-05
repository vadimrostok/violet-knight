import * as THREE from 'three';

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
var transformAux1;

var heightData = null;
var ammoHeightData = null;

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

  heightData = generateHeight( terrainWidth, terrainDepth, terrainMinHeight, terrainMaxHeight );

  initGraphics();

  //initPhysics();

}

function initGraphics() {

  container = document.getElementById( 'container' );

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = true;
  container.appendChild( renderer.domElement );

  // stats = new Stats();
  // stats.domElement.style.position = 'absolute';
  // stats.domElement.style.top = '0px';
  // container.appendChild( stats.domElement );

  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.2, 2000 );

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xbfd1e5 );

  camera.position.y = 100;

  camera.position.z = terrainDepthExtents / 2;
  camera.lookAt( 0, 0, 0 );

  var controls = new OrbitControls( camera, renderer.domElement );



  var manager = new THREE.LoadingManager();
  var material = new THREE.MeshPhongMaterial( { color: 0xff5533, specular: 0x111111, shininess: 200 } );
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

      // var points = [];
      // points.push( new THREE.Vector3( - 10, 0, 0 ) );
      // points.push( new THREE.Vector3( 0, 10, 0 ) );
      // points.push( new THREE.Vector3( 10, 0, 0 ) );

      // var g2 = new THREE.BufferGeometry();
      // console.log('g2', g2);
      // g2.attributes.position = new THREE.BufferAttribute( mesh.geometry.attributes.position.array, 3 );

      // var line = new THREE.Line( g2, material2 );
      // line.scale.set( 15, 15, 15 );
      // scene.add( line );
      // console.log('line', line);

      //object.position.set( 0, - 2, 0.6 );
      //object.rotation.set( 0, - Math.PI / 2, 0 );
      console.log('1=', mesh.geometry.attributes.position.array[0]);
      mesh.geometry.scale( 15, 15, 15 );
      //mesh.geometry.translate(0,-20,0);
      console.log('2=', mesh.geometry.attributes.position.array[0]);
      //object.scale.set( 15, 15, 15 );
      object.position.set(0,3,0);

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


  // var loader = new STLLoader();
  // loader.load( './stl/one.stl', function ( geometry ) {

  //   var material = new THREE.MeshPhongMaterial( { color: 0xff5533, specular: 0x111111, shininess: 200 } );
  //   var mesh = new THREE.Mesh( geometry, material );

  //   console.log('geo', geometry, mesh);

  //   mesh.position.set( 0, - 0.25, 0.6 );
  //   mesh.rotation.set( 0, - Math.PI / 2, 0 );
  //   mesh.scale.set( 15, 15, 15 );

  //   mesh.rotateX( Math.PI / 2 );

  //   mesh.castShadow = true;
  //   mesh.receiveShadow = true;

  //   scene.add( mesh );

  // } );










  // var geometry = new THREE.PlaneBufferGeometry( terrainWidthExtents, terrainDepthExtents, terrainWidth - 1, terrainDepth - 1 );
  // geometry.rotateX( - Math.PI / 2 );

  // var vertices = geometry.attributes.position.array;

  // for ( var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {

  //   // j + 1 because it is the y component that we modify
  //   vertices[ j + 1 ] = heightData[ i ];

  // }

  // geometry.computeVertexNormals();

  // var groundMaterial = new THREE.MeshPhongMaterial( { color: 0xC7C7C7 } );
  // terrainMesh = new THREE.Mesh( geometry, groundMaterial );
  // terrainMesh.receiveShadow = true;
  // terrainMesh.castShadow = true;

  // scene.add( terrainMesh );






  // var textureLoader = new THREE.TextureLoader();
  // textureLoader.load( "textures/grid.png", function ( texture ) {

  //   texture.wrapS = THREE.RepeatWrapping;
  //   texture.wrapT = THREE.RepeatWrapping;
  //   texture.repeat.set( terrainWidth - 1, terrainDepth - 1 );
  //   groundMaterial.map = texture;
  //   groundMaterial.needsUpdate = true;

  // } );

  var light2 = new THREE.AmbientLight( 0x404040 ); // soft white light
  scene.add( light2 );

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

function initPhysics(mesh) {

  // Physics configuration

  collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
  dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration );
  broadphase = new Ammo.btDbvtBroadphase();
  solver = new Ammo.btSequentialImpulseConstraintSolver();
  physicsWorld = new Ammo.btDiscreteDynamicsWorld( dispatcher, broadphase, solver, collisionConfiguration );
  physicsWorld.setGravity( new Ammo.btVector3( 0, - 6, 0 ) );

  // Create the terrain body

  var groundShape = createTerrainShape(mesh);
  var groundTransform = new Ammo.btTransform();
  groundTransform.setIdentity();
  // Shifts the terrain, since bullet re-centers it on its bounding box.
  groundTransform.setOrigin( new Ammo.btVector3( 0, ( terrainMaxHeight + terrainMinHeight ) / 2, 0 ) );
  var groundMass = 0;
  var groundLocalInertia = new Ammo.btVector3( 0, 0, 0 );
  var groundMotionState = new Ammo.btDefaultMotionState( groundTransform );
  var groundBody = new Ammo.btRigidBody( new Ammo.btRigidBodyConstructionInfo( groundMass, groundMotionState, groundShape, groundLocalInertia ) );
  physicsWorld.addRigidBody( groundBody );

  transformAux1 = new Ammo.btTransform();

}

function generateHeight( width, depth, minHeight, maxHeight ) {

  // Generates the height data (a sinus wave)

  var size = width * depth;
  var data = new Float32Array( size );

  var hRange = maxHeight - minHeight;
  var w2 = width / 2;
  var d2 = depth / 2;
  var phaseMult = 12;

  var p = 0;
  for ( var j = 0; j < depth; j ++ ) {

    for ( var i = 0; i < width; i ++ ) {

      var radius = Math.sqrt(
	Math.pow( ( i - w2 ) / w2, 2.0 ) +
	  Math.pow( ( j - d2 ) / d2, 2.0 ) );

      var height = ( Math.sin( radius * phaseMult ) + 1 ) * 0.5 * hRange + minHeight;

      data[ p ] = height;

      p ++;

    }

  }

  return data;

}

function createTerrainShape(mesh) {

  // This parameter is not really used, since we are using PHY_FLOAT height data type and hence it is ignored
  var heightScale = 1;

  // Up axis = 0 for X, 1 for Y, 2 for Z. Normally 1 = Y is used.
  var upAxis = 1;

  // hdt, height data type. "PHY_FLOAT" is used. Possible values are "PHY_FLOAT", "PHY_UCHAR", "PHY_SHORT"
  var hdt = "PHY_FLOAT";

  // Set this to your needs (inverts the triangles)
  var flipQuadEdges = false;

  // Creates height data buffer in Ammo heap
  //  console.log('mesh', mesh, mesh.geometry.attributes.position.array);
  
  const pointsCount = mesh.geometry.attributes.position.array/3;
  ammoHeightData = Ammo._malloc( 4 * terrainWidth * terrainDepth );
  //ammoHeightData = Ammo._malloc( 4 * width * terrainDepth );

  // Copy the javascript height data array to the Ammo one.
  var p = 0;
  var p2 = 0;
  for ( var j = 0; j < terrainDepth; j ++ ) {

    for ( var i = 0; i < terrainWidth; i ++ ) {

      // write 32-bit float data to memory
      Ammo.HEAPF32[ ammoHeightData + p2 >> 2 ] = heightData[ p ];

      p ++;

      // 4 bytes/float
      p2 += 4;

    }

  }



  var ammoMesh = new Ammo.btTriangleMesh(true, true);
  // ammoMesh.addTriangle(
  //   new Ammo.btVector3(0, 0, 0),
  //   new Ammo.btVector3(1, 0, 0),
  //   new Ammo.btVector3(0, 1, 0),
  //   false
  // );

  //console.log('mesh', mesh);
  //var newShape = new Ammo.btConvexHullShape();
  const arr = mesh.geometry.attributes.position.array;
  // for (let i = 0, l = arr.length/3; i < l; i++) {
  //   newShape.addPoint(new Ammo.btVector3(arr[i*3], arr[i*3+1], arr[i*3+2]));
  // }

  for (let i = 0, l = arr.length/9; i < l; i++) {
    ammoMesh.addTriangle(
      new Ammo.btVector3(arr[i*9], arr[i*9+1], arr[i*9+2]),
      new Ammo.btVector3(arr[i*9+3], arr[i*9+4], arr[i*9+5]),
      new Ammo.btVector3(arr[i*9+6], arr[i*9+7], arr[i*9+8]),
      false
    );    
  }
  // var scaleX = 15;
  // var scaleZ = 15;
  // var scaleY = 15;
  // newShape.setLocalScaling( new Ammo.btVector3( scaleX, scaleY, scaleZ ) );


  var newShape = new Ammo.btBvhTriangleMeshShape(ammoMesh, true, true);

  //newShape.setMargin( 0.05 );
  return newShape;






  // Creates the heightfield physics shape
  var heightFieldShape = new Ammo.btHeightfieldTerrainShape(
    terrainWidth,
    terrainDepth,
    ammoHeightData,
    heightScale,
    terrainMinHeight,
    terrainMaxHeight,
    upAxis,
    hdt,
    flipQuadEdges
  );

  // Set horizontal scale
  var scaleX = terrainWidthExtents / ( terrainWidth - 1 );
  var scaleZ = terrainDepthExtents / ( terrainDepth - 1 );
  heightFieldShape.setLocalScaling( new Ammo.btVector3( scaleX, 1, scaleZ ) );

  heightFieldShape.setMargin( 0.05 );

  return heightFieldShape;

}

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

  threeObject.position.set( -terrainWidth/8, terrainMaxHeight + objectSize + 20, terrainDepth/8 );

  var mass = objectSize * 5;
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
  //stats.update();

}

let deltaTime;

function render() {

  deltaTime = clock.getDelta();

  updatePhysics( deltaTime );

  renderer.render( scene, camera );

  time += deltaTime;

}

function updatePhysics( deltaTime ) {

  physicsWorld.stepSimulation( deltaTime*3, 10 );

  // Update objects
  for ( var i = 0, il = dynamicObjects.length; i < il; i ++ ) {

    var objThree = dynamicObjects[ i ];
    var objPhys = objThree.userData.physicsBody;
    var ms = objPhys.getMotionState();
    if ( ms ) {

      ms.getWorldTransform( transformAux1 );
      var p = transformAux1.getOrigin();
      var q = transformAux1.getRotation();
      objThree.position.set( p.x(), p.y(), p.z() );
      objThree.quaternion.set( q.x(), q.y(), q.z(), q.w() );

    }

  }

}

export default {};
