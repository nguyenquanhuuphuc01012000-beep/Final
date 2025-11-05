// AdminNotify.jsx
import { useState } from "react";
import api from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone, CheckCircle, XCircle } from "lucide-react";

export default function AdminNotify() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState(""); // textual feedback
  const [status, setStatus] = useState(null); // "success" | "error" | null
  const [sendToAll, setSendToAll] = useState(true);
  const [targetIds, setTargetIds] = useState("");

  const parseIds = (raw) => {
    if (!raw) return [];
    return raw
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isInteger(n) && n > 0);
  };

  const reset = () => {
    setTitle("");
    setBody("");
    setTargetIds("");
    setSendToAll(true);
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    setMessage("");
    setStatus(null);

    if (!title.trim()) {
      setMessage("Vui lòng nhập tiêu đề.");
      setStatus("error");
      return;
    }

    setSending(true);
    try {
      const payload = {
        title: title.trim(),
        body: body.trim(),
        target: sendToAll ? "all" : parseIds(targetIds),
      };

      const res = await api.post("/api/notifications", payload);
      const inserted = res?.data?.inserted ?? null;

      if (inserted === 0) {
        setMessage("Không tìm thấy người dùng phù hợp — không có thông báo nào được tạo.");
        setStatus("error");
      } else if (inserted > 0) {
        setMessage(`Đã gửi thông báo tới ${inserted} người dùng.`);
        setStatus("success");
        reset();
      } else {
        setMessage("Đã gửi (kết quả server không trả về số lượng).");
        setStatus("success");
        reset();
      }
    } catch (err) {
      console.error("AdminNotify send error:", err);
      const detail =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Lỗi khi gửi thông báo.";
      setMessage(`Gửi thất bại — ${detail}`);
      setStatus("error");
    } finally {
      setSending(false);
      // auto-hide toast after 4s
      setTimeout(() => {
        setStatus(null);
        setMessage("");
      }, 4000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: form */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-md border border-gray-100 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <Megaphone className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Gửi thông báo</h3>
              <p className="text-sm text-gray-500">Gửi tới toàn bộ người dùng hoặc một số user cụ thể.</p>
            </div>
          </div>

          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề</label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Tiêu đề"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 transition shadow-sm"
                disabled={sending}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung</label>
              <motion.textarea
                whileFocus={{ scale: 1.01 }}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Nội dung thông báo..."
                className="w-full rounded-lg border border-gray-200 px-4 py-3 h-40 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 transition shadow-sm"
                disabled={sending}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-4">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="target"
                    checked={sendToAll}
                    onChange={() => setSendToAll(true)}
                    className="accent-blue-600"
                    disabled={sending}
                  />
                  <span className="text-sm text-gray-700">Gửi đến toàn bộ người dùng</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="target"
                    checked={!sendToAll}
                    onChange={() => setSendToAll(false)}
                    className="accent-blue-600"
                    disabled={sending}
                  />
                  <span className="text-sm text-gray-700">Gửi tới user cụ thể</span>
                </label>
              </div>

              <motion.button
                whileHover={{ scale: sending ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={sending}
                className={`inline-flex items-center gap-3 justify-center px-6 py-3 rounded-full text-white font-semibold shadow-md transition ${
                  sending
                    ? "bg-gray-300 cursor-not-allowed text-gray-700"
                    : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                }`}
              >
                {sending ? "Đang gửi..." : "Gửi thông báo"}
              </motion.button>
            </div>

            {!sendToAll && (
              <div className="mt-2">
                <label className="block text-sm text-gray-600 mb-1">Danh sách user ID (phân cách bằng dấu phẩy)</label>
                <input
                  value={targetIds}
                  onChange={(e) => setTargetIds(e.target.value)}
                  placeholder="ví dụ: 12,45,98"
                  disabled={sending}
                  className="w-full rounded-md border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            )}
          </form>
        </motion.div>

        {/* Right: status / helper card */}
        <motion.aside
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-md border border-gray-100 p-5 flex flex-col gap-4"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-11 h-11 rounded-lg bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center">
                <Megaphone className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-800">Ghi chú</h4>
              <p className="text-sm text-gray-500">Thông báo sẽ được lưu và phát tới các user đang online qua WebSocket.</p>
            </div>
          </div>

          <div className="pt-1">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Gửi mặc định</span>
              <span className="font-medium text-gray-800">{sendToAll ? "Toàn bộ" : "User cụ thể"}</span>
            </div>
            <div className="text-xs text-gray-500">Bạn có thể gửi tới user cụ thể bằng cách nhập ID (được hiển thị trong Admin → Người dùng).</div>
          </div>

          <div className="mt-auto">
            <button
              onClick={() => {
                setTitle("");
                setBody("");
                setTargetIds("");
                setSendToAll(true);
                setMessage("");
                setStatus(null);
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              Reset form
            </button>
          </div>
        </motion.aside>
      </div>

      {/* Toast / feedback */}
      <AnimatePresence>
        {status && message && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.28 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md`}
          >
            <div
              className={`mx-4 px-4 py-3 rounded-2xl shadow-lg border ${
                status === "success" ? "bg-white border-green-100" : "bg-white border-red-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {status === "success" ? (
                    <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
                      <XCircle className="w-5 h-5 text-red-500" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">
                    {status === "success" ? "Gửi thành công" : "Lỗi"}
                  </div>
                  <div className="text-sm text-gray-600">{message}</div>
                </div>
                <button
                  onClick={() => {
                    setStatus(null);
                    setMessage("");
                  }}
                  className="ml-auto text-gray-400 hover:text-gray-600"
                  aria-label="Đóng"
                >
                  ✕
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
