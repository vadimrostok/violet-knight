import {
  MeshPhysicalMaterial, MeshPhongMaterial, LineDashedMaterial, DoubleSide, MeshBasicMaterial,
  RawShaderMaterial,
} from 'three';

export const levelMaterial = new MeshPhysicalMaterial( {
  color: 0xff5533,
  specular: 0x111111,
  shininess: 200,
} );

function pad(n, size) {
  var s = String(n);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}

export const getTargetMaterial = () => new MeshPhysicalMaterial( {
  color: Math.floor( Math.random() * ( 1 << 24 ) ),
  emissive: parseInt(pad(Math.floor( Math.random() * ( 1 << 8 ) / 1.5 ).toString(16), 2) +
                     pad(Math.floor( Math.random() * ( 1 << 8 ) / 3 ).toString(16), 2) +
                     pad(Math.floor( Math.random() * ( 1 << 8 ) / 3 ).toString(16), 2), 16),
  clearcoat: 0.5,
  roughness: 0.5,
  //specular: 0x111111,
  //shininess: 200,
} );

// export const guideMaterial = new MeshPhysicalMaterial( {
//   color: 0x22ffff,
//   specular: 0x11ff11,
//   shininess: 350,
// } );

export const guideMaterial = new MeshBasicMaterial( {
  color: 0xffffff,
  side: DoubleSide,
} );

export const createAgentMaterial = () => {
  const color = Math.floor( Math.random() * ( 1 << 24 ) );
  return new MeshPhongMaterial( { color } );
};

export const agentMaterial = new MeshPhongMaterial( {
  color: 0xff0000,
  emissive: 0x0000ff,
  transparent: true,
  opacity: 0.5,
} );

export const shaderMaterial = new RawShaderMaterial({
  uniforms: {
    time: { value: 1.0 }
  },
  vertexShader: document.getElementById( 'vertexShader' ).textContent,
  fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
  side: DoubleSide,
  depthTest: false,
});
