import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { CommonState } from 'middlewares/reduxToolkits/commonSlice';
import IndexPT from './IndexPT';

function IndexCT({}: IndexCTProps): React.JSX.Element {
  return <IndexPT />;
}

interface IndexCTProps extends CommonState {}

export default IndexCT;
