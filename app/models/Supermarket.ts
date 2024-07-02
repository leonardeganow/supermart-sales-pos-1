import mongoose from "mongoose";

const supermarketSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const SupermartModel = mongoose.models.Supermarket ||
  mongoose.model("Supermarket", supermarketSchema);

  export default SupermartModel;