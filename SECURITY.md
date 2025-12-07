# 🔒 Security Guide

## Firebase Configuration Security

### ⚠️ IMPORTANT: Your Firebase credentials are currently exposed!

Your `js/firebase-config.js` file contains sensitive Firebase credentials that should **NEVER** be committed to version control or shared publicly.

## Immediate Actions Required

### 1. Regenerate Your Firebase API Key (Recommended)

Since your credentials are already exposed, it's best to regenerate them:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `appointment-system-217f7`
3. Go to **Project Settings** (gear icon)
4. Navigate to **General** tab
5. Under "Your apps", find your web app
6. Click **Delete app** (or regenerate keys if available)
7. Create a new web app and get new credentials

### 2. Secure Your Database

Update your Firebase Realtime Database rules immediately:

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

### 3. Set Up App Check (Optional but Recommended)

Firebase App Check helps protect your backend resources from abuse:

1. Go to Firebase Console → App Check
2. Enable App Check for your web app
3. Use reCAPTCHA v3 for web apps
4. Follow the setup instructions

### 4. Restrict API Key Usage

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Find your API key
5. Click **Edit**
6. Under **Application restrictions**:
   - Select "HTTP referrers (web sites)"
   - Add your domain (e.g., `yourdomain.com/*`)
7. Under **API restrictions**:
   - Select "Restrict key"
   - Enable only required APIs:
     - Firebase Authentication API
     - Firebase Realtime Database API

## Setup Instructions for New Developers

### For Repository Maintainers

1. **Never commit** `js/firebase-config.js` to Git
2. The file is already in `.gitignore`
3. Only commit `js/firebase-config.example.js` as a template

### For New Developers Setting Up

1. Copy the example config:
   ```bash
   cp js/firebase-config.example.js js/firebase-config.js
   ```

2. Get Firebase credentials from project admin (securely)

3. Update `js/firebase-config.js` with actual credentials

4. Verify the file is not tracked by Git:
   ```bash
   git status
   # firebase-config.js should NOT appear
   ```

## Environment Variables (Alternative Approach)

For production deployments, use environment variables:

### Using Netlify

1. Go to Site Settings → Build & Deploy → Environment
2. Add environment variables:
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_DATABASE_URL`
   - etc.

3. Update your build script to inject these values

### Using Vercel

1. Go to Project Settings → Environment Variables
2. Add all Firebase config variables
3. Vercel will inject them during build

## Best Practices

### ✅ DO:
- Keep `firebase-config.js` in `.gitignore`
- Use environment variables in production
- Restrict API keys to specific domains
- Enable Firebase App Check
- Use secure database rules
- Regularly rotate credentials
- Monitor Firebase usage for anomalies

### ❌ DON'T:
- Commit credentials to Git
- Share credentials in public channels
- Use test mode database rules in production
- Expose credentials in client-side code (unavoidable but mitigate with restrictions)
- Ignore security warnings from Firebase

## Checking If Credentials Are Exposed

### Check Git History

```bash
# Check if file was previously committed
git log --all --full-history -- js/firebase-config.js

# If found, you need to remove it from history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch js/firebase-config.js" \
  --prune-empty --tag-name-filter cat -- --all
```

### Check GitHub/GitLab

1. Search your repository for "apiKey"
2. Check all branches
3. Check commit history
4. If found, regenerate credentials immediately

## Incident Response

If credentials are exposed:

1. **Immediately** regenerate all Firebase credentials
2. Update database rules to be restrictive
3. Enable App Check
4. Restrict API key usage
5. Monitor Firebase Console for unusual activity
6. Review authentication logs
7. Notify team members
8. Update all deployed instances

## Additional Security Measures

### 1. Enable Email Verification

```javascript
// After user registration
await sendEmailVerification(user);
```

### 2. Implement Rate Limiting

Use Firebase Security Rules to limit requests:

```json
{
  "rules": {
    ".read": "auth != null && 
      root.child('rate_limit').child(auth.uid).child('timestamp').val() + 1000 < now"
  }
}
```

### 3. Monitor Firebase Usage

- Set up budget alerts in Firebase Console
- Monitor authentication attempts
- Track database read/write operations
- Review security rules regularly

### 4. Use HTTPS Only

Ensure your application is served over HTTPS in production.

---

**Last Updated**: December 2025  
**Security Level**: High Priority
