import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  role: { type: String, enum: ["cashier", "manager", "admin"], required: true },
  supermarketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supermarket",
    required: false,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

export default UserModel;
