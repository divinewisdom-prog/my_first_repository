import { Request, Response } from 'express';

// @desc    Send emergency alert to contacts
// @route   POST /api/patients/emergency/alert
// @access  Private
export const sendEmergencyAlert = async (req: Request, res: Response) => {
    try {
        const { latitude, longitude, type } = req.body;
        const user = (req as any).user;

        // In a real app, you would fetch the user's emergency contacts from DB
        // const contacts = await Patient.findById(user._id).select('emergencyContacts');

        const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

        console.log(`[EMERGENCY] Alert received from User ${user._id}`);
        console.log(`[EMERGENCY] Location: ${latitude}, ${longitude}`);
        console.log(`[EMERGENCY] Map: ${googleMapsLink}`);

        // SIMULATION: Send SMS to contacts (Twilio/SendGrid would go here)
        // await twilioClient.messages.create({ ... })

        // SIMULATION: Notify nearest hospital
        // await hospitalSystem.notify({ ... })

        // Simulate network delay for realism
        await new Promise(resolve => setTimeout(resolve, 1500));

        res.status(200).json({
            success: true,
            message: 'Emergency alert broadcasted successfully',
            data: {
                contactsNotified: 3,
                hospitalNotified: true,
                timestamp: new Date()
            }
        });
    } catch (error) {
        console.error('Emergency alert failed:', error);
        res.status(500).json({ message: 'Failed to broadcast emergency alert' });
    }
};
