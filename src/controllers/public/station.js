const models = require("../../models");
const sequelize = require('sequelize');
const moment = require("moment");
const { UUID } = require("sequelize");

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
  const { id } = req.params
  let pollutants = [];

  if (!id) {
    return res.status(400).json({ message: 'Debe ingresar un id' });
  }

  const station = await models.Station.findOne({
    attributes: { exclude: ['private_key', 'created_at', 'updated_at'] },
    where: {
      id,
    },
    include: [
      {
        model: models.Pollutant,
        attributes: ['name', 'unit', 'extendedName']
      },
      {
        model: models.City,
        attributes: ['name']
      }
    ]
  });

  if (!station) {
    return res.status(404).json({ message: 'Estación no encontrada' });
  }

  pollutants = station.Pollutants

  const readingsLastHour = await lastHourStatusByStation({ stationIds: [id], pollutants })
  return res.status(200).json({ station, pollutants, readingsLastHour });
}

const stationStatusByPollutant = async (req, res) => {
  const { pollutant } = req.params;

  if (!pollutant) {
    return res.status(400).json({ message: 'Debe ingresar un contaminante' });
  }
  const pollutantObj = await models.Pollutant.findOne({
    attributes: { exclude: ['created_at', 'updated_at'] },
    where: {
      name: pollutant
    }
  })

  const stations = await models.Station.findAll({
    attributes: ["id", "name", "latitude", "longitude"],
    include: [
      {
        model: models.Pollutant,
        attributes: ['name', 'unit'],
        where: { name: pollutant },
      },
      {
        model: models.City,
        attributes: ['name'],
      }
    ]
  });

  const umbrals = await models.Umbrals.findOne({
    attributes: { exclude: ['created_at', 'updated_at'] },
    where: {
      pollutant
    }
  })
  const stationIds = stations.map(station => station.id)
  const readingsLastHour = await lastHourStatusByStation({ stationIds: stationIds, pollutants: [pollutantObj] })

  return res.status(200).json({ stations, umbrals, readingsLastHour });
}

const lastHourStatusByStation = async ({ stationIds, pollutants }) => {
  //LAST 24 HOURS READINGS 
  const oneHourBeforeDate = moment().subtract(1, "hour").format("YYYY-MM-DD HH:mm:ss");
  const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");

  const pollutantsNames = pollutants.map(pollutant => pollutant.name)
  pollutantsNames.push('TEMP')
  pollutantsNames.push('PRESS')
  pollutantsNames.push('HR')
  let averages = ''

  if (pollutantsNames.length > 0) {
    averages += ', '
    averages += pollutantsNames.map(pollutant => `TRUNC(AVG("${pollutant}")) as "AVG${pollutant}"`).join(", ")
  }

  const ids = stationIds.map(id => "'" + id + "'").join(',')
  const rawQuery = `
    SELECT *
    FROM (
      SELECT id from "Stations" WHERE (id = ANY(ARRAY[${ids}]::uuid[]))) as Stations
    LEFT JOIN (
        SELECT "station_id", max(to_char(date_trunc('hour', recorded_at),'HH24:00')) as hour ${averages}
        FROM ( 
          SELECT *
          FROM "Station_Readings"
          WHERE (station_id = ANY(ARRAY[${ids}]::uuid[]) AND recorded_at between :oneHourBeforeDate and :currentDate)) AS RECORDS
        GROUP BY station_id) AS GROUPED
    on GROUPED.station_id= Stations.id;`

  const readings = await models.sequelize.query(rawQuery, {
    raw: true,
    type: sequelize.QueryTypes.SELECT,
    replacements: {
      currentDate, oneHourBeforeDate
    }
  })

  return readings
}

const last24HoursStatusByStation = async (req, res) => {
  const { id } = req.params;
  let pollutants = [];

  if (!id) {
    return res.status(400).json({ message: 'Debe ingresar un id' });
  }

  const station = await models.Station.findOne({
    attributes: { exclude: ['private_key', 'created_at', 'updated_at'] },
    where: {
      id,
    },
    include: {
      model: models.Pollutant,
      attributes: ['name', 'unit']
    }
  });

  if (!station) {
    return res.status(404).json({ message: 'Estación no encontrada' });
  }

  pollutants = station.Pollutants
  //LAST 24 HOURS READINGS 
  const yesterdayDate = moment().subtract(1, "days").format("YYYY-MM-DD HH:mm:ss");
  const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");

  const pollutantsNames = pollutants.map(pollutant => pollutant.name)
  pollutantsNames.push('TEMP')
  pollutantsNames.push('PRESS')
  pollutantsNames.push('HR')
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
      stationId: id, currentDate, yesterdayDate
    }
  })

  return res.status(200).json({ readings });
}

const lastMonthStatusByStation = async (req, res) => {
  const { id } = req.params;
  let pollutants = [];

  if (!id) {
    return res.status(400).json({ message: 'Debe ingresar un id' });
  }

  const station = await models.Station.findOne({
    attributes: { exclude: ['private_key', 'created_at', 'updated_at'] },
    where: {
      id,
    },
    include: {
      model: models.Pollutant,
      attributes: ['name', 'unit']
    }
  });

  if (!station) {
    return res.status(404).json({ message: 'Estación no encontrada' });
  }

  pollutants = station.Pollutants
  //LAST 24 HOURS READINGS 
  const lastMonthDate = moment().subtract(1, 'months').format("YYYY-MM-DD");
  const currentDate = moment().format("YYYY-MM-DD");

  const pollutantsNames = pollutants.map(pollutant => pollutant.name)
  pollutantsNames.push('TEMP')
  pollutantsNames.push('PRESS')
  pollutantsNames.push('HR')
  let averages = ''
  if (pollutantsNames.length > 0) {
    averages += ', '
    averages += pollutantsNames.map(pollutant => `TRUNC(AVG("${pollutant}")) as "AVG${pollutant}"`).join(", ")
  }

  const rawQuery = `
    SELECT * 
    FROM (
      SELECT to_char(time, 'YYYY-MM-DD') as date FROM generate_series(:lastMonthDate, :currentDate, interval '1' day) time ) as LASTHOURS
      LEFT JOIN (
        SELECT to_char(recorded_at,'YYYY-MM-DD') as datetime ${averages}
        FROM ( 
          SELECT *
          FROM "Station_Readings"
          WHERE (station_id= :stationId AND recorded_at between :lastMonthDate and :currentDate)) AS RECORDS
        GROUP BY datetime) AS GROUPEDRECORDS
    on LASTHOURS.date=GROUPEDRECORDS.datetime;`

  const readings = await models.sequelize.query(rawQuery, {
    raw: true,
    type: sequelize.QueryTypes.SELECT,
    replacements: {
      stationId: id, currentDate, lastMonthDate
    }
  })

  return res.status(200).json({ readings });
}

module.exports = {
  searchStations,
  stationStatus,
  stationStatusByPollutant,
  last24HoursStatusByStation,
  lastMonthStatusByStation
}