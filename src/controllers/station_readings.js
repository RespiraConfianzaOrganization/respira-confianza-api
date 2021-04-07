const models = require('../models');

const getStationReadings = async (req, res) => {
  //TODO: PAGINATION
  const readings = await models.Station_Readings.findAll({
    include: {
      model: models.Station
    },
    order: [['recorded_at', 'DESC']]
  });
  return res.status(200).json({ readings })
};

module.exports = {
  getStationReadings
}