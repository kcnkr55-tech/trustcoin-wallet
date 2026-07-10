# 🚂 Railway Deployment Guide

## Complete Guide to Deploy TrustCoinWallet on Railway

---

## ✅ Prerequisites

- [ ] GitHub account
- [ ] Railway account (free at https://railway.app)
- [ ] Your code pushed to GitHub
- [ ] MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)

---

## 📋 Step 1: Set Up MongoDB Atlas (Cloud Database)

### 1.1 Create MongoDB Atlas Account
1. Go to: https://www.mongodb.com/cloud/atlas
2. Click **Sign Up** → Create free account
3. Verify email

### 1.2 Create a Free Cluster
1. After login, click **Create a Deployment**
2. Select **M0 Free Tier** (always free)
3. Choose your region (closest to your location)
4. Click **Create Deployment**
5. Wait 5-10 minutes for cluster to be created

### 1.3 Get Your Connection String
1. In MongoDB Atlas, click **Databases**
2. Find your cluster, click **Connect**
3. Choose **Drivers** → **Node.js**
4. Copy the connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/trustcoin-wallet?retryWrites=true&w=majority
   ```
5. Replace `username` and `password` with your credentials
6. **Save this string!** You'll need it for Railway

### 1.4 Set Up MongoDB IP Whitelist
1. Click **Security** → **Network Access**
2. Click **Add IP Address**
3. Select **Allow Access from Anywhere** (0.0.0.0/0)
4. Click **Confirm**

⚠️ **Warning**: For production, whitelist only your Railway IP. For now, "Anywhere" works.

---

## 🚂 Step 2: Deploy Backend on Railway

### 2.1 Sign Up for Railway
1. Go to: https://railway.app
2. Click **Start Building** or **Sign Up**
3. Choose **GitHub** to sign up
4. Authorize Railway to access your GitHub

### 2.2 Create New Project
1. In Railway dashboard, click **New Project**
2. Click **Deploy from GitHub Repo**
3. Select your `trustcoin-wallet` repository
4. Click **Deploy Now**

✅ Railway will automatically detect it's a Node.js app and deploy!

### 2.3 Configure Environment Variables
1. In Railway, click on the **NODE_ENV** service/deployment
2. Go to **Variables** tab
3. Add these variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/trustcoin-wallet?retryWrites=true&w=majority
JWT_SECRET=your-strong-secret-key-here-change-this
PORT=8080
NODE_ENV=production
CORS_ORIGIN=https://your-vercel-url.vercel.app
```

