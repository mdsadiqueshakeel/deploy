// src/index.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
// income-service/index.js
const cookieParser = require("cookie-parser");


dotenv.config();
const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());



app.use("/", require("./routes/businessRoutes"));
app.use("/api/income", require("./routes/incomeRoutes"));

app.get("/ping", (req, res) => res.send("💸 Income Service is Alive"));

const PORT = process.env.PORT || 5004;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Income Service DB Connected");
    app.listen(PORT, () => console.log(`💸 Income Service running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ DB connection failed", err));
