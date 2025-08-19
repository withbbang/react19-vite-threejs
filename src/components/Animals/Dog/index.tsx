import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';

function Dog(props: any) {
  const groupRef = useRef<any>(null);
  //   useFrame((state, delta) => (groupRef.current.rotation.x += delta));
  //   useFrame((state, delta) => (groupRef.current.rotation.y += delta));
  //   useFrame((state, delta) => (groupRef.current.rotation.z += delta));

  return (
    <group ref={groupRef}>
      {/* 몸통 */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[1.5, 1, 1]} />
        <meshStandardMaterial color="sienna" />
      </mesh>

      {/* 머리 */}
      <mesh position={[1.2, 0.3, 0]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="sienna" />
      </mesh>

      {/* 귀 (왼쪽) */}
      <mesh position={[1.2, 0.9, -0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.6, 16]} />
        <meshStandardMaterial color="peru" />
      </mesh>

      {/* 귀 (오른쪽) */}
      <mesh position={[1.2, 0.9, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.6, 16]} />
        <meshStandardMaterial color="peru" />
      </mesh>

      {/* 다리 */}
      {[-0.5, 0.5].map((x) =>
        [-0.3, 0.3].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, -1, z]}>
            <cylinderGeometry args={[0.15, 0.15, 1, 16]} />
            <meshStandardMaterial color="sienna" />
          </mesh>
        )),
      )}
    </group>
  );
}

export default Dog;
