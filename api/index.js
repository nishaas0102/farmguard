const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('../server/routes/auth'));
app.use('/api/farms', require('../server/routes/farms'));
app.use('/api/animals', require('../server/routes/animals'));
app.use('/api/drugs', require('../server/routes/drugs'));
app.use('/api/amu', require('../server/routes/amu'));
app.use('/api/alerts', require('../server/routes/alerts'));
app.use('/api/risk', require('../server/routes/risk'));
app.use('/api/analytics', require('../server/routes/analytics'));
app.use('/api/weather', require('../server/routes/weather'));
app.use('/api/schemes', require('../server/routes/schemes'));

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
