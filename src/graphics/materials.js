import { MeshPhysicalMaterial, MeshPhongMaterial, LineDashedMaterial } from 'three';

export const levelMaterial = new MeshPhysicalMaterial( {
  color: 0xff5533,
  specular: 0x111111,
  shininess: 200,
} );

// export const guideMaterial = new MeshPhysicalMaterial( {
//   color: 0x22ffff,
//   specular: 0x11ff11,
//   shininess: 350,
// } );

export const guideMaterial = new LineDashedMaterial( {
  color: 0xffffff,
  dashSize: 0.3,
  gapSize: 0.1,
} );

export const createAgentMaterial = () => {
  const color = Math.floor( Math.random() * ( 1 << 24 ) );
  return new MeshPhongMaterial( { color } );
};
