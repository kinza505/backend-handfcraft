// routes/orderRoutes.js
import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// POST /orders
router.post('/', async (req, res) => {
  try {
    const { name, email, product, quantity } = req.body;

    if (!name || !email || !product || !quantity) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newOrder = new Order({ name, email, product, quantity });
    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;