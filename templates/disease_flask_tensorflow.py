from flask import Flask, request, render_template, jsonify
from werkzeug.utils import secure_filename
import os
import numpy as np
from flask_cors import CORS
from skimage.io import imread
from skimage.transform import resize
import tensorflow as tf

app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "http://127.0.0.1:5500"}})

# Load your trained TensorFlow model
def load_tf_model():
    try:
        model = tf.keras.models.load_model('fine_tuned_model.h5')
        print("TensorFlow model loaded successfully.")
        return model
    except FileNotFoundError:
        print("Error: TensorFlow model file not found.")
    except Exception as e:
        print(f"Error loading TensorFlow model: {e}")
    return None

# Load the model once when the application starts
model = load_tf_model()

@app.route('/')
def index():
    return render_template('disease-prediction.html')

@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        try:
            # Access the uploaded image file
            image_file = request.files['image']
            
            # Read the image file
            img = imread(image_file)

            # Resize the image to match the input size of the model
            img_resized = resize(img, (224, 224, 3))
            
            # Convert the image to an array and expand dimensions to match the expected input format
            img_array = np.expand_dims(img_resized, axis=0)

            # Preprocess the image (e.g., normalize if needed)
            img_array = img_array / 255.0

            # Make a prediction
            predictions = model.predict(img_array)

            # Get the predicted class
            predicted_class_index = np.argmax(predictions, axis=1)

            # Define your categories
            Categories=['alternaria_leaf_spot', 'black_rot', 'brown_spot', 'gray_spot', 'healthy', 'rust', 'scab', 'bacterial_spot', 'healthy', 'healthy', 'bacterial_blight', 'brown_streak_disease', 'green_mottle', 'healthy', 'mosaic_disease', 'healthy', 'powdery_mildew', 'common_rust', 'gray_leaf_spot', 'healthy', 'northern_leaf_blight', 'black_measles', 'black_rot', 'healthy', 'leaf_blight', 'citrus_greening', 'bacterial_spot', 'healthy', 'bacterial_wilt', 'early_blight', 'healthy', 'late_blight', 'nematode', 'pests', 'phytophthora', 'virus', 'healthy', 'bacterial_blight', 'blast1', 'brown_spot', 'tungro', 'healthy', 'powdery_mildew', 'healthy', 'leaf_scorch', 'healthy', 'mosaic', 'red_rot', 'rust', 'healthy', 'late_blight', 'leaf_curl', 'leaf_mold', 'mosaic_virus', 'septoria_leaf_spot', 'spider_mites','target_spot']

            if predicted_class_index[0] < len(Categories):
                predicted_class = Categories[predicted_class_index[0]]
            else:
                predicted_class = "diseased"
            
            return jsonify({'predicted_class': predicted_class})

        except Exception as e:
            print(f"Error occurred: {e}")
            return jsonify({'error': 'Internal Server Error'}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5002)