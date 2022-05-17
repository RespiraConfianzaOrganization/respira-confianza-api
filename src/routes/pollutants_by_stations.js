const reportsExceedsUmbrals = require("../controllers/reports/exceed_umbrals");

const addRoutes = (router) => {
    router.post(
        "/pollutants-by-stations",
        reportsExceedsUmbrals.receiveReportRequest
    );
}

module.exports = { addRoutes }
