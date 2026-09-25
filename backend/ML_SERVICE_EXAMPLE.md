# Python ML Service Example

This document shows how to set up the Python ML service that the Node.js backend communicates with.

## 📍 Dataset Location for Soil Moisture Prediction

**Where to provide the dataset:**

The dataset for Soil Moisture Prediction should be used to **train your Python ML model**. The dataset is NOT provided to the Node.js backend. Instead:

1. **Train your ML model** using the dataset in Python (Flask/FastAPI)
2. **Save the trained model** (using pickle, joblib, or TensorFlow/Keras)
3. **Expose the model** via REST API endpoints
4. **Node.js backend calls** these endpoints to get predictions

## 🐍 Example Flask Service

Create a file `ml_service/app.py`:

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load your trained models
# crop_model = pickle.load(open('models/crop_model.pkl', 'rb'))
# soil_model = pickle.load(open('models/soil_model.pkl', 'rb'))

@app.route('/predict-crop', methods=['POST'])
def predict_crop():
    try:
        data = request.json
        
        # Extract features
        features = np.array([[
            data['N'],
            data['P'],
            data['K'],
            data['temperature'],
            data['humidity'],
            data['ph'],
            data['rainfall']
        ]])
        
        # Make prediction (replace with your actual model)
        # prediction = crop_model.predict(features)[0]
        # confidence = crop_model.predict_proba(features)[0].max() * 100
        
        # For now, return mock data
        prediction = "rice"
        confidence = 95.5
        
        return jsonify({
            'crop': prediction,
            'confidence': confidence
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 400

@app.route('/predict-soil-moisture', methods=['POST'])
def predict_soil_moisture():
    try:
        data = request.json
        
        # Extract features
        soil_type = data['soilType']
        temperature = data['temperature']
        humidity = data['humidity']
        rainfall = data['rainfall']
        
        # Make prediction using your trained model
        # features = prepare_features(soil_type, temperature, humidity, rainfall)
        # moisture_level = soil_model.predict(features)[0]
        
        # For now, return mock data
        moisture_level = 65.5
        irrigation_suggestion = "Soil moisture is adequate. Monitor regularly."
        
        return jsonify({
            'moisture_level': moisture_level,
            'irrigation_suggestion': irrigation_suggestion
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 400

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
```

## 📦 Required Python Packages

```bash
pip install flask flask-cors numpy pandas scikit-learn
```

## 🚀 Running the ML Service

```bash
cd ml_service
python app.py
```

The service will run on `http://localhost:8000`

## 📊 Training Your Models

### Example: Training Crop Recommendation Model

```python
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import pickle

# Load your dataset
df = pd.read_csv('crop_recommendation_dataset.csv')

# Prepare features and target
X = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
y = df['label']  # crop name

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train model
model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

# Save model
pickle.dump(model, open('models/crop_model.pkl', 'wb'))

# Evaluate
accuracy = model.score(X_test, y_test)
print(f'Accuracy: {accuracy}')
```

### Example: Training Soil Moisture Model

```python
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import pickle

# Load your dataset
df = pd.read_csv('soil_moisture_dataset.csv')

# Encode soil type
df['soil_type_encoded'] = pd.Categorical(df['soil_type']).codes

# Prepare features
X = df[['soil_type_encoded', 'temperature', 'humidity', 'rainfall']]
y = df['moisture_level']

# Split and train
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
model = RandomForestRegressor(n_estimators=100)
model.fit(X_train, y_train)

# Save model
pickle.dump(model, open('models/soil_model.pkl', 'wb'))
```

## 📝 Notes

- Place your training datasets in a `data/` folder
- Save trained models in a `models/` folder
- The Node.js backend expects responses in the format shown above
- Make sure the ML service is running before starting the Node.js backend

