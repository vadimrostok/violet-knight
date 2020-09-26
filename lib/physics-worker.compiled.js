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

self.importScripts('/lib/ammo.2.js', '/node_modules/@babel/polyfill/dist/polyfill.min.js');

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvcGh5c2ljcy13b3JrZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBLElBQUksQ0FBQyxhQUFMLENBQ0UsZ0JBREYsRUFFRSxvREFGRjs7QUFLQSxTQUFTLGlCQUFULENBQTJCLEdBQTNCLEVBQWdDO0FBQzlCLE1BQU0sTUFBTSxHQUFHO0FBQUMsSUFBQSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUQsQ0FBUDtBQUFZLElBQUEsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFELENBQWxCO0FBQXVCLElBQUEsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFEO0FBQTdCLEdBQWY7O0FBQ0EsTUFBSSxHQUFHLENBQUMsQ0FBRCxDQUFQLEVBQVk7QUFDVixJQUFBLE1BQU0sQ0FBQyxDQUFQLEdBQVcsR0FBRyxDQUFDLENBQUQsQ0FBZDtBQUNEOztBQUNELFNBQU8sTUFBUDtBQUNEOztJQUVLLE87QUFvQkoseUJBR0c7QUFBQTs7QUFBQSxRQUZELFdBRUMsUUFGRCxXQUVDO0FBQUEsUUFGWSxTQUVaLFFBRlksU0FFWjtBQUFBLFFBRnVCLG9CQUV2QixRQUZ1QixvQkFFdkI7QUFBQSxRQUY2QyxlQUU3QyxRQUY2QyxlQUU3QztBQUFBLFFBRjhELGdCQUU5RCxRQUY4RCxnQkFFOUQ7QUFBQSxRQUZnRixVQUVoRixRQUZnRixVQUVoRjtBQUFBLFFBREQsV0FDQyxRQURELFdBQ0M7O0FBQUE7O0FBQUEsb0RBdEJzQixJQXNCdEI7O0FBQUEsd0NBckJVLElBcUJWOztBQUFBLHdDQXBCVSxJQW9CVjs7QUFBQSxvQ0FuQk0sSUFtQk47O0FBQUEsMENBbEJZLElBa0JaOztBQUFBLDBDQWpCWSxJQWlCWjs7QUFBQSwwQ0FoQlksSUFnQlo7O0FBQUEsMENBZlksSUFlWjs7QUFBQSwwQ0FkWSxJQWNaOztBQUFBLG9DQWJNLENBYU47O0FBQUEs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QUFHLFVBQXJCLEVBQWlDLENBQUMsRUFBbEMsRUFBd0M7QUFBQSw0Q0FHbEMsU0FBUyxDQUFFLENBQUYsQ0FIeUIsTUFFcEMsVUFGb0Msb0JBRXhCLFVBRndCLG9CQUVkLFdBRmMsb0JBRUYsWUFGRSxvQkFFVyxJQUZYLG9CQUVpQixRQUZqQixvQkFFMkIsZUFGM0I7QUFLaEMsY0FBQSxJQUxnQyxHQUt6QixJQUFJLENBQUMsZUFBTCxDQUFxQixxQkFBckIsQ0FDWCxpQkFBaUIsQ0FBQyxVQUFELENBRE4sRUFFWCxpQkFBaUIsQ0FBQyxXQUFELENBRk4sRUFHWCxZQUhXLEVBSVgsSUFKVyxFQUtYLGlCQUFpQixDQUFDLFFBQUQsQ0FMTixFQU1YLGlCQUFpQixDQUFDLGVBQUQsQ0FOTixDQUx5QjtBQWF0QyxjQUFBLElBQUksQ0FBQyxRQUFMLEdBQWdCLElBQUksQ0FBQyxRQUFMLElBQWlCLEVBQWpDO0FBQ0EsY0FBQSxJQUFJLENBQUMsUUFBTCxDQUFjLEVBQWQsR0FBbUIsVUFBbkI7QUFDQSxjQUFBLElBQUksQ0FBQyxRQUFMLENBQWMsSUFBZCxHQUFxQixVQUFyQjtBQUNBLGNBQUEsSUFBSSxDQUFDLFFBQUwsQ0FBYyxVQUFkLEdBQTJCLElBQTNCO0FBQ0EsY0FBQSxNQUFNLENBQUMsSUFBUCxDQUFZLElBQVo7QUFDRDs7QUFFRCxZQUFBLElBQUksQ0FBQyxlQUFMLENBQXFCLFdBQXJCLENBQWlDLE1BQWpDO0FBdkVhOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEdBQWpCOztBQUFBO0FBQUE7QUFBQTtBQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwic2VsZi5pbXBvcnRTY3JpcHRzKFxuICAnL2xpYi9hbW1vLjIuanMnLFxuICAnL25vZGVfbW9kdWxlcy9AYmFiZWwvcG9seWZpbGwvZGlzdC9wb2x5ZmlsbC5taW4uanMnLFxuKTtcblxuZnVuY3Rpb24gYXJyYXlUb1ZlYzNTb3VyY2UoYXJyKSB7XG4gIGNvbnN0IHJlc3VsdCA9IHt4OiBhcnJbMF0sIHk6IGFyclsxXSwgejogYXJyWzJdfTtcbiAgaWYgKGFyclszXSkge1xuICAgIHJlc3VsdC53ID0gYXJyWzNdO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmNsYXNzIFBoeXNpY3Mge1xuICBjb2xsaXNpb25Db25maWd1cmF0aW9uID0gbnVsbFxuICBkaXNwYXRjaGVyID0gbnVsbFxuICBicm9hZHBoYXNlID0gbnVsbFxuICBzb2x2ZXIgPSBudWxsXG4gIHBoeXNpY3NXb3JsZCA9IG51bGxcbiAgdHJhbnNmb3JtQXV4ID0gbnVsbFxuICB0ZW1wQnRWZWMzXzEgPSBudWxsXG4gIHRlbXBCdFZlYzNfMiA9IG51bGxcbiAgdGVtcEJ0VmVjM18zID0gbnVsbFxuICBtYXJnaW4gPSAwXG4gIGltcGFjdFBvaW50ID0gbnVsbFxuICBpbXBhY3ROb3JtYWwgPSBudWxsXG4gIG51bU9iamVjdHNUb1JlbW92ZSA9IDBcbiAgYWdlbnRCb2R5ID0gbnVsbFxuICBhZ2VudFJhZGl1cyA9IDBcbiAgYWdlbnRNYXNzID0gMFxuICB0YXJnZXRNYXNzID0gMFxuICBib3VuZGluZ1NwaGVyZVJhZGl1cyA9IDBcbiAgcG9zdE1lc3NhZ2UgPSBudWxsXG4gIGNvbnN0cnVjdG9yKHtcbiAgICBhZ2VudFJhZGl1cywgYWdlbnRNYXNzLCBib3VuZGluZ1NwaGVyZVJhZGl1cywgZnJhY3R1cmVJbXB1bHNlLCBkZWJyaXNMaWZldGltZU1zLCB0YXJnZXRNYXNzLFxuICAgIHBvc3RNZXNzYWdlLFxuICB9KSB7XG4gICAgdGhpcy5hZ2VudFJhZGl1cyA9IGFnZW50UmFkaXVzO1xuICAgIHRoaXMuYWdlbnRNYXNzID0gYWdlbnRNYXNzO1xuICAgIHRoaXMuYm91bmRpbmdTcGhlcmVSYWRpdXMgPSBib3VuZGluZ1NwaGVyZVJhZGl1cztcbiAgICB0aGlzLmZyYWN0dXJlSW1wdWxzZSA9IGZyYWN0dXJlSW1wdWxzZTtcbiAgICB0aGlzLmRlYnJpc0xpZmV0aW1lTXMgPSBkZWJyaXNMaWZldGltZU1zO1xuICAgIHRoaXMudGFyZ2V0TWFzcyA9IHRhcmdldE1hc3M7XG4gICAgdGhpcy5wb3N0TWVzc2FnZSA9IHBvc3RNZXNzYWdlO1xuICAgIHRoaXMub2JqZWN0c1RvUmVtb3ZlID0gW107XG4gICAgdGhpcy5keW5hbWljQm9kaWVzID0gW107XG4gIH1cbiAgaW5pdCgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBzZWxmLkFtbW8gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgc2VsZi5BbW1vKCkudGhlbigoIEFtbW9MaWIgKSA9PiB7XG4gICAgICAgICAgc2VsZi5BbW1vID0gc2VsZi5BbW1vID0gQW1tb0xpYjtcbiAgICAgICAgICB0aGlzLnRyYW5zZm9ybUF1eCA9IG5ldyBzZWxmLkFtbW8uYnRUcmFuc2Zvcm0oKTtcbiAgICAgICAgICB0aGlzLnRlbXBCdFZlYzNfMSA9IG5ldyBzZWxmLkFtbW8uYnRWZWN0b3IzKDAsMCwwKTtcbiAgICAgICAgICB0aGlzLnRlbXBCdFZlYzNfMiA9IG5ldyBzZWxmLkFtbW8uYnRWZWN0b3IzKDAsMCwwKTtcbiAgICAgICAgICB0aGlzLnRlbXBCdFZlYzNfMyA9IG5ldyBzZWxmLkFtbW8uYnRWZWN0b3IzKDAsMCwwKTtcbiAgICAgICAgICB0aGlzLmluaXRQaHlzaWNzKCk7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaW5pdFBoeXNpY3MoKTtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGluaXRQaHlzaWNzKCkge1xuICAgIC8vIFBoeXNpY3MgY29uZmlndXJhdGlvblxuICAgIHRoaXMuY29sbGlzaW9uQ29uZmlndXJhdGlvbiA9IG5ldyBzZWxmLkFtbW8uYnREZWZhdWx0Q29sbGlzaW9uQ29uZmlndXJhdGlvbigpO1xuICAgIHRoaXMuZGlzcGF0Y2hlciA9IG5ldyBzZWxmLkFtbW8uYnRDb2xsaXNpb25EaXNwYXRjaGVyKCB0aGlzLmNvbGxpc2lvbkNvbmZpZ3VyYXRpb24gKTtcbiAgICB0aGlzLmJyb2FkcGhhc2UgPSBuZXcgc2VsZi5BbW1vLmJ0RGJ2dEJyb2FkcGhhc2UoKTtcbiAgICB0aGlzLnNvbHZlciA9IG5ldyBzZWxmLkFtbW8uYnRTZXF1ZW50aWFsSW1wdWxzZUNvbnN0cmFpbnRTb2x2ZXIoKTtcbiAgICB0aGlzLnBoeXNpY3NXb3JsZCA9IG5ldyBzZWxmLkFtbW8uYnREaXNjcmV0ZUR5bmFtaWNzV29ybGQoXG4gICAgICB0aGlzLmRpc3BhdGNoZXIsXG4gICAgICB0aGlzLmJyb2FkcGhhc2UsXG4gICAgICB0aGlzLnNvbHZlcixcbiAgICAgIHRoaXMuY29sbGlzaW9uQ29uZmlndXJhdGlvbixcbiAgICApO1xuICAgIC8vIEdyYXZpdHkgd2lsbCBiZSBzZXQgZHluYW1pY2FsbHksIGRlcGVuZGluZyBvbiBjYW1lcmEgcG9zaXRpb24uXG4gICAgdGhpcy5waHlzaWNzV29ybGQuc2V0R3Jhdml0eShuZXcgc2VsZi5BbW1vLmJ0VmVjdG9yMyggMCwgMCwgMCApKTtcblxuICAgIHRoaXMuc3RhcnRMb29wKCk7XG4gIH1cbiAgc3RhcnRMb29wKCkge1xuICAgIHRoaXMubG9vcCgpO1xuICB9XG4gIGRlbHRhVGltZSA9IChuZXcgRGF0ZSkuZ2V0VGltZSgpXG4gIGxvb3AgPSAoKSA9PiB7XG4gICAgaWYgKHNlbGYucmVxdWVzdEFuaW1hdGlvbkZyYW1lKSB7XG4gICAgICBzZWxmLnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmxvb3ApO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZXRUaW1lb3V0KHRoaXMubG9vcCwgMTAwMC82MCk7XG4gICAgfVxuXG4gICAgY29uc3Qgbm93ID0gKG5ldyBEYXRlKS5nZXRUaW1lKCk7XG5cbiAgICB0aGlzLnVwZGF0ZShub3cgLSB0aGlzLmRlbHRhVGltZSk7XG4gICAgdGhpcy5kZWx0YVRpbWUgPSBub3c7XG4gIH1cbiAgc2V0QWdlbnRQaHlzaWNzQm9keSh7IHgsIHksIHogfSkge1xuICAgIGNvbnN0IHNoYXBlID0gbmV3IHNlbGYuQW1tby5idFNwaGVyZVNoYXBlKCB0aGlzLmFnZW50UmFkaXVzICk7XG5cbiAgICBzaGFwZS5zZXRNYXJnaW4oIHRoaXMubWFyZ2luICk7XG5cbiAgICBjb25zdCBsb2NhbEluZXJ0aWEgPSBuZXcgc2VsZi5BbW1vLmJ0VmVjdG9yMyggMCwgMCwgMCApO1xuXG4gICAgc2hhcGUuY2FsY3VsYXRlTG9jYWxJbmVydGlhKCB0aGlzLmFnZW50TWFzcywgbG9jYWxJbmVydGlhICk7XG5cbiAgICBjb25zdCB0cmFuc2Zvcm0gPSBuZXcgc2VsZi5BbW1vLmJ0VHJhbnNmb3JtKCk7XG5cbiAgICB0cmFuc2Zvcm0uc2V0SWRlbnRpdHkoKTtcblxuICAgIHRyYW5zZm9ybS5zZXRPcmlnaW4obmV3IHNlbGYuQW1tby5idFZlY3RvcjMoIHgsIHksIHogKSk7XG5cbiAgICBjb25zdCBtb3Rpb25TdGF0ZSA9IG5ldyBzZWxmLkFtbW8uYnREZWZhdWx0TW90aW9uU3RhdGUodHJhbnNmb3JtKTtcbiAgICBjb25zdCByYkluZm8gPSBuZXcgc2VsZi5BbW1vLmJ0UmlnaWRCb2R5Q29uc3RydWN0aW9uSW5mbyggdGhpcy5hZ2VudE1hc3MsIG1vdGlvblN0YXRlLCBzaGFwZSwgbG9jYWxJbmVydGlhICk7XG4gICAgY29uc3QgYm9keSA9IG5ldyBzZWxmLkFtbW8uYnRSaWdpZEJvZHkoIHJiSW5mbyApO1xuXG4gICAgYm9keS5zZXRBY3RpdmF0aW9uU3RhdGUoNCk7XG5cbiAgICBib2R5LnVzZXJEYXRhID0gYm9keS51c2VyRGF0YSB8fCB7fTtcbiAgICBib2R5LnVzZXJEYXRhLmlzQWdlbnQgPSB0cnVlO1xuICAgIGJvZHkudXNlckRhdGEucm9sZSA9ICdhZ2VudCc7XG4gICAgYm9keS51c2VyRGF0YS5pZCA9ICdhZ2VudCc7XG4gICAgYm9keS51c2VyRGF0YS5jb2xsaWRlZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5keW5hbWljQm9kaWVzLnB1c2goYm9keSk7XG4gICAgdGhpcy5hZ2VudEJvZHkgPSBib2R5O1xuXG4gICAgdGhpcy5waHlzaWNzV29ybGQuYWRkUmlnaWRCb2R5KCBib2R5ICk7XG4gIH1cblxuICBhZGRUYXJnZXQocG9zaXRpb24sIHF1YXRlcm5pb24sIHZlcnRleEFycmF5LCB0YXJnZXRJZCkge1xuICAgIGNvbnN0IHRhcmdldEJvZHkgPSB0aGlzLmNyZWF0ZUJyZWFrYWJsZU9iamVjdCggcG9zaXRpb24sIHF1YXRlcm5pb24sIHZlcnRleEFycmF5LCB0aGlzLnRhcmdldE1hc3MgKTtcblxuICAgIHRhcmdldEJvZHkudXNlckRhdGEgPSB0YXJnZXRCb2R5LnVzZXJEYXRhIHx8IHt9O1xuICAgIHRhcmdldEJvZHkudXNlckRhdGEuaXNUYXJnZXQgPSB0cnVlO1xuICAgIHRhcmdldEJvZHkudXNlckRhdGEucm9sZSA9ICd0YXJnZXQnO1xuICAgIHRhcmdldEJvZHkudXNlckRhdGEuaWQgPSB0YXJnZXRJZDtcbiAgICB0YXJnZXRCb2R5LnVzZXJEYXRhLmJyZWFrYWJsZSA9IHRydWU7XG4gIH1cblxuICBjcmVhdGVCcmVha2FibGVPYmplY3QocG9zaXRpb24sIHF1YXRlcm5pb24sIHZlcnRleEFycmF5LCBtYXNzLCB2ZWxvY2l0eSwgYW5ndWxhclZlbG9jaXR5KSB7XG4gICAgY29uc3Qgc2hhcGUgPSB0aGlzLmNyZWF0ZUNvbnZleEh1bGxQaHlzaWNzU2hhcGUoIHZlcnRleEFycmF5ICk7XG4gICAgc2hhcGUuc2V0TWFyZ2luKCB0aGlzLm1hcmdpbiApO1xuXG4gICAgY29uc3QgYm9keSA9IHRoaXMuY3JlYXRlUmlnaWRCb2R5KCBzaGFwZSwgbWFzcywgcG9zaXRpb24sIHF1YXRlcm5pb24sIHZlbG9jaXR5LCBhbmd1bGFyVmVsb2NpdHkgKTtcblxuICAgIHJldHVybiBib2R5O1xuICB9XG5cbiAgY3JlYXRlQ29udmV4SHVsbFBoeXNpY3NTaGFwZSggY29vcmRzICkge1xuICAgIGNvbnN0IHNoYXBlID0gbmV3IHNlbGYuQW1tby5idENvbnZleEh1bGxTaGFwZSgpO1xuXG4gICAgZm9yICggbGV0IGkgPSAwLCBpbCA9IGNvb3Jkcy5sZW5ndGg7IGkgPCBpbDsgaSArPSAzICkge1xuICAgICAgdGhpcy50ZW1wQnRWZWMzXzEuc2V0VmFsdWUoIGNvb3Jkc1sgaSBdLCBjb29yZHNbIGkgKyAxIF0sIGNvb3Jkc1sgaSArIDIgXSApO1xuICAgICAgY29uc3QgbGFzdE9uZSA9ICggaSA+PSAoIGlsIC0gMyApICk7XG4gICAgICBzaGFwZS5hZGRQb2ludCggdGhpcy50ZW1wQnRWZWMzXzEsIGxhc3RPbmUgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2hhcGU7XG4gIH1cblxuICBjcmVhdGVUcmlhbmdsZVBoeXNpY3NTaGFwZSggY29vcmRzICkge1xuICAgIGNvbnN0IG1lc2ggPSBuZXcgc2VsZi5BbW1vLmJ0VHJpYW5nbGVNZXNoKCk7XG5cbiAgICBmb3IgKCBsZXQgaSA9IDAsIGlsID0gY29vcmRzLmxlbmd0aDsgaSA8IGlsOyBpICs9IDkgKSB7XG4gICAgICB0aGlzLnRlbXBCdFZlYzNfMS5zZXRWYWx1ZSggY29vcmRzWyBpIF0sIGNvb3Jkc1sgaSArIDEgXSwgY29vcmRzWyBpICsgMiBdICk7XG4gICAgICB0aGlzLnRlbXBCdFZlYzNfMi5zZXRWYWx1ZSggY29vcmRzWyBpICsgMyBdLCBjb29yZHNbIGkgKyA0IF0sIGNvb3Jkc1sgaSArIDUgXSApO1xuICAgICAgdGhpcy50ZW1wQnRWZWMzXzMuc2V0VmFsdWUoIGNvb3Jkc1sgaSArIDYgXSwgY29vcmRzWyBpICsgNyBdLCBjb29yZHNbIGkgKyA4IF0gKTtcbiAgICAgIC8vY29uc3QgbGFzdE9uZSA9ICggaSA+PSAoIGlsIC0gMyApICk7XG4gICAgICBtZXNoLmFkZFRyaWFuZ2xlKCB0aGlzLnRlbXBCdFZlYzNfMSwgdGhpcy50ZW1wQnRWZWMzXzIsIHRoaXMudGVtcEJ0VmVjM18zKTtcbiAgICB9XG5cbiAgICBjb25zdCBzaGFwZSA9IG5ldyBzZWxmLkFtbW8uYnRCdmhUcmlhbmdsZU1lc2hTaGFwZShtZXNoKTtcblxuICAgIHJldHVybiBzaGFwZTtcbiAgfVxuXG4gIGNyZWF0ZVJpZ2lkQm9keSggcGh5c2ljc1NoYXBlLCBtYXNzLCBwb3MsIHF1YXQsIHZlbCwgYW5nVmVsICkge1xuICAgIGNvbnN0IHRyYW5zZm9ybSA9IG5ldyBzZWxmLkFtbW8uYnRUcmFuc2Zvcm0oKTtcbiAgICB0cmFuc2Zvcm0uc2V0SWRlbnRpdHkoKTtcbiAgICB0cmFuc2Zvcm0uc2V0T3JpZ2luKCBuZXcgc2VsZi5BbW1vLmJ0VmVjdG9yMyggcG9zLngsIHBvcy55LCBwb3MueiApICk7XG4gICAgdHJhbnNmb3JtLnNldFJvdGF0aW9uKCBuZXcgc2VsZi5BbW1vLmJ0UXVhdGVybmlvbiggcXVhdC54LCBxdWF0LnksIHF1YXQueiwgcXVhdC53ICkgKTtcbiAgICBjb25zdCBtb3Rpb25TdGF0ZSA9IG5ldyBzZWxmLkFtbW8uYnREZWZhdWx0TW90aW9uU3RhdGUoIHRyYW5zZm9ybSApO1xuXG4gICAgY29uc3QgbG9jYWxJbmVydGlhID0gbmV3IHNlbGYuQW1tby5idFZlY3RvcjMoIDAsIDAsIDAgKTtcbiAgICBwaHlzaWNzU2hhcGUuY2FsY3VsYXRlTG9jYWxJbmVydGlhKCBtYXNzLCBsb2NhbEluZXJ0aWEgKTtcblxuICAgIGNvbnN0IHJiSW5mbyA9IG5ldyBzZWxmLkFtbW8uYnRSaWdpZEJvZHlDb25zdHJ1Y3Rpb25JbmZvKCBtYXNzLCBtb3Rpb25TdGF0ZSwgcGh5c2ljc1NoYXBlLCBsb2NhbEluZXJ0aWEgKTtcbiAgICBjb25zdCBib2R5ID0gbmV3IHNlbGYuQW1tby5idFJpZ2lkQm9keSggcmJJbmZvICk7XG5cbiAgICBib2R5LnNldFJlc3RpdHV0aW9uKDEpO1xuXG4gICAgaWYgKCB2ZWwgKSB7XG4gICAgICBib2R5LnNldExpbmVhclZlbG9jaXR5KCBuZXcgc2VsZi5BbW1vLmJ0VmVjdG9yMyggdmVsLngsIHZlbC55LCB2ZWwueiApICk7XG4gICAgfVxuICAgIGlmICggYW5nVmVsICkge1xuICAgICAgYm9keS5zZXRBbmd1bGFyVmVsb2NpdHkoIG5ldyBzZWxmLkFtbW8uYnRWZWN0b3IzKCBhbmdWZWwueCwgYW5nVmVsLnksIGFuZ1ZlbC56ICkgKTtcbiAgICB9XG5cbiAgICBib2R5LnVzZXJEYXRhID0gYm9keS51c2VyRGF0YSB8fCB7fTtcbiAgICBib2R5LnVzZXJEYXRhLmNvbGxpZGVkID0gZmFsc2U7XG5cbiAgICBpZiAoIG1hc3MgPiAwICkge1xuICAgICAgdGhpcy5keW5hbWljQm9kaWVzLnB1c2goYm9keSk7XG4gICAgICAvLyBEaXNhYmxlIGRlYWN0aXZhdGlvblxuICAgICAgYm9keS5zZXRBY3RpdmF0aW9uU3RhdGUoIDQgKTtcbiAgICB9XG5cbiAgICB0aGlzLnBoeXNpY3NXb3JsZC5hZGRSaWdpZEJvZHkoIGJvZHkgKTtcblxuICAgIHJldHVybiBib2R5O1xuICB9XG5cbiAgdXBkYXRlID0gKCBkZWx0YVRpbWUgKSA9PiB7XG5cbiAgICB0aGlzLnBoeXNpY3NXb3JsZC5zdGVwU2ltdWxhdGlvbiggZGVsdGFUaW1lKjUsIDEwICk7XG5cbiAgICAvLyBVcGRhdGUgb2JqZWN0c1xuICAgIGZvciAoIGxldCBpID0gMCwgaWwgPSB0aGlzLmR5bmFtaWNCb2RpZXMubGVuZ3RoOyBpIDwgaWw7IGkgKysgKSB7XG5cbiAgICAgIGNvbnN0IG9ialBoeXMgPSB0aGlzLmR5bmFtaWNCb2RpZXNbIGkgXTtcbiAgICAgIGNvbnN0IG1vdGlvblN0YXRlID0gb2JqUGh5cy5nZXRNb3Rpb25TdGF0ZSgpO1xuXG4gICAgICBpZiAobW90aW9uU3RhdGUpIHtcbiAgICAgICAgbW90aW9uU3RhdGUuZ2V0V29ybGRUcmFuc2Zvcm0oIHRoaXMudHJhbnNmb3JtQXV4ICk7XG5cbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnRyYW5zZm9ybUF1eC5nZXRPcmlnaW4oKTtcbiAgICAgICAgY29uc3QgcXVhdGVybmlvbiA9IHRoaXMudHJhbnNmb3JtQXV4LmdldFJvdGF0aW9uKCk7XG5cbiAgICAgICAgY29uc3QgWyB4LCB5LCB6IF0gPSBbcG9zaXRpb24ueCgpLCBwb3NpdGlvbi55KCksIHBvc2l0aW9uLnooKV07XG5cbiAgICAgICAgaWYgKG9ialBoeXMudXNlckRhdGEuaXNBZ2VudCkge1xuICAgICAgICAgIGlmIChNYXRoLnNxcnQoTWF0aC5wb3coeCwgMikgKyBNYXRoLnBvdyh5LCAyKSArIE1hdGgucG93KHosIDIpKSA+IHRoaXMuYm91bmRpbmdTcGhlcmVSYWRpdXMpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcEFnZW50QWZ0ZXJJbXBhY3QoKTtcbiAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtQXV4LnNldE9yaWdpbihuZXcgc2VsZi5BbW1vLmJ0VmVjdG9yMyhcbiAgICAgICAgICAgICAgb2JqUGh5cy51c2VyRGF0YS5wcmV2UG9zaXRpb24ueCxcbiAgICAgICAgICAgICAgb2JqUGh5cy51c2VyRGF0YS5wcmV2UG9zaXRpb24ueSxcbiAgICAgICAgICAgICAgb2JqUGh5cy51c2VyRGF0YS5wcmV2UG9zaXRpb24ueixcbiAgICAgICAgICAgICkpO1xuICAgICAgICAgICAgdGhpcy5hZ2VudEJvZHkuc2V0V29ybGRUcmFuc2Zvcm0odGhpcy50cmFuc2Zvcm1BdXgpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9ialBoeXMudXNlckRhdGEucHJldlBvc2l0aW9uID0geyB4LCB5LCB6IH07XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgdGFzazogJ3VwZGF0ZScsXG4gICAgICAgICAgcm9sZTogb2JqUGh5cy51c2VyRGF0YS5yb2xlLFxuICAgICAgICAgIGlkOiBvYmpQaHlzLnVzZXJEYXRhLmlkLFxuICAgICAgICAgIHBvc2l0aW9uOiB7IHgsIHksIHogfSxcbiAgICAgICAgICBxdWF0ZXJuaW9uOiBbcXVhdGVybmlvbi54KCksIHF1YXRlcm5pb24ueSgpLCBxdWF0ZXJuaW9uLnooKSwgcXVhdGVybmlvbi53KCldLFxuICAgICAgICB9KTtcblxuICAgICAgICBvYmpQaHlzLnVzZXJEYXRhLmNvbGxpZGVkID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5wcm9jZXNzQ29sbGlzaW9ucygpO1xuICB9XG5cbiAgcHJvY2Vzc0NvbGxpc2lvbnMoKSB7XG4gICAgZm9yICggbGV0IGkgPSAwLCBpbCA9IHRoaXMuZGlzcGF0Y2hlci5nZXROdW1NYW5pZm9sZHMoKTsgaSA8IGlsOyBpICsrICkge1xuXG4gICAgICBjb25zdCBjb250YWN0TWFuaWZvbGQgPSB0aGlzLmRpc3BhdGNoZXIuZ2V0TWFuaWZvbGRCeUluZGV4SW50ZXJuYWwoIGkgKTtcbiAgICAgIGNvbnN0IHJiMCA9IHNlbGYuQW1tby5jYXN0T2JqZWN0KCBjb250YWN0TWFuaWZvbGQuZ2V0Qm9keTAoKSwgc2VsZi5BbW1vLmJ0UmlnaWRCb2R5ICk7XG4gICAgICBjb25zdCByYjEgPSBzZWxmLkFtbW8uY2FzdE9iamVjdCggY29udGFjdE1hbmlmb2xkLmdldEJvZHkxKCksIHNlbGYuQW1tby5idFJpZ2lkQm9keSApO1xuXG4gICAgICBjb25zdCB1c2VyRGF0YTAgPSByYjAudXNlckRhdGEgfHwgbnVsbDtcbiAgICAgIGNvbnN0IHVzZXJEYXRhMSA9IHJiMS51c2VyRGF0YSB8fCBudWxsO1xuXG4gICAgICBpZiAoICF1c2VyRGF0YTAgfHwgIXVzZXJEYXRhMSApIHtcblx0Y29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGJyZWFrYWJsZTAgPSB1c2VyRGF0YTAgPyB1c2VyRGF0YTAuYnJlYWthYmxlOiBmYWxzZTtcbiAgICAgIGNvbnN0IGJyZWFrYWJsZTEgPSB1c2VyRGF0YTEgPyB1c2VyRGF0YTEuYnJlYWthYmxlIDogZmFsc2U7XG5cbiAgICAgIGNvbnN0IGNvbGxpZGVkMCA9IHVzZXJEYXRhMCA/IHVzZXJEYXRhMC5jb2xsaWRlZCA6IGZhbHNlO1xuICAgICAgY29uc3QgY29sbGlkZWQxID0gdXNlckRhdGExID8gdXNlckRhdGExLmNvbGxpZGVkIDogZmFsc2U7XG5cbiAgICAgIGlmICggKCAhIGJyZWFrYWJsZTAgJiYgISBicmVha2FibGUxICkgfHwgKCBjb2xsaWRlZDAgJiYgY29sbGlkZWQxICkgKSB7XG5cdGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBsZXQgY29udGFjdCA9IGZhbHNlO1xuICAgICAgbGV0IG1heEltcHVsc2UgPSAwO1xuICAgICAgZm9yICggbGV0IGogPSAwLCBqbCA9IGNvbnRhY3RNYW5pZm9sZC5nZXROdW1Db250YWN0cygpOyBqIDwgamw7IGogKysgKSB7XG5cblx0Y29uc3QgY29udGFjdFBvaW50ID0gY29udGFjdE1hbmlmb2xkLmdldENvbnRhY3RQb2ludCggaiApO1xuXG5cdGlmICggY29udGFjdFBvaW50LmdldERpc3RhbmNlKCkgPCAwLjEgKSB7XG5cblx0ICBjb250YWN0ID0gdHJ1ZTtcblx0ICBjb25zdCBpbXB1bHNlID0gY29udGFjdFBvaW50LmdldEFwcGxpZWRJbXB1bHNlKCk7XG5cblx0ICBpZiAoIGltcHVsc2UgPiBtYXhJbXB1bHNlICkge1xuXG5cdCAgICBtYXhJbXB1bHNlID0gaW1wdWxzZTtcblx0ICAgIHZhciBwb3MgPSBjb250YWN0UG9pbnQuZ2V0X21fcG9zaXRpb25Xb3JsZE9uQigpO1xuXHQgICAgdmFyIG5vcm1hbCA9IGNvbnRhY3RQb2ludC5nZXRfbV9ub3JtYWxXb3JsZE9uQigpO1xuXHQgICAgdGhpcy5pbXBhY3RQb2ludCA9IHt4IDogcG9zLngoKSwgeTogcG9zLnkoKSwgeiA6IHBvcy56KCkgfTtcblx0ICAgIHRoaXMuaW1wYWN0Tm9ybWFsID0ge3ggOiBub3JtYWwueCgpLCB5OiBub3JtYWwueSgpLCB6IDogbm9ybWFsLnooKSB9O1xuXHQgIH1cblx0fVxuICAgICAgfVxuXG4gICAgICBpZiAodXNlckRhdGEwLmlzQWdlbnQpIHtcbiAgICAgICAgcmIwLnNldEFuZ3VsYXJWZWxvY2l0eShuZXcgc2VsZi5BbW1vLmJ0VmVjdG9yMyggMCwgMCwgMCApKTtcbiAgICAgIH0gZWxzZSBpZiAodXNlckRhdGExLmlzQWdlbnQpIHtcbiAgICAgICAgcmIxLnNldEFuZ3VsYXJWZWxvY2l0eShuZXcgc2VsZi5BbW1vLmJ0VmVjdG9yMyggMCwgMCwgMCApKTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgbm8gcG9pbnQgaGFzIGNvbnRhY3QsIGFib3J0XG4gICAgICBpZiAoICFjb250YWN0IHx8ICF0aGlzLmltcGFjdFBvaW50IHx8IChcbiAgICAgICAgdGhpcy5pbXBhY3RQb2ludC54ID09PSAwICYmXG4gICAgICAgIHRoaXMuaW1wYWN0UG9pbnQueSA9PT0gMCAmJlxuICAgICAgICB0aGlzLmltcGFjdFBvaW50LnogPT09IDBcbiAgICAgICkgKSBjb250aW51ZTtcblxuICAgICAgY29uc3Qgb2JqMGJyZWFrcyA9IGJyZWFrYWJsZTAgJiYgdXNlckRhdGExLmlzQWdlbnQgJiYgISBjb2xsaWRlZDAgJiYgbWF4SW1wdWxzZSA+IHRoaXMuZnJhY3R1cmVJbXB1bHNlO1xuICAgICAgY29uc3Qgb2JqMWJyZWFrcyA9IGJyZWFrYWJsZTEgJiYgdXNlckRhdGEwLmlzQWdlbnQgJiYgISBjb2xsaWRlZDEgJiYgbWF4SW1wdWxzZSA+IHRoaXMuZnJhY3R1cmVJbXB1bHNlO1xuXG4gICAgICAvLyBTdWJkaXZpc2lvblxuICAgICAgaWYgKG9iajBicmVha3MgfHwgb2JqMWJyZWFrcykge1xuICAgICAgICBsZXQgZGVicmlzO1xuXG4gICAgICAgIGlmIChvYmowYnJlYWtzKSB7XG4gICAgICAgICAgY29uc3QgdmVsID0gcmIwLmdldExpbmVhclZlbG9jaXR5KCk7XG5cdCAgY29uc3QgYW5nVmVsID0gcmIwLmdldEFuZ3VsYXJWZWxvY2l0eSgpO1xuXG4gICAgICAgICAgdGhpcy5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICB0YXNrOiAnc3ViZGl2aWRlQnlJbXBhY3QnLFxuICAgICAgICAgICAgaW1wYWN0UG9pbnQ6IFt0aGlzLmltcGFjdFBvaW50LngsIHRoaXMuaW1wYWN0UG9pbnQueSwgdGhpcy5pbXBhY3RQb2ludC56XSxcbiAgICAgICAgICAgIGltcGFjdE5vcm1hbDogW3RoaXMuaW1wYWN0Tm9ybWFsLngsIHRoaXMuaW1wYWN0Tm9ybWFsLnksIHRoaXMuaW1wYWN0Tm9ybWFsLnpdLFxuICAgICAgICAgICAgcm9sZTogcmIwLnVzZXJEYXRhLnJvbGUsXG4gICAgICAgICAgICBpZDogcmIwLnVzZXJEYXRhLmlkLFxuICAgICAgICAgICAgdmVsOiBbdmVsLngoKSwgdmVsLnkoKSwgdmVsLnooKV0sXG5cdCAgICBhbmdWZWw6IFthbmdWZWwueCgpLCBhbmdWZWwueSgpLCBhbmdWZWwueigpXSxcbiAgICAgICAgICB9KTtcblxuXHQgIHRoaXMub2JqZWN0c1RvUmVtb3ZlWyB0aGlzLm51bU9iamVjdHNUb1JlbW92ZSsrIF0gPSByYjA7XG5cdCAgdXNlckRhdGEwLmNvbGxpZGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob2JqMWJyZWFrcykge1xuICAgICAgICAgIGNvbnN0IHZlbCA9IHJiMS5nZXRMaW5lYXJWZWxvY2l0eSgpO1xuXHQgIGNvbnN0IGFuZ1ZlbCA9IHJiMS5nZXRBbmd1bGFyVmVsb2NpdHkoKTtcblxuICAgICAgICAgIHRoaXMucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgdGFzazogJ3N1YmRpdmlkZUJ5SW1wYWN0JyxcbiAgICAgICAgICAgIGltcGFjdFBvaW50OiBbdGhpcy5pbXBhY3RQb2ludC54LCB0aGlzLmltcGFjdFBvaW50LnksIHRoaXMuaW1wYWN0UG9pbnQuel0sXG4gICAgICAgICAgICBpbXBhY3ROb3JtYWw6IFt0aGlzLmltcGFjdE5vcm1hbC54LCB0aGlzLmltcGFjdE5vcm1hbC55LCB0aGlzLmltcGFjdE5vcm1hbC56XSxcbiAgICAgICAgICAgIHJvbGU6IHJiMS51c2VyRGF0YS5yb2xlLFxuICAgICAgICAgICAgaWQ6IHJiMS51c2VyRGF0YS5pZCxcbiAgICAgICAgICAgIHZlbDogW3ZlbC54KCksIHZlbC55KCksIHZlbC56KCldLFxuXHQgICAgYW5nVmVsOiBbYW5nVmVsLngoKSwgYW5nVmVsLnkoKSwgYW5nVmVsLnooKV0sXG4gICAgICAgICAgfSk7XG5cblx0ICB0aGlzLm9iamVjdHNUb1JlbW92ZVsgdGhpcy5udW1PYmplY3RzVG9SZW1vdmUrKyBdID0gcmIxO1xuXHQgIHVzZXJEYXRhMS5jb2xsaWRlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoKHVzZXJEYXRhMCAmJiB1c2VyRGF0YTAuaXNUYXJnZXQpIHx8ICh1c2VyRGF0YTEgJiYgdXNlckRhdGExLmlzVGFyZ2V0KSkge1xuXG4gICAgICAgICAgdGhpcy5zdG9wQWdlbnRBZnRlckltcGFjdCgpO1xuXG4gICAgICAgICAgY29uc3QgdGFyZ2V0VXNlckRhdGEgPSB1c2VyRGF0YTAuaXNUYXJnZXQgPyB1c2VyRGF0YTAgOiB1c2VyRGF0YTE7XG5cbiAgICAgICAgICBpZiAodGFyZ2V0VXNlckRhdGEud2FzSGl0ICE9PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLnBvc3RNZXNzYWdlKHsgdGFzazogJ3BsYXlBdWRpbycgfSk7XG4gICAgICAgICAgICB0YXJnZXRVc2VyRGF0YS53YXNIaXQgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLm51bU9iamVjdHNUb1JlbW92ZSkge1xuICAgICAgdGhpcy5wb3N0TWVzc2FnZSh7XG4gICAgICAgIHRhc2s6ICdyZW1vdmVEZWJyaXMnLFxuICAgICAgICBkZWJyaXM6IHRoaXMub2JqZWN0c1RvUmVtb3ZlLm1hcCgoeyB1c2VyRGF0YTogeyByb2xlLCBpZCB9fSkgPT4gKHsgcm9sZSwgaWQgfSkpLFxuICAgICAgfSk7XG5cbiAgICAgIGZvciAoIHZhciBpID0gMDsgaSA8IHRoaXMubnVtT2JqZWN0c1RvUmVtb3ZlOyBpICsrICkge1xuICAgICAgICB0aGlzLnBoeXNpY3NXb3JsZC5yZW1vdmVSaWdpZEJvZHkodGhpcy5vYmplY3RzVG9SZW1vdmVbaV0pO1xuICAgICAgfVxuICAgICAgdGhpcy5udW1PYmplY3RzVG9SZW1vdmUgPSAwO1xuICAgIH1cbiAgICBcbiAgfVxuXG4gIGNsZWFyRGVicmlzKGRlYnJpcykge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5wb3N0TWVzc2FnZSh7XG4gICAgICAgIHRhc2s6ICdyZW1vdmVEZWJyaXMnLFxuICAgICAgICBkZWJyaXM6IGRlYnJpcy5tYXAoKHsgdXNlckRhdGE6IHsgcm9sZSwgaWQgfX0pID0+ICh7IHJvbGUsIGlkIH0pKSxcbiAgICAgIH0pO1xuXG4gICAgICBmb3IgKGNvbnN0IGRlYnJlZUluZGV4IGluIGRlYnJpcykge1xuICAgICAgICB0aGlzLnBoeXNpY3NXb3JsZC5yZW1vdmVSaWdpZEJvZHkoZGVicmlzW2RlYnJlZUluZGV4XSk7XG4gICAgICB9XG4gICAgfSwgdGhpcy5kZWJyaXNMaWZldGltZU1zKTtcbiAgfVxuXG4gIHN0b3BBZ2VudEFmdGVySW1wYWN0KCkge1xuICAgIHRoaXMuYWdlbnRCb2R5LnNldExpbmVhclZlbG9jaXR5KG5ldyBzZWxmLkFtbW8uYnRWZWN0b3IzKCAwLCAwLCAwICkpO1xuICB9XG59XG5cbnNlbGYucGh5c2ljc0luc3RhbmNlID0gJ2R1bW15Jztcblxuc2VsZi5vbm1lc3NhZ2UgPSBhc3luYyBmdW5jdGlvbiAoZSkge1xuICBzd2l0Y2goZS5kYXRhLnRhc2spIHtcbiAgY2FzZSAnaW5pdCc6XG4gICAgY29uc3Qge1xuICAgICAgYWdlbnRSYWRpdXMsIGFnZW50TWFzcywgYm91bmRpbmdTcGhlcmVSYWRpdXMsIGZyYWN0dXJlSW1wdWxzZSwgZGVicmlzTGlmZXRpbWVNcywgdGFyZ2V0TWFzcyxcbiAgICB9ID0gZS5kYXRhLmxpYjtcblxuICAgIHNlbGYucGh5c2ljc0luc3RhbmNlID0gbmV3IFBoeXNpY3Moe1xuICAgICAgYWdlbnRSYWRpdXMsIGFnZW50TWFzcywgYm91bmRpbmdTcGhlcmVSYWRpdXMsIGZyYWN0dXJlSW1wdWxzZSwgZGVicmlzTGlmZXRpbWVNcywgdGFyZ2V0TWFzcyxcbiAgICAgIHBvc3RNZXNzYWdlKG1lc3NhZ2UpIHtcbiAgICAgICAgc2VsZi5wb3N0TWVzc2FnZShtZXNzYWdlKTtcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBhd2FpdCBzZWxmLnBoeXNpY3NJbnN0YW5jZS5pbml0KCk7XG5cbiAgICBzZWxmLnBvc3RNZXNzYWdlKHsgdGFzazogJ3JlYWR5JyB9KTtcblxuICAgIGJyZWFrO1xuICBjYXNlICdzZXRBZ2VudCc6XG5cbiAgICBjb25zdCB7IHBvc2l0aW9uIH0gPSBlLmRhdGE7XG5cbiAgICBzZWxmLnBoeXNpY3NJbnN0YW5jZS5zZXRBZ2VudFBoeXNpY3NCb2R5KHBvc2l0aW9uKTtcblxuICAgIGJyZWFrO1xuICBjYXNlICdwdW5jaCc6IHtcbiAgICBjb25zdCB7IHZlY3RvcjogeyB4LCB5LCB6IH0gfSA9IGUuZGF0YTtcblxuICAgIHNlbGYucGh5c2ljc0luc3RhbmNlLmFnZW50Qm9keS5hcHBseUZvcmNlKG5ldyBzZWxmLkFtbW8uYnRWZWN0b3IzKHgsIHksIHopKTtcblxuICAgIGJyZWFrO1xuICB9XG4gIGNhc2UgJ2FkZFRhcmdldCc6IHtcbiAgICBjb25zdCB7IHBvc2l0aW9uLCBxdWF0ZXJuaW9uLCB2ZXJ0ZXhBcnJheSwgdGFyZ2V0SWQgfSA9IGUuZGF0YTtcblxuICAgIHNlbGYucGh5c2ljc0luc3RhbmNlLmFkZFRhcmdldChwb3NpdGlvbiwgcXVhdGVybmlvbiwgdmVydGV4QXJyYXksIHRhcmdldElkKTtcblxuICAgIGJyZWFrO1xuICB9XG4gIGNhc2UgJ2ZyZWV6ZSc6IHtcbiAgICBzZWxmLnBoeXNpY3NJbnN0YW5jZS5zdG9wQWdlbnRBZnRlckltcGFjdCgpO1xuXG4gICAgYnJlYWs7XG4gIH1cbiAgY2FzZSAnY3JlYXRlRnJhZ21lbnRzJzoge1xuXG4gICAgY29uc3QgeyBmcmFnbWVudHMgfSA9IGUuZGF0YTtcblxuICAgIGNvbnN0IG51bU9iamVjdHMgPSBmcmFnbWVudHMubGVuZ3RoO1xuICAgIGNvbnN0IGRlYnJpcyA9IFtdO1xuICAgIGZvciAoIGxldCBqID0gMDsgaiA8IG51bU9iamVjdHM7IGogKysgKSB7XG4gICAgICBjb25zdCBbXG4gICAgICAgIGZyYWdtZW50SWQsIHBvc2l0aW9uLCBxdWF0ZXJuaW9uLCB2ZXJ0ZXhBcnJheSwgbWFzcywgdmVsb2NpdHksIGFuZ3VsYXJWZWxvY2l0eVxuICAgICAgXSA9IGZyYWdtZW50c1sgaiBdO1xuXG4gICAgICBjb25zdCBib2R5ID0gc2VsZi5waHlzaWNzSW5zdGFuY2UuY3JlYXRlQnJlYWthYmxlT2JqZWN0KFxuICAgICAgICBhcnJheVRvVmVjM1NvdXJjZShwb3NpdGlvbiksXG4gICAgICAgIGFycmF5VG9WZWMzU291cmNlKHF1YXRlcm5pb24pLFxuICAgICAgICB2ZXJ0ZXhBcnJheSxcbiAgICAgICAgbWFzcyxcbiAgICAgICAgYXJyYXlUb1ZlYzNTb3VyY2UodmVsb2NpdHkpLFxuICAgICAgICBhcnJheVRvVmVjM1NvdXJjZShhbmd1bGFyVmVsb2NpdHkpXG4gICAgICApO1xuICAgICAgYm9keS51c2VyRGF0YSA9IGJvZHkudXNlckRhdGEgfHwge307XG4gICAgICBib2R5LnVzZXJEYXRhLmlkID0gZnJhZ21lbnRJZDtcbiAgICAgIGJvZHkudXNlckRhdGEucm9sZSA9ICdmcmFnbWVudCc7XG4gICAgICBib2R5LnVzZXJEYXRhLmlzRnJhZ21lbnQgPSB0cnVlO1xuICAgICAgZGVicmlzLnB1c2goYm9keSk7XG4gICAgfVxuXG4gICAgc2VsZi5waHlzaWNzSW5zdGFuY2UuY2xlYXJEZWJyaXMoZGVicmlzKTtcbiAgICBcbiAgICBicmVhaztcbiAgfVxuICB9XG59O1xuIl19
