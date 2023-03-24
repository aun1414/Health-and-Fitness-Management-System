const mongoose=require('mongoose');

const patientProfile=new mongoose.Schema(
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
        },
        steps:{
            type: Number,
            default: 0
        },
        target:{
            type: Number,
            default: 8000
        }
    }
)

const model=mongoose.model('PatientProfile',patientProfile);
module.exports=model;