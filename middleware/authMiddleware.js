import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protect routes (logged-in users only)
export const protect = async (req, res, next) => {
  let token;

  try {
    // Check if cookie exists
    token = req.cookies.jwt;

    if (token) {
      try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user without password
        req.user = await User.findById(decoded.userId).select("-password");

        if (!req.user) {
          res.status(401);
          throw new Error("User not found");
        }

        next();
      } catch (err) {
        res.status(401);
        throw new Error("Not authorized, invalid token");
      }
    } else {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  } catch (err) {
    next(err);
  }
};

// Admin only middleware
export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized as admin");
  }
};
