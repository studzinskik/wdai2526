import express from "express";
import { getOrders, getOrderById, createOrder } from "../controllers/orderController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, getOrders);
router.get("/:id", authenticate, getOrderById);
router.post("/", authenticate, createOrder);

export default router;
