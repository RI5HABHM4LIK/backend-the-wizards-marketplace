import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

// ✅ Create a new order
export const createOrder = async (req, res, next) => {
  try {
    const { orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice } =
      req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // ✅ Check stock before creating order
    for (let item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        res.status(404);
        throw new Error(`Product ${item.name} not found`);
      }
      if (product.stock < item.qty) {
        res.status(400);
        throw new Error(`Not enough stock for ${product.name}`);
      }
    }

    // ✅ Create the order (snapshot shipping address from user)
    const order = new Order({
      user: req.user._id,
      orderItems,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      shippingAddress: user.shippingAddress,
    });

    const createdOrder = await order.save();

    // ✅ Reduce stock after order created
    for (let item of orderItems) {
      const product = await Product.findById(item.product);
      product.stock -= item.qty;
      await product.save();
    }

    // ✅ Clear user’s cart
    await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { $set: { items: [] } }
    );

    res.status(201).json(createdOrder);
  } catch (error) {
    next(error);
  }
};

// @desc Get logged-in user's orders
// @route GET /api/orders/myorders
// @access Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// ====================== ADMIN ======================

// @desc Get all orders (Admin only)
// @route GET /api/orders
// @access Private/Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc Update order to delivered
// @route PUT /api/orders/:id/deliver
// @access Private/Admin
export const updateOrderDeliveryStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      const { isDelivered } = req.body; // ✅ expect true/false

      order.isDelivered = isDelivered;
      order.deliveredAt = isDelivered ? Date.now() : null;

      const updatedOrder = await order.save();
      res.json({
        message: `Order delivery status updated to ${isDelivered}`,
        order: updatedOrder,
      });
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc Update order to paid (for COD when received)
// @route PUT /api/orders/:id/pay
// @access Private/Admin
// PUT /api/orders/:id/pay
export const updateOrderPaymentStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      const { isPaid } = req.body; // ✅ expect true/false

      order.isPaid = isPaid;
      order.paidAt = isPaid ? Date.now() : null; // reset if false

      const updatedOrder = await order.save();
      res.json({
        message: `Order payment status updated to ${isPaid}`,
        order: updatedOrder,
      });
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    next(error);
  }
};
