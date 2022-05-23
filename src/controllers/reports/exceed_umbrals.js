const validators = require("./validators");
const {getThresholdByPollutant, getPollutant, getStation, getTimesExceedThreshold} = require("./queries")

const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const htmlToPdf = require('html-pdf-node');

const {isValidDate, datesAreValid, pollutantIsValid, stationIsValid, thresholdIsValid} = validators;

const getErrors = async ({startDate, endDate, pollutant, station, requestDate}) => {
    let errors = {}
    if (!isValidDate(startDate)) {
        errors['startDate'] = ['Fecha obligatoria. Debe estar en formato YYYY-MM-DD']
    }
    if (!isValidDate(endDate)) {
        errors['endDate'] = ['Fecha obligatoria. Debe estar en formato YYYY-MM-DD']
    }
    if (!isValidDate(requestDate)) {
        errors['requestDate'] = ['Debe estar en formato YYYY-MM-DD']
    }
    if (!datesAreValid(startDate, endDate)) {
        const currentStartDateErrors = errors['startDate'] || []
        currentStartDateErrors.push('Debe ser menor o igual que endDate y estar en YYYY-MM-DD')
        errors['startDate'] = currentStartDateErrors

        const currentEndDateErrors = errors['endDate'] || []
        currentEndDateErrors.push('Debe ser mayor o igual que startDate y estar en formato YYYY-MM-DD')
        errors['endDate'] = currentEndDateErrors
    }
    if (!await pollutantIsValid(pollutant)) {
        const currentError = errors['pollutant'] || []
        currentError.push(`Pollutant ${pollutant} no encontrado`)
        errors['pollutant'] = currentError
    }
    if (!await stationIsValid(station)) {
        const currentError = errors['station'] || []
        currentError.push(`Estación ${station} no encontrada`)
        errors['station'] = currentError
    }
    if (!await thresholdIsValid(pollutant)) {
        const currentError = errors['pollutant'] || []
        currentError.push(`Umbrales no encontrados para pollutant ${pollutant}`)
        errors['pollutant'] = currentError
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

const getReportDataPerPollutantAndStation = async ({pollutant, station, startDate, endDate, requestDate}) => {

    const pollutantData = await getPollutant(pollutant)
    const stationData = await getStation(station)
    const thresholdData = await getThresholdByPollutant(pollutant)
    const datesData = {
        startDate: startDate,
        endDate: endDate,
        requestDate: requestDate
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
    const body = req.body
    const errors = await getErrors({...body})
    const hasErrors = Object.keys(errors).length > 0
    if (hasErrors) return res.status(400).json({errors: errors})
    const reportData = await getReportDataPerPollutantAndStation({...body})
    const templatePath = path.join(process.cwd(), 'src/static/exceedThresholdsTemplate.html')
    const reportPDF = await createPDF(reportData, templatePath)
    return res.status(200).contentType('application/pdf').send(reportPDF)
}

module.exports = {
    exceedThresholdController
}
