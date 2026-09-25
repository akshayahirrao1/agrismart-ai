"""
Flask API Service for ML Models
Serves crop recommendation and soil moisture prediction models
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import os
import json

app = Flask(__name__)
CORS(app)

# Load models
crop_model = None
soil_model = None
soil_encoder = None

def load_models():
    """Load trained ML models"""
    global crop_model, soil_model, soil_encoder
    
    # Load crop model
    crop_model_path = 'models/crop_model.pkl'
    if os.path.exists(crop_model_path):
        with open(crop_model_path, 'rb') as f:
            crop_model = pickle.load(f)
        print(f"✅ Loaded crop model from {crop_model_path}")
    else:
        print(f"⚠️  Crop model not found at {crop_model_path}")
    
    # Load soil moisture model
    soil_model_path = 'models/soil_moisture_model.pkl'
    if os.path.exists(soil_model_path):
        with open(soil_model_path, 'rb') as f:
            soil_model = pickle.load(f)
        print(f"✅ Loaded soil moisture model from {soil_model_path}")
    else:
        print(f"⚠️  Soil moisture model not found at {soil_model_path}")
    
    # Load soil type encoder
    encoder_path = 'models/soil_type_encoder.pkl'
    if os.path.exists(encoder_path):
        with open(encoder_path, 'rb') as f:
            soil_encoder = pickle.load(f)
        print(f"✅ Loaded soil type encoder from {encoder_path}")
    else:
        print(f"⚠️  Soil type encoder not found at {encoder_path}")

# Load models on startup
load_models()

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'crop_model_loaded': crop_model is not None,
        'soil_model_loaded': soil_model is not None
    }), 200

@app.route('/predict-crop', methods=['POST'])
def predict_crop():
    """Predict crop recommendation"""
    try:
        if crop_model is None:
            return jsonify({
                'error': 'Crop model not loaded. Please train the model first.'
            }), 503
        
        data = request.json
        
        # Validate required fields
        required_fields = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        missing_fields = [field for field in required_fields if field not in data]
        
        if missing_fields:
            return jsonify({
                'error': f'Missing required fields: {missing_fields}'
            }), 400
        
        # Extract features in correct order
        features = np.array([[
            float(data['N']),
            float(data['P']),
            float(data['K']),
            float(data['temperature']),
            float(data['humidity']),
            float(data['ph']),
            float(data['rainfall'])
        ]])
        
        # Make prediction
        prediction = crop_model.predict(features)[0]
        
        # Get prediction probabilities
        probabilities = crop_model.predict_proba(features)[0]
        confidence = float(max(probabilities)) * 100
        
        # Get top 3 predictions
        top_indices = probabilities.argsort()[-3:][::-1]
        top_predictions = [
            {
                'crop': crop_model.classes_[idx],
                'confidence': float(probabilities[idx]) * 100
            }
            for idx in top_indices
        ]
        
        return jsonify({
            'crop': str(prediction),
            'confidence': round(confidence, 2),
            'top_predictions': top_predictions
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 400

@app.route('/predict-soil-moisture', methods=['POST'])
def predict_soil_moisture():
    """Predict soil moisture level"""
    try:
        if soil_model is None:
            return jsonify({
                'error': 'Soil moisture model not loaded. Please train the model first.'
            }), 503
        
        if soil_encoder is None:
            return jsonify({
                'error': 'Soil type encoder not loaded. Please train the model first.'
            }), 503
        
        data = request.json
        
        # Validate required fields
        required_fields = ['soilType', 'temperature', 'humidity', 'rainfall']
        missing_fields = [field for field in required_fields if field not in data]
        
        if missing_fields:
            return jsonify({
                'error': f'Missing required fields: {missing_fields}'
            }), 400
        
        # Encode soil type
        try:
            soil_type_encoded = soil_encoder.transform([data['soilType']])[0]
        except ValueError:
            # If soil type not in encoder, return available types
            available_types = soil_encoder.classes_.tolist()
            return jsonify({
                'error': f'Invalid soil type. Available types: {available_types}'
            }), 400
        
        # Extract features in correct order
        features = np.array([[
            float(soil_type_encoded),
            float(data['temperature']),
            float(data['humidity']),
            float(data['rainfall'])
        ]])
        
        # Make prediction
        moisture_level = float(soil_model.predict(features)[0])
        
        # Generate irrigation suggestion
        irrigation_suggestion = get_irrigation_suggestion(moisture_level)
        
        return jsonify({
            'moisture_level': round(moisture_level, 2),
            'irrigation_suggestion': irrigation_suggestion
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 400

def get_irrigation_suggestion(moisture_level):
    """Generate irrigation suggestion based on moisture level"""
    if moisture_level < 30:
        return 'Immediate irrigation required. Soil is very dry.'
    elif moisture_level < 50:
        return 'Irrigation recommended. Soil moisture is low.'
    elif moisture_level < 70:
        return 'Soil moisture is adequate. Monitor regularly.'
    else:
        return 'No irrigation needed. Soil moisture is sufficient.'

@app.route('/model-info', methods=['GET'])
def model_info():
    """Get information about loaded models"""
    info = {
        'crop_model': {
            'loaded': crop_model is not None,
            'type': 'RandomForestClassifier' if crop_model else None
        },
        'soil_model': {
            'loaded': soil_model is not None,
            'type': 'RandomForestRegressor' if soil_model else None
        }
    }
    
    # Try to load metadata
    try:
        if os.path.exists('models/crop_model_metadata.json'):
            with open('models/crop_model_metadata.json', 'r') as f:
                info['crop_model']['metadata'] = json.load(f)
    except:
        pass
    
    try:
        if os.path.exists('models/soil_moisture_model_metadata.json'):
            with open('models/soil_moisture_model_metadata.json', 'r') as f:
                info['soil_model']['metadata'] = json.load(f)
    except:
        pass
    
    return jsonify(info), 200

if __name__ == '__main__':
    print("\n" + "="*50)
    print("Agro AI ML Service")
    print("="*50)
    print("\nStarting Flask server...")
    print("API Endpoints:")
    print("  GET  /health - Health check")
    print("  POST /predict-crop - Crop recommendation")
    print("  POST /predict-soil-moisture - Soil moisture prediction")
    print("  GET  /model-info - Model information")
    print("\nServer running on http://localhost:8000")
    print("="*50 + "\n")
    
    app.run(host='0.0.0.0', port=8000, debug=True)

