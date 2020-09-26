self.importScripts(
  './ammo.js',
  '../node_modules/@babel/polyfill/dist/polyfill.min.js',
);

function arrayToVec3Source(arr) {
  const result = {x: arr[0], y: arr[1], z: arr[2]};
  if (arr[3]) {
    result.w = arr[3];
  }
  return result;
}

class Physics {
  collisionConfiguration = null
  dispatcher = null
  broadphase = null
  solver = null
  physicsWorld = null
  transformAux = null
  tempBtVec3_1 = null
  tempBtVec3_2 = null
  tempBtVec3_3 = null
  margin = 0
  impactPoint = null
  impactNormal = null
  numObjectsToRemove = 0
  agentBody = null
  agentRadius = 0
  agentMass = 0
  targetMass = 0
  boundingSphereRadius = 0
  postMessage = null
  constructor({
    agentRadius, agentMass, boundingSphereRadius, fractureImpulse, debrisLifetimeMs, targetMass,
    postMessage,
  }) {
    this.agentRadius = agentRadius;
    this.agentMass = agentMass;
    this.boundingSphereRadius = boundingSphereRadius;
    this.fractureImpulse = fractureImpulse;
    this.debrisLifetimeMs = debrisLifetimeMs;
    this.targetMass = targetMass;
    this.postMessage = postMessage;
    this.objectsToRemove = [];
    this.dynamicBodies = [];
  }
  init() {
    return new Promise((resolve, reject) => {
      if (typeof self.Ammo === 'function') {
        self.Ammo().then(( AmmoLib ) => {
          self.Ammo = self.Ammo = AmmoLib;
          this.transformAux = new self.Ammo.btTransform();
          this.tempBtVec3_1 = new self.Ammo.btVector3(0,0,0);
          this.tempBtVec3_2 = new self.Ammo.btVector3(0,0,0);
          this.tempBtVec3_3 = new self.Ammo.btVector3(0,0,0);
          this.initPhysics();
          resolve();
        });
      } else {
        this.initPhysics();
        resolve();
      }
    });
  }
  initPhysics() {
    // Physics configuration
    this.collisionConfiguration = new self.Ammo.btDefaultCollisionConfiguration();
    this.dispatcher = new self.Ammo.btCollisionDispatcher( this.collisionConfiguration );
    this.broadphase = new self.Ammo.btDbvtBroadphase();
    this.solver = new self.Ammo.btSequentialImpulseConstraintSolver();
    this.physicsWorld = new self.Ammo.btDiscreteDynamicsWorld(
      this.dispatcher,
      this.broadphase,
      this.solver,
      this.collisionConfiguration,
    );
    // Gravity will be set dynamically, depending on camera position.
    this.physicsWorld.setGravity(new self.Ammo.btVector3( 0, 0, 0 ));

    this.startLoop();
  }
  startLoop() {
    this.loop();
  }
  deltaTime = (new Date).getTime()
  loop = () => {
    if (self.requestAnimationFrame) {
      self.requestAnimationFrame(this.loop);
    } else {
      setTimeout(this.loop, 1000/60);
    }

    const now = (new Date).getTime();

    this.update(now - this.deltaTime);
    this.deltaTime = now;
  }
  setAgentPhysicsBody({ x, y, z }) {
    const shape = new self.Ammo.btSphereShape( this.agentRadius );

    shape.setMargin( this.margin );

    const localInertia = new self.Ammo.btVector3( 0, 0, 0 );

    shape.calculateLocalInertia( this.agentMass, localInertia );

    const transform = new self.Ammo.btTransform();

    transform.setIdentity();

    transform.setOrigin(new self.Ammo.btVector3( x, y, z ));

    const motionState = new self.Ammo.btDefaultMotionState(transform);
    const rbInfo = new self.Ammo.btRigidBodyConstructionInfo( this.agentMass, motionState, shape, localInertia );
    const body = new self.Ammo.btRigidBody( rbInfo );

    body.setActivationState(4);

    body.userData = body.userData || {};
    body.userData.isAgent = true;
    body.userData.role = 'agent';
    body.userData.id = 'agent';
    body.userData.collided = false;

    this.dynamicBodies.push(body);
    this.agentBody = body;

    this.physicsWorld.addRigidBody( body );
  }

