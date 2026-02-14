import React, { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import CPUScheduler from './components/CPUScheduler';
import DSAVisualizer from './components/DSAVisualizer';
import AuthModal from './components/AuthModal';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Navigate to="/" replace />
        <AuthModal isOpen={true} onClose={() => { }} />
      </>
    );
  }

  return children;
};

const App = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-zinc-950 overflow-hidden">
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<LandingPage onSelect={(view) => navigate(view === 'cpu' ? '/cpu' : '/dsa')} />} />
          <Route
            path="/cpu"
            element={
              <ProtectedRoute>
                <CPUScheduler onBack={() => navigate('/')} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dsa/*"
            element={
              <ProtectedRoute>
                <DSAVisualizer />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

export default App;