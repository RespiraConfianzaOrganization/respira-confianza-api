const models = require("../../models");
const sequelize = require('sequelize');
const moment = require("moment");

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

const stationStatus = async (req, res) => {
  const { id } = req.params;
  let pollutants = [];

  if (!id) {
    return res.status(400).json({ message: 'Debe ingresar un id' });
  }

  const station = await models.Station.findOne({
    where: {
      id,
    },
    include: {
      model: models.Pollutant,
      attributes: ['name', 'unit']
    }
  });

  if (!station) {
    return res.status(400).json({ message: 'Estación no encontrada' });
  }

  pollutants = station.Pollutants
  let { readings } = await last24HoursByStation({ stationId: id, pollutants })

  return res.status(200).json({ station, pollutants, readings });
}

const stationStatusByPollutant = async (req, res) => {
  const { pollutant } = req.params;

  if (!pollutant) {
    return res.status(400).json({ message: 'Debe ingresar un contaminante' });
  }

  const stations = await models.Station.findAll({
    attributes: ["id", "name", "latitude", "longitude"],
    include: {
      model: models.Pollutant,
      attributes: ['name', 'unit'],
      where: { name: pollutant }
    }
  });

  const umbrals = await models.Umbrals.findOne({
    attributes: { exclude: ['created_at', 'updated_at'] },
    where: {
      pollutant
    }
  })

  const readings = [];

  return res.status(200).json({ stations, umbrals, readings });
}

const last24HoursByStation = async ({ stationId, pollutants }) => {
  //LAST 24 HOURS READINGS 
  const yesterdayDate = moment().subtract(1, "days").format("YYYY-MM-DD HH:mm:ss");
  const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");

  const pollutantsNames = pollutants.map(pollutant => pollutant.name)
  let averages = ''
  if (pollutantsNames.length > 0) {
    averages += ', '
    averages += pollutantsNames.map(pollutant => `TRUNC(AVG("${pollutant}")) as "AVG${pollutant}"`).join(", ")
  }

  const rawQuery = `
    SELECT * 
    FROM (
      SELECT to_char(time, 'YYYY-MM-DD HH24:00') as hour FROM generate_series(:yesterdayDate, :currentDate, interval '1' hour) time ) as LASTHOURS
      LEFT JOIN (
        SELECT to_char(date_trunc('hour', recorded_at),'YYYY-MM-DD HH24:00') as date ${averages}
        FROM ( 
          SELECT *
          FROM "Station_Readings"
          WHERE (station_id= :stationId AND recorded_at between :yesterdayDate and :currentDate)) AS RECORDS
        GROUP BY date) AS GROUPEDRECORDS
    on LASTHOURS.hour=GROUPEDRECORDS.date;`

  const readings = await models.sequelize.query(rawQuery, {
    raw: true,
    type: sequelize.QueryTypes.SELECT,
    replacements: {
      stationId, currentDate, yesterdayDate
    }
  })
  return { readings }
}

module.exports = {
  searchStations,
  stationStatus,
  stationStatusByPollutant
}