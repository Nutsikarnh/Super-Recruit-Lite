import { useState, useRef, useEffect } from "react";
import { Calendar, Clock, ChevronLeft, ChevronRight, CheckCircle2, X, Zap, Mail, ChevronDown, ChevronUp, UserPlus, Search } from "lucide-react";
import { emailAddressBookContacts } from "../data/emailAddressBook";
import type { EmailAddressBookContact } from "../data/emailAddressBook";
import { emailTemplates } from "../data/emailTemplates";

interface ScheduledInterview {
  candidateName: string;
  candidateTitle: string;
  time: string;
  duration: number;
  type: "phone" | "video" | "onsite";
}

const MOCK_SCHEDULED: Record<string, ScheduledInterview[]> = {};

function seedMockData() {
  const today = new Date();
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const addDay = (n: number) => { const d = new Date(today); d.setDate(d.getDate() + n); return d; };

  MOCK_SCHEDULED[fmt(addDay(1))] = [
    { candidateName: "สมชาย วงศ์ประเสริฐ", candidateTitle: "Senior Frontend Dev", time: "10:00", duration: 60, type: "video" },
    { candidateName: "วิภาวี ทองดี", candidateTitle: "UX Designer", time: "14:00", duration: 45, type: "phone" },
  ];
  MOCK_SCHEDULED[fmt(addDay(2))] = [
    { candidateName: "ธนากร ศรีสมบูรณ์", candidateTitle: "Product Manager", time: "09:30", duration: 60, type: "video" },
  ];
  MOCK_SCHEDULED[fmt(addDay(4))] = [
    { candidateName: "ปิยะนุช แก้วมณี", candidateTitle: "Data Analyst", time: "11:00", duration: 45, type: "onsite" },
    { candidateName: "กิตติ รัตนชัย", candidateTitle: "Backend Engineer", time: "15:30", duration: 60, type: "video" },
    { candidateName: "ณัฐพล สิทธิชัย", candidateTitle: "DevOps Engineer", time: "17:00", duration: 30, type: "phone" },
  ];
  MOCK_SCHEDULED[fmt(addDay(7))] = [
    { candidateName: "มณีรัตน์ สุขใจ", candidateTitle: "Marketing Manager", time: "13:00", duration: 60, type: "onsite" },
  ];
}
seedMockData();

const THAI_MONTHS = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
const THAI_MONTHS_FULL = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
const THAI_DOW_FULL = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
const THAI_DOW = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00",
];
const DURATION_OPTIONS = [30, 45, 60, 90, 120];
const INTERVIEW_TYPES: { key: "phone" | "video" | "onsite"; label: string; icon: string }[] = [
  { key: "phone", label: "โทรศัพท์", icon: "📞" },
  { key: "video", label: "Video Call", icon: "🎥" },
  { key: "onsite", label: "Onsite", icon: "🏢" },
];

export interface AvailabilitySlotGroup {
  reviewerName: string;
  slots: { date: string; time: string }[];
}

