// View Registration page script

// Load registration data from session storage
window.addEventListener('DOMContentLoaded', function() {
    const registrationKey = sessionStorage.getItem('registrationKey');
    const appointmentData = sessionStorage.getItem('appointmentData');

    if (!registrationKey || !appointmentData) {
        // Redirect to booking page if no data found
        window.location.href = 'bookAppointmentPage.html';
        return;
    }

    // Display registration key
    document.getElementById('registrationKey')!.textContent = registrationKey;

    // Load QR code image from backend
    (document.getElementById('qrCode') as HTMLImageElement).src = `/api/bookings-qr/${registrationKey}.png`;

    // Parse and display appointment data
    const data = JSON.parse(appointmentData);
    document.getElementById('appointmentDate')!.textContent = formatDate(data.date);
    document.getElementById('appointmentTime')!.textContent = data.time;
    document.getElementById('registrationPlate')!.textContent = data.registrationPlate;
    document.getElementById('vehicleType')!.textContent = capitalizeFirstLetter(data.vehicleType);
});

function formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
}

function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function copyRegistrationKey(): void {
    const keyText = document.getElementById('registrationKey')!.textContent!;
    navigator.clipboard.writeText(keyText).then(function() {
        alert('Registration key copied to clipboard!');
    }).catch(function(err) {
        console.error('Failed to copy: ', err);
    });
}

function goToHome(): void {
    // Clear session storage
    sessionStorage.removeItem('registrationKey');
    sessionStorage.removeItem('appointmentData');
    
    // Navigate to main page
    window.location.href = 'mainPage.html';
}

// Make functions available globally
(window as any).copyRegistrationKey = copyRegistrationKey;
(window as any).goToHome = goToHome;

export {};
