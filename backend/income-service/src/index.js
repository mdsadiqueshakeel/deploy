// src/index.js
const dotenv = require("dotenv");
// Load the default .env file directly
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// income-service/index.js
const cookieParser = require("cookie-parser");
const cron = require("node-cron");

const { resetAllCarryMatchedToday } = require("./utils/resetCarryForNewDay");

dotenv.config();
const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`📝 ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  console.log(`📝 Request Body:`, req.body);
  next();
});

// Mount routes
app.use("/", require("./routes/businessRoutes"));
app.use("/api/income", require("./routes/incomeRoutes"));
app.use('/test', require('./routes/testRoutes')); // Test routes

// Add a direct route for topup-trigger for testing
const { handleTopupTrigger } = require('./controllers/incomeController');
app.post('/direct-topup-trigger', (req, res) => {
  console.log('🔄 Direct topup-trigger route hit');
  handleTopupTrigger(req, res);
});

app.get("/ping", (req, res) => res.send("💸 Income Service is Alive"));

cron.schedule("0 0 * * *", async () => {
  console.log("🌅 Running midnight carry reset cron...");
  await resetAllCarryMatchedToday();
}, {
  timezone: "Asia/Kolkata"
});

const PORT = process.env.PORT || 5004;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000, // 
  })
  .then(() => {
    console.log("✅ Income Service DB Connected");
    app.listen(PORT, () =>
      console.log(`💸 Income Service running on port ${PORT}`)
    );
  })
  .catch((err) => console.error("❌ DB connection failed", err));
