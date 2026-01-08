const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./db");
const authRouter = require("./routes/auth");
require("./models/User");
require("dotenv").config();

const PORT = process.env.PORT || 3003;
const app = express();
app.use(bodyParser.json());

app.use("/api", authRouter);

async function start(){
    await sequelize.sync();
    app.listen(PORT, ()=> console.log(`Users service listening ${PORT}`));
}

start();