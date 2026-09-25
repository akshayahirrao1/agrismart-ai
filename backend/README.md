# Agro AI Assistant - Backend API

A scalable Node.js backend for Agro AI Assistant providing APIs for crop recommendation, soil moisture prediction, plant disease detection, and weather information.

## 🚀 Features

- **Crop Recommendation**: ML-based crop prediction using soil and climate parameters
- **Soil Moisture Prediction**: Predict soil moisture levels and irrigation suggestions
- **Plant Disease Detection**: Detect plant diseases from uploaded images
- **Weather Information**: Get real-time weather data for any city
- **User Authentication**: JWT-based authentication system
- **Prediction History**: Track all predictions per user
- **Rate Limiting**: API rate limiting for security
- **Error Handling**: Centralized error handling middleware
- **Logging**: Winston-based logging system

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Python ML Service (Flask/FastAPI) running on port 8000
- Weather API key (OpenWeatherMap)

## 🛠 Installation

1. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Create `.env` file**:
   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables** in `.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/agro-ai
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   ML_SERVICE_URL=http://localhost:8000
   WEATHER_API_KEY=your-weather-api-key
   FRONTEND_URL=http://localhost:5173
   ```

4. **Create necessary directories**:
   ```bash
   mkdir -p uploads logs
   ```

## 🚀 Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Crop Recommendation
- `POST /api/crop/predict` - Predict crop recommendation (Protected)
- `GET /api/crop/history` - Get crop prediction history (Protected)

### Soil Moisture
- `POST /api/soil/predict` - Predict soil moisture (Protected)
- `GET /api/soil/history` - Get soil moisture history (Protected)

### Plant Disease Detection
- `POST /api/disease/predict` - Detect plant disease from image (Protected)
- `GET /api/disease/history` - Get disease detection history (Protected)

### Weather
- `GET /api/weather?city=London` - Get weather information (Public)

## 🔧 ML Service Integration

The backend communicates with a Python ML service (Flask/FastAPI) for predictions.

### Expected ML Service Endpoints:

1. **Crop Prediction**: `POST /predict-crop`
   ```json
   {
     "N": 90,
     "P": 42,
     "K": 43,
     "temperature": 20.879744,
     "humidity": 82.002744,
     "ph": 6.502985,
     "rainfall": 202.935536
   }
   ```
   Response:
   ```json
   {
     "crop": "rice",
     "confidence": 95.5
   }
   ```

2. **Soil Moisture Prediction**: `POST /predict-soil-moisture`
   ```json
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

## 📊 Database Models

### User
- name, email, password (hashed), role, createdAt

### CropPrediction
- userId, N, P, K, temperature, humidity, ph, rainfall, predictedCrop, confidence, createdAt

### SoilMoisture
- userId, soilType, temperature, humidity, rainfall, moistureLevel, irrigationSuggestion, createdAt

### DiseasePrediction
- userId, cropType, imageUrl, diseaseName, probability, remedy, createdAt

## 🔐 Security Features

- JWT authentication
- Password hashing with bcrypt
- Input validation
- Rate limiting
- CORS configuration
- Error handling

## 📝 Notes

- **Dataset Location**: For Soil Moisture Prediction, the dataset should be used to train the Python ML model. The Node.js backend only calls the ML service API.
- **File Uploads**: Disease detection images are stored in the `uploads/` directory
- **Logs**: Application logs are stored in the `logs/` directory

## 🧪 Testing

Use tools like Postman or curl to test the API endpoints.

Example:
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

## 📄 License

ISC

