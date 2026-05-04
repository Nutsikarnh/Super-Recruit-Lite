import { useState, useRef, useCallback, useEffect } from "react";
import { emailAddressBookContacts } from "../data/emailAddressBook";
import { emailTemplates as sharedEmailTemplates } from "../data/emailTemplates";
import {
  Building2, Globe, Phone, Mail, MapPin, Upload, Camera, Users, Shield,
  Bell, ChevronRight, Check, Plus, Trash2, Eye, EyeOff,
  AlertCircle, Save, Link as LinkIcon,
  X, QrCode, Monitor, Smartphone, Laptop, LogOut,
  ChevronDown, Image, Star, Pencil, Search,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = "company" | "team" | "notifications" | "emailTemplates" | "emailBook" | "security";

// ─── Constants ────────────────────────────────────────────────────────────────
const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "security",       label: "บัญชีและความปลอดภัย",    icon: <Shield size={15} /> },
  { key: "company",        label: "ข้อมูลองค์กร",           icon: <Building2 size={15} /> },
  { key: "team",           label: "ทีมและสิทธิ์",            icon: <Users size={15} /> },
  { key: "notifications",  label: "การแจ้งเตือน",            icon: <Bell size={15} /> },
  { key: "emailTemplates", label: "เทมเพลตอีเมล",            icon: <Mail size={15} /> },
  { key: "emailBook",      label: "สมุดรายชื่ออีเมล",        icon: <Search size={15} /> },
];

const INDUSTRIES = ["เทคโนโลยี","การเงิน","การแพทย์","การศึกษา","อาหารและเครื่องดื่ม","ค้าปลีก","โลจิสติกส์","อสังหาริมทรัพย์","บันเทิง","อื่นๆ"];
const SIZES      = ["1–10 คน","11–50 คน","51–200 คน","201–500 คน","501–1,000 คน","1,000+ คน"];


// ─── Shared UI ────────────────────────────────────────────────────────────────
function SectionCard({ title, subtitle, children }: { title:string; subtitle?:string; children:React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden">
      <div className="px-6 pt-6 pb-6">
        <p className="text-base font-medium text-[#1A1A2E]">{title}</p>
        {subtitle && <p className="text-[12px] text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className="px-6 pb-6">{children}</div>
    </div>
  );
}

function Field({ label, hint, children, full }: { label:string; hint?:string; children:React.ReactNode; full?:boolean }) {
  return (
    <div className={`space-y-1.5 ${full ? "col-span-2" : ""}`}>
      <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wide">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-gray-400">{hint}</p>}
    </div>
  );
}

const inputCls = "w-full bg-[#F8F9FA] border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13.5px] text-[#1A1A2E] placeholder-gray-400 focus:outline-none focus:border-[#127EE3] focus:bg-white transition-all";

function Inp({ value, onChange, placeholder, prefix, type="text" }: { value:string; onChange:(v:string)=>void; placeholder?:string; prefix?:React.ReactNode; type?:string }) {
  return (
    <div className={`flex items-center gap-2.5 bg-[#F8F9FA] border border-gray-200 rounded-xl px-3.5 py-2.5 focus-within:border-[#127EE3] focus-within:bg-white transition-all ${type==="textarea" ? "items-start" : ""}`}>
      {prefix && <span className="text-gray-400 flex-shrink-0 mt-px">{prefix}</span>}
      <input value={value} type={type} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        className="flex-1 bg-transparent text-[13.5px] text-[#1A1A2E] placeholder-gray-400 outline-none min-w-0" />
    </div>
  );
}

