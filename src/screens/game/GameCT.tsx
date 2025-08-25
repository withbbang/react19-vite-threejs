import React, { useRef } from 'react';
import { CommonState } from 'middlewares/reduxToolkits/commonSlice';
import GamePT from './GamePT';

function GameCT({}: GameCTProps): React.JSX.Element {
  const carRef = useRef<any>(null);

  return <GamePT carRef={carRef} />;
}

interface GameCTProps extends CommonState {}

export default GameCT;
