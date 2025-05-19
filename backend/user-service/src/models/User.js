const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
     referralCode: {
    type: String,
  },
    referralCodeLeft: String,
    referralCodeRight: String,
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    leftUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rightUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isAdmin: { type: Boolean, default: false },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.index(
  { referralCode: 1 },
  {
    unique: true,
    partialFilterExpression: { referralCode: { $exists: true, $ne: null } },
  }
);
module.exports = mongoose.model("User", userSchema);
