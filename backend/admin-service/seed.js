const mongoose = require("mongoose");
require("dotenv").config();
const Admin = require("./src/models/adminModel");

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const exists = await Admin.findOne({ email: "qurksuman@gmail.com" });
  if (exists) return console.log("Admin already exists");

  const admin = new Admin({ name: "Ranjan Kumar", email: "qurksuman@gmail.com", password: "Admin@Suman" });
  await admin.save();
  console.log("Admin created!");
  process.exit();
};

seed();
