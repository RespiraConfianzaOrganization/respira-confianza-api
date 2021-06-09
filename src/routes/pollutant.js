const pollutantController = require("../controllers/pollutant");

const addRoutes = (router) => {
  //Public
  router.get(
    "/pollutants",
    pollutantController.getPollutants
  );

}

module.exports = { addRoutes }