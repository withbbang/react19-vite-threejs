import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Box from 'components/Box';
import Dog from 'components/Dog';
import styles from './Index.module.scss';

function IndexPT({}: IndexPTProps): React.JSX.Element {
  return (
    <div className={styles.wrap}>
      <h1>Index Page</h1>
      <Canvas camera={{ position: [3, 2, 5], fov: 50 }}>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <Box position={[-2.5, 0, 0]} />
        <Box position={[2.5, 0, 0]} />
        <Dog />
        <OrbitControls />
      </Canvas>
    </div>
  );
}

interface IndexPTProps {}

export default IndexPT;
