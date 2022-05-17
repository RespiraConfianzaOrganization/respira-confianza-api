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

const getTimesExceedThreshold = async ({stationId, minThreshold, maxThreshold, pollutant, startDate, endDate}) => {
    const query = {
        station_id: stationId,
        recorded_at: {
            [Op.between]: [startDate, endDate],
        },
    }
    query[pollutant] = {[Op.between]: [minThreshold, maxThreshold]}

    const xd = await models.Station_Readings.findAll({
        where: query,
    });
    return xd
}

const getConsecutivePairs = array => {
    const output = []
    for(let i = 0; i < array.length - 1; i++) {
        const currentPair = [array[i], array[i+1]]
        output.push(currentPair)
    }
    return output
}

const makeReport = async ({pollutants, stations, startDate, endDate}) => {
    const thresholdByPollutant = {}
    for (const p of pollutants) {
        const thresholds = await getThresholdByPollutant(p)
        const {good, moderate, unhealthy, very_unhealthy} = thresholds
        const thresholdsValues = [0, good, moderate, unhealthy, very_unhealthy, Infinity]
        const thresholdPairs = getConsecutivePairs(thresholdsValues)
        for (const s of stations) {
            for (const thresholdPair of thresholdPairs) {
                const [minValue, maxValue] = thresholdPair
                const results = await getTimesExceedThreshold({
                    stationId: s,
                    pollutant: p,
                    startDate: startDate,
                    endDate: endDate,
                    minThreshold: minValue,
                    maxThreshold: maxValue
                })
            }

        }
    }
    return {hola: "xd"}
}

const receiveReportRequest = async (req, res) => {
    const errors = getErrors({...req.body})
    const hasErrors = Object.keys(errors).length > 0
    if (hasErrors) return res.status(400).json({message: errors})
    const r = await makeReport({...req.body})
    return res.status(200).json({message: r})

}

module.exports = {
    receiveReportRequest
}
