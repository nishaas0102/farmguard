const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Drug = sequelize.define('Drug', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  generic_name: {
    type: DataTypes.STRING(150),
    allowNull: true,
  },
  drug_class: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  who_category: {
    type: DataTypes.ENUM('AWaRe', 'Access', 'Watch', 'Reserve', 'Not Listed'),
    defaultValue: 'Not Listed',
  },
  is_critical: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  mrl_limit_mg_kg: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: true,
  },
  mrl_species: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  withdrawal_days_meat: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  withdrawal_days_milk: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  withdrawal_days_egg: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  dosage_per_kg: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: true,
  },
  unit: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  route: {
    type: DataTypes.ENUM('oral', 'injection', 'topical', 'intramammary', 'intramuscular', 'subcutaneous'),
    defaultValue: 'oral',
  },
}, {
  tableName: 'drugs',
  timestamps: true,
});

module.exports = Drug;
