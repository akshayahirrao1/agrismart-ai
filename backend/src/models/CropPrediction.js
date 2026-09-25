import mongoose from 'mongoose';

const cropPredictionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    N: {
      type: Number,
      required: true,
      min: 0,
    },
    P: {
      type: Number,
      required: true,
      min: 0,
    },
    K: {
      type: Number,
      required: true,
      min: 0,
    },
    temperature: {
      type: Number,
      required: true,
    },
    humidity: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    ph: {
      type: Number,
      required: true,
      min: 0,
      max: 14,
    },
    rainfall: {
      type: Number,
      required: true,
      min: 0,
    },
    predictedCrop: {
      type: String,
      required: true,
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
cropPredictionSchema.index({ userId: 1, createdAt: -1 });

const CropPrediction = mongoose.model('CropPrediction', cropPredictionSchema);

export default CropPrediction;

