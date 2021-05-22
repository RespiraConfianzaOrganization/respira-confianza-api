const countryController = require("../controllers/country")

const addRoutes = (router) => {
  router.get("/countries", countryController.getCoutries);
}

module.exports = { addRoutes }