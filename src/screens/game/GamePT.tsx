import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { OrbitControls, KeyboardControls } from '@react-three/drei';
import Car from 'components/Car';
import Walls from 'components/Walls';
import styles from './Game.module.scss';

function GamePT({}: GamePTProps): React.JSX.Element {
  return (
    <div className={styles.wrap}>
      <KeyboardControls
        // 키 매핑
        map={[
          { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
          { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
          { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
          { name: 'right', keys: ['ArrowRight', 'KeyD'] },
          { name: 'jump', keys: ['Space'] },
        ]}
      >
        {/* 캔버스 포커스 보장: tabIndex + 클릭 시 focus */}
        <Canvas
          camera={{ position: [10, 8, 14], fov: 50 }}
          tabIndex={0}
          onPointerDown={(e: any) => e.currentTarget.focus()}
          onCreated={({ gl }) => {
            // 일부 환경에서 키 입력 우선권 확보
            gl.domElement.setAttribute('tabindex', '0');
          }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Physics gravity={[0, -9.81, 0]}>
            <Car />
            <Walls />
          </Physics>
          {/* 필요하면 마우스로 둘러보기만 사용 (키보드 팬은 사용 안 함) */}
          <OrbitControls enablePan={true} />
        </Canvas>
      </KeyboardControls>
    </div>
  );
}

interface GamePTProps {}

export default GamePT;
