from flask import jsonify, Flask, render_template, request
import requests
from flask_cors import CORS
import numpy as np
import joblib
from sklearn.preprocessing import StandardScaler
from sklearn.preprocessing import LabelEncoder

app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "*"}})

# Load scaler and label encoder (make sure these are fitted as per your training process)
scaler = None
label_encoder = None

# Load your trained model
def load_model():
    try:
        with open('crop_recommendation.pkl', 'rb') as f:
            model = joblib.load(f)
        print("Model loaded successfully.")
        return model
    except FileNotFoundError:
        print("Error: Model file not found.")
    except Exception as e:
        print(f"Error loading model: {e}")
    return None

def load_scaler():
    try:
        with open('scaler.pkl', 'rb') as f:
            scaler = joblib.load(f)
        print("Scaler loaded successfully.")
        return scaler
    except FileNotFoundError:
        print("Error: Scaler file not found.")
    except Exception as e:
        print(f"Error loading scaler: {e}")
    return None
def load_label():
    try:
        with open('label_encoder.pkl', 'rb') as f:
            scaler = joblib.load(f)
        print("label_encoder loaded successfully.")
        return scaler
    except FileNotFoundError:
        print("Error: label file not found.")
    except Exception as e:
        print(f"Error loading label: {e}")
    return None

@app.route('/')
def home():
    return render_template('crop-prediction.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        latitude = data.get('latitude')
        longitude = data.get('longitude')

        # Example input values for n, p, and k (these should come from the frontend)
        n = 50  # example value
        p = 40  # example value
        k = 30  # example value
        ph_value=5
        api_key = 'c22109f9a9c43b3bf6aed69688189ec6'
        temperature, humidity, rainfall = get_weather_data(latitude, longitude, api_key)
        crop_label = predict_crop(n, p, k, temperature, humidity, ph_value, rainfall)

        response_data = {
            'temperature': temperature,
            'humidity': humidity,
            'rainfall': rainfall,
            'ph_value': ph_value,
            'nitrogen': n,
            'phosphorous': p,
            'potassium': k,
            'predicted_crop': crop_label
        }

        return jsonify(response_data)

    except Exception as e:
        return jsonify({'error': str(e)})

def get_weather_data(lat, long, api_key):
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={long}&units=metric&appid={api_key}"
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for HTTP errors (4xx or 5xx)
        data = response.json()
        
        temperature = data['main'].get('temp')
        humidity = data['main'].get('humidity')
        
        # Check if 'rain' key exists and then get '1h' rainfall, default to 0 if not present
        rainfall = data.get('rain', {}).get('1h', 0)
        
        # Convert temperature, humidity, and rainfall to float if they are numeric
        temperature = float(temperature) if isinstance(temperature, (int, float)) else 0.0
        humidity = float(humidity) if isinstance(humidity, (int, float)) else 0.0
        rainfall = float(rainfall) if isinstance(rainfall, (int, float)) else 0.0
        
        return temperature, humidity, rainfall
    
    except requests.exceptions.RequestException as err:
        print(f"Request error occurred: {err}")
        return 0.0, 0.0, 0.0  # Return default values on request error
    except Exception as err:
        print(f"Other error occurred: {err}")
        return 0.0, 0.0, 0.0  # Return default values on other errors


def get_soil_data(latitude, longitude):
    rest_url = "https://rest.isric.org"
    prop_query_url = f"{rest_url}/soilgrids/v2.0/properties/query"
    prop1 = {"property":"phh2o","depth":"0-5cm","value":"mean"}
    prop2 = {"property":"nitrogen","depth":"5-15cm","value":"mean"}
    p1 = {"lat":latitude, "lon":longitude}
    
    try:
        res1 = requests.get(prop_query_url, params={**p1, **prop1})
        res2 = requests.get(prop_query_url, params={**p1, **prop2})
        
        res1.raise_for_status()
        res2.raise_for_status()
        
        ph = res1.json()['properties']["layers"][0]["depths"][0]["values"]
        nitrogen = res2.json()['properties']["layers"][0]["depths"][0]["values"]
        
        return ph, nitrogen
    
    except requests.exceptions.RequestException as err:
        print(f"Request error occurred: {err}")
    except Exception as err:
        print(f"Other error occurred: {err}")
    
    return None, None

def predict_crop(n, p, k, temp, humidity, ph, rainfall):
   
        model = load_model()
        if model is None or isinstance(model, str):
            return 'Model not loaded'  # Handle case where model loading failed
        
        scaler = load_scaler()
        label_encoder = load_label()
        
        # Create the feature array in the same order as the model expects
        input_features = np.array([[n, p, k, temp, humidity, ph, rainfall]])
        
        # Scale the features
        input_features_scaled = scaler.transform(input_features)
        
        # Predict the crop
        predicted_label_encoded = model.predict(input_features_scaled)
        
        # Decode the label
        predicted_label = label_encoder.inverse_transform(predicted_label_encoded)
        
        return predicted_label[0]
    
    


if __name__ == "__main__":
    app.run(debug=True,port=5001)
