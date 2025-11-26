import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "react-i18next";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation("sidebar");

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded transition-colors
     ${isActive ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-600 text-white"}`;

  return (
    <aside className="w-64 bg-blue-700 text-white flex flex-col p-6 shadow-xl z-50">
      <h1
        className="text-2xl font-bold mb-8 cursor-pointer text-white tracking-wider"
        onClick={() => navigate("/menu")}
      >
        ComicTranslator
      </h1>

      {/* Menu links */}
      <nav className="flex flex-col gap-2">
        <NavLink to="/menu" className={linkClasses}>
          {t("home")}
        </NavLink>
        <NavLink to="/tokens" className={linkClasses}>
          {t("plans")}
        </NavLink>
        <NavLink to="/settings" className={linkClasses}>
          {t("settings")}
        </NavLink>

        {/* Admin Link - Only visible for admins */}
        {user?.role === "admin" && (
          <NavLink to="/admin" className={linkClasses}>
            🛡️ {t("admin_dashboard")}
          </NavLink>
        )}
      </nav>

      {/* Bottom section */}
      <div className="mt-auto flex flex-col gap-2 items-stretch">
        {/* Back to main website */}
        <NavLink
          to="/"
          className="flex items-center justify-center gap-2 px-3 py-2 rounded transition-colors bg-blue-800 hover:bg-blue-900 text-white text-sm"
        >
          {t("back_to_web")}
        </NavLink>

        {/* Logout */}
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="w-full px-3 py-2 rounded bg-red-500 hover:bg-red-600 text-white text-center font-semibold transition shadow-md"
        >
          {t("logout")}
        </button>
      </div>


      <footer className="mt-4 text-xs text-blue-200 text-center">
        {t("copyright")}
      </footer>
    </aside>
  );
}
