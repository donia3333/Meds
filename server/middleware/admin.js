const connection = require('../db/connection');
const util=require("util");
const admin =async (req,res,next)=>{

    const query= util.promisify(connection.query).bind(connection);
    const {token} =req.headers;
    const admin= await query("select * from users where token = ?",[token]);
    if(admin[0] && admin[0].role==1){
           next();

    }else{
          res.status(403).json({
               message:"you are not authorized",

          });

    }
};

module.exports = admin;