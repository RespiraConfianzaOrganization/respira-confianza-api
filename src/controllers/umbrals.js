const models = require('../models');

const getAllUmbrals = async (req, res) => {
    const pollutantUmbrals = await models.Umbrals.findAll({
        include: {
            model: models.Pollutant
        }
    });
    return res.status(200).json({ pollutantUmbrals })
};

const getPollutantUmbrals = async (req, res) => {
    const id = req.params.id

    if (!id) {
        return res.status(400).json({ message: "Debe ingresar un id" })
    }
    const pollutantUmbrals = await models.Umbrals.findOne({
        where: { id },
        include: {
            model: models.Pollutant
        }
    })

    if (!pollutantUmbrals) {
        return res.status(404).json({ message: "Umbrales de contaminante no encontrados" })
    }
    return res.status(200).json({ pollutantUmbrals })
}

const newPollutantUmbrals = async (req, res) => {
    const { pollutant, good, moderate, unhealthy, very_unhealthy, dangerous } = req.body

    if (!pollutant) {
        return res.status(400).json({ message: "Debe elegir un contaminante" })
    }
    if (!good || !moderate || !unhealthy || !very_unhealthy || !dangerous) {
        return res.status(400).json({ message: "Debe llenar los campos que indican los rangos de umbrales" })
    }
    let pollutantUmbrals = await models.Umbrals.findOne({
        where: {
            pollutant
        },
        include: {
            model: models.Pollutant
        }
    })
    if (pollutantUmbrals) {
        return res.status(400).json({ message: `Ya existe una definición de umbrales para el contaminante ${pollutantUmbrals.Pollutant.name}` })
    }
    pollutantUmbrals = await models.Umbrals.create({
        pollutant, good, moderate, unhealthy, very_unhealthy, dangerous
    })
    return res.status(201).json({ pollutantUmbrals })
}

const editPollutantUmbrals = async (req, res) => {
    const id = req.params.id
    const { good, moderate, unhealthy, very_unhealthy, dangerous } = req.body

    if (!id) {
        return res.status(400).json({ message: "Debe ingresar un id" })
    }
    let pollutantUmbrals = await models.Umbrals.findOne({
        where: { id }
    })

    if (!pollutantUmbrals) {
        return res.status(404).json({ message: "Umbrales de contaminante no encontrados" })
    }

    pollutantUmbrals.good = good ? good : pollutantUmbrals.good
    pollutantUmbrals.moderate = moderate ? moderate : pollutantUmbrals.moderate
    pollutantUmbrals.unhealthy = unhealthy ? unhealthy : pollutantUmbrals.unhealthy
    pollutantUmbrals.very_unhealthy = very_unhealthy ? very_unhealthy : pollutantUmbrals.very_unhealthy
    pollutantUmbrals.dangerous = dangerous ? dangerous : pollutantUmbrals.dangerous

    await pollutantUmbrals.save();
    return res.status(200).json({ pollutantUmbrals })
}

const deletePollutantUmbrals = async (req, res) => {
    const id = req.params.id

    if (!id) {
        return res.status(400).json({ message: "Debe ingresar un id" })
    }
    const pollutantUmbrals = await models.Umbrals.findOne({
        where: { id },
    })
    if (!pollutantUmbrals) {
        return res.status(404).json({ message: "Umbrales de contaminante no encontrado" })
    }
    await pollutantUmbrals.destroy();
    return res.status(200).json({ message: `Umbrales de contaminante ${pollutantUmbrals.pollutant} eliminados correctamente` })
}

module.exports = {
    getAllUmbrals,
    getPollutantUmbrals,
    newPollutantUmbrals,
    editPollutantUmbrals,
    deletePollutantUmbrals
};