const express = require("express");
const router = express.Router();


const authController = require("../controllers/auth")
const adminController = require("../controllers/admin")
const pollutantController = require("../controllers/pollutant")
const stationController = require("../controllers/station")
const umbralsController = require("../controllers/umbrals")

router.get('/auth/isAuthenticated', authController.isAuthenticated)
router.get('/auth/isAuthenticatedAdmin', authController.isAuthenticatedAdmin)
router.post('/auth/login', authController.login)


// ADMINS
router.get('/admins', authController.isAuthenticated, adminController.getAdmins)
router.get('/admins/:id', authController.isAuthenticated, adminController.getAdmin)
router.post('/admins/new', authController.isAuthenticated, adminController.newAdmin)
router.put('/admins/:id', authController.isAuthenticated, adminController.editAdmin)
router.delete('/admins/:id', authController.isAuthenticated, adminController.deleteAdmin)

// STATIONS
router.get('/stations', authController.isAuthenticated, stationController.getStations)
router.get('/stations/:id', authController.isAuthenticated, stationController.getStation)
router.post('/stations/new', authController.isAuthenticated, stationController.newStation)
router.put('/stations/:id', authController.isAuthenticated, stationController.editStation)
router.delete('/stations/:id', authController.isAuthenticated, stationController.deleteStation)

// Pollutants
router.get('/pollutants', authController.isAuthenticated, pollutantController.getPollutants)

// Umbrals
router.get('/pollutant-umbrals', authController.isAuthenticated, umbralsController.getAllUmbrals)
router.get('/pollutant-umbrals/:id', authController.isAuthenticated, umbralsController.getPollutantUmbrals)
router.post('/pollutant-umbrals/new', authController.isAuthenticated, umbralsController.newPollutantUmbrals)
router.put('/pollutant-umbrals/:id', authController.isAuthenticated, umbralsController.editPollutantUmbrals)
router.delete('/pollutant-umbrals/:id', authController.isAuthenticated, umbralsController.deletePollutantUmbrals)


module.exports = router;
