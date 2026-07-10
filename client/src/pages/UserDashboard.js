import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';

function UserDashboard({ token }) {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSubject, setSupportSubject] = useState('');

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      const userResponse = await axios.get('http://localhost:5000/api/user/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(userResponse.data);

      const transResponse = await axios.get('http://localhost:5000/api/user/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(transResponse.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5000/api/user/support-ticket',
        { subject: supportSubject, message: supportMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSupportMessage('');
      setSupportSubject('');
      alert('✅ Support ticket submitted');
    } catch (error) {
      alert('❌ Failed to submit support ticket');
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <div className="container">
        {/* Wallet Overview */}
        <section className="wallet-section">
          <h2>💼 Your Wallet</h2>
          <div className="dashboard-grid">
            <div className="card">
              <h3>USDT Balance</h3>
              <p>${user.balances?.usdt || 0}</p>
              <small>TRC20</small>
            </div>
            <div className="card">
              <h3>Bitcoin Balance</h3>
              <p>{user.balances?.btc || 0} BTC</p>
              <small>Segwit</small>
            </div>
            <div className="card">
              <h3>Ethereum Balance</h3>
              <p>{user.balances?.eth || 0} ETH</p>
              <small>ERC20</small>
            </div>
          </div>

          <h3 style={{ marginTop: '2rem' }}>Wallet Addresses</h3>
          <div className="wallet-address">
            <div>
              <strong>USDT (TRC20)</strong>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                {user.walletAddresses?.usdt_trc20}
              </p>
            </div>
            <button onClick={() => navigator.clipboard.writeText(user.walletAddresses?.usdt_trc20)}>
              Copy
            </button>
          </div>

          <div className="wallet-address">
            <div>
              <strong>Bitcoin (Segwit)</strong>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                {user.walletAddresses?.bitcoin}
              </p>
            </div>
            <button onClick={() => navigator.clipboard.writeText(user.walletAddresses?.bitcoin)}>
              Copy
            </button>
          </div>

          <div className="wallet-address">
            <div>
              <strong>Ethereum</strong>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                {user.walletAddresses?.ethereum}
              </p>
            </div>
            <button onClick={() => navigator.clipboard.writeText(user.walletAddresses?.ethereum)}>
              Copy
            </button>
          </div>
        </section>

        {/* KYC Status */}
        <section style={{ marginTop: '2rem' }}>
          <h2>🆔 KYC Status</h2>
          <div className="card">
            <p>
              Status: <strong>{user.kycStatus?.toUpperCase()}</strong>
            </p>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
              {user.kycStatus === 'pending' && 'Awaiting admin verification'}
              {user.kycStatus === 'approved' && '✅ You can now perform transactions'}
              {user.kycStatus === 'rejected' && '❌ Please contact support'}
            </p>
          </div>
        </section>

        {/* Transaction History */}
        <section style={{ marginTop: '2rem' }}>
          <h2>📝 Transaction History</h2>
          {transactions.length > 0 ? (
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Currency</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx._id}>
                    <td>{tx.transactionId}</td>
                    <td>{tx.type}</td>
                    <td>{tx.amount}</td>
                    <td>{tx.currency.toUpperCase()}</td>
                    <td>
                      <span className={`status-badge status-${tx.status}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No transactions yet</p>
          )}
        </section>

        {/* Support Ticket */}
        <section style={{ marginTop: '2rem' }}>
          <h2>🎫 Submit Support Ticket</h2>
          <form onSubmit={handleSupportSubmit} className="admin-form">
            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                value={supportSubject}
                onChange={(e) => setSupportSubject(e.target.value)}
                required
                placeholder="Describe your issue"
              />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
                required
                placeholder="Provide details about your issue"
                style={{ padding: '0.75rem', borderRadius: '5px', minHeight: '100px' }}
              />
            </div>
            <button type="submit" className="btn">
              Submit Ticket
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default UserDashboard;
