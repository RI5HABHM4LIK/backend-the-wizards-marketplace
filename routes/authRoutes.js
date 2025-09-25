import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  getAllUsers,
  deleteUser,
  updateUserProfile,
} from "../controllers/authController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Public routes
router.post("/register", upload.single("profilePic"), registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, upload.single("profilePic"), updateUserProfile);

// Admin-only routes
router.get("/admin/users", protect, admin, getAllUsers);
router.delete("/admin/users/:id", protect, admin, deleteUser);

export default router;
