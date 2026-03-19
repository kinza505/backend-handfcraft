const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require("path");

const Order = require('./models/Order');
const User = require('./models/User');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve frontend (dist folder)
app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// MongoDB Connection
mongoose.connect("mongodb://kinzabilal9t_db_user:hJHU3VFLHa6HGLXq@ac-2ko06du-shard-00-00.rtavwdd.mongodb.net:27017,ac-2ko06du-shard-00-01.rtavwdd.mongodb.net:27017,ac-2ko06du-shard-00-02.rtavwdd.mongodb.net:27017/?ssl=true&replicaSet=atlas-89sq2v-shard-0&authSource=admin&appName=Cluster0/handcraft_db")
.then(() => console.log("✅ MongoDB Connected Successfully"))
.catch((err) => console.log("❌ DB Connection Error:", err));


// SIGNUP
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (name.length < 5) {
      return res.status(400).json({ message: "Name must be at least 5 characters" });
    }

    if (!email.includes("@") || !email.includes(".com")) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Account created successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});


// LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});


// Create Order
app.post('/api/orders', async (req, res) => {
  try {
    const { fullName, email, phone, address, city, items, totalAmount, paymentMethod } = req.body;

    const newOrder = new Order({
      customerName: fullName,
      email,
      phone,
      address,
      city,
      items,
      totalAmount,
      paymentMethod
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order Placed Successfully",
      order: newOrder
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
});


// Get Orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});


// Delete Order
app.delete('/api/orders/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: "Order deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting order" });
  }
});


// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});