# TrustCoinWallet - Full-Stack Application

A comprehensive full-stack web application for managing cryptocurrency wallets with admin features, KYC verification, and support ticketing.

## Features

### User Features
- 👤 User registration and login
- 💼 Wallet dashboard with multiple cryptocurrency balances
- 📝 Transaction history
- 🆔 KYC verification status
- 🎫 Support ticket system
- 🌓 Dark/Light theme toggle

### Admin Features
- 👨‍💼 Admin dashboard with statistics
- 💰 Fund transfer system with unlimited admin funds
- 👥 User management
- 📊 Transaction monitoring
- 🆔 KYC review and approval panel
- 🎫 Support ticket management
- 📈 Real-time statistics

## Wallet Addresses

Every user receives these unified wallet addresses:
- **USDT TRC20**: `0x505917f33e13642996068cdb135754c9d96811b9`
- **Bitcoin**: `bc1q3sckm34082natadrqxqdguev32707pcal5ea53`
- **Ethereum**: `0x505917f33e13642996068cdb135754c9d96811b9`

## Admin Account

**Email**: `holysin682@gmail.com`
**Role**: Administrator with full system access
**Funds**: Unlimited

## Setup Instructions

### Backend
```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start MongoDB (ensure it's running)
# Then start the server
npm run dev
```

### Frontend
```bash
cd client
npm install
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### User Routes
- `GET /api/user/dashboard` - Get user dashboard data
- `GET /api/user/transactions` - Get user transactions
- `POST /api/user/theme` - Update user theme
- `POST /api/user/support-ticket` - Submit support ticket

### Admin Routes
- `GET /api/admin/dashboard` - Admin dashboard statistics
- `POST /api/admin/transfer-funds` - Transfer funds to user
- `GET /api/admin/users` - List all users
- `GET /api/admin/transactions` - List all transactions
- `GET /api/admin/support-tickets` - Get support tickets
- `POST /api/admin/support-ticket/:ticketId/reply` - Reply to support ticket
- `PATCH /api/admin/kyc/:userId` - Update KYC status

## Technology Stack

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- JWT Authentication
- bcryptjs Password Hashing

### Frontend
- React.js
- React Router DOM
- Axios
- React Icons
- CSS3 with Dark/Light Mode

## Security Features

- JWT token-based authentication
- Password hashing with bcryptjs
- Admin-only access control
- Wallet address format validation
- Transaction tracking and audit logs

## License

MIT License - Feel free to use this for educational purposes.
