const adapter = require("chartjs-adapter-moment")
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

const width = 750; //px
const height = 600; //px
const backgroundColour = 'white'; // Uses https://www.w3schools.com/tags/canvas_fillstyle.asp
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour });

module.exports = {
    chartJSNodeCanvas
}
