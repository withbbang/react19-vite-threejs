import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function CameraController({ carRef }: CameraControllerProps) {
  const controlsRef = useRef<any>(null);

  useFrame(() => {
    if (carRef.current && controlsRef.current) {
      const pos = carRef.current.translation();
      controlsRef.current.target.set(pos.x, pos.y + 1.5, pos.z);
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableZoom={true}
      maxPolarAngle={Math.PI / 2.2}
    />
  );
}

interface CameraControllerProps {
  carRef: React.RefObject<any>;
}

export default CameraController;
