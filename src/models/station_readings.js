//TODO: ADD INDEX TO SEARCH
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
    MP10: DataTypes.FLOAT,
    MP25: DataTypes.FLOAT,
    MP1: DataTypes.FLOAT,
    SO2: DataTypes.FLOAT,
    O3: DataTypes.FLOAT,
    NO2: DataTypes.FLOAT,
    NO: DataTypes.FLOAT,
    C02: DataTypes.FLOAT,
    CO: DataTypes.FLOAT,
    COV: DataTypes.FLOAT,
    recorded_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Station_Readings',
    timestamps: false
  });
  return Station_Readings;
};