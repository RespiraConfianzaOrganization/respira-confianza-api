const models = require("../../models");

const getThresholdByPollutant = async (pollutant) => {
    return await models.Umbrals.findOne({
        where: {pollutant},
        include: {
            model: models.Pollutant
        }
    })
}

module.exports = {
    getThresholdByPollutant
}
