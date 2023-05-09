const mysql = require("mysql")
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "meds_dashboard",
    port: "3306"  
})

connection.connect((error)=>{
    if(error) throw error;
    console.log("db connected");
})

module.exports= connection