// About.jsx (fixed)
import React, { useRef } from "react";
import { motion, useScroll, useTransform, motionValue, animate } from "framer-motion";
import {
  Users,
  Target,
  Leaf,
  HeartHandshake,
  TrendingUp,
  GraduationCap,
  Rocket,
  Sparkles,
  Clock,
  Tag,
  MessageSquare,
  CheckCircle2,
  FileText,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Fixed About component:
 * - Adds position: "relative" to the scroll target container (fixes framer-motion warning)
 * - Removes any stray 'index' references (use `i` consistently in maps)
 * - Uses imported motionValue & animate for AnimatedCounter
 */

export default function About() {
  const ref = useRef(null);

  // IMPORTANT: container must be non-static for useScroll target calculations
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const parallax = useTransform(scrollYProgress, [0, 1], [0, -120]);

  const features = [
    {
      icon: <CheckCircle2 className="w-8 h-8 text-blue-600" />,
      title: "Xác thực sinh viên",
      desc: "Email/mã số SV xác minh — giảm tài khoản ảo, tăng niềm tin trong cộng đồng.",
    },
    {
      icon: <Tag className="w-8 h-8 text-blue-600" />,
      title: "Đăng tin nhanh & Ghim bài",
      desc: "Đăng và quản lý tin với bộ lọc thông minh; nâng cấp hiển thị bằng gói Premium.",
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-blue-600" />,
      title: "Liên hệ tiện lợi",
      desc: "Kết nối trực tiếp qua Messenger / Zalo / Email để giao dịch nội bộ nhanh chóng.",
    },
    {
      icon: <Leaf className="w-8 h-8 text-green-500" />,
      title: "Tiêu dùng bền vững",
      desc: "Khuyến khích tái sử dụng sách vở và đồ dùng — góp phần giảm rác thải.",
    },
  ];

  const roadmap = [
    { quarter: "GĐ1 (MVP)", title: "Khảo sát & MVP", desc: "Khảo sát FPT Cần Thơ → xây MVP cơ bản (đăng/tìm/xác minh)." },
    { quarter: "GĐ2 (Beta)", title: "Thử nghiệm nội bộ", desc: "Beta tại FPT, thu feedback, tối ưu tính năng lọc và xác thực." },
    { quarter: "GĐ3", title: "Mở rộng Cần Thơ", desc: "Kéo thêm trường, phát triển gói Premium, campaign truyền thông." },
    { quarter: "GĐ4", title: "Thương mại hóa", desc: "App, thanh toán, logistics partners, monetization." },
  ];

  const team = [
    { name: "CEO", role: "Quản lý & ATTT", icon: <Users className="w-6 h-6" /> },
    { name: "CTO", role: "Kiến trúc & dev", icon: <Rocket className="w-6 h-6" /> },
    { name: "CMO", role: "Marketing & truyền thông", icon: <Sparkles className="w-6 h-6" /> },
    { name: "CFO", role: "Tài chính & gọi vốn", icon: <TrendingUp className="w-6 h-6" /> },
  ];

  const stats = [
    { label: "Người dùng thử nghiệm", value: 120 },
    { label: "Tin đăng trong tháng", value: 1200 },
    { label: "Tỷ lệ xác thực (%)", value: 98 },
  ];

  const cardVariant = {
    hidden: { opacity: 0, y: 18 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, type: "spring", stiffness: 100 } }),
  };

  return (
    // NOTE: style position relative here fixes the framer-motion scroll offset warning
    <div ref={ref} style={{ position: "relative" }} className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 text-gray-800">
    {/* ============ HEADER (About) ============ */}
<header className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-blue-100">
  {/* Hiệu ứng chuyển động gradient và ánh sáng */}
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1.2 }}
    className="absolute inset-0"
  >
    <div className="absolute top-[-100px] right-[-150px] w-[400px] h-[400px] bg-blue-200/40 blur-3xl rounded-full" />
    <div className="absolute bottom-[-120px] left-[-150px] w-[350px] h-[350px] bg-sky-300/30 blur-3xl rounded-full" />
  </motion.div>

  <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 lg:py-28 flex flex-col items-center text-center">
    <motion.span
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="inline-block bg-white/60 backdrop-blur px-4 py-1 rounded-full text-blue-700 font-medium text-sm shadow-sm"
    >
      Nền tảng sinh viên 2025
    </motion.span>

    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.7 }}
      className="mt-6 text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight"
    >
      Về <span className="text-blue-600">UniTrade</span>
    </motion.h1>

    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.8 }}
      className="mt-4 max-w-2xl text-gray-600 text-lg"
    >
      <span className="font-semibold text-blue-700">UniTrade</span> là nơi sinh viên trên toàn quốc 
      kết nối để trao đổi, mua bán học liệu và vật dụng học tập — 
      không chỉ là sàn thương mại, mà là <span className="font-medium text-blue-600">một cộng đồng chia sẻ, sáng tạo và bền vững.</span>
    </motion.p>

    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.7, duration: 0.5 }}
      className="mt-8 flex flex-wrap justify-center gap-4"
    >
      <Link
        to="/products"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full shadow-md transition"
      >
        Khám phá UniTrade
      </Link>
      <Link
        to="/contact"
        className="px-6 py-3 bg-white hover:bg-blue-50 text-blue-700 font-medium rounded-full border border-blue-100 transition"
      >
        Liên hệ với chúng tôi
      </Link>
    </motion.div>

    {/* Icon highlights */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.0, duration: 0.8 }}
      className="mt-10 flex flex-wrap justify-center gap-8 text-sm text-gray-600"
    >
      <div className="flex items-center gap-2">
        <span className="bg-white p-2 rounded-full shadow-sm">
          <FileText className="w-4 h-4 text-blue-500" />
        </span>
        Đăng tin dễ dàng
      </div>
      <div className="flex items-center gap-2">
        <span className="bg-white p-2 rounded-full shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-blue-500" />
        </span>
        Giao dịch an toàn
      </div>
      <div className="flex items-center gap-2">
        <span className="bg-white p-2 rounded-full shadow-sm">
          <Star className="w-4 h-4 text-yellow-400" />
        </span>
        Cộng đồng đáng tin cậy
      </div>
    </motion.div>
  </div>
