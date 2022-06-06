const {getPollutant, getStation, getThresholdByPollutant, getTimesExceedThreshold} = require("../queries");
const {getDataURL} = require("./plot");
const {getCurrentDatasets} = require("./dataset");

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

    const dataset = getCurrentDatasets({
        readings: globalResults,
        station: stationData,
        thresholds: thresholdData
    })

    const dataUrl = await getDataURL(dataset, startDate, endDate)

    return {
        pollutant: pollutantData,
        station: stationData,
        threshold: thresholdData,
        dates: datesData,
        ranges: ranges,
        results: globalResults,
        chart: {
            src: dataUrl,
            alt: "hola"
        }
    }
}

module.exports = {
    getReportDataPerPollutantAndStation
}
