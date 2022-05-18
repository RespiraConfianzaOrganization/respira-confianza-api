const validators = require("./validators");
const {getThresholdByPollutant, getPollutant, getStation} = require("./queries")
const models = require("../../models");
const {Op} = require("sequelize");

const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const htmlToPdf = require('html-pdf-node');

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

    const attributes = ['station_id', 'recorded_at', 'updated_at', [pollutant, 'value']]

    return await models.Station_Readings.findAll({
        where: query,
        attributes: attributes,
        raw: true,
        nest: true
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

const makeThresholdPairsByPollutant = async (thresholds) => {
    const {good, moderate, unhealthy, very_unhealthy} = thresholds
    const thresholdsValues = [0, good, moderate, unhealthy, very_unhealthy, Infinity]
    return getConsecutivePairs(thresholdsValues)
}

const getReportDataPerPollutantAndStation = async ({pollutant, station, startDate, endDate}) => {

    const pollutantData = await getPollutant(pollutant)
    const stationData = await getStation(station)
    const thresholdData = await getThresholdByPollutant(pollutant)
    const datesData = {
        startDate: startDate,
        endDate: endDate,
        requestDate: startDate
    }

    const thresholdsPairs = await makeThresholdPairsByPollutant(thresholdData)

    let ranges = []
    let globalResults = []

    const queryParams = {
        stationId: station,
        pollutant: pollutant,
        startDate: startDate,
        endDate: endDate,
    }

    for (let i = 0; i < thresholdsPairs.length; i++) {
        const [minValue, maxValue] = thresholdsPairs[i]
        const results = await getTimesExceedThreshold({
            ...queryParams,
            minThreshold: minValue,
            maxThreshold: maxValue
        })

        globalResults = globalResults.concat(results)

        let rangeKey = ''

        if (i === 0) {
            rangeKey = `Menor a ${maxValue}`
        } else if (i === thresholdsPairs.length - 1) {
            rangeKey = `Mayor a ${minValue}`
        } else {
            rangeKey = `${minValue} - ${maxValue}`
        }

        ranges.push({
            key: rangeKey,
            count: results.length
        })

    }

    return {
        pollutant: pollutantData,
        station: stationData,
        threshold: thresholdData,
        dates: datesData,
        ranges: ranges,
        results: globalResults
    }
}

const createPDF = async (data) => {
    const templatePath = path.join(process.cwd(), 'src', 'static', 'exceedThresholdsTemplate.html')
    const templateHtml = fs.readFileSync(templatePath, 'utf8')
    const template = handlebars.compile(templateHtml)
    const htmlContent = { content: template(data) }
    return await htmlToPdf.generatePdf(htmlContent, { format: 'A4' })
}

const exceedThresholdController = async (req, res) => {
    const errors = getErrors({...req.body})
    const hasErrors = Object.keys(errors).length > 0
    if (hasErrors) return res.status(400).json({message: errors})
    const reportData = await getReportDataPerPollutantAndStation({...req.body})
    const reportPDF = await createPDF(reportData)
    res.contentType('application/pdf')
    return res.send(reportPDF)
}

module.exports = {
    exceedThresholdController
}
