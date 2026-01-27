import dotenv from "dotenv";
import { sequelize, User, Product } from "./models/index.js";

dotenv.config();

const users = [
    {
        email: "kamil.studzinski@tp.pl",
        password: "prywatnehaslo",
        firstName: "Kamil",
        lastName: "Studziński",
        role: "user"
    },

    {
        email: "mateusz.jarosz@tp.pl",
        password: "aminamin",
        firstName: "Mateusz",
        lastName: "Jarosz",
        role: "admin"
    }
];

const seed = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ force: true });

        for (const userData of users) {
            await User.create(userData);
        }
        
        const response = await fetch("https://fakestoreapi.com/products");
        const productsData = await response.json();
        
        for (const item of productsData) {
            await Product.create({
                title: item.title,
                price: item.price,
                description: item.description,
                category: item.category,
                image: item.image,
                stock: Math.floor(Math.random() * 50) + 10,
                rating: item.rating?.rate || 0,
                ratingCount: item.rating?.count || 0
            });
        }
        
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seed();
