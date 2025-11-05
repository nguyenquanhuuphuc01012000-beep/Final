// src/components/report/ReportButton.jsx
import { useState } from "react";
import { Flag } from "lucide-react";
import ReportModal from "./ReportModal";

export default function ReportButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="Gửi đơn vi phạm"
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full hover:bg-gray-100 transition text-sm text-gray-700"
      >
        <Flag className="w-4 h-4" />
        <span className="hidden md:inline">Gửi đơn vi phạm</span>
      </button>

      <ReportModal open={open} onClose={(ok) => setOpen(false)} />
    </>
  );
}
