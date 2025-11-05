// src/components/layout/Topbar.jsx
import React, { useEffect, useRef, useState, forwardRef } from "react";
import api, { API } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  PlusCircle,
  User,
  BarChart3,
  LogOut,
  Shield,
  CheckCircle2,
  Menu,
  Bell,
  Trash2,
  CheckCheck,
  TicketPercent,
  Flag,
} from "lucide-react";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";

import ReportModal from "@/components/report/ReportModal"; // <-- ensure this file exists and exports a modal component

const socket = io(API, { transports: ["websocket"], autoConnect: true });

const isAbs = (u) => /^https?:\/\//i.test(u || "");
const buildImg = (raw) => {
  if (!raw) return "/logo.png";
  if (isAbs(raw)) return raw;
  if (raw.startsWith("/uploads/")) return `${API}${raw}`;
  if (raw.startsWith("uploads/")) return `${API}/${raw}`;
  return `${API}/uploads/${raw}`;
};

export default function Topbar() {
  const { user, logout } = useAuth();
  const isAdmin = (user?.role || "").toLowerCase() === "admin";

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [nbOpen, setNbOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [nbUnread, setNbUnread] = useState(0);

  // Report modal open state
  const [reportOpen, setReportOpen] = useState(false);

  const dropdownRef = useRef(null);
  const nbRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const onToggleSidebar = () => {
    window.dispatchEvent(new CustomEvent("sidebar:toggle"));
    document.body.classList.toggle("sidebar-open");
  };

  /* ---------- Notifications + socket setup ---------- */
  useEffect(() => {
    const fetchNotifs = async () => {
      if (!user?.id) return;
      try {
        const res = await api.get("/api/notifications");
        const data = Array.isArray(res.data) ? res.data : res.data?.rows || [];
        setNotifs(data);
        const unreadCount = data.filter((n) => !n.is_read).length;
        setNbUnread(unreadCount);
      } catch (err) {
        console.error("Fetch notifs error", err);
      }
    };

    fetchNotifs();

    if (!user?.id) return;

    const personal = `notification:new:${user.id}`;
    const all = `notification:new:all`;

    const handler = (p) => {
      const payload = {
        id: p.id || `tmp-${Date.now()}`,
        title: p.title || "Thông báo",
        body: p.body || "",
        is_read: false,
        created_at: p.created_at || new Date().toISOString(),
      };
      setNotifs((prev) => [payload, ...prev]);
      setNbUnread((x) => x + 1);
      try {
        const audio = new Audio("/sounds/notification.mp3");
        audio.volume = 0.18;
        audio.play().catch(() => {});
      } catch {}
    };

    socket.on(personal, handler);
    socket.on(all, handler);

    return () => {
      socket.off(personal, handler);
      socket.off(all, handler);
    };
  }, [user?.id]);

  useEffect(() => {
    const h = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
      if (nbRef.current && !nbRef.current.contains(e.target)) setNbOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    setSuggestions([]);
    setSearchTerm("");
  }, [location.pathname]);

  /* ---------- Search ---------- */
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }
    const t = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/products/search", { params: { q: searchTerm } });
        setSuggestions((res.data || []).slice(0, 6));
      } catch (err) {
        console.error("Search error", err);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    setSuggestions([]);
  };

  useEffect(() => {
    if (!user?.id) return;
    const ch = `notification:new:${user.id}`;
    const handler = (p) => {
      setNotifs((prev) => [
        { id: `tmp-${Date.now()}`, title: p?.title || "Thông báo", body: p?.body || "", is_read: false, created_at: new Date().toISOString() },
        ...prev,
      ]);
      setNbUnread((x) => x + 1);
    };
    socket.on(ch, handler);
    return () => socket.off(ch, handler);
  }, [user?.id]);

  const markAllRead = async () => {
    try {
      await api.patch("/api/notifications/read-all", {});
    } catch {}
    setNotifs((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setNbUnread(0);
  };
  const clearAllNotifs = async () => {
    try {
      await api.delete("/api/notifications");
    } catch {}
    setNotifs([]);
    setNbUnread(0);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest("form")) setSuggestions([]);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header
      className="sticky top-0 z-[60] 
      bg-gradient-to-r from-blue-50 via-white to-blue-100/60 
      backdrop-blur-xl border-b border-blue-100/70 
      shadow-[0_3px_12px_rgba(59,130,246,0.08)] transition-all"
    >
      <div className="py-3">
        <div className="container mx-auto flex items-center justify-between px-6 relative">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            <motion.button
              type="button"
              onClick={onToggleSidebar}
              aria-label="Mở menu"
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </motion.button>

            <Link to="/" className="flex items-center gap-2 ml-1 md:ml-2">
              <motion.img
                whileHover={{ rotate: 5, scale: 1.05 }}
                src="/logo.png"
                alt="UniTrade"
                className="h-10 w-10 object-contain rounded-full border border-gray-200 shadow-sm"
              />
              <span className="text-2xl font-extrabold text-slate-800 tracking-tight">
                Uni<span className="text-blue-600">Trade</span>
              </span>
            </Link>
          </div>

          {/* CENTER: SEARCH BAR */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center relative flex-1 max-w-md mx-6">
            <motion.input
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm sản phẩm, danh mục hoặc người bán..."
              className="w-full px-4 py-2.5 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-gray-700 placeholder-gray-400 transition shadow-sm"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              type="submit"
              className="absolute right-1.5 top-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full w-9 h-9 flex items-center justify-center shadow-md transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.4-5.4A7 7 0 1110.65 3.25a7 7 0 017.4 7.4z" />
              </svg>
            </motion.button>

            <AnimatePresence>
              {suggestions.length > 0 && (
                <motion.ul
                  key="suggestions"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="absolute top-full mt-2 w-full bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden"
                >
                  {suggestions.map((item, i) => {
                    const img = buildImg(item.image_url);
                    const name = item.name || "Sản phẩm";
                    const regex = new RegExp(`(${searchTerm})`, "gi");
                    const parts = name.split(regex);
                    return (
                      <motion.li key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.2, delay: i * 0.03 }}>
                        <Link
                          to={`/products/${item.id}`}
                          onClick={() => setSuggestions([])}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-blue-50 transition text-sm text-gray-700"
                        >
                          <img src={img} alt={name} className="w-9 h-9 object-cover rounded border border-gray-200" />
                          <div className="flex-1 min-w-0">
                            <span className="block truncate">
                              {parts.map((part, idx) =>
                                regex.test(part) ? (
                                  <mark key={idx} className="bg-yellow-200 text-gray-900 rounded-sm px-[1px]">
                                    {part}
                                  </mark>
                                ) : (
                                  <span key={idx}>{part}</span>
                                )
                              )}
                            </span>
                            {item.price && <span className="text-blue-600 font-semibold text-xs">{item.price.toLocaleString("vi-VN")}₫</span>}
                          </div>
                        </Link>
                      </motion.li>
                    );
                  })}
                  {loading && <li className="px-4 py-2 text-gray-500 text-sm">Đang tìm...</li>}
                </motion.ul>
              )}
            </AnimatePresence>
          </form>

          {/* RIGHT */}
          <div className="flex items-center gap-3 ml-4">
            <IconLink to="/favorites" icon={Heart} label="Yêu thích" />
            <IconLink to="/messages" icon={MessageCircle} label="Tin nhắn" />
            <IconLink to="/post/create" icon={PlusCircle} label="Đăng bài" />

            {/* Report button (compact) */}
            <button
              onClick={() => setReportOpen(true)}
              title="Gửi đơn vi phạm"
              className="p-2 rounded-full hover:bg-blue-50 transition hidden sm:inline-flex items-center gap-2"
            >
              <Flag className="w-5 h-5 text-gray-700" />
            </button>

            {/* Notifications */}
            {user && (
              <div className="relative" ref={nbRef}>
                <motion.button
                  onClick={() => setNbOpen((v) => !v)}
                  whileTap={{ scale: 0.9 }}
                  className="relative p-2 rounded-full hover:bg-blue-50 transition"
                  aria-label="Thông báo"
                >
                  <Bell className="w-6 h-6 text-gray-700 hover:text-blue-600" />
                  {nbUnread > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[11px] rounded-full flex items-center justify-center shadow">
                      {nbUnread > 99 ? "99+" : nbUnread}
                    </span>
                  )}
                </motion.button>

                <AnimatePresence>
                  {nbOpen && (
                    <motion.div
                      key="notif"
                      initial={{ opacity: 0, y: -10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.22 }}
                      className="absolute right-0 mt-2 w-[22rem] bg-white/95 backdrop-blur-xl text-gray-800 rounded-2xl shadow-2xl border border-gray-100 origin-top-right z-[90] overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b flex items-center justify-between sticky top-0 bg-white/90 rounded-t-xl backdrop-blur-sm z-10">
                        <div className="font-semibold text-gray-800">Thông báo</div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={async () => {
                              try {
                                await api.patch("/api/notifications/read-all");
                              } catch {}
                              setNotifs((prev) => prev.map((n) => ({ ...n, is_read: true })));
                              setNbUnread(0);
                            }}
                            className="text-xs flex items-center gap-1 px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
                          >
                            <CheckCheck className="w-4 h-4" /> Đã đọc
                          </button>

                          <button
                            onClick={async () => {
                              try {
                                await api.delete("/api/notifications");
                              } catch {}
                              setNotifs([]);
                              setNbUnread(0);
                            }}
                            className="text-xs flex items-center gap-1 px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-red-600"
                          >
                            <Trash2 className="w-4 h-4" /> Xoá
                          </button>
                        </div>
                      </div>

                      <div className="max-h-96 overflow-y-auto">
                        {notifs.length === 0 ? (
                          <div className="px-4 py-6 text-sm text-gray-500 text-center">Chưa có thông báo.</div>
                        ) : (
                          notifs.map((n) => (
                            <button
                              key={n.id}
                              onClick={async () => {
                                try {
                                  // optional: call backend to mark single read
                                } catch {}
                                setNotifs((prev) => prev.map((it) => (it.id === n.id ? { ...it, is_read: true } : it)));
                                setNbUnread((c) => Math.max(0, c - (n.is_read ? 0 : 1)));
                                if (n.link) {
                                  navigate(n.link);
                                  setNbOpen(false);
                                }
                              }}
                              className={`w-full text-left px-4 py-3 border-b last:border-b-0 transition ${n.is_read ? "bg-white" : "bg-blue-50"}`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="text-sm font-medium text-gray-800">{n.title}</div>
                                <div className="text-xs text-gray-400">{new Date(n.created_at).toLocaleString("vi-VN")}</div>
                              </div>
                              {n.body && <div className="text-sm text-gray-600 mt-1">{n.body}</div>}
                            </button>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* User dropdown */}
            {user ? (
              <UserMenu
                ref={dropdownRef}
                user={user}
                isAdmin={isAdmin}
                open={open}
                setOpen={setOpen}
                logout={logout}
                onOpenReport={() => {
                  setReportOpen(true);
                  setOpen(false);
                }}
              />
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition">
                  Đăng nhập
                </Link>
                <Link to="/register" className="px-4 py-2 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold transition">
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report Modal (single instance) */}
      <ReportModal open={reportOpen} onClose={() => setReportOpen(false)} />
    </header>
  );
}

/* ----------- Sub Components ----------- */
function IconLink({ to, icon: Icon, label }) {
  return (
    <Link to={to} className="p-2 rounded-full hover:bg-blue-50 transition relative group" aria-label={label}>
      <Icon className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition" />
    </Link>
  );
}

// Note: Forward ref to allow parent ref (dropdownRef) to work
const UserMenu = forwardRef(({ user, isAdmin, open, setOpen, logout, onOpenReport }, ref) => (
  <div className="relative" ref={ref}>
    <button onClick={() => setOpen((v) => !v)} className="group flex items-center gap-2 focus:outline-none" aria-haspopup="menu" aria-expanded={open}>
      <span className="hidden md:block font-medium text-gray-700">Xin chào, {user.username || user.email}</span>
      <div className="relative">
        <User className="w-7 h-7 text-gray-700 group-hover:text-blue-600 transition" />
        {isAdmin && <CheckCircle2 className="w-4 h-4 text-green-400 absolute -right-1 -bottom-1" title="Admin verified" />}
      </div>
      <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
        ▾
      </motion.span>
    </button>

    <AnimatePresence>
      {open && (
        <motion.div
          key="menu"
          className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-lg text-gray-800 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden origin-top-right z-[80]"
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 250, damping: 22 }}
        >
          <div className="px-5 py-3 border-b text-sm text-gray-500">
            <div className="font-semibold text-gray-800">Tài khoản của bạn</div>
            Quản lý thông tin và hoạt động
          </div>
          <MenuLink to="/profile" onClick={() => setOpen(false)}>
            <User className="w-4 h-4 text-blue-600" /> Hồ sơ cá nhân
          </MenuLink>
          <MenuLink to="/favorites" onClick={() => setOpen(false)}>
            <Heart className="w-4 h-4 text-pink-500" /> Tin yêu thích
          </MenuLink>
          <MenuLink to="/seller/dashboard" onClick={() => setOpen(false)}>
            <BarChart3 className="w-4 h-4 text-orange-500" /> Bảng điều khiển
          </MenuLink>
          <MenuLink to="/seller/vouchers" onClick={() => setOpen(false)}>
            <TicketPercent className="w-4 h-4 text-emerald-600" /> Voucher của tôi
          </MenuLink>

          {/* New: "Gửi đơn vi phạm" menu item */}
          <button
            onClick={() => {
              onOpenReport && onOpenReport();
            }}
            className="w-full flex items-center gap-3 px-5 py-2.5 hover:bg-blue-50 rounded-lg transition text-gray-700"
          >
            <Flag className="w-4 h-4 text-gray-700" /> Gửi đơn vi phạm
          </button>

          {isAdmin && (
            <>
              <div className="px-5 pt-2 pb-1 text-xs uppercase tracking-wide text-gray-400">Quản trị</div>
              <MenuLink to="/admin" onClick={() => setOpen(false)} bold>
                <Shield className="w-4 h-4 text-indigo-600" /> Admin Role Only
              </MenuLink>
            </>
          )}

          <button onClick={() => { logout(); setOpen(false); }} className="w-full flex items-center gap-2 text-left px-5 py-2.5 text-red-500 hover:bg-gray-50">
            <LogOut className="w-4 h-4" /> Đăng xuất
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
));

function MenuLink({ to, onClick, children, bold = false }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-5 py-2.5 hover:bg-blue-50 rounded-lg transition ${bold ? "font-semibold text-gray-900" : "text-gray-700"}`}
    >
      {children}
    </Link>
  );
}
