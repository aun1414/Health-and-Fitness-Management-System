const router = require('express').Router();

const {EncryptFile, DecryptFile, ReencryptFile} = require('../controllers/reencryption')

router.post('/encrypt', EncryptFile)
router.post('/decrypt', DecryptFile)
router.post('/reencrypt', ReencryptFile)

module.exports = router