const { poolPromise, sql } = require("../utils/db");
const { success, error } = require("../utils/response");

// Hàm phụ trợ: Kiểm tra và cộng 50 credit hàng ngày
async function checkAndGrantDailyBonus(userId, pool) {
  try {
    // 1. Lấy thông tin ví
    const walletRes = await pool.request()
      .input("user_id", sql.UniqueIdentifier, userId)
      .query("SELECT balance, last_daily_bonus FROM tokens_wallets WHERE user_id = @user_id");

    let currentBalance = 0;
    let lastBonus = null;

    if (walletRes.recordset.length > 0) {
      currentBalance = walletRes.recordset[0].balance;
      lastBonus = walletRes.recordset[0].last_daily_bonus;
    }

    // 2. Kiểm tra xem hôm nay đã nhận chưa
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Lấy 00:00 hôm nay
    
    let alreadyReceived = false;
    if (lastBonus) {
      const lastDate = new Date(lastBonus);
      const lastBonusDay = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
      // So sánh ngày
      if (lastBonusDay.getTime() === today.getTime()) {
        alreadyReceived = true;
      }
    }

    // 3. Nếu chưa nhận thì cộng 50 credit
    if (!alreadyReceived) {
      const BONUS_AMOUNT = 50;
      await pool.request()
        .input("user_id", sql.UniqueIdentifier, userId)
        .input("bonus", sql.BigInt, BONUS_AMOUNT)
        .query(`
          MERGE tokens_wallets AS target
          USING (SELECT @user_id AS user_id) AS source
          ON (target.user_id = source.user_id)
          WHEN MATCHED THEN
            UPDATE SET 
              balance = balance + @bonus,
              last_daily_bonus = SYSDATETIMEOFFSET(),
              updated_at = SYSDATETIMEOFFSET()
          WHEN NOT MATCHED THEN
            INSERT (user_id, balance, last_daily_bonus, updated_at)
            VALUES (@user_id, @bonus, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
        `);
      console.log(`🎁 User ${userId} received daily bonus: 50 credits`);
      return true; // Có cộng tiền
    }
    return false; // Không cộng
  } catch (err) {
    console.error("⚠️ Lỗi check daily bonus (Bỏ qua để không chặn app):", err.message);
    return false;
  }
}

exports.getProfile = async (req, res) => {
  try {
    const pool = await poolPromise;
    const userId = req.user.id; // Lấy ID từ token đã giải mã

    // Cố gắng cộng thưởng hàng ngày, nếu lỗi thì bỏ qua để vẫn hiện profile
    await checkAndGrantDailyBonus(userId, pool);

    // 🚀 SỬA ĐỔI: Dùng JOIN trực tiếp thay vì View để tránh lỗi SQL
    const result = await pool.request()
      .input("id", sql.UniqueIdentifier, userId)
      .query(`
        SELECT 
            u.id as user_id,
            u.email,
            u.display_name,
            u.avatar_url as current_avatar_url,
            u.created_at as user_created_at,
            
            -- Lấy từ bảng settings
            ups.nickname,
            ups.bio,
            ups.show_email,
            ups.show_online_status,
            ups.language_preference,
            ups.theme_preference,
            
            -- Lấy số dư từ ví (quan trọng)
            ISNULL(tw.balance, 0) as credit_balance

        FROM users u
        LEFT JOIN user_profile_settings ups ON u.id = ups.user_id
        LEFT JOIN tokens_wallets tw ON u.id = tw.user_id
        WHERE u.id = @id
    `);

    if (result.recordset.length === 0) {
       return error(res, 404, "Không tìm thấy người dùng trong DB");
    }

    const userRecord = result.recordset[0];

    // Chuẩn hóa dữ liệu trả về
    const profileData = {
        ...userRecord,
        // Ưu tiên nickname, nếu không có thì dùng display_name
        display_name: userRecord.nickname || userRecord.display_name || userRecord.email
    };
      
    success(res, profileData, "Lấy profile thành công");
  } catch (err) {
    console.error("❌ Lỗi API getProfile:", err);
    error(res, 500, "Lỗi Server khi lấy thông tin tài khoản: " + err.message);
  }
};

// ========== CẬP NHẬT PROFILE ==========
exports.updateProfile = async (req, res) => {
  const { bio } = req.body;
  const userId = req.user.id;

  try {
    const pool = await poolPromise;
    
    await pool.request()
      .input("id", sql.UniqueIdentifier, userId)
      .input("bio", sql.NVarChar, bio)
      .query(`
        IF EXISTS (SELECT 1 FROM user_profile_settings WHERE user_id = @id)
          UPDATE user_profile_settings
          SET 
            bio = @bio,
            updated_at = SYSDATETIMEOFFSET()
          WHERE user_id = @id
        ELSE
          INSERT INTO user_profile_settings (user_id, bio, updated_at)
          VALUES (@id, @bio, SYSDATETIMEOFFSET())
      `);
      
    res.json({ success: true, message: "Cập nhật profile thành công" });
    
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật profile:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
};

// ========== ĐỔI EMAIL ==========
exports.changeEmail = async (req, res) => {
  const { new_email } = req.body;
  if (!new_email) return res.status(400).json({ error: "Thiếu email mới" });

  try {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.UniqueIdentifier, req.user.id)
      .input("new_email", sql.NVarChar, new_email)
      .query(`
        UPDATE users
        SET email = @new_email,
            updated_at = SYSDATETIMEOFFSET()
        WHERE id = @id
      `);
    res.json({ success: true, message: "Đổi email thành công" });
  } catch (err) {
    console.error("❌ Lỗi khi đổi email:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
};