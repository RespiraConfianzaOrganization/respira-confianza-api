const models = require("../../models");

const searchStations = async (req, res) => {
  const { city_id } = req.query;
  const stations = await models.Station.findAll({
    where: {
      city_id,
    }
  });
  const city = await models.City.findOne({
    where: { id: city_id }
  })
  return res.status(200).json({ stations, city });
}

const statusStation = async (req, res) => {
  const { id } = req.params;
  const pollutants = []
  const readings = []
  if (!id) {
    return res.status(400).json({ message: 'Debe ingresar un id' });
  }
  const station = await models.Station.findOne({
    where: {
      id,
    },
    include: {
      model: models.Pollutant_Station
    }
  });

  if (!station) {
    return res.status(400).json({ message: 'Estación no encontrada' });
  }

  return res.status(200).json({ station, pollutants, readings });
}

module.exports = {
  searchStations,
  statusStation
}