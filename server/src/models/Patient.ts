import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    contactNumber: { type: String, required: true },
    address: { type: String },
    medicalHistory: [{ type: String }],
    allergies: [{ type: String }],
    currentMedications: [{ type: String }],
    assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;
