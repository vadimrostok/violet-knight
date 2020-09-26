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

self.importScripts('/lib/ammo.js', '/node_modules/@babel/polyfill/dist/polyfill.min.js');

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvcGh5c2ljcy9waHlzaWNzLXdvcmtlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQUEsSUFBSSxDQUFDLGFBQUwsQ0FDRSxjQURGLEVBRUUsb0RBRkY7O0FBS0EsU0FBUyxpQkFBVCxDQUEyQixHQUEzQixFQUFnQztBQUM5QixNQUFNLE1BQU0sR0FBRztBQUFDLElBQUEsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFELENBQVA7QUFBWSxJQUFBLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBRCxDQUFsQjtBQUF1QixJQUFBLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBRDtBQUE3QixHQUFmOztBQUNBLE1BQUksR0FBRyxDQUFDLENBQUQsQ0FBUCxFQUFZO0FBQ1YsSUFBQSxNQUFNLENBQUMsQ0FBUCxHQUFXLEdBQUcsQ0FBQyxDQUFELENBQWQ7QUFDRDs7QUFDRCxTQUFPLE1BQVA7QUFDRDs7SUFFSyxPO0FBb0JKLHlCQUdHO0FBQUE7O0FBQUEsUUFGRCxXQUVDLFFBRkQsV0FFQztBQUFBLFFBRlksU0FFWixRQUZZLFNBRVo7QUFBQSxRQUZ1QixvQkFFdkIsUUFGdUIsb0JBRXZCO0FBQUEsUUFGNkMsZUFFN0MsUUFGNkMsZUFFN0M7QUFBQSxRQUY4RCxnQkFFOUQsUUFGOEQsZ0JBRTlEO0FBQUEsUUFGZ0YsVUFFaEYsUUFGZ0YsVUFFaEY7QUFBQSxRQURELFdBQ0MsUUFERCxXQUNDOztBQUFBOztBQUFBLG9EQXRCc0IsSUFzQnRCOztBQUFBLHdDQXJCVSxJQXFCVjs7QUFBQSx3Q0FwQlUsSUFvQlY7O0FBQUEsb0NBbkJNLElBbUJOOztBQUFBLDBDQWxCWSxJQWtCWjs7QUFBQSwwQ0FqQlksSUFpQlo7O0FBQUEsMENBaEJZLElBZ0JaOztBQUFBLDBDQWZZLElBZVo7O0FBQUEsMENBZFksSUFjWjs7QUFBQSxvQ0FiTSxDQWFO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LENBQUMsR0FBRyxVQUFyQixFQUFpQyxDQUFDLEVBQWxDLEVBQXdDO0FBQUEsNENBR2xDLFNBQVMsQ0FBRSxDQUFGLENBSHlCLE1BRXBDLFVBRm9DLG9CQUV4QixVQUZ3QixvQkFFZCxXQUZjLG9CQUVGLFlBRkUsb0JBRVcsSUFGWCxvQkFFaUIsUUFGakIsb0JBRTJCLGVBRjNCO0FBS2hDLGNBQUEsSUFMZ0MsR0FLekIsSUFBSSxDQUFDLGVBQUwsQ0FBcUIscUJBQXJCLENBQ1gsaUJBQWlCLENBQUMsVUFBRCxDQUROLEVBRVgsaUJBQWlCLENBQUMsV0FBRCxDQUZOLEVBR1gsWUFIVyxFQUlYLElBSlcsRUFLWCxpQkFBaUIsQ0FBQyxRQUFELENBTE4sRUFNWCxpQkFBaUIsQ0FBQyxlQUFELENBTk4sQ0FMeUI7QUFhdEMsY0FBQSxJQUFJLENBQUMsUUFBTCxHQUFnQixJQUFJLENBQUMsUUFBTCxJQUFpQixFQUFqQztBQUNBLGNBQUEsSUFBSSxDQUFDLFFBQUwsQ0FBYyxFQUFkLEdBQW1CLFVBQW5CO0FBQ0EsY0FBQSxJQUFJLENBQUMsUUFBTCxDQUFjLElBQWQsR0FBcUIsVUFBckI7QUFDQSxjQUFBLElBQUksQ0FBQyxRQUFMLENBQWMsVUFBZCxHQUEyQixJQUEzQjtBQUNBLGNBQUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxJQUFaO0FBQ0Q7O0FBRUQsWUFBQSxJQUFJLENBQUMsZUFBTCxDQUFxQixXQUFyQixDQUFpQyxNQUFqQztBQXZFYTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQUFqQjs7QUFBQTtBQUFBO0FBQUE7QUFBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsInNlbGYuaW1wb3J0U2NyaXB0cyhcbiAgJy9saWIvYW1tby5qcycsXG4gICcvbm9kZV9tb2R1bGVzL0BiYWJlbC9wb2x5ZmlsbC9kaXN0L3BvbHlmaWxsLm1pbi5qcycsXG4pO1xuXG5mdW5jdGlvbiBhcnJheVRvVmVjM1NvdXJjZShhcnIpIHtcbiAgY29uc3QgcmVzdWx0ID0ge3g6IGFyclswXSwgeTogYXJyWzFdLCB6OiBhcnJbMl19O1xuICBpZiAoYXJyWzNdKSB7XG4gICAgcmVzdWx0LncgPSBhcnJbM107XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuY2xhc3MgUGh5c2ljcyB7XG4gIGNvbGxpc2lvbkNvbmZpZ3VyYXRpb24gPSBudWxsXG4gIGRpc3BhdGNoZXIgPSBudWxsXG4gIGJyb2FkcGhhc2UgPSBudWxsXG4gIHNvbHZlciA9IG51bGxcbiAgcGh5c2ljc1dvcmxkID0gbnVsbFxuICB0cmFuc2Zvcm1BdXggPSBudWxsXG4gIHRlbXBCdFZlYzNfMSA9IG51bGxcbiAgdGVtcEJ0VmVjM18yID0gbnVsbFxuICB0ZW1wQnRWZWMzXzMgPSBudWxsXG4gIG1hcmdpbiA9IDBcbiAgaW1wYWN0UG9pbnQgPSBudWxsXG4gIGltcGFjdE5vcm1hbCA9IG51bGxcbiAgbnVtT2JqZWN0c1RvUmVtb3ZlID0gMFxuICBhZ2VudEJvZHkgPSBudWxsXG4gIGFnZW50UmFkaXVzID0gMFxuICBhZ2VudE1hc3MgPSAwXG4gIHRhcmdldE1hc3MgPSAwXG4gIGJvdW5kaW5nU3BoZXJlUmFkaXVzID0gMFxuICBwb3N0TWVzc2FnZSA9IG51bGxcbiAgY29uc3RydWN0b3Ioe1xuICAgIGFnZW50UmFkaXVzLCBhZ2VudE1hc3MsIGJvdW5kaW5nU3BoZXJlUmFkaXVzLCBmcmFjdHVyZUltcHVsc2UsIGRlYnJpc0xpZmV0aW1lTXMsIHRhcmdldE1hc3MsXG4gICAgcG9zdE1lc3NhZ2UsXG4gIH0pIHtcbiAgICB0aGlzLmFnZW50UmFkaXVzID0gYWdlbnRSYWRpdXM7XG4gICAgdGhpcy5hZ2VudE1hc3MgPSBhZ2VudE1hc3M7XG4gICAgdGhpcy5ib3VuZGluZ1NwaGVyZVJhZGl1cyA9IGJvdW5kaW5nU3BoZXJlUmFkaXVzO1xuICAgIHRoaXMuZnJhY3R1cmVJbXB1bHNlID0gZnJhY3R1cmVJbXB1bHNlO1xuICAgIHRoaXMuZGVicmlzTGlmZXRpbWVNcyA9IGRlYnJpc0xpZmV0aW1lTXM7XG4gICAgdGhpcy50YXJnZXRNYXNzID0gdGFyZ2V0TWFzcztcbiAgICB0aGlzLnBvc3RNZXNzYWdlID0gcG9zdE1lc3NhZ2U7XG4gICAgdGhpcy5vYmplY3RzVG9SZW1vdmUgPSBbXTtcbiAgICB0aGlzLmR5bmFtaWNCb2RpZXMgPSBbXTtcbiAgfVxuICBpbml0KCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZiAodHlwZW9mIHNlbGYuQW1tbyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBzZWxmLkFtbW8oKS50aGVuKCggQW1tb0xpYiApID0+IHtcbiAgICAgICAgICBzZWxmLkFtbW8gPSBzZWxmLkFtbW8gPSBBbW1vTGliO1xuICAgICAgICAgIHRoaXMudHJhbnNmb3JtQXV4ID0gbmV3IHNlbGYuQW1tby5idFRyYW5zZm9ybSgpO1xuICAgICAgICAgIHRoaXMudGVtcEJ0VmVjM18xID0gbmV3IHNlbGYuQW1tby5idFZlY3RvcjMoMCwwLDApO1xuICAgICAgICAgIHRoaXMudGVtcEJ0VmVjM18yID0gbmV3IHNlbGYuQW1tby5idFZlY3RvcjMoMCwwLDApO1xuICAgICAgICAgIHRoaXMudGVtcEJ0VmVjM18zID0gbmV3IHNlbGYuQW1tby5idFZlY3RvcjMoMCwwLDApO1xuICAgICAgICAgIHRoaXMuaW5pdFBoeXNpY3MoKTtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5pbml0UGh5c2ljcygpO1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgaW5pdFBoeXNpY3MoKSB7XG4gICAgLy8gUGh5c2ljcyBjb25maWd1cmF0aW9uXG4gICAgdGhpcy5jb2xsaXNpb25Db25maWd1cmF0aW9uID0gbmV3IHNlbGYuQW1tby5idERlZmF1bHRDb2xsaXNpb25Db25maWd1cmF0aW9uKCk7XG4gICAgdGhpcy5kaXNwYXRjaGVyID0gbmV3IHNlbGYuQW1tby5idENvbGxpc2lvbkRpc3BhdGNoZXIoIHRoaXMuY29sbGlzaW9uQ29uZmlndXJhdGlvbiApO1xuICAgIHRoaXMuYnJvYWRwaGFzZSA9IG5ldyBzZWxmLkFtbW8uYnREYnZ0QnJvYWRwaGFzZSgpO1xuICAgIHRoaXMuc29sdmVyID0gbmV3IHNlbGYuQW1tby5idFNlcXVlbnRpYWxJbXB1bHNlQ29uc3RyYWludFNvbHZlcigpO1xuICAgIHRoaXMucGh5c2ljc1dvcmxkID0gbmV3IHNlbGYuQW1tby5idERpc2NyZXRlRHluYW1pY3NXb3JsZChcbiAgICAgIHRoaXMuZGlzcGF0Y2hlcixcbiAgICAgIHRoaXMuYnJvYWRwaGFzZSxcbiAgICAgIHRoaXMuc29sdmVyLFxuICAgICAgdGhpcy5jb2xsaXNpb25Db25maWd1cmF0aW9uLFxuICAgICk7XG4gICAgLy8gR3Jhdml0eSB3aWxsIGJlIHNldCBkeW5hbWljYWxseSwgZGVwZW5kaW5nIG9uIGNhbWVyYSBwb3NpdGlvbi5cbiAgICB0aGlzLnBoeXNpY3NXb3JsZC5zZXRHcmF2aXR5KG5ldyBzZWxmLkFtbW8uYnRWZWN0b3IzKCAwLCAwLCAwICkpO1xuXG4gICAgdGhpcy5zdGFydExvb3AoKTtcbiAgfVxuICBzdGFydExvb3AoKSB7XG4gICAgdGhpcy5sb29wKCk7XG4gIH1cbiAgZGVsdGFUaW1lID0gKG5ldyBEYXRlKS5nZXRUaW1lKClcbiAgbG9vcCA9ICgpID0+IHtcbiAgICBpZiAoc2VsZi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHtcbiAgICAgIHNlbGYucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMubG9vcCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNldFRpbWVvdXQodGhpcy5sb29wLCAxMDAwLzYwKTtcbiAgICB9XG5cbiAgICBjb25zdCBub3cgPSAobmV3IERhdGUpLmdldFRpbWUoKTtcblxuICAgIHRoaXMudXBkYXRlKG5vdyAtIHRoaXMuZGVsdGFUaW1lKTtcbiAgICB0aGlzLmRlbHRhVGltZSA9IG5vdztcbiAgfVxuICBzZXRBZ2VudFBoeXNpY3NCb2R5KHsgeCwgeSwgeiB9KSB7XG4gICAgY29uc3Qgc2hhcGUgPSBuZXcgc2VsZi5BbW1vLmJ0U3BoZXJlU2hhcGUoIHRoaXMuYWdlbnRSYWRpdXMgKTtcblxuICAgIHNoYXBlLnNldE1hcmdpbiggdGhpcy5tYXJnaW4gKTtcblxuICAgIGNvbnN0IGxvY2FsSW5lcnRpYSA9IG5ldyBzZWxmLkFtbW8uYnRWZWN0b3IzKCAwLCAwLCAwICk7XG5cbiAgICBzaGFwZS5jYWxjdWxhdGVMb2NhbEluZXJ0aWEoIHRoaXMuYWdlbnRNYXNzLCBsb2NhbEluZXJ0aWEgKTtcblxuICAgIGNvbnN0IHRyYW5zZm9ybSA9IG5ldyBzZWxmLkFtbW8uYnRUcmFuc2Zvcm0oKTtcblxuICAgIHRyYW5zZm9ybS5zZXRJZGVudGl0eSgpO1xuXG4gICAgdHJhbnNmb3JtLnNldE9yaWdpbihuZXcgc2VsZi5BbW1vLmJ0VmVjdG9yMyggeCwgeSwgeiApKTtcblxuICAgIGNvbnN0IG1vdGlvblN0YXRlID0gbmV3IHNlbGYuQW1tby5idERlZmF1bHRNb3Rpb25TdGF0ZSh0cmFuc2Zvcm0pO1xuICAgIGNvbnN0IHJiSW5mbyA9IG5ldyBzZWxmLkFtbW8uYnRSaWdpZEJvZHlDb25zdHJ1Y3Rpb25JbmZvKCB0aGlzLmFnZW50TWFzcywgbW90aW9uU3RhdGUsIHNoYXBlLCBsb2NhbEluZXJ0aWEgKTtcbiAgICBjb25zdCBib2R5ID0gbmV3IHNlbGYuQW1tby5idFJpZ2lkQm9keSggcmJJbmZvICk7XG5cbiAgICBib2R5LnNldEFjdGl2YXRpb25TdGF0ZSg0KTtcblxuICAgIGJvZHkudXNlckRhdGEgPSBib2R5LnVzZXJEYXRhIHx8IHt9O1xuICAgIGJvZHkudXNlckRhdGEuaXNBZ2VudCA9IHRydWU7XG4gICAgYm9keS51c2VyRGF0YS5yb2xlID0gJ2FnZW50JztcbiAgICBib2R5LnVzZXJEYXRhLmlkID0gJ2FnZW50JztcbiAgICBib2R5LnVzZXJEYXRhLmNvbGxpZGVkID0gZmFsc2U7XG5cbiAgICB0aGlzLmR5bmFtaWNCb2RpZXMucHVzaChib2R5KTtcbiAgICB0aGlzLmFnZW50Qm9keSA9IGJvZHk7XG5cbiAgICB0aGlzLnBoeXNpY3NXb3JsZC5hZGRSaWdpZEJvZHkoIGJvZHkgKTtcbiAgfVxuXG4gIGFkZFRhcmdldChwb3NpdGlvbiwgcXVhdGVybmlvbiwgdmVydGV4QXJyYXksIHRhcmdldElkKSB7XG4gICAgY29uc3QgdGFyZ2V0Qm9keSA9IHRoaXMuY3JlYXRlQnJlYWthYmxlT2JqZWN0KCBwb3NpdGlvbiwgcXVhdGVybmlvbiwgdmVydGV4QXJyYXksIHRoaXMudGFyZ2V0TWFzcyApO1xuXG4gICAgdGFyZ2V0Qm9keS51c2VyRGF0YSA9IHRhcmdldEJvZHkudXNlckRhdGEgfHwge307XG4gICAgdGFyZ2V0Qm9keS51c2VyRGF0YS5pc1RhcmdldCA9IHRydWU7XG4gICAgdGFyZ2V0Qm9keS51c2VyRGF0YS5yb2xlID0gJ3RhcmdldCc7XG4gICAgdGFyZ2V0Qm9keS51c2VyRGF0YS5pZCA9IHRhcmdldElkO1xuICAgIHRhcmdldEJvZHkudXNlckRhdGEuYnJlYWthYmxlID0gdHJ1ZTtcbiAgfVxuXG4gIGNyZWF0ZUJyZWFrYWJsZU9iamVjdChwb3NpdGlvbiwgcXVhdGVybmlvbiwgdmVydGV4QXJyYXksIG1hc3MsIHZlbG9jaXR5LCBhbmd1bGFyVmVsb2NpdHkpIHtcbiAgICBjb25zdCBzaGFwZSA9IHRoaXMuY3JlYXRlQ29udmV4SHVsbFBoeXNpY3NTaGFwZSggdmVydGV4QXJyYXkgKTtcbiAgICBzaGFwZS5zZXRNYXJnaW4oIHRoaXMubWFyZ2luICk7XG5cbiAgICBjb25zdCBib2R5ID0gdGhpcy5jcmVhdGVSaWdpZEJvZHkoIHNoYXBlLCBtYXNzLCBwb3NpdGlvbiwgcXVhdGVybmlvbiwgdmVsb2NpdHksIGFuZ3VsYXJWZWxvY2l0eSApO1xuXG4gICAgcmV0dXJuIGJvZHk7XG4gIH1cblxuICBjcmVhdGVDb252ZXhIdWxsUGh5c2ljc1NoYXBlKCBjb29yZHMgKSB7XG4gICAgY29uc3Qgc2hhcGUgPSBuZXcgc2VsZi5BbW1vLmJ0Q29udmV4SHVsbFNoYXBlKCk7XG5cbiAgICBmb3IgKCBsZXQgaSA9IDAsIGlsID0gY29vcmRzLmxlbmd0aDsgaSA8IGlsOyBpICs9IDMgKSB7XG4gICAgICB0aGlzLnRlbXBCdFZlYzNfMS5zZXRWYWx1ZSggY29vcmRzWyBpIF0sIGNvb3Jkc1sgaSArIDEgXSwgY29vcmRzWyBpICsgMiBdICk7XG4gICAgICBjb25zdCBsYXN0T25lID0gKCBpID49ICggaWwgLSAzICkgKTtcbiAgICAgIHNoYXBlLmFkZFBvaW50KCB0aGlzLnRlbXBCdFZlYzNfMSwgbGFzdE9uZSApO1xuICAgIH1cblxuICAgIHJldHVybiBzaGFwZTtcbiAgfVxuXG4gIGNyZWF0ZVRyaWFuZ2xlUGh5c2ljc1NoYXBlKCBjb29yZHMgKSB7XG4gICAgY29uc3QgbWVzaCA9IG5ldyBzZWxmLkFtbW8uYnRUcmlhbmdsZU1lc2goKTtcblxuICAgIGZvciAoIGxldCBpID0gMCwgaWwgPSBjb29yZHMubGVuZ3RoOyBpIDwgaWw7IGkgKz0gOSApIHtcbiAgICAgIHRoaXMudGVtcEJ0VmVjM18xLnNldFZhbHVlKCBjb29yZHNbIGkgXSwgY29vcmRzWyBpICsgMSBdLCBjb29yZHNbIGkgKyAyIF0gKTtcbiAgICAgIHRoaXMudGVtcEJ0VmVjM18yLnNldFZhbHVlKCBjb29yZHNbIGkgKyAzIF0sIGNvb3Jkc1sgaSArIDQgXSwgY29vcmRzWyBpICsgNSBdICk7XG4gICAgICB0aGlzLnRlbXBCdFZlYzNfMy5zZXRWYWx1ZSggY29vcmRzWyBpICsgNiBdLCBjb29yZHNbIGkgKyA3IF0sIGNvb3Jkc1sgaSArIDggXSApO1xuICAgICAgLy9jb25zdCBsYXN0T25lID0gKCBpID49ICggaWwgLSAzICkgKTtcbiAgICAgIG1lc2guYWRkVHJpYW5nbGUoIHRoaXMudGVtcEJ0VmVjM18xLCB0aGlzLnRlbXBCdFZlYzNfMiwgdGhpcy50ZW1wQnRWZWMzXzMpO1xuICAgIH1cblxuICAgIGNvbnN0IHNoYXBlID0gbmV3IHNlbGYuQW1tby5idEJ2aFRyaWFuZ2xlTWVzaFNoYXBlKG1lc2gpO1xuXG4gICAgcmV0dXJuIHNoYXBlO1xuICB9XG5cbiAgY3JlYXRlUmlnaWRCb2R5KCBwaHlzaWNzU2hhcGUsIG1hc3MsIHBvcywgcXVhdCwgdmVsLCBhbmdWZWwgKSB7XG4gICAgY29uc3QgdHJhbnNmb3JtID0gbmV3IHNlbGYuQW1tby5idFRyYW5zZm9ybSgpO1xuICAgIHRyYW5zZm9ybS5zZXRJZGVudGl0eSgpO1xuICAgIHRyYW5zZm9ybS5zZXRPcmlnaW4oIG5ldyBzZWxmLkFtbW8uYnRWZWN0b3IzKCBwb3MueCwgcG9zLnksIHBvcy56ICkgKTtcbiAgICB0cmFuc2Zvcm0uc2V0Um90YXRpb24oIG5ldyBzZWxmLkFtbW8uYnRRdWF0ZXJuaW9uKCBxdWF0LngsIHF1YXQueSwgcXVhdC56LCBxdWF0LncgKSApO1xuICAgIGNvbnN0IG1vdGlvblN0YXRlID0gbmV3IHNlbGYuQW1tby5idERlZmF1bHRNb3Rpb25TdGF0ZSggdHJhbnNmb3JtICk7XG5cbiAgICBjb25zdCBsb2NhbEluZXJ0aWEgPSBuZXcgc2VsZi5BbW1vLmJ0VmVjdG9yMyggMCwgMCwgMCApO1xuICAgIHBoeXNpY3NTaGFwZS5jYWxjdWxhdGVMb2NhbEluZXJ0aWEoIG1hc3MsIGxvY2FsSW5lcnRpYSApO1xuXG4gICAgY29uc3QgcmJJbmZvID0gbmV3IHNlbGYuQW1tby5idFJpZ2lkQm9keUNvbnN0cnVjdGlvbkluZm8oIG1hc3MsIG1vdGlvblN0YXRlLCBwaHlzaWNzU2hhcGUsIGxvY2FsSW5lcnRpYSApO1xuICAgIGNvbnN0IGJvZHkgPSBuZXcgc2VsZi5BbW1vLmJ0UmlnaWRCb2R5KCByYkluZm8gKTtcblxuICAgIGJvZHkuc2V0UmVzdGl0dXRpb24oMSk7XG5cbiAgICBpZiAoIHZlbCApIHtcbiAgICAgIGJvZHkuc2V0TGluZWFyVmVsb2NpdHkoIG5ldyBzZWxmLkFtbW8uYnRWZWN0b3IzKCB2ZWwueCwgdmVsLnksIHZlbC56ICkgKTtcbiAgICB9XG4gICAgaWYgKCBhbmdWZWwgKSB7XG4gICAgICBib2R5LnNldEFuZ3VsYXJWZWxvY2l0eSggbmV3IHNlbGYuQW1tby5idFZlY3RvcjMoIGFuZ1ZlbC54LCBhbmdWZWwueSwgYW5nVmVsLnogKSApO1xuICAgIH1cblxuICAgIGJvZHkudXNlckRhdGEgPSBib2R5LnVzZXJEYXRhIHx8IHt9O1xuICAgIGJvZHkudXNlckRhdGEuY29sbGlkZWQgPSBmYWxzZTtcblxuICAgIGlmICggbWFzcyA+IDAgKSB7XG4gICAgICB0aGlzLmR5bmFtaWNCb2RpZXMucHVzaChib2R5KTtcbiAgICAgIC8vIERpc2FibGUgZGVhY3RpdmF0aW9uXG4gICAgICBib2R5LnNldEFjdGl2YXRpb25TdGF0ZSggNCApO1xuICAgIH1cblxuICAgIHRoaXMucGh5c2ljc1dvcmxkLmFkZFJpZ2lkQm9keSggYm9keSApO1xuXG4gICAgcmV0dXJuIGJvZHk7XG4gIH1cblxuICB1cGRhdGUgPSAoIGRlbHRhVGltZSApID0+IHtcblxuICAgIHRoaXMucGh5c2ljc1dvcmxkLnN0ZXBTaW11bGF0aW9uKCBkZWx0YVRpbWUqNSwgMTAgKTtcblxuICAgIC8vIFVwZGF0ZSBvYmplY3RzXG4gICAgZm9yICggbGV0IGkgPSAwLCBpbCA9IHRoaXMuZHluYW1pY0JvZGllcy5sZW5ndGg7IGkgPCBpbDsgaSArKyApIHtcblxuICAgICAgY29uc3Qgb2JqUGh5cyA9IHRoaXMuZHluYW1pY0JvZGllc1sgaSBdO1xuICAgICAgY29uc3QgbW90aW9uU3RhdGUgPSBvYmpQaHlzLmdldE1vdGlvblN0YXRlKCk7XG5cbiAgICAgIGlmIChtb3Rpb25TdGF0ZSkge1xuICAgICAgICBtb3Rpb25TdGF0ZS5nZXRXb3JsZFRyYW5zZm9ybSggdGhpcy50cmFuc2Zvcm1BdXggKTtcblxuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMudHJhbnNmb3JtQXV4LmdldE9yaWdpbigpO1xuICAgICAgICBjb25zdCBxdWF0ZXJuaW9uID0gdGhpcy50cmFuc2Zvcm1BdXguZ2V0Um90YXRpb24oKTtcblxuICAgICAgICBjb25zdCBbIHgsIHksIHogXSA9IFtwb3NpdGlvbi54KCksIHBvc2l0aW9uLnkoKSwgcG9zaXRpb24ueigpXTtcblxuICAgICAgICBpZiAob2JqUGh5cy51c2VyRGF0YS5pc0FnZW50KSB7XG4gICAgICAgICAgaWYgKE1hdGguc3FydChNYXRoLnBvdyh4LCAyKSArIE1hdGgucG93KHksIDIpICsgTWF0aC5wb3coeiwgMikpID4gdGhpcy5ib3VuZGluZ1NwaGVyZVJhZGl1cykge1xuICAgICAgICAgICAgdGhpcy5zdG9wQWdlbnRBZnRlckltcGFjdCgpO1xuICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm1BdXguc2V0T3JpZ2luKG5ldyBzZWxmLkFtbW8uYnRWZWN0b3IzKFxuICAgICAgICAgICAgICBvYmpQaHlzLnVzZXJEYXRhLnByZXZQb3NpdGlvbi54LFxuICAgICAgICAgICAgICBvYmpQaHlzLnVzZXJEYXRhLnByZXZQb3NpdGlvbi55LFxuICAgICAgICAgICAgICBvYmpQaHlzLnVzZXJEYXRhLnByZXZQb3NpdGlvbi56LFxuICAgICAgICAgICAgKSk7XG4gICAgICAgICAgICB0aGlzLmFnZW50Qm9keS5zZXRXb3JsZFRyYW5zZm9ybSh0aGlzLnRyYW5zZm9ybUF1eCk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb2JqUGh5cy51c2VyRGF0YS5wcmV2UG9zaXRpb24gPSB7IHgsIHksIHogfTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICB0YXNrOiAndXBkYXRlJyxcbiAgICAgICAgICByb2xlOiBvYmpQaHlzLnVzZXJEYXRhLnJvbGUsXG4gICAgICAgICAgaWQ6IG9ialBoeXMudXNlckRhdGEuaWQsXG4gICAgICAgICAgcG9zaXRpb246IHsgeCwgeSwgeiB9LFxuICAgICAgICAgIHF1YXRlcm5pb246IFtxdWF0ZXJuaW9uLngoKSwgcXVhdGVybmlvbi55KCksIHF1YXRlcm5pb24ueigpLCBxdWF0ZXJuaW9uLncoKV0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIG9ialBoeXMudXNlckRhdGEuY29sbGlkZWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnByb2Nlc3NDb2xsaXNpb25zKCk7XG4gIH1cblxuICBwcm9jZXNzQ29sbGlzaW9ucygpIHtcbiAgICBmb3IgKCBsZXQgaSA9IDAsIGlsID0gdGhpcy5kaXNwYXRjaGVyLmdldE51bU1hbmlmb2xkcygpOyBpIDwgaWw7IGkgKysgKSB7XG5cbiAgICAgIGNvbnN0IGNvbnRhY3RNYW5pZm9sZCA9IHRoaXMuZGlzcGF0Y2hlci5nZXRNYW5pZm9sZEJ5SW5kZXhJbnRlcm5hbCggaSApO1xuICAgICAgY29uc3QgcmIwID0gc2VsZi5BbW1vLmNhc3RPYmplY3QoIGNvbnRhY3RNYW5pZm9sZC5nZXRCb2R5MCgpLCBzZWxmLkFtbW8uYnRSaWdpZEJvZHkgKTtcbiAgICAgIGNvbnN0IHJiMSA9IHNlbGYuQW1tby5jYXN0T2JqZWN0KCBjb250YWN0TWFuaWZvbGQuZ2V0Qm9keTEoKSwgc2VsZi5BbW1vLmJ0UmlnaWRCb2R5ICk7XG5cbiAgICAgIGNvbnN0IHVzZXJEYXRhMCA9IHJiMC51c2VyRGF0YSB8fCBudWxsO1xuICAgICAgY29uc3QgdXNlckRhdGExID0gcmIxLnVzZXJEYXRhIHx8IG51bGw7XG5cbiAgICAgIGlmICggIXVzZXJEYXRhMCB8fCAhdXNlckRhdGExICkge1xuXHRjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgYnJlYWthYmxlMCA9IHVzZXJEYXRhMCA/IHVzZXJEYXRhMC5icmVha2FibGU6IGZhbHNlO1xuICAgICAgY29uc3QgYnJlYWthYmxlMSA9IHVzZXJEYXRhMSA/IHVzZXJEYXRhMS5icmVha2FibGUgOiBmYWxzZTtcblxuICAgICAgY29uc3QgY29sbGlkZWQwID0gdXNlckRhdGEwID8gdXNlckRhdGEwLmNvbGxpZGVkIDogZmFsc2U7XG4gICAgICBjb25zdCBjb2xsaWRlZDEgPSB1c2VyRGF0YTEgPyB1c2VyRGF0YTEuY29sbGlkZWQgOiBmYWxzZTtcblxuICAgICAgaWYgKCAoICEgYnJlYWthYmxlMCAmJiAhIGJyZWFrYWJsZTEgKSB8fCAoIGNvbGxpZGVkMCAmJiBjb2xsaWRlZDEgKSApIHtcblx0Y29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGxldCBjb250YWN0ID0gZmFsc2U7XG4gICAgICBsZXQgbWF4SW1wdWxzZSA9IDA7XG4gICAgICBmb3IgKCBsZXQgaiA9IDAsIGpsID0gY29udGFjdE1hbmlmb2xkLmdldE51bUNvbnRhY3RzKCk7IGogPCBqbDsgaiArKyApIHtcblxuXHRjb25zdCBjb250YWN0UG9pbnQgPSBjb250YWN0TWFuaWZvbGQuZ2V0Q29udGFjdFBvaW50KCBqICk7XG5cblx0aWYgKCBjb250YWN0UG9pbnQuZ2V0RGlzdGFuY2UoKSA8IDAuMSApIHtcblxuXHQgIGNvbnRhY3QgPSB0cnVlO1xuXHQgIGNvbnN0IGltcHVsc2UgPSBjb250YWN0UG9pbnQuZ2V0QXBwbGllZEltcHVsc2UoKTtcblxuXHQgIGlmICggaW1wdWxzZSA+IG1heEltcHVsc2UgKSB7XG5cblx0ICAgIG1heEltcHVsc2UgPSBpbXB1bHNlO1xuXHQgICAgdmFyIHBvcyA9IGNvbnRhY3RQb2ludC5nZXRfbV9wb3NpdGlvbldvcmxkT25CKCk7XG5cdCAgICB2YXIgbm9ybWFsID0gY29udGFjdFBvaW50LmdldF9tX25vcm1hbFdvcmxkT25CKCk7XG5cdCAgICB0aGlzLmltcGFjdFBvaW50ID0ge3ggOiBwb3MueCgpLCB5OiBwb3MueSgpLCB6IDogcG9zLnooKSB9O1xuXHQgICAgdGhpcy5pbXBhY3ROb3JtYWwgPSB7eCA6IG5vcm1hbC54KCksIHk6IG5vcm1hbC55KCksIHogOiBub3JtYWwueigpIH07XG5cdCAgfVxuXHR9XG4gICAgICB9XG5cbiAgICAgIGlmICh1c2VyRGF0YTAuaXNBZ2VudCkge1xuICAgICAgICByYjAuc2V0QW5ndWxhclZlbG9jaXR5KG5ldyBzZWxmLkFtbW8uYnRWZWN0b3IzKCAwLCAwLCAwICkpO1xuICAgICAgfSBlbHNlIGlmICh1c2VyRGF0YTEuaXNBZ2VudCkge1xuICAgICAgICByYjEuc2V0QW5ndWxhclZlbG9jaXR5KG5ldyBzZWxmLkFtbW8uYnRWZWN0b3IzKCAwLCAwLCAwICkpO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiBubyBwb2ludCBoYXMgY29udGFjdCwgYWJvcnRcbiAgICAgIGlmICggIWNvbnRhY3QgfHwgIXRoaXMuaW1wYWN0UG9pbnQgfHwgKFxuICAgICAgICB0aGlzLmltcGFjdFBvaW50LnggPT09IDAgJiZcbiAgICAgICAgdGhpcy5pbXBhY3RQb2ludC55ID09PSAwICYmXG4gICAgICAgIHRoaXMuaW1wYWN0UG9pbnQueiA9PT0gMFxuICAgICAgKSApIGNvbnRpbnVlO1xuXG4gICAgICBjb25zdCBvYmowYnJlYWtzID0gYnJlYWthYmxlMCAmJiB1c2VyRGF0YTEuaXNBZ2VudCAmJiAhIGNvbGxpZGVkMCAmJiBtYXhJbXB1bHNlID4gdGhpcy5mcmFjdHVyZUltcHVsc2U7XG4gICAgICBjb25zdCBvYmoxYnJlYWtzID0gYnJlYWthYmxlMSAmJiB1c2VyRGF0YTAuaXNBZ2VudCAmJiAhIGNvbGxpZGVkMSAmJiBtYXhJbXB1bHNlID4gdGhpcy5mcmFjdHVyZUltcHVsc2U7XG5cbiAgICAgIC8vIFN1YmRpdmlzaW9uXG4gICAgICBpZiAob2JqMGJyZWFrcyB8fCBvYmoxYnJlYWtzKSB7XG4gICAgICAgIGxldCBkZWJyaXM7XG5cbiAgICAgICAgaWYgKG9iajBicmVha3MpIHtcbiAgICAgICAgICBjb25zdCB2ZWwgPSByYjAuZ2V0TGluZWFyVmVsb2NpdHkoKTtcblx0ICBjb25zdCBhbmdWZWwgPSByYjAuZ2V0QW5ndWxhclZlbG9jaXR5KCk7XG5cbiAgICAgICAgICB0aGlzLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgIHRhc2s6ICdzdWJkaXZpZGVCeUltcGFjdCcsXG4gICAgICAgICAgICBpbXBhY3RQb2ludDogW3RoaXMuaW1wYWN0UG9pbnQueCwgdGhpcy5pbXBhY3RQb2ludC55LCB0aGlzLmltcGFjdFBvaW50LnpdLFxuICAgICAgICAgICAgaW1wYWN0Tm9ybWFsOiBbdGhpcy5pbXBhY3ROb3JtYWwueCwgdGhpcy5pbXBhY3ROb3JtYWwueSwgdGhpcy5pbXBhY3ROb3JtYWwuel0sXG4gICAgICAgICAgICByb2xlOiByYjAudXNlckRhdGEucm9sZSxcbiAgICAgICAgICAgIGlkOiByYjAudXNlckRhdGEuaWQsXG4gICAgICAgICAgICB2ZWw6IFt2ZWwueCgpLCB2ZWwueSgpLCB2ZWwueigpXSxcblx0ICAgIGFuZ1ZlbDogW2FuZ1ZlbC54KCksIGFuZ1ZlbC55KCksIGFuZ1ZlbC56KCldLFxuICAgICAgICAgIH0pO1xuXG5cdCAgdGhpcy5vYmplY3RzVG9SZW1vdmVbIHRoaXMubnVtT2JqZWN0c1RvUmVtb3ZlKysgXSA9IHJiMDtcblx0ICB1c2VyRGF0YTAuY29sbGlkZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvYmoxYnJlYWtzKSB7XG4gICAgICAgICAgY29uc3QgdmVsID0gcmIxLmdldExpbmVhclZlbG9jaXR5KCk7XG5cdCAgY29uc3QgYW5nVmVsID0gcmIxLmdldEFuZ3VsYXJWZWxvY2l0eSgpO1xuXG4gICAgICAgICAgdGhpcy5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICB0YXNrOiAnc3ViZGl2aWRlQnlJbXBhY3QnLFxuICAgICAgICAgICAgaW1wYWN0UG9pbnQ6IFt0aGlzLmltcGFjdFBvaW50LngsIHRoaXMuaW1wYWN0UG9pbnQueSwgdGhpcy5pbXBhY3RQb2ludC56XSxcbiAgICAgICAgICAgIGltcGFjdE5vcm1hbDogW3RoaXMuaW1wYWN0Tm9ybWFsLngsIHRoaXMuaW1wYWN0Tm9ybWFsLnksIHRoaXMuaW1wYWN0Tm9ybWFsLnpdLFxuICAgICAgICAgICAgcm9sZTogcmIxLnVzZXJEYXRhLnJvbGUsXG4gICAgICAgICAgICBpZDogcmIxLnVzZXJEYXRhLmlkLFxuICAgICAgICAgICAgdmVsOiBbdmVsLngoKSwgdmVsLnkoKSwgdmVsLnooKV0sXG5cdCAgICBhbmdWZWw6IFthbmdWZWwueCgpLCBhbmdWZWwueSgpLCBhbmdWZWwueigpXSxcbiAgICAgICAgICB9KTtcblxuXHQgIHRoaXMub2JqZWN0c1RvUmVtb3ZlWyB0aGlzLm51bU9iamVjdHNUb1JlbW92ZSsrIF0gPSByYjE7XG5cdCAgdXNlckRhdGExLmNvbGxpZGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgodXNlckRhdGEwICYmIHVzZXJEYXRhMC5pc1RhcmdldCkgfHwgKHVzZXJEYXRhMSAmJiB1c2VyRGF0YTEuaXNUYXJnZXQpKSB7XG5cbiAgICAgICAgICB0aGlzLnN0b3BBZ2VudEFmdGVySW1wYWN0KCk7XG5cbiAgICAgICAgICBjb25zdCB0YXJnZXRVc2VyRGF0YSA9IHVzZXJEYXRhMC5pc1RhcmdldCA/IHVzZXJEYXRhMCA6IHVzZXJEYXRhMTtcblxuICAgICAgICAgIGlmICh0YXJnZXRVc2VyRGF0YS53YXNIaXQgIT09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMucG9zdE1lc3NhZ2UoeyB0YXNrOiAncGxheUF1ZGlvJyB9KTtcbiAgICAgICAgICAgIHRhcmdldFVzZXJEYXRhLndhc0hpdCA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubnVtT2JqZWN0c1RvUmVtb3ZlKSB7XG4gICAgICB0aGlzLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgdGFzazogJ3JlbW92ZURlYnJpcycsXG4gICAgICAgIGRlYnJpczogdGhpcy5vYmplY3RzVG9SZW1vdmUubWFwKCh7IHVzZXJEYXRhOiB7IHJvbGUsIGlkIH19KSA9PiAoeyByb2xlLCBpZCB9KSksXG4gICAgICB9KTtcblxuICAgICAgZm9yICggdmFyIGkgPSAwOyBpIDwgdGhpcy5udW1PYmplY3RzVG9SZW1vdmU7IGkgKysgKSB7XG4gICAgICAgIHRoaXMucGh5c2ljc1dvcmxkLnJlbW92ZVJpZ2lkQm9keSh0aGlzLm9iamVjdHNUb1JlbW92ZVtpXSk7XG4gICAgICB9XG4gICAgICB0aGlzLm51bU9iamVjdHNUb1JlbW92ZSA9IDA7XG4gICAgfVxuICAgIFxuICB9XG5cbiAgY2xlYXJEZWJyaXMoZGVicmlzKSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgdGFzazogJ3JlbW92ZURlYnJpcycsXG4gICAgICAgIGRlYnJpczogZGVicmlzLm1hcCgoeyB1c2VyRGF0YTogeyByb2xlLCBpZCB9fSkgPT4gKHsgcm9sZSwgaWQgfSkpLFxuICAgICAgfSk7XG5cbiAgICAgIGZvciAoY29uc3QgZGVicmVlSW5kZXggaW4gZGVicmlzKSB7XG4gICAgICAgIHRoaXMucGh5c2ljc1dvcmxkLnJlbW92ZVJpZ2lkQm9keShkZWJyaXNbZGVicmVlSW5kZXhdKTtcbiAgICAgIH1cbiAgICB9LCB0aGlzLmRlYnJpc0xpZmV0aW1lTXMpO1xuICB9XG5cbiAgc3RvcEFnZW50QWZ0ZXJJbXBhY3QoKSB7XG4gICAgdGhpcy5hZ2VudEJvZHkuc2V0TGluZWFyVmVsb2NpdHkobmV3IHNlbGYuQW1tby5idFZlY3RvcjMoIDAsIDAsIDAgKSk7XG4gIH1cbn1cblxuc2VsZi5waHlzaWNzSW5zdGFuY2UgPSAnZHVtbXknO1xuXG5zZWxmLm9ubWVzc2FnZSA9IGFzeW5jIGZ1bmN0aW9uIChlKSB7XG4gIHN3aXRjaChlLmRhdGEudGFzaykge1xuICBjYXNlICdpbml0JzpcbiAgICBjb25zdCB7XG4gICAgICBhZ2VudFJhZGl1cywgYWdlbnRNYXNzLCBib3VuZGluZ1NwaGVyZVJhZGl1cywgZnJhY3R1cmVJbXB1bHNlLCBkZWJyaXNMaWZldGltZU1zLCB0YXJnZXRNYXNzLFxuICAgIH0gPSBlLmRhdGEubGliO1xuXG4gICAgc2VsZi5waHlzaWNzSW5zdGFuY2UgPSBuZXcgUGh5c2ljcyh7XG4gICAgICBhZ2VudFJhZGl1cywgYWdlbnRNYXNzLCBib3VuZGluZ1NwaGVyZVJhZGl1cywgZnJhY3R1cmVJbXB1bHNlLCBkZWJyaXNMaWZldGltZU1zLCB0YXJnZXRNYXNzLFxuICAgICAgcG9zdE1lc3NhZ2UobWVzc2FnZSkge1xuICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKG1lc3NhZ2UpO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGF3YWl0IHNlbGYucGh5c2ljc0luc3RhbmNlLmluaXQoKTtcblxuICAgIHNlbGYucG9zdE1lc3NhZ2UoeyB0YXNrOiAncmVhZHknIH0pO1xuXG4gICAgYnJlYWs7XG4gIGNhc2UgJ3NldEFnZW50JzpcblxuICAgIGNvbnN0IHsgcG9zaXRpb24gfSA9IGUuZGF0YTtcblxuICAgIHNlbGYucGh5c2ljc0luc3RhbmNlLnNldEFnZW50UGh5c2ljc0JvZHkocG9zaXRpb24pO1xuXG4gICAgYnJlYWs7XG4gIGNhc2UgJ3B1bmNoJzoge1xuICAgIGNvbnN0IHsgdmVjdG9yOiB7IHgsIHksIHogfSB9ID0gZS5kYXRhO1xuXG4gICAgc2VsZi5waHlzaWNzSW5zdGFuY2UuYWdlbnRCb2R5LmFwcGx5Rm9yY2UobmV3IHNlbGYuQW1tby5idFZlY3RvcjMoeCwgeSwgeikpO1xuXG4gICAgYnJlYWs7XG4gIH1cbiAgY2FzZSAnYWRkVGFyZ2V0Jzoge1xuICAgIGNvbnN0IHsgcG9zaXRpb24sIHF1YXRlcm5pb24sIHZlcnRleEFycmF5LCB0YXJnZXRJZCB9ID0gZS5kYXRhO1xuXG4gICAgc2VsZi5waHlzaWNzSW5zdGFuY2UuYWRkVGFyZ2V0KHBvc2l0aW9uLCBxdWF0ZXJuaW9uLCB2ZXJ0ZXhBcnJheSwgdGFyZ2V0SWQpO1xuXG4gICAgYnJlYWs7XG4gIH1cbiAgY2FzZSAnZnJlZXplJzoge1xuICAgIHNlbGYucGh5c2ljc0luc3RhbmNlLnN0b3BBZ2VudEFmdGVySW1wYWN0KCk7XG5cbiAgICBicmVhaztcbiAgfVxuICBjYXNlICdjcmVhdGVGcmFnbWVudHMnOiB7XG5cbiAgICBjb25zdCB7IGZyYWdtZW50cyB9ID0gZS5kYXRhO1xuXG4gICAgY29uc3QgbnVtT2JqZWN0cyA9IGZyYWdtZW50cy5sZW5ndGg7XG4gICAgY29uc3QgZGVicmlzID0gW107XG4gICAgZm9yICggbGV0IGogPSAwOyBqIDwgbnVtT2JqZWN0czsgaiArKyApIHtcbiAgICAgIGNvbnN0IFtcbiAgICAgICAgZnJhZ21lbnRJZCwgcG9zaXRpb24sIHF1YXRlcm5pb24sIHZlcnRleEFycmF5LCBtYXNzLCB2ZWxvY2l0eSwgYW5ndWxhclZlbG9jaXR5XG4gICAgICBdID0gZnJhZ21lbnRzWyBqIF07XG5cbiAgICAgIGNvbnN0IGJvZHkgPSBzZWxmLnBoeXNpY3NJbnN0YW5jZS5jcmVhdGVCcmVha2FibGVPYmplY3QoXG4gICAgICAgIGFycmF5VG9WZWMzU291cmNlKHBvc2l0aW9uKSxcbiAgICAgICAgYXJyYXlUb1ZlYzNTb3VyY2UocXVhdGVybmlvbiksXG4gICAgICAgIHZlcnRleEFycmF5LFxuICAgICAgICBtYXNzLFxuICAgICAgICBhcnJheVRvVmVjM1NvdXJjZSh2ZWxvY2l0eSksXG4gICAgICAgIGFycmF5VG9WZWMzU291cmNlKGFuZ3VsYXJWZWxvY2l0eSlcbiAgICAgICk7XG4gICAgICBib2R5LnVzZXJEYXRhID0gYm9keS51c2VyRGF0YSB8fCB7fTtcbiAgICAgIGJvZHkudXNlckRhdGEuaWQgPSBmcmFnbWVudElkO1xuICAgICAgYm9keS51c2VyRGF0YS5yb2xlID0gJ2ZyYWdtZW50JztcbiAgICAgIGJvZHkudXNlckRhdGEuaXNGcmFnbWVudCA9IHRydWU7XG4gICAgICBkZWJyaXMucHVzaChib2R5KTtcbiAgICB9XG5cbiAgICBzZWxmLnBoeXNpY3NJbnN0YW5jZS5jbGVhckRlYnJpcyhkZWJyaXMpO1xuICAgIFxuICAgIGJyZWFrO1xuICB9XG4gIH1cbn07XG4iXX0=
