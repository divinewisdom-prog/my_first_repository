import { Request, Response } from 'express';
import DailyWellness from '../models/DailyWellness';

// @desc    Create a new wellness entry
// @route   POST /api/wellness
// @access  Private
export const createWellnessEntry = async (req: Request, res: Response) => {
    const {
        energyLevel,
        mood,
        sleepHours,
        waterGlasses,
        exerciseMinutes,
        heartRate,
        bloodPressure,
        spO2,
        notes,
        dailyTasks
    } = req.body;

    try {
        // Get user ID from authenticated request
        const userId = (req as any).user._id;

        // Check if entry already exists for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const existingEntry = await DailyWellness.findOne({
            user: userId,
            date: { $gte: today, $lt: tomorrow }
        });

        if (existingEntry) {
            // Update existing entry
            existingEntry.energyLevel = energyLevel;
            existingEntry.mood = mood;
            existingEntry.sleepHours = sleepHours;
            existingEntry.waterGlasses = waterGlasses || 0;
            existingEntry.exerciseMinutes = exerciseMinutes || 0;
            existingEntry.heartRate = heartRate;
            existingEntry.bloodPressure = bloodPressure;
            existingEntry.spO2 = spO2;
            existingEntry.notes = notes;
            existingEntry.dailyTasks = dailyTasks;

            const updatedEntry = await existingEntry.save();
            return res.status(200).json(updatedEntry);
        }

        // Create new entry
        const wellnessEntry = new DailyWellness({
            user: userId,
            energyLevel,
            mood,
            sleepHours,
            waterGlasses: waterGlasses || 0,
            exerciseMinutes: exerciseMinutes || 0,
            heartRate,
            bloodPressure,
            spO2,
            notes,
            dailyTasks
        });

        const createdEntry = await wellnessEntry.save();
        res.status(201).json(createdEntry);
    } catch (error: any) {
        console.error('Error creating wellness entry:', error);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Get wellness history for authenticated user
// @route   GET /api/wellness
// @access  Private
export const getWellnessHistory = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const limit = parseInt(req.query.limit as string) || 30; // Default to last 30 days

        const history = await DailyWellness.find({ user: userId })
            .sort({ date: -1 })
            .limit(limit);

        res.json(history);
    } catch (error: any) {
        console.error('Error fetching wellness history:', error);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Get wellness statistics for authenticated user
// @route   GET /api/wellness/stats
// @access  Private
export const getWellnessStats = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const days = parseInt(req.query.days as string) || 7; // Default to last 7 days

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const entries = await DailyWellness.find({
            user: userId,
            date: { $gte: startDate }
        }).sort({ date: 1 });

        // Calculate averages
        const stats = {
            totalEntries: entries.length,
            averages: {
                energyLevel: 0,
                sleepHours: 0,
                waterGlasses: 0,
                exerciseMinutes: 0
            },
            moodDistribution: {
                great: 0,
                good: 0,
                okay: 0,
                low: 0,
                bad: 0
            },
            trends: entries.map(entry => ({
                date: entry.date,
                energyLevel: entry.energyLevel,
                mood: entry.mood,
                sleepHours: entry.sleepHours,
                waterGlasses: entry.waterGlasses,
                exerciseMinutes: entry.exerciseMinutes
            }))
        };

        if (entries.length > 0) {
            const sum = entries.reduce((acc, entry) => ({
                energyLevel: acc.energyLevel + entry.energyLevel,
                sleepHours: acc.sleepHours + entry.sleepHours,
                waterGlasses: acc.waterGlasses + entry.waterGlasses,
                exerciseMinutes: acc.exerciseMinutes + entry.exerciseMinutes
            }), { energyLevel: 0, sleepHours: 0, waterGlasses: 0, exerciseMinutes: 0 });

            stats.averages = {
                energyLevel: Math.round((sum.energyLevel / entries.length) * 10) / 10,
                sleepHours: Math.round((sum.sleepHours / entries.length) * 10) / 10,
                waterGlasses: Math.round((sum.waterGlasses / entries.length) * 10) / 10,
                exerciseMinutes: Math.round((sum.exerciseMinutes / entries.length) * 10) / 10
            };

            // Count mood distribution
            entries.forEach(entry => {
                stats.moodDistribution[entry.mood as keyof typeof stats.moodDistribution]++;
            });
        }

        res.json(stats);
    } catch (error: any) {
        console.error('Error fetching wellness stats:', error);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Delete a wellness entry
// @route   DELETE /api/wellness/:id
// @access  Private
export const deleteWellnessEntry = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const entry = await DailyWellness.findOne({
            _id: req.params.id,
            user: userId
        });

        if (!entry) {
            return res.status(404).json({ message: 'Wellness entry not found' });
        }

        await entry.deleteOne();
        res.json({ message: 'Wellness entry removed' });
    } catch (error: any) {
        console.error('Error deleting wellness entry:', error);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};
