const express = require("express");
const router = express.Router();

const userRoutes = require("./user.routes");
const authRoutes = require("./auth.routes");
const paymentRoutes = require("./payment.routes"); 
const profileRoutes = require("./profile.routes");
const adminRoutes = require("./admin.routes");
const serviceRoutes = require("./service.routes"); // <--- THÊM DÒNG NÀY

router.use("/user", userRoutes);
router.use("/auth", authRoutes);
router.use("/payment", paymentRoutes);
router.use("/profile", profileRoutes);
router.use("/admin", adminRoutes);
router.use("/service", serviceRoutes); // <--- THÊM DÒNG NÀY

module.exports = router;