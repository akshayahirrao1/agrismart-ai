// import express from 'express';
// import cors from 'cors';
// import rateLimit from 'express-rate-limit';
// import { config } from './config/env.js';
// import { errorHandler, notFound } from './middleware/error.middleware.js';
// import logger from './utils/logger.js';

// // Import routes
// import authRoutes from './routes/auth.routes.js';
// import cropRoutes from './routes/crop.routes.js';
// import soilRoutes from './routes/soil.routes.js';
// import diseaseRoutes from './routes/disease.routes.js';
// import weatherRoutes from './routes/weather.routes.js';

// const app = express();

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: 'Too many requests from this IP, please try again later.',
// });

// app.use('/api/', limiter);

// // Body parser middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // CORS
// app.use(
//   cors({
//     origin: config.frontendUrl,
//     credentials: true,
//   })
// );

// // Serve uploaded files
// app.use('/uploads', express.static('uploads'));

// // Health check endpoint
// app.get('/health', (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: 'Server is running',
//     timestamp: new Date().toISOString(),
//   });
// });

// // API Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/crop', cropRoutes);
// app.use('/api/soil', soilRoutes);
// app.use('/api/disease', diseaseRoutes);
// app.use('/api/weather', weatherRoutes);

// // 404 handler
// app.use(notFound);

// // Error handler
// app.use(errorHandler);

// export default app;



import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from './config/env.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';
import logger from './utils/logger.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import cropRoutes from './routes/crop.routes.js';
import soilRoutes from './routes/soil.routes.js';
import diseaseRoutes from './routes/disease.routes.js';
import weatherRoutes from './routes/weather.routes.js';
import chatRoutes from './routes/chat.routes.js';

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/', limiter);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  })
);

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/crop', cropRoutes);
app.use('/api/soil', soilRoutes);
app.use('/api/disease', diseaseRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/chat', chatRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

export default app;