const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./db");
const Order = require("./models/Order");
const ordersRouter = require("./routes/orders");
require("dotenv").config();

const PORT = process.env.PORT || 3002;
const app = express();
app.use(bodyParser.json());

app.use("/api/orders", ordersRouter);

async function start(){
    await sequelize.sync();
    app.listen(PORT, ()=> console.log(`Orders service listening ${PORT}`));
}

start();