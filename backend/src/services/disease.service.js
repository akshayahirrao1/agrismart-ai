// import axios from 'axios';
// import FormData from 'form-data';
// import fs from 'fs';
// import { config } from '../config/env.js';
// import logger from '../utils/logger.js';

// /**
//  * Detect plant disease from image
//  * Note: This is a placeholder implementation. Replace with actual disease detection API
//  */
// export const detectDisease = async (imagePath, cropType) => {
//   try {
//     // If using PlantNet API or similar
//     if (config.diseaseDetectionApiUrl && config.diseaseDetectionApiKey) {
//       const formData = new FormData();
//       formData.append('images', fs.createReadStream(imagePath));
//       formData.append('organs', 'leaf'); // or 'fruit', 'flower', etc.
//       formData.append('include-related-images', 'false');

//       const response = await axios.post(
//         `${config.diseaseDetectionApiUrl}/v2/identify/all?api-key=${config.diseaseDetectionApiKey}`,
//         formData,
//         {
//           headers: formData.getHeaders(),
//           timeout: 30000,
//         }
//       );

//       // Parse PlantNet response
//       if (response.data.results && response.data.results.length > 0) {
//         const topResult = response.data.results[0];
//         return {
//           success: true,
//           data: {
//             diseaseName: topResult.species?.scientificNameWithoutAuthor || 'Unknown',
//             probability: Math.round(topResult.score * 100),
//             remedy: getDiseaseRemedy(topResult.species?.scientificNameWithoutAuthor),
//           },
//         };
//       }

//       return {
//         success: false,
//         message: 'No disease detected or image not clear',
//         statusCode: 404,
//       };
//     }

//     // Placeholder: If no external API configured, return mock data
//     // In production, you should integrate with a proper disease detection API
//     logger.warn('Disease detection API not configured, returning mock data');
//     return {
//       success: true,
//       data: {
//         diseaseName: 'Healthy Plant',
//         probability: 85,
//         remedy: 'No treatment needed. Plant appears healthy.',
//       },
//     };
//   } catch (error) {
//     logger.error(`Disease Detection Error: ${error.message}`);
    
//     if (error.response) {
//       return {
//         success: false,
//         message: error.response.data?.message || 'Disease detection API error',
//         statusCode: error.response.status,
//       };
//     }

//     return {
//       success: false,
//       message: error.message || 'Failed to detect disease',
//       statusCode: 500,
//     };
//   }
// };

// /**
//  * Get remedy suggestions based on disease name
//  * In production, this should come from a database or external API
//  */
// const getDiseaseRemedy = (diseaseName) => {
//   const remedies = {
//     'Early Blight': 'Apply fungicides containing chlorothalonil or mancozeb. Remove infected leaves.',
//     'Late Blight': 'Use copper-based fungicides. Ensure proper spacing and ventilation.',
//     'Powdery Mildew': 'Apply sulfur or neem oil. Improve air circulation.',
//     'Rust': 'Remove infected parts. Apply fungicides with myclobutanil.',
//     'Leaf Spot': 'Remove affected leaves. Apply copper fungicides.',
//   };

//   return remedies[diseaseName] || 'Consult with a local agricultural expert for specific treatment recommendations.';
// };






import fs from 'fs';
import { analyzeLeafImage } from './llm.service.js';
import logger from '../utils/logger.js';

/**
 * Detect plant disease from image using a free Hugging Face vision-language
 * model, via llm.service.js. Replaces the earlier local-CNN / Plant.id
 * approaches — no training or paid API key required, just a free HF token.
 */
export const detectDisease = async (imagePath, cropType) => {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const imageBase64 = imageBuffer.toString('base64');

    // Basic mime type guess from extension (multer preserves original extension)
    const ext = imagePath.split('.').pop().toLowerCase();
    const mimeType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';

    const result = await analyzeLeafImage(imageBase64, mimeType, cropType);

    const diseaseName = result.diseaseName || 'Unknown';
    const isHealthy = !!result.isHealthy;
    const probability = Math.max(0, Math.min(100, Math.round(result.confidence ?? 0)));
    const treatment = Array.isArray(result.treatment) ? result.treatment : [];
    const prevention = Array.isArray(result.prevention) ? result.prevention : [];
    const severity = ['Low', 'Medium', 'High'].includes(result.severity) ? result.severity : 'Low';

    const remedyParts = [];
    if (treatment.length) remedyParts.push(`Treatment: ${treatment.join('; ')}`);
    if (prevention.length) remedyParts.push(`Prevention: ${prevention.join('; ')}`);

    return {
      success: true,
      data: {
        diseaseName,
        probability,
        remedy: remedyParts.join(' ') || 'No treatment needed.',
        treatment,
        prevention,
        severity,
        isHealthy,
      },
    };
  } catch (error) {
    logger.error(`Disease Detection Error: ${error.message}`);

    if (error.message?.includes('HUGGINGFACE_API_KEY')) {
      return {
        success: false,
        message: error.message,
        statusCode: 503,
      };
    }

    if (error.response) {
      const status = error.response.status;
      let message = error.response.data?.error?.message || 'Disease detection service error';
      if (status === 401) message = 'Invalid Hugging Face API token.';
      if (status === 429) message = 'Hugging Face free-tier rate limit reached. Try again shortly.';
      return {
        success: false,
        message,
        statusCode: status,
      };
    }

    return {
      success: false,
      message: error.message || 'Failed to detect disease',
      statusCode: 500,
    };
  }
};