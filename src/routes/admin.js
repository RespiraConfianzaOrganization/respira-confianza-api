const authController = require("../controllers/auth");
const adminController = require("../controllers/admin");

const addRoutes = (router) => {
  router.get(
    "/admins",
    authController.isAuthenticated,
    adminController.getAdmins
  );
  router.get(
    "/admins/:id",
    authController.isAuthenticated,
    adminController.getAdmin
  );
  router.post(
    "/admins/new",
    authController.isAuthenticated,
    adminController.newAdmin
  );
  router.put(
    "/admins/:id",
    authController.isAuthenticated,
    adminController.editAdmin
  );
  router.delete(
    "/admins/:id",
    authController.isAuthenticated,
    adminController.deleteAdmin
  );
}

module.exports = { addRoutes }
