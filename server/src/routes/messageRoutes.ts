import express from 'express';
import { protect } from '../middleware/authMiddleware';
import {
    getConversations,
    getMessages,
    sendMessage,
    markAsRead,
    getOrCreateConversation
} from '../controllers/messageController';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get all conversations for the user
router.get('/conversations', getConversations);

// Get or create a conversation with a specific user
router.get('/conversation/:userId', getOrCreateConversation);

// Get messages for a specific conversation
router.get('/:conversationId', getMessages);

// Send a new message
router.post('/', sendMessage);

// Mark a message as read
router.put('/:id/read', markAsRead);

export default router;
