const router = require('express').Router()
const connection = require('../db/connection');
const util= require("util");
const authorized = require("../middleware/authorize")
const admin = require("../middleware/admin")
const { body,validationResult } = require('express-validator');
const upload = require("../middleware/uploadimages")
const fs = require("fs")

router.post("/addCategory", admin, 
upload.single("image"),
body("name")
.isString().withMessage("please enter a valid category name")
.isLength({min:5}).withMessage("category name should be atleast 5 characters"),

body("description")
.isString().withMessage("please enter a valid description")
.isLength({min:10}).withMessage("description should be atleast 10 characters"),

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

    const category = {
        name: req.body.name,
        description: req.body.description,
        image_url: req.file.filename
    }

    const query= util.promisify(connection.query).bind(connection);
    await query("insert into categoryes set ? ", category)
    res.status(200).json({
        msg: "category created successfully" 
    })
    } catch(err){
    res.status(500).json({err:err})
    }
})

router.put("/updateCategory/:id", admin, 
upload.single("image"),
    body("name")
    .isString().withMessage("please enter a valid category name")
    .isLength({min:5}).withMessage("category name should be atleast 5 characters"),
    
    body("description")
    .isString().withMessage("please enter a valid description")
    .isLength({min:10}).withMessage("description should be atleast 10 characters"),
    
    
    async(req, res)=>{
        try{
        //for validation
        const query= util.promisify(connection.query).bind(connection);
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }

          const category = await query("select * from categoryes where id = ? ",[
            req.params.id,
        ]);
        if(!category [0]){
            res.status(404).json({msg: "category not found"})
        }

        const categoryObj = {
            name: req.body.name,
            description: req.body.description,
            

        }

        if(req.file){
            categoryObj.image_url = req.file.filename
            fs.unlinkSync("./upload/" + category[0].image_url)
            return res.status(400).json({
                errors:[
                    {
                    "message" : "image is required",
                    },
                ],   
    
            })
        }
    
        await query("update categoryes set? where id=? ", [
            categoryObj,
            category[0].id
        ])
        res.status(200).json({
            msg: "category updated successfully" 
        })
        } catch(err){
        res.status(500).json({err:err})
        }
    })

router.delete("/deleteCategory/:id", admin,

    async(req, res)=>{
        try{
            const query= util.promisify(connection.query).bind(connection);
          const category = await query("select * from categoryes where id = ? ",[
            req.params.id,
        ]);
        if(!category [0]){
            res.status(404).json({msg: "category not found"})
        }
    
        fs.unlinkSync("./upload/" + category[0].image_url)
        await query("delete from categoryes where id=? ", [
            category[0].id
        ])
        res.status(200).json({
            msg: "category deleted successfully" 
        })
        } catch(err){
        res.status(500).json({err:err})
        }
    })

// list categoryes
 router.get('/viewCategoryes',async (req, res) => {
    
       try { 
            const query = util.promisify(connection.query).bind(connection);
            const categoryes = await query("SELECT * FROM `categoryes` ")
            categoryes.map(category=>{
                category.image_url="http://" +req.hostname +":2000/" +category.image_url;
            });
            res.status(200).json(categoryes)
                
           
        } catch (err) {
            console.error(err);
            res.status(500).json({
                error: 'Internal server error',
            });
        }
    });
//list specific
router.get("/listSpacificCategory/:id", async(req, res)=>{
    const query= util.promisify(connection.query).bind(connection);
    const category = await query("SELECT * FROM `categoryes` WHERE id=?", req.params.id );
    if(!category [0]){
        res.status(404).json({msg: "category not found"});
    }
    category[0].image_url = "http://" + req.hostname + ":2000/" + category[0].image_url;
     res.status(200).json(category[0]);
})

module.exports = router;