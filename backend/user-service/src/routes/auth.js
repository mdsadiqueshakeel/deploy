const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth");
const wrapAsync = require("../utils/wrapAsync");

router.post("/login", wrapAsync(auth.login));
router.post("/register", wrapAsync(auth.register));

module.exports = router;
