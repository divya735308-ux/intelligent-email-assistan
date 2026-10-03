const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { connectDB, getDbStatus } = require('./config/db');
const emailRoutes = require('./routes/emailRoutes');
const aiRoutes = require('./routes/aiRoutes');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow Vite dev server and any local client
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging in dev
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`📡 ${req.method} ${req.originalUrl}`);
    next();
  });
}

// Mount Routes
app.use('/api/emails', emailRoutes);
app.use('/api/ai', aiRoutes);

// Health check & System Status endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Intelligent Email Assistant API',
    database: getDbStatus()
  });
});

// Serve frontend static build files in production (if built)
const frontendDistPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));

  // SPA fallback for React Router (skip API routes)
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  // Root API Welcome (Fallback when frontend is not yet built)
  app.get('/', (req, res) => {
    res.json({
      message: 'Welcome to Intelligent Email Assistant API',
      version: '1.0.0',
      documentation: '/api/health',
      endpoints: {
        emails: '/api/emails',
        stats: '/api/emails/stats',
        search: '/api/emails/search?q=keyword',
        reset: 'POST /api/emails/reset',
        analyze: 'POST /api/emails/:id/analyze',
        reply: 'POST /api/emails/:id/generate-reply'
      }
    });
  });
}

// Error handling middleware
app.use(errorHandler);

// Start Server
const server = app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Intelligent Email Assistant Backend running on:`);
  console.log(`   http://localhost:${PORT}`);
  console.log(`   Health Check: http://localhost:${PORT}/api/health`);
  console.log(`======================================================\n`);
});

connectDB().catch(err => {
  console.warn('DB connection attempt caught:', err.message);
});

module.exports = { app, server };
