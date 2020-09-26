// import {
//   BoxGeometry, ConeGeometry, Mesh, Shape, ShapeGeometry, Quaternion, Vector3, AxesHelper, Euler,
//   Object3D
// } from 'three';
import { Quaternion } from 'three';

export function quaternion(xyz, angle) {
  const half_angle = angle * 0.5;
  const sin_a = Math.sin(half_angle);
  return new Quaternion(xyz[0] * sin_a, xyz[1] * sin_a, xyz[2] * sin_a, Math.cos(half_angle));
}


function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  };

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  };

  request.send();
};

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
};

export { BufferLoader };

export function isTouchDevice() {
  return 'ontouchstart' in window;
}

export function toRadians(angle) {
  return angle * (Math.PI / 180);
}

export function vecToArray(obj) {
  return obj.w ? [obj.x, obj.y, obj.z, obj.w] : [obj.x, obj.y, obj.z];
}
