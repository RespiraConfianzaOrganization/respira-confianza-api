'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class City extends Model {
    static associate(models) {
      City.belongsTo(models.Country, { foreignKey: 'country' })
      City.hasMany(models.Station, { foreignKey: 'city_id' })
      City.hasMany(models.Admin, { foreignKey: 'city_id' })
    }
  };
  City.init({
    name: DataTypes.STRING,
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
    country: DataTypes.INTEGER,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'City',
    timestamps: false
  });
  return City;
};