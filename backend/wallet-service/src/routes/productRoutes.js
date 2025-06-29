const express = require("express");
const router = express.Router();

const {
  requestProduct,
  approvePurchase,
  rejectPurchase,
  getMyPurchases,
  getAllPurchases,
} = require("../controllers/purchaseController");

const { isAuthenticated, isAdmin, extractUser } = require("../middlewares/auth");

router.use(extractUser);

// ✅ USER ROUTES
router.post("/request" ,isAuthenticated, requestProduct);
router.get("/my-purchases", isAuthenticated, getMyPurchases);

// ✅ ADMIN ROUTES
// router.get("/admin", isAuthenticated, isAdmin, getAllPurchases);
router.patch("/admin/:purchaseId/approve", isAuthenticated, isAdmin, approvePurchase);
router.patch("/admin/:purchaseId/reject", isAuthenticated, isAdmin, rejectPurchase);

module.exports = router;
