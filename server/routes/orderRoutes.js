import { Router } from 'express';
import Order from '../models/order.js';
import auth from '../middleware/auth.js';

const router = Router();

// Create order (customer only)
router.post("/", auth, async (req, res) => {
  const { items, total } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Items are required" });
  }

  if (!total || isNaN(total) || total <= 0) {
    return res.status(400).json({ message: "Invalid total amount" });
  }

  try {
    const order = await Order.create({
      userId: req.user.id,
      items,
      total,
    });
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create order" });
  }
});

// 🆕 Customer: Get own orders
router.get("/my", auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate("items.itemId")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch your orders" });
  }
});

// Admin: Get all orders
router.get("/", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.sendStatus(403);

  try {
    const orders = await Order.find()
      .populate("items.itemId")
      .populate("userId", "name email"); // Only return relevant user info
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// Admin: Update order status
router.put("/update/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.sendStatus(403);

  const { status } = req.body;
  const validStatuses = ["pending", "preparing", "delivered"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update order" });
  }
});

// Admin: Delete an order
router.delete("/delete/:orderId", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.sendStatus(403);

  try {
    const order = await Order.findByIdAndDelete(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete order" });
  }
});

export default router;
