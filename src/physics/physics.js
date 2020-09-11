import throttle from 'lodash/throttle';

import { agentRadius } from '../constants';
import { getCameraBallJoint } from '../game/gameObjectsStore';

let Ammo;

class Physics {
  dynamicObjects = []
  collisionConfiguration = null
  dispatcher = null
  broadphase = null
  solver = null
  physicsWorld = null
  transformAux = null
  init() {
    return new Promise((resolve, reject) => {
      if (typeof window.Ammo === 'function') {
        window.Ammo().then(( AmmoLib ) => {
          window.Ammo = Ammo = AmmoLib;
          this.transformAux = new Ammo.btTransform();
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
  reset() {
    this.dynamicObjects = [];
  }
  addTarget(targetMesh, id, { targetX, targetY, targetZ }) {
    const ammoMesh = new Ammo.btTriangleMesh(true, false);

    /*
    const levelMeshVertices = targetMesh.geometry.attributes.position.array;
    
    for (let i = 0, l = levelMeshVertices.length/12; i < l; i++) {
      ammoMesh.addTriangle(
        new Ammo.btVector3(levelMeshVertices[i*9],   levelMeshVertices[i*9+1], levelMeshVertices[i*9+2]),
        new Ammo.btVector3(levelMeshVertices[i*9+3], levelMeshVertices[i*9+4], levelMeshVertices[i*9+5]),
        new Ammo.btVector3(levelMeshVertices[i*9+6], levelMeshVertices[i*9+7], levelMeshVertices[i*9+8]),
        false
      );
      ammoMesh.addTriangle(
        new Ammo.btVector3(levelMeshVertices[i*9+6], levelMeshVertices[i*9+7], levelMeshVertices[i*9+8]),
        new Ammo.btVector3(levelMeshVertices[i*9+3], levelMeshVertices[i*9+4], levelMeshVertices[i*9+5]),
        new Ammo.btVector3(levelMeshVertices[i*9+9],   levelMeshVertices[i*9+10], levelMeshVertices[i*9+11]),
        false
      );
      //;;console.log(i, levelMeshVertices);
    }

    const targetShape = new Ammo.btBvhTriangleMeshShape(ammoMesh, true, true);
    */

    const targetShape = new Ammo.btBoxShape( new Ammo.btVector3( targetX/2, targetY/2, targetZ/2 ) );

    const targetTransform = new Ammo.btTransform();
    targetTransform.setIdentity();
    const { x, y, z } = targetMesh.position;
    targetTransform.setOrigin( new Ammo.btVector3( x, y, z ) );

    const targetMass = 0;
    const targetLocalInertia = new Ammo.btVector3( 0, 0, 0 );
    const targetMotionState = new Ammo.btDefaultMotionState( targetTransform );
    const targetBody = new Ammo.btRigidBody(
      new Ammo.btRigidBodyConstructionInfo(
        targetMass,
        targetMotionState,
        targetShape,
        targetLocalInertia,
      ));

    targetBody.mesh = targetMesh;
    targetBody.gameRole = 'target';
    targetBody.targetId = id;

    this.physicsWorld.addRigidBody( targetBody );

    targetBody.setRestitution(1);
    targetMesh.userData.physicsBody = targetBody;

    //this.dynamicObjects.push(targetMesh);
  }
  initPhysics() {
    // Physics configuration
    this.collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
    this.dispatcher = new Ammo.btCollisionDispatcher( this.collisionConfiguration );
    this.broadphase = new Ammo.btDbvtBroadphase();
    this.solver = new Ammo.btSequentialImpulseConstraintSolver();
    this.physicsWorld = new Ammo.btDiscreteDynamicsWorld(
      this.dispatcher,
      this.broadphase,
      this.solver,
      this.collisionConfiguration,
    );
    // Gravity will be set dynamically, depending on camera position.
    this.physicsWorld.setGravity(new Ammo.btVector3( 0, 0, 0 ));

    function collisionCallbackFunc( cp,colObj0,colObj1) {
      colObj0 = Ammo.wrapPointer(colObj0, Ammo.btRigidBody);
      colObj1 = Ammo.wrapPointer(colObj1, Ammo.btRigidBody);
      cp = Ammo.wrapPointer(cp, Ammo.btManifoldPoint);
      if (colObj0.gameRole === 'target') {
        colObj0.mesh.visible = false;
        const physicsWorld = this.physicsWorld;
        setTimeout(function () {
          physicsWorld.removeRigidBody(colObj0);
        }, 10);
      }
      // trigger your events.
      console.log("IN", colObj0, colObj1);
    };

    var collisionCallbackPointer = Ammo.addFunction(collisionCallbackFunc.bind(this));
    //var collisionCallbackPointer = collisionCallbackFunc;
    //var dynamicsWorld = new Ammo.btDiscreteDynamicsWorld(...);
    //dynamicsWorld.setContactProcessedCallback(collisionCallbackPointer);

    this.physicsWorld.setContactProcessedCallback(collisionCallbackPointer);
  }
  setLevelPhysicsBody(levelMesh) {
    // Physics configuration
    this.collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
    this.dispatcher = new Ammo.btCollisionDispatcher( this.collisionConfiguration );
    this.broadphase = new Ammo.btDbvtBroadphase();
    this.solver = new Ammo.btSequentialImpulseConstraintSolver();
    this.physicsWorld = new Ammo.btDiscreteDynamicsWorld(
      this.dispatcher,
      this.broadphase,
      this.solver,
      this.collisionConfiguration,
    );
    // Gravity will be set dynamically, depending on camera position.
    this.physicsWorld.setGravity(new Ammo.btVector3( 0, 0, 0 ));

    const ammoMesh = new Ammo.btTriangleMesh(true, true);
    const levelMeshVertices = levelMesh.geometry.attributes.position.array;

    for (let i = 0, l = levelMeshVertices.length/9; i < l; i++) {
      ammoMesh.addTriangle(
        new Ammo.btVector3(levelMeshVertices[i*9],   levelMeshVertices[i*9+1], levelMeshVertices[i*9+2]),
        new Ammo.btVector3(levelMeshVertices[i*9+3], levelMeshVertices[i*9+4], levelMeshVertices[i*9+5]),
        new Ammo.btVector3(levelMeshVertices[i*9+6], levelMeshVertices[i*9+7], levelMeshVertices[i*9+8]),
        false
      );
    }

    const levelShape = new Ammo.btBvhTriangleMeshShape(ammoMesh, true, true);

    const levelTransform = new Ammo.btTransform();
    levelTransform.setIdentity();
    levelTransform.setOrigin( new Ammo.btVector3( 0, 0, 50 ) );

    const levelMass = 0;
    const levelLocalInertia = new Ammo.btVector3( 0, 0, 0 );
    const levelMotionState = new Ammo.btDefaultMotionState( levelTransform );
    const levelBody = new Ammo.btRigidBody(
      new Ammo.btRigidBodyConstructionInfo(
        levelMass,
        levelMotionState,
        levelShape,
        levelLocalInertia,
      ));

    this.physicsWorld.addRigidBody( levelBody );
    window.physicsWorld = this.physicsWorld;
    window.dispatcher = this.dispatcher;

    function collisionCallbackFunc( cp,colObj0,colObj1)
    {
      colObj0 = Ammo.wrapPointer(colObj0, Ammo.btRigidBody);
      colObj1 = Ammo.wrapPointer(colObj1, Ammo.btRigidBody);
      cp = Ammo.wrapPointer(cp, Ammo.btManifoldPoint);
      // trigger your events.
      console.log("IN", colObj0, colObj1);
    }

    var collisionCallbackPointer = Ammo.addFunction(collisionCallbackFunc);
    //var collisionCallbackPointer = collisionCallbackFunc;
    //var dynamicsWorld = new Ammo.btDiscreteDynamicsWorld(...);
    //dynamicsWorld.setContactProcessedCallback(collisionCallbackPointer);

    this.physicsWorld.setContactProcessedCallback(collisionCallbackPointer);
    
    // this.physicsWorld.setContactAddedCallback((...a) => {
    //   console.log(a);
    //   // const numManifolds = world.getDispatcher().getNumManifolds();
    //   // console.log('numManifolds', numManifolds);
    // });

    // levelBody.setGravity(new Ammo.btVector3( 0, 0, 0 ));

    levelBody.setRestitution(1);
    levelMesh.userData.physicsBody = levelBody;

    //FIXME: if level change we'll need to remove old one from dynamicObjects
    this.dynamicObjects.push(levelMesh);
  }
  setAgentPhysicsBody(agentMesh) {
    const margin = 0.05;
    const shape = new Ammo.btSphereShape( agentRadius );

    shape.setMargin( margin );

    const mass = 1;
    const localInertia = new Ammo.btVector3( 0, 0, 0 );

    shape.calculateLocalInertia( mass, localInertia );

    const transform = new Ammo.btTransform();

    transform.setIdentity();

    const { x, y, z } = agentMesh.position;

    transform.setOrigin(new Ammo.btVector3( x, y, z ));

    const motionState = new Ammo.btDefaultMotionState(transform);
    const rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, shape, localInertia );
    const body = new Ammo.btRigidBody( rbInfo );

    body.gameRole = 'agent';

    body.setDamping(0.1, 0.1);
    body.setRestitution(1);

    agentMesh.userData.physicsBody = body;
    agentMesh.isAgent = true;

    this.dynamicObjects.push(agentMesh);

    this.physicsWorld.addRigidBody( body );
  }
  setGravity = (rotationQuaternion, amount = -10) => {
    const v = new THREE.Vector3(amount, 0, 0);
    v.applyQuaternion(rotationQuaternion);
    this.physicsWorld.setGravity(new Ammo.btVector3(
      v.x,
      v.y,
      v.z
    ));
  }

  shift = 0
  update = ( deltaTime ) => {

    this.physicsWorld.stepSimulation( deltaTime*3, 10 );

    this.shift += deltaTime*0.1;

    // Update objects
    for ( let i = 0, il = this.dynamicObjects.length; i < il; i ++ ) {

      const objThree = this.dynamicObjects[ i ];
      const objPhys = objThree.userData.physicsBody;

      // FIXME:
      objPhys.activate();

      const motionState = objPhys.getMotionState();

      if (motionState) {
        motionState.getWorldTransform( this.transformAux );

        const position = this.transformAux.getOrigin();
        const quaternion = this.transformAux.getRotation();

        const [ x, y, z ] = [position.x(), position.y(), position.z()];
        objThree.position.set(x, y, z);
        objThree.quaternion.set( quaternion.x(), quaternion.y(), quaternion.z(), quaternion.w() );

        if (objThree.isAgent) {
          getCameraBallJoint().position.set(x, y, z);
        }
      }
    }
  }
};

const physicsInstance = new Physics();

export default physicsInstance;
