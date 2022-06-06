const moment = require("moment")

Number.prototype.between = function (min, max) {
    if (min && max) return this >= min && this <= max
    else if (min && !max) return this >= min
    else if (!min && max) return this <= max
    else return false
}

const getColorDependingOnThreshold = ({value, thresholds}) => {
    // https://color-hex.org/color-palettes/187
    const {good, moderate, unhealthy, very_unhealthy} = thresholds
    let color
    if (value.between(0, good)){
        color = '#2cba00'
    } else if (value.between(good, moderate)){
        color = '#a3ff00'
    } else if (value.between(moderate, unhealthy)){
        color = '#fff400'
    } else if (value.between(unhealthy, very_unhealthy)){
        color = '#ffa700'
    } else {
        color = '#ff0000'
    }
    return color
}

const getCurrentDatasets = ({readings, station, thresholds}) => {
    const stationName = station.name
    const stationReadings = readings
    const currentValues = []
    const dotsColors = []
    stationReadings.forEach(o => {
        const value = {
            x: o.recorded_at,
            y: o.value,
        }
        const currentColor = getColorDependingOnThreshold({
            value: o.value,
            thresholds: thresholds
        })
        dotsColors.push(currentColor)
        currentValues.push(value)
    })

    return [{
        label: stationName,
        data: currentValues,
        backgroundColor: dotsColors
    }]
}

module.exports = {
    getCurrentDatasets
}
