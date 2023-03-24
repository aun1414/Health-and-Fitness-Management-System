const router = require('express').Router();
const { getPatientProfile } = require('../controllers/patientprofile')


router.post('/get', getPatientProfile)

module.exports = router