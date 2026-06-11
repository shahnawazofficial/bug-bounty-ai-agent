const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth.routes');
const repoRoutes = require('./routes/repo.routes');
const scanRoutes = require('./routes/scan.routes');
const vulnRoutes = require('./routes/vuln.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'https://bugbountyai.in',
  'https://www.bugbountyai.in',
  'http://localhost:5173',
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), service: 'Bug Bounty AI Agent API' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/repos', repoRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/vulnerabilities', vulnRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Bug Bounty AI Agent API running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health\n`);
});

module.exports = app;
