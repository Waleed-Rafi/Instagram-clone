const express = require("express");
const router = express.Router();
const db = require("../../db/sql");
const { validationResult, check } = require("express-validator");
const auth = require("../../middleware/auth");

router.post("/like/:id", auth, (req, res) => {
    if (req.params.id) {
        // let sql = 'CREATE TABLE likes(likes_id INT AUTO_INCREMENT PRIMARY KEY,l_post_id INT NOT NULL , l_user_id INT NOT NULL,FOREIGN KEY(l_post_id) REFERENCES posts(post_id) , FOREIGN KEY(l_user_id) REFERENCES users(id));'
        // db.query(sql, (err, result) => {
        //     if (err) {
        //         console.log(err);
        //         return res.json({
        //             error: 'Table creation failed'
        //         })
        //     }
        //     res.json({
        //         message: 'Table successfully created!'
        //     })
        // })
        let data = {
            l_post_id: parseInt(req.params.id),
            l_user_id: req.user[0].id,
        };

        let sql = "SELECT * FROM likes WHERE l_user_id = ? AND l_post_id = ?";
        db.query(sql, [data.l_user_id, data.l_post_id], (err, result) => {
            if (err) {
                return res.json({
                    likeFailed: "Unable to like try again!",
                });
            }
            if (result.length) {
                return res.json({
                    likeFailed: "Unable to like multiple times!",
                });
            }
            sql = "INSERT INTO likes SET ? ";

            db.query(sql, data, (err, result) => {
                if (err) {
                    return res.json({
                        likeFailed: "Unable to like try again!",
                    });
                }
                res.json({
                    message: "Successfully liked the post!",
                    id: result.insertId,
                });
            });
        });
    }
});

module.exports = router;