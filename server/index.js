import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

console.log('CORS: Allowing origins:', allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Routes
console.log('Registering routes...');
app.use('/api/auth', authRoutes);
console.log(' - /api/auth registered');
app.use('/api/game', gameRoutes);
console.log(' - /api/game registered');
app.use('/api/leaderboard', leaderboardRoutes);
console.log(' - /api/leaderboard registered');

// Test route to ensure /api is reachable
app.get('/api/test', (req, res) => {
  res.json({ message: 'API root is working!' });
});

// Catch-all 404 for /api
app.use('/api/*', (req, res) => {
  console.log(`404: No route found for ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `API Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'DEALMIND API is running 🎯' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  🎯 DEALMIND Server running on port ${PORT}
  📡 API: http://localhost:${PORT}/api
  🏥 Health: http://localhost:${PORT}/api/health
  `);
});
