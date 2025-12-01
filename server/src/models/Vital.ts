import mongoose from 'mongoose';

const vitalSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    bloodPressure: { type: String }, // e.g., "120/80"
    heartRate: { type: Number },     // bpm
    temperature: { type: Number },   // Celsius
    respiratoryRate: { type: Number },
    oxygenSaturation: { type: Number }, // %
    weight: { type: Number },        // kg
    height: { type: Number },        // cm
    notes: { type: String },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

const Vital = mongoose.model('Vital', vitalSchema);
export default Vital;
