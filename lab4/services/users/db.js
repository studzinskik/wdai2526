const { Sequelize } = require("sequelize");
const path = require("path");
require("dotenv").config();

const storage = process.env.DB_FILE || "users.sqlite";
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: path.join(__dirname, storage),
    logging: false
});

module.exports = sequelize;