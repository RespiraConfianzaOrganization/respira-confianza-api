const models = require('../models');
const { Op } = require("sequelize");

const getSensorTypes = async (req, res) => {
    const sensorTypes = await models.Sensor_Type.findAll({});
    return res.status(200).json({ sensorTypes })
};

const getSensorType = async (req, res) => {
    const id = req.params.id

    if (!id) {
        return res.status(400).json({ message: "Debe ingresar un id" })
    }
    const sensorType = await models.Sensor_Type.findOne({
        where: { id },
    })
    if (!sensorType) {
        return res.status(404).json({ message: "Tipo de sensor no encontrado" })
    }
    return res.status(200).json({ sensorType })
}

const newSensorType = async (req, res) => {
    const { type, unit } = req.body

    if (!type || !unit) {
        return res.status(400).json({ message: "Debe llenar los campos obligatorios tipo y unidad" })
    }
    let sensorType = await models.Sensor_Type.findOne({
        where: {
            [Op.and]: [
                {
                    type: { [Op.eq]: type }
                },
                {
                    unit: { [Op.eq]: unit }
                }
            ]
        }
    })
    if (sensorType) {
        return res.status(400).json({ message: "Ya existe una tipo de sensor con los mismos parámetros" })
    }
    sensorType = await models.Sensor_Type.create({
        type, unit
    })
    return res.status(201).json({ sensorType })
}

const editSensorType = async (req, res) => {
    const id = req.params.id
    const { unit } = req.body

    if (!id) {
        return res.status(400).json({ message: "Debe ingresar un id" })
    }
    let sensorType = await models.Sensor_Type.findOne({
        where: { id }
    })

    if (!sensorType) {
        return res.status(404).json({ message: "Tipo de sensor no encontrado" })
    }

    let otherSensorType = await models.Sensor_Type.findOne({
        where: {
            [Op.and]: [
                {
                    type: { [Op.eq]: sensorType.type }
                },

                {
                    unit: { [Op.eq]: unit }
                }
            ]
        }
    })
    if (otherSensorType && otherSensorType.id != id) {
        return res.status(400).json({ message: "Ya existe un tipo de sensor con los mismos parámetros" })
    }

    sensorType.unit = unit ? unit : sensorType.unit

    await sensorType.save();
    return res.status(200).json({ sensorType })
}

const deleteSensorType = async (req, res) => {
    const id = req.params.id

    if (!id) {
        return res.status(400).json({ message: "Debe ingresar un id" })
    }
    const sensorType = await models.Sensor_Type.findOne({
        where: { id }
    })
    if (!sensorType) {
        return res.status(404).json({ message: "Tipo de sensor no encontrado" })
    }
    await sensorType.destroy();
    return res.status(200).json({ message: "Tipo de sensor eliminado correctamente" })
}

module.exports = {
    getSensorTypes,
    getSensorType,
    newSensorType,
    editSensorType,
    deleteSensorType
};