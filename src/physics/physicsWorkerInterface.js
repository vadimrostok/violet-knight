import { Vector3 } from 'three';
import pick from 'lodash/pick';
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
  getFragment,
  getScene,
  getTarget,
  setFragment
} from '../game/gameObjectsStore';
import { vecToArray } from '../helpers';
import audioInstance from '../game/audio';
import graphicsInstance from '../graphics/graphics';

class PhysicsWorkerInterface {
  physicsWorker = new window.Worker('lib/physics-worker.compiled.js');
  resolveInit = null
  convexBreaker = new ConvexObjectBreaker()
  init() {
    this.physicsWorker.postMessage({ task: 'init', lib: {
      agentMass,
      agentRadius,
      boundingSphereRadius,
      debrisLifetimeMs,
      fractureImpulse,
      targetMass,
    }});

    return new Promise((resolve, reject) => {

      // Handle messages from worker:

      this.physicsWorker.onmessage = (e) => {
        switch(e.data.task) {
        case 'ready':
          resolve();
          break;

        case 'update':
          const { x, y, z } = e.data.position;

          if (e.data.role === 'agent') {
            const agent = getAgent();

            getCameraBallJoint().position.set(x, y, z);

            agent.position.set(x, y, z);
            agent.quaternion.set( ...e.data.quaternion );
          } else if (e.data.role === 'target') {
            const target = getTarget(e.data.id);

            target.position.set(x, y, z);
            target.quaternion.set( ...e.data.quaternion );
          } else if (e.data.role === 'fragment') {
            const fragment = getFragment(e.data.id);

            fragment.position.set(x, y, z);
            fragment.quaternion.set( ...e.data.quaternion );
          }

          break;

        case 'subdivideByImpact': {
          const { impactPoint, impactNormal, vel, angVel } = e.data;

          const debris = this.convexBreaker.subdivideByImpact(
            getTarget(e.data.id), new Vector3(...impactPoint), new Vector3(...impactNormal), 2, 2,
          );

          const numObjects = debris.length;
          const time = (new Date()).getTime();
          const fragments = [];
	  for ( let j = 0; j < numObjects; j ++ ) {
	    const fragment = debris[ j ];

	    fragment.userData.velocity.set(...vel);
	    fragment.userData.angularVelocity.set(...angVel);
            fragment.userData.id = time + '_' + j;

            getScene().add(fragment);
            setFragment(fragment.userData.id, fragment);

            fragments.push([
              fragment.userData.id,
              vecToArray(fragment.position),
              vecToArray(fragment.quaternion),
              fragment.geometry.attributes.position.array,
              fragment.userData.mass,
              vel,
              angVel,
            ]);
	  }

          this.addDepris(fragments);

          break;

        }

        case 'removeDebris': {
          const { debris } = e.data;

          for (const debreeIndex in debris) {
            const debrisItem = debris[debreeIndex];

            if (debrisItem.role === 'target') {
              getScene().remove(getTarget(debrisItem.id));
            } else if (debrisItem.role === 'fragment') {
              getScene().remove(getFragment(debrisItem.id));
            }
          }
          break;

        }

        case 'playAudio': {
          audioInstance.nextTarget();
          break;

        }

        }
      };
    });
  }

  // Send to worker methods:

  addDepris(fragments) {
    // [fragmentId, position, quaternion, vertexArray, mass, velocity, angularVelocity]
    this.physicsWorker.postMessage({
      task: 'createFragments',
      fragments,
    });
  }
  addTarget({ x, y, z }, quaternion, vertexArray, targetId) {
    this.physicsWorker.postMessage({
      task: 'addTarget',
      position: { x, y, z },
      quaternion: { x: quaternion.x, y: quaternion.y, z: quaternion.z, w: quaternion.w },
      vertexArray,
      targetId,
    });
  }
  setAgentPhysicsBody({ x, y, z }) {
    this.physicsWorker.postMessage({ task: 'setAgent', position: { x, y, z } });
  }
  punch({ x, y, z }) {
    this.physicsWorker.postMessage({ task: 'punch', vector: { x, y, z } });
  }
  freeze() {
    this.physicsWorker.postMessage({ task: 'freeze' });
  }
}

const workerInterfaceInstance = new PhysicsWorkerInterface();

export default workerInterfaceInstance;
