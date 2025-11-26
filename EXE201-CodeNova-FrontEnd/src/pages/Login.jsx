import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";

export default function Login() {
  const { t } = useTranslation("login");
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      login(data.user, data.token);

      // **LOGIC CHUYỂN HƯỚNG DỰA TRÊN VAI TRÒ**
      if (data.user && data.user.role === "admin") {
        navigate("/admin"); // Chuyển hướng admin tới trang quản trị
      } else {
        navigate("/menu"); // Chuyển hướng người dùng thường tới trang menu
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen">
      <LanguageSwitcher />

      {/* Left panel */}
      <div className="relative flex flex-col justify-center text-white w-1/2 p-16 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        >
          <source src="/videos/background_login.mp4" type="video/mp4" />
          {t("video_fallback")}
        </video>

        <div className="relative z-10">
          <h1 className="text-2xl font-bold mb-6">{t("app_name")}</h1>
          <h2 className="text-4xl font-bold mb-4">{t("headline")}</h2>
          <p className="text-gray-300">{t("description")}</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-col justify-center w-1/2 p-16">
        <div className="max-w-md mx-auto w-full">
          <h2 className="text-3xl font-semibold mb-2">{t("title")}</h2>
          <p className="text-gray-500 mb-6">{t("subtitle")}</p>

          {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder={t("email_placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-4 p-3 border rounded"
              required
            />
            <input
              type="password"
              placeholder={t("password_placeholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-2 p-3 border rounded"
              required
            />

            <div className="text-right mb-6">
              <Link
                to="/forgot-password"
                className="text-blue-500 text-sm hover:underline"
              >
                {t("forgot_password")}
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full mb-6"
            >
              {t("login_button")}
            </button>
          </form>

          <p className="text-center text-sm">
            {t("no_account")}{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              {t("register")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
