import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  telephone: { type: String, required: true },
  product: { type: String, required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const SupplierModel =
  mongoose.models.Supplier || mongoose.model("Supplier", supplierSchema);

export default SupplierModel;