  addTarget(position, quaternion, vertexArray, targetId) {
    const targetBody = this.createBreakableObject( position, quaternion, vertexArray, this.targetMass );

    targetBody.userData = targetBody.userData || {};
    targetBody.userData.isTarget = true;
    targetBody.userData.role = 'target';
    targetBody.userData.id = targetId;
    targetBody.userData.breakable = true;
  }

  createBreakableObject(position, quaternion, vertexArray, mass, velocity, angularVelocity) {
    const shape = this.createConvexHullPhysicsShape( vertexArray );
    shape.setMargin( this.margin );

    const body = this.createRigidBody( shape, mass, position, quaternion, velocity, angularVelocity );

    return body;
  }

  createConvexHullPhysicsShape( coords ) {
    const shape = new self.Ammo.btConvexHullShape();

    for ( let i = 0, il = coords.length; i < il; i += 3 ) {
      this.tempBtVec3_1.setValue( coords[ i ], coords[ i + 1 ], coords[ i + 2 ] );
      const lastOne = ( i >= ( il - 3 ) );
      shape.addPoint( this.tempBtVec3_1, lastOne );
    }

    return shape;
  }

  createTrianglePhysicsShape( coords ) {
    const mesh = new self.Ammo.btTriangleMesh();

    for ( let i = 0, il = coords.length; i < il; i += 9 ) {
      this.tempBtVec3_1.setValue( coords[ i ], coords[ i + 1 ], coords[ i + 2 ] );
      this.tempBtVec3_2.setValue( coords[ i + 3 ], coords[ i + 4 ], coords[ i + 5 ] );
      this.tempBtVec3_3.setValue( coords[ i + 6 ], coords[ i + 7 ], coords[ i + 8 ] );
      //const lastOne = ( i >= ( il - 3 ) );
      mesh.addTriangle( this.tempBtVec3_1, this.tempBtVec3_2, this.tempBtVec3_3);
    }

    const shape = new self.Ammo.btBvhTriangleMeshShape(mesh);

    return shape;
  }

  createRigidBody( physicsShape, mass, pos, quat, vel, angVel ) {
    const transform = new self.Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new self.Ammo.btVector3( pos.x, pos.y, pos.z ) );
    transform.setRotation( new self.Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
    const motionState = new self.Ammo.btDefaultMotionState( transform );

    const localInertia = new self.Ammo.btVector3( 0, 0, 0 );
    physicsShape.calculateLocalInertia( mass, localInertia );

    const rbInfo = new self.Ammo.btRigidBodyConstructionInfo( mass, motionState, physicsShape, localInertia );
    const body = new self.Ammo.btRigidBody( rbInfo );

    body.setRestitution(1);

    if ( vel ) {
      body.setLinearVelocity( new self.Ammo.btVector3( vel.x, vel.y, vel.z ) );
    }
    if ( angVel ) {
      body.setAngularVelocity( new self.Ammo.btVector3( angVel.x, angVel.y, angVel.z ) );
    }

    body.userData = body.userData || {};
    body.userData.collided = false;

    if ( mass > 0 ) {
      this.dynamicBodies.push(body);
      // Disable deactivation
      body.setActivationState( 4 );
    }

    this.physicsWorld.addRigidBody( body );

    return body;
  }

