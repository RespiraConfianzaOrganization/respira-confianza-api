'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sensor_Instance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Sensor_Instance.belongsTo(models.Sensor_Type, { foreignKey: 'sensor_type_id' })
      Sensor_Instance.belongsTo(models.Station, { foreignKey: 'station_id' })
    }
  };
  Sensor_Instance.init({
    station_id: DataTypes.INTEGER,
    sensor_type_id: DataTypes.INTEGER,
    status: DataTypes.STRING,
    name_station_readings: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Sensor_Instance',
    timestamps: false
  });
  return Sensor_Instance;
};