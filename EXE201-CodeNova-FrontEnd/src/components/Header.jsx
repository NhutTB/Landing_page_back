// File: src/components/Header.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "react-i18next";
import codenova from "../assets/codenova.png"; // Đảm bảo đường dẫn ảnh đúng

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("header");
  const [scrolled, setScrolled] = useState(false);

  // Hiệu ứng đổi màu nền khi cuộn trang
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hàm cuộn đến section (Features, Pricing...)
  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 flex items-center justify-between ${scrolled ? "bg-black/90 backdrop-blur-md shadow-lg py-3" : "bg-transparent"
        }`}
    >
      {/* --- Logo --- */}
      <Link to="/" className="flex items-center gap-2 group">
        <img
          src={codenova}
          alt="CODENOVA"
          className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
        />
        <span className="text-white text-xl font-bold tracking-wider">
          CODENOVA
        </span>
      </Link>

      {/* --- Menu Điều Hướng (Desktop) --- */}
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/90">
        <button onClick={() => scrollToSection("how")} className="hover:text-blue-400 transition">
          {t("nav_how")}
        </button>
        <button onClick={() => scrollToSection("features")} className="hover:text-blue-400 transition">
          {t("nav_features")}
        </button>
        <button onClick={() => scrollToSection("pricing")} className="hover:text-blue-400 transition">
          {t("nav_pricing")}
        </button>
        <button onClick={() => scrollToSection("faq")} className="hover:text-blue-400 transition">
          {t("nav_faq")}
        </button>
      </nav>

      {/* --- User / Auth Buttons --- */}
      <div className="flex items-center gap-4">
        {user ? (
          // Đã đăng nhập
          <>
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-white text-sm font-semibold">
                {user.display_name || user.email}
              </span>
              {user.role === "admin" && (
                <span className="text-yellow-400 text-[10px] uppercase font-bold tracking-wide">
                  Admin
                </span>
              )}
            </div>

            {/* --- NÚT ADMIN DASHBOARD (Mới) --- */}
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-full font-bold text-sm transition shadow-lg shadow-yellow-500/20"
                title="Go to Admin Dashboard"
              >
                {/* Icon Admin Shield */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 12c0 5.61 4.232 10.285 9.467 10.875a.75.75 0 00.566 0c5.235-.59 9.467-5.265 9.467-10.875a12.744 12.744 0 00-.635-6.235.75.75 0 00-.722-.515 11.208 11.208 0 01-7.877-3.08zM12 13.25a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5zm-4.5-5a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z" clipRule="evenodd" />
                </svg>
                Dashboard
              </Link>
            )}

            {/* --- NÚT MENU (Luôn hiển thị để vào App) --- */}
            <Link
              to="/menu"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-semibold transition shadow-lg shadow-blue-900/20 flex items-center gap-2"
            >
              {t("nav_menu")}
            </Link>

            {/* Nút Đăng xuất */}
            <button
              onClick={logout}
              title="Đăng xuất"
              className="text-white/70 hover:text-red-400 transition p-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                />
              </svg>
            </button>
          </>
        ) : (
          // Chưa đăng nhập
          <>
            <Link
              to="/login"
              className="text-white hover:text-blue-400 font-medium transition"
            >
              {t("nav_login")}
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-semibold transition shadow-lg shadow-blue-900/20 hover:-translate-y-0.5"
            >
              {t("nav_register")}
            </Link>
          </>
        )}
      </div>
    </header>
  );
}