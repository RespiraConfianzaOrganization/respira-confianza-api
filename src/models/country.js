'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Country extends Model {
    static associate(models) {
      Country.hasMany(models.City, { foreignKey: "country_id" });
    }
  };
  Country.init({
    name: DataTypes.STRING,
    code: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Country',
    timestamps: false
  });
  return Country;
};