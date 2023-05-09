const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const util = require("util");
const authorize = require("../middleware/authorize")
const admin = require("../middleware/admin")
const connection = require('../db/connection');
const crypto = require("crypto");


//for admin
// Add a patient
router.post("/addpatient",admin,
    body("email").isEmail().withMessage("plz enter valid email"),
    body("password").isLength({ min: 8, max: 20 }).withMessage("password should be between(8 - 20) character"),
    body("phone").isMobilePhone().withMessage("plz enter valid phone"), 
    
    async (req, res) => {
        try {
            //for validation
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            // for exist email
            const query = util.promisify(connection.query).bind(connection);
            const isEmailExist = await query("select * from users where email=?", [req.body.email]);
            if (isEmailExist.length > 0) {
                res.status(400).json({
                    errors: [
                        {
                            "message": "email already exists",
                        },
                    ],
                });
            }
            //for save user
            const userData = {
                email: req.body.email,
                password: await bcrypt.hash(req.body.password, 10),
                phone: req.body.phone,
                token: crypto.randomBytes(16).toString("hex")
            }
            // insert user to db
            await query("insert into users set ?", userData);
            delete userData.password;
            res.status(200).json(userData);
        } catch (err) {
            res.status(500).json({ err: err });

        }

    });

// Delete a patient
router.delete('/deletepatient/:id', admin, async (req, res) => {
    const query = util.promisify(connection.query).bind(connection);
    const [exist_user] = await query(
        'SELECT * FROM users WHERE id = ?',
        [req.params.id]
    );

    if (!exist_user) {
        return res.status(404).json({ error: 'User not found' });
    }

    await query('DELETE FROM users WHERE id = ?', [req.params.id]);

    res.status(200).json({
        msg: 'User deleted successfully',
    });
});

// Update a patient
router.put('/updatepatient/:id', admin, async (req, res) => {
    const { email, password, phone } = req.body;
    const query = util.promisify(connection.query).bind(connection);

    // Check if the user exists
    const [exist_user] = await query(
        'SELECT * FROM users WHERE id = ?',
        [req.params.id]
    );

    if (!exist_user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Hash the password
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    // Update the user in the database
    const updatedUser = {
        email: email || exist_user.email,
        password: hashedPassword || exist_user.password,
        phone: phone || exist_user.phone,
    };
    await query('UPDATE users SET ? WHERE id = ?', [updatedUser, req.params.id]);

    res.status(200).json({
        msg: 'User updated successfully'
    });
});

// List all patients
router.get('/listpatient', admin, async (req, res) => {
    try {
        const query = util.promisify(connection.query).bind(connection);
        const users = await query('SELECT id, email, phone FROM users');
        users.map(userData=>{
            userData.image_url="http://" +req.hostname +":2000/" +userData.image_url;
        });
        res.status(200).json(users)
         
        // res.status(200).json({
        //     patients: users,
        // });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Internal server error',
        });
    }
});
//list specific
router.get("/listSpacificpatient/:id", async(req, res)=>{
    const query= util.promisify(connection.query).bind(connection);
    const patient = await query("SELECT * FROM `users` WHERE id=?", req.params.id );
    if(!patient [0]){
        res.status(404).json({msg: "patient not found"});
    }
    patient[0].image_url = "http://" + req.hostname + ":2000/" + patient[0].image_url;
     res.status(200).json(patient[0]);
})

module.exports = router;
