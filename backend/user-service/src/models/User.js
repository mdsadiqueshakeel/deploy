const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  referralCodeLeft: String,
  referralCodeRight: String,
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  leftUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rightUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
