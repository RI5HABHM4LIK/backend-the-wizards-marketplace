import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Herbology", "Potions", "Artifacts", "Quidditch & House Gear"],
    },
    filter: {
      type: String,
      required: true,
      enum: [
        // Herbology
        "Healing",
        "Dangerous",
        "Rare",
        // Potions
        "Beginner",
        "Advanced",
        "Restricted",
        // Artifacts
        "Common",
        "Rare",
        "Legendary",
        // Quidditch & House Gear
        "Brooms",
        "House Clothing",
        "Accessories",
      ],
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String, // store URL or path
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    stock: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
