const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth");
const wrapAsync = require("../utils/wrapAsync");

router.get("/validate/:code", wrapAsync(auth.validateReferral));

module.exports = router;