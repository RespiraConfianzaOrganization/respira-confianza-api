const models = require("../models");
const logger = require("../../logger")

const newPollutantStation = async (req, res) => {
  const { station_id, pollutant, useAuxiliar } = req.body;

  if (!station_id) {
    return res.status(400).json({ message: "Debe ingresar un estación" });
  }
  if (!pollutant) {
    return res.status(400).json({ message: "Debe ingresar un contaminante" });
  }

  const station = await models.Station.findOne({
    where: { id: station_id },
  });

  const pollutantInstance = await models.Pollutant.findOne({
    where: { name: pollutant },
  });

  if (!station) {
    return res.status(400).json({ message: "Estación ingresada no existe" });
  }

  if (!pollutantInstance) {
    return res
      .status(400)
      .json({ message: "Contaminante ingresado no existe" });
  }

  const oldRecord = await models.Pollutant_Station.findOne({
    where: { pollutant, station_id },
  });

  if (oldRecord) {
    return res
      .status(400)
      .json({ message: "El contaminante ya está agregado a la estación" });
  }

  const pollutantStation = await models.Pollutant_Station.create({
    pollutant,
    station_id,
    useAuxiliar
  });
  logger.info('newPollutantStation ' + 201);
  return res.status(201).json({ pollutantStation, pollutant: pollutantInstance });
};

const deletePoluttantStation = async (req, res) => {
  const { station_id, pollutant } = req.params;

  if (!station_id || !pollutant) {
    return res
      .status(400)
      .json({ message: "Debe ingresar estación y contaminante" });
  }
  const pollutantStation = await models.Pollutant_Station.findOne({
    where: { pollutant, station_id },
  });
  if (!pollutantStation) {
    return res
      .status(404)
      .json({ message: "No existe ese contaminante en la estación" });
  }
  const pollutantInstance = await models.Pollutant.findOne({
    where: { name: pollutant },
  });

  await pollutantStation.destroy();
  logger.info('deletePoluttantStation ' + 200);

  return res.status(200).json({
    message: "Contaminante eliminado de la estación correctamente",
    pollutant: pollutantInstance,
  });
};

module.exports = {
  newPollutantStation,
  deletePoluttantStation,
};
