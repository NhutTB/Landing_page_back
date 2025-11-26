import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";

export default function Register() {
  const { t } = useTranslation("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError(t("error_password_match"));
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/register`, {
        email,
        password,
      });
      // Đăng ký xong đưa về trang login
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || t("error_registration_failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-purple-200">
      <LanguageSwitcher />

      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <h1 className="text-center text-2xl font-bold text-gray-800">
          {t("app_name")}
        </h1>
        <p className="text-center text-gray-600 mt-1 mb-6">
          {t("subtitle")}
        </p>

        {error && (
          <div className="mb-4 text-red-600 text-center text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder={t("email_placeholder")}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder={t("password_placeholder")}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder={t("confirm_password_placeholder")}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
          >
            {loading ? t("registering") : t("register_button")}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          {t("have_account")}{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            {t("login_link")}
          </Link>
        </p>
      </div>
    </div>
  );
}
