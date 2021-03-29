const express = require("express");
const router = express.Router();


const authController = require("../controllers/auth")
const adminController = require("../controllers/admin")
const sensorTypeController = require("../controllers/sensor_type")
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

// SensorTypes
router.get('/sensor-types', authController.isAuthenticated, sensorTypeController.getSensorTypes)
router.get('/sensor-types/:id', authController.isAuthenticated, sensorTypeController.getSensorType)
router.post('/sensor-types/new', authController.isAuthenticated, sensorTypeController.newSensorType)
router.put('/sensor-types/:id', authController.isAuthenticated, sensorTypeController.editSensorType)
router.delete('/sensor-types/:id', authController.isAuthenticated, sensorTypeController.deleteSensorType)


// Umbrals
router.get('/sensor-umbrals', authController.isAuthenticated, umbralsController.getAllUmbrals)
router.get('/sensor-umbrals/:id', authController.isAuthenticated, umbralsController.getSensorUmbrals)
router.post('/sensor-umbrals/new', authController.isAuthenticated, umbralsController.newSensorUmbrals)
router.put('/sensor-umbrals/:id', authController.isAuthenticated, umbralsController.editSensorUmbrals)
router.delete('/sensor-umbrals/:id', authController.isAuthenticated, umbralsController.deleteSensorUmbrals)


module.exports = router;
