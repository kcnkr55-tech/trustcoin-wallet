const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ---------- In-Memory Data ----------
let users = [
  { id: 1, email: 'admin@trustcoin.com', password: 'admin123', role: 'admin', displayName: 'Admin', kycStatus: 'approved' }
];
let nextUserId = 2;

const SHARED_WALLETS = [
  { name: 'Bitcoin', symbol: 'BTC', addr: 'bc1q3sckm34082natadrqxqdguev32707pcal5ea53' },
  { name: 'Ethereum', symbol: 'ETH', addr: '0x505917f33e13642996068cdb135754c9d96811b9' },
  { name: 'USDt TRC20', symbol: 'USDT', addr: '0x505917f33e13642996068cdb135754c9d96811b9' }
];

let balances = { 1: { BTC: 1000, ETH: 500, USDT: 50000 } };
let transactions = [];
let txCounter = 1;
let tickets = [];
let ticketCounter = 1;

const findUser = (id) => users.find(u => u.id === id);

// ------------------- AUTH -------------------
app.post('/api/register', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });
  if (users.find(u => u.email === email)) return res.status(400).json({ success: false, message: 'Email already registered' });
  const newUser = { id: nextUserId++, email, password, role: 'user', displayName: email.split('@')[0], kycStatus: 'pending' };
  users.push(newUser);
  balances[newUser.id] = { BTC: 0, ETH: 0, USDT: 0 };
  console.log(`[REGISTER] ${email} (ID: ${newUser.id})`);
  res.json({ success: true, userId: newUser.id, role: newUser.role, email: newUser.email });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
  res.json({ success: true, userId: user.id, role: user.role, email: user.email, displayName: user.displayName, kycStatus: user.kycStatus });
});

// ------------------- USER -------------------
app.get('/api/user/:userId', (req, res) => {
  const user = findUser(parseInt(req.params.userId));
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, email: user.email, displayName: user.displayName, role: user.role, kycStatus: user.kycStatus });
});

app.put('/api/user/:userId', (req, res) => {
  const user = findUser(parseInt(req.params.userId));
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { displayName } = req.body;
  if (displayName) user.displayName = displayName;
  res.json({ success: true, displayName: user.displayName });
});

app.get('/api/wallets/:userId', (req, res) => {
  const user = findUser(parseInt(req.params.userId));
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({
    userId: user.id,
    wallets: SHARED_WALLETS,
    balances: balances[user.id] || { BTC: 0, ETH: 0, USDT: 0 }
  });
});

app.get('/api/transactions/:userId', (req, res) => {
  const user = findUser(parseInt(req.params.userId));
  if (!user) return res.status(404).json({ error: 'User not found' });
  const userTxs = transactions.filter(tx => tx.userId === user.id).sort((a, b) => b.timestamp - a.timestamp);
  res.json(userTxs);
});

// ------------------- ADMIN -------------------
app.get('/api/admin/users', (req, res) => {
  const list = users.map(u => ({
    id: u.id,
    email: u.email,
    displayName: u.displayName,
    role: u.role,
    kycStatus: u.kycStatus,
    balances: balances[u.id] || { BTC: 0, ETH: 0, USDT: 0 }
  }));
  res.json(list);
});

app.put('/api/admin/kyc/:userId', (req, res) => {
  const user = findUser(parseInt(req.params.userId));
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { status } = req.body;
  if (!['pending','approved','rejected'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
  user.kycStatus = status;
  res.json({ success: true, kycStatus: status });
});

app.post('/api/admin/transfer', (req, res) => {
  const { userId, walletAddress, amount, currency } = req.body;
  if (!userId || !walletAddress || !amount || !currency) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }
  if (isNaN(amount) || amount <= 0) return res.status(400).json({ success: false, message: 'Invalid amount' });
  if (!['BTC','ETH','USDT'].includes(currency)) return res.status(400).json({ success: false, message: 'Invalid currency' });
  const isValidAddr = SHARED_WALLETS.some(w => w.addr === walletAddress);
  if (!isValidAddr) return res.status(400).json({ success: false, message: 'Invalid wallet address' });
  const user = findUser(parseInt(userId));
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  if (!balances[user.id]) balances[user.id] = { BTC: 0, ETH: 0, USDT: 0 };
  balances[user.id][currency] = (balances[user.id][currency] || 0) + parseFloat(amount);

  transactions.push({
    id: txCounter++,
    userId: user.id,
    type: 'deposit',
    currency,
    amount: parseFloat(amount),
    fee: 0,
    status: 'completed',
    timestamp: Date.now(),
    description: 'Admin transfer'
  });

  res.json({ success: true, message: `Transferred ${amount} ${currency} to user ${userId}`, newBalance: balances[user.id][currency] });
});

// ------------------- SUPPORT -------------------
app.get('/api/tickets', (req, res) => {
  res.json(tickets);
});

app.post('/api/tickets', (req, res) => {
  const { userId, subject, message } = req.body;
  if (!userId || !subject || !message) return res.status(400).json({ success: false, message: 'Missing fields' });
  const user = findUser(parseInt(userId));
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  const ticket = {
    id: ticketCounter++,
    userId: user.id,
    subject,
    status: 'Open',
    messages: [{ senderId: user.id, message, createdAt: new Date().toISOString() }],
    createdAt: new Date().toISOString()
  };
  tickets.push(ticket);
  res.json({ success: true, ticketId: ticket.id });
});

app.post('/api/admin/tickets/:ticketId/reply', (req, res) => {
  const ticket = tickets.find(t => t.id === parseInt(req.params.ticketId));
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
  const { adminId, message } = req.body;
  if (!adminId || !message) return res.status(400).json({ error: 'Missing fields' });
  const admin = findUser(parseInt(adminId));
  if (!admin || admin.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  ticket.messages.push({ senderId: admin.id, message, createdAt: new Date().toISOString() });
  ticket.status = 'In Progress';
  res.json({ success: true });
});

// ------------------- WITHDRAWAL -------------------
app.post('/api/withdraw', (req, res) => {
  const { userId, currency, amount } = req.body;
  if (!userId || !currency || !amount) return res.status(400).json({ success: false, message: 'Missing fields' });
  const user = findUser(parseInt(userId));
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  if (user.kycStatus !== 'approved') return res.status(400).json({ success: false, message: 'KYC required for withdrawals' });
  const balance = balances[user.id]?.[currency] || 0;
  if (balance < amount) return res.status(400).json({ success: false, message: 'Insufficient balance' });

  const feeRates = { BTC: 0.001, ETH: 0.01, USDT: 1 };
  const fee = feeRates[currency] || 0;
  const totalDeduction = parseFloat(amount) + fee;
  if (balance < totalDeduction) return res.status(400).json({ success: false, message: `Insufficient balance to cover gas fee (${fee} ${currency})` });

  balances[user.id][currency] = balance - totalDeduction;
  transactions.push({
    id: txCounter++,
    userId: user.id,
    type: 'withdrawal',
    currency,
    amount: -parseFloat(amount),
    fee,
    status: 'pending',
    timestamp: Date.now(),
    description: 'Withdrawal request'
  });

  res.json({
    success: true,
    message: `Withdrawal of ${amount} ${currency} submitted (fee: ${fee} ${currency}). Pending admin approval.`,
    newBalance: balances[user.id][currency]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 TrustCoinWallet backend running on port ${PORT}`);
});
