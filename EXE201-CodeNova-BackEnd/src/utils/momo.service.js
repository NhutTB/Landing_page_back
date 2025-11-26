const crypto = require('crypto');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const partnerCode = process.env.MOMO_PARTNER_CODE;
const accessKey = process.env.MOMO_ACCESS_KEY;
const secretKey = process.env.MOMO_SECRET_KEY;
const apiEndpoint = process.env.MOMO_API_ENDPOINT;
function createSignature(rawSignature, secretKey) {
  return crypto.createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');
}

exports.createPaymentRequest = async (orderId, amount, orderInfo, redirectUrl, ipnUrl, extraData = "") => {
  const requestId = uuidv4();
  const requestType = "captureWallet";

  const rawSignature = [
    `accessKey=${accessKey}`,
    `amount=${amount}`,
    `extraData=${extraData}`,
    `ipnUrl=${ipnUrl}`,
    `orderId=${orderId}`,
    `orderInfo=${orderInfo}`,
    `partnerCode=${partnerCode}`,
    `redirectUrl=${redirectUrl}`,
    `requestId=${requestId}`,
    `requestType=${requestType}`
  ].join('&');

  const signature = createSignature(rawSignature, secretKey);

  const requestBody = {
    partnerCode,
    accessKey,
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    extraData,
    requestType,
    signature,
    lang: 'vi'
  };

  try {
    const response = await axios.post(apiEndpoint, requestBody);
    return response.data;
  } catch (err) {
    console.error("❌ Lỗi khi tạo yêu cầu thanh toán MoMo:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || 'Không thể kết nối MoMo');
  }
};

/**
 * Tạo yêu cầu liên kết ví MoMo.
 * @param {string} partnerClientId - ID định danh người dùng trên hệ thống của bạn (ví dụ: user ID, email).
 * @param {string} redirectUrl - URL để MoMo chuyển hướng người dùng sau khi liên kết.
 * @param {string} ipnUrl - URL để MoMo gửi thông báo (server-to-server) về kết quả liên kết.
 * @returns {Promise<object>} - Dữ liệu phản hồi từ MoMo.
 */
exports.createWalletLinkRequest = async (partnerClientId, redirectUrl, ipnUrl) => {
  const requestId = uuidv4();
  const orderId = uuidv4(); // MoMo yêu cầu orderId, ta tạo một cái duy nhất
  const requestType = "linkWallet";
  const amount = "0"; // Liên kết ví không tốn phí
  const orderInfo = `Lien ket vi MoMo cho tai khoan ${partnerClientId}`;

  // Thông tin người dùng cần liên kết
  const userInfo = {
    partnerClientAlias: partnerClientId, // Hiển thị cho người dùng trên app MoMo
  };

  // Chuỗi để tạo chữ ký cho request liên kết ví
  // QUAN TRỌNG: Thứ tự các trường phải đúng theo tài liệu của MoMo cho "linkWallet"
  const rawSignature = [
    `accessKey=${accessKey}`,
    `ipnUrl=${ipnUrl}`,
    `orderId=${orderId}`,
    `partnerClientId=${partnerClientId}`,
    `partnerCode=${partnerCode}`,
    `redirectUrl=${redirectUrl}`,
    `requestId=${requestId}`,
    `requestType=${requestType}`,
    `userInfo=${JSON.stringify(userInfo)}`
  ].join('&');

  const signature = createSignature(rawSignature, secretKey);

  const requestBody = {
    partnerCode,
    accessKey,
    requestId,
    orderId,
    ipnUrl,
    redirectUrl,
    partnerClientId,
    requestType,
    userInfo,
    lang: 'vi',
    signature,
  };

  console.log("🚀 Creating MoMo Wallet Link Request:", requestBody);
  return axios.post(apiEndpoint, requestBody).then(res => res.data);
};

exports.verifyIPNSignature = (body) => {
  const { signature } = body;
  if (!signature) {
    return false;
  }

  // 🚀 QUAN TRỌNG: Thứ tự các trường này là CỐ ĐỊNH theo quy định của MoMo cho IPN.
  // Không được tự ý sắp xếp lại.
  const rawSignature = [
    `accessKey=${accessKey}`,
    `amount=${body.amount}`,
    `extraData=${body.extraData || ''}`, // extraData có thể rỗng
    `message=${body.message}`,
    `orderId=${body.orderId}`,
    `orderInfo=${body.orderInfo}`,
    `orderType=${body.orderType}`,
    `partnerCode=${partnerCode}`,
    `payType=${body.payType}`,
    `requestId=${body.requestId}`,
    `responseTime=${body.responseTime}`,
    `resultCode=${body.resultCode}`,
    `transId=${body.transId}`
  ].join('&');

  // Tạo chữ ký từ chuỗi raw trên
  const expectedSignature = createSignature(rawSignature, secretKey);

  // So sánh chữ ký tính toán được với chữ ký MoMo gửi tới
  return signature === expectedSignature;
};