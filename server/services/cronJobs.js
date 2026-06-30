const cron = require('node-cron');
const { Farm } = require('../models');
const { updateFarmRiskScore } = require('./riskEngine');

/**
 * Start all cron jobs
 */
function startCronJobs() {
  // Daily risk recalculation at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('[CRON] Starting daily risk recalculation...');

    try {
      const farms = await Farm.findAll();

      for (const farm of farms) {
        await updateFarmRiskScore(farm.id);
      }

      console.log(`[CRON] Risk recalculation complete for ${farms.length} farms`);
    } catch (error) {
      console.error('[CRON] Error during risk recalculation:', error);
    }
  });

  console.log('[CRON] Cron jobs scheduled');
}

module.exports = { startCronJobs };
