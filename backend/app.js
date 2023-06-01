const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');

const doctorRouter = require('./routes/doctor')
const patientRouter = require('./routes/patient')

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());


app.use( '/doctor', doctorRouter)
app.use( '/patient', patientRouter)

module.exports = app;