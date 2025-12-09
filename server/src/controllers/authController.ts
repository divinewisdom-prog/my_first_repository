import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import { sendOtpEmail } from '../utils/emailService';

const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role, specialty, phone, location, rating, experience } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            res.status(400).json({ message: 'Please provide name, email, and password' });
            return;
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'patient',
            specialty,
            phone,
            location,
            rating,
            experience
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                specialty: user.specialty,
                phone: user.phone,
                location: user.location,
                token: generateToken(user._id.toString()),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error: any) {
        console.error('Registration error:', error);
        res.status(500).json({
            message: 'Server error during registration',
            error: error.message
        });
    }
};

export const authUser = async (req: Request, res: Response) => {
    try {
        const { email, password, otp } = req.body;

        const user = await User.findOne({ email });

        // DEBUG: Deep logging
        if (user) {
            const isMatch = await user.matchPassword(password);
            console.log(`[AUTH DEBUG] User found: ${email}. Password match: ${isMatch}`);
        } else {
            console.log(`[AUTH DEBUG] User NOT found: ${email}`);
        }

        if (user && (await user.matchPassword(password))) {
            // 1. If OTP is provided, verify it
            if (otp) {
                const cleanOtp = otp.toString().trim();
                const storedOtp = user.otp ? user.otp.toString().trim() : '';

                console.log('--- OTP Verification Debug ---');
                console.log(`Received OTP: '${cleanOtp}'`);
                console.log(`Stored OTP:   '${storedOtp}'`);

                const isMatch = cleanOtp === storedOtp;
                const isNotExpired = user.otpExpires && new Date(user.otpExpires) > new Date();

                if (isMatch && isNotExpired) {
                    // Success: Clear OTP and log in
                    user.otp = undefined;
                    user.otpExpires = undefined;
                    await user.save();

                    res.json({
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        token: generateToken(user._id.toString()),
                    });
                    return;
                } else {
                    res.status(401).json({ message: 'Invalid or expired OTP' });
                    return;
                }
            }

            // 2. If no OTP, generate one and send email
            // DEBUG: Hardcoded OTP for testing
            const generatedOtp = '123456'; // Math.floor(100000 + Math.random() * 900000).toString();
            user.otp = generatedOtp;
            user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
            await user.save();

            await sendOtpEmail(user.email, generatedOtp);

            res.json({
                message: 'OTP sent to email',
                requireOtp: true,
                email: user.email
            });

        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error: any) {
        console.error('Auth error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

export const getDoctors = async (req: Request, res: Response) => {
    try {
        const doctors = await User.find({ role: 'doctor' }).select('-password');
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.role = req.body.role || user.role;
            user.specialty = req.body.specialty || user.specialty;
            user.phone = req.body.phone || user.phone;
            user.location = req.body.location || user.location;
            user.rating = req.body.rating !== undefined ? req.body.rating : user.rating;
            user.experience = req.body.experience || user.experience;
            user.hospital = req.body.hospital || user.hospital;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                specialty: updatedUser.specialty,
                phone: updatedUser.phone,
                location: updatedUser.location,
                rating: updatedUser.rating,
                experience: updatedUser.experience,
                hospital: updatedUser.hospital,
                token: generateToken(updatedUser._id.toString()),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
