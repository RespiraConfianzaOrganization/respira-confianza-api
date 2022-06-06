const {chartJSNodeCanvas} = require("./chart");


const getDataURL = async (dataset) => {
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
                },
                y: {
                    title: {
                        display: true,
                        text: `Concentración ${"pollutantUnit"}`
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
