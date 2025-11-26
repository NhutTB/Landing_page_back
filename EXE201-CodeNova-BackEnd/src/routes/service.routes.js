const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/service.controller");

// Route này dành cho các service nội bộ (như Python Backend) gọi
router.post("/deduct-credits", serviceController.deductCredits);

module.exports = router;