const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./db");
const Book = require("./models/Book");
const booksRouter = require("./routes/books");
require("dotenv").config();

const PORT = process.env.PORT || 3001;
const app = express();
app.use(bodyParser.json());

app.use("/api/books", booksRouter);

async function start(){
    await sequelize.sync();

    // await Book.bulkCreate([
    //     { title: "Pan Tadeusz", author: "Adam Mickiewicz", year: 1834 },
    //     { title: "Lalka", author: "Bolesław Prus", year: 1890 }
    // ]);
    
    app.listen(PORT, ()=> console.log(`Books service listening ${PORT}`));
}

start();