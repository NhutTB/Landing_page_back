// File: src/controllers/payment.controller.js
const { poolPromise, sql } = require("../utils/db");
const { createPaymentRequest, verifyIPNSignature } = require("../utils/momo.service");
const { v4: uuidv4 } = require('uuid');

// Địa chỉ frontend của bạn
const FRONTEND_URL = "http://localhost:5173";
const definedPlans = {
  "CREDIT_50": [20000, 50],
  "CREDIT_200": [70000, 200],
  "CREDIT_500": [150000, 500],
  "CREDIT_1000": [250000, 1000],
};

/**
 * Xử lý yêu cầu tạo link thanh toán MoMo từ Frontend
 */
exports.createMomoPayment = async (req, res) => {
  try {
    const { packageId } = req.body;
    const userId = req.user.id;

    if (!packageId || !definedPlans[packageId]) {
      return res.status(400).json({ error: "Gói dịch vụ không hợp lệ." });
    }

    const [correctAmount, tokensGranted] = definedPlans[packageId];
    const orderId = uuidv4();
    const orderInfo = `Mua ${tokensGranted} credits`;
    // Metadata để IPN xử lý
    const metadata = JSON.stringify({ packageId, userId });
    const pool = await poolPromise;

    // 1. Lưu giao dịch PENDING vào DB
    await pool.request()
      .input("id", sql.UniqueIdentifier, orderId)
      .input("user_id", sql.UniqueIdentifier, userId)
      .input("type", sql.NVarChar, "purchase")
      .input("provider", sql.NVarChar, "momo")
      .input("amount_cents", sql.BigInt, correctAmount)
      .input("currency", sql.NVarChar, "VND")
      .input("tokens_granted", sql.BigInt, tokensGranted)
      .input("status", sql.NVarChar, "pending")
      .input("metadata", sql.NVarChar, metadata)
      .query(`
        INSERT INTO transactions (id, user_id, type, provider, amount_cents, currency, tokens_granted, status, metadata)
        VALUES (@id, @user_id, @type, @provider, @amount_cents, @currency, @tokens_granted, @status, @metadata)
      `);

    // 2. Cấu hình URL trả về
    // Lưu ý: RedirectURL này dùng để browser chuyển hướng, cần là public IP hoặc localhost nếu chạy local
    const redirectUrl = process.env.MOMO_REDIRECT_URL || `${FRONTEND_URL}/payment-result`;

    // QUAN TRỌNG: Kiểm tra cấu hình MoMo
    const ipnUrl = process.env.MOMO_IPN_URL;
    if (!ipnUrl) throw new Error("Thiếu cấu hình MOMO_IPN_URL trong .env");
    if (!process.env.MOMO_PARTNER_CODE) throw new Error("Thiếu cấu hình MOMO_PARTNER_CODE trong .env");
    if (!process.env.MOMO_ACCESS_KEY) throw new Error("Thiếu cấu hình MOMO_ACCESS_KEY trong .env");
    if (!process.env.MOMO_SECRET_KEY) throw new Error("Thiếu cấu hình MOMO_SECRET_KEY trong .env");
    if (!process.env.MOMO_API_ENDPOINT) throw new Error("Thiếu cấu hình MOMO_API_ENDPOINT trong .env");

    // 3. Gọi MoMo Service
    const momoResponse = await createPaymentRequest(
      orderId,
      correctAmount.toString(),
      orderInfo,
      redirectUrl,
      ipnUrl
    );

    if (momoResponse && momoResponse.payUrl) {
      // Trả về payUrl (để tạo QR) và qrCodeUrl (nếu MoMo có trả về sẵn)
      res.json({
        payUrl: momoResponse.payUrl,
        deeplink: momoResponse.deeplink,
        qrCodeUrl: momoResponse.qrCodeUrl // Đôi khi MoMo trả về link ảnh QR
      });
    } else {
      throw new Error(momoResponse.message || "Lỗi tạo link thanh toán MoMo");
    }

  } catch (err) {
    console.error("❌ Error createMomoPayment:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Xử lý Webhook (IPN) từ MoMo (Server-to-Server)
 */
exports.handleMomoIPN = async (req, res) => {
  let ipnData = req.body;

  // KIỂM TRA: Dữ liệu IPN phải được gửi trong req.body (POST).
  if (!ipnData || Object.keys(ipnData).length === 0) {
    console.warn("⚠️ Cảnh báo: Request IPN không có body.");
    return res.status(204).send();
  }

  // 1. Xác thực chữ ký
  const isValid = verifyIPNSignature(ipnData);
  if (!isValid) {
    console.warn("⚠️ Cảnh báo: Chữ ký IPN từ MoMo không hợp lệ!", ipnData);
    // Để tránh MoMo spam lại khi ta đang debug, tạm thời trả về 204.
    // Trong production nên log kỹ và có thể trả 204 để ignore request rác.
    return res.status(204).send();
  }

  // Phân biệt loại IPN: Thanh toán hay Liên kết ví
  if (ipnData.orderType === 'momo_wallet_linking') {
    return handleWalletLinkingIPN(ipnData, res);
  } else {
    return handlePaymentIPN(ipnData, res);
  }
};

/**
 * Xử lý IPN cho giao dịch THANH TOÁN
 */
const handlePaymentIPN = async (ipnData, res) => {
  const { orderId, amount, resultCode, message } = ipnData;
  console.log(`🔔 Nhận được IPN từ MoMo cho Order [${orderId}], Result: ${resultCode} - ${message}`);

  try {
    const pool = await poolPromise;

    // 2. Lấy thông tin giao dịch từ CSDL
    const transactionResult = await pool.request()
      .input("orderId", sql.UniqueIdentifier, orderId)
      .query("SELECT user_id, tokens_granted, status FROM transactions WHERE id = @orderId");

    if (!transactionResult.recordset[0]) {
      throw new Error(`Không tìm thấy Order [${orderId}] trong CSDL.`);
    }

    const transaction = transactionResult.recordset[0];

    // 3. Chống trùng lặp (Idempotency)
    if (transaction.status === 'success') {
      console.warn(`⚠️ Giao dịch [${orderId}] đã được xử lý trước đó. Bỏ qua.`);
      return res.status(204).send();
    }

    if (resultCode == 0) { // resultCode có thể là số hoặc chuỗi '0'
      // 4. Thanh toán THÀNH CÔNG
      console.log(`✅ Thanh toán thành công cho Order [${orderId}]. Số tiền: ${amount}`);

      const userId = transaction.user_id;
      const tokensToAdd = transaction.tokens_granted;

      if (!tokensToAdd) {
        throw new Error(`Giao dịch [${orderId}] không có tokens_granted.`);
      }

      // 4.1: Cập nhật trạng thái Payment -> 'success'
      // 🚀 FIX LỖI Ở ĐÂY: Ép kiểu transId sang String
      const transIdString = ipnData.transId ? String(ipnData.transId) : null;

      await pool.request()
        .input("status", sql.NVarChar, "success")
        .input("provider_tx_id", sql.NVarChar, transIdString) // Đã ép kiểu String
        .input("orderId", sql.UniqueIdentifier, orderId)
        .query("UPDATE transactions SET status = @status, provider_tx_id = @provider_tx_id WHERE id = @orderId");

      // 4.2: Cộng token vào ví của user
      await pool.request()
        .input("user_id", sql.UniqueIdentifier, userId)
        .input("tokensToAdd", sql.BigInt, tokensToAdd)
        .query(`
          IF EXISTS (SELECT 1 FROM tokens_wallets WHERE user_id = @user_id)
            UPDATE tokens_wallets 
            SET balance = balance + @tokensToAdd, updated_at = SYSDATETIMEOFFSET() 
            WHERE user_id = @user_id
          ELSE
            INSERT INTO tokens_wallets (user_id, balance, updated_at) 
            VALUES (@user_id, @tokensToAdd, SYSDATETIMEOFFSET())
        `);

      console.log(`🎉 Đã cộng ${tokensToAdd} tokens cho User [${userId}]`);

    } else {
      // 5. Thanh toán THẤT BẠI/BỊ HỦY
      console.warn(`⚠️ Thanh toán thất bại cho Order [${orderId}]. Lý do: ${message} (Code: ${resultCode})`);

      const transIdString = ipnData.transId ? String(ipnData.transId) : null;

      await pool.request()
        .input("status", sql.NVarChar, "failed")
        .input("provider_tx_id", sql.NVarChar, transIdString)
        .input("orderId", sql.UniqueIdentifier, orderId)
        .query("UPDATE transactions SET status = @status, provider_tx_id = @provider_tx_id WHERE id = @orderId");
    }

    // 6. Phản hồi cho MoMo
    res.status(204).send();

  } catch (err) {
    console.error("❌ Lỗi khi xử lý IPN:", err);
    res.status(500).json({ resultCode: 500, message: "Server Error" });
  }
};

/**
 * Xử lý IPN cho sự kiện LIÊN KẾT VÍ
 */
const handleWalletLinkingIPN = async (ipnData, res) => {
  const { partnerClientId, resultCode, message, momoTransId } = ipnData;
  console.log(`🔔 Nhận được IPN Liên kết ví cho User [${partnerClientId}], Result: ${resultCode} - ${message}`);

  try {
    if (resultCode == 0) {
      // Liên kết thành công
      console.log(`✅ Liên kết ví thành công cho User [${partnerClientId}]. MomoTransId: ${momoTransId}`);

      // TODO: Lưu trạng thái đã liên kết ví cho người dùng trong CSDL
      // Ví dụ: tìm user bằng `partnerClientId` (email/userId) và cập nhật một trường như `momo_linked = true`
      /*
      const pool = await poolPromise;
      await pool.request()
        .input("email", sql.NVarChar, partnerClientId)
        .query("UPDATE users SET is_momo_linked = 1, momo_trans_id = @momoTransId WHERE email = @email");
      */
    } else {
      // Liên kết thất bại
      console.warn(`⚠️ Liên kết ví thất bại cho User [${partnerClientId}]. Lý do: ${message}`);
    }

    res.status(204).send();
  } catch (err) {
    console.error("❌ Lỗi khi xử lý IPN liên kết ví:", err);
    res.status(500).json({ resultCode: 500, message: "Server Error" });
  }
};