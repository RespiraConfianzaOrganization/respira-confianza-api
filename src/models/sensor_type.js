'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sensor_Type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Sensor_Type.hasMany(models.Sensor_Instance, { foreignKey: 'sensor_type_id' })
      Sensor_Type.hasOne(models.Umbrals, { foreignKey: 'sensor_type_id' })
    }
  };
  Sensor_Type.init({
    type: DataTypes.STRING,
    unit: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Sensor_Type',
    timestamps: false
  });
  return Sensor_Type;
};