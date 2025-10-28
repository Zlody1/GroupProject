from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import sqlite3
import secrets
import string
from datetime import datetime
import os
import qrcode
from io import BytesIO
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Database configuration
DB_PATH = os.path.join(os.path.dirname(__file__), 'appointments.db')

def init_db():
    """Initialize the database with the appointments table"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            registration_plate TEXT NOT NULL,
            vehicle_type TEXT NOT NULL,
            registration_key TEXT UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()
    print(f"Database initialized at {DB_PATH}")

def generate_registration_key(length=8):
    """Generate a random alphanumeric registration key"""
    characters = string.ascii_uppercase + string.digits
    return ''.join(secrets.choice(characters) for _ in range(length))

@app.route('/api/appointments', methods=['POST'])
def create_appointment():
    """Create a new appointment and return a registration key"""
    try:
        # Get data from request
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['date', 'time', 'registrationPlate', 'vehicleType']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        date = data['date']
        time = data['time']
        registration_plate = data['registrationPlate'].upper().strip()
        vehicle_type = data['vehicleType']
        
        # Validate vehicle type
        if vehicle_type not in ['regular', 'van']:
            return jsonify({'error': 'Invalid vehicle type'}), 400
        
        # Generate unique registration key
        registration_key = generate_registration_key()
        
        # Save to database
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                INSERT INTO appointments (date, time, registration_plate, vehicle_type, registration_key)
                VALUES (?, ?, ?, ?, ?)
            ''', (date, time, registration_plate, vehicle_type, registration_key))
            
            conn.commit()
            appointment_id = cursor.lastrowid
            
            return jsonify({
                'success': True,
                'registrationKey': registration_key,
                'appointmentId': appointment_id,
                'message': 'Appointment created successfully'
            }), 201
            
        except sqlite3.IntegrityError:
            # In case of duplicate key (very unlikely), generate a new one
            conn.rollback()
            registration_key = generate_registration_key(10)  # Use longer key
            cursor.execute('''
                INSERT INTO appointments (date, time, registration_plate, vehicle_type, registration_key)
                VALUES (?, ?, ?, ?, ?)
            ''', (date, time, registration_plate, vehicle_type, registration_key))
            conn.commit()
            appointment_id = cursor.lastrowid
            
            return jsonify({
                'success': True,
                'registrationKey': registration_key,
                'appointmentId': appointment_id,
                'message': 'Appointment created successfully'
            }), 201
            
        finally:
            conn.close()
            
    except Exception as e:
        print(f"Error creating appointment: {str(e)}")
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@app.route('/api/appointments/<registration_key>', methods=['GET'])
def get_appointment(registration_key):
    """Get appointment details by registration key"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, date, time, registration_plate, vehicle_type, registration_key, created_at
            FROM appointments
            WHERE registration_key = ?
        ''', (registration_key,))
        
        row = cursor.fetchone()
        conn.close()
        
        if row:
            return jsonify({
                'success': True,
                'appointment': {
                    'id': row[0],
                    'date': row[1],
                    'time': row[2],
                    'registrationPlate': row[3],
                    'vehicleType': row[4],
                    'registrationKey': row[5],
                    'createdAt': row[6]
                }
            }), 200
        else:
            return jsonify({'error': 'Appointment not found'}), 404
            
    except Exception as e:
        print(f"Error retrieving appointment: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'message': 'Backend is running'}), 200

@app.route('/api/bookings-qr/<registration_key>.png', methods=['GET'])
def generate_qr_code(registration_key):
    """Generate QR code for appointment on-the-fly"""
    try:
        # Retrieve appointment data from database
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, date, time, registration_plate, vehicle_type, registration_key, created_at
            FROM appointments
            WHERE registration_key = ?
        ''', (registration_key,))
        
        row = cursor.fetchone()
        conn.close()
        
        if not row:
            return jsonify({'error': 'Appointment not found'}), 404
        
        # Prepare QR code data with all appointment fields
        qr_data = {
            'appointmentId': row[0],
            'date': row[1],
            'time': row[2],
            'registrationPlate': row[3],
            'vehicleType': row[4],
            'registrationKey': row[5],
            'bookedAt': row[6],
            'qrGeneratedAt': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        
        # Convert to JSON string for QR code
        qr_content = json.dumps(qr_data, indent=2)
        
        # Generate QR code
        qr = qrcode.QRCode(
            version=1,  # Auto-adjust size
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(qr_content)
        qr.make(fit=True)
        
        # Create image
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Save to BytesIO buffer
        img_io = BytesIO()
        img.save(img_io, 'PNG')
        img_io.seek(0)
        
        # Return image as response
        return send_file(img_io, mimetype='image/png')
        
    except Exception as e:
        print(f"Error generating QR code: {str(e)}")
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

if __name__ == '__main__':
    # Initialize database on startup
    init_db()
    
    # Run the Flask app
    print("Starting Flask server on http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
