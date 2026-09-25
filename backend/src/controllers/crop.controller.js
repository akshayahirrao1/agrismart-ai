import CropPrediction from '../models/CropPrediction.js';
import { predictCrop } from '../services/ml.service.js';
import logger from '../utils/logger.js';

/**
 * @desc    Predict crop recommendation
 * @route   POST /api/crop/predict
 * @access  Private
 */
export const predictCropRecommendation = async (req, res, next) => {
  try {
    const { N, P, K, temperature, humidity, ph, rainfall } = req.body;

    // Validate inputs
    if (!N || !P || !K || temperature === undefined || !humidity || !ph || rainfall === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: N, P, K, temperature, humidity, ph, rainfall',
      });
    }

    // Call ML service
    const mlResponse = await predictCrop({
      N: parseFloat(N),
      P: parseFloat(P),
      K: parseFloat(K),
      temperature: parseFloat(temperature),
      humidity: parseFloat(humidity),
      ph: parseFloat(ph),
      rainfall: parseFloat(rainfall),
    });

    if (!mlResponse.success) {
      return res.status(mlResponse.statusCode || 500).json({
        success: false,
        message: mlResponse.message || 'Failed to get crop prediction',
      });
    }

    // Extract prediction data
    const predictionData = mlResponse.data;
    const predictedCrop = predictionData.crop || predictionData.predicted_crop || 'Unknown';
    const confidence = predictionData.confidence || predictionData.probability || 0;

    // Save to database
    const cropPrediction = await CropPrediction.create({
      userId: req.user.id,
      N: parseFloat(N),
      P: parseFloat(P),
      K: parseFloat(K),
      temperature: parseFloat(temperature),
      humidity: parseFloat(humidity),
      ph: parseFloat(ph),
      rainfall: parseFloat(rainfall),
      predictedCrop,
      confidence: parseFloat(confidence),
    });

    res.status(200).json({
      success: true,
      message: 'Crop prediction successful',
      data: {
        prediction: {
          id: cropPrediction._id,
          predictedCrop,
          confidence,
          inputs: {
            N: parseFloat(N),
            P: parseFloat(P),
            K: parseFloat(K),
            temperature: parseFloat(temperature),
            humidity: parseFloat(humidity),
            ph: parseFloat(ph),
            rainfall: parseFloat(rainfall),
          },
          createdAt: cropPrediction.createdAt,
        },
      },
    });
  } catch (error) {
    logger.error(`Crop prediction error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get crop prediction history
 * @route   GET /api/crop/history
 * @access  Private
 */
export const getCropHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const predictions = await CropPrediction.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await CropPrediction.countDocuments({ userId: req.user.id });

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
    logger.error(`Get crop history error: ${error.message}`);
    next(error);
  }
};

