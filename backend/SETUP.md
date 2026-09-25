# Quick Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Environment Variables
```bash
# Copy the example file
cp env.example .env

# Edit .env and add your configuration
# - MongoDB connection string
# - JWT secret key
# - Weather API key
# - ML service URL (if different from default)
```

### 3. Create Required Directories
```bash
mkdir -p uploads logs
```

### 4. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Windows
# Start MongoDB service or run: mongod

# Linux/Mac
sudo systemctl start mongod
# or
mongod
```

### 5. Start the Backend Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

### 6. Test the API
```bash
# Health check
curl http://localhost:5000/health

# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 📋 Environment Variables Checklist

Make sure these are set in your `.env` file:

- ✅ `MONGODB_URI` - MongoDB connection string
- ✅ `JWT_SECRET` - Secret key for JWT tokens (use a strong random string)
- ✅ `WEATHER_API_KEY` - OpenWeatherMap API key (get from https://openweathermap.org/api)
- ✅ `ML_SERVICE_URL` - URL of your Python ML service (default: http://localhost:8000)
- ✅ `FRONTEND_URL` - Your frontend URL for CORS (default: http://localhost:5173)

## 🔧 ML Service Setup

Before using crop and soil moisture predictions, you need to:

1. **Set up Python ML service** (see `ML_SERVICE_EXAMPLE.md`)
2. **Train your models** with your datasets
3. **Start the ML service** on port 8000
4. **Test ML service endpoints**:
   - `POST http://localhost:8000/predict-crop`
   - `POST http://localhost:8000/predict-soil-moisture`

## 📊 Dataset Location

**Important**: The dataset for Soil Moisture Prediction is used to **train the Python ML model**, not provided to the Node.js backend.

1. Use your dataset to train the ML model in Python
2. Save the trained model
3. Expose it via Flask/FastAPI REST API
4. Node.js backend calls the ML service API

See `ML_SERVICE_EXAMPLE.md` for detailed instructions.

## 🧪 Testing Endpoints

### Authentication
```bash
# Register
POST /api/auth/register
Body: { "name": "...", "email": "...", "password": "..." }

# Login
POST /api/auth/login
Body: { "email": "...", "password": "..." }

# Get current user (requires token)
GET /api/auth/me
Headers: { "Authorization": "Bearer <token>" }
```

### Crop Prediction
```bash
POST /api/crop/predict
Headers: { "Authorization": "Bearer <token>" }
Body: {
  "N": 90,
  "P": 42,
  "K": 43,
  "temperature": 20.87,
  "humidity": 82.00,
  "ph": 6.50,
  "rainfall": 202.93
}
```

### Soil Moisture
```bash
POST /api/soil/predict
Headers: { "Authorization": "Bearer <token>" }
Body: {
  "soilType": "Loamy",
  "temperature": 25,
  "humidity": 60,
  "rainfall": 100
}
```

### Disease Detection
```bash
POST /api/disease/predict
Headers: { "Authorization": "Bearer <token>" }
Body: FormData with "image" file and "cropType" field
```

### Weather
```bash
GET /api/weather?city=London
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check your `MONGODB_URI` in `.env`
- Verify MongoDB is accessible

### ML Service Connection Error
- Ensure Python ML service is running on port 8000
- Check `ML_SERVICE_URL` in `.env`
- Test ML service endpoints directly

### File Upload Issues
- Ensure `uploads/` directory exists
- Check file size limits in `.env` (`MAX_FILE_SIZE`)
- Verify file permissions

### CORS Errors
- Update `FRONTEND_URL` in `.env` to match your frontend URL
- Restart the server after changing `.env`

## 📚 Next Steps

1. Integrate with your frontend
2. Set up the Python ML service
3. Train your ML models with datasets
4. Configure external APIs (Weather, Disease Detection)
5. Deploy to production

