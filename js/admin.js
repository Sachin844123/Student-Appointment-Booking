import { auth, database } from './firebase-config.js';
import { signOut, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { ref, get, set, update, remove, push } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

// Check authentication
const userId = sessionStorage.getItem('userId');
const userRole = sessionStorage.getItem('userRole');
const userName = sessionStorage.getItem('userName');
const userEmail = sessionStorage.getItem('userEmail');

if (!userId || userRole !== 'admin') {
    window.location.href = 'login.html';
}

// Set profile info
document.getElementById('profileName').textContent = userName || 'Admin';

// Logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
    await signOut(auth);
    sessionStorage.clear();
    window.location.href = 'login.html';
});

// Sample appointments data (replace with Firebase data)
let appointments = [
    { id: 1, firstName: 'Jane', lastName: 'Cooper', email: 'jane.cooper@example.com', dateTime: '11-Aug-2024 at 10:00 AM', status: 'open' },
    { id: 2, firstName: 'Wade', lastName: 'Warren', email: 'wade.warren@example.com', dateTime: '11-Aug-2024 at 10:00 AM', status: 'confirm' },
    { id: 3, firstName: 'Brooklyn', lastName: 'Simmons', email: 'brooklyn.simmons@example.com', dateTime: '11-Aug-2024 at 10:00 AM', status: 'confirm' },
    { id: 4, firstName: 'Cameron', lastName: 'Williamson', email: 'cameron.williamson@example.com', dateTime: '11-Aug-2024 at 10:00 AM', status: 'open' },
    { id: 5, firstName: 'Leslie', lastName: 'Alexander', email: 'leslie.alexander@example.com', dateTime: '11-Aug-2024 at 10:00 AM', status: 'in-progress' },
    { id: 6, firstName: 'Savannah', lastName: 'Nguyen', email: 'savannah.nguyen@example.com', dateTime: '11-Aug-2024 at 10:00 AM', status: 'open' },
    { id: 7, firstName: 'Darlene', lastName: 'Robertson', email: 'darlene.robertson@example.com', dateTime: '11-Aug-2024 at 10:00 AM', status: 'confirm' },
    { id: 8, firstName: 'Ronald', lastName: 'Richards', email: 'ronald.richards@example.com', dateTime: '11-Aug-2024 at 10:00 AM', status: 'open' },
    { id: 9, firstName: 'Kathryn', lastName: 'Murphy', email: 'kathryn.murphy@example.com', dateTime: '11-Aug-2024 at 10:00 AM', status: 'open' },
    { id: 10, firstName: 'Darrell', lastName: 'Steward', email: 'darrell.steward@example.com', dateTime: '11-Aug-2024 at 10:00 AM', status: 'in-progress' }
];

