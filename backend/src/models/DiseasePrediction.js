import mongoose from 'mongoose';

const diseasePredictionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cropType: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    diseaseName: {
      type: String,
      required: true,
    },
    probability: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    remedy: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
diseasePredictionSchema.index({ userId: 1, createdAt: -1 });

const DiseasePrediction = mongoose.model('DiseasePrediction', diseasePredictionSchema);

export default DiseasePrediction;

