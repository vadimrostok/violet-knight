import { Vector3 } from 'three';
import throttle from 'lodash/throttle';

import { ConvexObjectBreaker } from '../../node_modules/three/examples/jsm/misc/ConvexObjectBreaker.js';
import { agentRadius } from '../constants';
import { getCameraBallJoint, getScene } from '../game/gameObjectsStore';
import audioInstance from '../game/audio';

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
  convexBreaker = null
  margin = 0.05
  impactPoint = new Vector3()
  impactNormal = new Vector3()
  init() {
    return new Promise((resolve, reject) => {
      if (typeof window.Ammo === 'function') {
        window.Ammo().then(( AmmoLib ) => {
          window.Ammo = Ammo = AmmoLib;
          this.transformAux = new Ammo.btTransform();
          this.tempBtVec3_1 = new Ammo.btVector3(0,0,0);
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

    // function collisionCallbackFunc( cp,colObj0,colObj1) {
    //   // FIXME:
    //   return;
    //   colObj0 = Ammo.wrapPointer(colObj0, Ammo.btRigidBody);
    //   colObj1 = Ammo.wrapPointer(colObj1, Ammo.btRigidBody);
    //   cp = Ammo.wrapPointer(cp, Ammo.btManifoldPoint);
    //   if (colObj0.gameRole === 'target' && colObj0.removed !== true) {
    //     colObj0.mesh.visible = false;
    //     const physicsWorld = this.physicsWorld;
    //     audioInstance.nextTarget();
    //     colObj0.removed = true;
    //     setTimeout(function () {
    //       physicsWorld.removeRigidBody(colObj0);
    //     }, 10);
    //   }
    // };

    // var collisionCallbackPointer = Ammo.addFunction(collisionCallbackFunc.bind(this));

    // this.physicsWorld.setContactProcessedCallback(collisionCallbackPointer);

    this.convexBreaker = new ConvexObjectBreaker();
  }
  setAgentPhysicsBody(agentMesh) {
    const shape = new Ammo.btSphereShape( agentRadius );

    shape.setMargin( this.margin );

    const mass = 5;
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

    // body.setDamping(0.1, 0.1);
    // body.setRestitution(3);
    body.setActivationState(4);

    agentMesh.userData.physicsBody = body;
    agentMesh.userData.collided = false;
    agentMesh.isAgent = true;

    this.dynamicObjects.push(agentMesh);

    this.physicsWorld.addRigidBody( body );
  }
  // addTarget(targetMesh, id, { targetX, targetY, targetZ }) {
  //   const targetShape = new Ammo.btBoxShape( new Ammo.btVector3( targetX/2, targetY/2, targetZ/2 ) );

  //   const targetTransform = new Ammo.btTransform();
  //   targetTransform.setIdentity();
  //   const { x, y, z } = targetMesh.position;
  //   targetTransform.setOrigin( new Ammo.btVector3( x, y, z ) );

  //   const targetMass = 10;
  //   const targetLocalInertia = new Ammo.btVector3( 0, 0, 0 );
  //   const targetMotionState = new Ammo.btDefaultMotionState( targetTransform );

  //   targetShape.calculateLocalInertia( targetMass, targetLocalInertia );

  //   const targetBody = new Ammo.btRigidBody(
  //     new Ammo.btRigidBodyConstructionInfo(
  //       targetMass,
  //       targetMotionState,
  //       targetShape,
  //       targetLocalInertia,
  //     ));

  //   targetBody.mesh = targetMesh;
  //   targetBody.gameRole = 'target';
  //   targetBody.targetId = id;
  //   targetBody.collided = false;

  //   targetBody.setDamping(0.1, 0.1);
  //   targetBody.setRestitution(1);
  // targetBody.setFriction(0.5);
  //   targetBody.setActivationState(4);
  //   targetMesh.userData.physicsBody = targetBody;

  //   this.convexBreaker.prepareBreakableObject( targetMesh, targetMass, new Vector3(), new Vector3(), true );
  //   this.createDebrisFromBreakableObject( targetMesh );

  //   this.dynamicObjects.push(targetMesh);

  //   this.physicsWorld.addRigidBody( targetBody );
  // }

  addTarget_new(object, id, { targetX, targetY, targetZ }) {
    const mass = 10;
    this.convexBreaker.prepareBreakableObject(object, mass, new Vector3(), new Vector3(), true);
    const targetBody = this.createBreakableObject( object );
    
    targetBody.gameRole = 'target';
    targetBody.targetId = id;
  }

  createBreakableObject( object ) {
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
    // body.setRestitution(1);
    body.setFriction(5);

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

    this.physicsWorld.stepSimulation( deltaTime*3, 10 );
    // this.physicsWorld.stepSimulation( deltaTime, 10 );

    // Update objects
    for ( let i = 0, il = this.dynamicObjects.length; i < il; i ++ ) {

      const objThree = this.dynamicObjects[ i ];
      const objPhys = objThree.userData.physicsBody;

      // FIXME:
      //body.setActivationState( 4 );
      //objPhys.activate();

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

        // FIXME: why?
        objThree.userData.collided = false;
      }
    }

    this.processCollisions();
  }

  processCollisions() {
    for ( let i = 0, il = this.dispatcher.getNumManifolds(); i < il; i ++ ) {

      //console.log('mf', il);

      const contactManifold = this.dispatcher.getManifoldByIndexInternal( i );
      const rb0 = Ammo.castObject( contactManifold.getBody0(), Ammo.btRigidBody );
      const rb1 = Ammo.castObject( contactManifold.getBody1(), Ammo.btRigidBody );

      const threeObject0 = Ammo.castObject( rb0.getUserPointer(), Ammo.btVector3 ).threeObject;
      const threeObject1 = Ammo.castObject( rb1.getUserPointer(), Ammo.btVector3 ).threeObject;

      // console.log('contactManifold', contactManifold);

      if ( ! threeObject0 && ! threeObject1 ) {
	continue;
      }

      const userData0 = threeObject0 ? threeObject0.userData : null;
      const userData1 = threeObject1 ? threeObject1.userData : null;

      const breakable0 = userData0 ? userData0.breakable : false;
      const breakable1 = userData1 ? userData1.breakable : false;

      const collided0 = userData0 ? userData0.collided : false;
      const collided1 = userData1 ? userData1.collided : false;

      // console.log('breakable', breakable0, breakable1);
      // console.log('collided', collided0, collided1);

      if ( ( ! breakable0 && ! breakable1 ) || ( collided0 && collided1 ) ) {
	continue;
      }

      let contact = false;
      let maxImpulse = 0;
      //console.log('num contacts', contactManifold.getNumContacts());
      for ( let j = 0, jl = contactManifold.getNumContacts(); j < jl; j ++ ) {

	const contactPoint = contactManifold.getContactPoint( j );

        //console.log('contactPoint.getDistance()', contactPoint.getDistance());

	if ( contactPoint.getDistance() < 0 ) {

	  contact = true;
	  const impulse = contactPoint.getAppliedImpulse();

          //console.log('impulse', impulse);
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

      // Subdivision

      const fractureImpulse = 1;

      if ( breakable0 && ! collided0 && maxImpulse > fractureImpulse ) {

	const debris = this.convexBreaker.subdivideByImpact( threeObject0, this.impactPoint, this.impactNormal, 1, 2, 1.5 );

	const numObjects = debris.length;
	for ( let j = 0; j < numObjects; j ++ ) {
	  const vel = rb0.getLinearVelocity();
	  const angVel = rb0.getAngularVelocity();
	  const fragment = debris[ j ];

	  fragment.userData.velocity.set( vel.x(), vel.y(), vel.z() );
	  fragment.userData.angularVelocity.set( angVel.x(), angVel.y(), angVel.z() );

	  this.createBreakableObject( fragment );
	}

        // FIXME:
	//objectsToRemove[ numObjectsToRemove ++ ] = threeObject0;
	userData0.collided = true;
      }

      if ( breakable1 && ! collided1 && maxImpulse > fractureImpulse ) {

	const debris = this.convexBreaker.subdivideByImpact( threeObject1, this.impactPoint, this.impactNormal, 1, 2, 1.5 );

	const numObjects = debris.length;
	for ( let j = 0; j < numObjects; j ++ ) {
	  const vel = rb1.getLinearVelocity();
	  const angVel = rb1.getAngularVelocity();
	  const fragment = debris[ j ];

	  fragment.userData.velocity.set( vel.x(), vel.y(), vel.z() );
	  fragment.userData.angularVelocity.set( angVel.x(), angVel.y(), angVel.z() );

	  this.createBreakableObject( fragment );
	}

        // FIXME:
	//objectsToRemove[ numObjectsToRemove ++ ] = threeObject1;
	userData1.collided = true;
      }
    }
  }
};

const physicsInstance = new Physics();

export default physicsInstance;
