import { Request, Response } from 'express';
import { Notification } from '../models/Notification';
import DailyWellness from '../models/DailyWellness';
import Appointment from '../models/Appointment';

// Helper to check and generate notifications
const generateSmartNotifications = async (userId: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 1. Check Wellness Log for Today
    const wellnessLog = await DailyWellness.findOne({
        user: userId,
        date: { $gte: today, $lt: tomorrow }
    });

    if (!wellnessLog) {
        // Check if we already notified about this today
        const existingNotif = await Notification.findOne({
            user: userId,
            type: 'wellness',
            createdAt: { $gte: today },
            title: 'Daily Wellness Check-in'
        });

        if (!existingNotif) {
            await Notification.create({
                user: userId,
                type: 'wellness',
                title: 'Daily Wellness Check-in',
                message: 'How are you feeling today? Log your mood and energy to keep your streak!',
                link: '/wellness'
            });
        }
    }

    // 2. Check Upcoming Appointments (Next 24 hours)
    const next24h = new Date();
    next24h.setHours(next24h.getHours() + 24);

    const appointments = await Appointment.find({
        patient: userId,
        date: { $gte: new Date(), $lte: next24h },
        status: 'confirmed'
    }).populate('doctor', 'name');

    for (const apt of appointments) {
        // Check if we already notified for this specific appointment
        // We use a simple heuristic: if a notification exists with this link/title created recently
        const title = `Upcoming Appointment: ${(apt.doctor as any)?.name}`;

        const existingNotif = await Notification.findOne({
            user: userId,
            type: 'appointment',
            title: title,
            // Don't spam: check if we notified in the last 24h
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        });

        if (!existingNotif) {
            const time = new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            await Notification.create({
                user: userId,
                type: 'appointment',
                title: title,
                message: `You have an appointment with ${(apt.doctor as any)?.name} at ${time}.`,
                link: '/appointments'
            });
        }
    }

    // 3. Simple Insight (Random - for demo, but can be real stats)
    // Only generate if no insight today
    const existingInsight = await Notification.findOne({
        user: userId,
        type: 'insight',
        createdAt: { $gte: today }
    });

    if (!existingInsight && Math.random() > 0.7) { // 30% chance per day
        await Notification.create({
            user: userId,
            type: 'insight',
            title: 'Wellness Tip',
            message: 'Staying hydrated improves energy levels by up to 20%. Drink a glass of water now!',
            link: '/wellness'
        });
    }
};

export const getNotifications = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;

        // Trigger smart generation
        await generateSmartNotifications(userId);

        const notifications = await Notification.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(20); // Last 20 notifications

        res.json(notifications);
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const markAsRead = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { id } = req.params;

        // If ID is 'all', mark all as read
        if (id === 'all') {
            await Notification.updateMany(
                { user: userId, isRead: false },
                { $set: { isRead: true } }
            );
            res.json({ message: 'All marked as read' });
            return;
        }

        const notification = await Notification.findOneAndUpdate(
            { _id: id, user: userId },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            res.status(404).json({ message: 'Notification not found' });
            return;
        }

        res.json(notification);
    } catch (error) {
        console.error('Mark read error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Internal function to create notification manually (e.g. from other controllers)
export const createNotificationInternal = async (userId: string, type: string, title: string, message: string, link?: string) => {
    try {
        await Notification.create({ user: userId, type, title, message, link });
    } catch (error) {
        console.error('Failed to create internal notification', error);
    }
};
