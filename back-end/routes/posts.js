const express = require("express");
const router = express.Router();
const db = require("../db/sql");
const {
    validationResult,
    check
} = require("express-validator");
const auth = require("../middleware/auth");

router.get("/test", auth, (req, res) => {
    res.send({
        name: req.user,
    });
    console.log(req.user);
});

router.post(
    "/create",
    auth,
    [
        check("imageUrl", "ImageUrl is not valid").isLength({
            min: 5,
            max: 255,
        }),
        check("description", "description must be 0-250 characters long").isLength({
            min: 1,
            max: 250,
        }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json(errors);
        }
        // let sql =
        //   "CREATE TABLE posts(post_id INT AUTO_INCREMENT PRIMARY KEY,imageUrl VARCHAR(255), description VARCHAR(255) ,user_id INT NOT NULL, FOREIGN KEY(user_id) REFERENCES users(id));";
        // db.query(sql, (err, result) => {
        //   if (err) {
        //     return res.json({
        //       error: "table creation failed",
        //     });
        //   }
        //   res.json({
        //     message: "Table successfully created",
        //   });
        // });
        let data = {
            imageUrl: req.body.imageUrl,
            description: req.body.description,
            user_id: req.user[0].id,
        };
        let sql = "INSERT INTO posts SET ? ";
        db.query(sql, data, (err, result) => {
            if (err) {
                console.log(err);
                return res.json({
                    error: "Upload failed",
                });
            }
            res.json({
                message: "Uploaded Successfully",
            });
        });
    }
);

router.get("/all", auth, (req, res) => {
    let sql =
        "SELECT * FROM users JOIN posts ON users.id = posts.user_id ORDER BY posts.post_id DESC LIMIT 100";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.json({
                error: "Failed! Fetching latest Posts",
            });
        }
        res.json(result);
    });
});

router.get("/my", auth, (req, res) => {
    let sql =
        "SELECT * FROM users JOIN posts ON users.id = posts.user_id WHERE users.id = ? ORDER BY posts.post_id DESC LIMIT 100";
    db.query(sql, req.user[0].id, (err, result) => {
        if (err) {
            console.log(err);
            return res.json({
                error: "Failed! Fetching My Posts",
            });
        }
        res.json(result);
    });
});

module.exports = router;