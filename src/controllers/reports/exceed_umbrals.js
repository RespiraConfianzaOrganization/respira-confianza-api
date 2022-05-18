const validators = require("./validators");
const {getThresholdByPollutant} = require("./queries")
const models = require("../../models");
const {Op} = require("sequelize");

const {datesAreValid, pollutantIsValid, stationIsValid, thresholdIsValid} = validators;

const getErrors = ({startDate, endDate, pollutant, station}) => {
    let errors = {}
    if (!datesAreValid(startDate, endDate)) {
        errors['startDate'] = ['Debe ser menor o igual que endDate y estar en YYYY-MM-DD']
        errors['endDate'] = ['Debe ser mayor o igual que startDate y estar en formato YYYY-MM-DD']
    }
    if (!pollutantIsValid(pollutant)) {
        const currentError = errors['pollutant'] || []
        currentError.push(`Pollutant ${pollutant} no encontrado`)
        errors['pollutant'] = currentError
    }
    if (!stationIsValid(station)) {
        const currentError = errors['station'] || []
        currentError.push(`Estación ${station} no encontrada`)
        errors['station'] = currentError
    }
    if (!thresholdIsValid(pollutant)) {
        const currentError = errors['pollutants'] || []
        currentError.push(`Umbrales no encontrados para pollutant ${pollutant}`)
        errors['pollutants'] = currentError
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

    const attributes = ['station_id', 'recorded_at', 'updated_at', pollutant]

    return await models.Station_Readings.findAll({
        where: query,
        attributes: attributes,
    })
}

const getConsecutivePairs = array => {
    const output = []
    for(let i = 0; i < array.length - 1; i++) {
        const currentPair = [array[i], array[i+1]]
        output.push(currentPair)
    }
    return output
}

const makeThresholdPairsByPollutant = async (p) => {
    const thresholds = await getThresholdByPollutant(p)
    const {good, moderate, unhealthy, very_unhealthy} = thresholds
    const thresholdsValues = [0, good, moderate, unhealthy, very_unhealthy, Infinity]
    return getConsecutivePairs(thresholdsValues)
}

const getReportDataPerPollutantAndStation = async ({pollutant, station, startDate, endDate}) => {
    const thresholdsPairs = await makeThresholdPairsByPollutant(pollutant)
    const output = {}
    let globalResults = []

    output[station] = {}
    output[station][pollutant] = {}

    const queryParams = {
        stationId: station,
        pollutant: pollutant,
        startDate: startDate,
        endDate: endDate,
    }


    for (const thresholdPair of thresholdsPairs) {
        const [minValue, maxValue] = thresholdPair
        const results = await getTimesExceedThreshold({
            ...queryParams,
            minThreshold: minValue,
            maxThreshold: maxValue
        })

        const key = `${minValue} - ${maxValue}`
        globalResults = globalResults.concat(results)
        output[station][pollutant][key] = results.length
    }

    output[station][pollutant]['results'] = globalResults

    return output
}

const exceedThresholdController = async (req, res) => {
    const errors = getErrors({...req.body})
    const hasErrors = Object.keys(errors).length > 0
    if (hasErrors) return res.status(400).json({message: errors})
    const r = await getReportDataPerPollutantAndStation({...req.body})
    return res.status(200).json({message: r})

}

module.exports = {
    exceedThresholdController
}
