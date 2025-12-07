// Calendar functionality
let currentDate = new Date();
let selectedDate = null;

const monthNames = [
    'JANUARY',
    'FEBRUARY',
    'MARCH',
    'APRIL',
    'MAY',
    'JUNE',
    'JULY',
    'AUGUST',
    'SEPTEMBER',
    'OCTOBER',
    'NOVEMBER',
    'DECEMBER',
];

function renderCalendar() {
    const calendarDays = document.getElementById('calendarDays');
    const currentMonth = document.getElementById('currentMonth');

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    currentMonth.textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    calendarDays.innerHTML = '';

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day disabled';
        calendarDays.appendChild(emptyDay);
    }

    // Add days of the month
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;

        // Check if it's today
        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            dayElement.classList.add('today');
        }

        // Check if it's the selected date
        if (
            selectedDate &&
            day === selectedDate.getDate() &&
            month === selectedDate.getMonth() &&
            year === selectedDate.getFullYear()
        ) {
            dayElement.classList.add('selected');
        }

        dayElement.addEventListener('click', () => {
            selectedDate = new Date(year, month, day);
            renderCalendar();
        });

        calendarDays.appendChild(dayElement);
    }
}

// Navigation buttons
document.getElementById('prevMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

document.getElementById('nextMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

// Time picker functionality
const hoursInput = document.getElementById('hours');
const minutesInput = document.getElementById('minutes');
const timeArrows = document.querySelectorAll('.time-arrow');

timeArrows.forEach((arrow) => {
    arrow.addEventListener('click', (e) => {
        e.preventDefault();
        const isUp = arrow.classList.contains('up');
        const currentHours = parseInt(hoursInput.value);
        const currentMinutes = parseInt(minutesInput.value);

        if (isUp) {
            if (currentMinutes < 59) {
                minutesInput.value = String(currentMinutes + 1).padStart(2, '0');
            } else {
                minutesInput.value = '00';
                if (currentHours < 23) {
                    hoursInput.value = String(currentHours + 1).padStart(2, '0');
                } else {
                    hoursInput.value = '00';
                }
            }
        } else {
            if (currentMinutes > 0) {
                minutesInput.value = String(currentMinutes - 1).padStart(2, '0');
            } else {
                minutesInput.value = '59';
                if (currentHours > 0) {
                    hoursInput.value = String(currentHours - 1).padStart(2, '0');
                } else {
                    hoursInput.value = '23';
                }
            }
        }
    });
});

// Format inputs
hoursInput.addEventListener('blur', () => {
    let value = parseInt(hoursInput.value);
    if (isNaN(value) || value < 0) value = 0;
    if (value > 23) value = 23;
    hoursInput.value = String(value).padStart(2, '0');
});

minutesInput.addEventListener('blur', () => {
    let value = parseInt(minutesInput.value);
    if (isNaN(value) || value < 0) value = 0;
    if (value > 59) value = 59;
    minutesInput.value = String(value).padStart(2, '0');
});

// Initialize calendar
renderCalendar();
