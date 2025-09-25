import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET cart
router.get("/", protect, getCart);

// Add to cart
router.post("/", protect, addToCart);

// Update cart item quantity
router.put("/", protect, updateCartItem);

// Remove from cart
router.delete("/:productId", protect, removeFromCart);

export default router;
