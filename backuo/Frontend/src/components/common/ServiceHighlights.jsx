// src/components/common/ServiceHighlights.jsx
import { motion } from "framer-motion";
import { Truck, PiggyBank, Percent, Headphones, UserCheck } from "lucide-react";

/**
 * ServiceHighlights
 * - Thay "Xử lý khiếu nại" bằng "Xác thực sinh viên"
 * - Thiết kế tối giản, hợp với ngôn ngữ UniTrade (gradient, shadow, subtle motion)
 */

const FEATURES = [
  {
    icon: UserCheck,
    title: "Xác thực sinh viên",
    desc: "Xác minh thẻ/sinh viên để nhận ưu đãi & bật huy hiệu Verified — gia tăng niềm tin khi giao dịch trong cộng đồng.",
    badge: "Verified",
  },
  {
    icon: PiggyBank,
    title: "Thanh toán an toàn",
    desc: "Giao dịch bảo mật, mã hoá thông tin và chính sách hoàn/hoàn tiền rõ ràng cho người mua.",
  },
  {
    icon: Percent,
    title: "Ưu đãi sinh viên",
    desc: "Mã giảm giá & chương trình hợp tác dành riêng cho sinh viên từ CLB và cửa hàng đối tác.",
  },
  {
    icon: Headphones,
    title: "Hỗ trợ 24/7",
    desc: "Đội ngũ UniTrade sẵn sàng trợ giúp qua chat hoặc ticket — xử lý nhanh và thân thiện.",
  },
];

export default function ServiceHighlights() {
  return (
    <section className="bg-gradient-to-b from-white via-blue-50 to-white py-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 text-center mb-10">
        <motion.h2
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-extrabold text-gray-800"
        >
          Tại sao chọn <span className="text-blue-600">UniTrade</span>
        </motion.h2>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mx-auto mt-3 h-1 w-24 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 origin-left"
        />
        <p className="mt-4 text-sm text-gray-500 max-w-2xl mx-auto">
          Nền tảng mua bán dành cho cộng đồng sinh viên — an toàn, minh bạch và nhiều ưu đãi.
        </p>
      </div>

      {/* Grid */}
      <motion.div
        className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12 } },
        }}
      >
        {FEATURES.map((f, idx) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              className="relative bg-white rounded-2xl p-6 flex flex-col items-start gap-4 shadow-sm hover:shadow-lg border border-transparent hover:border-blue-50 transition"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="flex items-center justify-center rounded-xl w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 border border-gray-100 shadow-inner">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-gray-800 truncate">{f.title}</h3>
                    {f.badge && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-semibold">
                        {f.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1 truncate">{f.desc}</p>
                </div>
              </div>

              {/* optional CTA for first card (xác thực) */}
              {f.title === "Xác thực sinh viên" && (
                <div className="mt-2">
                  <a
                    href="/profile/verify"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium shadow-md hover:opacity-95 transition"
                  >
                    Xác thực ngay
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
