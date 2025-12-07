# Firebase Setup Guide

This guide will walk you through setting up Firebase for the Student-Teacher Appointment System.

## Prerequisites

- A Google account
- Modern web browser (Chrome, Firefox, Safari, or Edge)

---

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click on **"Add project"** or **"Create a project"**
3. Enter your project name (e.g., "Student-Teacher-Appointments")
4. Click **"Continue"**
5. (Optional) Enable Google Analytics if you want usage statistics
6. Click **"Create project"**
7. Wait for the project to be created, then click **"Continue"**

---

## Step 2: Register Your Web App

1. In your Firebase project dashboard, click on the **Web icon** (`</>`) to add a web app
2. Enter an app nickname (e.g., "Appointment System Web")
3. **Check** the box for "Also set up Firebase Hosting" (optional, but recommended)
4. Click **"Register app"**
5. You'll see your Firebase configuration object - **keep this page open**, you'll need it in Step 5

---

## Step 3: Enable Authentication

1. In the left sidebar, click on **"Build"** → **"Authentication"**
2. Click on **"Get started"**
3. Go to the **"Sign-in method"** tab
4. Click on **"Email/Password"**
5. Toggle the **"Enable"** switch to ON
6. Click **"Save"**

---

## Step 4: Set Up Realtime Database

### 4.1 Create the Database

1. In the left sidebar, click on **"Build"** → **"Realtime Database"**
2. Click **"Create Database"**
3. Select your database location (choose the closest to your users)
4. Click **"Next"**

### 4.2 Set Security Rules (Development Mode)

1. Select **"Start in test mode"** for development
2. Click **"Enable"**

> ⚠️ **Important**: Test mode allows anyone to read/write to your database. This is fine for development but **must be changed before production**.

### 4.3 Production Security Rules (Apply Before Deployment)

Once you're ready to deploy, update your security rules:

1. Go to **"Realtime Database"** → **"Rules"** tab
2. Replace the rules with the following:

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
      ".write": "auth != null",
      "$appointmentId": {
        ".validate": "newData.hasChildren(['studentId', 'teacherId', 'date', 'timeFrom', 'timeEnd', 'message', 'status'])"
      }
    }
  }
}
```

3. Click **"Publish"**

---

## Step 5: Configure Your Application

1. Open the file `js/firebase-config.js` in your project
2. Replace the placeholder values with your Firebase configuration:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

**Where to find these values:**
- Go to **Project Settings** (gear icon in the left sidebar)
- Scroll down to **"Your apps"** section
- Click on your web app
- Copy the configuration object

### Example Configuration:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-default-rtdb.firebaseio.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890"
};
```

---

## Step 6: Create the First Admin User

Since the first admin user needs to be created manually:

### Method 1: Using the Application

1. Open your application in a browser
2. Go to the **Register** page
3. Fill in the registration form:
   - Full Name: Admin User
   - Email: admin@example.com
   - Password: (choose a strong password)
   - Role: Student (we'll change this)
   - Department: Administration
4. Click **"Register"**

### Method 2: Manually in Firebase Console

1. Go to **Authentication** → **Users** tab
2. Click **"Add user"**
3. Enter email and password
4. Click **"Add user"**
5. Copy the **User UID**

### Update User Role to Admin

1. Go to **Realtime Database**
2. Navigate to `users` → `[your-user-uid]`
3. Click on the user entry
4. Change the following fields:
   - `role`: Change to `"admin"`
   - `approved`: Change to `true`
5. Click **"Add"** or update the existing fields

Your database structure should look like this:

```
users
  └── [user-uid]
      ├── name: "Admin User"
      ├── email: "admin@example.com"
      ├── role: "admin"
      ├── department: "Administration"
      ├── approved: true
```

---

## Step 7: Test Your Setup

1. Open `index.html` in your browser (or use a local server)
2. Try to register a new student account
3. Login with your admin account
4. Approve the student registration
5. Test booking an appointment

---

## Database Structure Reference

Your Firebase Realtime Database will have the following structure:

```
{
  "users": {
    "userId1": {
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "department": "Computer Science",
      "approved": true
    },
    "userId2": {
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "teacher",
      "department": "Mathematics",
      "subject": "Calculus",
      "approved": true
    }
  },
  "appointments": {
    "appointmentId1": {
      "studentId": "userId1",
      "teacherId": "userId2",
      "date": "2024-01-15",
      "timeFrom": "10:00",
      "timeEnd": "11:00",
      "message": "Need help with assignment",
      "status": "pending",
      "createdAt": "2024-01-10T10:00:00Z"
    }
  }
}
```

---

## Troubleshooting

### Issue: "Permission Denied" Error

**Solution**: Check your database rules. Make sure you're in test mode during development or have proper authentication rules set up.

### Issue: "Firebase not defined" Error

**Solution**: Make sure you're using a local server to run the application. Firebase modules require a server environment. Use:
- Python: `python -m http.server 8000`
- Node.js: `npx http-server`
- VS Code: Live Server extension

### Issue: Can't Login After Registration

**Solution**: 
- For students: Check if the admin has approved your account
- For teachers: Teachers are auto-approved, check your email/password
- For admin: Make sure you manually set `role: "admin"` in the database

### Issue: Configuration Not Working

**Solution**: 
1. Double-check all configuration values in `firebase-config.js`
2. Make sure there are no extra spaces or quotes
3. Verify the `databaseURL` includes your project name

---

## Optional: Deploy to Firebase Hosting

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

### Step 3: Initialize Firebase Hosting

```bash
firebase init hosting
```

- Select your Firebase project
- Set public directory to: `.` (current directory)
- Configure as single-page app: `No`
- Set up automatic builds: `No`

### Step 4: Deploy

```bash
firebase deploy --only hosting
```

Your app will be live at: `https://your-project.web.app`

---

## Security Best Practices

1. **Never commit your Firebase config to public repositories** with real credentials
2. **Use environment variables** for sensitive data in production
3. **Enable App Check** to prevent abuse
4. **Set up proper security rules** before going to production
5. **Regularly review** your Firebase usage and security rules
6. **Enable 2FA** on your Google account
7. **Use strong passwords** for all admin accounts

---

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth)
- [Realtime Database Guide](https://firebase.google.com/docs/database)
- [Security Rules Documentation](https://firebase.google.com/docs/database/security)

---

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Review the Firebase Console for any alerts
3. Verify your configuration matches the setup steps
4. Check the troubleshooting section above

---

**Last Updated**: December 2024
