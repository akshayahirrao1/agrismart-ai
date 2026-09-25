import axios from 'axios';
import { config } from '../config/env.js';
import logger from '../utils/logger.js';

/**
 * Get weather information for a city
 */
export const getWeatherData = async (city) => {
  try {
    if (!config.weatherApiKey) {
      return {
        success: false,
        message: 'Weather API key is not configured',
        statusCode: 500,
      };
    }

    const response = await axios.get(config.weatherApiUrl, {
      params: {
        q: city,
        appid: config.weatherApiKey,
        units: 'metric',
      },
      timeout: 10000, // 10 seconds timeout
    });

    // Transform the response to a cleaner format
    const weatherData = {
      city: response.data.name,
      country: response.data.sys.country,
      temperature: response.data.main.temp,
      feelsLike: response.data.main.feels_like,
      humidity: response.data.main.humidity,
      pressure: response.data.main.pressure,
      description: response.data.weather[0].description,
      main: response.data.weather[0].main,
      windSpeed: response.data.wind?.speed || 0,
      windDirection: response.data.wind?.deg || 0,
      visibility: response.data.visibility || 0,
      cloudiness: response.data.clouds?.all || 0,
      sunrise: response.data.sys.sunrise,
      sunset: response.data.sys.sunset,
    };

    return {
      success: true,
      data: weatherData,
    };
  } catch (error) {
    logger.error(`Weather API Error: ${error.message}`);
    
    if (error.response) {
      if (error.response.status === 404) {
        return {
          success: false,
          message: 'City not found',
          statusCode: 404,
        };
      }
      return {
        success: false,
        message: error.response.data?.message || 'Weather API error',
        statusCode: error.response.status,
      };
    }

    return {
      success: false,
      message: error.message || 'Failed to fetch weather data',
      statusCode: 500,
    };
  }
};