function Sel({ value, onChange, options }: { value:string; onChange:(v:string)=>void; options:string[] }) {
  return (
    <div className="relative">
      <select value={value} onChange={e=>onChange(e.target.value)}
        className={`${inputCls} appearance-none pr-8 cursor-pointer`}>
        {options.map(o=><option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );
}

function Toggle({ checked, onChange, label, description }: { checked:boolean; onChange:(v:boolean)=>void; label:string; description?:string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 border-b border-gray-50 last:border-0">
      <div className="flex-1">
        <p className="text-[13.5px] font-medium text-[#1A1A2E]">{label}</p>
        {description && <p className="text-[12px] text-gray-400 mt-0.5">{description}</p>}
      </div>
      <button onClick={()=>onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${checked?"bg-[#127EE3]":"bg-gray-200"}`}>
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${checked?"left-[22px]":"left-0.5"}`} />
      </button>
    </div>
  );
}

function SaveBanner({ dirty, onSave }: { dirty:boolean; onSave:()=>void }) {
  if (!dirty) return null;
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-2.5 bg-[#FFF8F0] border border-amber-100 rounded-2xl">
      <div className="flex items-center gap-2">
        <AlertCircle size={14} className="text-amber-500" />
        <span className="text-[13px] font-medium text-amber-700">มีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก</span>
      </div>
      <button onClick={onSave} className="flex items-center gap-1.5 px-4 py-1.5 bg-[#127EE3] text-white text-[12.5px] font-bold rounded-xl hover:bg-[#0e6bc7] transition-colors">
        <Save size={13} /> บันทึก
      </button>
    </div>
  );
}

// ─── Banner Gallery ───────────────────────────────────────────────────────────
interface BannerSlot { id: string; url: string | null; }

function BannerGallery({ slots, onChange }: { slots: BannerSlot[]; onChange: (s: BannerSlot[]) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeId) return;
    const url = URL.createObjectURL(file);
    onChange(slots.map((s) => (s.id === activeId ? { ...s, url } : s)));
    setActiveId(null);
    e.target.value = "";
  };

  const open = (id: string) => { setActiveId(id); fileRef.current?.click(); };
  const remove = (id: string) => onChange(slots.map((s) => (s.id === id ? { ...s, url: null } : s)));

  return (
    <div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <div className="grid grid-cols-3 gap-3">
        {slots.map((slot, i) => (
          <div key={slot.id} className="relative group">
            {slot.url ? (
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-gray-200">
                <img src={slot.url} alt="" className="w-full h-full object-cover" />
                {i === 0 && (
                  <div className="absolute top-1.5 left-1.5 bg-[#127EE3] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                    <Star size={9} className="fill-white" />
                    แบนเนอร์หลัก
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                  <button onClick={() => open(slot.id)} className="w-7 h-7 bg-white/90 rounded-lg flex items-center justify-center hover:bg-white transition-colors">
                    <Image size={14} className="text-[#1A1A2E]" />
                  </button>
                  <button onClick={() => remove(slot.id)} className="w-7 h-7 bg-white/90 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors">
                    <Trash2 size={14} className="text-red-500" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => open(slot.id)}
                className="w-full aspect-[16/9] rounded-xl border-2 border-dashed border-gray-200 hover:border-[#0DC2FF] hover:bg-[#0DC2FF]/5 transition-all flex flex-col items-center justify-center gap-1 text-gray-300 hover:text-[#0DC2FF]"
              >
                <Plus size={16} />
                {i === 0 && <span className="text-[9px] font-semibold">แบนเนอร์หลัก</span>}
              </button>
            )}
          </div>
        ))}
      </div>
      <p className="text-[11px] text-gray-400 mt-2">
        รูปแรกจะเป็นแบนเนอร์หลัก · รองรับสูงสุด 3 รูป · แนะนำอัตราส่วน 16:9
      </p>
    </div>
  );
}

// ─── EditableSection ─────────────────────────────────────────────────────────
function EditableSection({
  title,
  subtitle,
  preview,
  form,
  onSave,
  onCancel,
}: {
  title: string;
  subtitle?: string;
  preview: React.ReactNode;
  form: React.ReactNode;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [editing, setEditing] = useState(false);

  const handleSave = () => { onSave(); setEditing(false); };
  const handleCancel = () => { onCancel(); setEditing(false); };

  return (
    <div className="bg-white rounded-2xl overflow-hidden">
      <div className="px-6 pt-6 pb-6 flex items-center justify-between">
        <div>
          <p className="text-base font-medium text-[#1A1A2E]">{title}</p>
          {subtitle && <p className="text-[12px] text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-[13px] font-semibold text-[#127EE3] hover:text-[#0f6bc7] transition-colors"
          >
            แก้ไข
          </button>
        )}
      </div>
      <div className="px-6 pb-6">
        {editing ? (
          <div>
            {form}
            <div className="flex items-center justify-end gap-2 mt-5 pt-4 border-t border-gray-50">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-[13px] font-semibold text-gray-500 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 text-[13px] font-semibold text-white bg-[#127EE3] rounded-xl hover:bg-[#0f6bc7] transition-colors"
              >
                บันทึก
              </button>
            </div>
          </div>
        ) : (
          preview
        )}
      </div>
    </div>
  );
}

function MapPreview({ url }: { url: string }) {
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group mt-2 flex items-center gap-4 h-[160px] rounded-lg border border-gray-200 bg-gray-50 overflow-hidden hover:border-[#127EE3] hover:bg-[#F0F8FF] transition-all"
    >
      {/* Placeholder map visual */}
      <div className="relative flex-shrink-0 w-[160px] h-full bg-[#E8EEF4] flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 160 160" className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="40" x2="160" y2="40" stroke="#94a3b8" strokeWidth="1"/>
          <line x1="0" y1="80" x2="160" y2="80" stroke="#94a3b8" strokeWidth="1"/>
          <line x1="0" y1="120" x2="160" y2="120" stroke="#94a3b8" strokeWidth="1"/>
          <line x1="40" y1="0" x2="40" y2="160" stroke="#94a3b8" strokeWidth="1"/>
          <line x1="80" y1="0" x2="80" y2="160" stroke="#94a3b8" strokeWidth="1"/>
          <line x1="120" y1="0" x2="120" y2="160" stroke="#94a3b8" strokeWidth="1"/>
          <rect x="30" y="55" width="45" height="12" rx="2" fill="#cbd5e1"/>
          <rect x="85" y="90" width="35" height="12" rx="2" fill="#cbd5e1"/>
          <rect x="20" y="95" width="25" height="30" rx="2" fill="#cbd5e1"/>
          <rect x="100" y="45" width="40" height="20" rx="2" fill="#cbd5e1"/>
        </svg>
        <div className="relative z-10 w-8 h-8 rounded-full bg-[#127EE3] flex items-center justify-center shadow-md">
          <MapPin size={16} className="text-white fill-white" />
        </div>
      </div>
      <div className="flex-1 px-4 py-3 min-w-0">
        <p className="text-[13.5px] font-semibold text-[#1A1A2E] mb-1">แผนที่บริษัท</p>
        <p className="text-[12px] text-gray-400 group-hover:text-[#127EE3] transition-colors flex items-center gap-1">
          <LinkIcon size={11} />
          ดูตำแหน่งบน Google Maps
        </p>
      </div>
    </a>
  );
}

function ReadRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">{label}</span>
      <span className="text-[13.5px] text-[#1A1A2E]">{value || <span className="text-gray-300">—</span>}</span>
    </div>
  );
}

// ─── Tab 1: Company ───────────────────────────────────────────────────────────
function CompanyTab() {
  // Committed (displayed) values
  const [nameTh,  setNameTh]  = useState("TechVibe Solutions");
  const [nameEn,  setNameEn]  = useState("TechVibe Solutions");
  const [ind,     setInd]     = useState("เทคโนโลยี");
  const [size,    setSize]    = useState("51–200 คน");
  const [year,    setYear]    = useState("2558");
  const [taxId,   setTaxId]   = useState("0105558123456");
  const [tagline, setTagline] = useState("Empowering Thai talent with world-class opportunities");
  const [website, setWebsite] = useState("https://techvibe.co.th");
  const [tel,     setTel]     = useState("02-123-4567");
  const [emailHr, setEmailHr] = useState("hr@techvibe.co.th");
  const [emailGn, setEmailGn] = useState("contact@techvibe.co.th");
  const [addr,    setAddr]    = useState("เลขที่ 88 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110");
  const [maps,    setMaps]    = useState("https://maps.google.com/?q=TechVibe+Solutions+Bangkok");

  // Draft values (used while editing)
  const [dNameTh,  setDNameTh]  = useState(nameTh);
  const [dNameEn,  setDNameEn]  = useState(nameEn);
  const [dInd,     setDInd]     = useState(ind);
  const [dSize,    setDSize]    = useState(size);
  const [dYear,    setDYear]    = useState(year);
  const [dTaxId,   setDTaxId]   = useState(taxId);
  const [dTagline, setDTagline] = useState(tagline);
  const [dWebsite, setDWebsite] = useState(website);
  const [dTel,     setDTel]     = useState(tel);
  const [dEmailHr, setDEmailHr] = useState(emailHr);
  const [dEmailGn, setDEmailGn] = useState(emailGn);
  const [dAddr,    setDAddr]    = useState(addr);
  const [dMaps,    setDMaps]    = useState(maps);

  const INITIAL_ORG_ABOUT_SETS = [
    { id: "default", label: "TechVibe Solutions - Default", description: "TechVibe Solutions เป็นบริษัทเทคโนโลยีที่พัฒนาโซลูชันดิจิทัลให้กับองค์กรในหลายอุตสาหกรรม ตั้งแต่ระบบบริหารงานภายในองค์กร แพลตฟอร์มข้อมูล ไปจนถึงเครื่องมือที่ช่วยให้ทีมขาย การตลาด และฝ่ายปฏิบัติการทำงานได้มีประสิทธิภาพมากขึ้น\n\nเราทำงานร่วมกับลูกค้าทั้งองค์กรขนาดกลางและขนาดใหญ่ โดยให้ความสำคัญกับการเข้าใจปัญหาทางธุรกิจจริงก่อนออกแบบโซลูชัน ทีมของเราประกอบด้วย Product Manager, Designer, Engineer, Data Analyst และ Business Consultant ที่ทำงานร่วมกันอย่างใกล้ชิด\n\nTechVibe Solutions เชื่อว่าการเติบโตของคนและองค์กรต้องไปพร้อมกัน เราจึงให้ความสำคัญกับการเรียนรู้ การทำงานเป็นทีม และการเปิดโอกาสให้พนักงานได้ทดลองแนวคิดใหม่ ๆ เพื่อสร้างผลงานที่มีคุณค่าต่อลูกค้าและตลาด" },
    { id: "sales", label: "TechVibe Solutions - Sales Hiring", description: "ร่วมงานกับทีม Sales ของ TechVibe Solutions ที่เน้นการเติบโต การเรียนรู้ และโอกาสในการสร้างรายได้จากผลงานจริง ทีม Sales ของเราทำงานใกล้ชิดกับลูกค้าองค์กร เข้าใจโจทย์ธุรกิจ และนำเสนอโซลูชันที่ช่วยให้ลูกค้าทำงานได้ดีขึ้น" },
  ];
  const [orgAboutSets, setOrgAboutSets] = useState(INITIAL_ORG_ABOUT_SETS);
  const [orgAboutSetId, setOrgAboutSetId] = useState("default");
  const [orgAboutDesc, setOrgAboutDesc] = useState(INITIAL_ORG_ABOUT_SETS[0].description);
  const [orgAboutExpanded, setOrgAboutExpanded] = useState(false);
  const [showEditOrgAboutModal, setShowEditOrgAboutModal] = useState(false);
  const [orgAboutDraftText, setOrgAboutDraftText] = useState("");
  const [showAddOrgAboutSetModal, setShowAddOrgAboutSetModal] = useState(false);
  const [newOrgAboutSetName, setNewOrgAboutSetName] = useState("");
  const [newOrgAboutSetDesc, setNewOrgAboutSetDesc] = useState("");

  const logoFileRef = useRef<HTMLInputElement>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [banners, setBanners] = useState<BannerSlot[]>([
    { id: "b1", url: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { id: "b2", url: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { id: "b3", url: null },
  ]);

  // Reset drafts from current committed values when entering edit mode
  const resetBasic   = () => { setDNameTh(nameTh); setDNameEn(nameEn); setDInd(ind); setDSize(size); setDYear(year); setDTaxId(taxId); setDTagline(tagline); };
  const resetContact = () => { setDWebsite(website); setDTel(tel); setDEmailHr(emailHr); setDEmailGn(emailGn); setDAddr(addr); setDMaps(maps); };

  return (
    <>
    <div className="space-y-5">
      {/* Logo & banner — always editable */}
      <SectionCard title="โลโก้และภาพแบนเนอร์" subtitle="ภาพที่แสดงในประกาศงานและโปรไฟล์องค์กร">
        <div className="mb-5">
          <p className="text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-2">ภาพแบนเนอร์</p>
          <BannerGallery slots={banners} onChange={setBanners} />
        </div>
        <div className="flex items-start gap-5">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#0F1724] flex items-center justify-center shadow-lg">
              {logoUrl
                ? <img src={logoUrl} alt="logo" className="w-full h-full object-cover" />
                : <span className="text-white text-[18px] font-bold tracking-tight">HiB</span>
              }
            </div>
            <button onClick={()=>logoFileRef.current?.click()} className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors">
              <Camera size={13} className="text-gray-500" />
            </button>
            <input
              ref={logoFileRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) setCropSrc(URL.createObjectURL(file));
                e.target.value = "";
              }}
            />
          </div>
          <div>
            <p className="text-[13.5px] font-semibold text-[#1A1A2E]">โลโก้บริษัท</p>
            <p className="text-[12px] text-gray-400 mt-0.5 mb-3">PNG, JPG หรือ SVG ขนาดไม่เกิน 2MB · แนะนำ 400×400px</p>
            <div className="flex items-center gap-2">
              <button onClick={()=>logoFileRef.current?.click()} className="flex items-center gap-1.5 px-3.5 py-2 bg-[#F0F8FF] border border-[#0DC2FF]/30 text-[#127EE3] text-[12.5px] font-semibold rounded-xl hover:bg-[#E0F0FF] transition-colors">
                <Upload size={13} /> อัปโหลดโลโก้ใหม่
              </button>
              {logoUrl && (
                <button onClick={()=>setLogoUrl(null)} className="px-3.5 py-2 text-[12.5px] font-semibold text-red-400 hover:text-red-500 transition-colors">
                  ลบโลโก้
                </button>
              )}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Basic info */}
      <EditableSection
        title="ข้อมูลพื้นฐาน"
        onSave={() => { setNameTh(dNameTh); setNameEn(dNameEn); setInd(dInd); setSize(dSize); setYear(dYear); setTaxId(dTaxId); setTagline(dTagline); }}
        onCancel={resetBasic}
        preview={
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <ReadRow label="ชื่อบริษัท (ภาษาไทย)" value={nameTh} />
            <ReadRow label="ชื่อบริษัท (ภาษาอังกฤษ)" value={nameEn} />
            <ReadRow label="ประเภทธุรกิจ" value={ind} />
            <ReadRow label="ขนาดองค์กร" value={size} />
            <ReadRow label="ปีก่อตั้ง (พ.ศ.)" value={year} />
            <ReadRow label="เลขทะเบียนนิติบุคคล" value={taxId} />
            <div className="col-span-2"><ReadRow label="สโลแกน / คำอธิบายสั้น" value={tagline} /></div>
          </div>
        }
        form={
          <div className="grid grid-cols-2 gap-4">
            <Field label="ชื่อบริษัท (ภาษาไทย)"><Inp value={dNameTh} onChange={setDNameTh} placeholder="ชื่อบริษัท" /></Field>
            <Field label="ชื่อบริษัท (ภาษาอังกฤษ)"><Inp value={dNameEn} onChange={setDNameEn} placeholder="Company name" /></Field>
            <Field label="ประเภทธุรกิจ"><Sel value={dInd} onChange={setDInd} options={INDUSTRIES} /></Field>
            <Field label="ขนาดองค์กร"><Sel value={dSize} onChange={setDSize} options={SIZES} /></Field>
            <Field label="ปีก่อตั้ง (พ.ศ.)"><Inp value={dYear} onChange={setDYear} placeholder="เช่น 2558" /></Field>
            <Field label="เลขทะเบียนนิติบุคคล"><Inp value={dTaxId} onChange={setDTaxId} placeholder="0105558xxxxxx" /></Field>
            <Field label="สโลแกน / คำอธิบายสั้น" hint={`${dTagline.length}/120 ตัวอักษร`} full>
              <Inp value={dTagline} onChange={setDTagline} placeholder="ข้อความสั้นๆ แนะนำองค์กร" />
            </Field>
          </div>
        }
      />

      {/* About */}
      <SectionCard title="เกี่ยวกับองค์กร" subtitle="แสดงในหน้าโปรไฟล์บริษัทของผู้หางาน">
        {/* Set selector */}
        <div className="mb-4">
          <label className="block text-[12px] font-semibold text-gray-500 mb-1.5">ชุดเกี่ยวกับองค์กร</label>
          <div className="relative">
            <select
              value={orgAboutSetId}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "__add_new__") {
                  setNewOrgAboutSetName("");
                  setNewOrgAboutSetDesc("");
                  setShowAddOrgAboutSetModal(true);
                  return;
                }
                const set = orgAboutSets.find((s) => s.id === val);
                if (set) {
                  setOrgAboutSetId(set.id);
                  setOrgAboutDesc(set.description);
                  setOrgAboutExpanded(false);
                }
              }}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-[13px] text-[#1A1A2E] focus:outline-none focus:border-[#0DC2FF] transition-all appearance-none cursor-pointer pr-8 shadow-sm"
            >
              {orgAboutSets.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
              <option value="__add_new__">+ เพิ่มชุดใหม่</option>
            </select>
            <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6l4 4 4-4"/></svg>
          </div>
        </div>
        {/* Content box */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
            <span className="text-[12px] font-semibold text-gray-500">เนื้อหา</span>
            <button
              onClick={() => { setOrgAboutDraftText(orgAboutDesc); setShowEditOrgAboutModal(true); }}
              className="text-[12px] font-medium text-[#127EE3] hover:text-[#0e6bc7] transition-colors"
            >
              แก้ไข
            </button>
          </div>
          <div className="px-3 py-3">
            <p className={`text-[13px] text-[#374151] leading-relaxed whitespace-pre-line ${!orgAboutExpanded ? "line-clamp-3" : ""}`}>
              {orgAboutDesc}
            </p>
            <button
              onClick={() => setOrgAboutExpanded((v) => !v)}
              className="mt-2 text-[12px] font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              {orgAboutExpanded ? "ย่อกลับ" : "ดูเพิ่มเติม"}
            </button>
          </div>
        </div>
        {/* Modals */}
        {showEditOrgAboutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
              <div className="px-6 pt-6 pb-2">
                <h2 className="text-[16px] font-bold text-[#1A1A2E] mb-4">แก้ไขเกี่ยวกับองค์กร</h2>
                <label className="block text-[12px] font-semibold text-gray-500 mb-1.5">เกี่ยวกับองค์กร</label>
                <textarea
                  autoFocus
                  rows={7}
                  value={orgAboutDraftText}
                  onChange={(e) => setOrgAboutDraftText(e.target.value)}
                  className="w-full bg-[#F8F9FB] border border-gray-200 rounded-xl px-3 py-2.5 text-[13px] text-[#1A1A2E] focus:outline-none focus:border-[#0DC2FF] focus:bg-white transition-all resize-none"
                />
              </div>
              <div className="flex gap-2 px-6 py-5">
                <button
                  onClick={() => setShowEditOrgAboutModal(false)}
                  className="flex-1 border border-gray-200 text-gray-500 text-[13px] font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={() => {
                    setOrgAboutDesc(orgAboutDraftText);
                    setOrgAboutSets((prev) => prev.map((s) => s.id === orgAboutSetId ? { ...s, description: orgAboutDraftText } : s));
                    setShowEditOrgAboutModal(false);
                  }}
                  className="flex-1 bg-gradient-to-r from-[#01BFF9] to-[#019EFC] text-white text-[13px] font-semibold py-2.5 rounded-xl hover:opacity-90 transition-opacity"
                >
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        )}
        {showAddOrgAboutSetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
              <div className="px-6 pt-6 pb-2 space-y-4">
                <h2 className="text-[16px] font-bold text-[#1A1A2E]">สร้างชุดเกี่ยวกับองค์กร</h2>
                <div>
                  <label className="block text-[12px] font-semibold text-gray-500 mb-1.5">ชื่อ Template</label>
                  <input
                    autoFocus
                    type="text"
                    value={newOrgAboutSetName}
                    onChange={(e) => setNewOrgAboutSetName(e.target.value)}
                    placeholder="เช่น TechVibe Solutions - Tech Hiring"
                    className="w-full bg-[#F8F9FB] border border-gray-200 rounded-xl px-3 py-2.5 text-[13px] text-[#1A1A2E] placeholder:text-gray-400 focus:outline-none focus:border-[#0DC2FF] focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-gray-500 mb-1.5">เกี่ยวกับองค์กร</label>
                  <textarea
                    rows={5}
                    value={newOrgAboutSetDesc}
                    onChange={(e) => setNewOrgAboutSetDesc(e.target.value)}
                    className="w-full bg-[#F8F9FB] border border-gray-200 rounded-xl px-3 py-2.5 text-[13px] text-[#1A1A2E] placeholder:text-gray-400 focus:outline-none focus:border-[#0DC2FF] focus:bg-white transition-all resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-2 px-6 py-5">
                <button
                  onClick={() => setShowAddOrgAboutSetModal(false)}
                  className="flex-1 border border-gray-200 text-gray-500 text-[13px] font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={() => {
                    const label = newOrgAboutSetName.trim();
                    if (!label) return;
                    const newId = `org-about-${Date.now()}`;
                    setOrgAboutSets((prev) => [...prev, { id: newId, label, description: newOrgAboutSetDesc }]);
                    setOrgAboutSetId(newId);
                    setOrgAboutDesc(newOrgAboutSetDesc);
                    setOrgAboutExpanded(false);
                    setShowAddOrgAboutSetModal(false);
                    setNewOrgAboutSetName("");
                    setNewOrgAboutSetDesc("");
                  }}
                  disabled={!newOrgAboutSetName.trim()}
                  className="flex-1 bg-gradient-to-r from-[#01BFF9] to-[#019EFC] text-white text-[13px] font-semibold py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        )}
      </SectionCard>

      {/* Contact */}
      <EditableSection
        title="ข้อมูลติดต่อ"
        onSave={() => { setWebsite(dWebsite); setTel(dTel); setEmailHr(dEmailHr); setEmailGn(dEmailGn); setAddr(dAddr); setMaps(dMaps); }}
        onCancel={resetContact}
        preview={
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <ReadRow label="เว็บไซต์" value={website} />
            <ReadRow label="โทรศัพท์" value={tel} />
            <ReadRow label="อีเมล HR" value={emailHr} />
            <ReadRow label="อีเมลทั่วไป" value={emailGn} />
            <div className="col-span-2"><ReadRow label="ที่อยู่" value={addr} /></div>
            <div className="col-span-2">
              <ReadRow label="Google Maps Link" value={maps} />
              <MapPreview url={maps} />
            </div>
          </div>
        }
        form={
          <div className="grid grid-cols-2 gap-4">
            <Field label="เว็บไซต์"><Inp value={dWebsite} onChange={setDWebsite} prefix={<Globe size={14}/>} placeholder="https://..." /></Field>
            <Field label="โทรศัพท์"><Inp value={dTel} onChange={setDTel} prefix={<Phone size={14}/>} placeholder="02-xxx-xxxx" /></Field>
            <Field label="อีเมล HR"><Inp value={dEmailHr} onChange={setDEmailHr} prefix={<Mail size={14}/>} placeholder="hr@company.com" /></Field>
            <Field label="อีเมลทั่วไป"><Inp value={dEmailGn} onChange={setDEmailGn} prefix={<Mail size={14}/>} placeholder="contact@company.com" /></Field>
            <Field label="ที่อยู่" full><Inp value={dAddr} onChange={setDAddr} prefix={<MapPin size={14}/>} placeholder="ที่อยู่บริษัท" /></Field>
            <Field label="Google Maps Link" hint="ลิงก์ embed หรือ share จาก Google Maps" full>
              <Inp value={dMaps} onChange={setDMaps} prefix={<LinkIcon size={14}/>} placeholder="https://maps.google.com/..." />
              <MapPreview url={dMaps} />
            </Field>
          </div>
        }
      />

    </div>
    {cropSrc && (
      <LogoCropModal
        src={cropSrc}
        onConfirm={dataUrl => { setLogoUrl(dataUrl); setCropSrc(null); }}
        onCancel={() => setCropSrc(null)}
      />
    )}
    </>
  );
}

