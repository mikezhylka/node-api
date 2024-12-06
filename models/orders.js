import mongoose from 'mongoose';

const ordersSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const Orders = mongoose.model('orders', ordersSchema);

export default Orders;
