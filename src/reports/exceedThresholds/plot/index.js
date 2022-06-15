const {chartJSNodeCanvas} = require("./canvas");

Number.prototype.betweenWithoutTouch = function (min, max) {
    if (min && max) return this >= min && this < max
    else if (min && !max) return this >= min
    else if (!min && max) return this < max
    else return false
}

const getColorDependingOnThreshold = ({value, thresholds}) => {
    const {good, moderate, unhealthy, very_unhealthy, dangerous} = thresholds
    let color
    if (value.between(0, good)){
        color = '#2cba00'
    } else if (value.between(good, moderate)){
        color = '#a3ff00'
    } else if (value.between(moderate, unhealthy)){
        color = '#fff400'
    } else if (value.between(unhealthy, very_unhealthy)){
        color = '#ffa700'
    } else if (value.between(very_unhealthy, dangerous)){
        color = '#CD2323FF'
    } else {
        color = '#ff0000'
    }
    return color
}

const makeDataset = ({readings, station, thresholds}) => {
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

const getChartBase64 = async (dataset, pollutantUnit, title) => {

    const [currentData] = dataset
    const {data} = currentData
    const labels = data.map(value => value.x).sort()

    const conf =  {
        type: 'bar',
        data: {
            labels: labels,
            datasets: dataset,
        },
        options: {
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
                title: {
                    display: true,
                    text: title
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Fecha'
                    },
                    type: 'timeseries',
                    time: {
                        'unit': 'day'
                    },
                    ticks: {
                        autoSkip: false,
                        maxRotation: 45,
                        minRotation: 45
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: `Concentración ${pollutantUnit}`
                    },
                }
            }
        }
    };

    return await chartJSNodeCanvas.renderToDataURL(conf)
}

module.exports = {
    getChartBase64,
    makeDataset
}
