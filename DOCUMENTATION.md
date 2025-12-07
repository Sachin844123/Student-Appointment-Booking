# 📚 Student-Teacher Appointment Booking System - Complete Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [User Roles & Permissions](#user-roles--permissions)
4. [Features Documentation](#features-documentation)
5. [Database Structure](#database-structure)
6. [API & Functions Reference](#api--functions-reference)
7. [UI Components](#ui-components)
8. [Installation Guide](#installation-guide)
9. [Configuration](#configuration)
10. [Security](#security)
11. [Troubleshooting](#troubleshooting)
12. [Best Practices](#best-practices)

---

## System Overview

### Purpose
The Student-Teacher Appointment Booking System is a web-based application designed to streamline the process of scheduling and managing appointments between students and teachers in educational institutions.

### Key Objectives
- Eliminate manual appointment scheduling
- Provide real-time appointment status updates
- Enable efficient teacher-student communication
- Give administrators full control over the system
- Offer a modern, user-friendly interface

### Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+ Modules)
- **Backend**: Firebase Realtime Database
- **Authentication**: Firebase Authentication
- **Styling**: Custom CSS with CSS Grid and Flexbox
- **Icons**: Font Awesome 6.5.1
- **Fonts**: Inter (Google Fonts)

---

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client Browser                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  Admin   │  │ Teacher  │  │ Student  │             │
│  │Dashboard │  │Dashboard │  │Dashboard │             │
│  └──────────┘  └──────────┘  └──────────┘             │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│              Firebase Services                           │
│  ┌──────────────────┐  ┌──────────────────┐           │
│  │  Authentication  │  │ Realtime Database│           │
│  │  (Email/Pass)    │  │   (JSON Store)   │           │
│  └──────────────────┘  └──────────────────┘           │
└─────────────────────────────────────────────────────────┘
```

### Application Flow

```
Landing Page (index.html)
    │
    ├─→ Login (login.html)
    │       │
    │       ├─→ Admin Dashboard
    │       ├─→ Teacher Dashboard
    │       └─→ Student Dashboard
    │
    └─→ Register (register.html)
            │
            └─→ Pending Approval → Admin Approves → Student Dashboard
```

### File Structure & Responsibilities


#### HTML Files
- **index.html**: Landing page with system overview
- **pages/login.html**: User authentication page
- **pages/register.html**: New user registration
- **pages/admin-dashboard.html**: Admin control panel
- **pages/teacher-dashboard.html**: Teacher interface
- **pages/student-dashboard.html**: Student interface

#### CSS Files
- **css/style.css**: Global styles and landing page
- **css/auth.css**: Login and registration page styles
- **css/dashboard.css**: All dashboard styles with dark mode
- **css/calendar.css**: Calendar component styles
- **css/darkmode.css**: Legacy dark mode (deprecated)

#### JavaScript Files
- **js/firebase-config.js**: Firebase initialization
- **js/app.js**: Landing page logic
- **js/auth.js**: Authentication handling
- **js/admin.js**: Admin dashboard functionality
- **js/teacher.js**: Teacher dashboard functionality
- **js/student.js**: Student dashboard functionality
- **js/calendar.js**: Calendar component
- **js/darkmode.js**: Legacy dark mode (deprecated)

---

## User Roles & Permissions

### 1. Admin Role

**Access Level**: Full System Access

**Capabilities**:
- ✅ View all appointments across the system
- ✅ Approve/Reject/Cancel any appointment
- ✅ Add, view, and delete teachers
- ✅ Add, view, approve, and delete students
- ✅ Search and filter all data
- ✅ Manage user accounts
- ✅ Override any user action

**Dashboard Sections**:
1. **Appointments**: Manage all system appointments
2. **Teachers**: Complete teacher management
3. **Students**: Student approval and management

**Typical Use Cases**:
- Approve new student registrations
- Add teachers to the system
- Monitor appointment activity
- Handle disputes or conflicts
- Maintain system integrity

### 2. Teacher Role

**Access Level**: Limited to Own Appointments

**Capabilities**:
- ✅ View appointments assigned to them
- ✅ Approve/Decline student appointment requests
- ✅ View student information
- ✅ Search their appointments
- ❌ Cannot modify other teachers' data
- ❌ Cannot add/delete users

**Dashboard Sections**:
1. **Pending Appointments**: Requests awaiting approval
2. **All Appointments**: Complete appointment history

**Typical Use Cases**:
- Review appointment requests
- Approve appointments that fit schedule
- Decline conflicting appointments
- Track appointment history

### 3. Student Role

**Access Level**: Limited to Own Data

**Capabilities**:
- ✅ Browse available teachers
- ✅ Book appointments with teachers
- ✅ View own appointments
- ✅ Delete own appointments
- ✅ Search teachers
- ❌ Cannot view other students' data
- ❌ Cannot modify teacher information
- ⚠️ Requires admin approval to access system

**Dashboard Sections**:
1. **Available Teachers**: Browse and book
2. **My Appointments**: Track bookings

**Typical Use Cases**:
- Find suitable teacher
- Schedule appointment
- Track appointment status
- Cancel if needed

---

## Features Documentation

### 🎨 Dark Mode

**Location**: All dashboard pages

**How It Works**:
1. Floating button in bottom-right corner
2. Click to toggle between light/dark themes
3. Preference saved to `localStorage`
4. Persists across sessions and pages

**Implementation**:
```javascript
// Toggle dark mode
body.classList.toggle('dark-mode');
localStorage.setItem('darkMode', 'enabled');
```

**CSS Classes**:
- `.dark-mode`: Applied to `<body>` element
- Cascades to all child elements
- Custom color schemes for dark theme

**Color Scheme**:
- **Light Mode**: White backgrounds, dark text
- **Dark Mode**: Navy backgrounds (#0f172a), light text

### 🔍 Search Functionality

**Available On**: All tables in all dashboards

**Features**:
- Real-time filtering
- Case-insensitive search
- Searches across all visible columns
- Instant results (no page reload)

**Implementation**:
```javascript
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});
```

**Search Fields**:
- **Appointments**: Name, email, date, time, status
- **Teachers**: Name, email, department, subject
- **Students**: Name, email, department, status

### 📅 Appointment Booking

**Process Flow**:


```
Student → Browse Teachers → Select Teacher → Fill Form
    ↓
Appointment Created (Status: Pending)
    ↓
Teacher Receives Notification
    ↓
Teacher Approves/Declines
    ↓
Status Updated (Approved/Canceled)
    ↓
Student Sees Updated Status
```

**Booking Form Fields**:
- Teacher (auto-selected)
- Date (date picker)
- Time From (time picker)
- Time End (time picker)
- Message/Purpose (textarea)

**Validation**:
- All fields required
- Date cannot be in the past
- End time must be after start time
- Message minimum length: 10 characters

**Database Entry**:
```javascript
{
    studentId: "user123",
    teacherId: "teacher456",
    date: "2024-12-15",
    timeFrom: "10:00",
    timeEnd: "11:00",
    message: "Discuss project requirements",
    status: "pending",
    createdAt: "2024-12-07T10:30:00Z"
}
```

### 👥 User Management

#### Adding Teachers (Admin Only)

**Form Fields**:
- Full Name
- Email
- Password
- Department
- Subject

**Process**:
1. Admin clicks "Add Teacher"
2. Fills form with teacher details
3. System creates Firebase Auth account
4. Stores user data in Realtime Database
5. Teacher can immediately login
6. Auto-approved (approved: true)

**Code Flow**:
```javascript
createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
        set(ref(database, 'users/' + userCredential.user.uid), {
            name, email, role: 'teacher', department, subject, approved: true
        });
    });
```

#### Adding Students (Admin Only)

**Form Fields**:
- Full Name
- Email
- Password
- Department
- Approval Status (Approved/Pending)

**Process**:
1. Admin clicks "Add Student"
2. Fills form with student details
3. Selects approval status
4. System creates Firebase Auth account
5. Stores user data with selected approval status
6. Student can login if approved

**Approval Options**:
- **Approved**: Student can access system immediately
- **Pending**: Student must wait for approval

#### Student Registration (Self-Service)

**Form Fields**:
- Full Name
- Email
- Password
- Confirm Password
- Department

**Process**:
1. Student visits registration page
2. Fills registration form
3. Account created with `approved: false`
4. Student cannot access dashboard
5. Admin reviews and approves
6. Student receives access

**Validation**:
- Email format validation
- Password minimum 6 characters
- Password confirmation match
- All fields required

### 📊 Appointment Management

#### Status Types

1. **Pending** (Yellow Badge)
   - Initial status when created
   - Awaiting teacher approval
   - Actions: Approve, Reject

2. **Approved/Confirm** (Green Badge)
   - Teacher has approved
   - Appointment confirmed
   - Actions: Cancel

3. **In Progress** (Green Badge)
   - Appointment is ongoing
   - Actions: Cancel

4. **Canceled** (Red Badge)
   - Appointment was canceled
   - No further actions available

#### Admin Actions

**Approve Appointment**:
```javascript
update(ref(database, 'appointments/' + id), { status: 'confirm' });
```

**Reject Appointment**:
```javascript
update(ref(database, 'appointments/' + id), { status: 'canceled' });
```

**Cancel Appointment**:
```javascript
update(ref(database, 'appointments/' + id), { status: 'canceled' });
```

**Delete Appointment**:
```javascript
remove(ref(database, 'appointments/' + id));
```

#### Teacher Actions

**Approve Request**:
- Changes status from "pending" to "approved"
- Student notified of approval
- Appointment confirmed

**Decline Request**:
- Changes status from "pending" to "canceled"
- Student notified of decline
- Appointment not scheduled

#### Student Actions

**Book Appointment**:
- Select teacher from list
- Choose date and time
- Provide purpose/message
- Submit request

**Delete Appointment**:
- Remove own appointments
- Only before teacher approval
- Cannot delete approved appointments

---

## Database Structure

### Firebase Realtime Database Schema

```json
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
    },
    "userId3": {
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin",
      "department": "Administration",
      "approved": true
    }
  },
  "appointments": {
    "appointmentId1": {
      "studentId": "userId1",
      "teacherId": "userId2",
      "date": "2024-12-15",
      "timeFrom": "10:00",
      "timeEnd": "11:00",
      "message": "Need help with calculus homework",
      "status": "pending",
      "createdAt": "2024-12-07T10:30:00.000Z"
    }
  }
}
```

### Data Models

#### User Model


```typescript
interface User {
    name: string;           // Full name
    email: string;          // Email address (unique)
    role: 'admin' | 'teacher' | 'student';
    department: string;     // Department name
    subject?: string;       // Only for teachers
    approved: boolean;      // Approval status
}
```

**Field Descriptions**:
- `name`: User's full name (required)
- `email`: Unique email address (required)
- `role`: User type - determines access level (required)
- `department`: Academic department (required)
- `subject`: Teaching subject (teachers only)
- `approved`: Whether user can access system (required)

#### Appointment Model

```typescript
interface Appointment {
    studentId: string;      // Reference to student user
    teacherId: string;      // Reference to teacher user
    date: string;           // Format: YYYY-MM-DD
    timeFrom: string;       // Format: HH:MM
    timeEnd: string;        // Format: HH:MM
    message: string;        // Purpose/reason for appointment
    status: 'pending' | 'approved' | 'confirm' | 'canceled' | 'in-progress';
    createdAt: string;      // ISO 8601 timestamp
}
```

**Field Descriptions**:
- `studentId`: Firebase Auth UID of student
- `teacherId`: Firebase Auth UID of teacher
- `date`: Appointment date in ISO format
- `timeFrom`: Start time in 24-hour format
- `timeEnd`: End time in 24-hour format
- `message`: Student's message to teacher
- `status`: Current appointment state
- `createdAt`: Timestamp when created

### Database Rules

**Development Rules** (Test Mode):
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**Production Rules** (Recommended):
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

---

## API & Functions Reference

### Authentication Functions

#### Login
```javascript
signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        // Get user data from database
        get(ref(database, 'users/' + user.uid))
            .then((snapshot) => {
                const userData = snapshot.val();
                // Store in sessionStorage
                sessionStorage.setItem('userId', user.uid);
                sessionStorage.setItem('userRole', userData.role);
                sessionStorage.setItem('userName', userData.name);
                // Redirect based on role
            });
    });
