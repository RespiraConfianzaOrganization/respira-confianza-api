const express = require("express");
const router = express.Router();


const authController = require("../controllers/auth")
const adminController = require("../controllers/admin")

router.get('/auth/isAuthenticated', authController.isAuthenticated)
router.get('/auth/isAuthenticatedAdmin', authController.isAuthenticatedAdmin)
router.post('/auth/login', authController.login)


// ADMINS
router.get('/admins', authController.isAuthenticated, adminController.getAdmins)
router.get('/admins/:id', authController.isAuthenticated, adminController.getAdmin)
router.post('/admins/new', authController.isAuthenticated, adminController.newAdmin)
router.put('/admins/:id', authController.isAuthenticated, adminController.editAdmin)
router.delete('/admins/:id', authController.isAuthenticated, adminController.deleteAdmin)

module.exports = router;
