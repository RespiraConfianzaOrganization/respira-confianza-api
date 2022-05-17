const exceedUmbralsReportcontroller = require("../controllers/reports/exceed_umbrals");

const addRoutes = (router) => {
    router.post(
        "/reports/exceed-threshold",
        exceedUmbralsReportcontroller.receiveReportRequest
    );
}

module.exports = { addRoutes }
