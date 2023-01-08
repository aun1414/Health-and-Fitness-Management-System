const Web3 = require('web3');
const { SIMP_STORAGE_ROLES_ABI, SIMP_STORAGE_ROLES_ADDRESS, SIMP_STORAGE_IPFS_ABI, SIMP_STORAGE_IPFS_ADDRESS, SIMP_STORAGE_PERMISSIONS_ABI, SIMP_STORAGE_PERMISSIONS_ADDRESS } = require('../config')
const { sendError } = require('../utils/helper');

//adding new doctor to the contract
exports.addDoctor = async (req, res) => {
    if (typeof web3 !== 'undefined') {
        var web3 = new Web3(web3.currentProvider); 
    } else {
        var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
    }

    const {addressid} = req.body
    const role="Doctor"

    

    const roleContract = new web3.eth.Contract(SIMP_STORAGE_ROLES_ABI, SIMP_STORAGE_ROLES_ADDRESS);

    await roleContract.methods.addDoctor(addressid,role).send({from: addressid, gas:300000})

    res.json({success: true})
}

//adding new patient to the contract
exports.addPatient = async (req, res) => {
    if (typeof web3 !== 'undefined') {
        var web3 = new Web3(web3.currentProvider); 
    } else {
        var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
    }

    const {addressid} = req.body
    const role="Patient"
    
    
    // const accounts = await web3.eth.getAccounts();
    
 

    const roleContract = new web3.eth.Contract(SIMP_STORAGE_ROLES_ABI, SIMP_STORAGE_ROLES_ADDRESS);

    await roleContract.methods.addPatient(addressid,role).send({from: addressid, gas:300000})

    res.json({success: true})
}

//signin doctor usinsg roles contract
exports.signinDoctor = async (req, res) => {
    if (typeof web3 !== 'undefined') {
        var web3 = new Web3(web3.currentProvider); 
    } else {
        var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
    }

    const {addressid } = req.body

    
    
    // const accounts = await web3.eth.getAccounts();
    

    const roleContract = new web3.eth.Contract(SIMP_STORAGE_ROLES_ABI, SIMP_STORAGE_ROLES_ADDRESS);

    await roleContract.methods.loginDoctor(addressid).call({from: addressid, gas:300000}).then((resp) =>{
        if(resp){
            res.json({success: true})
        }
        else{
            return sendError(res, "Id not registered");
        }
    })
    
}

//signin patient using roles contract
exports.signinPatient = async (req, res) => {
    if (typeof web3 !== 'undefined') {
        var web3 = new Web3(web3.currentProvider); 
    } else {
        var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
    }

    const {addressid } = req.body

    
    
    // const accounts = await web3.eth.getAccounts();
    


    const roleContract = new web3.eth.Contract(SIMP_STORAGE_ROLES_ABI, SIMP_STORAGE_ROLES_ADDRESS);

    await roleContract.methods.loginPatient(addressid).call({from: addressid, gas:300000}).then((resp) =>{
        if(resp){
            res.json({success: true})
        }
        else{
            return sendError(res, "Id not registered");
        }
    })
    
}

//upload file to ipfs and permission contract
exports.uploadFile = async (req, res) => {
    if (typeof web3 !== 'undefined') {
        var web3 = new Web3(web3.currentProvider); 
    } else {
        var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
    }

    const {patientid, doctorid, fileType, hash} = req.body
    

    const ipfsContract = new web3.eth.Contract(SIMP_STORAGE_IPFS_ABI, SIMP_STORAGE_IPFS_ADDRESS);

    await ipfsContract.methods.setFile(hash, patientid, fileType, doctorid).send({from: doctorid, gas:900000})
    res.json({success: true})
}

//get all file hashes of a patient from contracts having certain type
exports.getAllFilesByPatientandType = async (req, resp) => {
    if (typeof web3 !== 'undefined') {
        var web3 = new Web3(web3.currentProvider); 
    } else {
        var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
    }

    const {patientid, fileType} = req.body
    

    const permissionContract = new web3.eth.Contract(SIMP_STORAGE_PERMISSIONS_ABI, SIMP_STORAGE_PERMISSIONS_ADDRESS);
    const ipfsContract = new web3.eth.Contract(SIMP_STORAGE_IPFS_ABI, SIMP_STORAGE_IPFS_ADDRESS);

    var files=[]

    await permissionContract.methods.getAllFilesbyPatient(patientid).call({from: patientid, gas:300000}).then(async (res) =>{
        

        for(var i=0; i<res.length; i++){
           await ipfsContract.methods.getFileNumByID(res[i]).call({from: patientid, gas:300000}).then(async (response)=>{

            await ipfsContract.methods.getFileType(response).call({from: patientid, gas:300000}).then(async (res1)=>{

                if(res1==fileType){
                    files.push(res[i]);
                }

                

            })


           })

        }

        resp.json({success: true, files})

    
    })
}

//get all file hashes of a patient from contracts
exports.getAllFilesByPatient = async (req, resp) => {
    if (typeof web3 !== 'undefined') {
        var web3 = new Web3(web3.currentProvider); 
    } else {
        var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
    }

    const {patientid} = req.body
    

    const permissionContract = new web3.eth.Contract(SIMP_STORAGE_PERMISSIONS_ABI, SIMP_STORAGE_PERMISSIONS_ADDRESS);
 
    var files=[]

    await permissionContract.methods.getAllFilesbyPatient(patientid).call({from: patientid, gas:300000}).then(async (res) =>{
        

        for(var i=0; i<res.length; i++){
            files.push(res[i]);

        }

        resp.json({success: true, files})

    
    })


}

