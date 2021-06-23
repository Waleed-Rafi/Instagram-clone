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
        let post_id = null;

        let sql = "INSERT INTO posts SET ? ";
        let checkSQL = "SELECT * FROM hashtag WHERE H_TITLE IN ";
        let hashSQL = "INSERT INTO hashtag(H_TITLE) VALUES ";
        let postHashSQL = "INSERT INTO post_hashtag(p_id,h_id) VALUES ";
        let newHashtags = [];
        let hashtagsInsertIDs = [];

        db.query(sql, data, async(err, result) => {
            if (err) {
                return res.json({
                    error: "Upload failed",
                });
            }
            post_id = result.insertId;

            if (allHashtags.length) {
                allHashtags.forEach((hashtag, index) => {
                    if (index === 0) {
                        checkSQL += "(?";
                    } else if (index === allHashtags.length - 1) {
                        checkSQL += ",?)";
                    } else {
                        checkSQL += ",?";
                    }
                });
                await db.query(checkSQL, allHashtags, async(err, result) => {
                    if (err) {
                        return res.json({
                            error: "Upload failed",
                        });
                    }
                    allHashtags.forEach((hashtag) => {
                        let isExist = false;
                        result.forEach((r) => {
                            if (hashtag === r.H_TITLE) {
                                isExist = true;
                                hashtagsInsertIDs.push(post_id, r.H_ID);
                            }
                        });
                        if (!isExist) {
                            newHashtags.push(hashtag);
                        }
                    });

                    if (newHashtags.length) {
                        newHashtags.forEach((hashtag, index) => {
                            hashSQL += index === 0 ? "(?)" : " ,(?)";
                        });
                        await db.query(hashSQL, newHashtags, async(err, result) => {
                            if (err) {
                                return res.json({
                                    error: "Upload failed",
                                });
                            }
                            newHashtags.forEach((hash, index) => {
                                let id = result.insertId;
                                index === 0 ?
                                    hashtagsInsertIDs.push(post_id, id) :
                                    hashtagsInsertIDs.push(post_id, ++id);
                            });
                            if (hashtagsInsertIDs.length) {
                                if (hashtagsInsertIDs.length === 2) postHashSQL += "(?,?)";
                                else
                                    for (let i = 0; i < hashtagsInsertIDs.length / 2; i++) {
                                        postHashSQL += i === 0 ? "(?,?)" : " ,(?,?)";
                                    }
                                await db.query(
                                    postHashSQL,
                                    hashtagsInsertIDs,
                                    async(err, result) => {
                                        if (err) {
                                            return res.json({
                                                error: "Upload failed",
                                            });
                                        }
                                        res.json({
                                            success: "Upload Successfully",
                                        });
                                    }
                                );
                            } else {
                                res.json({
                                    success: "Upload Successfully",
                                });
                            }
                        });
                    } else if (hashtagsInsertIDs.length) {
                        if (hashtagsInsertIDs.length === 2) postHashSQL += "(?,?)";
                        else
                            for (let i = 0; i < hashtagsInsertIDs.length / 2; i++) {
                                postHashSQL += i === 0 ? "(?,?)" : " ,(?,?)";
                            }
                        await db.query(
                            postHashSQL,
                            hashtagsInsertIDs,
                            async(err, result) => {
                                if (err) {
                                    return res.json({
                                        error: "Upload failed",
                                    });
                                }
                                res.json({
                                    success: "Upload Successfully",
                                });
                            }
                        );
                    } else {
                        res.json({
                            success: "Upload Successfully",
                        });
                    }
                });
            } else {
                res.json({
                    success: "Successfully Uploaded",
                });
            }
        });
    }
);

module.exports = router;