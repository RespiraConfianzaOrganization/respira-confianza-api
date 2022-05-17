import moment from "moment";

export const datesAreValids = (startDate, endDate) => {
    try {
        const parsedStartDate = moment(startDate, 'YYYY-MM-DD')
        const parsedEndDate = moment(endDate, 'YYYY-MM-DD')
        return parsedEndDate.diff(parsedStartDate, 'days') >= 0
    } catch (e) {
        return false
    }
}

export const pollutantsAreValids = pollutants => {
    try {
        return true
    } catch (e) {
        return false
    }
}

export const stationsAreValids = pollutants => {
    try {
       return true
    } catch (e) {
        return false
    }
}

export const thresholdAreValids = pollutants => {
    try {
        return true
    } catch (e) {
        return false
    }
}
