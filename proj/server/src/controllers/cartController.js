import { CartItem, Product } from "../models/index.js";

export const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const cartItems = await CartItem.findAll({
            where: { UserId: userId },
            include: [{
                model: Product,
                attributes: ["id", "title", "price", "image", "stock"]
            }]
        });
        
        const total = cartItems.reduce((sum, item) => {
            return sum + (parseFloat(item.Product.price) * item.quantity);
        }, 0);
        
        res.json({
            items: cartItems,
            total: total.toFixed(2).replace(".", ","),
            itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity = 1 } = req.body;
        
        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }
        
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        if (product.stock < quantity) {
            return res.status(400).json({ message: "Not enough stock available" });
        }
        
        let cartItem = await CartItem.findOne({
            where: { UserId: userId, ProductId: productId }
        });
        
        if (cartItem) {
            const newQuantity = cartItem.quantity + quantity;
            if (newQuantity > product.stock) {
                return res.status(400).json({ message: "Not enough stock available" });
            }
            await cartItem.update({ quantity: newQuantity });
        } else {
            cartItem = await CartItem.create({
                UserId: userId,
                ProductId: productId,
                quantity
            });
        }
        
        const cartItems = await CartItem.findAll({
            where: { UserId: userId },
            include: [{
                model: Product,
                attributes: ["id", "title", "price", "image", "stock"]
            }]
        });
        
        const total = cartItems.reduce((sum, item) => {
            return sum + (parseFloat(item.Product.price) * item.quantity);
        }, 0);
        
        res.json({
            items: cartItems,
            total: total.toFixed(2).replace(".", ","),
            itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.params;
        const { quantity } = req.body;
        
        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: "Valid quantity is required" });
        }
        
        const cartItem = await CartItem.findOne({
            where: { id: itemId, UserId: userId },
            include: [{ model: Product }]
        });
        
        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }
        
        if (quantity > cartItem.Product.stock) {
            return res.status(400).json({ message: "Not enough stock available" });
        }
        
        await cartItem.update({ quantity });
        
        const cartItems = await CartItem.findAll({
            where: { UserId: userId },
            include: [{
                model: Product,
                attributes: ["id", "title", "price", "image", "stock"]
            }]
        });
        
        const total = cartItems.reduce((sum, item) => {
            return sum + (parseFloat(item.Product.price) * item.quantity);
        }, 0);
        
        res.json({
            items: cartItems,
            total: total.toFixed(2).replace(".", ","),
            itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.params;
        
        const cartItem = await CartItem.findOne({
            where: { id: itemId, UserId: userId }
        });
        
        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }
        
        await cartItem.destroy();
        
        const cartItems = await CartItem.findAll({
            where: { UserId: userId },
            include: [{
                model: Product,
                attributes: ["id", "title", "price", "image", "stock"]
            }]
        });
        
        const total = cartItems.reduce((sum, item) => {
            return sum + (parseFloat(item.Product.price) * item.quantity);
        }, 0);
        
        res.json({
            items: cartItems,
            total: total.toFixed(2).replace(".", ","),
            itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;
        
        await CartItem.destroy({
            where: { UserId: userId }
        });
        
        res.json({
            items: [],
            total: "0,00",
            itemCount: 0
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
