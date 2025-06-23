const express = require("express");
const router = express.Router();
const { getBusinessReport } = require("../controllers/buisnessController");

router.get("/business/:userId", getBusinessReport);

module.exports = router;
