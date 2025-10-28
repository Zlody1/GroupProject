# Backend Setup Instructions

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install the required dependencies:
```bash
pip install -r requirements.txt
```

## Running the Server

Start the Flask server:
```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### POST /api/appointments
Create a new appointment and receive a registration key.

**Request Body:**
```json
{
    "date": "2025-10-30",
    "time": "14:30",
    "registrationPlate": "AB12CDE",
    "vehicleType": "regular"
}
```

**Response:**
```json
{
    "success": true,
    "registrationKey": "A1B2C3D4",
    "appointmentId": 1,
    "message": "Appointment created successfully"
}
```

### GET /api/appointments/{registration_key}
Retrieve appointment details using the registration key.

**Response:**
```json
{
    "success": true,
    "appointment": {
        "id": 1,
        "date": "2025-10-30",
        "time": "14:30",
        "registrationPlate": "AB12CDE",
        "vehicleType": "regular",
        "registrationKey": "A1B2C3D4",
        "createdAt": "2025-10-28 10:30:00"
    }
}
```

### GET /api/health
Health check endpoint to verify server is running.

### GET /api/bookings-qr/{registration_key}.png
Generate a QR code image for the appointment on-the-fly.

**Description:**
This endpoint dynamically generates a QR code containing all appointment information plus the timestamp of when the QR code was generated. The QR code is not saved in the database.

**QR Code Contains:**
- Appointment ID
- Date
- Time
- Registration Plate
- Vehicle Type
- Registration Key
- Booking timestamp
- QR generation timestamp

**Response:**
Returns a PNG image of the QR code.

## Database

The application uses SQLite database (`appointments.db`) which is automatically created when you first run the server.

**Schema:**
- id (INTEGER, PRIMARY KEY)
- date (TEXT)
- time (TEXT)
- registration_plate (TEXT)
- vehicle_type (TEXT)
- registration_key (TEXT, UNIQUE)
- created_at (TIMESTAMP)
