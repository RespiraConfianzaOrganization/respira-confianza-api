const models = require('../../models');
const logger = require("../../../logger")

const receiveReading = async (req, res) => {
  const private_key = req.body.privateKey
  const body = req.body
  if (!private_key) {
    logger.info('receiveReading ' + 400);
    return res.status(400).json({ message: "Debe ingresar la clave secreta de la estación" });
  }
  //Validate private Key
  const station = await models.Station.findOne({
    where: { private_key },
    include: [
      {
        model: models.Pollutant_Station,
      }
    ],
  });
  if (!station) {
    logger.warning('receiveReading ' + 404);
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
    const pollutantStations = station.Pollutant_Stations
    for (i = 0; i < pollutantStations.length; i++) {
      const pollutantStation = pollutantStations[i]
      const concentration = body[pollutantStation.pollutant]
      if (concentration) {
        // Check if pollutant use auxiliar sensor
        if (pollutantStation.useAuxiliar) {
          // Calculate concentration with model
          data[pollutantStation.pollutant] = concentration
        }
        else {
          data[`${pollutantStation.pollutant}`] = concentration
        }
      }
    }

    await models.Station_Readings.create(
      data
    )
    logger.info('receiveReading ' + 201 + " " + station.name);
    return res.status(201).json({ message: "Datos ingresados correctamente" });
  } catch (e) {
    logger.error('receiveReading ' + 503);
    return res.status(503).json({ message: "Hubo un error" });
  }
}

module.exports = {
  receiveReading
}