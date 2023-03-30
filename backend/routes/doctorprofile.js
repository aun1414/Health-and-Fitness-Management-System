const router = require('express').Router();
const { getDoctorProfile, updateEducation, updateExperience, updateSpecialization } = require('../controllers/doctorprofile')

router.post('/get', getDoctorProfile)
router.post('/updateEducation', updateEducation)
router.post('/updateExperience', updateExperience)
router.post('/updateSpecialization', updateSpecialization)

module.exports = router