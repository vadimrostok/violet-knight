(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function arrayToVec3Source(arr) {
  var result = {
    x: arr[0],
    y: arr[1],
    z: arr[2]
  };

  if (arr[3]) {
    result.w = arr[3];
  }

  return result;
}

self.importScripts('/lib/ammo.2.js', '/node_modules/@babel/polyfill/dist/polyfill.min.js');

var Physics = /*#__PURE__*/function () {
  function Physics(_ref) {
    var _this = this;

    var agentRadius = _ref.agentRadius,
        agentMass = _ref.agentMass,
        boundingSphereRadius = _ref.boundingSphereRadius,
        fractureImpulse = _ref.fractureImpulse,
        debrisLifetimeMs = _ref.debrisLifetimeMs,
        targetMass = _ref.targetMass,
        postMessage = _ref.postMessage;

    _classCallCheck(this, Physics);

    _defineProperty(this, "dynamicBodies", null);

    _defineProperty(this, "collisionConfiguration", null);

    _defineProperty(this, "dispatcher", null);

    _defineProperty(this, "broadphase", null);

    _defineProperty(this, "solver", null);

    _defineProperty(this, "physicsWorld", null);

    _defineProperty(this, "transformAux", null);

    _defineProperty(this, "tempBtVec3_1", null);

    _defineProperty(this, "tempBtVec3_2", null);

    _defineProperty(this, "tempBtVec3_3", null);

    _defineProperty(this, "margin", 0);

    _defineProperty(this, "impactPoint", null);

    _defineProperty(this, "impactNormal", null);

    _defineProperty(this, "objectsToRemove", null);

    _defineProperty(this, "numObjectsToRemove", 0);

    _defineProperty(this, "agentBody", null);

    _defineProperty(this, "agentRadius", 0);

    _defineProperty(this, "agentMass", 0);

    _defineProperty(this, "targetMass", 0);

    _defineProperty(this, "boundingSphereRadius", 0);

    _defineProperty(this, "postMessage", null);

    _defineProperty(this, "deltaTime", new Date().getTime());

    _defineProperty(this, "loop", function () {
      if (self.requestAnimationFrame) {
        self.requestAnimationFrame(_this.loop);
      } else {
        setTimeout(_this.loop, 1000 / 60);
      } //setTimeout(this.loop, 100);


      var now = new Date().getTime();

      _this.update(now - _this.deltaTime);

      _this.deltaTime = now;
    });

    _defineProperty(this, "update", function (deltaTime) {
      _this.physicsWorld.stepSimulation(deltaTime * 5, 10); // this.physicsWorld.stepSimulation( deltaTime, 10 );
      // Update objects


      for (var i = 0, il = _this.dynamicBodies.length; i < il; i++) {
        var objPhys = _this.dynamicBodies[i];
        var motionState = objPhys.getMotionState();

        if (motionState) {
          motionState.getWorldTransform(_this.transformAux);

          var position = _this.transformAux.getOrigin();

          var quaternion = _this.transformAux.getRotation();

          var _ref2 = [position.x(), position.y(), position.z()],
              x = _ref2[0],
              y = _ref2[1],
              z = _ref2[2];

          if (objPhys.userData.isAgent) {
            if (Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2)) > _this.boundingSphereRadius) {
              _this.stopAgentAfterImpact();

              _this.transformAux.setOrigin(new self.Ammo.btVector3(objPhys.userData.prevPosition.x, objPhys.userData.prevPosition.y, objPhys.userData.prevPosition.z));

              _this.agentBody.setWorldTransform(_this.transformAux);

              continue;
            } else {
              objPhys.userData.prevPosition = {
                x: x,
                y: y,
                z: z
              };
            }
          } //console.log('post message', { x, y, z }, [quaternion.x(), quaternion.y(), quaternion.z(), quaternion.w()]);


          _this.postMessage({
            task: 'update',
            role: objPhys.userData.role,
            id: objPhys.userData.id,
            position: {
              x: x,
              y: y,
              z: z
            },
            quaternion: [quaternion.x(), quaternion.y(), quaternion.z(), quaternion.w()]
          });

          objPhys.userData.collided = false;
        }
      }

      _this.processCollisions();
    });

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

  _createClass(Physics, [{
    key: "init",
    value: function init() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        if (typeof self.Ammo === 'function') {
          self.Ammo().then(function (AmmoLib) {
            self.Ammo = self.Ammo = AmmoLib;
            _this2.transformAux = new self.Ammo.btTransform();
            _this2.tempBtVec3_1 = new self.Ammo.btVector3(0, 0, 0);
            _this2.tempBtVec3_2 = new self.Ammo.btVector3(0, 0, 0);
            _this2.tempBtVec3_3 = new self.Ammo.btVector3(0, 0, 0);

            _this2.initPhysics();

            resolve();
          });
        } else {
          _this2.initPhysics();

          resolve();
        }
      });
    }
  }, {
    key: "initPhysics",
    value: function initPhysics() {
      // Physics configuration
      this.collisionConfiguration = new self.Ammo.btDefaultCollisionConfiguration();
      this.dispatcher = new self.Ammo.btCollisionDispatcher(this.collisionConfiguration);
      this.broadphase = new self.Ammo.btDbvtBroadphase();
      this.solver = new self.Ammo.btSequentialImpulseConstraintSolver();
      this.physicsWorld = new self.Ammo.btDiscreteDynamicsWorld(this.dispatcher, this.broadphase, this.solver, this.collisionConfiguration); // Gravity will be set dynamically, depending on camera position.

      this.physicsWorld.setGravity(new self.Ammo.btVector3(0, 0, 0));
      this.startLoop();
    }
  }, {
    key: "startLoop",
    value: function startLoop() {
      this.loop();
    }
  }, {
    key: "setAgentPhysicsBody",
    value: function setAgentPhysicsBody(_ref3) {
      var x = _ref3.x,
          y = _ref3.y,
          z = _ref3.z;
      var shape = new self.Ammo.btSphereShape(this.agentRadius);
      shape.setMargin(this.margin);
      var localInertia = new self.Ammo.btVector3(0, 0, 0);
      shape.calculateLocalInertia(this.agentMass, localInertia);
      var transform = new self.Ammo.btTransform();
      transform.setIdentity();
      transform.setOrigin(new self.Ammo.btVector3(x, y, z));
      var motionState = new self.Ammo.btDefaultMotionState(transform);
      var rbInfo = new self.Ammo.btRigidBodyConstructionInfo(this.agentMass, motionState, shape, localInertia);
      var body = new self.Ammo.btRigidBody(rbInfo);
      body.setActivationState(4);
      body.userData = body.userData || {};
      body.userData.isAgent = true;
      body.userData.role = 'agent';
      body.userData.id = 'agent';
      body.userData.collided = false;
      this.dynamicBodies.push(body);
      this.agentBody = body;
      this.physicsWorld.addRigidBody(body);
    }
  }, {
    key: "addTarget",
    value: function addTarget(position, quaternion, vertexArray, targetId) {
      var targetBody = this.createBreakableObject(position, quaternion, vertexArray, this.targetMass);
      targetBody.userData = targetBody.userData || {};
      targetBody.userData.isTarget = true;
      targetBody.userData.role = 'target';
      targetBody.userData.id = targetId;
      targetBody.userData.breakable = true;
    }
  }, {
    key: "createBreakableObject",
    value: function createBreakableObject(position, quaternion, vertexArray, mass, velocity, angularVelocity) {
      var shape = this.createConvexHullPhysicsShape(vertexArray);
      shape.setMargin(this.margin);
      var body = this.createRigidBody(shape, mass, position, quaternion, velocity, angularVelocity);
      return body;
    }
  }, {
    key: "createConvexHullPhysicsShape",
    value: function createConvexHullPhysicsShape(coords) {
      var shape = new self.Ammo.btConvexHullShape();

      for (var i = 0, il = coords.length; i < il; i += 3) {
        this.tempBtVec3_1.setValue(coords[i], coords[i + 1], coords[i + 2]);
        var lastOne = i >= il - 3;
        shape.addPoint(this.tempBtVec3_1, lastOne);
      }

      return shape;
    }
  }, {
    key: "createTrianglePhysicsShape",
    value: function createTrianglePhysicsShape(coords) {
      var mesh = new self.Ammo.btTriangleMesh();

      for (var i = 0, il = coords.length; i < il; i += 9) {
        this.tempBtVec3_1.setValue(coords[i], coords[i + 1], coords[i + 2]);
        this.tempBtVec3_2.setValue(coords[i + 3], coords[i + 4], coords[i + 5]);
        this.tempBtVec3_3.setValue(coords[i + 6], coords[i + 7], coords[i + 8]); //const lastOne = ( i >= ( il - 3 ) );

        mesh.addTriangle(this.tempBtVec3_1, this.tempBtVec3_2, this.tempBtVec3_3);
      }

      var shape = new self.Ammo.btBvhTriangleMeshShape(mesh);
      return shape;
    }
  }, {
    key: "createRigidBody",
    value: function createRigidBody(physicsShape, mass, pos, quat, vel, angVel) {
      var transform = new self.Ammo.btTransform();
      transform.setIdentity();
      transform.setOrigin(new self.Ammo.btVector3(pos.x, pos.y, pos.z));
      transform.setRotation(new self.Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
      var motionState = new self.Ammo.btDefaultMotionState(transform);
      var localInertia = new self.Ammo.btVector3(0, 0, 0);
      physicsShape.calculateLocalInertia(mass, localInertia);
      var rbInfo = new self.Ammo.btRigidBodyConstructionInfo(mass, motionState, physicsShape, localInertia);
      var body = new self.Ammo.btRigidBody(rbInfo);
      body.setRestitution(1);

      if (vel) {
        body.setLinearVelocity(new self.Ammo.btVector3(vel.x, vel.y, vel.z));
      }

      if (angVel) {
        body.setAngularVelocity(new self.Ammo.btVector3(angVel.x, angVel.y, angVel.z));
      }

      body.userData = body.userData || {};
      body.userData.collided = false; // FIXME:
      // getScene().add( object );

      if (mass > 0) {
        this.dynamicBodies.push(body); // Disable deactivation

        body.setActivationState(4);
      }

      this.physicsWorld.addRigidBody(body);
      return body;
    }
  }, {
    key: "processCollisions",
    value: function processCollisions() {
      for (var _i = 0, il = this.dispatcher.getNumManifolds(); _i < il; _i++) {
        var contactManifold = this.dispatcher.getManifoldByIndexInternal(_i);
        var rb0 = self.Ammo.castObject(contactManifold.getBody0(), self.Ammo.btRigidBody);
        var rb1 = self.Ammo.castObject(contactManifold.getBody1(), self.Ammo.btRigidBody);
        var userData0 = rb0.userData || null;
        var userData1 = rb1.userData || null;

        if (!userData0 || !userData1) {
          continue;
        }

        var breakable0 = userData0 ? userData0.breakable : false;
        var breakable1 = userData1 ? userData1.breakable : false;
        var collided0 = userData0 ? userData0.collided : false;
        var collided1 = userData1 ? userData1.collided : false; // console.log(breakable0, breakable1, collided0, collided1);

        if (!breakable0 && !breakable1 || collided0 && collided1) {
          continue;
        }

        var contact = false;
        var maxImpulse = 0;

        for (var j = 0, jl = contactManifold.getNumContacts(); j < jl; j++) {
          var contactPoint = contactManifold.getContactPoint(j); // console.log('contactPoint.getDistance()', contactPoint.getDistance());

          if (contactPoint.getDistance() < 0.1) {
            contact = true;
            var impulse = contactPoint.getAppliedImpulse(); // console.log('contact', impulse);

            if (impulse > maxImpulse) {
              maxImpulse = impulse;
              var pos = contactPoint.get_m_positionWorldOnB();
              var normal = contactPoint.get_m_normalWorldOnB();
              this.impactPoint = {
                x: pos.x(),
                y: pos.y(),
                z: pos.z()
              };
              this.impactNormal = {
                x: normal.x(),
                y: normal.y(),
                z: normal.z()
              };
            } // break;

          }
        }

        if (userData0.isAgent) {
          rb0.setAngularVelocity(new self.Ammo.btVector3(0, 0, 0));
        } else if (userData1.isAgent) {
          rb1.setAngularVelocity(new self.Ammo.btVector3(0, 0, 0));
        } // If no point has contact, abort


        if (!contact || this.impactPoint.x === 0 && this.impactPoint.y === 0 && this.impactPoint.z === 0) continue; // console.log(maxImpulse);

        var obj0breaks = breakable0 && userData1.isAgent && !collided0 && maxImpulse > this.fractureImpulse;
        var obj1breaks = breakable1 && userData0.isAgent && !collided1 && maxImpulse > this.fractureImpulse; // Subdivision

        if (obj0breaks || obj1breaks) {
          var debris = void 0;

          if (obj0breaks) {
            var vel = rb0.getLinearVelocity();
            var angVel = rb0.getAngularVelocity();
            this.postMessage({
              task: 'subdivideByImpact',
              impactPoint: [this.impactPoint.x, this.impactPoint.y, this.impactPoint.z],
              impactNormal: [this.impactNormal.x, this.impactNormal.y, this.impactNormal.z],
              role: rb0.userData.role,
              id: rb0.userData.id,
              vel: [vel.x(), vel.y(), vel.z()],
              angVel: [angVel.x(), angVel.y(), angVel.z()]
            });
            this.objectsToRemove[this.numObjectsToRemove++] = rb0;
            userData0.collided = true;
          }

          if (obj1breaks) {
            var _vel = rb1.getLinearVelocity();

            var _angVel = rb1.getAngularVelocity();

            this.postMessage({
              task: 'subdivideByImpact',
              impactPoint: [this.impactPoint.x, this.impactPoint.y, this.impactPoint.z],
              impactNormal: [this.impactNormal.x, this.impactNormal.y, this.impactNormal.z],
              role: rb1.userData.role,
              id: rb1.userData.id,
              vel: [_vel.x(), _vel.y(), _vel.z()],
              angVel: [_angVel.x(), _angVel.y(), _angVel.z()]
            });
            this.objectsToRemove[this.numObjectsToRemove++] = rb1;
            userData1.collided = true;
          }

          if (userData0 && userData0.isTarget || userData1 && userData1.isTarget) {
            this.stopAgentAfterImpact(); // const target = userData0.isTarget ? rb0 : rb1;

            var targetUserData = userData0.isTarget ? userData0 : userData1;

            if (targetUserData.wasHit !== true) {
              this.postMessage({
                task: 'playAudio'
              });
              targetUserData.wasHit = true;
            }
          }
        } //  else { // bounce
        //   if (rb0.userData.isAgent) {
        //     this.stopBodyAfterImpact(rb1);
        //   } else if (rb1.userData.isAgent) {
        //     this.stopBodyAfterImpact(rb0);
        //   }
        // }

      }

      if (this.numObjectsToRemove) {
        this.postMessage({
          task: 'removeDebris',
          debris: this.objectsToRemove.map(function (_ref4) {
            var _ref4$userData = _ref4.userData,
                role = _ref4$userData.role,
                id = _ref4$userData.id;
            return {
              role: role,
              id: id
            };
          })
        });

        for (var i = 0; i < this.numObjectsToRemove; i++) {
          this.physicsWorld.removeRigidBody(this.objectsToRemove[i]);
        }

        this.numObjectsToRemove = 0;
      }
    }
  }, {
    key: "clearDebris",
    value: function clearDebris(debris) {
      var _this3 = this;

      setTimeout(function () {
        _this3.postMessage({
          task: 'removeDebris',
          debris: debris.map(function (_ref5) {
            var _ref5$userData = _ref5.userData,
                role = _ref5$userData.role,
                id = _ref5$userData.id;
            return {
              role: role,
              id: id
            };
          })
        });

        for (var debreeIndex in debris) {
          _this3.physicsWorld.removeRigidBody(debris[debreeIndex]);
        }
      }, this.debrisLifetimeMs);
    }
  }, {
    key: "stopAgentAfterImpact",
    value: function stopAgentAfterImpact() {
      this.agentBody.setLinearVelocity(new self.Ammo.btVector3(0, 0, 0));
    }
  }, {
    key: "stopBodyAfterImpact",
    value: function stopBodyAfterImpact(body) {// console.log('stopBodyAfterImpact', body);
      // body.setLinearVelocity(new self.Ammo.btVector3( 0, 0, 0 ));
      // body.setMassProps(0, 0);
    }
  }]);

  return Physics;
}();