// ─── Tab 2: Team ──────────────────────────────────────────────────────────────

type ModuleKey = "resume" | "superSearch" | "jobPost" | "settings" | "youSay";

interface MemberPerms {
  resume: boolean;
  resumeScope: "all" | "some";
  resumePositions: string;
  superSearch: boolean;
  jobPost: boolean;
  settings: boolean;
  youSay: boolean;
}

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  jobFunction: string;
  phone: string;
  companyPhone: string;
  extension: string;
  role: "admin" | "user";
  av: string;
  color: string;
  last: string;
  perms: MemberPerms;
  // derived
  name: string;
}

const DEFAULT_PERMS: MemberPerms = {
  resume: false, resumeScope: "all", resumePositions: "",
  superSearch: false, jobPost: false, settings: false, youSay: false,
};

const FULL_PERMS: MemberPerms = {
  resume: true, resumeScope: "all", resumePositions: "",
  superSearch: true, jobPost: true, settings: true, youSay: true,
};

function permsToRights(role: "admin" | "user", perms: MemberPerms): string {
  if (role === "admin") return "ทั้งหมด";
  const parts: string[] = [];
  if (perms.jobPost) parts.push("ประกาศงาน");
  if (perms.resume)  parts.push("ดูเรซูเม่");
  if (perms.superSearch) parts.push("Super Search");
  if (perms.youSay)  parts.push("YOU SAY");
  if (perms.settings) parts.push("Settings");
  return parts.length > 0 ? parts.join(" + ") : "ดูอย่างเดียว";
}

function initials(name: string): string {
  return name.charAt(0);
}

const AVATAR_COLORS = ["#127EE3","#10B981","#F59E0B","#EF4444","#8B5CF6","#EC4899"];

function makeMember(fields: Omit<Member, "name">): Member {
  return { ...fields, name: `${fields.firstName} ${fields.lastName}` };
}

