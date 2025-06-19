// ✅ income-service/src/models/TotalBusiness.js
const mongoose = require("mongoose");

const totalBusinessSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  totalTopup: {
    type: Number,
    default: 0,
  },
  totalWithdraw: {
    type: Number,
    default: 0,
  },
  totalIncome: {
    type: Number,
    default: 0,
  },
  monthlyStats: [
    {
      month: String, // "2025-06"
      income: {
        type: Number,
        default: 0,
      },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("TotalBusiness", totalBusinessSchema);
