import './loadEnv.js';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import authMiddleware from './middleware/auth.js';
import { simulateScheduler } from './controllers/cpuController.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'https://cpu-scheduler-taupe.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => {
        console.error('❌ MongoDB Connection Error Details:');
        console.error('Error Name:', err.name);
        console.error('Error Message:', err.message);
        if (err.reason) console.error('Error Reason:', err.reason);
    });

// Routes
app.use('/api/auth', authRoutes);

// CPU Scheduler route (protected)
app.post('/simulate', authMiddleware, simulateScheduler);

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Server is running',
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
