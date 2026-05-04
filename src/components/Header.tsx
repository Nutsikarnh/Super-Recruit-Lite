import { useState, useRef, useEffect } from "react";
import { Search, LogOut, ChevronDown } from "lucide-react";
import type { AppPage } from "../App";

interface HeaderProps {
  activePage: AppPage;
  onNavigate: (page: AppPage) => void;
}

const FOLLOW_UP_COUNT = 3;

export default function Header({ activePage, onNavigate }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState<"TH" | "EN">("TH");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-gray-100 h-16 flex items-center px-6 flex-shrink-0 z-30">
      <div className="flex items-center gap-3 ml-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหาผู้สมัครด้วย ชื่อ เบอร์โทร อีเมล"
            className="w-80 pl-9 pr-4 py-2 text-[13.5px] bg-[#F0F2F5] rounded-full border border-transparent focus:outline-none focus:border-[#0DC2FF] focus:bg-white focus:w-96 transition-all placeholder:text-gray-400"
          />
        </div>

        {/* Language toggle */}
        <div className="flex items-center gap-0.5 bg-[#F0F2F5] rounded-full p-0.5">
          <button
            onClick={() => setLang("TH")}
            className={`px-2.5 py-1 rounded-full text-[12px] font-semibold transition-all ${lang === "TH" ? "bg-white text-[#127EE3] shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
          >
            TH
          </button>
          <button
            onClick={() => setLang("EN")}
            className={`px-2.5 py-1 rounded-full text-[12px] font-semibold transition-all ${lang === "EN" ? "bg-white text-[#127EE3] shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
          >
            EN
          </button>
        </div>

        {/* User avatar with dropdown */}
        <div className="relative pl-3 border-l border-gray-100" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2.5 group"
          >
            <div className="text-right">
              <p className="text-[13.5px] font-semibold leading-tight transition-colors text-[#1A1A2E] group-hover:text-[#127EE3]">
                อลิสา สุขใจ
              </p>
              <p className="text-[11px] text-gray-400 leading-tight">HR Manager</p>
            </div>
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0DC2FF] to-[#127EE3] flex items-center justify-center text-white text-[14px] font-bold shadow-sm transition-shadow group-hover:shadow-md">
                อ
              </div>
              {FOLLOW_UP_COUNT > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-black text-white leading-none">
                  {FOLLOW_UP_COUNT}
                </span>
              )}
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-lg border border-gray-100 py-1.5 z-50">
              <button
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                ออกจากระบบ
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
