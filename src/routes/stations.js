const authController = require("../controllers/auth");
const stationController = require("../controllers/station");
const publicStationController = require("../controllers/public/station")

const addRoutes = (router) => {
  // Public 
  router.get(
    "/stations/:id/status",
    publicStationController.stationStatus
  );

  router.get(
    "/stations/:id/status/last24Hours",
    publicStationController.last24HoursStatusByStation
  );

  router.get(
    "/stations/:id/status/lastMonth",
    publicStationController.lastMonthStatusByStation
  );

  router.get(
    "/stations/search",
    publicStationController.searchStations,
  );

  router.get(
    "/stations/status/pollutant/:pollutant",
    publicStationController.stationStatusByPollutant,
  );

  router.get(
    "/public/stations",
    stationController.getStationsPublic
  );

  //Private 

  router.get(
    "/stations",
    authController.isAuthenticated,
    stationController.getStations
  );

  router.get(
    "/stations/:id",
    authController.isAuthenticated,
    stationController.getStation
  );
  router.post(
    "/stations/new",
    authController.isAuthenticated,
    stationController.newStation
  );
  router.put(
    "/stations/:id",
    authController.isAuthenticated,
    stationController.editStation
  );
  router.delete(
    "/stations/:id",
    authController.isAuthenticated,
    stationController.deleteStation
  );
}

module.exports = { addRoutes }