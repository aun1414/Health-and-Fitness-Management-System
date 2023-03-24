const router = require('express').Router();
const { addDoctor, addPatient, signinDoctor, signinPatient, uploadFile, uploadVitals, getAllFilesByPatientandType, getAllFilesByPatient, getFileType, getAllPermissionedFilesByPatient, getAllPermissionedFilesByDoctor, grantPermission, revokePermission } = require('../controllers/contracts')

router.post('/addDoctor', addDoctor)
router.post('/addPatient', addPatient)
router.post('/signinDoctor', signinDoctor)
router.post('/signinPatient', signinPatient)
router.post('/uploadFile', uploadFile)
router.post('/uploadVitals', uploadVitals)
router.post('/getFilesbyPatientandType', getAllFilesByPatientandType)
router.post('/getFilesByPatient', getAllFilesByPatient)
router.post('/getFileType', getFileType)
router.post('/getPermissionedFilesByPatient', getAllPermissionedFilesByPatient)
router.post('/getPermissionedFilesByDoctor', getAllPermissionedFilesByDoctor)
router.post('/grantPermission', grantPermission)
router.post('/revokePermission', revokePermission)

module.exports = router