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
      Station.belongsToMany(models.Pollutant, {
        through: "Pollutant_Station",
        foreignKey: "station_id",
        otherKey: "pollutant_id",
      });
      Station.hasMany(models.Pollutant_Station, { foreignKey: "station_id" });
      Station.hasMany(models.Pollutant_Station, { foreignKey: "station_id" });
      Station.belongsTo(models.City, { foreignKey: "city_id" });
    }
  };
  Station.init({
    private_key: DataTypes.STRING,
    name: DataTypes.STRING,
    city_id: DataTypes.INTEGER,
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
    status: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Station',
    timestamps: false
  });
  return Station;
};