import express from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderDeliveryStatus,
  updateOrderPaymentStatus,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// USER ROUTES
router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);

// ADMIN ROUTES
router.get("/", protect, admin, getAllOrders);
router.put("/:id/deliver", protect, admin, updateOrderDeliveryStatus);
router.put("/:id/pay", protect, admin, updateOrderPaymentStatus);

export default router;
