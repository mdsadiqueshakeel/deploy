const PRODUCT_LIST = require("../Constraints/ProductList");
const Purchase = require("../models/Purchase");
const { getWalletByUserId, deductFromWallet } = require("../utils/WalletService");

// 📦 USER: Request product
exports.requestProduct = async (req, res) => {
  const { productCode, quantity } = req.body;
  const userId = req.user._id;

  if (!productCode || !quantity || quantity <= 0) {
    return res.status(400).json({ message: "Invalid product or quantity" });
  }

  const product = PRODUCT_LIST.find(p => p.productCode === productCode);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const totalPrice = product.dp * quantity;

  const wallet = await getWalletByUserId(userId);
  if (!wallet || wallet.topupWallet < totalPrice) {
    return res.status(400).json({ message: "Insufficient balance in top-up wallet" });
  }

  const purchase = await Purchase.create({
    userId,
    productCode,
    productName: product.name,
    quantity,
    unitPrice: product.dp,
    totalPrice,
    status: "pending",
  });

  res.status(201).json({ message: "Product request submitted", purchase });
};

// User: Get my purchases
exports.getMyPurchases = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const purchases = await Purchase.find({ 
      userId,
      status: "approved" // ✅ only show actual completed orders
    }).sort({ createdAt: -1 });

    res.json({ purchases });
  } catch (err) {
    next(err);
  }
};



// ✅ ADMIN: Approve request
exports.approvePurchase = async (req, res, next) => {
  try {
    const { purchaseId } = req.params;

    const purchase = await Purchase.findById(purchaseId);
    if (!purchase) return res.status(404).json({ message: "Purchase not found" });
    if (purchase.status !== "pending") {
      return res.status(400).json({ message: "Already approved/rejected" });
    }

    const wallet = await getWalletByUserId(purchase.userId);
    if (!wallet || wallet.topupWallet < purchase.totalPrice) {
      return res.status(400).json({ message: "User does not have enough top-up balance" });
    }

    // Deduct from top-up wallet
    await deductFromWallet(purchase.userId, "topupWallet", purchase.totalPrice);

    purchase.status = "approved";
    purchase.approvedAt = new Date();
    await purchase.save();

    res.json({ message: "Purchase approved", purchase });
  } catch (err) {
    next(err);
  }
};

exports.rejectPurchase = async (req, res, next) => {
  try {
    const { purchaseId } = req.params;

    const purchase = await Purchase.findById(purchaseId);
    if (!purchase) return res.status(404).json({ message: "Purchase not found" });

    if (purchase.status !== "pending") {
      return res.status(400).json({ message: "Already approved/rejected" });
    }

    purchase.status = "rejected";
    purchase.rejectedAt = new Date();
    await purchase.save();

    res.json({ message: "Purchase request rejected", purchase });
  } catch (err) {
    next(err);
  }
};

