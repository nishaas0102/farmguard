const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Animal = sequelize.define('Animal', {
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
  tag_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  species: {
    type: DataTypes.ENUM('cattle', 'poultry', 'goat', 'sheep', 'swine', 'buffalo', 'fish'),
    allowNull: false,
  },
  breed: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  weight_kg: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true,
  },
  date_of_birth: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  gender: {
    type: DataTypes.ENUM('male', 'female'),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'sold', 'deceased', 'slaughtered'),
    defaultValue: 'active',
  },
}, {
  tableName: 'animals',
  timestamps: true,
});

module.exports = Animal;