const INIT_MEMBERS: Member[] = [
  makeMember({ id:"1", firstName:"นิพล",    lastName:"ชัยวิรัตน์",  email:"nipon@techvibe.co.th",   position:"Admin",              jobFunction:"IT & Software",  phone:"081-111-2233", companyPhone:"02-111-2233", extension:"101", role:"admin", av:"น", color:"#127EE3", last:"25 นาทีที่แล้ว",  perms: FULL_PERMS }),
  makeMember({ id:"2", firstName:"สุวรรณา", lastName:"ตรีสุข",      email:"suwanna@techvibe.co.th", position:"HR Manager",         jobFunction:"HR & Recruiting",phone:"082-222-3344", companyPhone:"",            extension:"",    role:"user",  av:"ส", color:"#10B981", last:"2 ชั่วโมงที่แล้ว", perms: { ...DEFAULT_PERMS, jobPost: true, resume: true } }),
  makeMember({ id:"3", firstName:"กิตติพงษ์",lastName:"วงศ์ทอง",   email:"kitti@techvibe.co.th",   position:"Recruiter",          jobFunction:"HR & Recruiting",phone:"083-333-4455", companyPhone:"",            extension:"",    role:"user",  av:"ก", color:"#F59E0B", last:"10 มี.ค. 2025",    perms: { ...DEFAULT_PERMS, resume: true, superSearch: true } }),
  makeMember({ id:"4", firstName:"อมรรัตน์",lastName:"ศรีสุวรรณ",  email:"amorn@techvibe.co.th",   position:"Talent Acquisition", jobFunction:"HR & Recruiting",phone:"084-444-5566", companyPhone:"",            extension:"",    role:"user",  av:"อ", color:"#EF4444", last:"24 มี.ค. 2025",    perms: DEFAULT_PERMS }),
];

const ROLE_META_V2: Record<string, { label: string; color: string; bg: string }> = {
  admin: { label: "Admin", color: "#127EE3", bg: "#EFF6FF" },
  user:  { label: "User",  color: "#059669", bg: "#ECFDF5" },
};

const MODULE_LIST: { key: ModuleKey; label: string }[] = [
  { key: "resume",      label: "View and Manage Resume" },
  { key: "superSearch", label: "Super Search" },
  { key: "jobPost",     label: "Job Post Management" },
  { key: "settings",    label: "Settings" },
  { key: "youSay",      label: "YOU SAY / HR SAY" },
];

const POSITION_OPTIONS = ["HR Officer","HR Manager","Recruiter","Talent Acquisition","Admin","Other"];
const JOB_FUNCTION_OPTIONS = ["HR & Recruiting","IT & Software","Finance","Marketing","Operations","Sales","Other"];

// ─── Permission Modal ─────────────────────────────────────────────────────────
interface PermModalProps {
  mode: "invite" | "edit";
  initial?: Partial<Member>;
  onSave: (data: Omit<Member, "id" | "av" | "color" | "last" | "name">) => void;
  onCancel: () => void;
}

