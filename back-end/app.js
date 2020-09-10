const express = require("express");
require('./db/sql')
const auth = require("./routes/auth");
const posts = require('./routes/posts')

const app = express();
const PORT = 5000 || process.env.PORT;

app.use(express.json());

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