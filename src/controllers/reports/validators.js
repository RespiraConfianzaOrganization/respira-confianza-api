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

const pollutantsAreValid = pollutants => {
    try {
        return true
    } catch (e) {
        return false
    }
}

const stationsAreValid = pollutants => {
    try {
       return true
    } catch (e) {
        return false
    }
}

const thresholdAreValid = pollutants => {
    try {
        return true
    } catch (e) {
        return false
    }
}

module.exports = {
    datesAreValid, pollutantsAreValid, stationsAreValid, thresholdAreValid
}
