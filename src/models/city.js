'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class City extends Model {
    static associate(models) {
      City.belongsTo(models.Country, { foreignKey: 'country_id' })
      //City.belongsTo(models.Station, { foreignKey: 'city_id' })
    }
  };
  City.init({
    name: DataTypes.STRING,
    country_id: DataTypes.INTEGER,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'City',
    timestamps: false
  });
  return City;
};