import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API || "http://localhost:5000";

export default function HeaderHero() {
  const [banners, setBanners] = useState([]);
  const [index, setIndex] = useState(0);

  // 🧠 Lấy danh sách banner từ backend
  useEffect(() => {
    fetch(`${API}/api/banner`)
      .then((res) => res.json())
      .then((data) => setBanners(data || []))
      .catch(console.error);
  }, []);

  // 🔁 Auto next mỗi 5s
  useEffect(() => {
    if (!banners.length) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  // animation variants
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.06,
      },
    },
  };
  const fadeInLeft = {
    hidden: { opacity: 0, x: -28 },
    show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  return (
    <section className="bg-white py-16 md:py-20 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
        {/* LEFT SIDE - redesigned but logic preserved */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-xl md:max-w-2xl lg:max-w-xl relative"
        >
          {/* subtle floating decorative accent (absolute, decorative only) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 0.06, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.25 }}
            aria-hidden="true"
            className="pointer-events-none hidden md:block"
            style={{
              position: "absolute",
              right: -80,
              top: 10,
              width: 260,
              height: 260,
              zIndex: 0,
            }}
          >
            <div className="w-full h-full rounded-3xl bg-gradient-to-tr from-indigo-200 to-blue-100 blur-3xl" />
          </motion.div>

          {/* Badge */}
          <motion.div variants={fadeInLeft} className="inline-flex items-center gap-3 mb-6 relative z-10">
            <span className="relative inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold">
              <span className="absolute inset-0 rounded-full blur-xl opacity-30 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500" />
              <span className="relative z-10 text-blue-700">Nền tảng sinh viên 2025</span>
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeInLeft}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-4 relative z-10"
          >
            Chợ thương mại{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500 underline decoration-2 underline-offset-6">
              UniTrade
            </span>{" "}
            dành cho{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">
              Sinh Viên
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeInLeft}
            className="text-slate-600 mb-8 leading-relaxed max-w-md relative z-10"
          >
            UniTrade là nơi kết nối cộng đồng sinh viên trên toàn quốc — nơi bạn có thể
            mua bán đồ 2nd, sách vở, phụ kiện học tập hay đồ công nghệ với mức giá tiết
            kiệm, an toàn và nhanh chóng.
          </motion.p>

          {/* CTA buttons */}
          <motion.div variants={fadeInLeft} className="flex flex-wrap items-center gap-4 mb-10 relative z-10">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/products"
                className={
                  "inline-flex items-center gap-3 px-6 py-3 rounded-full text-white font-medium shadow-lg " +
                  "bg-gradient-to-r from-blue-600 to-indigo-600 ring-1 ring-indigo-50"
                }
              >
                <svg
                  className="w-4 h-4 -ml-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                Khám phá ngay →
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/about"
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-slate-200 text-slate-700 bg-white/60 backdrop-blur-sm font-medium hover:bg-slate-50 transition"
              >
                Về UniTrade
              </Link>
            </motion.div>
          </motion.div>

          {/* Features */}
          <motion.div variants={fadeInLeft} className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm relative z-10">
            <Feature icon="📦" text="Đăng tin nhanh chóng" />
            <Feature icon="🛡️" text="Giao dịch an toàn" />
            <Feature icon="💰" text="Giá sinh viên cực rẻ" />
          </motion.div>
        </motion.div>

        {/* RIGHT SIDE: Banner slideshow (dynamic) */}
        <div className="relative w-full h-[400px] flex justify-center items-center">
          <div className="relative w-full max-w-[520px] h-[320px] rounded-2xl overflow-hidden shadow-xl bg-gray-50 z-10">
            {banners.length > 0 ? (
              <AnimatePresence initial={false}>
                <motion.img
                  key={banners[index].id}
                  src={`${API}${banners[index].image_url}`}
                  alt={`Banner ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
              </AnimatePresence>
            ) : (
              <div className="flex justify-center items-center w-full h-full text-gray-400">
                Đang tải banner...
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/10 to-transparent" />
          </div>

          {/* Indicator dots */}
          {banners.length > 1 && (
            <div className="absolute bottom-4 flex gap-2 z-20">
              {banners.map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i === index ? "bg-blue-600 scale-125" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Feature({ icon, text }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
        <span className="text-lg">{icon}</span>
      </div>
      <div className="text-sm text-slate-600">{text}</div>
    </div>
  );
}
