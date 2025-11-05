// Frontend/src/pages/admin/AdminUsers.jsx
import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  User,
  Trash2,
  Edit2,
  Shield,
  CheckCircle,
  XCircle,
  MoreHorizontal,
} from "lucide-react";
import { Link } from "react-router-dom";


/**
 * AdminUsers
 * - List users with server-side paging & search
 * - Actions: toggle active, change role (user <-> admin), delete
 * - Quick view modal
 *
 * Notes:
 * - API endpoints assumed:
 *   GET    /api/users?limit=20&page=1&q=<search>
 *   PATCH  /api/users/:id          { role?, is_active? }
 *   DELETE /api/users/:id
 * - If your backend endpoints differ, adjust the api.* calls accordingly.
 */

function IconButton({ children, title, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-50 transition ${className}`}
    >
      {children}
    </button>
  );
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [selected, setSelected] = useState(null); // user for quick view
  const [confirm, setConfirm] = useState(null); // { type, user }

  // fetch users
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/users", {
          params: { q: q || undefined, page, limit },
          signal: controller.signal,
        });
        // backend could return { rows, total } or array. handle both.
        const data = Array.isArray(res.data) ? res.data : res.data?.rows || res.data?.items || [];
        const t = res.data?.total ?? (Array.isArray(res.data) ? res.data.length : res.data?.total ?? 0);
        setUsers(data);
        setTotal(t || data.length);
      } catch (err) {
        if (err.name !== "CanceledError") console.error("Load users error", err);
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [q, page, limit]);

  const reload = () => {
    setPage(1);
    // trigger useEffect by mutating q to same value (no-op) or simply call fetch via a small helper.
    setQ((s) => s + ""); // cheap refresh
  };

  // optimistic update helper
  const updateLocalUser = (id, patch) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)));
  };

  // actions
  const toggleActive = async (u) => {
    const to = !u.is_active;
    const old = u.is_active;
    updateLocalUser(u.id, { is_active: to });
    try {
      await api.patch(`/api/users/${u.id}`, { is_active: to });
    } catch (err) {
      updateLocalUser(u.id, { is_active: old });
      console.error("Toggle active error", err);
      alert("Không thể thay đổi trạng thái người dùng.");
    }
  };

  const toggleAdmin = async (u) => {
    const newRole = (u.role || "user").toLowerCase() === "admin" ? "user" : "admin";
    const oldRole = u.role;
    updateLocalUser(u.id, { role: newRole });
    try {
      await api.patch(`/api/users/${u.id}`, { role: newRole });
    } catch (err) {
      updateLocalUser(u.id,{ role: oldRole });
      console.error("Change role error", err);
      alert("Không thể thay đổi role.");
    }
  };

  const removeUser = async (u) => {
    // optimistic remove visually, but keep backup
    const backup = users;
    setUsers((prev) => prev.filter((x) => x.id !== u.id));
    try {
      await api.delete(`/api/users/${u.id}`);
    } catch (err) {
      setUsers(backup);
      console.error("Delete user error", err);
      alert("Xóa user thất bại.");
    }
  };

  // UI helpers
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit + 1;
  const end = Math.min(total, page * limit);

  return (
    <div>
      {/* Header actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-800">Quản lý Người dùng</h2>
          <div className="text-sm text-gray-500">Tổng: {total}</div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border rounded-full px-3 py-1 shadow-sm">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
              placeholder="Tìm theo tên, email, username..."
              className="outline-none text-sm px-2 py-1 w-64"
            />
            <button
              onClick={() => { setQ(""); setPage(1); }}
              className="text-sm text-gray-500 hover:text-gray-700 transition"
            >
              Reset
            </button>
          </div>

          <Link to="/admin/users/create" className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm shadow">
            <User className="w-4 h-4" /> Tạo mới
          </Link>
        </div>
      </div>

      {/* Grid / table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center font-medium text-sm text-gray-600 border-b pb-3">
            <div className="md:col-span-2">Người dùng</div>
            <div>Email</div>
            <div>Role</div>
            <div>Trạng thái</div>
            <div className="text-right">Hành động</div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">Đang tải người dùng...</div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-gray-500">Không tìm thấy người dùng.</div>
          ) : (
            <div className="divide-y">
              {users.map((u) => (
                <div key={u.id} className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center py-4 px-3">
                  <div className="md:col-span-2 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                      { (u.username || u.email || "U").charAt(0).toUpperCase() }
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-gray-800 truncate">{u.fullname || u.username || u.email}</div>
                      <div className="text-xs text-gray-400 truncate">{u.username ? `@${u.username}` : ""}</div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">{u.email}</div>

                  <div className="text-sm">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                      (u.role || "user").toLowerCase() === "admin"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {(u.role || "user").toUpperCase()}
                    </span>
                  </div>

                  <div className="text-sm">
                    {u.is_active ? (
                      <span className="text-sm text-green-600 inline-flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Hoạt động</span>
                    ) : (
                      <span className="text-sm text-red-500 inline-flex items-center gap-2"><XCircle className="w-4 h-4" /> Vô hiệu</span>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="inline-flex items-center gap-1">
                      <IconButton
                        title="Xem nhanh"
                        onClick={() => setSelected(u)}
                      >
                        <motion.div whileTap={{ scale: 0.95 }}>
                          <MoreHorizontal className="w-5 h-5 text-gray-600" />
                        </motion.div>
                      </IconButton>

                      <IconButton
                        title={u.is_active ? "Vô hiệu hóa" : "Kích hoạt lại"}
                        onClick={() => setConfirm({ type: "toggleActive", user: u })}
                      >
                        <Shield className="w-5 h-5 text-gray-600" />
                      </IconButton>

                      <IconButton
                        title={ (u.role || "user").toLowerCase() === "admin" ? "Hạ quyền admin" : "Thăng quyền admin" }
                        onClick={() => setConfirm({ type: "toggleAdmin", user: u })}
                      >
                        <Edit2 className="w-5 h-5 text-gray-600" />
                      </IconButton>

                      <IconButton
                        title="Xóa người dùng"
                        onClick={() => setConfirm({ type: "delete", user: u })}
                        className="text-red-600"
                      >
                        <Trash2 className="w-5 h-5" />
                      </IconButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* pagination footer */}
        <div className="px-4 py-3 border-t bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Hiển thị {users.length ? `${start}-${end}` : "0"} trên {total} kết quả
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded-md border hover:bg-white disabled:opacity-60"
            >
              Prev
            </button>
            <div className="px-3 py-1 rounded-md bg-white border text-sm">{page} / {totalPages}</div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded-md border hover:bg-white disabled:opacity-60"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Quick view modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 12, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 12, scale: 0.98 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-2xl text-gray-600">
                  {(selected.username || selected.email || "U").charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-lg font-semibold text-gray-800">{selected.fullname || selected.username}</div>
                      <div className="text-sm text-gray-500">{selected.email}</div>
                    </div>
                    <div className="text-sm text-gray-500">{new Date(selected.created_at).toLocaleString()}</div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-600">
                    <div>
                      <div className="text-xs text-gray-400">Role</div>
                      <div className="mt-1 font-medium">{selected.role}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Trạng thái</div>
                      <div className="mt-1 font-medium">{selected.is_active ? "Hoạt động" : "Vô hiệu"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Số thông báo</div>
                      <div className="mt-1 font-medium">{selected.notifications_count ?? "-"}</div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <button
                      onClick={() => { setConfirm({ type: "toggleActive", user: selected }); }}
                      className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
                    >
                      {selected.is_active ? "Vô hiệu hóa" : "Kích hoạt"}
                    </button>

                    <button
                      onClick={() => { setConfirm({ type: "toggleAdmin", user: selected }); }}
                      className="px-4 py-2 rounded-md bg-white border hover:bg-gray-50"
                    >
                      {(selected.role || "user").toLowerCase() === "admin" ? "Hạ quyền" : "Thăng quyền"}
                    </button>
<Button
  onClick={() => handleResetPassword(user.id)}
  className="text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg px-3 py-1 transition-all"
>
  Reset mật khẩu
</Button>
                    <button
                      onClick={() => { setConfirm({ type: "delete", user: selected }); }}
                      className="px-4 py-2 rounded-md bg-red-50 text-red-600 border hover:bg-red-100"
                    >
                      Xóa user
                    </button>

                    <Link to={`/profile/${selected.id}`} className="ml-auto text-sm text-blue-600 hover:underline">
                      Mở hồ sơ đầy đủ
                    </Link>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-right">
                <button onClick={() => setSelected(null)} className="text-sm text-gray-500 hover:underline">Đóng</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm dialog */}
      <AnimatePresence>
        {confirm && (
          <motion.div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md"
            >
              <div className="text-lg font-semibold mb-2">
                {confirm.type === "delete" && "Xác nhận xóa người dùng"}
                {confirm.type === "toggleActive" && (confirm.user?.is_active ? "Xác nhận vô hiệu hóa" : "Xác nhận kích hoạt")}
                {confirm.type === "toggleAdmin" && (confirm.user?.role?.toLowerCase() === "admin" ? "Hạ quyền admin" : "Thăng quyền admin")}
              </div>
              <div className="text-sm text-gray-600 mb-4">
                Bạn có chắc muốn thực hiện hành động này trên <strong>{confirm.user?.email || confirm.user?.username}</strong> ?
              </div>

              <div className="flex items-center gap-3 justify-end">
                <button onClick={() => setConfirm(null)} className="px-4 py-2 rounded-md border">Hủy</button>
                <button
                  onClick={async () => {
                    const c = confirm;
                    setConfirm(null);
                    try {
                      if (c.type === "delete") {
                        await api.delete(`/api/users/${c.user.id}`);
                        setUsers((prev) => prev.filter((x) => x.id !== c.user.id));
                      } else if (c.type === "toggleActive") {
                        await api.patch(`/api/users/${c.user.id}`, { is_active: !c.user.is_active });
                        updateLocalAfterPatch(c.user.id, { is_active: !c.user.is_active });
                      } else if (c.type === "toggleAdmin") {
                        const newRole = (c.user.role || "user").toLowerCase() === "admin" ? "user" : "admin";
                        await api.patch(`/api/users/${c.user.id}`, { role: newRole });
                        updateLocalAfterPatch(c.user.id, { role: newRole });
                      }
                    } catch (err) {
                      console.error("Confirm action error", err);
                      alert("Hành động thất bại, thử lại sau.");
                    }
                  }}
                  className="px-4 py-2 rounded-md bg-gradient-to-r from-red-500 to-pink-500 text-white"
                >
                  Xác nhận
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // helper function inside component to keep patch local updates consistent
  function updateLocalAfterPatch(id, patch) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)));
    // if selected is this user update too
    setSelected((s) => (s && s.id === id ? { ...s, ...patch } : s));
  }
}
