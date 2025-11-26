const { poolPromise, sql } = require("../utils/db");

// API trừ credit (Dành cho Python Backend gọi)
exports.deductCredits = async (req, res) => {
  const { user_id, amount, description } = req.body;

  try {
    const pool = await poolPromise;
    
    // 1. Kiểm tra số dư hiện tại
    const balanceResult = await pool.request()
      .input("user_id", sql.UniqueIdentifier, user_id)
      .query("SELECT balance FROM tokens_wallets WHERE user_id = @user_id");
      
    // Nếu chưa có ví, coi như balance = 0
    const currentBalance = balanceResult.recordset[0]?.balance || 0;
    
    if (currentBalance < amount) {
      return res.status(402).json({ 
        success: false, 
        error: "Không đủ credit. Vui lòng nạp thêm.", 
        currentBalance 
      });
    }

    // 2. Bắt đầu Transaction để trừ tiền và lưu lịch sử
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      // Trừ tiền trong ví
      await transaction.request()
        .input("user_id", sql.UniqueIdentifier, user_id)
        .input("amount", sql.BigInt, amount)
        .query(`
          UPDATE tokens_wallets 
          SET balance = balance - @amount, updated_at = SYSDATETIMEOFFSET() 
          WHERE user_id = @user_id
        `);

      // Lưu lịch sử sử dụng (usage_events)
      await transaction.request()
        .input("user_id", sql.UniqueIdentifier, user_id)
        .input("event_type", sql.NVarChar, "translation_extension")
        .input("tokens_used", sql.BigInt, amount)
        .input("metadata", sql.NVarChar, JSON.stringify({ description: description || "Dịch qua Extension" }))
        .query(`
          INSERT INTO usage_events (user_id, event_type, tokens_used, metadata, created_at) 
          VALUES (@user_id, @event_type, @tokens_used, @metadata, SYSDATETIMEOFFSET())
        `);

      await transaction.commit();
      
      console.log(`✅ Đã trừ ${amount} credit của user ${user_id}. Còn lại: ${currentBalance - amount}`);
      res.json({ success: true, remaining: currentBalance - amount });

    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  } catch (err) {
    console.error("❌ Lỗi trừ credit:", err);
    res.status(500).json({ error: err.message });
  }
};