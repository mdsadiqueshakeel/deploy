const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
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

   parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // for binary tree matching

    referralCodeLeft: String,
    referralCodeRight: String,

        // Personal Details
    phone: {
      type: Number,
      default: null,
    },
    country: {
      type: String,
      default: "India",
    },
    panNumber: {
      type: String,
      default: null,
    },
    aadharNumber: {
      type: Number,
      default: null,
    },
    avatar: {
      type: String, // Could be URL or base64
      default: null,
    },

    bankDetails: {
      accountNumber: { type: Number, default: null },
      ifscCode: { type: String, default: null },
      bankName: { type: String, default: null },
      accountHolderName: { type: String, default: null },
    },

    rank:{
      type: String,
      default: "Member", // Default rank is Member
    },

    isRootSponsor: { type: Boolean, default: false }, 

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
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("User", userSchema);
