const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AmuLog = sequelize.define('AmuLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  animal_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'animals',
      key: 'id',
    },
  },
  farm_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'farms',
      key: 'id',
    },
  },
  drug_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'drugs',
      key: 'id',
    },
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  vet_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  dosage: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: false,
  },
  dosage_unit: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  frequency: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  duration_days: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  reason: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  treatment_start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  treatment_end_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  withdrawal_end_date_meat: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  withdrawal_end_date_milk: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  withdrawal_end_date_egg: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  safe_sale_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  is_overdose: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  is_mrl_violation: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  prescription_id: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
}, {
  tableName: 'amu_logs',
  timestamps: true,
});

module.exports = AmuLog;
