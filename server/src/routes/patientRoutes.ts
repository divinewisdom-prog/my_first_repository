import express from 'express';
import { getPatients, createPatient, getPatientById, updatePatient, deletePatient } from '../controllers/patientController';
import { protect } from '../middleware/authMiddleware';

import { sendEmergencyAlert } from '../controllers/emergencyController';

const router = express.Router();

router.post('/emergency/alert', protect, sendEmergencyAlert);
router.route('/').get(protect, getPatients).post(protect, createPatient);
router.route('/:id').get(protect, getPatientById).put(protect, updatePatient).delete(protect, deletePatient);

export default router;
