const express = require("express");
const router = express.Router();
const { validateReferralCode } = require("../controllers/referral");

router.get("/validate/:referralCode", validateReferralCode);

module.exports = router;