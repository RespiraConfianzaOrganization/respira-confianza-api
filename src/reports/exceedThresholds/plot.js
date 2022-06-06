const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

const width = 400; //px
const height = 400; //px
const backgroundColour = 'white'; // Uses https://www.w3schools.com/tags/canvas_fillstyle.asp
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour });

const configuration = {
    type: 'line',   // for line chart
    data: {
        labels: [2018, 2019, 2020, 2021],
        datasets: [{
            label: "Sample 1",
            data: [10, 15, -20, 15],
            fill: false,
            borderColor: ['rgb(51, 204, 204)'],
            borderWidth: 1,
            xAxisID: 'xAxis1' //define top or bottom axis ,modifies on scale
        },
            {
                label: "Sample 2",
                data: [10, 30, 20, 10],
                fill: false,
                borderColor: ['rgb(255, 102, 255)'],
                borderWidth: 1,
                xAxisID: 'xAxis1'
            },
        ],

    },
    options: {
        scales: {
            y: {
                suggestedMin: 0,
            }
        }
    }
};

const getDataURL = async () => {
    return await chartJSNodeCanvas.renderToDataURL(configuration)
}

module.exports = {
    getDataURL
}
