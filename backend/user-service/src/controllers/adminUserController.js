const User = require("../models/User");

// 🔁 GET /api/admin/users - List all users (name, email, phone only)
exports.getAllUsers = async (req, res) => {
  const users = await User.find({}, "name email phone");
  res.json(users);
};

// 👤 GET /api/admin/user/:id - Full user details
exports.getSingleUser = async (req, res) => {
  const user = await User.findById(req.params.id).select(
    "-password -resetPasswordToken -resetPasswordExpires"
  ).populate("parentId", "name email")
   .populate("leftUser rightUser", "name email");

  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};
