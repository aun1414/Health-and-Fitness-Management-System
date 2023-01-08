const mongoose = require('mongoose');
mongoose
    .connect('mongodb://localhost:27017/fyp-main-project')
    .then(() => {
        console.log("db is connected")
    })
    .catch(err => console.log(err.message));