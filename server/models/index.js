const sequelize = require('../config/database');
const User = require('./User');
const Farm = require('./Farm');
const Animal = require('./Animal');
const Drug = require('./Drug');
const AmuLog = require('./AmuLog');
const Alert = require('./Alert');
const RiskAssessment = require('./RiskAssessment');

// User -> Farm (one-to-many)
User.hasMany(Farm, { foreignKey: 'owner_id', as: 'farms' });
Farm.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

// Farm -> Animal (one-to-many)
Farm.hasMany(Animal, { foreignKey: 'farm_id', as: 'animals' });
Animal.belongsTo(Farm, { foreignKey: 'farm_id', as: 'farm' });

// Animal -> AmuLog (one-to-many)
Animal.hasMany(AmuLog, { foreignKey: 'animal_id', as: 'amuLogs' });
AmuLog.belongsTo(Animal, { foreignKey: 'animal_id', as: 'animal' });

// Farm -> AmuLog (one-to-many)
Farm.hasMany(AmuLog, { foreignKey: 'farm_id', as: 'amuLogs' });
AmuLog.belongsTo(Farm, { foreignKey: 'farm_id', as: 'farm' });

// Drug -> AmuLog (one-to-many)
Drug.hasMany(AmuLog, { foreignKey: 'drug_id', as: 'amuLogs' });
AmuLog.belongsTo(Drug, { foreignKey: 'drug_id', as: 'drug' });

// User -> AmuLog (one-to-many) - logged by
User.hasMany(AmuLog, { foreignKey: 'user_id', as: 'loggedTreatments' });
AmuLog.belongsTo(User, { foreignKey: 'user_id', as: 'loggedBy' });

// User -> AmuLog (one-to-many) - vet
User.hasMany(AmuLog, { foreignKey: 'vet_id', as: 'vetTreatments' });
AmuLog.belongsTo(User, { foreignKey: 'vet_id', as: 'vet' });

// Farm -> Alert (one-to-many)
Farm.hasMany(Alert, { foreignKey: 'farm_id', as: 'alerts' });
Alert.belongsTo(Farm, { foreignKey: 'farm_id', as: 'farm' });

// User -> Alert (one-to-many)
User.hasMany(Alert, { foreignKey: 'user_id', as: 'alerts' });
Alert.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Alert resolved by User
Alert.belongsTo(User, { foreignKey: 'resolved_by', as: 'resolvedBy' });

// AmuLog -> Alert (one-to-many)
AmuLog.hasMany(Alert, { foreignKey: 'related_amu_log_id', as: 'alerts' });
Alert.belongsTo(AmuLog, { foreignKey: 'related_amu_log_id', as: 'amuLog' });

// Farm -> RiskAssessment (one-to-many)
Farm.hasMany(RiskAssessment, { foreignKey: 'farm_id', as: 'riskAssessments' });
RiskAssessment.belongsTo(Farm, { foreignKey: 'farm_id', as: 'farm' });

module.exports = {
  sequelize,
  User,
  Farm,
  Animal,
  Drug,
  AmuLog,
  Alert,
  RiskAssessment,
};
