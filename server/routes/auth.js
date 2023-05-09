const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const connection = require('../db/connection');
const authorized = require("../middleware/authorize")
const admin = require("../middleware/admin")
const util = require("util");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
// register 
router.post("/register",
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password").isLength({ min: 8, max: 20 }).withMessage("Password should be between 8 and 20 characters"),
  body("phone").isMobilePhone().withMessage("Please enter a valid phone number"),
  async (req, res) => {
    try {
      // for validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      // check if email already exists
      const query = util.promisify(connection.query).bind(connection);
      const isEmailExist = await query("select * from users where email=?", [req.body.email]);
      if (isEmailExist.length > 0) {
        return res.status(400).json({
          errors: [
            {
              "message": "Email already exists",
            },
          ],
        });
      }
      // save user data
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
  }
);

// login
router.post("/login",
    body("email").isEmail().withMessage("plz enter valid email"),
    body("password").isLength({ min: 8, max: 20 }).withMessage("password should be between(8 - 20) character"),
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
            if (isEmailExist.length == 0) {
                res.status(404).json({
                    errors: [
                        {
                            "message": "email or password not found!",
                        },
                    ],

                });
            }
            //compare password
            const checkPassword = await bcrypt.compare(req.body.password, isEmailExist[0].password);
            if (checkPassword) {
                await query("UPDATE users SET status = 'active' WHERE id = ?", [isEmailExist[0].id]);
                delete isEmailExist[0].password;
                res.status(200).json(isEmailExist[0]);
            } else {
                res.status(404).json({
                    errors: [
                        {
                            "message": "email or password not found!",
                        },
                    ],

                });
            }

        } catch (err) {
            res.status(500).json({ err: err });

        }

    });


    
//log out for admin
router.post("/logoutAdmin",authorized,
    async (req, res) => {
        try {
            const token = res.locals.user.token;
            const query = util.promisify(connection.query).bind(connection);
            const user = await query("select * from users where token=?", [token]);
            if (user.length == 0) {
                res.status(404).json({
                    errors: [
                        {
                            "message": "user not found!",
                        },
                    ],

                });
            } else {
                await query("update users set status='inactive', token=null where id=?", [user[0].id]);
                res.status(200).json({
                    message: "user logged out successfully"
                });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ err: err });

        }

    });

//log out for patients
router.post("/logoutPatient",authorized,
async (req, res) => {
    try {
        const token = res.locals.user.token;
        const query = util.promisify(connection.query).bind(connection);
        const user = await query("select * from users where token=?", [token]);
        if (user.length == 0) {
            res.status(404).json({
                errors: [
                    {
                        "message": "user not found!",
                    },
                ],

            });
        } else {
            await query("update users set status='inactive', token=null where id=?", [user[0].id]);
            res.status(200).json({
                message: "user logged out successfully"
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: err });

    }

});
module.exports = router;