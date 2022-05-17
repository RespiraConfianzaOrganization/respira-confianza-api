const pollutantsByStationController = require("../controllers/public/pollutant_station_readings");

const addRoutes = (router) => {
    router.post(
        "/pollutants-by-stations",
        pollutantsByStationController.pollutantsByStations
    );
}

module.exports = { addRoutes }
