# 🚀 TrustCoinWallet - Complete Setup Guide

## 📋 Prerequisites

Before you start, make sure you have installed:

1. **Node.js** (v14 or higher)
   - Download: https://nodejs.org/
   - Verify: `node --version` and `npm --version`

2. **MongoDB** (Local or Cloud)
   - Local: https://www.mongodb.com/try/download/community
   - Cloud: https://www.mongodb.com/cloud/atlas (Free tier available)
   - Verify: `mongod --version`

3. **Git**
   - Download: https://git-scm.com/
   - Verify: `git --version`

---

## 🎯 Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/kcnkr55-tech/trustcoin-wallet.git

# Navigate to the project directory
cd trustcoin-wallet
```

---

## 🗄️ Step 2: Set Up MongoDB

### Option A: Local MongoDB

```bash
# Start MongoDB service (Windows/Mac/Linux)
mongod

# MongoDB will run on: mongodb://localhost:27017
```

### Option B: MongoDB Cloud (Atlas) - Recommended

1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a new cluster (free tier)
4. Get your connection string
5. Update `.env` file:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/trustcoin-wallet?retryWrites=true&w=majority
   ```

---

## ⚙️ Step 3: Set Up Backend

### 3.1 Install Backend Dependencies

```bash
# In the root directory
npm install
```

### 3.2 Create .env File

The `.env` file should already exist. If not, create it:

```bash
cp .env.example .env
```

Update `.env` with:
```env
MONGODB_URI=mongodb://localhost:27017/trustcoin-wallet
JWT_SECRET=trustcoin_secret_key_2024
PORT=5000
```

### 3.3 Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# OR Production mode
npm start
```

✅ You should see: `TrustCoinWallet server running on port 5000`

---

## 💻 Step 4: Set Up Frontend

### 4.1 Open a New Terminal and Navigate to Client

```bash
# In a new terminal window
cd trustcoin-wallet/client
```

### 4.2 Install Frontend Dependencies

```bash
npm install
```

### 4.3 Start Frontend Server

```bash
npm start
```

✅ Browser will automatically open to: `http://localhost:3000`

---

## 🔐 Step 5: First Time Login

### Admin Account

1. Go to: `http://localhost:3000`
2. Click "Sign Up"
3. Enter:
   - **Email**: `holysin682@gmail.com`
   - **Password**: Any password (e.g., `admin123`)
4. Click "Sign Up"
5. ✅ You'll be logged in as **ADMIN**

### Create Regular User Account

1. Logout (click Logout button)
2. Click "Sign Up"
3. Enter any email and password
4. Click "Sign Up"
5. ✅ You'll have a regular user account

---

## 🌐 Step 6: Access Features

### Main Dashboard
- **URL**: `http://localhost:3000`
- View wallet, transactions, KYC status

### Weather Dashboard
- **URL**: `http://localhost:3000/weather`
- Search cities, view forecasts
- Click "🌍 Weather" in navbar

### Joke Generator
- **URL**: `http://localhost:3000/jokes`
- Get random jokes by category
- Click "😂 Jokes" in navbar

### Admin Panel (Admin Only)
- **URL**: `http://localhost:3000`
- View all users, transactions
- Manage KYC requests
- View support tickets

### Fund Transfer (Admin Only)
- **URL**: `http://localhost:3000/admin/fund-transfer`
- Transfer simulated funds to users
- Click "💰 Transfer Funds" in navbar

---

## 📊 Wallet Information

All users receive these addresses:

- **USDT TRC20**: `0x505917f33e13642996068cdb135754c9d96811b9`
- **Bitcoin**: `bc1q3sckm34082natadrqxqdguev32707pcal5ea53`
- **Ethereum**: `0x505917f33e13642996068cdb135754c9d96811b9`

---

## 🐛 Troubleshooting

### Issue: "Cannot find module 'express'"
**Solution**: Run `npm install` in the root directory

### Issue: "MongoDB connection refused"
**Solution**: 
- Make sure MongoDB is running: `mongod`
- Or check your MongoDB Atlas connection string

### Issue: "Port 5000 already in use"
**Solution**: 
```bash
# Change PORT in .env file
PORT=5001
```

### Issue: "Port 3000 already in use"
**Solution**: 
```bash
# Change port when starting
PORT=3001 npm start
```

### Issue: Blank page or errors in browser
**Solution**:
- Clear browser cache: `Ctrl+Shift+Delete`
- Check browser console: `F12` → Console tab
- Check network requests: `F12` → Network tab

---

## 🚀 Next Steps

1. ✅ Complete the setup above
2. ✅ Test all features locally
3. ✅ Create user accounts for testing
4. ✅ Transfer funds as admin
5. 🌐 Deploy to production (see DEPLOYMENT_GUIDE.md)

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Check browser console (F12)
3. Check server terminal for errors
4. Review the README.md file

**Happy coding! 🎉**
