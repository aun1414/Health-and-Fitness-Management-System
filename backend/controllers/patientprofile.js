const Doctor = require('../models/doctor');
const { sendError } = require('../utils/helper');
const PRE = require('recrypt-js');
const Patient = require('../models/patient');
const PatientProfile = require('../models/patientprofile')
const counter= require('../counter')
const Web3=require('web3')


//get patient profile from database
exports.getPatientProfile = async (req, res) => {

    try{

        const {addressid} = req.body

   

        const patient = await Patient.findOne({addressid});

        if(!patient){
            return sendError(res, "Patient id not registered");
        }
        else{
            const patientProfile = await PatientProfile.findOne({patient}).populate('patient');
            res.json({success: true, patientProfile})
        }
    }
    catch (error) {
        res.json({success: false})
    }
    

}

//update daily Steps taken by patient in database
exports.updateSteps = async (req, res) => {

    try{
        const {addressid, steps, date} = req.body

        const patient = await Patient.findOne({addressid});

        if(!patient){
            return sendError(res, "Patient id not registered");
        }
        else{
            const newRecord = await PatientProfile.updateOne({
                patient: patient._id

            },
            {
                $set:{
                    steps: steps,
                    date: date
                }

            });
            res.json({success: true, newRecord})
        }
    }
    catch (error) {
        res.json({success: false})
    }
    

}

//get Steps in order
exports.getPatientProfileDataOnSteps = async (req, res) => {

    try{
        const {date} = req.body
        var myDate = new Date(date)
        const allRecords = await PatientProfile.find({}).sort([['steps', -1]]).populate('patient');
        let records=[]
        for(var i=0; i<allRecords.length; i++){
            if(allRecords[i].date.getDate()===myDate.getDate() && allRecords[i].date.getMonth()===myDate.getMonth() && allRecords[i].date.getFullYear()===myDate.getFullYear()){
                records.push(records)
            }
        }
        res.json({success: true, records: allRecords})

    }
    catch (error) {
        res.json({success: false})
    }
    

}
