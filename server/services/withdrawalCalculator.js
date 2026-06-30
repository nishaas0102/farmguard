const moment = require('moment') || null;

/**
 * Calculate withdrawal end dates based on drug and treatment info
 * @param {Object} drug - Drug model instance
 * @param {Object} animal - Animal model instance
 * @param {Date} treatmentEndDate - Date treatment ended
 * @returns {Object} - Withdrawal dates for meat, milk, egg and safe sale date
 */
function calculateWithdrawalDates(drug, animal, treatmentEndDate) {
  const endDate = new Date(treatmentEndDate);

  const result = {
    withdrawal_end_date_meat: null,
    withdrawal_end_date_milk: null,
    withdrawal_end_date_egg: null,
    safe_sale_date: null,
  };

  // Calculate meat withdrawal
  if (drug.withdrawal_days_meat) {
    const meatDate = new Date(endDate);
    meatDate.setDate(meatDate.getDate() + drug.withdrawal_days_meat);
    result.withdrawal_end_date_meat = meatDate;
  }

  // Calculate milk withdrawal (only for cattle, buffalo, goat)
  if (drug.withdrawal_days_milk && ['cattle', 'buffalo', 'goat'].includes(animal.species)) {
    const milkDate = new Date(endDate);
    milkDate.setDate(milkDate.getDate() + drug.withdrawal_days_milk);
    result.withdrawal_end_date_milk = milkDate;
  }

  // Calculate egg withdrawal (only for poultry)
  if (drug.withdrawal_days_egg && animal.species === 'poultry') {
    const eggDate = new Date(endDate);
    eggDate.setDate(eggDate.getDate() + drug.withdrawal_days_egg);
    result.withdrawal_end_date_egg = eggDate;
  }

  // Safe sale date is the latest of all applicable withdrawal dates
  const dates = [
    result.withdrawal_end_date_meat,
    result.withdrawal_end_date_milk,
    result.withdrawal_end_date_egg,
  ].filter(Boolean);

  if (dates.length > 0) {
    result.safe_sale_date = new Date(Math.max(...dates));
  }

  return result;
}

/**
 * Check if dosage is an overdose
 * @param {Object} drug - Drug model instance
 * @param {number} dosage - Actual dosage given
 * @param {number} weightKg - Animal weight in kg
 * @returns {boolean} - Whether this is an overdose
 */
function checkOverdose(drug, dosage, weightKg) {
  if (!drug.dosage_per_kg || !weightKg) return false;

  const maxSafeDose = drug.dosage_per_kg * weightKg;
  return dosage > maxSafeDose;
}

/**
 * Check if treatment violates MRL
 * @param {Object} drug - Drug model instance
 * @param {number} dosage - Actual dosage given
 * @param {number} weightKg - Animal weight in kg
 * @returns {boolean} - Whether this is an MRL violation
 */
function checkMRLViolation(drug, dosage, weightKg) {
  if (!drug.mrl_limit_mg_kg || !weightKg) return false;

  // Simple MRL check: if dosage per kg exceeds MRL limit
  const dosagePerKg = dosage / weightKg;
  return dosagePerKg > drug.mrl_limit_mg_kg;
}

/**
 * Get days remaining until safe sale
 * @param {Date} safeSaleDate - The safe sale date
 * @returns {number} - Days remaining (0 if past)
 */
function getDaysUntilSafeSale(safeSaleDate) {
  if (!safeSaleDate) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const saleDate = new Date(safeSaleDate);
  saleDate.setHours(0, 0, 0, 0);

  const diffTime = saleDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays);
}

module.exports = {
  calculateWithdrawalDates,
  checkOverdose,
  checkMRLViolation,
  getDaysUntilSafeSale,
};
