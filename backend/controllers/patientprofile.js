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
            console.log(allRecords[i].date.getDate(), myDate.getDate())
            if(allRecords[i].date.getDate()===myDate.getDate() && allRecords[i].date.getMonth()===myDate.getMonth() && allRecords[i].date.getFullYear()===myDate.getFullYear()){
                records.push(allRecords[i])
            }
        }
        res.json({success: true, records})

    }
    catch (error) {
        res.json({success: false})
    }
    

}

//update weight of patient in database
exports.updateWeight = async (req, res) => {

    try{
        const {addressid, weight} = req.body

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
                    weight: weight
                }

            });
            res.json({success: true, newRecord})
        }
    }
    catch (error) {
        res.json({success: false})
    }
    

}


//update height of patient in database
exports.updateHeight = async (req, res) => {

    try{
        const {addressid, height} = req.body

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
                    height: height
                }

            });
            res.json({success: true, newRecord})
        }
    }
    catch (error) {
        res.json({success: false})
    }
    

}


//update bloodGroup of patient in database
exports.updateBloodGroup = async (req, res) => {

    try{
        const {addressid, bloodGroup} = req.body

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
                    bloodGroup: bloodGroup
                }

            });
            res.json({success: true, newRecord})
        }
    }
    catch (error) {
        res.json({success: false})
    }
    

}


//update gender of patient in database
exports.updateGender = async (req, res) => {

    try{
        const {addressid, gender} = req.body

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
                    gender: gender
                }

            });
            res.json({success: true, newRecord})
        }
    }
    catch (error) {
        res.json({success: false})
    }
    

}

//update target of patient in database
exports.updateTarget = async (req, res) => {

    try{
        const {addressid, target} = req.body

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
                    target: target
                }

            });
            res.json({success: true, newRecord})
        }
    }
    catch (error) {
        res.json({success: false})
    }
    

}

//update age of patient in database
exports.updateAge = async (req, res) => {

    try{
        const {addressid, age} = req.body

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
                    age: age
                }

            });
            res.json({success: true, newRecord})
        }
    }
    catch (error) {
        res.json({success: false})
    }
    

}

//get patient target steps from database
exports.getPatientTargetSteps = async (req, res) => {

    try{

        const {addressid} = req.body

   

        const patient = await Patient.findOne({addressid});

        if(!patient){
            return sendError(res, "Patient id not registered");
        }
        else{
            const patientProfile = await PatientProfile.findOne({patient});
            res.json({success: true, steps:patientProfile.target})
        }
    }
    catch (error) {
        res.json({success: false})
    }
    

}