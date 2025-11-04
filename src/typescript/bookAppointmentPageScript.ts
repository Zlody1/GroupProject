// Book Appointment page script

// Set minimum date to today
const today = new Date().toISOString().split('T')[0];
(document.getElementById('date') as HTMLInputElement).setAttribute('min', today);

document.getElementById('appointmentForm')!.addEventListener('submit', async function(e: Event) {
    e.preventDefault();

    // Clear previous errors
    document.querySelectorAll('.error').forEach(el => el.classList.remove('show'));

    // Get form data
    const date = (document.getElementById('date') as HTMLInputElement).value;
    const time = (document.getElementById('time') as HTMLInputElement).value;
    const registrationPlate = (document.getElementById('registrationPlate') as HTMLInputElement).value.toUpperCase().trim();
    const vehicleType = (document.querySelector('input[name="vehicleType"]:checked') as HTMLInputElement).value;

    // Basic validation
    if (!date || !time || !registrationPlate) {
        const generalError = document.getElementById('generalError')!;
        generalError.textContent = 'Please fill in all fields';
        generalError.classList.add('show');
        return;
    }

    // Prepare data
    const appointmentData = {
        date: date,
        time: time,
        registrationPlate: registrationPlate,
        vehicleType: vehicleType
    };

    // Show loading state
    const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;
    const loading = document.getElementById('loading')!;
    submitBtn.disabled = true;
    loading.classList.add('show');

    try {
        // Send request to backend
        const response = await fetch('/api/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(appointmentData)
        });

        const result = await response.json();

        if (response.ok) {
            // Store registration key and navigate to ViewRegistration page
            sessionStorage.setItem('registrationKey', result.registrationKey);
            sessionStorage.setItem('appointmentData', JSON.stringify({
                date: date,
                time: time,
                registrationPlate: registrationPlate,
                vehicleType: vehicleType
            }));
            
            // Navigate to ViewRegistration page
            window.location.href = 'ViewRegistration.html';
        } else {
            // Show error message
            const generalError = document.getElementById('generalError')!;
            generalError.textContent = result.error || 'Failed to book appointment';
            generalError.classList.add('show');
            submitBtn.disabled = false;
            loading.classList.remove('show');
        }
    } catch (error) {
        console.error('Error:', error);
        const generalError = document.getElementById('generalError')!;
        generalError.textContent = 'Network error. Please ensure the backend server is running.';
        generalError.classList.add('show');
        submitBtn.disabled = false;
        loading.classList.remove('show');
    }
});

// Auto-format registration plate
document.getElementById('registrationPlate')!.addEventListener('input', function(e: Event) {
    const target = e.target as HTMLInputElement;
    target.value = target.value.toUpperCase();
});

// Load and display all appointments
async function loadAppointments(): Promise<void> {
    const loadingDiv = document.getElementById('appointmentsLoading')!;
    const container = document.getElementById('appointmentsContainer')!;
    
    try {
        const response = await fetch('/api/appointments');
        const data = await response.json();
        
        loadingDiv.style.display = 'none';
        
        if (data.success && data.appointments && data.appointments.length > 0) {
            // Create table
            let tableHTML = `
                <table class="appointments-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Registration</th>
                            <th>Type</th>
                            <th>Key</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            data.appointments.forEach((appointment: any) => {
                const vehicleClass = appointment.vehicleType === 'van' ? 'vehicle-van' : 'vehicle-regular';
                const vehicleLabel = appointment.vehicleType.charAt(0).toUpperCase() + appointment.vehicleType.slice(1);
                
                tableHTML += `
                    <tr>
                        <td>${formatDate(appointment.date)}</td>
                        <td>${appointment.time}</td>
                        <td><strong>${appointment.registrationPlate}</strong></td>
                        <td><span class="vehicle-badge ${vehicleClass}">${vehicleLabel}</span></td>
                        <td><code>${appointment.registrationKey}</code></td>
                    </tr>
                `;
            });
            
            tableHTML += `
                    </tbody>
                </table>
            `;
            
            container.innerHTML = tableHTML;
        } else {
            container.innerHTML = '<div class="no-appointments">No appointments found. Book your first appointment above!</div>';
        }
    } catch (error) {
        console.error('Error loading appointments:', error);
        loadingDiv.style.display = 'none';
        container.innerHTML = '<div class="no-appointments">Error loading appointments. Please ensure the backend server is running.</div>';
    }
}

function formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
}

// Load appointments when page loads
window.addEventListener('DOMContentLoaded', loadAppointments);

export {};
