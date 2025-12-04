import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import patientRoutes from './routes/patientRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import medicalRecordRoutes from './routes/medicalRecordRoutes';
import vitalRoutes from './routes/vitalRoutes';
import wellnessRoutes from './routes/wellnessRoutes';

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cors({
    origin: ['https://welllink-health.vercel.app', 'http://localhost:5173'],
    credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/vitals', vitalRoutes);
app.use('/api/wellness', wellnessRoutes);

app.get('/', (req, res) => {
    res.send('Well-Link API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});