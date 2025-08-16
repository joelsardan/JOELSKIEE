// server.js
require("dotenv").config(); // Load env first
const express = require("express");
const cookieParser = require("cookie-parser");
const { createUserTable } = require("./models/auth-models");

const app = express();
app.use(express.json());
app.use(cookieParser());

createUserTable()
  .then(() => console.log("Table has been created"))
  .catch((error) => console.log(error));

app.use("/api/auth", require("./routes/auth-route"));

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
