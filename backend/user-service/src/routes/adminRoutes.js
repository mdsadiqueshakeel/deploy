const express = require("express");
const router = express.Router();
const controller = require("../controllers/adminUserController");
const wrapAsync = require("../utils/wrapAsync");

router.get("/users", wrapAsync(controller.getAllUsers));
router.get("/user/:id", wrapAsync(controller.getSingleUser));

module.exports = router;