```

#### Register
```javascript
createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        // Store user data
        set(ref(database, 'users/' + user.uid), {
            name, email, role: 'student', department, approved: false
        });
    });
```

#### Logout
```javascript
signOut(auth)
    .then(() => {
        sessionStorage.clear();
        window.location.href = 'login.html';
    });
```

### Database Functions

#### Read Data
```javascript
// Get single record
get(ref(database, 'users/' + userId))
    .then((snapshot) => {
        const data = snapshot.val();
    });

// Get all records
get(ref(database, 'users'))
    .then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            const key = childSnapshot.key;
        });
    });
```

#### Write Data
```javascript
// Create new record
push(ref(database, 'appointments'), appointmentData);

// Set specific record
set(ref(database, 'users/' + userId), userData);
```

#### Update Data
```javascript
update(ref(database, 'appointments/' + appointmentId), {
    status: 'approved'
});
```

#### Delete Data
```javascript
remove(ref(database, 'users/' + userId));
```

### Admin Functions

#### Load Teachers
```javascript
async function loadTeachers() {
    const usersRef = ref(database, 'users');
    const snapshot = await get(usersRef);
    
    snapshot.forEach((childSnapshot) => {
        const user = childSnapshot.val();
        if (user.role === 'teacher') {
            // Display teacher in table
        }
    });
}
```

#### Load Students
```javascript
async function loadStudents() {
    const usersRef = ref(database, 'users');
    const snapshot = await get(usersRef);
    
    snapshot.forEach((childSnapshot) => {
        const user = childSnapshot.val();
        if (user.role === 'student') {
            // Display student in table
        }
    });
}
```

#### Approve Student
```javascript
window.approveStudent = async function(studentId) {
    await update(ref(database, 'users/' + studentId), { 
        approved: true 
    });
    loadStudents();
};
```

#### Delete User
```javascript
window.deleteUser = async function(userId) {
    if (confirm('Are you sure?')) {
        await remove(ref(database, 'users/' + userId));
    }
};
```

### Teacher Functions

#### Load Appointments
```javascript
async function loadAppointments() {
    const appointmentsRef = ref(database, 'appointments');
    const snapshot = await get(appointmentsRef);
    
    snapshot.forEach((childSnapshot) => {
        const appointment = childSnapshot.val();
        if (appointment.teacherId === currentUserId) {
            // Display appointment
        }
    });
}
```

#### Approve Appointment
```javascript
window.updateAppointmentStatus = async function(appointmentId, status) {
    await update(ref(database, 'appointments/' + appointmentId), { 
        status: status 
    });
    loadAppointments();
};
```

### Student Functions

#### Load Teachers
```javascript
async function loadTeachers() {
    const usersRef = ref(database, 'users');
    const snapshot = await get(usersRef);
    
    snapshot.forEach((childSnapshot) => {
        const user = childSnapshot.val();
        if (user.role === 'teacher') {
            // Display teacher in table
        }
    });
}
```

#### Book Appointment
```javascript
document.getElementById('bookingForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const appointmentData = {
        studentId: currentUserId,
        teacherId: selectedTeacherId,
        date, timeFrom, timeEnd, message,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    await push(ref(database, 'appointments'), appointmentData);
});
```

---

## UI Components

### Dashboard Layout

**Structure**:
```html
<div class="dashboard-layout"></div>  <aside class="sidebar">
        <!-- Navigation -->
    </aside>
    <main class="main-content">
        <!-- Content sections -->
    </main>
    <button class="dark-mode-toggle-btn">
        <!-- Dark mode toggle -->
    </button>
