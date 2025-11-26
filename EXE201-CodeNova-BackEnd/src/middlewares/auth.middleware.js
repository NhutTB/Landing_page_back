// File: src/middlewares/auth.middleware.js
const jwt = require("jsonwebtoken");
const { poolPromise, sql } = require("../utils/db"); // 🚀 Import sql

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 1. Lấy token từ header
      token = req.headers.authorization.split(" ")[1];
      
      // 2. Xác thực token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // 3. 🚀 LẤY THÔNG TIN USER TỪ DB (BAO GỒM CẢ ROLE)
      const pool = await poolPromise;
      const result = await pool.request()
        .input("id", sql.UniqueIdentifier, decoded.id) // 🚀 Dùng kiểu dữ liệu SQL
        .query(`
          SELECT 
            u.id, 
            u.email, 
            u.display_name, 
            u.avatar_url,
            r.name AS role 
          FROM users u
          LEFT JOIN user_roles ur ON u.id = ur.user_id
          LEFT JOIN roles r ON ur.role_id = r.id
          WHERE u.id = @id
        `);

      if (!result.recordset[0]) {
        // Nếu user đã bị xóa khỏi DB nhưng token vẫn còn hạn
        return res.status(401).json({ error: "User not found" });
      }
      
      // 4. Gán thông tin user (với role) vào req
      req.user = result.recordset[0];
      next();
      
    } catch (error) {
      // Bắt lỗi nếu token hết hạn hoặc không hợp lệ
      console.error(error);
      res.status(401).json({ error: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ error: "Not authorized, no token" });
  }
};

// 🚀 TẠO MIDDLEWARE MỚI ĐỂ KIỂM TRA ADMIN
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: "Access denied. Admin role required." });
  }
};