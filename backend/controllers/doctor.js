const Doctor = require('../models/doctor');
const { sendError } = require('../utils/helper');
const PRE = require('recrypt-js')
const Patient = require('../models/patient');
const counter = require('../counter')
const Web3 = require('web3')
const DoctorProfile = require('../models/doctorprofile')

//create a new doctor in database
exports.createDoctor = async (req, res) => {


    const { name, email, password } = req.body

    var addressid = ""

    if (!name.trim()) {
        return sendError(res, "Name is required");
    }
    else if (!email.trim()) {
        return sendError(res, "Email is required");
    }
    else if (!password.trim()) {
        return sendError(res, "Password is required");
    }
    else if (password.length < 6) {
        return sendError(res, "Password Length should be atleast 6 characters");
    }

    else {

        const doctor = await Doctor.findOne({ email });

        //check if email is not already registered
        if (doctor) {
            return sendError(res, "This email is already registered");
        }

        else {
            if (typeof web3 !== 'undefined') {
                var web3 = new Web3(web3.currentProvider);
            } else {
                var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
            }

            //assign an available ethereum account
            const accounts = await web3.eth.getAccounts()

            while (global.Counter < accounts.length) {

                addressid = accounts[global.Counter]
                // console.log(addressid)
                const doctorfound = await Doctor.findOne({ addressid });
                const patientfound = await Patient.findOne({ addressid });
                if (doctorfound) {
                    addressid = ""
                    global.Counter++;
                }
                else if (patientfound) {
                    addressid = ""
                    global.Counter++;
                }
                else {
                    break;
                }


            }
            if (addressid == "") {
                res.status(200).json({ success: false, error: "No accounts left" })

            }
            else {
                var kp_A = PRE.Proxy.generate_key_pair();
                var privatekey = PRE.Proxy.to_hex(kp_A.get_private_key().to_bytes());
                var publickey = PRE.Proxy.to_hex(kp_A.get_public_key().to_bytes());

                const newDoctor = new Doctor({
                    name,
                    email,
                    addressid,
                    password,
                    publickey
                })

                await newDoctor.save();
                const doctorProfile = new DoctorProfile({
                    doctor: newDoctor
                })
                await doctorProfile.save();

                res.status(200).json({ success: true, doctor: newDoctor, key: privatekey })

            }


        }
    }

}

//signin a doctor from database
exports.signin = async (req, res) => {
    const { email, password } = req.body

    if (!email.trim()){
        return sendError(res, "Email is required");
    }
    else if (!password.trim()){
        return sendError(res, "Password is required");        
    }
    else if (password.length < 6){
        return sendError(res, "Password Length should be atleast 6 characters");        
    }

    else {
        const doctor = await Doctor.findOne({ email });

        if (!doctor) {
            return sendError(res, "Doctor Email not registered");
        }
        else {
            const foundDoctor = await doctor.comparePassword(password);
            if (!foundDoctor) {
                return sendError(res, "Incorrect Email/Password");
            }
            else {
                res.json({ success: true, doctor: { name: doctor.name, addressid: doctor.addressid, id: doctor._id, publickey: doctor.publickey } })
            }

        }
    }

}

//get doctor info from database
exports.getDoctor = async (req, res) => {
    try {
        const { addressid } = req.body



        const doctor = await Doctor.findOne({ addressid });

        if (!doctor) {
            return sendError(res, "Doctor id not registered");
        }
        else {
            res.json({ success: true, doctor: { name: doctor.name, addressid: doctor.addressid, id: doctor._id, email: doctor.email, publickey: doctor.publickey } })
        }
    }
    catch (error) {
        res.json({ success: false })
    }

}