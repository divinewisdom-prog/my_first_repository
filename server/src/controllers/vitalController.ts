import { Request, Response } from 'express';
import Vital from '../models/Vital';

export const getVitals = async (req: Request, res: Response) => {
    try {
        const vitals = await Vital.find({}).populate('patient', 'firstName lastName').sort({ date: -1 });
        res.json(vitals);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const createVital = async (req: Request, res: Response) => {
    const { patientId, bloodPressure, heartRate, temperature, respiratoryRate, oxygenSaturation, weight, height, notes } = req.body;

    try {
        const vital = new Vital({
            patient: patientId,
            bloodPressure,
            heartRate,
            temperature,
            respiratoryRate,
            oxygenSaturation,
            weight,
            height,
            notes
        });

        const createdVital = await vital.save();
        res.status(201).json(createdVital);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getVitalsByPatient = async (req: Request, res: Response) => {
    try {
        const vitals = await Vital.find({ patient: req.params.patientId }).sort({ date: -1 });
        res.json(vitals);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const deleteVital = async (req: Request, res: Response) => {
    try {
        const vital = await Vital.findById(req.params.id);

        if (vital) {
            await vital.deleteOne();
            res.json({ message: 'Vital record removed' });
        } else {
            res.status(404).json({ message: 'Vital record not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
