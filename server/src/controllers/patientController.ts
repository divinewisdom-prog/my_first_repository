import { Request, Response } from 'express';
import Patient from '../models/Patient';

export const getPatients = async (req: Request, res: Response) => {
    try {
        const patients = await Patient.find({});
        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const createPatient = async (req: Request, res: Response) => {
    const { firstName, lastName, dateOfBirth, gender, contactNumber, address, medicalHistory, allergies, currentMedications } = req.body;

    try {
        const patient = new Patient({
            firstName,
            lastName,
            dateOfBirth,
            gender,
            contactNumber,
            address,
            medicalHistory,
            allergies,
            currentMedications,
            // assignedDoctor: req.user._id // Assuming we attach user to req
        });

        const createdPatient = await patient.save();
        res.status(201).json(createdPatient);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getPatientById = async (req: Request, res: Response) => {
    try {
        const patient = await Patient.findById(req.params.id);

        if (patient) {
            res.json(patient);
        } else {
            res.status(404).json({ message: 'Patient not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const updatePatient = async (req: Request, res: Response) => {
    try {
        const patient = await Patient.findById(req.params.id);

        if (patient) {
            patient.firstName = req.body.firstName || patient.firstName;
            patient.lastName = req.body.lastName || patient.lastName;
            patient.dateOfBirth = req.body.dateOfBirth || patient.dateOfBirth;
            patient.gender = req.body.gender || patient.gender;
            patient.contactNumber = req.body.contactNumber || patient.contactNumber;
            patient.address = req.body.address || patient.address;
            patient.medicalHistory = req.body.medicalHistory || patient.medicalHistory;
            patient.allergies = req.body.allergies || patient.allergies;
            patient.currentMedications = req.body.currentMedications || patient.currentMedications;

            const updatedPatient = await patient.save();
            res.json(updatedPatient);
        } else {
            res.status(404).json({ message: 'Patient not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const deletePatient = async (req: Request, res: Response) => {
    try {
        const patient = await Patient.findById(req.params.id);

        if (patient) {
            await patient.deleteOne();
            res.json({ message: 'Patient removed' });
        } else {
            res.status(404).json({ message: 'Patient not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
