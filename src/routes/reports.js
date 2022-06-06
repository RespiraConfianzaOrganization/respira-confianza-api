const reports = require("../reports/index");

const addRoutes = (router) => {
    router.post(
        "/reports/exceed-threshold",
        reports.exceedThreshold
    );
}

module.exports = { addRoutes }
