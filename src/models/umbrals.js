'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Umbrals extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Umbrals.belongsTo(models.Pollutant, { foreignKey: 'pollutant' })
    }
  };
  Umbrals.init({
    pollutant: DataTypes.STRING,
    good: DataTypes.FLOAT,
    moderate: DataTypes.FLOAT,
    unhealthy: DataTypes.FLOAT,
    very_unhealthy: DataTypes.FLOAT,
    dangerous: DataTypes.FLOAT,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Umbrals',
    timestamps: false
  });
  return Umbrals;
};