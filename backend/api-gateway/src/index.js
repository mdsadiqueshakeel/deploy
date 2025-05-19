require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cors({
  origin: "http://localhost:3000", // or frontend domain
  credentials: true               // ✅ must be true to allow cookies
}));
app.use(express.json());
app.use(cookieParser());

app.use((err, req, res, next) => {
  console.error("ERROR:", err.message);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// Import route proxies
app.use("/api/auth", require("./routes/auth"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
