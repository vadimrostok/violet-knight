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
  getScene,
  getTarget
} from '../game/gameObjectsStore';
import audioInstance from '../game/audio';
import graphicsInstance from '../graphics/graphics';

class WorkerInterface {
  physicsWorker = new window.Worker('/lib/physics-worker.js');
  resolveInit = null
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
      this.physicsWorker.onmessage = function (e) {
        switch(e.data.task) {
        case 'ready':
          resolve();
          break;
        case 'update':
          const { x, y, z } = e.data.position;

          //console.log('update', e.data);

          if (e.data.role === 'agent') {
            const agent = getAgent();

            getCameraBallJoint().position.set(x, y, z);

            agent.position.set(x, y, z);
            agent.quaternion.set( ...e.data.quaternion );
          } else if (e.data.role === 'target') {
            const target = getTarget(e.data.id);
            //console.log('update target', target, x, y, z, ...e.data.quaternion);

            target.position.set(x, y, z);
            target.quaternion.set( ...e.data.quaternion );
          }

          break;
        // case 'update':
        //   break;
        }
      };
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
}

const workerInterfaceInstance = new WorkerInterface();

export default workerInterfaceInstance;
