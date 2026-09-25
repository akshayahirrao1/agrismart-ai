"""
ML Model Training Script for Agro AI Assistant
Trains crop recommendation and soil moisture prediction models
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, mean_squared_error, r2_score
import pickle
import os
import json
from datetime import datetime

# Create directories if they don't exist
os.makedirs('models', exist_ok=True)
os.makedirs('data', exist_ok=True)
os.makedirs('dataset', exist_ok=True)
os.makedirs('logs', exist_ok=True)

def train_crop_model(dataset_path, model_name='crop_model.pkl'):
    """
    Train crop recommendation model
    
    Expected dataset columns:
    - N, P, K (nutrients)
    - temperature, humidity, ph, rainfall
    - label (crop name)
    """
    print("\n" + "="*50)
    print("Training Crop Recommendation Model")
    print("="*50)
    
    try:
        # Load dataset
        print(f"\nLoading dataset from: {dataset_path}")
        df = pd.read_csv(dataset_path)
        print(f"Dataset shape: {df.shape}")
        print(f"\nColumns: {df.columns.tolist()}")
        print(f"\nFirst few rows:")
        print(df.head())
        
        # Check required columns
        required_cols = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall', 'label']
        missing_cols = [col for col in required_cols if col not in df.columns]
        
        if missing_cols:
            print(f"\n❌ Error: Missing required columns: {missing_cols}")
            print(f"Available columns: {df.columns.tolist()}")
            return False
        
        # Prepare features and target
        feature_cols = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        X = df[feature_cols]
        y = df['label']
        
        print(f"\nFeatures: {feature_cols}")
        print(f"Target: label (crop names)")
        print(f"Number of unique crops: {y.nunique()}")
        print(f"Crops: {y.unique().tolist()}")
        
        # Check for missing values
        if X.isnull().sum().sum() > 0:
            print("\n⚠️  Warning: Missing values found. Filling with median...")
            X = X.fillna(X.median())
        
        if y.isnull().sum() > 0:
            print("\n⚠️  Warning: Missing target values found. Dropping rows...")
            df_clean = pd.concat([X, y], axis=1).dropna()
            X = df_clean[feature_cols]
            y = df_clean['label']
        
        # Split data
        print("\nSplitting data into train/test sets...")
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        print(f"Training set: {X_train.shape[0]} samples")
        print(f"Test set: {X_test.shape[0]} samples")
        
        # Train model
        print("\nTraining Random Forest Classifier...")
        model = RandomForestClassifier(
            n_estimators=100,
            max_depth=20,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            n_jobs=-1
        )
        
        model.fit(X_train, y_train)
        
        # Evaluate model
        print("\nEvaluating model...")
        y_train_pred = model.predict(X_train)
        y_test_pred = model.predict(X_test)
        
        train_accuracy = accuracy_score(y_train, y_train_pred)
        test_accuracy = accuracy_score(y_test, y_test_pred)
        
        print(f"\n✅ Training Accuracy: {train_accuracy:.4f} ({train_accuracy*100:.2f}%)")
        print(f"✅ Test Accuracy: {test_accuracy:.4f} ({test_accuracy*100:.2f}%)")
        
        # Feature importance
        feature_importance = pd.DataFrame({
            'feature': feature_cols,
            'importance': model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        print("\n📊 Feature Importance:")
        print(feature_importance.to_string(index=False))
        
        # Classification report
        print("\n📋 Classification Report:")
        print(classification_report(y_test, y_test_pred))
        
        # Save model
        model_path = f'models/{model_name}'
        with open(model_path, 'wb') as f:
            pickle.dump(model, f)
        print(f"\n💾 Model saved to: {model_path}")
        
        # Save metadata
        metadata = {
            'model_type': 'crop_recommendation',
            'algorithm': 'RandomForestClassifier',
            'training_date': datetime.now().isoformat(),
            'train_accuracy': float(train_accuracy),
            'test_accuracy': float(test_accuracy),
            'n_estimators': 100,
            'features': feature_cols,
            'n_classes': int(y.nunique()),
            'classes': y.unique().tolist(),
            'dataset_shape': df.shape,
            'feature_importance': feature_importance.to_dict('records')
        }
        
        metadata_path = f'models/{model_name.replace(".pkl", "_metadata.json")}'
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        print(f"💾 Metadata saved to: {metadata_path}")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error training crop model: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def train_soil_moisture_model(dataset_path, model_name='soil_moisture_model.pkl'):
    """
    Train soil moisture prediction model
    
    Expected dataset columns:
    - soilType (or soil_type)
    - temperature
    - humidity
    - rainfall
    - moistureLevel (or moisture_level) - target variable
    """
    print("\n" + "="*50)
    print("Training Soil Moisture Prediction Model")
    print("="*50)
    
    try:
        # Load dataset
        print(f"\nLoading dataset from: {dataset_path}")
        df = pd.read_csv(dataset_path)
        print(f"Dataset shape: {df.shape}")
        print(f"\nColumns: {df.columns.tolist()}")
        print(f"\nFirst few rows:")
        print(df.head())
        
        # Handle different column name formats
        soil_col = 'soilType' if 'soilType' in df.columns else 'soil_type'
        moisture_col = 'moistureLevel' if 'moistureLevel' in df.columns else 'moisture_level'
        
        required_cols = [soil_col, 'temperature', 'humidity', 'rainfall', moisture_col]
        missing_cols = [col for col in required_cols if col not in df.columns]
        
        if missing_cols:
            print(f"\n❌ Error: Missing required columns: {missing_cols}")
            print(f"Available columns: {df.columns.tolist()}")
            return False
        
        # Encode soil type
        print(f"\nEncoding soil types...")
        le = LabelEncoder()
        df['soil_type_encoded'] = le.fit_transform(df[soil_col])
        soil_types = le.classes_.tolist()
        print(f"Soil types: {soil_types}")
        
        # Prepare features and target
        feature_cols = ['soil_type_encoded', 'temperature', 'humidity', 'rainfall']
        X = df[feature_cols].copy()
        y = df[moisture_col].copy()
        
        # Convert target to numeric (handle any string values)
        # First, try cleaning the data if it's string
        if y.dtype == 'object':
            print(f"\n⚠️  Target column is string type. Attempting to clean and convert...")
            # Remove commas, spaces, and other non-numeric characters (except decimal point and minus)
            y_cleaned = y.astype(str).str.replace(',', '', regex=False)
            y_cleaned = y_cleaned.str.replace(' ', '', regex=False)
            y_cleaned = y_cleaned.str.replace('%', '', regex=False)
            # Convert to numeric
            y = pd.to_numeric(y_cleaned, errors='coerce')
        else:
            y = pd.to_numeric(y, errors='coerce')
        
        # Remove rows where conversion failed
        valid_indices = ~y.isna()
        dropped_count = (~valid_indices).sum()
        valid_count = valid_indices.sum()
        
        if dropped_count > 0:
            print(f"\n⚠️  Warning: {dropped_count} rows with non-numeric moisture values will be dropped")
            print(f"   Remaining valid rows: {valid_count}")
            
        if valid_count == 0:
            print(f"\n❌ Error: No valid numeric values found in '{moisture_col}' column!")
            print(f"   Sample values from the column:")
            print(f"   {df[moisture_col].head(10).tolist()}")
            print(f"\n   Please check your dataset. The moistureLevel column should contain numeric values.")
            return False
        
        X = X[valid_indices]
        y = y[valid_indices]
        
        print(f"\nFeatures: {feature_cols}")
        print(f"Target: {moisture_col}")
        print(f"Target data type: {y.dtype}")
        print(f"Valid samples: {len(y)}")
        print(f"Target range: {y.min():.2f} - {y.max():.2f}")
        print(f"Target mean: {y.mean():.2f}")
        
        # Check for missing values
        if X.isnull().sum().sum() > 0:
            print("\n⚠️  Warning: Missing values found. Filling with median...")
            X = X.fillna(X.median())
        
        if y.isnull().sum() > 0:
            print("\n⚠️  Warning: Missing target values found. Dropping rows...")
            df_clean = pd.concat([X, y], axis=1).dropna()
            X = df_clean[feature_cols]
            y = df_clean[moisture_col]
        
        # Validate we have enough data
        if len(y) < 10:
            print(f"\n❌ Error: Not enough valid data points ({len(y)}). Need at least 10 samples for training.")
            return False
        
        # Split data
        print("\nSplitting data into train/test sets...")
        test_size = 0.2
        if len(y) < 50:
            test_size = 0.3  # Use smaller test set if data is limited
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=42
        )
        
        print(f"Training set: {X_train.shape[0]} samples")
        print(f"Test set: {X_test.shape[0]} samples")
        
        # Train model
        print("\nTraining Random Forest Regressor...")
        model = RandomForestRegressor(
            n_estimators=100,
            max_depth=20,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            n_jobs=-1
        )
        
        model.fit(X_train, y_train)
        
        # Evaluate model
        print("\nEvaluating model...")
        y_train_pred = model.predict(X_train)
        y_test_pred = model.predict(X_test)
        
        train_mse = mean_squared_error(y_train, y_train_pred)
        test_mse = mean_squared_error(y_test, y_test_pred)
        train_r2 = r2_score(y_train, y_train_pred)
        test_r2 = r2_score(y_test, y_test_pred)
        
        train_rmse = np.sqrt(train_mse)
        test_rmse = np.sqrt(test_mse)
        
        print(f"\n✅ Training R² Score: {train_r2:.4f}")
        print(f"✅ Test R² Score: {test_r2:.4f}")
        print(f"✅ Training RMSE: {train_rmse:.4f}")
        print(f"✅ Test RMSE: {test_rmse:.4f}")
        
        # Feature importance
        feature_names = ['soil_type', 'temperature', 'humidity', 'rainfall']
        feature_importance = pd.DataFrame({
            'feature': feature_names,
            'importance': model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        print("\n📊 Feature Importance:")
        print(feature_importance.to_string(index=False))
        
        # Save model and label encoder
        model_path = f'models/{model_name}'
        with open(model_path, 'wb') as f:
            pickle.dump(model, f)
        print(f"\n💾 Model saved to: {model_path}")
        
        encoder_path = f'models/soil_type_encoder.pkl'
        with open(encoder_path, 'wb') as f:
            pickle.dump(le, f)
        print(f"💾 Label encoder saved to: {encoder_path}")
        
        # Save metadata
        metadata = {
            'model_type': 'soil_moisture_prediction',
            'algorithm': 'RandomForestRegressor',
            'training_date': datetime.now().isoformat(),
            'train_r2': float(train_r2),
            'test_r2': float(test_r2),
            'train_rmse': float(train_rmse),
            'test_rmse': float(test_rmse),
            'n_estimators': 100,
            'features': feature_names,
            'soil_types': soil_types,
            'target_range': {'min': float(y.min()), 'max': float(y.max())},
            'dataset_shape': df.shape,
            'feature_importance': feature_importance.to_dict('records')
        }
        
        metadata_path = f'models/{model_name.replace(".pkl", "_metadata.json")}'
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        print(f"💾 Metadata saved to: {metadata_path}")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error training soil moisture model: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def main():
    """Main training function"""
    print("\n" + "="*60)
    print("Agro AI Assistant - ML Model Training")
    print("="*60)
    
    # Check if datasets exist (check both 'dataset' and 'data' folders)
    crop_dataset_paths = [
        'dataset/Crop_recommendation.csv',
        'dataset/crop_recommendation.csv',
        'data/crop_recommendation.csv',
        './dataset/Crop_recommendation.csv',
        './dataset/crop_recommendation.csv',
        './data/crop_recommendation.csv'
    ]
    
    soil_dataset_paths = [
        'dataset/soil_moisture.csv',
        'data/soil_moisture.csv',
        './dataset/soil_moisture.csv',
        './data/soil_moisture.csv'
    ]
    
    # Find crop dataset
    crop_dataset = None
    for path in crop_dataset_paths:
        if os.path.exists(path):
            crop_dataset = path
            break
    
    # Find soil dataset
    soil_dataset = None
    for path in soil_dataset_paths:
        if os.path.exists(path):
            soil_dataset = path
            break
    
    # Train crop model if dataset exists
    if crop_dataset:
        print(f"\n📁 Found crop dataset at: {crop_dataset}")
        success = train_crop_model(crop_dataset)
        if not success:
            print("\n⚠️  Crop model training failed. Please check your dataset.")
    else:
        print(f"\n⚠️  Crop dataset not found!")
        print("   Please place your crop recommendation dataset in one of these locations:")
        print("   - dataset/crop_recommendation.csv")
        print("   - data/crop_recommendation.csv")
        print("   Required columns: N, P, K, temperature, humidity, ph, rainfall, label")
    
    # Train soil moisture model if dataset exists
    if soil_dataset:
        print(f"\n📁 Found soil dataset at: {soil_dataset}")
        success = train_soil_moisture_model(soil_dataset)
        if not success:
            print("\n⚠️  Soil moisture model training failed. Please check your dataset.")
    else:
        print(f"\n⚠️  Soil moisture dataset not found!")
        print("   Please place your soil moisture dataset in one of these locations:")
        print("   - dataset/soil_moisture.csv")
        print("   - data/soil_moisture.csv")
        print("   Required columns: soilType (or soil_type), temperature, humidity, rainfall, moistureLevel (or moisture_level)")
    
    print("\n" + "="*60)
    print("Training Complete!")
    print("="*60)
    print("\nNext steps:")
    print("1. Check the 'models' folder for trained models")
    print("2. Start the Flask service: python app.py")
    print("3. Test the models using the API endpoints")


if __name__ == '__main__':
    main()