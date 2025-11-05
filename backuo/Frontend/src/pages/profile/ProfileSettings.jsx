// src/pages/profile/ProfileSettings.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";

export default function ProfileSettings({ user, onUpdated }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    bank_name: user?.bank_name || "",
    bank_account: user?.bank_account || "",
    show_email: user?.show_email ?? true,
  });

  async function handleSave() {
    setSaving(true);
    try {
      const res = await api.put("/api/users/me", form);
      onUpdated && onUpdated(res.data.user);
      alert("Lưu thành công");
    } catch (err) {
      console.error(err);
      alert("Lưu thất bại");
    } finally {
      setSaving(false);
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Cài đặt cá nhân</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label>
          <div className="text-xs text-gray-500">Họ tên</div>
          <input value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} className="mt-1 w-full border rounded-lg px-3 py-2" />
        </label>

        <label>
          <div className="text-xs text-gray-500">Số điện thoại</div>
          <input value={form.phone} onChange={(e)=>setForm({...form, phone:e.target.value})} className="mt-1 w-full border rounded-lg px-3 py-2" />
        </label>

        <label>
          <div className="text-xs text-gray-500">Ngân hàng</div>
          <input value={form.bank_name} onChange={(e)=>setForm({...form, bank_name:e.target.value})} className="mt-1 w-full border rounded-lg px-3 py-2" />
        </label>

        <label>
          <div className="text-xs text-gray-500">Số tài khoản</div>
          <input value={form.bank_account} onChange={(e)=>setForm({...form, bank_account:e.target.value})} className="mt-1 w-full border rounded-lg px-3 py-2" />
        </label>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">Hiển thị email công khai</div>
        <input type="checkbox" checked={form.show_email} onChange={(e)=>setForm({...form, show_email:e.target.checked})} />
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-md">
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
        <button onClick={() => window.location.href="/profile"} className="px-4 py-2 border rounded-md">Hủy</button>
      </div>

    </motion.div>
  );
}
