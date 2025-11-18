// Main Page Script

// Check if user is admin/staff and hide book appointment button
const isAdmin = sessionStorage.getItem('isAdmin') === 'true' || localStorage.getItem('isAdmin') === 'true';
if (isAdmin) {
    const bookAppointmentBtn = document.querySelector('a[href="bookAppointmentPage.html"]');
    if (bookAppointmentBtn) {
        (bookAppointmentBtn as HTMLElement).style.display = 'none';
    }
}

// Handle profile button click
document.getElementById('profileBtn')?.addEventListener('click', function(e: Event) {
    e.preventDefault();
    window.location.href = 'profilePage.html';
});

export {};