</div>
```

**CSS Grid Layout**:
```css
.dashboard-layout {
    display: flex;
    min-height: 100vh;
}

.sidebar {
    width: 280px;
    position: fixed;
    height: 100vh;
}

.main-content {
    flex: 1;
    margin-left: 280px;
    padding: 32px 40px;
}
```

### Sidebar Component

**Elements**:
1. Logo/Header
2. Navigation Menu
3. Profile Section
4. Logout Button

**HTML Structure**:
```html
<aside class="sidebar">
    <div class="sidebar-header">
        <div class="logo">Portal Name</div>
    </div>
    
    <nav class="sidebar-nav">
        <div class="nav-section">
            <span class="nav-label">Menu</span>
            <a href="#" class="nav-item active">
                <i class="fas fa-icon"></i>
                <span>Menu Item</span>
            </a>
        </div>
    </nav>
    
    <div class="sidebar-profile">
        <div class="profile-section">
            <span class="profile-label">Profile</span>
            <div class="profile-name">User Name</div>
            <button class="btn-logout">Log out</button>
        </div>
    </div>
</aside>
```

### Table Component

**Structure**:
```html
<div class="table-container">
    <table class="appointments-table">
        <thead>
            <tr>
                <th>Column 1</th>
                <th>Column 2</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Data 1</td>
                <td>Data 2</td>
                <td>
                    <button class="btn-action">Action</button>
                </td>
            </tr>
        </tbody>
    </table>
