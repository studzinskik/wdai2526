const express = require("express");
const axios = require("axios");
const Order = require("../models/Order");
const { requireAuth } = require("../middleware/auth");
require("dotenv").config();

const router = express.Router();
const booksBase = process.env.BOOKS_SERVICE_URL || "http://localhost:3001";

// GET /api/orders/:userId
router.get("/:userId", requireAuth, async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    
    if (req.user.id !== userId) {
        return res.status(403).json({ error: "Forbidden" });
    }

    const orders = await Order.findAll({ where: { userId } });
    res.json(orders);
});

// POST /api/orders
router.post("/", requireAuth, async (req, res) => {
    const { userId, bookId, quantity } = req.body;

    if(!userId || !bookId || !quantity) {
        return res.status(400).json({ error: "Missing" });
    }

    if(req.user.id !== userId) {
        return res.status(403).json({ error: "Forbidden" });
    }

    try {
        await axios.get(`${booksBase}/api/books/${bookId}`);
    } catch(e) {
        return res.status(400).json({ error: "Invalid bookId (book not found)" });
    }

    const o = await Order.create({ userId, bookId, quantity });
    res.json({ id: o.id });
});

// DELETE /api/orders/:orderId
router.delete("/:orderId", requireAuth, async (req, res) => {
    const id = req.params.orderId;
    const o = await Order.findByPk(id);

    if(!o) {
        return res.status(404).json({ error: "Not found" });
    }

    if (req.user.id !== o.userId) {
        return res.status(403).json({ error: "Forbidden" });
    }

    await o.destroy();
    res.json({ ok: true });
});

// PATCH /api/orders/:orderId
router.patch("/:orderId", requireAuth, async (req, res) => {
    const id = req.params.orderId;
    const o = await Order.findByPk(id);

    if(!o) {
        return res.status(404).json({ error: "Not found" });
    }

    if(req.user.id !== o.userId) {
        return res.status(403).json({ error: "Forbidden" });
    }

    const { quantity } = req.body;
    if (quantity !== undefined) {
        o.quantity = quantity;
    }

    await o.save();
    res.json({ ok: true });
});

module.exports = router;