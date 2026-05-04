import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, ChevronUp, Send, Paperclip, Smile, User, Building2, Globe } from "lucide-react";

type ChatTab = "individual" | "company" | "public";

interface ChatMessage {
  id: string;
  sender: "user" | "support";
  text: string;
  time: string;
  senderName?: string;
  senderInitials?: string;
  senderColor?: string;
}

const TAB_CONFIG: {
  id: ChatTab;
  label: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: string;
  initials: string;
  unread: number;
}[] = [
  {
    id: "individual",
    label: "Individual",
    icon: <User className="w-3.5 h-3.5" />,
    title: "Account Executive",
    subtitle: "ศิริพร วงศ์ทอง",
    color: "bg-gradient-to-br from-[#127EE3] to-[#0DC2FF]",
    initials: "ศว",
    unread: 2,
  },
  {
    id: "company",
    label: "Company",
    icon: <Building2 className="w-3.5 h-3.5" />,
    title: "HR Team",
    subtitle: "ทีม HR ภายในบริษัท",
    color: "bg-gradient-to-br from-amber-500 to-orange-400",
    initials: "HR",
    unread: 3,
  },
  {
    id: "public",
    label: "Public",
    icon: <Globe className="w-3.5 h-3.5" />,
    title: "Design Community",
    subtitle: "พูดคุยเรื่อง UX/UI Design",
    color: "bg-gradient-to-br from-rose-500 to-pink-400",
    initials: "DC",
    unread: 5,
  },
];

const INITIAL_MESSAGES: Record<ChatTab, ChatMessage[]> = {
  individual: [
    { id: "1", sender: "support", senderName: "ศิริพร", senderInitials: "ศว", senderColor: "bg-gradient-to-br from-[#127EE3] to-[#0DC2FF]", text: "สวัสดีค่ะ คุณอลิสา มีอะไรให้ช่วยไหมคะ?", time: "09:30" },
    { id: "2", sender: "support", senderName: "ศิริพร", senderInitials: "ศว", senderColor: "bg-gradient-to-br from-[#127EE3] to-[#0DC2FF]", text: "ถ้าต้องการข้อมูลแพ็กเกจหรือต่ออายุบอกได้เลยนะคะ", time: "09:31" },
  ],
  company: [
    { id: "1", sender: "support", senderName: "ทีม HR", senderInitials: "HR", senderColor: "bg-gradient-to-br from-amber-500 to-orange-400", text: "สวัสดีค่ะ ช่องนี้สำหรับประสานงานภายในบริษัทนะคะ", time: "08:30" },
    { id: "2", sender: "support", senderName: "ทีม HR", senderInitials: "HR", senderColor: "bg-gradient-to-br from-amber-500 to-orange-400", text: "มีตำแหน่งใหม่ที่เปิดรับสมัครแล้วค่ะ กรุณาตรวจสอบระบบ", time: "09:00" },
    { id: "3", sender: "support", senderName: "ทีม HR", senderInitials: "HR", senderColor: "bg-gradient-to-br from-amber-500 to-orange-400", text: "อย่าลืมอัพเดต JD ก่อนวันศุกร์นะคะ", time: "09:45" },
  ],
  public: [
    { id: "1", sender: "support", senderName: "Admin", senderInitials: "AD", senderColor: "bg-gradient-to-br from-rose-500 to-pink-400", text: "ยินดีต้อนรับสู่ Design Community!", time: "07:00" },
    { id: "2", sender: "support", senderName: "ปิยะ", senderInitials: "ปย", senderColor: "bg-gradient-to-br from-violet-500 to-purple-400", text: "ใครมีประสบการณ์ทำ Design System สำหรับ fintech บ้างคะ?", time: "10:00" },
    { id: "3", sender: "support", senderName: "ธนา", senderInitials: "ธน", senderColor: "bg-gradient-to-br from-teal-500 to-cyan-400", text: "เคยทำที่ Bitkub ครับ ถามมาได้เลย", time: "10:05" },
    { id: "4", sender: "support", senderName: "ปิยะ", senderInitials: "ปย", senderColor: "bg-gradient-to-br from-violet-500 to-purple-400", text: "ว้าว ขอบคุณมากเลยค่ะ จะ DM นะคะ", time: "10:06" },
    { id: "5", sender: "support", senderName: "มินตรา", senderInitials: "มต", senderColor: "bg-gradient-to-br from-emerald-500 to-teal-400", text: "Figma Variables ช่วยได้มากเลยนะคะ ลองดูได้เลย", time: "10:20" },
  ],
};

function formatTime() {
  return new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
}

