import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { genPassword, copyToClipboard } from "@/utils/password";
import { Check, Copy, X } from "lucide-react";

export default function ResetPasswordModal({ open, onClose, onConfirm, user }) {
  const [pwd, setPwd] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      setPwd(genPassword());
      setCopied(false);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: -8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: -8 }}
        transition={{ duration: 0.18 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 z-10"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Đặt lại mật khẩu cho</h3>
            <div className="text-sm text-gray-600">{user?.email || user?.username}</div>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <label className="block text-sm text-gray-500">Mật khẩu mới</label>
          <div className="flex items-center gap-2">
            <input
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200 outline-none"
            />
            <button
              type="button"
              onClick={() => { setPwd(genPassword()); setCopied(false); }}
              className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            >
              Random
            </button>
            <button
              type="button"
              onClick={async () => {
                const ok = await copyToClipboard(pwd);
                setCopied(ok);
                setTimeout(() => setCopied(false), 1800);
              }}
              className="px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              {copied ? <span className="text-sm text-green-600 flex items-center gap-1"><Check className="w-4 h-4"/>Copied</span> : "Copy"}
            </button>
          </div>

          <div className="text-xs text-gray-500">Gợi ý: dùng tổ hợp ký tự phức tạp hơn cho production.</div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg hover:bg-gray-100">Huỷ</button>
          <button
            onClick={() => onConfirm(pwd)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow"
          >
            Xác nhận đặt lại
          </button>
        </div>
      </motion.div>
    </div>
  );
}
