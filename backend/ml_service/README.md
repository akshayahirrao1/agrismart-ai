# ML Service - Training and API

This directory contains the Python ML service for training models and serving predictions.

## 📁 Directory Structure

```
ml_service/
├── app.py              # Flask API service
├── train_models.py     # Model training script
├── requirements.txt    # Python dependencies
├── data/              # Place your datasets here
│   ├── crop_recommendation.csv
│   └── soil_moisture.csv
├── models/            # Trained models (generated after training)
│   ├── crop_model.pkl
│   ├── crop_model_metadata.json
│   ├── soil_moisture_model.pkl
│   ├── soil_moisture_model_metadata.json
│   └── soil_type_encoder.pkl
└── logs/              # Training logs
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd ml_service
pip install -r requirements.txt
```

### 2. Prepare Your Datasets

Place your datasets in the `data/` folder:

#### Crop Recommendation Dataset
- **Filename**: `crop_recommendation.csv`
- **Required columns**: 
  - `N` (Nitrogen)
  - `P` (Phosphorus)
  - `K` (Potassium)
  - `temperature`
  - `humidity`
  - `ph`
  - `rainfall`
  - `label` (crop name - target variable)

#### Soil Moisture Dataset
- **Filename**: `soil_moisture.csv`
- **Required columns**:
  - `soilType` or `soil_type` (Sandy, Loamy, Clay, etc.)
  - `temperature`
  - `humidity`
  - `rainfall`
  - `moistureLevel` or `moisture_level` (target variable - 0-100)

### 3. Train Models

```bash
python train_models.py
```

The script will:
- Load datasets from `data/` folder
- Train models using Random Forest
- Save models to `models/` folder
- Generate metadata and evaluation reports

### 4. Start the API Service

```bash
python app.py
```

The service will run on `http://localhost:8000`

## 📊 Training Output

After training, you'll get:

1. **Trained Models** (`.pkl` files)
2. **Metadata** (`.json` files with model info)
3. **Evaluation Metrics**:
   - Crop Model: Accuracy, Classification Report
   - Soil Model: R² Score, RMSE

## 🔌 API Endpoints

### Health Check
```bash
GET http://localhost:8000/health
```

### Crop Prediction
```bash
POST http://localhost:8000/predict-crop
Content-Type: application/json

{
  "N": 90,
  "P": 42,
  "K": 43,
  "temperature": 20.87,
  "humidity": 82.00,
  "ph": 6.50,
  "rainfall": 202.93
}
```

Response:
```json
{
  "crop": "rice",
  "confidence": 95.5,
  "top_predictions": [
    {"crop": "rice", "confidence": 95.5},
    {"crop": "maize", "confidence": 3.2},
    {"crop": "wheat", "confidence": 1.3}
  ]
}
```

### Soil Moisture Prediction
```bash
POST http://localhost:8000/predict-soil-moisture
Content-Type: application/json

{
  "soilType": "Loamy",
  "temperature": 25,
  "humidity": 60,
  "rainfall": 100
}
```

Response:
```json
{
  "moisture_level": 65.5,
  "irrigation_suggestion": "Soil moisture is adequate. Monitor regularly."
}
```

### Model Information
```bash
GET http://localhost:8000/model-info
```

## 📝 Dataset Format Examples

### Crop Recommendation Dataset
```csv
N,P,K,temperature,humidity,ph,rainfall,label
90,42,43,20.879744,82.002744,6.502985,202.935536,rice
85,58,41,21.770462,80.319644,7.038096,226.655537,rice
60,55,44,23.004459,82.320763,7.840207,263.964248,rice
...
```

### Soil Moisture Dataset
```csv
soilType,temperature,humidity,rainfall,moistureLevel
Loamy,25,60,100,65.5
Sandy,30,50,50,35.2
Clay,20,70,150,75.8
...
```

## 🛠 Customization

### Adjust Model Parameters

Edit `train_models.py` to customize:

```python
# Crop Model
model = RandomForestClassifier(
    n_estimators=200,      # More trees
    max_depth=30,          # Deeper trees
    min_samples_split=3,  # Different split criteria
    ...
)

# Soil Model
model = RandomForestRegressor(
    n_estimators=200,
    max_depth=30,
    ...
)
```

### Use Different Algorithms

You can replace Random Forest with:
- **XGBoost**: `from xgboost import XGBClassifier, XGBRegressor`
- **SVM**: `from sklearn.svm import SVC, SVR`
- **Neural Networks**: `from sklearn.neural_network import MLPClassifier, MLPRegressor`

## 🐛 Troubleshooting

### Dataset Not Found
- Ensure datasets are in `data/` folder
- Check filenames match exactly: `crop_recommendation.csv` and `soil_moisture.csv`

### Missing Columns
- Verify your dataset has all required columns
- Column names are case-sensitive

### Model Not Loading
- Run `train_models.py` first to generate models
- Check `models/` folder contains `.pkl` files

### Low Accuracy
- Check dataset quality and size
- Try adjusting model parameters
- Ensure features are properly scaled (if needed)

## 📚 Next Steps

1. **Train with your datasets**: Place CSV files in `data/` folder
2. **Evaluate models**: Check training output for accuracy metrics
3. **Start API service**: Run `python app.py`
4. **Test endpoints**: Use Postman or curl to test predictions
5. **Integrate with Node.js**: The backend will automatically connect

## 💡 Tips

- **More data = Better models**: Use larger datasets for better accuracy
- **Feature engineering**: Add relevant features if available
- **Cross-validation**: Consider adding k-fold cross-validation
- **Hyperparameter tuning**: Use GridSearchCV for optimal parameters
- **Model versioning**: Keep track of different model versions