</div>
```

**Styling**:
- White background with subtle shadow
- Hover effects on rows
- Responsive design
- Dark mode compatible

### Modal Component

**Structure**:
```html
<div id="modalId" class="modal">
    <div class="modal-content">
        <span class="close" onclick="closeModal('modalId')">&times;</span>
        <h2>Modal Title</h2>
        <form id="formId">
            <input type="text" placeholder="Field" required>
            <button type="submit" class="btn-submit">Submit</button>
        </form>
    </div>
</div>
```

**JavaScript**:
```javascript
// Show modal
window.showModal = function() {
    document.getElementById('modalId').style.display = 'block';
};

// Close modal
window.closeModal = function(modalId) {
    document.getElementById(modalId).style.display = 'none';
};
```

### Button Styles

**Primary Button**:
```html
<button class="btn-add">
    <i class="fas fa-plus"></i>
    Add Item
</button>
```

**Action Buttons**:
```html
<button class="btn-action btn-approve">
    <i class="fas fa-check"></i> Approve
</button>
<button class="btn-action btn-reject">
    <i class="fas fa-times"></i> Reject
</button>
<button class="btn-action btn-cancel">
    <i class="fas fa-ban"></i> Cancel
</button>
```

**Icon Buttons**:
```html
<button class="btn-icon">
    <i class="fas fa-eye"></i>
