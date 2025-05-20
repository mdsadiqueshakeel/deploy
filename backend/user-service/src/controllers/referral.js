const User = require('../models/User');
// Generate Referral Code (called during signup in auth.js)

// Validate Referral Code
exports.validateReferralCode = async (req, res) => {
  try {
    const { referralCode } = req.params;

    const user = await User.findOne({
      $or: [
        { referralCode },
        { referralCodeLeft: referralCode },
        { referralCodeRight: referralCode }
      ]
    });

    if (!user) {
      return res.status(404).json({ valid: false, message: "Invalid referral code" });
    }

    let codeType = '';
    if (user.referralCode === referralCode) codeType = 'direct';
    else if (user.referralCodeLeft === referralCode) codeType = 'left';
    else if (user.referralCodeRight === referralCode) codeType = 'right';

    return res.json({
      valid: true,
      usedBy: user._id,
      name: user.name,
      type: codeType // 'direct', 'left', or 'right'
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
