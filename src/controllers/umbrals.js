const models = require('../models');
const { Op } = require("sequelize");

const getAllUmbrals = async (req, res) => {
    const sensorUmbrals = await models.Umbrals.findAll({
        include: {
            model: models.Sensor_Type
        }
    });
    return res.status(200).json({ sensorUmbrals })
};

const getSensorUmbrals = async (req, res) => {
    const id = req.params.id

    if (!id) {
        return res.status(400).json({ message: "Debe ingresar un id" })
    }
    const sensorUmbrals = await models.Umbrals.findOne({
        where: { id },
        include: {
            model: models.Sensor_Type
        }
    })
    if (!sensorUmbrals) {
        return res.status(404).json({ message: "Umbrales de sensor no encontrados" })
    }
    return res.status(200).json({ sensorUmbrals })
}

const newSensorUmbrals = async (req, res) => {
    const { sensor_type_id, good, moderate, unhealthy, very_unhealthy, dangerous } = req.body

    if (!sensor_type_id) {
        return res.status(400).json({ message: "Debe elegir un sensor" })
    }
    if (!good || !moderate || !unhealthy || !very_unhealthy || !dangerous) {
        return res.status(400).json({ message: "Debe llenar los campos que indican los rangos de umbrales" })
    }
    let sensorUmbrals = await models.Umbrals.findOne({
        where: {
            sensor_type_id
        },
        include: {
            model: models.Sensor_Type
        }
    })
    if (sensorUmbrals) {
        return res.status(400).json({ message: `Ya existe una definición de umbrales para el sensor ${sensorUmbrals.Sensor_Type.type}` })
    }
    sensorUmbrals = await models.Umbrals.create({
        sensor_type_id, good, moderate, unhealthy, very_unhealthy, dangerous
    })
    return res.status(201).json({ sensorUmbrals })
}

const editSensorUmbrals = async (req, res) => {
    const id = req.params.id
    const { good, moderate, unhealthy, very_unhealthy, dangerous } = req.body

    if (!id) {
        return res.status(400).json({ message: "Debe ingresar un id" })
    }
    let sensorUmbrals = await models.Umbrals.findOne({
        where: { id }
    })

    if (!sensorUmbrals) {
        return res.status(404).json({ message: "Umbrales de sensor no encontrados" })
    }

    sensorUmbrals.good = good ? good : sensorUmbrals.good
    sensorUmbrals.moderate = moderate ? moderate : sensorUmbrals.moderate
    sensorUmbrals.unhealthy = unhealthy ? unhealthy : sensorUmbrals.unhealthy
    sensorUmbrals.very_unhealthy = very_unhealthy ? very_unhealthy : sensorUmbrals.very_unhealthy
    sensorUmbrals.dangerous = dangerous ? dangerous : sensorUmbrals.dangerous

    await sensorUmbrals.save();
    return res.status(200).json({ sensorUmbrals })
}

const deleteSensorUmbrals = async (req, res) => {
    const id = req.params.id

    if (!id) {
        return res.status(400).json({ message: "Debe ingresar un id" })
    }
    const sensorUmbrals = await models.Umbrals.findOne({
        where: { id },
        include: {
            model: models.Sensor_Type
        }
    })
    if (!sensorUmbrals) {
        return res.status(404).json({ message: "Umbrales de sensor no encontrado" })
    }
    await sensorUmbrals.destroy();
    return res.status(200).json({ message: `Umbrales de sensor ${sensorUmbrals.Sensor_Type.type} eliminados correctamente` })
}

module.exports = {
    getAllUmbrals,
    getSensorUmbrals,
    newSensorUmbrals,
    editSensorUmbrals,
    deleteSensorUmbrals
};