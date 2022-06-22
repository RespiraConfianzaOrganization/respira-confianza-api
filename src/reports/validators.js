const moment = require("moment");
const {getPollutant, getStation, getThresholdByPollutant} = require("./queries");

const isValidDate = (value, format='YYYY-MM-DD') => {
    try {
        return moment(value, format).isValid()
    } catch(e) {
        return false
    }
}

const datesAreValid = (startDate,
                       endDate,
                       startFormat='YYYY-MM-DD',
                       endFormat='YYYY-MM-DD',
                       diffUnit='days'
) => {
    try {
        const parsedStartDate = moment(startDate, startFormat)
        const parsedEndDate = moment(endDate, endFormat)
        return parsedEndDate.diff(parsedStartDate, diffUnit) >= 0
    } catch (e) {
        return false
    }
}

const pollutantIsValid = async (pollutantName) => {
    try {
        const pollutant = await getPollutant(pollutantName)
        return pollutantName.toString() === pollutant.name.toString()
    } catch (e) {
        return false
    }
}

const stationIsValid = async (stationID) => {
    try {
       const station = await getStation(stationID)
       return stationID.toString() === station.id.toString()
    } catch (e) {
        return false
    }
}

const thresholdIsValid = async (pollutantName) => {
    try {
        const threshold = await getThresholdByPollutant(pollutantName)
        return threshold.Pollutant.name.toString() === pollutantName.toString()
    } catch (e) {
        return false
    }
}

module.exports = {
    isValidDate, datesAreValid, pollutantIsValid, stationIsValid, thresholdIsValid
}
