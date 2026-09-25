import mongoose from 'mongoose';

const soilMoistureSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    soilType: {
      type: String,
      required: true,
      enum: ['Alluvial', 'Black', 'Clay', 'Laterite', 'Loamy', 'Red', 'Sandy'],
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
    rainfall: {
      type: Number,
      required: true,
      min: 0,
    },
    moistureLevel: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    irrigationSuggestion: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
soilMoistureSchema.index({ userId: 1, createdAt: -1 });

const SoilMoisture = mongoose.model('SoilMoisture', soilMoistureSchema);

export default SoilMoisture;