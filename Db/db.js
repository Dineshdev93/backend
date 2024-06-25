const mongoose = require("mongoose");
const colors = require("colors");
const conn = process.env.DATABASE;
mongoose
  .connect(conn)
  .then(() => {
    console.log(`Mongodb connected successfully`.bgGreen);
  })
  .catch((error) => {
    console.log(`Mongodb not connected ${error}`.bgRed);
  });
