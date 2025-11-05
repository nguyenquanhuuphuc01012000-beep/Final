    // frontend/src/pages/ReportViolation.jsx
    import React, { useState } from "react";
    import api from "@/lib/api";
    import { motion } from "framer-motion";

    export default function ReportViolation() {
    const [targetType, setTargetType] = useState("product");
    const [targetId, setTargetId] = useState("");
    const [reason, setReason] = useState("");
    const [details, setDetails] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!targetType || !targetId || !reason) return setMessage("Vui lòng điền các trường bắt buộc.");
        setLoading(true);
        try {
        const res = await api.post("/api/disputes", { target_type: targetType, target_id: Number(targetId), reason, details });
        if (res.data?.ok) {
            setMessage("✅ Gửi báo cáo thành công. Chúng tôi sẽ xử lý sớm.");
            setTargetId(""); setReason(""); setDetails("");
        } else {
            setMessage(res.data?.error || "Gửi thất bại.");
        }
        } catch (err) {
        console.error("Report error", err);
        setMessage("Lỗi máy chủ.");
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
        <motion.div initial={{ opacity:0,y:6 }} animate={{ opacity:1,y:0 }} className="bg-white rounded-2xl p-6 shadow">
            <h2 className="text-lg font-semibold">Gửi đơn vi phạm</h2>
            <p className="text-sm text-gray-500">Gửi thông tin để đội ngũ UniTrade xem xét.</p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
                <label className="text-xs text-gray-400">Loại mục vi phạm</label>
                <select value={targetType} onChange={(e)=>setTargetType(e.target.value)} className="w-full mt-1 border rounded-lg p-2">
                <option value="product">Sản phẩm</option>
                <option value="post">Bài viết</option>
                <option value="user">Người dùng</option>
                </select>
            </div>

            <div>
                <label className="text-xs text-gray-400">ID mục (ví dụ product id)</label>
                <input value={targetId} onChange={(e)=>setTargetId(e.target.value)} className="w-full mt-1 border rounded-lg p-2" />
            </div>

            <div>
                <label className="text-xs text-gray-400">Lý do</label>
                <input value={reason} onChange={(e)=>setReason(e.target.value)} className="w-full mt-1 border rounded-lg p-2" placeholder="ví dụ: vi phạm bản quyền, lừa đảo..." />
            </div>

            <div>
                <label className="text-xs text-gray-400">Chi tiết (khuyến nghị đính kèm bằng chứng)</label>
                <textarea value={details} onChange={(e)=>setDetails(e.target.value)} rows={5} className="w-full mt-1 border rounded-lg p-2" />
            </div>

            <div className="flex justify-end gap-3">
                <button type="submit" disabled={loading} className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 text-white">{loading ? "Đang gửi..." : "Gửi báo cáo"}</button>
            </div>

            {message && <div className="text-sm text-gray-600 mt-2">{message}</div>}
            </form>
        </motion.div>
        </div>
    );
    }
