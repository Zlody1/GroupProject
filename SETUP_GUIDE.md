# Recycling Appointment Booking System

## Overview
This is a complete appointment booking system with a frontend interface and Flask backend API.

## Features
- Book Recycling appointments with date, time, registration plate, and vehicle type
- Automatic generation of unique registration keys
- SQLite database for storing appointments
- Confirmation page displaying appointment details
- Dynamic QR code generation containing all appointment information

## Project Structure
```
GroupProject/
├── backend/
│   ├── app.py                  # Flask application
│   ├── requirements.txt        # Python dependencies
│   ├── README.md              # Backend documentation
│   ├── run_server.bat         # Windows batch file to run server
│   └── appointments.db        # SQLite database (auto-generated)
└── src/
    └── html/
        ├── bookAppointmentPage.html    # Booking form
        └── ViewRegistration.html       # Confirmation page
```

## Setup Instructions

### 1. Backend Setup

Navigate to the backend directory and install dependencies:
```powershell
cd backend
pip install -r requirements.txt
```

### 2. Start the Backend Server

**Option 1: Using Python directly**
```powershell
python app.py
```

**Option 2: Using the batch file (Windows)**
```powershell
.\run_server.bat
```

The server will start on `http://localhost:5000`

### 3. Open the Frontend

Open `src/html/bookAppointmentPage.html` in your web browser.

## How It Works

1. **User fills out the booking form:**
   - Selects appointment date and time
   - Enters vehicle registration plate
   - Selects vehicle type (Regular Car or Van)

2. **Form submission:**
   - Data is sent to the Flask backend at `POST /api/appointments`
   - Backend validates the data
   - Generates a unique 8-character registration key
   - Saves the appointment to SQLite database
   - Returns the registration key to the frontend

3. **Confirmation page:**
   - User is redirected to ViewRegistration.html
   - Registration key and appointment details are displayed
   - QR code is dynamically generated and displayed
   - User can copy the registration key for future reference

## API Endpoints

### Create Appointment
- **URL:** `POST /api/appointments`
- **Body:**
  ```json
  {
    "date": "2025-10-30",
    "time": "14:30",
    "registrationPlate": "AB12CDE",
    "vehicleType": "regular"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "registrationKey": "A1B2C3D4",
    "appointmentId": 1
  }
  ```

### Get Appointment
- **URL:** `GET /api/appointments/{registration_key}`
- **Response:**
  ```json
  {
    "success": true,
    "appointment": {
      "id": 1,
      "date": "2025-10-30",
      "time": "14:30",
      "registrationPlate": "AB12CDE",
      "vehicleType": "regular",
      "registrationKey": "A1B2C3D4"
    }
  }
  ```

### Health Check
- **URL:** `GET /api/health`
- **Response:**
  ```json
  {
    "status": "ok",
    "message": "Backend is running"
  }
  ```

### Generate QR Code
- **URL:** `GET /api/bookings-qr/{registration_key}.png`
- **Description:** Dynamically generates a QR code image containing all appointment data
- **QR Code Contains:**
  - Appointment ID
  - Date and Time
  - Registration Plate
  - Vehicle Type
  - Registration Key
  - Booking timestamp
  - QR generation timestamp
- **Response:** PNG image file

## Database Schema

**Table: appointments**
| Column              | Type      | Description                          |
|---------------------|-----------|--------------------------------------|
| id                  | INTEGER   | Primary key (auto-increment)         |
| date                | TEXT      | Appointment date                     |
| time                | TEXT      | Appointment time                     |
| registration_plate  | TEXT      | Vehicle registration plate           |
| vehicle_type        | TEXT      | Type of vehicle (regular/van)        |
| registration_key    | TEXT      | Unique registration key (UNIQUE)     |
| created_at          | TIMESTAMP | Creation timestamp                   |

## Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript (ES6+)
- Fetch API for HTTP requests

### Backend
- Python 3.x
- Flask (Web framework)
- Flask-CORS (Cross-Origin Resource Sharing)
- SQLite3 (Database)
- Secrets module (Secure random key generation)
- qrcode library (QR code generation)
- Pillow (Image processing)

## Error Handling

The system includes comprehensive error handling:
- Frontend validation for required fields
- Backend validation for data integrity
- Network error handling
- Database error handling
- User-friendly error messages

## Security Features

- CORS enabled for secure cross-origin requests
- Cryptographically secure registration key generation
- SQL injection protection through parameterized queries
- Input validation and sanitization

## Future Enhancements

Potential improvements:
- User authentication
- Email notifications
- Appointment modification/cancellation
- Admin dashboard
- Calendar view for available slots
- Payment integration
