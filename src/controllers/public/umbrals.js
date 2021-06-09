const models = require('../../models');

const getUmbralsByPollutant = async (req, res) => {
  const pollutant = req.params.pollutant

  if (!pollutant) {
    return res.status(400).json({ message: "Debe ingresar un contaminante" })
  }
  const pollutantUmbrals = await models.Umbrals.findOne({
    where: { pollutant },
    include: {
      model: models.Pollutant
    }
  })

  if (!pollutantUmbrals) {
    return res.status(404).json({ message: "Umbrales de contaminante no encontrados" })
  }
  return res.status(200).json({ pollutantUmbrals })
}

module.exports = {
  getUmbralsByPollutant
}