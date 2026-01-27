import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

const generateTokens = (userId) => {
    const accessToken = jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
    );
    
    const refreshToken = jwt.sign(
        { userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" }
    );
    
    return { accessToken, refreshToken };
};

export const register = async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;
        
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }
        
        const user = await User.create({
            email,
            password,
            firstName,
            lastName,
            role: "user"
        });
        
        const { accessToken, refreshToken } = generateTokens(user.id);
        
        user.refreshToken = refreshToken;
        await user.save();
        
        res.status(201).json({
            message: "User registered successfully",
            user: user.toJSON(),
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        
        const { accessToken, refreshToken } = generateTokens(user.id);
        
        user.refreshToken = refreshToken;
        await user.save();
        
        res.json({
            message: "Login successful",
            user: user.toJSON(),
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const { refreshToken: token } = req.body;
        
        if (!token) {
            return res.status(400).json({ message: "Refresh token required" });
        }
        
        try {
            const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            const user = await User.findByPk(decoded.userId);
            
            if (!user || user.refreshToken !== token) {
                return res.status(401).json({ message: "Invalid refresh token" });
            }
            
            const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id);
            
            user.refreshToken = newRefreshToken;
            await user.save();
            
            res.json({
                accessToken,
                refreshToken: newRefreshToken
            });
        } catch (error) {
            return res.status(401).json({ message: "Invalid or expired refresh token" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = async (req, res) => {
    try {
        const user = req.user;
        
        if (user) {
            user.refreshToken = null;
            await user.save();
        }
        
        res.json({ message: "Logged out successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getMe = async (req, res) => {
    try {
        res.json({ user: req.user.toJSON() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
