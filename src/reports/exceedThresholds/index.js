const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const htmlToPdf = require('html-pdf-node');
const {getErrors} = require("./validator");
const {getReportDataPerPollutantAndStation} = require("./utils");
const {getDataURL} = require("./plot");

const createPDF = async (data, templatePath) => {
    const templateHtml = fs.readFileSync(templatePath, 'utf8')
    const template = handlebars.compile(templateHtml)
    const htmlContent = {content: template(data)}
    const options = {
        format: 'A4',
    }
    return await htmlToPdf.generatePdf(htmlContent, options).catch(e => console.log(e))
}

const exceedThresholdController = async (req, res) => {
    const body = req.body
    const errors = await getErrors({...body})
    const hasErrors = Object.keys(errors).length > 0
    if (hasErrors) return res.status(400).json({errors: errors})
    const reportData = await getReportDataPerPollutantAndStation({...body})
    const templatePath = path.join(process.cwd(), 'public/templates/exceedThresholdsTemplate.html')
    const reportPDF = await createPDF(reportData, templatePath)
    return res.status(200).contentType('application/pdf').send(reportPDF)
}

module.exports = {
    exceedThresholdController
}
