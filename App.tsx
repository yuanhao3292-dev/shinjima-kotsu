
import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import { UserProfile } from './types';

const App: React.FC = () => {
  // Store user profile upon login/registration
  const [user, setUser] = useState<UserProfile | null>(null);

  return (
    <>
      {user ? (
        <Dashboard user={user} onLogout={() => setUser(null)} />
      ) : (
        <LandingPage onLogin={(newUser) => setUser(newUser)} />
      )}
    </>
  );
};

export default App;
