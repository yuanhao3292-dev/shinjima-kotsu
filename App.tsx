import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';

const App: React.FC = () => {
  // Simple state to simulate authentication/routing
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      {isLoggedIn ? (
        <Dashboard onLogout={() => setIsLoggedIn(false)} />
      ) : (
        <LandingPage onLogin={() => setIsLoggedIn(true)} />
      )}
    </>
  );
};

export default App;