require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');
const { startCronJobs } = require('./services/cronJobs');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // Start cron jobs
    startCronJobs();

    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();
