# ⚡ Quick Start - 5 Minutes to Live

Get TrustCoinWallet running in 5 minutes! 🚀

---

## ✅ Prerequisites (Already Installed?)

- [ ] **Node.js** (v14+): https://nodejs.org/
- [ ] **MongoDB**: https://www.mongodb.com/
- [ ] **Git**: https://git-scm.com/

**Check:**
```bash
node --version
npm --version
git --version
```

---

## 🏃 Quick Start (5 Steps)

### 1️⃣ Clone & Install (1 min)
```bash
git clone https://github.com/kcnkr55-tech/trustcoin-wallet.git
cd trustcoin-wallet
npm install
```

### 2️⃣ Start MongoDB (30 sec)
```bash
# Terminal 1
mongod
```

### 3️⃣ Start Backend (30 sec)
```bash
# Terminal 2
npm run dev
# ✅ Wait for: "TrustCoinWallet server running on port 5000"
```

### 4️⃣ Start Frontend (1 min)
```bash
# Terminal 3
cd client
npm install
npm start
# ✅ Browser opens to http://localhost:3000
```

### 5️⃣ Login (1 min)
```
🔗 Go to: http://localhost:3000

👤 Sign Up as ADMIN:
   Email: holysin682@gmail.com
   Password: admin123
   
✅ You're logged in! 🎉
```

---

## 🎮 Test Everything

| Feature | URL |
|---------|-----|
| **Dashboard** | http://localhost:3000 |
| **Weather** | http://localhost:3000/weather |
| **Jokes** | http://localhost:3000/jokes |
| **Admin Panel** | http://localhost:3000 |
| **Fund Transfer** | http://localhost:3000/admin/fund-transfer |

---

## 💰 Wallet Addresses (All Users)

```
USDT TRC20: 0x505917f33e13642996068cdb135754c9d96811b9
Bitcoin:    bc1q3sckm34082natadrqxqdguev32707pcal5ea53
Ethereum:   0x505917f33e13642996068cdb135754c9d96811b9
```

---

## ⚠️ Common Issues

**MongoDB not running** → `mongod` in Terminal 1
**Port 5000 in use** → Change PORT in .env
**npm not found** → Reinstall Node.js
**Blank page** → Clear cache (Ctrl+Shift+Delete)

---

**Happy coding! 🎉**
