from flask import Flask, request, jsonify,render_template
from flask_cors import CORS
import sqlite3



app = Flask(__name__)
CORS(app)  # Enable CORS for all origins
@app.route('/')
def index():
    return render_template('login.html')
# SQLite Database Configuration
DB_NAME = 'users.db'

# Routes
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('username')
    email = data.get('email')
    password = data.get('password')

    # Insert logic to save to SQLite database (replace with your actual logic)
    try:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        cursor.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", (name, email, password))
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'message': 'User registered successfully'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Insert logic to validate login (replace with your actual logic)
    # Example: fetch user from database and validate password
    try:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()
        conn.close()

        if user and user[3] == password:  # Assuming password is stored as plain text for simplicity
            return jsonify({'success': True, 'message': 'Login successful'})
        else:
            return jsonify({'success': False, 'message': 'Invalid email or password'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

if __name__ == '__main__':
    app.run(debug=True)