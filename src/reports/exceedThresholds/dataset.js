const moment = require("moment")

const getOptions = ({pollutantUnit, xScales, yScales}) => {

    return {
        animations: false,
        showLine: false,
        hover: {
            animationDuration: 0
        },
        responsiveAnimationDuration: 0,
        plugins: {
            legend: {
                position: 'bottom',
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Fecha'
                },
                type: 'timeseries',
                time: {
                    'unit': 'month'
                },
                ...xScales
            },
            y: {
                title: {
                    display: true,
                    text: `Concentración ${pollutantUnit}`
                },
                ...yScales
            }
        }
    }
}

const getColorDependingOnThreshold = ({value, thresholds}) => {
    // https://color-hex.org/color-palettes/187
    const {good, moderate, unhealthy, very_unhealthy} = thresholds
    let color
    if (value <= good){
        color = '#2cba00'
    } else if (value >= good && value <= moderate){
        color = '#a3ff00'
    } else if (value >= moderate && value <= unhealthy){
        color = '#fff400'
    } else if (value >= unhealthy && value <= very_unhealthy){
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
            value: value.y,
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
