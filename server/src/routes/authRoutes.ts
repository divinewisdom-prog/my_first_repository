import express from 'express';
import { registerUser, authUser, getDoctors, updateUser } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/doctors', getDoctors);
router.put('/users/:id', protect, updateUser);

export default router;
