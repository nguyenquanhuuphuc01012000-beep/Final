// frontend/src/pages/admin/AdminDisputes.jsx
import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MessageCircle, CheckCircle, XCircle } from "lucide-react";

export default function AdminDisputes() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null); // dispute object
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/disputes", { params: { q: q || undefined, page, limit }, signal: ctrl.signal });
        setItems(res.data.items || []);
        setTotal(res.data.total || 0);
      } catch (err) {
        if (err.name !== "CanceledError") console.error("Load disputes error", err);
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, [q, page, limit]);

  const openDispute = (d) => {
    setSelected(d);
    setReplyText(d.admin_reply || "");
  };

  const submitReply = async (status) => {
    if (!selected) return;
    setReplyLoading(true);
    try {
      const body = { admin_reply: replyText || null };
      if (status) body.status = status;
      const res = await api.patch(`/api/disputes/${selected.id}/reply`, body);
      if (res.data?.ok) {
        // update local list
        setItems((prev) => prev.map((it) => (it.id === selected.id ? res.data.dispute : it)));
        setSelected(res.data.dispute);
      }
    } catch (err) {
      console.error("Reply error", err);
      alert("Lỗi khi trả lời.");
    } finally {
      setReplyLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Duyệt đơn vi phạm</h2>
          <div className="text-sm text-gray-500">Xem, duyệt và trả lời các báo cáo vi phạm</div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border rounded-full px-3 py-1">
            <Search className="w-4 h-4 text-gray-400" />
            <input value={q} onChange={(e)=>{setQ(e.target.value); setPage(1);}} className="outline-none px-2 py-1 text-sm" placeholder="Tìm tiêu đề, nội dung, loại..." />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-4">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Đang tải...</div>
          ) : items.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Không có báo cáo.</div>
          ) : (
            <div className="divide-y">
              {items.map((d) => (
                <div key={d.id} className="p-4 grid grid-cols-1 md:grid-cols-6 gap-3 items-start">
                  <div className="md:col-span-2">
                    <div className="font-medium text-gray-800">{d.target_type} #{d.target_id}</div>
                    <div className="text-sm text-gray-500">{d.reason}</div>
                  </div>
                  <div className="text-sm text-gray-600">{d.details ? (d.details.length>80?d.details.slice(0,80)+"...":d.details) : "-"}</div>
                  <div className="text-sm">{d.username || d.email}</div>
                  <div className="text-sm">{new Date(d.created_at).toLocaleString()}</div>
                  <div className="text-right">
                    <button onClick={()=>openDispute(d)} className="px-3 py-1 rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 text-white">Mở</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 py-3 border-t bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-600">Hiển thị {items.length} trên {total}</div>
          <div className="flex items-center gap-2">
            <button disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))} className="px-3 py-1 rounded-md border">Prev</button>
            <div className="px-3 py-1 bg-white border rounded-md text-sm">{page}</div>
            <button onClick={()=>setPage(p=>p+1)} className="px-3 py-1 rounded-md border">Next</button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ y: 10, scale: 0.98 }} animate={{ y:0, scale:1 }} exit={{ y:10, scale:0.98 }} className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold">{selected.target_type} #{selected.target_id}</div>
                      <div className="text-sm text-gray-500">{selected.username || selected.email} • {new Date(selected.created_at).toLocaleString()}</div>
                    </div>
                    <div className="text-sm font-medium">
                      <span className={`px-3 py-1 rounded-full text-xs ${selected.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : selected.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{selected.status}</span>
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-gray-700">
                    <div className="font-medium">Lý do</div>
                    <div className="mt-2">{selected.reason}</div>

                    <div className="mt-4 font-medium">Chi tiết</div>
                    <div className="mt-2 text-gray-600 whitespace-pre-wrap">{selected.details || "-"}</div>
                  </div>

                  <div className="mt-4">
                    <div className="text-xs text-gray-400">Trả lời của admin</div>
                    <textarea value={replyText} onChange={(e)=>setReplyText(e.target.value)} rows={4} className="w-full mt-2 border rounded-lg p-3 outline-none"></textarea>
                    <div className="mt-3 flex gap-2 justify-end">
                      <button onClick={()=>{ setSelected(null); }} className="px-4 py-2 rounded-md border">Đóng</button>

                      <button disabled={replyLoading} onClick={()=>submitReply('rejected')} className="px-4 py-2 rounded-md bg-red-50 text-red-600 border">Từ chối</button>
                      <button disabled={replyLoading} onClick={()=>submitReply('accepted')} className="px-4 py-2 rounded-md bg-green-600 text-white">Chấp nhận</button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
