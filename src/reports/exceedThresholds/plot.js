const {chartJSNodeCanvas} = require("./chart");
const adapter = require("chartjs-adapter-moment")


const getDataURL = async (dataset, pollutantUnit) => {

    const [currentData] = dataset
    const {data} = currentData
    const labels = data.map(value => value.x).sort()

    const title = []

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
                    text: 'Custom Chart Title'
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
    getDataURL
}
