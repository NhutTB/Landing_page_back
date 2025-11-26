import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { QRCodeCanvas } from "qrcode.react"; // Import thư viện QR
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation("payment");
  // Nhận packageId từ trang Tokens (ví dụ: 'CREDIT_1000')
  const { packageId, price, packageName } = location.state || {};

  const [method, setMethod] = useState("momo");
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null); // Lưu link thanh toán để tạo QR

  const handleCancel = () => navigate("/tokens");

  // Hàm gọi API tạo link thanh toán
  const createPayment = async () => {
    if (method !== "momo") {
      alert(t("error_only_momo"));
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/payment/create-momo-link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          packageId: packageId // Gửi ID gói (vd: CREDIT_1000)
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Thay vì chuyển hướng ngay, ta lưu URL để hiển thị QR
      setPaymentUrl(data.payUrl);

    } catch (err) {
      alert(t("error_create_failed", { message: err.message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-blue-600">
      <LanguageSwitcher />
      <Sidebar />
      <main className="relative flex-1 flex justify-center items-center overflow-hidden p-4">
        <div className="relative z-10 w-full max-w-lg bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">

          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 uppercase">
            {t("title")}
          </h1>

          {/* Thông tin gói */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">{t("package")}:</span>
              <span className="font-bold text-blue-700">{packageName || packageId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("amount")}:</span>
              <span className="font-bold text-red-600 text-xl">
                {price ? price.toLocaleString('vi-VN') : 0} đ
              </span>
            </div>
          </div>

          {!paymentUrl ? (
            // === CHƯA CÓ LINK THANH TOÁN: HIỆN NÚT ===
            <>
              <div className="mb-6">
                <label className="flex items-center gap-4 p-4 border-2 border-pink-500 bg-pink-50 rounded-xl cursor-pointer">
                  <input
                    type="radio"
                    checked={method === "momo"}
                    onChange={() => setMethod("momo")}
                    className="w-5 h-5 text-pink-600"
                  />
                  <div className="flex items-center gap-3">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
                      alt="MoMo"
                      className="w-10 h-10 object-contain rounded"
                    />
                    <span className="font-bold text-gray-800">{t("momo_wallet")}</span>
                  </div>
                </label>
              </div>

              <button
                onClick={createPayment}
                disabled={loading}
                className="w-full bg-[#a50064] hover:bg-[#8d0055] text-white font-bold py-4 rounded-xl shadow-lg transition disabled:opacity-70"
              >
                {loading ? t("creating_qr") : t("create_qr_btn")}
              </button>
            </>
          ) : (
            // === ĐÃ CÓ LINK: HIỆN MÃ QR ===
            <div className="flex flex-col items-center animate-fade-in">
              <p className="text-center text-sm text-gray-500 mb-4">
                {t("scan_qr_desc")}
              </p>

              <div className="p-4 bg-white border-2 border-[#a50064] rounded-xl shadow-inner mb-4">
                <QRCodeCanvas
                  value={paymentUrl}
                  size={220}
                  level={"H"}
                  includeMargin={true}
                  imageSettings={{
                    src: "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png",
                    x: undefined,
                    y: undefined,
                    height: 40,
                    width: 40,
                    excavate: true,
                  }}
                />
              </div>

              <p className="text-xs text-center text-gray-400 mb-6">
                {t("auto_update_desc")}
              </p>

              <div className="flex gap-3 w-full">
                <a
                  href={paymentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  {t("open_app_btn")}
                </a>
                <button
                  onClick={() => setPaymentUrl(null)} // Quay lại
                  className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-600"
                >
                  {t("back_btn")}
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <button onClick={handleCancel} className="text-sm text-gray-500 hover:text-gray-800">
              {t("cancel_btn")}
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}