const authController = require("../controllers/auth");
const pollutantController = require("../controllers/pollutant");

const addRoutes = (router) => {
  router.get(
    "/pollutants",
    authController.isAuthenticated,
    pollutantController.getPollutants
  );

}

module.exports = { addRoutes }