const models = require('../models');

const getPollutants = async (req, res) => {
    const pollutants = await models.Pollutant.findAll({});
    return res.status(200).json({ pollutants })
};

module.exports = {
    getPollutants,
};