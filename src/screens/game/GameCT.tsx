import React from 'react';
import { CommonState } from 'middlewares/reduxToolkits/commonSlice';
import GamePT from './GamePT';

function GameCT({}: GameCTProps): React.JSX.Element {
  return <GamePT />;
}

interface GameCTProps extends CommonState {}

export default GameCT;
