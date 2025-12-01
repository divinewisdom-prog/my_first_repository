import express from 'express';
import { registerUser, authUser, getDoctors } from '../controllers/authController';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/doctors', getDoctors);

export default router;
