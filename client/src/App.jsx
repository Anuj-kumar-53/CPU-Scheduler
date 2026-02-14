import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import CPUScheduler from './components/CPUScheduler';
import DSAVisualizer from './components/DSAVisualizer';
import { AnimatePresence } from 'framer-motion';

const App = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-zinc-950 overflow-hidden">
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<LandingPage onSelect={(view) => navigate(view === 'cpu' ? '/cpu' : '/dsa')} />} />
          <Route path="/cpu" element={<CPUScheduler onBack={() => navigate('/')} />} />
          <Route path="/dsa/*" element={<DSAVisualizer />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

export default App;