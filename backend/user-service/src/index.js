require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser()); 

app.use((err, req, res, next) => {
  console.error("ERROR:", err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo connected"))
  .catch((err) => console.error("Mongo error:", err));

app.use("/api/auth", require("./routes/auth"));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`User Service running on ${PORT}`));
