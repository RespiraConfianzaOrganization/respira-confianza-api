'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Station extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Station.hasMany(models.Sensor_Instance, { foreignKey: 'station_id' })
    }
  };
  Station.init({
    private_key: DataTypes.STRING,
    name: DataTypes.STRING,
    country: DataTypes.STRING,
    city: DataTypes.STRING,
    latitude: DataTypes.STRING,
    longitude: DataTypes.STRING,
    status: DataTypes.STRING,
    creation_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Station',
  });
  return Station;
};