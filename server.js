import dotenv from "dotenv";
dotenv.config();
console.log("Cloudinary API Key:", process.env.CLOUDINARY_API_KEY);
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import "./config/cloudinaryConfig.js";

connectDB();

const app = express();

// 🔥 CORS setup
app.use(
  cors({
    origin: process.env.CORS_ORIGIN === "*" ? true : process.env.CORS_ORIGIN,
    credentials: true, // allow cookies
  })
);

// Middleware to parse JSON and cookies
app.use(express.json());
app.use(cookieParser());

// Routes for Authentication
app.use("/api/auth", authRoutes);

// Public + Admin routes for products
app.use("/api/products", productRoutes);

// Cart Routes
app.use("/api/cart", cartRoutes);

// Orders
app.use("/api/orders", orderRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
