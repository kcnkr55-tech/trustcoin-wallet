import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Auth.css';

function Auth({ onLogin }) {
  const [isSignup, setIsSignup] = useState(true);
  const [email, setEmail] = useState('holysin682@gmail.com');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login';
      const response = await axios.post(`http://localhost:5000${endpoint}`, {
        email,
        password
      });

      onLogin(response.data.token);
      setMessage('✅ ' + response.data.message);
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.error || 'An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isSignup ? 'Create Account' : 'Login'}</h2>
      <p style={{ textAlign: 'center', marginBottom: '1rem', opacity: 0.7 }}>
        Admin Email: holysin682@gmail.com
      </p>
      {message && <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-error'}`}>{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="holysin682@gmail.com for admin"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Any password"
          />
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Loading...' : isSignup ? 'Sign Up' : 'Login'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        {isSignup ? 'Already have an account?' : "Don't have an account?"}
        <button
          type="button"
          onClick={() => setIsSignup(!isSignup)}
          style={{
            background: 'none',
            color: '#667eea',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'underline',
            marginLeft: '0.5rem'
          }}
        >
          {isSignup ? 'Login' : 'Sign Up'}
        </button>
      </p>
    </div>
  );
}

export default Auth;
