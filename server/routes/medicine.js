const router = require('express').Router()
const connection = require('../db/connection');
const util= require("util");
const authorized = require("../middleware/authorize")
const admin = require("../middleware/admin")
const { body,validationResult } = require('express-validator');
const upload = require("../middleware/uploadimages")
const fs = require("fs");
const { request } = require('http');
//for admin
router.post("/addMedicine", admin, 
upload.single("image"),

body("name")
.isString().withMessage("please enter a valid medicine name")
.isLength({min:4}).withMessage("medicine name should be atleast 4 characters"),

body("description")
.isString().withMessage("please enter a valid description")
.isLength({min:10}).withMessage("description should be atleast 10 characters"),

body("price")
.isString().withMessage("please enter a valid number")
.isLength({min:1}).withMessage("price should be atleast 1 characters"),

body("expirationDate")
.isString().withMessage("please enter a valid date")
.isLength({min:8}).withMessage("expirationDate should be atleast 8 characters"),

body("category_id")
.isString().withMessage("please enter a valid id")
.isLength({min:1}).withMessage("id should be atleast 1 characters"),

async(req, res)=>{
    try{
    //for validation
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    if(!req.file){
        return res.status(400).json({
            errors:[
                {
                "message" : "image is required",
                },
            ],   

        })
    }

    const medicine = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        expirationDate: req.body.expirationDate,
        category_id: req.body.category_id,
        image_url: req.file.filename
    }

    const query= util.promisify(connection.query).bind(connection);
    await query("insert into medicines set ? ", medicine)
    res.status(200).json({
        msg: "medicine created successfully" 
    })
    } catch(err){
    res.status(500).json({err:err})
    }
})


router.put("/updateMedicine/:id", admin, 
upload.single("image"),
    body("name")
    .isString().withMessage("please enter a valid medicine name")
    .isLength({min:5}).withMessage("medicine name should be atleast 5 characters"),
    
    body("description")
    .isString().withMessage("please enter a valid description")
    .isLength({min:10}).withMessage("description should be atleast 10 characters"),
    
    body("price")
    .isString().withMessage("please enter a valid number")
    .isLength({min:1}).withMessage("price should be atleast 1 characters"),
    
    body("expirationDate")
    .isString().withMessage("please enter a valid date")
    .isLength({min:8}).withMessage("expirationDate should be atleast 8 characters"),
    
    
    async(req, res)=>{
        try{
        //for validation
        const query= util.promisify(connection.query).bind(connection);
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }

          const medicine = await query("select * from medicines where id = ? ",[
            req.params.id,
        ]);
        if(!medicine [0]){
            res.status(404).json({msg: "medicine not found"})
        }

        const medicineObj = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            expirationDate: req.body.expirationDate,

        }

        if(req.file){
            medicineObj.image_url = req.file.filename
            fs.unlinkSync("./upload/" + medicine[0].image_url)
            return res.status(400).json({
                errors:[
                    {
                    "message" : "image is required",
                    },
                ],   
    
            })
        }
    
        await query("update medicines set? where id=? ", [
            medicineObj,
            medicine[0].id
        ])
        res.status(200).json({
            msg: "medicine updated successfully" 
        })
        } catch(err){
        res.status(500).json({err:err})
        }
    })

router.delete("/deleteMedicine/:id", admin,

    async(req, res)=>{
        try{
            const query= util.promisify(connection.query).bind(connection);
          const medicine = await query("select * from medicines where id = ? ",[
            req.params.id,
        ]);
        if(!medicine [0]){
            res.status(404).json({msg: "medicine not found"})
        }
    
        fs.unlinkSync("./upload/" + medicine[0].image_url)
        await query("delete from medicines where id=? ", [
            medicine[0].id
        ])
        res.status(200).json({
            msg: "medicine deleted successfully" 
        })
        } catch(err){
        res.status(500).json({err:err})
        }
    })
// router.get("/listMedicines", admin, async(req, res)=>{
//         const query= util.promisify(connection.query).bind(connection);
//         const medicine = await query("select * from medicines" )
//         medicine.map(medicine =>{
//             medicine.image_url = "http://" + req.hostname + ":2000/" + medicine.image_url
//         })
//         res.status(200).json(medicine)
//  })


//for patient
//list medicine
router.get("/list", async(req, res)=>{
        const query= util.promisify(connection.query).bind(connection);
        const medicine = await query("select * from medicines" )
        medicine.map(medicine =>{
            medicine.image_url = "http://" + req.hostname + ":2000/" + medicine.image_url
        })
        res.status(200).json(medicine)
        })
//for admin
//specific list        
        router.get("/listSpacificMedicine/:id", async(req, res)=>{
            const query= util.promisify(connection.query).bind(connection);
            const medicine = await query("select * from medicines where id=?", req.params.id );
            if(!medicine [0]){
                res.status(404).json({msg: "medicine not found"});
            }
            medicine[0].image_url = "http://" + req.hostname + ":2000/" + medicine[0].image_url
            res.status(200).json(medicine[0])
        })

//filter medicines
 router.get("/filter", async (req, res) => {
            const query = util.promisify(connection.query).bind(connection);
            let search = "";
            if (req.query.search) {
            search = `where name LIKE '%${req.query.search}%' OR description LIKE '%${req.query.search}%'`;
            }
            const user = await query("select * from users where id = ?", [req.query.id]);
            if (!user.length) {
            return res.status(404).json({ msg: "User not found" });
            }
            const medicine = await query(`select * from medicines ${search}`);
            const searchTerm = req.query.search;
            const userId = req.query.id;
            await query("insert into search (term, user_id) values (?, ?)", [searchTerm, userId]);
            if(!medicine.length){
                return res.status(404).json({msg: "Medicine not found"});
            }
            res.status(200).json(medicine);
      });
      
      
//searchHistory    
// router.get("/searchHistory", async(req, res)=>{
//     const query= util.promisify(connection.query).bind(connection);
//     const user = await query("select * from users where id = ?", [req.query.id]);
//     if (!user.length) {
//     return res.status(404).json({ msg: "User not found" });
//     }
//     const search = await query("select term from search where user_id = ?", [req.query.id]);
//     if (search.length == 0) {
//     return res.status(404).json({ msg: "Search history not found" });
//     }
//     res.status(200).json(search)
//     });
    
    router.post("/search", (req, resp) => {
        console.log(req.body);
        
        const sql = "INSERT INTO `search`( `searchTerm`, `user_id`) VALUES (?)";
        const values = [[
          req.body.searchTerm,
          req.body.user_id ,

           ]];
           connection.query(sql,values);
        });   
     // show history 
        router.get(
            "/search/:user_id",
            async (req, res) => {
              try {
                const query = util.promisify(connection.query).bind(connection);
                // 2- CHECK IF USER EXISTS OR NOT
                const user = await query("select * from users where id = ?", [
                  req.params.user_id,
                ]);
                if (!user[0]) {
                  res.status(404).json({ ms: "user not found !" });
                }
          
                // 4- INSERT APPOINTMENT OBJECT INTO DATABASE
                const request =await query("select *  from search Where user_id= ?", req.params.user_id);
          
                res.status(200).json(request);
              } catch (err) {
                res.status(500).json(err);
              }
            }
          );
        
module.exports = router; 