
import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import { UserProfile } from './types';

const App: React.FC = () => {
  // Store user profile upon login/registration
  const [user, setUser] = useState<UserProfile | null>(null);
  // Store the request text entered on the landing page to pass to the dashboard
  const [pendingRequest, setPendingRequest] = useState<string>("");

  return (
    <>
      {user ? (
        <Dashboard 
          user={user} 
          onLogout={() => { setUser(null); setPendingRequest(""); }} 
          initialRequestText={pendingRequest}
        />
      ) : (
        <LandingPage 
          onLogin={(newUser, requestText) => { 
            setUser(newUser); 
            if (requestText) setPendingRequest(requestText);
          }} 
        />
      )}
    </>
  );
};

export default App;
