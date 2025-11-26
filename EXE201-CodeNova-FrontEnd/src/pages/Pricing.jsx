// src/pages/Pricing.jsx
import React from "react";
import { Link } from "react-router-dom";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

// Header cho khách chưa đăng nhập
function HeaderPublic() {
  const { t } = useTranslation("pricing");
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-black/80 text-white">
      <Link to="/" className="text-2xl font-bold tracking-wide">
        ComicTranslator
      </Link>
      <nav className="flex items-center gap-6">
        <Link to="/login" className="hover:text-blue-400 transition">{t("login")}</Link>
        <Link to="/register" className="hover:text-blue-400 transition">{t("register")}</Link>
      </nav>
    </header>
  );
}

// Dấu check/blank
const Check = () => <span className="text-blue-600 font-bold">✔</span>;
const Dash = () => <span className="text-gray-300">—</span>;

export default function Pricing() {
  const { t } = useTranslation("pricing");

  // Dữ liệu bảng so sánh
  const plans = ["Free", "Plus", "Pro", "Enterprise"];
  const rows = [
    { feature: t("feature_token"), Free: true, Plus: true, Pro: true, Enterprise: true },
    { feature: t("feature_support"), Free: true, Plus: true, Pro: true, Enterprise: true },
    { feature: t("feature_5_projects"), Free: true, Plus: true, Pro: true, Enterprise: true },
    { feature: t("feature_analytics"), Free: false, Plus: true, Pro: true, Enterprise: true },
    { feature: t("feature_integrations"), Free: false, Plus: false, Pro: true, Enterprise: true },
    { feature: t("feature_unlimited"), Free: false, Plus: false, Pro: true, Enterprise: true },
    { feature: t("feature_priority"), Free: false, Plus: false, Pro: true, Enterprise: true },
    { feature: t("feature_branding"), Free: false, Plus: false, Pro: false, Enterprise: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300">
      <LanguageSwitcher />
      <HeaderPublic />

      <main className="max-w-6xl mx-auto py-16 px-6">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-12 tracking-wide">
          {t("title")}
        </h1>

        {/* ====== 3 gói ====== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
          {/* Free */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{t("free_title")}</h3>
            <p className="text-gray-500 mb-4">{t("free_desc")}</p>
            <p className="text-5xl font-extrabold text-blue-600 mb-4">{t("free_price")}</p>
            <ul className="text-gray-700 text-sm mb-6 space-y-2 text-left inline-block">
              <li><Check /> <span className="ml-2">Basic support</span></li>
              <li><Check /> <span className="ml-2">5 chapters per day</span></li>
              <li><Check /> <span className="ml-2">Standard speed</span></li>
            </ul>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
              {t("choose_btn")}
            </button>
          </div>

          {/* Plus */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center border-4 border-blue-400 hover:shadow-xl transition">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{t("plus_title")}</h3>
            <p className="text-gray-500 mb-4">{t("plus_desc")}</p>
            <p className="text-5xl font-extrabold text-blue-600 mb-1">{t("plus_price")}</p>
            <p className="text-gray-600 -mt-2 mb-3">{t("plus_period")}</p>
            <ul className="text-gray-700 text-sm mb-6 space-y-2 text-left inline-block">
              <li><Check /> <span className="ml-2">Plus support (AI recommend)</span></li>
              <li><Check /> <span className="ml-2">20 chapters per day</span></li>
              <li><Check /> <span className="ml-2">Offline mode</span></li>
            </ul>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
              {t("subscribe_btn")}
            </button>
          </div>

          {/* Pro */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{t("pro_title")}</h3>
            <p className="text-gray-500 mb-4">{t("pro_desc")}</p>
            <p className="text-5xl font-extrabold text-blue-600 mb-1">{t("pro_price")}</p>
            <p className="text-gray-600 -mt-2 mb-3">{t("pro_period")}</p>
            <ul className="text-gray-700 text-sm mb-6 space-y-2 text-left inline-block">
              <li><Check /> <span className="ml-2">Premium supports (Priority first)</span></li>
              <li><Check /> <span className="ml-2">Unlimited chapters</span></li>
              <li><Check /> <span className="ml-2">Dev mode</span></li>
              <li><Check /> <span className="ml-2">Offline mode</span></li>
            </ul>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
              {t("contact_btn")}
            </button>
          </div>
        </div>

        {/* ====== Compare Plans ====== */}
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">{t("compare_title")}</h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          {t("compare_desc")}
        </p>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100 text-gray-800">
                <tr>
                  <th className="p-4 w-1/3">Feature</th>
                  {plans.map((p) => (
                    <th
                      key={p}
                      className={`p-4 text-center ${p === "Pro" ? "bg-blue-50" : ""}`}
                    >
                      {p}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, idx) => (
                  <tr key={r.feature} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="p-4 text-gray-800">{r.feature}</td>
                    {plans.map((p) => (
                      <td
                        key={p}
                        className={`p-4 text-center ${p === "Pro" ? "bg-blue-50" : ""}`}
                      >
                        {r[p] ? <Check /> : <Dash />}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ====== Actions ====== */}
        <div className="flex justify-center gap-4 mt-10">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition">
            {t("continue_btn")}
          </button>
          <Link
            to="/"
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-full hover:bg-gray-300 transition"
          >
            {t("back_btn")}
          </Link>
        </div>
      </main>
    </div>
  );
}
