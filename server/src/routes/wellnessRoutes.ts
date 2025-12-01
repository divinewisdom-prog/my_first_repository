import express from 'express';
import {
    createWellnessEntry,
    getWellnessHistory,
    getWellnessStats,
    deleteWellnessEntry
} from '../controllers/wellnessController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
    .get(protect, getWellnessHistory)
    .post(protect, createWellnessEntry);

router.route('/stats')
    .get(protect, getWellnessStats);

router.route('/:id')
    .delete(protect, deleteWellnessEntry);

export default router;
