import { Quaternion } from 'three';

export function quaternion(xyz, angle) {
  const half_angle = angle * 0.5;
  const sin_a = Math.sin(half_angle);
  return new Quaternion(xyz[0] * sin_a, xyz[1] * sin_a, xyz[2] * sin_a, Math.cos(half_angle));
}
