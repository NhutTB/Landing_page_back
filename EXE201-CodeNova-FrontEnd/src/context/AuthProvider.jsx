// File: src/context/AuthProvider.jsx
import React, { useState, useEffect, useCallback } from "react"; // 🚀 Import useCallback
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  // 1. Khởi tạo state từ localStorage
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      localStorage.removeItem("user");
      return null;
    }
  });

  // 2. Lắng nghe sự kiện
  useEffect(() => {
    // Sự kiện khi localStorage thay đổi (từ tab khác)
    const handleStorageChange = (e) => {
      if (e.key === "user") {
        try {
          setUser(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {
          setUser(null);
        }
      }
      if (e.key === "token" && !e.newValue) {
        localStorage.removeItem("user");
        setUser(null);
      }
    };

    // Sự kiện khi nhận tin nhắn từ extension (content.js)
    const handleExtensionMessage = (event) => {
      const msg = event.data;
      if (msg && msg.type === 'CODENOVA_TOKEN_SAVED' && msg.user) {
        console.log("AuthProvider: Nhận user/token từ extension");
        localStorage.setItem("user", JSON.stringify(msg.user));
        localStorage.setItem("token", msg.token);
        setUser(msg.user);
      } else if (msg && msg.type === 'CODENOVA_TOKEN_CLEARED') {
        console.log("AuthProvider: Nhận lệnh đăng xuất từ extension");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("message", handleExtensionMessage);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("message", handleExtensionMessage);
    };
  }, []); // 🚀 Bỏ 'user' khỏi dependencies

  // 3. 🚀 SỬA LỖI: Bọc 'login' trong useCallback
  const login = useCallback((userData, token) => {
    try {
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token); 
      setUser(userData);
      
      window.postMessage(
        { type: "CODENOVA_SET_TOKEN", token: token, user: userData },
        window.origin
      );
    } catch (e) { 
      console.error("Lỗi khi lưu user/token", e); 
    }
  }, []); // 🚀 Dependency rỗng

  // 4. 🚀 SỬA LỖI: Bọc 'logout' trong useCallback
  const logout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    window.postMessage({ type: "CODENOVA_CLEAR_TOKEN" }, window.origin);
  }, []); // 🚀 Dependency rỗng

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};