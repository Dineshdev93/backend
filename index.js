const express = require("express");
require("dotenv").config();
const app = express()
const cors = require("cors")
app.use(cors())
app.use(express.json())
const colors = require("colors")

const PORT =process.env.PORT || 4000;

require('./Db/db')
const route = require("./routes/router")
app.use(route);

app.listen(PORT,()=>{
   console.log(`Server start at Port number ${PORT}`.bgBlue);
})