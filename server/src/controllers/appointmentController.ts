import { Request, Response } from 'express';
import Appointment from '../models/Appointment';

export const getAppointments = async (req: Request, res: Response) => {
    try {
        const appointments = await Appointment.find({}).populate('patient', 'firstName lastName').populate('doctor', 'name');
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const createAppointment = async (req: Request, res: Response) => {
    const { patientId, doctorId, date, reason, notes } = req.body;

    try {
        const appointment = new Appointment({
            patient: patientId,
            doctor: doctorId,
            date,
            reason,
            notes,
        });

        const createdAppointment = await appointment.save();
        res.status(201).json(createdAppointment);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const updateAppointment = async (req: Request, res: Response) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (appointment) {
            appointment.status = req.body.status || appointment.status;
            appointment.notes = req.body.notes || appointment.notes;

            const updatedAppointment = await appointment.save();
            res.json(updatedAppointment);
        } else {
            res.status(404).json({ message: 'Appointment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const deleteAppointment = async (req: Request, res: Response) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (appointment) {
            await appointment.deleteOne();
            res.json({ message: 'Appointment removed' });
        } else {
            res.status(404).json({ message: 'Appointment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
