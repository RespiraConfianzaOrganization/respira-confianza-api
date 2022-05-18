const validators = require("./validators");
const {getThresholdByPollutant, getPollutant, getStation, getTimesExceedThreshold} = require("./queries")

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

const getConsecutivePairs = array => {
    const output = []
    for (let i = 0; i < array.length - 1; i++) {
        const currentPair = [array[i], array[i + 1]]
        output.push(currentPair)
    }
    return output
}

const makeThresholdPairsByPollutant = async (thresholds) => {
    const {good, moderate, unhealthy, very_unhealthy} = thresholds
    const thresholdsValues = [0, good, moderate, unhealthy, very_unhealthy, Infinity]
    return getConsecutivePairs(thresholdsValues)
}

const getLabel = ({isLastValue, isFirstValue, minValue, maxValue}) => {
    if (isFirstValue) {
        return `Menor a ${maxValue}`
    } else if (isLastValue) {
        return `Mayor a ${minValue}`
    } else {
        return `${minValue} - ${maxValue}`
    }
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
    for (let i = 0; i < thresholdsPairs.length; i++) {
        const [minValue, maxValue] = thresholdsPairs[i]
        const results = await getTimesExceedThreshold({
            stationId: station,
            pollutant: pollutant,
            startDate: startDate,
            endDate: endDate,
            minThreshold: minValue,
            maxThreshold: maxValue
        })
        const label = getLabel({
            isLastValue: i === thresholdsPairs.length - 1,
            isFirstValue: i === 0,
            minValue: minValue,
            maxValue: maxValue
        })
        ranges.push({
            key: label,
            count: results.length
        })
        globalResults = globalResults.concat(results)
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

const createPDF = async (data, templatePath) => {
    const templateHtml = fs.readFileSync(templatePath, 'utf8')
    const template = handlebars.compile(templateHtml)
    const htmlContent = {content: template(data)}
    return await htmlToPdf.generatePdf(htmlContent, {format: 'A4'})
}

const exceedThresholdController = async (req, res) => {
    const errors = getErrors({...req.body})
    const hasErrors = Object.keys(errors).length > 0
    if (hasErrors) return res.status(400).json({message: errors})
    const reportData = await getReportDataPerPollutantAndStation({...req.body})
    const templatePath = path.join(process.cwd(), 'src', 'static', 'exceedThresholdsTemplate.html')
    const reportPDF = await createPDF(reportData, templatePath)
    res.contentType('application/pdf')
    return res.send(reportPDF)
}

module.exports = {
    exceedThresholdController
}
