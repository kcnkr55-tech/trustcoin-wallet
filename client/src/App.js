import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Auth from './pages/Auth';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminFundTransfer from './pages/AdminFundTransfer';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    if (token) {
      fetchUserData();
    }
  }, [token]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/user/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setTheme(response.data.theme || 'light');
      document.body.className = `${response.data.theme || 'light'}-mode`;
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      logout();
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.className = `${newTheme}-mode`;
    try {
      await axios.post(
        'http://localhost:5000/api/user/theme',
        { theme: newTheme },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Failed to update theme:', error);
    }
  };

  return (
    <Router>
      {token && user && (
        <Navbar
          user={user}
          onLogout={logout}
          theme={theme}
          onThemeToggle={toggleTheme}
        />
      )}
      <Routes>
        <Route
          path="/auth"
          element={token ? <Navigate to="/" /> : <Auth onLogin={handleLogin} />}
        />
        <Route
          path="/"
          element={token ? (
            user?.role === 'admin' ? (
              <AdminDashboard token={token} />
            ) : (
              <UserDashboard token={token} />
            )
          ) : (
            <Navigate to="/auth" />
          )}
        />
        <Route
          path="/admin/fund-transfer"
          element={token && user?.role === 'admin' ? (
            <AdminFundTransfer token={token} />
          ) : (
            <Navigate to="/" />
          )}
        />
      </Routes>
    </Router>
  );
}

export default App;
