const router = require('express').Router();
const { getPatientProfile, updateSteps, getPatientProfileDataOnSteps, updateAge, updateBloodGroup, updateGender, updateHeight, updateWeight, updateTarget, getPatientTargetSteps } = require('../controllers/patientprofile')


router.post('/get', getPatientProfile)
router.post('/updateSteps', updateSteps)
router.post('/getPatientProfileDataOnSteps', getPatientProfileDataOnSteps)
router.post('/updateAge', updateAge)
router.post('/updateBloodGroup', updateBloodGroup)
router.post('/updateGender', updateGender)
router.post('/updateHeight', updateHeight)
router.post('/updateWeight', updateWeight)
router.post('/updateTarget', updateTarget)
router.post('/getTargetSteps', getPatientTargetSteps)

module.exports = router