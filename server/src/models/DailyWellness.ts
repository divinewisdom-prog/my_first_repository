import mongoose from 'mongoose';

const dailyTaskSchema = new mongoose.Schema({
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    points: { type: Number, default: 10 }
}, { _id: false });

const dailyWellnessSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },

    // Core Wellness Metrics
    energyLevel: { type: Number, min: 1, max: 10, required: true },
    mood: {
        type: String,
        enum: ['great', 'good', 'okay', 'low', 'bad'],
        required: true
    },
    sleepHours: { type: Number, min: 0, max: 24, required: true },
    waterGlasses: { type: Number, min: 0, default: 0 },
    exerciseMinutes: { type: Number, min: 0, default: 0 },

    // Optional Vital Signs
    heartRate: { type: Number, min: 0 },
    bloodPressure: {
        systolic: { type: Number, min: 0 },
        diastolic: { type: Number, min: 0 }
    },
    spO2: { type: Number, min: 0, max: 100 },

    // Notes and Tasks
    notes: { type: String },
    dailyTasks: [dailyTaskSchema]
}, {
    timestamps: true
});

// Index for efficient querying by user and date
dailyWellnessSchema.index({ user: 1, date: -1 });

const DailyWellness = mongoose.model('DailyWellness', dailyWellnessSchema);
export default DailyWellness;
