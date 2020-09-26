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

self.importScripts('./ammo.js', '../node_modules/@babel/polyfill/dist/polyfill.min.js');

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvcGh5c2ljcy9waHlzaWNzLXdvcmtlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQUEsSUFBSSxDQUFDLGFBQUwsQ0FDRSxXQURGLEVBRUUsc0RBRkY7O0FBS0EsU0FBUyxpQkFBVCxDQUEyQixHQUEzQixFQUFnQztBQUM5QixNQUFNLE1BQU0sR0FBRztBQUFDLElBQUEsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFELENBQVA7QUFBWSxJQUFBLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBRCxDQUFsQjtBQUF1QixJQUFBLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBRDtBQUE3QixHQUFmOztBQUNBLE1BQUksR0FBRyxDQUFDLENBQUQsQ0FBUCxFQUFZO0FBQ1YsSUFBQSxNQUFNLENBQUMsQ0FBUCxHQUFXLEdBQUcsQ0FBQyxDQUFELENBQWQ7QUFDRDs7QUFDRCxTQUFPLE1BQVA7QUFDRDs7SUFFSyxPO0FBb0JKLHlCQUdHO0FBQUE7O0FBQUEsUUFGRCxXQUVDLFFBRkQsV0FFQztBQUFBLFFBRlksU0FFWixRQUZZLFNBRVo7QUFBQSxRQUZ1QixvQkFFdkIsUUFGdUIsb0JBRXZCO0FBQUEsUUFGNkMsZUFFN0MsUUFGNkMsZUFFN0M7QUFBQSxRQUY4RCxnQkFFOUQsUUFGOEQsZ0JBRTlEO0FBQUEsUUFGZ0YsVUFFaEYsUUFGZ0YsVUFFaEY7QUFBQSxRQURELFdBQ0MsUUFERCxXQUNDOztBQUFBOztBQUFBLG9EQXRCc0IsSUFzQnRCOztBQUFBLHdDQXJCVSxJQXFCVjs7QUFBQSx3Q0FwQlUsSUFvQlY7O0FBQUEsb0NBbkJNLElBbUJOOztBQUFBLDBDQWxCWSxJQWtCWjs7QUFBQSwwQ0FqQlksSUFpQlo7O0FBQUEsMENBaEJZLElBZ0JaOztBQUFBLDBDQWZZLElBZVo7O0FBQUEsMENBZFksSUFjWjs7QUFBQSxvQ0FiTSxDQWFOOztBQUFBLHlDQVpXLElBWVg7O0FBQUEsMENBWFksSUFXWjs7QUFBQSxnREFWa0IsQ0FVbEI7O0FBQUEsdUNBVFMsSUFTVDs7QUFBQSx5Q0FSVyxDQVFYOztBQUFBLHVDQVBTLENBT1Q7O0FBQUEsd0NBTlUsQ0FNVjs7QUFBQSxrREFMb0IsQ0FLcEI7O0FBQUEseUNBSlcsSUFJWDs7QUFBQSx1Q0FpRFUsSUFBSSxJQUFKLEVBQUQsQ0FBVyxPQUFYLEVBakRUOztBQUFBLGtDQWtESSxZQUFNO0FBQ1gsVUFBSSxJQUFJLENBQUMscUJBQVQsRUFBZ0M7QUFDOUIsUUFBQSxJQUFJLENBQUMscUJBQUwsQ0FBMkIsS0FBSSxDQUFDLElBQWhDO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsUUFBQSxVQUFVLENBQUMsS0FBSSxDQUFDLElBQU4sRUFBWSxPQUFLLEVBQWpCLENBQVY7QUFDRDs7QUFFRCxVQUFNLEdBQUcsR0FBSSxJQUFJLElBQUosRUFBRCxDQUFXLE9BQVgsRUFBWjs7QUFFQSxNQUFBLEtBQUksQ0FBQyxNQUFMLENBQVksR0FBRyxHQUFHLEtBQUksQ0FBQyxTQUF2Qjs7QUFDQSxNQUFBLEtBQUksQ0FBQyxTQUFMLEdBQWlCLEdBQWpCO0FBQ0QsS0E3REU7O0FBQUEsb0NBa0xNLFVBQUUsU0FBRixFQUFpQjtBQUV4QixNQUFBLEtBQUksQ0FBQyxZQUFMLENBQWtCLGNBQWxCLENBQWtDLFNBQVMsR0FBQyxDQUE1QyxFQUErQyxFQUEvQyxFQUZ3QixDQUl4Qjs7O0FBQ0EsV0FBTSxJQUFJLENBQUMsR0FBRyxDQUFSLEVBQVcsRUFBRSxHQUFHLEtBQUksQ0FBQyxhQUFMLENBQW1CLE1BQXpDLEVBQWlELENBQUMsR0FBRyxFQUFyRCxFQUF5RCxDQUFDLEVBQTFELEVBQWdFO0FBRTlELFlBQU0sT0FBTyxHQUFHLEtBQUksQ0FBQyxhQUFMLENBQW9CLENBQXBCLENBQWhCO0FBQ0EsWUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLGNBQVIsRUFBcEI7O0FBRUEsWUFBSSxXQUFKLEVBQWlCO0FBQ2YsVUFBQSxXQUFXLENBQUMsaUJBQVosQ0FBK0IsS0FBSSxDQUFDLFlBQXBDOztBQUVBLGNBQU0sUUFBUSxHQUFHLEtBQUksQ0FBQyxZQUFMLENBQWtCLFNBQWxCLEVBQWpCOztBQUNBLGNBQU0sVUFBVSxHQUFHLEtBQUksQ0FBQyxZQUFMLENBQWtCLFdBQWxCLEVBQW5COztBQUplLHNCQU1LLENBQUMsUUFBUSxDQUFDLENBQVQsRUFBRCxFQUFlLFFBQVEsQ0FBQyxDQUFULEVBQWYsRUFBNkIsUUFBUSxDQUFDLENBQVQsRUFBN0IsQ0FOTDtBQUFBLGNBTVAsQ0FOTztBQUFBLGNBTUosQ0FOSTtBQUFBLGNBTUQsQ0FOQzs7QUFRZixjQUFJLE9BQU8sQ0FBQyxRQUFSLENBQWlCLE9BQXJCLEVBQThCO0FBQzVCLGdCQUFJLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFULEVBQVksQ0FBWixJQUFpQixJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxDQUFaLENBQWpCLEdBQWtDLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVCxFQUFZLENBQVosQ0FBNUMsSUFBOEQsS0FBSSxDQUFDLG9CQUF2RSxFQUE2RjtBQUMzRixjQUFBLEtBQUksQ0FBQyxvQkFBTDs7QUFDQSxjQUFBLEtBQUksQ0FBQyxZQUFMLENBQWtCLFNBQWxCLENBQTRCLElBQUksSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFkLENBQzFCLE9BQU8sQ0FBQyxRQUFSLENBQWlCLFlBQWpCLENBQThCLENBREosRUFFMUIsT0FBTyxDQUFDLFFBQVIsQ0FBaUIsWUFBakIsQ0FBOEIsQ0FGSixFQUcxQixPQUFPLENBQUMsUUFBUixDQUFpQixZQUFqQixDQUE4QixDQUhKLENBQTVCOztBQUtBLGNBQUEsS0FBSSxDQUFDLFNBQUwsQ0FBZSxpQkFBZixDQUFpQyxLQUFJLENBQUMsWUFBdEM7O0FBQ0E7QUFDRCxhQVRELE1BU087QUFDTCxjQUFBLE9BQU8sQ0FBQyxRQUFSLENBQWlCLFlBQWpCLEdBQWdDO0FBQUUsZ0JBQUEsQ0FBQyxFQUFELENBQUY7QUFBSyxnQkFBQSxDQUFDLEVBQUQsQ0FBTDtBQUFRLGdCQUFBLENBQUMsRUFBRDtBQUFSLGVBQWhDO0FBQ0Q7QUFDRjs7QUFFRCxVQUFBLEtBQUksQ0FBQyxXQUFMLENBQWlCO0FBQ2YsWUFBQSxJQUFJLEVBQUUsUUFEUztBQUVmLFlBQUEsSUFBSSxFQUFFLE9BQU8sQ0FBQyxRQUFSLENBQWlCLElBRlI7QUFHZixZQUFBLEVBQUUsRUFBRSxPQUFPLENBQUMsUUFBUixDQUFpQixFQUhOO0FBSWYsWUFBQSxRQUFRLEVBQUU7QUFBRSxjQUFBLENBQUMsRUFBRCxDQUFGO0FBQUssY0FBQSxDQUFDLEVBQUQsQ0FBTDtBQUFRLGNBQUEsQ0FBQyxFQUFEO0FBQVIsYUFKSztBQUtmLFlBQUEsVUFBVSxFQUFFLENBQUMsVUFBVSxDQUFDLENBQVgsRUFBRCxFQUFpQixVQUFVLENBQUMsQ0FBWCxFQUFqQixFQUFpQyxVQUFVLENBQUMsQ0FBWCxFQUFqQyxFQUFpRCxVQUFVLENBQUMsQ0FBWCxFQUFqRDtBQUxHLFdBQWpCOztBQVFBLFVBQUEsT0FBTyxDQUFDLFFBQVIsQ0FBaUIsUUFBakIsR0FBNEIsS0FBNUI7QUFDRDtBQUNGOztBQUVELE1BQUEsS0FBSSxDQUFDLGlCQUFMO0FBQ0QsS0FoT0U7O0FBQ0QsU0FBSyxXQUFMLEdBQW1CLFdBQW5CO0FBQ0EsU0FBSyxTQUFMLEdBQWlCLFNBQWpCO0FBQ0EsU0FBSyxvQkFBTCxHQUE0QixvQkFBNUI7QUFDQSxTQUFLLGVBQUwsR0FBdUIsZUFBdkI7QUFDQSxTQUFLLGdCQUFMLEdBQXdCLGdCQUF4QjtBQUNBLFNBQUssVUFBTCxHQUFrQixVQUFsQjtBQUNBLFNBQUssV0FBTCxHQUFtQixXQUFuQjtBQUNBLFNBQUssZUFBTCxHQUF1QixFQUF2QjtBQUNBLFNBQUssYUFBTCxHQUFxQixFQUFyQjtBQUNEOzs7OzJCQUNNO0FBQUE7O0FBQ0wsYUFBTyxJQUFJLE9BQUosQ0FBWSxVQUFDLE9BQUQsRUFBVSxNQUFWLEVBQXFCO0FBQ3RDLFlBQUksT0FBTyxJQUFJLENBQUMsSUFBWixLQUFxQixVQUF6QixFQUFxQztBQUNuQyxVQUFBLElBQUksQ0FBQyxJQUFMLEdBQVksSUFBWixDQUFpQixVQUFFLE9BQUYsRUFBZTtBQUM5QixZQUFBLElBQUksQ0FBQyxJQUFMLEdBQVksSUFBSSxDQUFDLElBQUwsR0FBWSxPQUF4QjtBQUNBLFlBQUEsTUFBSSxDQUFDLFlBQUwsR0FBb0IsSUFBSSxJQUFJLENBQUMsSUFBTCxDQUFVLFdBQWQsRUFBcEI7QUFDQSxZQUFBLE1BQUksQ0FBQyxZQUFMLEdBQW9CLElBQUksSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFkLENBQXdCLENBQXhCLEVBQTBCLENBQTFCLEVBQTRCLENBQTVCLENBQXBCO0FBQ0EsWUFBQSxNQUFJLENBQUMsWUFBTCxHQUFvQixJQUFJLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBZCxDQUF3QixDQUF4QixFQUEwQixDQUExQixFQUE0QixDQUE1QixDQUFwQjtBQUNBLFlBQUEsTUFBSSxDQUFDLFlBQUwsR0FBb0IsSUFBSSxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQWQsQ0FBd0IsQ0FBeEIsRUFBMEIsQ0FBMUIsRUFBNEIsQ0FBNUIsQ0FBcEI7O0FBQ0EsWUFBQSxNQUFJLENBQUMsV0FBTDs7QUFDQSxZQUFBLE9BQU87QUFDUixXQVJEO0FBU0QsU0FWRCxNQVVPO0FBQ0wsVUFBQSxNQUFJLENBQUMsV0FBTDs7QUFDQSxVQUFBLE9BQU87QUFDUjtBQUNGLE9BZk0sQ0FBUDtBQWdCRDs7O2tDQUNhO0FBQ1o7QUFDQSxXQUFLLHNCQUFMLEdBQThCLElBQUksSUFBSSxDQUFDLElBQUwsQ0FBVSwrQkFBZCxFQUE5QjtBQUNBLFdBQUssVUFBTCxHQUFrQixJQUFJLElBQUksQ0FBQyxJQUFMLENBQVUscUJBQWQsQ0FBcUMsS0FBSyxzQkFBMUMsQ0FBbEI7QUFDQSxXQUFLLFVBQUwsR0FBa0IsSUFBSSxJQUFJLENBQUMsSUFBTCxDQUFVLGdCQUFkLEVBQWxCO0FBQ0EsV0FBSyxNQUFMLEdBQWMsSUFBSSxJQUFJLENBQUMsSUFBTCxDQUFVLG1DQUFkLEVBQWQ7QUFDQSxXQUFLLFlBQUwsR0FBb0IsSUFBSSxJQUFJLENBQUMsSUFBTCxDQUFVLHVCQUFkLENBQ2xCLEtBQUssVUFEYSxFQUVsQixLQUFLLFVBRmEsRUFHbEIsS0FBSyxNQUhhLEVBSWxCLEtBQUssc0JBSmEsQ0FBcEIsQ0FOWSxDQVlaOztBQUNBLFdBQUssWUFBTCxDQUFrQixVQUFsQixDQUE2QixJQUFJLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBZCxDQUF5QixDQUF6QixFQUE0QixDQUE1QixFQUErQixDQUEvQixDQUE3QjtBQUVBLFdBQUssU0FBTDtBQUNEOzs7Z0NBQ1c7QUFDVixXQUFLLElBQUw7QUFDRDs7OytDQWNnQztBQUFBLFVBQVgsQ0FBVyxTQUFYLENBQVc7QUFBQSxVQUFSLENBQVEsU0FBUixDQUFRO0FBQUEsVUFBTCxDQUFLLFNBQUwsQ0FBSztBQUMvQixVQUFNLEtBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFMLENBQVUsYUFBZCxDQUE2QixLQUFLLFdBQWxDLENBQWQ7QUFFQSxNQUFBLEtBQUssQ0FBQyxTQUFOLENBQWlCLEtBQUssTUFBdEI7QUFFQSxVQUFNLFlBQVksR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBZCxDQUF5QixDQUF6QixFQUE0QixDQUE1QixFQUErQixDQUEvQixDQUFyQjtBQUVBLE1BQUEsS0FBSyxDQUFDLHFCQUFOLENBQTZCLEtBQUssU0FBbEMsRUFBNkMsWUFBN0M7QUFFQSxVQUFNLFNBQVMsR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFMLENBQVUsV0FBZCxFQUFsQjtBQUVBLE1BQUEsU0FBUyxDQUFDLFdBQVY7QUFFQSxNQUFBLFNBQVMsQ0FBQyxTQUFWLENBQW9CLElBQUksSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFkLENBQXlCLENBQXpCLEVBQTRCLENBQTVCLEVBQStCLENBQS9CLENBQXBCO0FBRUEsVUFBTSxXQUFXLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBTCxDQUFVLG9CQUFkLENBQW1DLFNBQW5DLENBQXBCO0FBQ0EsVUFBTSxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBTCxDQUFVLDJCQUFkLENBQTJDLEtBQUssU0FBaEQsRUFBMkQsV0FBM0QsRUFBd0UsS0FBeEUsRUFBK0UsWUFBL0UsQ0FBZjtBQUNBLFVBQU0sSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUwsQ0FBVSxXQUFkLENBQTJCLE1BQTNCLENBQWI7QUFFQSxNQUFBLElBQUksQ0FBQyxrQkFBTCxDQUF3QixDQUF4QjtBQUVBLE1BQUEsSUFBSSxDQUFDLFFBQUwsR0FBZ0IsSUFBSSxDQUFDLFFBQUwsSUFBaUIsRUFBakM7QUFDQSxNQUFBLElBQUksQ0FBQyxRQUFMLENBQWMsT0FBZCxHQUF3QixJQUF4QjtBQUNBLE1BQUEsSUFBSSxDQUFDLFFBQUwsQ0FBYyxJQUFkLEdBQXFCLE9BQXJCO0FBQ0EsTUFBQSxJQUFJLENBQUMsUUFBTCxDQUFjLEVBQWQsR0FBbUIsT0FBbkI7QUFDQSxNQUFBLElBQUksQ0FBQyxRQUFMLENBQWMsUUFBZCxHQUF5QixLQUF6QjtBQUVBLFdBQUssYUFBTCxDQUFtQixJQUFuQixDQUF3QixJQUF4QjtBQUNBLFdBQUssU0FBTCxHQUFpQixJQUFqQjtBQUVBLFdBQUssWUFBTCxDQUFrQixZQUFsQixDQUFnQyxJQUFoQztBQUNEOzs7OEJBRVMsUSxFQUFVLFUsRUFBWSxXLEVBQWEsUSxFQUFVO0FBQ3JELFVBQU0sVUFBVSxHQUFHLEtBQUsscUJBQUwsQ0FBNEIsUUFBNUIsRUFBc0MsVUFBdEMsRUFBa0QsV0FBbEQsRUFBK0QsS0FBSyxVQUFwRSxDQUFuQjtBQUVBLE1BQUEsVUFBVSxDQUFDLFFBQVgsR0FBc0IsVUFBVSxDQUFDLFFBQVgsSUFBdUIsRUFBN0M7QUFDQSxNQUFBLFVBQVUsQ0FBQyxRQUFYLENBQW9CLFFBQXBCLEdBQStCLElBQS9CO0FBQ0EsTUFBQSxVQUFVLENBQUMsUUFBWCxDQUFvQixJQUFwQixHQUEyQixRQUEzQjtBQUNBLE1BQUEsVUFBVSxDQUFDLFFBQVgsQ0FBb0IsRUFBcEIsR0FBeUIsUUFBekI7QUFDQSxNQUFBLFVBQVUsQ0FBQyxRQUFYLENBQW9CLFNBQXBCLEdBQWdDLElBQWhDO0FBQ0Q7OzswQ0FFcUIsUSxFQUFVLFUsRUFBWSxXLEVBQWEsSSxFQUFNLFEsRUFBVSxlLEVBQWlCO0FBQ3hGLFVBQU0sS0FBSyxHQUFHLEtBQUssNEJBQUwsQ0FBbUMsV0FBbkMsQ0FBZDtBQUNBLE1BQUEsS0FBSyxDQUFDLFNBQU4sQ0FBaUIsS0FBSyxNQUF0QjtBQUVBLFVBQU0sSUFBSSxHQUFHLEtBQUssZUFBTCxDQUFzQixLQUF0QixFQUE2QixJQUE3QixFQUFtQyxRQUFuQyxFQUE2QyxVQUE3QyxFQUF5RCxRQUF6RCxFQUFtRSxlQUFuRSxDQUFiO0FBRUEsYUFBTyxJQUFQO0FBQ0Q7OztpREFFNkIsTSxFQUFTO0FBQ3JDLFVBQU0sS0FBSyxHQUFHLElBQUksSUFBSSxDQUFDLElBQUwsQ0FBVSxpQkFBZCxFQUFkOztBQUVBLFdBQU0sSUFBSSxDQUFDLEdBQUcsQ0FBUixFQUFXLEVBQUUsR0FBRyxNQUFNLENBQUMsTUFBN0IsRUFBcUMsQ0FBQyxHQUFHLEVBQXpDLEVBQTZDLENBQUMsSUFBSSxDQUFsRCxFQUFzRDtBQUNwRCxhQUFLLFlBQUwsQ0FBa0IsUUFBbEIsQ0FBNEIsTUFBTSxDQUFFLENBQUYsQ0FBbEMsRUFBeUMsTUFBTSxDQUFFLENBQUMsR0FBRyxDQUFOLENBQS9DLEVBQTBELE1BQU0sQ0FBRSxDQUFDLEdBQUcsQ0FBTixDQUFoRTtBQUNBLFlBQU0sT0FBTyxHQUFLLENBQUMsSUFBTSxFQUFFLEdBQUcsQ0FBOUI7QUFDQSxRQUFBLEtBQUssQ0FBQyxRQUFOLENBQWdCLEtBQUssWUFBckIsRUFBbUMsT0FBbkM7QUFDRDs7QUFFRCxhQUFPLEtBQVA7QUFDRDs7OytDQUUyQixNLEVBQVM7QUFDbkMsVUFBTSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBTCxDQUFVLGNBQWQsRUFBYjs7QUFFQSxXQUFNLElBQUksQ0FBQyxHQUFHLENBQVIsRUFBVyxFQUFFLEdBQUcsTUFBTSxDQUFDLE1BQTdCLEVBQXFDLENBQUMsR0FBRyxFQUF6QyxFQUE2QyxDQUFDLElBQUksQ0FBbEQsRUFBc0Q7QUFDcEQsYUFBSyxZQUFMLENBQWtCLFFBQWxCLENBQTRCLE1BQU0sQ0FBRSxDQUFGLENBQWxDLEVBQXlDLE1BQU0sQ0FBRSxDQUFDLEdBQUcsQ0FBTixDQUEvQyxFQUEwRCxNQUFNLENBQUUsQ0FBQyxHQUFHLENBQU4sQ0FBaEU7QUFDQSxhQUFLLFlBQUwsQ0FBa0IsUUFBbEIsQ0FBNEIsTUFBTSxDQUFFLENBQUMsR0FBRyxDQUFOLENBQWxDLEVBQTZDLE1BQU0sQ0FBRSxDQUFDLEdBQUcsQ0FBTixDQUFuRCxFQUE4RCxNQUFNLENBQUUsQ0FBQyxHQUFHLENBQU4sQ0FBcEU7QUFDQSxhQUFLLFlBQUwsQ0FBa0IsUUFBbEIsQ0FBNEIsTUFBTSxDQUFFLENBQUMsR0FBRyxDQUFOLENBQWxDLEVBQTZDLE1BQU0sQ0FBRSxDQUFDLEdBQUcsQ0FBTixDQUFuRCxFQUE4RCxNQUFNLENBQUUsQ0FBQyxHQUFHLENBQU4sQ0FBcEUsRUFIb0QsQ0FJcEQ7O0FBQ0EsUUFBQSxJQUFJLENBQUMsV0FBTCxDQUFrQixLQUFLLFlBQXZCLEVBQXFDLEtBQUssWUFBMUMsRUFBd0QsS0FBSyxZQUE3RDtBQUNEOztBQUVELFVBQU0sS0FBSyxHQUFHLElBQUksSUFBSSxDQUFDLElBQUwsQ0FBVSxzQkFBZCxDQUFxQyxJQUFyQyxDQUFkO0FBRUEsYUFBTyxLQUFQO0FBQ0Q7OztvQ0FFZ0IsWSxFQUFjLEksRUFBTSxHLEVBQUssSSxFQUFNLEcsRUFBSyxNLEVBQVM7QUFDNUQsVUFBTSxTQUFTLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBTCxDQUFVLFdBQWQsRUFBbEI7QUFDQSxNQUFBLFNBQVMsQ0FBQyxXQUFWO0FBQ0EsTUFBQSxTQUFTLENBQUMsU0FBVixDQUFxQixJQUFJLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBZCxDQUF5QixHQUFHLENBQUMsQ0FBN0IsRUFBZ0MsR0FBRyxDQUFDLENBQXBDLEVBQXVDLEdBQUcsQ0FBQyxDQUEzQyxDQUFyQjtBQUNBLE1BQUEsU0FBUyxDQUFDLFdBQVYsQ0FBdUIsSUFBSSxJQUFJLENBQUMsSUFBTCxDQUFVLFlBQWQsQ0FBNEIsSUFBSSxDQUFDLENBQWpDLEVBQW9DLElBQUksQ0FBQyxDQUF6QyxFQUE0QyxJQUFJLENBQUMsQ0FBakQsRUFBb0QsSUFBSSxDQUFDLENBQXpELENBQXZCO0FBQ0EsVUFBTSxXQUFXLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBTCxDQUFVLG9CQUFkLENBQW9DLFNBQXBDLENBQXBCO0FBRUEsVUFBTSxZQUFZLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQWQsQ0FBeUIsQ0FBekIsRUFBNEIsQ0FBNUIsRUFBK0IsQ0FBL0IsQ0FBckI7QUFDQSxNQUFBLFlBQVksQ0FBQyxxQkFBYixDQUFvQyxJQUFwQyxFQUEwQyxZQUExQztBQUVBLFVBQU0sTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUwsQ0FBVSwyQkFBZCxDQUEyQyxJQUEzQyxFQUFpRCxXQUFqRCxFQUE4RCxZQUE5RCxFQUE0RSxZQUE1RSxDQUFmO0FBQ0EsVUFBTSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBTCxDQUFVLFdBQWQsQ0FBMkIsTUFBM0IsQ0FBYjtBQUVBLE1BQUEsSUFBSSxDQUFDLGNBQUwsQ0FBb0IsQ0FBcEI7O0FBRUEsVUFBSyxHQUFMLEVBQVc7QUFDVCxRQUFBLElBQUksQ0FBQyxpQkFBTCxDQUF3QixJQUFJLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBZCxDQUF5QixHQUFHLENBQUMsQ0FBN0IsRUFBZ0MsR0FBRyxDQUFDLENBQXBDLEVBQXVDLEdBQUcsQ0FBQyxDQUEzQyxDQUF4QjtBQUNEOztBQUNELFVBQUssTUFBTCxFQUFjO0FBQ1osUUFBQSxJQUFJLENBQUMsa0JBQUwsQ0FBeUIsSUFBSSxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQWQsQ0FBeUIsTUFBTSxDQUFDLENBQWhDLEVBQW1DLE1BQU0sQ0FBQyxDQUExQyxFQUE2QyxNQUFNLENBQUMsQ0FBcEQsQ0FBekI7QUFDRDs7QUFFRCxNQUFBLElBQUksQ0FBQyxRQUFMLEdBQWdCLElBQUksQ0FBQyxRQUFMLElBQWlCLEVBQWpDO0FBQ0EsTUFBQSxJQUFJLENBQUMsUUFBTCxDQUFjLFFBQWQsR0FBeUIsS0FBekI7O0FBRUEsVUFBSyxJQUFJLEdBQUcsQ0FBWixFQUFnQjtBQUNkLGFBQUssYUFBTCxDQUFtQixJQUFuQixDQUF3QixJQUF4QixFQURjLENBRWQ7O0FBQ0EsUUFBQSxJQUFJLENBQUMsa0JBQUwsQ0FBeUIsQ0FBekI7QUFDRDs7QUFFRCxXQUFLLFlBQUwsQ0FBa0IsWUFBbEIsQ0FBZ0MsSUFBaEM7QUFFQSxhQUFPLElBQVA7QUFDRDs7O3dDQWtEbUI7QUFDbEIsV0FBTSxJQUFJLEVBQUMsR0FBRyxDQUFSLEVBQVcsRUFBRSxHQUFHLEtBQUssVUFBTCxDQUFnQixlQUFoQixFQUF0QixFQUF5RCxFQUFDLEdBQUcsRUFBN0QsRUFBaUUsRUFBQyxFQUFsRSxFQUF3RTtBQUV0RSxZQUFNLGVBQWUsR0FBRyxLQUFLLFVBQUwsQ0FBZ0IsMEJBQWhCLENBQTRDLEVBQTVDLENBQXhCO0FBQ0EsWUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUwsQ0FBVSxVQUFWLENBQXNCLGVBQWUsQ0FBQyxRQUFoQixFQUF0QixFQUFrRCxJQUFJLENBQUMsSUFBTCxDQUFVLFdBQTVELENBQVo7QUFDQSxZQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBTCxDQUFVLFVBQVYsQ0FBc0IsZUFBZSxDQUFDLFFBQWhCLEVBQXRCLEVBQWtELElBQUksQ0FBQyxJQUFMLENBQVUsV0FBNUQsQ0FBWjtBQUVBLFlBQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxRQUFKLElBQWdCLElBQWxDO0FBQ0EsWUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLFFBQUosSUFBZ0IsSUFBbEM7O0FBRUEsWUFBSyxDQUFDLFNBQUQsSUFBYyxDQUFDLFNBQXBCLEVBQWdDO0FBQ3JDO0FBQ007O0FBRUQsWUFBTSxVQUFVLEdBQUcsU0FBUyxHQUFHLFNBQVMsQ0FBQyxTQUFiLEdBQXdCLEtBQXBEO0FBQ0EsWUFBTSxVQUFVLEdBQUcsU0FBUyxHQUFHLFNBQVMsQ0FBQyxTQUFiLEdBQXlCLEtBQXJEO0FBRUEsWUFBTSxTQUFTLEdBQUcsU0FBUyxHQUFHLFNBQVMsQ0FBQyxRQUFiLEdBQXdCLEtBQW5EO0FBQ0EsWUFBTSxTQUFTLEdBQUcsU0FBUyxHQUFHLFNBQVMsQ0FBQyxRQUFiLEdBQXdCLEtBQW5EOztBQUVBLFlBQU8sQ0FBRSxVQUFGLElBQWdCLENBQUUsVUFBcEIsSUFBc0MsU0FBUyxJQUFJLFNBQXhELEVBQXNFO0FBQzNFO0FBQ007O0FBRUQsWUFBSSxPQUFPLEdBQUcsS0FBZDtBQUNBLFlBQUksVUFBVSxHQUFHLENBQWpCOztBQUNBLGFBQU0sSUFBSSxDQUFDLEdBQUcsQ0FBUixFQUFXLEVBQUUsR0FBRyxlQUFlLENBQUMsY0FBaEIsRUFBdEIsRUFBd0QsQ0FBQyxHQUFHLEVBQTVELEVBQWdFLENBQUMsRUFBakUsRUFBdUU7QUFFNUUsY0FBTSxZQUFZLEdBQUcsZUFBZSxDQUFDLGVBQWhCLENBQWlDLENBQWpDLENBQXJCOztBQUVBLGNBQUssWUFBWSxDQUFDLFdBQWIsS0FBNkIsR0FBbEMsRUFBd0M7QUFFdEMsWUFBQSxPQUFPLEdBQUcsSUFBVjtBQUNBLGdCQUFNLE9BQU8sR0FBRyxZQUFZLENBQUMsaUJBQWIsRUFBaEI7O0FBRUEsZ0JBQUssT0FBTyxHQUFHLFVBQWYsRUFBNEI7QUFFMUIsY0FBQSxVQUFVLEdBQUcsT0FBYjtBQUNBLGtCQUFJLEdBQUcsR0FBRyxZQUFZLENBQUMsc0JBQWIsRUFBVjtBQUNBLGtCQUFJLE1BQU0sR0FBRyxZQUFZLENBQUMsb0JBQWIsRUFBYjtBQUNBLG1CQUFLLFdBQUwsR0FBbUI7QUFBQyxnQkFBQSxDQUFDLEVBQUcsR0FBRyxDQUFDLENBQUosRUFBTDtBQUFjLGdCQUFBLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBSixFQUFqQjtBQUEwQixnQkFBQSxDQUFDLEVBQUcsR0FBRyxDQUFDLENBQUo7QUFBOUIsZUFBbkI7QUFDQSxtQkFBSyxZQUFMLEdBQW9CO0FBQUMsZ0JBQUEsQ0FBQyxFQUFHLE1BQU0sQ0FBQyxDQUFQLEVBQUw7QUFBaUIsZ0JBQUEsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFQLEVBQXBCO0FBQWdDLGdCQUFBLENBQUMsRUFBRyxNQUFNLENBQUMsQ0FBUDtBQUFwQyxlQUFwQjtBQUNEO0FBQ0Y7QUFDSzs7QUFFRCxZQUFJLFNBQVMsQ0FBQyxPQUFkLEVBQXVCO0FBQ3JCLFVBQUEsR0FBRyxDQUFDLGtCQUFKLENBQXVCLElBQUksSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFkLENBQXlCLENBQXpCLEVBQTRCLENBQTVCLEVBQStCLENBQS9CLENBQXZCO0FBQ0QsU0FGRCxNQUVPLElBQUksU0FBUyxDQUFDLE9BQWQsRUFBdUI7QUFDNUIsVUFBQSxHQUFHLENBQUMsa0JBQUosQ0FBdUIsSUFBSSxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQWQsQ0FBeUIsQ0FBekIsRUFBNEIsQ0FBNUIsRUFBK0IsQ0FBL0IsQ0FBdkI7QUFDRCxTQWpEcUUsQ0FtRHRFOzs7QUFDQSxZQUFLLENBQUMsT0FBRCxJQUFZLENBQUMsS0FBSyxXQUFsQixJQUNILEtBQUssV0FBTCxDQUFpQixDQUFqQixLQUF1QixDQUF2QixJQUNBLEtBQUssV0FBTCxDQUFpQixDQUFqQixLQUF1QixDQUR2QixJQUVBLEtBQUssV0FBTCxDQUFpQixDQUFqQixLQUF1QixDQUh6QixFQUlJO0FBRUosWUFBTSxVQUFVLEdBQUcsVUFBVSxJQUFJLFNBQVMsQ0FBQyxPQUF4QixJQUFtQyxDQUFFLFNBQXJDLElBQWtELFVBQVUsR0FBRyxLQUFLLGVBQXZGO0FBQ0EsWUFBTSxVQUFVLEdBQUcsVUFBVSxJQUFJLFNBQVMsQ0FBQyxPQUF4QixJQUFtQyxDQUFFLFNBQXJDLElBQWtELFVBQVUsR0FBRyxLQUFLLGVBQXZGLENBM0RzRSxDQTZEdEU7O0FBQ0EsWUFBSSxVQUFVLElBQUksVUFBbEIsRUFBOEI7QUFDNUIsY0FBSSxNQUFNLFNBQVY7O0FBRUEsY0FBSSxVQUFKLEVBQWdCO0FBQ2QsZ0JBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxpQkFBSixFQUFaO0FBQ1AsZ0JBQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxrQkFBSixFQUFmO0FBRU8saUJBQUssV0FBTCxDQUFpQjtBQUNmLGNBQUEsSUFBSSxFQUFFLG1CQURTO0FBRWYsY0FBQSxXQUFXLEVBQUUsQ0FBQyxLQUFLLFdBQUwsQ0FBaUIsQ0FBbEIsRUFBcUIsS0FBSyxXQUFMLENBQWlCLENBQXRDLEVBQXlDLEtBQUssV0FBTCxDQUFpQixDQUExRCxDQUZFO0FBR2YsY0FBQSxZQUFZLEVBQUUsQ0FBQyxLQUFLLFlBQUwsQ0FBa0IsQ0FBbkIsRUFBc0IsS0FBSyxZQUFMLENBQWtCLENBQXhDLEVBQTJDLEtBQUssWUFBTCxDQUFrQixDQUE3RCxDQUhDO0FBSWYsY0FBQSxJQUFJLEVBQUUsR0FBRyxDQUFDLFFBQUosQ0FBYSxJQUpKO0FBS2YsY0FBQSxFQUFFLEVBQUUsR0FBRyxDQUFDLFFBQUosQ0FBYSxFQUxGO0FBTWYsY0FBQSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBSixFQUFELEVBQVUsR0FBRyxDQUFDLENBQUosRUFBVixFQUFtQixHQUFHLENBQUMsQ0FBSixFQUFuQixDQU5VO0FBT3RCLGNBQUEsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQVAsRUFBRCxFQUFhLE1BQU0sQ0FBQyxDQUFQLEVBQWIsRUFBeUIsTUFBTSxDQUFDLENBQVAsRUFBekI7QUFQYyxhQUFqQjtBQVVQLGlCQUFLLGVBQUwsQ0FBc0IsS0FBSyxrQkFBTCxFQUF0QixJQUFvRCxHQUFwRDtBQUNBLFlBQUEsU0FBUyxDQUFDLFFBQVYsR0FBcUIsSUFBckI7QUFDTTs7QUFDRCxjQUFJLFVBQUosRUFBZ0I7QUFDZCxnQkFBTSxJQUFHLEdBQUcsR0FBRyxDQUFDLGlCQUFKLEVBQVo7O0FBQ1AsZ0JBQU0sT0FBTSxHQUFHLEdBQUcsQ0FBQyxrQkFBSixFQUFmOztBQUVPLGlCQUFLLFdBQUwsQ0FBaUI7QUFDZixjQUFBLElBQUksRUFBRSxtQkFEUztBQUVmLGNBQUEsV0FBVyxFQUFFLENBQUMsS0FBSyxXQUFMLENBQWlCLENBQWxCLEVBQXFCLEtBQUssV0FBTCxDQUFpQixDQUF0QyxFQUF5QyxLQUFLLFdBQUwsQ0FBaUIsQ0FBMUQsQ0FGRTtBQUdmLGNBQUEsWUFBWSxFQUFFLENBQUMsS0FBSyxZQUFMLENBQWtCLENBQW5CLEVBQXNCLEtBQUssWUFBTCxDQUFrQixDQUF4QyxFQUEyQyxLQUFLLFlBQUwsQ0FBa0IsQ0FBN0QsQ0FIQztBQUlmLGNBQUEsSUFBSSxFQUFFLEdBQUcsQ0FBQyxRQUFKLENBQWEsSUFKSjtBQUtmLGNBQUEsRUFBRSxFQUFFLEdBQUcsQ0FBQyxRQUFKLENBQWEsRUFMRjtBQU1mLGNBQUEsR0FBRyxFQUFFLENBQUMsSUFBRyxDQUFDLENBQUosRUFBRCxFQUFVLElBQUcsQ0FBQyxDQUFKLEVBQVYsRUFBbUIsSUFBRyxDQUFDLENBQUosRUFBbkIsQ0FOVTtBQU90QixjQUFBLE1BQU0sRUFBRSxDQUFDLE9BQU0sQ0FBQyxDQUFQLEVBQUQsRUFBYSxPQUFNLENBQUMsQ0FBUCxFQUFiLEVBQXlCLE9BQU0sQ0FBQyxDQUFQLEVBQXpCO0FBUGMsYUFBakI7QUFVUCxpQkFBSyxlQUFMLENBQXNCLEtBQUssa0JBQUwsRUFBdEIsSUFBb0QsR0FBcEQ7QUFDQSxZQUFBLFNBQVMsQ0FBQyxRQUFWLEdBQXFCLElBQXJCO0FBQ007O0FBRUQsY0FBSyxTQUFTLElBQUksU0FBUyxDQUFDLFFBQXhCLElBQXNDLFNBQVMsSUFBSSxTQUFTLENBQUMsUUFBakUsRUFBNEU7QUFFMUUsaUJBQUssb0JBQUw7QUFFQSxnQkFBTSxjQUFjLEdBQUcsU0FBUyxDQUFDLFFBQVYsR0FBcUIsU0FBckIsR0FBaUMsU0FBeEQ7O0FBRUEsZ0JBQUksY0FBYyxDQUFDLE1BQWYsS0FBMEIsSUFBOUIsRUFBb0M7QUFDbEMsbUJBQUssV0FBTCxDQUFpQjtBQUFFLGdCQUFBLElBQUksRUFBRTtBQUFSLGVBQWpCO0FBQ0EsY0FBQSxjQUFjLENBQUMsTUFBZixHQUF3QixJQUF4QjtBQUNEO0FBQ0Y7QUFDRjtBQUNGOztBQUVELFVBQUksS0FBSyxrQkFBVCxFQUE2QjtBQUMzQixhQUFLLFdBQUwsQ0FBaUI7QUFDZixVQUFBLElBQUksRUFBRSxjQURTO0FBRWYsVUFBQSxNQUFNLEVBQUUsS0FBSyxlQUFMLENBQXFCLEdBQXJCLENBQXlCO0FBQUEsdUNBQUcsUUFBSDtBQUFBLGdCQUFlLElBQWYsa0JBQWUsSUFBZjtBQUFBLGdCQUFxQixFQUFyQixrQkFBcUIsRUFBckI7QUFBQSxtQkFBZ0M7QUFBRSxjQUFBLElBQUksRUFBSixJQUFGO0FBQVEsY0FBQSxFQUFFLEVBQUY7QUFBUixhQUFoQztBQUFBLFdBQXpCO0FBRk8sU0FBakI7O0FBS0EsYUFBTSxJQUFJLENBQUMsR0FBRyxDQUFkLEVBQWlCLENBQUMsR0FBRyxLQUFLLGtCQUExQixFQUE4QyxDQUFDLEVBQS9DLEVBQXFEO0FBQ25ELGVBQUssWUFBTCxDQUFrQixlQUFsQixDQUFrQyxLQUFLLGVBQUwsQ0FBcUIsQ0FBckIsQ0FBbEM7QUFDRDs7QUFDRCxhQUFLLGtCQUFMLEdBQTBCLENBQTFCO0FBQ0Q7QUFFRjs7O2dDQUVXLE0sRUFBUTtBQUFBOztBQUNsQixNQUFBLFVBQVUsQ0FBQyxZQUFNO0FBQ2YsUUFBQSxNQUFJLENBQUMsV0FBTCxDQUFpQjtBQUNmLFVBQUEsSUFBSSxFQUFFLGNBRFM7QUFFZixVQUFBLE1BQU0sRUFBRSxNQUFNLENBQUMsR0FBUCxDQUFXO0FBQUEsdUNBQUcsUUFBSDtBQUFBLGdCQUFlLElBQWYsa0JBQWUsSUFBZjtBQUFBLGdCQUFxQixFQUFyQixrQkFBcUIsRUFBckI7QUFBQSxtQkFBZ0M7QUFBRSxjQUFBLElBQUksRUFBSixJQUFGO0FBQVEsY0FBQSxFQUFFLEVBQUY7QUFBUixhQUFoQztBQUFBLFdBQVg7QUFGTyxTQUFqQjs7QUFLQSxhQUFLLElBQU0sV0FBWCxJQUEwQixNQUExQixFQUFrQztBQUNoQyxVQUFBLE1BQUksQ0FBQyxZQUFMLENBQWtCLGVBQWxCLENBQWtDLE1BQU0sQ0FBQyxXQUFELENBQXhDO0FBQ0Q7QUFDRixPQVRTLEVBU1AsS0FBSyxnQkFURSxDQUFWO0FBVUQ7OzsyQ0FFc0I7QUFDckIsV0FBSyxTQUFMLENBQWUsaUJBQWYsQ0FBaUMsSUFBSSxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQWQsQ0FBeUIsQ0FBekIsRUFBNEIsQ0FBNUIsRUFBK0IsQ0FBL0IsQ0FBakM7QUFDRDs7Ozs7O0FBR0gsSUFBSSxDQUFDLGVBQUwsR0FBdUIsT0FBdkI7O0FBRUEsSUFBSSxDQUFDLFNBQUw7QUFBQSxzRUFBaUIsaUJBQWdCLENBQWhCO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSwwQkFDUixDQUFDLENBQUMsSUFBRixDQUFPLElBREM7QUFBQSw0Q0FFVixNQUZVLHVCQW1CVixVQW5CVSx1QkEwQlYsT0ExQlUsd0JBaUNWLFdBakNVLHdCQXdDVixRQXhDVSx3QkE2Q1YsaUJBN0NVO0FBQUE7O0FBQUE7QUFBQSwwQkFLVCxDQUFDLENBQUMsSUFBRixDQUFPLEdBTEUsRUFJWCxXQUpXLGVBSVgsV0FKVyxFQUlFLFNBSkYsZUFJRSxTQUpGLEVBSWEsb0JBSmIsZUFJYSxvQkFKYixFQUltQyxlQUpuQyxlQUltQyxlQUpuQyxFQUlvRCxnQkFKcEQsZUFJb0QsZ0JBSnBELEVBSXNFLFVBSnRFLGVBSXNFLFVBSnRFO0FBT2IsWUFBQSxJQUFJLENBQUMsZUFBTCxHQUF1QixJQUFJLE9BQUosQ0FBWTtBQUNqQyxjQUFBLFdBQVcsRUFBWCxXQURpQztBQUNwQixjQUFBLFNBQVMsRUFBVCxTQURvQjtBQUNULGNBQUEsb0JBQW9CLEVBQXBCLG9CQURTO0FBQ2EsY0FBQSxlQUFlLEVBQWYsZUFEYjtBQUM4QixjQUFBLGdCQUFnQixFQUFoQixnQkFEOUI7QUFDZ0QsY0FBQSxVQUFVLEVBQVYsVUFEaEQ7QUFFakMsY0FBQSxXQUZpQyx1QkFFckIsT0FGcUIsRUFFWjtBQUNuQixnQkFBQSxJQUFJLENBQUMsV0FBTCxDQUFpQixPQUFqQjtBQUNEO0FBSmdDLGFBQVosQ0FBdkI7QUFQYTtBQUFBLG1CQWNQLElBQUksQ0FBQyxlQUFMLENBQXFCLElBQXJCLEVBZE87O0FBQUE7QUFnQmIsWUFBQSxJQUFJLENBQUMsV0FBTCxDQUFpQjtBQUFFLGNBQUEsSUFBSSxFQUFFO0FBQVIsYUFBakI7QUFoQmE7O0FBQUE7QUFxQkwsWUFBQSxRQXJCSyxHQXFCUSxDQUFDLENBQUMsSUFyQlYsQ0FxQkwsUUFyQks7QUF1QmIsWUFBQSxJQUFJLENBQUMsZUFBTCxDQUFxQixtQkFBckIsQ0FBeUMsUUFBekM7QUF2QmE7O0FBQUE7QUFBQSw2QkEyQm1CLENBQUMsQ0FBQyxJQTNCckIsQ0EyQkwsTUEzQkssRUEyQkssQ0EzQkwsa0JBMkJLLENBM0JMLEVBMkJRLENBM0JSLGtCQTJCUSxDQTNCUixFQTJCVyxDQTNCWCxrQkEyQlcsQ0EzQlg7QUE2QmIsWUFBQSxJQUFJLENBQUMsZUFBTCxDQUFxQixTQUFyQixDQUErQixVQUEvQixDQUEwQyxJQUFJLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBZCxDQUF3QixDQUF4QixFQUEyQixDQUEzQixFQUE4QixDQUE5QixDQUExQztBQTdCYTs7QUFBQTtBQUFBLHNCQWtDMkMsQ0FBQyxDQUFDLElBbEM3QyxFQWtDTCxTQWxDSyxXQWtDTCxRQWxDSyxFQWtDSyxVQWxDTCxXQWtDSyxVQWxDTCxFQWtDaUIsV0FsQ2pCLFdBa0NpQixXQWxDakIsRUFrQzhCLFFBbEM5QixXQWtDOEIsUUFsQzlCO0FBb0NiLFlBQUEsSUFBSSxDQUFDLGVBQUwsQ0FBcUIsU0FBckIsQ0FBK0IsU0FBL0IsRUFBeUMsVUFBekMsRUFBcUQsV0FBckQsRUFBa0UsUUFBbEU7QUFwQ2E7O0FBQUE7QUF5Q2IsWUFBQSxJQUFJLENBQUMsZUFBTCxDQUFxQixvQkFBckI7QUF6Q2E7O0FBQUE7QUErQ0wsWUFBQSxTQS9DSyxHQStDUyxDQUFDLENBQUMsSUEvQ1gsQ0ErQ0wsU0EvQ0s7QUFpRFAsWUFBQSxVQWpETyxHQWlETSxTQUFTLENBQUMsTUFqRGhCO0FBa0RQLFlBQUEsTUFsRE8sR0FrREUsRUFsREY7O0FBbURiLGlCQUFVLENBQVYsR0FBYyxDQUFkLEVBQWlCLENBQUMsR0FBRyxVQUFyQixFQUFpQyxDQUFDLEVBQWxDLEVBQXdDO0FBQUEsNENBR2xDLFNBQVMsQ0FBRSxDQUFGLENBSHlCLE1BRXBDLFVBRm9DLG9CQUV4QixVQUZ3QixvQkFFZCxXQUZjLG9CQUVGLFlBRkUsb0JBRVcsSUFGWCxvQkFFaUIsUUFGakIsb0JBRTJCLGVBRjNCO0FBS2hDLGNBQUEsSUFMZ0MsR0FLekIsSUFBSSxDQUFDLGVBQUwsQ0FBcUIscUJBQXJCLENBQ1gsaUJBQWlCLENBQUMsVUFBRCxDQUROLEVBRVgsaUJBQWlCLENBQUMsV0FBRCxDQUZOLEVBR1gsWUFIVyxFQUlYLElBSlcsRUFLWCxpQkFBaUIsQ0FBQyxRQUFELENBTE4sRUFNWCxpQkFBaUIsQ0FBQyxlQUFELENBTk4sQ0FMeUI7QUFhdEMsY0FBQSxJQUFJLENBQUMsUUFBTCxHQUFnQixJQUFJLENBQUMsUUFBTCxJQUFpQixFQUFqQztBQUNBLGNBQUEsSUFBSSxDQUFDLFFBQUwsQ0FBYyxFQUFkLEdBQW1CLFVBQW5CO0FBQ0EsY0FBQSxJQUFJLENBQUMsUUFBTCxDQUFjLElBQWQsR0FBcUIsVUFBckI7QUFDQSxjQUFBLElBQUksQ0FBQyxRQUFMLENBQWMsVUFBZCxHQUEyQixJQUEzQjtBQUNBLGNBQUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxJQUFaO0FBQ0Q7O0FBRUQsWUFBQSxJQUFJLENBQUMsZUFBTCxDQUFxQixXQUFyQixDQUFpQyxNQUFqQztBQXZFYTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQUFqQjs7QUFBQTtBQUFBO0FBQUE7QUFBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsInNlbGYuaW1wb3J0U2NyaXB0cyhcbiAgJy4vYW1tby5qcycsXG4gICcuLi9ub2RlX21vZHVsZXMvQGJhYmVsL3BvbHlmaWxsL2Rpc3QvcG9seWZpbGwubWluLmpzJyxcbik7XG5cbmZ1bmN0aW9uIGFycmF5VG9WZWMzU291cmNlKGFycikge1xuICBjb25zdCByZXN1bHQgPSB7eDogYXJyWzBdLCB5OiBhcnJbMV0sIHo6IGFyclsyXX07XG4gIGlmIChhcnJbM10pIHtcbiAgICByZXN1bHQudyA9IGFyclszXTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5jbGFzcyBQaHlzaWNzIHtcbiAgY29sbGlzaW9uQ29uZmlndXJhdGlvbiA9IG51bGxcbiAgZGlzcGF0Y2hlciA9IG51bGxcbiAgYnJvYWRwaGFzZSA9IG51bGxcbiAgc29sdmVyID0gbnVsbFxuICBwaHlzaWNzV29ybGQgPSBudWxsXG4gIHRyYW5zZm9ybUF1eCA9IG51bGxcbiAgdGVtcEJ0VmVjM18xID0gbnVsbFxuICB0ZW1wQnRWZWMzXzIgPSBudWxsXG4gIHRlbXBCdFZlYzNfMyA9IG51bGxcbiAgbWFyZ2luID0gMFxuICBpbXBhY3RQb2ludCA9IG51bGxcbiAgaW1wYWN0Tm9ybWFsID0gbnVsbFxuICBudW1PYmplY3RzVG9SZW1vdmUgPSAwXG4gIGFnZW50Qm9keSA9IG51bGxcbiAgYWdlbnRSYWRpdXMgPSAwXG4gIGFnZW50TWFzcyA9IDBcbiAgdGFyZ2V0TWFzcyA9IDBcbiAgYm91bmRpbmdTcGhlcmVSYWRpdXMgPSAwXG4gIHBvc3RNZXNzYWdlID0gbnVsbFxuICBjb25zdHJ1Y3Rvcih7XG4gICAgYWdlbnRSYWRpdXMsIGFnZW50TWFzcywgYm91bmRpbmdTcGhlcmVSYWRpdXMsIGZyYWN0dXJlSW1wdWxzZSwgZGVicmlzTGlmZXRpbWVNcywgdGFyZ2V0TWFzcyxcbiAgICBwb3N0TWVzc2FnZSxcbiAgfSkge1xuICAgIHRoaXMuYWdlbnRSYWRpdXMgPSBhZ2VudFJhZGl1cztcbiAgICB0aGlzLmFnZW50TWFzcyA9IGFnZW50TWFzcztcbiAgICB0aGlzLmJvdW5kaW5nU3BoZXJlUmFkaXVzID0gYm91bmRpbmdTcGhlcmVSYWRpdXM7XG4gICAgdGhpcy5mcmFjdHVyZUltcHVsc2UgPSBmcmFjdHVyZUltcHVsc2U7XG4gICAgdGhpcy5kZWJyaXNMaWZldGltZU1zID0gZGVicmlzTGlmZXRpbWVNcztcbiAgICB0aGlzLnRhcmdldE1hc3MgPSB0YXJnZXRNYXNzO1xuICAgIHRoaXMucG9zdE1lc3NhZ2UgPSBwb3N0TWVzc2FnZTtcbiAgICB0aGlzLm9iamVjdHNUb1JlbW92ZSA9IFtdO1xuICAgIHRoaXMuZHluYW1pY0JvZGllcyA9IFtdO1xuICB9XG4gIGluaXQoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmICh0eXBlb2Ygc2VsZi5BbW1vID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHNlbGYuQW1tbygpLnRoZW4oKCBBbW1vTGliICkgPT4ge1xuICAgICAgICAgIHNlbGYuQW1tbyA9IHNlbGYuQW1tbyA9IEFtbW9MaWI7XG4gICAgICAgICAgdGhpcy50cmFuc2Zvcm1BdXggPSBuZXcgc2VsZi5BbW1vLmJ0VHJhbnNmb3JtKCk7XG4gICAgICAgICAgdGhpcy50ZW1wQnRWZWMzXzEgPSBuZXcgc2VsZi5BbW1vLmJ0VmVjdG9yMygwLDAsMCk7XG4gICAgICAgICAgdGhpcy50ZW1wQnRWZWMzXzIgPSBuZXcgc2VsZi5BbW1vLmJ0VmVjdG9yMygwLDAsMCk7XG4gICAgICAgICAgdGhpcy50ZW1wQnRWZWMzXzMgPSBuZXcgc2VsZi5BbW1vLmJ0VmVjdG9yMygwLDAsMCk7XG4gICAgICAgICAgdGhpcy5pbml0UGh5c2ljcygpO1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmluaXRQaHlzaWNzKCk7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBpbml0UGh5c2ljcygpIHtcbiAgICAvLyBQaHlzaWNzIGNvbmZpZ3VyYXRpb25cbiAgICB0aGlzLmNvbGxpc2lvbkNvbmZpZ3VyYXRpb24gPSBuZXcgc2VsZi5BbW1vLmJ0RGVmYXVsdENvbGxpc2lvbkNvbmZpZ3VyYXRpb24oKTtcbiAgICB0aGlzLmRpc3BhdGNoZXIgPSBuZXcgc2VsZi5BbW1vLmJ0Q29sbGlzaW9uRGlzcGF0Y2hlciggdGhpcy5jb2xsaXNpb25Db25maWd1cmF0aW9uICk7XG4gICAgdGhpcy5icm9hZHBoYXNlID0gbmV3IHNlbGYuQW1tby5idERidnRCcm9hZHBoYXNlKCk7XG4gICAgdGhpcy5zb2x2ZXIgPSBuZXcgc2VsZi5BbW1vLmJ0U2VxdWVudGlhbEltcHVsc2VDb25zdHJhaW50U29sdmVyKCk7XG4gICAgdGhpcy5waHlzaWNzV29ybGQgPSBuZXcgc2VsZi5BbW1vLmJ0RGlzY3JldGVEeW5hbWljc1dvcmxkKFxuICAgICAgdGhpcy5kaXNwYXRjaGVyLFxuICAgICAgdGhpcy5icm9hZHBoYXNlLFxuICAgICAgdGhpcy5zb2x2ZXIsXG4gICAgICB0aGlzLmNvbGxpc2lvbkNvbmZpZ3VyYXRpb24sXG4gICAgKTtcbiAgICAvLyBHcmF2aXR5IHdpbGwgYmUgc2V0IGR5bmFtaWNhbGx5LCBkZXBlbmRpbmcgb24gY2FtZXJhIHBvc2l0aW9uLlxuICAgIHRoaXMucGh5c2ljc1dvcmxkLnNldEdyYXZpdHkobmV3IHNlbGYuQW1tby5idFZlY3RvcjMoIDAsIDAsIDAgKSk7XG5cbiAgICB0aGlzLnN0YXJ0TG9vcCgpO1xuICB9XG4gIHN0YXJ0TG9vcCgpIHtcbiAgICB0aGlzLmxvb3AoKTtcbiAgfVxuICBkZWx0YVRpbWUgPSAobmV3IERhdGUpLmdldFRpbWUoKVxuICBsb29wID0gKCkgPT4ge1xuICAgIGlmIChzZWxmLnJlcXVlc3RBbmltYXRpb25GcmFtZSkge1xuICAgICAgc2VsZi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5sb29wKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0VGltZW91dCh0aGlzLmxvb3AsIDEwMDAvNjApO1xuICAgIH1cblxuICAgIGNvbnN0IG5vdyA9IChuZXcgRGF0ZSkuZ2V0VGltZSgpO1xuXG4gICAgdGhpcy51cGRhdGUobm93IC0gdGhpcy5kZWx0YVRpbWUpO1xuICAgIHRoaXMuZGVsdGFUaW1lID0gbm93O1xuICB9XG4gIHNldEFnZW50UGh5c2ljc0JvZHkoeyB4LCB5LCB6IH0pIHtcbiAgICBjb25zdCBzaGFwZSA9IG5ldyBzZWxmLkFtbW8uYnRTcGhlcmVTaGFwZSggdGhpcy5hZ2VudFJhZGl1cyApO1xuXG4gICAgc2hhcGUuc2V0TWFyZ2luKCB0aGlzLm1hcmdpbiApO1xuXG4gICAgY29uc3QgbG9jYWxJbmVydGlhID0gbmV3IHNlbGYuQW1tby5idFZlY3RvcjMoIDAsIDAsIDAgKTtcblxuICAgIHNoYXBlLmNhbGN1bGF0ZUxvY2FsSW5lcnRpYSggdGhpcy5hZ2VudE1hc3MsIGxvY2FsSW5lcnRpYSApO1xuXG4gICAgY29uc3QgdHJhbnNmb3JtID0gbmV3IHNlbGYuQW1tby5idFRyYW5zZm9ybSgpO1xuXG4gICAgdHJhbnNmb3JtLnNldElkZW50aXR5KCk7XG5cbiAgICB0cmFuc2Zvcm0uc2V0T3JpZ2luKG5ldyBzZWxmLkFtbW8uYnRWZWN0b3IzKCB4LCB5LCB6ICkpO1xuXG4gICAgY29uc3QgbW90aW9uU3RhdGUgPSBuZXcgc2VsZi5BbW1vLmJ0RGVmYXVsdE1vdGlvblN0YXRlKHRyYW5zZm9ybSk7XG4gICAgY29uc3QgcmJJbmZvID0gbmV3IHNlbGYuQW1tby5idFJpZ2lkQm9keUNvbnN0cnVjdGlvbkluZm8oIHRoaXMuYWdlbnRNYXNzLCBtb3Rpb25TdGF0ZSwgc2hhcGUsIGxvY2FsSW5lcnRpYSApO1xuICAgIGNvbnN0IGJvZHkgPSBuZXcgc2VsZi5BbW1vLmJ0UmlnaWRCb2R5KCByYkluZm8gKTtcblxuICAgIGJvZHkuc2V0QWN0aXZhdGlvblN0YXRlKDQpO1xuXG4gICAgYm9keS51c2VyRGF0YSA9IGJvZHkudXNlckRhdGEgfHwge307XG4gICAgYm9keS51c2VyRGF0YS5pc0FnZW50ID0gdHJ1ZTtcbiAgICBib2R5LnVzZXJEYXRhLnJvbGUgPSAnYWdlbnQnO1xuICAgIGJvZHkudXNlckRhdGEuaWQgPSAnYWdlbnQnO1xuICAgIGJvZHkudXNlckRhdGEuY29sbGlkZWQgPSBmYWxzZTtcblxuICAgIHRoaXMuZHluYW1pY0JvZGllcy5wdXNoKGJvZHkpO1xuICAgIHRoaXMuYWdlbnRCb2R5ID0gYm9keTtcblxuICAgIHRoaXMucGh5c2ljc1dvcmxkLmFkZFJpZ2lkQm9keSggYm9keSApO1xuICB9XG5cbiAgYWRkVGFyZ2V0KHBvc2l0aW9uLCBxdWF0ZXJuaW9uLCB2ZXJ0ZXhBcnJheSwgdGFyZ2V0SWQpIHtcbiAgICBjb25zdCB0YXJnZXRCb2R5ID0gdGhpcy5jcmVhdGVCcmVha2FibGVPYmplY3QoIHBvc2l0aW9uLCBxdWF0ZXJuaW9uLCB2ZXJ0ZXhBcnJheSwgdGhpcy50YXJnZXRNYXNzICk7XG5cbiAgICB0YXJnZXRCb2R5LnVzZXJEYXRhID0gdGFyZ2V0Qm9keS51c2VyRGF0YSB8fCB7fTtcbiAgICB0YXJnZXRCb2R5LnVzZXJEYXRhLmlzVGFyZ2V0ID0gdHJ1ZTtcbiAgICB0YXJnZXRCb2R5LnVzZXJEYXRhLnJvbGUgPSAndGFyZ2V0JztcbiAgICB0YXJnZXRCb2R5LnVzZXJEYXRhLmlkID0gdGFyZ2V0SWQ7XG4gICAgdGFyZ2V0Qm9keS51c2VyRGF0YS5icmVha2FibGUgPSB0cnVlO1xuICB9XG5cbiAgY3JlYXRlQnJlYWthYmxlT2JqZWN0KHBvc2l0aW9uLCBxdWF0ZXJuaW9uLCB2ZXJ0ZXhBcnJheSwgbWFzcywgdmVsb2NpdHksIGFuZ3VsYXJWZWxvY2l0eSkge1xuICAgIGNvbnN0IHNoYXBlID0gdGhpcy5jcmVhdGVDb252ZXhIdWxsUGh5c2ljc1NoYXBlKCB2ZXJ0ZXhBcnJheSApO1xuICAgIHNoYXBlLnNldE1hcmdpbiggdGhpcy5tYXJnaW4gKTtcblxuICAgIGNvbnN0IGJvZHkgPSB0aGlzLmNyZWF0ZVJpZ2lkQm9keSggc2hhcGUsIG1hc3MsIHBvc2l0aW9uLCBxdWF0ZXJuaW9uLCB2ZWxvY2l0eSwgYW5ndWxhclZlbG9jaXR5ICk7XG5cbiAgICByZXR1cm4gYm9keTtcbiAgfVxuXG4gIGNyZWF0ZUNvbnZleEh1bGxQaHlzaWNzU2hhcGUoIGNvb3JkcyApIHtcbiAgICBjb25zdCBzaGFwZSA9IG5ldyBzZWxmLkFtbW8uYnRDb252ZXhIdWxsU2hhcGUoKTtcblxuICAgIGZvciAoIGxldCBpID0gMCwgaWwgPSBjb29yZHMubGVuZ3RoOyBpIDwgaWw7IGkgKz0gMyApIHtcbiAgICAgIHRoaXMudGVtcEJ0VmVjM18xLnNldFZhbHVlKCBjb29yZHNbIGkgXSwgY29vcmRzWyBpICsgMSBdLCBjb29yZHNbIGkgKyAyIF0gKTtcbiAgICAgIGNvbnN0IGxhc3RPbmUgPSAoIGkgPj0gKCBpbCAtIDMgKSApO1xuICAgICAgc2hhcGUuYWRkUG9pbnQoIHRoaXMudGVtcEJ0VmVjM18xLCBsYXN0T25lICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNoYXBlO1xuICB9XG5cbiAgY3JlYXRlVHJpYW5nbGVQaHlzaWNzU2hhcGUoIGNvb3JkcyApIHtcbiAgICBjb25zdCBtZXNoID0gbmV3IHNlbGYuQW1tby5idFRyaWFuZ2xlTWVzaCgpO1xuXG4gICAgZm9yICggbGV0IGkgPSAwLCBpbCA9IGNvb3Jkcy5sZW5ndGg7IGkgPCBpbDsgaSArPSA5ICkge1xuICAgICAgdGhpcy50ZW1wQnRWZWMzXzEuc2V0VmFsdWUoIGNvb3Jkc1sgaSBdLCBjb29yZHNbIGkgKyAxIF0sIGNvb3Jkc1sgaSArIDIgXSApO1xuICAgICAgdGhpcy50ZW1wQnRWZWMzXzIuc2V0VmFsdWUoIGNvb3Jkc1sgaSArIDMgXSwgY29vcmRzWyBpICsgNCBdLCBjb29yZHNbIGkgKyA1IF0gKTtcbiAgICAgIHRoaXMudGVtcEJ0VmVjM18zLnNldFZhbHVlKCBjb29yZHNbIGkgKyA2IF0sIGNvb3Jkc1sgaSArIDcgXSwgY29vcmRzWyBpICsgOCBdICk7XG4gICAgICAvL2NvbnN0IGxhc3RPbmUgPSAoIGkgPj0gKCBpbCAtIDMgKSApO1xuICAgICAgbWVzaC5hZGRUcmlhbmdsZSggdGhpcy50ZW1wQnRWZWMzXzEsIHRoaXMudGVtcEJ0VmVjM18yLCB0aGlzLnRlbXBCdFZlYzNfMyk7XG4gICAgfVxuXG4gICAgY29uc3Qgc2hhcGUgPSBuZXcgc2VsZi5BbW1vLmJ0QnZoVHJpYW5nbGVNZXNoU2hhcGUobWVzaCk7XG5cbiAgICByZXR1cm4gc2hhcGU7XG4gIH1cblxuICBjcmVhdGVSaWdpZEJvZHkoIHBoeXNpY3NTaGFwZSwgbWFzcywgcG9zLCBxdWF0LCB2ZWwsIGFuZ1ZlbCApIHtcbiAgICBjb25zdCB0cmFuc2Zvcm0gPSBuZXcgc2VsZi5BbW1vLmJ0VHJhbnNmb3JtKCk7XG4gICAgdHJhbnNmb3JtLnNldElkZW50aXR5KCk7XG4gICAgdHJhbnNmb3JtLnNldE9yaWdpbiggbmV3IHNlbGYuQW1tby5idFZlY3RvcjMoIHBvcy54LCBwb3MueSwgcG9zLnogKSApO1xuICAgIHRyYW5zZm9ybS5zZXRSb3RhdGlvbiggbmV3IHNlbGYuQW1tby5idFF1YXRlcm5pb24oIHF1YXQueCwgcXVhdC55LCBxdWF0LnosIHF1YXQudyApICk7XG4gICAgY29uc3QgbW90aW9uU3RhdGUgPSBuZXcgc2VsZi5BbW1vLmJ0RGVmYXVsdE1vdGlvblN0YXRlKCB0cmFuc2Zvcm0gKTtcblxuICAgIGNvbnN0IGxvY2FsSW5lcnRpYSA9IG5ldyBzZWxmLkFtbW8uYnRWZWN0b3IzKCAwLCAwLCAwICk7XG4gICAgcGh5c2ljc1NoYXBlLmNhbGN1bGF0ZUxvY2FsSW5lcnRpYSggbWFzcywgbG9jYWxJbmVydGlhICk7XG5cbiAgICBjb25zdCByYkluZm8gPSBuZXcgc2VsZi5BbW1vLmJ0UmlnaWRCb2R5Q29uc3RydWN0aW9uSW5mbyggbWFzcywgbW90aW9uU3RhdGUsIHBoeXNpY3NTaGFwZSwgbG9jYWxJbmVydGlhICk7XG4gICAgY29uc3QgYm9keSA9IG5ldyBzZWxmLkFtbW8uYnRSaWdpZEJvZHkoIHJiSW5mbyApO1xuXG4gICAgYm9keS5zZXRSZXN0aXR1dGlvbigxKTtcblxuICAgIGlmICggdmVsICkge1xuICAgICAgYm9keS5zZXRMaW5lYXJWZWxvY2l0eSggbmV3IHNlbGYuQW1tby5idFZlY3RvcjMoIHZlbC54LCB2ZWwueSwgdmVsLnogKSApO1xuICAgIH1cbiAgICBpZiAoIGFuZ1ZlbCApIHtcbiAgICAgIGJvZHkuc2V0QW5ndWxhclZlbG9jaXR5KCBuZXcgc2VsZi5BbW1vLmJ0VmVjdG9yMyggYW5nVmVsLngsIGFuZ1ZlbC55LCBhbmdWZWwueiApICk7XG4gICAgfVxuXG4gICAgYm9keS51c2VyRGF0YSA9IGJvZHkudXNlckRhdGEgfHwge307XG4gICAgYm9keS51c2VyRGF0YS5jb2xsaWRlZCA9IGZhbHNlO1xuXG4gICAgaWYgKCBtYXNzID4gMCApIHtcbiAgICAgIHRoaXMuZHluYW1pY0JvZGllcy5wdXNoKGJvZHkpO1xuICAgICAgLy8gRGlzYWJsZSBkZWFjdGl2YXRpb25cbiAgICAgIGJvZHkuc2V0QWN0aXZhdGlvblN0YXRlKCA0ICk7XG4gICAgfVxuXG4gICAgdGhpcy5waHlzaWNzV29ybGQuYWRkUmlnaWRCb2R5KCBib2R5ICk7XG5cbiAgICByZXR1cm4gYm9keTtcbiAgfVxuXG4gIHVwZGF0ZSA9ICggZGVsdGFUaW1lICkgPT4ge1xuXG4gICAgdGhpcy5waHlzaWNzV29ybGQuc3RlcFNpbXVsYXRpb24oIGRlbHRhVGltZSo1LCAxMCApO1xuXG4gICAgLy8gVXBkYXRlIG9iamVjdHNcbiAgICBmb3IgKCBsZXQgaSA9IDAsIGlsID0gdGhpcy5keW5hbWljQm9kaWVzLmxlbmd0aDsgaSA8IGlsOyBpICsrICkge1xuXG4gICAgICBjb25zdCBvYmpQaHlzID0gdGhpcy5keW5hbWljQm9kaWVzWyBpIF07XG4gICAgICBjb25zdCBtb3Rpb25TdGF0ZSA9IG9ialBoeXMuZ2V0TW90aW9uU3RhdGUoKTtcblxuICAgICAgaWYgKG1vdGlvblN0YXRlKSB7XG4gICAgICAgIG1vdGlvblN0YXRlLmdldFdvcmxkVHJhbnNmb3JtKCB0aGlzLnRyYW5zZm9ybUF1eCApO1xuXG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy50cmFuc2Zvcm1BdXguZ2V0T3JpZ2luKCk7XG4gICAgICAgIGNvbnN0IHF1YXRlcm5pb24gPSB0aGlzLnRyYW5zZm9ybUF1eC5nZXRSb3RhdGlvbigpO1xuXG4gICAgICAgIGNvbnN0IFsgeCwgeSwgeiBdID0gW3Bvc2l0aW9uLngoKSwgcG9zaXRpb24ueSgpLCBwb3NpdGlvbi56KCldO1xuXG4gICAgICAgIGlmIChvYmpQaHlzLnVzZXJEYXRhLmlzQWdlbnQpIHtcbiAgICAgICAgICBpZiAoTWF0aC5zcXJ0KE1hdGgucG93KHgsIDIpICsgTWF0aC5wb3coeSwgMikgKyBNYXRoLnBvdyh6LCAyKSkgPiB0aGlzLmJvdW5kaW5nU3BoZXJlUmFkaXVzKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3BBZ2VudEFmdGVySW1wYWN0KCk7XG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybUF1eC5zZXRPcmlnaW4obmV3IHNlbGYuQW1tby5idFZlY3RvcjMoXG4gICAgICAgICAgICAgIG9ialBoeXMudXNlckRhdGEucHJldlBvc2l0aW9uLngsXG4gICAgICAgICAgICAgIG9ialBoeXMudXNlckRhdGEucHJldlBvc2l0aW9uLnksXG4gICAgICAgICAgICAgIG9ialBoeXMudXNlckRhdGEucHJldlBvc2l0aW9uLnosXG4gICAgICAgICAgICApKTtcbiAgICAgICAgICAgIHRoaXMuYWdlbnRCb2R5LnNldFdvcmxkVHJhbnNmb3JtKHRoaXMudHJhbnNmb3JtQXV4KTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvYmpQaHlzLnVzZXJEYXRhLnByZXZQb3NpdGlvbiA9IHsgeCwgeSwgeiB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgIHRhc2s6ICd1cGRhdGUnLFxuICAgICAgICAgIHJvbGU6IG9ialBoeXMudXNlckRhdGEucm9sZSxcbiAgICAgICAgICBpZDogb2JqUGh5cy51c2VyRGF0YS5pZCxcbiAgICAgICAgICBwb3NpdGlvbjogeyB4LCB5LCB6IH0sXG4gICAgICAgICAgcXVhdGVybmlvbjogW3F1YXRlcm5pb24ueCgpLCBxdWF0ZXJuaW9uLnkoKSwgcXVhdGVybmlvbi56KCksIHF1YXRlcm5pb24udygpXSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgb2JqUGh5cy51c2VyRGF0YS5jb2xsaWRlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMucHJvY2Vzc0NvbGxpc2lvbnMoKTtcbiAgfVxuXG4gIHByb2Nlc3NDb2xsaXNpb25zKCkge1xuICAgIGZvciAoIGxldCBpID0gMCwgaWwgPSB0aGlzLmRpc3BhdGNoZXIuZ2V0TnVtTWFuaWZvbGRzKCk7IGkgPCBpbDsgaSArKyApIHtcblxuICAgICAgY29uc3QgY29udGFjdE1hbmlmb2xkID0gdGhpcy5kaXNwYXRjaGVyLmdldE1hbmlmb2xkQnlJbmRleEludGVybmFsKCBpICk7XG4gICAgICBjb25zdCByYjAgPSBzZWxmLkFtbW8uY2FzdE9iamVjdCggY29udGFjdE1hbmlmb2xkLmdldEJvZHkwKCksIHNlbGYuQW1tby5idFJpZ2lkQm9keSApO1xuICAgICAgY29uc3QgcmIxID0gc2VsZi5BbW1vLmNhc3RPYmplY3QoIGNvbnRhY3RNYW5pZm9sZC5nZXRCb2R5MSgpLCBzZWxmLkFtbW8uYnRSaWdpZEJvZHkgKTtcblxuICAgICAgY29uc3QgdXNlckRhdGEwID0gcmIwLnVzZXJEYXRhIHx8IG51bGw7XG4gICAgICBjb25zdCB1c2VyRGF0YTEgPSByYjEudXNlckRhdGEgfHwgbnVsbDtcblxuICAgICAgaWYgKCAhdXNlckRhdGEwIHx8ICF1c2VyRGF0YTEgKSB7XG5cdGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBicmVha2FibGUwID0gdXNlckRhdGEwID8gdXNlckRhdGEwLmJyZWFrYWJsZTogZmFsc2U7XG4gICAgICBjb25zdCBicmVha2FibGUxID0gdXNlckRhdGExID8gdXNlckRhdGExLmJyZWFrYWJsZSA6IGZhbHNlO1xuXG4gICAgICBjb25zdCBjb2xsaWRlZDAgPSB1c2VyRGF0YTAgPyB1c2VyRGF0YTAuY29sbGlkZWQgOiBmYWxzZTtcbiAgICAgIGNvbnN0IGNvbGxpZGVkMSA9IHVzZXJEYXRhMSA/IHVzZXJEYXRhMS5jb2xsaWRlZCA6IGZhbHNlO1xuXG4gICAgICBpZiAoICggISBicmVha2FibGUwICYmICEgYnJlYWthYmxlMSApIHx8ICggY29sbGlkZWQwICYmIGNvbGxpZGVkMSApICkge1xuXHRjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgbGV0IGNvbnRhY3QgPSBmYWxzZTtcbiAgICAgIGxldCBtYXhJbXB1bHNlID0gMDtcbiAgICAgIGZvciAoIGxldCBqID0gMCwgamwgPSBjb250YWN0TWFuaWZvbGQuZ2V0TnVtQ29udGFjdHMoKTsgaiA8IGpsOyBqICsrICkge1xuXG5cdGNvbnN0IGNvbnRhY3RQb2ludCA9IGNvbnRhY3RNYW5pZm9sZC5nZXRDb250YWN0UG9pbnQoIGogKTtcblxuXHRpZiAoIGNvbnRhY3RQb2ludC5nZXREaXN0YW5jZSgpIDwgMC4xICkge1xuXG5cdCAgY29udGFjdCA9IHRydWU7XG5cdCAgY29uc3QgaW1wdWxzZSA9IGNvbnRhY3RQb2ludC5nZXRBcHBsaWVkSW1wdWxzZSgpO1xuXG5cdCAgaWYgKCBpbXB1bHNlID4gbWF4SW1wdWxzZSApIHtcblxuXHQgICAgbWF4SW1wdWxzZSA9IGltcHVsc2U7XG5cdCAgICB2YXIgcG9zID0gY29udGFjdFBvaW50LmdldF9tX3Bvc2l0aW9uV29ybGRPbkIoKTtcblx0ICAgIHZhciBub3JtYWwgPSBjb250YWN0UG9pbnQuZ2V0X21fbm9ybWFsV29ybGRPbkIoKTtcblx0ICAgIHRoaXMuaW1wYWN0UG9pbnQgPSB7eCA6IHBvcy54KCksIHk6IHBvcy55KCksIHogOiBwb3MueigpIH07XG5cdCAgICB0aGlzLmltcGFjdE5vcm1hbCA9IHt4IDogbm9ybWFsLngoKSwgeTogbm9ybWFsLnkoKSwgeiA6IG5vcm1hbC56KCkgfTtcblx0ICB9XG5cdH1cbiAgICAgIH1cblxuICAgICAgaWYgKHVzZXJEYXRhMC5pc0FnZW50KSB7XG4gICAgICAgIHJiMC5zZXRBbmd1bGFyVmVsb2NpdHkobmV3IHNlbGYuQW1tby5idFZlY3RvcjMoIDAsIDAsIDAgKSk7XG4gICAgICB9IGVsc2UgaWYgKHVzZXJEYXRhMS5pc0FnZW50KSB7XG4gICAgICAgIHJiMS5zZXRBbmd1bGFyVmVsb2NpdHkobmV3IHNlbGYuQW1tby5idFZlY3RvcjMoIDAsIDAsIDAgKSk7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIG5vIHBvaW50IGhhcyBjb250YWN0LCBhYm9ydFxuICAgICAgaWYgKCAhY29udGFjdCB8fCAhdGhpcy5pbXBhY3RQb2ludCB8fCAoXG4gICAgICAgIHRoaXMuaW1wYWN0UG9pbnQueCA9PT0gMCAmJlxuICAgICAgICB0aGlzLmltcGFjdFBvaW50LnkgPT09IDAgJiZcbiAgICAgICAgdGhpcy5pbXBhY3RQb2ludC56ID09PSAwXG4gICAgICApICkgY29udGludWU7XG5cbiAgICAgIGNvbnN0IG9iajBicmVha3MgPSBicmVha2FibGUwICYmIHVzZXJEYXRhMS5pc0FnZW50ICYmICEgY29sbGlkZWQwICYmIG1heEltcHVsc2UgPiB0aGlzLmZyYWN0dXJlSW1wdWxzZTtcbiAgICAgIGNvbnN0IG9iajFicmVha3MgPSBicmVha2FibGUxICYmIHVzZXJEYXRhMC5pc0FnZW50ICYmICEgY29sbGlkZWQxICYmIG1heEltcHVsc2UgPiB0aGlzLmZyYWN0dXJlSW1wdWxzZTtcblxuICAgICAgLy8gU3ViZGl2aXNpb25cbiAgICAgIGlmIChvYmowYnJlYWtzIHx8IG9iajFicmVha3MpIHtcbiAgICAgICAgbGV0IGRlYnJpcztcblxuICAgICAgICBpZiAob2JqMGJyZWFrcykge1xuICAgICAgICAgIGNvbnN0IHZlbCA9IHJiMC5nZXRMaW5lYXJWZWxvY2l0eSgpO1xuXHQgIGNvbnN0IGFuZ1ZlbCA9IHJiMC5nZXRBbmd1bGFyVmVsb2NpdHkoKTtcblxuICAgICAgICAgIHRoaXMucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgdGFzazogJ3N1YmRpdmlkZUJ5SW1wYWN0JyxcbiAgICAgICAgICAgIGltcGFjdFBvaW50OiBbdGhpcy5pbXBhY3RQb2ludC54LCB0aGlzLmltcGFjdFBvaW50LnksIHRoaXMuaW1wYWN0UG9pbnQuel0sXG4gICAgICAgICAgICBpbXBhY3ROb3JtYWw6IFt0aGlzLmltcGFjdE5vcm1hbC54LCB0aGlzLmltcGFjdE5vcm1hbC55LCB0aGlzLmltcGFjdE5vcm1hbC56XSxcbiAgICAgICAgICAgIHJvbGU6IHJiMC51c2VyRGF0YS5yb2xlLFxuICAgICAgICAgICAgaWQ6IHJiMC51c2VyRGF0YS5pZCxcbiAgICAgICAgICAgIHZlbDogW3ZlbC54KCksIHZlbC55KCksIHZlbC56KCldLFxuXHQgICAgYW5nVmVsOiBbYW5nVmVsLngoKSwgYW5nVmVsLnkoKSwgYW5nVmVsLnooKV0sXG4gICAgICAgICAgfSk7XG5cblx0ICB0aGlzLm9iamVjdHNUb1JlbW92ZVsgdGhpcy5udW1PYmplY3RzVG9SZW1vdmUrKyBdID0gcmIwO1xuXHQgIHVzZXJEYXRhMC5jb2xsaWRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9iajFicmVha3MpIHtcbiAgICAgICAgICBjb25zdCB2ZWwgPSByYjEuZ2V0TGluZWFyVmVsb2NpdHkoKTtcblx0ICBjb25zdCBhbmdWZWwgPSByYjEuZ2V0QW5ndWxhclZlbG9jaXR5KCk7XG5cbiAgICAgICAgICB0aGlzLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgIHRhc2s6ICdzdWJkaXZpZGVCeUltcGFjdCcsXG4gICAgICAgICAgICBpbXBhY3RQb2ludDogW3RoaXMuaW1wYWN0UG9pbnQueCwgdGhpcy5pbXBhY3RQb2ludC55LCB0aGlzLmltcGFjdFBvaW50LnpdLFxuICAgICAgICAgICAgaW1wYWN0Tm9ybWFsOiBbdGhpcy5pbXBhY3ROb3JtYWwueCwgdGhpcy5pbXBhY3ROb3JtYWwueSwgdGhpcy5pbXBhY3ROb3JtYWwuel0sXG4gICAgICAgICAgICByb2xlOiByYjEudXNlckRhdGEucm9sZSxcbiAgICAgICAgICAgIGlkOiByYjEudXNlckRhdGEuaWQsXG4gICAgICAgICAgICB2ZWw6IFt2ZWwueCgpLCB2ZWwueSgpLCB2ZWwueigpXSxcblx0ICAgIGFuZ1ZlbDogW2FuZ1ZlbC54KCksIGFuZ1ZlbC55KCksIGFuZ1ZlbC56KCldLFxuICAgICAgICAgIH0pO1xuXG5cdCAgdGhpcy5vYmplY3RzVG9SZW1vdmVbIHRoaXMubnVtT2JqZWN0c1RvUmVtb3ZlKysgXSA9IHJiMTtcblx0ICB1c2VyRGF0YTEuY29sbGlkZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCh1c2VyRGF0YTAgJiYgdXNlckRhdGEwLmlzVGFyZ2V0KSB8fCAodXNlckRhdGExICYmIHVzZXJEYXRhMS5pc1RhcmdldCkpIHtcblxuICAgICAgICAgIHRoaXMuc3RvcEFnZW50QWZ0ZXJJbXBhY3QoKTtcblxuICAgICAgICAgIGNvbnN0IHRhcmdldFVzZXJEYXRhID0gdXNlckRhdGEwLmlzVGFyZ2V0ID8gdXNlckRhdGEwIDogdXNlckRhdGExO1xuXG4gICAgICAgICAgaWYgKHRhcmdldFVzZXJEYXRhLndhc0hpdCAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5wb3N0TWVzc2FnZSh7IHRhc2s6ICdwbGF5QXVkaW8nIH0pO1xuICAgICAgICAgICAgdGFyZ2V0VXNlckRhdGEud2FzSGl0ID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5udW1PYmplY3RzVG9SZW1vdmUpIHtcbiAgICAgIHRoaXMucG9zdE1lc3NhZ2Uoe1xuICAgICAgICB0YXNrOiAncmVtb3ZlRGVicmlzJyxcbiAgICAgICAgZGVicmlzOiB0aGlzLm9iamVjdHNUb1JlbW92ZS5tYXAoKHsgdXNlckRhdGE6IHsgcm9sZSwgaWQgfX0pID0+ICh7IHJvbGUsIGlkIH0pKSxcbiAgICAgIH0pO1xuXG4gICAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCB0aGlzLm51bU9iamVjdHNUb1JlbW92ZTsgaSArKyApIHtcbiAgICAgICAgdGhpcy5waHlzaWNzV29ybGQucmVtb3ZlUmlnaWRCb2R5KHRoaXMub2JqZWN0c1RvUmVtb3ZlW2ldKTtcbiAgICAgIH1cbiAgICAgIHRoaXMubnVtT2JqZWN0c1RvUmVtb3ZlID0gMDtcbiAgICB9XG4gICAgXG4gIH1cblxuICBjbGVhckRlYnJpcyhkZWJyaXMpIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMucG9zdE1lc3NhZ2Uoe1xuICAgICAgICB0YXNrOiAncmVtb3ZlRGVicmlzJyxcbiAgICAgICAgZGVicmlzOiBkZWJyaXMubWFwKCh7IHVzZXJEYXRhOiB7IHJvbGUsIGlkIH19KSA9PiAoeyByb2xlLCBpZCB9KSksXG4gICAgICB9KTtcblxuICAgICAgZm9yIChjb25zdCBkZWJyZWVJbmRleCBpbiBkZWJyaXMpIHtcbiAgICAgICAgdGhpcy5waHlzaWNzV29ybGQucmVtb3ZlUmlnaWRCb2R5KGRlYnJpc1tkZWJyZWVJbmRleF0pO1xuICAgICAgfVxuICAgIH0sIHRoaXMuZGVicmlzTGlmZXRpbWVNcyk7XG4gIH1cblxuICBzdG9wQWdlbnRBZnRlckltcGFjdCgpIHtcbiAgICB0aGlzLmFnZW50Qm9keS5zZXRMaW5lYXJWZWxvY2l0eShuZXcgc2VsZi5BbW1vLmJ0VmVjdG9yMyggMCwgMCwgMCApKTtcbiAgfVxufVxuXG5zZWxmLnBoeXNpY3NJbnN0YW5jZSA9ICdkdW1teSc7XG5cbnNlbGYub25tZXNzYWdlID0gYXN5bmMgZnVuY3Rpb24gKGUpIHtcbiAgc3dpdGNoKGUuZGF0YS50YXNrKSB7XG4gIGNhc2UgJ2luaXQnOlxuICAgIGNvbnN0IHtcbiAgICAgIGFnZW50UmFkaXVzLCBhZ2VudE1hc3MsIGJvdW5kaW5nU3BoZXJlUmFkaXVzLCBmcmFjdHVyZUltcHVsc2UsIGRlYnJpc0xpZmV0aW1lTXMsIHRhcmdldE1hc3MsXG4gICAgfSA9IGUuZGF0YS5saWI7XG5cbiAgICBzZWxmLnBoeXNpY3NJbnN0YW5jZSA9IG5ldyBQaHlzaWNzKHtcbiAgICAgIGFnZW50UmFkaXVzLCBhZ2VudE1hc3MsIGJvdW5kaW5nU3BoZXJlUmFkaXVzLCBmcmFjdHVyZUltcHVsc2UsIGRlYnJpc0xpZmV0aW1lTXMsIHRhcmdldE1hc3MsXG4gICAgICBwb3N0TWVzc2FnZShtZXNzYWdlKSB7XG4gICAgICAgIHNlbGYucG9zdE1lc3NhZ2UobWVzc2FnZSk7XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgYXdhaXQgc2VsZi5waHlzaWNzSW5zdGFuY2UuaW5pdCgpO1xuXG4gICAgc2VsZi5wb3N0TWVzc2FnZSh7IHRhc2s6ICdyZWFkeScgfSk7XG5cbiAgICBicmVhaztcbiAgY2FzZSAnc2V0QWdlbnQnOlxuXG4gICAgY29uc3QgeyBwb3NpdGlvbiB9ID0gZS5kYXRhO1xuXG4gICAgc2VsZi5waHlzaWNzSW5zdGFuY2Uuc2V0QWdlbnRQaHlzaWNzQm9keShwb3NpdGlvbik7XG5cbiAgICBicmVhaztcbiAgY2FzZSAncHVuY2gnOiB7XG4gICAgY29uc3QgeyB2ZWN0b3I6IHsgeCwgeSwgeiB9IH0gPSBlLmRhdGE7XG5cbiAgICBzZWxmLnBoeXNpY3NJbnN0YW5jZS5hZ2VudEJvZHkuYXBwbHlGb3JjZShuZXcgc2VsZi5BbW1vLmJ0VmVjdG9yMyh4LCB5LCB6KSk7XG5cbiAgICBicmVhaztcbiAgfVxuICBjYXNlICdhZGRUYXJnZXQnOiB7XG4gICAgY29uc3QgeyBwb3NpdGlvbiwgcXVhdGVybmlvbiwgdmVydGV4QXJyYXksIHRhcmdldElkIH0gPSBlLmRhdGE7XG5cbiAgICBzZWxmLnBoeXNpY3NJbnN0YW5jZS5hZGRUYXJnZXQocG9zaXRpb24sIHF1YXRlcm5pb24sIHZlcnRleEFycmF5LCB0YXJnZXRJZCk7XG5cbiAgICBicmVhaztcbiAgfVxuICBjYXNlICdmcmVlemUnOiB7XG4gICAgc2VsZi5waHlzaWNzSW5zdGFuY2Uuc3RvcEFnZW50QWZ0ZXJJbXBhY3QoKTtcblxuICAgIGJyZWFrO1xuICB9XG4gIGNhc2UgJ2NyZWF0ZUZyYWdtZW50cyc6IHtcblxuICAgIGNvbnN0IHsgZnJhZ21lbnRzIH0gPSBlLmRhdGE7XG5cbiAgICBjb25zdCBudW1PYmplY3RzID0gZnJhZ21lbnRzLmxlbmd0aDtcbiAgICBjb25zdCBkZWJyaXMgPSBbXTtcbiAgICBmb3IgKCBsZXQgaiA9IDA7IGogPCBudW1PYmplY3RzOyBqICsrICkge1xuICAgICAgY29uc3QgW1xuICAgICAgICBmcmFnbWVudElkLCBwb3NpdGlvbiwgcXVhdGVybmlvbiwgdmVydGV4QXJyYXksIG1hc3MsIHZlbG9jaXR5LCBhbmd1bGFyVmVsb2NpdHlcbiAgICAgIF0gPSBmcmFnbWVudHNbIGogXTtcblxuICAgICAgY29uc3QgYm9keSA9IHNlbGYucGh5c2ljc0luc3RhbmNlLmNyZWF0ZUJyZWFrYWJsZU9iamVjdChcbiAgICAgICAgYXJyYXlUb1ZlYzNTb3VyY2UocG9zaXRpb24pLFxuICAgICAgICBhcnJheVRvVmVjM1NvdXJjZShxdWF0ZXJuaW9uKSxcbiAgICAgICAgdmVydGV4QXJyYXksXG4gICAgICAgIG1hc3MsXG4gICAgICAgIGFycmF5VG9WZWMzU291cmNlKHZlbG9jaXR5KSxcbiAgICAgICAgYXJyYXlUb1ZlYzNTb3VyY2UoYW5ndWxhclZlbG9jaXR5KVxuICAgICAgKTtcbiAgICAgIGJvZHkudXNlckRhdGEgPSBib2R5LnVzZXJEYXRhIHx8IHt9O1xuICAgICAgYm9keS51c2VyRGF0YS5pZCA9IGZyYWdtZW50SWQ7XG4gICAgICBib2R5LnVzZXJEYXRhLnJvbGUgPSAnZnJhZ21lbnQnO1xuICAgICAgYm9keS51c2VyRGF0YS5pc0ZyYWdtZW50ID0gdHJ1ZTtcbiAgICAgIGRlYnJpcy5wdXNoKGJvZHkpO1xuICAgIH1cblxuICAgIHNlbGYucGh5c2ljc0luc3RhbmNlLmNsZWFyRGVicmlzKGRlYnJpcyk7XG4gICAgXG4gICAgYnJlYWs7XG4gIH1cbiAgfVxufTtcbiJdfQ==