function PermissionModal({ mode, initial, onSave, onCancel }: PermModalProps) {
  const [firstName,    setFirstName]    = useState(initial?.firstName    ?? "");
  const [lastName,     setLastName]     = useState(initial?.lastName     ?? "");
  const [email,        setEmail]        = useState(initial?.email        ?? "");
  const [position,     setPosition]     = useState(initial?.position     ?? "");
  const [jobFunction,  setJobFunction]  = useState(initial?.jobFunction  ?? "");
  const [phone,        setPhone]        = useState(initial?.phone        ?? "");
  const [companyPhone, setCompanyPhone] = useState(initial?.companyPhone ?? "");
  const [extension,    setExtension]    = useState(initial?.extension    ?? "");
  const [role,         setRole]         = useState<"admin"|"user">(initial?.role ?? "user");
  const [perms,        setPerms]        = useState<MemberPerms>(initial?.perms ?? DEFAULT_PERMS);

  const toggleModule = (key: ModuleKey) => setPerms(p => ({ ...p, [key]: !p[key] }));

  const anySelected = MODULE_LIST.some(({ key }) => perms[key] === true);

  const canSave = mode === "invite"
    ? email.trim().length > 0 && (role === "admin" || anySelected)
    : firstName.trim().length > 0 && lastName.trim().length > 0 &&
      email.trim().length > 0 && position.length > 0 &&
      (role === "admin" || anySelected);

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      firstName: firstName.trim(),
      lastName:  lastName.trim(),
      email:     email.trim(),
      position,
      jobFunction,
      phone:        phone.trim(),
      companyPhone: companyPhone.trim(),
      extension:    extension.trim(),
      role,
      perms: role === "admin" ? FULL_PERMS : perms,
    });
  };

  const fieldCls = "w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] text-[#1A1A2E] placeholder-gray-400 focus:outline-none focus:border-[#127EE3] focus:bg-white transition-all";
  const selectCls = `${fieldCls} appearance-none cursor-pointer pr-8`;
  const labelCls = "block text-[12.5px] font-semibold text-gray-600 mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[540px] flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-[16px] font-semibold text-[#1A1A2E]">
            {mode === "invite" ? "เชิญสมาชิกใหม่" : "แก้ไขข้อมูลและสิทธิ์ผู้ใช้งาน"}
          </h2>
          <button onClick={onCancel} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0 ml-4">
            <X size={15} className="text-gray-400" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5 overflow-y-auto flex-1">

          {/* ── Edit mode: User Information ── */}
          {mode === "edit" && (
            <>
              <div>
                <p className="text-[13px] font-bold text-[#1A1A2E] mb-3">User Information</p>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>First Name <span className="text-red-400">*</span></label>
                      <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name" className={fieldCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Last Name <span className="text-red-400">*</span></label>
                      <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name" className={fieldCls} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Email Address <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="user@example.com" className={`${fieldCls} pl-9`} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Position <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <select value={position} onChange={e => setPosition(e.target.value)} className={selectCls}>
                        <option value="">-- Select Position --</option>
                        {POSITION_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                      <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Specify your job function</label>
                    <div className="relative">
                      <select value={jobFunction} onChange={e => setJobFunction(e.target.value)} className={selectCls}>
                        <option value="">-- Select Job Function --</option>
                        {JOB_FUNCTION_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                      <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Phone Number</label>
                    <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. 081-234-5678" className={fieldCls} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Company Phone <span className="text-gray-400 font-normal">(Optional)</span></label>
                      <input value={companyPhone} onChange={e => setCompanyPhone(e.target.value)} placeholder="e.g. 02-111-2233" className={fieldCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Extension <span className="text-gray-400 font-normal">(Optional)</span></label>
                      <input value={extension} onChange={e => setExtension(e.target.value)} placeholder="e.g. 101" className={fieldCls} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-100" />
            </>
          )}

          {/* ── Invite mode: Email only ── */}
          {mode === "invite" && (
            <div>
              <label className={labelCls}>Email Address <span className="text-red-400">*</span></label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="user@example.com" className={`${fieldCls} pl-9`} />
              </div>
              <p className="mt-2 text-[12px] text-gray-400 leading-relaxed">
                ผู้ใช้งานจะได้รับอีเมลเชิญ และสามารถกรอกข้อมูลส่วนตัวเพิ่มเติมได้ภายหลัง
              </p>
            </div>
          )}

          {/* ── Permission Settings ── */}
          <div>
            {mode === "edit" && <p className="text-[13px] font-bold text-[#1A1A2E] mb-3">Permission Settings</p>}

            {/* Role */}
            <div className="mb-4">
              <label className={labelCls}>Role</label>
              <div className="flex gap-3">
                {(["admin","user"] as const).map(r => (
                  <button key={r} onClick={() => setRole(r)}
                    className={`flex-1 py-2.5 rounded-xl border text-[13px] font-semibold transition-all ${
                      role === r ? "border-[#127EE3] bg-[#EFF6FF] text-[#127EE3]" : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                    }`}>
                    {r === "admin" ? "Admin" : "User"}
                  </button>
                ))}
              </div>
              {role === "admin" && (
                <p className="mt-2 text-[12px] text-gray-400 flex items-center gap-1.5">
                  <Check size={12} className="text-emerald-500" />
                  Admin มีสิทธิ์เข้าถึงทุกฟังก์ชันโดยอัตโนมัติ
                </p>
              )}
            </div>

            {/* Module Access — User only */}
            {role === "user" && (
              <div>
                <label className="block text-[12.5px] font-semibold text-gray-600 mb-1">
                  Module Access <span className="font-normal text-gray-400">— User</span>
                </label>
                <p className="text-[12px] font-semibold text-gray-500 mb-2.5">Accessible Function</p>
                <div className="space-y-3">
                  {MODULE_LIST.map(({ key, label }) => (
                    <div key={key}>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div onClick={() => toggleModule(key)}
                          className={`w-[18px] h-[18px] rounded-[5px] border-2 flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${
                            perms[key] ? "bg-[#127EE3] border-[#127EE3]" : "bg-white border-gray-300 group-hover:border-[#127EE3]/60"
                          }`}>
                          {perms[key] && <Check size={11} className="text-white" />}
                        </div>
                        <span className="text-[13.5px] text-[#1A1A2E]">{label}</span>
                      </label>
                      {key === "resume" && perms.resume && (
                        <div className="ml-8 mt-2.5 space-y-2">
                          {(["all","some"] as const).map(scope => (
                            <label key={scope} className="flex items-center gap-2.5 cursor-pointer">
                              <div onClick={() => setPerms(p => ({ ...p, resumeScope: scope }))}
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${
                                  perms.resumeScope === scope ? "border-[#127EE3]" : "border-gray-300"
                                }`}>
                                {perms.resumeScope === scope && <div className="w-2 h-2 rounded-full bg-[#127EE3]" />}
                              </div>
                              <span className="text-[13px] text-gray-600">
                                {scope === "all" ? "All positions' resumes" : "Some positions' resumes"}
                              </span>
                            </label>
                          ))}
                          {perms.resumeScope === "some" && (
                            <div className="relative mt-1.5">
                              <select value={perms.resumePositions} onChange={e => setPerms(p => ({ ...p, resumePositions: e.target.value }))}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[12.5px] text-[#1A1A2E] focus:outline-none focus:border-[#127EE3] appearance-none cursor-pointer pr-8 transition-all">
                                <option value="">-- Please Select --</option>
                                <option value="frontend">Frontend Developer</option>
                                <option value="backend">Backend Developer</option>
                                <option value="design">UX/UI Designer</option>
                                <option value="pm">Product Manager</option>
                              </select>
                              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Admin summary */}
            {role === "admin" && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-[12.5px] font-semibold text-gray-500 mb-2">สิทธิ์ที่ได้รับ</p>
                <div className="flex flex-wrap gap-1.5">
                  {MODULE_LIST.map(({ label }) => (
                    <span key={label} className="flex items-center gap-1 px-2.5 py-1 bg-[#EFF6FF] rounded-lg text-[11.5px] font-semibold text-[#127EE3]">
                      <Check size={10} /> {label}
                    </span>
                  ))}
                  <span className="flex items-center gap-1 px-2.5 py-1 bg-[#EFF6FF] rounded-lg text-[11.5px] font-semibold text-[#127EE3]">
                    <Check size={10} /> User Management
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex-shrink-0">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-600 bg-white hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} disabled={!canSave}
            className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all ${
              canSave ? "bg-gradient-to-r from-[#01BFF9] to-[#019EFC] hover:opacity-90 shadow-sm" : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}>
            {mode === "invite" ? "ส่งคำเชิญ" : "บันทึก"}
          </button>
        </div>
      </div>
    </div>
  );
}


// ─── Shared Confirm Delete Modal ──────────────────────────────────────────────
function ConfirmDeleteModal({ title, message, confirmLabel, onConfirm, onCancel }: {
  title: string; message: string; confirmLabel: string;
  onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <p className="text-[15px] font-bold text-[#1A1A2E]">{title}</p>
          <button onClick={onCancel} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"><X size={16} /></button>
        </div>
        <div className="px-6 py-5">
          <p className="text-[13.5px] text-gray-600 leading-relaxed">{message}</p>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors">ยกเลิก</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-[13px] font-semibold transition-colors">{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

type ModalState =
  | { mode: "invite" }
  | { mode: "edit"; member: Member }
  | null;

function TeamTab() {
  const [members, setMembers] = useState<Member[]>(INIT_MEMBERS);
  const [search, setSearch]   = useState("");
  const [modal, setModal]     = useState<ModalState>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = members.filter(m =>
    m.name.includes(search) || m.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (data: Omit<Member, "id" | "av" | "color" | "last" | "name">) => {
    if (modal?.mode === "invite") {
      setMembers(prev => [...prev, {
        ...data,
        id: Date.now().toString(),
        name: "รอผู้ใช้งานกรอกข้อมูล",
        av: "@",
        color: AVATAR_COLORS[prev.length % AVATAR_COLORS.length],
        last: "ยังไม่เข้าใช้งาน",
      }]);
    } else if (modal?.mode === "edit") {
      const fullName = `${data.firstName} ${data.lastName}`;
      setMembers(prev => prev.map(m =>
        m.id === modal.member.id
          ? { ...m, ...data, name: fullName, av: initials(data.firstName) }
          : m
      ));
    }
    setModal(null);
  };

  return (
    <div className="space-y-5">
      {/* Permission modal */}
      {modal && (
        <PermissionModal
          mode={modal.mode}
          initial={modal.mode === "edit" ? modal.member : undefined}
          onSave={handleSave}
          onCancel={() => setModal(null)}
        />
      )}

      {deleteId && (
        <ConfirmDeleteModal
          title="ยืนยันการลบผู้ใช้งาน"
          message="คุณต้องการลบผู้ใช้งานนี้ออกจากทีมใช่หรือไม่?"
          confirmLabel="ลบผู้ใช้งาน"
          onConfirm={() => { setMembers(prev => prev.filter(x => x.id !== deleteId)); setDeleteId(null); }}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {/* ─── สมาชิกในทีม card ─── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-gray-100">
          <h3 className="text-[16px] font-semibold text-[#1A1A2E]">สมาชิกในทีม</h3>
          <p className="text-[13px] text-gray-400 mt-0.5">ตั้งค่าบทบาทและจัดการสิทธิ์การใช้งานของทีมได้ง่าย ๆ</p>
        </div>

        {/* Search + CTA */}
        <div className="px-6 py-4 flex items-center gap-3 border-b border-gray-100">
          <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-[#127EE3] focus-within:bg-white transition-all">
            <Search size={14} className="text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ค้นหาชื่อหรืออีเมลสมาชิก..."
              className="flex-1 text-[13px] outline-none bg-transparent placeholder-gray-400 text-[#1A1A2E]"
            />
          </div>
          <button
            onClick={() => setModal({ mode: "invite" })}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#01BFF9] to-[#019EFC] text-white text-[13px] font-semibold hover:opacity-90 transition-opacity flex-shrink-0 shadow-sm"
          >
            <Plus size={14} /> เชิญสมาชิกใหม่
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-3 text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide">ผู้ใช้งาน</th>
                <th className="text-left px-4 py-3 text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide">สถานะ</th>
                <th className="text-left px-4 py-3 text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide">สิทธิ์การใช้งาน</th>
                <th className="text-left px-4 py-3 text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide">ใช้งานล่าสุด</th>
                <th className="text-center px-4 py-3 text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(m => (
                <tr key={m.id} className="hover:bg-gray-50/60 transition-colors">
                  {/* ผู้ใช้งาน */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0" style={{ background: m.color }}>
                        {m.av}
                      </div>
                      <div>
                        <p className="text-[13.5px] font-semibold text-[#1A1A2E]">{m.name}</p>
                        <p className="text-[12px] text-gray-400">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  {/* สถานะ */}
                  <td className="px-4 py-4">
                    <span
                      className="inline-flex px-2.5 py-1 rounded-lg text-[11.5px] font-bold"
                      style={{ color: ROLE_META_V2[m.role].color, background: ROLE_META_V2[m.role].bg }}
                    >
                      {ROLE_META_V2[m.role].label}
                    </span>
                  </td>
                  {/* สิทธิ์ */}
                  <td className="px-4 py-4">
                    <span className="text-[13px] text-gray-600">{permsToRights(m.role, m.perms)}</span>
                  </td>
                  {/* ใช้งานล่าสุด */}
                  <td className="px-4 py-4">
                    <span className="text-[13px] text-gray-500">{m.last}</span>
                  </td>
                  {/* การจัดการ */}
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setModal({ mode: "edit", member: m })}
                        className="w-8 h-8 rounded-lg hover:bg-blue-50 flex items-center justify-center transition-colors"
                        title="แก้ไขสิทธิ์"
                      >
                        <Pencil size={13} className="text-[#127EE3]" />
                      </button>
                      <button
                        onClick={() => setDeleteId(m.id)}
                        className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors"
                        title="ลบสมาชิก"
                      >
                        <Trash2 size={13} className="text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-[13px] text-gray-400">ไม่พบสมาชิกที่ตรงกับการค้นหา</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <span className="text-[12.5px] text-gray-400">
            Showing 1–{filtered.length} of {members.length} Members
          </span>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded-lg bg-[#127EE3] text-white text-[13px] font-semibold flex items-center justify-center shadow-sm">1</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tab 3: Notifications ─────────────────────────────────────────────────────
function NotificationsTab() {
  const [channels,setChannels] = useState<Set<string>>(new Set(["email","inapp"]));
  const [dirty,setDirty] = useState(false);

  const toggleCh = (ch:string) => {
    setChannels(prev=>{ const n=new Set(prev); n.has(ch)?n.delete(ch):n.add(ch); return n; });
    setDirty(true);
  };

  const [ns,setNs] = useState({
    newApp:true, aiPick:true,
    remind1d:true, remind1h:true, appConfirm:true,
  });
  const tog = (k:keyof typeof ns) => { setNs(v=>({...v,[k]:!v[k]})); setDirty(true); };

  return (
    <div className="space-y-5">
      <SaveBanner dirty={dirty} onSave={()=>setDirty(false)} />

      <SectionCard title="ช่องทางการแจ้งเตือน" subtitle="เลือกได้มากกว่า 1 ช่องทาง">
        <div className="flex gap-2 flex-wrap">
          {[{key:"email",label:"อีเมล",icon:<Mail size={14}/>},{key:"inapp",label:"In-app",icon:<Bell size={14}/>}].map(ch=>(
            <button key={ch.key} onClick={()=>toggleCh(ch.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[13px] font-semibold transition-all ${channels.has(ch.key)?"bg-[#127EE3] text-white border-[#127EE3] shadow-sm":"bg-white text-gray-600 border-gray-200 hover:border-[#127EE3] hover:text-[#127EE3]"}`}>
              {ch.icon}{ch.label}
              {channels.has(ch.key) && <Check size={13}/>}
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="ผู้สมัครใหม่">
        <Toggle checked={ns.newApp} onChange={()=>tog("newApp")} label="มีผู้สมัครใหม่"           description="แจ้งเมื่อมีคนสมัครงานในตำแหน่งที่คุณดูแล" />
        <Toggle checked={ns.aiPick} onChange={()=>tog("aiPick")} label="ผู้สมัครแนะนำจาก AI"     description="แจ้งเมื่อ AI คัดเลือกผู้สมัครที่ตรงกับตำแหน่ง" />
      </SectionCard>

      <SectionCard title="การสัมภาษณ์">
        <Toggle checked={ns.remind1d}   onChange={()=>tog("remind1d")}   label="เตือนนัดสัมภาษณ์ล่วงหน้า 1 วัน" />
        <Toggle checked={ns.remind1h}   onChange={()=>tog("remind1h")}   label="เตือนนัดสัมภาษณ์ล่วงหน้า 1 ชั่วโมง" />
        <Toggle checked={ns.appConfirm} onChange={()=>tog("appConfirm")} label="ผู้สมัครยืนยัน / ปฏิเสธนัด" />
      </SectionCard>
    </div>
  );
}

// ─── Tab 4: Security ──────────────────────────────────────────────────────────
function SecurityTab() {
  // Account security — email
  const [currentEmail,  setCurrentEmail]  = useState("chanipinya@techvibe.co.th");
  const [editingEmail,  setEditingEmail]  = useState(false);
  const [newEmail,      setNewEmail]      = useState("");
  const [confEmail,     setConfEmail]     = useState("");

  const emailCanSave =
    newEmail.trim().length > 0 &&
    confEmail.trim().length > 0 &&
    newEmail.trim() === confEmail.trim() &&
    newEmail.trim() !== currentEmail;

  const handleEmailSave = () => {
    setCurrentEmail(newEmail.trim());
    setNewEmail(""); setConfEmail("");
    setEditingEmail(false);
  };

  const handleEmailCancel = () => {
    setNewEmail(""); setConfEmail("");
    setEditingEmail(false);
  };

  // Account security — password
  const [editingPassword, setEditingPassword] = useState(false);
  const [showCur,         setShowCur]         = useState(false);
  const [cur,             setCur]             = useState("");
  const [nw,              setNw]              = useState("");
  const [conf,            setConf]            = useState("");

  const handlePasswordSave = () => {
    setCur(""); setNw(""); setConf("");
    setShowCur(false);
    setEditingPassword(false);
  };

  const handlePasswordCancel = () => {
    setCur(""); setNw(""); setConf("");
    setShowCur(false);
    setEditingPassword(false);
  };

  const [twoFA,  setTwoFA]   = useState(false);
  const [otp,    setOtp]     = useState("");
  const [timeout,setTimeout_] = useState("8 ชั่วโมง");

  const strength = [nw.length>=8, /[0-9]/.test(nw), /[^a-zA-Z0-9]/.test(nw)];
  const strengthColor = ["bg-red-400","bg-amber-400","bg-emerald-400"];
  const strengthLabel = ["อ่อน","ปานกลาง","แข็งแกร่ง"];
  const strengthScore = strength.filter(Boolean).length;

  const AUDIT = [
    { time:"23 เม.ย. 2569 09:12", act:"เข้าสู่ระบบ",            ip:"101.51.xx.xx",  ok:true  },
    { time:"22 เม.ย. 2569 18:45", act:"แก้ไขตั้งค่าองค์กร",     ip:"101.51.xx.xx",  ok:true  },
    { time:"21 เม.ย. 2569 14:30", act:"เข้าสู่ระบบ",            ip:"101.51.xx.xx",  ok:true  },
    { time:"20 เม.ย. 2569 08:55", act:"พยายามเข้าสู่ระบบ",      ip:"203.113.xx.xx", ok:false },
    { time:"19 เม.ย. 2569 20:10", act:"ออกจากระบบ",             ip:"101.51.xx.xx",  ok:true  },
  ];

  return (
    <div className="space-y-5">
      {/* Account security */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <p className="text-[14px] font-bold text-[#1A1A2E]">บัญชีและความปลอดภัย</p>
        </div>

        {/* Email row */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[12px] font-semibold text-gray-400 mb-0.5">อีเมลเข้าสู่ระบบ</p>
              <p className="text-[14px] font-medium text-[#1A1A2E]">{currentEmail}</p>
            </div>
            {!editingEmail && (
              <button onClick={() => setEditingEmail(true)}
                className="text-[13px] font-semibold text-[#127EE3] hover:text-[#0e6bc7] transition-colors flex-shrink-0 mt-0.5">
                แก้ไข
              </button>
            )}
          </div>
          {editingEmail && (
            <div className="space-y-3 mt-4 max-w-sm">
              <Field label="อีเมลใหม่">
                <div className="flex items-center gap-2 bg-[#F8F9FA] border border-gray-200 rounded-xl px-3.5 py-2.5 focus-within:border-[#127EE3] focus-within:bg-white transition-all">
                  <Mail size={14} className="text-gray-400 flex-shrink-0" />
                  <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)}
                    placeholder="กรอกอีเมลใหม่"
                    className="flex-1 text-[13px] bg-transparent outline-none placeholder-gray-400 text-[#1A1A2E]" />
                </div>
              </Field>
              <Field label="ยืนยันอีเมลใหม่">
                <div className="flex items-center gap-2 bg-[#F8F9FA] border border-gray-200 rounded-xl px-3.5 py-2.5 focus-within:border-[#127EE3] focus-within:bg-white transition-all">
                  <Mail size={14} className="text-gray-400 flex-shrink-0" />
                  <input type="email" value={confEmail} onChange={e => setConfEmail(e.target.value)}
                    placeholder="ยืนยันอีเมลใหม่"
                    className="flex-1 text-[13px] bg-transparent outline-none placeholder-gray-400 text-[#1A1A2E]" />
                </div>
                {confEmail.length > 0 && newEmail !== confEmail && (
                  <p className="mt-1.5 text-[12px] text-red-400">อีเมลไม่ตรงกัน</p>
                )}
              </Field>
              <div className="flex gap-3 pt-1">
                <button onClick={handleEmailCancel}
                  className="px-4 py-2 border border-gray-200 text-[13px] font-semibold text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
                  ยกเลิก
                </button>
                <button onClick={handleEmailSave} disabled={!emailCanSave}
                  className={`px-4 py-2 text-[13px] font-bold rounded-xl transition-colors ${
                    emailCanSave ? "bg-[#127EE3] text-white hover:bg-[#0e6bc7]" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}>
                  บันทึก
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Password row */}
        <div className="px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[12px] font-semibold text-gray-400 mb-0.5">รหัสผ่าน</p>
              <p className="text-[14px] font-medium text-[#1A1A2E]">ตั้งค่าแล้ว</p>
            </div>
            {!editingPassword && (
              <button onClick={() => setEditingPassword(true)}
                className="text-[13px] font-semibold text-[#127EE3] hover:text-[#0e6bc7] transition-colors flex-shrink-0 mt-0.5">
                แก้ไข
              </button>
            )}
          </div>
          {editingPassword && (
            <div className="space-y-3 mt-4 max-w-sm">
              <Field label="รหัสผ่านปัจจุบัน">
                <div className="flex items-center gap-2 bg-[#F8F9FA] border border-gray-200 rounded-xl px-3.5 py-2.5 focus-within:border-[#127EE3] focus-within:bg-white transition-all">
                  <input value={cur} onChange={e=>setCur(e.target.value)} type={showCur?"text":"password"} placeholder="••••••••"
                    className="flex-1 bg-transparent text-[13.5px] outline-none placeholder-gray-400"/>
                  <button onClick={()=>setShowCur(v=>!v)} className="text-gray-400 hover:text-gray-600">
                    {showCur?<EyeOff size={15}/>:<Eye size={15}/>}
                  </button>
                </div>
              </Field>
              <Field label="รหัสผ่านใหม่" hint="ต้องมีอย่างน้อย 8 ตัวอักษร ตัวเลข และอักขระพิเศษ">
                <div className="bg-[#F8F9FA] border border-gray-200 rounded-xl px-3.5 py-2.5 focus-within:border-[#127EE3] focus-within:bg-white transition-all">
                  <input value={nw} onChange={e=>setNw(e.target.value)} type="password" placeholder="••••••••"
                    className="w-full bg-transparent text-[13.5px] outline-none placeholder-gray-400"/>
                </div>
                {nw.length>0 && (
                  <div className="mt-2 space-y-1.5">
                    <div className="flex gap-1">
                      {strength.map((ok,i)=>(
                        <div key={i} className={`flex-1 h-1.5 rounded-full transition-colors ${ok?strengthColor[strengthScore-1]||"bg-emerald-400":"bg-gray-200"}`}/>
                      ))}
                    </div>
                    <p className={`text-[11px] font-semibold ${strengthScore===3?"text-emerald-500":strengthScore===2?"text-amber-500":"text-red-500"}`}>
                      ความแข็งแกร่ง: {strengthLabel[strengthScore-1]||"อ่อน"}
                    </p>
                  </div>
                )}
              </Field>
              <Field label="ยืนยันรหัสผ่านใหม่">
                <div className={`bg-[#F8F9FA] border rounded-xl px-3.5 py-2.5 focus-within:bg-white transition-all ${conf&&conf!==nw?"border-red-300 focus-within:border-red-400":"border-gray-200 focus-within:border-[#127EE3]"}`}>
                  <input value={conf} onChange={e=>setConf(e.target.value)} type="password" placeholder="••••••••"
                    className="w-full bg-transparent text-[13.5px] outline-none placeholder-gray-400"/>
                </div>
                {conf&&conf!==nw && <p className="text-[11.5px] text-red-500 mt-1">รหัสผ่านไม่ตรงกัน</p>}
              </Field>
              <div className="flex gap-3 pt-1">
                <button onClick={handlePasswordCancel}
                  className="px-4 py-2 border border-gray-200 text-[13px] font-semibold text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
                  ยกเลิก
                </button>
                <button onClick={handlePasswordSave}
                  className="px-4 py-2 bg-[#127EE3] text-white text-[13px] font-bold rounded-xl hover:bg-[#0e6bc7] transition-colors">
                  บันทึก
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2FA */}
      <SectionCard title="การยืนยันตัวตนสองขั้นตอน (2FA)">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <p className="text-[13.5px] font-semibold text-[#1A1A2E]">Two-Factor Authentication</p>
            <p className="text-[12.5px] text-gray-400 mt-0.5">เพิ่มความปลอดภัยด้วยรหัส OTP ทุกครั้งที่เข้าสู่ระบบ</p>
          </div>
          <button onClick={()=>setTwoFA(v=>!v)} className={`relative w-11 h-6 rounded-full transition-colors ${twoFA?"bg-[#127EE3]":"bg-gray-200"}`}>
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${twoFA?"left-[22px]":"left-0.5"}`}/>
          </button>
        </div>
        {twoFA && (
          <div className="flex items-start gap-5 p-4 bg-[#F0F8FF] rounded-xl border border-[#0DC2FF]/20">
            <div className="w-28 h-28 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
              <QrCode size={48} className="text-gray-400"/>
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-bold text-[#1A1A2E] mb-1">สแกน QR ด้วยแอป Authenticator</p>
              <p className="text-[12px] text-gray-500 mb-3">ใช้ Google Authenticator หรือ Authy สแกน QR code แล้วกรอกรหัส 6 หลัก</p>
              <div className="flex items-center gap-2">
                <input value={otp} onChange={e=>setOtp(e.target.value)} maxLength={6} placeholder="000000"
                  className="w-32 bg-white border border-gray-200 rounded-xl px-3 py-2 text-[16px] font-mono text-center text-[#1A1A2E] focus:outline-none focus:border-[#127EE3] tracking-widest transition-all"/>
                <button className="px-4 py-2 bg-[#127EE3] text-white text-[13px] font-bold rounded-xl hover:bg-[#0e6bc7] transition-colors">ยืนยัน</button>
              </div>
            </div>
          </div>
        )}
      </SectionCard>

      {/* Devices */}
      <SectionCard title="อุปกรณ์ที่เข้าสู่ระบบอยู่">
        <div className="space-y-1 mb-4">
          {[
            { icon:<Monitor size={16}/>,    label:"MacBook Pro · Chrome",  loc:"กรุงเทพฯ, ไทย", time:"ตอนนี้",             cur:true  },
            { icon:<Smartphone size={16}/>, label:"iPhone 15 · Safari",    loc:"กรุงเทพฯ, ไทย", time:"2 ชั่วโมงที่แล้ว",  cur:false },
            { icon:<Laptop size={16}/>,     label:"Windows PC · Edge",     loc:"เชียงใหม่, ไทย", time:"เมื่อวาน",          cur:false },
          ].map((d,i)=>(
            <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-all">
              <span className={`flex-shrink-0 ${d.cur?"text-[#127EE3]":"text-gray-400"}`}>{d.icon}</span>
              <div className="flex-1">
                <p className="text-[13.5px] font-medium text-[#1A1A2E]">{d.label}</p>
                <p className="text-[12px] text-gray-400">{d.loc} · {d.time}</p>
              </div>
              {d.cur
                ? <span className="text-[11.5px] font-bold text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-lg flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"/>อุปกรณ์นี้</span>
                : <button className="text-[12.5px] font-semibold text-red-500 hover:text-red-600 flex items-center gap-1"><LogOut size={12}/>ออก</button>
              }
            </div>
          ))}
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-red-200 text-red-500 text-[13px] font-semibold rounded-xl hover:bg-red-50 transition-colors">
          <LogOut size={14}/> ออกจากระบบทุกอุปกรณ์
        </button>
      </SectionCard>

      {/* Audit log */}
      <SectionCard title="บันทึกกิจกรรม" subtitle="ประวัติการเข้าสู่ระบบและการเปลี่ยนแปลง">
        <div className="overflow-hidden rounded-xl border border-gray-100">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-gray-50">
                {["เวลา","กิจกรรม","IP Address","สถานะ"].map(h=>(
                  <th key={h} className="text-left px-4 py-2.5 font-bold text-[11px] text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {AUDIT.map((a,i)=>(
                <tr key={i} className={i%2===0?"bg-white":"bg-gray-50/50"}>
                  <td className="px-4 py-2.5 text-gray-500 whitespace-nowrap">{a.time}</td>
                  <td className="px-4 py-2.5 font-medium text-[#1A1A2E]">{a.act}</td>
                  <td className="px-4 py-2.5 text-gray-500 font-mono text-[12px]">{a.ip}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11.5px] font-bold ${a.ok?"text-emerald-600 bg-emerald-50":"text-red-600 bg-red-50"}`}>
                      {a.ok?<Check size={10}/>:<X size={10}/>}
                      {a.ok?"สำเร็จ":"ล้มเหลว"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Session timeout */}
      <SectionCard title="Session Timeout">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-[13.5px] font-medium text-[#1A1A2E] mb-0.5">ออกจากระบบอัตโนมัติเมื่อไม่มีการใช้งาน</p>
            <p className="text-[12px] text-gray-400">ป้องกันการเข้าถึงโดยไม่ได้รับอนุญาต</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Sel value={timeout} onChange={setTimeout_} options={["1 ชั่วโมง","4 ชั่วโมง","8 ชั่วโมง","24 ชั่วโมง","ไม่มีกำหนด"]}/>
            <button className="px-4 py-2.5 bg-[#127EE3] text-white text-[13px] font-bold rounded-xl hover:bg-[#0e6bc7] transition-colors whitespace-nowrap">บันทึก</button>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

// ─── Logo Crop Modal ──────────────────────────────────────────────────────────
const CROP_SIZE = 300;

function LogoCropModal({ src, onConfirm, onCancel }: {
  src: string;
  onConfirm: (dataUrl: string) => void;
  onCancel: () => void;
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const dragging = useRef(false);
  const dragStart = useRef({ mx: 0, my: 0, px: 0, py: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

  const onImgLoad = () => {
    setPosition({ x: 0, y: 0 });
    setZoom(1);
    setLoaded(true);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    dragStart.current = { mx: e.clientX, my: e.clientY, px: position.x, py: position.y };
  };

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging.current) return;
    setPosition({
      x: dragStart.current.px + (e.clientX - dragStart.current.mx),
      y: dragStart.current.py + (e.clientY - dragStart.current.my),
    });
  }, []);

  const onMouseUp = useCallback(() => { dragging.current = false; }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    dragging.current = true;
    dragStart.current = { mx: e.touches[0].clientX, my: e.touches[0].clientY, px: position.x, py: position.y };
  };

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!dragging.current) return;
    e.preventDefault();
    setPosition({
      x: dragStart.current.px + (e.touches[0].clientX - dragStart.current.mx),
      y: dragStart.current.py + (e.touches[0].clientY - dragStart.current.my),
    });
  }, []);

  const onTouchEnd = useCallback(() => { dragging.current = false; }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [onMouseMove, onMouseUp, onTouchMove, onTouchEnd]);

  const handleConfirm = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext("2d")!;
    const img = imgRef.current!;
    const displayedW = img.naturalWidth * zoom;
    const displayedH = img.naturalHeight * zoom;
    const imgLeft = CROP_SIZE / 2 + position.x - displayedW / 2;
    const imgTop  = CROP_SIZE / 2 + position.y - displayedH / 2;
    const srcX = -imgLeft / zoom;
    const srcY = -imgTop / zoom;
    const srcW = CROP_SIZE / zoom;
    const srcH = CROP_SIZE / zoom;
    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, 400, 400);
    onConfirm(canvas.toDataURL("image/png"));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-[380px] overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
          <p className="text-[15px] font-semibold text-[#1A1A2E]">ปรับตำแหน่งโลโก้</p>
          <button onClick={onCancel} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
            <X size={15} className="text-gray-500" />
          </button>
        </div>
        <div className="px-5 pt-4 pb-2">
          <p className="text-[12px] text-gray-400 mb-3 text-center">ลากเพื่อปรับตำแหน่ง · ใช้แถบด้านล่างเพื่อซูม</p>
          {/* crop frame */}
          <div
            className="mx-auto rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none"
            style={{ width: CROP_SIZE, height: CROP_SIZE, position: "relative", background: "#f3f4f6" }}
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
          >
            <div className="absolute inset-0" style={{ backgroundImage: "repeating-conic-gradient(#e5e7eb 0% 25%, white 0% 50%)", backgroundSize: "20px 20px" }} />
            {!loaded && (
              <div className="absolute inset-0 flex items-center justify-center text-[13px] text-gray-400 z-10">
                กำลังโหลดรูปภาพ...
              </div>
            )}
            {src ? (
              <img
                ref={imgRef}
                src={src}
                alt="crop preview"
                draggable={false}
                onLoad={onImgLoad}
                className="absolute top-1/2 left-1/2 max-w-none select-none pointer-events-none"
                style={{
                  transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                  width: "100%",
                  height: "auto",
                }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-[13px] text-gray-400">
                ไม่พบรูปภาพที่อัปโหลด
              </div>
            )}
            <div className="absolute inset-0 rounded-2xl ring-2 ring-[#0DC2FF]/60 pointer-events-none" />
          </div>
          {/* zoom slider */}
          <div className="mt-4 flex items-center gap-3">
            <span className="text-[11px] text-gray-400 w-5 text-center">−</span>
            <input
              type="range"
              min={0.5}
              max={3}
              step={0.01}
              value={zoom}
              onChange={e => setZoom(parseFloat(e.target.value))}
              className="flex-1 accent-[#0DC2FF] h-1.5 cursor-pointer"
            />
            <span className="text-[11px] text-gray-400 w-5 text-center">+</span>
          </div>
        </div>
        <div className="flex gap-2 px-5 py-4">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            ยกเลิก
          </button>
          <button onClick={handleConfirm} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#01BFF9] to-[#019EFC] text-white text-[13px] font-semibold hover:opacity-90 transition-opacity">
            ใช้รูปนี้
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Tab 5: Email Templates ───────────────────────────────────────────────────
type EmailTemplate = typeof sharedEmailTemplates[number];

const INIT_TEMPLATES: EmailTemplate[] = sharedEmailTemplates;

function EmailTemplatesTab() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(INIT_TEMPLATES);
  const [query, setQuery] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const filtered = templates.filter(r =>
    r.name.toLowerCase().includes(query.toLowerCase()) ||
    r.purpose.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {deleteId !== null && (
        <ConfirmDeleteModal
          title="ยืนยันการลบเทมเพลต"
          message="คุณต้องการลบเทมเพลตนี้ออกจากรายการใช่หรือไม่?"
          confirmLabel="ลบเทมเพลต"
          onConfirm={() => { setTemplates(prev => prev.filter(t => t.id !== deleteId)); setDeleteId(null); }}
          onCancel={() => setDeleteId(null)}
        />
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <p className="text-[15px] font-bold text-[#1A1A2E]">เทมเพลตอีเมล</p>
          <p className="text-[12.5px] text-gray-400 mt-0.5">จัดการข้อความอีเมลที่ใช้บ่อย เพื่อส่งหาผู้สมัครหรือผู้พิจารณาได้รวดเร็วขึ้น</p>
        </div>

        <div className="px-6 py-4 flex items-center gap-3 border-b border-gray-100">
          <div className="flex-1 flex items-center gap-2.5 bg-[#F8F9FA] border border-gray-200 rounded-xl px-3.5 py-2.5 focus-within:border-[#127EE3] focus-within:bg-white transition-all">
            <Search size={14} className="text-gray-400 flex-shrink-0" />
            <input
              value={query} onChange={e => setQuery(e.target.value)}
              placeholder="ค้นหาเทมเพลต..."
              className="flex-1 text-[13px] bg-transparent outline-none placeholder-gray-400 text-[#1A1A2E]"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#01BFF9] to-[#019EFC] text-white text-[13px] font-semibold rounded-xl hover:opacity-90 transition-opacity flex-shrink-0">
            <Plus size={14} /> สร้างเทมเพลตใหม่
          </button>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-[#F8F9FA] border-b border-gray-100">
              <th className="text-left px-6 py-3 text-[11.5px] font-semibold text-gray-400 uppercase tracking-wide">ชื่อเทมเพลต</th>
              <th className="text-left px-6 py-3 text-[11.5px] font-semibold text-gray-400 uppercase tracking-wide">ใช้สำหรับ</th>
              <th className="text-left px-6 py-3 text-[11.5px] font-semibold text-gray-400 uppercase tracking-wide">แก้ไขล่าสุด</th>
              <th className="text-left px-6 py-3 text-[11.5px] font-semibold text-gray-400 uppercase tracking-wide">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(row => (
              <tr key={row.id} className="border-b border-gray-50 last:border-0 hover:bg-[#F8FBFF] transition-colors">
                <td className="px-6 py-4">
                  <p className="text-[13.5px] font-semibold text-[#1A1A2E]">{row.name}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-[#127EE3] text-[12px] font-semibold rounded-lg">{row.purpose}</span>
                </td>
                <td className="px-6 py-4 text-[13px] text-gray-500">{row.updated}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-lg text-gray-400 hover:text-[#127EE3] hover:bg-blue-50 transition-all">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => setDeleteId(row.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-[13px] text-gray-400">ไม่พบเทมเพลตที่ค้นหา</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Tab 6: Email Address Book ────────────────────────────────────────────────
interface EmailContact { id: string | number; fullName: string; email: string; department: string; }

const INIT_CONTACTS: EmailContact[] = emailAddressBookContacts.map((c) => ({
  id: c.id,
  fullName: c.fullName,
  email: c.email,
  department: c.department,
}));

const DEPARTMENT_OPTIONS = ["HR","Recruitment","Sales","Marketing","Product","IT","Finance","Operation","Management","Other"];
const EMPTY_CONTACT = { fullName: "", email: "", department: "", customDepartment: "" };

function EmailBookTab() {
  const [contacts, setContacts] = useState<EmailContact[]>(INIT_CONTACTS);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<{ open: boolean; editing: EmailContact | null }>({ open: false, editing: null });
  const [form, setForm] = useState(EMPTY_CONTACT);

  const filtered = contacts.filter(r =>
    [r.fullName, r.email, r.department].some(v => v.toLowerCase().includes(query.toLowerCase()))
  );

  const isOther = form.department === "Other";
  const effectiveDepartment = isOther ? form.customDepartment.trim() : form.department;

  const openAdd = () => { setForm(EMPTY_CONTACT); setModal({ open: true, editing: null }); };
  const openEdit = (c: EmailContact) => {
    const isKnown = DEPARTMENT_OPTIONS.includes(c.department);
    setForm({
      fullName: c.fullName,
      email: c.email,
      department: isKnown ? c.department : "Other",
      customDepartment: isKnown ? "" : c.department,
    });
    setModal({ open: true, editing: c });
  };
  const closeModal = () => setModal({ open: false, editing: null });

  const canSave = form.fullName.trim() && form.email.trim() && !!effectiveDepartment;

  const handleSave = () => {
    if (!canSave) return;
    const saved = { fullName: form.fullName.trim(), email: form.email.trim(), department: effectiveDepartment };
    if (modal.editing) {
      setContacts(prev => prev.map(c => c.id === modal.editing!.id ? { ...c, ...saved } : c));
    } else {
      setContacts(prev => [...prev, { id: Date.now(), ...saved }]);
    }
    closeModal();
  };

  const [deleteId, setDeleteId] = useState<string | number | null>(null);

  return (
    <div className="space-y-5">
      {deleteId !== null && (
        <ConfirmDeleteModal
          title="ยืนยันการลบรายชื่อ"
          message="คุณต้องการลบรายชื่อนี้ออกจากสมุดรายชื่ออีเมลใช่หรือไม่?"
          confirmLabel="ลบรายชื่อ"
          onConfirm={() => { setContacts(prev => prev.filter(c => c.id !== deleteId)); setDeleteId(null); }}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <p className="text-[15px] font-bold text-[#1A1A2E]">{modal.editing ? "แก้ไขรายชื่ออีเมล" : "เพิ่มรายชื่ออีเมล"}</p>
              <button onClick={closeModal} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"><X size={16} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {([ ["fullName","ชื่อ-นามสกุล","เช่น คุณสมชาย"], ["email","อีเมล","เช่น somchai@company.co.th"] ] as [keyof typeof form, string, string][]).map(([key, label, placeholder]) => (
                <div key={key} className="space-y-1.5">
                  <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wide">{label}</label>
                  <input
                    value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full bg-[#F8F9FA] border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13.5px] text-[#1A1A2E] placeholder-gray-400 focus:outline-none focus:border-[#127EE3] focus:bg-white transition-all"
                  />
                </div>
              ))}
              <div className="space-y-1.5">
                <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wide">แผนก</label>
                <div className="relative">
                  <select
                    value={form.department}
                    onChange={e => setForm(f => ({ ...f, department: e.target.value, customDepartment: "" }))}
                    className="w-full appearance-none bg-[#F8F9FA] border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13.5px] text-[#1A1A2E] focus:outline-none focus:border-[#127EE3] focus:bg-white transition-all pr-9"
                  >
                    <option value="" disabled>เลือกแผนก...</option>
                    {DEPARTMENT_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              {isOther && (
                <div className="space-y-1.5">
                  <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wide">ระบุแผนก</label>
                  <input
                    value={form.customDepartment}
                    onChange={e => setForm(f => ({ ...f, customDepartment: e.target.value }))}
                    placeholder="เช่น Legal, R&D"
                    className="w-full bg-[#F8F9FA] border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13.5px] text-[#1A1A2E] placeholder-gray-400 focus:outline-none focus:border-[#127EE3] focus:bg-white transition-all"
                  />
                </div>
              )}
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={closeModal} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors">ยกเลิก</button>
              <button onClick={handleSave} disabled={!canSave}
                className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-opacity ${canSave ? "bg-gradient-to-r from-[#01BFF9] to-[#019EFC] hover:opacity-90" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <p className="text-[15px] font-bold text-[#1A1A2E]">สมุดรายชื่ออีเมล</p>
          <p className="text-[12.5px] text-gray-400 mt-0.5">จัดการรายชื่ออีเมลของผู้พิจารณาและทีมที่ใช้ส่งต่อผู้สมัครเป็นประจำ</p>
        </div>

        <div className="px-6 py-4 flex items-center gap-3 border-b border-gray-100">
          <div className="flex-1 flex items-center gap-2.5 bg-[#F8F9FA] border border-gray-200 rounded-xl px-3.5 py-2.5 focus-within:border-[#127EE3] focus-within:bg-white transition-all">
            <Search size={14} className="text-gray-400 flex-shrink-0" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="ค้นหาชื่อหรืออีเมล..."
              className="flex-1 text-[13px] bg-transparent outline-none placeholder-gray-400 text-[#1A1A2E]" />
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#01BFF9] to-[#019EFC] text-white text-[13px] font-semibold rounded-xl hover:opacity-90 transition-opacity flex-shrink-0">
            <Plus size={14} /> เพิ่มรายชื่อ
          </button>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-[#F8F9FA] border-b border-gray-100">
              <th className="text-left px-6 py-3 text-[11.5px] font-semibold text-gray-400 uppercase tracking-wide">ชื่อ-นามสกุล</th>
              <th className="text-left px-6 py-3 text-[11.5px] font-semibold text-gray-400 uppercase tracking-wide">อีเมล</th>
              <th className="text-left px-6 py-3 text-[11.5px] font-semibold text-gray-400 uppercase tracking-wide">แผนก</th>
              <th className="text-left px-6 py-3 text-[11.5px] font-semibold text-gray-400 uppercase tracking-wide">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(row => (
              <tr key={row.id} className="border-b border-gray-50 last:border-0 hover:bg-[#F8FBFF] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#01BFF9]/20 to-[#019EFC]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[12px] font-bold text-[#127EE3]">{row.fullName.charAt(0)}</span>
                    </div>
                    <p className="text-[13.5px] font-semibold text-[#1A1A2E]">{row.fullName}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-[13px] text-gray-500">{row.email}</td>
                <td className="px-6 py-4 text-[13px] text-gray-600">{row.department}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(row)} className="p-1.5 rounded-lg text-gray-400 hover:text-[#127EE3] hover:bg-blue-50 transition-all"><Pencil size={14} /></button>
                    <button onClick={() => setDeleteId(row.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-10 text-center text-[13px] text-gray-400">ไม่พบรายชื่อที่ค้นหา</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function OrganizationSettingsPage({ onBack }: { onBack?: () => void }) {
  const [tab, setTab] = useState<Tab>("company");

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-7 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-[#127EE3]/10 flex items-center justify-center">
              <Building2 size={14} className="text-[#127EE3]" />
            </div>
            <p className="text-[11px] font-bold text-[#127EE3] uppercase tracking-widest">ระบบ</p>
          </div>
          <h1 className="text-[22px] font-bold text-[#1A1A2E] tracking-tight">ตั้งค่าองค์กร</h1>
          <p className="text-[13.5px] text-gray-400 mt-1">จัดการข้อมูล ทีม การแจ้งเตือน และความปลอดภัย</p>
        </div>
      </div>

      <div className="flex gap-6 items-start">
        {/* Left nav */}
        <nav className="w-[200px] flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 sticky top-6">
          {TABS.map(t=>(
            <button key={t.key} onClick={()=>setTab(t.key)}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all text-left mb-0.5 last:mb-0 ${tab===t.key ? "bg-gradient-to-r from-[#01BFF9]/10 to-[#019EFC]/10 text-[#127EE3] font-semibold border border-[#127EE3]/15" : "text-gray-500 hover:bg-[#F7F9FC] hover:text-[#1A1A2E]"}`}>
              <span className={`flex-shrink-0 ${tab===t.key?"text-[#127EE3]":"text-gray-300"}`}>{t.icon}</span>
              {t.label}
              {tab===t.key && <ChevronRight size={13} className="ml-auto text-[#127EE3]/70"/>}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {tab === "company"        && <CompanyTab />}
          {tab === "team"           && <TeamTab />}
          {tab === "notifications"  && <NotificationsTab />}
          {tab === "emailTemplates" && <EmailTemplatesTab />}
          {tab === "emailBook"      && <EmailBookTab />}
          {tab === "security"       && <SecurityTab />}
        </div>
      </div>
    </div>
  );
}
