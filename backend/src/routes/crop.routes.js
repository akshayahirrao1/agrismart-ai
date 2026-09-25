import express from 'express';
import { predictCropRecommendation, getCropHistory } from '../controllers/crop.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/predict', protect, predictCropRecommendation);
router.get('/history', protect, getCropHistory);

export default router;

