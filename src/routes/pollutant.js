const authController = require("../controllers/auth");
const pollutantController = require("../controllers/pollutant");

const addRoutes = (router) => {
  router.get(
    "/pollutants",
    pollutantController.getPollutants
  );

}

module.exports = { addRoutes }