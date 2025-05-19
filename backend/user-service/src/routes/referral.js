const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referral');

router.get('/validate/:referralCode', wrapAsync(referralController.validateReferralCode));

module.exports = router;