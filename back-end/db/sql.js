const mysql = require("mysql");

var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "#include<iostream>",
    database: "instagram",
});

db.connect((err) => {
    if (err) {
        return console.log("MYSQL connection failed" + err);
    }
    console.log("Congrats MYSQL connected successfully");
});

module.exports = db