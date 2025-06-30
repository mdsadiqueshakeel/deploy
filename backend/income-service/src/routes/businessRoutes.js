const express = require("express");
const router = express.Router();
const { getBusinessReport } = require("../controllers/buisnessController");
const { cacheMiddleware } = require("../middlewares/cache");

router.get("/business/:userId", cacheMiddleware, getBusinessReport);

module.exports = router;
