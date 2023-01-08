const router = require('express').Router();
const { createPatient, signin, getPatient } = require('../controllers/patient')



router.post('/create', createPatient)
router.post('/signin', signin)
router.post('/get', getPatient)

module.exports = router