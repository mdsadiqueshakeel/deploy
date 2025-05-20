const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
   referralCode: { type: String, required: true },

   sponsorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // for direct income
   parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // for binary tree matching

    referralCodeLeft: String,
    referralCodeRight: String,


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
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


userSchema.index({ referralCode: 1 }, { unique: true });

module.exports = mongoose.model("User", userSchema);
