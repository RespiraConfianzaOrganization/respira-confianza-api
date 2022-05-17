const express = require("express");
const router = express.Router();

const adminRoutes = require("./admin")
const authRoutes = require('./auth')
const cityRoutes = require('./city')
const countryRoutes = require("./country")
const pollutantStationRoutes = require('./pollutant_station')
const pollutantRoutes = require("./pollutant")
const stationReadingRoutes = require('./station_readings')
const stationRoutes = require('./stations')
const umbralsRoutes = require('./umbrals')
const pollutantsByStationsRoutes = require('./pollutants_by_stations')
const reportsRoutes = require('./reports')

adminRoutes.addRoutes(router)
authRoutes.addRoutes(router)
cityRoutes.addRoutes(router)
countryRoutes.addRoutes(router)
pollutantStationRoutes.addRoutes(router)
pollutantRoutes.addRoutes(router)
stationReadingRoutes.addRoutes(router)
stationRoutes.addRoutes(router)
umbralsRoutes.addRoutes(router)
pollutantsByStationsRoutes.addRoutes(router)
reportsRoutes.addRoutes(router)

module.exports = router
