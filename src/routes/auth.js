
const authController = require("../controllers/auth");

const addRoutes = (router) => {
  router.get("/auth/isAuthenticated", authController.isAuthenticated);
  router.get("/auth/isAuthenticatedAdmin", authController.isAuthenticatedAdmin);
  router.post("/auth/login", authController.login);
}

module.exports = { addRoutes }