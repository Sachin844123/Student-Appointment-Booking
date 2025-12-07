import { auth, database } from './firebase-config.js';
import { signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { ref, get, update } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

// Check authentication
const userId = sessionStorage.getItem('userId');
const userRole = sessionStorage.getItem('userRole');
const userName = sessionStorage.getItem('userName');

if (!userId || userRole !== 'teacher') {
    window.location.href = 'login.html';
}

document.getElementById('profileName').textContent = userName || 'Teacher';

// Logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
    await signOut(auth);
    sessionStorage.clear();
    window.location.href = 'login.html';
});

// Load appointments
async function loadAppointments() {
    const appointmentsRef = ref(database, 'appointments');
    const snapshot = await get(appointmentsRef);
    
    const pendingTbody = document.getElementById('pendingTableBody');
    const allTbody = document.getElementById('allTableBody');
    pendingTbody.innerHTML = '';
    allTbody.innerHTML = '';
    
    if (snapshot.exists()) {
        const pendingAppointments = [];
        const allAppointments = [];
        
        snapshot.forEach((childSnapshot) => {
            const appointment = childSnapshot.val();
            if (appointment.teacherId === userId) {
                const appointmentData = { id: childSnapshot.key, ...appointment };
                if (appointment.status === 'pending') {
                    pendingAppointments.push(appointmentData);
                }
                allAppointments.push(appointmentData);
            }
        });
        
        // Display pending appointments
        if (pendingAppointments.length > 0) {
            for (const appointment of pendingAppointments) {
                const studentSnapshot = await get(ref(database, 'users/' + appointment.studentId));
                const student = studentSnapshot.val();
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${student ? student.name : 'Unknown'}</td>
                    <td>${appointment.date}</td>
                    <td>${appointment.timeFrom} - ${appointment.timeEnd}</td>
                    <td>${appointment.message}</td>
                    <td><span class="status-badge status-${appointment.status}">${appointment.status}</span></td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-action btn-approve" onclick="updateAppointmentStatus('${appointment.id}', 'approved')">
                                <i class="fas fa-check"></i> Approve
                            </button>
                            <button class="btn-action btn-reject" onclick="updateAppointmentStatus('${appointment.id}', 'canceled')">
                                <i class="fas fa-times"></i> Decline
                            </button>
                        </div>
                    </td>
                `;
                pendingTbody.appendChild(row);
            }
        } else {
            pendingTbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px;">No pending appointments</td></tr>';
        }
        
        // Display all appointments
        if (allAppointments.length > 0) {
            for (const appointment of allAppointments) {
                const studentSnapshot = await get(ref(database, 'users/' + appointment.studentId));
                const student = studentSnapshot.val();
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${student ? student.name : 'Unknown'}</td>
                    <td>${appointment.date}</td>
                    <td>${appointment.timeFrom} - ${appointment.timeEnd}</td>
                    <td>${appointment.message}</td>
                    <td><span class="status-badge status-${appointment.status}">${appointment.status}</span></td>
                    <td>
                        <button class="btn-icon" onclick="viewAppointment('${appointment.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                `;
                allTbody.appendChild(row);
            }
        } else {
            allTbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px;">No appointments</td></tr>';
        }
    } else {
        pendingTbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px;">No pending appointments</td></tr>';
        allTbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px;">No appointments</td></tr>';
    }
}

// Update appointment status
window.updateAppointmentStatus = async function(appointmentId, status) {
    try {
        await update(ref(database, 'appointments/' + appointmentId), { status: status });
        alert(`Appointment ${status}!`);
        loadAppointments();
    } catch (error) {
        alert('Error: ' + error.message);
    }
};

// View appointment details
window.viewAppointment = async function(appointmentId) {
    try {
        const appointmentSnapshot = await get(ref(database, 'appointments/' + appointmentId));
        const appointment = appointmentSnapshot.val();
        
        if (appointment) {
            const studentSnapshot = await get(ref(database, 'users/' + appointment.studentId));
            const student = studentSnapshot.val();
            
            alert(`Appointment Details:\nStudent: ${student.name}\nDate: ${appointment.date}\nTime: ${appointment.timeFrom} - ${appointment.timeEnd}\nMessage: ${appointment.message}\nStatus: ${appointment.status}`);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
};

// Search functionality
document.getElementById('searchPending').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#pendingTableBody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

document.getElementById('searchAll').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#allTableBody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

// Initialize
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
