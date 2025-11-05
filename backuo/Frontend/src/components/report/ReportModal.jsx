// src/components/report/ReportModal.jsx
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { X, Upload, FileText, Flag, Copy, CheckCircle } from "lucide-react";

/**
 * ReportModal
 * Props:
 *  - open: boolean
 *  - onClose: () => void
 *
 * Behavior:
 *  - generate a friendly report id when opened
 *  - form: type, target (url/id), description, attachments (multiple)
 *  - validation + previews
 *  - POST /api/reports (multipart/form-data)
 *  - shows success state with copyable report id
 */

const REPORT_TYPES = [
  { value: "spam", label: "Spam / Quảng cáo" },
  { value: "fraud", label: "Lừa đảo / Gian lận" },
  { value: "copyright", label: "Vi phạm bản quyền" },
  { value: "abuse", label: "Lạm dụng / Quấy rối" },
  { value: "other", label: "Khác" },
];

export default function ReportModal({ open, onClose }) {
  const [reportId, setReportId] = useState("");
  const [type, setType] = useState("spam");
  const [target, setTarget] = useState(""); // product url / post id / user email...
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]); // File objects
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null); // server response or true
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      // generate friendly id when opening
      const id = `RPT-${Date.now().toString(36).slice(-6).toUpperCase()}`;
      setReportId(id);
      // reset form (keep values? we reset except maybe target if prefilling later)
      setType("spam");
      setDescription("");
      setFiles([]);
      setError("");
      setSubmitting(false);
      setSuccess(null);
      // focus target input after small delay
      setTimeout(() => inputRef.current?.focus?.(), 120);
    }
  }, [open]);

  const handleFiles = (e) => {
    const list = Array.from(e.target.files || []);
    // limit and filter
    const allowed = list.filter((f) => f.size <= 10 * 1024 * 1024); // 10MB per file
    if (allowed.length < list.length) {
      setError("Một số file bị loại (vượt quá 10MB).");
    } else {
      setError("");
    }
    setFiles((prev) => [...prev, ...allowed].slice(0, 6)); // max 6 files
    e.target.value = null;
  };

  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!target.trim()) {
      setError("Vui lòng nhập link sản phẩm / id hoặc email liên quan.");
      return;
    }
    if (!description.trim() || description.trim().length < 12) {
      setError("Mô tả ngắn gọn (ít nhất 12 ký tự).");
      return;
    }

    setSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("report_id", reportId);
      fd.append("type", type);
      fd.append("target", target.trim());
      fd.append("description", description.trim());
      files.forEach((f, i) => fd.append("evidence", f)); // backend should accept multiple 'evidence'

      // optional: include reporter id automatically by backend (from JWT)
      const res = await api.post("/api/reports", fd, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (p) => {
          // could show progress if desired (p.loaded / p.total)
        },
      });

      // success
      setSuccess(res.data || { ok: true, report_id: reportId });
      setSubmitting(false);
    } catch (err) {
      console.error("Report submit error", err);
      setError(err?.response?.data?.error || "Gửi đơn thất bại, thử lại sau.");
      setSubmitting(false);
    }
  };

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(success?.report_id || reportId);
      // tiny UI feedback: replace copy icon with check for 1.6s
      setSuccess((s) => ({ ...(s || {}), copied: true }));
      setTimeout(() => setSuccess((s) => (s ? { ...s, copied: false } : s)), 1600);
    } catch {}
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="report-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-gray-100 overflow-hidden"
            initial={{ y: 20, opacity: 0, scale: 0.995 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 12, opacity: 0, scale: 0.995 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div className="flex items-center gap-3">
                <Flag className="w-6 h-6 text-red-500" />
                <div>
                  <div className="text-lg font-semibold text-gray-800">Gửi đơn vi phạm</div>
                  <div className="text-sm text-gray-500">Gửi đơn để đội ngũ UniTrade xử lý</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border text-sm text-gray-600">
                  <FileText className="w-4 h-4" />
                  <div className="select-none text-xs">{reportId}</div>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 rounded-md hover:bg-gray-100 transition"
                  aria-label="Đóng"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <form onSubmit={onSubmit} className="px-6 py-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <div className="text-sm text-gray-600 mb-1">Loại vi phạm</div>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none"
                  >
                    {REPORT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <div className="text-sm text-gray-600 mb-1">Liên quan tới (link / id / email)</div>
                  <input
                    ref={inputRef}
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="Ví dụ: /products/1234 hoặc user@example.com"
                    className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none"
                  />
                </label>
              </div>

              <div className="mt-4">
                <div className="text-sm text-gray-600 mb-2">Mô tả chi tiết</div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="Mô tả chi tiết: điều gì xảy ra, bằng chứng, thời gian,..."
                  className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none resize-none"
                />
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600 mb-2">Tải chứng cứ (tối đa 6 file, 10MB/file)</div>
                  <div className="text-xs text-gray-400">jpg, png, pdf, mp4...</div>
                </div>

                <div className="flex items-center gap-3">
                  <label
                    htmlFor="evidence"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border hover:bg-gray-100 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span className="text-sm text-gray-700">Chọn file</span>
                  </label>
                  <input id="evidence" type="file" accept="image/*,video/*,application/pdf" multiple className="hidden" onChange={handleFiles} />

                  <div className="text-sm text-gray-500">{files.length} file đã chọn</div>
                </div>

                {files.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {files.map((f, i) => {
                      const url = URL.createObjectURL(f);
                      const isImg = f.type.startsWith("image/");
                      return (
                        <div key={i} className="relative rounded-lg overflow-hidden border">
                          {isImg ? (
                            <img src={url} alt={f.name} className="w-full h-20 object-cover" />
                          ) : (
                            <div className="w-full h-20 flex items-center justify-center bg-gray-50 text-xs text-gray-600 px-2 text-center">
                              <div>
                                <div className="font-medium">{f.name.length > 20 ? f.name.slice(0, 18) + "…" : f.name}</div>
                                <div className="text-[11px] text-gray-400 mt-1">{(f.size / 1024 / 1024).toFixed(2)} MB</div>
                              </div>
                            </div>
                          )}
                          <button type="button" onClick={() => removeFile(i)} className="absolute top-1 right-1 p-1 rounded-full bg-white/80 hover:bg-white">
                            <X className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

              <div className="mt-6 flex items-center gap-3 justify-end">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={onClose}
                  className="px-4 py-2 rounded-md border hover:bg-gray-50"
                >
                  Hủy
                </button>

                {!success ? (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold shadow"
                  >
                    {submitting ? "Đang gửi..." : "Gửi đơn"}
                    <FileText className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="flex items-center gap-3 bg-green-50 px-3 py-2 rounded-md border border-green-100">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div className="text-sm">
                      <div className="font-semibold">Gửi thành công</div>
                      <div className="text-xs text-gray-600">Mã đơn: <span className="font-medium">{success.report_id || reportId}</span></div>
                    </div>

                    <button
                      type="button"
                      onClick={copyId}
                      className="ml-3 px-2 py-1 rounded-md bg-white border text-sm hover:bg-gray-50"
                      title="Sao chép mã đơn"
                    >
                      {success?.copied ? <span className="flex items-center gap-1 text-green-600"><CheckCircle className="w-4 h-4" /> Đã sao chép</span> : <span className="flex items-center gap-1"><Copy className="w-4 h-4" /> Sao chép</span>}
                    </button>

                    <button
                      type="button"
                      onClick={() => { setSuccess(null); setReportId(`RPT-${Date.now().toString(36).slice(-6).toUpperCase()}`); setFiles([]); setDescription(""); }}
                      className="ml-2 px-2 py-1 rounded-md bg-white border text-sm hover:bg-gray-50"
                    >
                      Gửi đơn mới
                    </button>
                  </div>
                )}
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
