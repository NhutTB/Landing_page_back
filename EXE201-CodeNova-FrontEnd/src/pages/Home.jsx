import Header from "../components/Header";
import { Link } from "react-router-dom";
import codenova2 from "../assets/how_to_dowload.mp4";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";
import LanguageSwitcher from "../components/LanguageSwitcher";
export default function Home() {
  const [showVideo, setShowVideo] = useState(false);
  const { t } = useTranslation("home");
  const { user } = useAuth();

  return (
    <div className="w-full">
      {/* 🔘 Nút chuyển ngữ (cố định góc dưới) - Đã chuyển thành component */}
      <LanguageSwitcher />

      {/* 🔘 Nút Tải Extension (Cố định góc dưới bên phải, trên nút ngôn ngữ) */}
      <div className="fixed bottom-20 right-6 z-50">
        <a
          href="/codenova.zip"
          download="codenova.zip"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm transition backdrop-blur-sm flex items-center gap-2 shadow-lg hover:shadow-blue-500/50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          {t("download_extension")}
        </a>
      </div>

      <Header />  {/* 👈 Thêm header */}
      {/* Section hero */}
      <section
        id="hero"
        className="relative text-white min-h-screen flex flex-col items-center justify-center pt-24 overflow-hidden"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src="/videos/background_hero.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold">
            {t("hero_title")}
          </h1>
          <p className="mt-2 text-lg max-w-2xl">{t("hero_sub")}</p>
          <div className="mt-8 flex gap-4">

            {/* 🚀 ĐÃ SỬA: Nút 'Bắt đầu dịch ngay' thành nút 'Hướng dẫn sử dụng' mở video popup */}
            <button
              onClick={() => setShowVideo(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full flex items-center gap-2 font-semibold transition shadow-lg hover:shadow-blue-500/50 cursor-pointer"
            >
              {/* Icon Play */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              {t("hero_guide_btn")}
            </button>

            {/* Nút Watch Demo */}
            <button
              onClick={() => setShowVideo(true)}
              className="border border-white px-6 py-3 rounded-full hover:bg-white hover:text-black transition"
            >
              ▶ {t("hero_watch")}
            </button>

            {/* Nút Admin Dashboard (chỉ hiện với admin) */}
            {user?.role?.toLowerCase() === 'admin' && (
              <Link
                to="/admin"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full transition"
              >
                {t("admin_dashboard_btn")}
              </Link>
            )}

            {/* Video Popup */}
            {showVideo && (
              <div
                className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
                onClick={() => setShowVideo(false)}
              >
                <div className="relative max-w-4xl w-full mx-4">
                  <button
                    onClick={() => setShowVideo(false)}
                    className="absolute -top-12 right-0 text-white text-xl hover:text-gray-300 transition"
                  >
                    {t("video_close_btn")}
                  </button>
                  <video className="w-full rounded shadow-2xl" controls autoPlay>
                    <source src={codenova2} type="video/mp4" />
                  </video>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- How It Works Section --- */}
      <section id="how" className="py-16 bg-white text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {t("hiw_title")}
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          {t("hiw_desc")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-4">
          {/* Step 1 */}
          <div className="bg-gray-900 text-white p-8 rounded-2xl shadow-md hover:transform hover:-translate-y-1 transition duration-300">
            <div className="text-5xl mb-4">🧩</div>
            <h3 className="text-xl font-semibold mb-2">{t("hiw_step1_title")}</h3>
            <p>{t("hiw_step1_desc")}</p>
          </div>

          {/* Step 2 */}
          <div className="bg-gray-900 text-white p-8 rounded-2xl shadow-md hover:transform hover:-translate-y-1 transition duration-300">
            <div className="text-5xl mb-4">📖</div>
            <h3 className="text-xl font-semibold mb-2">{t("hiw_step2_title")}</h3>
            <p>{t("hiw_step2_desc")}</p>
          </div>

          {/* Step 3 */}
          <div className="bg-gray-900 text-white p-8 rounded-2xl shadow-md hover:transform hover:-translate-y-1 transition duration-300">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">{t("hiw_step3_title")}</h3>
            <p>{t("hiw_step3_desc")}</p>
          </div>
        </div>
      </section>


      {/* --- Features Section --- */}
      <section id="features" className="py-16 bg-blue-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">{t("feature_title")}</h2>
        <p className="max-w-2xl mx-auto mb-12 text-blue-100">
          {t("feature_desc")}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
          {/* Feature 1 */}
          <div className="bg-white text-gray-900 rounded-xl p-6 shadow hover:shadow-lg transition transform hover:-translate-y-1">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-lg font-semibold mb-2">{t("feature1_title")}</h3>
            <p className="text-gray-600">{t("feature1_desc")}</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white text-gray-900 rounded-xl p-6 shadow hover:shadow-lg transition transform hover:-translate-y-1">
            <div className="text-4xl mb-4">🌐</div>
            <h3 className="text-lg font-semibold mb-2">{t("feature2_title")}</h3>
            <p className="text-gray-600">{t("feature2_desc")}</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white text-gray-900 rounded-xl p-6 shadow hover:shadow-lg transition transform hover:-translate-y-1">
            <div className="text-4xl mb-4">🛠️</div>
            <h3 className="text-lg font-semibold mb-2">{t("feature3_title")}</h3>
            <p className="text-gray-600">{t("feature3_desc")}</p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white text-gray-900 rounded-xl p-6 shadow hover:shadow-lg transition transform hover:-translate-y-1">
            <div className="text-4xl mb-4">✍️</div>
            <h3 className="text-lg font-semibold mb-2">{t("feature4_title")}</h3>
            <p className="text-gray-600">{t("feature4_desc")}</p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white text-gray-900 rounded-xl p-6 shadow hover:shadow-lg transition transform hover:-translate-y-1">
            <div className="text-4xl mb-4">💾</div>
            <h3 className="text-lg font-semibold mb-2">{t("feature5_title")}</h3>
            <p className="text-gray-600">{t("feature5_desc")}</p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white text-gray-900 rounded-xl p-6 shadow hover:shadow-lg transition transform hover:-translate-y-1">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-lg font-semibold mb-2">{t("feature6_title")}</h3>
            <p className="text-gray-600">{t("feature6_desc")}</p>
          </div>
        </div>
      </section>


      {/* --- Pricing Section --- */}
      <section id="pricing" className="py-20 bg-blue-500 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">{t("pricing_title")}</h2>
        <p className="max-w-2xl mx-auto mb-12 text-blue-100">
          {t("pricing_desc")}
        </p>

        {/* Unlimited Plans */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 px-4">
          {/* Daily Pass */}
          <div className="bg-white text-gray-900 rounded-2xl shadow-lg p-8 flex flex-col items-center hover:shadow-xl transition transform hover:-translate-y-2">
            <h3 className="text-xl font-bold mb-2 text-gray-800">{t("pricing_daily_title")}</h3>
            <p className="text-gray-500 mb-4">{t("pricing_daily_sub")}</p>
            <p className="text-4xl font-bold text-blue-600 mb-4">{t("pricing_daily_price")}</p>
            <ul className="text-gray-700 text-sm mb-6 space-y-2 w-full text-left pl-8">
              {t("pricing_daily_features", { returnObjects: true }).map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition w-full font-semibold shadow-md">
              {t("pricing_select_btn")}
            </button>
          </div>

          {/* Monthly Pass */}
          <div className="bg-white text-gray-900 rounded-2xl shadow-lg p-8 flex flex-col items-center border-4 border-blue-300 hover:shadow-xl transition transform hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              {t("pricing_best_value")}
            </div>
            <span className="bg-green-100 text-green-800 text-sm font-bold px-4 py-1 rounded-full mb-3">
              {t("pricing_monthly_popular")}
            </span>
            <h3 className="text-xl font-bold mb-2 text-gray-800">{t("pricing_monthly_title")}</h3>
            <p className="text-gray-500 mb-4">{t("pricing_monthly_sub")}</p>
            <p className="text-4xl font-bold text-blue-600 mb-4">{t("pricing_monthly_price")}</p>
            <ul className="text-gray-700 text-sm mb-6 space-y-2 w-full text-left pl-8">
              {t("pricing_monthly_features", { returnObjects: true }).map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full hover:from-blue-700 hover:to-purple-700 transition w-full font-semibold shadow-md">
              {t("pricing_select_btn")}
            </button>
          </div>
        </div>

        {/* Nút More */}
        <div className="mt-10">
          <Link
            to="/pricing"
            className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-bold rounded-full hover:bg-gray-100 transition shadow-lg"
          >
            {t("pricing_more_btn")} <span className="ml-2">↗</span>
          </Link>
        </div>
      </section>

      {/* --- Testimonials Section --- */}
      <section id="testimonials" className="py-20 bg-white text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">{t("testi_title")}</h2>
        <p className="max-w-2xl mx-auto mb-12 text-gray-600">{t("testi_desc")}</p>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {/* Testimonial 1 */}
          <div className="bg-gray-50 rounded-2xl shadow-sm p-6 hover:shadow-lg transition border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <img src="https://i.pravatar.cc/60?img=1" alt="user" className="w-12 h-12 rounded-full border-2 border-blue-200" />
              <div className="text-left">
                <h3 className="font-bold text-gray-800">{t("testi_1_name")}</h3>
                <p className="text-sm text-blue-600 font-medium">{t("testi_1_role")}</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4 text-sm italic">"{t("testi_1_quote")}"</p>
            <div className="flex justify-center">
              <span className="text-yellow-400 text-lg">★ ★ ★ ★ ★</span>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-gray-50 rounded-2xl shadow-sm p-6 hover:shadow-lg transition border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <img src="https://i.pravatar.cc/60?img=5" alt="user" className="w-12 h-12 rounded-full border-2 border-blue-200" />
              <div className="text-left">
                <h3 className="font-bold text-gray-800">{t("testi_2_name")}</h3>
                <p className="text-sm text-blue-600 font-medium">{t("testi_2_role")}</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4 text-sm italic">"{t("testi_2_quote")}"</p>
            <div className="flex justify-center">
              <span className="text-yellow-400 text-lg">★ ★ ★ ★ ★</span>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-gray-50 rounded-2xl shadow-sm p-6 hover:shadow-lg transition border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <img src="https://i.pravatar.cc/60?img=8" alt="user" className="w-12 h-12 rounded-full border-2 border-blue-200" />
              <div className="text-left">
                <h3 className="font-bold text-gray-800">{t("testi_3_name")}</h3>
                <p className="text-sm text-blue-600 font-medium">{t("testi_3_role")}</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4 text-sm italic">"{t("testi_3_quote")}"</p>
            <div className="flex justify-center">
              <span className="text-yellow-400 text-lg">★ ★ ★ ★ ★</span>
            </div>
          </div>
        </div>
      </section>


      {/* --- FAQ Section --- */}
      <section id="faq" className="py-20 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">{t("faq_title")}</h2>
        <p className="max-w-2xl mx-auto text-gray-600 mb-12">{t("faq_desc")}</p>

        <div className="max-w-3xl mx-auto space-y-4 text-left px-4">
          {/* FAQ Items */}
          {[1, 2, 3, 4, 5].map((i) => (
            <details key={i} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 group">
              <summary className="cursor-pointer text-lg font-medium text-gray-800 list-none flex justify-between items-center">
                {t(`faq_${i}_q`)}
                <span className="text-blue-600 transition-transform group-open:rotate-180">▼</span>
              </summary>
              <p className="mt-3 text-gray-600 leading-relaxed pl-2 border-l-4 border-blue-100">
                {t(`faq_${i}_a`)}
              </p>
            </details>
          ))}
        </div>
      </section>


      {/* --- Footer --- */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Logo & Description */}
          <div>
            <h3 className="text-white text-2xl font-bold mb-4 tracking-wider">{t("footer_brand")}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{t("footer_desc")}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wide text-sm">{t("footer_links_title")}</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition hover:translate-x-1 inline-block">{t("footer_link_features")}</button>
              </li>
              <li>
                <button onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition hover:translate-x-1 inline-block">{t("footer_link_pricing")}</button>
              </li>
              <li>
                <button onClick={() => document.getElementById('faq').scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition hover:translate-x-1 inline-block">{t("footer_link_faq")}</button>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition hover:translate-x-1 inline-block">{t("footer_link_login")}</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition hover:translate-x-1 inline-block">{t("footer_link_register")}</Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wide text-sm">{t("footer_social_title")}</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition text-white">
                🌐
              </a>
              <a href="https://www.facebook.com/profile.php?id=61582946912146" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#1877F2] transition">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12C22 6.48 17.52 2 12 2S2 6.48 2 12c0 5 3.66 9.13 8.44 9.88v-6.99h-2.54v-2.89h2.54V9.83c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.25c-1.23 0-1.61.77-1.61 1.56v1.87h2.74l-.44 2.89h-2.3v6.99C18.34 21.13 22 17 22 12z" />
                </svg>
              </a>
            </div>
            <p className="text-xs text-gray-500 mt-6 border-t border-gray-800 pt-6">
              © {new Date().getFullYear()} {t("footer_brand")}. {t("footer_rights")}
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}