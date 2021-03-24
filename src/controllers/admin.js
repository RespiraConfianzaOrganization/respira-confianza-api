const bcrypt = require("bcrypt")
const saltRounds = 10;
const models = require('../models');

const getAdmins = async (req, res) => {
    const admins = await models.Admin.findAll({
        attributes: {
            exclude: ['password']
        }
    }
    );
    res.statusCode = 200
    return res.json({ admins })
};

const getAdmin = async (req, res) => {
    const id = req.params.id

    if (!id) {
        res.statusCode = 400
        return res.json({ message: "Debe ingresar un id" })
    }
    const admin = await models.Admin.findOne({
        where: { id },
        attributes: {
            exclude: ['password']
        }
    })
    if (!admin) {
        res.statusCode = 404
        return res.json({ message: "Administrador no encontrado" })
    }
    res.statusCode = 200
    return res.json({ admin })
}

const newAdmin = async (req, res) => {
    const { first_name, last_name, username, password, email, city, country } = req.body

    if (!username || !password || !email || !first_name || !last_name) {
        res.statusCode = 400
        return res.json({ message: "Debe llenar los campos obligatorios usuario, contraseña, email, nombre y apellido" })
    }
    let admin = await models.Admin.findOne({
        where: { username }
    })
    if (admin) {
        res.statusCode = 400
        return res.json({ message: "Ya existe un usuario con el mismo nombre de usuario" })
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
    res.statusCode = 201
    return res.json({ admin })
}

const editAdmin = async (req, res) => {
    const id = req.params.id
    const { first_name, last_name, username, password, email, city, country } = req.body

    if (!id) {
        res.statusCode = 400
        return res.json({ message: "Debe ingresar un id" })
    }
    let admin = await models.Admin.findOne({
        where: { id }
    })

    if (!admin) {
        res.statusCode = 404
        return res.json({ message: "Administrador no encontrado" })
    }

    admin.first_name = first_name ? first_name : admin.first_name
    admin.last_name = last_name ? last_name : admin.last_name
    admin.password = password ? password : admin.password
    admin.email = email ? email : admin.email
    admin.city = city ? city : admin.city
    admin.country = country ? country : admin.country

    await admin.save();
    res.statusCode = 200
    return res.json({ admin })
}

const deleteAdmin = async (req, res) => {
    const id = req.params.id

    if (!id) {
        res.statusCode = 400
        return res.json({ message: "Debe ingresar un id" })
    }
    const admin = await models.Admin.findOne({
        where: { id }
    })
    if (!admin) {
        res.statusCode = 404
        return res.json({ message: "Administrador no encontrado" })
    }
    await admin.destroy();
    res.statusCode = 200
    return res.json({ message: "Administrador eliminado correctamente" })
}

module.exports = {
    getAdmins,
    getAdmin,
    newAdmin,
    editAdmin,
    deleteAdmin
};