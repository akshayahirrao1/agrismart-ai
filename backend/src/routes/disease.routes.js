import express from 'express';
import { predictDisease, getDiseaseHistory } from '../controllers/disease.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

router.post('/predict', protect, upload.single('image'), predictDisease);
router.get('/history', protect, getDiseaseHistory);

export default router;

