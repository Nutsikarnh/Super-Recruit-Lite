import { useState, useRef, useEffect, useCallback } from "react";
import {
  ArrowLeft, Sparkles, MapPin, DollarSign, Briefcase, ChevronDown, ChevronUp,
  Check, Loader2, FileText, Users, Clock, Building2, Zap, Eye, Send, X,
  Image, Plus, Trash2, RefreshCw, Star, Lightbulb, Bold, Italic, List, ListOrdered,
  GraduationCap, Brain, Search
} from "lucide-react";

interface CreateJobPageProps {
  onBack: () => void;
}

// ---------- RichTextEditor ----------
interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

function RichTextEditor({ value, onChange, placeholder = "พิมพ์ที่นี่...", minHeight = "160px" }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalChange = useRef(false);

  // Sync external value → editor (only when value changes externally)
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (isInternalChange.current) { isInternalChange.current = false; return; }
    if (el.innerHTML !== value) el.innerHTML = value;
  }, [value]);

  const exec = useCallback((cmd: string, arg?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, arg);
  }, []);

  const handleInput = () => {
    isInternalChange.current = true;
    onChange(editorRef.current?.innerHTML ?? "");
  };

  const toolbarBtn = "w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors";

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#0DC2FF] transition-colors bg-white">
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-gray-100 bg-[#F8F9FB]">
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec("bold"); }} className={toolbarBtn} title="Bold">
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec("italic"); }} className={toolbarBtn} title="Italic">
          <Italic className="w-3.5 h-3.5" />
        </button>
        <div className="w-px h-4 bg-gray-200 mx-1" />
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec("insertUnorderedList"); }} className={toolbarBtn} title="Bullet list">
          <List className="w-3.5 h-3.5" />
        </button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec("insertOrderedList"); }} className={toolbarBtn} title="Numbered list">
          <ListOrdered className="w-3.5 h-3.5" />
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder={placeholder}
        className="px-4 py-3 text-[13.5px] text-[#1A1A2E] focus:outline-none leading-relaxed empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
        style={{ minHeight }}
      />
    </div>
  );
}
// ---------- end RichTextEditor ----------

type Step = "form" | "ai-preview" | "review" | "done";

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Freelance", "Internship"];
const EXPERIENCE_LEVELS = ["ไม่จำกัดประสบการณ์", "0–1 ปี", "1–3 ปี", "3–5 ปี", "5+ ปี", "10+ ปี"];
const EDUCATION_LEVELS = ["ไม่จำกัด", "มัธยมศึกษา", "ปวช.", "ปวส.", "ปริญญาตรี", "ปริญญาโท", "ปริญญาเอก"];
const EXPERIENCE_OPTIONS = ["ไม่จำกัด", "0–1 ปี", "1–3 ปี", "3–5 ปี", "5–10 ปี", "10+ ปี"];
const LOCATIONS = ["กรุงเทพฯ", "เชียงใหม่", "ภูเก็ต", "ขอนแก่น", "Remote", "Hybrid (กรุงเทพฯ)"];

const MOST_USED_BENEFITS = [
  "กองทุนสำรองเลี้ยงชีพ",
  "การฝึกอบรมและพัฒนาพนักงาน",
  "ค่าทำงานล่วงเวลา",
  "ค่าน้ำมันรถ, ค่าเดินทาง",
  "ค่าสันทนาการ",
  "ค่าโทรศัพท์",
  "ทำงานสัปดาห์ละ 5 วัน",
  "ประกันสังคม",
  "ประกันสุขภาพ",
  "ประกันอุบัติเหตุ",
  "เครื่องแบบพนักงาน, ชุดยูนิฟอร์ม",
  "เที่ยวประจำปี หรือเลี้ยงประจำปี",
  "โบนัสตามผลงาน/ผลประกอบการ",
  "โบนัสประจำปี",
];

const OTHER_BENEFITS = [
  "ค่าที่พัก (ต่างจังหวัด)",
  "ค่าทุนการศึกษา",
  "ค่ายินดีมงคลสมรส",
  "ค่าอนุโมทนาอุปสมบท",
  "ค่าเบี้ยเลี้ยง",
  "ค่าเสื่อมยานพาหนะ",
  "ทำงานที่บ้าน",
  "มีเวลาการทำงานที่ยืดหยุ่น",
  "ลาบวช",
  "เงินช่วยเหลือฌาปนกิจ",
  "เบี้ยขยัน, ค่าตอบแทนพิเศษ",
];

const ALL_BENEFITS = [...MOST_USED_BENEFITS, ...OTHER_BENEFITS];

const JOB_FIELDS: Record<string, string[]> = {
  "งานการตลาด": ["งานการตลาดทั่วไป", "Digital Marketing", "Brand Management", "Content Marketing", "Performance Marketing"],
  "งานขาย": ["งานขายทั่วไป", "B2B Sales", "Retail Sales", "Key Account Management", "Sales Operations"],
  "Product": ["Product Management", "Product Strategy", "Product Analytics", "Growth Product"],
  "Design": ["UI/UX Design", "Graphic Design", "Motion Design", "Brand Design", "Product Design"],
  "Engineering": ["Backend Development", "Frontend Development", "Full Stack", "Mobile Development", "DevOps / Infrastructure"],
  "Data & AI": ["Data Science", "Data Engineering", "Machine Learning", "Business Intelligence", "Data Analytics"],
  "Finance": ["Accounting", "Financial Planning", "Tax & Compliance", "Treasury", "Audit"],
  "HR & People": ["HR Generalist", "Talent Acquisition", "Learning & Development", "Compensation & Benefits", "HR Business Partner"],
  "Operations": ["Project Management", "Business Operations", "Supply Chain", "Logistics", "Quality Assurance"],
  "Customer Success": ["Customer Support", "Customer Experience", "Account Management", "Community Management"],
  "Content & PR": ["Copywriting", "PR & Communications", "Social Media", "Journalism", "Video Production"],
};

type AISuggestion = { field: string; subfield: string } | null;

function suggestFromTitle(title: string): AISuggestion {
  const t = title.toLowerCase();
  if (t.match(/market/)) return { field: "งานการตลาด", subfield: "งานการตลาดทั่วไป" };
  if (t.match(/digital/)) return { field: "งานการตลาด", subfield: "Digital Marketing" };
  if (t.match(/brand/)) return { field: "งานการตลาด", subfield: "Brand Management" };
  if (t.match(/content/)) return { field: "งานการตลาด", subfield: "Content Marketing" };
  if (t.match(/sale|sales/)) return { field: "งานขาย", subfield: "งานขายทั่วไป" };
  if (t.match(/account manager|key account/)) return { field: "งานขาย", subfield: "Key Account Management" };
  if (t.match(/product manager|product owner|pm\b/)) return { field: "Product", subfield: "Product Management" };
  if (t.match(/product/)) return { field: "Product", subfield: "Product Management" };
  if (t.match(/ux|ui|user experience|user interface|interaction design/)) return { field: "Design", subfield: "UI/UX Design" };
  if (t.match(/graphic|visual design/)) return { field: "Design", subfield: "Graphic Design" };
  if (t.match(/motion/)) return { field: "Design", subfield: "Motion Design" };
  if (t.match(/design/)) return { field: "Design", subfield: "Product Design" };
  if (t.match(/backend|back-end|back end/)) return { field: "Engineering", subfield: "Backend Development" };
  if (t.match(/frontend|front-end|front end/)) return { field: "Engineering", subfield: "Frontend Development" };
  if (t.match(/full.?stack/)) return { field: "Engineering", subfield: "Full Stack" };
  if (t.match(/mobile|ios|android|react native|flutter/)) return { field: "Engineering", subfield: "Mobile Development" };
  if (t.match(/devops|sre|infrastructure|cloud/)) return { field: "Engineering", subfield: "DevOps / Infrastructure" };
  if (t.match(/engineer|developer|software|programmer/)) return { field: "Engineering", subfield: "Full Stack" };
  if (t.match(/data science|data scientist/)) return { field: "Data & AI", subfield: "Data Science" };
  if (t.match(/data engineer/)) return { field: "Data & AI", subfield: "Data Engineering" };
  if (t.match(/machine learning|ml|ai|artificial/)) return { field: "Data & AI", subfield: "Machine Learning" };
  if (t.match(/analyst|analytics|bi\b/)) return { field: "Data & AI", subfield: "Data Analytics" };
  if (t.match(/account|finance|financial|cfo|cfo/)) return { field: "Finance", subfield: "Accounting" };
  if (t.match(/hr|human resource|people/)) return { field: "HR & People", subfield: "HR Generalist" };
  if (t.match(/recrui|talent acqui/)) return { field: "HR & People", subfield: "Talent Acquisition" };
  if (t.match(/project manager|project management/)) return { field: "Operations", subfield: "Project Management" };
  if (t.match(/operation/)) return { field: "Operations", subfield: "Business Operations" };
  if (t.match(/customer success|customer service|support/)) return { field: "Customer Success", subfield: "Customer Support" };
  if (t.match(/copywrite|copywriting/)) return { field: "Content & PR", subfield: "Copywriting" };
  if (t.match(/pr |public relation|communication/)) return { field: "Content & PR", subfield: "PR & Communications" };
  if (t.match(/social media/)) return { field: "Content & PR", subfield: "Social Media" };
  return null;
}

const DEFAULT_SELECTED_BENEFITS = [
  "ประกันสุขภาพกลุ่ม",
  "ประกันชีวิต",
  "วันลาพักร้อน 15 วัน/ปี",
  "โบนัสประจำปี",
  "งบพัฒนาทักษะ 10,000 บาท/ปี",
  "MacBook / อุปกรณ์ครบ",
  "Flexible working hours",
];

const INITIAL_BENEFIT_PRESETS: Record<string, string[]> = {
  "mock-sales": ["ประกันสุขภาพกลุ่ม", "ประกันชีวิต", "ค่าน้ำมัน", "ค่าเดินทาง", "ค่าโทรศัพท์", "Commission", "Incentive"],
};

function generateHighlights(title: string): string[] {
  return [
    `ทำงานในทีมที่มีความเชี่ยวชาญด้าน ${title || "ตำแหน่งนี้"} ระดับแถวหน้าของประเทศ`,
    "Flexible hours + Work from home — ยืดหยุ่นเต็มที่ เน้นผลงานมากกว่าชั่วโมง",
    "เติบโตเร็ว มีงบ upskill ทุกปี พร้อม career path ที่ชัดเจน",
  ];
}

