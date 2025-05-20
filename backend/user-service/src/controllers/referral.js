const User = require('../models/User');
// Generate Referral Code (called during signup in auth.js)

// Validate Referral Code
exports.validateReferralCode = async (req, res) => {
  try {
    const { referralCode } = req.params;

    const user = await User.findOne({
      $or: [
        { referralCodeLeft: referralCode },
        { referralCodeRight: referralCode }
      ]
    });

    if (!user) return res.status(404).json({ valid: false, message: "Invalid referral code" });

    return res.json({ valid: true, parentId: user._id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
