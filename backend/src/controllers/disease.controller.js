import DiseasePrediction from '../models/DiseasePrediction.js';
import { detectDisease } from '../services/disease.service.js';
import { config } from '../config/env.js';
import path from 'path';
import fs from 'fs';
import logger from '../utils/logger.js';

/**
 * @desc    Detect plant disease from image
 * @route   POST /api/disease/predict
 * @access  Private
 */
export const predictDisease = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file',
      });
    }

    const { cropType } = req.body;

    if (!cropType) {
      // Clean up uploaded file if crop type is missing
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Please provide crop type',
      });
    }

    // Get image path
    const imagePath = req.file.path;
    const imageUrl = `/uploads/${req.file.filename}`;

    // Call disease detection service
    const diseaseResponse = await detectDisease(imagePath, cropType);

    if (!diseaseResponse.success) {
      // Clean up uploaded file on error
      fs.unlinkSync(imagePath);
      return res.status(diseaseResponse.statusCode || 500).json({
        success: false,
        message: diseaseResponse.message || 'Failed to detect disease',
      });
    }

    const { diseaseName, probability, remedy } = diseaseResponse.data;

    // Save to database
    const diseasePrediction = await DiseasePrediction.create({
      userId: req.user.id,
      cropType,
      imageUrl,
      diseaseName,
      probability: parseFloat(probability),
      remedy: remedy || '',
    });

    res.status(200).json({
      success: true,
      message: 'Disease detection successful',
      data: {
        prediction: {
          id: diseasePrediction._id,
          cropType,
          imageUrl,
          diseaseName,
          probability: parseFloat(probability),
          remedy,
          createdAt: diseasePrediction.createdAt,
        },
      },
    });
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        logger.error(`Error deleting file: ${unlinkError.message}`);
      }
    }
    logger.error(`Disease prediction error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get disease prediction history
 * @route   GET /api/disease/history
 * @access  Private
 */
export const getDiseaseHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const predictions = await DiseasePrediction.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await DiseasePrediction.countDocuments({ userId: req.user.id });

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
    logger.error(`Get disease history error: ${error.message}`);
    next(error);
  }
};

