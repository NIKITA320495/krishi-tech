from flask import jsonify, Flask, render_template, request
import requests
from flask_cors import CORS
import numpy as np
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "*"}})

# Load your trained model and preprocessors
def load_model(filename):
    try:
        with open(filename, 'rb') as f:
            model = joblib.load(f)
        print(f"{filename} loaded successfully.")
        return model
    except FileNotFoundError:
        print(f"Error: {filename} file not found.")
    except Exception as e:
        print(f"Error loading {filename}: {e}")
    return None

# Initialize global variables for model, label encoders, and scaler
model = load_model('fertilizer_model.pkl')
le_soil = load_model('le_soil.pkl')
le_crop = load_model('le_crop.pkl')
le_fertilizer = load_model('le_fertilizer.pkl')
scaler = load_model('scaler_fert.pkl')

@app.route('/')
def home():
    return render_template('fertilizer prediction.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        soil_type = data.get('soil_type')
        crop_type = data.get('crop_type')

        # Example input values for n, p, and k (these should come from the frontend)
        n = 10  # example value
        p = 20  # example value
        k = 30  # example value

        api_key = 'c22109f9a9c43b3bf6aed69688189ec6'
        temperature, humidity = get_weather_data(latitude, longitude, api_key)
        rainfall=148
        predicted_fertilizer = predict_fertilizer(temperature, humidity, rainfall, soil_type, crop_type, n, k, p)

        response_data = {
            'temperature': temperature,
            'humidity': humidity,
            'moisture': rainfall,
            'nitrogen': n,
            'phosphorus': p,
            'potassium': k,
            'soil_type': soil_type,
            'crop_type': crop_type,
            'predicted_fertilizer': predicted_fertilizer
        }

        return jsonify(response_data)

    except Exception as e:
        return jsonify({'error': str(e)})

def get_weather_data(lat, long, api_key):
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={long}&units=metric&appid={api_key}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        
        temperature = data['main'].get('temp', 0.0)
        humidity = data['main'].get('humidity', 0.0)
        
        return float(temperature), float(humidity)
    
    except requests.exceptions.RequestException as err:
        print(f"Request error occurred: {err}")
        return 0.0, 0.0, 0.0
    except Exception as err:
        print(f"Other error occurred: {err}")
        return 0.0, 0.0, 0.0

def predict_fertilizer(temperature, humidity, moisture, soil_type, crop_type, nitrogen, potassium, phosphorus):
    try:
        # Create input data as a DataFrame
        input_data = pd.DataFrame({
            'Temparature': [temperature],   # Ensure correct spelling
            'Humidity ': [humidity],        # Ensure correct spelling
            'Moisture': [moisture], 
            'Soil Type': [soil_type],   
            'Crop Type': [crop_type] ,            # Ensure correct spelling
            'Nitrogen': [nitrogen],         # Ensure correct spelling
            'Potassium': [potassium],       # Ensure correct spelling
            'Phosphorous': [phosphorus], })

        # Apply label encoding to categorical columns
        input_data['Soil Type'] = le_soil.transform(input_data['Soil Type'])
        input_data['Crop Type'] = le_crop.transform(input_data['Crop Type'])

        # Scale the features
        input_data_scaled = scaler.transform(input_data)

        # Make prediction
        prediction = model.predict(input_data_scaled)

        # Inverse transform the predicted label to get the fertilizer name
        predicted_fertilizer = le_fertilizer.inverse_transform(prediction)[0]
        
        return predicted_fertilizer
    
    except Exception as e:
        return {'error': str(e)}

if __name__ == "__main__":
    app.run(debug=True, port=8000)
