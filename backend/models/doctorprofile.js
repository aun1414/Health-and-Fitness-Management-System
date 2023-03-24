const mongoose=require('mongoose');

const doctorProfile=new mongoose.Schema(
    {
        experience:{
            type: Number,
            default: 0
        },
        education:{
            type: String,
            default: "None"
        },
        specialization:{
            type: String,
            default: "None"
        },
        doctor:{
            type:mongoose.Types.ObjectId,
            ref:'Doctor',
            required: true
    
        }
    }
)

const model=mongoose.model('DoctorProfile',doctorProfile);
module.exports=model;