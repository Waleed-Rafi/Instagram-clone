const express = require("express");
const router = express.Router();
const db = require("../../db/sql");
const { validationResult, check } = require("express-validator");
const auth = require("../../middleware/auth");

router.post(
    "/create",
    auth, [
        check("imageUrl", "ImageUrl is not valid").isLength({
            min: 5,
            max: 255,
        }),
        check("description", "description must be 0-250 characters long").isLength({
            min: 1,
            max: 250,
        }),
    ],
    async(req, res) => {
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

        // CREATE TABLE hashtag(
        //     H_ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        //     H_TITLE VARCHAR(200) NOT NULL UNIQUE
        // );

        // CREATE TABLE post_hashtag(
        //     p_id INT NOT NULL,
        //     h_id INT NOT NULL,
        //     PRIMARY KEY(p_id,h_id),
        //     FOREIGN KEY(p_id) REFERENCES posts(post_id),
        //     FOREIGN KEY(h_id) REFERENCES hashtag(H_ID)
        // );

        let data = {
            imageUrl: req.body.imageUrl,
            description: req.body.description,
            user_id: req.user[0].id,
        };
        const allHashtags = [...req.body.hashtags];
        const hashtag = allHashtags[0];

        let sql = "INSERT INTO posts SET ? ";

        await db.query(sql, data, async(err, result) => {
            if (err) {
                return res.json({
                    error: "Upload failed",
                });
            }

            let h_id = false;
            let p_id = result.insertId;

            // allHashtags.map(async(hashtag) => {
            data = {
                H_TITLE: hashtag,
            };
            h_id = await findHashtag(hashtag);
            console.log(h_id);

            if (h_id !== false) {
                data = {
                    p_id: p_id,
                    h_id: h_id,
                };
                h_id = false;
                sql = "INSERT INTO post_hashtag SET ? ";
                await db.query(sql, [data], async(e1, r1) => {
                    if (e1) {
                        return console.log("error2", e1);
                    }
                    console.log("post_hashtag successfully inserted");
                });
            } else {
                sql = "INSERT INTO hashtag SET ? ";
                await db.query(sql, data, async(e, r) => {
                    if (e) {
                        return console.log("error11", e);
                    }
                    console.log("Hashtag successfully added");
                    h_id = r.insertId;
                });
                data = {
                    p_id: p_id,
                    h_id: h_id,
                };
                h_id = null;
                sql = "INSERT INTO post_hashtag SET ? ";
                await db.query(sql, data, async(e1, r1) => {
                    if (e1) {
                        return console.log("error2", e1);
                    }
                    console.log("post_hashtag successfully inserted");
                });
            }
            // });

            res.json({
                message: "Uploaded Successfully",
            });
        });
    }
);
const findHashtag = async(hashtag) => {
    sql = "SELECT H_ID FROM hashtag WHERE H_TITLE = ?";
    await db.query(sql, [hashtag], async(sError, sRes) => {
        if (sError) {
            return console.log("No such hashtag found");
        }
        console.log(sRes, sRes.length);
        return sRes.length > 0 ? sRes[0].H_ID : false;
    });
};

module.exports = router;