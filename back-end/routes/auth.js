const express = require("express");
const {
    check,
    validationResult
} = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db/sql");
const router = express.Router();

router.post(
    "/register", [
        check("name", "Name must be 5-20 characters long").isLength({
            min: 5,
            max: 20,
        }),
        check("email", "Email is Invalid").isEmail(),
        check("password", "Password must be 5-20 characters long").isLength({
            min: 5,
            max: 20,
        }),
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            return res.json(errors);
        }

        //Table creation just for first time only

        // const sql = 'CREATE TABLE users(' +
        //   'id INT AUTO_INCREMENT PRIMARY KEY,' +
        //   'name VARCHAR(100) NOT NULL,' +
        //   'email VARCHAR(100) NOT NULL,' +
        //   'password VARCHAR(100) NOT NULL,' +
        //   'profilePic VARCHAR(255) NOT NULL,' +
        //   'created_at TIMESTAMP DEFAULT NOW());';
        // db.query(sql, (err, result) => {
        //   if (err) {
        //     return res.status(400).json({
        //       error: 'Table creation failed'
        //     })
        //   }
        //   res.json({
        //     success: 'Table successfully created'
        //   })
        // })

        const user = req.body;
        console.log(user);
        // //Fetching user from database
        let sql = "SELECT * FROM users WHERE email = ? ";
        //For multiple where see below 2 commands
        // var sql = 'SELECT * FROM customers WHERE name = ? OR address = ?';
        // con.query(sql, [name, adr].......

        await db.query(sql, user.email, async(err, result) => {
            if (err) {
                return res.json({
                    error: "Something went wrong.Try again later",
                });
            }
            if (result.length === 0) {
                user.password = await bcrypt.hash(user.password, 8);
                sql = "INSERT INTO users SET ?";
                await db.query(sql, user, (error, result) => {
                    if (error) {
                        return res.json({
                            error: 'Something went wrong. Try again later'
                        })
                    }
                    return res.json({
                        message: "Registered Successfully",
                    });
                });
            } else {
                res.json({
                    error: "User already exists",
                });
            }
        });
    }
);

router.post(
    "/login", [
        check("email", "Invalid Email").isEmail(),
        check("password", "Invalid Password").isLength({
            min: 5,
            max: 20,
        }),
    ],
    async(req, res) => {
        const errors = validationResult(req.body);
        if (!errors.isEmpty()) {
            return res.json(errors);
        }
        const user = req.body;
        let sql = "SELECT * FROM users WHERE email = ?";
        db.query(sql, user.email, async(err, result) => {
            if (err) {
                return res.json({
                    error: "Something went wrong.Try again later",
                });
            } else {
                if (result.length === 0) {
                    return res.json({
                        error: "Invalid Email or Password",
                    });
                }
                const isCompared = await bcrypt.compare(
                    user.password,
                    result[0].password
                );
                const token = await jwt.sign({
                        id: result[0].id,
                        name: result[0].name,
                        email: result[0].email,
                        password: result[0].password,
                        profilePic: result[0].profilePic
                    },
                    "secret", {
                        expiresIn: "7 days",
                    }
                );
                if (isCompared) {
                    return res.json({
                        message: "Successfully LogIn",
                        token,
                    });
                }
                res.json({
                    error: "Invalid Email or Password",
                });
            }
        });
    }
);

module.exports = router;