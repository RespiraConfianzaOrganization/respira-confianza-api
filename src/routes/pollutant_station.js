const authController = require("../controllers/auth");
const pollutantStationController = require("../controllers/pollutant_station");

const addRoutes = (router) => {
  router.post(
    "/pollutant-station/new",
    authController.isAuthenticated,
    pollutantStationController.newPoluttantstation
  );

  router.delete(
    "/pollutant-station/:station_id&:pollutant_id",
    authController.isAuthenticated,
    pollutantStationController.deletePoluttantStation
  );
}

module.exports = { addRoutes }