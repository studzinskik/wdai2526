import express from "express";
import { 
    getAllProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    getCategories 
} from "../controllers/productController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/categories", getCategories);
router.get("/:id", getProductById);
router.post("/", authenticate, authorize("admin"), createProduct);
router.put("/:id", authenticate, authorize("admin"), updateProduct);
router.delete("/:id", authenticate, authorize("admin"), deleteProduct);

export default router;
