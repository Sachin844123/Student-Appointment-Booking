// Home page quick contact form
const quickContactForm = document.getElementById('quickContactForm');
if (quickContactForm) {
    quickContactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your interest! Please register or login to book an appointment.');
        window.location.href = 'pages/register.html';
    });
}
