// src/pages/admin/AdminVerifications.jsx
import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminVerifications() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const res = await api.get("/api/verification", { params: { page: p, limit: 20 } });
      setItems(res.data.items || []);
      setTotal(res.data.total || 0);
      setPage(res.data.page || p);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleAction = async (id, action) => {
    const note = action === "rejected" ? prompt("Ghi chú/ lý do từ chối (tùy chọn)") : "";
    try {
      await api.patch(`/api/verification/${id}`, { status: action, admin_note: note });
      load(page);
    } catch (e) {
      console.error(e);
      alert("Thao tác thất bại");
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-4">Duyệt xác thực sinh viên</h3>
      {loading ? <div>Đang tải...</div> : (
        <div className="bg-white rounded-2xl shadow p-4">
          {items.length === 0 ? <div className="text-gray-500 p-6">Không có yêu cầu.</div> : (
            <div className="divide-y">
              {items.map((it) => (
                <div key={it.id} className="flex items-start gap-4 p-3">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-sm">{(it.username || it.email || "U").charAt(0)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{it.username || it.email}</div>
                        <div className="text-sm text-gray-500">{it.school || "-"}</div>
                      </div>
                      <div className="text-sm text-gray-400">{new Date(it.created_at).toLocaleString()}</div>
                    </div>

                    <div className="mt-2 text-sm text-gray-700">{it.note}</div>

                    <div className="mt-3 flex items-center gap-3">
                      {it.id_card_url && <a href={it.id_card_url.startsWith("http") ? it.id_card_url : `${process.env.VITE_API}/${it.id_card_url}`} target="_blank" rel="noreferrer" className="text-sm underline">Xem thẻ</a>}
                      {it.selfie_url && <a href={it.selfie_url.startsWith("http") ? it.selfie_url : `${process.env.VITE_API}/${it.selfie_url}`} target="_blank" rel="noreferrer" className="text-sm underline">Xem selfie</a>}
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <button onClick={() => handleAction(it.id, "approved")} className="px-3 py-1 rounded bg-green-600 text-white text-sm">Chấp nhận</button>
                      <button onClick={() => handleAction(it.id, "rejected")} className="px-3 py-1 rounded bg-red-50 text-red-600 text-sm border">Từ chối</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
