# 🎓 Student-Teacher Appointment Booking System

A modern, full-featured web application that streamlines appointment scheduling between students and teachers. Built with Firebase and modern web technologies, featuring a beautiful UI with dark mode support and comprehensive admin controls.

## 🚀 Features

### 🎨 Modern UI/UX
- **Clean Dashboard Design**: Professional table-based layouts for all user roles
- **Purple Gradient Theme**: Modern aesthetic with smooth color transitions
- **Dark Mode**: Toggle between light and dark themes with persistent preferences
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Sidebar Navigation**: Easy-to-use navigation with active state indicators
- **Real-time Search**: Instant filtering across all tables and data

### 👨‍🎓 Student Features
- **Browse Teachers**: View all available teachers in a clean table format
- **Advanced Search**: Filter teachers by name, department, or subject
- **Book Appointments**: Schedule appointments with date, time, and purpose
- **Track Appointments**: View all your appointments with status updates
- **Delete Appointments**: Cancel appointments you no longer need
- **Email Display**: See teacher contact information

### 👨‍🏫 Teacher Features
- **Pending Appointments**: View and manage appointment requests
- **Approve/Decline**: Accept or reject student appointment requests
- **All Appointments**: Complete history of all appointments
- **Search Functionality**: Filter appointments by student name or date
- **View Details**: See full appointment information including student messages
- **Status Tracking**: Monitor appointment statuses (Pending, Approved, Canceled)

### 👨‍💼 Admin Features
- **Appointments Management**:
  - View all appointments in the system
  - Approve/Reject pending appointments
  - Cancel confirmed appointments
  - Delete appointments
  - Search and filter by any field

- **Teachers Management**:
  - View all teachers with complete details
  - Add new teachers with department and subject
  - Delete teachers from the system
  - Search teachers by name, email, department, or subject

- **Students Management**:
  - View all students with approval status
  - Add new students (approved or pending)
  - Approve pending student registrations
  - Delete students from the system
  - Search students by any field
  - Track student approval status

- **Quick Actions**:
  - Add Teacher button in sidebar and Teachers section
  - Add Student button in sidebar and Students section
  - Section-based navigation for easy management

## 🛠️ Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript (ES6+ Modules)
- **Authentication:** Firebase Authentication (Email/Password)
- **Database:** Firebase Realtime Database
- **Fonts:** Inter (Google Fonts)
- **Icons:** Font Awesome 6.5.1
- **Hosting:** Firebase Hosting / Netlify / Vercel (optional)
- **Storage:** LocalStorage (for dark mode preferences)

## 📁 Project Structure

```
booking/
├── index.html                    # Landing page
├── firebase-setup.md             # Firebase setup guide
├── README.md                     # Documentation
├── css/
│   ├── style.css                # Global styles
│   ├── auth.css                 # Login/Register page styles
│   ├── dashboard.css            # Dashboard styles (with dark mode)
│   ├── calendar.css             # Calendar component styles
│   └── darkmode.css             # Legacy dark mode styles
├── js/
│   ├── firebase-config.js       # Firebase configuration
│   ├── app.js                   # Landing page logic
│   ├── auth.js                  # Authentication logic
│   ├── student.js               # Student dashboard logic
│   ├── teacher.js               # Teacher dashboard logic
│   ├── admin.js                 # Admin dashboard logic
│   ├── calendar.js              # Calendar functionality
│   └── darkmode.js              # Legacy dark mode toggle
└── pages/
    ├── login.html               # Login page
    ├── register.html            # Registration page
    ├── student-dashboard.html   # Student interface
    ├── teacher-dashboard.html   # Teacher interface
    └── admin-dashboard.html     # Admin interface
```

## 🔧 Installation & Setup

### Prerequisites
- A modern web browser
- Firebase account (free tier works)

### Step 1: Clone the Repository
```bash
git clone https://github.com/Sachin844123/Student-Appointment-Booking.git
cd Student-Appointment-Booking
```

### Step 2: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** → Email/Password sign-in method
4. Enable **Realtime Database** → Start in test mode (for development)
5. Copy your Firebase configuration

### Step 3: Configure Firebase

Open `js/firebase-config.js` and replace with your Firebase credentials:

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

### Step 4: Create Admin User

Since the first admin needs to be created manually:

1. Register a user through the registration page
2. Go to Firebase Console → Realtime Database
3. Find the user and change their `role` to `"admin"`
4. Set `approved` to `true`

### Step 5: Run the Application

Open `index.html` in your browser or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server
```

Visit `http://localhost:8000` in your browser.

## 📊 Database Structure

```
{
  "users": {
    "userId": {
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student|teacher|admin",
      "department": "Computer Science",
      "subject": "Web Development",
      "approved": true
    }
  },
  "appointments": {
    "appointmentId": {
      "studentId": "userId",
      "teacherId": "userId",
      "date": "2024-01-15",
      "timeFrom": "10:00",
      "timeEnd": "11:00",
      "message": "Discuss project",
      "status": "pending|approved|canceled",
      "createdAt": "2024-01-10T10:00:00Z"
    }
  }
}
```

## 🎨 UI Theme

The application features a modern gradient design:
- Blue to Purple gradient header
- Clean, rounded form cards
- Responsive layout for all devices
- Icon-based feature highlights
- Student-friendly interface

## 🔐 Security Rules (Firebase)

For production, update your Firebase Realtime Database rules:

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
      ".write": "auth != null"
    }
  }
}
```

## 🚀 Deployment

### Deploy to Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase
firebase init

# Deploy
firebase deploy
```

## 📝 Usage Guide

### For Students:
1. Register with your email and wait for admin approval
2. Login after approval
3. Search for teachers by department/subject
4. Book an appointment with date, time, and message
5. Track appointment status

### For Teachers:
1. Login with credentials (created by admin)
2. View pending appointments
3. Approve or decline requests
4. View all appointments and messages

### For Admins:
1. Login with admin credentials
2. Approve pending student registrations
3. Add/remove teachers
4. Monitor all appointments
5. Cancel appointments if needed

## ✨ Key Features Explained

### Dark Mode
- Click the floating moon/sun button in the bottom-right corner
- Preference is automatically saved to localStorage
- Works across all dashboards (Admin, Teacher, Student)
- Smooth color transitions for comfortable viewing
- Optimized color schemes for both light and dark themes

### Appointment Workflow
1. **Student** browses available teachers and books an appointment
2. Appointment status: **"Pending"**
3. **Teacher** receives the request and can approve or decline
4. If approved, status changes to **"Approved"**
5. **Admin** can view and manage all appointments
6. Appointments can be canceled by teachers or admins

### User Management
1. Students register and wait for admin approval
2. Admin can add teachers directly (auto-approved)
3. Admin can add students with immediate approval option
4. All users can be viewed, searched, and managed by admin

### Search & Filter
- Real-time search across all tables
- Filter by name, email, department, subject, or status
- Instant results without page reload
- Works on appointments, teachers, and students

## 🔮 Future Enhancements

- 📧 Email notifications for appointment updates
- 📱 Progressive Web App (PWA) support
- 💬 Real-time chat between students and teachers
- 📅 Google Calendar integration
- 📊 Analytics dashboard for admins
- 🔔 Push notifications for appointment reminders
- 📎 File attachment support for appointments
- 🌍 Multi-language support
- 📤 Export data to PDF/Excel
- 🎥 Video call integration
- ⏰ Automatic appointment reminders
- 📈 Teacher rating system

## 📄 License

This project is open source and available under the MIT License.

