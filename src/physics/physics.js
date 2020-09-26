/* 
// Synchronous phytics implementation:

import { Vector3 } from 'three';
import throttle from 'lodash/throttle';

import { ConvexObjectBreaker } from '../../node_modules/three/examples/jsm/misc/ConvexObjectBreaker.js';
import {
  agentMass,
  agentRadius,
  boundingSphereRadius,
  debrisLifetimeMs,
  fractureImpulse,
  targetMass
} from '../constants';
import {
  getAgent,
  getCameraBallJoint,
  getScene
} from '../game/gameObjectsStore';
import audioInstance from '../game/audio';
// FIXME:
import graphicsInstance from '../graphics/graphics';

let Ammo;

class Physics {
  dynamicObjects = []
  collisionConfiguration = null
  dispatcher = null
  broadphase = null
  solver = null
  physicsWorld = null
  transformAux = null
  tempBtVec3_1 = null
  tempBtVec3_2 = null
  tempBtVec3_3 = null
  convexBreaker = null
  margin = 0.05
  impactPoint = new Vector3()
  impactNormal = new Vector3()
  objectsToRemove = []
  numObjectsToRemove = 0
  init() {
    return new Promise((resolve, reject) => {
      if (typeof window.Ammo === 'function') {
        window.Ammo().then(( AmmoLib ) => {
          window.Ammo = Ammo = AmmoLib;
          this.transformAux = new Ammo.btTransform();
          this.tempBtVec3_1 = new Ammo.btVector3(0,0,0);
          this.tempBtVec3_2 = new Ammo.btVector3(0,0,0);
          this.tempBtVec3_3 = new Ammo.btVector3(0,0,0);
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

    this.convexBreaker = new ConvexObjectBreaker();
  }
  setAgentPhysicsBody(agentMesh) {
    const shape = new Ammo.btSphereShape( agentRadius );

    shape.setMargin( this.margin );

    const localInertia = new Ammo.btVector3( 0, 0, 0 );

    shape.calculateLocalInertia( agentMass, localInertia );

    const transform = new Ammo.btTransform();

    transform.setIdentity();

    const { x, y, z } = agentMesh.position;

    transform.setOrigin(new Ammo.btVector3( x, y, z ));

    const motionState = new Ammo.btDefaultMotionState(transform);
    const rbInfo = new Ammo.btRigidBodyConstructionInfo( agentMass, motionState, shape, localInertia );
    const body = new Ammo.btRigidBody( rbInfo );

    body.gameRole = 'agent';

    // body.setDamping(0.1, 0.1);
    //body.setRestitution(0.5);
    body.setActivationState(4);

    agentMesh.userData.physicsBody = body;
    agentMesh.userData.collided = false;
    agentMesh.isAgent = true;

    this.dynamicObjects.push(agentMesh);

    this.physicsWorld.addRigidBody( body );
  }

  addBoundingSphere(mesh) {
    // const shape = new Ammo.btSphereShape( boundingSphereRadius );
    //const shape = this.createTrianglePhysicsShape(mesh.geometry.attributes.position.array);

    const coords = mesh.geometry.attributes.position.array;
    const ammoMesh = new Ammo.btTriangleMesh();

    const index = mesh.geometry.index.array;
    for ( let i = 0, il = index.length; i < il; i += 3 ) {
      const [index1, index2, index3] = [index[i], index[i+1], index[i+2]];

      this.tempBtVec3_1.setValue(coords[index1*3], coords[index1*3 + 1], coords[index1*3 + 2]);
      this.tempBtVec3_2.setValue(coords[index2*3], coords[index2*3 + 1], coords[index2*3 + 2]);
      this.tempBtVec3_3.setValue(coords[index3*3], coords[index3*3 + 1], coords[index3*3 + 2]);
      ammoMesh.addTriangle( this.tempBtVec3_1, this.tempBtVec3_2, this.tempBtVec3_3);
      // graphicsInstance.addDebugTriangle(
      //   coords[index1*3], coords[index1*3 + 1], coords[index1*3 + 2],
      //   coords[index2*3], coords[index2*3 + 1], coords[index2*3 + 2],
      //   coords[index3*3], coords[index3*3 + 1], coords[index3*3 + 2],
      // );

      // graphicsInstance.addDebugBall(coords[index1*3], coords[index1*3 + 1], coords[index1*3 + 2], 0xff0000);
      // graphicsInstance.addDebugBall(coords[index2*3], coords[index2*3 + 1], coords[index2*3 + 2], 0x00ff00);
      // graphicsInstance.addDebugBall(coords[index3*3], coords[index3*3 + 1], coords[index3*3 + 2], 0x0000ff);
    }

    // FIXME: or btConvexHullShape?
    const shape = new Ammo.btBvhTriangleMeshShape(ammoMesh);

    shape.setMargin( this.margin*100 );

    const localInertia = new Ammo.btVector3( 0, 0, 0 );
    shape.calculateLocalInertia( agentMass, localInertia );

    const transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3( 0,0,0 ));

    const motionState = new Ammo.btDefaultMotionState(transform);

    const rbInfo = new Ammo.btRigidBodyConstructionInfo( 0, motionState, shape, localInertia );

    const body = new Ammo.btRigidBody( rbInfo );

    
    body.setRestitution(1);

    body.gameRole = 'boundingSphere';

    body.setActivationState(4);

    this.physicsWorld.addRigidBody( body );
  }

  addTarget_new(object, id, { targetX, targetY, targetZ }) {
    this.convexBreaker.prepareBreakableObject(object, targetMass, new Vector3(), new Vector3(), true);
    const targetBody = this.createBreakableObject( object );
    
    object.userData.gameRole = 'target';
    object.userData.targetId = id;
  }

  createBreakableObject(object) {
    const shape = this.createConvexHullPhysicsShape( object.geometry.attributes.position.array );
    shape.setMargin( this.margin );

    const body = this.createRigidBody( object, shape, object.userData.mass, null, null, object.userData.velocity, object.userData.angularVelocity );

    // Set pointer back to the three object only in the debris objects
    const btVecUserData = new Ammo.btVector3( 0, 0, 0 );
    btVecUserData.threeObject = object;
    body.setUserPointer( btVecUserData );

    return body;
  }

  createConvexHullPhysicsShape( coords ) {
    const shape = new Ammo.btConvexHullShape();

    for ( let i = 0, il = coords.length; i < il; i += 3 ) {
      this.tempBtVec3_1.setValue( coords[ i ], coords[ i + 1 ], coords[ i + 2 ] );
      const lastOne = ( i >= ( il - 3 ) );
      shape.addPoint( this.tempBtVec3_1, lastOne );
    }

    return shape;
  }

  createTrianglePhysicsShape( coords ) {
    const mesh = new Ammo.btTriangleMesh();

    for ( let i = 0, il = coords.length; i < il; i += 9 ) {
      this.tempBtVec3_1.setValue( coords[ i ], coords[ i + 1 ], coords[ i + 2 ] );
      this.tempBtVec3_2.setValue( coords[ i + 3 ], coords[ i + 4 ], coords[ i + 5 ] );
      this.tempBtVec3_3.setValue( coords[ i + 6 ], coords[ i + 7 ], coords[ i + 8 ] );
      //const lastOne = ( i >= ( il - 3 ) );
      mesh.addTriangle( this.tempBtVec3_1, this.tempBtVec3_2, this.tempBtVec3_3);
    }

    const shape = new Ammo.btBvhTriangleMeshShape(mesh);

    return shape;
  }

  createRigidBody( object, physicsShape, mass, pos, quat, vel, angVel ) {

    if ( pos ) {
      object.position.copy( pos );
    } else {
      pos = object.position;
    }
    if ( quat ) {
      object.quaternion.copy( quat );
    } else {
      quat = object.quaternion;
    }

    const transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
    transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
    const motionState = new Ammo.btDefaultMotionState( transform );

    const localInertia = new Ammo.btVector3( 0, 0, 0 );
    physicsShape.calculateLocalInertia( mass, localInertia );

    const rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, physicsShape, localInertia );
    const body = new Ammo.btRigidBody( rbInfo );

    // body.setFriction( 0.5 );
    // body.setDamping(0.1, 0.1);
    body.setRestitution(1);
    // body.setFriction(5);

    if ( vel ) {
      body.setLinearVelocity( new Ammo.btVector3( vel.x, vel.y, vel.z ) );
    }
    if ( angVel ) {
      body.setAngularVelocity( new Ammo.btVector3( angVel.x, angVel.y, angVel.z ) );
    }

    object.userData.physicsBody = body;
    object.userData.collided = false;

    getScene().add( object );

    if ( mass > 0 ) {
      this.dynamicObjects.push(object);
      // Disable deactivation
      body.setActivationState( 4 );
    }

    this.physicsWorld.addRigidBody( body );

    return body;
  }

  update = ( deltaTime ) => {

    this.physicsWorld.stepSimulation( deltaTime*5, 10 );
    // this.physicsWorld.stepSimulation( deltaTime, 10 );

    // Update objects
    for ( let i = 0, il = this.dynamicObjects.length; i < il; i ++ ) {

      const objThree = this.dynamicObjects[ i ];
      const objPhys = objThree.userData.physicsBody;

      const motionState = objPhys.getMotionState();

      if (motionState) {
        motionState.getWorldTransform( this.transformAux );

        const position = this.transformAux.getOrigin();
        const quaternion = this.transformAux.getRotation();

        const [ x, y, z ] = [position.x(), position.y(), position.z()];

        if (objThree.isAgent) {
          if (Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2)) > boundingSphereRadius) {
            this.stopAgentAfterImpact();
            this.transformAux.setOrigin(new Ammo.btVector3(
              objThree.userData.prevPosition.x,
              objThree.userData.prevPosition.y,
              objThree.userData.prevPosition.z,
            ));
            getAgent().userData.physicsBody.setWorldTransform(this.transformAux);
            continue;
          } else {
            objThree.userData.prevPosition = { x, y, z };
          }
        }

        objThree.position.set(x, y, z);
        objThree.quaternion.set( quaternion.x(), quaternion.y(), quaternion.z(), quaternion.w() );

        if (objThree.isAgent) {
          getCameraBallJoint().position.set(x, y, z);
        }

        objThree.userData.collided = false;
      }
    }

    this.processCollisions();
  }

  removeDebris(object) {
    getScene().remove(object);

    this.physicsWorld.removeRigidBody(object.userData.physicsBody);
  }

  processCollisions() {
    for ( let i = 0, il = this.dispatcher.getNumManifolds(); i < il; i ++ ) {

      const contactManifold = this.dispatcher.getManifoldByIndexInternal( i );
      const rb0 = Ammo.castObject( contactManifold.getBody0(), Ammo.btRigidBody );
      const rb1 = Ammo.castObject( contactManifold.getBody1(), Ammo.btRigidBody );

      const threeObject0 = Ammo.castObject( rb0.getUserPointer(), Ammo.btVector3 ).threeObject;
      const threeObject1 = Ammo.castObject( rb1.getUserPointer(), Ammo.btVector3 ).threeObject;

      if ( ! threeObject0 && ! threeObject1 ) {
	continue;
      }

      const userData0 = threeObject0 ? threeObject0.userData : null;
      const userData1 = threeObject1 ? threeObject1.userData : null;

      const breakable0 = userData0 ? userData0.breakable : false;
      const breakable1 = userData1 ? userData1.breakable : false;

      const collided0 = userData0 ? userData0.collided : false;
      const collided1 = userData1 ? userData1.collided : false;

      if ( ( ! breakable0 && ! breakable1 ) || ( collided0 && collided1 ) ) {
	continue;
      }

      let contact = false;
      let maxImpulse = 0;
      for ( let j = 0, jl = contactManifold.getNumContacts(); j < jl; j ++ ) {

	const contactPoint = contactManifold.getContactPoint( j );

	if ( contactPoint.getDistance() < 0 ) {

	  contact = true;
	  const impulse = contactPoint.getAppliedImpulse();

	  if ( impulse > maxImpulse ) {

	    maxImpulse = impulse;
	    var pos = contactPoint.get_m_positionWorldOnB();
	    var normal = contactPoint.get_m_normalWorldOnB();
	    this.impactPoint.set( pos.x(), pos.y(), pos.z() );
	    this.impactNormal.set( normal.x(), normal.y(), normal.z() );
	  }

	  break;
	}
      }

      // If no point has contact, abort
      if ( ! contact ) continue;

      const obj0breaks = breakable0 && ! collided0 && maxImpulse > fractureImpulse;
      const obj1breaks = breakable1 && ! collided1 && maxImpulse > fractureImpulse;

      // Subdivision
      if (obj0breaks || obj1breaks) {
        let debris;

        if (obj0breaks) {

	  debris = this.convexBreaker.subdivideByImpact(
            threeObject0, this.impactPoint, this.impactNormal, 2, 2,
          );

	  const numObjects = debris.length;
	  for ( let j = 0; j < numObjects; j ++ ) {
	    const vel = rb0.getLinearVelocity();
	    const angVel = rb0.getAngularVelocity();
	    const fragment = debris[ j ];

	    fragment.userData.velocity.set( vel.x(), vel.y(), vel.z() );
	    fragment.userData.angularVelocity.set( angVel.x(), angVel.y(), angVel.z() );

	    this.createBreakableObject(fragment);
	  }

	  this.objectsToRemove[ this.numObjectsToRemove++ ] = threeObject0;
	  userData0.collided = true;
        }

        if (obj1breaks) {

	  debris = this.convexBreaker.subdivideByImpact(
            threeObject1, this.impactPoint, this.impactNormal, 2, 2,
          );

	  const numObjects = debris.length;
	  for ( let j = 0; j < numObjects; j ++ ) {
	    const vel = rb1.getLinearVelocity();
	    const angVel = rb1.getAngularVelocity();
	    const fragment = debris[ j ];

	    fragment.userData.velocity.set( vel.x(), vel.y(), vel.z() );
	    fragment.userData.angularVelocity.set( angVel.x(), angVel.y(), angVel.z() );

	    this.createBreakableObject(fragment);
	  }

	  this.objectsToRemove[ this.numObjectsToRemove++ ] = threeObject1;
	  userData1.collided = true;
        }

        this.clearDebris(debris);

        if ((userData0 && userData0.gameRole === 'target') || (userData1 && userData1.gameRole === 'target')) {

          this.stopAgentAfterImpact();

          const target = userData0.gameRole === 'target' ? rb0 : rb1;
          const targetUserData = userData0.gameRole === 'target' ? userData0 : userData1;

          if (targetUserData.wasHit !== true) {
            audioInstance.nextTarget();
            targetUserData.wasHit = true;
          }
        }
      }
    }

    for ( var i = 0; i < this.numObjectsToRemove; i ++ ) {
      this.removeDebris( this.objectsToRemove[ i ] );
    }
    this.numObjectsToRemove = 0;
  }

  clearDebris(debris) {
    window.setTimeout(() => {
      for (const debreeIndex in debris) {
        this.removeDebris(debris[debreeIndex]);
      }
    }, debrisLifetimeMs);
  }

  stopAgentAfterImpact() {
    getAgent().userData.physicsBody.setLinearVelocity(new Ammo.btVector3( 0, 0, 0 ));
  }
};

const physicsInstance = new Physics();

export default physicsInstance;
*/
