// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BannerManager from "@/pages/admin/BannerManager";
import AdminNotify from "@/pages/admin/AdminNotify";
import AdminUsers from "@/pages/admin/AdminUsers";
// optional: disputes page (create if not existing)
import AdminDisputes from "@/pages/admin/AdminDisputes";

import {
  Users,
  Megaphone,
  TicketPercent,
  Image as ImageIcon,
  ShieldOff,
} from "lucide-react";
import { useLocation } from "react-router-dom";

export default function AdminDashboard() {
  const location = useLocation();
  const initialTab = location.state?.tab || "banner";
  const [activeTab, setActiveTab] = useState(initialTab);

  // Nếu user chuyển sang tab khác thông qua location.state (ví dụ redirect)
  useEffect(() => {
    if (location.state?.tab) setActiveTab(location.state.tab);
  }, [location.state]);

  const TABS = [
    { key: "banner", label: "Banner", icon: ImageIcon },
    { key: "users", label: "Người dùng", icon: Users },
    { key: "notifications", label: "Thông báo", icon: Megaphone },
    { key: "voucher", label: "Quản trị Voucher", icon: TicketPercent },
    { key: "disputes", label: "Duyệt vi phạm", icon: ShieldOff },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.h1
          className="text-3xl font-bold text-gray-800 mb-4"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Bảng điều khiển Quản trị
        </motion.h1>

        <motion.p
          className="text-gray-500 mb-6 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.05 } }}
        >
          Các công cụ quản trị: quản lý banner, người dùng, gửi thông báo, quản trị voucher và xử lý khiếu nại — tất cả đồng bộ với giao diện UniTrade.
        </motion.p>

        {/* Quick tab / pills */}
        <div className="flex flex-wrap gap-3 mb-6">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <motion.button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-full transition-shadow border ${
                  active
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl border-transparent"
                    : "bg-white text-gray-700 border-gray-200 hover:shadow-sm"
                }`}
                aria-pressed={active}
              >
                <span className={`p-2 rounded-full ${active ? "bg-white/20" : "bg-gray-100"}`}>
                  <Icon size={18} className={active ? "text-white" : "text-gray-600"} />
                </span>
                <span className="text-sm font-medium">{tab.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Content card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12, scale: 0.995 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.995 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            {/* KEEP original mapping of tabs to your components (logic unchanged) */}
            {activeTab === "banner" && <BannerManager />}

            {activeTab === "users" && <AdminUsers />}

            {activeTab === "notifications" && <AdminNotify />}

            {activeTab === "voucher" && (
              <div className="text-center text-gray-500 py-20">
                🎟️ Quản trị voucher (đang phát triển)
              </div>
            )}

            {activeTab === "disputes" && (
              // nếu AdminDisputes chưa có, bạn có thể thay bằng 1 placeholder
              <div>
                {/* AdminDisputes component should handle list, review, reply actions */}
                {typeof AdminDisputes === "function" ? (
                  <AdminDisputes />
                ) : (
                  <div className="text-center text-gray-500 py-20">
                    🛡️ Duyệt vi phạm (chưa cài đặt component AdminDisputes)
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
