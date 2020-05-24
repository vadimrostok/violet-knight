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
    if (typeof window.Ammo === 'function') {
      window.Ammo().then( function ( AmmoLib ) {
        window.Ammo = Ammo = AmmoLib;
      });
      this.transformAux = new Ammo.btTransform();
    }
  }
  reset() {
    this.dynamicObjects = [];
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
    levelTransform.setOrigin( new Ammo.btVector3( 0, 0, 0 ) );

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
