const moment = require("moment");
const {getPollutant, getStation, getThresholdByPollutant} = require("./queries");

const isValidDate = value => {
    try {
        return moment(value, 'YYYY-MM-DD').isValid()
    } catch(e) {
        return false
    }
}

const datesAreValid = (startDate, endDate) => {
    try {
        const parsedStartDate = moment(startDate, 'YYYY-MM-DD')
        const parsedEndDate = moment(endDate, 'YYYY-MM-DD')
        return parsedEndDate.diff(parsedStartDate, 'days') >= 0
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
