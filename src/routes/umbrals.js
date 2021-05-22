const authController = require("../controllers/auth");
const umbralsController = require("../controllers/umbrals");

const addRoutes = (router) => {
  router.get(
    "/pollutant-umbrals",
    authController.isAuthenticated,
    umbralsController.getAllUmbrals
  );
  router.get(
    "/pollutant-umbrals/:id",
    authController.isAuthenticated,
    umbralsController.getPollutantUmbrals
  );
  router.post(
    "/pollutant-umbrals/new",
    authController.isAuthenticated,
    umbralsController.newPollutantUmbrals
  );
  router.put(
    "/pollutant-umbrals/:id",
    authController.isAuthenticated,
    umbralsController.editPollutantUmbrals
  );
  router.delete(
    "/pollutant-umbrals/:id",
    authController.isAuthenticated,
    umbralsController.deletePollutantUmbrals
  );
}

module.exports = { addRoutes }