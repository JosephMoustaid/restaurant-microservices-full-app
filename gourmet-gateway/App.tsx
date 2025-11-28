import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Restaurants } from './pages/Restaurants';
import { Reservations } from './pages/Reservations';
import { Places } from './pages/Places';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token
    const token = localStorage.getItem('jwt_token');
    const savedUser = localStorage.getItem('user_data');
    if (token) {
      setIsAuthenticated(true);
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        // Simple role check based on username convention for this demo
        // In a real app, this would come from a decoded JWT role claim
        setIsAdmin(parsedUser.username.toLowerCase().includes('admin'));
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (data: { username: string, token: string }) => {
    localStorage.setItem('jwt_token', data.token);
    const userData = { username: data.username };
    localStorage.setItem('user_data', JSON.stringify(userData));
    
    setUser(userData);
    setIsAdmin(data.username.toLowerCase().includes('admin'));
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
    setIsAuthenticated(false);
    setUser(null);
    setIsAdmin(false);
  };

  if (loading) return null;

  return (
    <Router>
      {!isAuthenticated ? (
        <Auth onLoginSuccess={handleLogin} />
      ) : (
        <Layout onLogout={handleLogout} user={user}>
          <Routes>
            <Route path="/" element={<Dashboard user={user} isAdmin={isAdmin} />} />
            <Route path="/restaurants" element={<Restaurants user={user} isAdmin={isAdmin} />} />
            <Route path="/reservations" element={<Reservations user={user} isAdmin={isAdmin} />} />
            <Route path="/places" element={<Places />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      )}
    </Router>
  );
};

export default App;