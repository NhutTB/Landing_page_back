const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const { createMomoPayment, handleMomoIPN } = require("../controllers/payment.controller");

const router = express.Router();

// Frontend gọi URL này (cần xác thực)
router.post("/create-momo-link", protect, createMomoPayment);

// MoMo Server gọi URL này (không cần xác thực)
router.post("/momo-ipn", handleMomoIPN);

module.exports = router;