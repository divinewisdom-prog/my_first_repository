import mongoose from 'mongoose';
import User from '../models/User';
import dotenv from 'dotenv';
import path from 'path';

// Load env from parent directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

const fixUser = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI not found in env');
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const email = 'abdultareeqibrahim@gmail.com';

        // Delete existing
        const deleted = await User.deleteOne({ email });
        console.log(`🗑️ Deleted ${deleted.deletedCount} existing user(s)`);

        // Create fresh
        await User.create({
            name: 'Abdul Tareeq',
            email: email,
            password: 'password123',
            role: 'patient',
            otp: '123456',
            otpExpires: new Date(Date.now() + 3600000) // 1 hour
        });
        console.log('✨ Created fresh user with password: password123');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

fixUser();