function StepIndicator({ step }: { step: Step }) {
  const steps: { key: Step; label: string }[] = [
    { key: "form", label: "ข้อมูลพื้นฐาน" },
    { key: "ai-preview", label: "AI ช่วยเขียน" },
    { key: "review", label: "ตรวจสอบ" },
    { key: "done", label: "เสร็จสิ้น" },
  ];
  const currentIndex = steps.findIndex((s) => s.key === step);
  return (
    <div className="flex items-center">
      {steps.map((s, i) => {
        const isCompleted = i < currentIndex;
        const isActive = i === currentIndex;
        return (
          <div key={s.key} className="flex items-center">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold transition-all flex-shrink-0 ${
                  isCompleted
                    ? "bg-emerald-500 text-white shadow-sm shadow-emerald-200"
                    : isActive
                    ? "bg-[#127EE3] text-white shadow-md shadow-[#127EE3]/30 ring-4 ring-[#127EE3]/15"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <div className="flex flex-col">
                <span
                  className={`text-[13px] font-semibold whitespace-nowrap leading-tight ${
                    isActive ? "text-[#1A1A2E]" : isCompleted ? "text-emerald-600" : "text-gray-400"
                  }`}
                >
                  {s.label}
                </span>
                {isActive && <span className="text-[10px] text-[#0DC2FF] font-medium">กำลังดำเนินการ</span>}
                {isCompleted && <span className="text-[10px] text-emerald-500 font-medium">เสร็จแล้ว</span>}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 mx-4 h-0.5 min-w-[32px] rounded-full transition-all ${i < currentIndex ? "bg-emerald-400" : "bg-gray-150"}`}
                style={{ background: i < currentIndex ? undefined : "#E8EAF0" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function SelectField({
  label, value, options, onChange, icon,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  icon?: React.ReactNode;
}) {
  return (
    <CustomDropdown
      label={label}
      value={value}
      options={options}
      placeholder="เลือก..."
      onChange={onChange}
      icon={icon}
    />
  );
}

const SAMPLE_GENERATED = {
  title: "",
  summary: "",
  responsibilities: [] as string[],
  qualifications: [] as string[],
};

function generateJobContent(title: string, rawNotes: string) {
  return {
    title,
    summary: `เรากำลังมองหา <strong>${title || "ผู้สมัคร"}</strong> ที่มีความสามารถและความหลงใหลในการทำงาน เพื่อร่วมทีมที่มีพลังงานสูงและวัฒนธรรมที่เน้นการเติบโต คุณจะได้มีบทบาทสำคัญในการขับเคลื่อนผลิตภัณฑ์และบริการของเราสู่ระดับถัดไป`,
    responsibilities: [
      `วางแผนและดำเนินงานในบทบาท ${title || "ตำแหน่งนี้"} อย่างมีประสิทธิภาพ`,
      "ทำงานร่วมกับทีม cross-functional เพื่อผลักดัน project ให้สำเร็จตามเป้าหมาย",
      "วิเคราะห์ข้อมูลและนำเสนอผลลัพธ์ต่อผู้บริหารอย่างสม่ำเสมอ",
      "พัฒนา process และ workflow ให้ทีมทำงานได้คล่องตัวยิ่งขึ้น",
      "ติดตามแนวโน้มของอุตสาหกรรมและนำ best practice มาปรับใช้",
    ],
    qualifications: [
      `มีประสบการณ์ที่เกี่ยวข้องกับ ${title || "ตำแหน่งนี้"}`,
      "มีทักษะการสื่อสารและการนำเสนอที่ดี",
      "สามารถทำงานเป็นทีมและบริหารจัดการเวลาได้ดี",
      "มีความคิดเชิงวิเคราะห์และแก้ปัญหาเฉพาะหน้าได้",
      rawNotes ? `มีทักษะ/ประสบการณ์ด้าน: ${rawNotes.slice(0, 60)}...` : "สามารถปรับตัวและเรียนรู้สิ่งใหม่ได้รวดเร็ว",
    ],
  };
}

interface PhotoSlot {
  id: string;
  url: string | null;
}

function PhotoGallery({
  photos,
  onChange,
}: {
  photos: PhotoSlot[];
  onChange: (photos: PhotoSlot[]) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeSlot, setActiveSlot] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeSlot) return;
    const url = URL.createObjectURL(file);
    onChange(photos.map((p) => (p.id === activeSlot ? { ...p, url } : p)));
    setActiveSlot(null);
    e.target.value = "";
  };

  const removePhoto = (id: string) => {
    onChange(photos.map((p) => (p.id === id ? { ...p, url: null } : p)));
  };

  const openPicker = (id: string) => {
    setActiveSlot(id);
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
      <div className="grid grid-cols-3 gap-3">
        {photos.map((photo, i) => (
          <div key={photo.id} className="relative group">
            {photo.url ? (
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-gray-200">
                <img src={photo.url} alt="" className="w-full h-full object-cover" />
                {i === 0 && (
                  <div className="absolute top-1.5 left-1.5 bg-[#127EE3] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-white" />
                    หลัก
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                  <button
                    onClick={() => openPicker(photo.id)}
                    className="w-7 h-7 bg-white/90 rounded-lg flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <Image className="w-3.5 h-3.5 text-[#1A1A2E]" />
                  </button>
                  <button
                    onClick={() => removePhoto(photo.id)}
                    className="w-7 h-7 bg-white/90 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => openPicker(photo.id)}
                className="w-full aspect-[16/9] rounded-xl border-2 border-dashed border-gray-200 hover:border-[#0DC2FF] hover:bg-[#0DC2FF]/3 transition-all flex flex-col items-center justify-center gap-1 text-gray-300 hover:text-[#0DC2FF]"
              >
                <Plus className="w-4 h-4" />
                {i === 0 && <span className="text-[9px] font-semibold">หลัก</span>}
              </button>
            )}
          </div>
        ))}
      </div>
      <p className="text-[11px] text-gray-400 mt-2">
        รูปแรกจะเป็น cover หลัก · รองรับสูงสุด 3 รูป · แนะนำอัตราส่วน 16:9
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Custom dropdown — large floating panel style                         */
/* ------------------------------------------------------------------ */
function CustomDropdown({
  label,
  value,
  options,
  placeholder,
  onChange,
  disabled = false,
  icon,
}: {
  label: string;
  value: string;
  options: string[];
  placeholder: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  icon?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div>
      <label className="block text-[13px] font-semibold text-[#1A1A2E] mb-1.5">{label}</label>
      <div ref={ref} className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen((o) => !o)}
          className={`w-full flex items-center gap-0 pl-10 pr-10 py-2.5 rounded-xl border text-left transition-all focus:outline-none ${
            disabled
              ? "bg-gray-50 border-gray-100 cursor-not-allowed"
              : open
              ? "bg-white border-[#0DC2FF]"
              : "bg-[#F8F9FB] border-gray-200 hover:border-gray-300"
          }`}
        >
          {icon && (
            <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 flex-shrink-0 ${disabled ? "text-gray-300" : "text-gray-400"}`}>{icon}</span>
          )}
          <span className={`flex-1 text-[14px] font-normal truncate ${value ? (disabled ? "text-gray-300" : "text-[#1A1A2E]") : "text-gray-400"}`}>
            {value || placeholder}
          </span>
          <ChevronDown
            className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-transform duration-200 ${disabled ? "text-gray-200" : "text-gray-400"} ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div className="absolute z-[9999] left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-lg p-2 max-h-64 overflow-y-auto">
            {options.map((opt) => {
              const active = opt === value;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => { onChange(opt); setOpen(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm rounded-lg transition-colors ${
                    active
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  {opt}
                  {active && <Check className="w-4 h-4 text-blue-700 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function BulletHighlights({
  bullets,
  onChange,
  onRegenerate,
}: {
  bullets: string[];
  onChange: (bullets: string[]) => void;
  onRegenerate: () => void;
}) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#0DC2FF]" />
          <span className="text-[12px] font-bold text-[#127EE3]">AI แนะนำ — แก้ไขได้</span>
        </div>
        <button
          onClick={onRegenerate}
          className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-[#127EE3] transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          สร้างใหม่
        </button>
      </div>
      {bullets.map((b, i) => (
        <div key={i} className="flex items-start gap-2.5">
          <div className="w-5 h-5 rounded-full bg-[#127EE3] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-1.5">
            {i + 1}
          </div>
          <input
            type="text"
            value={b}
            onChange={(e) => onChange(bullets.map((x, idx) => (idx === i ? e.target.value : x)))}
            className="flex-1 bg-[#F8F9FB] border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-[#1A1A2E] focus:outline-none focus:border-[#0DC2FF] focus:bg-white transition-all"
          />
        </div>
      ))}
    </div>
  );
}

function BenefitsSelector({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (s: string[]) => void;
}) {
  const [customInput, setCustomInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [benefitSearch, setBenefitSearch] = useState("");
  const [showAllMostUsed, setShowAllMostUsed] = useState(false);

  const toggle = (b: string) => {
    onChange(selected.includes(b) ? selected.filter((x) => x !== b) : [...selected, b]);
  };

  const addCustom = () => {
    const val = customInput.trim();
    if (!val || selected.includes(val)) return;
    onChange([...selected, val]);
    setCustomInput("");
  };

  return (
    <div>
      {/* Selected benefits */}
      <div className="mb-4">
        <p className="text-[12px] font-semibold text-gray-500 mb-2">สวัสดิการที่เลือกแล้ว</p>
        {selected.length === 0 ? (
          <p className="text-[12px] text-gray-400 italic">ยังไม่ได้เลือกสวัสดิการ</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {selected.map((b) => (
              <button
                key={b}
                onClick={() => toggle(b)}
                className="inline-flex items-center gap-1 text-[12px] font-medium px-2.5 py-1 rounded-full border bg-blue-50 border-blue-500 text-blue-700 transition-all hover:bg-blue-100"
              >
                <Check className="w-2.5 h-2.5" />
                {b}
                <X className="w-2.5 h-2.5 opacity-60" />
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => setIsExpanded((v) => !v)}
        className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#127EE3] hover:text-[#0e6bc7] transition-colors mb-3"
      >
        <Plus className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-45" : ""}`} />
        เพิ่มสวัสดิการ
      </button>

      {isExpanded && (<>
      <div className="border border-gray-200 rounded-xl p-4 mb-3 bg-[#F8F9FB] space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={benefitSearch}
            onChange={(e) => setBenefitSearch(e.target.value)}
            placeholder="ค้นหาสวัสดิการ เช่น ประกัน, โบนัส"
            className="w-full pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-[13px] text-[#1A1A2E] placeholder:text-gray-400 focus:outline-none focus:border-[#0DC2FF] transition-all"
          />
        </div>

        {/* Most-used section */}
        {(() => {
          const filtered = MOST_USED_BENEFITS.filter(
            (b) => !benefitSearch || b.includes(benefitSearch)
          );
          const visible = showAllMostUsed ? filtered : filtered.slice(0, 10);
          if (filtered.length === 0) return null;
          return (
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">สวัสดิการที่ถูกใช้บ่อย</p>
              <div className="flex flex-wrap gap-2">
                {visible.map((b) => {
                  const active = selected.includes(b);
                  return (
                    <button
                      key={b}
                      onClick={() => toggle(b)}
                      className={`text-[12px] font-medium px-3 py-1.5 rounded-full border transition-all ${
                        active
                          ? "bg-blue-50 border-blue-500 text-blue-700"
                          : "bg-white border-gray-300 text-gray-800 hover:border-blue-400 hover:text-blue-600"
                      }`}
                    >
                      {active && <Check className="w-2.5 h-2.5 inline mr-1" />}
                      {b}
                    </button>
                  );
                })}
              </div>
              {!showAllMostUsed && filtered.length > 10 && (
                <button
                  onClick={() => setShowAllMostUsed(true)}
                  className="mt-2 text-[12px] text-[#127EE3] hover:text-[#0e6bc7] font-medium transition-colors"
                >
                  ดูเพิ่มเติม ({filtered.length - 10})
                </button>
              )}
            </div>
          );
        })()}

        {/* Other benefits section — shown after "ดูเพิ่มเติม" */}
        {showAllMostUsed && (() => {
          const filtered = OTHER_BENEFITS.filter(
            (b) => !benefitSearch || b.includes(benefitSearch)
          );
          if (filtered.length === 0) return null;
          return (
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">สวัสดิการอื่นๆ</p>
              <div className="flex flex-wrap gap-2">
                {filtered.map((b) => {
                  const active = selected.includes(b);
                  return (
                    <button
                      key={b}
                      onClick={() => toggle(b)}
                      className={`text-[12px] font-medium px-3 py-1.5 rounded-full border transition-all ${
                        active
                          ? "bg-blue-50 border-blue-500 text-blue-700"
                          : "bg-white border-gray-300 text-gray-800 hover:border-blue-400 hover:text-blue-600"
                      }`}
                    >
                      {active && <Check className="w-2.5 h-2.5 inline mr-1" />}
                      {b}
                    </button>
                  );
                })}
                {selected
                  .filter((s) => !ALL_BENEFITS.includes(s))
                  .filter((s) => !benefitSearch || s.includes(benefitSearch))
                  .map((b) => (
                    <button
                      key={b}
                      onClick={() => toggle(b)}
                      className="text-[12px] font-medium px-3 py-1.5 rounded-full border bg-blue-50 border-blue-500 text-blue-700 transition-all"
                    >
                      <Check className="w-2.5 h-2.5 inline mr-1" />
                      {b}
                    </button>
                  ))}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Custom input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCustom()}
          placeholder="เพิ่มสวัสดิการอื่นๆ..."
          className="flex-1 bg-[#F8F9FB] border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-[#1A1A2E] placeholder:text-gray-400 focus:outline-none focus:border-[#0DC2FF] focus:bg-white transition-all"
        />
        <button
          onClick={addCustom}
          className="w-8 h-8 mt-0.5 bg-[#127EE3] hover:bg-[#0e6bc7] text-white rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      </>)}
    </div>
  );
}

function SaveBenefitSetModal({
  value,
  onChange,
  onSave,
  onCancel,
}: {
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4">
        <div className="px-6 pt-6 pb-2">
          <h2 className="text-[16px] font-bold text-[#1A1A2E] mb-4">บันทึกชุดสวัสดิการ</h2>
          <label className="block text-[12px] font-semibold text-gray-500 mb-1.5">ชื่อชุดสวัสดิการ</label>
          <input
            autoFocus
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && value.trim()) onSave(); if (e.key === "Escape") onCancel(); }}
            placeholder="เช่น Sales Team Premium"
            className="w-full bg-[#F8F9FB] border border-gray-200 rounded-xl px-3 py-2.5 text-[13px] text-[#1A1A2E] placeholder:text-gray-400 focus:outline-none focus:border-[#0DC2FF] focus:bg-white transition-all"
          />
        </div>
        <div className="flex gap-2 px-6 py-5">
          <button
            onClick={onCancel}
            className="flex-1 border border-gray-200 text-gray-500 text-[13px] font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={onSave}
            disabled={!value.trim()}
            className="flex-1 bg-gradient-to-r from-[#01BFF9] to-[#019EFC] text-white text-[13px] font-semibold py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function EditAboutModal({
  value,
  onChange,
  onSave,
  onCancel,
}: {
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
        <div className="px-6 pt-6 pb-2">
          <h2 className="text-[16px] font-bold text-[#1A1A2E] mb-4">แก้ไขเกี่ยวกับบริษัท</h2>
          <label className="block text-[12px] font-semibold text-gray-500 mb-1.5">เกี่ยวกับบริษัท</label>
          <textarea
            autoFocus
            rows={7}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-[#F8F9FB] border border-gray-200 rounded-xl px-3 py-2.5 text-[13px] text-[#1A1A2E] placeholder:text-gray-400 focus:outline-none focus:border-[#0DC2FF] focus:bg-white transition-all resize-none"
          />
        </div>
        <div className="flex gap-2 px-6 py-5">
          <button
            onClick={onCancel}
            className="flex-1 border border-gray-200 text-gray-500 text-[13px] font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={onSave}
            className="flex-1 bg-gradient-to-r from-[#01BFF9] to-[#019EFC] text-white text-[13px] font-semibold py-2.5 rounded-xl hover:opacity-90 transition-opacity"
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
}

function AddAboutSetModal({
  name,
  desc,
  onChangeName,
  onChangeDesc,
  onSave,
  onCancel,
}: {
  name: string;
  desc: string;
  onChangeName: (v: string) => void;
  onChangeDesc: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
        <div className="px-6 pt-6 pb-2 space-y-4">
          <h2 className="text-[16px] font-bold text-[#1A1A2E]">สร้างชุดเกี่ยวกับบริษัท</h2>
          <div>
            <label className="block text-[12px] font-semibold text-gray-500 mb-1.5">ชื่อ Template</label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => onChangeName(e.target.value)}
              placeholder="เช่น TechVibe Solutions - Tech Hiring"
              className="w-full bg-[#F8F9FB] border border-gray-200 rounded-xl px-3 py-2.5 text-[13px] text-[#1A1A2E] placeholder:text-gray-400 focus:outline-none focus:border-[#0DC2FF] focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-gray-500 mb-1.5">เกี่ยวกับบริษัท</label>
            <textarea
              rows={5}
              value={desc}
              onChange={(e) => onChangeDesc(e.target.value)}
              className="w-full bg-[#F8F9FB] border border-gray-200 rounded-xl px-3 py-2.5 text-[13px] text-[#1A1A2E] placeholder:text-gray-400 focus:outline-none focus:border-[#0DC2FF] focus:bg-white transition-all resize-none"
            />
          </div>
        </div>
        <div className="flex gap-2 px-6 py-5">
          <button
            onClick={onCancel}
            className="flex-1 border border-gray-200 text-gray-500 text-[13px] font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={onSave}
            disabled={!name.trim()}
            className="flex-1 bg-gradient-to-r from-[#01BFF9] to-[#019EFC] text-white text-[13px] font-semibold py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

const INITIAL_ABOUT_SETS: { id: string; label: string; description: string }[] = [
  {
    id: "default",
    label: "TechVibe Solutions - Default",
    description: "TechVibe Solutions เป็นบริษัทเทคโนโลยีที่พัฒนาโซลูชันดิจิทัลให้กับองค์กรในหลายอุตสาหกรรม ตั้งแต่ระบบบริหารงานภายในองค์กร แพลตฟอร์มข้อมูล ไปจนถึงเครื่องมือที่ช่วยให้ทีมขาย การตลาด และฝ่ายปฏิบัติการทำงานได้มีประสิทธิภาพมากขึ้น\n\nเราทำงานร่วมกับลูกค้าทั้งองค์กรขนาดกลางและขนาดใหญ่ โดยให้ความสำคัญกับการเข้าใจปัญหาทางธุรกิจจริงก่อนออกแบบโซลูชัน ทีมของเราประกอบด้วย Product Manager, Designer, Engineer, Data Analyst และ Business Consultant ที่ทำงานร่วมกันอย่างใกล้ชิด\n\nTechVibe Solutions เชื่อว่าการเติบโตของคนและองค์กรต้องไปพร้อมกัน เราจึงให้ความสำคัญกับการเรียนรู้ การทำงานเป็นทีม และการเปิดโอกาสให้พนักงานได้ทดลองแนวคิดใหม่ ๆ เพื่อสร้างผลงานที่มีคุณค่าต่อลูกค้าและตลาด",
  },
  {
    id: "sales",
    label: "TechVibe Solutions - Sales Hiring",
    description: "ร่วมงานกับทีม Sales ของ TechVibe Solutions ที่เน้นการเติบโต การเรียนรู้ และโอกาสในการสร้างรายได้จากผลงานจริง ทีม Sales ของเราทำงานใกล้ชิดกับลูกค้าองค์กร เข้าใจโจทย์ธุรกิจ และนำเสนอโซลูชันที่ช่วยให้ลูกค้าทำงานได้ดีขึ้น",
  },
];

export default function CreateJobPage({ onBack }: CreateJobPageProps) {
  const [step, setStep] = useState<Step>("form");
  const pageRef = useRef<HTMLDivElement>(null);
  const scrollToTop = () => pageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const [title, setTitle] = useState("");
  const [jobField, setJobField] = useState("");
  const [jobSubfield, setJobSubfield] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState<AISuggestion>(null);
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [showSalary, setShowSalary] = useState(true);
  const [rawNotes, setRawNotes] = useState("");

  const [aiLoading, setAiLoading] = useState(false);
  const [generated, setGenerated] = useState(SAMPLE_GENERATED);
  const [editedSummary, setEditedSummary] = useState("");
  const [editedResponsibilities, setEditedResponsibilities] = useState<string[]>([]);
  const [editedQualifications, setEditedQualifications] = useState<string[]>([]);
  const [responsibilitiesHtml, setResponsibilitiesHtml] = useState("");
  const [qualificationsHtml, setQualificationsHtml] = useState("");

  const [photos, setPhotos] = useState<PhotoSlot[]>([
    { id: "p1", url: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { id: "p2", url: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { id: "p3", url: null },
  ]);

  const [selectedBenefits, setSelectedBenefits] = useState<string[]>(DEFAULT_SELECTED_BENEFITS);
  const [benefitSetId, setBenefitSetId] = useState<string | null>(null);
  const [benefitPresets, setBenefitPresets] = useState<Record<string, string[]>>(INITIAL_BENEFIT_PRESETS);
  const [benefitSetOptions, setBenefitSetOptions] = useState<{ id: string; label: string }[]>([
    { id: "mock-sales", label: "Sales" },
  ]);
  const [showSaveSetModal, setShowSaveSetModal] = useState(false);
  const [newSetName, setNewSetName] = useState("");
  const [highlights, setHighlights] = useState<string[]>([]);

  const [aboutSets, setAboutSets] = useState(INITIAL_ABOUT_SETS);
  const [aboutSetId, setAboutSetId] = useState<string>("default");
  const [aboutDescription, setAboutDescription] = useState(INITIAL_ABOUT_SETS[0].description);
  const [showEditAboutModal, setShowEditAboutModal] = useState(false);
  const [aboutDraftText, setAboutDraftText] = useState("");
  const [showAddAboutSetModal, setShowAddAboutSetModal] = useState(false);
  const [newAboutSetName, setNewAboutSetName] = useState("");
  const [newAboutSetDesc, setNewAboutSetDesc] = useState("");
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    person: "HR Team",
    email: "hr@techvibe.co.th",
    phone: "02-123-4567",
  });
  const [editingContact, setEditingContact] = useState(false);
  const [contactDraft, setContactDraft] = useState({ person: "HR Team", email: "hr@techvibe.co.th", phone: "02-123-4567" });

  // Debounced AI field suggestion from job title
  useEffect(() => {
    if (!title.trim()) { setAiSuggestion(null); return; }
    const timer = setTimeout(() => {
      const suggestion = suggestFromTitle(title);
      setAiSuggestion(suggestion);
      if (suggestion) {
        setJobField(suggestion.field);
        setJobSubfield(suggestion.subfield);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [title]);

  const [aiLanguage, setAiLanguage] = useState("ภาษาไทย");
  const [aiHelperOpen, setAiHelperOpen] = useState(false);
  const [showBrandingTip, setShowBrandingTip] = useState(true);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [linkCopied, setLinkCopied] = useState(false);
  const [publishDate, setPublishDate] = useState(() => new Date().toISOString().split("T")[0]);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    summary: true,
    responsibilities: true,
    qualifications: true,
    benefits: true,
  });

  const toggleSection = (key: string) =>
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const canProceed = title.trim().length > 0 && location && jobType;

  const arrToHtml = (items: string[]) =>
    `<ul>${items.map((s) => `<li>${s}</li>`).join("")}</ul>`;

  const handleGenerateAI = () => {
    setAiLoading(true);
    setTimeout(() => {
      const result = generateJobContent(title, rawNotes);
      setGenerated(result);
      setEditedSummary(result.summary);
      setEditedResponsibilities([...result.responsibilities]);
      setEditedQualifications([...result.qualifications]);
      setResponsibilitiesHtml(arrToHtml(result.responsibilities));
      setQualificationsHtml(arrToHtml(result.qualifications));
      setHighlights(generateHighlights(title));
      setAiLoading(false);
    }, 1800);
  };

  const handleResponsibilityChange = (i: number, val: string) => {
    setEditedResponsibilities((prev) => prev.map((r, idx) => (idx === i ? val : r)));
  };
  const handleQualificationChange = (i: number, val: string) => {
    setEditedQualifications((prev) => prev.map((q, idx) => (idx === i ? val : q)));
  };

  const SUCCESS_TOP_PICKS: {
    name: string; isPerfect: boolean; fitLabel: string;
    company: string; exp: string; location: string; education: string; salary: string;
    competencies: string[];
    whyYoullLike: string[];
    hobbies: string[]; strengths: string[];
    hobbyDescription: string; strengthDescription: string;
    deepAnalysis: { label: string; detail: string }[];
  }[] = [
    {
      name: "ปริญญา วงศ์ชัย", isPerfect: true, fitLabel: "Perfectly Fit",
      company: "Line Thailand", exp: "5 ปี", location: "กรุงเทพฯ",
      education: "ม.จุฬาลงกรณ์ — Design", salary: "65,000–80,000 บาท",
      competencies: ["Product Thinking", "User Empathy"],
      whyYoullLike: [
        "ประสบการณ์ Product Design ตรงสาย 5 ปีจาก Line Thailand",
        "เคยนำทีมออกแบบ Mobile App ที่มีผู้ใช้กว่า 10 ล้านคน",
        "ทักษะ Design System แข็งแกร่ง สร้างมาตรฐาน UI ให้ทั้งองค์กร",
      ],
      hobbies: ["Photography", "Illustration"],
      strengths: ["Strategic Thinking", "Vision"],
      hobbyDescription: "มองงานผ่านเลนส์ที่ละเอียด ให้ความสำคัญกับ visual detail ทุกส่วน",
      strengthDescription: "วางทิศทาง Design ระยะยาวได้ดี ตัดสินใจจาก insight เสมอ",
      deepAnalysis: [
        { label: "Self-driven", detail: "มีความสามารถในการตั้งเป้าหมายและทำงานได้โดยไม่ต้องรอคำสั่ง" },
        { label: "Collaborative", detail: "ทำงานร่วมกับ dev และ PM ได้อย่างราบรื่น มี track record ที่ดี" },
      ],
    },
    {
      name: "สุดา พิมพ์ทอง", isPerfect: false, fitLabel: "Strong Match",
      company: "Agoda", exp: "4 ปี", location: "กรุงเทพฯ",
      education: "ม.ธรรมศาสตร์ — HCI", salary: "55,000–70,000 บาท",
      competencies: ["Research Synthesis", "Stakeholder Comm."],
      whyYoullLike: [
        "Background UX Research แข็งแกร่ง ทำ A/B Testing หลายร้อยครั้ง",
        "เคยปรับปรุง Conversion Rate ของ E-commerce ได้ +22%",
        "ทำงานร่วมกับ Engineering ได้ดี มีประสบการณ์ Agile",
      ],
      hobbies: ["Travel", "Writing"],
      strengths: ["Empathy", "Communication"],
      hobbyDescription: "ชอบสังเกตพฤติกรรมผู้คนในสภาพแวดล้อมต่าง ๆ นำมาต่อยอดงาน Research",
      strengthDescription: "เข้าใจความต้องการ User และนำเสนอ Insight ให้ Stakeholder เข้าใจง่าย",
      deepAnalysis: [
        { label: "Data-informed", detail: "ตัดสินใจจากข้อมูลและ feedback จาก User เสมอ" },
        { label: "Proactive", detail: "มักเสนอ improvement ก่อนที่ทีมจะขอ แสดงถึงความรับผิดชอบสูง" },
      ],
    },
    {
      name: "ธนกร ศรีวิชัย", isPerfect: false, fitLabel: "Good Fit",
      company: "SCB Tech X", exp: "3 ปี", location: "กรุงเทพฯ",
      education: "ม.เกษตรศาสตร์ — IT", salary: "45,000–58,000 บาท",
      competencies: ["Visual Craft", "Rapid Prototyping"],
      whyYoullLike: [
        "ทักษะ UI แข็งแกร่ง มีผลงาน Fintech ที่สวยงามและใช้งานง่าย",
        "ออกแบบ Interaction ที่ซับซ้อนให้เข้าใจง่ายได้เก่ง",
        "เรียนรู้เร็ว เคยส่ง Design ครบใน Sprint ทุกรอบโดยไม่มี Rework",
      ],
      hobbies: ["Gaming", "Music Production"],
      strengths: ["Problem Solving", "Execution"],
      hobbyDescription: "ความสนใจใน Gaming ช่วยพัฒนาความเข้าใจ Interaction ที่ดีและ Game UX",
      strengthDescription: "ลงมือทำได้เร็ว แก้ปัญหา on-the-spot ได้ดี ไม่ติดขัดใน iteration",
      deepAnalysis: [
        { label: "Detail-oriented", detail: "ให้ความสำคัญกับ pixel-level precision มี track record งานที่ไม่มี visual bug" },
        { label: "Fast learner", detail: "เรียนรู้ tool และ framework ใหม่ได้เร็ว ปรับตัวกับทีมต่าง ๆ ได้ดี" },
      ],
    },
  ];

  if (step === "done") {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#F0F2F5] px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-5">

          {/* ── Centered success message + Branding next step ── */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="h-[3px] bg-gradient-to-r from-[#01BFF9] to-[#019EFC]" />
            <div className="px-8 pt-8 pb-6 text-center">
              <div className="w-14 h-14 bg-emerald-50 border-2 border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-7 h-7 text-emerald-500" strokeWidth={2.5} />
              </div>
              <h2 className="text-[22px] font-bold text-[#1A1A2E] mb-1.5">ประกาศงานถูกสร้างเรียบร้อยแล้ว</h2>
              <p className="text-[14px] text-gray-600">
                <span className="font-semibold text-[#1A1A2E]">{title || "ตำแหน่งงาน"}</span>{" "}
                ถูกเผยแพร่เรียบร้อยแล้ว
              </p>
              <p className="text-[12.5px] text-gray-400 mt-1">
                AI กำลังสแกนหาผู้สมัคร Top Picks — จะแสดงผลภายใน 24 ชั่วโมง
              </p>
            </div>
            {/* Branding next step — compact card */}
            <div className="mx-6 mb-6 px-5 py-4 rounded-xl border border-[#DFF0FB] bg-[#F5FBFF] flex items-center gap-4">
              <div className="w-9 h-9 rounded-lg bg-[#E0F2FE] flex items-center justify-center flex-shrink-0">
                <Building2 style={{ width: 18, height: 18 }} className="text-[#0277B5]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-[#0277B5] uppercase tracking-wide leading-none mb-1">ขั้นตอนถัดไป</p>
                <p className="text-[13.5px] font-semibold text-[#1A1A2E] leading-snug">เพิ่ม Branding ให้ประกาศนี้ ฟรี</p>
                <p className="text-[12px] text-gray-500 mt-0.5 max-w-sm leading-relaxed">เพิ่ม YOU SAY / HR SAY และ Dream Company เพื่อช่วยให้ผู้สมัคร Top Picks เลือกคุณก่อนคู่แข่ง</p>
              </div>
              <button
                onClick={onBack}
                className="flex-shrink-0 px-4 py-2 border border-[#00ADEF] text-[#00ADEF] hover:bg-[#EBF6FF] text-[12.5px] font-semibold rounded-lg transition-all whitespace-nowrap"
              >
                สร้าง Branding
              </button>
            </div>
          </div>

          {/* ── Top Picks preview cards ── */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-0.5">
                <Zap className="w-3.5 h-3.5 text-[#0DC2FF]" />
                <h3 className="text-[15px] font-bold text-[#1A1A2E]">Top Picks สำหรับตำแหน่งนี้</h3>
                <span className="text-[10px] font-semibold text-[#0DC2FF] bg-[#EBF8FF] px-2 py-0.5 rounded-full ml-1">AI Preview</span>
              </div>
              <p className="text-[12px] text-gray-400">
                ตัวอย่างผู้สมัครที่ AI แนะนำ — ผลลัพธ์จริงจะแสดงภายใน 24 ชั่วโมง
              </p>
            </div>

            <div className="divide-y divide-gray-100">
              {SUCCESS_TOP_PICKS.map((c, i) => (
                <div key={i} className="overflow-hidden">
                  {/* Perfect fit top accent bar */}
                  {c.isPerfect && <div className="h-[3px] bg-gradient-to-r from-[#01BFF9] to-[#019EFC]" />}
                  <div className={c.isPerfect ? "p-6 flex gap-6" : "p-5 flex gap-5"}>

                    {/* ── LEFT panel — matches RunnerUpCard w-[244px] / PerfectFitCard w-[256px] ── */}
                    <div className={
                      c.isPerfect
                        ? "w-[256px] flex-shrink-0 border-r border-gray-100 pr-6"
                        : "w-[244px] flex-shrink-0 border-r border-gray-100 pr-5"
                    }>
                      {/* Avatar + name + badge */}
                      <div className={c.isPerfect ? "flex items-start gap-3 mb-5" : "flex items-start gap-3 mb-4"}>
                        {/* Anonymous avatar — lg = w-12 h-12 rounded-2xl */}
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#EBF6FF] to-[#D6EDFF] flex items-center justify-center flex-shrink-0">
                          <span className="text-[#127EE3] text-[15px] font-black">{c.name.charAt(0)}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={c.isPerfect
                            ? "text-[15px] text-[#111827] font-semibold leading-snug mb-1"
                            : "text-[14px] text-[#111827] font-semibold leading-snug mb-1"
                          }>{c.name}</p>
                          {c.isPerfect ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#EBF8FF] text-[#0277a8] tracking-wide uppercase">
                              <Zap className="w-2.5 h-2.5" />
                              Perfectly Fit
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200">
                              {c.fitLabel}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Info rows */}
                      <div className={c.isPerfect ? "space-y-2 text-[12.5px] mb-4" : "space-y-2 text-[12px]"}>
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span className="font-medium text-[#111827] leading-snug">{c.company}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <Clock className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                          <span>{c.exp} ประสบการณ์</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <MapPin className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                          <span>{c.location}</span>
                        </div>
                        <div className="flex items-start gap-2 text-gray-500">
                          <GraduationCap className="w-3.5 h-3.5 text-gray-300 flex-shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{c.education}</span>
                        </div>
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                          <DollarSign className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span className={c.isPerfect
                            ? "font-semibold text-[#111827] text-[13px]"
                            : "font-semibold text-[#111827]"
                          }>{c.salary}</span>
                        </div>
                      </div>

                      {/* Core Competencies */}
                      {c.competencies.length > 0 && (
                        <div className={c.isPerfect ? "pt-3 mt-3 border-t border-gray-100" : "mt-3 pt-3 border-t border-gray-100"}>
                          <p className={c.isPerfect
                            ? "text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2"
                            : "text-[9px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5"
                          }>Core Competencies</p>
                          <div className="flex flex-wrap gap-1">
                            {c.competencies.map((comp) => (
                              <span key={comp} className={c.isPerfect
                                ? "text-[11px] font-medium px-2 py-0.5 rounded-md bg-teal-50 text-teal-700"
                                : "text-[10px] font-medium px-1.5 py-0.5 rounded bg-teal-50 text-teal-600"
                              }>{comp}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ── RIGHT panel ── */}
                    <div className="flex-1 min-w-0 flex flex-col">
                      {/* Why This Candidate Stands Out */}
                      <p className={c.isPerfect
                        ? "text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3"
                        : "text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3"
                      }>Why This Candidate Stands Out</p>
                      <ul className={c.isPerfect ? "space-y-2.5 mb-5" : "space-y-2.5 mb-4"}>
                        {c.whyYoullLike.map((item, idx) => (
                          <li key={idx} className={c.isPerfect
                            ? "flex gap-3 text-[13px] text-gray-700 leading-[1.65]"
                            : "flex gap-3 text-[12.5px] text-gray-700 leading-[1.65]"
                          }>
                            <span className={c.isPerfect
                              ? "flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 text-gray-400 text-[10px] font-bold flex items-center justify-center mt-[1px]"
                              : "flex-shrink-0 w-4 h-4 rounded-full bg-gray-100 text-gray-400 text-[9px] font-bold flex items-center justify-center mt-[2px]"
                            }>{idx + 1}</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Character section — same as RunnerUpCard inline style */}
                      <div className="mb-4 pt-3 border-t border-gray-100">
                        <p className={c.isPerfect
                          ? "text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5"
                          : "text-[9px] font-semibold text-gray-400 uppercase tracking-wider mb-2"
                        }>ตัวตน (Character)</p>
                        <div className="flex items-stretch gap-2">
                          <div className={c.isPerfect
                            ? "flex-1 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2.5"
                            : "flex-1 rounded-lg bg-blue-50 border border-blue-100 px-2.5 py-2"
                          }>
                            <p className={c.isPerfect
                              ? "text-[9px] font-medium text-gray-400 mb-1.5"
                              : "text-[9px] font-medium text-gray-400 mb-1"
                            }>Hobbies</p>
                            <span className={c.isPerfect
                              ? "text-[12px] font-semibold text-gray-700 leading-tight"
                              : "text-[11.5px] font-semibold text-gray-700"
                            }>{c.hobbies.join(", ")}</span>
                            <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{c.hobbyDescription}</p>
                          </div>
                          <div className={c.isPerfect
                            ? "flex-1 rounded-lg bg-pink-50 border border-pink-100 px-3 py-2.5"
                            : "flex-1 rounded-lg bg-pink-50 border border-pink-100 px-2.5 py-2"
                          }>
                            <p className={c.isPerfect
                              ? "text-[9px] font-medium text-gray-400 mb-1.5"
                              : "text-[9px] font-medium text-gray-400 mb-1"
                            }>Strengths</p>
                            <span className={c.isPerfect
                              ? "text-[12px] font-semibold text-gray-700 leading-tight block mb-1"
                              : "text-[11.5px] font-semibold text-gray-700"
                            }>{c.strengths.join(", ")}</span>
                            <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{c.strengthDescription}</p>
                          </div>
                        </div>
                      </div>

                      {/* Behavioral Signals */}
                      <div className="mb-4 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Brain className="w-3 h-3 text-gray-400" />
                          <span className={c.isPerfect
                            ? "text-[10px] font-semibold text-gray-400 uppercase tracking-wider"
                            : "text-[9px] font-semibold text-gray-400 uppercase tracking-wider"
                          }>Behavioral Signals</span>
                          <span className="text-[9px] text-gray-300 ml-1">· AI</span>
                        </div>
                        <ul className="space-y-1.5">
                          {c.deepAnalysis.map((item, idx) => (
                            <li key={idx} className={c.isPerfect
                              ? "flex gap-2.5 text-[12px] leading-relaxed text-gray-500"
                              : "flex gap-2 text-[11.5px] leading-relaxed text-gray-500"
                            }>
                              <span className="flex-shrink-0 w-1 h-1 rounded-full bg-gray-300 mt-[7px]" />
                              <span><span className="font-medium text-gray-700">{item.label}</span> — {item.detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* CTA */}
                      <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-100">
                        <button className={c.isPerfect
                          ? "flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold bg-gradient-to-r from-[#01BFF9] to-[#019EFC] text-white hover:opacity-90 transition-opacity"
                          : "flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12.5px] font-semibold bg-gradient-to-r from-[#01BFF9] to-[#019EFC] text-white hover:opacity-90 transition-opacity"
                        }>
                          <FileText className="w-3.5 h-3.5" />
                          ดูโปรไฟล์
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 border-t border-gray-100">
              <button
                onClick={onBack}
                className="w-full py-2.5 bg-gradient-to-r from-[#01BFF9] to-[#019EFC] hover:opacity-90 text-white text-[13.5px] font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Star className="w-3.5 h-3.5" />
                ดู Top Picks ทั้งหมด
              </button>
            </div>
          </div>

          {/* Bottom back link */}
          <div className="flex justify-center pb-2">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-5 py-2 text-gray-400 hover:text-gray-600 text-[13px] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              กลับหน้าหลัก
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <>
    <div ref={pageRef} className="min-h-[calc(100vh-64px)] bg-[#F0F2F5]">
      {/* Top header bar */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-5">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center hover:border-[#127EE3] hover:text-[#127EE3] hover:bg-blue-50 transition-all text-gray-500 flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Zap className="w-3 h-3 text-[#0DC2FF]" />
              <p className="text-[10px] font-bold text-[#0DC2FF] uppercase tracking-widest">Super Recruit</p>
            </div>
            <h1 className="text-[18px] font-bold text-[#1A1A2E] leading-tight truncate">
              สร้างประกาศงานใหม่
            </h1>
          </div>
          <div className="hidden md:block">
            <StepIndicator step={step} />
          </div>
        </div>
        {/* Mobile stepper */}
        <div className="md:hidden px-6 pb-4 overflow-x-auto">
          <StepIndicator step={step} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-7">

        {step === "form" && (
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-5">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="px-7 pt-6 pb-3  flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#127EE3]/10 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-4 h-4 text-[#127EE3]" />
                  </div>
                  <div>
                    <h2 className="text-[15px] font-bold text-[#1A1A2E] leading-tight">ข้อมูลพื้นฐาน</h2>
                    <p className="text-[11.5px] text-gray-400 mt-0.5">กรอกข้อมูลที่จำเป็นสำหรับประกาศงาน</p>
                  </div>
                </div>
                <div className="px-7 pt-6 pb-6 space-y-5">
                  <div>
                    <label className="block text-[13px] font-semibold text-[#1A1A2E] mb-1.5">
                      ชื่อตำแหน่งงาน
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="เช่น Senior Product Designer, Marketing Manager"
                      className="w-full bg-[#F8F9FB] border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-[#1A1A2E] placeholder:text-gray-400 focus:outline-none focus:border-[#0DC2FF] focus:bg-white transition-all"
                    />
                    {aiSuggestion && (
                      <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#EBF6FF] to-[#F0FBFF] border border-[#0DC2FF]/25 rounded-xl">
                        <div className="w-5 h-5 rounded-full bg-[#0DC2FF]/15 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-2.5 h-2.5 text-[#0DC2FF]" />
                        </div>
                        <span className="text-[11.5px] text-gray-500 flex-1">
                          AI แนะนำสายอาชีพ:
                          <span className="font-semibold text-[#127EE3] mx-1">{aiSuggestion.field}</span>
                          <span className="text-gray-300 mr-1">/</span>
                          <span className="font-semibold text-[#127EE3]">{aiSuggestion.subfield}</span>
                        </span>
                        <span className="text-[10px] text-[#0DC2FF] bg-[#0DC2FF]/10 px-2 py-0.5 rounded-full font-semibold whitespace-nowrap">AI</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <CustomDropdown
                      label="สายอาชีพ"
                      value={jobField}
                      options={Object.keys(JOB_FIELDS)}
                      placeholder="เลือกสายอาชีพ..."
                      onChange={(v) => { setJobField(v); setJobSubfield(""); }}
                      icon={<Briefcase className="w-4 h-4" />}
                    />
                    <CustomDropdown
                      label="สายอาชีพย่อย"
                      value={jobSubfield}
                      options={jobField ? (JOB_FIELDS[jobField] ?? []) : []}
                      placeholder={jobField ? "เลือกสายอาชีพย่อย..." : "เลือกสายอาชีพก่อน"}
                      onChange={setJobSubfield}
                      disabled={!jobField}
                      icon={<Users className="w-4 h-4" />}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <SelectField label="สถานที่ทำงาน" value={location} options={LOCATIONS} onChange={setLocation} icon={<MapPin className="w-4 h-4" />} />
                    <SelectField label="ประเภทการจ้างงาน" value={jobType} options={JOB_TYPES} onChange={setJobType} icon={<Briefcase className="w-4 h-4" />} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <CustomDropdown
                      label="วุฒิการศึกษา"
                      value={education}
                      options={EDUCATION_LEVELS}
                      placeholder="เลือกวุฒิการศึกษา"
                      onChange={setEducation}
                      icon={<GraduationCap className="w-4 h-4" />}
                    />
                    <CustomDropdown
                      label="จำนวนปีประสบการณ์"
                      value={experience}
                      options={EXPERIENCE_OPTIONS}
                      placeholder="เลือกประสบการณ์"
                      onChange={setExperience}
                      icon={<Clock className="w-4 h-4" />}
                    />
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-[#FAFBFC] p-4 space-y-3">
                    <label className="block text-[13px] font-semibold text-[#1A1A2E]">เงินเดือน (บาท/เดือน)</label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="number" value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} placeholder="ต่ำสุด" className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-[14px] text-[#1A1A2E] placeholder:text-gray-400 focus:outline-none focus:border-[#0DC2FF] focus:bg-white transition-all" />
                      </div>
                      <span className="text-gray-300 text-[18px] font-light">–</span>
                      <div className="relative flex-1">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="number" value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} placeholder="สูงสุด" className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-[14px] text-[#1A1A2E] placeholder:text-gray-400 focus:outline-none focus:border-[#0DC2FF] focus:bg-white transition-all" />
                      </div>
                    </div>
                    {title && location && jobType && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#EBF6FF] to-[#F0FBFF] border border-[#0DC2FF]/25 rounded-xl">
                        <div className="w-5 h-5 rounded-full bg-[#0DC2FF]/15 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-2.5 h-2.5 text-[#0DC2FF]" />
                        </div>
                        <span className="flex-1 text-[11.5px] text-gray-500">
                          AI แนะนำ: <span className="font-semibold text-[#127EE3]">35,000 – 45,000 บาท/เดือน</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => { setSalaryMin("35000"); setSalaryMax("45000"); }}
                          className="text-[11px] font-bold text-white bg-[#127EE3] hover:bg-[#0e6bc7] px-2.5 py-1 rounded-lg whitespace-nowrap flex-shrink-0 transition-colors"
                        >
                          ใช้เลย
                        </button>
                      </div>
                    )}
                    <label className="flex items-center gap-2 cursor-pointer w-fit">
                      <input
                        type="checkbox"
                        checked={showSalary}
                        onChange={(e) => setShowSalary(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-[#127EE3] accent-[#127EE3] cursor-pointer"
                      />
                      <span className="text-[12.5px] text-gray-500">แสดงเงินเดือนในหน้าประกาศ</span>
                    </label>
                    {!showSalary && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-100 rounded-xl">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                        <span className="text-[11.5px] text-amber-700">การแสดงเงินเดือนช่วยเพิ่มโอกาสให้ผู้สมัครสนใจและสมัครงานมากขึ้น</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>

            <div className="space-y-4">
              {/* Company card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">บริษัทของคุณ</p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0DC2FF] to-[#127EE3] flex items-center justify-center flex-shrink-0 shadow-md shadow-[#127EE3]/20">
                    <span className="text-white text-[11px] font-black">TV</span>
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-[#1A1A2E]">TechVibe Solutions</p>
                    <p className="text-[12px] text-gray-400 mt-0.5">Technology · กรุงเทพฯ</p>
                  </div>
                </div>
              </div>

              {/* Quota card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="mb-1">
                  <p className="text-[12px] font-semibold text-gray-500">ตำแหน่งคงเหลือ</p>
                </div>
                <p className="text-[26px] font-black text-[#1A1A2E] leading-none mb-2">
                  5 <span className="text-[15px] font-normal text-gray-400">/ 10 ตำแหน่ง</span>
                </p>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="w-[50%] h-full bg-gradient-to-r from-[#0DC2FF] to-[#127EE3] rounded-full" />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === "ai-preview" && (
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-4">

              {/* AI Helper — collapsible optional section */}
              <div className="rounded-2xl border border-dashed border-[#0DC2FF]/40 bg-[#F8FCFF]">
                <button
                  type="button"
                  onClick={() => setAiHelperOpen((o) => !o)}
                  className="w-full flex items-center gap-3 px-5 py-4 hover:bg-[#EBF6FF]/50 transition-colors text-left rounded-2xl"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#0DC2FF]/10 flex items-center justify-center flex-shrink-0">
                    <Brain className="w-3.5 h-3.5 text-[#127EE3]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-semibold text-[#1A1A2E] leading-tight">
                      ให้ AI ช่วยเขียน <span className="text-gray-400 font-normal">(ถ้าต้องการ)</span>
                    </p>
                    <p className="text-[11.5px] text-gray-400 mt-0.5">มี JD อยู่แล้ว? กรอกเองด้านล่างได้เลย หรือกดเปิดให้ AI ช่วยร่าง</p>
                  </div>
                  {aiHelperOpen
                    ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  }
                </button>

                {aiHelperOpen && (
                  <div className="px-5 pb-5 space-y-3 border-t border-[#0DC2FF]/20">
                    <div className="pt-4">
                      <textarea
                        value={rawNotes}
                        onChange={(e) => setRawNotes(e.target.value)}
                        placeholder="เช่น ลักษณะงานคร่าวๆ, สิ่งที่อยากได้จากผู้สมัคร, จุดเด่นของตำแหน่งนี้"
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-[#1A1A2E] placeholder:text-gray-400 focus:outline-none focus:border-[#0DC2FF] transition-all resize-y leading-relaxed"
                        style={{ minHeight: "72px", maxHeight: "160px" }}
                      />
                    </div>

                    <div className="flex items-end gap-3">
                      <div className="flex-1">
                        <CustomDropdown
                          label="ภาษาที่ต้องการ"
                          value={aiLanguage}
                          options={["ภาษาไทย", "ภาษาอังกฤษ"]}
                          placeholder="เลือกภาษา..."
                          onChange={setAiLanguage}
                        />
                      </div>
                      <button
                        onClick={handleGenerateAI}
                        disabled={aiLoading}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#127EE3] to-[#0DC2FF] hover:from-[#0e6bc7] hover:to-[#0ab8f5] disabled:opacity-50 disabled:cursor-not-allowed text-white text-[13.5px] font-bold rounded-xl transition-all shadow-md shadow-[#127EE3]/20 whitespace-nowrap mb-0.5"
                      >
                        {aiLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            AI กำลังร่าง...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            สร้าง JD ด้วย AI
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* JD fields — always visible and editable */}

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="divide-y divide-gray-50">
                      {/* Responsibilities section */}
                      <div>
                        <button onClick={() => toggleSection("responsibilities")} className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50/80 transition-colors group">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-md bg-gray-100 group-hover:bg-[#EBF6FF] flex items-center justify-center transition-colors">
                              <Briefcase className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#127EE3] transition-colors" />
                            </div>
                            <span className="text-[14px] font-semibold text-[#1A1A2E]">หน้าที่รับผิดชอบ</span>
                          </div>
                          {expandedSections.responsibilities ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </button>
                        {expandedSections.responsibilities && (
                          <div className="px-6 pb-5">
                            <RichTextEditor
                              value={responsibilitiesHtml}
                              onChange={setResponsibilitiesHtml}
                              placeholder="ระบุหน้าที่รับผิดชอบ..."
                              minHeight="140px"
                            />
                          </div>
                        )}
                      </div>

                      {/* Qualifications section */}
                      <div>
                        <button onClick={() => toggleSection("qualifications")} className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50/80 transition-colors group">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-md bg-gray-100 group-hover:bg-[#EBF6FF] flex items-center justify-center transition-colors">
                              <Users className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#127EE3] transition-colors" />
                            </div>
                            <span className="text-[14px] font-semibold text-[#1A1A2E]">คุณสมบัติที่ต้องการ</span>
                          </div>
                          {expandedSections.qualifications ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </button>
                        {expandedSections.qualifications && (
                          <div className="px-6 pb-5">
                            <RichTextEditor
                              value={qualificationsHtml}
                              onChange={setQualificationsHtml}
                              placeholder="ระบุคุณสมบัติที่ต้องการ..."
                              minHeight="140px"
                            />
                          </div>
                        )}
                      </div>

                      {/* Summary section — below qualifications */}
                      <div>
                        <button onClick={() => toggleSection("summary")} className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50/80 transition-colors group">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-md bg-gray-100 group-hover:bg-[#EBF6FF] flex items-center justify-center transition-colors">
                              <FileText className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#127EE3] transition-colors" />
                            </div>
                            <span className="text-[14px] font-semibold text-[#1A1A2E]">Job Summary</span>
                          </div>
                          {expandedSections.summary ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </button>
                        {expandedSections.summary && (
                          <div className="px-6 pb-5">
                            <textarea value={editedSummary} onChange={(e) => setEditedSummary(e.target.value)} placeholder="เขียนสรุปเกี่ยวกับตำแหน่งงานนี้..." className="w-full h-28 bg-[#F8F9FB] border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-[#1A1A2E] placeholder:text-gray-400 focus:outline-none focus:border-[#0DC2FF] focus:bg-white transition-all resize-none leading-relaxed" />
                          </div>
                        )}
                      </div>
                  </div>
              </div>
            </div>

            {/* Right panel — job summary card only */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 pt-5 pb-3">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">สรุปตำแหน่ง</p>
                </div>
                <div className="px-5 pb-5 space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-[#EBF6FF] flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-3 h-3 text-[#127EE3]" />
                    </div>
                    <span className="text-[13px] font-semibold text-[#1A1A2E] truncate">{title || "—"}</span>
                  </div>
                  {jobField && (
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-md bg-gray-50 flex items-center justify-center flex-shrink-0">
                        <Users className="w-3 h-3 text-gray-400" />
                      </div>
                      <span className="text-[13px] text-gray-500 truncate">{jobField}{jobSubfield ? ` · ${jobSubfield}` : ""}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-gray-50 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-3 h-3 text-gray-400" />
                    </div>
                    <span className="text-[13px] text-gray-500">{location || "—"}</span>
                  </div>
                  {(salaryMin || salaryMax) && (
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center flex-shrink-0">
                        <DollarSign className="w-3 h-3 text-emerald-500" />
                      </div>
                      <span className="text-[13px] text-gray-500">
                        {salaryMin && salaryMax
                          ? `${Number(salaryMin).toLocaleString()} – ${Number(salaryMax).toLocaleString()} บาท`
                          : salaryMin
                          ? `${Number(salaryMin).toLocaleString()}+ บาท`
                          : `ถึง ${Number(salaryMax).toLocaleString()} บาท`}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-gray-50 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-3 h-3 text-gray-400" />
                    </div>
                    <span className="text-[13px] text-gray-500">{jobType || "—"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === "ai-preview" && (
          <div className="mt-6 bg-white border border-gray-100 rounded-2xl shadow-sm px-6 py-4 flex items-center justify-between gap-4">
            <button
              onClick={() => { setStep("form"); scrollToTop(); }}
              className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-500 font-semibold rounded-xl hover:border-[#127EE3] hover:text-[#127EE3] hover:bg-[#EBF6FF] transition-all text-[13.5px]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              ย้อนกลับ
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={handleGenerateAI}
                disabled={aiLoading}
                className="flex items-center gap-2 px-5 py-2.5 border border-[#0DC2FF]/40 text-[#127EE3] font-semibold rounded-xl hover:bg-[#EBF6FF] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-[13.5px]"
              >
                {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                Re-generate
              </button>
              <button
                onClick={() => { setStep("review"); scrollToTop(); }}
                className="flex items-center gap-2.5 px-8 py-3 bg-gradient-to-r from-[#127EE3] to-[#0DC2FF] hover:from-[#0e6bc7] hover:to-[#0ab8f5] text-white font-bold rounded-xl transition-all shadow-md shadow-[#127EE3]/25 text-[14px] whitespace-nowrap"
              >
                <Eye className="w-4 h-4" />
                ตรวจสอบก่อนเผยแพร่
              </button>
            </div>
          </div>
        )}

        {step === "review" && (
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Job header */}
                <div className="bg-white border-b border-gray-100 px-8 pt-7 pb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0DC2FF] to-[#127EE3] border border-[#0DC2FF]/20 flex items-center justify-center flex-shrink-0 shadow-md shadow-[#127EE3]/15">
                      <span className="text-white text-[13px] font-black">TV</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-[22px] font-bold text-[#1A1A2E] leading-tight">{title || "ชื่อตำแหน่ง"}</h2>
                      <p className="text-[14px] font-semibold text-[#127EE3] mt-0.5">TechVibe Solutions</p>
                      <div className="flex items-center gap-2.5 mt-3 flex-wrap">
                        <span className="flex items-center gap-1.5 text-[12px] text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                          <MapPin className="w-3 h-3 text-gray-400" />{location || "—"}
                        </span>
                        <span className="flex items-center gap-1.5 text-[12px] text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                          <Briefcase className="w-3 h-3 text-gray-400" />{jobType || "—"}
                        </span>
                        {(salaryMin || salaryMax) && (
                          <span className="flex items-center gap-1.5 text-[12px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                            <DollarSign className="w-3 h-3 text-emerald-500" />
                            {salaryMin && salaryMax
                              ? `${Number(salaryMin).toLocaleString()} – ${Number(salaryMax).toLocaleString()} บาท`
                              : salaryMin
                              ? `${Number(salaryMin).toLocaleString()}+ บาท`
                              : `ถึง ${Number(salaryMax).toLocaleString()} บาท`}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-8 py-6 space-y-6">
                  {/* Photos */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-4 bg-[#0DC2FF] rounded-full" />
                      <h3 className="text-[14px] font-bold text-[#1A1A2E]">รูปภาพประกาศงาน</h3>
                      <span className="text-[11px] text-gray-400 ml-1">แก้ไขได้</span>
                    </div>
                    <PhotoGallery photos={photos} onChange={setPhotos} />
                  </div>

                  {/* Highlights */}
                  <div className="border-t border-gray-50 pt-6">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1 h-4 bg-[#127EE3] rounded-full" />
                      <h3 className="text-[14px] font-bold text-[#1A1A2E]">3 จุดเด่นสำหรับ Job Card</h3>
                      <span className="ml-1 text-[10px] bg-[#0DC2FF]/10 text-[#127EE3] font-semibold px-2 py-0.5 rounded-full">Jobtopgun</span>
                    </div>
                    <p className="text-[12px] text-gray-400 mb-3 pl-3">แสดงบน Job Card เพื่อดึงดูดผู้สมัครก่อนคลิกเข้า</p>
                    <BulletHighlights
                      bullets={highlights}
                      onChange={setHighlights}
                      onRegenerate={() => setHighlights(generateHighlights(title))}
                    />
                  </div>

                  {/* Summary */}
                  <div className="border-t border-gray-50 pt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-4 bg-gray-300 rounded-full" />
                      <h3 className="text-[14px] font-bold text-[#1A1A2E]">เกี่ยวกับตำแหน่ง</h3>
                    </div>
                    <p className="text-[14px] text-gray-600 leading-[1.8] pl-3" dangerouslySetInnerHTML={{ __html: editedSummary }} />
                  </div>

                  {/* Responsibilities */}
                  <div className="border-t border-gray-50 pt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-4 bg-gray-300 rounded-full" />
                      <h3 className="text-[14px] font-bold text-[#1A1A2E]">หน้าที่รับผิดชอบ</h3>
                    </div>
                    <div
                      className="text-[14px] text-gray-600 leading-[1.8] rich-content pl-3"
                      dangerouslySetInnerHTML={{ __html: responsibilitiesHtml }}
                    />
                  </div>

                  {/* Qualifications */}
                  <div className="border-t border-gray-50 pt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-4 bg-gray-300 rounded-full" />
                      <h3 className="text-[14px] font-bold text-[#1A1A2E]">คุณสมบัติที่ต้องการ</h3>
                    </div>
                    <div
                      className="text-[14px] text-gray-600 leading-[1.8] rich-content pl-3"
                      dangerouslySetInnerHTML={{ __html: qualificationsHtml }}
                    />
                  </div>

                  {/* Benefits */}
                  <div className="border-t border-gray-50 pt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-4 bg-emerald-400 rounded-full" />
                      <h3 className="text-[14px] font-bold text-[#1A1A2E]">สวัสดิการและสิทธิประโยชน์</h3>
                      <span className="text-[11px] text-gray-400 ml-1">เลือก / แก้ไขได้</span>
                    </div>
                    {/* Benefit set selector */}
                    <div className="mb-5">
                      <label className="block text-sm text-gray-500 mb-1.5">ชุดสวัสดิการ</label>
                      <div className="relative">
                        <select
                          value={benefitSetId ?? ""}
                          onChange={(e) => {
                            const id = e.target.value;
                            if (id === "__add_new__") {
                              setNewSetName("");
                              setShowSaveSetModal(true);
                              return;
                            }
                            setBenefitSetId(id);
                            setSelectedBenefits(benefitPresets[id] ?? []);
                          }}
                          className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-[13px] text-[#1A1A2E] focus:outline-none focus:border-[#0DC2FF] transition-all appearance-none cursor-pointer pr-8 shadow-sm"
                        >
                          {benefitSetOptions.length === 0 && (
                            <option value="" disabled>ยังไม่มีชุดสวัสดิการที่บันทึกไว้</option>
                          )}
                          {benefitSetOptions.map((opt) => (
                            <option key={opt.id} value={opt.id}>{opt.label}</option>
                          ))}
                          <option value="__add_new__">+ เพิ่มชุดใหม่</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                    {/* Dirty notice */}
                    {benefitSetId !== null && (() => {
                      const preset = benefitPresets[benefitSetId] ?? [];
                      const isDirty = selectedBenefits.length !== preset.length || selectedBenefits.some((b) => !preset.includes(b));
                      return isDirty ? (
                        <div className="flex items-center justify-between gap-3 mb-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl">
                          <span className="text-[12px] text-amber-700">มีการปรับจากชุดสวัสดิการต้นแบบ</span>
                          <button
                            onClick={() => { setNewSetName(""); setShowSaveSetModal(true); }}
                            className="text-[11px] font-semibold text-[#127EE3] border border-[#127EE3]/40 px-2.5 py-1 rounded-lg hover:bg-[#127EE3]/5 transition-colors whitespace-nowrap flex-shrink-0"
                          >
                            บันทึกเป็นชุดใหม่
                          </button>
                        </div>
                      ) : null;
                    })()}
                    <BenefitsSelector selected={selectedBenefits} onChange={setSelectedBenefits} />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#127EE3]/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-[#127EE3]" />
                    </div>
                    <h2 className="text-[15px] font-bold text-[#1A1A2E] leading-tight">ข้อมูลติดต่อบนประกาศ</h2>
                  </div>
                  {!editingContact && (
                    <button
                      onClick={() => { setContactDraft({ ...contactInfo }); setEditingContact(true); }}
                      className="text-[12px] text-[#127EE3] hover:text-[#0e6bc7] font-medium transition-colors flex-shrink-0"
                    >
                      แก้ไขข้อมูลติดต่อ
                    </button>
                  )}
                </div>
                <p className="text-[11.5px] text-[#127EE3] bg-[#127EE3]/6 border border-[#127EE3]/15 rounded-lg px-3 py-2 mb-4 mt-3">
                  ข้อมูลนี้ดึงจากข้อมูลกลางของบริษัท และสามารถแก้เฉพาะประกาศนี้ได้
                </p>
                {!editingContact ? (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[12px] text-gray-400 w-28 flex-shrink-0">ชื่อผู้ติดต่อ</span>
                      <span className="text-[13px] font-medium text-[#1A1A2E]">{contactInfo.person}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-[12px] text-gray-400 w-28 flex-shrink-0">อีเมล</span>
                      <span className="text-[13px] font-medium text-[#1A1A2E]">{contactInfo.email}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-[12px] text-gray-400 w-28 flex-shrink-0">เบอร์โทรศัพท์</span>
                      <span className="text-[13px] font-medium text-[#1A1A2E]">{contactInfo.phone}</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[12px] font-semibold text-gray-500 mb-1">ชื่อผู้ติดต่อ</label>
                      <input type="text" value={contactDraft.person} onChange={(e) => setContactDraft((c) => ({ ...c, person: e.target.value }))}
                        className="w-full bg-[#F8F9FB] border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-[#1A1A2E] focus:outline-none focus:border-[#0DC2FF] focus:bg-white transition-all" />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold text-gray-500 mb-1">อีเมล</label>
                      <input type="email" value={contactDraft.email} onChange={(e) => setContactDraft((c) => ({ ...c, email: e.target.value }))}
                        className="w-full bg-[#F8F9FB] border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-[#1A1A2E] focus:outline-none focus:border-[#0DC2FF] focus:bg-white transition-all" />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold text-gray-500 mb-1">เบอร์โทรศัพท์</label>
                      <input type="tel" value={contactDraft.phone} onChange={(e) => setContactDraft((c) => ({ ...c, phone: e.target.value }))}
                        className="w-full bg-[#F8F9FB] border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-[#1A1A2E] focus:outline-none focus:border-[#0DC2FF] focus:bg-white transition-all" />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button onClick={() => { setContactInfo({ ...contactDraft }); setEditingContact(false); }}
                        className="px-4 py-1.5 rounded-lg text-[13px] font-semibold text-white bg-gradient-to-r from-[#01BFF9] to-[#019EFC] hover:opacity-90 transition-opacity">
                        บันทึก
                      </button>
                      <button onClick={() => setEditingContact(false)}
                        className="px-4 py-1.5 rounded-lg text-[13px] font-medium text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-700 transition-all">
                        ยกเลิก
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Publish date */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#127EE3]/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-[#127EE3]" />
                  </div>
                  <div>
                    <h2 className="text-[15px] font-bold text-[#1A1A2E] leading-tight">วันที่ประกาศงาน</h2>
                    <p className="text-[11.5px] text-gray-400 mt-0.5">กำหนดวันที่ต้องการให้ประกาศนี้เผยแพร่</p>
                  </div>
                </div>
                <div className="mt-5">
                  <label className="block text-[13px] font-semibold text-[#1A1A2E] mb-1.5">วันที่ประกาศงาน</label>
                  <input
                    type="date"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-[#1A1A2E] focus:outline-none focus:border-[#0DC2FF] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Right panel */}
            <div className="space-y-4">
              {/* เกี่ยวกับบริษัท */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-[#127EE3]/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-3.5 h-3.5 text-[#127EE3]" />
                  </div>
                  <h3 className="text-[13px] font-bold text-[#1A1A2E]">เกี่ยวกับบริษัท</h3>
                </div>
                {/* Set selector */}
                <div className="mb-3">
                  <label className="block text-[11px] font-semibold text-gray-400 mb-1">ชุดเกี่ยวกับบริษัท</label>
                  <div className="relative">
                    <select
                      value={aboutSetId}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "__add_new__") {
                          setNewAboutSetName("");
                          setNewAboutSetDesc("");
                          setShowAddAboutSetModal(true);
                          return;
                        }
                        const set = aboutSets.find((s) => s.id === val);
                        if (set) {
                          setAboutSetId(set.id);
                          setAboutDescription(set.description);
                          setAboutExpanded(false);
                        }
                      }}
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-[13px] text-[#1A1A2E] focus:outline-none focus:border-[#0DC2FF] transition-all appearance-none cursor-pointer pr-8 shadow-sm"
                    >
                      {aboutSets.map((s) => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
                      <option value="__add_new__">+ เพิ่มชุดใหม่</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
                {/* Content box */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
                    <span className="text-[11px] font-semibold text-gray-500">เนื้อหา</span>
                    <button
                      onClick={() => { setAboutDraftText(aboutDescription); setShowEditAboutModal(true); }}
                      className="text-[11px] font-medium text-[#127EE3] hover:text-[#0e6bc7] transition-colors"
                    >
                      แก้ไข
                    </button>
                  </div>
                  <div className="px-3 py-2.5">
                    <p className={`text-[12px] text-[#374151] leading-relaxed whitespace-pre-line ${!aboutExpanded ? "line-clamp-3" : ""}`}>
                      {aboutDescription}
                    </p>
                    <button
                      onClick={() => setAboutExpanded((v) => !v)}
                      className="mt-1.5 text-[11px] font-medium text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {aboutExpanded ? "ย่อกลับ" : "ดูเพิ่มเติม"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Job card preview */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">ตัวอย่าง Job Card</p>
                <div className="mt-4">
                  <div className="border border-gray-100 rounded-xl p-3 bg-[#F8F9FB]">
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0DC2FF] to-[#127EE3] flex items-center justify-center flex-shrink-0 shadow-sm">
                        <span className="text-white text-[9px] font-black">TV</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12px] font-bold text-[#1A1A2E] leading-tight truncate">{title || "ชื่อตำแหน่ง"}</p>
                        <p className="text-[10.5px] text-gray-400">TechVibe Solutions</p>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {highlights.slice(0, 3).map((h, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <div className="w-4 h-4 rounded-full bg-[#127EE3] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-[8px] font-bold">{i + 1}</span>
                          </div>
                          <p className="text-[10.5px] text-gray-500 leading-snug">{h || "—"}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPreviewModal(true)}
                    className="mt-3 flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-500 text-[12px] font-medium rounded-lg hover:border-[#0DC2FF] hover:text-[#127EE3] hover:bg-[#F0FBFF] transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Preview หน้าประกาศ
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Preview modal */}
        {showPreviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm" onClick={() => setShowPreviewModal(false)}>
            <div
              className={`bg-white rounded-3xl shadow-2xl max-h-[92vh] overflow-hidden flex flex-col transition-all duration-300 ${previewMode === "desktop" ? "w-full max-w-2xl" : "w-full max-w-3xl"}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-3.5 border-b border-gray-100 flex-shrink-0 gap-4">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#127EE3]" />
                  <span className="text-[14px] font-bold text-[#1A1A2E]">Preview หน้าประกาศ</span>
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">ตัวอย่าง</span>
                </div>

                {/* Desktop / Mobile toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg p-0.5 gap-0.5">
                  <button
                    onClick={() => setPreviewMode("desktop")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${previewMode === "desktop" ? "bg-white text-[#127EE3] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="2" width="14" height="10" rx="1.5"/><path d="M5 14h6M8 12v2"/></svg>
                    Desktop
                  </button>
                  <button
                    onClick={() => setPreviewMode("mobile")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${previewMode === "mobile" ? "bg-white text-[#127EE3] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    <svg className="w-3 h-3.5" viewBox="0 0 12 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="10" height="14" rx="2"/><circle cx="6" cy="13" r="0.75" fill="currentColor" stroke="none"/></svg>
                    Mobile
                  </button>
                </div>

                {/* Print + Share + Close */}
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-500 text-[12px] font-medium rounded-lg hover:border-gray-300 hover:text-gray-700 transition-all"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 6V2h8v4"/><rect x="1" y="6" width="14" height="7" rx="1.5"/><path d="M4 10h8M4 13h8"/></svg>
                    พิมพ์
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("https://superrecruit.example.com/jobs/preview");
                      setLinkCopied(true);
                      setTimeout(() => setLinkCopied(false), 2500);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 border text-[12px] font-medium rounded-lg transition-all ${linkCopied ? "border-emerald-300 text-emerald-600 bg-emerald-50" : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"}`}
                  >
                    {linkCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        คัดลอกลิงก์แล้ว
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6.5 9.5a3.5 3.5 0 0 0 5 0l2-2a3.5 3.5 0 0 0-5-5L7 4"/><path d="M9.5 6.5a3.5 3.5 0 0 0-5 0l-2 2a3.5 3.5 0 0 0 5 5L9 12"/></svg>
                        แชร์ลิงก์
                      </>
                    )}
                  </button>
                  <button onClick={() => setShowPreviewModal(false)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors ml-1">
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Modal body */}
              <div className={`overflow-y-auto flex-1 ${previewMode === "desktop" ? "px-8 py-6" : "bg-gray-100 py-6 px-4 flex justify-center"}`}>
                {/* Job content — shared between desktop and mobile */}
                {(() => {
                  const content = (
                    <div className="space-y-6">
                      {/* Header */}
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0DC2FF] to-[#127EE3] flex items-center justify-center flex-shrink-0 shadow-md shadow-[#127EE3]/15">
                          <span className="text-white text-[13px] font-black">TV</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h2 className="text-[20px] font-bold text-[#1A1A2E] leading-tight">{title || "ชื่อตำแหน่ง"}</h2>
                          <p className="text-[13px] font-semibold text-[#127EE3] mt-0.5">TechVibe Solutions</p>
                          <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                            <span className="flex items-center gap-1.5 text-[12px] text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                              <MapPin className="w-3 h-3 text-gray-400" />{location || "—"}
                            </span>
                            <span className="flex items-center gap-1.5 text-[12px] text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                              <Briefcase className="w-3 h-3 text-gray-400" />{jobType || "—"}
                            </span>
                            {showSalary && (salaryMin || salaryMax) && (
                              <span className="flex items-center gap-1.5 text-[12px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                                <DollarSign className="w-3 h-3 text-emerald-500" />
                                {salaryMin && salaryMax
                                  ? `${Number(salaryMin).toLocaleString()} – ${Number(salaryMax).toLocaleString()} บาท`
                                  : salaryMin
                                  ? `${Number(salaryMin).toLocaleString()}+ บาท`
                                  : `ถึง ${Number(salaryMax).toLocaleString()} บาท`}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {/* Highlights */}
                      {highlights.filter(h => h.trim()).length > 0 && (
                        <div className="bg-[#F0FBFF] border border-[#0DC2FF]/20 rounded-xl p-4 space-y-2">
                          {highlights.slice(0, 3).map((h, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                              <div className="w-5 h-5 rounded-full bg-[#127EE3] flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-[9px] font-bold">{i + 1}</span>
                              </div>
                              <p className="text-[13px] text-gray-700 leading-snug">{h}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Summary */}
                      {editedSummary && (
                        <div>
                          <h3 className="text-[14px] font-bold text-[#1A1A2E] mb-2">เกี่ยวกับตำแหน่ง</h3>
                          <p className="text-[13.5px] text-gray-600 leading-[1.8]" dangerouslySetInnerHTML={{ __html: editedSummary }} />
                        </div>
                      )}
                      {/* Responsibilities */}
                      {responsibilitiesHtml && (
                        <div>
                          <h3 className="text-[14px] font-bold text-[#1A1A2E] mb-2">หน้าที่รับผิดชอบ</h3>
                          <div className="text-[13.5px] text-gray-600 leading-[1.8] rich-content" dangerouslySetInnerHTML={{ __html: responsibilitiesHtml }} />
                        </div>
                      )}
                      {/* Qualifications */}
                      {qualificationsHtml && (
                        <div>
                          <h3 className="text-[14px] font-bold text-[#1A1A2E] mb-2">คุณสมบัติที่ต้องการ</h3>
                          <div className="text-[13.5px] text-gray-600 leading-[1.8] rich-content" dangerouslySetInnerHTML={{ __html: qualificationsHtml }} />
                        </div>
                      )}
                      {/* Benefits */}
                      {selectedBenefits.length > 0 && (
                        <div>
                          <h3 className="text-[14px] font-bold text-[#1A1A2E] mb-2.5">สวัสดิการและสิทธิประโยชน์</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedBenefits.map((b) => (
                              <span key={b} className="text-[12px] bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">
                                {b}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* Apply button */}
                      <div className="pt-2 border-t border-gray-100">
                        <button className="w-full py-3 bg-gradient-to-r from-[#127EE3] to-[#0DC2FF] text-white text-[14px] font-bold rounded-xl shadow-md shadow-[#127EE3]/20 pointer-events-none opacity-80">
                          สมัครงานนี้
                        </button>
                        <p className="text-center text-[11px] text-gray-400 mt-2">ปุ่มนี้จะใช้งานได้หลังเผยแพร่ประกาศ</p>
                      </div>
                    </div>
                  );

                  if (previewMode === "mobile") {
                    return (
                      <div className="w-[375px] flex-shrink-0 bg-white rounded-[2rem] border border-gray-300 shadow-xl overflow-hidden flex flex-col" style={{ maxHeight: "calc(88vh - 120px)" }}>
                        {/* Phone status bar */}
                        <div className="bg-gray-50 px-5 py-2.5 flex items-center justify-between flex-shrink-0 border-b border-gray-100">
                          <span className="text-[11px] font-semibold text-gray-500">9:41</span>
                          <div className="w-24 h-4 bg-gray-200 rounded-full" />
                          <div className="flex items-center gap-1">
                            <div className="w-3.5 h-2.5 border border-gray-400 rounded-sm relative"><div className="absolute inset-[1.5px] bg-gray-500 rounded-[1px]" /></div>
                          </div>
                        </div>
                        {/* URL bar */}
                        <div className="bg-white px-4 py-2 border-b border-gray-100 flex-shrink-0">
                          <div className="bg-gray-100 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
                            <svg className="w-3 h-3 text-gray-400 flex-shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="5" width="12" height="9" rx="1.5"/><path d="M5 5V4a3 3 0 0 1 6 0v1"/></svg>
                            <span className="text-[10.5px] text-gray-500 truncate">superrecruit.example.com/jobs/preview</span>
                          </div>
                        </div>
                        <div className="overflow-y-auto flex-1 px-5 py-5">
                          {content}
                        </div>
                      </div>
                    );
                  }
                  return content;
                })()}
              </div>
            </div>
          </div>
        )}

        {step === "review" && (
          <div className="mt-6 bg-white border border-gray-100 rounded-2xl shadow-sm px-6 py-4 flex items-center justify-between gap-4">
            <button
              onClick={() => { setStep("ai-preview"); scrollToTop(); }}
              className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-500 font-semibold rounded-xl hover:border-[#127EE3] hover:text-[#127EE3] hover:bg-[#EBF6FF] transition-all text-[13.5px]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              ย้อนกลับ
            </button>
            <button
              onClick={() => { setStep("done"); scrollToTop(); }}
              className="flex items-center gap-2.5 px-8 py-3 bg-gradient-to-r from-[#127EE3] to-[#0DC2FF] hover:from-[#0e6bc7] hover:to-[#0ab8f5] text-white font-bold rounded-xl transition-all shadow-md shadow-[#127EE3]/25 text-[14px] whitespace-nowrap"
            >
              <Send className="w-4 h-4" />
              เผยแพร่ประกาศงาน
            </button>
          </div>
        )}

        {step === "form" && (
          <div className="mt-6 bg-white border border-gray-100 rounded-2xl shadow-sm px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[12.5px] text-gray-400">
              <div className={`w-2 h-2 rounded-full ${canProceed ? "bg-emerald-400" : "bg-gray-200"}`} />
              {canProceed ? "พร้อมไปขั้นตอนถัดไป" : "กรอกชื่อตำแหน่ง, สถานที่, และประเภทการจ้างงาน"}
            </div>
            <button
              onClick={() => { setStep("ai-preview"); scrollToTop(); }}
              disabled={!canProceed}
              className="flex items-center gap-2.5 px-8 py-3 bg-gradient-to-r from-[#127EE3] to-[#0DC2FF] hover:from-[#0e6bc7] hover:to-[#0ab8f5] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-md shadow-[#127EE3]/25 text-[14.5px] whitespace-nowrap"
            >
              ถัดไป
            </button>
          </div>
        )}
      </div>
    </div>

    {showSaveSetModal && (
      <SaveBenefitSetModal
        value={newSetName}
        onChange={setNewSetName}
        onCancel={() => setShowSaveSetModal(false)}
        onSave={() => {
          const name = newSetName.trim();
          if (!name) return;
          const newId = `user-${Date.now()}`;
          setBenefitPresets((prev) => ({ ...prev, [newId]: [...selectedBenefits] }));
          setBenefitSetOptions((prev) => [...prev, { id: newId, label: name }]);
          setBenefitSetId(newId);
          setShowSaveSetModal(false);
          setNewSetName("");
        }}
      />
    )}
    {showEditAboutModal && (
      <EditAboutModal
        value={aboutDraftText}
        onChange={setAboutDraftText}
        onCancel={() => setShowEditAboutModal(false)}
        onSave={() => {
          setAboutDescription(aboutDraftText);
          setAboutSets((prev) => prev.map((s) => s.id === aboutSetId ? { ...s, description: aboutDraftText } : s));
          setShowEditAboutModal(false);
        }}
      />
    )}
    {showAddAboutSetModal && (
      <AddAboutSetModal
        name={newAboutSetName}
        desc={newAboutSetDesc}
        onChangeName={setNewAboutSetName}
        onChangeDesc={setNewAboutSetDesc}
        onCancel={() => setShowAddAboutSetModal(false)}
        onSave={() => {
          const label = newAboutSetName.trim();
          if (!label) return;
          const newId = `about-${Date.now()}`;
          const newSet = { id: newId, label, description: newAboutSetDesc };
          setAboutSets((prev) => [...prev, newSet]);
          setAboutSetId(newId);
          setAboutDescription(newAboutSetDesc);
          setAboutExpanded(false);
          setShowAddAboutSetModal(false);
          setNewAboutSetName("");
          setNewAboutSetDesc("");
        }}
      />
    )}
    </>
  );
}
