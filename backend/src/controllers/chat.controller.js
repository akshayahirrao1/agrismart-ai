import { chatCompletion } from '../services/llm.service.js';
import logger from '../utils/logger.js';

const SYSTEM_PROMPT = `You are AgriSmart AI's farming assistant. You help farmers with crop recommendations, soil moisture, plant disease, irrigation, and weather-related questions.
Keep answers concise (2-4 sentences unless the user asks for detail), practical, and friendly. If a question is about crop recommendations, soil moisture, or plant disease detection, mention that the app has dedicated pages for those (Crop Prediction, Soil Moisture, Plant Disease) where they can get a personalized AI prediction.
Respond in the same language the user writes in.`;

export const sendMessage = async (req, res, next) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'message is required',
      });
    }

    // history: optional array of { role: 'user'|'assistant', text: string } from the client,
    // used to give the LLM conversational context (kept short to control token usage)
    const historyMessages = Array.isArray(history)
      ? history.slice(-6).map((m) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: String(m.text || '').slice(0, 1000),
        }))
      : [];

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...historyMessages,
      { role: 'user', content: message.trim() },
    ];

    const reply = await chatCompletion(messages);

    res.status(200).json({
      success: true,
      data: { reply },
    });
  } catch (error) {
    logger.error(`Chat Error: ${error.message}`);

    if (error.message?.includes('HUGGINGFACE_API_KEY')) {
      return res.status(503).json({
        success: false,
        message: error.message,
      });
    }

    if (error.response) {
      const status = error.response.status;
      let message = 'Chat service error';
      if (status === 401) message = 'Invalid Hugging Face API token.';
      if (status === 429) message = 'Hugging Face free-tier rate limit reached. Try again shortly.';
      return res.status(status).json({ success: false, message });
    }

    next(error);
  }
};