const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();
const secret = process.env.JWT_SECRET;

// POST /api/register
router.post("/register", async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({ error: "Missing fields" });
    }

    const existing = await User.findOne({ where: { email } });

    if(existing) {
        return res.status(400).json({ error: "Email in use" });
    }

    const hash = await bcrypt.hash(password, 10);
    const u = await User.create({ email, password: hash });

    res.json({ id: u.id });
});

// POST /api/login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).json({ error: "Missing fields" });
    }

    const u = await User.findOne({ where: { email } });

    if(!u) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, u.password);

    if(!ok) {
        return res.status(401).json({ error: "Invalid credentials" });
    }
    
    const token = jwt.sign({ id: u.id, email: u.email }, secret, { expiresIn: "2h" });
    res.json({ token });
});

module.exports = router;