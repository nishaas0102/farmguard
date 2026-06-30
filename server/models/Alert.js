const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Alert = sequelize.define('Alert', {
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
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  type: {
    type: DataTypes.ENUM('mrl_violation', 'withdrawal_breach', 'overdose', 'risk_escalation', 'critical_antibiotic'),
    allowNull: false,
  },
  severity: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  is_resolved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  resolved_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  resolved_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  related_amu_log_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'amu_logs',
      key: 'id',
    },
  },
}, {
  tableName: 'alerts',
  timestamps: true,
});

module.exports = Alert;
