import React from 'react';
import { RigidBody } from '@react-three/rapier';

function Walls(props: any) {
  return (
    <>
      {/* 두께 있는 바닥 */}
      <RigidBody type="fixed" friction={1} restitution={0}>
        <mesh position={[0, -0.5, 0]}>
          <boxGeometry args={[60, 1, 60]} />
          <meshStandardMaterial color="#d9d9d9" />
        </mesh>
      </RigidBody>

      {/* 벽 4면 */}
      {[
        { p: [0, 1, -12], s: [24, 2, 1] },
        { p: [0, 1, 12], s: [24, 2, 1] },
        { p: [-12, 1, 0], s: [1, 2, 24] },
        { p: [12, 1, 0], s: [1, 2, 24] },
      ].map((w, i) => (
        <RigidBody key={i} type="fixed">
          <mesh position={w.p as any}>
            <boxGeometry args={w.s as any} />
            <meshStandardMaterial color="#2f4f4f" />
          </mesh>
        </RigidBody>
      ))}
    </>
  );
}

export default Walls;
