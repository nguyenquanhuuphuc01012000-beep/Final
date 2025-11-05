// src/pages/profile/ProfileVerify.jsx
import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Upload } from "lucide-react";

export default function ProfileVerify() {
  const [ver, setVer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [school, setSchool] = useState("");
  const [note, setNote] = useState("");
  const [idCardFile, setIdCardFile] = useState(null);
  const [selfieFile, setSelfieFile] = useState(null);
  const [previewIdCard, setPreviewIdCard] = useState(null);
  const [previewSelfie, setPreviewSelfie] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/verification/me");
      setVer(res.data || null);
      if (res.data) {
        setStudentId(res.data.student_id_number || "");
        setSchool(res.data.school || "");
        setNote(res.data.note || "");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const onFile = (e, setter, previewSetter) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setter(f);
    previewSetter(URL.createObjectURL(f));
  };

  const submit = async (e) => {
    e?.preventDefault();
    if (!idCardFile || !selfieFile) return alert("Vui lòng tải lên ảnh thẻ và selfie.");
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("student_id_number", studentId);
      fd.append("school", school);
      fd.append("note", note);
      fd.append("id_card", idCardFile);
      fd.append("selfie", selfieFile);

      const res = await api.post("/api/verification/apply", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setVer(res.data.verification);
      alert("Gửi yêu cầu thành công — chờ admin xử lý.");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Gửi thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <motion.h2 className="text-2xl font-semibold mb-4" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
        Xác thực sinh viên
      </motion.h2>

      {loading ? (
        <div className="text-gray-500">Đang tải...</div>
      ) : ver ? (
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div>
                  {ver.status === "approved" ? (
                    <div className="text-green-600 inline-flex items-center gap-2"><CheckCircle /> Đã được xác thực</div>
                  ) : ver.status === "rejected" ? (
                    <div className="text-red-500 inline-flex items-center gap-2"><XCircle /> Bị từ chối</div>
                  ) : (
                    <div className="text-yellow-600 inline-flex items-center gap-2">⏳ Đang chờ xử lý</div>
                  )}
                </div>
                <div className="text-sm text-gray-500">Gửi lúc: {new Date(ver.created_at).toLocaleString()}</div>
              </div>

              <div className="mt-4 text-sm text-gray-700">
                <div><strong>Trường:</strong> {ver.school || "-"}</div>
                <div><strong>Mã / Số thẻ:</strong> {ver.student_id_number || "-"}</div>
                <div className="mt-2"><strong>Ghi chú:</strong> {ver.note || "-"}</div>
                {ver.admin_note && <div className="mt-2 text-sm text-gray-600"><strong>Ghi chú admin:</strong> {ver.admin_note}</div>}
              </div>
            </div>

            <div className="w-48 flex flex-col gap-2">
              {ver.id_card_url && (
                <img src={ver.id_card_url.startsWith("http") ? ver.id_card_url : `${process.env.VITE_API}/${ver.id_card_url}`} alt="idcard" className="rounded-md border" />
              )}
              {ver.selfie_url && (
                <img src={ver.selfie_url.startsWith("http") ? ver.selfie_url : `${process.env.VITE_API}/${ver.selfie_url}`} alt="selfie" className="rounded-md border" />
              )}
            </div>
          </div>
          <div className="mt-4 text-right">
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-sm text-gray-500 hover:underline">Nộp lại</button>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="bg-white rounded-2xl shadow p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-600">Trường (tên khoa / trường)</label>
            <input value={school} onChange={(e) => setSchool(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" placeholder="VD: Đại học FPT" />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Số / mã sinh viên</label>
            <input value={studentId} onChange={(e) => setStudentId(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" placeholder="VD: 181037..." />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Ghi chú (lý do / chứng minh)</label>
            <input value={note} onChange={(e) => setNote(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" placeholder="Thông tin thêm (tùy chọn)" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600 mb-2">Ảnh thẻ / CMND (id_card)</div>
              <label className="flex items-center gap-3 border border-dashed rounded p-3 cursor-pointer">
                <Upload className="w-5 h-5 text-blue-600" />
                <span className="text-sm">Chọn file</span>
                <input type="file" accept="image/*" onChange={(e) => onFile(e, setIdCardFile, setPreviewIdCard)} className="hidden" />
              </label>
              {previewIdCard && <img src={previewIdCard} className="mt-2 rounded-md max-h-40 object-cover" alt="preview" />}
            </div>

            <div>
              <div className="text-sm text-gray-600 mb-2">Ảnh selfie cùng thẻ (selfie)</div>
              <label className="flex items-center gap-3 border border-dashed rounded p-3 cursor-pointer">
                <Upload className="w-5 h-5 text-blue-600" />
                <span className="text-sm">Chọn file</span>
                <input type="file" accept="image/*" onChange={(e) => onFile(e, setSelfieFile, setPreviewSelfie)} className="hidden" />
              </label>
              {previewSelfie && <img src={previewSelfie} className="mt-2 rounded-md max-h-40 object-cover" alt="preview" />}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={load} className="px-4 py-2 rounded border">Huỷ</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 rounded bg-blue-600 text-white">
              {submitting ? "Đang gửi..." : "Gửi yêu cầu"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
