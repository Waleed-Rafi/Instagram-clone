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

module.exports = router;