// File: src/controllers/auth.controller.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { poolPromise, sql } = require("../utils/db"); // 🚀 Import sql

exports.register = async (req, res) => {
  const { email, password, display_name } = req.body;
  const final_display_name = display_name || email.split('@')[0];

  let pool; // Khai báo pool ở ngoài
  let transaction; // Khai báo transaction
  
  try {
    pool = await poolPromise;
    transaction = new sql.Transaction(pool); // 🚀 Bắt đầu transaction
    
    await transaction.begin();

    // 1. Kiểm tra email trùng
    const check = await transaction.request() // Dùng transaction.request()
      .input("email", email)
      .query("SELECT id FROM users WHERE email = @email");
      
    if (check.recordset.length > 0) {
      // (Không cần rollback vì chưa làm gì)
      return res.status(400).json({ error: "Email has been registered" });
    }

    const hash = await bcrypt.hash(password, 10);
    
    // 2. Insert vào [users]
    const userResult = await transaction.request() // Dùng transaction.request()
      .input("email", email)
      .input("display_name", final_display_name)
      .query(`
        INSERT INTO users (email, display_name)
        OUTPUT inserted.id
        VALUES (@email, @display_name)
      `);
    const userId = userResult.recordset[0].id;

    // 3. Insert vào [auth_providers]
    await transaction.request() // Dùng transaction.request()
      .input("user_id", userId)
      .input("provider", "local")
      .input("password_hash", hash)
      .query(`
        INSERT INTO auth_providers (user_id, provider, password_hash)
        VALUES (@user_id, @provider, @password_hash)
      `);
    await transaction.request() // Dùng transaction.request()
      .input("user_id", userId)
      .input("role_id", 2) // 2 = 'user'
      .query("INSERT INTO user_roles (user_id, role_id) VALUES (@user_id, @role_id)");

    await transaction.request() 
      .input("user_id", userId)
      .input("nickname", final_display_name)
      .query(`
        INSERT INTO user_profile_settings (user_id, nickname, updated_at) 
        VALUES (@user_id, @nickname, SYSDATETIMEOFFSET())
      `);
    await transaction.commit();
    
    res.json({ message: "Registered successfully" });
    
  } catch (err) {
    console.error("❌ Error during registration:", err);
    if (transaction) {
      await transaction.rollback();
    }
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const pool = await poolPromise;
    
    // === (PHẦN SỬA LỖI Ở ĐÂY) ===
    // Phải JOIN 3 bảng để lấy được tên role
    const user = await pool.request()
      .input("email", email)
      .query(`
        SELECT 
          u.id, 
          u.email, 
          u.display_name, 
          a.password_hash,
          r.name AS role 
        FROM users u
        JOIN auth_providers a ON a.user_id = u.id
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        LEFT JOIN roles r ON ur.role_id = r.id
        WHERE u.email = @email AND a.provider = 'local'
      `);
    // === (KẾT THÚC PHẦN SỬA) ===

    if (user.recordset.length === 0)
      return res.status(400).json({ error: "Email is not registered" });
    
    const row = user.recordset[0];
    const valid = await bcrypt.compare(password, row.password_hash);
    if (!valid) return res.status(401).json({ error: "Incorrect password" });
    
    const token = jwt.sign(
      { id: row.id, email: row.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    await pool.request()
      .input("user_id", row.id)
      .input("session_token", token)
      .query(`
        INSERT INTO sessions (user_id, session_token)
        VALUES (@user_id, @session_token)
      `);
      
    // Trả về role cho frontend
    res.json({
      message: "Login successful",
      token,
      user: { 
        id: row.id, 
        email: row.email, 
        display_name: row.display_name, 
        role: row.role // <-- Phải thêm 'role: row.role' ở đây
      }
    });
  } catch (err) {
    console.error("❌ Error during login:", err);
    res.status(500).json({ error: err.message });
  }
};