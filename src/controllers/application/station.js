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


module.exports = {
  searchStations
}