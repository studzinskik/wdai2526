import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./models/index.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import reviewRoutes from "./routes/reviews.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/orders.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api", reviewRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error" });
});

const startServer = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();

        const server = app.listen(PORT, () => {
            console.log(`Serwer chodzi na ${PORT}`);
        });
        
        const shutdown = () => {
            server.close(() => {
                process.exit(0);
            });
        };
        
        process.on("SIGTERM", shutdown);
        process.on("SIGINT", shutdown);
        
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

startServer();
