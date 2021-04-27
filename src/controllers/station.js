const bcrypt = require("bcrypt");
const saltRounds = 10;
const models = require("../models");
const { Op } = require("sequelize");

const getStations = async (req, res) => {
  //TODO: PAGINATION
  const stations = await models.Station.findAll({
    include: {
      model: models.City,
      include: {
        model: models.Country
      }
    },
  });
  return res.status(200).json({ stations });
};

const searchStations = async (req, res) => {
  const stations = await models.Station.findAll({});
  return res.status(200).json({ stations });
}

const getStation = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "Debe ingresar un id" });
  }
  const station = await models.Station.findOne({
    where: { id },
    include: [{
      model: models.Pollutant,
    },
    {
      model: models.City,
      include: {
        model: models.Country
      }
    }]
  });
  if (!station) {
    return res.status(404).json({ message: "Estación no encontrada" });
  }
  return res.status(200).json({ station });
};

const newStation = async (req, res) => {
  const { name, city_id, latitude, longitude, status } = req.body;

  if (!name || !latitude || !longitude || !status || !city_id) {
    return res.status(400).json({
      message:
        "Debe llenar los campos obligatorios nombre, status, latitud y longitud",
    });
  }
  let station = await models.Station.findOne({
    where: {
      [Op.or]: [
        {
          name: { [Op.eq]: name },
        },
        {
          [Op.and]: [
            {
              latitude: { [Op.eq]: latitude },
            },
            {
              longitude: { [Op.eq]: longitude },
            },
          ],
        },
      ],
    },
  });
  if (station) {
    if (station.name == name) {
      return res
        .status(400)
        .json({ message: "Ya existe una estación con el mismo nombre" });
    } else {
      return res
        .status(400)
        .json({ message: "Ya existe una estación en las mismas coordenadas" });
    }
  }
  let privateKey;
  await bcrypt.genSalt(saltRounds);
  await bcrypt.hash(name, saltRounds).then((hash) => (privateKey = hash));

  station = await models.Station.create({
    private_key: privateKey,
    name,
    city_id,
    latitude,
    longitude,
    status,
  });
  return res.status(201).json({ station });
};

const editStation = async (req, res) => {
  const id = req.params.id;
  const { name, city_id, latitude, longitude, status } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Debe ingresar un id" });
  }
  let station = await models.Station.findOne({
    where: { id },
  });

  if (!station) {
    return res.status(404).json({ message: "Estación no encontrada" });
  }

  let otherStation = await models.Station.findOne({
    where: {
      [Op.or]: [
        {
          name: { [Op.eq]: name },
        },
        {
          [Op.and]: [
            {
              latitude: { [Op.eq]: latitude },
            },
            {
              longitude: { [Op.eq]: longitude },
            },
          ],
        },
      ],
    },
  });
  if (otherStation && otherStation.id != id) {
    if (otherStation.name == name) {
      return res
        .status(400)
        .json({ message: "Ya existe una estación con el mismo nombre" });
    } else {
      return res
        .status(400)
        .json({ message: "Ya existe una estación en las mismas coordenadas" });
    }
  }

  station.name = name ? name : station.name;
  station.city_id = city_id ? city_id : station.city_id;
  station.latitude = latitude ? latitude : station.latitude;
  station.longitude = longitude ? longitude : station.longitude;
  station.status = status ? status : station.status;

  await station.save();
  return res.status(200).json({ station });
};

const deleteStation = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "Debe ingresar un id" });
  }
  const station = await models.Station.findOne({
    where: { id },
  });
  if (!station) {
    return res.status(404).json({ message: "Estación no encontrada" });
  }
  await station.destroy();
  return res.status(200).json({ message: "Estación eliminada correctamente" });
};

module.exports = {
  getStations,
  searchStations,
  getStation,
  newStation,
  editStation,
  deleteStation,
};
