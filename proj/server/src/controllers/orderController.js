import { Order, CartItem, Product } from "../models/index.js";

export const getOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const orders = await Order.findAll({
            where: { UserId: userId },
            order: [["createdAt", "DESC"]]
        });
        
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        
        const order = await Order.findOne({
            where: { id, UserId: userId }
        });
        
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { shippingAddress } = req.body;
        
        const cartItems = await CartItem.findAll({
            where: { UserId: userId },
            include: [{
                model: Product,
                attributes: ["id", "title", "price", "image", "stock"]
            }]
        });
        
        if (cartItems.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }
        
        const orderItems = [];
        for (const item of cartItems) {
            if (item.Product.stock < item.quantity) {
                return res.status(400).json({ 
                    message: `Not enough stock for ${item.Product.title}` 
                });
            }
            
            orderItems.push({
                productId: item.Product.id,
                title: item.Product.title,
                price: parseFloat(item.Product.price),
                quantity: item.quantity,
                image: item.Product.image
            });
        }
        
        const total = orderItems.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
        
        const order = await Order.create({
            UserId: userId,
            items: orderItems,
            total: total.toFixed(2).replace(".", ","),
            status: "pending",
            shippingAddress
        });
        
        for (const item of cartItems) {
            await item.Product.update({
                stock: item.Product.stock - item.quantity
            });
        }
        
        await CartItem.destroy({
            where: { UserId: userId }
        });
        
        res.status(201).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
