const express = require("express");
const router = express.Router();
const controller = require("../controllers/adminUserController");
const wrapAsync = require("../utils/wrapAsync");
const { cacheMiddleware } = require("../middlewares/cache");

router.get("/users", cacheMiddleware, wrapAsync(controller.getAllUsers));
router.get("/user/:id", cacheMiddleware, wrapAsync(controller.getSingleUser));
router.delete("/delete-user/:id", wrapAsync(controller.adminDeleteUser));


module.exports = router;
