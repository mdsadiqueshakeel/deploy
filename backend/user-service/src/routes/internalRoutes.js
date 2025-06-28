// ✅ user-service/src/routes/internalRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { updateStatus } = require("../controllers/internalController");

// GET user by ID (already used by income-service)
router.get("/internal/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔁 PUT: update carry forward data from income-service
router.put("/update-carry/:id", async (req, res) => {
  try {
    const { leftCarry, rightCarry } = req.body;
    const update = {};
    if (leftCarry !== undefined) update.leftCarry = leftCarry;
    if (rightCarry !== undefined) update.rightCarry = rightCarry;

    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Carry updated", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/activate-user/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        isActive: true,
        status: "Consumer", // 🆕 set default status
      },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User activated and status set to Consumer", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put("/internal/update-status", updateStatus);



module.exports = router;
