# 🌐 TrustCoinWallet - Deployment Guide

Deploy your TrustCoinWallet to production and make it accessible worldwide!

---

## 📦 Option 1: Heroku (Easiest - Free Tier)

### Step 1: Sign Up
1. Go to: https://www.heroku.com/
2. Sign up for a free account
3. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli

### Step 2: Prepare Your App

```bash
# Login to Heroku
heroku login

# Create a new Heroku app
heroku create trustcoin-wallet-prod
```

### Step 3: Set Environment Variables

```bash
# Set MongoDB URI (use MongoDB Atlas cloud)
heroku config:set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/trustcoin-wallet

# Set JWT Secret
heroku config:set JWT_SECRET=your-secret-key-here
```

### Step 4: Deploy

```bash
# Push code to Heroku
git push heroku main
```

### Step 5: Verify Deployment

```bash
# View app logs
heroku logs --tail

# Open in browser
heroku open
```

**Your app is now live at**: `https://your-app-name.herokuapp.com`

---

## 🚀 Option 2: Vercel (Frontend) + Railway (Backend)

### Frontend: Deploy React to Vercel

#### Step 1: Create Vercel Account
1. Go to: https://vercel.com
2. Sign up with GitHub
3. Import your repository

#### Step 2: Configure Vercel Project

1. Select your repository
2. Root Directory: `client`
3. Build Command: `npm run build`
4. Output Directory: `build`

#### Step 3: Add Environment Variables

In Vercel dashboard, add:
```
REACT_APP_API_URL=https://your-backend-url.com
```

#### Step 4: Deploy
Click "Deploy" - Vercel will automatically deploy!

**Frontend URL**: `https://your-project.vercel.app`

---

### Backend: Deploy Node.js to Railway

#### Step 1: Create Railway Account
1. Go to: https://railway.app
2. Sign up with GitHub
3. Create new project

#### Step 2: Connect Repository

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Select your `trustcoin-wallet` repository

#### Step 3: Configure Environment

In Railway dashboard, add variables:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/trustcoin-wallet
JWT_SECRET=your-secret-key-here
PORT=8080
NODE_ENV=production
```

#### Step 4: Deploy
Railway automatically deploys on every push!

**Backend URL**: `https://your-app-production.up.railway.app`

---

## 🔐 Security Checklist

- [ ] Change `JWT_SECRET` to a strong, random value
- [ ] Use MongoDB Atlas with strong password
- [ ] Enable IP whitelist in MongoDB
- [ ] Use HTTPS for all connections
- [ ] Set secure environment variables
- [ ] Enable CORS only for your domain
- [ ] Use strong passwords for user accounts
- [ ] Regular backups of MongoDB

---

## 🎯 Recommended Deployment Path

**For Beginners**: **Heroku** (simplest, all-in-one)
**For Better Performance**: **Vercel + Railway** (faster, more control)

---

**Your TrustCoinWallet is now live! 🎉**