  update = ( deltaTime ) => {

    this.physicsWorld.stepSimulation( deltaTime*5, 10 );

    // Update objects
    for ( let i = 0, il = this.dynamicBodies.length; i < il; i ++ ) {

      const objPhys = this.dynamicBodies[ i ];
      const motionState = objPhys.getMotionState();

      if (motionState) {
        motionState.getWorldTransform( this.transformAux );

        const position = this.transformAux.getOrigin();
        const quaternion = this.transformAux.getRotation();

        const [ x, y, z ] = [position.x(), position.y(), position.z()];

        if (objPhys.userData.isAgent) {
          if (Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2)) > this.boundingSphereRadius) {
            this.stopAgentAfterImpact();
            this.transformAux.setOrigin(new self.Ammo.btVector3(
              objPhys.userData.prevPosition.x,
              objPhys.userData.prevPosition.y,
              objPhys.userData.prevPosition.z,
            ));
            this.agentBody.setWorldTransform(this.transformAux);
            continue;
          } else {
            objPhys.userData.prevPosition = { x, y, z };
          }
        }

        this.postMessage({
          task: 'update',
          role: objPhys.userData.role,
          id: objPhys.userData.id,
          position: { x, y, z },
          quaternion: [quaternion.x(), quaternion.y(), quaternion.z(), quaternion.w()],
        });

        objPhys.userData.collided = false;
      }
    }

    this.processCollisions();
  }

  processCollisions() {
    for ( let i = 0, il = this.dispatcher.getNumManifolds(); i < il; i ++ ) {

      const contactManifold = this.dispatcher.getManifoldByIndexInternal( i );
      const rb0 = self.Ammo.castObject( contactManifold.getBody0(), self.Ammo.btRigidBody );
      const rb1 = self.Ammo.castObject( contactManifold.getBody1(), self.Ammo.btRigidBody );

      const userData0 = rb0.userData || null;
      const userData1 = rb1.userData || null;

      if ( !userData0 || !userData1 ) {
	continue;
      }

      const breakable0 = userData0 ? userData0.breakable: false;
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

	if ( contactPoint.getDistance() < 0.1 ) {

	  contact = true;
	  const impulse = contactPoint.getAppliedImpulse();

	  if ( impulse > maxImpulse ) {

	    maxImpulse = impulse;
	    var pos = contactPoint.get_m_positionWorldOnB();
	    var normal = contactPoint.get_m_normalWorldOnB();
	    this.impactPoint = {x : pos.x(), y: pos.y(), z : pos.z() };
	    this.impactNormal = {x : normal.x(), y: normal.y(), z : normal.z() };
	  }
	}
      }

      if (userData0.isAgent) {
        rb0.setAngularVelocity(new self.Ammo.btVector3( 0, 0, 0 ));
      } else if (userData1.isAgent) {
        rb1.setAngularVelocity(new self.Ammo.btVector3( 0, 0, 0 ));
      }

      // If no point has contact, abort
      if ( !contact || !this.impactPoint || (
        this.impactPoint.x === 0 &&
        this.impactPoint.y === 0 &&
        this.impactPoint.z === 0
      ) ) continue;

      const obj0breaks = breakable0 && userData1.isAgent && ! collided0 && maxImpulse > this.fractureImpulse;
      const obj1breaks = breakable1 && userData0.isAgent && ! collided1 && maxImpulse > this.fractureImpulse;

      // Subdivision
      if (obj0breaks || obj1breaks) {
        let debris;

        if (obj0breaks) {
          const vel = rb0.getLinearVelocity();
	  const angVel = rb0.getAngularVelocity();

          this.postMessage({
            task: 'subdivideByImpact',
            impactPoint: [this.impactPoint.x, this.impactPoint.y, this.impactPoint.z],
            impactNormal: [this.impactNormal.x, this.impactNormal.y, this.impactNormal.z],
            role: rb0.userData.role,
            id: rb0.userData.id,
            vel: [vel.x(), vel.y(), vel.z()],
	    angVel: [angVel.x(), angVel.y(), angVel.z()],
          });

	  this.objectsToRemove[ this.numObjectsToRemove++ ] = rb0;
	  userData0.collided = true;
        }
        if (obj1breaks) {
          const vel = rb1.getLinearVelocity();
	  const angVel = rb1.getAngularVelocity();

          this.postMessage({
            task: 'subdivideByImpact',
            impactPoint: [this.impactPoint.x, this.impactPoint.y, this.impactPoint.z],
            impactNormal: [this.impactNormal.x, this.impactNormal.y, this.impactNormal.z],
            role: rb1.userData.role,
            id: rb1.userData.id,
            vel: [vel.x(), vel.y(), vel.z()],
	    angVel: [angVel.x(), angVel.y(), angVel.z()],
          });

	  this.objectsToRemove[ this.numObjectsToRemove++ ] = rb1;
	  userData1.collided = true;
        }

        if ((userData0 && userData0.isTarget) || (userData1 && userData1.isTarget)) {

          this.stopAgentAfterImpact();

          const targetUserData = userData0.isTarget ? userData0 : userData1;

          if (targetUserData.wasHit !== true) {
            this.postMessage({ task: 'playAudio' });
            targetUserData.wasHit = true;
          }
        }
      }
    }

    if (this.numObjectsToRemove) {
      this.postMessage({
        task: 'removeDebris',
        debris: this.objectsToRemove.map(({ userData: { role, id }}) => ({ role, id })),
      });

      for ( var i = 0; i < this.numObjectsToRemove; i ++ ) {
        this.physicsWorld.removeRigidBody(this.objectsToRemove[i]);
      }
      this.numObjectsToRemove = 0;
    }
    
  }

  clearDebris(debris) {
    setTimeout(() => {
      this.postMessage({
        task: 'removeDebris',
        debris: debris.map(({ userData: { role, id }}) => ({ role, id })),
      });

      for (const debreeIndex in debris) {
        this.physicsWorld.removeRigidBody(debris[debreeIndex]);
      }
    }, this.debrisLifetimeMs);
  }

  stopAgentAfterImpact() {
    this.agentBody.setLinearVelocity(new self.Ammo.btVector3( 0, 0, 0 ));
  }
}

