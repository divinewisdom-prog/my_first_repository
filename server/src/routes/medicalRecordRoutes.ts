import express from 'express';
import { getMedicalRecords, createMedicalRecord, getMedicalRecordsByPatient } from '../controllers/medicalRecordController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(protect, getMedicalRecords).post(protect, createMedicalRecord);
router.route('/patient/:patientId').get(protect, getMedicalRecordsByPatient);

export default router;
