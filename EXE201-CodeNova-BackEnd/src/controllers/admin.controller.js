// File: src/controllers/admin.controller.js
const { poolPromise, sql } = require("../utils/db");
const { success, error } = require("../utils/response");

/**
 * @desc    Lấy dữ liệu Dashboard cho Admin
 * @route   GET /api/admin/dashboard-stats
 * @access  Private/Admin
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const pool = await poolPromise;
    // Lấy ngày hôm nay (YYYY-MM-DD) theo giờ server
    const today = new Date().toISOString().split('T')[0];

    // 1. Truy vấn Thống kê Doanh thu & User
    // Lưu ý: CAST(created_at AS DATE) hoặc CONVERT(date, created_at) tùy phiên bản SQL Server
    const statsResult = await pool.request()
      .input('today', sql.Date, today)
      .query(`
        -- Tổng doanh thu (chỉ tính giao dịch success)
        SELECT 
            SUM(CASE WHEN status = 'success' THEN amount_cents ELSE 0 END) AS totalRevenue,
            SUM(CASE WHEN status = 'success' AND CAST(created_at AS DATE) = @today THEN amount_cents ELSE 0 END) AS todayRevenue,
            SUM(CASE WHEN status = 'success' AND CAST(created_at AS DATE) = @today THEN tokens_granted ELSE 0 END) AS tokensSoldToday
        FROM transactions;

        -- Tổng người dùng & Người dùng mới hôm nay
        SELECT COUNT(id) AS totalUsers FROM users;
        SELECT COUNT(id) AS newUsersToday FROM users WHERE CAST(created_at AS DATE) = @today;

        -- Tổng tokens đang có trong ví (Balance của toàn bộ user)
        SELECT SUM(balance) AS totalWalletBalance FROM tokens_wallets;
      `);
      
    // 2. Truy vấn Dữ liệu Sử dụng (Usage Events)
    const usageResult = await pool.request()
        .input('today', sql.Date, today)
        .query(`
            -- Thống kê hôm nay
            SELECT 
                ISNULL(SUM(tokens_used), 0) AS tokensUsedToday,
                ISNULL(COUNT(id), 0) AS requestsCountToday
            FROM usage_events
            WHERE CAST(created_at AS DATE) = @today;

            -- 7 ngày gần nhất cho biểu đồ
            SELECT 
                CAST(created_at AS DATE) as date,
                ISNULL(SUM(tokens_used), 0) as tokensUsed,
                ISNULL(COUNT(id), 0) as requestsCount
            FROM usage_events
            WHERE created_at >= DATEADD(day, -7, GETDATE())
            GROUP BY CAST(created_at AS DATE)
            ORDER BY date;
        `);

    // Xử lý kết quả trả về từ nhiều câu Select
    const salesStats = statsResult.recordsets[0][0] || {};
    const totalUsers = statsResult.recordsets[1][0]?.totalUsers || 0;
    const newUsersToday = statsResult.recordsets[2][0]?.newUsersToday || 0;
    const totalWalletBalance = statsResult.recordsets[3][0]?.totalWalletBalance || 0;

    const userStats = {
        totalUsers,
        newUsersToday,
        totalWalletBalance,
    };

    const usageStatsToday = usageResult.recordsets[0][0] || {};
    const usageTrend = usageResult.recordsets[1] || [];
    
    // Tính toán trung bình (Tránh chia cho 0)
    const requestsCountToday = usageStatsToday.requestsCountToday;
    const avgTokenPerRequest = requestsCountToday > 0 
        ? (usageStatsToday.tokensUsedToday / requestsCountToday)
        : 0;

    const data = {
        sales: salesStats,
        users: userStats,
        usage: {
            tokensUsedToday: usageStatsToday.tokensUsedToday,
            requestsCountToday: requestsCountToday,
            avgTokenPerRequest: avgTokenPerRequest.toFixed(2),
            trend: usageTrend,
        }
    };

    success(res, data, "Lấy dữ liệu dashboard thành công");

  } catch (err) {
    console.error("❌ Lỗi lấy Dashboard Admin:", err);
    error(res, 500, err.message);
  }
};