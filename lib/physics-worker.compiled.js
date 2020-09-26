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

self.importScripts('lib/ammo.js', 'node_modules/@babel/polyfill/dist/polyfill.min.js');

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
      }

      var now = new Date().getTime();

      _this.update(now - _this.deltaTime);

      _this.deltaTime = now;
    });

    _defineProperty(this, "update", function (deltaTime) {
      _this.physicsWorld.stepSimulation(deltaTime * 5, 10); // Update objects


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
          }

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
      body.userData.collided = false;

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
        var collided1 = userData1 ? userData1.collided : false;

        if (!breakable0 && !breakable1 || collided0 && collided1) {
          continue;
        }

        var contact = false;
        var maxImpulse = 0;

        for (var j = 0, jl = contactManifold.getNumContacts(); j < jl; j++) {
          var contactPoint = contactManifold.getContactPoint(j);

          if (contactPoint.getDistance() < 0.1) {
            contact = true;
            var impulse = contactPoint.getAppliedImpulse();

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
            }
          }
        }

        if (userData0.isAgent) {
          rb0.setAngularVelocity(new self.Ammo.btVector3(0, 0, 0));
        } else if (userData1.isAgent) {
          rb1.setAngularVelocity(new self.Ammo.btVector3(0, 0, 0));
        } // If no point has contact, abort


        if (!contact || !this.impactPoint || this.impactPoint.x === 0 && this.impactPoint.y === 0 && this.impactPoint.z === 0) continue;
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
            this.stopAgentAfterImpact();
            var targetUserData = userData0.isTarget ? userData0 : userData1;

            if (targetUserData.wasHit !== true) {
              this.postMessage({
                task: 'playAudio'
              });
              targetUserData.wasHit = true;
            }
          }
        }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvcGh5c2ljcy9waHlzaWNzLXdvcmtlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQUEsSUFBSSxDQUFDLGFBQUwsQ0FDRSxhQURGLEVBRUUsbURBRkY7O0FBS0EsU0FBUyxpQkFBVCxDQUEyQixHQUEzQixFQUFnQztBQUM5QixNQUFNLE1BQU0sR0FBRztBQUFDLElBQUEsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFELENBQVA7QUFBWSxJQUFBLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBRCxDQUFsQjtBQUF1QixJQUFBLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBRDtBQUE3QixHQUFmOztBQUNBLE1BQUksR0FBRyxDQUFDLENBQUQsQ0FBUCxFQUFZO0FBQ1YsSUFBQSxNQUFNLENBQUMsQ0FBUCxHQUFXLEdBQUcsQ0FBQyxDQUFELENBQWQ7QUFDRDs7QUFDRCxTQUFPLE1BQVA7QUFDRDs7SUFFSyxPO0FBb0JKLHlCQUdHO0FBQUE7O0FBQUEsUUFGRCxXQUVDLFFBRkQsV0FFQztBQUFBLFFBRlksU0FFWixRQUZZLFNBRVo7QUFBQSxRQUZ1QixvQkFFdkIsUUFGdUIsb0JBRXZCO0FBQUEsUUFGNkMsZUFFN0MsUUFGNkMsZUFFN0M7QUFBQSxRQUY4RCxnQkFFOUQsUUFGOEQsZ0JBRTlEO0FBQUEsUUFGZ0YsVUFFaEYsUUFGZ0YsVUFFaEY7QUFBQSxRQURELFdBQ0MsUUFERCxXQUNDOztBQUFBOztBQUFBLG9EQXRCc0IsSUFzQnRCOztBQUFBLHdDQXJCVSxJQXFCVjs7QUFBQSx3Q0FwQlUsSUFvQlY7O0FBQUEsb0NBbkJNLElBbUJOOztBQUFBLDBDQWxCWSxJQWtCWjs7QUFBQSwwQ0FqQlksSUFpQlo7O0FBQUEsMENBaEJZLElBZ0JaOztBQUFBLDBDQWZZLElBZVo7O0FBQUEsMENBZFksSUFjWjs7QUFBQSxvQ0FiTSxDQWFO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LENBQUMsR0FBRyxVQUFyQixFQUFpQyxDQUFDLEVBQWxDLEVBQXdDO0FBQUEsNENBR2xDLFNBQVMsQ0FBRSxDQUFGLENBSHlCLE1BRXBDLFVBRm9DLG9CQUV4QixVQUZ3QixvQkFFZCxXQUZjLG9CQUVGLFlBRkUsb0JBRVcsSUFGWCxvQkFFaUIsUUFGakIsb0JBRTJCLGVBRjNCO0FBS2hDLGNBQUEsSUFMZ0MsR0FLekIsSUFBSSxDQUFDLGVBQUwsQ0FBcUIscUJBQXJCLENBQ1gsaUJBQWlCLENBQUMsVUFBRCxDQUROLEVBRVgsaUJBQWlCLENBQUMsV0FBRCxDQUZOLEVBR1gsWUFIVyxFQUlYLElBSlcsRUFLWCxpQkFBaUIsQ0FBQyxRQUFELENBTE4sRUFNWCxpQkFBaUIsQ0FBQyxlQUFELENBTk4sQ0FMeUI7QUFhdEMsY0FBQSxJQUFJLENBQUMsUUFBTCxHQUFnQixJQUFJLENBQUMsUUFBTCxJQUFpQixFQUFqQztBQUNBLGNBQUEsSUFBSSxDQUFDLFFBQUwsQ0FBYyxFQUFkLEdBQW1CLFVBQW5CO0FBQ0EsY0FBQSxJQUFJLENBQUMsUUFBTCxDQUFjLElBQWQsR0FBcUIsVUFBckI7QUFDQSxjQUFBLElBQUksQ0FBQyxRQUFMLENBQWMsVUFBZCxHQUEyQixJQUEzQjtBQUNBLGNBQUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxJQUFaO0FBQ0Q7O0FBRUQsWUFBQSxJQUFJLENBQUMsZUFBTCxDQUFxQixXQUFyQixDQUFpQyxNQUFqQztBQXZFYTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQUFqQjs7QUFBQTtBQUFBO0FBQUE7QUFBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsInNlbGYuaW1wb3J0U2NyaXB0cyhcbiAgJ2xpYi9hbW1vLmpzJyxcbiAgJ25vZGVfbW9kdWxlcy9AYmFiZWwvcG9seWZpbGwvZGlzdC9wb2x5ZmlsbC5taW4uanMnLFxuKTtcblxuZnVuY3Rpb24gYXJyYXlUb1ZlYzNTb3VyY2UoYXJyKSB7XG4gIGNvbnN0IHJlc3VsdCA9IHt4OiBhcnJbMF0sIHk6IGFyclsxXSwgejogYXJyWzJdfTtcbiAgaWYgKGFyclszXSkge1xuICAgIHJlc3VsdC53ID0gYXJyWzNdO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmNsYXNzIFBoeXNpY3Mge1xuICBjb2xsaXNpb25Db25maWd1cmF0aW9uID0gbnVsbFxuICBkaXNwYXRjaGVyID0gbnVsbFxuICBicm9hZHBoYXNlID0gbnVsbFxuICBzb2x2ZXIgPSBudWxsXG4gIHBoeXNpY3NXb3JsZCA9IG51bGxcbiAgdHJhbnNmb3JtQXV4ID0gbnVsbFxuICB0ZW1wQnRWZWMzXzEgPSBudWxsXG4gIHRlbXBCdFZlYzNfMiA9IG51bGxcbiAgdGVtcEJ0VmVjM18zID0gbnVsbFxuICBtYXJnaW4gPSAwXG4gIGltcGFjdFBvaW50ID0gbnVsbFxuICBpbXBhY3ROb3JtYWwgPSBudWxsXG4gIG51bU9iamVjdHNUb1JlbW92ZSA9IDBcbiAgYWdlbnRCb2R5ID0gbnVsbFxuICBhZ2VudFJhZGl1cyA9IDBcbiAgYWdlbnRNYXNzID0gMFxuICB0YXJnZXRNYXNzID0gMFxuICBib3VuZGluZ1NwaGVyZVJhZGl1cyA9IDBcbiAgcG9zdE1lc3NhZ2UgPSBudWxsXG4gIGNvbnN0cnVjdG9yKHtcbiAgICBhZ2VudFJhZGl1cywgYWdlbnRNYXNzLCBib3VuZGluZ1NwaGVyZVJhZGl1cywgZnJhY3R1cmVJbXB1bHNlLCBkZWJyaXNMaWZldGltZU1zLCB0YXJnZXRNYXNzLFxuICAgIHBvc3RNZXNzYWdlLFxuICB9KSB7XG4gICAgdGhpcy5hZ2VudFJhZGl1cyA9IGFnZW50UmFkaXVzO1xuICAgIHRoaXMuYWdlbnRNYXNzID0gYWdlbnRNYXNzO1xuICAgIHRoaXMuYm91bmRpbmdTcGhlcmVSYWRpdXMgPSBib3VuZGluZ1NwaGVyZVJhZGl1cztcbiAgICB0aGlzLmZyYWN0dXJlSW1wdWxzZSA9IGZyYWN0dXJlSW1wdWxzZTtcbiAgICB0aGlzLmRlYnJpc0xpZmV0aW1lTXMgPSBkZWJyaXNMaWZldGltZU1zO1xuICAgIHRoaXMudGFyZ2V0TWFzcyA9IHRhcmdldE1hc3M7XG4gICAgdGhpcy5wb3N0TWVzc2FnZSA9IHBvc3RNZXNzYWdlO1xuICAgIHRoaXMub2JqZWN0c1RvUmVtb3ZlID0gW107XG4gICAgdGhpcy5keW5hbWljQm9kaWVzID0gW107XG4gIH1cbiAgaW5pdCgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBzZWxmLkFtbW8gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgc2VsZi5BbW1vKCkudGhlbigoIEFtbW9MaWIgKSA9PiB7XG4gICAgICAgICAgc2VsZi5BbW1vID0gc2VsZi5BbW1vID0gQW1tb0xpYjtcbiAgICAgICAgICB0aGlzLnRyYW5zZm9ybUF1eCA9IG5ldyBzZWxmLkFtbW8uYnRUcmFuc2Zvcm0oKTtcbiAgICAgICAgICB0aGlzLnRlbXBCdFZlYzNfMSA9IG5ldyBzZWxmLkFtbW8uYnRWZWN0b3IzKDAsMCwwKTtcbiAgICAgICAgICB0aGlzLnRlbXBCdFZlYzNfMiA9IG5ldyBzZWxmLkFtbW8uYnRWZWN0b3IzKDAsMCwwKTtcbiAgICAgICAgICB0aGlzLnRlbXBCdFZlYzNfMyA9IG5ldyBzZWxmLkFtbW8uYnRWZWN0b3IzKDAsMCwwKTtcbiAgICAgICAgICB0aGlzLmluaXRQaHlzaWNzKCk7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaW5pdFBoeXNpY3MoKTtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGluaXRQaHlzaWNzKCkge1xuICAgIC8vIFBoeXNpY3MgY29uZmlndXJhdGlvblxuICAgIHRoaXMuY29sbGlzaW9uQ29uZmlndXJhdGlvbiA9IG5ldyBzZWxmLkFtbW8uYnREZWZhdWx0Q29sbGlzaW9uQ29uZmlndXJhdGlvbigpO1xuICAgIHRoaXMuZGlzcGF0Y2hlciA9IG5ldyBzZWxmLkFtbW8uYnRDb2xsaXNpb25EaXNwYXRjaGVyKCB0aGlzLmNvbGxpc2lvbkNvbmZpZ3VyYXRpb24gKTtcbiAgICB0aGlzLmJyb2FkcGhhc2UgPSBuZXcgc2VsZi5BbW1vLmJ0RGJ2dEJyb2FkcGhhc2UoKTtcbiAgICB0aGlzLnNvbHZlciA9IG5ldyBzZWxmLkFtbW8uYnRTZXF1ZW50aWFsSW1wdWxzZUNvbnN0cmFpbnRTb2x2ZXIoKTtcbiAgICB0aGlzLnBoeXNpY3NXb3JsZCA9IG5ldyBzZWxmLkFtbW8uYnREaXNjcmV0ZUR5bmFtaWNzV29ybGQoXG4gICAgICB0aGlzLmRpc3BhdGNoZXIsXG4gICAgICB0aGlzLmJyb2FkcGhhc2UsXG4gICAgICB0aGlzLnNvbHZlcixcbiAgICAgIHRoaXMuY29sbGlzaW9uQ29uZmlndXJhdGlvbixcbiAgICApO1xuICAgIC8vIEdyYXZpdHkgd2lsbCBiZSBzZXQgZHluYW1pY2FsbHksIGRlcGVuZGluZyBvbiBjYW1lcmEgcG9zaXRpb24uXG4gICAgdGhpcy5waHlzaWNzV29ybGQuc2V0R3Jhdml0eShuZXcgc2VsZi5BbW1vLmJ0VmVjdG9yMyggMCwgMCwgMCApKTtcblxuICAgIHRoaXMuc3RhcnRMb29wKCk7XG4gIH1cbiAgc3RhcnRMb29wKCkge1xuICAgIHRoaXMubG9vcCgpO1xuICB9XG4gIGRlbHRhVGltZSA9IChuZXcgRGF0ZSkuZ2V0VGltZSgpXG4gIGxvb3AgPSAoKSA9PiB7XG4gICAgaWYgKHNlbGYucmVxdWVzdEFuaW1hdGlvbkZyYW1lKSB7XG4gICAgICBzZWxmLnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmxvb3ApO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZXRUaW1lb3V0KHRoaXMubG9vcCwgMTAwMC82MCk7XG4gICAgfVxuXG4gICAgY29uc3Qgbm93ID0gKG5ldyBEYXRlKS5nZXRUaW1lKCk7XG5cbiAgICB0aGlzLnVwZGF0ZShub3cgLSB0aGlzLmRlbHRhVGltZSk7XG4gICAgdGhpcy5kZWx0YVRpbWUgPSBub3c7XG4gIH1cbiAgc2V0QWdlbnRQaHlzaWNzQm9keSh7IHgsIHksIHogfSkge1xuICAgIGNvbnN0IHNoYXBlID0gbmV3IHNlbGYuQW1tby5idFNwaGVyZVNoYXBlKCB0aGlzLmFnZW50UmFkaXVzICk7XG5cbiAgICBzaGFwZS5zZXRNYXJnaW4oIHRoaXMubWFyZ2luICk7XG5cbiAgICBjb25zdCBsb2NhbEluZXJ0aWEgPSBuZXcgc2VsZi5BbW1vLmJ0VmVjdG9yMyggMCwgMCwgMCApO1xuXG4gICAgc2hhcGUuY2FsY3VsYXRlTG9jYWxJbmVydGlhKCB0aGlzLmFnZW50TWFzcywgbG9jYWxJbmVydGlhICk7XG5cbiAgICBjb25zdCB0cmFuc2Zvcm0gPSBuZXcgc2VsZi5BbW1vLmJ0VHJhbnNmb3JtKCk7XG5cbiAgICB0cmFuc2Zvcm0uc2V0SWRlbnRpdHkoKTtcblxuICAgIHRyYW5zZm9ybS5zZXRPcmlnaW4obmV3IHNlbGYuQW1tby5idFZlY3RvcjMoIHgsIHksIHogKSk7XG5cbiAgICBjb25zdCBtb3Rpb25TdGF0ZSA9IG5ldyBzZWxmLkFtbW8uYnREZWZhdWx0TW90aW9uU3RhdGUodHJhbnNmb3JtKTtcbiAgICBjb25zdCByYkluZm8gPSBuZXcgc2VsZi5BbW1vLmJ0UmlnaWRCb2R5Q29uc3RydWN0aW9uSW5mbyggdGhpcy5hZ2VudE1hc3MsIG1vdGlvblN0YXRlLCBzaGFwZSwgbG9jYWxJbmVydGlhICk7XG4gICAgY29uc3QgYm9keSA9IG5ldyBzZWxmLkFtbW8uYnRSaWdpZEJvZHkoIHJiSW5mbyApO1xuXG4gICAgYm9keS5zZXRBY3RpdmF0aW9uU3RhdGUoNCk7XG5cbiAgICBib2R5LnVzZXJEYXRhID0gYm9keS51c2VyRGF0YSB8fCB7fTtcbiAgICBib2R5LnVzZXJEYXRhLmlzQWdlbnQgPSB0cnVlO1xuICAgIGJvZHkudXNlckRhdGEucm9sZSA9ICdhZ2VudCc7XG4gICAgYm9keS51c2VyRGF0YS5pZCA9ICdhZ2VudCc7XG4gICAgYm9keS51c2VyRGF0YS5jb2xsaWRlZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5keW5hbWljQm9kaWVzLnB1c2goYm9keSk7XG4gICAgdGhpcy5hZ2VudEJvZHkgPSBib2R5O1xuXG4gICAgdGhpcy5waHlzaWNzV29ybGQuYWRkUmlnaWRCb2R5KCBib2R5ICk7XG4gIH1cblxuICBhZGRUYXJnZXQocG9zaXRpb24sIHF1YXRlcm5pb24sIHZlcnRleEFycmF5LCB0YXJnZXRJZCkge1xuICAgIGNvbnN0IHRhcmdldEJvZHkgPSB0aGlzLmNyZWF0ZUJyZWFrYWJsZU9iamVjdCggcG9zaXRpb24sIHF1YXRlcm5pb24sIHZlcnRleEFycmF5LCB0aGlzLnRhcmdldE1hc3MgKTtcblxuICAgIHRhcmdldEJvZHkudXNlckRhdGEgPSB0YXJnZXRCb2R5LnVzZXJEYXRhIHx8IHt9O1xuICAgIHRhcmdldEJvZHkudXNlckRhdGEuaXNUYXJnZXQgPSB0cnVlO1xuICAgIHRhcmdldEJvZHkudXNlckRhdGEucm9sZSA9ICd0YXJnZXQnO1xuICAgIHRhcmdldEJvZHkudXNlckRhdGEuaWQgPSB0YXJnZXRJZDtcbiAgICB0YXJnZXRCb2R5LnVzZXJEYXRhLmJyZWFrYWJsZSA9IHRydWU7XG4gIH1cblxuICBjcmVhdGVCcmVha2FibGVPYmplY3QocG9zaXRpb24sIHF1YXRlcm5pb24sIHZlcnRleEFycmF5LCBtYXNzLCB2ZWxvY2l0eSwgYW5ndWxhclZlbG9jaXR5KSB7XG4gICAgY29uc3Qgc2hhcGUgPSB0aGlzLmNyZWF0ZUNvbnZleEh1bGxQaHlzaWNzU2hhcGUoIHZlcnRleEFycmF5ICk7XG4gICAgc2hhcGUuc2V0TWFyZ2luKCB0aGlzLm1hcmdpbiApO1xuXG4gICAgY29uc3QgYm9keSA9IHRoaXMuY3JlYXRlUmlnaWRCb2R5KCBzaGFwZSwgbWFzcywgcG9zaXRpb24sIHF1YXRlcm5pb24sIHZlbG9jaXR5LCBhbmd1bGFyVmVsb2NpdHkgKTtcblxuICAgIHJldHVybiBib2R5O1xuICB9XG5cbiAgY3JlYXRlQ29udmV4SHVsbFBoeXNpY3NTaGFwZSggY29vcmRzICkge1xuICAgIGNvbnN0IHNoYXBlID0gbmV3IHNlbGYuQW1tby5idENvbnZleEh1bGxTaGFwZSgpO1xuXG4gICAgZm9yICggbGV0IGkgPSAwLCBpbCA9IGNvb3Jkcy5sZW5ndGg7IGkgPCBpbDsgaSArPSAzICkge1xuICAgICAgdGhpcy50ZW1wQnRWZWMzXzEuc2V0VmFsdWUoIGNvb3Jkc1sgaSBdLCBjb29yZHNbIGkgKyAxIF0sIGNvb3Jkc1sgaSArIDIgXSApO1xuICAgICAgY29uc3QgbGFzdE9uZSA9ICggaSA+PSAoIGlsIC0gMyApICk7XG4gICAgICBzaGFwZS5hZGRQb2ludCggdGhpcy50ZW1wQnRWZWMzXzEsIGxhc3RPbmUgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2hhcGU7XG4gIH1cblxuICBjcmVhdGVUcmlhbmdsZVBoeXNpY3NTaGFwZSggY29vcmRzICkge1xuICAgIGNvbnN0IG1lc2ggPSBuZXcgc2VsZi5BbW1vLmJ0VHJpYW5nbGVNZXNoKCk7XG5cbiAgICBmb3IgKCBsZXQgaSA9IDAsIGlsID0gY29vcmRzLmxlbmd0aDsgaSA8IGlsOyBpICs9IDkgKSB7XG4gICAgICB0aGlzLnRlbXBCdFZlYzNfMS5zZXRWYWx1ZSggY29vcmRzWyBpIF0sIGNvb3Jkc1sgaSArIDEgXSwgY29vcmRzWyBpICsgMiBdICk7XG4gICAgICB0aGlzLnRlbXBCdFZlYzNfMi5zZXRWYWx1ZSggY29vcmRzWyBpICsgMyBdLCBjb29yZHNbIGkgKyA0IF0sIGNvb3Jkc1sgaSArIDUgXSApO1xuICAgICAgdGhpcy50ZW1wQnRWZWMzXzMuc2V0VmFsdWUoIGNvb3Jkc1sgaSArIDYgXSwgY29vcmRzWyBpICsgNyBdLCBjb29yZHNbIGkgKyA4IF0gKTtcbiAgICAgIC8vY29uc3QgbGFzdE9uZSA9ICggaSA+PSAoIGlsIC0gMyApICk7XG4gICAgICBtZXNoLmFkZFRyaWFuZ2xlKCB0aGlzLnRlbXBCdFZlYzNfMSwgdGhpcy50ZW1wQnRWZWMzXzIsIHRoaXMudGVtcEJ0VmVjM18zKTtcbiAgICB9XG5cbiAgICBjb25zdCBzaGFwZSA9IG5ldyBzZWxmLkFtbW8uYnRCdmhUcmlhbmdsZU1lc2hTaGFwZShtZXNoKTtcblxuICAgIHJldHVybiBzaGFwZTtcbiAgfVxuXG4gIGNyZWF0ZVJpZ2lkQm9keSggcGh5c2ljc1NoYXBlLCBtYXNzLCBwb3MsIHF1YXQsIHZlbCwgYW5nVmVsICkge1xuICAgIGNvbnN0IHRyYW5zZm9ybSA9IG5ldyBzZWxmLkFtbW8uYnRUcmFuc2Zvcm0oKTtcbiAgICB0cmFuc2Zvcm0uc2V0SWRlbnRpdHkoKTtcbiAgICB0cmFuc2Zvcm0uc2V0T3JpZ2luKCBuZXcgc2VsZi5BbW1vLmJ0VmVjdG9yMyggcG9zLngsIHBvcy55LCBwb3MueiApICk7XG4gICAgdHJhbnNmb3JtLnNldFJvdGF0aW9uKCBuZXcgc2VsZi5BbW1vLmJ0UXVhdGVybmlvbiggcXVhdC54LCBxdWF0LnksIHF1YXQueiwgcXVhdC53ICkgKTtcbiAgICBjb25zdCBtb3Rpb25TdGF0ZSA9IG5ldyBzZWxmLkFtbW8uYnREZWZhdWx0TW90aW9uU3RhdGUoIHRyYW5zZm9ybSApO1xuXG4gICAgY29uc3QgbG9jYWxJbmVydGlhID0gbmV3IHNlbGYuQW1tby5idFZlY3RvcjMoIDAsIDAsIDAgKTtcbiAgICBwaHlzaWNzU2hhcGUuY2FsY3VsYXRlTG9jYWxJbmVydGlhKCBtYXNzLCBsb2NhbEluZXJ0aWEgKTtcblxuICAgIGNvbnN0IHJiSW5mbyA9IG5ldyBzZWxmLkFtbW8uYnRSaWdpZEJvZHlDb25zdHJ1Y3Rpb25JbmZvKCBtYXNzLCBtb3Rpb25TdGF0ZSwgcGh5c2ljc1NoYXBlLCBsb2NhbEluZXJ0aWEgKTtcbiAgICBjb25zdCBib2R5ID0gbmV3IHNlbGYuQW1tby5idFJpZ2lkQm9keSggcmJJbmZvICk7XG5cbiAgICBib2R5LnNldFJlc3RpdHV0aW9uKDEpO1xuXG4gICAgaWYgKCB2ZWwgKSB7XG4gICAgICBib2R5LnNldExpbmVhclZlbG9jaXR5KCBuZXcgc2VsZi5BbW1vLmJ0VmVjdG9yMyggdmVsLngsIHZlbC55LCB2ZWwueiApICk7XG4gICAgfVxuICAgIGlmICggYW5nVmVsICkge1xuICAgICAgYm9keS5zZXRBbmd1bGFyVmVsb2NpdHkoIG5ldyBzZWxmLkFtbW8uYnRWZWN0b3IzKCBhbmdWZWwueCwgYW5nVmVsLnksIGFuZ1ZlbC56ICkgKTtcbiAgICB9XG5cbiAgICBib2R5LnVzZXJEYXRhID0gYm9keS51c2VyRGF0YSB8fCB7fTtcbiAgICBib2R5LnVzZXJEYXRhLmNvbGxpZGVkID0gZmFsc2U7XG5cbiAgICBpZiAoIG1hc3MgPiAwICkge1xuICAgICAgdGhpcy5keW5hbWljQm9kaWVzLnB1c2goYm9keSk7XG4gICAgICAvLyBEaXNhYmxlIGRlYWN0aXZhdGlvblxuICAgICAgYm9keS5zZXRBY3RpdmF0aW9uU3RhdGUoIDQgKTtcbiAgICB9XG5cbiAgICB0aGlzLnBoeXNpY3NXb3JsZC5hZGRSaWdpZEJvZHkoIGJvZHkgKTtcblxuICAgIHJldHVybiBib2R5O1xuICB9XG5cbiAgdXBkYXRlID0gKCBkZWx0YVRpbWUgKSA9PiB7XG5cbiAgICB0aGlzLnBoeXNpY3NXb3JsZC5zdGVwU2ltdWxhdGlvbiggZGVsdGFUaW1lKjUsIDEwICk7XG5cbiAgICAvLyBVcGRhdGUgb2JqZWN0c1xuICAgIGZvciAoIGxldCBpID0gMCwgaWwgPSB0aGlzLmR5bmFtaWNCb2RpZXMubGVuZ3RoOyBpIDwgaWw7IGkgKysgKSB7XG5cbiAgICAgIGNvbnN0IG9ialBoeXMgPSB0aGlzLmR5bmFtaWNCb2RpZXNbIGkgXTtcbiAgICAgIGNvbnN0IG1vdGlvblN0YXRlID0gb2JqUGh5cy5nZXRNb3Rpb25TdGF0ZSgpO1xuXG4gICAgICBpZiAobW90aW9uU3RhdGUpIHtcbiAgICAgICAgbW90aW9uU3RhdGUuZ2V0V29ybGRUcmFuc2Zvcm0oIHRoaXMudHJhbnNmb3JtQXV4ICk7XG5cbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnRyYW5zZm9ybUF1eC5nZXRPcmlnaW4oKTtcbiAgICAgICAgY29uc3QgcXVhdGVybmlvbiA9IHRoaXMudHJhbnNmb3JtQXV4LmdldFJvdGF0aW9uKCk7XG5cbiAgICAgICAgY29uc3QgWyB4LCB5LCB6IF0gPSBbcG9zaXRpb24ueCgpLCBwb3NpdGlvbi55KCksIHBvc2l0aW9uLnooKV07XG5cbiAgICAgICAgaWYgKG9ialBoeXMudXNlckRhdGEuaXNBZ2VudCkge1xuICAgICAgICAgIGlmIChNYXRoLnNxcnQoTWF0aC5wb3coeCwgMikgKyBNYXRoLnBvdyh5LCAyKSArIE1hdGgucG93KHosIDIpKSA+IHRoaXMuYm91bmRpbmdTcGhlcmVSYWRpdXMpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcEFnZW50QWZ0ZXJJbXBhY3QoKTtcbiAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtQXV4LnNldE9yaWdpbihuZXcgc2VsZi5BbW1vLmJ0VmVjdG9yMyhcbiAgICAgICAgICAgICAgb2JqUGh5cy51c2VyRGF0YS5wcmV2UG9zaXRpb24ueCxcbiAgICAgICAgICAgICAgb2JqUGh5cy51c2VyRGF0YS5wcmV2UG9zaXRpb24ueSxcbiAgICAgICAgICAgICAgb2JqUGh5cy51c2VyRGF0YS5wcmV2UG9zaXRpb24ueixcbiAgICAgICAgICAgICkpO1xuICAgICAgICAgICAgdGhpcy5hZ2VudEJvZHkuc2V0V29ybGRUcmFuc2Zvcm0odGhpcy50cmFuc2Zvcm1BdXgpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9ialBoeXMudXNlckRhdGEucHJldlBvc2l0aW9uID0geyB4LCB5LCB6IH07XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgdGFzazogJ3VwZGF0ZScsXG4gICAgICAgICAgcm9sZTogb2JqUGh5cy51c2VyRGF0YS5yb2xlLFxuICAgICAgICAgIGlkOiBvYmpQaHlzLnVzZXJEYXRhLmlkLFxuICAgICAgICAgIHBvc2l0aW9uOiB7IHgsIHksIHogfSxcbiAgICAgICAgICBxdWF0ZXJuaW9uOiBbcXVhdGVybmlvbi54KCksIHF1YXRlcm5pb24ueSgpLCBxdWF0ZXJuaW9uLnooKSwgcXVhdGVybmlvbi53KCldLFxuICAgICAgICB9KTtcblxuICAgICAgICBvYmpQaHlzLnVzZXJEYXRhLmNvbGxpZGVkID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5wcm9jZXNzQ29sbGlzaW9ucygpO1xuICB9XG5cbiAgcHJvY2Vzc0NvbGxpc2lvbnMoKSB7XG4gICAgZm9yICggbGV0IGkgPSAwLCBpbCA9IHRoaXMuZGlzcGF0Y2hlci5nZXROdW1NYW5pZm9sZHMoKTsgaSA8IGlsOyBpICsrICkge1xuXG4gICAgICBjb25zdCBjb250YWN0TWFuaWZvbGQgPSB0aGlzLmRpc3BhdGNoZXIuZ2V0TWFuaWZvbGRCeUluZGV4SW50ZXJuYWwoIGkgKTtcbiAgICAgIGNvbnN0IHJiMCA9IHNlbGYuQW1tby5jYXN0T2JqZWN0KCBjb250YWN0TWFuaWZvbGQuZ2V0Qm9keTAoKSwgc2VsZi5BbW1vLmJ0UmlnaWRCb2R5ICk7XG4gICAgICBjb25zdCByYjEgPSBzZWxmLkFtbW8uY2FzdE9iamVjdCggY29udGFjdE1hbmlmb2xkLmdldEJvZHkxKCksIHNlbGYuQW1tby5idFJpZ2lkQm9keSApO1xuXG4gICAgICBjb25zdCB1c2VyRGF0YTAgPSByYjAudXNlckRhdGEgfHwgbnVsbDtcbiAgICAgIGNvbnN0IHVzZXJEYXRhMSA9IHJiMS51c2VyRGF0YSB8fCBudWxsO1xuXG4gICAgICBpZiAoICF1c2VyRGF0YTAgfHwgIXVzZXJEYXRhMSApIHtcblx0Y29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGJyZWFrYWJsZTAgPSB1c2VyRGF0YTAgPyB1c2VyRGF0YTAuYnJlYWthYmxlOiBmYWxzZTtcbiAgICAgIGNvbnN0IGJyZWFrYWJsZTEgPSB1c2VyRGF0YTEgPyB1c2VyRGF0YTEuYnJlYWthYmxlIDogZmFsc2U7XG5cbiAgICAgIGNvbnN0IGNvbGxpZGVkMCA9IHVzZXJEYXRhMCA/IHVzZXJEYXRhMC5jb2xsaWRlZCA6IGZhbHNlO1xuICAgICAgY29uc3QgY29sbGlkZWQxID0gdXNlckRhdGExID8gdXNlckRhdGExLmNvbGxpZGVkIDogZmFsc2U7XG5cbiAgICAgIGlmICggKCAhIGJyZWFrYWJsZTAgJiYgISBicmVha2FibGUxICkgfHwgKCBjb2xsaWRlZDAgJiYgY29sbGlkZWQxICkgKSB7XG5cdGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBsZXQgY29udGFjdCA9IGZhbHNlO1xuICAgICAgbGV0IG1heEltcHVsc2UgPSAwO1xuICAgICAgZm9yICggbGV0IGogPSAwLCBqbCA9IGNvbnRhY3RNYW5pZm9sZC5nZXROdW1Db250YWN0cygpOyBqIDwgamw7IGogKysgKSB7XG5cblx0Y29uc3QgY29udGFjdFBvaW50ID0gY29udGFjdE1hbmlmb2xkLmdldENvbnRhY3RQb2ludCggaiApO1xuXG5cdGlmICggY29udGFjdFBvaW50LmdldERpc3RhbmNlKCkgPCAwLjEgKSB7XG5cblx0ICBjb250YWN0ID0gdHJ1ZTtcblx0ICBjb25zdCBpbXB1bHNlID0gY29udGFjdFBvaW50LmdldEFwcGxpZWRJbXB1bHNlKCk7XG5cblx0ICBpZiAoIGltcHVsc2UgPiBtYXhJbXB1bHNlICkge1xuXG5cdCAgICBtYXhJbXB1bHNlID0gaW1wdWxzZTtcblx0ICAgIHZhciBwb3MgPSBjb250YWN0UG9pbnQuZ2V0X21fcG9zaXRpb25Xb3JsZE9uQigpO1xuXHQgICAgdmFyIG5vcm1hbCA9IGNvbnRhY3RQb2ludC5nZXRfbV9ub3JtYWxXb3JsZE9uQigpO1xuXHQgICAgdGhpcy5pbXBhY3RQb2ludCA9IHt4IDogcG9zLngoKSwgeTogcG9zLnkoKSwgeiA6IHBvcy56KCkgfTtcblx0ICAgIHRoaXMuaW1wYWN0Tm9ybWFsID0ge3ggOiBub3JtYWwueCgpLCB5OiBub3JtYWwueSgpLCB6IDogbm9ybWFsLnooKSB9O1xuXHQgIH1cblx0fVxuICAgICAgfVxuXG4gICAgICBpZiAodXNlckRhdGEwLmlzQWdlbnQpIHtcbiAgICAgICAgcmIwLnNldEFuZ3VsYXJWZWxvY2l0eShuZXcgc2VsZi5BbW1vLmJ0VmVjdG9yMyggMCwgMCwgMCApKTtcbiAgICAgIH0gZWxzZSBpZiAodXNlckRhdGExLmlzQWdlbnQpIHtcbiAgICAgICAgcmIxLnNldEFuZ3VsYXJWZWxvY2l0eShuZXcgc2VsZi5BbW1vLmJ0VmVjdG9yMyggMCwgMCwgMCApKTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgbm8gcG9pbnQgaGFzIGNvbnRhY3QsIGFib3J0XG4gICAgICBpZiAoICFjb250YWN0IHx8ICF0aGlzLmltcGFjdFBvaW50IHx8IChcbiAgICAgICAgdGhpcy5pbXBhY3RQb2ludC54ID09PSAwICYmXG4gICAgICAgIHRoaXMuaW1wYWN0UG9pbnQueSA9PT0gMCAmJlxuICAgICAgICB0aGlzLmltcGFjdFBvaW50LnogPT09IDBcbiAgICAgICkgKSBjb250aW51ZTtcblxuICAgICAgY29uc3Qgb2JqMGJyZWFrcyA9IGJyZWFrYWJsZTAgJiYgdXNlckRhdGExLmlzQWdlbnQgJiYgISBjb2xsaWRlZDAgJiYgbWF4SW1wdWxzZSA+IHRoaXMuZnJhY3R1cmVJbXB1bHNlO1xuICAgICAgY29uc3Qgb2JqMWJyZWFrcyA9IGJyZWFrYWJsZTEgJiYgdXNlckRhdGEwLmlzQWdlbnQgJiYgISBjb2xsaWRlZDEgJiYgbWF4SW1wdWxzZSA+IHRoaXMuZnJhY3R1cmVJbXB1bHNlO1xuXG4gICAgICAvLyBTdWJkaXZpc2lvblxuICAgICAgaWYgKG9iajBicmVha3MgfHwgb2JqMWJyZWFrcykge1xuICAgICAgICBsZXQgZGVicmlzO1xuXG4gICAgICAgIGlmIChvYmowYnJlYWtzKSB7XG4gICAgICAgICAgY29uc3QgdmVsID0gcmIwLmdldExpbmVhclZlbG9jaXR5KCk7XG5cdCAgY29uc3QgYW5nVmVsID0gcmIwLmdldEFuZ3VsYXJWZWxvY2l0eSgpO1xuXG4gICAgICAgICAgdGhpcy5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICB0YXNrOiAnc3ViZGl2aWRlQnlJbXBhY3QnLFxuICAgICAgICAgICAgaW1wYWN0UG9pbnQ6IFt0aGlzLmltcGFjdFBvaW50LngsIHRoaXMuaW1wYWN0UG9pbnQueSwgdGhpcy5pbXBhY3RQb2ludC56XSxcbiAgICAgICAgICAgIGltcGFjdE5vcm1hbDogW3RoaXMuaW1wYWN0Tm9ybWFsLngsIHRoaXMuaW1wYWN0Tm9ybWFsLnksIHRoaXMuaW1wYWN0Tm9ybWFsLnpdLFxuICAgICAgICAgICAgcm9sZTogcmIwLnVzZXJEYXRhLnJvbGUsXG4gICAgICAgICAgICBpZDogcmIwLnVzZXJEYXRhLmlkLFxuICAgICAgICAgICAgdmVsOiBbdmVsLngoKSwgdmVsLnkoKSwgdmVsLnooKV0sXG5cdCAgICBhbmdWZWw6IFthbmdWZWwueCgpLCBhbmdWZWwueSgpLCBhbmdWZWwueigpXSxcbiAgICAgICAgICB9KTtcblxuXHQgIHRoaXMub2JqZWN0c1RvUmVtb3ZlWyB0aGlzLm51bU9iamVjdHNUb1JlbW92ZSsrIF0gPSByYjA7XG5cdCAgdXNlckRhdGEwLmNvbGxpZGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob2JqMWJyZWFrcykge1xuICAgICAgICAgIGNvbnN0IHZlbCA9IHJiMS5nZXRMaW5lYXJWZWxvY2l0eSgpO1xuXHQgIGNvbnN0IGFuZ1ZlbCA9IHJiMS5nZXRBbmd1bGFyVmVsb2NpdHkoKTtcblxuICAgICAgICAgIHRoaXMucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgdGFzazogJ3N1YmRpdmlkZUJ5SW1wYWN0JyxcbiAgICAgICAgICAgIGltcGFjdFBvaW50OiBbdGhpcy5pbXBhY3RQb2ludC54LCB0aGlzLmltcGFjdFBvaW50LnksIHRoaXMuaW1wYWN0UG9pbnQuel0sXG4gICAgICAgICAgICBpbXBhY3ROb3JtYWw6IFt0aGlzLmltcGFjdE5vcm1hbC54LCB0aGlzLmltcGFjdE5vcm1hbC55LCB0aGlzLmltcGFjdE5vcm1hbC56XSxcbiAgICAgICAgICAgIHJvbGU6IHJiMS51c2VyRGF0YS5yb2xlLFxuICAgICAgICAgICAgaWQ6IHJiMS51c2VyRGF0YS5pZCxcbiAgICAgICAgICAgIHZlbDogW3ZlbC54KCksIHZlbC55KCksIHZlbC56KCldLFxuXHQgICAgYW5nVmVsOiBbYW5nVmVsLngoKSwgYW5nVmVsLnkoKSwgYW5nVmVsLnooKV0sXG4gICAgICAgICAgfSk7XG5cblx0ICB0aGlzLm9iamVjdHNUb1JlbW92ZVsgdGhpcy5udW1PYmplY3RzVG9SZW1vdmUrKyBdID0gcmIxO1xuXHQgIHVzZXJEYXRhMS5jb2xsaWRlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoKHVzZXJEYXRhMCAmJiB1c2VyRGF0YTAuaXNUYXJnZXQpIHx8ICh1c2VyRGF0YTEgJiYgdXNlckRhdGExLmlzVGFyZ2V0KSkge1xuXG4gICAgICAgICAgdGhpcy5zdG9wQWdlbnRBZnRlckltcGFjdCgpO1xuXG4gICAgICAgICAgY29uc3QgdGFyZ2V0VXNlckRhdGEgPSB1c2VyRGF0YTAuaXNUYXJnZXQgPyB1c2VyRGF0YTAgOiB1c2VyRGF0YTE7XG5cbiAgICAgICAgICBpZiAodGFyZ2V0VXNlckRhdGEud2FzSGl0ICE9PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLnBvc3RNZXNzYWdlKHsgdGFzazogJ3BsYXlBdWRpbycgfSk7XG4gICAgICAgICAgICB0YXJnZXRVc2VyRGF0YS53YXNIaXQgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLm51bU9iamVjdHNUb1JlbW92ZSkge1xuICAgICAgdGhpcy5wb3N0TWVzc2FnZSh7XG4gICAgICAgIHRhc2s6ICdyZW1vdmVEZWJyaXMnLFxuICAgICAgICBkZWJyaXM6IHRoaXMub2JqZWN0c1RvUmVtb3ZlLm1hcCgoeyB1c2VyRGF0YTogeyByb2xlLCBpZCB9fSkgPT4gKHsgcm9sZSwgaWQgfSkpLFxuICAgICAgfSk7XG5cbiAgICAgIGZvciAoIHZhciBpID0gMDsgaSA8IHRoaXMubnVtT2JqZWN0c1RvUmVtb3ZlOyBpICsrICkge1xuICAgICAgICB0aGlzLnBoeXNpY3NXb3JsZC5yZW1vdmVSaWdpZEJvZHkodGhpcy5vYmplY3RzVG9SZW1vdmVbaV0pO1xuICAgICAgfVxuICAgICAgdGhpcy5udW1PYmplY3RzVG9SZW1vdmUgPSAwO1xuICAgIH1cbiAgICBcbiAgfVxuXG4gIGNsZWFyRGVicmlzKGRlYnJpcykge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5wb3N0TWVzc2FnZSh7XG4gICAgICAgIHRhc2s6ICdyZW1vdmVEZWJyaXMnLFxuICAgICAgICBkZWJyaXM6IGRlYnJpcy5tYXAoKHsgdXNlckRhdGE6IHsgcm9sZSwgaWQgfX0pID0+ICh7IHJvbGUsIGlkIH0pKSxcbiAgICAgIH0pO1xuXG4gICAgICBmb3IgKGNvbnN0IGRlYnJlZUluZGV4IGluIGRlYnJpcykge1xuICAgICAgICB0aGlzLnBoeXNpY3NXb3JsZC5yZW1vdmVSaWdpZEJvZHkoZGVicmlzW2RlYnJlZUluZGV4XSk7XG4gICAgICB9XG4gICAgfSwgdGhpcy5kZWJyaXNMaWZldGltZU1zKTtcbiAgfVxuXG4gIHN0b3BBZ2VudEFmdGVySW1wYWN0KCkge1xuICAgIHRoaXMuYWdlbnRCb2R5LnNldExpbmVhclZlbG9jaXR5KG5ldyBzZWxmLkFtbW8uYnRWZWN0b3IzKCAwLCAwLCAwICkpO1xuICB9XG59XG5cbnNlbGYucGh5c2ljc0luc3RhbmNlID0gJ2R1bW15Jztcblxuc2VsZi5vbm1lc3NhZ2UgPSBhc3luYyBmdW5jdGlvbiAoZSkge1xuICBzd2l0Y2goZS5kYXRhLnRhc2spIHtcbiAgY2FzZSAnaW5pdCc6XG4gICAgY29uc3Qge1xuICAgICAgYWdlbnRSYWRpdXMsIGFnZW50TWFzcywgYm91bmRpbmdTcGhlcmVSYWRpdXMsIGZyYWN0dXJlSW1wdWxzZSwgZGVicmlzTGlmZXRpbWVNcywgdGFyZ2V0TWFzcyxcbiAgICB9ID0gZS5kYXRhLmxpYjtcblxuICAgIHNlbGYucGh5c2ljc0luc3RhbmNlID0gbmV3IFBoeXNpY3Moe1xuICAgICAgYWdlbnRSYWRpdXMsIGFnZW50TWFzcywgYm91bmRpbmdTcGhlcmVSYWRpdXMsIGZyYWN0dXJlSW1wdWxzZSwgZGVicmlzTGlmZXRpbWVNcywgdGFyZ2V0TWFzcyxcbiAgICAgIHBvc3RNZXNzYWdlKG1lc3NhZ2UpIHtcbiAgICAgICAgc2VsZi5wb3N0TWVzc2FnZShtZXNzYWdlKTtcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBhd2FpdCBzZWxmLnBoeXNpY3NJbnN0YW5jZS5pbml0KCk7XG5cbiAgICBzZWxmLnBvc3RNZXNzYWdlKHsgdGFzazogJ3JlYWR5JyB9KTtcblxuICAgIGJyZWFrO1xuICBjYXNlICdzZXRBZ2VudCc6XG5cbiAgICBjb25zdCB7IHBvc2l0aW9uIH0gPSBlLmRhdGE7XG5cbiAgICBzZWxmLnBoeXNpY3NJbnN0YW5jZS5zZXRBZ2VudFBoeXNpY3NCb2R5KHBvc2l0aW9uKTtcblxuICAgIGJyZWFrO1xuICBjYXNlICdwdW5jaCc6IHtcbiAgICBjb25zdCB7IHZlY3RvcjogeyB4LCB5LCB6IH0gfSA9IGUuZGF0YTtcblxuICAgIHNlbGYucGh5c2ljc0luc3RhbmNlLmFnZW50Qm9keS5hcHBseUZvcmNlKG5ldyBzZWxmLkFtbW8uYnRWZWN0b3IzKHgsIHksIHopKTtcblxuICAgIGJyZWFrO1xuICB9XG4gIGNhc2UgJ2FkZFRhcmdldCc6IHtcbiAgICBjb25zdCB7IHBvc2l0aW9uLCBxdWF0ZXJuaW9uLCB2ZXJ0ZXhBcnJheSwgdGFyZ2V0SWQgfSA9IGUuZGF0YTtcblxuICAgIHNlbGYucGh5c2ljc0luc3RhbmNlLmFkZFRhcmdldChwb3NpdGlvbiwgcXVhdGVybmlvbiwgdmVydGV4QXJyYXksIHRhcmdldElkKTtcblxuICAgIGJyZWFrO1xuICB9XG4gIGNhc2UgJ2ZyZWV6ZSc6IHtcbiAgICBzZWxmLnBoeXNpY3NJbnN0YW5jZS5zdG9wQWdlbnRBZnRlckltcGFjdCgpO1xuXG4gICAgYnJlYWs7XG4gIH1cbiAgY2FzZSAnY3JlYXRlRnJhZ21lbnRzJzoge1xuXG4gICAgY29uc3QgeyBmcmFnbWVudHMgfSA9IGUuZGF0YTtcblxuICAgIGNvbnN0IG51bU9iamVjdHMgPSBmcmFnbWVudHMubGVuZ3RoO1xuICAgIGNvbnN0IGRlYnJpcyA9IFtdO1xuICAgIGZvciAoIGxldCBqID0gMDsgaiA8IG51bU9iamVjdHM7IGogKysgKSB7XG4gICAgICBjb25zdCBbXG4gICAgICAgIGZyYWdtZW50SWQsIHBvc2l0aW9uLCBxdWF0ZXJuaW9uLCB2ZXJ0ZXhBcnJheSwgbWFzcywgdmVsb2NpdHksIGFuZ3VsYXJWZWxvY2l0eVxuICAgICAgXSA9IGZyYWdtZW50c1sgaiBdO1xuXG4gICAgICBjb25zdCBib2R5ID0gc2VsZi5waHlzaWNzSW5zdGFuY2UuY3JlYXRlQnJlYWthYmxlT2JqZWN0KFxuICAgICAgICBhcnJheVRvVmVjM1NvdXJjZShwb3NpdGlvbiksXG4gICAgICAgIGFycmF5VG9WZWMzU291cmNlKHF1YXRlcm5pb24pLFxuICAgICAgICB2ZXJ0ZXhBcnJheSxcbiAgICAgICAgbWFzcyxcbiAgICAgICAgYXJyYXlUb1ZlYzNTb3VyY2UodmVsb2NpdHkpLFxuICAgICAgICBhcnJheVRvVmVjM1NvdXJjZShhbmd1bGFyVmVsb2NpdHkpXG4gICAgICApO1xuICAgICAgYm9keS51c2VyRGF0YSA9IGJvZHkudXNlckRhdGEgfHwge307XG4gICAgICBib2R5LnVzZXJEYXRhLmlkID0gZnJhZ21lbnRJZDtcbiAgICAgIGJvZHkudXNlckRhdGEucm9sZSA9ICdmcmFnbWVudCc7XG4gICAgICBib2R5LnVzZXJEYXRhLmlzRnJhZ21lbnQgPSB0cnVlO1xuICAgICAgZGVicmlzLnB1c2goYm9keSk7XG4gICAgfVxuXG4gICAgc2VsZi5waHlzaWNzSW5zdGFuY2UuY2xlYXJEZWJyaXMoZGVicmlzKTtcbiAgICBcbiAgICBicmVhaztcbiAgfVxuICB9XG59O1xuIl19
