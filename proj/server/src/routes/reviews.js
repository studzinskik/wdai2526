import express from "express";
import { 
    getProductReviews, 
    createReview, 
    updateReview, 
    deleteReview 
} from "../controllers/reviewController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/products/:productId/reviews", getProductReviews);
router.post("/products/:productId/reviews", authenticate, createReview);
router.put("/reviews/:id", authenticate, updateReview);
router.delete("/reviews/:id", authenticate, deleteReview);

export default router;
