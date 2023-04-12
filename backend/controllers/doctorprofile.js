const Doctor = require('../models/doctor');
const { sendError } = require('../utils/helper');
const DoctorProfile = require('../models/doctorprofile')


//get doctor profile from database
exports.getDoctorProfile = async (req, res) => {

    try{

        const {addressid} = req.body

   

        const doctor = await Doctor.findOne({addressid});

        if(!doctor){
            return sendError(res, "Doctor id not registered");
        }
        else{
            const doctorProfile = await DoctorProfile.findOne({doctor}).populate('doctor');
            res.json({success: true, doctorProfile})
        }
    }
    catch (error) {
        res.json({success: false})
    }
    

}


//update education of doctor in database
exports.updateEducation = async (req, res) => {

    try{
        const {addressid, education} = req.body
        const doctor = await Doctor.findOne({addressid});

        if(!doctor){
            return sendError(res, "Doctor id not registered");
        }
        else{
            const newRecord = await DoctorProfile.updateOne({
                doctor: doctor._id
            },
            {
                $set:{
                    education: education
                }
            });
            res.json({success: true, newRecord})
        }
    }
    catch (error) {
        res.json({success: false})
    }
}

//update Gender of doctor in database
exports.updateGender = async (req, res) => {


    try{
        const {addressid, gender} = req.body
        const doctor = await Doctor.findOne({addressid});

        if(!doctor){
            return sendError(res, "Doctor id not registered");
        }
        else{
            const newRecord = await DoctorProfile.updateOne({
                doctor: doctor._id
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

//update specialization of doctor in database
exports.updateSpecialization = async (req, res) => {

    try{
        const {addressid, specialization} = req.body
        const doctor = await Doctor.findOne({addressid});

        if(!doctor){
            return sendError(res, "Doctor id not registered");
        }
        else{
            const newRecord = await DoctorProfile.updateOne({
                doctor: doctor._id
            },
            {
                $set:{
                    specialization: specialization
                }
            });
            res.json({success: true, newRecord})
        }
    }
    catch (error) {
        res.json({success: false})
    }
}

//update experience of doctor in database
exports.updateExperience = async (req, res) => {

    try{
        const {addressid, experience} = req.body
        const doctor = await Doctor.findOne({addressid});

        if(!doctor){
            return sendError(res, "Doctor id not registered");
        }
        else{
            const newRecord = await DoctorProfile.updateOne({
                doctor: doctor._id
            },
            {
                $set:{
                    experience: experience
                }
            });
            res.json({success: true, newRecord})
        }
    }
    catch (error) {
        res.json({success: false})
    }
}