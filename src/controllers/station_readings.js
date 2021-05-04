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
      TEMP: body.TEMP,
      PRESS: body.PRESS,
      HR: body.HR,
    }
    // Search actual pollutants of the station
    const pollutants = station.Pollutants
    for (i = 0; i < pollutants.length; i++) {
      const pollutant = pollutants[i]
      // Check if pollutant use auxiliar sensor
      const jsonData = body[pollutants[i].name]
      if (jsonData) {
        if (pollutant.useAuxiliar) {
          // Calculate concentration with model
          const prom_r = jsonData['prom_r']
          data[pollutants[i].name] = prom_r
        }
        else {
          data[`${pollutants[i].name}`] = jsonData['prom']
        }
      }
    }

    await db.Station_Readings.create(
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