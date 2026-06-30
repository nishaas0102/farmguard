const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RiskAssessment = sequelize.define('RiskAssessment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  farm_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'farms',
      key: 'id',
    },
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  level: {
    type: DataTypes.ENUM('green', 'yellow', 'red'),
    defaultValue: 'green',
  },
  treatment_frequency_score: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  overdose_score: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  mrl_violation_score: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  critical_antibiotic_score: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  assessment_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'risk_assessments',
  timestamps: true,
});

module.exports = RiskAssessment;
