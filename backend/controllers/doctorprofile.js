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