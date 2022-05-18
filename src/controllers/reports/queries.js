const models = require("../../models");
const {Op} = require("sequelize");

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

const getTimesExceedThreshold = async ({stationId, minThreshold, maxThreshold, pollutant, startDate, endDate}) => {
    const query = {
        station_id: stationId,
        recorded_at: {
            [Op.between]: [startDate, endDate],
        },
    }
    query[pollutant] = {[Op.between]: [minThreshold, maxThreshold]}

    const attributes = ['station_id', 'recorded_at', 'updated_at', [pollutant, 'value']]

    return await models.Station_Readings.findAll({
        where: query,
        attributes: attributes,
        raw: true,
        nest: true
    })
}

module.exports = {
    getThresholdByPollutant, getPollutant, getStation, getTimesExceedThreshold
}
