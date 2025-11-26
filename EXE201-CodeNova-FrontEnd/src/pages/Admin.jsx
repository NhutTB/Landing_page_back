import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";
import AdminDashboard from "./AdminDashboard";
import AdminUserList from "./AdminUserList";
import LanguageSwitcher from "../components/LanguageSwitcher";

export default function Admin() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <LanguageSwitcher />

      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Admin Header */}
        <AdminHeader />

        {/* Nội dung trang con sẽ được render ở đây */}
        <main className="flex-1 p-8">
          <Routes>
            {/* Trang chính của admin */}
            <Route path="/" element={<AdminDashboard />} />
            {/* Trang quản lý người dùng */}
            <Route path="/users" element={<AdminUserList />} />
            {/* Thêm các Route admin khác ở đây (vd: /subscriptions) */}
          </Routes>
        </main>
      </div>
    </div>
  );
}