const bcrypt = require("bcrypt")
const saltRounds = 10;
const models = require('../models');
const { Op } = require("sequelize");
const logger = require("../../logger")

const getAdmins = async (req, res) => {
    const admins = await models.Admin.findAll({
        attributes: {
            exclude: ['password']
        },
        include: {
            model: models.City,
            include: {
                model: models.Country
            }
        },
    }
    );
    logger.info('getAdmins ' + 200);
    return res.status(200).json({ admins })
};

const getAdmin = async (req, res) => {
    const id = req.params.id

    if (!id) {
        return res.status(400).json({ message: "Debe ingresar un id" })
    }
    const admin = await models.Admin.findOne({
        where: { id },
        attributes: {
            exclude: ['password']
        }
    })
    if (!admin) {
        return res.status(404).json({ message: "Administrador no encontrado" })
    }
    logger.info('getAdmin ' + 200);
    return res.status(200).json({ admin })
}

const newAdmin = async (req, res) => {
    const { first_name, last_name, password, email, city_id } = req.body

    if (!password || !email || !first_name || !last_name) {
        return res.status(400).json({ message: "Debe llenar los campos obligatorios usuario, contraseña, email, nombre y apellido" })
    }
    let admin = await models.Admin.findOne({
        where: {
            email: { [Op.eq]: email }
        }
    })
    if (admin) {
        return res.status(400).json({ message: "Ya existe un usuario con el mismo correo" })
    }
    let hashPassword;
    await bcrypt.genSalt(saltRounds)
    await bcrypt.hash(password, saltRounds).then(hash =>
        hashPassword = hash
    )

    const username = email
    admin = await models.Admin.create({
        first_name,
        last_name,
        username,
        password: hashPassword,
        email,
        city_id,
    })
    logger.info('newAdmin ' + 201);
    return res.status(201).json({ admin })
}

const editAdmin = async (req, res) => {
    const id = req.params.id
    const { first_name, last_name, password, email, city_id } = req.body

    if (!id) {
        return res.status(400).json({ message: "Debe ingresar un id" })
    }
    let admin = await models.Admin.findOne({
        where: { id }
    })

    if (!admin) {
        return res.status(404).json({ message: "Administrador no encontrado" })
    }

    admin.first_name = first_name ? first_name : admin.first_name
    admin.last_name = last_name ? last_name : admin.last_name
    admin.password = password ? password : admin.password
    admin.email = email ? email : admin.email
    admin.username = email ? email : admin.email
    admin.city_id = city_id ? city_id : admin.city_id

    await admin.save();
    logger.info('editAdmin ' + 200);
    return res.status(200).json({ admin })
}

const deleteAdmin = async (req, res) => {
    const id = req.params.id

    if (!id) {
        return res.status(400).json({ message: "Debe ingresar un id" })
    }
    const admin = await models.Admin.findOne({
        where: { id }
    })
    if (!admin) {
        return res.status(404).json({ message: "Administrador no encontrado" })
    }
    await admin.destroy();
    logger.info('deleteAdmin ' + 200);
    return res.status(200).json({ message: "Administrador eliminado correctamente" })
}

module.exports = {
    getAdmins,
    getAdmin,
    newAdmin,
    editAdmin,
    deleteAdmin
};