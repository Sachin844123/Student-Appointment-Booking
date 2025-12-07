# 🔧 Firebase Setup Guide

## ⚠️ Security Notice

Your Firebase credentials in `js/firebase-config.js` are currently exposed. Follow this guide to secure them properly.

## Quick Setup (5 Minutes)

### Step 1: Secure Your Current Credentials

Since your credentials are already exposed, you should regenerate them:

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `appointment-system-217f7`
3. **Delete the current web app**:
   - Go to Project Settings (gear icon)
   - Scroll to "Your apps"
   - Click the three dots on your web app
   - Select "Delete app"
   - Confirm deletion

### Step 2: Create New Web App

1. In Firebase Console, click "Add app" (</> icon)
2. Choose "Web"
3. Enter app nickname: "Appointment System (Secure)"
4. Check "Also set up Firebase Hosting" (optional)
5. Click "Register app"
6. **Copy the new configuration** (you'll need this)

### Step 3: Update Your Local Configuration

1. **Copy the example file**:
   ```bash
   cp js/firebase-config.example.js js/firebase-config.js
   ```

2. **Edit `js/firebase-config.js`** with your new credentials:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_NEW_API_KEY",
     authDomain: "appointment-system-217f7.firebaseapp.com",
     databaseURL: "https://appointment-system-217f7-default-rtdb.asia-southeast1.firebasedatabase.app",
     projectId: "appointment-system-217f7",
     storageBucket: "appointment-system-217f7.firebasestorage.app",
     messagingSenderId: "YOUR_NEW_SENDER_ID",
     appId: "YOUR_NEW_APP_ID",
     measurementId: "YOUR_NEW_MEASUREMENT_ID"
   };
   ```

3. **Save the file**

### Step 4: Verify Git Ignore

Check that the file is ignored:
```bash
git status
```

You should **NOT** see `js/firebase-config.js` in the list.

### Step 5: Secure Your Database

1. Go to Firebase Console → Realtime Database
2. Click "Rules" tab
3. Replace with these secure rules:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null",
        ".write": "$uid === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin'"
      }
    },
    "appointments": {
      ".read": "auth != null",
      "$appointmentId": {
        ".write": "auth != null && (
          root.child('appointments').child($appointmentId).child('studentId').val() === auth.uid ||
          root.child('appointments').child($appointmentId).child('teacherId').val() === auth.uid ||
          root.child('users').child(auth.uid).child('role').val() === 'admin'
        )"
      }
    }
  }
}
```

4. Click "Publish"

### Step 6: Restrict API Key (Important!)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: `appointment-system-217f7`
3. Go to **APIs & Services** → **Credentials**
4. Find your new API key
5. Click "Edit" (pencil icon)
6. Under **Application restrictions**:
   - Select "HTTP referrers (web sites)"
   - Add your domains:
     ```
     localhost:8000/*
     localhost:3000/*
     yourdomain.com/*
     *.yourdomain.com/*
     ```
7. Under **API restrictions**:
   - Select "Restrict key"
   - Enable only:
     - Identity Toolkit API
     - Firebase Realtime Database API
8. Click "Save"

### Step 7: Test Your Application

1. Start local server:
   ```bash
   python -m http.server 8000
   ```

2. Open browser: `http://localhost:8000`

3. Test login/register functionality

4. Verify everything works

## For Team Members

### Getting Started

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd booking
   ```

2. **Copy the config template**:
   ```bash
   cp js/firebase-config.example.js js/firebase-config.js
   ```

3. **Get credentials from team lead** (via secure channel)

4. **Update `js/firebase-config.js`** with provided credentials

5. **Never commit this file**:
   ```bash
   # Verify it's ignored
   git status
   ```

## Production Deployment

### Option 1: Environment Variables (Recommended)

For Netlify/Vercel, use environment variables:

1. **Create build script** (`build.js`):
   ```javascript
   const fs = require('fs');
   
   const config = `
   const firebaseConfig = {
     apiKey: "${process.env.FIREBASE_API_KEY}",
     authDomain: "${process.env.FIREBASE_AUTH_DOMAIN}",
     databaseURL: "${process.env.FIREBASE_DATABASE_URL}",
     projectId: "${process.env.FIREBASE_PROJECT_ID}",
     storageBucket: "${process.env.FIREBASE_STORAGE_BUCKET}",
     messagingSenderId: "${process.env.FIREBASE_MESSAGING_SENDER_ID}",
     appId: "${process.env.FIREBASE_APP_ID}",
     measurementId: "${process.env.FIREBASE_MEASUREMENT_ID}"
   };
   
   import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
   import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
   import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
   
   const app = initializeApp(firebaseConfig);
   export const auth = getAuth(app);
   export const database = getDatabase(app);
   `;
   
   fs.writeFileSync('js/firebase-config.js', config);
   ```

2. **Add environment variables** in hosting platform

3. **Run build script** before deployment

### Option 2: Firebase Hosting

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Login**:
   ```bash
   firebase login
   ```

3. **Initialize**:
   ```bash
   firebase init hosting
   ```

4. **Deploy**:
   ```bash
   firebase deploy
   ```

## Security Checklist

Before going live, ensure:

- [ ] New Firebase credentials generated
- [ ] Old credentials deleted
- [ ] `firebase-config.js` in `.gitignore`
- [ ] Database rules are restrictive
- [ ] API key restricted to your domain
- [ ] HTTPS enabled in production
- [ ] Email verification enabled (optional)
- [ ] Firebase App Check enabled (optional)
- [ ] Budget alerts configured
- [ ] Team members trained on security

## Troubleshooting

### "Permission Denied" Error

**Cause**: Database rules are too restrictive

**Solution**: Check Firebase Console → Database → Rules

### "API Key Invalid" Error

**Cause**: API key restrictions too strict

**Solution**: Add your domain to allowed referrers

### Config File Not Found

**Cause**: `firebase-config.js` doesn't exist

**Solution**: Copy from `firebase-config.example.js`

## Additional Resources

- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Firebase App Check](https://firebase.google.com/docs/app-check)
- [API Key Best Practices](https://cloud.google.com/docs/authentication/api-keys)

## Need Help?

- Check SECURITY.md for detailed security guide
- Review DOCUMENTATION.md for full system docs
- Contact team lead for credentials

---

**Remember**: Never commit `js/firebase-config.js` to version control!
