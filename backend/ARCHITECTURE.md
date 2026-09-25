# Backend Architecture

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── env.js              # Environment configuration
│   ├── models/
│   │   ├── User.js             # User model
│   │   ├── CropPrediction.js   # Crop prediction history
│   │   ├── SoilMoisture.js     # Soil moisture history
│   │   └── DiseasePrediction.js # Disease detection history
│   ├── controllers/
│   │   ├── auth.controller.js  # Authentication logic
│   │   ├── crop.controller.js  # Crop prediction logic
│   │   ├── soil.controller.js  # Soil moisture logic
│   │   ├── disease.controller.js # Disease detection logic
│   │   └── weather.controller.js # Weather API logic
│   ├── services/
│   │   ├── ml.service.js       # ML service integration
│   │   ├── weather.service.js  # Weather API integration
│   │   └── disease.service.js  # Disease detection API
│   ├── routes/
│   │   ├── auth.routes.js      # Auth endpoints
│   │   ├── crop.routes.js      # Crop endpoints
│   │   ├── soil.routes.js      # Soil endpoints
│   │   ├── disease.routes.js   # Disease endpoints
│   │   └── weather.routes.js   # Weather endpoints
│   ├── middleware/
│   │   ├── auth.middleware.js  # JWT authentication
│   │   ├── error.middleware.js # Error handling
│   │   ├── upload.middleware.js # File upload (Multer)
│   │   └── validation.middleware.js # Input validation
│   ├── utils/
│   │   └── logger.js            # Winston logger
│   ├── app.js                  # Express app setup
│   └── server.js               # Server entry point
├── .env                        # Environment variables (create from env.example)
├── .gitignore
├── package.json
├── README.md
├── SETUP.md                    # Quick setup guide
├── ML_SERVICE_EXAMPLE.md       # Python ML service example
└── ARCHITECTURE.md            # This file
```

## 🔄 Request Flow

```
Client Request
    ↓
Express App (app.js)
    ↓
Rate Limiter Middleware
    ↓
Route Handler (routes/*.js)
    ↓
Auth Middleware (if protected)
    ↓
Validation Middleware (optional)
    ↓
Controller (controllers/*.js)
    ↓
Service Layer (services/*.js)
    ↓
External APIs / ML Service
    ↓
Database (MongoDB via Mongoose)
    ↓
Response to Client
```

## 🗄️ Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String ('admin' | 'user'),
  createdAt: Date,
  updatedAt: Date
}
```

### CropPrediction Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  N: Number,
  P: Number,
  K: Number,
  temperature: Number,
  humidity: Number,
  ph: Number,
  rainfall: Number,
  predictedCrop: String,
  confidence: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### SoilMoisture Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  soilType: String,
  temperature: Number,
  humidity: Number,
  rainfall: Number,
  moistureLevel: Number,
  irrigationSuggestion: String,
  createdAt: Date,
  updatedAt: Date
}
```

### DiseasePrediction Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  cropType: String,
  imageUrl: String,
  diseaseName: String,
  probability: Number,
  remedy: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Security Features

1. **JWT Authentication**: Token-based authentication
2. **Password Hashing**: bcrypt with salt rounds
3. **Rate Limiting**: Prevents API abuse
4. **Input Validation**: Joi validation schemas
5. **CORS**: Configured for frontend origin
6. **Error Handling**: Centralized error middleware
7. **File Upload Security**: File type and size validation

## 🔌 API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login user |
| GET | `/api/auth/me` | Yes | Get current user |
| POST | `/api/crop/predict` | Yes | Predict crop |
| GET | `/api/crop/history` | Yes | Get crop history |
| POST | `/api/soil/predict` | Yes | Predict soil moisture |
| GET | `/api/soil/history` | Yes | Get soil history |
| POST | `/api/disease/predict` | Yes | Detect disease |
| GET | `/api/disease/history` | Yes | Get disease history |
| GET | `/api/weather` | No | Get weather data |
| GET | `/health` | No | Health check |

## 🧠 ML Service Integration

The backend communicates with a Python ML service via HTTP:

1. **Crop Prediction**: `POST /predict-crop`
   - Input: N, P, K, temperature, humidity, ph, rainfall
   - Output: crop name, confidence

2. **Soil Moisture**: `POST /predict-soil-moisture`
   - Input: soilType, temperature, humidity, rainfall
   - Output: moistureLevel, irrigationSuggestion

## 📦 Dependencies

### Core
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `dotenv` - Environment variables

### Authentication
- `jsonwebtoken` - JWT tokens
- `bcryptjs` - Password hashing

### Utilities
- `axios` - HTTP client
- `multer` - File uploads
- `joi` - Input validation
- `cors` - CORS middleware
- `express-rate-limit` - Rate limiting
- `winston` - Logging
- `form-data` - Form data handling

## 🚀 Deployment Considerations

1. **Environment Variables**: Never commit `.env` file
2. **MongoDB**: Use MongoDB Atlas for production
3. **JWT Secret**: Use strong random secret in production
4. **Rate Limiting**: Adjust limits based on traffic
5. **File Storage**: Consider cloud storage (S3, etc.) for uploads
6. **Logging**: Configure log rotation and monitoring
7. **Error Handling**: Don't expose stack traces in production
8. **HTTPS**: Always use HTTPS in production
9. **ML Service**: Deploy ML service separately or use container orchestration

## 🔄 Data Flow Example: Crop Prediction

```
1. User submits form with soil parameters
   ↓
2. Frontend sends POST /api/crop/predict with JWT token
   ↓
3. Auth middleware validates token
   ↓
4. Controller validates input data
   ↓
5. Service calls Python ML API
   ↓
6. ML service returns prediction
   ↓
7. Controller saves to MongoDB
   ↓
8. Response sent to frontend with prediction
```

## 📝 Notes

- All protected routes require JWT token in `Authorization: Bearer <token>` header
- File uploads are stored in `uploads/` directory
- Logs are stored in `logs/` directory
- ML service must be running before using prediction endpoints
- Weather API requires valid API key from OpenWeatherMap

