const Doctor = require('../models/doctor');
const { sendError } = require('../utils/helper');
const PRE = require('recrypt-js');
const Patient = require('../models/patient');
const PatientProfile = require('../models/patientprofile')
const counter= require('../counter')
const Web3=require('web3')

//create a new patient in database
exports.createPatient = async (req, res) => {

    const { name, email, password } = req.body

    var addressid=""

    const patient = await Patient.findOne({email});

    //check if email is not already registered
    if (patient) {
       return sendError(res, "This email is already registered");
    }
   
    else {
        if (typeof web3 !== 'undefined') {
            var web3 = new Web3(web3.currentProvider); 
        } else {
            var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
        }

        //assign an available account from available accounts

        const accounts = await web3.eth.getAccounts()
       
        while(global.Counter<accounts.length){
            
            addressid=accounts[global.Counter] 
            console.log(addressid)
            const doctorfound = await Doctor.findOne({ addressid });
            const patientfound = await Patient.findOne({ addressid });
            if(doctorfound){
                addressid=""
                global.Counter++;
            }
            else if(patientfound){
                addressid=""
                global.Counter++;
            }
            else{
                break;
            }
            

        }
        if(addressid==""){
            res.status(200).json({success: false, error:"No accounts left" })

        }
        else{
            var kp_A = PRE.Proxy.generate_key_pair();
            var privatekey = PRE.Proxy.to_hex(kp_A.get_private_key().to_bytes());
            var publickey = PRE.Proxy.to_hex(kp_A.get_public_key().to_bytes());
            const newPatient = new Patient({
                name,
                email,
                addressid,
                password,
                publickey
            })
        
            await newPatient.save();
            const patientProfile = new PatientProfile({
                patient: newPatient
            })
            await patientProfile.save();

            res.status(200).json({success: true, patient: newPatient, key: privatekey})
        }
    }

}

//sign in a patient from database
exports.signin = async (req, res) => {
    const { email, password } = req.body

    if (!email.trim() || !password.trim()) {
        return sendError(res, "Email/Password is required");

    }
    else{
        const patient = await Patient.findOne({email});

        if(!patient){
            return sendError(res, "Patient Email not registered");
        }
        else{
            const foundPatient = await patient.comparePassword(password);
            if(!foundPatient){
                return sendError(res, "Incorrect Password");
            }
            else{
                res.json({success: true, patient: {name: patient.name, addressid: patient.addressid, id: patient._id, publickey: patient.publickey}})
            }

        }
    }

}

//get patient from database
exports.getPatient = async (req, res) => {

    try{

    const {addressid} = req.body

   

        const patient = await Patient.findOne({addressid});

        if(!patient){
            return sendError(res, "Patient id not registered");
        }
        else{
            res.json({success: true, patient: {name: patient.name, addressid: patient.addressid, id: patient._id, email: patient.email, publickey: patient.publickey}})
        }
    }
    catch (error) {
        res.json({success: false})
    }
    

}