</button>
<button class="btn-icon">
    <i class="fas fa-trash"></i>
</button>
```

### Status Badges

**HTML**:
```html
<span class="status-badge status-open">Open</span>
<span class="status-badge status-confirm">Approved</span>
<span class="status-badge status-canceled">Canceled</span>
```

**Colors**:
- **Open/Pending**: Yellow (#fff4cc)
- **Approved/Confirm**: Green (#d4f4dd)
- **Canceled**: Red (#ffe0e0)
- **In Progress**: Green (#d4f4dd)

---

## Installation Guide

### Prerequisites

1. **Web Browser**: Chrome, Firefox, Safari, or Edge
2. **Text Editor**: VS Code, Sublime Text, or similar
3. **Firebase Account**: Free tier is sufficient
4. **Basic Knowledge**: HTML, CSS, JavaScript

### Step-by-Step Installation

#### Step 1: Download Project

```bash
# Clone repository
git clone <repository-url>
cd booking

# Or download ZIP and extract
```

#### Step 2: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: "appointment-booking"
4. Disable Google Analytics (optional)
5. Click "Create Project"

#### Step 3: Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get Started"
3. Select "Email/Password"
4. Enable "Email/Password"
5. Click "Save"

#### Step 4: Enable Realtime Database

1. In Firebase Console, go to "Realtime Database"
2. Click "Create Database"
3. Select location (closest to users)
4. Start in "Test Mode" (for development)
5. Click "Enable"

#### Step 5: Get Firebase Config

1. Go to Project Settings (gear icon)
2. Scroll to "Your apps"
3. Click web icon (</>)
4. Register app name: "Appointment System"
5. Copy the firebaseConfig object

#### Step 6: Configure Application

1. Open `js/firebase-config.js`
2. Replace with your config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT.firebaseio.com",
    projectId: "YOUR_PROJECT",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

#### Step 7: Run Application

**Option A: Simple File Open**
- Open `index.html` in browser
- May have CORS issues with modules

**Option B: Local Server (Recommended)**

Using Python:
```bash
python -m http.server 8000
```

Using Node.js:
```bash
npx http-server
```

Using VS Code:
- Install "Live Server" extension
- Right-click `index.html`
- Select "Open with Live Server"

#### Step 8: Create Admin User

1. Open application in browser
2. Go to Register page
3. Create account with your details
4. Go to Firebase Console → Realtime Database
5. Find your user under "users"
6. Edit the user:
   - Change `role` to `"admin"`
   - Change `approved` to `true`
7. Logout and login again

### Verification

Test each feature:
- ✅ Login as admin
- ✅ Add a teacher
- ✅ Register as student
- ✅ Approve student (as admin)
- ✅ Login as student
- ✅ Book appointment
- ✅ Login as teacher
- ✅ Approve appointment
- ✅ Toggle dark mode

---

## Configuration

### Firebase Configuration

**Location**: `js/firebase-config.js`

**Required Fields**:
```javascript
const firebaseConfig = {
    apiKey: "",           // API key from Firebase
    authDomain: "",       // Auth domain
    databaseURL: "",      // Realtime Database URL
    projectId: "",        // Project ID
    storageBucket: "",    // Storage bucket
    messagingSenderId: "",// Messaging sender ID
    appId: ""            // App ID
};
```

### Database Rules Configuration

**Development** (Open Access):
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**Production** (Secure):
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
        ".write": "auth != null"
      }
    }
  }
}
```

