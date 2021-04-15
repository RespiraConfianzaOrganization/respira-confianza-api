const db = require('../models');
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

const receiveReading = async (req, res) => {
  const private_key = req.body.privateKey
  const body = req.body
  if (!private_key) {
    return res.status(400).json({ message: "Debe ingresar la clave secreta de la estación" });
  }
  //Validate private Key
  const station = await models.Station.findOne({
    where: { private_key },
    include: {
      model: models.Pollutant,
    },
  });
  if (!station) {
    return res.status(404).json({ message: "Clave incorrecta" });
  }
  try {
    let data = {
      station_id: station.id,
      Temperatura: body.Temperatura,
      Presion: body.Presion,
      Humedad: body.Humedad,
    }
    // Buscar contaminantes activos
    const pollutants = station.Pollutants
    for (i = 0; i < pollutants.length; i++) {
      const value = body[pollutants[i].name]
      data[pollutants[i].name] = value
    }

    const reading = await db.Station_Readings.create(
      data
    )
    return res.status(201).json({ message: "Datos ingresados correctamente" });
  } catch (e) {
    return res.status(503).json({ message: "Hubo un error" });
  }
}

module.exports = {
  getStationReadings,
  receiveReading
}