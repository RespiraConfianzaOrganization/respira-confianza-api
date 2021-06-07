'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pollutant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here}      
      Pollutant.belongsToMany(models.Station, {
        through: "Pollutant_Station",
        foreignKey: "pollutant",
        otherKey: "station_id",
      });
      Pollutant.belongsToMany(models.Station, {
        through: "Pollutant_Station",
        foreignKey: "pollutant",
        otherKey: "station_id",
      });
      Pollutant.hasOne(models.Umbrals, { foreignKey: 'pollutant', onDelete: 'cascade', hooks: true })
      Pollutant.hasMany(models.Pollutant_Station, { foreignKey: "pollutant" });
    }
  };
  Pollutant.init({
    name: { primaryKey: true, type: DataTypes.STRING },
    extendedName: DataTypes.STRING,
    unit: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Pollutant',
    timestamps: false,
  });
  return Pollutant;
};