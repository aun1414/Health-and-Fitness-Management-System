const { sendError } = require('../utils/helper');
const PRE = require('recrypt-js');


//Encrypt a text using public key
exports.EncryptFile = async (req, res) => {
    const {key, dataToEncrypt} = req.body

   try {
    var pt=JSON.stringify(dataToEncrypt)
    const encryptedFile=PRE.encryptData(key, pt)
    res.json({success: true, encryptedFile})
   } catch (error) {
    res.json({success: false})
   }


}

//decrypt a text usingprivate key
exports.DecryptFile = async (req, res) => {
    
    const {key, dataToDecrypt} = req.body


    try {
       
        const decryptedFile=PRE.decryptData(key, JSON.parse(dataToDecrypt))


        res.json({success: true, decryptedFile})
        
    } catch (error) {
        console.log(error)
        res.json({success: false})
    }

    
    
}

//Reencrypt a text by creating secret key from public key of reciever and private key of owner
exports.ReencryptFile = async (req, res) => {
    const {privateKeyPatient, publickKeyDoctor, dataToReEncrypt} = req.body

   try {
    
    var pt=JSON.parse(dataToReEncrypt)
    let rk = PRE.generateReEncrytionKey(privateKeyPatient, publickKeyDoctor);
    
    PRE.reEncryption(rk, pt)
    
    res.json({success: true, encryptedFile: pt})
   } catch (error) {
    res.json({success: false})
   }


}

