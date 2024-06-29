from flask import Flask, request, render_template, jsonify
from werkzeug.utils import secure_filename
import os
import pickle
import numpy as np
from flask_cors import CORS 
from skimage.io import imread
from skimage.transform import resize

# Load your YOLO model

def load_model():
    try:
        with open('img_model.p', 'rb') as f:
            model = pickle.load(f)
        print("Model loaded successfully.")
        return model
    except FileNotFoundError:
        print("Error: Model file not found.")
    except Exception as e:
        print(f"Error loading model: {e}")
    return None


app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "*"}}) 



@app.route('/')
def index():
    return render_template('disease-prediction.html')

@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        # Access the uploaded image file
        image_file = request.files['image']
        
        # Read the image file
        # image = Image.open(image_file)
        img = imread(image_file)


        model = load_model()

        Categories=['Black spot','canker','greening','healthy','Melanose','Anthracnose','Blight','Grey mold','crown gal','Botrytis']
        img_resized = resize(img, (150, 150, 3))  # Adjust the size as per your model training
        img_flattened = img_resized.flatten()[np.newaxis, :]

         # Predict the probabilities and class
        probabilities = model.predict_proba(img_flattened)[0]
        predicted_class = Categories[np.argmax(probabilities)]
        
        # For demonstration, we'll return a dummy prediction
        # predicted_class = 'Dummy Class'  # Replace this with your actual prediction code

        return jsonify({'predicted_class': predicted_class})

if __name__ == '__main__':
    app.run(debug=True,port=5002)
