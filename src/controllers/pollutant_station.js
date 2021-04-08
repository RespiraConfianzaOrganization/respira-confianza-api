const models = require("../models");

const newPoluttantstation = async (req, res) => {
  const { station_id, pollutant_id } = req.body;

  if (!station_id) {
    return res.status(400).json({ message: "Debe ingresar un estación" });
  }
  if (!pollutant_id) {
    return res.status(400).json({ message: "Debe ingresar un contaminante" });
  }

  const station = await models.Station.findOne({
    where: { id: station_id },
  });

  const pollutant = await models.Pollutant.findOne({
    where: { id: pollutant_id },
  });

  if (!station) {
    return res.status(400).json({ message: "Estación ingresada no existe" });
  }

  if (!pollutant) {
    return res
      .status(400)
      .json({ message: "Contaminante ingresado no existe" });
  }

  const oldRecord = await models.Pollutant_Station.findOne({
    where: { pollutant_id, station_id },
  });

  if (oldRecord) {
    return res
      .status(400)
      .json({ message: "El contaminante ya está agregado a la estación" });
  }

  const pollutantStation = await models.Pollutant_Station.create({
    pollutant_id,
    station_id,
  });

  return res.status(201).json({ pollutantStation, pollutant });
};

const deletePoluttantStation = async (req, res) => {
  const { station_id, pollutant_id } = req.params;

  if (!station_id || !pollutant_id) {
    return res
      .status(400)
      .json({ message: "Debe ingresar estación y contaminante" });
  }
  const pollutantStation = await models.Pollutant_Station.findOne({
    where: { pollutant_id, station_id },
  });
  if (!pollutantStation) {
    return res
      .status(404)
      .json({ message: "No existe ese contaminante en la estación" });
  }
  const pollutant = await models.Pollutant.findOne({
    where: { id: pollutant_id },
  });

  await pollutantStation.destroy();
  return res.status(200).json({
    message: "Contaminante eliminado de la estación correctamente",
    pollutant,
  });
};

module.exports = {
  newPoluttantstation,
  deletePoluttantStation,
};
