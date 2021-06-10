const models = require("../models")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const logger = require("../../logger")
const TOKENKEY = process.env.TOKENKEY

const login = async (req, res) => {
    const { username, password } = req.body
    if (!username || username === "") {
        return res.status(400).json({ message: "Debe ingresar un usuario" })
    }
    if (!password || password === "") {
        return res.status(400).json({ message: "Debe ingresar una contraseña" })
    }

    const admin = await models.Admin.findOne({
        where: { username }
    })

    if (!admin) {
        return res.status(404).json({
            message: "Usuario y/o contraseña incorrectos"
        })
    }

    // Compare
    const comparePassword = await bcrypt.compare(
        password, admin.password
    )
    if (!comparePassword) {
        return res.status(404).json({
            message: "Usuario y/o contraseña incorrectos"
        })
    }
    try {
        const token = await jwt.sign({ data: username }, TOKENKEY, { expiresIn: '1h' })
        logger.info('login ' + 200 + " " + username);
        return res.status(200).json({ token, user: admin })
    } catch (err) {
        logger.error(err, 500)
        return res.status(500).json({ message: 'Hubo un error. Vuelve a intentarlo más tarde' })
    }
}

const isAuthenticatedGeneric = async (req, res, isNext, next) => {
    const bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1];
        await jwt.verify(bearerToken, TOKENKEY, async (err, authData) => {
            if (err) {
                res.statusCode = 403
                return res.json({ message: "Hubo un error. Vuelve a intentarlo más tarde" })
            } else {
                if (isNext) {
                    req.token = bearerToken
                    next()
                }
                else {
                    const admin = await models.Admin.findOne({ where: { username: authData.data } })
                    if (admin) {
                        res.statusCode = 200
                        return res.json({ message: "", user: admin })
                    }
                    else {
                        res.statusCode = 500
                        return res.json({ message: "Hubo un error. Vuelve a intentarlo más tarde" })
                    }

                }
            }
        })
    } else {
        res.statusCode = 403
        return res.json({ message: "Necesitas autenticarte" })
    }
}

const isAuthenticated = async (req, res, next) => {
    await isAuthenticatedGeneric(req, res, true, next)
}

const isAuthenticatedAdmin = async (req, res, next) => {
    await isAuthenticatedGeneric(req, res, false, next)
}

module.exports = {
    login,
    isAuthenticated,
    isAuthenticatedAdmin,
}