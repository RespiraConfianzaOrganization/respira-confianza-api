const models = require('../models');
const logger = require("../../logger")

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
    const pollutant = req.body.pollutant || null
    const good = req.body.good || null
    const moderate = req.body.moderate || null
    const unhealthy = req.body.unhealthy || null
    const very_unhealthy = req.body.very_unhealthy || null
    const dangerous = req.body.dangerous || null

    if (!pollutant) {
        return res.status(400).json({ message: "Debe elegir un contaminante" })
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

    let form = {
        good, moderate, unhealthy, very_unhealthy, dangerous
    }

    if (validateUmbrals(form, ['good', 'moderate', 'unhealthy', 'very_unhealthy', 'dangerous'])) {
        return res.status(400).json({ message: "Los umbrales ingresados son inválidos" })
    }

    pollutantUmbrals = await models.Umbrals.create({
        pollutant, good, moderate, unhealthy, very_unhealthy, dangerous
    })

    logger.info('newPollutantUmbrals ' + 200);
    return res.status(201).json({ pollutantUmbrals })
}

const editPollutantUmbrals = async (req, res) => {
    const id = req.params.id
    const good = req.body.good || null
    const moderate = req.body.moderate || null
    const unhealthy = req.body.unhealthy || null
    const very_unhealthy = req.body.very_unhealthy || null
    const dangerous = req.body.dangerous || null

    if (!id) {
        return res.status(400).json({ message: "Debe ingresar un id" })
    }
    let pollutantUmbrals = await models.Umbrals.findOne({
        where: { id }
    })

    if (!pollutantUmbrals) {
        return res.status(404).json({ message: "Umbrales de contaminante no encontrados" })
    }

    let form = {
        good, moderate, unhealthy, very_unhealthy, dangerous
    }

    if (validateUmbrals(form, ['good', 'moderate', 'unhealthy', 'very_unhealthy', 'dangerous'])) {
        return res.status(400).json({ message: "Los umbrales ingresados son inválidos" })
    }

    pollutantUmbrals.good = good ? good : pollutantUmbrals.good
    pollutantUmbrals.moderate = moderate ? moderate : pollutantUmbrals.moderate
    pollutantUmbrals.unhealthy = unhealthy ? unhealthy : pollutantUmbrals.unhealthy
    pollutantUmbrals.very_unhealthy = very_unhealthy ? very_unhealthy : pollutantUmbrals.very_unhealthy
    pollutantUmbrals.dangerous = dangerous ? dangerous : pollutantUmbrals.dangerous

    await pollutantUmbrals.save();
    logger.info('editPollutantUmbrals ' + 200);
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

    logger.info('deletePollutantUmbrals ' + 200);
    return res.status(200).json({ message: `Umbrales de contaminante ${pollutantUmbrals.pollutant} eliminados correctamente` })
}

const validateUmbrals = (form, umbrals) => {
    let isValid = true;
    let umbralValue = 0
    umbrals.forEach(umbral => {
        console.log(umbral)
        if (form[umbral]) {
            if (umbralValue < form[umbral]) {
                umbralValue = form[umbral]
            }
            else {
                isValid = false;
            }
        }
    })
    return isValid
}

module.exports = {
    getAllUmbrals,
    getPollutantUmbrals,
    newPollutantUmbrals,
    editPollutantUmbrals,
    deletePollutantUmbrals
};