</header>


      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <motion.h2 initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} className="text-2xl font-bold text-center mb-8">
          Giá trị cốt lõi & Tính năng chính
        </motion.h2>

        <motion.div className="grid md:grid-cols-4 gap-6" initial="hidden" whileInView="visible">
          {features.map((f, i) => (
            <motion.article
              key={i}
              custom={i}
              variants={cardVariant}
              className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-gray-100 hover:shadow-md transition cursor-default"
              whileHover={{ scale: 1.03 }}
            >
              <div className="mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-800">{f.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{f.desc}</p>
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* STATS */}
      <section className="py-12 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <motion.div key={i} className="bg-white rounded-2xl p-6 text-center shadow-sm ring-1 ring-gray-100" initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }}>
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }} className="text-3xl font-bold text-blue-600">
                <AnimatedCounter value={s.value} />
              </motion.div>
              <div className="text-sm text-gray-600 mt-2">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ROADMAP */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <motion.h2 initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} className="text-2xl font-bold text-center mb-10">
          Hành trình & Lộ trình
        </motion.h2>

        <div className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-blue-100" />
          <div className="space-y-10">
            {roadmap.map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="relative md:pl-10 md:pr-10">
                <div className={`md:w-1/2 ${i % 2 === 0 ? "md:ml-auto text-right" : "md:mr-auto text-left"}`}>
                  <div className="inline-flex items-center gap-3">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">{r.quarter}</span>
                    <h4 className="font-semibold text-lg">{r.title}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{r.desc}</p>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 top-4 bg-white p-2 rounded-full shadow-sm ring-1 ring-gray-100">
                  <GraduationCap className="w-5 h-5 text-blue-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-2xl font-bold text-center mb-8">
            Nhóm sáng lập
          </motion.h2>
          <div className="grid md:grid-cols-4 gap-6">
            {team.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl shadow-sm ring-1 ring-gray-100 text-center">
                <div className="mx-auto w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  {m.icon}
                </div>
                <div className="font-semibold text-gray-800">{m.name}</div>
                <div className="text-sm text-gray-600 mt-1">{m.role}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-2xl font-bold text-center mb-6">
          Mô hình doanh thu (Freemium)
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-gray-100">
            <h3 className="font-semibold text-lg">Miễn phí</h3>
            <p className="text-sm text-gray-600 mt-2">Đăng tin cơ bản, tìm kiếm, liên hệ trực tiếp.</p>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>✅ Đăng 3 tin miễn phí / tuần</li>
              <li>✅ Tìm kiếm & lọc theo trường</li>
            </ul>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl shadow-md ring-1 ring-gray-100">
            <h3 className="font-semibold text-lg">Premium (20k–60k / tháng)</h3>
            <p className="text-sm text-gray-600 mt-2">Ghim bài, ưu tiên hiển thị, báo cáo lượt xem.</p>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>⭐ Ghim top & badge nổi bật</li>
              <li>📈 Báo cáo lượt xem / tương tác</li>
            </ul>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-gray-100">
            <h3 className="font-semibold text-lg">Dịch vụ bổ sung</h3>
            <p className="text-sm text-gray-600 mt-2">Dịch vụ quảng cáo, hợp tác tài trợ sự kiện trường.</p>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>🔔 Quảng cáo theo sự kiện</li>
              <li>🤝 Hợp tác CLB / nhà tài trợ</li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* FAQ & CTA */}
      <section className="py-16 bg-gradient-to-tr from-sky-50 to-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8">
          <div>
            <motion.h3 initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} className="text-xl font-bold mb-4">Câu hỏi thường gặp</motion.h3>
            <div className="space-y-3">
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="bg-white p-4 rounded-lg shadow-sm ring-1 ring-gray-100">
                <div className="font-medium">Làm sao để xác thực tài khoản?</div>
                <div className="text-sm text-gray-600 mt-1">Sử dụng email trường hoặc mã số sinh viên để hệ thống cấp huy hiệu Verified.</div>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="bg-white p-4 rounded-lg shadow-sm ring-1 ring-gray-100">
                <div className="font-medium">Mua bán có phí không?</div>
                <div className="text-sm text-gray-600 mt-1">Cơ bản miễn phí. Gói Premium & dịch vụ quảng cáo là nguồn doanh thu chính.</div>
              </motion.div>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} className="bg-blue-600 text-white p-8 rounded-2xl flex flex-col justify-center">
            <Sparkles className="w-8 h-8" />
            <h4 className="text-2xl font-bold mt-4">Tham gia cùng UniTrade</h4>
            <p className="mt-2 text-white/90">Nếu bạn là sinh viên muốn bán/trao đổi hoặc cộng tác cùng dự án — chúng tôi chào đón bạn!</p>
            <div className="mt-6">
              <Link to="/signup" className="inline-flex items-center gap-2 px-5 py-3 bg-white text-blue-700 rounded-full font-medium">Đăng ký ngay</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <motion.footer initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <h5 className="text-lg font-semibold">Cùng UniTrade xây dựng tương lai xanh hơn</h5>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">UniTrade tập trung xây dựng cộng đồng sinh viên an toàn, tiện lợi và tiết kiệm.</p>
          <div className="mt-6">
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full shadow-md transition">
              Liên hệ với UniTrade →
            </Link>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}

/* AnimatedCounter using imported motionValue & animate */
function AnimatedCounter({ value = 0, duration = 1.4 }) {
  const mv = motionValue(0);
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    const controls = animate(mv, value, { duration });
    const unsub = mv.on("change", (v) => setDisplay(Math.round(v)));
    return () => {
      controls.stop();
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span>{display.toLocaleString()}</span>;
}
