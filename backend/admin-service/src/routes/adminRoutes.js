const express = require("express");
const router = express.Router();
const controller = require("../controllers/adminController");
const adminAuth = require("../middlewares/adminAuth");
const wrapAsync = require("../utils/wrapAsync");
const { cacheMiddleware } = require("../middlewares/cache");

router.post("/login", wrapAsync(controller.login));
router.put("/change-password", adminAuth, wrapAsync(controller.changePassword));
router.get("/users", adminAuth,cacheMiddleware, wrapAsync(controller.getAllUsers));
router.get("/user/:id", adminAuth,cacheMiddleware, wrapAsync(controller.getSingleUser));
router.get("/dashboard", adminAuth,cacheMiddleware, wrapAsync(controller.getDashboardStats));
router.get("/me", adminAuth, wrapAsync(controller.getProfile));
router.get("/verify", adminAuth, wrapAsync(controller.verifyAdmin));

module.exports = router; 
