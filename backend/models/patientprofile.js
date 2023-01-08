const mongoose=require('mongoose');

const PatientProfile=new mongoose.Schema(
    {
        gender:{
            type: String,
            default: "male"
        },
        bloodGroup:{
            type: String,
            default: "A+"
        },
        weight:{
            type: Number,
            default: 0

        },
        height:{
            type: Number,
            default: 0
        },
        age:{
            type: Number,
            default: 0
        },
        patient:{
            type:mongoose.Types.ObjectId,
            ref:'Patient',
            required: true
        }
    }
)

const model=mongoose.model('PatientProfile',PatientProfile);
module.exports=model;