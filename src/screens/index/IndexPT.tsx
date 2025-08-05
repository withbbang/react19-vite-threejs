import React from 'react';
import { Canvas } from '@react-three/fiber';
import Box from 'components/Box';
import styles from './Index.module.scss';

function IndexPT({}: IndexPTProps): React.JSX.Element {
  return (
    <div className={styles.wrap}>
      <h1>Index Page</h1>
      <Canvas>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
      </Canvas>
    </div>
  );
}

interface IndexPTProps {}

export default IndexPT;
