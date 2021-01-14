const express = require("express");
const router = express.Router();
const db = require("../db/sql");
const { validationResult, check } = require("express-validator");
const auth = require("../middleware/auth");

router.get("/test", auth, (req, res) => {
    res.send({
        name: req.user,
    });
});

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
        let data = {
            imageUrl: req.body.imageUrl,
            description: req.body.description,
            user_id: req.user[0].id,
        };
        let sql = "INSERT INTO posts SET ? ";
        db.query(sql, data, (err, result) => {
            if (err) {
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
        // "SELECT users.id,posts.post_id,users.name,users.profilePic,users.created_at,posts.imageUrl,posts.description,COUNT(posts.post_id) AS likes,likes.l_user_id,likes.l_post_id FROM users JOIN posts ON users.id = posts.user_id LEFT JOIN likes ON posts.post_id = likes.l_post_id GROUP BY(posts.post_id) ORDER BY posts.post_id DESC";
        "SELECT * FROM users JOIN posts ON users.id = posts.user_id ORDER BY post_id DESC";
    db.query(sql, (err, result) => {
        if (err) {
            return res.json({
                error: "Failed! Fetching latest Posts",
            });
        }
        sql = "SELECT * FROM likes;";
        db.query(sql, (error, rslt) => {
            if (error) {
                return res.json({
                    error: "Failed to fetch latest likes",
                });
            }
            result.forEach((data1, index) => {
                let isFind = false;
                rslt.forEach((data2) => {
                    if (data2.l_post_id === data1.post_id) {
                        isFind = true;
                        let likes = [];
                        if (result[index].likes) {
                            likes = [
                                ...result[index].likes,
                                {
                                    ...data2,
                                },
                            ];
                        } else {
                            likes = [{
                                ...data2,
                            }, ];
                        }
                        result[index] = {
                            ...data1,
                            likes,
                        };
                    }
                });
                if (!isFind) {
                    result[index].likes = [];
                }
            });
        });
        sql =
            "SELECT c_post_id,message,id,name,profilePic FROM comments JOIN users ON comments.c_user_id = users.id ORDER BY comments.com_id;";
        db.query(sql, (e, r) => {
            if (e) {
                return res.json({
                    error: "Failed to fetch latest comments",
                });
            }
            result.forEach((data1, index) => {
                let isFind = false;
                r.forEach((data2) => {
                    if (data2.c_post_id === data1.post_id) {
                        isFind = true;
                        let comments = [];
                        if (result[index].comments) {
                            comments = [
                                ...result[index].comments,
                                {
                                    ...data2,
                                },
                            ];
                        } else {
                            comments = [{
                                ...data2,
                            }, ];
                        }
                        result[index] = {
                            ...data1,
                            comments,
                        };
                    }
                });
                if (!isFind) {
                    result[index].comments = [];
                }
                result[index].comments.reverse();
            });
            res.json(result);
        });
    });
});

router.get("/profile/:id", auth, (req, res) => {
    let sql =
        "SELECT * FROM users JOIN posts ON users.id = posts.user_id WHERE users.id = ? ORDER BY posts.post_id DESC";
    db.query(sql, req.params.id, (err, result) => {
        if (err) {
            return res.json({
                error: "Failed! Fetching My Posts",
            });
        }
        sql =
            "SELECT com_id,c_post_id,message,id,name,profilePic FROM comments JOIN users ON comments.c_user_id = users.id ORDER BY comments.com_id;";
        db.query(sql, (e, r) => {
            if (e) {
                return res.json({
                    error: "Failed to fetch latest comments",
                });
            }
            result.forEach((data1, index) => {
                let isFind = false;
                r.forEach((data2) => {
                    if (data2.c_post_id === data1.post_id) {
                        isFind = true;
                        let comments = [];
                        if (result[index].comments) {
                            comments = [
                                ...result[index].comments,
                                {
                                    ...data2,
                                },
                            ];
                        } else {
                            comments = [{
                                ...data2,
                            }, ];
                        }
                        result[index] = {
                            ...data1,
                            comments,
                        };
                    }
                });
                if (!isFind) {
                    result[index].comments = [];
                }
                result[index].comments.reverse();
            });
            res.json(result);
        });
    });
});

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

router.post("/dislike/:id", auth, (req, res) => {
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
                res.json({
                    disLikeFailed: "Unable to dislike try again!",
                });
            }
            if (result.length > 0) {
                sql = `DELETE FROM likes WHERE likes_id = ?`;
                db.query(sql, result[0].likes_id, (e, r) => {
                    if (e) {
                        res.json({
                            disLikeFailed: "Unable to dislike try again!",
                        });
                    } else {
                        res.json({
                            message: "Successfully dislike the post!",
                            id: result.likes_id,
                        });
                    }
                });
            } else {
                res.json({
                    disLikeFailed: "Firstly like the post!",
                });
            }
        });
    }
});

router.post(
    "/comment/:id",
    auth, [
        check("message", "Must be less than 255 characters").isLength({
            max: 255,
        }),
    ],
    (req, res) => {
        if (req.params.id) {
            const errors = validationResult(req.body);
            if (!errors.isEmpty()) {
                return res.json(errors);
            }
            if (!req.body.message) {
                return res.json({
                    error: "Comment is required",
                });
            }
            // let sql =
            //   "CREATE TABLE comments(com_id INT AUTO_INCREMENT PRIMARY KEY,c_post_id INT NOT NULL , c_user_id INT NOT NULL,message VARCHAR(255) NOT NULL,FOREIGN KEY(c_post_id) REFERENCES posts(post_id) , FOREIGN KEY(c_user_id) REFERENCES users(id));";
            // db.query(sql, (err, result) => {
            //   if (err) {
            //     console.log(err);
            //     return res.json({
            //       error: "Table creation failed",
            //     });
            //   }
            //   res.json({
            //     message: "Table successfully created!",
            //   });
            // });
            let data = {
                c_post_id: parseInt(req.params.id),
                c_user_id: req.user[0].id,
                message: req.body.message,
            };
            let sql = "INSERT INTO comments SET ? ";
            db.query(sql, data, (err, result) => {
                if (err) {
                    return res.json({
                        likeFailed: "Unable to comment try again!",
                    });
                }
                res.json({
                    message: "Successfully comment on the post!",
                    id: result.insertId,
                });
            });
        }
    }
);

router.get("/comments", auth, (req, res) => {
    let sql =
        "SELECT * FROM comments JOIN users JOIN posts ON comments.c_user_id = users.id AND posts.post_id = comments.c_post_id;";
    db.query(sql, (err, result) => {
        if (err) {
            return res.json({
                commentRFail: "Unable to fetch comments",
            });
        }
        res.json({
            message: "Successfully fetched!!",
            result,
        });
    });
});
router.post("/searchedUsers", auth, (req, res) => {
    let sql = "SELECT * FROM users WHERE name LIKE ?";
    db.query(sql, [`%${req.body.name}%`], (err, result) => {
        if (err) {
            return res.json({
                fetchUsersFailed: "Unable to fetch users",
            });
        }
        res.json({
            message: "Successfully fetched!!",
            result,
        });
    });
});

module.exports = router;