**Important**: Replace:
- `username:password` with your MongoDB credentials
- `your-strong-secret-key` with a random strong string
- `your-vercel-url` with your Vercel frontend URL (you'll get this in Step 3)

### 2.4 Get Your Backend URL
1. In Railway, click **Deployments**
2. Under **Networking**, you'll see your public URL
3. Example: `https://trustcoin-backend-prod.up.railway.app`
4. **Save this!** You need it for the frontend

### 2.5 Verify Deployment
1. Click the URL to visit your backend
2. You should see an error (404) - this is normal
3. Check logs: Click **Logs** tab to see if server started
4. Look for: `TrustCoinWallet server running on port 8080`

✅ Backend is deployed!

---

## 🎨 Step 3: Deploy Frontend on Vercel

### 3.1 Sign Up for Vercel
1. Go to: https://vercel.com
2. Click **Sign Up**
3. Choose **GitHub**
4. Authorize Vercel

### 3.2 Import Your Repository
1. Click **New Project** or **Import Project**
2. Select your `trustcoin-wallet` repository
3. Click **Import**

### 3.3 Configure Frontend Build Settings
1. In **Root Directory**: Select `client`
2. **Build Command**: `npm run build`
3. **Output Directory**: `build`
4. Keep other settings default
5. Click **Deploy**

✅ Vercel will build and deploy automatically!

### 3.4 Add Environment Variables
1. After deployment, go to **Settings** → **Environment Variables**
2. Add new variable:
   ```
   REACT_APP_API_URL=https://your-railway-backend-url.up.railway.app
   ```
3. Replace with your actual Railway backend URL from Step 2.4
4. Click **Save**

### 3.5 Redeploy Frontend
1. Go to **Deployments**
2. Click the **...** (three dots) on latest deployment
3. Select **Redeploy**
4. Click **Yes** to redeploy

### 3.6 Get Your Frontend URL
1. After redeployment completes
2. You'll see your live URL: `https://your-project.vercel.app`
3. Click it to view your app!

✅ Frontend is deployed!

---

## 🔗 Step 4: Update Backend CORS Setting

1. Go back to Railway dashboard
2. Select your Node.js service
3. Go to **Variables**
4. Update `CORS_ORIGIN` with your Vercel URL:
   ```
   CORS_ORIGIN=https://your-project.vercel.app
   ```
5. Save changes

✅ Your frontend and backend are now connected!

---

## 🌐 Step 5: Access Your Live Application

### Your URLs:
- **Frontend**: `https://your-project.vercel.app`
- **Backend API**: `https://your-app-prod.up.railway.app`
- **MongoDB Database**: Atlas cloud

### Test Your App
1. Visit: `https://your-project.vercel.app`
2. Click **Sign Up**
3. Enter:
   - Email: `holysin682@gmail.com`
   - Password: `admin123`
4. ✅ You should be logged in as ADMIN!

---

## 🧪 Test All Features

| Feature | Status |
|---------|--------|
| 💼 User Dashboard | ✅ Should work |
| 🌍 Weather Feature | ✅ Should work |
| 😂 Joke Generator | ✅ Should work |
| 💰 Admin Fund Transfer | ✅ Should work (if admin) |
| 👥 Admin Panel | ✅ Should work (if admin) |

---

## 🐛 Troubleshooting

### Issue: Blank Page or "Cannot fetch data"
**Solution:**
1. Check browser console (F12 → Console)
2. Look for CORS errors
3. Verify `REACT_APP_API_URL` in Vercel is correct
4. Redeploy Vercel frontend

### Issue: "API request failed"
**Solution:**
1. Check Railway logs for backend errors
2. Verify MongoDB connection string is correct
3. Check MongoDB IP whitelist includes Railway IP
4. Restart Railway deployment

### Issue: MongoDB Connection Timeout
**Solution:**
1. Check MongoDB IP whitelist: `0.0.0.0/0` should be allowed
2. Verify connection string is correct
3. Test connection string on MongoDB Atlas

### Issue: "Cannot find module 'express'"
**Solution:**
1. Go to Railway logs
2. Check if `npm install` ran successfully
3. Redeploy if needed

### Issue: Server keeps restarting
**Solution:**
1. Check for errors in Railway logs
2. Verify all environment variables are set
3. Check for syntax errors in `server.js`

---

## 📊 Monitor Your Application

### Railway Monitoring
1. Go to Railway dashboard
2. Click your deployment
3. View in **Logs** tab:
   - See all server logs
   - Check for errors
   - Monitor performance

### Vercel Monitoring
1. Go to Vercel dashboard
2. Click your project
3. View in **Analytics** tab:
   - See request data
   - Check for errors
   - Monitor performance

---

## 🔄 Deploy Updates

### When You Make Changes

**For Backend (Node.js)**
1. Make changes in your code
2. Push to GitHub: `git push origin main`
3. Railway automatically redeploys!

**For Frontend (React)**
1. Make changes in `client/` folder
2. Push to GitHub: `git push origin main`
3. Vercel automatically redeploys!

---

## 💾 Backup Your Database

### MongoDB Atlas Automatic Backups
1. MongoDB Atlas automatically backs up daily (free tier)
2. Go to **Backup** in MongoDB Atlas
3. You can restore anytime

### Manual Backup
```bash
mongodump --uri "your-connection-string" --out ./backup
```

---

## 🔐 Security Checklist

- [ ] Changed `JWT_SECRET` to strong random value
- [ ] Set `CORS_ORIGIN` to your Vercel URL only
- [ ] MongoDB IP whitelist configured
- [ ] Using HTTPS (automatic on Railway & Vercel)
- [ ] Environment variables not in code
- [ ] Regular backups enabled
- [ ] Monitoring set up

---

## 📈 Upgrade or Scale

### Railway Paid Plans
- Free tier: Great for testing
- Paid: More resources if needed
- Click **Pricing** in Railway to upgrade

### Vercel Paid Plans
- Free tier: Good for most apps
- Pro: More analytics and support
- Click **Settings** → **Plan** in Vercel

---

## 🎉 You're Live!

**Congratulations! Your TrustCoinWallet is now live on the internet!**

### What's Running:
- ✅ Frontend on Vercel (React)
- ✅ Backend on Railway (Node.js)
- ✅ Database on MongoDB Atlas
- ✅ HTTPS enabled everywhere
- ✅ Auto-deployment on code push

### Share Your App
- Send your Vercel URL to users
- They can sign up and use immediately
- Everything is live and secure!

---

## 📞 Need Help?

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Docs**: https://docs.mongodb.com
- **Our Guides**: See SETUP_GUIDE.md, DEPLOYMENT_GUIDE.md

---

## ✅ Final Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Connection string saved
- [ ] Railway account created
- [ ] Backend deployed on Railway
- [ ] Environment variables set
- [ ] Vercel account created
- [ ] Frontend deployed on Vercel
- [ ] Environment variables configured
- [ ] Tested login and features
- [ ] Got live URLs
- [ ] Monitoring set up

**Happy hosting! 🚀**