self.physicsInstance = 'dummy';

self.onmessage = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(e) {
    var _e$data$lib, agentRadius, agentMass, boundingSphereRadius, fractureImpulse, debrisLifetimeMs, targetMass, position, _e$data$vector, x, y, z, _e$data, _position, quaternion, vertexArray, targetId, fragments, numObjects, debris, j, _fragments$j, fragmentId, _position2, _quaternion, _vertexArray, mass, velocity, angularVelocity, body;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.t0 = e.data.task;
            _context.next = _context.t0 === 'init' ? 3 : _context.t0 === 'setAgent' ? 9 : _context.t0 === 'punch' ? 12 : _context.t0 === 'addTarget' ? 15 : _context.t0 === 'freeze' ? 18 : _context.t0 === 'createFragments' ? 20 : 26;
            break;

          case 3:
            _e$data$lib = e.data.lib, agentRadius = _e$data$lib.agentRadius, agentMass = _e$data$lib.agentMass, boundingSphereRadius = _e$data$lib.boundingSphereRadius, fractureImpulse = _e$data$lib.fractureImpulse, debrisLifetimeMs = _e$data$lib.debrisLifetimeMs, targetMass = _e$data$lib.targetMass;
            self.physicsInstance = new Physics({
              agentRadius: agentRadius,
              agentMass: agentMass,
              boundingSphereRadius: boundingSphereRadius,
              fractureImpulse: fractureImpulse,
              debrisLifetimeMs: debrisLifetimeMs,
              targetMass: targetMass,
              postMessage: function postMessage(message) {
                self.postMessage(message);
              }
            });
            _context.next = 7;
            return self.physicsInstance.init();

          case 7:
            self.postMessage({
              task: 'ready'
            });
            return _context.abrupt("break", 26);

          case 9:
            position = e.data.position;
            self.physicsInstance.setAgentPhysicsBody(position);
            return _context.abrupt("break", 26);

          case 12:
            _e$data$vector = e.data.vector, x = _e$data$vector.x, y = _e$data$vector.y, z = _e$data$vector.z;
            self.physicsInstance.agentBody.applyForce(new self.Ammo.btVector3(x, y, z));
            return _context.abrupt("break", 26);

          case 15:
            _e$data = e.data, _position = _e$data.position, quaternion = _e$data.quaternion, vertexArray = _e$data.vertexArray, targetId = _e$data.targetId;
            self.physicsInstance.addTarget(_position, quaternion, vertexArray, targetId);
            return _context.abrupt("break", 26);

          case 18:
            self.physicsInstance.stopAgentAfterImpact();
            return _context.abrupt("break", 26);

          case 20:
            fragments = e.data.fragments;
            numObjects = fragments.length;
            debris = [];

            for (j = 0; j < numObjects; j++) {
              _fragments$j = _slicedToArray(fragments[j], 7), fragmentId = _fragments$j[0], _position2 = _fragments$j[1], _quaternion = _fragments$j[2], _vertexArray = _fragments$j[3], mass = _fragments$j[4], velocity = _fragments$j[5], angularVelocity = _fragments$j[6];
              body = self.physicsInstance.createBreakableObject(arrayToVec3Source(_position2), arrayToVec3Source(_quaternion), _vertexArray, mass, arrayToVec3Source(velocity), arrayToVec3Source(angularVelocity));
              body.userData = body.userData || {};
              body.userData.id = fragmentId;
              body.userData.role = 'fragment';
              body.userData.isFragment = true;
              debris.push(body);
            }

            self.physicsInstance.clearDebris(debris);
            return _context.abrupt("break", 26);

          case 26:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref6.apply(this, arguments);
  };
}();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvcGh5c2ljcy13b3JrZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBLFNBQVMsaUJBQVQsQ0FBMkIsR0FBM0IsRUFBZ0M7QUFDOUIsTUFBTSxNQUFNLEdBQUc7QUFBQyxJQUFBLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBRCxDQUFQO0FBQVksSUFBQSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUQsQ0FBbEI7QUFBdUIsSUFBQSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUQ7QUFBN0IsR0FBZjs7QUFDQSxNQUFJLEdBQUcsQ0FBQyxDQUFELENBQVAsRUFBWTtBQUNWLElBQUEsTUFBTSxDQUFDLENBQVAsR0FBVyxHQUFHLENBQUMsQ0FBRCxDQUFkO0FBQ0Q7O0FBQ0QsU0FBTyxNQUFQO0FBQ0Q7O0FBRUQsSUFBSSxDQUFDLGFBQUwsQ0FDRSxnQkFERixFQUVFLG9EQUZGOztJQUtNLE87QUFzQkoseUJBR0c7QUFBQTs7QUFBQSxRQUZELFdBRUMsUUFGRCxXQUVDO0FBQUEsUUFGWSxTQUVaLFFBRlksU0FFWjtBQUFBLFFBRnVCLG9CQUV2QixRQUZ1QixvQkFFdkI7QUFBQSxRQUY2QyxlQUU3QyxRQUY2QyxlQUU3QztBQUFBLFFBRjhELGdCQUU5RCxRQUY4RCxnQkFFOUQ7QUFBQSxRQUZnRixVQUVoRixRQUZnRixVQUVoRjtBQUFBLFFBREQsV0FDQyxRQURELFdBQ0M7O0FBQUE7O0FBQUEsMkNBeEJhLElBd0JiOztBQUFBLG9EQXZCc0IsSUF1QnRCOztBQUFBLHdDQXRCVSxJQXNCVjs7QUFBQSx3Q0FyQlUsSUFxQlY7O0FBQUEsb0NBcEJNLElBb0JOOztBQUFBLDBDQW5CWSxJQW1CWjs7QUFBQSwwQ0FsQlksSUFrQlo7O0FBQUEsMENBakJZLElBaUJaOztBQUFBLDBDQWhCWSxJQWdCWjs7QUFBQSwwQ0FmWSxJQWVaOztBQUFBLG9DQWRNLENBY047O0FBQUEseUNBYlcsSUFhWDs7QUFBQSwwQ0FaWSxJQVlaOztBQUFBLDZDQVhlLElBV2Y7O0FBQUEsZ0RBVmtCLENBVWxCOztBQUFBLHVDQVRTLElBU1Q7O0FBQUEseUNBUlcsQ0FRWDs7QUFBQSx1Q0FQUyxDQU9UOztBQUFBLHdDQU5VLENBTVY7O0FBQUEsa0RBTG9CLENBS3BCOztBQUFBLHlDQUpXLElBSVg7O0FBQUEsdUNBaURVLElBQUksSUFBSixFQUFELENBQVcsT0FBWCxFQWpEVDs7QUFBQSxrQ0FrREksWUFBTTtBQUNYLFVBQUksSUFBSSxDQUFDLHFCQUFULEVBQWdDO0FBQzlCLFFBQUEsSUFBSSxDQUFDLHFCQUFMLENBQTJCLEtBQUksQ0FBQyxJQUFoQztBQUNELE9BRkQsTUFFTztBQUNMLFFBQUEsVUFBVSxDQUFDLEtBQUksQ0FBQyxJQUFOLEVBQVksT0FBSyxFQUFqQixDQUFWO0FBQ0QsT0FMVSxDQU9YOzs7QUFFQSxVQUFNLEdBQUcsR0FBSSxJQUFJLElBQUosRUFBRCxDQUFXLE9BQVgsRUFBWjs7QUFFQSxNQUFBLEtBQUksQ0FBQyxNQUFMLENBQVksR0FBRyxHQUFHLEtBQUksQ0FBQyxTQUF2Qjs7QUFDQSxNQUFBLEtBQUksQ0FBQyxTQUFMLEdBQWlCLEdBQWpCO0FBQ0QsS0EvREU7O0FBQUEsb0NBdUxNLFVBQUUsU0FBRixFQUFpQjtBQUV4QixNQUFBLEtBQUksQ0FBQyxZQUFMLENBQWtCLGNBQWxCLENBQWtDLFNBQVMsR0FBQyxDQUE1QyxFQUErQyxFQUEvQyxFQUZ3QixDQUd4QjtBQUVBOzs7QUFDQSxXQUFNLElBQUksQ0FBQyxHQUFHLENBQVIsRUFBVyxFQUFFLEdBQUcsS0FBSSxDQUFDLGFBQUwsQ0FBbUIsTUFBekMsRUFBaUQsQ0FBQyxHQUFHLEVBQXJELEVBQXlELENBQUMsRUFBMUQsRUFBZ0U7QUFFOUQsWUFBTSxPQUFPLEdBQUcsS0FBSSxDQUFDLGFBQUwsQ0FBb0IsQ0FBcEIsQ0FBaEI7QUFDQSxZQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsY0FBUixFQUFwQjs7QUFFQSxZQUFJLFdBQUosRUFBaUI7QUFDZixVQUFBLFdBQVcsQ0FBQyxpQkFBWixDQUErQixLQUFJLENBQUMsWUFBcEM7O0FBRUEsY0FBTSxRQUFRLEdBQUcsS0FBSSxDQUFDLFlBQUwsQ0FBa0IsU0FBbEIsRUFBakI7O0FBQ0EsY0FBTSxVQUFVLEdBQUcsS0FBSSxDQUFDLFlBQUwsQ0FBa0IsV0FBbEIsRUFBbkI7O0FBSmUsc0JBTUssQ0FBQyxRQUFRLENBQUMsQ0FBVCxFQUFELEVBQWUsUUFBUSxDQUFDLENBQVQsRUFBZixFQUE2QixRQUFRLENBQUMsQ0FBVCxFQUE3QixDQU5MO0FBQUEsY0FNUCxDQU5PO0FBQUEsY0FNSixDQU5JO0FBQUEsY0FNRCxDQU5DOztBQVFmLGNBQUksT0FBTyxDQUFDLFFBQVIsQ0FBaUIsT0FBckIsRUFBOEI7QUFDNUIsZ0JBQUksSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxDQUFaLElBQWlCLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVCxFQUFZLENBQVosQ0FBakIsR0FBa0MsSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFULEVBQVksQ0FBWixDQUE1QyxJQUE4RCxLQUFJLENBQUMsb0JBQXZFLEVBQTZGO0FBQzNGLGNBQUEsS0FBSSxDQUFDLG9CQUFMOztBQUNBLGNBQUEsS0FBSSxDQUFDLFlBQUwsQ0FBa0IsU0FBbEIsQ0FBNEIsSUFBSSxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQWQsQ0FDMUIsT0FBTyxDQUFDLFFBQVIsQ0FBaUIsWUFBakIsQ0FBOEIsQ0FESixFQUUxQixPQUFPLENBQUMsUUFBUixDQUFpQixZQUFqQixDQUE4QixDQUZKLEVBRzFCLE9BQU8sQ0FBQyxRQUFSLENBQWlCLFlBQWpCLENBQThCLENBSEosQ0FBNUI7O0FBS0EsY0FBQSxLQUFJLENBQUMsU0FBTCxDQUFlLGlCQUFmLENBQWlDLEtBQUksQ0FBQyxZQUF0Qzs7QUFDQTtBQUNELGFBVEQsTUFTTztBQUNMLGNBQUEsT0FBTyxDQUFDLFFBQVIsQ0FBaUIsWUFBakIsR0FBZ0M7QUFBRSxnQkFBQSxDQUFDLEVBQUQsQ0FBRjtBQUFLLGdCQUFBLENBQUMsRUFBRCxDQUFMO0FBQVEsZ0JBQUEsQ0FBQyxFQUFEO0FBQVIsZUFBaEM7QUFDRDtBQUNGLFdBckJjLENBdUJmOzs7QUFDQSxVQUFBLEtBQUksQ0FBQyxXQUFMLENBQWlCO0FBQ2YsWUFBQSxJQUFJLEVBQUUsUUFEUztBQUVmLFlBQUEsSUFBSSxFQUFFLE9BQU8sQ0FBQyxRQUFSLENBQWlCLElBRlI7QUFHZixZQUFBLEVBQUUsRUFBRSxPQUFPLENBQUMsUUFBUixDQUFpQixFQUhOO0FBSWYsWUFBQSxRQUFRLEVBQUU7QUFBRSxjQUFBLENBQUMsRUFBRCxDQUFGO0FBQUssY0FBQSxDQUFDLEVBQUQsQ0FBTDtBQUFRLGNBQUEsQ0FBQyxFQUFEO0FBQVIsYUFKSztBQUtmLFlBQUEsVUFBVSxFQUFFLENBQUMsVUFBVSxDQUFDLENBQVgsRUFBRCxFQUFpQixVQUFVLENBQUMsQ0FBWCxFQUFqQixFQUFpQyxVQUFVLENBQUMsQ0FBWCxFQUFqQyxFQUFpRCxVQUFVLENBQUMsQ0FBWCxFQUFqRDtBQUxHLFdBQWpCOztBQVFBLFVBQUEsT0FBTyxDQUFDLFFBQVIsQ0FBaUIsUUFBakIsR0FBNEIsS0FBNUI7QUFDRDtBQUNGOztBQUVELE1BQUEsS0FBSSxDQUFDLGlCQUFMO0FBQ0QsS0F2T0U7O0FBQ0QsU0FBSyxXQUFMLEdBQW1CLFdBQW5CO0FBQ0EsU0FBSyxTQUFMLEdBQWlCLFNBQWpCO0FBQ0EsU0FBSyxvQkFBTCxHQUE0QixvQkFBNUI7QUFDQSxTQUFLLGVBQUwsR0FBdUIsZUFBdkI7QUFDQSxTQUFLLGdCQUFMLEdBQXdCLGdCQUF4QjtBQUNBLFNBQUssVUFBTCxHQUFrQixVQUFsQjtBQUNBLFNBQUssV0FBTCxHQUFtQixXQUFuQjtBQUNBLFNBQUssZUFBTCxHQUF1QixFQUF2QjtBQUNBLFNBQUssYUFBTCxHQUFxQixFQUFyQjtBQUNEOzs7OzJCQUNNO0FBQUE7O0FBQ0wsYUFBTyxJQUFJLE9BQUosQ0FBWSxVQUFDLE9BQUQsRUFBVSxNQUFWLEVBQXFCO0FBQ3RDLFlBQUksT0FBTyxJQUFJLENBQUMsSUFBWixLQUFxQixVQUF6QixFQUFxQztBQUNuQyxVQUFBLElBQUksQ0FBQyxJQUFMLEdBQVksSUFBWixDQUFpQixVQUFFLE9BQUYsRUFBZTtBQUM5QixZQUFBLElBQUksQ0FBQyxJQUFMLEdBQVksSUFBSSxDQUFDLElBQUwsR0FBWSxPQUF4QjtBQUNBLFlBQUEsTUFBSSxDQUFDLFlBQUwsR0FBb0IsSUFBSSxJQUFJLENBQUMsSUFBTCxDQUFVLFdBQWQsRUFBcEI7QUFDQSxZQUFBLE1BQUksQ0FBQyxZQUFMLEdBQW9CLElBQUksSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFkLENBQXdCLENBQXhCLEVBQTBCLENBQTFCLEVBQTRCLENBQTVCLENBQXBCO0FBQ0EsWUFBQSxNQUFJLENBQUMsWUFBTCxHQUFvQixJQUFJLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBZCxDQUF3QixDQUF4QixFQUEwQixDQUExQixFQUE0QixDQUE1QixDQUFwQjtBQUNBLFlBQUEsTUFBSSxDQUFDLFlBQUwsR0FBb0IsSUFBSSxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQWQsQ0FBd0IsQ0FBeEIsRUFBMEIsQ0FBMUIsRUFBNEIsQ0FBNUIsQ0FBcEI7O0FBQ0EsWUFBQSxNQUFJLENBQUMsV0FBTDs7QUFDQSxZQUFBLE9BQU87QUFDUixXQVJEO0FBU0QsU0FWRCxNQVVPO0FBQ0wsVUFBQSxNQUFJLENBQUMsV0FBTDs7QUFDQSxVQUFBLE9BQU87QUFDUjtBQUNGLE9BZk0sQ0FBUDtBQWdCRDs7O2tDQUNhO0FBQ1o7QUFDQSxXQUFLLHNCQUFMLEdBQThCLElBQUksSUFBSSxDQUFDLElBQUwsQ0FBVSwrQkFBZCxFQUE5QjtBQUNBLFdBQUssVUFBTCxHQUFrQixJQUFJLElBQUksQ0FBQyxJQUFMLENBQVUscUJBQWQsQ0FBcUMsS0FBSyxzQkFBMUMsQ0FBbEI7QUFDQSxXQUFLLFVBQUwsR0FBa0IsSUFBSSxJQUFJLENBQUMsSUFBTCxDQUFVLGdCQUFkLEVBQWxCO0FBQ0EsV0FBSyxNQUFMLEdBQWMsSUFBSSxJQUFJLENBQUMsSUFBTCxDQUFVLG1DQUFkLEVBQWQ7QUFDQSxXQUFLLFlBQUwsR0FBb0IsSUFBSSxJQUFJLENBQUMsSUFBTCxDQUFVLHVCQUFkLENBQ2xCLEtBQUssVUFEYSxFQUVsQixLQUFLLFVBRmEsRUFHbEIsS0FBSyxNQUhhLEVBSWxCLEtBQUssc0JBSmEsQ0FBcEIsQ0FOWSxDQVlaOztBQUNBLFdBQUssWUFBTCxDQUFrQixVQUFsQixDQUE2QixJQUFJLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBZCxDQUF5QixDQUF6QixFQUE0QixDQUE1QixFQUErQixDQUEvQixDQUE3QjtBQUVBLFdBQUssU0FBTDtBQUNEOzs7Z0NBQ1c7QUFDVixXQUFLLElBQUw7QUFDRDs7OytDQWdCZ0M7QUFBQSxVQUFYLENBQVcsU0FBWCxDQUFXO0FBQUEsVUFBUixDQUFRLFNBQVIsQ0FBUTtBQUFBLFVBQUwsQ0FBSyxTQUFMLENBQUs7QUFDL0IsVUFBTSxLQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBTCxDQUFVLGFBQWQsQ0FBNkIsS0FBSyxXQUFsQyxDQUFkO0FBRUEsTUFBQSxLQUFLLENBQUMsU0FBTixDQUFpQixLQUFLLE1BQXRCO0FBRUEsVUFBTSxZQUFZLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQWQsQ0FBeUIsQ0FBekIsRUFBNEIsQ0FBNUIsRUFBK0IsQ0FBL0IsQ0FBckI7QUFFQSxNQUFBLEtBQUssQ0FBQyxxQkFBTixDQUE2QixLQUFLLFNBQWxDLEVBQTZDLFlBQTdDO0FBRUEsVUFBTSxTQUFTLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBTCxDQUFVLFdBQWQsRUFBbEI7QUFFQSxNQUFBLFNBQVMsQ0FBQyxXQUFWO0FBRUEsTUFBQSxTQUFTLENBQUMsU0FBVixDQUFvQixJQUFJLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBZCxDQUF5QixDQUF6QixFQUE0QixDQUE1QixFQUErQixDQUEvQixDQUFwQjtBQUVBLFVBQU0sV0FBVyxHQUFHLElBQUksSUFBSSxDQUFDLElBQUwsQ0FBVSxvQkFBZCxDQUFtQyxTQUFuQyxDQUFwQjtBQUNBLFVBQU0sTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUwsQ0FBVSwyQkFBZCxDQUEyQyxLQUFLLFNBQWhELEVBQTJELFdBQTNELEVBQXdFLEtBQXhFLEVBQStFLFlBQS9FLENBQWY7QUFDQSxVQUFNLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFMLENBQVUsV0FBZCxDQUEyQixNQUEzQixDQUFiO0FBRUEsTUFBQSxJQUFJLENBQUMsa0JBQUwsQ0FBd0IsQ0FBeEI7QUFFQSxNQUFBLElBQUksQ0FBQyxRQUFMLEdBQWdCLElBQUksQ0FBQyxRQUFMLElBQWlCLEVBQWpDO0FBQ0EsTUFBQSxJQUFJLENBQUMsUUFBTCxDQUFjLE9BQWQsR0FBd0IsSUFBeEI7QUFDQSxNQUFBLElBQUksQ0FBQyxRQUFMLENBQWMsSUFBZCxHQUFxQixPQUFyQjtBQUNBLE1BQUEsSUFBSSxDQUFDLFFBQUwsQ0FBYyxFQUFkLEdBQW1CLE9BQW5CO0FBQ0EsTUFBQSxJQUFJLENBQUMsUUFBTCxDQUFjLFFBQWQsR0FBeUIsS0FBekI7QUFFQSxXQUFLLGFBQUwsQ0FBbUIsSUFBbkIsQ0FBd0IsSUFBeEI7QUFDQSxXQUFLLFNBQUwsR0FBaUIsSUFBakI7QUFFQSxXQUFLLFlBQUwsQ0FBa0IsWUFBbEIsQ0FBZ0MsSUFBaEM7QUFDRDs7OzhCQUVTLFEsRUFBVSxVLEVBQVksVyxFQUFhLFEsRUFBVTtBQUNyRCxVQUFNLFVBQVUsR0FBRyxLQUFLLHFCQUFMLENBQTRCLFFBQTVCLEVBQXNDLFVBQXRDLEVBQWtELFdBQWxELEVBQStELEtBQUssVUFBcEUsQ0FBbkI7QUFFQSxNQUFBLFVBQVUsQ0FBQyxRQUFYLEdBQXNCLFVBQVUsQ0FBQyxRQUFYLElBQXVCLEVBQTdDO0FBQ0EsTUFBQSxVQUFVLENBQUMsUUFBWCxDQUFvQixRQUFwQixHQUErQixJQUEvQjtBQUNBLE1BQUEsVUFBVSxDQUFDLFFBQVgsQ0FBb0IsSUFBcEIsR0FBMkIsUUFBM0I7QUFDQSxNQUFBLFVBQVUsQ0FBQyxRQUFYLENBQW9CLEVBQXBCLEdBQXlCLFFBQXpCO0FBQ0EsTUFBQSxVQUFVLENBQUMsUUFBWCxDQUFvQixTQUFwQixHQUFnQyxJQUFoQztBQUNEOzs7MENBRXFCLFEsRUFBVSxVLEVBQVksVyxFQUFhLEksRUFBTSxRLEVBQVUsZSxFQUFpQjtBQUN4RixVQUFNLEtBQUssR0FBRyxLQUFLLDRCQUFMLENBQW1DLFdBQW5DLENBQWQ7QUFDQSxNQUFBLEtBQUssQ0FBQyxTQUFOLENBQWlCLEtBQUssTUFBdEI7QUFFQSxVQUFNLElBQUksR0FBRyxLQUFLLGVBQUwsQ0FBc0IsS0FBdEIsRUFBNkIsSUFBN0IsRUFBbUMsUUFBbkMsRUFBNkMsVUFBN0MsRUFBeUQsUUFBekQsRUFBbUUsZUFBbkUsQ0FBYjtBQUVBLGFBQU8sSUFBUDtBQUNEOzs7aURBRTZCLE0sRUFBUztBQUNyQyxVQUFNLEtBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFMLENBQVUsaUJBQWQsRUFBZDs7QUFFQSxXQUFNLElBQUksQ0FBQyxHQUFHLENBQVIsRUFBVyxFQUFFLEdBQUcsTUFBTSxDQUFDLE1BQTdCLEVBQXFDLENBQUMsR0FBRyxFQUF6QyxFQUE2QyxDQUFDLElBQUksQ0FBbEQsRUFBc0Q7QUFDcEQsYUFBSyxZQUFMLENBQWtCLFFBQWxCLENBQTRCLE1BQU0sQ0FBRSxDQUFGLENBQWxDLEVBQXlDLE1BQU0sQ0FBRSxDQUFDLEdBQUcsQ0FBTixDQUEvQyxFQUEwRCxNQUFNLENBQUUsQ0FBQyxHQUFHLENBQU4sQ0FBaEU7QUFDQSxZQUFNLE9BQU8sR0FBSyxDQUFDLElBQU0sRUFBRSxHQUFHLENBQTlCO0FBQ0EsUUFBQSxLQUFLLENBQUMsUUFBTixDQUFnQixLQUFLLFlBQXJCLEVBQW1DLE9BQW5DO0FBQ0Q7O0FBRUQsYUFBTyxLQUFQO0FBQ0Q7OzsrQ0FFMkIsTSxFQUFTO0FBQ25DLFVBQU0sSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUwsQ0FBVSxjQUFkLEVBQWI7O0FBRUEsV0FBTSxJQUFJLENBQUMsR0FBRyxDQUFSLEVBQVcsRUFBRSxHQUFHLE1BQU0sQ0FBQyxNQUE3QixFQUFxQyxDQUFDLEdBQUcsRUFBekMsRUFBNkMsQ0FBQyxJQUFJLENBQWxELEVBQXNEO0FBQ3BELGFBQUssWUFBTCxDQUFrQixRQUFsQixDQUE0QixNQUFNLENBQUUsQ0FBRixDQUFsQyxFQUF5QyxNQUFNLENBQUUsQ0FBQyxHQUFHLENBQU4sQ0FBL0MsRUFBMEQsTUFBTSxDQUFFLENBQUMsR0FBRyxDQUFOLENBQWhFO0FBQ0EsYUFBSyxZQUFMLENBQWtCLFFBQWxCLENBQTRCLE1BQU0sQ0FBRSxDQUFDLEdBQUcsQ0FBTixDQUFsQyxFQUE2QyxNQUFNLENBQUUsQ0FBQyxHQUFHLENBQU4sQ0FBbkQsRUFBOEQsTUFBTSxDQUFFLENBQUMsR0FBRyxDQUFOLENBQXBFO0FBQ0EsYUFBSyxZQUFMLENBQWtCLFFBQWxCLENBQTRCLE1BQU0sQ0FBRSxDQUFDLEdBQUcsQ0FBTixDQUFsQyxFQUE2QyxNQUFNLENBQUUsQ0FBQyxHQUFHLENBQU4sQ0FBbkQsRUFBOEQsTUFBTSxDQUFFLENBQUMsR0FBRyxDQUFOLENBQXBFLEVBSG9ELENBSXBEOztBQUNBLFFBQUEsSUFBSSxDQUFDLFdBQUwsQ0FBa0IsS0FBSyxZQUF2QixFQUFxQyxLQUFLLFlBQTFDLEVBQXdELEtBQUssWUFBN0Q7QUFDRDs7QUFFRCxVQUFNLEtBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFMLENBQVUsc0JBQWQsQ0FBcUMsSUFBckMsQ0FBZDtBQUVBLGFBQU8sS0FBUDtBQUNEOzs7b0NBRWdCLFksRUFBYyxJLEVBQU0sRyxFQUFLLEksRUFBTSxHLEVBQUssTSxFQUFTO0FBQzVELFVBQU0sU0FBUyxHQUFHLElBQUksSUFBSSxDQUFDLElBQUwsQ0FBVSxXQUFkLEVBQWxCO0FBQ0EsTUFBQSxTQUFTLENBQUMsV0FBVjtBQUNBLE1BQUEsU0FBUyxDQUFDLFNBQVYsQ0FBcUIsSUFBSSxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQWQsQ0FBeUIsR0FBRyxDQUFDLENBQTdCLEVBQWdDLEdBQUcsQ0FBQyxDQUFwQyxFQUF1QyxHQUFHLENBQUMsQ0FBM0MsQ0FBckI7QUFDQSxNQUFBLFNBQVMsQ0FBQyxXQUFWLENBQXVCLElBQUksSUFBSSxDQUFDLElBQUwsQ0FBVSxZQUFkLENBQTRCLElBQUksQ0FBQyxDQUFqQyxFQUFvQyxJQUFJLENBQUMsQ0FBekMsRUFBNEMsSUFBSSxDQUFDLENBQWpELEVBQW9ELElBQUksQ0FBQyxDQUF6RCxDQUF2QjtBQUNBLFVBQU0sV0FBVyxHQUFHLElBQUksSUFBSSxDQUFDLElBQUwsQ0FBVSxvQkFBZCxDQUFvQyxTQUFwQyxDQUFwQjtBQUVBLFVBQU0sWUFBWSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFkLENBQXlCLENBQXpCLEVBQTRCLENBQTVCLEVBQStCLENBQS9CLENBQXJCO0FBQ0EsTUFBQSxZQUFZLENBQUMscUJBQWIsQ0FBb0MsSUFBcEMsRUFBMEMsWUFBMUM7QUFFQSxVQUFNLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFMLENBQVUsMkJBQWQsQ0FBMkMsSUFBM0MsRUFBaUQsV0FBakQsRUFBOEQsWUFBOUQsRUFBNEUsWUFBNUUsQ0FBZjtBQUNBLFVBQU0sSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUwsQ0FBVSxXQUFkLENBQTJCLE1BQTNCLENBQWI7QUFFQSxNQUFBLElBQUksQ0FBQyxjQUFMLENBQW9CLENBQXBCOztBQUVBLFVBQUssR0FBTCxFQUFXO0FBQ1QsUUFBQSxJQUFJLENBQUMsaUJBQUwsQ0FBd0IsSUFBSSxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQWQsQ0FBeUIsR0FBRyxDQUFDLENBQTdCLEVBQWdDLEdBQUcsQ0FBQyxDQUFwQyxFQUF1QyxHQUFHLENBQUMsQ0FBM0MsQ0FBeEI7QUFDRDs7QUFDRCxVQUFLLE1BQUwsRUFBYztBQUNaLFFBQUEsSUFBSSxDQUFDLGtCQUFMLENBQXlCLElBQUksSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFkLENBQXlCLE1BQU0sQ0FBQyxDQUFoQyxFQUFtQyxNQUFNLENBQUMsQ0FBMUMsRUFBNkMsTUFBTSxDQUFDLENBQXBELENBQXpCO0FBQ0Q7O0FBRUQsTUFBQSxJQUFJLENBQUMsUUFBTCxHQUFnQixJQUFJLENBQUMsUUFBTCxJQUFpQixFQUFqQztBQUNBLE1BQUEsSUFBSSxDQUFDLFFBQUwsQ0FBYyxRQUFkLEdBQXlCLEtBQXpCLENBdkI0RCxDQXlCNUQ7QUFDQTs7QUFFQSxVQUFLLElBQUksR0FBRyxDQUFaLEVBQWdCO0FBQ2QsYUFBSyxhQUFMLENBQW1CLElBQW5CLENBQXdCLElBQXhCLEVBRGMsQ0FFZDs7QUFDQSxRQUFBLElBQUksQ0FBQyxrQkFBTCxDQUF5QixDQUF6QjtBQUNEOztBQUVELFdBQUssWUFBTCxDQUFrQixZQUFsQixDQUFnQyxJQUFoQztBQUVBLGFBQU8sSUFBUDtBQUNEOzs7d0NBb0RtQjtBQUNsQixXQUFNLElBQUksRUFBQyxHQUFHLENBQVIsRUFBVyxFQUFFLEdBQUcsS0FBSyxVQUFMLENBQWdCLGVBQWhCLEVBQXRCLEVBQXlELEVBQUMsR0FBRyxFQUE3RCxFQUFpRSxFQUFDLEVBQWxFLEVBQXdFO0FBRXRFLFlBQU0sZUFBZSxHQUFHLEtBQUssVUFBTCxDQUFnQiwwQkFBaEIsQ0FBNEMsRUFBNUMsQ0FBeEI7QUFDQSxZQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBTCxDQUFVLFVBQVYsQ0FBc0IsZUFBZSxDQUFDLFFBQWhCLEVBQXRCLEVBQWtELElBQUksQ0FBQyxJQUFMLENBQVUsV0FBNUQsQ0FBWjtBQUNBLFlBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFMLENBQVUsVUFBVixDQUFzQixlQUFlLENBQUMsUUFBaEIsRUFBdEIsRUFBa0QsSUFBSSxDQUFDLElBQUwsQ0FBVSxXQUE1RCxDQUFaO0FBRUEsWUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLFFBQUosSUFBZ0IsSUFBbEM7QUFDQSxZQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsUUFBSixJQUFnQixJQUFsQzs7QUFFQSxZQUFLLENBQUMsU0FBRCxJQUFjLENBQUMsU0FBcEIsRUFBZ0M7QUFDckM7QUFDTTs7QUFFRCxZQUFNLFVBQVUsR0FBRyxTQUFTLEdBQUcsU0FBUyxDQUFDLFNBQWIsR0FBd0IsS0FBcEQ7QUFDQSxZQUFNLFVBQVUsR0FBRyxTQUFTLEdBQUcsU0FBUyxDQUFDLFNBQWIsR0FBeUIsS0FBckQ7QUFFQSxZQUFNLFNBQVMsR0FBRyxTQUFTLEdBQUcsU0FBUyxDQUFDLFFBQWIsR0FBd0IsS0FBbkQ7QUFDQSxZQUFNLFNBQVMsR0FBRyxTQUFTLEdBQUcsU0FBUyxDQUFDLFFBQWIsR0FBd0IsS0FBbkQsQ0FqQnNFLENBbUJ0RTs7QUFFQSxZQUFPLENBQUUsVUFBRixJQUFnQixDQUFFLFVBQXBCLElBQXNDLFNBQVMsSUFBSSxTQUF4RCxFQUFzRTtBQUMzRTtBQUNNOztBQUVELFlBQUksT0FBTyxHQUFHLEtBQWQ7QUFDQSxZQUFJLFVBQVUsR0FBRyxDQUFqQjs7QUFDQSxhQUFNLElBQUksQ0FBQyxHQUFHLENBQVIsRUFBVyxFQUFFLEdBQUcsZUFBZSxDQUFDLGNBQWhCLEVBQXRCLEVBQXdELENBQUMsR0FBRyxFQUE1RCxFQUFnRSxDQUFDLEVBQWpFLEVBQXVFO0FBRTVFLGNBQU0sWUFBWSxHQUFHLGVBQWUsQ0FBQyxlQUFoQixDQUFpQyxDQUFqQyxDQUFyQixDQUY0RSxDQUlyRTs7QUFDUCxjQUFLLFlBQVksQ0FBQyxXQUFiLEtBQTZCLEdBQWxDLEVBQXdDO0FBRXRDLFlBQUEsT0FBTyxHQUFHLElBQVY7QUFDQSxnQkFBTSxPQUFPLEdBQUcsWUFBWSxDQUFDLGlCQUFiLEVBQWhCLENBSHNDLENBSS9COztBQUVQLGdCQUFLLE9BQU8sR0FBRyxVQUFmLEVBQTRCO0FBRTFCLGNBQUEsVUFBVSxHQUFHLE9BQWI7QUFDQSxrQkFBSSxHQUFHLEdBQUcsWUFBWSxDQUFDLHNCQUFiLEVBQVY7QUFDQSxrQkFBSSxNQUFNLEdBQUcsWUFBWSxDQUFDLG9CQUFiLEVBQWI7QUFDQSxtQkFBSyxXQUFMLEdBQW1CO0FBQUMsZ0JBQUEsQ0FBQyxFQUFHLEdBQUcsQ0FBQyxDQUFKLEVBQUw7QUFBYyxnQkFBQSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUosRUFBakI7QUFBMEIsZ0JBQUEsQ0FBQyxFQUFHLEdBQUcsQ0FBQyxDQUFKO0FBQTlCLGVBQW5CO0FBQ0EsbUJBQUssWUFBTCxHQUFvQjtBQUFDLGdCQUFBLENBQUMsRUFBRyxNQUFNLENBQUMsQ0FBUCxFQUFMO0FBQWlCLGdCQUFBLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBUCxFQUFwQjtBQUFnQyxnQkFBQSxDQUFDLEVBQUcsTUFBTSxDQUFDLENBQVA7QUFBcEMsZUFBcEI7QUFDRCxhQWJxQyxDQWV0Qzs7QUFDRDtBQUNLOztBQUVELFlBQUksU0FBUyxDQUFDLE9BQWQsRUFBdUI7QUFDckIsVUFBQSxHQUFHLENBQUMsa0JBQUosQ0FBdUIsSUFBSSxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQWQsQ0FBeUIsQ0FBekIsRUFBNEIsQ0FBNUIsRUFBK0IsQ0FBL0IsQ0FBdkI7QUFDRCxTQUZELE1BRU8sSUFBSSxTQUFTLENBQUMsT0FBZCxFQUF1QjtBQUM1QixVQUFBLEdBQUcsQ0FBQyxrQkFBSixDQUF1QixJQUFJLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBZCxDQUF5QixDQUF6QixFQUE0QixDQUE1QixFQUErQixDQUEvQixDQUF2QjtBQUNELFNBdkRxRSxDQXlEdEU7OztBQUNBLFlBQUssQ0FBQyxPQUFELElBQ0gsS0FBSyxXQUFMLENBQWlCLENBQWpCLEtBQXVCLENBQXZCLElBQ0EsS0FBSyxXQUFMLENBQWlCLENBQWpCLEtBQXVCLENBRHZCLElBRUEsS0FBSyxXQUFMLENBQWlCLENBQWpCLEtBQXVCLENBSHpCLEVBSUksU0E5RGtFLENBZ0V0RTs7QUFFQSxZQUFNLFVBQVUsR0FBRyxVQUFVLElBQUksU0FBUyxDQUFDLE9BQXhCLElBQW1DLENBQUUsU0FBckMsSUFBa0QsVUFBVSxHQUFHLEtBQUssZUFBdkY7QUFDQSxZQUFNLFVBQVUsR0FBRyxVQUFVLElBQUksU0FBUyxDQUFDLE9BQXhCLElBQW1DLENBQUUsU0FBckMsSUFBa0QsVUFBVSxHQUFHLEtBQUssZUFBdkYsQ0FuRXNFLENBcUV0RTs7QUFDQSxZQUFJLFVBQVUsSUFBSSxVQUFsQixFQUE4QjtBQUM1QixjQUFJLE1BQU0sU0FBVjs7QUFFQSxjQUFJLFVBQUosRUFBZ0I7QUFDZCxnQkFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLGlCQUFKLEVBQVo7QUFDUCxnQkFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLGtCQUFKLEVBQWY7QUFFTyxpQkFBSyxXQUFMLENBQWlCO0FBQ2YsY0FBQSxJQUFJLEVBQUUsbUJBRFM7QUFFZixjQUFBLFdBQVcsRUFBRSxDQUFDLEtBQUssV0FBTCxDQUFpQixDQUFsQixFQUFxQixLQUFLLFdBQUwsQ0FBaUIsQ0FBdEMsRUFBeUMsS0FBSyxXQUFMLENBQWlCLENBQTFELENBRkU7QUFHZixjQUFBLFlBQVksRUFBRSxDQUFDLEtBQUssWUFBTCxDQUFrQixDQUFuQixFQUFzQixLQUFLLFlBQUwsQ0FBa0IsQ0FBeEMsRUFBMkMsS0FBSyxZQUFMLENBQWtCLENBQTdELENBSEM7QUFJZixjQUFBLElBQUksRUFBRSxHQUFHLENBQUMsUUFBSixDQUFhLElBSko7QUFLZixjQUFBLEVBQUUsRUFBRSxHQUFHLENBQUMsUUFBSixDQUFhLEVBTEY7QUFNZixjQUFBLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFKLEVBQUQsRUFBVSxHQUFHLENBQUMsQ0FBSixFQUFWLEVBQW1CLEdBQUcsQ0FBQyxDQUFKLEVBQW5CLENBTlU7QUFPdEIsY0FBQSxNQUFNLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBUCxFQUFELEVBQWEsTUFBTSxDQUFDLENBQVAsRUFBYixFQUF5QixNQUFNLENBQUMsQ0FBUCxFQUF6QjtBQVBjLGFBQWpCO0FBVVAsaUJBQUssZUFBTCxDQUFzQixLQUFLLGtCQUFMLEVBQXRCLElBQW9ELEdBQXBEO0FBQ0EsWUFBQSxTQUFTLENBQUMsUUFBVixHQUFxQixJQUFyQjtBQUNNOztBQUNELGNBQUksVUFBSixFQUFnQjtBQUNkLGdCQUFNLElBQUcsR0FBRyxHQUFHLENBQUMsaUJBQUosRUFBWjs7QUFDUCxnQkFBTSxPQUFNLEdBQUcsR0FBRyxDQUFDLGtCQUFKLEVBQWY7O0FBRU8saUJBQUssV0FBTCxDQUFpQjtBQUNmLGNBQUEsSUFBSSxFQUFFLG1CQURTO0FBRWYsY0FBQSxXQUFXLEVBQUUsQ0FBQyxLQUFLLFdBQUwsQ0FBaUIsQ0FBbEIsRUFBcUIsS0FBSyxXQUFMLENBQWlCLENBQXRDLEVBQXlDLEtBQUssV0FBTCxDQUFpQixDQUExRCxDQUZFO0FBR2YsY0FBQSxZQUFZLEVBQUUsQ0FBQyxLQUFLLFlBQUwsQ0FBa0IsQ0FBbkIsRUFBc0IsS0FBSyxZQUFMLENBQWtCLENBQXhDLEVBQTJDLEtBQUssWUFBTCxDQUFrQixDQUE3RCxDQUhDO0FBSWYsY0FBQSxJQUFJLEVBQUUsR0FBRyxDQUFDLFFBQUosQ0FBYSxJQUpKO0FBS2YsY0FBQSxFQUFFLEVBQUUsR0FBRyxDQUFDLFFBQUosQ0FBYSxFQUxGO0FBTWYsY0FBQSxHQUFHLEVBQUUsQ0FBQyxJQUFHLENBQUMsQ0FBSixFQUFELEVBQVUsSUFBRyxDQUFDLENBQUosRUFBVixFQUFtQixJQUFHLENBQUMsQ0FBSixFQUFuQixDQU5VO0FBT3RCLGNBQUEsTUFBTSxFQUFFLENBQUMsT0FBTSxDQUFDLENBQVAsRUFBRCxFQUFhLE9BQU0sQ0FBQyxDQUFQLEVBQWIsRUFBeUIsT0FBTSxDQUFDLENBQVAsRUFBekI7QUFQYyxhQUFqQjtBQVVQLGlCQUFLLGVBQUwsQ0FBc0IsS0FBSyxrQkFBTCxFQUF0QixJQUFvRCxHQUFwRDtBQUNBLFlBQUEsU0FBUyxDQUFDLFFBQVYsR0FBcUIsSUFBckI7QUFDTTs7QUFFRCxjQUFLLFNBQVMsSUFBSSxTQUFTLENBQUMsUUFBeEIsSUFBc0MsU0FBUyxJQUFJLFNBQVMsQ0FBQyxRQUFqRSxFQUE0RTtBQUUxRSxpQkFBSyxvQkFBTCxHQUYwRSxDQUkxRTs7QUFDQSxnQkFBTSxjQUFjLEdBQUcsU0FBUyxDQUFDLFFBQVYsR0FBcUIsU0FBckIsR0FBaUMsU0FBeEQ7O0FBRUEsZ0JBQUksY0FBYyxDQUFDLE1BQWYsS0FBMEIsSUFBOUIsRUFBb0M7QUFDbEMsbUJBQUssV0FBTCxDQUFpQjtBQUFFLGdCQUFBLElBQUksRUFBRTtBQUFSLGVBQWpCO0FBQ0EsY0FBQSxjQUFjLENBQUMsTUFBZixHQUF3QixJQUF4QjtBQUNEO0FBQ0Y7QUFDRixTQXhIcUUsQ0F3SHJFO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNEOztBQUVELFVBQUksS0FBSyxrQkFBVCxFQUE2QjtBQUMzQixhQUFLLFdBQUwsQ0FBaUI7QUFDZixVQUFBLElBQUksRUFBRSxjQURTO0FBRWYsVUFBQSxNQUFNLEVBQUUsS0FBSyxlQUFMLENBQXFCLEdBQXJCLENBQXlCO0FBQUEsdUNBQUcsUUFBSDtBQUFBLGdCQUFlLElBQWYsa0JBQWUsSUFBZjtBQUFBLGdCQUFxQixFQUFyQixrQkFBcUIsRUFBckI7QUFBQSxtQkFBZ0M7QUFBRSxjQUFBLElBQUksRUFBSixJQUFGO0FBQVEsY0FBQSxFQUFFLEVBQUY7QUFBUixhQUFoQztBQUFBLFdBQXpCO0FBRk8sU0FBakI7O0FBS0EsYUFBTSxJQUFJLENBQUMsR0FBRyxDQUFkLEVBQWlCLENBQUMsR0FBRyxLQUFLLGtCQUExQixFQUE4QyxDQUFDLEVBQS9DLEVBQXFEO0FBQ25ELGVBQUssWUFBTCxDQUFrQixlQUFsQixDQUFrQyxLQUFLLGVBQUwsQ0FBcUIsQ0FBckIsQ0FBbEM7QUFDRDs7QUFDRCxhQUFLLGtCQUFMLEdBQTBCLENBQTFCO0FBQ0Q7QUFFRjs7O2dDQUVXLE0sRUFBUTtBQUFBOztBQUNsQixNQUFBLFVBQVUsQ0FBQyxZQUFNO0FBQ2YsUUFBQSxNQUFJLENBQUMsV0FBTCxDQUFpQjtBQUNmLFVBQUEsSUFBSSxFQUFFLGNBRFM7QUFFZixVQUFBLE1BQU0sRUFBRSxNQUFNLENBQUMsR0FBUCxDQUFXO0FBQUEsdUNBQUcsUUFBSDtBQUFBLGdCQUFlLElBQWYsa0JBQWUsSUFBZjtBQUFBLGdCQUFxQixFQUFyQixrQkFBcUIsRUFBckI7QUFBQSxtQkFBZ0M7QUFBRSxjQUFBLElBQUksRUFBSixJQUFGO0FBQVEsY0FBQSxFQUFFLEVBQUY7QUFBUixhQUFoQztBQUFBLFdBQVg7QUFGTyxTQUFqQjs7QUFLQSxhQUFLLElBQU0sV0FBWCxJQUEwQixNQUExQixFQUFrQztBQUNoQyxVQUFBLE1BQUksQ0FBQyxZQUFMLENBQWtCLGVBQWxCLENBQWtDLE1BQU0sQ0FBQyxXQUFELENBQXhDO0FBQ0Q7QUFDRixPQVRTLEVBU1AsS0FBSyxnQkFURSxDQUFWO0FBVUQ7OzsyQ0FFc0I7QUFDckIsV0FBSyxTQUFMLENBQWUsaUJBQWYsQ0FBaUMsSUFBSSxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQWQsQ0FBeUIsQ0FBekIsRUFBNEIsQ0FBNUIsRUFBK0IsQ0FBL0IsQ0FBakM7QUFDRDs7O3dDQUVtQixJLEVBQU0sQ0FDeEI7QUFDQTtBQUNBO0FBQ0Q7Ozs7OztBQUdILElBQUksQ0FBQyxlQUFMLEdBQXVCLE9BQXZCOztBQUVBLElBQUksQ0FBQyxTQUFMO0FBQUEsc0VBQWlCLGlCQUFnQixDQUFoQjtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsMEJBQ1IsQ0FBQyxDQUFDLElBQUYsQ0FBTyxJQURDO0FBQUEsNENBRVYsTUFGVSx1QkFtQlYsVUFuQlUsdUJBMEJWLE9BMUJVLHdCQWlDVixXQWpDVSx3QkF3Q1YsUUF4Q1Usd0JBNkNWLGlCQTdDVTtBQUFBOztBQUFBO0FBQUEsMEJBS1QsQ0FBQyxDQUFDLElBQUYsQ0FBTyxHQUxFLEVBSVgsV0FKVyxlQUlYLFdBSlcsRUFJRSxTQUpGLGVBSUUsU0FKRixFQUlhLG9CQUpiLGVBSWEsb0JBSmIsRUFJbUMsZUFKbkMsZUFJbUMsZUFKbkMsRUFJb0QsZ0JBSnBELGVBSW9ELGdCQUpwRCxFQUlzRSxVQUp0RSxlQUlzRSxVQUp0RTtBQU9iLFlBQUEsSUFBSSxDQUFDLGVBQUwsR0FBdUIsSUFBSSxPQUFKLENBQVk7QUFDakMsY0FBQSxXQUFXLEVBQVgsV0FEaUM7QUFDcEIsY0FBQSxTQUFTLEVBQVQsU0FEb0I7QUFDVCxjQUFBLG9CQUFvQixFQUFwQixvQkFEUztBQUNhLGNBQUEsZUFBZSxFQUFmLGVBRGI7QUFDOEIsY0FBQSxnQkFBZ0IsRUFBaEIsZ0JBRDlCO0FBQ2dELGNBQUEsVUFBVSxFQUFWLFVBRGhEO0FBRWpDLGNBQUEsV0FGaUMsdUJBRXJCLE9BRnFCLEVBRVo7QUFDbkIsZ0JBQUEsSUFBSSxDQUFDLFdBQUwsQ0FBaUIsT0FBakI7QUFDRDtBQUpnQyxhQUFaLENBQXZCO0FBUGE7QUFBQSxtQkFjUCxJQUFJLENBQUMsZUFBTCxDQUFxQixJQUFyQixFQWRPOztBQUFBO0FBZ0JiLFlBQUEsSUFBSSxDQUFDLFdBQUwsQ0FBaUI7QUFBRSxjQUFBLElBQUksRUFBRTtBQUFSLGFBQWpCO0FBaEJhOztBQUFBO0FBcUJMLFlBQUEsUUFyQkssR0FxQlEsQ0FBQyxDQUFDLElBckJWLENBcUJMLFFBckJLO0FBdUJiLFlBQUEsSUFBSSxDQUFDLGVBQUwsQ0FBcUIsbUJBQXJCLENBQXlDLFFBQXpDO0FBdkJhOztBQUFBO0FBQUEsNkJBMkJtQixDQUFDLENBQUMsSUEzQnJCLENBMkJMLE1BM0JLLEVBMkJLLENBM0JMLGtCQTJCSyxDQTNCTCxFQTJCUSxDQTNCUixrQkEyQlEsQ0EzQlIsRUEyQlcsQ0EzQlgsa0JBMkJXLENBM0JYO0FBNkJiLFlBQUEsSUFBSSxDQUFDLGVBQUwsQ0FBcUIsU0FBckIsQ0FBK0IsVUFBL0IsQ0FBMEMsSUFBSSxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQWQsQ0FBd0IsQ0FBeEIsRUFBMkIsQ0FBM0IsRUFBOEIsQ0FBOUIsQ0FBMUM7QUE3QmE7O0FBQUE7QUFBQSxzQkFrQzJDLENBQUMsQ0FBQyxJQWxDN0MsRUFrQ0wsU0FsQ0ssV0FrQ0wsUUFsQ0ssRUFrQ0ssVUFsQ0wsV0FrQ0ssVUFsQ0wsRUFrQ2lCLFdBbENqQixXQWtDaUIsV0FsQ2pCLEVBa0M4QixRQWxDOUIsV0FrQzhCLFFBbEM5QjtBQW9DYixZQUFBLElBQUksQ0FBQyxlQUFMLENBQXFCLFNBQXJCLENBQStCLFNBQS9CLEVBQXlDLFVBQXpDLEVBQXFELFdBQXJELEVBQWtFLFFBQWxFO0FBcENhOztBQUFBO0FBeUNiLFlBQUEsSUFBSSxDQUFDLGVBQUwsQ0FBcUIsb0JBQXJCO0FBekNhOztBQUFBO0FBK0NMLFlBQUEsU0EvQ0ssR0ErQ1MsQ0FBQyxDQUFDLElBL0NYLENBK0NMLFNBL0NLO0FBaURQLFlBQUEsVUFqRE8sR0FpRE0sU0FBUyxDQUFDLE1BakRoQjtBQWtEUCxZQUFBLE1BbERPLEdBa0RFLEVBbERGOztBQW1EYixpQkFBVSxDQUFWLEdBQWMsQ0FBZCxFQUFpQixDQUFDLEdBQUcsVUFBckIsRUFBaUMsQ0FBQyxFQUFsQyxFQUF3QztBQUFBLDRDQUdsQyxTQUFTLENBQUUsQ0FBRixDQUh5QixNQUVwQyxVQUZvQyxvQkFFeEIsVUFGd0Isb0JBRWQsV0FGYyxvQkFFRixZQUZFLG9CQUVXLElBRlgsb0JBRWlCLFFBRmpCLG9CQUUyQixlQUYzQjtBQUtoQyxjQUFBLElBTGdDLEdBS3pCLElBQUksQ0FBQyxlQUFMLENBQXFCLHFCQUFyQixDQUNYLGlCQUFpQixDQUFDLFVBQUQsQ0FETixFQUVYLGlCQUFpQixDQUFDLFdBQUQsQ0FGTixFQUdYLFlBSFcsRUFJWCxJQUpXLEVBS1gsaUJBQWlCLENBQUMsUUFBRCxDQUxOLEVBTVgsaUJBQWlCLENBQUMsZUFBRCxDQU5OLENBTHlCO0FBYXRDLGNBQUEsSUFBSSxDQUFDLFFBQUwsR0FBZ0IsSUFBSSxDQUFDLFFBQUwsSUFBaUIsRUFBakM7QUFDQSxjQUFBLElBQUksQ0FBQyxRQUFMLENBQWMsRUFBZCxHQUFtQixVQUFuQjtBQUNBLGNBQUEsSUFBSSxDQUFDLFFBQUwsQ0FBYyxJQUFkLEdBQXFCLFVBQXJCO0FBQ0EsY0FBQSxJQUFJLENBQUMsUUFBTCxDQUFjLFVBQWQsR0FBMkIsSUFBM0I7QUFDQSxjQUFBLE1BQU0sQ0FBQyxJQUFQLENBQVksSUFBWjtBQUNEOztBQUVELFlBQUEsSUFBSSxDQUFDLGVBQUwsQ0FBcUIsV0FBckIsQ0FBaUMsTUFBakM7QUF2RWE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsR0FBakI7O0FBQUE7QUFBQTtBQUFBO0FBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJmdW5jdGlvbiBhcnJheVRvVmVjM1NvdXJjZShhcnIpIHtcbiAgY29uc3QgcmVzdWx0ID0ge3g6IGFyclswXSwgeTogYXJyWzFdLCB6OiBhcnJbMl19O1xuICBpZiAoYXJyWzNdKSB7XG4gICAgcmVzdWx0LncgPSBhcnJbM107XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuc2VsZi5pbXBvcnRTY3JpcHRzKFxuICAnL2xpYi9hbW1vLjIuanMnLFxuICAnL25vZGVfbW9kdWxlcy9AYmFiZWwvcG9seWZpbGwvZGlzdC9wb2x5ZmlsbC5taW4uanMnLFxuKTtcblxuY2xhc3MgUGh5c2ljcyB7XG4gIGR5bmFtaWNCb2RpZXMgPSBudWxsXG4gIGNvbGxpc2lvbkNvbmZpZ3VyYXRpb24gPSBudWxsXG4gIGRpc3BhdGNoZXIgPSBudWxsXG4gIGJyb2FkcGhhc2UgPSBudWxsXG4gIHNvbHZlciA9IG51bGxcbiAgcGh5c2ljc1dvcmxkID0gbnVsbFxuICB0cmFuc2Zvcm1BdXggPSBudWxsXG4gIHRlbXBCdFZlYzNfMSA9IG51bGxcbiAgdGVtcEJ0VmVjM18yID0gbnVsbFxuICB0ZW1wQnRWZWMzXzMgPSBudWxsXG4gIG1hcmdpbiA9IDBcbiAgaW1wYWN0UG9pbnQgPSBudWxsXG4gIGltcGFjdE5vcm1hbCA9IG51bGxcbiAgb2JqZWN0c1RvUmVtb3ZlID0gbnVsbFxuICBudW1PYmplY3RzVG9SZW1vdmUgPSAwXG4gIGFnZW50Qm9keSA9IG51bGxcbiAgYWdlbnRSYWRpdXMgPSAwXG4gIGFnZW50TWFzcyA9IDBcbiAgdGFyZ2V0TWFzcyA9IDBcbiAgYm91bmRpbmdTcGhlcmVSYWRpdXMgPSAwXG4gIHBvc3RNZXNzYWdlID0gbnVsbFxuICBjb25zdHJ1Y3Rvcih7XG4gICAgYWdlbnRSYWRpdXMsIGFnZW50TWFzcywgYm91bmRpbmdTcGhlcmVSYWRpdXMsIGZyYWN0dXJlSW1wdWxzZSwgZGVicmlzTGlmZXRpbWVNcywgdGFyZ2V0TWFzcyxcbiAgICBwb3N0TWVzc2FnZSxcbiAgfSkge1xuICAgIHRoaXMuYWdlbnRSYWRpdXMgPSBhZ2VudFJhZGl1cztcbiAgICB0aGlzLmFnZW50TWFzcyA9IGFnZW50TWFzcztcbiAgICB0aGlzLmJvdW5kaW5nU3BoZXJlUmFkaXVzID0gYm91bmRpbmdTcGhlcmVSYWRpdXM7XG4gICAgdGhpcy5mcmFjdHVyZUltcHVsc2UgPSBmcmFjdHVyZUltcHVsc2U7XG4gICAgdGhpcy5kZWJyaXNMaWZldGltZU1zID0gZGVicmlzTGlmZXRpbWVNcztcbiAgICB0aGlzLnRhcmdldE1hc3MgPSB0YXJnZXRNYXNzO1xuICAgIHRoaXMucG9zdE1lc3NhZ2UgPSBwb3N0TWVzc2FnZTtcbiAgICB0aGlzLm9iamVjdHNUb1JlbW92ZSA9IFtdO1xuICAgIHRoaXMuZHluYW1pY0JvZGllcyA9IFtdO1xuICB9XG4gIGluaXQoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmICh0eXBlb2Ygc2VsZi5BbW1vID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHNlbGYuQW1tbygpLnRoZW4oKCBBbW1vTGliICkgPT4ge1xuICAgICAgICAgIHNlbGYuQW1tbyA9IHNlbGYuQW1tbyA9IEFtbW9MaWI7XG4gICAgICAgICAgdGhpcy50cmFuc2Zvcm1BdXggPSBuZXcgc2VsZi5BbW1vLmJ0VHJhbnNmb3JtKCk7XG4gICAgICAgICAgdGhpcy50ZW1wQnRWZWMzXzEgPSBuZXcgc2VsZi5BbW1vLmJ0VmVjdG9yMygwLDAsMCk7XG4gICAgICAgICAgdGhpcy50ZW1wQnRWZWMzXzIgPSBuZXcgc2VsZi5BbW1vLmJ0VmVjdG9yMygwLDAsMCk7XG4gICAgICAgICAgdGhpcy50ZW1wQnRWZWMzXzMgPSBuZXcgc2VsZi5BbW1vLmJ0VmVjdG9yMygwLDAsMCk7XG4gICAgICAgICAgdGhpcy5pbml0UGh5c2ljcygpO1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmluaXRQaHlzaWNzKCk7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBpbml0UGh5c2ljcygpIHtcbiAgICAvLyBQaHlzaWNzIGNvbmZpZ3VyYXRpb25cbiAgICB0aGlzLmNvbGxpc2lvbkNvbmZpZ3VyYXRpb24gPSBuZXcgc2VsZi5BbW1vLmJ0RGVmYXVsdENvbGxpc2lvbkNvbmZpZ3VyYXRpb24oKTtcbiAgICB0aGlzLmRpc3BhdGNoZXIgPSBuZXcgc2VsZi5BbW1vLmJ0Q29sbGlzaW9uRGlzcGF0Y2hlciggdGhpcy5jb2xsaXNpb25Db25maWd1cmF0aW9uICk7XG4gICAgdGhpcy5icm9hZHBoYXNlID0gbmV3IHNlbGYuQW1tby5idERidnRCcm9hZHBoYXNlKCk7XG4gICAgdGhpcy5zb2x2ZXIgPSBuZXcgc2VsZi5BbW1vLmJ0U2VxdWVudGlhbEltcHVsc2VDb25zdHJhaW50U29sdmVyKCk7XG4gICAgdGhpcy5waHlzaWNzV29ybGQgPSBuZXcgc2VsZi5BbW1vLmJ0RGlzY3JldGVEeW5hbWljc1dvcmxkKFxuICAgICAgdGhpcy5kaXNwYXRjaGVyLFxuICAgICAgdGhpcy5icm9hZHBoYXNlLFxuICAgICAgdGhpcy5zb2x2ZXIsXG4gICAgICB0aGlzLmNvbGxpc2lvbkNvbmZpZ3VyYXRpb24sXG4gICAgKTtcbiAgICAvLyBHcmF2aXR5IHdpbGwgYmUgc2V0IGR5bmFtaWNhbGx5LCBkZXBlbmRpbmcgb24gY2FtZXJhIHBvc2l0aW9uLlxuICAgIHRoaXMucGh5c2ljc1dvcmxkLnNldEdyYXZpdHkobmV3IHNlbGYuQW1tby5idFZlY3RvcjMoIDAsIDAsIDAgKSk7XG5cbiAgICB0aGlzLnN0YXJ0TG9vcCgpO1xuICB9XG4gIHN0YXJ0TG9vcCgpIHtcbiAgICB0aGlzLmxvb3AoKTtcbiAgfVxuICBkZWx0YVRpbWUgPSAobmV3IERhdGUpLmdldFRpbWUoKVxuICBsb29wID0gKCkgPT4ge1xuICAgIGlmIChzZWxmLnJlcXVlc3RBbmltYXRpb25GcmFtZSkge1xuICAgICAgc2VsZi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5sb29wKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0VGltZW91dCh0aGlzLmxvb3AsIDEwMDAvNjApO1xuICAgIH1cblxuICAgIC8vc2V0VGltZW91dCh0aGlzLmxvb3AsIDEwMCk7XG5cbiAgICBjb25zdCBub3cgPSAobmV3IERhdGUpLmdldFRpbWUoKTtcblxuICAgIHRoaXMudXBkYXRlKG5vdyAtIHRoaXMuZGVsdGFUaW1lKTtcbiAgICB0aGlzLmRlbHRhVGltZSA9IG5vdztcbiAgfVxuICBzZXRBZ2VudFBoeXNpY3NCb2R5KHsgeCwgeSwgeiB9KSB7XG4gICAgY29uc3Qgc2hhcGUgPSBuZXcgc2VsZi5BbW1vLmJ0U3BoZXJlU2hhcGUoIHRoaXMuYWdlbnRSYWRpdXMgKTtcblxuICAgIHNoYXBlLnNldE1hcmdpbiggdGhpcy5tYXJnaW4gKTtcblxuICAgIGNvbnN0IGxvY2FsSW5lcnRpYSA9IG5ldyBzZWxmLkFtbW8uYnRWZWN0b3IzKCAwLCAwLCAwICk7XG5cbiAgICBzaGFwZS5jYWxjdWxhdGVMb2NhbEluZXJ0aWEoIHRoaXMuYWdlbnRNYXNzLCBsb2NhbEluZXJ0aWEgKTtcblxuICAgIGNvbnN0IHRyYW5zZm9ybSA9IG5ldyBzZWxmLkFtbW8uYnRUcmFuc2Zvcm0oKTtcblxuICAgIHRyYW5zZm9ybS5zZXRJZGVudGl0eSgpO1xuXG4gICAgdHJhbnNmb3JtLnNldE9yaWdpbihuZXcgc2VsZi5BbW1vLmJ0VmVjdG9yMyggeCwgeSwgeiApKTtcblxuICAgIGNvbnN0IG1vdGlvblN0YXRlID0gbmV3IHNlbGYuQW1tby5idERlZmF1bHRNb3Rpb25TdGF0ZSh0cmFuc2Zvcm0pO1xuICAgIGNvbnN0IHJiSW5mbyA9IG5ldyBzZWxmLkFtbW8uYnRSaWdpZEJvZHlDb25zdHJ1Y3Rpb25JbmZvKCB0aGlzLmFnZW50TWFzcywgbW90aW9uU3RhdGUsIHNoYXBlLCBsb2NhbEluZXJ0aWEgKTtcbiAgICBjb25zdCBib2R5ID0gbmV3IHNlbGYuQW1tby5idFJpZ2lkQm9keSggcmJJbmZvICk7XG5cbiAgICBib2R5LnNldEFjdGl2YXRpb25TdGF0ZSg0KTtcblxuICAgIGJvZHkudXNlckRhdGEgPSBib2R5LnVzZXJEYXRhIHx8IHt9O1xuICAgIGJvZHkudXNlckRhdGEuaXNBZ2VudCA9IHRydWU7XG4gICAgYm9keS51c2VyRGF0YS5yb2xlID0gJ2FnZW50JztcbiAgICBib2R5LnVzZXJEYXRhLmlkID0gJ2FnZW50JztcbiAgICBib2R5LnVzZXJEYXRhLmNvbGxpZGVkID0gZmFsc2U7XG5cbiAgICB0aGlzLmR5bmFtaWNCb2RpZXMucHVzaChib2R5KTtcbiAgICB0aGlzLmFnZW50Qm9keSA9IGJvZHk7XG5cbiAgICB0aGlzLnBoeXNpY3NXb3JsZC5hZGRSaWdpZEJvZHkoIGJvZHkgKTtcbiAgfVxuXG4gIGFkZFRhcmdldChwb3NpdGlvbiwgcXVhdGVybmlvbiwgdmVydGV4QXJyYXksIHRhcmdldElkKSB7XG4gICAgY29uc3QgdGFyZ2V0Qm9keSA9IHRoaXMuY3JlYXRlQnJlYWthYmxlT2JqZWN0KCBwb3NpdGlvbiwgcXVhdGVybmlvbiwgdmVydGV4QXJyYXksIHRoaXMudGFyZ2V0TWFzcyApO1xuXG4gICAgdGFyZ2V0Qm9keS51c2VyRGF0YSA9IHRhcmdldEJvZHkudXNlckRhdGEgfHwge307XG4gICAgdGFyZ2V0Qm9keS51c2VyRGF0YS5pc1RhcmdldCA9IHRydWU7XG4gICAgdGFyZ2V0Qm9keS51c2VyRGF0YS5yb2xlID0gJ3RhcmdldCc7XG4gICAgdGFyZ2V0Qm9keS51c2VyRGF0YS5pZCA9IHRhcmdldElkO1xuICAgIHRhcmdldEJvZHkudXNlckRhdGEuYnJlYWthYmxlID0gdHJ1ZTtcbiAgfVxuXG4gIGNyZWF0ZUJyZWFrYWJsZU9iamVjdChwb3NpdGlvbiwgcXVhdGVybmlvbiwgdmVydGV4QXJyYXksIG1hc3MsIHZlbG9jaXR5LCBhbmd1bGFyVmVsb2NpdHkpIHtcbiAgICBjb25zdCBzaGFwZSA9IHRoaXMuY3JlYXRlQ29udmV4SHVsbFBoeXNpY3NTaGFwZSggdmVydGV4QXJyYXkgKTtcbiAgICBzaGFwZS5zZXRNYXJnaW4oIHRoaXMubWFyZ2luICk7XG5cbiAgICBjb25zdCBib2R5ID0gdGhpcy5jcmVhdGVSaWdpZEJvZHkoIHNoYXBlLCBtYXNzLCBwb3NpdGlvbiwgcXVhdGVybmlvbiwgdmVsb2NpdHksIGFuZ3VsYXJWZWxvY2l0eSApO1xuXG4gICAgcmV0dXJuIGJvZHk7XG4gIH1cblxuICBjcmVhdGVDb252ZXhIdWxsUGh5c2ljc1NoYXBlKCBjb29yZHMgKSB7XG4gICAgY29uc3Qgc2hhcGUgPSBuZXcgc2VsZi5BbW1vLmJ0Q29udmV4SHVsbFNoYXBlKCk7XG5cbiAgICBmb3IgKCBsZXQgaSA9IDAsIGlsID0gY29vcmRzLmxlbmd0aDsgaSA8IGlsOyBpICs9IDMgKSB7XG4gICAgICB0aGlzLnRlbXBCdFZlYzNfMS5zZXRWYWx1ZSggY29vcmRzWyBpIF0sIGNvb3Jkc1sgaSArIDEgXSwgY29vcmRzWyBpICsgMiBdICk7XG4gICAgICBjb25zdCBsYXN0T25lID0gKCBpID49ICggaWwgLSAzICkgKTtcbiAgICAgIHNoYXBlLmFkZFBvaW50KCB0aGlzLnRlbXBCdFZlYzNfMSwgbGFzdE9uZSApO1xuICAgIH1cblxuICAgIHJldHVybiBzaGFwZTtcbiAgfVxuXG4gIGNyZWF0ZVRyaWFuZ2xlUGh5c2ljc1NoYXBlKCBjb29yZHMgKSB7XG4gICAgY29uc3QgbWVzaCA9IG5ldyBzZWxmLkFtbW8uYnRUcmlhbmdsZU1lc2goKTtcblxuICAgIGZvciAoIGxldCBpID0gMCwgaWwgPSBjb29yZHMubGVuZ3RoOyBpIDwgaWw7IGkgKz0gOSApIHtcbiAgICAgIHRoaXMudGVtcEJ0VmVjM18xLnNldFZhbHVlKCBjb29yZHNbIGkgXSwgY29vcmRzWyBpICsgMSBdLCBjb29yZHNbIGkgKyAyIF0gKTtcbiAgICAgIHRoaXMudGVtcEJ0VmVjM18yLnNldFZhbHVlKCBjb29yZHNbIGkgKyAzIF0sIGNvb3Jkc1sgaSArIDQgXSwgY29vcmRzWyBpICsgNSBdICk7XG4gICAgICB0aGlzLnRlbXBCdFZlYzNfMy5zZXRWYWx1ZSggY29vcmRzWyBpICsgNiBdLCBjb29yZHNbIGkgKyA3IF0sIGNvb3Jkc1sgaSArIDggXSApO1xuICAgICAgLy9jb25zdCBsYXN0T25lID0gKCBpID49ICggaWwgLSAzICkgKTtcbiAgICAgIG1lc2guYWRkVHJpYW5nbGUoIHRoaXMudGVtcEJ0VmVjM18xLCB0aGlzLnRlbXBCdFZlYzNfMiwgdGhpcy50ZW1wQnRWZWMzXzMpO1xuICAgIH1cblxuICAgIGNvbnN0IHNoYXBlID0gbmV3IHNlbGYuQW1tby5idEJ2aFRyaWFuZ2xlTWVzaFNoYXBlKG1lc2gpO1xuXG4gICAgcmV0dXJuIHNoYXBlO1xuICB9XG5cbiAgY3JlYXRlUmlnaWRCb2R5KCBwaHlzaWNzU2hhcGUsIG1hc3MsIHBvcywgcXVhdCwgdmVsLCBhbmdWZWwgKSB7XG4gICAgY29uc3QgdHJhbnNmb3JtID0gbmV3IHNlbGYuQW1tby5idFRyYW5zZm9ybSgpO1xuICAgIHRyYW5zZm9ybS5zZXRJZGVudGl0eSgpO1xuICAgIHRyYW5zZm9ybS5zZXRPcmlnaW4oIG5ldyBzZWxmLkFtbW8uYnRWZWN0b3IzKCBwb3MueCwgcG9zLnksIHBvcy56ICkgKTtcbiAgICB0cmFuc2Zvcm0uc2V0Um90YXRpb24oIG5ldyBzZWxmLkFtbW8uYnRRdWF0ZXJuaW9uKCBxdWF0LngsIHF1YXQueSwgcXVhdC56LCBxdWF0LncgKSApO1xuICAgIGNvbnN0IG1vdGlvblN0YXRlID0gbmV3IHNlbGYuQW1tby5idERlZmF1bHRNb3Rpb25TdGF0ZSggdHJhbnNmb3JtICk7XG5cbiAgICBjb25zdCBsb2NhbEluZXJ0aWEgPSBuZXcgc2VsZi5BbW1vLmJ0VmVjdG9yMyggMCwgMCwgMCApO1xuICAgIHBoeXNpY3NTaGFwZS5jYWxjdWxhdGVMb2NhbEluZXJ0aWEoIG1hc3MsIGxvY2FsSW5lcnRpYSApO1xuXG4gICAgY29uc3QgcmJJbmZvID0gbmV3IHNlbGYuQW1tby5idFJpZ2lkQm9keUNvbnN0cnVjdGlvbkluZm8oIG1hc3MsIG1vdGlvblN0YXRlLCBwaHlzaWNzU2hhcGUsIGxvY2FsSW5lcnRpYSApO1xuICAgIGNvbnN0IGJvZHkgPSBuZXcgc2VsZi5BbW1vLmJ0UmlnaWRCb2R5KCByYkluZm8gKTtcblxuICAgIGJvZHkuc2V0UmVzdGl0dXRpb24oMSk7XG5cbiAgICBpZiAoIHZlbCApIHtcbiAgICAgIGJvZHkuc2V0TGluZWFyVmVsb2NpdHkoIG5ldyBzZWxmLkFtbW8uYnRWZWN0b3IzKCB2ZWwueCwgdmVsLnksIHZlbC56ICkgKTtcbiAgICB9XG4gICAgaWYgKCBhbmdWZWwgKSB7XG4gICAgICBib2R5LnNldEFuZ3VsYXJWZWxvY2l0eSggbmV3IHNlbGYuQW1tby5idFZlY3RvcjMoIGFuZ1ZlbC54LCBhbmdWZWwueSwgYW5nVmVsLnogKSApO1xuICAgIH1cblxuICAgIGJvZHkudXNlckRhdGEgPSBib2R5LnVzZXJEYXRhIHx8IHt9O1xuICAgIGJvZHkudXNlckRhdGEuY29sbGlkZWQgPSBmYWxzZTtcblxuICAgIC8vIEZJWE1FOlxuICAgIC8vIGdldFNjZW5lKCkuYWRkKCBvYmplY3QgKTtcblxuICAgIGlmICggbWFzcyA+IDAgKSB7XG4gICAgICB0aGlzLmR5bmFtaWNCb2RpZXMucHVzaChib2R5KTtcbiAgICAgIC8vIERpc2FibGUgZGVhY3RpdmF0aW9uXG4gICAgICBib2R5LnNldEFjdGl2YXRpb25TdGF0ZSggNCApO1xuICAgIH1cblxuICAgIHRoaXMucGh5c2ljc1dvcmxkLmFkZFJpZ2lkQm9keSggYm9keSApO1xuXG4gICAgcmV0dXJuIGJvZHk7XG4gIH1cblxuICB1cGRhdGUgPSAoIGRlbHRhVGltZSApID0+IHtcblxuICAgIHRoaXMucGh5c2ljc1dvcmxkLnN0ZXBTaW11bGF0aW9uKCBkZWx0YVRpbWUqNSwgMTAgKTtcbiAgICAvLyB0aGlzLnBoeXNpY3NXb3JsZC5zdGVwU2ltdWxhdGlvbiggZGVsdGFUaW1lLCAxMCApO1xuXG4gICAgLy8gVXBkYXRlIG9iamVjdHNcbiAgICBmb3IgKCBsZXQgaSA9IDAsIGlsID0gdGhpcy5keW5hbWljQm9kaWVzLmxlbmd0aDsgaSA8IGlsOyBpICsrICkge1xuXG4gICAgICBjb25zdCBvYmpQaHlzID0gdGhpcy5keW5hbWljQm9kaWVzWyBpIF07XG4gICAgICBjb25zdCBtb3Rpb25TdGF0ZSA9IG9ialBoeXMuZ2V0TW90aW9uU3RhdGUoKTtcblxuICAgICAgaWYgKG1vdGlvblN0YXRlKSB7XG4gICAgICAgIG1vdGlvblN0YXRlLmdldFdvcmxkVHJhbnNmb3JtKCB0aGlzLnRyYW5zZm9ybUF1eCApO1xuXG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy50cmFuc2Zvcm1BdXguZ2V0T3JpZ2luKCk7XG4gICAgICAgIGNvbnN0IHF1YXRlcm5pb24gPSB0aGlzLnRyYW5zZm9ybUF1eC5nZXRSb3RhdGlvbigpO1xuXG4gICAgICAgIGNvbnN0IFsgeCwgeSwgeiBdID0gW3Bvc2l0aW9uLngoKSwgcG9zaXRpb24ueSgpLCBwb3NpdGlvbi56KCldO1xuXG4gICAgICAgIGlmIChvYmpQaHlzLnVzZXJEYXRhLmlzQWdlbnQpIHtcbiAgICAgICAgICBpZiAoTWF0aC5zcXJ0KE1hdGgucG93KHgsIDIpICsgTWF0aC5wb3coeSwgMikgKyBNYXRoLnBvdyh6LCAyKSkgPiB0aGlzLmJvdW5kaW5nU3BoZXJlUmFkaXVzKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3BBZ2VudEFmdGVySW1wYWN0KCk7XG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybUF1eC5zZXRPcmlnaW4obmV3IHNlbGYuQW1tby5idFZlY3RvcjMoXG4gICAgICAgICAgICAgIG9ialBoeXMudXNlckRhdGEucHJldlBvc2l0aW9uLngsXG4gICAgICAgICAgICAgIG9ialBoeXMudXNlckRhdGEucHJldlBvc2l0aW9uLnksXG4gICAgICAgICAgICAgIG9ialBoeXMudXNlckRhdGEucHJldlBvc2l0aW9uLnosXG4gICAgICAgICAgICApKTtcbiAgICAgICAgICAgIHRoaXMuYWdlbnRCb2R5LnNldFdvcmxkVHJhbnNmb3JtKHRoaXMudHJhbnNmb3JtQXV4KTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvYmpQaHlzLnVzZXJEYXRhLnByZXZQb3NpdGlvbiA9IHsgeCwgeSwgeiB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vY29uc29sZS5sb2coJ3Bvc3QgbWVzc2FnZScsIHsgeCwgeSwgeiB9LCBbcXVhdGVybmlvbi54KCksIHF1YXRlcm5pb24ueSgpLCBxdWF0ZXJuaW9uLnooKSwgcXVhdGVybmlvbi53KCldKTtcbiAgICAgICAgdGhpcy5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgdGFzazogJ3VwZGF0ZScsXG4gICAgICAgICAgcm9sZTogb2JqUGh5cy51c2VyRGF0YS5yb2xlLFxuICAgICAgICAgIGlkOiBvYmpQaHlzLnVzZXJEYXRhLmlkLFxuICAgICAgICAgIHBvc2l0aW9uOiB7IHgsIHksIHogfSxcbiAgICAgICAgICBxdWF0ZXJuaW9uOiBbcXVhdGVybmlvbi54KCksIHF1YXRlcm5pb24ueSgpLCBxdWF0ZXJuaW9uLnooKSwgcXVhdGVybmlvbi53KCldLFxuICAgICAgICB9KTtcblxuICAgICAgICBvYmpQaHlzLnVzZXJEYXRhLmNvbGxpZGVkID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5wcm9jZXNzQ29sbGlzaW9ucygpO1xuICB9XG5cbiAgcHJvY2Vzc0NvbGxpc2lvbnMoKSB7XG4gICAgZm9yICggbGV0IGkgPSAwLCBpbCA9IHRoaXMuZGlzcGF0Y2hlci5nZXROdW1NYW5pZm9sZHMoKTsgaSA8IGlsOyBpICsrICkge1xuXG4gICAgICBjb25zdCBjb250YWN0TWFuaWZvbGQgPSB0aGlzLmRpc3BhdGNoZXIuZ2V0TWFuaWZvbGRCeUluZGV4SW50ZXJuYWwoIGkgKTtcbiAgICAgIGNvbnN0IHJiMCA9IHNlbGYuQW1tby5jYXN0T2JqZWN0KCBjb250YWN0TWFuaWZvbGQuZ2V0Qm9keTAoKSwgc2VsZi5BbW1vLmJ0UmlnaWRCb2R5ICk7XG4gICAgICBjb25zdCByYjEgPSBzZWxmLkFtbW8uY2FzdE9iamVjdCggY29udGFjdE1hbmlmb2xkLmdldEJvZHkxKCksIHNlbGYuQW1tby5idFJpZ2lkQm9keSApO1xuXG4gICAgICBjb25zdCB1c2VyRGF0YTAgPSByYjAudXNlckRhdGEgfHwgbnVsbDtcbiAgICAgIGNvbnN0IHVzZXJEYXRhMSA9IHJiMS51c2VyRGF0YSB8fCBudWxsO1xuXG4gICAgICBpZiAoICF1c2VyRGF0YTAgfHwgIXVzZXJEYXRhMSApIHtcblx0Y29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGJyZWFrYWJsZTAgPSB1c2VyRGF0YTAgPyB1c2VyRGF0YTAuYnJlYWthYmxlOiBmYWxzZTtcbiAgICAgIGNvbnN0IGJyZWFrYWJsZTEgPSB1c2VyRGF0YTEgPyB1c2VyRGF0YTEuYnJlYWthYmxlIDogZmFsc2U7XG5cbiAgICAgIGNvbnN0IGNvbGxpZGVkMCA9IHVzZXJEYXRhMCA/IHVzZXJEYXRhMC5jb2xsaWRlZCA6IGZhbHNlO1xuICAgICAgY29uc3QgY29sbGlkZWQxID0gdXNlckRhdGExID8gdXNlckRhdGExLmNvbGxpZGVkIDogZmFsc2U7XG5cbiAgICAgIC8vIGNvbnNvbGUubG9nKGJyZWFrYWJsZTAsIGJyZWFrYWJsZTEsIGNvbGxpZGVkMCwgY29sbGlkZWQxKTtcblxuICAgICAgaWYgKCAoICEgYnJlYWthYmxlMCAmJiAhIGJyZWFrYWJsZTEgKSB8fCAoIGNvbGxpZGVkMCAmJiBjb2xsaWRlZDEgKSApIHtcblx0Y29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGxldCBjb250YWN0ID0gZmFsc2U7XG4gICAgICBsZXQgbWF4SW1wdWxzZSA9IDA7XG4gICAgICBmb3IgKCBsZXQgaiA9IDAsIGpsID0gY29udGFjdE1hbmlmb2xkLmdldE51bUNvbnRhY3RzKCk7IGogPCBqbDsgaiArKyApIHtcblxuXHRjb25zdCBjb250YWN0UG9pbnQgPSBjb250YWN0TWFuaWZvbGQuZ2V0Q29udGFjdFBvaW50KCBqICk7XG5cbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2NvbnRhY3RQb2ludC5nZXREaXN0YW5jZSgpJywgY29udGFjdFBvaW50LmdldERpc3RhbmNlKCkpO1xuXHRpZiAoIGNvbnRhY3RQb2ludC5nZXREaXN0YW5jZSgpIDwgMC4xICkge1xuXG5cdCAgY29udGFjdCA9IHRydWU7XG5cdCAgY29uc3QgaW1wdWxzZSA9IGNvbnRhY3RQb2ludC5nZXRBcHBsaWVkSW1wdWxzZSgpO1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdjb250YWN0JywgaW1wdWxzZSk7XG5cblx0ICBpZiAoIGltcHVsc2UgPiBtYXhJbXB1bHNlICkge1xuXG5cdCAgICBtYXhJbXB1bHNlID0gaW1wdWxzZTtcblx0ICAgIHZhciBwb3MgPSBjb250YWN0UG9pbnQuZ2V0X21fcG9zaXRpb25Xb3JsZE9uQigpO1xuXHQgICAgdmFyIG5vcm1hbCA9IGNvbnRhY3RQb2ludC5nZXRfbV9ub3JtYWxXb3JsZE9uQigpO1xuXHQgICAgdGhpcy5pbXBhY3RQb2ludCA9IHt4IDogcG9zLngoKSwgeTogcG9zLnkoKSwgeiA6IHBvcy56KCkgfTtcblx0ICAgIHRoaXMuaW1wYWN0Tm9ybWFsID0ge3ggOiBub3JtYWwueCgpLCB5OiBub3JtYWwueSgpLCB6IDogbm9ybWFsLnooKSB9O1xuXHQgIH1cblxuXHQgIC8vIGJyZWFrO1xuXHR9XG4gICAgICB9XG5cbiAgICAgIGlmICh1c2VyRGF0YTAuaXNBZ2VudCkge1xuICAgICAgICByYjAuc2V0QW5ndWxhclZlbG9jaXR5KG5ldyBzZWxmLkFtbW8uYnRWZWN0b3IzKCAwLCAwLCAwICkpO1xuICAgICAgfSBlbHNlIGlmICh1c2VyRGF0YTEuaXNBZ2VudCkge1xuICAgICAgICByYjEuc2V0QW5ndWxhclZlbG9jaXR5KG5ldyBzZWxmLkFtbW8uYnRWZWN0b3IzKCAwLCAwLCAwICkpO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiBubyBwb2ludCBoYXMgY29udGFjdCwgYWJvcnRcbiAgICAgIGlmICggIWNvbnRhY3QgfHwgKFxuICAgICAgICB0aGlzLmltcGFjdFBvaW50LnggPT09IDAgJiZcbiAgICAgICAgdGhpcy5pbXBhY3RQb2ludC55ID09PSAwICYmXG4gICAgICAgIHRoaXMuaW1wYWN0UG9pbnQueiA9PT0gMFxuICAgICAgKSApIGNvbnRpbnVlO1xuXG4gICAgICAvLyBjb25zb2xlLmxvZyhtYXhJbXB1bHNlKTtcblxuICAgICAgY29uc3Qgb2JqMGJyZWFrcyA9IGJyZWFrYWJsZTAgJiYgdXNlckRhdGExLmlzQWdlbnQgJiYgISBjb2xsaWRlZDAgJiYgbWF4SW1wdWxzZSA+IHRoaXMuZnJhY3R1cmVJbXB1bHNlO1xuICAgICAgY29uc3Qgb2JqMWJyZWFrcyA9IGJyZWFrYWJsZTEgJiYgdXNlckRhdGEwLmlzQWdlbnQgJiYgISBjb2xsaWRlZDEgJiYgbWF4SW1wdWxzZSA+IHRoaXMuZnJhY3R1cmVJbXB1bHNlO1xuXG4gICAgICAvLyBTdWJkaXZpc2lvblxuICAgICAgaWYgKG9iajBicmVha3MgfHwgb2JqMWJyZWFrcykge1xuICAgICAgICBsZXQgZGVicmlzO1xuXG4gICAgICAgIGlmIChvYmowYnJlYWtzKSB7XG4gICAgICAgICAgY29uc3QgdmVsID0gcmIwLmdldExpbmVhclZlbG9jaXR5KCk7XG5cdCAgY29uc3QgYW5nVmVsID0gcmIwLmdldEFuZ3VsYXJWZWxvY2l0eSgpO1xuXG4gICAgICAgICAgdGhpcy5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICB0YXNrOiAnc3ViZGl2aWRlQnlJbXBhY3QnLFxuICAgICAgICAgICAgaW1wYWN0UG9pbnQ6IFt0aGlzLmltcGFjdFBvaW50LngsIHRoaXMuaW1wYWN0UG9pbnQueSwgdGhpcy5pbXBhY3RQb2ludC56XSxcbiAgICAgICAgICAgIGltcGFjdE5vcm1hbDogW3RoaXMuaW1wYWN0Tm9ybWFsLngsIHRoaXMuaW1wYWN0Tm9ybWFsLnksIHRoaXMuaW1wYWN0Tm9ybWFsLnpdLFxuICAgICAgICAgICAgcm9sZTogcmIwLnVzZXJEYXRhLnJvbGUsXG4gICAgICAgICAgICBpZDogcmIwLnVzZXJEYXRhLmlkLFxuICAgICAgICAgICAgdmVsOiBbdmVsLngoKSwgdmVsLnkoKSwgdmVsLnooKV0sXG5cdCAgICBhbmdWZWw6IFthbmdWZWwueCgpLCBhbmdWZWwueSgpLCBhbmdWZWwueigpXSxcbiAgICAgICAgICB9KTtcblxuXHQgIHRoaXMub2JqZWN0c1RvUmVtb3ZlWyB0aGlzLm51bU9iamVjdHNUb1JlbW92ZSsrIF0gPSByYjA7XG5cdCAgdXNlckRhdGEwLmNvbGxpZGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob2JqMWJyZWFrcykge1xuICAgICAgICAgIGNvbnN0IHZlbCA9IHJiMS5nZXRMaW5lYXJWZWxvY2l0eSgpO1xuXHQgIGNvbnN0IGFuZ1ZlbCA9IHJiMS5nZXRBbmd1bGFyVmVsb2NpdHkoKTtcblxuICAgICAgICAgIHRoaXMucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgdGFzazogJ3N1YmRpdmlkZUJ5SW1wYWN0JyxcbiAgICAgICAgICAgIGltcGFjdFBvaW50OiBbdGhpcy5pbXBhY3RQb2ludC54LCB0aGlzLmltcGFjdFBvaW50LnksIHRoaXMuaW1wYWN0UG9pbnQuel0sXG4gICAgICAgICAgICBpbXBhY3ROb3JtYWw6IFt0aGlzLmltcGFjdE5vcm1hbC54LCB0aGlzLmltcGFjdE5vcm1hbC55LCB0aGlzLmltcGFjdE5vcm1hbC56XSxcbiAgICAgICAgICAgIHJvbGU6IHJiMS51c2VyRGF0YS5yb2xlLFxuICAgICAgICAgICAgaWQ6IHJiMS51c2VyRGF0YS5pZCxcbiAgICAgICAgICAgIHZlbDogW3ZlbC54KCksIHZlbC55KCksIHZlbC56KCldLFxuXHQgICAgYW5nVmVsOiBbYW5nVmVsLngoKSwgYW5nVmVsLnkoKSwgYW5nVmVsLnooKV0sXG4gICAgICAgICAgfSk7XG5cblx0ICB0aGlzLm9iamVjdHNUb1JlbW92ZVsgdGhpcy5udW1PYmplY3RzVG9SZW1vdmUrKyBdID0gcmIxO1xuXHQgIHVzZXJEYXRhMS5jb2xsaWRlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoKHVzZXJEYXRhMCAmJiB1c2VyRGF0YTAuaXNUYXJnZXQpIHx8ICh1c2VyRGF0YTEgJiYgdXNlckRhdGExLmlzVGFyZ2V0KSkge1xuXG4gICAgICAgICAgdGhpcy5zdG9wQWdlbnRBZnRlckltcGFjdCgpO1xuXG4gICAgICAgICAgLy8gY29uc3QgdGFyZ2V0ID0gdXNlckRhdGEwLmlzVGFyZ2V0ID8gcmIwIDogcmIxO1xuICAgICAgICAgIGNvbnN0IHRhcmdldFVzZXJEYXRhID0gdXNlckRhdGEwLmlzVGFyZ2V0ID8gdXNlckRhdGEwIDogdXNlckRhdGExO1xuXG4gICAgICAgICAgaWYgKHRhcmdldFVzZXJEYXRhLndhc0hpdCAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5wb3N0TWVzc2FnZSh7IHRhc2s6ICdwbGF5QXVkaW8nIH0pO1xuICAgICAgICAgICAgdGFyZ2V0VXNlckRhdGEud2FzSGl0ID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0vLyAgZWxzZSB7IC8vIGJvdW5jZVxuICAgICAgLy8gICBpZiAocmIwLnVzZXJEYXRhLmlzQWdlbnQpIHtcbiAgICAgIC8vICAgICB0aGlzLnN0b3BCb2R5QWZ0ZXJJbXBhY3QocmIxKTtcbiAgICAgIC8vICAgfSBlbHNlIGlmIChyYjEudXNlckRhdGEuaXNBZ2VudCkge1xuICAgICAgLy8gICAgIHRoaXMuc3RvcEJvZHlBZnRlckltcGFjdChyYjApO1xuICAgICAgLy8gICB9XG4gICAgICAvLyB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubnVtT2JqZWN0c1RvUmVtb3ZlKSB7XG4gICAgICB0aGlzLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgdGFzazogJ3JlbW92ZURlYnJpcycsXG4gICAgICAgIGRlYnJpczogdGhpcy5vYmplY3RzVG9SZW1vdmUubWFwKCh7IHVzZXJEYXRhOiB7IHJvbGUsIGlkIH19KSA9PiAoeyByb2xlLCBpZCB9KSksXG4gICAgICB9KTtcblxuICAgICAgZm9yICggdmFyIGkgPSAwOyBpIDwgdGhpcy5udW1PYmplY3RzVG9SZW1vdmU7IGkgKysgKSB7XG4gICAgICAgIHRoaXMucGh5c2ljc1dvcmxkLnJlbW92ZVJpZ2lkQm9keSh0aGlzLm9iamVjdHNUb1JlbW92ZVtpXSk7XG4gICAgICB9XG4gICAgICB0aGlzLm51bU9iamVjdHNUb1JlbW92ZSA9IDA7XG4gICAgfVxuICAgIFxuICB9XG5cbiAgY2xlYXJEZWJyaXMoZGVicmlzKSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgdGFzazogJ3JlbW92ZURlYnJpcycsXG4gICAgICAgIGRlYnJpczogZGVicmlzLm1hcCgoeyB1c2VyRGF0YTogeyByb2xlLCBpZCB9fSkgPT4gKHsgcm9sZSwgaWQgfSkpLFxuICAgICAgfSk7XG5cbiAgICAgIGZvciAoY29uc3QgZGVicmVlSW5kZXggaW4gZGVicmlzKSB7XG4gICAgICAgIHRoaXMucGh5c2ljc1dvcmxkLnJlbW92ZVJpZ2lkQm9keShkZWJyaXNbZGVicmVlSW5kZXhdKTtcbiAgICAgIH1cbiAgICB9LCB0aGlzLmRlYnJpc0xpZmV0aW1lTXMpO1xuICB9XG5cbiAgc3RvcEFnZW50QWZ0ZXJJbXBhY3QoKSB7XG4gICAgdGhpcy5hZ2VudEJvZHkuc2V0TGluZWFyVmVsb2NpdHkobmV3IHNlbGYuQW1tby5idFZlY3RvcjMoIDAsIDAsIDAgKSk7XG4gIH1cblxuICBzdG9wQm9keUFmdGVySW1wYWN0KGJvZHkpIHtcbiAgICAvLyBjb25zb2xlLmxvZygnc3RvcEJvZHlBZnRlckltcGFjdCcsIGJvZHkpO1xuICAgIC8vIGJvZHkuc2V0TGluZWFyVmVsb2NpdHkobmV3IHNlbGYuQW1tby5idFZlY3RvcjMoIDAsIDAsIDAgKSk7XG4gICAgLy8gYm9keS5zZXRNYXNzUHJvcHMoMCwgMCk7XG4gIH1cbn1cblxuc2VsZi5waHlzaWNzSW5zdGFuY2UgPSAnZHVtbXknO1xuXG5zZWxmLm9ubWVzc2FnZSA9IGFzeW5jIGZ1bmN0aW9uIChlKSB7XG4gIHN3aXRjaChlLmRhdGEudGFzaykge1xuICBjYXNlICdpbml0JzpcbiAgICBjb25zdCB7XG4gICAgICBhZ2VudFJhZGl1cywgYWdlbnRNYXNzLCBib3VuZGluZ1NwaGVyZVJhZGl1cywgZnJhY3R1cmVJbXB1bHNlLCBkZWJyaXNMaWZldGltZU1zLCB0YXJnZXRNYXNzLFxuICAgIH0gPSBlLmRhdGEubGliO1xuXG4gICAgc2VsZi5waHlzaWNzSW5zdGFuY2UgPSBuZXcgUGh5c2ljcyh7XG4gICAgICBhZ2VudFJhZGl1cywgYWdlbnRNYXNzLCBib3VuZGluZ1NwaGVyZVJhZGl1cywgZnJhY3R1cmVJbXB1bHNlLCBkZWJyaXNMaWZldGltZU1zLCB0YXJnZXRNYXNzLFxuICAgICAgcG9zdE1lc3NhZ2UobWVzc2FnZSkge1xuICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKG1lc3NhZ2UpO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGF3YWl0IHNlbGYucGh5c2ljc0luc3RhbmNlLmluaXQoKTtcblxuICAgIHNlbGYucG9zdE1lc3NhZ2UoeyB0YXNrOiAncmVhZHknIH0pO1xuXG4gICAgYnJlYWs7XG4gIGNhc2UgJ3NldEFnZW50JzpcblxuICAgIGNvbnN0IHsgcG9zaXRpb24gfSA9IGUuZGF0YTtcblxuICAgIHNlbGYucGh5c2ljc0luc3RhbmNlLnNldEFnZW50UGh5c2ljc0JvZHkocG9zaXRpb24pO1xuXG4gICAgYnJlYWs7XG4gIGNhc2UgJ3B1bmNoJzoge1xuICAgIGNvbnN0IHsgdmVjdG9yOiB7IHgsIHksIHogfSB9ID0gZS5kYXRhO1xuXG4gICAgc2VsZi5waHlzaWNzSW5zdGFuY2UuYWdlbnRCb2R5LmFwcGx5Rm9yY2UobmV3IHNlbGYuQW1tby5idFZlY3RvcjMoeCwgeSwgeikpO1xuXG4gICAgYnJlYWs7XG4gIH1cbiAgY2FzZSAnYWRkVGFyZ2V0Jzoge1xuICAgIGNvbnN0IHsgcG9zaXRpb24sIHF1YXRlcm5pb24sIHZlcnRleEFycmF5LCB0YXJnZXRJZCB9ID0gZS5kYXRhO1xuXG4gICAgc2VsZi5waHlzaWNzSW5zdGFuY2UuYWRkVGFyZ2V0KHBvc2l0aW9uLCBxdWF0ZXJuaW9uLCB2ZXJ0ZXhBcnJheSwgdGFyZ2V0SWQpO1xuXG4gICAgYnJlYWs7XG4gIH1cbiAgY2FzZSAnZnJlZXplJzoge1xuICAgIHNlbGYucGh5c2ljc0luc3RhbmNlLnN0b3BBZ2VudEFmdGVySW1wYWN0KCk7XG5cbiAgICBicmVhaztcbiAgfVxuICBjYXNlICdjcmVhdGVGcmFnbWVudHMnOiB7XG5cbiAgICBjb25zdCB7IGZyYWdtZW50cyB9ID0gZS5kYXRhO1xuXG4gICAgY29uc3QgbnVtT2JqZWN0cyA9IGZyYWdtZW50cy5sZW5ndGg7XG4gICAgY29uc3QgZGVicmlzID0gW107XG4gICAgZm9yICggbGV0IGogPSAwOyBqIDwgbnVtT2JqZWN0czsgaiArKyApIHtcbiAgICAgIGNvbnN0IFtcbiAgICAgICAgZnJhZ21lbnRJZCwgcG9zaXRpb24sIHF1YXRlcm5pb24sIHZlcnRleEFycmF5LCBtYXNzLCB2ZWxvY2l0eSwgYW5ndWxhclZlbG9jaXR5XG4gICAgICBdID0gZnJhZ21lbnRzWyBqIF07XG5cbiAgICAgIGNvbnN0IGJvZHkgPSBzZWxmLnBoeXNpY3NJbnN0YW5jZS5jcmVhdGVCcmVha2FibGVPYmplY3QoXG4gICAgICAgIGFycmF5VG9WZWMzU291cmNlKHBvc2l0aW9uKSxcbiAgICAgICAgYXJyYXlUb1ZlYzNTb3VyY2UocXVhdGVybmlvbiksXG4gICAgICAgIHZlcnRleEFycmF5LFxuICAgICAgICBtYXNzLFxuICAgICAgICBhcnJheVRvVmVjM1NvdXJjZSh2ZWxvY2l0eSksXG4gICAgICAgIGFycmF5VG9WZWMzU291cmNlKGFuZ3VsYXJWZWxvY2l0eSlcbiAgICAgICk7XG4gICAgICBib2R5LnVzZXJEYXRhID0gYm9keS51c2VyRGF0YSB8fCB7fTtcbiAgICAgIGJvZHkudXNlckRhdGEuaWQgPSBmcmFnbWVudElkO1xuICAgICAgYm9keS51c2VyRGF0YS5yb2xlID0gJ2ZyYWdtZW50JztcbiAgICAgIGJvZHkudXNlckRhdGEuaXNGcmFnbWVudCA9IHRydWU7XG4gICAgICBkZWJyaXMucHVzaChib2R5KTtcbiAgICB9XG5cbiAgICBzZWxmLnBoeXNpY3NJbnN0YW5jZS5jbGVhckRlYnJpcyhkZWJyaXMpO1xuICAgIFxuICAgIGJyZWFrO1xuICB9XG4gIH1cbn07XG4iXX0=