self.physicsInstance = 'dummy';

self.onmessage = async function (e) {
  switch(e.data.task) {
  case 'init':
    const {
      agentRadius, agentMass, boundingSphereRadius, fractureImpulse, debrisLifetimeMs, targetMass,
    } = e.data.lib;

    self.physicsInstance = new Physics({
      agentRadius, agentMass, boundingSphereRadius, fractureImpulse, debrisLifetimeMs, targetMass,
      postMessage(message) {
        self.postMessage(message);
      },
    });

    await self.physicsInstance.init();

    self.postMessage({ task: 'ready' });

    break;
  case 'setAgent':

    const { position } = e.data;

    self.physicsInstance.setAgentPhysicsBody(position);

    break;
  case 'punch': {
    const { vector: { x, y, z } } = e.data;

    self.physicsInstance.agentBody.applyForce(new self.Ammo.btVector3(x, y, z));

    break;
  }
  case 'addTarget': {
    const { position, quaternion, vertexArray, targetId } = e.data;

    self.physicsInstance.addTarget(position, quaternion, vertexArray, targetId);

    break;
  }
  case 'freeze': {
    self.physicsInstance.stopAgentAfterImpact();

    break;
  }
  case 'createFragments': {

    const { fragments } = e.data;

    const numObjects = fragments.length;
    const debris = [];
    for ( let j = 0; j < numObjects; j ++ ) {
      const [
        fragmentId, position, quaternion, vertexArray, mass, velocity, angularVelocity
      ] = fragments[ j ];

      const body = self.physicsInstance.createBreakableObject(
        arrayToVec3Source(position),
        arrayToVec3Source(quaternion),
        vertexArray,
        mass,
        arrayToVec3Source(velocity),
        arrayToVec3Source(angularVelocity)
      );
      body.userData = body.userData || {};
      body.userData.id = fragmentId;
      body.userData.role = 'fragment';
      body.userData.isFragment = true;
      debris.push(body);
    }

    self.physicsInstance.clearDebris(debris);
    
    break;
  }
  }
};
