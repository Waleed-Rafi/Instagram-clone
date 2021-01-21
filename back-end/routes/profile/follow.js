const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const db = require("../../db/sql");

router.post("/follow", auth, async(req, res) => {
    // CREATE TABLE followers(
    //     follower_id INT NOT NULL,
    //     following_id INT NOT NULL,
    //     PRIMARY KEY(follower_id,following_id),
    //     FOREIGN KEY(follower_id) REFERENCES users(id),
    //     FOREIGN KEY(following_id) REFERENCES users(id)
    // );
    console.log(req.body.following_id);
    const data = {
        follower_id: req.user[0].id,
        following_id: req.body.following_id,
    };
    const sql = "INSERT INTO followers SET ?";
    await db.query(sql, data, async(err, result) => {
        if (err) {
            return res.json({
                error: "Unable to follow",
            });
        }
        res.json({
            message: "Follow Successfully",
        });
    });
});

module.exports = router;