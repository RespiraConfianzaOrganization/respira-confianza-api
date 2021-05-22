const authController = require("../controllers/auth");
const stationReadingsController = require("../controllers/station_readings");

const addRoutes = (router) => {
  router.get(
    "/station-readings",
    authController.isAuthenticated,
    stationReadingsController.getStationReadings
  );

  router.post(
    "/station-readings",
    stationReadingsController.receiveReading
  );
}

module.exports = { addRoutes }