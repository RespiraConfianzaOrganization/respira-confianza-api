'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Station_Readings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Station_Readings.belongsTo(models.Station, { foreignKey: 'station_id' })
    }
  };
  Station_Readings.init({
    station_id: DataTypes.INTEGER,
    contaminant_1: DataTypes.FLOAT,
    contaminant_2: DataTypes.FLOAT,
    contaminant_3: DataTypes.FLOAT,
    contaminant_4: DataTypes.FLOAT,
    contaminant_5: DataTypes.FLOAT,
    contaminant_6: DataTypes.FLOAT,
    recorded_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Station_Readings',
  });
  return Station_Readings;
};