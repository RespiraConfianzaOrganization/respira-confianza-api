const validators = require("../validators");
const {isValidDate, datesAreValid, pollutantIsValid, stationIsValid, thresholdIsValid} = validators;

const getErrors = async ({startDate, endDate, pollutant, station, requestDate}) => {
    let errors = {}
    if (!isValidDate(startDate)) {
        errors['startDate'] = ['Fecha obligatoria. Debe estar en formato YYYY-MM-DD']
    }
    if (!isValidDate(endDate)) {
        errors['endDate'] = ['Fecha obligatoria. Debe estar en formato YYYY-MM-DD']
    }
    if (!isValidDate(requestDate)) {
        errors['requestDate'] = ['Debe estar en formato YYYY-MM-DD']
    }
    if (!datesAreValid(startDate, endDate)) {
        const currentStartDateErrors = errors['startDate'] || []
        currentStartDateErrors.push('Debe ser menor o igual que endDate y estar en YYYY-MM-DD')
        errors['startDate'] = currentStartDateErrors

        const currentEndDateErrors = errors['endDate'] || []
        currentEndDateErrors.push('Debe ser mayor o igual que startDate y estar en formato YYYY-MM-DD')
        errors['endDate'] = currentEndDateErrors
    }
    if (!await pollutantIsValid(pollutant)) {
        const currentError = errors['pollutant'] || []
        currentError.push(`Pollutant ${pollutant} no encontrado`)
        errors['pollutant'] = currentError
    }
    if (!await stationIsValid(station)) {
        const currentError = errors['station'] || []
        currentError.push(`Estación ${station} no encontrada`)
        errors['station'] = currentError
    }
    if (!await thresholdIsValid(pollutant)) {
        const currentError = errors['pollutant'] || []
        currentError.push(`Umbrales no encontrados para pollutant ${pollutant}`)
        errors['pollutant'] = currentError
    }
    return errors
}

module.exports = {
    getErrors
}
