import { MeshPhysicalMaterial, MeshPhongMaterial } from 'three';

export const levelMaterial = new MeshPhysicalMaterial( {
  color: 0xff5533,
  specular: 0x111111,
  shininess: 200,
} );

export const createAgentMaterial = () => {
  const color = Math.floor( Math.random() * ( 1 << 24 ) );
  return new MeshPhongMaterial( { color } );
};
