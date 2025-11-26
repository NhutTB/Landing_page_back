// File: src/routes/admin.routes.js
const express = require("express");
const { protect, isAdmin } = require("../middlewares/auth.middleware");
const { getDashboardStats } = require("../controllers/admin.controller");

const router = express.Router();

// Chỉ Admin mới được truy cập API này
// protect: Yêu cầu phải đăng nhập (có Token)
// isAdmin: Yêu cầu role phải là 'admin'
router.get("/dashboard-stats", protect, isAdmin, getDashboardStats);

module.exports = router;