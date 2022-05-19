const moment = require("moment");

const datesAreValid = (startDate, endDate) => {
    try {
        const parsedStartDate = moment(startDate, 'YYYY-MM-DD')
        const parsedEndDate = moment(endDate, 'YYYY-MM-DD')
        return parsedEndDate.diff(parsedStartDate, 'days') >= 0
    } catch (e) {
        return false
    }
}

const pollutantIsValid = pollutantName => {
    try {
        return true
    } catch (e) {
        return false
    }
}

const stationIsValid = stationID => {
    try {
       return true
    } catch (e) {
        return false
    }
}

const thresholdIsValid = pollutantName => {
    try {
        return true
    } catch (e) {
        return false
    }
}

module.exports = {
    datesAreValid, pollutantIsValid, stationIsValid, thresholdIsValid
}
