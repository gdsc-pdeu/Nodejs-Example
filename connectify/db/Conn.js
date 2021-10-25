const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const url = process.env.CONN_STRING;

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((err) => console.log(err));
