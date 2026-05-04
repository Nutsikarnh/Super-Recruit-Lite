import { useState, useRef, useEffect } from "react";
import { Search, X, UserPlus, Check, ChevronDown } from "lucide-react";
import { emailAddressBookContacts } from "../data/emailAddressBook";

interface Contact {
  id: string;
  name: string;
  title: string;
  email: string;
  department: string;
  initials: string;
  color: string;
}

const ADDRESS_BOOK: Contact[] = emailAddressBookContacts.map((c) => ({
  id: c.id,
  name: c.fullName,
  title: c.title,
  email: c.email,
  department: c.department,
  initials: c.initials,
  color: c.color,
}));

const DEPARTMENTS = Array.from(new Set(ADDRESS_BOOK.map((c) => c.department)));

interface ReferToInputProps {
  value: string;
  onChange: (value: string) => void;
  selectedContacts: Contact[];
  onSelectContact: (c: Contact) => void;
  onRemoveContact: (id: string) => void;
}

export default function ReferToInput({ value, onChange, selectedContacts, onSelectContact, onRemoveContact }: ReferToInputProps) {
  const [open, setOpen] = useState(false);
  const [filterDept, setFilterDept] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (open && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const query = value.toLowerCase();
  const filtered = ADDRESS_BOOK.filter((c) => {
    const matchesSearch = !query || c.name.toLowerCase().includes(query) || c.email.toLowerCase().includes(query) || c.title.toLowerCase().includes(query) || c.department.toLowerCase().includes(query);
    const matchesDept = !filterDept || c.department === filterDept;
    const notSelected = !selectedContacts.find((s) => s.id === c.id);
    return matchesSearch && matchesDept && notSelected;
  });

  const handleSelectContact = (c: Contact) => {
    onSelectContact(c);
    onChange("");
    setOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="space-y-2">
      {/* Selected contacts chips */}
      {selectedContacts.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedContacts.map((c) => (
            <div key={c.id} className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-lg bg-[#F0F8FF] border border-[#0DC2FF]/25 text-[12.5px]">
              <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold flex-shrink-0 ${c.color}`}>
                {c.initials}
              </div>
              <div className="leading-tight">
                <span className="font-semibold text-[#1A1A2E]">{c.name}</span>
                <span className="text-gray-400 ml-1">{c.email}</span>
              </div>
              <button onClick={() => onRemoveContact(c.id)} className="ml-0.5 text-gray-300 hover:text-red-400 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="relative">
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#F0F2F5] focus-within:border-[#0DC2FF] focus-within:bg-white transition-all">
          <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="ค้นหาชื่อ, ตำแหน่ง หรือพิมพ์อีเมลเอง..."
            className="flex-1 bg-transparent text-[13px] placeholder:text-gray-400 text-[#1A1A2E] focus:outline-none"
          />
          <button
            onClick={() => setOpen((v) => !v)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        </div>

        {open && (
          <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white rounded-2xl border border-gray-100 shadow-2xl overflow-hidden">
            {/* Dept filter */}
            <div className="flex items-center gap-1.5 px-3 pt-3 pb-2 overflow-x-auto">
              <button
                onClick={() => setFilterDept(null)}
                className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${!filterDept ? "bg-[#127EE3] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
              >
                ทั้งหมด
              </button>
              {DEPARTMENTS.map((d) => (
                <button
                  key={d}
                  onClick={() => setFilterDept(filterDept === d ? null : d)}
                  className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${filterDept === d ? "bg-[#127EE3] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                >
                  {d}
                </button>
              ))}
            </div>

            <div className="border-t border-gray-50 max-h-[260px] overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="px-4 py-5 text-center">
                  <UserPlus className="w-5 h-5 text-gray-300 mx-auto mb-1.5" />
                  <p className="text-[13px] text-gray-400">ไม่พบในสมุดรายชื่อ</p>
                  {value && (
                    <button
                      onClick={() => {
                        onSelectContact({
                          id: `custom_${Date.now()}`,
                          name: value,
                          title: "",
                          email: value.includes("@") ? value : "",
                          department: "ภายนอก",
                          initials: value.slice(0, 2),
                          color: "bg-gray-100 text-gray-600",
                        });
                        onChange("");
                        setOpen(false);
                      }}
                      className="mt-2 text-[12.5px] text-[#127EE3] font-semibold hover:underline"
                    >
                      เพิ่ม "{value}" โดยตรง
                    </button>
                  )}
                </div>
              ) : (
                filtered.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelectContact(c)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F0F8FF] transition-colors text-left border-b border-gray-50 last:border-0"
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${c.color}`}>
                      {c.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-[#1A1A2E] truncate">{c.name}</p>
                      <p className="text-[11.5px] text-gray-400 truncate">{c.title} · {c.email}</p>
                    </div>
                    <span className="text-[10.5px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 flex-shrink-0">{c.department}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <p className="text-[11px] text-gray-400">เลือกจากสมุดรายชื่อ หรือพิมพ์อีเมลแล้วกด Enter</p>
    </div>
  );
}
