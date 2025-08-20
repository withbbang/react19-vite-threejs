import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Game from 'screens/game';
import Index from 'screens/index';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
