// Book Appointment page script

// =============================================================================
// RECYCLING PLANT DATA - UPDATE THIS SECTION WITH ACTUAL ADDRESSES
// =============================================================================
// Add your recycling plant locations here. Each entry should have:
// - name: Name of the recycling plant
// - address: Full address
// - lat: Latitude coordinate
// - lng: Longitude coordinate
// - hours: Operating hours
// - phone: Contact phone number (optional)

const recyclingPlants = [
    {
        name: "Dawsholm Recycling Centre",
        address: "Dalsholm Road, Glasgow, G20 0SP",
        lat: 55.8903,
        lng: -4.3044,
        hours: "Mon-Sun: 8:00 AM - 4:00 PM",
        phone: "0141 287 1059"
    },
    {
        name: "Polmadie Recycling Centre",
        address: "18 Aikenhead Road, Glasgow, G42 8NN",
        lat: 55.8359,
        lng: -4.2441,
        hours: "Mon-Sun: 8:00 AM - 4:00 PM",
        phone: "0141 287 0368"
    },
    {
        name: "Shieldhall Recycling Centre",
        address: "Shieldhall Road, Glasgow, G51 4SL",
        lat: 55.8624,
        lng: -4.3441,
        hours: "Mon-Sun: 8:00 AM - 4:00 PM",
        phone: "0141 287 0911"
    },
    {
        name: "Easter Queenslie Household Waste Recycling Centre",
        address: "240 Queenslie Industrial Estate, Glasgow, G33 4UL",
        lat: 55.8549,
        lng: -4.1616,
        hours: "Mon-Sun: 8:00 AM - 4:00 PM",
        phone: "0141 287 5555"
    },
    {
        name: "Clyde Gateway East Recycling Centre",
        address: "Shawfield Drive, Glasgow, G73 1NN",
        lat: 55.8263,
        lng: -4.2092,
        hours: "Mon-Sun: 8:00 AM - 4:00 PM",
        phone: "0141 287 0912"
    },
    {
        name: "Biffa East Kilbride Recycling Centre",
        address: "Strathaven Road, East Kilbride, G75 0QZ",
        lat: 55.7639,
        lng: -4.2213,
        hours: "Mon-Sat: 8:00 AM - 6:00 PM, Sun: 9:00 AM - 5:00 PM",
        phone: "01355 806060"
    }
    // Add more recycling plants here as needed
];
// =============================================================================
// END OF RECYCLING PLANT DATA
// =============================================================================

// Initialize map
let mapInstance: any = null; // Store map instance globally

function initializeMap(): void {
    // Center the map on Glasgow
    const glasgowCenter: [number, number] = [55.8642, -4.2518];
    
    // Create the map
    mapInstance = (window as any).L.map('map').setView(glasgowCenter, 12);
    
    // Add OpenStreetMap tiles
    (window as any).L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
    }).addTo(mapInstance);
    
    // Get the recycling plant input field
    const plantInput = document.getElementById('recyclingPlant') as HTMLInputElement;
    
    // Add markers for each recycling plant
    recyclingPlants.forEach(plant => {
        const marker = (window as any).L.marker([plant.lat, plant.lng]).addTo(mapInstance);
        
        // Create popup content
        const popupContent = `
            <div style="min-width: 200px;">
                <h3 style="margin: 0 0 10px 0; color: #4CAF50;">${plant.name}</h3>
                <p style="margin: 5px 0;"><strong>Address:</strong><br>${plant.address}</p>
                <p style="margin: 5px 0;"><strong>Hours:</strong><br>${plant.hours}</p>
                ${plant.phone ? `<p style="margin: 5px 0;"><strong>Phone:</strong> ${plant.phone}</p>` : ''}
                <button onclick="selectPlant('${plant.name}')" style="
                    margin-top: 10px;
                    padding: 8px 16px;
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    width: 100%;
                ">Select This Plant</button>
            </div>
        `;
        
        marker.bindPopup(popupContent);
    });
}

// Function to select plant from popup button
function selectPlant(plantName: string): void {
    const plantSelect = document.getElementById('recyclingPlant') as HTMLSelectElement;
    plantSelect.value = plantName;
    plantSelect.dispatchEvent(new Event('change', { bubbles: true }));
    
    // Close the popup
    if (mapInstance) {
        mapInstance.closePopup();
    }
}

// Make selectPlant available globally for onclick handler
(window as any).selectPlant = selectPlant;

// Populate the select dropdown with recycling plant names
function populatePlantsList(): void {
    const selectElement = document.getElementById('recyclingPlant') as HTMLSelectElement;
    
    // Keep the first "Choose a recycling plant..." option
    // Add options for each plant
    recyclingPlants.forEach(plant => {
        const option = document.createElement('option');
        option.value = plant.name;
        option.textContent = plant.name;
        selectElement.appendChild(option);
    });
}

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
    const recyclingPlant = (document.getElementById('recyclingPlant') as HTMLSelectElement).value;

    // Basic validation
    if (!date || !time || !registrationPlate || !recyclingPlant) {
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
        vehicleType: vehicleType,
        recyclingPlant: recyclingPlant
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

// Initialize when page loads
window.addEventListener('DOMContentLoaded', () => {
    initializeMap();
    populatePlantsList();
});

export {};export {};
