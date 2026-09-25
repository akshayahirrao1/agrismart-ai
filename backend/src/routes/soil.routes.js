import express from 'express';
import { predictSoilMoistureLevel, getSoilHistory } from '../controllers/soil.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/predict', protect, predictSoilMoistureLevel);
router.get('/history', protect, getSoilHistory);

export default router;

