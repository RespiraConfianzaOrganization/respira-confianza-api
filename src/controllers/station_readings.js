const models = require('../models');

const getStationReadings = async (req, res) => {
  const limit = req.query.limit || 10;
  const page = req.query.page || 0;
  const offset = page * limit;
  const station = req.query.station || -1;

  let options = {
    limit,
    offset,
    include: {
      model: models.Station
    },
    order: [['recorded_at', 'DESC']]
  };
  if (station != -1) {
    options.where = { station_id: station }
  }

  const readings = await models.Station_Readings.findAndCountAll(options);
  return res.status(200).json({ readings: readings.rows, countAllReadings: readings.count })
};

module.exports = {
  getStationReadings,
}