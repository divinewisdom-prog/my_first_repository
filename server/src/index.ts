import express from 'express';
import { createServer } from 'http';
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
import notificationRoutes from './routes/notifications';
import messageRoutes from './routes/messageRoutes';
import { initializeSocket } from './socket';

dotenv.config();

connectDB();

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
initializeSocket(httpServer);

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
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.get('/', (req, res) => {
    res.send('Well-Link API is running...');
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT} with Socket.io`);
});