import { getWeatherData } from '../services/weather.service.js';
import logger from '../utils/logger.js';

/**
 * @desc    Get weather information for a city
 * @route   GET /api/weather
 * @access  Public
 */
export const getWeather = async (req, res, next) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a city name',
      });
    }

    const weatherResponse = await getWeatherData(city);

    if (!weatherResponse.success) {
      return res.status(weatherResponse.statusCode || 500).json({
        success: false,
        message: weatherResponse.message || 'Failed to fetch weather data',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Weather data fetched successfully',
      data: weatherResponse.data,
    });
  } catch (error) {
    logger.error(`Get weather error: ${error.message}`);
    next(error);
  }
};

