import { Request, Response } from 'express';
import MedicalRecord from '../models/MedicalRecord';

export const getMedicalRecords = async (req: Request, res: Response) => {
    try {
        const records = await MedicalRecord.find({})
            .populate('patient', 'firstName lastName')
            .populate('doctor', 'name')
            .sort({ date: -1 });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const createMedicalRecord = async (req: Request, res: Response) => {
    const { patientId, doctorId, diagnosis, prescription, notes } = req.body;

    try {
        const record = new MedicalRecord({
            patient: patientId,
            doctor: doctorId,
            diagnosis,
            prescription,
            notes
        });

        const createdRecord = await record.save();
        res.status(201).json(createdRecord);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getMedicalRecordsByPatient = async (req: Request, res: Response) => {
    try {
        const records = await MedicalRecord.find({ patient: req.params.patientId })
            .populate('doctor', 'name')
            .sort({ date: -1 });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