export function typeLabel(t: string) {
  return ({ phone: "โทรศัพท์", video: "Video Call", onsite: "Onsite" } as Record<string, string>)[t] ?? t;
}
export function toThaiDate(d: Date) {
  return `${d.getDate()} ${THAI_MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`;
}
function toThaiDateFull(d: Date) {
  return `วัน${THAI_DOW_FULL[d.getDay()]}ที่ ${d.getDate()} ${THAI_MONTHS_FULL[d.getMonth()]} ${d.getFullYear() + 543}`;
}
function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}
function parseThaiDate(thaiDate: string): Date | null {
  const parts = thaiDate.trim().split(" ");
  if (parts.length < 3) return null;
  const day = parseInt(parts[0], 10);
  const monthIdx = THAI_MONTHS.indexOf(parts[1]);
  const year = parseInt(parts[2], 10) - 543;
  if (isNaN(day) || monthIdx === -1 || isNaN(year)) return null;
  return new Date(year, monthIdx, day);
}
function buildEmail(name: string, title: string, date: Date, time: string, dur: number, itype: string) {
  const [hh, mm] = time.split(":").map(Number);
  const total = hh * 60 + mm + dur;
  const endTime = `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
  const loc = itype === "video" ? "รูปแบบ: Video Call (ลิงก์จะส่งแยกอีกครั้ง)"
    : itype === "phone" ? "รูปแบบ: ทางโทรศัพท์ (ทีมจะโทรหาตามเบอร์ที่ให้ไว้)"
    : "รูปแบบ: Onsite (กรุณาติดต่อล่วงหน้าหากต้องการข้อมูลการเดินทาง)";
  return `เรียน คุณ${name},\n\nเราขอเรียนเชิญคุณเข้าสัมภาษณ์สำหรับตำแหน่ง ${title}\n\nรายละเอียดการนัดหมาย:\n- วันที่: ${toThaiDateFull(date)}\n- เวลา: ${time} – ${endTime} น. (${dur} นาที)\n- ${loc}\n\nกรุณาตอบกลับเพื่อยืนยันการเข้าร่วม หรือแจ้งหากต้องการเปลี่ยนแปลงวันเวลา\n\nขอบคุณครับ/ค่ะ\nทีม HR`;
}

export type InterviewerContact = Pick<EmailAddressBookContact, "id" | "fullName" | "email" | "department" | "initials" | "color">;

interface InterviewSchedulerProps {
  candidateName?: string;
  candidateTitle?: string;
  onScheduled?: (date: Date, time: string, duration: number, type: string, sendEmail: boolean, interviewers: InterviewerContact[]) => void;
  onReadyChange?: (ready: boolean) => void;
  availabilitySlots?: AvailabilitySlotGroup[];
  initialDate?: Date | null;
  initialTime?: string | null;
  initialDuration?: number;
  initialType?: "phone" | "video" | "onsite";
  initialInterviewers?: InterviewerContact[];
}

export default function InterviewScheduler({ candidateName = "ผู้สมัคร", candidateTitle = "", onScheduled, onReadyChange, availabilitySlots, initialDate, initialTime, initialDuration, initialType, initialInterviewers }: InterviewSchedulerProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewDate, setViewDate] = useState(() => {
    if (initialDate) { const d = new Date(initialDate); d.setDate(1); return d; }
    const d = new Date(today); d.setDate(1); return d;
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate ?? null);
  const [selectedTime, setSelectedTime] = useState<string | null>(initialTime ?? null);
  const [duration, setDuration] = useState(initialDuration ?? 60);
  const [interviewType, setInterviewType] = useState<"phone" | "video" | "onsite">(initialType ?? "video");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [showEmailStep, setShowEmailStep] = useState(false);
  const [sendEmail, setSendEmail] = useState<boolean | null>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<number>(10);
  const [emailExpanded, setEmailExpanded] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [selectedChipKey, setSelectedChipKey] = useState<string | null>(null);
  const [editingDateTime, setEditingDateTime] = useState(true);
  const [selectedInterviewers, setSelectedInterviewers] = useState<InterviewerContact[]>(initialInterviewers ?? []);
  const [interviewerQuery, setInterviewerQuery] = useState("");
  const [interviewerDropdownOpen, setInterviewerDropdownOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const interviewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (calendarOpen && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setCalendarOpen(false);
      }
      if (interviewerDropdownOpen && interviewerRef.current && !interviewerRef.current.contains(e.target as Node)) {
        setInterviewerDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [calendarOpen, interviewerDropdownOpen]);

  useEffect(() => {
    onReadyChange?.(!!selectedDate && !!selectedTime);
  }, [selectedDate, selectedTime, onReadyChange]);

  const handleChipSelect = (slot: { date: string; time: string }, chipKey: string) => {
    // slot.date is ISO format (YYYY-MM-DD); parse directly
    const [y, m, d] = slot.date.split("-").map(Number);
    if (!y || !m || !d) return;
    const parsed = new Date(y, m - 1, d);
    setSelectedChipKey(chipKey);
    setSelectedDate(parsed);
    setViewDate(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
    setSelectedTime(slot.time);
    setShowEmailStep(false);
    setSendEmail(null);
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const dateKey = selectedDate ? toISODate(selectedDate) : null;
  const scheduledOnSelected = dateKey ? (MOCK_SCHEDULED[dateKey] ?? []) : [];

  const isConflict = (time: string) => {
    if (!dateKey) return false;
    const [hh, mm] = time.split(":").map(Number);
    const slotStart = hh * 60 + mm;
    const slotEnd = slotStart + duration;
    return (MOCK_SCHEDULED[dateKey] ?? []).some((s) => {
      const [sh, sm] = s.time.split(":").map(Number);
      const sStart = sh * 60 + sm;
      return slotStart < sStart + s.duration && slotEnd > sStart;
    });
  };

  const isPast = (d: Date) => { const dd = new Date(d); dd.setHours(0, 0, 0, 0); return dd < today; };
  const isToday = (d: Date) => toISODate(d) === toISODate(today);
  const isSelected = (d: Date) => selectedDate ? toISODate(d) === toISODate(selectedDate) : false;

  const getCalendarLinks = () => {
    if (!selectedDate || !selectedTime) return null;
    const [hh, mm] = selectedTime.split(":").map(Number);
    const start = new Date(selectedDate);
    start.setHours(hh, mm, 0, 0);
    const end = new Date(start.getTime() + duration * 60000);
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
    const title = encodeURIComponent(`สัมภาษณ์ — ${candidateName}`);
    const details = encodeURIComponent(`สัมภาษณ์ตำแหน่ง ${candidateTitle}\nประเภท: ${typeLabel(interviewType)}`);
    const location = encodeURIComponent(interviewType === "onsite" ? "บริษัท" : interviewType === "video" ? "Google Meet / Zoom" : "โทรศัพท์");
    return {
      google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fmt(start)}/${fmt(end)}&details=${details}&location=${location}`,
      outlook: `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&startdt=${start.toISOString()}&enddt=${end.toISOString()}&body=${details}&location=${location}`,
    };
  };

  const interviewEmailTemplates = emailTemplates.filter((t) => [10, 11, 12].includes(t.id));

  const handleProceed = () => {
    if (!selectedDate || !selectedTime) return;
    setEditingDateTime(false);
    const defaultTpl = interviewEmailTemplates[0];
    setSelectedTemplateId(defaultTpl?.id ?? 10);
    setEmailSubject(defaultTpl?.subject ?? "ยืนยันนัดสัมภาษณ์");
    setEmailBody(buildEmail(candidateName, candidateTitle, selectedDate, selectedTime, duration, interviewType));
    setShowEmailStep(true);
    setSendEmail(null);
    setEmailExpanded(false);
  };

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) return;
    setConfirmed(true);
    onScheduled?.(selectedDate, selectedTime, duration, interviewType, sendEmail === true, selectedInterviewers);
  };

  const filteredInterviewers = emailAddressBookContacts.filter((c) => {
    const q = interviewerQuery.toLowerCase();
    return (
      !selectedInterviewers.some((s) => s.id === c.id) &&
      (c.fullName.toLowerCase().includes(q) || c.department.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
    );
  });

  const hasAvailability = availabilitySlots && availabilitySlots.some((g) => g.slots.length > 0);

  if (confirmed) return null;

  return (
    <div ref={containerRef} className="space-y-3">
      {/* Collapsed date/time summary */}
      {!editingDateTime && selectedDate && selectedTime && !showEmailStep && (
        <div className="flex items-center gap-2.5 px-4 py-3 bg-[#F0F8FF] rounded-xl border border-[#0DC2FF]/30">
          <Calendar className="w-4 h-4 text-[#127EE3] flex-shrink-0" />
          <div className="flex-1">
            <p className="text-[15px] font-bold text-[#1A1A2E]">
              {toThaiDate(selectedDate)} · {selectedTime} น.
            </p>
          </div>
          <button
            onClick={() => setEditingDateTime(true)}
            className="text-[14px] font-semibold text-[#127EE3] hover:text-[#0e6bc7] underline underline-offset-2 flex-shrink-0 transition-colors"
          >
            แก้ไข
          </button>
        </div>
      )}

      {/* Reviewer availability chips */}
      {hasAvailability && !showEmailStep && editingDateTime && (
        <div className="rounded-xl border border-gray-100 bg-gray-50/70 px-3.5 py-3 space-y-2.5">
          <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">ช่วงเวลาที่ผู้พิจารณาสะดวก</p>
          {availabilitySlots!.filter((g) => g.slots.length > 0).map((group) => (
            <div key={group.reviewerName} className="space-y-1.5">
              <p className="text-[13.5px] font-medium text-gray-500">{group.reviewerName}</p>
              <div className="flex flex-wrap gap-1.5">
                {group.slots.map((s, i) => {
                  const chipKey = `${group.reviewerName}-${i}`;
                  const isChipSelected = selectedChipKey === chipKey;
                  return (
                    <button
                      key={i}
                      onClick={() => handleChipSelect(s, chipKey)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[13.5px] font-medium transition-all cursor-pointer ${
                        isChipSelected
                          ? "bg-[#E0F2FE] border-2 border-[#0DC2FF] text-[#0369a1] shadow-sm"
                          : "bg-white border border-sky-200 text-sky-700 hover:bg-sky-50 hover:border-sky-400"
                      }`}
                    >
                      <Clock className="w-3 h-3 flex-shrink-0" />
                      {s.date} {s.time}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Date picker */}
      {editingDateTime && (<div>
        <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-2">เลือกวันที่</p>
        <button
          onClick={() => setCalendarOpen((v) => !v)}
          className={`w-full flex items-center gap-2.5 px-3.5 rounded-xl border text-[15px] font-medium transition-all text-left min-h-[42px] ${selectedDate ? "border-[#0DC2FF] bg-[#F0F8FF] text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#0DC2FF]/50" : "border-gray-200 bg-[#F0F2F5] text-gray-400 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0DC2FF]/50"}`}
        >
          <span className="flex-1">{selectedDate ? toThaiDate(selectedDate) : "เลือกวันที่"}</span>
          {selectedDate
            ? <span className="text-[14px] text-[#127EE3] flex-shrink-0">เปลี่ยนวัน</span>
            : <Calendar className="w-4 h-4 flex-shrink-0 text-gray-400" />
          }
        </button>

        {calendarOpen && (
          <div className="mt-2 bg-white rounded-2xl border border-gray-100 shadow-xl overflow-visible">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
              <button onClick={() => setViewDate(new Date(year, month - 1, 1))} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
                <ChevronLeft className="w-4 h-4 text-gray-500" />
              </button>
              <p className="text-[16px] font-bold text-[#1A1A2E]">{THAI_MONTHS_FULL[month]} {year + 543}</p>
              <button onClick={() => setViewDate(new Date(year, month + 1, 1))} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="grid grid-cols-7 px-3 pt-3 pb-1">
              {THAI_DOW.map((d, i) => (
                <div key={d} className={`text-center text-[13px] font-bold pb-2 ${i === 0 ? "text-red-400" : "text-gray-400"}`}>{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 px-3 pb-2 gap-y-1">
              {cells.map((cell, idx) => {
                if (!cell) return <div key={idx} />;
                const past = isPast(cell);
                const sel = isSelected(cell);
                const tod = isToday(cell);
                const isSun = cell.getDay() === 0;
                const key = toISODate(cell);
                const schList = MOCK_SCHEDULED[key] ?? [];
                const count = schList.length;
                const isHov = hoveredDate === key;
                return (
                  <div key={idx} className="relative flex flex-col items-center">
                    <button
                      disabled={past}
                      onMouseEnter={() => count > 0 && !past ? setHoveredDate(key) : undefined}
                      onMouseLeave={() => setHoveredDate(null)}
                      onClick={() => { setSelectedDate(cell); setSelectedTime(null); setCalendarOpen(false); setShowEmailStep(false); setSendEmail(null); setSelectedChipKey(null); }}
                      className={`relative w-9 h-9 rounded-xl flex flex-col items-center justify-center transition-all text-[15px] font-medium ${
                        sel ? "bg-[#127EE3] text-white shadow-md shadow-[#127EE3]/30"
                        : past ? "text-gray-200 cursor-not-allowed"
                        : tod ? "ring-2 ring-[#0DC2FF] ring-inset text-[#127EE3] font-bold hover:bg-[#F0F8FF]"
                        : isSun ? "text-red-400 hover:bg-red-50"
                        : "text-[#1A1A2E] hover:bg-[#F0F8FF]"
                      }`}
                    >
                      {cell.getDate()}
                      {count > 0 && !sel && (
                        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                          {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
                            <span key={i} className="w-1 h-1 rounded-full bg-amber-400" />
                          ))}
                        </span>
                      )}
                    </button>

                    {isHov && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 bg-[#1A1A2E] rounded-xl shadow-2xl px-3 py-2.5 min-w-[190px] pointer-events-none">
                        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#1A1A2E] rotate-45 rounded-sm" />
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">นัดในวันนี้ {count} คน</p>
                        {schList.map((s, i) => (
                          <div key={i} className="flex items-center gap-2 py-0.5">
                            <span className="text-[13px] font-bold text-[#0DC2FF] w-9 flex-shrink-0">{s.time}</span>
                            <span className="text-[13.5px] text-white font-medium leading-tight truncate">{s.candidateName}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="px-4 pb-3 flex items-center gap-2 text-[13px] text-gray-400 border-t border-gray-50 pt-2">
              <span className="flex gap-0.5 flex-shrink-0">
                {[0,1,2].map(i => <span key={i} className="w-1.5 h-1.5 rounded-full bg-amber-400" />)}
              </span>
              จำนวน dot = จำนวนนัด · hover เพื่อดูชื่อ
            </div>
          </div>
        )}
      </div>)}

      {/* Time slots */}
      {editingDateTime && selectedDate && !showEmailStep && (
        <div>
          <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-2">เลือกเวลา</p>
          {scheduledOnSelected.length > 0 && (
            <div className="mb-2.5 px-3.5 py-3 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-[13px] font-bold text-amber-600 mb-2 flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                มีนัดในวันนี้แล้ว {scheduledOnSelected.length} คน
              </p>
              <div className="space-y-1.5">
                {scheduledOnSelected.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-[14px] text-amber-700">
                    <span className="font-bold w-11 flex-shrink-0">{s.time}</span>
                    <span className="font-semibold">{s.candidateName}</span>
                    <span className="text-amber-500 text-[13px]">· {s.candidateTitle} · {s.duration}น.</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-4 gap-1.5">
            {TIME_SLOTS.map((t) => {
              const conflict = isConflict(t);
              return (
                <button key={t} disabled={conflict} onClick={() => { setSelectedTime(t); setSelectedChipKey(null); }}
                  className={`relative py-2 rounded-xl text-[15px] font-semibold border transition-all ${
                    selectedTime === t ? "bg-[#127EE3] text-white border-[#127EE3] shadow-sm"
                    : conflict ? "bg-amber-50 text-amber-300 border-amber-100 cursor-not-allowed line-through"
                    : "bg-[#F0F2F5] text-gray-600 border-transparent hover:bg-[#E8EDF2] hover:border-gray-200"
                  }`}
                >
                  {t}
                  {conflict && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full flex items-center justify-center">
                      <X className="w-1.5 h-1.5 text-white" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Duration & type */}
      {selectedDate && selectedTime && !showEmailStep && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-2">ระยะเวลา</p>
            <div className="flex flex-wrap gap-1.5">
              {DURATION_OPTIONS.map((d) => (
                <button key={d} onClick={() => setDuration(d)}
                  className={`px-3 py-1.5 rounded-lg text-[14px] font-semibold transition-all border ${duration === d ? "bg-[#127EE3] text-white border-[#127EE3]" : "bg-[#F0F2F5] text-gray-500 border-transparent hover:border-gray-200"}`}
                >
                  {d < 60 ? `${d}น.` : `${d / 60}ชม.${d % 60 ? `${d % 60}น.` : ""}`}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-2">รูปแบบ</p>
            <div className="flex flex-wrap gap-1.5">
              {INTERVIEW_TYPES.map((t) => (
                <button key={t.key} onClick={() => setInterviewType(t.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[14px] font-semibold transition-all border ${interviewType === t.key ? "bg-[#127EE3] text-white border-[#127EE3]" : "bg-[#F0F2F5] text-gray-500 border-transparent hover:border-gray-200"}`}
                >
                  <span>{t.icon}</span>{t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Interviewer selector */}
      {selectedDate && selectedTime && !showEmailStep && (
        <div ref={interviewerRef} className="relative">
          <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-2">ผู้สัมภาษณ์</p>
          {selectedInterviewers.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {selectedInterviewers.map((c) => (
                <span key={c.id} className={`inline-flex items-center gap-1.5 pl-1.5 pr-1 py-0.5 rounded-full text-[13.5px] font-semibold border ${c.color} border-current/20`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${c.color}`}>{c.initials}</span>
                  {c.fullName}
                  <button onClick={() => setSelectedInterviewers((prev) => prev.filter((x) => x.id !== c.id))} className="w-3.5 h-3.5 rounded-full hover:bg-black/10 flex items-center justify-center transition-colors">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <button
            onClick={() => { setInterviewerDropdownOpen((v) => !v); setInterviewerQuery(""); }}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#F0F2F5] text-[15px] text-gray-400 hover:border-gray-300 transition-colors text-left"
          >
            <UserPlus className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="flex-1">{selectedInterviewers.length > 0 ? "เพิ่มผู้สัมภาษณ์" : "เลือกผู้สัมภาษณ์ (ไม่บังคับ)"}</span>
            <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" />
          </button>
          {interviewerDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-100">
                <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <input
                  autoFocus
                  value={interviewerQuery}
                  onChange={(e) => setInterviewerQuery(e.target.value)}
                  placeholder="ค้นหาชื่อหรือแผนก..."
                  className="flex-1 text-[15px] focus:outline-none placeholder:text-gray-300"
                />
              </div>
              <div className="max-h-[200px] overflow-y-auto">
                {filteredInterviewers.length === 0 ? (
                  <p className="text-[14.5px] text-gray-400 text-center py-4">ไม่พบรายชื่อ</p>
                ) : filteredInterviewers.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedInterviewers((prev) => [...prev, c]); setInterviewerQuery(""); setInterviewerDropdownOpen(false); }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 hover:bg-[#F0F8FF] transition-colors text-left"
                  >
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-bold flex-shrink-0 ${c.color}`}>{c.initials}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-semibold text-[#1A1A2E] truncate">{c.fullName}</p>
                      <p className="text-[13.5px] text-gray-400 truncate">{c.department} · {c.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Proceed button */}
      {selectedDate && selectedTime && !showEmailStep && (
        <div className="pt-1">
          <div className="flex items-start gap-2.5 px-4 py-3 bg-[#F0F8FF] rounded-xl border border-[#0DC2FF]/25 mb-2.5">
            <Zap className="w-4 h-4 text-[#127EE3] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-[15px] font-bold text-[#1A1A2E]">
                {toThaiDate(selectedDate)} · {selectedTime} น. · {duration < 60 ? `${duration} นาที` : `${duration / 60} ชั่วโมง`}
              </p>
              <p className="text-[14px] text-gray-500 mt-0.5">{typeLabel(interviewType)} · {candidateName}</p>
              {selectedInterviewers.length > 0 && (
                <p className="text-[14px] text-[#127EE3] mt-0.5">
                  ผู้สัมภาษณ์: {selectedInterviewers.map((c) => c.fullName).join(", ")}
                </p>
              )}
            </div>
          </div>
          <button onClick={handleProceed} className="w-full flex items-center justify-center gap-2 py-3 bg-[#127EE3] text-white text-[16px] font-bold rounded-xl hover:bg-[#0e6bc7] transition-colors shadow-sm shadow-[#127EE3]/25">
            <Calendar className="w-4 h-4" />
            ดำเนินการต่อ
          </button>
        </div>
      )}

      {/* Email step */}
      {showEmailStep && selectedDate && selectedTime && (
        <div className="space-y-3 pt-1">
          <div className="flex items-start gap-2.5 px-4 py-3 bg-[#F0F8FF] rounded-xl border border-[#0DC2FF]/25">
            <CheckCircle2 className="w-4 h-4 text-[#127EE3] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-[15px] font-bold text-[#1A1A2E]">
                {toThaiDate(selectedDate)} · {selectedTime} น. · {duration < 60 ? `${duration} นาที` : `${duration / 60} ชั่วโมง`}
              </p>
              <p className="text-[14px] text-gray-500 mt-0.5">{typeLabel(interviewType)} · {candidateName}</p>
              {selectedInterviewers.length > 0 && (
                <p className="text-[14px] text-[#127EE3] mt-0.5">
                  ผู้สัมภาษณ์: {selectedInterviewers.map((c) => c.fullName).join(", ")}
                </p>
              )}
            </div>
            <button onClick={() => { setShowEmailStep(false); setSendEmail(null); setEditingDateTime(true); }} className="text-[13px] text-gray-400 hover:text-gray-600 underline underline-offset-2 flex-shrink-0">แก้ไข</button>
          </div>

          <div className="rounded-2xl border border-[#0DC2FF]/30 bg-[#F0F8FF] overflow-hidden">
            <div className="px-4 pt-4 pb-3.5">
              <div className="flex items-center gap-2 mb-1">
                <Mail className="w-4 h-4 text-[#127EE3]" />
                <p className="text-[15.5px] font-bold text-[#1A1A2E]">ขั้นตอนสุดท้าย: ส่งอีเมลยืนยันนัด</p>
              </div>
              <p className="text-[14px] text-gray-500 mb-3 pl-6">เลือกว่าจะส่งอีเมลยืนยันนัดให้ผู้สมัครตอนนี้ หรือข้ามไปก่อน</p>
              <p className="text-[13px] font-bold text-[#127EE3] uppercase tracking-widest mb-2">เลือกหนึ่งตัวเลือกเพื่อจบการนัดสัมภาษณ์</p>
              <div className="flex gap-2">
                <button onClick={() => { setSendEmail(true); setEmailExpanded(true); }}
                  className={`flex-1 py-2.5 rounded-xl text-[15px] font-semibold border-2 transition-all ${sendEmail === true ? "bg-[#127EE3] text-white border-[#127EE3] shadow-sm" : "bg-white text-[#127EE3] border-[#127EE3] hover:bg-[#127EE3] hover:text-white"}`}
                >
                  ส่งเลย
                </button>
                <button onClick={() => { setSendEmail(false); setEmailExpanded(false); }}
                  className={`flex-1 py-2.5 rounded-xl text-[15px] font-semibold border-2 transition-all ${sendEmail === false ? "bg-gray-600 text-white border-gray-600" : "bg-white text-gray-500 border-gray-300 hover:border-gray-500 hover:text-gray-700"}`}
                >
                  ข้ามไปก่อน
                </button>
              </div>
            </div>

            {sendEmail === true && (
              <div className="border-t border-[#0DC2FF]/20">
                <button onClick={() => setEmailExpanded((v) => !v)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/50 transition-colors">
                  <span className="text-[14px] font-bold text-gray-500 uppercase tracking-wide">แก้ไขอีเมล</span>
                  {emailExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>
                {emailExpanded && (
                  <div className="px-4 pb-4 space-y-3">
                    {/* Template selector */}
                    <div>
                      <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">เทมเพลตอีเมล</p>
                      <div className="relative">
                        <select
                          value={selectedTemplateId}
                          onChange={(e) => {
                            const id = Number(e.target.value);
                            setSelectedTemplateId(id);
                            const tpl = interviewEmailTemplates.find((t) => t.id === id);
                            if (tpl) { setEmailSubject(tpl.subject); setEmailBody(tpl.body); }
                          }}
                          className="w-full appearance-none px-3.5 py-2.5 bg-white border border-[#0DC2FF]/30 rounded-xl text-[15px] text-[#1A1A2E] focus:outline-none focus:border-[#127EE3] transition-colors pr-9 cursor-pointer"
                        >
                          {interviewEmailTemplates.map((t) => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    {/* Subject */}
                    <div>
                      <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">หัวข้ออีเมล</p>
                      <input
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#0DC2FF]/30 rounded-xl text-[15px] text-[#1A1A2E] focus:outline-none focus:border-[#127EE3] transition-colors"
                      />
                    </div>
                    {/* Body */}
                    <div>
                      <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">ข้อความอีเมล</p>
                      <textarea value={emailBody} onChange={(e) => setEmailBody(e.target.value)} rows={10}
                        className="w-full text-[14.5px] text-gray-700 leading-[1.7] bg-white border border-[#0DC2FF]/30 rounded-xl px-3.5 py-3 resize-none focus:outline-none focus:border-[#127EE3] transition-colors font-mono"
                      />
                      <p className="text-[13px] text-gray-400 mt-1">แก้ไขเนื้อหาได้ก่อนส่ง</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {sendEmail !== null && (
            <button onClick={handleConfirm} className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#01BFF9] to-[#019EFC] text-white text-[16px] font-bold rounded-xl hover:opacity-90 transition-opacity shadow-md shadow-[#127EE3]/20">
              <CheckCircle2 className="w-4 h-4" />
              {sendEmail ? "ยืนยันนัดและส่งอีเมล" : "ยืนยันนัดสัมภาษณ์"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
