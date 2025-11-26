// File: src/pages/Tokens.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function Tokens() {
  const navigate = useNavigate();
  const { t } = useTranslation("tokens");
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        // Gọi API lấy danh sách gói
        // const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/payment/packages`);
        // const data = await res.json();
        // if (data.success) setPackages(data.data);

        // Dữ liệu giả lập (Mock Data) nếu chưa có API
        setPackages([
          {
            id: "CREDIT_50",
            name: "Starter Pack",
            tokens: 50,
            price: 20000,
            currency: "VND",
            description: t("desc_starter"),
            popular: false
          },
          {
            id: "CREDIT_200",
            name: "Standard Pack",
            tokens: 200,
            price: 70000,
            currency: "VND",
            description: t("desc_popular"),
            popular: true
          },
          {
            id: "CREDIT_500",
            name: "Pro Pack",
            tokens: 500,
            price: 150000,
            currency: "VND",
            description: t("desc_pro"),
            popular: false
          },
          {
            id: "CREDIT_1000",
            name: "Ultimate Pack",
            tokens: 1000,
            price: 250000,
            currency: "VND",
            description: t("desc_ultimate"),
            popular: false
          },
        ]);
      } catch (err) {
        console.error("Lỗi tải gói:", err);
        setError(t("error_loading"));
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [t]);

  const handleBuy = (pkg) => {
    // Chuyển sang trang Payment, truyền thông tin gói
    navigate("/payment", {
      state: {
        packageId: pkg.id,
        price: pkg.price,
        packageName: pkg.name
      }
    });
  };

  if (loading) return <div className="p-10 text-center">{t("loading_packages")}</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="flex min-h-screen bg-blue-600">
      <LanguageSwitcher />
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-blue-50 to-blue-200">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-4 uppercase tracking-wider">
            {t("title")}
          </h1>
          <p className="text-center text-gray-600 mb-12 text-lg">
            {t("subtitle")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center transform transition hover:-translate-y-2 hover:shadow-2xl ${pkg.popular ? 'border-4 border-yellow-400' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wide">
                    {t("best_value")}
                  </div>
                )}

                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl mb-4">
                  💎
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">{pkg.name}</h3>
                <p className="text-gray-500 text-sm text-center mb-4 h-10">
                  {pkg.description}
                </p>

                <div className="text-3xl font-extrabold text-gray-900 mb-1">
                  {pkg.tokens}
                </div>
                <span className="text-sm text-gray-400 font-medium uppercase tracking-wide mb-6">
                  {t("tokens")}
                </span>

                <div className="w-full border-t border-gray-100 my-4"></div>

                <div className="text-2xl font-bold text-blue-600 mb-6">
                  {pkg.price.toLocaleString('vi-VN')} đ
                </div>

                <button
                  onClick={() => handleBuy(pkg)}
                  className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all ${pkg.popular
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600'
                    : 'bg-gray-800 hover:bg-gray-900'
                    }`}
                >
                  {t("buy_now")}
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
