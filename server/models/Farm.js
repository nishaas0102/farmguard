const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Farm = sequelize.define('Farm', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  owner_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  district: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  state: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  area_acres: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  risk_score: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  risk_level: {
    type: DataTypes.ENUM('green', 'yellow', 'red'),
    defaultValue: 'green',
  },
}, {
  tableName: 'farms',
  timestamps: true,
});

module.exports = Farm;
