const store = {
  scene: null,
  camera: null,
  level: null,
  agent: null,
  cameraBallJoint: null,
  guide: null,
};

function getter(key) {
  return function() {
    if (!store[key]) {
      throw new Error('Object "' + key + '" have not been initialized.');
    }
    return store[key];
  };
}
function setter(key) {
  return function(object) {
    if (store[key]) {
      console.warn('Resetting object "' + key + '"');
    }
    store[key] = object;
  };
}

export const setScene = setter('scene');
export const getScene = getter('scene');

export const setCamera = setter('camera');
export const getCamera = getter('camera');

export const setLevel = setter('level');
export const getLevel = getter('level');

export const setAgent = setter('agent');
export const getAgent = getter('agent');

export const getCameraBallJoint = getter('cameraBallJoint');
export const setCameraBallJoint = setter('cameraBallJoint');

export const getGuide = getter('guide');
export const setGuide = setter('guide');
