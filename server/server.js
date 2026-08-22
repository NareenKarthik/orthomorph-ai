import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, getDbStatus } from './config/db.js';
import { seedDatabase } from './seed.js';
import authRoutes from './routes/auth.js';
import patientRoutes from './routes/patients.js';
import reportRoutes from './routes/reports.js';
import dispatchRoutes from './routes/dispatch.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request Logger (Development)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.originalUrl.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Health / Status check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = getDbStatus();
  return res.json({
    status: 'online',
    service: 'OrthoMorph AI Medical Backend & MongoDB Gateway',
    version: '2.4.0',
    timestamp: new Date().toISOString(),
    database: dbStatus,
  });
});

// API Routes Registration
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/dispatch', dispatchRoutes);

// Root test endpoint
app.get('/', (req, res) => {
  res.send('OrthoMorph AI Medical API Server & MongoDB Service is running.');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message,
  });
});

// Server Initialization
const startServer = async () => {
  try {
    // Connect to MongoDB (Standard or Embedded Fallback)
    await connectDB();

    // Auto-seed default specialist accounts and cases
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 [Server Ready] OrthoMorph Medical API listening on http://localhost:${PORT}`);
      console.log(`🩺 [Auth API] http://localhost:${PORT}/api/auth/status`);
      console.log(`🔬 [MongoDB Gateway] Active & ready for client requests`);
    });
  } catch (err) {
    console.error('❌ Failed to start OrthoMorph server:', err);
    process.exit(1);
  }
};

startServer();
