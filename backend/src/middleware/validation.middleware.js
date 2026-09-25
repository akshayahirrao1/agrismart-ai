import Joi from 'joi';

/**
 * Validation middleware factory
 */
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
      });
    }

    next();
  };
};

// Validation schemas
export const schemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('admin', 'user').optional(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  cropPrediction: Joi.object({
    N: Joi.number().min(0).required(),
    P: Joi.number().min(0).required(),
    K: Joi.number().min(0).required(),
    temperature: Joi.number().required(),
    humidity: Joi.number().min(0).max(100).required(),
    ph: Joi.number().min(0).max(14).required(),
    rainfall: Joi.number().min(0).required(),
  }),

  soilMoisture: Joi.object({
    soilType: Joi.string()
      .valid('Alluvial', 'Black', 'Clay', 'Laterite', 'Loamy', 'Red', 'Sandy')
      .required(),
    temperature: Joi.number().required(),
    humidity: Joi.number().min(0).max(100).required(),
    rainfall: Joi.number().min(0).required(),
  }),

  diseasePrediction: Joi.object({
    cropType: Joi.string().required(),
  }),
};