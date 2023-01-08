const router = require('express').Router();
const { createDoctor, signin, getDoctor } = require('../controllers/doctor')



router.post('/create', createDoctor)
router.post('/signin', signin)
router.post('/get', getDoctor)

module.exports = router