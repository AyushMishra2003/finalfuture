cd # 🔐 Environment Variables (.env) - Complete Configuration

## 📋 Current .env File Contents

**File Location:** `backend/.env`

---

## 📄 Complete .env Configuration

```env
# ============================================
# SERVER CONFIGURATION
# ============================================
NODE_ENV=development
PORT=5000

# ============================================
# DATABASE CONFIGURATION
# ============================================
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://futurelabsdesign:Fazil%402025Kerala@cluster0.mongodb.net/futurelabs?retryWrites=true&w=majority

# Note: Update 'cluster0' with your actual cluster name from MongoDB Atlas
# Password is URL-encoded: @ becomes %40

# ============================================
# JWT CONFIGURATION
# ============================================
JWT_SECRET=futurelab_super_secret_jwt_key_2025_secure_random_string_12345
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# ============================================
# SMS CONFIGURATION (BhashSMS)
# ============================================
SMS_API_USER=your_sms_api_user
SMS_API_PASS=your_sms_api_password
SMS_SENDER_ID=FULABS

# Note: Update with actual SMS API credentials

# ============================================
# EMAIL CONFIGURATION (Gmail SMTP)
# ============================================
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=futurelabsdesign@gmail.com
EMAIL_PASS=your_app_specific_password
EMAIL_FROM_NAME=FutureLabs

# Note: Use Gmail App Password, not regular password
# Get it from: https://myaccount.google.com/apppasswords

# ============================================
# HDFC SMARTGATEWAY PAYMENT CONFIGURATION
# ============================================
HDFC_API_KEY=A9949FA93754229AB0640140B902BC
HDFC_MERCHANT_ID=SG2238
HDFC_CLIENT_ID=hdfcmaster
HDFC_BASE_URL=https://smartgatewayuat.hdfcbank.com
HDFC_RESPONSE_KEY=776522EDCCB4734AAA9C0975FB2724
HDFC_ENABLE_LOGGING=true

# Note: These are UAT (testing) credentials
# For production, update with live credentials

# ============================================
# APPLICATION URLS
# ============================================
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

# For production, update to actual domain:
# FRONTEND_URL=https://yourdomain.com
# BACKEND_URL=https://api.yourdomain.com

# ============================================
# OPTIONAL: RAZORPAY (Alternative Payment)
# ============================================
# RAZORPAY_KEY_ID=your_razorpay_key_id
# RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# ============================================
# OPTIONAL: CLOUDINARY (Image Upload)
# ============================================
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🔑 Credentials Summary

### ✅ Configured (Ready to Use)
1. **Server:** Port 5000 ✅
2. **MongoDB:** Atlas connection string ✅
3. **JWT:** Secret key configured ✅
4. **HDFC Payment:** All credentials ✅
5. **URLs:** Frontend & Backend ✅

### ⚠️ Needs Update
1. **MongoDB Cluster Name** - Update `cluster0` with actual name
2. **Email Password** - Add Gmail App Password
3. **SMS Credentials** - Add actual SMS API details (optional)

---

## 📝 How to Update .env File

### Method 1: Using Text Editor

1. Open `backend/.env` in any text editor
2. Update the values you need
3. Save the file

### Method 2: Using VS Code

1. Open VS Code
2. Navigate to `backend` folder
3. Open `.env` file
4. Edit and save

### Method 3: Using Notepad

```bash
cd backend
notepad .env
```

---

## 🔧 Values You Need to Update

### 1. MongoDB Cluster Name

**Current:**
```env
MONGODB_URI=mongodb+srv://futurelabsdesign:Fazil%402025Kerala@cluster0.mongodb.net/futurelabs?retryWrites=true&w=majority
```

**How to get your cluster name:**
1. Go to https://cloud.mongodb.com/
2. Login with `futurelabsdesign@gmail.com`
3. Click "Connect" on your cluster
4. Copy the connection string
5. Look for `@clusterXXXXX.xxxxx.mongodb.net`
6. Replace `cluster0` with your actual cluster name

**Example:**
```env
MONGODB_URI=mongodb+srv://futurelabsdesign:Fazil%402025Kerala@cluster12345.abc123.mongodb.net/futurelabs?retryWrites=true&w=majority
```

---

### 2. Gmail App Password

**Current:**
```env
EMAIL_PASS=your_app_specific_password
```

**How to get Gmail App Password:**
1. Go to https://myaccount.google.com/apppasswords
2. Login with `futurelabsdesign@gmail.com`
3. Select "Mail" and "Other"
4. Name it "FutureLabs Backend"
5. Copy the 16-character password
6. Update .env:

```env
EMAIL_PASS=abcd efgh ijkl mnop
```

(Remove spaces when pasting)

---

### 3. SMS API Credentials (Optional)

**Current:**
```env
SMS_API_USER=your_sms_api_user
SMS_API_PASS=your_sms_api_password
```

**If you have SMS service:**
```env
SMS_API_USER=actual_username
SMS_API_PASS=actual_password
```

**If you don't need SMS:**
Leave as is - the app will work without it.

---

## 🌐 Production Configuration

### When deploying to production:

```env
# Change to production
NODE_ENV=production