### Application Settings

**Session Storage Keys**:
- `userId`: Current user's Firebase UID
- `userRole`: User's role (admin/teacher/student)
- `userName`: User's display name
- `userEmail`: User's email address

**Local Storage Keys**:
- `darkMode`: Dark mode preference ('enabled'/'disabled')

### Customization Options

#### Change Theme Colors

Edit `css/dashboard.css`:
```css
/* Primary color (purple gradient) */
.sidebar {
    background: linear-gradient(180deg, #5b4fc7 0%, #4a3fb5 100%);
}

/* Change to blue gradient */
.sidebar {
    background: linear-gradient(180deg, #4f46e5 0%, #3730a3 100%);
}
```

#### Modify Logo

Edit sidebar header in dashboard HTML files:
```html
<div class="logo">Your Institution Name</div>
```

#### Add Custom Fields

1. Update HTML form
2. Update JavaScript to capture field
3. Update database write operation
4. Update table display

---

## Security

### Authentication Security

**Password Requirements**:
- Minimum 6 characters (Firebase default)
- Can be customized in Firebase Console

**Best Practices**:
- Use strong passwords
- Enable email verification (optional)
- Implement password reset
- Use HTTPS in production

### Database Security

**Current Rules** (Development):
- All authenticated users can read/write
- Suitable for development only

**Recommended Rules** (Production):
- Users can only read/write their own data
- Admins have full access
- Teachers can only modify their appointments
- Students can only modify their appointments

**Implementation**:
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
        ".write": "
          auth != null && (
            root.child('appointments').child($appointmentId).child('studentId').val() === auth.uid ||
            root.child('appointments').child($appointmentId).child('teacherId').val() === auth.uid ||
            root.child('users').child(auth.uid).child('role').val() === 'admin'
          )
        "
      }
    }
  }
}
```

### Client-Side Security

**Session Management**:
```javascript
// Check authentication on page load
const userId = sessionStorage.getItem('userId');
const userRole = sessionStorage.getItem('userRole');

if (!userId || userRole !== 'admin') {
    window.location.href = 'login.html';
}
```

**Input Validation**:
```javascript
// Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
    alert('Invalid email format');
    return;
}

