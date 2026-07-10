import React from 'react';
import { FiBell, FiLogOut, FiSun, FiMoon } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar({ user, onLogout, theme, onThemeToggle }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = React.useState(2);

  return (
    <nav className="navbar">
      <h1 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>🪙 TrustCoinWallet</h1>
      <div className="navbar-actions">
        <span style={{ marginRight: '1rem' }}>{user?.email}</span>
        {user?.role === 'admin' && (
          <>
            <button onClick={() => navigate('/admin/fund-transfer')}>💰 Transfer Funds</button>
            <button onClick={() => navigate('/')}>📊 Admin Panel</button>
          </>
        )}
        <div className="notification-icon" onClick={() => setNotifications(0)}>
          <FiBell size={24} />
          {notifications > 0 && <span className="notification-badge">{notifications}</span>}
        </div>
        <button onClick={onThemeToggle} title="Toggle Theme">
          {theme === 'light' ? <FiMoon /> : <FiSun />}
        </button>
        <button onClick={onLogout} title="Logout">
          <FiLogOut /> Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
