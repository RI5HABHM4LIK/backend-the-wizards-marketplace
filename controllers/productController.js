import Product from "../models/Product.js";
import cloudinary from "../config/cloudinaryConfig.js";

// @desc    Get all products (with optional category/filter)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const { category, filter } = req.query;
    let query = {};

    if (category) query.category = category;
    if (filter) query.filter = filter;

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/admin/products
// @access  Admin

export const createProduct = async (req, res, next) => {
  try {
    const { name, category, filter, description, price, stock } = req.body;

    let imageUrl = "";

    if (req.file) {
      // Wrap buffer upload in a promise
      imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "wizard-market" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );

        stream.end(req.file.buffer); // send multer buffer
      });
    }

    const product = new Product({
      name,
      category,
      filter,
      description,
      image: imageUrl,
      price,
      stock,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Admin
export const updateProduct = async (req, res, next) => {
  try {
    const { name, category, filter, description, price, stock } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    let imageUrl = product.image;

    if (req.file) {
      imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "wizard-market" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        stream.end(req.file.buffer);
      });
    }

    product.name = name || product.name;
    product.category = category || product.category;
    product.filter = filter || product.filter;
    product.description = description || product.description;
    product.image = imageUrl;
    product.price = price || product.price;
    product.stock = stock || product.stock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      res.status(404);
      throw new Error("Product not found");
    }
    res.json({ message: "Product removed" });
  } catch (error) {
    next(error);
  }
};
