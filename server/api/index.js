const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('../routes/auth'));
app.use('/api/farms', require('../routes/farms'));
app.use('/api/animals', require('../routes/animals'));
app.use('/api/drugs', require('../routes/drugs'));
app.use('/api/amu', require('../routes/amu'));
app.use('/api/alerts', require('../routes/alerts'));
app.use('/api/risk', require('../routes/risk'));
app.use('/api/analytics', require('../routes/analytics'));
app.use('/api/weather', require('../routes/weather'));
app.use('/api/schemes', require('../routes/schemes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

module.exports = app;
