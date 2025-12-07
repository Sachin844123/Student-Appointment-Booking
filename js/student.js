import { auth, database } from './firebase-config.js';
import { signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { ref, get, push, remove } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

// Check authentication
const userId = sessionStorage.getItem('userId');
const userRole = sessionStorage.getItem('userRole');
const userName = sessionStorage.getItem('userName');

if (!userId || userRole !== 'student') {
    window.location.href = 'login.html';
}

document.getElementById('profileName').textContent = userName || 'Student';

// Logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
    await signOut(auth);
    sessionStorage.clear();
    window.location.href = 'login.html';
});

// Load all teachers
async function loadTeachers() {
    const teachersRef = ref(database, 'users');
    const snapshot = await get(teachersRef);
    
    const tbody = document.getElementById('teacherTableBody');
    tbody.innerHTML = '';
    
    if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
            const teacher = childSnapshot.val();
            const teacherId = childSnapshot.key;
            
            // Filter only teachers
            if (teacher.role === 'teacher') {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${teacher.name}</td>
                    <td>${teacher.department}</td>
                    <td>${teacher.subject || 'N/A'}</td>
                    <td>${teacher.email}</td>
                    <td>
                        <button class="btn-action btn-book" onclick="openBookingModal('${teacherId}', '${teacher.name}')">
                            <i class="fas fa-calendar-plus"></i> Book
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            }
        });
    }
    
    if (tbody.children.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px;">No teachers available</td></tr>';
    }
}

// Search teachers
document.getElementById('searchTeacher').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#teacherTableBody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

// Open booking modal
window.openBookingModal = function(teacherId, teacherName) {
    document.getElementById('selectedTeacherId').value = teacherId;
    document.getElementById('selectedTeacherName').textContent = `Teacher: ${teacherName}`;
    document.getElementById('bookingModal').style.display = 'block';
};

// Close modal
window.closeBookingModal = function() {
    document.getElementById('bookingModal').style.display = 'none';
};

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// Book appointment
document.getElementById('bookingForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const teacherId = document.getElementById('selectedTeacherId').value;
    const date = document.getElementById('appointmentDate').value;
    const timeFrom = document.getElementById('appointmentTimeFrom').value;
    const timeEnd = document.getElementById('appointmentTimeEnd').value;
    const message = document.getElementById('appointmentMessage').value;
    
    const appointmentData = {
        studentId: userId,
        teacherId: teacherId,
        date: date,
        timeFrom: timeFrom,
        timeEnd: timeEnd,
        message: message,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    try {
        await push(ref(database, 'appointments'), appointmentData);
        alert('Appointment booked successfully!');
        document.getElementById('bookingModal').style.display = 'none';
        document.getElementById('bookingForm').reset();
        loadAppointments();
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

// Load student appointments
async function loadAppointments() {
    const appointmentsRef = ref(database, 'appointments');
    const snapshot = await get(appointmentsRef);
    
    const tbody = document.getElementById('appointmentTableBody');
    tbody.innerHTML = '';
    
    if (snapshot.exists()) {
        const appointments = [];
        snapshot.forEach((childSnapshot) => {
            const appointment = childSnapshot.val();
            if (appointment.studentId === userId) {
                appointments.push({ id: childSnapshot.key, ...appointment });
            }
        });
        
        if (appointments.length > 0) {
            for (const appointment of appointments) {
                const teacherSnapshot = await get(ref(database, 'users/' + appointment.teacherId));
                const teacher = teacherSnapshot.val();
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${teacher ? teacher.name : 'Unknown'}</td>
                    <td>${appointment.date}</td>
                    <td>${appointment.timeFrom} - ${appointment.timeEnd}</td>
                    <td>${appointment.message}</td>
                    <td><span class="status-badge status-${appointment.status}">${appointment.status}</span></td>
                    <td>
                        <button class="btn-icon" onclick="deleteAppointment('${appointment.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            }
        } else {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px;">No appointments yet</td></tr>';
        }
    } else {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px;">No appointments yet</td></tr>';
    }
}

// Delete appointment
window.deleteAppointment = async function(appointmentId) {
    if (confirm('Are you sure you want to delete this appointment?')) {
        try {
            await remove(ref(database, 'appointments/' + appointmentId));
            alert('Appointment deleted successfully!');
            loadAppointments();
        } catch (error) {
            alert('Error deleting appointment: ' + error.message);
        }
    }
};

// Initialize
loadTeachers();
loadAppointments();


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
