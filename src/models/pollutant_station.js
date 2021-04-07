'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pollutant_Station extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Pollutant_Station.belongsTo(models.Pollutant, { foreignKey: 'pollutant_id' })
      Pollutant_Station.belongsTo(models.Station, { foreignKey: 'station_id' })
    }
  };
  Pollutant_Station.init({
    station_id: DataTypes.INTEGER,
    pollutant_id: DataTypes.INTEGER,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Pollutant_Station',
    timestamps: false
  });
  return Pollutant_Station;
};