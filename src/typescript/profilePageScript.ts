// Profile Page Script

interface UserProfile {
    email: string;
    userId: string;
}

interface Appointment {
    id: number;
    date: string;
    time: string;
    registrationPlate: string;
    vehicleType: string;
    plantName: string;
    registrationKey: string;
    checkedIn: boolean;
    createdAt: string;
}

async function loadProfile(): Promise<void> {
    const userEmail = sessionStorage.getItem('userEmail') || localStorage.getItem('userEmail');
    const userId = sessionStorage.getItem('userId') || localStorage.getItem('userId');

    const profileContent = document.getElementById('profileContent')!;

    if (!userEmail || !userId) {
        // User not logged in
        profileContent.innerHTML = `
            <div class="not-logged-in">
                <h2>You are not logged in</h2>
                <p style="color: #666; margin-bottom: 30px;">Please log in to view your profile.</p>
                <div class="button-group">
                    <a href="LogIn.html" class="btn btn-primary">Log In</a>
                    <a href="Registration.html" class="btn btn-secondary">Register</a>
                </div>
            </div>
        `;
        return;
    }

    // Load user appointments
    let appointmentsHTML = '';
    try {
        const response = await fetch(`/api/appointments?userId=${userId}`);
        const data = await response.json();
        
        if (data.success && data.appointments && data.appointments.length > 0) {
            appointmentsHTML = `
                <div class="profile-section">
                    <h2>My Appointments</h2>
                    <div class="appointments-list">
            `;
            
            data.appointments.forEach((apt: Appointment) => {
                const vehicleLabel = apt.vehicleType.charAt(0).toUpperCase() + apt.vehicleType.slice(1);
                const statusClass = apt.checkedIn ? 'checked-in' : 'pending';
                const statusLabel = apt.checkedIn ? 'Checked In' : 'Pending';
                
                appointmentsHTML += `
                    <div class="appointment-card">
                        <div class="appointment-header">
                            <h3>${apt.plantName}</h3>
                            <span class="status-badge ${statusClass}">${statusLabel}</span>
                        </div>
                        <div class="appointment-details">
                            <div><strong>Date:</strong> ${formatDate(apt.date)}</div>
                            <div><strong>Time:</strong> ${apt.time}</div>
                            <div><strong>Vehicle:</strong> ${apt.registrationPlate} (${vehicleLabel})</div>
                            <div><strong>Registration Key:</strong> <code>${apt.registrationKey}</code></div>
                        </div>
                        <div class="qr-code-container">
                            <img src="/api/bookings-qr/${apt.registrationKey}.png" alt="QR Code" class="qr-code-img">
                            <p class="qr-code-label">Scan at recycling centre</p>
                        </div>
                    </div>
                `;
            });
            
            appointmentsHTML += `
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading appointments:', error);
    }

    // User is logged in
    profileContent.innerHTML = `
        <div class="profile-section">
            <h2>Account Information</h2>
            <div class="profile-info">
                <div class="profile-label">Email:</div>
                <div class="profile-value">${userEmail}</div>
                <div class="profile-label">User ID:</div>
                <div class="profile-value">${userId}</div>
            </div>
        </div>

        ${appointmentsHTML}

        <div class="button-group">
            <a href="mainPage.html" class="btn btn-secondary">Back to Home</a>
            <a href="bookAppointmentPage.html" class="btn btn-primary">Book Appointment</a>
            <button onclick="logout()" class="btn btn-danger">Log Out</button>
        </div>
    `;
}

function formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
}

function logout(): void {
    // Clear all stored user data
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('isAdmin');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('isAdmin');
    
    // Redirect to login page
    window.location.href = 'LogIn.html';
}

// Make logout function globally available
(window as any).logout = logout;

// Load profile when page loads
window.addEventListener('DOMContentLoaded', loadProfile);

export {};
