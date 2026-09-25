import SoilMoisture from '../models/SoilMoisture.js';
import { predictSoilMoisture } from '../services/ml.service.js';
import logger from '../utils/logger.js';

/**
 * @desc    Predict soil moisture
 * @route   POST /api/soil/predict
 * @access  Private
 */
export const predictSoilMoistureLevel = async (req, res, next) => {
  try {
    const { soilType, temperature, humidity, rainfall } = req.body;

    // Validate inputs
    if (!soilType || temperature === undefined || !humidity || rainfall === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: soilType, temperature, humidity, rainfall',
      });
    }

    // Validate soil type
    const validSoilTypes = ['Alluvial', 'Black', 'Clay', 'Laterite', 'Loamy', 'Red', 'Sandy'];
    if (!validSoilTypes.includes(soilType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid soil type. Must be one of: ${validSoilTypes.join(', ')}`,
      });
    }

    // Call ML service
    const mlResponse = await predictSoilMoisture({
      soilType,
      temperature: parseFloat(temperature),
      humidity: parseFloat(humidity),
      rainfall: parseFloat(rainfall),
    });

    if (!mlResponse.success) {
      return res.status(mlResponse.statusCode || 500).json({
        success: false,
        message: mlResponse.message || 'Failed to get soil moisture prediction',
      });
    }

    // Extract prediction data
    const predictionData = mlResponse.data;
    const moistureLevel = predictionData.moisture_level || predictionData.moistureLevel || 0;
    const irrigationSuggestion = predictionData.irrigation_suggestion || 
                                  predictionData.irrigationSuggestion || 
                                  getIrrigationSuggestion(moistureLevel);

    // Save to database
    const soilMoisture = await SoilMoisture.create({
      userId: req.user.id,
      soilType,
      temperature: parseFloat(temperature),
      humidity: parseFloat(humidity),
      rainfall: parseFloat(rainfall),
      moistureLevel: parseFloat(moistureLevel),
      irrigationSuggestion,
    });

    res.status(200).json({
      success: true,
      message: 'Soil moisture prediction successful',
      data: {
        prediction: {
          id: soilMoisture._id,
          moistureLevel: parseFloat(moistureLevel),
          irrigationSuggestion,
          inputs: {
            soilType,
            temperature: parseFloat(temperature),
            humidity: parseFloat(humidity),
            rainfall: parseFloat(rainfall),
          },
          createdAt: soilMoisture.createdAt,
        },
      },
    });
  } catch (error) {
    logger.error(`Soil moisture prediction error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get soil moisture prediction history
 * @route   GET /api/soil/history
 * @access  Private
 */
export const getSoilHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const predictions = await SoilMoisture.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await SoilMoisture.countDocuments({ userId: req.user.id });

    res.status(200).json({
      success: true,
      data: {
        predictions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    logger.error(`Get soil history error: ${error.message}`);
    next(error);
  }
};

/**
 * Helper function to generate irrigation suggestion based on moisture level
 */
const getIrrigationSuggestion = (moistureLevel) => {
  if (moistureLevel < 30) {
    return 'Immediate irrigation required. Soil is very dry.';
  } else if (moistureLevel < 50) {
    return 'Irrigation recommended. Soil moisture is low.';
  } else if (moistureLevel < 70) {
    return 'Soil moisture is adequate. Monitor regularly.';
  } else {
    return 'No irrigation needed. Soil moisture is sufficient.';
  }
};