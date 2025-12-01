import express from 'express';
import { getVitals, createVital, getVitalsByPatient, deleteVital } from '../controllers/vitalController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(protect, getVitals).post(protect, createVital);
router.route('/patient/:patientId').get(protect, getVitalsByPatient);
router.route('/:id').delete(protect, deleteVital);

export default router;
