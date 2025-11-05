import { useEffect, useRef, useState } from "react";
import { X, MessageSquare, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Chat component styled for UniTrade (blue / white).
 * - Tailwind classes used (requires Tailwind in project)
 * - Framer Motion for entrance/exit + message animations
 * - Auto-scroll to bottom, typing indicator, small avatars
 */

export default function AdminChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "admin", text: "Xin chào 👋, bạn cần hỗ trợ gì không?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    // auto scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  // simulate admin reply (demo). Remove or replace with real API call
  const simulateReply = (userText) => {
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "admin", text: `Cảm ơn! Mình đã nhận: "${userText}"` },
      ]);
      setTyping(false);
    }, 900);
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const text = input.trim();
    setMessages((m) => [...m, { from: "me", text }]);
    setInput("");
    // you can call an API here; we simulate a reply for demo
    simulateReply(text);
  };

  return (
    <>
      {/* Floating button (collapsed) */}
      {!open && (
        <motion.button
          onClick={() => setOpen(true)}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-4 py-3 rounded-full shadow-2xl bg-gradient-to-br from-sky-600 to-sky-500 text-white"
          aria-label="Mở chat hỗ trợ UniTrade"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="font-medium">Hỗ trợ</span>
        </motion.button>
      )}

      {/* Chat popup */}
      <AnimatePresence>
        {open && (
          <motion.aside
            key="admin-chat"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[92vw] md:w-80 rounded-xl shadow-2xl bg-white ring-1 ring-slate-200 overflow-hidden"
            role="dialog"
            aria-label="Hộp chat hỗ trợ UniTrade"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-2 px-4 py-3 bg-gradient-to-r from-sky-600 to-sky-500 text-white">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white/20">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M2 12a10 10 0 1116.94 7.2L22 22l-2.8-1.06A10 10 0 012 12z"
                      stroke="white"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold">Chat với UniTrade</div>
                  <div className="text-[11px] text-white/80">Hỗ trợ trực tiếp</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setOpen(false);
                    setTyping(false);
                  }}
                  aria-label="Đóng chat"
                  className="p-1 rounded-md hover:bg-white/20 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body: messages */}
            <div
              ref={scrollRef}
              className="flex-1 min-h-[160px] max-h-64 overflow-y-auto p-3 space-y-3 bg-gradient-to-b from-white to-slate-50"
            >
              <div className="flex flex-col gap-2">
                <AnimatePresence initial={false}>
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i + msg.text}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18 }}
                      className={`flex ${
                        msg.from === "me" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {msg.from !== "me" && (
                        <div className="flex items-end">
                          <div className="w-7 h-7 mr-2 flex items-center justify-center rounded-full bg-sky-100 text-sky-700 text-xs font-medium">
                            A
                          </div>
                        </div>
                      )}

                      <div
                        className={`px-3 py-2 rounded-lg max-w-[78%] text-sm leading-relaxed break-words ${
                          msg.from === "me"
                            ? "bg-sky-600 text-white rounded-br-md"
                            : "bg-white border border-slate-200 text-slate-800 rounded-bl-md shadow-sm"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing indicator */}
                <AnimatePresence>
                  {typing && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.16 }}
                      className="flex items-center gap-2"
                    >
                      <div className="w-7 h-7 mr-2 flex items-center justify-center rounded-full bg-sky-100 text-sky-700 text-xs font-medium">
                        A
                      </div>
                      <div className="bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-sm">
                        <div className="flex items-center gap-1">
                          <span className="inline-block w-2 h-2 rounded-full animate-pulse bg-slate-400" />
                          <span className="inline-block w-2 h-2 rounded-full animate-pulse delay-75 bg-slate-400" />
                          <span className="inline-block w-2 h-2 rounded-full animate-pulse delay-150 bg-slate-400" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Footer: input */}
            <div className="px-3 py-3 border-t border-slate-100 bg-white">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-300"
                  aria-label="Nhập tin nhắn"
                />

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${
                    input.trim()
                      ? "bg-sky-600 text-white shadow-lg hover:bg-sky-700"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Gửi</span>
                </motion.button>
              </div>

              {/* small hint row */}
              <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Hỗ trợ: UniTrade</span>
                <button
                  onClick={() => {
                    // clear chat (demo)
                    setMessages([
                      { from: "admin", text: "Xin chào 👋, bạn cần hỗ trợ gì không?" },
                    ]);
                    setInput("");
                  }}
                  className="text-[11px] underline underline-offset-2"
                >
                  Xóa chat
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
