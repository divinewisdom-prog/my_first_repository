import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { getNotifications, markAsRead } from '../controllers/notificationController';

const router = express.Router();

router.use(protect);

router.get('/', getNotifications);
router.put('/:id/read', markAsRead);

export default router;
