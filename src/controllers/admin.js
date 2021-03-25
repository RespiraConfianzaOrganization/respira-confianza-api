const bcrypt = require("bcrypt")
const saltRounds = 10;
const models = require('../models');
const { Op } = require("sequelize");

const getAdmins = async (req, res) => {
    const admins = await models.Admin.findAll({
        attributes: {
            exclude: ['password']
        }
    }
    );
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
    return res.status(200).json({ admin })
}

const newAdmin = async (req, res) => {
    const { first_name, last_name, username, password, email, city, country } = req.body

    if (!username || !password || !email || !first_name || !last_name) {
        return res.status(400).json({ message: "Debe llenar los campos obligatorios usuario, contraseña, email, nombre y apellido" })
    }
    let admin = await models.Admin.findOne({
        where: {
            [Op.or]: [
                {
                    username: { [Op.eq]: username }
                },
                {
                    email: { [Op.eq]: email }
                }
            ]
        }
    })
    if (admin) {
        if (admin.username == username) {
            return res.status(400).json({ message: "Ya existe un usuario con el mismo nombre de usuario" })
        }
        else {
            return res.status(400).json({ message: "Ya existe un usuario con el mismo correo" })
        }

    }
    let hashPassword;
    await bcrypt.genSalt(saltRounds)
    await bcrypt.hash(password, saltRounds).then(hash =>
        hashPassword = hash
    )

    admin = await models.Admin.create({
        first_name,
        last_name,
        username,
        password: hashPassword,
        email,
        city,
        country
    })
    return res.status(201).json({ admin })
}

const editAdmin = async (req, res) => {
    const id = req.params.id
    const { first_name, last_name, username, password, email, city, country } = req.body

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
    admin.city = city ? city : admin.city
    admin.country = country ? country : admin.country

    await admin.save();
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
    return res.status(200).json({ message: "Administrador eliminado correctamente" })
}

module.exports = {
    getAdmins,
    getAdmin,
    newAdmin,
    editAdmin,
    deleteAdmin
};