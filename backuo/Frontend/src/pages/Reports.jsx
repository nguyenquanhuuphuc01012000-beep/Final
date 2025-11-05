// src/pages/Reports.jsx
import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Flag, CheckCircle, MessageSquare, Trash2 } from "lucide-react";
import { format } from "date-fns";

export default function ReportsPage() {
  const { user } = useAuth();
  const [type, setType] = useState("product");
  const [targetId, setTargetId] = useState("");
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // admin list
  const [isAdmin, setIsAdmin] = useState(false);
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [listLoading, setListLoading] = useState(false);

  useEffect(() => {
    setIsAdmin((user?.role || "").toLowerCase() === "admin");
    if ((user?.role || "").toLowerCase() === "admin") fetchReports();
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!reason.trim()) return alert("Vui lòng nhập lý do.");
    setLoading(true);
    try {
      const payload = {
        type,
        target_id: targetId ? Number(targetId) : null,
        reason,
        details,
      };
      const res = await api.post("/api/reports", payload);
      setSuccessMsg("Gửi báo cáo thành công. Cảm ơn bạn đã giúp chúng tôi giữ an toàn.");
      setType("product");
      setTargetId("");
      setReason("");
      setDetails("");
      // optionally refresh admin list
      if (isAdmin) fetchReports();
    } catch (err) {
      console.error("Submit report error", err);
      alert(err?.response?.data?.error || "Gửi báo cáo thất bại");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMsg(""), 4000);
    }
  }

  async function fetchReports(p = page) {
    setListLoading(true);
    try {
      const res = await api.get("/api/reports", { params: { page: p, limit }});
      setReports(res.data.items || []);
      setTotal(res.data.total || 0);
      setPage(res.data.page || p);
    } catch (err) {
      console.error("Load reports", err);
    } finally {
      setListLoading(false);
    }
  }

  async function handleRespond(id, status, note) {
    try {
      const res = await api.patch(`/api/reports/${id}/respond`, { status, admin_response: note });
      // update local
      setReports((prev) => prev.map(r => (r.id === id ? res.data.report : r)));
    } catch (err) {
      console.error("Respond error", err);
      alert("Không thể cập nhật báo cáo.");
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <motion.h1 initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-2xl font-semibold mb-4">Gửi đơn vi phạm</motion.h1>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl shadow-sm border p-6 mb-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div className="flex gap-3 items-center">
            <label className="min-w-[110px] text-sm text-gray-600">Loại vi phạm</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="flex-1 border rounded px-3 py-2">
              <option value="product">Sản phẩm</option>
              <option value="user">Người dùng</option>
              <option value="post">Bài đăng</option>
              <option value="other">Khác</option>
            </select>
          </div>

          <div className="flex gap-3 items-center">
            <label className="min-w-[110px] text-sm text-gray-600">ID mục (nếu có)</label>
            <input value={targetId} onChange={(e)=>setTargetId(e.target.value)} placeholder="ví dụ: product id" className="flex-1 border rounded px-3 py-2" />
          </div>

          <div className="flex gap-3 items-start">
            <label className="min-w-[110px] text-sm text-gray-600">Lý do</label>
            <input value={reason} onChange={(e)=>setReason(e.target.value)} placeholder="ví dụ: vi phạm bản quyền, lừa đảo..." className="flex-1 border rounded px-3 py-2" />
          </div>

          <div className="flex gap-3 items-start">
            <label className="min-w-[110px] text-sm text-gray-600">Chi tiết</label>
            <textarea value={details} onChange={(e)=>setDetails(e.target.value)} placeholder="Mô tả chi tiết, đính kèm bằng chứng (link ảnh/...)" className="flex-1 min-h-[120px] border rounded px-3 py-2"></textarea>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow">
              {loading ? "Đang gửi..." : "Gửi báo cáo"}
            </button>
          </div>

          {successMsg && <div className="text-sm text-green-600">{successMsg}</div>}
        </form>
      </motion.div>

      {/* Admin section */}
      {isAdmin && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Danh sách báo cáo</h2>
            <div className="text-sm text-gray-500">Tổng: {total}</div>
          </div>

          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="divide-y">
              {listLoading ? (
                <div className="p-6 text-center text-gray-500">Đang tải...</div>
              ) : reports.length === 0 ? (
                <div className="p-6 text-center text-gray-500">Chưa có báo cáo.</div>
              ) : (
                reports.map((r) => (
                  <div key={r.id} className="p-4 border-b last:border-b-0 flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-semibold">{(r.reporter_username||"U").charAt(0)}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium text-gray-800">{r.reason} <span className="text-xs text-gray-400 ml-2">{r.type}</span></div>
                          <div className="text-xs text-gray-500">{r.details}</div>
                          <div className="text-xs text-gray-400 mt-1">Báo cáo bởi {r.reporter_username} · {format(new Date(r.created_at), "PPP p")}</div>
                        </div>
                        <div className="text-right text-sm">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${r.status === "closed" ? "bg-green-100 text-green-700" : r.status === "in_review" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"}`}>
                            {r.status}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <button onClick={()=>handleRespond(r.id, "in_review", (r.admin_response||"")+"")} className="px-3 py-1 rounded bg-yellow-50 text-yellow-700 text-sm">Mark in review</button>
                        <button onClick={()=>handleRespond(r.id, "closed", "Đã xử lý - hành động nội bộ")} className="px-3 py-1 rounded bg-green-50 text-green-700 text-sm">Đóng</button>
                        <button onClick={()=>navigator.clipboard.writeText(JSON.stringify(r))} className="px-3 py-1 rounded bg-gray-50 text-gray-700 text-sm">Copy</button>
                      </div>

                      {r.admin_response && <div className="mt-3 text-sm text-gray-600"><strong>Admin:</strong> {r.admin_response}</div>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mt-4">
            <button onClick={()=>fetchReports(Math.max(1, page-1))} disabled={page===1} className="px-3 py-1 border rounded disabled:opacity-60">Prev</button>
            <div className="px-3 py-1 border rounded">{page}</div>
            <button onClick={()=>fetchReports(page+1)} className="px-3 py-1 border rounded">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
