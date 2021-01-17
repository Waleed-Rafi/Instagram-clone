const express = require("express");
require("dotenv").config(); //to access features of .env and run .env files always run in the start of application
const helmet = require("helmet");
require("./db/sql"); //running database

const auth = require("./routes/auth");
const createPost = require("./routes/posts/createPost");
const allPosts = require("./routes/posts/allPosts");
const likePost = require("./routes/posts/like");
const unlikePost = require("./routes/posts/unlike");
const createComment = require("./routes/posts/createComment");
const getComments = require("./routes/posts/getComments");

const getProfile = require("./routes/profile/profile");
const searchProfiles = require("./routes/profile/searchProfiles");

const app = express();
app.use(express.json()); //convert data of incoming requests to json
app.use(helmet()); //for securing our application and preventing from attacks like xss attacks.

const PORT = 5000 || process.env.PORT;

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
app.use("/api/posts", createPost);
app.use("/api/posts", allPosts);
app.use("/api/posts", likePost);
app.use("/api/posts", unlikePost);
app.use("/api/posts", createComment);
app.use("/api/posts", getComments);
app.use("/api/posts", getProfile);
app.use("/api/posts", searchProfiles);

app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`);
});