const router = require('express').Router();
const { getDoctorProfile } = require('../controllers/doctorprofile')


router.post('/get', getDoctorProfile)

module.exports = router