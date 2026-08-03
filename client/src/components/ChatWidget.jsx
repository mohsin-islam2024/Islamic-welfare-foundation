import { useEffect, useRef, useState } from "react";
import { api } from "../lib/api";
import { socket } from "../lib/socket";

const CONV_KEY = "alinfaq_chat_conversation_id";
const NAME_KEY = "alinfaq_chat_visitor_name";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState(() => localStorage.getItem(CONV_KEY));
  const [visitorName, setVisitorName] = useState(() => localStorage.getItem(NAME_KEY) || "");
  const [nameInput, setNameInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef(null);

  // Load history whenever we have a conversation to show
  useEffect(() => {
    if (!conversationId || !open) return;
    api
      .getChatMessages(conversationId)
      .then((data) => setMessages(data.messages))
      .catch(() => {});
  }, [conversationId, open]);

  // Keep the socket connected and listening while the widget exists
  useEffect(() => {
    if (!socket.connected) socket.connect();

    const handleNewMessage = (message) => {
      if (message.conversation !== conversationId) return;
      setMessages((prev) => (prev.some((m) => m._id === message._id) ? prev : [...prev, message]));
      if (message.sender === "admin" && !open) setUnread((u) => u + 1);
    };

    socket.on("new_message", handleNewMessage);
    return () => socket.off("new_message", handleNewMessage);
  }, [conversationId, open]);

  // Join the conversation's socket room once we know its id
  useEffect(() => {
    if (conversationId) socket.emit("join_conversation", conversationId);
  }, [conversationId]);

  useEffect(() => {
    if (open) {
      setUnread(0);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [open, messages]);

  const startConversation = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const name = nameInput.trim() || "অতিথি";
      const { conversationId: id } = await api.startChat({ visitorName: name });
      localStorage.setItem(CONV_KEY, id);
      localStorage.setItem(NAME_KEY, name);
      setVisitorName(name);
      setConversationId(id);
    } catch {
      // If starting fails, the form just stays visible for a retry
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() || !conversationId) return;
    socket.emit("visitor_message", { conversationId, text: text.trim(), visitorName });
    setText("");
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 w-[320px] sm:w-[360px] h-[440px] bg-white border border-line rounded-lg shadow-xl flex flex-col overflow-hidden">
          <div className="bg-forest text-canvas px-4 py-3 flex items-center justify-between shrink-0">
            <span className="font-semibold text-sm">আমাদের সাথে চ্যাট করুন</span>
            <button onClick={() => setOpen(false)} className="text-canvas/80 hover:text-canvas" aria-label="বন্ধ করুন">
              ✕
            </button>
          </div>

          {!conversationId ? (
            <form onSubmit={startConversation} className="flex-1 flex flex-col justify-center gap-3 p-5">
              <p className="text-sm text-ink/70 text-center mb-1">
                শুরু করতে আপনার নাম লিখুন (ঐচ্ছিক)
              </p>
              <input
                className="input"
                placeholder="আপনার নাম"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
              />
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "শুরু হচ্ছে..." : "চ্যাট শুরু করুন"}
              </button>
            </form>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-canvas/50">
                {messages.length === 0 && (
                  <p className="text-xs text-ink/40 text-center mt-8">
                    বার্তা লিখে আমাদের টিমের সাথে যোগাযোগ করুন। আমরা যত দ্রুত সম্ভব উত্তর দেব।
                  </p>
                )}
                {messages.map((m) => (
                  <div key={m._id} className={`flex ${m.sender === "visitor" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                        m.sender === "visitor"
                          ? "bg-forest text-canvas rounded-br-none"
                          : "bg-white border border-line text-ink rounded-bl-none"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <form onSubmit={sendMessage} className="border-t border-line p-3 flex gap-2 shrink-0">
                <input
                  className="input flex-1"
                  placeholder="বার্তা লিখুন..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <button type="submit" className="btn-primary !px-4">
                  পাঠান
                </button>
              </form>
            </>
          )}
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="relative w-14 h-14 rounded-full bg-forest text-canvas shadow-lg flex items-center justify-center hover:bg-forest-light transition-colors"
        aria-label="চ্যাট খুলুন"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {unread > 0 && !open && (
          <span className="absolute -top-1 -right-1 bg-clay text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>
    </div>
  );
}