# Update MongoDB to production cluster
MONGODB_URI=mongodb+srv://username:password@production-cluster.mongodb.net/futurelabs

# Update URLs to actual domain
FRONTEND_URL=https://futurelabs.com
BACKEND_URL=https://api.futurelabs.com

# Update HDFC to production
HDFC_BASE_URL=https://smartgateway.hdfcbank.com
HDFC_ENABLE_LOGGING=false

# Use production HDFC credentials
HDFC_API_KEY=production_api_key
HDFC_MERCHANT_ID=production_merchant_id
HDFC_RESPONSE_KEY=production_response_key
```

---

## 🔒 Security Best Practices

### ✅ Good Practices
1. **.env is in .gitignore** ✅
2. **Never commit .env to GitHub** ✅
3. **Use environment variables** ✅
4. **Different credentials for dev/prod** ✅

### ⚠️ Important
- Never share .env file publicly
- Use different passwords for production
- Rotate credentials periodically
- Use strong, unique passwords

---

## 📊 Environment Variables by Service

### Server
```env
NODE_ENV=development
PORT=5000
```

### Database
```env
MONGODB_URI=mongodb+srv://...
```

### Authentication
```env
JWT_SECRET=...
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
```

### Email
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=futurelabsdesign@gmail.com
EMAIL_PASS=...
EMAIL_FROM_NAME=FutureLabs
```

### Payment (HDFC)
```env
HDFC_API_KEY=A9949FA93754229AB0640140B902BC
HDFC_MERCHANT_ID=SG2238
HDFC_CLIENT_ID=hdfcmaster
HDFC_BASE_URL=https://smartgatewayuat.hdfcbank.com
HDFC_RESPONSE_KEY=776522EDCCB4734AAA9C0975FB2724
HDFC_ENABLE_LOGGING=true
```

### URLs
```env
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

---

## 🧪 Testing Configuration

### For Development/Testing
```env
NODE_ENV=development
HDFC_BASE_URL=https://smartgatewayuat.hdfcbank.com
HDFC_ENABLE_LOGGING=true
```

### For Production
```env
NODE_ENV=production
HDFC_BASE_URL=https://smartgateway.hdfcbank.com
HDFC_ENABLE_LOGGING=false
```

---

## 🔍 Verification Checklist

### Check if .env is working:

```bash
cd backend
npm start
```

**Look for:**
- ✅ Server running on port 5000
- ✅ MongoDB connection successful
- ✅ No environment variable errors

**If you see errors:**
- Check .env file exists in `backend` folder
- Verify all values are correct
- Ensure no extra spaces
- Check quotes are not needed

---

## 📝 Quick Copy Template

### Minimal Working Configuration

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/futurelabs
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

This will work with local MongoDB (no Atlas needed).

---

## 🚀 Quick Start

### 1. Create .env file (if not exists)

```bash
cd backend
notepad .env
```

### 2. Copy the complete configuration from above

### 3. Update these values:
- MongoDB cluster name
- Gmail app password (if using email)
- SMS credentials (if using SMS)

### 4. Save and test

```bash
npm start
```

---

## 📞 Support

### If .env file is not working:

1. **Check file location:** Must be in `backend` folder
2. **Check file name:** Must be exactly `.env` (with dot)
3. **Check syntax:** No quotes needed for values
4. **Check spaces:** No spaces around `=`
5. **Restart server:** After changing .env

### Common Issues:

**Error: "Cannot find module 'dotenv'"**
```bash
cd backend
npm install dotenv
```

**Error: "MONGODB_URI is not defined"**
- Check .env file exists
- Check file is in `backend` folder
- Restart server

---

## ✅ Summary

**Your .env file has:**
- ✅ Server configuration
- ✅ MongoDB Atlas connection
- ✅ JWT settings
- ✅ Email configuration
- ✅ HDFC payment credentials
- ✅ Application URLs

**You need to update:**
- ⏳ MongoDB cluster name
- ⏳ Gmail app password
- ⏳ SMS credentials (optional)

**File is ready to use!** Just update the 2-3 values mentioned above.

---

**Created:** December 6, 2025  
**Location:** `backend/.env`  
**Status:** ✅ Configured  
**Action:** Update cluster name & email password  

**Your environment is ready!** 🚀
