// File: src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "react-i18next";

// Component Thẻ KPI
const KpiCard = ({ title, value, details, icon }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-800">
          {value.toLocaleString("vi-VN")}
        </p>
        <p className="text-xs text-green-600 mt-2">{details}</p>
      </div>
      <div className="w-12 h-12 
        bg-blue-100 rounded-lg flex items-center justify-center">
        {icon}
      </div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const { t } = useTranslation("admin");
  const { user } = useAuth();
  const [stats, setStats] = useState({
    sales: {},
    users: {},
    usage: { trend: [] }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      if (!token || user?.role !== 'admin') {
        setLoading(false);
        return;
      }

      try {
        const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/admin/dashboard-stats`;
        const res = await fetch(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok && data.success) {
          // Chuyển đổi dữ liệu trend cho biểu đồ
          const chartData = data.data.usage.trend.map(item => ({
            name: new Date(item.date).toLocaleDateString('vi-VN'),
            TokensUsed: parseInt(item.tokensUsed),
          }));

          setStats({
            ...data.data,
            usage: {
              ...data.data.usage,
              trend: chartData
            }
          });
        } else {
          console.error("Lỗi tải stats:", data.error);
        }
      } catch (err) {
        console.error("Lỗi fetch dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) return <div className="p-8 text-center text-gray-500">{t("loading")}</div>;

  return (
    <div className="space-y-8">
      {/* 4 Thẻ KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title={t("total_revenue")}
          value={stats.sales.totalRevenue || 0}
          details={t("total_revenue_desc")}
          icon={
            <span className="text-2xl 
              text-blue-600">₫</span>
          }
        />
        <KpiCard
          title={t("today_revenue")}
          value={stats.sales.todayRevenue || 0}
          details={`${t("tokens_sold")}: ${stats.sales.tokensSoldToday?.toLocaleString() || 0}`}
          icon={
            <span className="text-2xl text-blue-600">💰</span>
          }
        />
        <KpiCard
          title={t("tokens_used_today")}
          value={stats.usage.tokensUsedToday || 0}
          details={`${t("avg_token_per_req")}: ${stats.usage.avgTokenPerRequest || 0} tokens`}
          icon={
            <span className="text-2xl text-blue-600">🔥</span>
          }
        />
        <KpiCard
          title={t("total_users")}
          value={stats.users.totalUsers || 0}
          details={`${t("new_users_today")}: +${stats.users.newUsersToday || 0}`}
          icon={
            <span className="text-2xl text-blue-600">👥</span>
          }
        />
      </div>

      {/* Biểu đồ Tokens đã dùng */}
      <div className="bg-white rounded-xl shadow-sm 
        p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {t("chart_title")}
        </h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart
              data={stats.usage.trend}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                tickFormatter={(value) =>
                  `${(value / 1000).toLocaleString("vi-VN")}k`
                }
              />
              <Tooltip
                formatter={(value) =>
                  `${value.toLocaleString("vi-VN")} Tokens`
                }
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="TokensUsed"
                stroke="#3B82F6"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}