// Load appointments into table
function loadAppointments() {
    const tbody = document.getElementById('appointmentsTableBody');
    tbody.innerHTML = '';
    
    appointments.forEach(appointment => {
        const row = document.createElement('tr');
        
        // Determine which buttons to show based on status
        let actionButtons = '';
        if (appointment.status === 'confirm' || appointment.status === 'in-progress') {
            // Show Cancel button for approved/confirmed appointments
            actionButtons = `
                <button class="btn-action btn-cancel" onclick="cancelAppointment('${appointment.id}')">
                    <i class="fas fa-ban"></i> Cancel
                </button>
            `;
        } else {
            // Show Approve/Reject buttons for pending appointments
            actionButtons = `
                <button class="btn-action btn-approve" onclick="approveAppointment('${appointment.id}')">
                    <i class="fas fa-check"></i> Approve
                </button>
                <button class="btn-action btn-reject" onclick="rejectAppointment('${appointment.id}')">
                    <i class="fas fa-times"></i> Reject
                </button>
            `;
        }
        
        row.innerHTML = `
            <td>${appointment.firstName}</td>
            <td>${appointment.lastName}</td>
            <td>${appointment.email}</td>
            <td>${appointment.dateTime}</td>
            <td><span class="status-badge status-${appointment.status}">${appointment.status}</span></td>
            <td>
                <div class="action-buttons">
                    ${actionButtons}
                    <button class="btn-icon" onclick="viewAppointment('${appointment.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" onclick="deleteAppointment('${appointment.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Load appointments from Firebase
async function loadAppointmentsFromFirebase() {
    try {
        const appointmentsRef = ref(database, 'appointments');
        const snapshot = await get(appointmentsRef);
        
        if (snapshot.exists()) {
            appointments = [];
            const promises = [];
            
            snapshot.forEach((childSnapshot) => {
                const appointment = childSnapshot.val();
                const promise = Promise.all([
                    get(ref(database, 'users/' + appointment.studentId)),
                    get(ref(database, 'users/' + appointment.teacherId))
                ]).then(([studentSnap, teacherSnap]) => {
                    const student = studentSnap.val();
                    const teacher = teacherSnap.val();
                    
                    if (student && teacher) {
                        const nameParts = student.name.split(' ');
                        appointments.push({
                            id: childSnapshot.key,
                            firstName: nameParts[0] || student.name,
                            lastName: nameParts.slice(1).join(' ') || '',
                            email: student.email || 'N/A',
                            dateTime: `${appointment.date} at ${appointment.timeFrom}`,
                            status: appointment.status || 'pending'
                        });
                    }
                });
                promises.push(promise);
            });
            
            await Promise.all(promises);
            loadAppointments();
        } else {
            loadAppointments();
        }
    } catch (error) {
        console.error('Error loading appointments:', error);
        loadAppointments();
    }
}

// Action functions
window.approveAppointment = async function(id) {
    try {
        const appointment = appointments.find(a => a.id == id);
        if (appointment) {
            appointment.status = 'confirm';
            
            // Update in Firebase if it's a Firebase ID (string)
            if (typeof id === 'string' && id.length > 10) {
                await update(ref(database, 'appointments/' + id), { status: 'confirm' });
            }
            
            loadAppointments();
            alert(`Appointment approved for ${appointment.firstName} ${appointment.lastName}`);
        }
    } catch (error) {
        console.error('Error approving appointment:', error);
        alert('Error approving appointment: ' + error.message);
    }
};

window.rejectAppointment = async function(id) {
    if (confirm('Are you sure you want to reject this appointment?')) {
        try {
            const appointment = appointments.find(a => a.id == id);
            if (appointment) {
                appointment.status = 'canceled';
                
                // Update in Firebase if it's a Firebase ID (string)
                if (typeof id === 'string' && id.length > 10) {
                    await update(ref(database, 'appointments/' + id), { status: 'canceled' });
                }
                
                loadAppointments();
                alert(`Appointment rejected for ${appointment.firstName} ${appointment.lastName}`);
            }
        } catch (error) {
            console.error('Error rejecting appointment:', error);
            alert('Error rejecting appointment: ' + error.message);
        }
    }
};

window.viewAppointment = function(id) {
    const appointment = appointments.find(a => a.id == id);
    if (appointment) {
        alert(`Viewing appointment:\n${appointment.firstName} ${appointment.lastName}\nEmail: ${appointment.email}\n${appointment.dateTime}\nStatus: ${appointment.status}`);
    }
};

window.cancelAppointment = async function(id) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
        try {
            const appointment = appointments.find(a => a.id == id);
            if (appointment) {
                appointment.status = 'canceled';
                
                // Update in Firebase if it's a Firebase ID (string)
                if (typeof id === 'string' && id.length > 10) {
                    await update(ref(database, 'appointments/' + id), { status: 'canceled' });
                }
                
                loadAppointments();
                alert(`Appointment canceled for ${appointment.firstName} ${appointment.lastName}`);
            }
        } catch (error) {
            console.error('Error canceling appointment:', error);
            alert('Error canceling appointment: ' + error.message);
        }
    }
};

window.deleteAppointment = async function(id) {
    if (confirm('Are you sure you want to delete this appointment?')) {
        try {
            // Remove from local array
            appointments = appointments.filter(a => a.id != id);
            
            // Delete from Firebase if it's a Firebase ID (string)
            if (typeof id === 'string' && id.length > 10) {
                await remove(ref(database, 'appointments/' + id));
            }
            
            loadAppointments();
            alert('Appointment deleted successfully!');
        } catch (error) {
            console.error('Error deleting appointment:', error);
            alert('Error deleting appointment: ' + error.message);
        }
    }
};

// Show add appointment modal
window.showAddAppointmentModal = function() {
    document.getElementById('addAppointmentModal').style.display = 'block';
};

// Show add teacher modal
window.showAddTeacherModal = function() {
    document.getElementById('addTeacherModal').style.display = 'block';
};

// Show add student modal
window.showAddStudentModal = function() {
    document.getElementById('addStudentModal').style.display = 'block';
};

// Close modal function
window.closeModal = function(modalId) {
    document.getElementById(modalId).style.display = 'none';
};

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// Add appointment form
document.getElementById('addAppointmentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('studentEmail').value;
    const dateTime = document.getElementById('appointmentDateTime').value;
    const status = document.getElementById('appointmentStatus').value;
    
    // Format datetime
    const date = new Date(dateTime);
    const formattedDateTime = date.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
    }) + ' at ' + date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
    
    const newAppointment = {
        id: appointments.length + 1,
        firstName,
        lastName,
        email,
        dateTime: formattedDateTime,
        status
    };
    
    appointments.push(newAppointment);
    loadAppointments();
    
    document.getElementById('addAppointmentModal').style.display = 'none';
    document.getElementById('addAppointmentForm').reset();
    alert('Appointment added successfully!');
});

// Add teacher form
document.getElementById('addTeacherForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('teacherName').value;
    const email = document.getElementById('teacherEmail').value;
    const password = document.getElementById('teacherPassword').value;
    const department = document.getElementById('teacherDepartment').value;
    const subject = document.getElementById('teacherSubject').value;
    
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await set(ref(database, 'users/' + user.uid), {
            name: name,
            email: email,
            role: 'teacher',
            department: department,
            subject: subject,
            approved: true
        });
        
        alert('Teacher added successfully!');
        document.getElementById('addTeacherModal').style.display = 'none';
        document.getElementById('addTeacherForm').reset();
        loadTeachers();
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

// Add student form
document.getElementById('addStudentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('studentName').value;
    const email = document.getElementById('studentEmail').value;
    const password = document.getElementById('studentPassword').value;
    const department = document.getElementById('studentDepartment').value;
    const approved = document.getElementById('studentApproved').value === 'true';
    
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await set(ref(database, 'users/' + user.uid), {
            name: name,
            email: email,
            role: 'student',
            department: department,
            approved: approved
        });
        
        alert('Student added successfully!');
        document.getElementById('addStudentModal').style.display = 'none';
        document.getElementById('addStudentForm').reset();
        loadStudents();
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

// Section navigation
window.showSection = function(section) {
    // Hide all sections
    document.getElementById('appointmentsSection').style.display = 'none';
    document.getElementById('teachersSection').style.display = 'none';
    document.getElementById('studentsSection').style.display = 'none';
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    if (section === 'appointments') {
        document.getElementById('appointmentsSection').style.display = 'block';
        document.querySelector('a[href="#appointments"]').classList.add('active');
    } else if (section === 'teachers') {
        document.getElementById('teachersSection').style.display = 'block';
        document.querySelector('a[href="#teachers"]').classList.add('active');
        loadTeachers();
    } else if (section === 'students') {
        document.getElementById('studentsSection').style.display = 'block';
        document.querySelector('a[href="#students"]').classList.add('active');
        loadStudents();
    }
};

// Load teachers
async function loadTeachers() {
    try {
        const usersRef = ref(database, 'users');
        const snapshot = await get(usersRef);
        
        const tbody = document.getElementById('teachersTableBody');
        tbody.innerHTML = '';
        
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const user = childSnapshot.val();
                const userId = childSnapshot.key;
                
                if (user.role === 'teacher') {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.department}</td>
                        <td>${user.subject || 'N/A'}</td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn-icon" onclick="viewTeacher('${userId}')">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn-icon" onclick="deleteTeacher('${userId}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    `;
                    tbody.appendChild(row);
                }
            });
        }
        
        if (tbody.children.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px;">No teachers found</td></tr>';
        }
    } catch (error) {
        console.error('Error loading teachers:', error);
    }
}

