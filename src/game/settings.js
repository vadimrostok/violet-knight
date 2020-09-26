import { Scene, WebGLRenderer, PerspectiveCamera, Mesh, PlaneGeometry } from 'three';

import { shaderMaterial } from '../graphics/materials';

let cancelled = true;

export function start() {
  cancelled = false;

  const canvas = document.getElementById('settings-canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const scene = new Scene();
  const renderer = new WebGLRenderer({canvas: canvas, antialias: true});
  const camera = new PerspectiveCamera(45, canvas.clientWidth / canvas.clientWidth, 1, 1000);

  const quad = new Mesh(
    new PlaneGeometry(20, 20),
    shaderMaterial,
  );
  scene.add(quad);

  camera.position.z = 10;

  function render() {
    if (cancelled) {
      return;
    }

    requestAnimationFrame(render);
    
    if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
      camera.aspect = canvas.clientWidth /  canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    
    renderer.render(scene, camera);
  }

  render();
}

export function stop() {
  cancelled = true;
  document.getElementById('settings-canvas').remove();
}
