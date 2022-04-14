const models = require("../../models");
const { Op } = require('sequelize');
const moment = require("moment");

const pollutantsReadingsByStations = async (req, res) => {

    const { pollutants, stations, days } = req.body;
    const pollutantsAttributes = pollutants || []
    const attributes = ["id", "station_id", "recorded_at", ...pollutantsAttributes]

    const endDate = moment()
    const startDate = moment().subtract(days, 'days')

    const endDateISO = endDate.toISOString()
    const startDateISO = startDate.toISOString()

    const stationsObjects = await models.Station_Readings.findAll({
        where: {
            station_id: stations,
            recorded_at: {
                [Op.between]: [startDateISO, endDateISO],
            }
        },
        attributes: attributes
    });

    return res.status(200).json({ readings: stationsObjects});
}


module.exports = {
    pollutantsByStations: pollutantsReadingsByStations
}
