import axios from 'axios';
import { config } from '../config/env.js';
import logger from '../utils/logger.js';

/**
 * Call ML service for crop prediction
 */
export const predictCrop = async (data) => {
  try {
    const response = await axios.post(
      `${config.mlServiceUrl}${config.cropPredictionEndpoint}`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 seconds timeout
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    logger.error(`ML Crop Prediction Error: ${error.message}`);
    
    if (error.response) {
      return {
        success: false,
        message: error.response.data?.message || 'ML service error',
        statusCode: error.response.status,
      };
    }

    if (error.code === 'ECONNREFUSED') {
      return {
        success: false,
        message: 'ML service is not available. Please ensure the Python ML service is running.',
        statusCode: 503,
      };
    }

    return {
      success: false,
      message: error.message || 'Failed to get crop prediction',
      statusCode: 500,
    };
  }
};

/**
 * Call ML service for soil moisture prediction
 */
export const predictSoilMoisture = async (data) => {
  try {
    const response = await axios.post(
      `${config.mlServiceUrl}${config.soilMoistureEndpoint}`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 seconds timeout
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    logger.error(`ML Soil Moisture Prediction Error: ${error.message}`);
    
    if (error.response) {
      return {
        success: false,
        message: error.response.data?.message || 'ML service error',
        statusCode: error.response.status,
      };
    }

    if (error.code === 'ECONNREFUSED') {
      return {
        success: false,
        message: 'ML service is not available. Please ensure the Python ML service is running.',
        statusCode: 503,
      };
    }

    return {
      success: false,
      message: error.message || 'Failed to get soil moisture prediction',
      statusCode: 500,
    };
  }
};

