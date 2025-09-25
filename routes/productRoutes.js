import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Public routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin routes
router.post("/", protect, admin, upload.single("image"), createProduct);
router.put("/:id", protect, upload.single("image"), admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

export default router;
