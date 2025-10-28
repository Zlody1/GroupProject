# Quick Start Guide

## Step 1: Install Backend Dependencies
```powershell
cd backend
pip install -r requirements.txt
```

## Step 2: Start the Backend Server
```powershell
python app.py
```

You should see:
```
Database initialized at ...
Starting Flask server on http://localhost:5000
```

## Step 3: Open the Booking Page

Open `src/html/bookAppointmentPage.html` in your web browser.

## Step 4: Test the Application

1. Fill in the form:
   - Select a date (today or future)
   - Select a time
   - Enter a registration plate (e.g., "AB12 CDE")
   - Choose vehicle type (Regular Car or Van)

2. Click "Book Appointment"

3. You'll be redirected to the confirmation page showing:
   - Your unique registration key
   - Appointment details
   - QR code containing all appointment information

4. Copy the registration key for future reference

## Troubleshooting

**Error: "Network error. Please ensure the backend server is running."**
- Make sure the Flask server is running on port 5000
- Check that you're accessing the HTML file through a browser (not file:// protocol for CORS)

**Error: "ModuleNotFoundError: No module named 'flask'"**
- Run: `pip install -r requirements.txt` in the backend directory

**Database not found:**
- The database is automatically created on first run
- Look for `appointments.db` in the backend directory

## Testing the API Directly

You can test the API using PowerShell:

```powershell
# Health check
Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method GET

# Create appointment
$body = @{
    date = "2025-10-30"
    time = "14:30"
    registrationPlate = "AB12CDE"
    vehicleType = "regular"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/appointments" -Method POST -Body $body -ContentType "application/json"
```
