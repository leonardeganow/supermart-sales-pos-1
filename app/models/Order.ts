import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  customerName: { type: String, default: "guest" },
  paymentMethod: { type: String, required: true },
  paymentId: { type: String, required: false },
  taxAmount: { type: Number, required: true },
  cart: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
      currency: { type: String, required: true },
      total: { type: Number, required: true },
    },
  ],
  totalDiscount: { type: Number, required: true },
  finalTotal: { type: Number, required: true },
  orderDate: { type: Date, default: Date.now },
  cashierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderStatus: { type: String, required: true },
});

const OrderModel =
  mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default OrderModel;
