// File: src/pages/Settings.jsx

import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../hooks/useAuth";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function Setting() {
  const { user, login } = useAuth();
  const { t } = useTranslation("settings");

  const [form, setForm] = useState({
    nickname: "",
    avatar_url: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem("token");

  // Tạo một ref để trỏ tới input file bị ẩn
  const fileInputRef = useRef(null);

  // 1. Lấy dữ liệu user khi mở trang
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok && data.success) {
          // 🚀 SỬA ĐỔI: Cập nhật state CỦA FORM
          setForm({
            nickname: data.data.nickname || data.data.display_name || "",
            avatar_url: data.data.current_avatar_url || "", // 🚀 Dùng "current_avatar_url" từ View
            email: data.data.email || "",
          });

          // Cập nhật AuthContext (để Header cũng được cập nhật)
          login(data.data, token);

        } else {
          console.error("Lỗi tải profile:", data.error);
        }
      } catch (err) {
        console.error("Lỗi fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token, login]);

  // 2. Xử lý khi gõ input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 3. Lưu thay đổi Nickname
  const handleSaveNickname = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/profile/update-nickname`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nickname: form.nickname }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(t("success_nickname"));
        // Cập nhật AuthContext
        login({ ...user, nickname: data.nickname, display_name: data.nickname }, token);
      } else {
        alert("❌ Lỗi: " + (data.error || t("error_save_nickname")));
      }
    } catch (err) {
      alert(t("error_connection"));
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // 4. (MỚI) Xử lý khi chọn file (Tự động tải lên)
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    // 'avatar' phải TRÙNG KHỚP với tên field trong upload.single('avatar') ở backend
    formData.append('avatar', file);

    setSaving(true); // Báo là đang "Lưu"
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/profile/upload-avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // KHÔNG set 'Content-Type' ở đây, trình duyệt sẽ tự làm
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert(t("success_avatar"));
        // Cập nhật state của form
        setForm(prev => ({ ...prev, avatar_url: data.avatar_url }));
        // Cập nhật AuthContext
        login({ ...user, avatar_url: data.avatar_url }, token);
      } else {
        throw new Error(data.error || t("error_upload"));
      }
    } catch (err) {
      alert(t("error_upload_failed", { message: err.message }));
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // 5. (MỚI) Hàm kích hoạt input file
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  if (loading)
    return (
      <div className="flex h-screen justify-center items-center text-gray-600">
        {t("loading_profile")}
      </div>
    );

  return (
    <div className="flex min-h-screen bg-blue-600">
      <LanguageSwitcher />
      <Sidebar />
      <main className="flex-1 bg-gradient-to-b from-blue-50 to-blue-200 flex flex-col items-center py-10 px-6 overflow-y-auto">
        <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800 uppercase tracking-wide">
            {t("title")}
          </h2>

          {/* (MỚI) Input file bị ẩn */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            accept="image/png, image/jpeg, image/gif"
          />

          {/* Avatar & Display Name */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
              {form.avatar_url ? (
                <img src={form.avatar_url} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-600 text-2xl font-semibold">
                  {form.nickname?.[0]?.toUpperCase() || "A"}
                </span>
              )}

              {/* (SỬA) Nút "Change Photo" */}
              <button
                onClick={triggerFileInput}
                className="absolute bottom-0 w-full text-sm bg-blue-500 text-white py-1 hover:bg-blue-600 transition-opacity opacity-70 hover:opacity-100"
              >
                {t("change_photo")}
              </button>
            </div>

            <input
              type="text"
              name="nickname"
              value={form.nickname}
              onChange={handleChange}
              placeholder={t("display_name_placeholder")}
              className="mt-4 border border-gray-300 rounded-lg p-2 w-64 text-center focus:outline-blue-400"
            />
          </div>

          {/* Account Info */}
          <div className="mb-8">
            <h3 className="font-semibold mb-3 text-gray-800">{t("account_info")}</h3>
            <input
              type="email"
              value={form.email}
              readOnly
              className="border p-2 rounded-lg w-full bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4">
            <button
              disabled={saving}
              onClick={handleSaveNickname} // Chỉ lưu nickname
              className="px-5 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-60"
            >
              {saving ? t("saving") : t("save_changes")}
            </button>
          </div>
        </div>
        <p className="mt-8 text-gray-500 text-sm">
          © 2025 ComicTranslator. All rights reserved.
        </p>
      </main>
    </div>
  );
}