const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const patientSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    addressid:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    publickey:{
        type: String,
        default: ""
    }
})

patientSchema.pre('save', async function(next){
    if(this.isModified('password')){
        const hashPass = await bcrypt.hash(this.password, 8);
        this.password = hashPass;
    }

    next();
    
})

patientSchema.methods.comparePassword = async function(password){
    const result = await bcrypt.compareSync(password, this.password);
    return result;
}



module.exports = mongoose.model('Patient', patientSchema)