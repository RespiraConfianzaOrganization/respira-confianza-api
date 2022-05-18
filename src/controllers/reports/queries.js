const models = require("../../models");

const getThresholdByPollutant = async (pollutant) => {
    return await models.Umbrals.findOne({
        where: {pollutant},
        include: {
            model: models.Pollutant
        },
        raw: true,
        nest: true
    })
}

const getPollutant = async (name) => {
    return await models.Pollutant.findOne({
        where: {name},
        raw: true,
        nest: true
    });

}

const getStation = async (id) => {
    return await models.Station.findOne({
        where: {id},
        raw: true,
        nest: true
    })
}

module.exports = {
    getThresholdByPollutant, getPollutant, getStation
}
