const router = require('express').Router();
const { getPatientProfile, updateSteps, getPatientProfileDataOnSteps } = require('../controllers/patientprofile')


router.post('/get', getPatientProfile)
router.post('/updateSteps', updateSteps)
router.post('/getPatientProfileDataOnSteps', getPatientProfileDataOnSteps)

module.exports = router