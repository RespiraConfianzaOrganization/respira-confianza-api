const cityController = require("../controllers/city")

const addRoutes = (router) => {
  router.get("/cities", cityController.getCities);
  router.get("/cities/country/:country", cityController.getCitiesByCountry)
}

module.exports = { addRoutes }