//get type of file against a file hash from contracts
exports.getFileType = async (req, resp) => {
    try{
    if (typeof web3 !== 'undefined') {
        var web3 = new Web3(web3.currentProvider); 
    } else {
        var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
    }

    const {patientid,fileId} = req.body


    const ipfsContract = new web3.eth.Contract(SIMP_STORAGE_IPFS_ABI, SIMP_STORAGE_IPFS_ADDRESS);


    await ipfsContract.methods.getFileNumByID(fileId).call({from: patientid, gas:300000}).then(async (response)=>{

    await ipfsContract.methods.getFileType(response).call({from: patientid, gas:300000}).then(async (res1)=>{
        resp.json({success: true, fileType: res1})

    })

    
    })
}
catch (error) {
    resp.json({success: false})
}
}

//get all file hashes of a patient for which he/she have given permission to some doctor from contracts
exports.getAllPermissionedFilesByPatient = async (req, resp) => {
    try{
    if (typeof web3 !== 'undefined') {
        var web3 = new Web3(web3.currentProvider); 
    } else {
        var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
    }

    const {patientid} = req.body
    

    const permissionContract = new web3.eth.Contract(SIMP_STORAGE_PERMISSIONS_ABI, SIMP_STORAGE_PERMISSIONS_ADDRESS);
   
    const roleContract = new web3.eth.Contract(SIMP_STORAGE_ROLES_ABI, SIMP_STORAGE_ROLES_ADDRESS);

    
    const ipfsContract = new web3.eth.Contract(SIMP_STORAGE_IPFS_ABI, SIMP_STORAGE_IPFS_ADDRESS);


    var files=[]

    await permissionContract.methods.getAllFilesbyPatient(patientid).call({from: patientid, gas:300000}).then(async (res) =>{
        

        for(var i=0; i<res.length; i++){
        
            await roleContract.methods.getAllDoctors().call({from: patientid}).then(async (doctorsArr)=>{

                for(var j=0; j<doctorsArr.length; j++){
                    const perm = await ipfsContract.methods.getPermission(res[i], doctorsArr[j]).call()
                    if(perm){
                        files.push({file: res[i], doctor: doctorsArr[j]});
                        
                    }
                }
            })

        }

        resp.json({success: true, files})

    
    })
}
catch (error) {
    resp.json({success: false})
}


}


//get all file hashes whom the doctor has permission to from contracts
exports.getAllPermissionedFilesByDoctor = async (req, resp) => {
    try{
    if (typeof web3 !== 'undefined') {
        var web3 = new Web3(web3.currentProvider); 
    } else {
        var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
    }

    const {doctorid} = req.body
    

    const permissionContract = new web3.eth.Contract(SIMP_STORAGE_PERMISSIONS_ABI, SIMP_STORAGE_PERMISSIONS_ADDRESS);
   
    const ipfsContract = new web3.eth.Contract(SIMP_STORAGE_IPFS_ABI, SIMP_STORAGE_IPFS_ADDRESS);


    var files=[]

    await permissionContract.methods.getPermissionFilesbyDoctor(doctorid).call({from: doctorid, gas:300000}).then(async (res) =>{
        

        for(var i=0; i<res.length; i++){
            await permissionContract.methods.getFilesHashByPermissionedHash(res[i], doctorid).call({from: doctorid, gas:300000}).then(async (response)=>{

                await ipfsContract.methods.getFileNumByID(response).call({from: doctorid, gas:300000}).then(async (response1)=>{

                    await ipfsContract.methods.getFileType(response1).call({from: doctorid, gas:300000}).then(async (res1)=>{
        
                            files.push({file: res[i], fileHash:response, type: res1})
                    })
                })
    
    
               })
            

        }

        resp.json({success: true, files})

    
    })
}
catch (error) {
    resp.json({success: false})
}


}

//grant permission to doctor of a file
exports.grantPermission = async (req, res) => {
    try {

        if (typeof web3 !== 'undefined') {
            var web3 = new Web3(web3.currentProvider); 
        } else {
            var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
        }
    
        const {patientid, doctorid, fileId, pHash} = req.body
      
     
    
        const ipfsContract = new web3.eth.Contract(SIMP_STORAGE_IPFS_ABI, SIMP_STORAGE_IPFS_ADDRESS);
    
        await ipfsContract.methods.grantPermission(fileId,doctorid, pHash).send({from: patientid, gas:300000})
    
        res.json({success: true})
        
    } catch (error) {
        res.json({success: false})
        
    }
    
}

//revoke permission of a file from a doctor
exports.revokePermission = async (req, res) => {
    try {

        if (typeof web3 !== 'undefined') {
            var web3 = new Web3(web3.currentProvider); 
        } else {
            var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
        }
    
        const {patientid, doctorid, fileId} = req.body

      
     
    
        const ipfsContract = new web3.eth.Contract(SIMP_STORAGE_IPFS_ABI, SIMP_STORAGE_IPFS_ADDRESS);
    
        await ipfsContract.methods.revokePermission(fileId,doctorid).send({from: patientid, gas:300000})
    
        res.json({success: true})
        
    } catch (error) {
        res.json({success: false})
        
    }
    
}