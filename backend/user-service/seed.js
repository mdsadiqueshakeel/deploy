require("dotenv").config({ path: "./.env" }); // Make sure this path is correct

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./src/models/User"); // Adjust if needed

const MONGO_URI = process.env.MONGO_URI;

async function seed() {
  try {
    if (!MONGO_URI) throw new Error("MONGO_URI is missing from .env");

    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");

    const exists = await User.findOne({ email: "admin@sponsor.com" });
    if (exists) {
      console.log("Seed user already exists.");
      return process.exit(0);
    }

    const user = new User({
      name: "Sadique",
      email: "tempsadique@gmail.com",
      password: await bcrypt.hash("sadique", 10),
      referralCode: "TEMP1234",
      referralCodeLeft: "LEFTTEMP",
      referralCodeRight: "RIGHTTEMP",
      isAdmin: true,
    });

    await user.save();
    console.log("✅ Seed user created.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

seed();
