const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth");
const wrapAsync = require("../utils/wrapAsync");
const jwtAuth = require("../middlewares/jwtAuth");
// forgotPassword and resetPassword functions are imported from the auth controller
// to handle password reset functionality
const { forgotPassword, resetPassword } = require("../controllers/auth");

router.post("/register", wrapAsync(auth.register));
router.post("/login", wrapAsync(auth.login));
router.post('/auth/forgot-password', wrapAsync(auth.forgotPassword));
router.put('/profile', jwtAuth, wrapAsync(auth.updateProfile));
router.put('/change-password', jwtAuth, wrapAsync(auth.changePassword));


router.get("/me", jwtAuth, wrapAsync(auth.getProfile));

module.exports = router;
