import axios from 'axios';
import { config } from '../config/env.js';
import logger from '../utils/logger.js';

/**
 * Shared client for Hugging Face's Inference Providers router — an
 * OpenAI-compatible /chat/completions endpoint that can route to free-tier
 * open-source models, including vision-capable ones.
 * Docs: https://huggingface.co/docs/inference-providers/index
 *
 * Get a free token at https://huggingface.co/settings/tokens
 */
const client = () => {
  if (!config.huggingfaceApiKey) {
    throw new Error('HUGGINGFACE_API_KEY not set in backend/.env. Get a free token at https://huggingface.co/settings/tokens');
  }
  return axios.create({
    baseURL: config.huggingfaceApiUrl,
    headers: {
      Authorization: `Bearer ${config.huggingfaceApiKey}`,
      'Content-Type': 'application/json',
    },
    timeout: 60000, // free-tier models can be slow to respond
  });
};

/**
 * Plain text chat completion (used by the chatbot).
 * @param {Array<{role: 'system'|'user'|'assistant', content: string}>} messages
 */
export const chatCompletion = async (messages) => {
  const api = client();
  const response = await api.post('/chat/completions', {
    model: config.huggingfaceChatModel,
    messages,
    max_tokens: 500,
    temperature: 0.7,
  });

  const reply = response.data?.choices?.[0]?.message?.content;
  if (!reply) {
    throw new Error('Empty response from LLM');
  }
  return reply.trim();
};

/**
 * Vision-based leaf image analysis (used by disease detection).
 * Sends the image + a prompt instructing the model to respond in strict JSON,
 * since vision LLMs generate free text, not a calibrated classifier score.
 * @param {string} imageBase64 - raw base64 (no data: prefix)
 * @param {string} mimeType - e.g. 'image/jpeg'
 * @param {string} cropType
 */
export const analyzeLeafImage = async (imageBase64, mimeType, cropType) => {
  const api = client();

  const systemPrompt = `You are a plant pathology expert. You will be shown a photo of a plant leaf. Identify whether it shows disease symptoms, and if so, which disease is most likely.

Respond with ONLY valid JSON (no markdown code fences, no extra text) in exactly this shape:
{
  "diseaseName": "string - specific disease name, or 'Healthy Plant' if no disease is visible",
  "isHealthy": boolean,
  "confidence": number between 0 and 100 - your best estimate of certainty,
  "severity": "Low" | "Medium" | "High",
  "treatment": ["array of specific treatment steps, empty array if healthy"],
  "prevention": ["array of prevention tips"]
}`;

  const response = await api.post('/chat/completions', {
    model: config.huggingfaceVisionModel,
    messages: [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: [
          { type: 'text', text: `Crop type: ${cropType}. Analyze this leaf image for disease.` },
          { type: 'image_url', image_url: { url: `data:${mimeType};base64,${imageBase64}` } },
        ],
      },
    ],
    max_tokens: 600,
    temperature: 0.2, // lower temperature for more consistent structured output
  });

  const raw = response.data?.choices?.[0]?.message?.content;
  if (!raw) {
    throw new Error('Empty response from vision model');
  }

  // Strip markdown code fences if the model added them despite instructions
  const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    logger.error(`Failed to parse LLM disease response as JSON: ${raw}`);
    throw new Error('Could not parse disease analysis response. The model may have returned an unexpected format.');
  }

  return parsed;
};