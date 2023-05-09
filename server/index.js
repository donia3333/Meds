const express = require ('express');
const app = express()
const auth = require('./routes/auth.js');
const category = require('./routes/category.js');
const patient = require('./routes/patient.js');
const request = require('./routes/request.js');
const medicine = require("./routes/medicine")
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('upload'));
const cors = require('cors');
app.use(cors());
app.listen(2000, "localhost", ()=>{
    console.log("server is running");
})

app.use("/auth",auth);
app.use("/medicine", medicine);
app.use("/category", category);
app.use("/patient", patient);
app.use("/request", request);