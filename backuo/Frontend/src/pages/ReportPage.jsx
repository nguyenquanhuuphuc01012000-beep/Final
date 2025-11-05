// src/pages/ReportPage.jsx
import React, { useState, useRef } from "react";
import api from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { X, Paperclip, Plus, Check, ArrowLeft } from "lucide-react";

/**
 * ReportPage
 * - Full-page report form (can replace modal)
 * - POST /api/reports (FormData):
 *     { type, target_id, reason, details, files[] }
 *
 * Usage:
 * - Add route: <Route path="/report" element={<PrivateRoute><PageWrapper><ReportPage/></PageWrapper></PrivateRoute>} />
 */

const TYPES = [
  { value: "product", label: "Sản phẩm" },
  { value: "post", label: "Bài viết" },
  { value: "user", label: "Người dùng" },
  { value: "other", label: "Khác" },
];

export default function ReportPage() {
  const [type, setType] = useState("product");
  const [targetId, setTargetId] = useState("");
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const inputFileRef = useRef(null);
  const navigate = useNavigate();

  const onSelectFiles = (e) => {
    const chosen = Array.from(e.target.files || []);
    const combined = [...files, ...chosen].slice(0, 4); // max 4
    setFiles(combined);
    // reset input so same file can be re-selected if removed
    e.target.value = null;
  };

  const removeFileAt = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const submit = async (e) => {
    e?.preventDefault();
    setError(null);
    if (!reason.trim()) return setError("Vui lòng nhập lý do ngắn gọn.");
    setSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("type", type);
      if (targetId) fd.append("target_id", targetId);
      fd.append("reason", reason);
      fd.append("details", details);
      files.forEach((f, i) => fd.append("files", f, f.name));

      const res = await api.post("/api/reports", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(res.data?.message || "Gửi báo cáo thành công. Cảm ơn bạn đã phản ánh!");
      setFiles([]);
      setReason("");
      setDetails("");
      setTargetId("");
    } catch (err) {
      console.error("Submit report error", err);
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Gửi thất bại. Vui lòng thử lại sau.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.22 }}
      className="max-w-4xl mx-auto p-6"
    >
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-md hover:bg-gray-50 transition"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Gửi đơn vi phạm</h1>
            <p className="text-sm text-gray-500">Gửi thông tin để UniTrade xét và xử lý.</p>
          </div>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4">
          {/* Type + target */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="flex flex-col">
              <span className="text-sm text-gray-600 mb-2">Loại mục vi phạm</span>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-200"
              >
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="sm:col-span-2 flex flex-col">
              <span className="text-sm text-gray-600 mb-2">ID mục (ví dụ product id)</span>
              <input
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                placeholder="Không bắt buộc — nhập để định danh mục vi phạm"
                className="px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-200"
              />
            </label>
          </div>

          {/* reason */}
          <div>
            <label className="flex flex-col">
              <span className="text-sm text-gray-600 mb-2">Lý do (tóm tắt)</span>
              <input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="ví dụ: vi phạm bản quyền, lừa đảo, hàng giả..."
                className="px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-200"
                required
              />
            </label>
          </div>

          {/* details */}
          <div>
            <label className="flex flex-col">
              <span className="text-sm text-gray-600 mb-2">Chi tiết (khuyến nghị đính kèm bằng chứng)</span>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={6}
                placeholder="Mô tả chi tiết vụ việc, link tham khảo, tên người bán, thời gian,..."
                className="px-3 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-200 resize-none"
              />
            </label>
          </div>

          {/* attachments */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <Paperclip className="w-4 h-4" /> Đính kèm bằng chứng (tối đa 4 file)
              </div>
              <div className="text-xs text-gray-400">Hỗ trợ ảnh/pdf - 10MB/file</div>
            </div>

            <div className="flex items-center gap-3">
              <input
                ref={inputFileRef}
                type="file"
                accept="image/*,application/pdf"
                multiple
                onChange={onSelectFiles}
                className="hidden"
                id="report-files"
              />
              <button
                type="button"
                onClick={() => inputFileRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-95 transition"
              >
                <Plus className="w-4 h-4" /> Thêm file
              </button>

              <div className="flex-1">
                {files.length === 0 ? (
                  <div className="text-sm text-gray-400">Chưa có file</div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {files.map((f, i) => {
                      const isImage = f.type?.startsWith?.("image/");
                      const url = isImage ? URL.createObjectURL(f) : null;
                      return (
                        <div key={i} className="relative border rounded-lg overflow-hidden bg-gray-50">
                          {isImage ? (
                            <img src={url} alt={f.name} className="w-full h-24 object-cover" />
                          ) : (
                            <div className="w-full h-24 flex items-center justify-center text-sm text-gray-600 px-2">
                              <div className="text-center">
                                <div className="font-medium">{f.name}</div>
                                <div className="text-xs text-gray-400">{Math.round(f.size / 1024)} KB</div>
                              </div>
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => removeFileAt(i)}
                            className="absolute top-1 right-1 bg-white/80 p-1 rounded-full hover:bg-white transition"
                          >
                            <X className="w-4 h-4 text-gray-700" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* error / success */}
          {error && <div className="text-sm text-red-600">{error}</div>}
          {success && <div className="text-sm text-green-600 flex items-center gap-2"><Check className="w-4 h-4" /> {success}</div>}

          {/* actions */}
          <div className="flex items-center gap-3 justify-end pt-2 border-t">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-lg border hover:bg-gray-50 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              onClick={submit}
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold disabled:opacity-60"
            >
              {submitting ? "Đang gửi..." : "Gửi báo cáo"}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