export default function FloatingChat() {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<ChatTab>("individual");
  const [messages, setMessages] = useState<Record<ChatTab, ChatMessage[]>>(INITIAL_MESSAGES);
  const [unread, setUnread] = useState<Record<ChatTab, number>>({ individual: 2, company: 3, public: 5 });
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeTab]);

  const totalUnread = Object.values(unread).reduce((s, n) => s + n, 0);

  const handleTabChange = (tab: ChatTab) => {
    setActiveTab(tab);
    setUnread((prev) => ({ ...prev, [tab]: 0 }));
  };

  const handleExpand = () => {
    setExpanded((v) => {
      if (!v) {
        setUnread((prev) => ({ ...prev, [activeTab]: 0 }));
      }
      return !v;
    });
  };

  const sendMessage = () => {
    const text = newMessage.trim();
    if (!text) return;
    const msg: ChatMessage = { id: `m${Date.now()}`, sender: "user", text, time: formatTime() };
    setMessages((prev) => ({ ...prev, [activeTab]: [...prev[activeTab], msg] }));
    setNewMessage("");
  };

  const currentTabConfig = TAB_CONFIG.find((t) => t.id === activeTab)!;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {expanded && (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200/60 overflow-hidden w-[340px] mb-2 flex flex-col" style={{ maxHeight: "520px" }}>
          {/* Chat header */}
          <div className="bg-gradient-to-r from-[#0B1D3A] to-[#1a3560] px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-xl ${currentTabConfig.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                <span className="text-white text-[13px] font-black">{currentTabConfig.initials}</span>
              </div>
              <div>
                <p className="text-white font-bold text-[15px] leading-tight">{currentTabConfig.title}</p>
                <p className="text-white/60 text-[12px]">{currentTabConfig.subtitle}</p>
              </div>
            </div>
            <button
              onClick={() => setExpanded(false)}
              className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100 flex-shrink-0 bg-white">
            {TAB_CONFIG.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1 py-2.5 text-[13px] font-semibold transition-all border-b-2 relative ${
                    isActive
                      ? "border-[#127EE3] text-[#127EE3]"
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  {unread[tab.id] > 0 && (
                    <span className="absolute top-1 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                      {unread[tab.id]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3 bg-[#F7F9FC]" style={{ minHeight: 0 }}>
            {messages[activeTab].map((msg) => {
              const isUser = msg.sender === "user";
              return (
                <div key={msg.id} className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
                  {!isUser && (
                    <div className={`w-6 h-6 rounded-full ${msg.senderColor ?? "bg-gray-300"} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      <span className="text-white text-[9px] font-black">{msg.senderInitials}</span>
                    </div>
                  )}
                  <div className={`max-w-[78%] flex flex-col gap-0.5 ${isUser ? "items-end" : "items-start"}`}>
                    {!isUser && msg.senderName && (
                      <span className="text-[10.5px] text-gray-400 px-1 font-medium">{msg.senderName}</span>
                    )}
                    <div className={`px-3 py-2 rounded-2xl text-[14.5px] leading-relaxed ${isUser ? "bg-gradient-to-br from-[#01BFF9] to-[#019EFC] text-white rounded-br-sm shadow-sm" : "bg-white text-[#1A1A2E] rounded-bl-sm shadow-sm border border-gray-100"}`}>
                      {msg.text}
                    </div>
                    <span className="text-[10.5px] text-gray-400 px-1">{msg.time}</span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input bar */}
          <div className="bg-white border-t border-gray-100 px-3 py-2.5 flex items-center gap-2 flex-shrink-0">
            <button className="w-7 h-7 flex items-center justify-center rounded-xl hover:bg-[#F0F2F5] transition-colors text-gray-300 flex-shrink-0">
              <Paperclip className="w-3.5 h-3.5" />
            </button>
            <div className="flex-1 flex items-center bg-[#F7F9FC] border border-gray-200 rounded-xl px-3 py-1.5 gap-1.5 focus-within:border-[#0DC2FF] transition-colors">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
                placeholder="Write a message..."
                className="flex-1 bg-transparent text-[14.5px] text-[#1A1A2E] placeholder:text-gray-400 focus:outline-none"
              />
              <button className="flex-shrink-0 text-gray-300 hover:text-gray-500 transition-colors">
                <Smile className="w-3.5 h-3.5" />
              </button>
            </div>
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#01BFF9] to-[#019EFC] hover:opacity-90 disabled:opacity-30 flex items-center justify-center transition-all flex-shrink-0 shadow-sm"
            >
              <Send className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={handleExpand}
        className="relative w-14 h-14 bg-gradient-to-br from-[#01BFF9] to-[#019EFC] hover:opacity-90 rounded-2xl shadow-xl shadow-[#019EFC]/40 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
      >
        {expanded ? (
          <ChevronUp className="w-6 h-6 text-white" />
        ) : (
          <MessageSquare className="w-6 h-6 text-white" />
        )}
        {!expanded && totalUnread > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm border-2 border-white">
            {totalUnread > 9 ? "9+" : totalUnread}
          </span>
        )}
      </button>
    </div>
  );
}
