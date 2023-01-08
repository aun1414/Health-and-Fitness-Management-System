const router = require('express').Router();

const {uploadFile, getFile} = require('../controllers/ipfs')

router.post('/uploadFile', uploadFile)
router.post('/getFile', getFile)

module.exports = router