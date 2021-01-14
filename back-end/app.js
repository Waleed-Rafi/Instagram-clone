const express = require("express");
require('dotenv').config(); //to access features of .env and run .env files always run in the start of application
const helmet = require("helmet");
require('./db/sql') //running database

const auth = require("./routes/auth");
const posts = require('./routes/posts')

const app = express();

app.use(helmet()); //for securing our application and preventing from attacks like xss attacks.

const PORT = 5000 || process.env.PORT;

app.use(express.json()); //convert data of incoming requests to json

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin , X-Requested-With , Content-Type,Accept,x-auth-token"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET , POST , PATCH , DELETE");
    next();
});

app.use("/api", auth);
app.use("/api/posts", posts);

app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`);
});