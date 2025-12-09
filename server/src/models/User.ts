import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'doctor' | 'admin' | 'nurse' | 'patient';
    specialty?: string;
    phone?: string;
    location?: string;
    rating?: number;
    experience?: string;
    hospital?: string;
    otp?: string;
    otpExpires?: Date;
    matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['doctor', 'admin', 'nurse', 'patient'], default: 'patient' },
    specialty: { type: String },
    phone: { type: String },
    location: { type: String },
    rating: { type: Number, default: 0 },
    experience: { type: String },
    hospital: { type: String },
    otp: { type: String },
    otpExpires: { type: Date }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
