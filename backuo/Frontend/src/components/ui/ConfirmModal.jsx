// src/components/ui/ConfirmModal.jsx
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { XCircle, CheckCircle2, X } from "lucide-react";

export default function ConfirmModal({ show, onConfirm, onCancel, title, message }) {
  if (!show) return null;

  return createPortal(
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[200]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl text-center"
          >
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{title || "Xác nhận xoá"}</h2>
            <p className="text-gray-600 mb-6">{message || "Bạn có chắc muốn xoá mục này không?"}</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
              >
                Hủy
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition"
              >
                Xóa
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
