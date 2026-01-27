import { Op } from "sequelize";
import { Product, Review, User } from "../models/index.js";

export const getAllProducts = async (req, res) => {
    try {
        const { search, category } = req.query;
        
        const where = {};
        
        if (search) {
            where.title = { [Op.like]: `%${search}%` };
        }
        
        if (category) {
            where.category = category;
        }
        
        const products = await Product.findAll({
            where,
            order: [["id", "ASC"]]
        });
        
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const product = await Product.findByPk(id, {
            include: [{
                model: Review,
                include: [{
                    model: User,
                    attributes: ["id", "firstName", "lastName"]
                }]
            }]
        });
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { title, price, description, category, image, stock } = req.body;
        
        if (!title || !price || !category) {
            return res.status(400).json({ message: "Title, price, and category are required" });
        }
        
        const product = await Product.create({
            title,
            price,
            description,
            category,
            image,
            stock: stock || 100
        });
        
        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, price, description, category, image, stock } = req.body;
        
        const product = await Product.findByPk(id);
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        await product.update({
            title: title || product.title,
            price: price || product.price,
            description: description !== undefined ? description : product.description,
            category: category || product.category,
            image: image !== undefined ? image : product.image,
            stock: stock !== undefined ? stock : product.stock
        });
        
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        
        const product = await Product.findByPk(id);
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        await product.destroy();
        
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getCategories = async (req, res) => {
    try {
        const products = await Product.findAll({
            attributes: ["category"],
            group: ["category"]
        });
        
        const categories = products.map(p => p.category);
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
