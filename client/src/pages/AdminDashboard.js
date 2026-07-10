import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';

function AdminDashboard({ token }) {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAdminData();
  }, [token]);

  const fetchAdminData = async () => {
    try {
      const statsResponse = await axios.get('http://localhost:5000/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(statsResponse.data);

      const usersResponse = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(usersResponse.data);

      const txResponse = await axios.get('http://localhost:5000/api/admin/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(txResponse.data);

      const ticketsResponse = await axios.get('http://localhost:5000/api/admin/support-tickets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTickets(ticketsResponse.data);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    }
  };

  const handleApproveKYC = async (userId) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/kyc/${userId}`,
        { status: 'approved' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✅ KYC Approved');
      fetchAdminData();
    } catch (error) {
      alert('❌ Failed to approve KYC');
    }
  };

  const handleRejectKYC = async (userId) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/kyc/${userId}`,
        { status: 'rejected' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✅ KYC Rejected');
      fetchAdminData();
    } catch (error) {
      alert('❌ Failed to reject KYC');
    }
  };

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <div className="container">
        <h1>👨‍💼 Admin Dashboard</h1>

        {/* Stats Overview */}
        <div className="dashboard-grid" style={{ marginTop: '2rem' }}>
          <div className="card">
            <h3>Total Users</h3>
            <p>{stats.totalUsers}</p>
          </div>
          <div className="card">
            <h3>Total Transactions</h3>
            <p>{stats.totalTransactions}</p>
          </div>
          <div className="card">
            <h3>Pending KYC</h3>
            <p>{stats.kycPending}</p>
          </div>
          <div className="card">
            <h3>Support Tickets</h3>
            <p>{stats.supportTickets}</p>
          </div>
          <div className="card">
            <h3>Admin Funds</h3>
            <p style={{ color: '#28a745' }}>{stats.adminFunds}</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', borderBottom: '1px solid #ddd', paddingBottom: '1rem' }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              background: activeTab === 'overview' ? '#667eea' : 'transparent',
              color: activeTab === 'overview' ? 'white' : 'inherit',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('kyc')}
            style={{
              background: activeTab === 'kyc' ? '#667eea' : 'transparent',
              color: activeTab === 'kyc' ? 'white' : 'inherit',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            KYC Reviews
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            style={{
              background: activeTab === 'tickets' ? '#667eea' : 'transparent',
              color: activeTab === 'tickets' ? 'white' : 'inherit',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Support Tickets
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <section style={{ marginTop: '2rem' }}>
            <h2>📊 Users & Transactions</h2>
            <h3 style={{ marginTop: '1.5rem' }}>Users</h3>
            {users.length > 0 ? (
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Email</th>
                    <th>KYC Status</th>
                    <th>USDT Balance</th>
                    <th>BTC Balance</th>
                    <th>ETH Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.userId}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`status-badge status-${user.kycStatus}`}>
                          {user.kycStatus}
                        </span>
                      </td>
                      <td>${user.balances?.usdt || 0}</td>
                      <td>{user.balances?.btc || 0}</td>
                      <td>{user.balances?.eth || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No users yet</p>
            )}

            <h3 style={{ marginTop: '2rem' }}>Recent Transactions</h3>
            {transactions.length > 0 ? (
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Amount</th>
                    <th>Currency</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 10).map((tx) => (
                    <tr key={tx._id}>
                      <td>{tx.transactionId}</td>
                      <td>{tx.fromUserId}</td>
                      <td>{tx.toUserId}</td>
                      <td>{tx.amount}</td>
                      <td>{tx.currency.toUpperCase()}</td>
                      <td>
                        <span className={`status-badge status-${tx.status}`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No transactions yet</p>
            )}
          </section>
        )}

        {/* KYC Tab */}
        {activeTab === 'kyc' && (
          <section className="kyc-panel" style={{ marginTop: '2rem' }}>
            <h2>🆔 KYC Review Panel</h2>
            {users.filter((u) => u.kycStatus === 'pending').length > 0 ? (
              users
                .filter((u) => u.kycStatus === 'pending')
                .map((user) => (
                  <div key={user._id} className="kyc-request">
                    <h4>{user.email}</h4>
                    <p>User ID: {user.userId}</p>
                    <p>Status: <strong>Pending Review</strong></p>
                    <div className="kyc-actions">
                      <button
                        className="kyc-approve"
                        onClick={() => handleApproveKYC(user.userId)}
                      >
                        ✅ Approve
                      </button>
                      <button
                        className="kyc-reject"
                        onClick={() => handleRejectKYC(user.userId)}
                      >
                        ❌ Reject
                      </button>
                    </div>
                  </div>
                ))
            ) : (
              <p>No pending KYC requests</p>
            )}
          </section>
        )}

        {/* Support Tickets Tab */}
        {activeTab === 'tickets' && (
          <section style={{ marginTop: '2rem' }}>
            <h2>🎫 Support Tickets</h2>
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <div key={ticket._id} className="support-ticket">
                  <h4>{ticket.subject}</h4>
                  <p>Ticket ID: {ticket.ticketId}</p>
                  <p>From: {ticket.userId}</p>
                  <p>Status: <strong>{ticket.status.toUpperCase()}</strong></p>
                  <p style={{ marginTop: '0.5rem' }}>{ticket.message}</p>
                  {ticket.replies.length > 0 && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #ddd' }}>
                      <strong>Replies:</strong>
                      {ticket.replies.map((reply, idx) => (
                        <p key={idx} style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                          <strong>{reply.responderId}:</strong> {reply.message}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No support tickets</p>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