// Validate required fields
if (!name || !email || !password) {
    alert('All fields are required');
    return;
}
```

### Data Privacy

**Sensitive Data**:
- Passwords: Hashed by Firebase Auth
- Personal info: Stored in Realtime Database
- Session data: Stored in sessionStorage (cleared on logout)

**Recommendations**:
- Don't store sensitive data in localStorage
- Clear session on logout
- Use HTTPS in production
- Implement data encryption for sensitive fields

---

## Troubleshooting

### Common Issues

#### 1. Firebase Not Initialized

**Error**: "Firebase: No Firebase App '[DEFAULT]' has been created"

**Solution**:
- Check `firebase-config.js` is loaded before other scripts
- Verify Firebase config is correct
- Ensure `initializeApp()` is called

#### 2. CORS Errors

**Error**: "Access to script blocked by CORS policy"

**Solution**:
- Use a local server instead of opening HTML directly
- Use Python: `python -m http.server`
- Use Node: `npx http-server`
- Use VS Code Live Server extension

#### 3. Authentication Fails

**Error**: "Firebase: Error (auth/invalid-email)"

**Solution**:
- Check email format is valid
- Verify Email/Password is enabled in Firebase Console
- Check Firebase config is correct

#### 4. Database Permission Denied

**Error**: "PERMISSION_DENIED: Permission denied"

**Solution**:
- Check database rules in Firebase Console
- Ensure user is authenticated
- Verify rules allow the operation

#### 5. Dark Mode Not Persisting

**Issue**: Dark mode resets on page reload

**Solution**:
- Check localStorage is enabled in browser
- Verify dark mode script is loaded
- Check for JavaScript errors in console

#### 6. User Not Redirected After Login

**Issue**: Stays on login page after successful login

**Solution**:
- Check role-based redirect logic
- Verify sessionStorage is set correctly
- Check for JavaScript errors

#### 7. Appointments Not Loading

**Issue**: Empty table or "No appointments" message

**Solution**:
- Check Firebase database has data
- Verify user ID matches in appointments
- Check console for errors
- Verify database rules allow read access

### Debugging Tips

**Enable Console Logging**:
```javascript
console.log('User ID:', userId);
console.log('Appointments:', appointments);
console.log('Database snapshot:', snapshot.val());
```

**Check Firebase Console**:
1. Go to Firebase Console
2. Check Authentication → Users
3. Check Realtime Database → Data
4. Check Usage tab for errors

**Browser Developer Tools**:
- Press F12 to open DevTools
- Check Console tab for errors
- Check Network tab for failed requests
- Check Application tab for storage data

---

## Best Practices

### Code Organization

**Modular Structure**:
- Separate concerns (HTML, CSS, JS)
- Use ES6 modules
- Keep functions small and focused
- Comment complex logic

**Naming Conventions**:
- Use camelCase for variables: `userName`, `appointmentId`
- Use PascalCase for classes: `AppointmentManager`
- Use kebab-case for CSS: `btn-primary`, `nav-item`
- Use descriptive names: `loadAppointments()` not `load()`

### Performance

**Optimize Database Queries**:
```javascript
// Bad: Load all data then filter
const snapshot = await get(ref(database, 'appointments'));
const filtered = snapshot.filter(a => a.teacherId === userId);

// Good: Query with filter
const query = ref(database, 'appointments')
    .orderByChild('teacherId')
    .equalTo(userId);
const snapshot = await get(query);
```

**Minimize DOM Manipulation**:
```javascript
// Bad: Multiple DOM updates
appointments.forEach(a => {
    tbody.appendChild(createRow(a));
});

// Good: Build HTML string, update once
let html = '';
appointments.forEach(a => {
    html += createRowHTML(a);
});
tbody.innerHTML = html;
```

### User Experience

**Loading States**:
```javascript
// Show loading indicator
showLoading();

// Load data
await loadAppointments();

// Hide loading indicator
hideLoading();
```

**Error Handling**:
```javascript
try {
    await someOperation();
    alert('Success!');
} catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
}
```

**Confirmation Dialogs**:
```javascript
if (confirm('Are you sure you want to delete this?')) {
    await deleteItem();
}
```

### Accessibility

**Semantic HTML**:
```html
<button type="button">Click Me</button>
<nav>Navigation</nav>
<main>Main Content</main>
```

**ARIA Labels**:
```html
<button aria-label="Delete appointment">
    <i class="fas fa-trash"></i>
</button>
```

**Keyboard Navigation**:
- Ensure all interactive elements are focusable
- Test with Tab key
- Provide keyboard shortcuts where appropriate

### Maintenance

**Regular Updates**:
- Update Firebase SDK versions
- Update Font Awesome icons
- Review and update dependencies
- Test on latest browsers

**Backup Strategy**:
- Export Firebase data regularly
- Keep code in version control (Git)
- Document changes in CHANGELOG
- Maintain test environment

**Monitoring**:
- Check Firebase Console for errors
- Monitor authentication failures
- Track database usage
- Review user feedback

---

## Conclusion

This documentation provides comprehensive coverage of the Student-Teacher Appointment Booking System. For additional support or questions:

- Review the README.md for quick start guide
- Check firebase-setup.md for Firebase-specific instructions
- Refer to code comments for implementation details
- Open issues on GitHub for bugs or feature requests

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Maintained By**: Development Team

---

*End of Documentation*
