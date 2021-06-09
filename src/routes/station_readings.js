const authController = require("../controllers/auth");
const stationReadingsController = require("../controllers/station_readings");
const publicStationReadingsController = require("../controllers/public/station_readings");

const addRoutes = (router) => {
  //Private
  router.get(
    "/station-readings",
    authController.isAuthenticated,
    stationReadingsController.getStationReadings
  );
  //Public
  router.post(
    "/station-readings",
    publicStationReadingsController.receiveReading
  );
}

module.exports = { addRoutes }