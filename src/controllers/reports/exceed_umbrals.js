const {datesAreValid, pollutantsAreValid, stationsAreValid, thresholdAreValid} = require("./validators");
const {getThresholdByPollutant} = require("./queries")
const models = require("../../models");
const {Op} = require("sequelize");

const getErrors = ({startDate, endDate, pollutants, stations}) => {
    let errors = {}
    if (!datesAreValid(startDate, endDate)) {
        errors['dates'] = {
            startDate: 'Debe ser menor o igual que endDate y estar en YYYY-MM-DD',
            endDate: 'Debe ser mayor o igual que startDate y estar en formato YYYY-MM-DD'
        }
    }
    if (!pollutantsAreValid(pollutants)) {
        const models = errors['models'] || {}
        errors['models'] = {
            ...models,
            pollutants: 'Todos los pollutants deben existir en la db'
        }
    }
    if (!stationsAreValid(stations)) {
        const models = errors['models'] || {}
        errors['models'] = {
            ...models,
            stations: 'Todos las stations deben existir en la db'
        }
    }
    if (!thresholdAreValid(pollutants)) {
        const models = errors['models'] || {}
        errors['models'] = {
            ...models,
            umbrals: 'Todos los umbrales asociados a los pollutants deben existir en la db'
        }
    }
    return errors
}

const getTimesExceedThreshold = async ({stationId, threshold, pollutant, startDate, endDate}) => {
    const query = {
        station_id: stationId,
        recorded_at: {
            [Op.between]: [startDate, endDate],
        },
    }
    query[pollutant] = {[Op.gte]: threshold}

    const xd = await models.Station_Readings.findAll({
        where: query,
    });
    console.log(xd)
    return xd
}



const makeReport = async ({pollutants, stations, startDate, endDate}) => {
    const thresholdByPollutant = {}
    for (const p of pollutants) {
        const thresholds = await getThresholdByPollutant(p)
        const {good, moderate, unhealthy, very_unhealthy} = thresholds
        for (const s of stations) {
            const results = await getTimesExceedThreshold({stationId: s, pollutant: p, startDate: startDate, endDate: endDate, threshold: good})
            console.log(results)
        }
    }
}

const receiveReportRequest = async (req, res) => {
    const errors = getErrors({...req.body})
    const hasErrors = Object.keys(errors).length > 0
    if (hasErrors) return res.status(400).json({message: errors})
    makeReport({...req.body})
    return res.status(200).json({message: 'Ok'})

}

module.exports = {
    receiveReportRequest
}
