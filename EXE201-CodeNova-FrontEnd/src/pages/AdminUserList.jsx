import React from "react";

export default function AdminUserList() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h1 className="text-2xl font-bold text-gray-800">Quản lý Người dùng</h1>
      <p className="mt-4 text-gray-600">
        Đây là trang quản lý người dùng. Bạn có thể thêm bảng (table) để
        hiển thị danh sách user từ database ở đây.
      </p>
      {/* Bạn sẽ thêm logic fetch user và hiển thị bảng ở đây */}
    </div>
  );
}