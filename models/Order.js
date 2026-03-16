const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    items: [
        {
            name: String,
            price: Number,
            quantity: Number,
            image: String
        }
    ],
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    orderDate: { type: Date, default: Date.now }
});

// 'Order' لکھنے سے MongoDB میں 'orders' کے نام سے کلیکشن بن جائے گی
module.exports = mongoose.model('Order', OrderSchema);