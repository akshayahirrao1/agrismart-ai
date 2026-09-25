import express from 'express';
import { sendMessage } from '../controllers/chat.controller.js';

const router = express.Router();

// Public endpoint — the chatbot widget is available to visitors before login,
// matching the existing UX (chat bubble appears on every page).
router.post('/message', sendMessage);

export default router;