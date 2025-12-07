import { auth, database } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { ref, set, get } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

// Register Form
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    // Handle role change to show/hide subject field
    const roleSelect = document.getElementById('registerRole');
    const subjectGroup = document.getElementById('subjectGroup');
    const subjectInput = document.getElementById('registerSubject');
    
    roleSelect.addEventListener('change', () => {
        if (roleSelect.value === 'student') {
            subjectGroup.style.display = 'none';
            subjectInput.removeAttribute('required');
        } else if (roleSelect.value === 'teacher') {
            subjectGroup.style.display = 'block';
            subjectInput.setAttribute('required', 'required');
        } else {
            subjectGroup.style.display = 'none';
            subjectInput.removeAttribute('required');
        }
    });
    
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const role = document.getElementById('registerRole').value;
        const department = document.getElementById('registerDepartment').value;
        const subject = document.getElementById('registerSubject').value;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Save user data to database
            const userData = {
                name: name,
                email: email,
                role: role,
                department: department,
                approved: role === 'teacher' ? true : false // Students need admin approval, teachers auto-approved
            };
            
            // Only add subject for teachers
            if (role === 'teacher' && subject) {
                userData.subject = subject;
            }

            await set(ref(database, 'users/' + user.uid), userData);

            alert('Registration successful! ' + (role === 'student' ? 'Please wait for admin approval.' : 'You can now login.'));
            window.location.href = 'login.html';
        } catch (error) {
            alert('Error: ' + error.message);
        }
    });
}

// Login Form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const role = document.getElementById('loginRole').value;

        // Validate inputs
        if (!email || !password || !role) {
            alert('Please fill in all fields!');
            return;
        }

        try {
            console.log('Attempting login...');
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('User authenticated:', user.uid);

            // Get user data
            const userSnapshot = await get(ref(database, 'users/' + user.uid));
            const userData = userSnapshot.val();
            console.log('User data:', userData);

            if (!userData) {
                alert('User data not found! Please contact administrator.');
                await auth.signOut();
                return;
            }

            if (userData.role !== role) {
                alert('Invalid role selected! Please select the correct role.');
                await auth.signOut();
                return;
            }

            if (userData.role === 'student' && !userData.approved) {
                alert('Your account is pending admin approval!');
                await auth.signOut();
                return;
            }

            // Store user info in session
            sessionStorage.setItem('userId', user.uid);
            sessionStorage.setItem('userRole', userData.role);
            sessionStorage.setItem('userName', userData.name);
            console.log('Session data stored, redirecting...');

            // Redirect based on role
            if (role === 'student') {
                console.log('Redirecting to student dashboard');
                window.location.href = 'student-dashboard.html';
            } else if (role === 'teacher') {
                console.log('Redirecting to teacher dashboard');
                window.location.href = 'teacher-dashboard.html';
            } else if (role === 'admin') {
                console.log('Redirecting to admin dashboard');
                window.location.href = 'admin-dashboard.html';
            }
        } catch (error) {
            console.error('Login error:', error);
            if (error.code === 'auth/user-not-found') {
                alert('No account found with this email!');
            } else if (error.code === 'auth/wrong-password') {
                alert('Incorrect password!');
            } else if (error.code === 'auth/invalid-email') {
                alert('Invalid email format!');
            } else if (error.code === 'auth/too-many-requests') {
                alert('Too many failed login attempts. Please try again later.');
            } else {
                alert('Login error: ' + error.message);
            }
        }
    });
}
