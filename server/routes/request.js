const router = require('express').Router();
const util = require("util");
const authorize = require("../middleware/authorize")
const admin = require("../middleware/admin")
const connection = require("../db/connection");
const upload = require("../middleware/uploadimages")
const fs = require("fs");
const { query } = require('express');


//patient
// send request 
router.post("/sendrequest/:id", async (req, res) => {
    const query = util.promisify(connection.query).bind(connection);

    try {
        // Retrieve the medicine by ID
        const [namemedicien] = await query(
            "SELECT * FROM medicines WHERE id = ?",
            [req.params.id]
        );


        if (!namemedicien) {
            // If no medicine was found with the specified ID, return an error response
            return res.status(404).json({ error: "Medicine not found" });
        }
        
     const image= await query("SELECT `image_url` FROM `medicines` WHERE id=?",req.params.id)
     const [user_info]= await query("SELECT `id`, `email` FROM `users` WHERE token =?",req.body.headers.token)

     console.log(user_info)
        const reqmediciene = {
            user_id: user_info.id,
            medicine_id: req.params.id,
            name_of_medicine: namemedicien.name,
            name_of_user: user_info.email,
            image_url: image[0].image_url,
        };
        

        // Insert the medicine request into the database
        console.log(reqmediciene);
        await query("INSERT INTO `medicine_request` SET ?", reqmediciene);

        res.status(200).json({
            msg: "Request sent successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//show request
router.get(
    "/req/:user_id",
    async(req,res) =>{
        try{
            const query = util.promisify(connection.query).bind(connection);
            const user = await query("select * from users where id=?",[
                req.params.user_id,
            ]);
            if(!user[0]){
                res.status(404).json({ms:"user isnot found !"});
            }
            const request = await query ("select * from medicine_request where user_id=?",req.params.user_id);
            res.status(200).json(request);
        }catch (err) {
            res.status(500).json(err);
        }

       
    }
);
//show request by admin
router.get("/reqadmin", (req, res) => {
    const sql = "SELECT * FROM 	medicine_request";
    connection.query(sql, (err, data) => {
      if (err) return res.json("Error");
      return res.json(data);
    });
    router.put("/:id", (req, res) => {
      const { id } = req.params.id;
      const { Accept } = req.body;
      const sql = "UPDATE 	medicine_request SET Accept = ? WHERE id = ?";
      connection.query(sql, [Accept, id], (err, result) => {
        if (err) {
          return res.json("Error");
        }
        if (result.affectedRows === 0) {
          return res.json("No data found for the given id");
        }
        return res.json("Data updated successfully");
      });
    });
  });
router.get(
    "/reqadmin/:user_id",
    async(req,res) =>{
        try{
            const query = util.promisify(connection.query).bind(connection);
            const user = await query("select * from users where id=?",[
                req.params.user_id,
            ]);
            if(!user[0]){
                res.status(404).json({ms:"user isnot found !"});
            }
            const request = await query ("select * from medicine_request where user_id=?",req.params.user_id);
            res.status(200).json(request);
        }catch (err) {
            res.status(500).json(err);
        }

       
    }
);
//admin
// update medicine_request to allow admin to accept or decline request 
router.put("/updaterequest/:id",authorize ,admin, async (req, res) => {
    try {
        const query = util.promisify(connection.query).bind(connection);

        const requestId = req.params.id;
        const { state } = req.body;
        const { Accept } = req.body;

        const [existrequist] = await query(
            "SELECT * FROM medicine_request WHERE id = ?",
            [req.params.id]
        );
        if (!existrequist) {
            res.status(404).json({
                msg: "requst not found",
            });

        }

        await query("UPDATE medicine_request SET state = ?,Accept=? WHERE id = ?", [state,Accept, requestId]);

        res.status(200).json({
            msg: "Request updated successfully",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            msg: "Internal server error",
        });
    }
});


// get history from 
router.get("/history/:userId", admin, async (req, res) => {
    try {
        const userId = req.params.userId;
        const query = util.promisify(connection.query).bind(connection);
        const history = await query(
            "SELECT * FROM medicine_request WHERE user_id = ?",
            [userId]
        );

        if (history.length === 0) {
            return res.status(404).json({ error: "no history found" });
        }

        // Map the history to only retrieve the name of the medicine
          history.map((request) => {
            return request.name_of_medicine;
        });

        res.status(200).json({
            history: medicineNames,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            msg: "server error",
        });
    }
});


module.exports = router