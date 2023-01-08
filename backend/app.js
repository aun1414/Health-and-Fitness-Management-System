const port = 8000

const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors=require('cors');
const ipfsRouter=require('./routes/ipfs')
const doctorRouter=require('./routes/doctor')
const patientRouter=require('./routes/patient')
const contractsRouter=require('./routes/contracts')
const rsaRouter=require('./routes/reencryption')
require('./db/index')


const app = express();

app.set('view engine', 'ejs');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());
app.use(fileUpload());


app.use( '/ipfs', ipfsRouter)
app.use( '/doctor', doctorRouter)
app.use( '/patient', patientRouter)
app.use( '/contracts', contractsRouter)
app.use('/rsa', rsaRouter)
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})