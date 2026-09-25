import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'FRONTEND_URL'];
// Recommended but not fatal if missing — features degrade gracefully instead
// (e.g. weather/chat/disease endpoints return a clear 503 rather than the
// whole server refusing to start)
const recommendedEnvVars = ['WEATHER_API_KEY', 'HUGGINGFACE_API_KEY', 'ML_SERVICE_URL'];

const missingRequired = requiredEnvVars.filter((key) => !process.env[key]);
if (missingRequired.length > 0) {
  // Intentionally uses console, not the logger, since this can fire before
  // logger/other modules are safely initialized.
  console.error('\n❌ FATAL: Missing required environment variables:');
  missingRequired.forEach((key) => console.error(`   - ${key}`));
  console.error('\nSet these in backend/.env (or your hosting platform\'s env var settings) before starting the server.\n');
  process.exit(1);
}

const missingRecommended = recommendedEnvVars.filter((key) => !process.env[key]);
if (missingRecommended.length > 0) {
  console.warn('\n⚠️  Warning: Missing recommended environment variables (related features will be unavailable):');
  missingRecommended.forEach((key) => console.warn(`   - ${key}`));
  console.warn('');
}

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // MongoDB
  mongodbUri: process.env.MONGODB_URI,
  
  // JWT — no fallback on purpose. A missing JWT_SECRET must stop the server,
  // never silently fall back to a hardcoded, publicly-known string.
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  
  // ML Service
  mlServiceUrl: process.env.ML_SERVICE_URL || 'http://localhost:8000',
  cropPredictionEndpoint: process.env.CROP_PREDICTION_ENDPOINT || '/predict-crop',
  soilMoistureEndpoint: process.env.SOIL_MOISTURE_ENDPOINT || '/predict-soil-moisture',
  
  // External APIs
  weatherApiKey: process.env.WEATHER_API_KEY,
  weatherApiUrl: process.env.WEATHER_API_URL || 'https://api.openweathermap.org/data/2.5/weather',

  // Hugging Face Inference Providers (OpenAI-compatible router)
  huggingfaceApiKey: process.env.HUGGINGFACE_API_KEY,
  huggingfaceApiUrl: process.env.HUGGINGFACE_API_URL || 'https://router.huggingface.co/v1',
  huggingfaceChatModel: process.env.HUGGINGFACE_CHAT_MODEL || 'meta-llama/Llama-3.1-8B-Instruct',
  huggingfaceVisionModel: process.env.HUGGINGFACE_VISION_MODEL || 'meta-llama/Llama-3.2-11B-Vision-Instruct',
  
  // File Upload
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
  uploadPath: process.env.UPLOAD_PATH || './uploads',
  
  // CORS
  frontendUrl: process.env.FRONTEND_URL,
};