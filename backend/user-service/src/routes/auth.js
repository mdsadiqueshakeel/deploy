const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth");
const wrapAsync = require("../utils/wrapAsync");
const jwtAuth = require("../middlewares/jwtAuth");

router.post("/register", wrapAsync(auth.register));
router.post("/login", wrapAsync(auth.login));
router.post('/forgot-password', wrapAsync(auth.forgotPassword));
router.post('/reset-password', wrapAsync(auth.resetPassword));

router.get("/me", jwtAuth, wrapAsync(auth.getProfile));

module.exports = router;
