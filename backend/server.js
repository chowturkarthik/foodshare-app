const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const orphanageRoutes = require('./routes/orphanageRoutes');
const userRoutes = require('./routes/userRoutes');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') res.sendStatus(200);
  else next();
});

// MongoDB Connection
mongoose.connect(process.env.DB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
  });

// Routes
app.use('/api/orphanages', orphanageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin/orphanages', authMiddleware, orphanageRoutes);
app.use('/api/admin/users', authMiddleware, userRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'FoodShare API is running! Use /api/orphanages' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = server;