// Load students
async function loadStudents() {
    try {
        const usersRef = ref(database, 'users');
        const snapshot = await get(usersRef);
        
        const tbody = document.getElementById('studentsTableBody');
        tbody.innerHTML = '';
        
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const user = childSnapshot.val();
                const userId = childSnapshot.key;
                
                if (user.role === 'student') {
                    const row = document.createElement('tr');
                    const statusClass = user.approved ? 'status-confirm' : 'status-open';
                    const statusText = user.approved ? 'Approved' : 'Pending';
                    
                    row.innerHTML = `
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.department}</td>
                        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                        <td>
                            <div class="action-buttons">
                                ${!user.approved ? `
                                    <button class="btn-action btn-approve" onclick="approveStudent('${userId}')">
                                        <i class="fas fa-check"></i> Approve
                                    </button>
                                ` : ''}
                                <button class="btn-icon" onclick="viewStudent('${userId}')">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn-icon" onclick="deleteStudent('${userId}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    `;
                    tbody.appendChild(row);
                }
            });
        }
        
        if (tbody.children.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px;">No students found</td></tr>';
        }
    } catch (error) {
        console.error('Error loading students:', error);
    }
}

// Teacher actions
window.viewTeacher = async function(teacherId) {
    try {
        const teacherSnapshot = await get(ref(database, 'users/' + teacherId));
        const teacher = teacherSnapshot.val();
        
        if (teacher) {
            alert(`Teacher Details:\nName: ${teacher.name}\nEmail: ${teacher.email}\nDepartment: ${teacher.department}\nSubject: ${teacher.subject || 'N/A'}`);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
};

window.deleteTeacher = async function(teacherId) {
    if (confirm('Are you sure you want to delete this teacher?')) {
        try {
            await remove(ref(database, 'users/' + teacherId));
            alert('Teacher deleted successfully!');
            loadTeachers();
        } catch (error) {
            alert('Error deleting teacher: ' + error.message);
        }
    }
};

// Student actions
window.approveStudent = async function(studentId) {
    try {
        await update(ref(database, 'users/' + studentId), { approved: true });
        alert('Student approved successfully!');
        loadStudents();
    } catch (error) {
        alert('Error approving student: ' + error.message);
    }
};

window.viewStudent = async function(studentId) {
    try {
        const studentSnapshot = await get(ref(database, 'users/' + studentId));
        const student = studentSnapshot.val();
        
        if (student) {
            alert(`Student Details:\nName: ${student.name}\nEmail: ${student.email}\nDepartment: ${student.department}\nStatus: ${student.approved ? 'Approved' : 'Pending'}`);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
};

window.deleteStudent = async function(studentId) {
    if (confirm('Are you sure you want to delete this student?')) {
        try {
            await remove(ref(database, 'users/' + studentId));
            alert('Student deleted successfully!');
            loadStudents();
        } catch (error) {
            alert('Error deleting student: ' + error.message);
        }
    }
};

// Search functionality
document.getElementById('searchAppointments').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#appointmentsTableBody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

document.getElementById('searchTeachers').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#teachersTableBody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

document.getElementById('searchStudents').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#studentsTableBody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

// Initialize
loadAppointmentsFromFirebase();


// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

// Check for saved dark mode preference
const darkMode = localStorage.getItem('darkMode');
if (darkMode === 'enabled') {
    body.classList.add('dark-mode');
}

darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    // Save preference
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.setItem('darkMode', 'disabled');
    }
});
