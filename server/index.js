const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const uploadRoutes = require('./routes/upload');
const processRoutes = require('./routes/process');
const clipsRoutes = require('./routes/clips');
const downloadRoutes = require('./routes/download');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure storage directories exist
const dirs = ['uploads', 'clips', 'thumbnails'];
dirs.forEach((dir) => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  })
);
app.use(express.json());

// Rate limiters
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { error: 'Too many upload requests. Please try again later.' },
});

const processLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many processing requests. Please try again later.' },
});

const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests. Please try again later.' },
});

// Serve thumbnails statically
app.use('/thumbnails', readLimiter, express.static(path.join(__dirname, 'thumbnails')));

// Routes
app.use('/api', uploadLimiter, uploadRoutes);
app.use('/api', processLimiter, processRoutes);
app.use('/api', readLimiter, clipsRoutes);
app.use('/api', readLimiter, downloadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'S/Clipps server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`S/Clipps server running on port ${PORT}`);
});

module.exports = app;
