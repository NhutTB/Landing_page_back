import React from "react"; // 🚀 Đã xóa 'useState' không cần thiết
import { useNavigate, useLocation } from "react-router-dom";
import codenova from "../assets/codenova.png";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation(); // 🚀 Giờ chúng ta sẽ dùng biến này

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      path: "/admin",
    },
    {
      id: "users",
      label: "Users",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      path: "/admin/users",
    },
    {
      id: "subscriptions",
      label: "Subscriptions",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      path: "/admin/subscriptions",
    },
    {
      id: "settings",
      label: "Settings",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      path: "/settings",
    },
  ];

  // 🚀 SỬA LỖI LOGIC: Tính toán activeMenu từ location.pathname
  const findActiveMenu = () => {
    const currentPath = location.pathname; // Ví dụ: /admin/users

    // Sắp xếp các item theo độ dài path giảm dần
    // (để /admin/users được kiểm tra trước /admin)
    const sortedItems = [...menuItems].sort((a, b) => b.path.length - a.path.length);
    
    // Tìm path đầu tiên mà URL hiện tại bắt đầu bằng path đó
    const activeItem = sortedItems.find(item => currentPath.startsWith(item.path));
    
    // Nếu tìm thấy, trả về id, nếu không, trả về '' (hoặc dashboard làm mặc định)
    return activeItem ? activeItem.id : "";
  };
  
  // activeMenu giờ được tính toán lại mỗi khi location thay đổi (render)
  const activeMenu = findActiveMenu();

  const handleMenuClick = (item) => {
    // 🚀 Đã xóa `setActiveMenu(item.id);` vì không còn cần thiết
    navigate(item.path);
  };

  const handleBackToMenu = () => {
    navigate("/menu");
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-900 to-blue-700 text-white flex flex-col shadow-xl">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <img 
            src={codenova} 
            alt="CodeNova Logo" 
            className="w-12 h-12 rounded-lg object-cover"
          />
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleMenuClick(item)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeMenu === item.id // 🚀 Logic này giờ đã đúng và đồng bộ với URL
                ? "bg-white/20 text-white shadow-lg"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Back to User Menu */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleBackToMenu}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition text-white/90 hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          <span className="font-medium">Back to Menu</span>
        </button>
      </div>
    </aside>
  );
}