import React, { useContext } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import LoginPage from './components/LoginPage';
import { UserProvider, default as UserContext } from './context/UserContext';
import './App.css';



function RootApp() {
  const { user } = useContext(UserContext);
  return user ? <App /> : <LoginPage />;
}

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
      <RootApp />
    </UserProvider>
  </React.StrictMode>
);

