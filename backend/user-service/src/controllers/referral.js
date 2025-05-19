const User = require('../models/User');
const crypto = require('crypto');

// Generate Referral Code (called during signup in auth.js)
exports.generateReferralCode = () => {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};

// Validate Referral Code
exports.validateReferralCode = async (req, res) => {
  try {
    const { referralCode } = req.params;
    const user = await User.findOne({ referralCode });
    if (!user) {
      return res.status(404).json({ message: 'Invalid referral code' });
    }
    res.json({ valid: true, sponsorId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};