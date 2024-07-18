import mongoose from "mongoose";
import SupermartModel from "./Supermarket";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    enum: ["GHS", "USD"],
    required: true,
  },
  inStock: {
    type: Boolean,
    required: true,
  },
  category: {
    type: String,

    required: true,
  },
  basePrice: {
    type: Number,
    required: true,
  },
  sellingPrice: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  barcode: {
    type: String,
    required: true,
  },
  supermarketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: SupermartModel,
    required: true,
  },
});

const ProductModel =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default ProductModel;
