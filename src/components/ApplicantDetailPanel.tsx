import { useState, useRef, useEffect, type ReactNode } from "react";
import InterviewScheduler, { toThaiDate, typeLabel } from "./InterviewScheduler";
import type { InterviewerContact } from "./InterviewScheduler";
import ReferToInput from "./ReferToInput";
import { X, Sparkles, CheckCircle2, AlertCircle, Briefcase, MapPin, GraduationCap, DollarSign, MessageCircle, Calendar, Send, ChevronRight, ChevronDown, ChevronUp, Star, ThumbsUp, ThumbsDown, Award, Eye, Clock, FileText, UserCheck, PhoneCall, Mail, Phone, Brain, Zap, TrendingUp, BarChart2, Target, Users, Lightbulb, Shield, Flame, Activity, Heart, BookOpen, Dumbbell, Music, Languages, Paperclip, Upload, Download, ExternalLink, Search, Globe, Plus, MoreHorizontal, Lock, PhoneOff, Ban, RefreshCw, UserX, XCircle, CreditCard as Edit2, Copy } from "lucide-react";
import type { ApplicantRow, PipelineStage } from "../data/applicants";
import { PIPELINE_STAGES } from "../data/applicants";
import { emailTemplates } from "../data/emailTemplates";
import { emailAddressBookContacts } from "../data/emailAddressBook";

interface ApplicantDetailPanelProps {
  applicant: ApplicantRow;
  onClose: () => void;
  onStageChange: (id: string, stage: PipelineStage) => void;
}

const FALLBACK_STAGE_CFG = { label: "ไม่ทราบสถานะ", color: "text-gray-500", bg: "bg-gray-100" };
const getStageConfig = (key: PipelineStage) => PIPELINE_STAGES.find((s) => s.key === key) ?? FALLBACK_STAGE_CFG;

const PIPELINE_FLOW: PipelineStage[] = [
  "new",
  "shortlist",
  "review",
  "to_interview",
  "interview",
  "passed",
  "offer",
  "hired",
];

/* ------------------------------------------------------------------ */
/* Stage progress bar                                                    */
/* ------------------------------------------------------------------ */
function StageProgressBar({ current }: { current: PipelineStage }) {
  const idx = PIPELINE_FLOW.indexOf(current);
  const isRejected = current === "rejected";

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {PIPELINE_FLOW.map((stage, i) => {
        const cfg = getStageConfig(stage);
        const isPast = idx > i;
        const isCurrent = idx === i;
        return (
          <div key={stage} className="flex items-center gap-1">
            <span
              className={`px-2 py-1 rounded-lg text-[10.5px] font-semibold ${
                isRejected
                  ? "bg-gray-50 text-gray-300"
                  : isPast
                  ? "bg-emerald-50 text-emerald-600"
                  : isCurrent
                  ? `${cfg.bg} ${cfg.color} ring-1 ring-current`
                  : "bg-gray-50 text-gray-300"
              }`}
            >
              {cfg.label}
            </span>
            {i < PIPELINE_FLOW.length - 1 && (
              <ChevronRight className={`w-3 h-3 ${isPast && !isRejected ? "text-emerald-400" : "text-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Collapsible section                                                   */
/* ------------------------------------------------------------------ */
function CollapsibleSection({
  title,
  icon,
  defaultOpen = false,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-7 py-4 hover:bg-gray-50/60 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-[13px] font-bold text-[#1A1A2E]">{title}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && <div className="px-7 pb-5">{children}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tab: Resume                                                           */
/* ------------------------------------------------------------------ */
function ResumeContent({ applicant }: { applicant: ApplicantRow }) {
  const expYears = parseInt(applicant.experience) || 3;
  const initials2 = applicant.currentCompany
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

  const prevExpYears = Math.max(1, Math.round(expYears * 0.4));

  return (
    <>
      {/* Profile header */}
      <div className="px-7 pt-6 pb-6 border-b border-gray-100 bg-gradient-to-br from-white to-[#F7F9FC]">
        <div className="flex items-start gap-5">
          <div className="relative flex-shrink-0">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-md"
              style={{ backgroundColor: applicant.avatarColor }}
            >
              <span className="text-white text-xl font-black">{applicant.initials}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-white" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h3 className="text-[20px] font-bold text-[#1A1A2E] leading-tight">{applicant.name}</h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-[13.5px] font-semibold text-[#127EE3]">{applicant.currentCompany}</span>
                  <span className="text-gray-300 text-[11px]">·</span>
                  <span className="px-2 py-0.5 bg-blue-50 border border-blue-100 rounded-full text-[10.5px] font-bold text-blue-600">{applicant.experience}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[12.5px] text-gray-500 mb-3">
              <span className="flex items-center gap-1.5 text-[#1A1A2E] font-medium">
                <Phone className="w-3.5 h-3.5 text-[#0DC2FF]" />
                {applicant.name.split(" ")[0].toLowerCase()}-direct@gmail.com
              </span>
              <span className="flex items-center gap-1.5 text-[#1A1A2E] font-medium">
                <Mail className="w-3.5 h-3.5 text-[#0DC2FF]" />
                {applicant.name.replace(/\s+/g, ".").toLowerCase()}@gmail.com
              </span>
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gray-300" />{applicant.location}</span>
              <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5 text-gray-300" />{applicant.education}</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white border border-gray-200 shadow-sm">
                <span className="text-[10px] font-bold text-gray-400 uppercase">ปัจจุบัน</span>
                <span className="text-[12.5px] font-bold text-[#1A1A2E]">{applicant.salaryExpect}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#01BFF9]/10 to-[#019EFC]/10 border border-[#0DC2FF]/20">
                <span className="text-[10px] font-bold text-[#127EE3] uppercase">คาดหวัง</span>
                <span className="text-[12.5px] font-bold text-[#127EE3]">{applicant.salaryExpect}</span>
                <span className="text-[10px] text-[#127EE3]/70">บาท/เดือน</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CollapsibleSection title="My Lifestyle in Action" icon={<Star className="w-4 h-4 text-amber-400" />}>
        <div className="grid grid-cols-4 gap-2 mt-1">
          {[
            { label: "Design projects", bg: "from-blue-100 to-blue-200" },
            { label: "Conference & events", bg: "from-emerald-100 to-emerald-200" },
            { label: "Side projects", bg: "from-amber-100 to-amber-200" },
            { label: "Hobbies", bg: "from-rose-100 to-rose-200" },
          ].map((item, i) => (
            <div key={i} className={`aspect-square rounded-xl bg-gradient-to-br ${item.bg} flex items-end p-2.5`}>
              <span className="text-[10px] font-medium text-gray-600 leading-tight">{item.label}</span>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="What Drives Me" icon={<Star className="w-4 h-4 text-[#0DC2FF]" />} defaultOpen>
        <ul className="space-y-2 mb-3 mt-1">
          {applicant.strengths.slice(0, 2).map((s, i) => (
            <li key={i} className="flex gap-2.5 text-[13.5px] text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0DC2FF] flex-shrink-0 mt-[7px]" />
              {s}
            </li>
          ))}
        </ul>
        <p className="text-[13px] text-gray-600 leading-[1.7] bg-gray-50 rounded-xl p-4">{applicant.aiSummary}</p>
      </CollapsibleSection>

      <CollapsibleSection title="Experience" icon={<Briefcase className="w-4 h-4 text-gray-400" />} defaultOpen>
        <div className="space-y-5 mt-1">
          <div className="flex gap-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-[9px] font-black text-white"
              style={{ backgroundColor: applicant.avatarColor }}
            >
              {initials2}
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-bold text-[#1A1A2E]">{applicant.currentTitle}</p>
              <p className="text-[12.5px] text-[#127EE3] font-semibold mt-0.5">{applicant.currentCompany}</p>
              <p className="text-[11.5px] text-gray-400 mt-1">Full Time · {expYears} ปี · {applicant.salaryExpect}/เดือน</p>
              <div className="mt-3 space-y-1.5">
                <p className="flex gap-2 text-[12.5px] text-gray-700"><span className="w-1 h-1 rounded-full bg-gray-400 flex-shrink-0 mt-[7px]" />ออกแบบ UX/UI end-to-end ตั้งแต่ discovery ถึง delivery ร่วมกับ PM และ Engineering</p>
                <p className="flex gap-2 text-[12.5px] text-gray-700"><span className="w-1 h-1 rounded-full bg-gray-400 flex-shrink-0 mt-[7px]" />ดูแลและพัฒนา design system รวมกว่า 80+ components</p>
                <p className="flex gap-2 text-[12.5px] text-gray-700"><span className="w-1 h-1 rounded-full bg-gray-400 flex-shrink-0 mt-[7px]" />วาง user research framework ลด design rework ลง 30%</p>
              </div>
            </div>
          </div>

          {expYears >= 3 && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 text-[9px] font-black text-amber-600">PRV</div>
              <div className="flex-1">
                <p className="text-[14px] font-bold text-[#1A1A2E]">UX / Product Designer</p>
                <p className="text-[12.5px] text-[#127EE3] font-semibold mt-0.5">บริษัทก่อนหน้า</p>
                <p className="text-[11.5px] text-gray-400 mt-1">Full Time · {prevExpYears} ปี</p>
                <div className="mt-2.5 space-y-1.5">
                  <p className="flex gap-2 text-[12.5px] text-gray-700"><span className="w-1 h-1 rounded-full bg-gray-400 flex-shrink-0 mt-[7px]" />ออกแบบ user flows และ wireframes สำหรับ mobile app</p>
                  <p className="flex gap-2 text-[12.5px] text-gray-700"><span className="w-1 h-1 rounded-full bg-gray-400 flex-shrink-0 mt-[7px]" />ทำ A/B test ร่วมกับ data team วัดผล conversion</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-5">
          <p className="text-[12.5px] font-bold text-[#1A1A2E] mb-2.5">My Career in Action</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Design Conference", bg: "from-sky-100 to-sky-200" },
              { label: "Workshop & Meetup", bg: "from-teal-100 to-teal-200" },
            ].map((item, i) => (
              <div key={i} className={`h-24 rounded-xl bg-gradient-to-br ${item.bg} flex items-end p-3`}>
                <span className="text-[11px] font-medium text-gray-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Education" icon={<GraduationCap className="w-4 h-4 text-gray-400" />} defaultOpen>
        <div className="flex gap-4 mt-1">
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0 text-[10px] font-black text-rose-500">EDU</div>
          <div>
            <p className="text-[14px] font-bold text-[#1A1A2E]">{applicant.education.split(" ").slice(-2).join(" ")}</p>
            <p className="text-[12.5px] text-gray-600 mt-0.5">{applicant.education}</p>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Skills and Languages" icon={<Star className="w-4 h-4 text-gray-400" />} defaultOpen>
        <div className="space-y-4 mt-1">
          <div>
            <p className="text-[12.5px] font-bold text-[#1A1A2E] mb-2 flex items-center gap-2"><Dumbbell className="w-3.5 h-3.5 text-gray-400" />My Skills</p>
            <p className="text-[13.5px] text-gray-700">{applicant.skills.join(", ")}</p>
          </div>
          <div>
            <p className="text-[12.5px] font-bold text-[#1A1A2E] mb-2 flex items-center gap-2"><Music className="w-3.5 h-3.5 text-gray-400" />Music I Love</p>
            <p className="text-[13.5px] text-gray-700">Indie · Lo-Fi · Jazz · Electronic · Acoustic</p>
          </div>
          <div>
            <p className="text-[12.5px] font-bold text-[#1A1A2E] mb-2 flex items-center gap-2"><Languages className="w-3.5 h-3.5 text-gray-400" />Languages</p>
            <div className="space-y-2.5">
              <div><p className="text-[14px] font-semibold text-[#1A1A2E]">ภาษาไทย</p><p className="text-[12px] text-gray-400 mt-0.5">Native</p></div>
              <div>
                <p className="text-[14px] font-semibold text-[#1A1A2E]">English</p>
                <p className="text-[13px] text-gray-600 mt-0.5">Listening: Advanced · Speaking: Upper-Intermediate · Reading: Advanced</p>
                <p className="text-[13px] text-[#0DC2FF] font-semibold mt-1">TOEIC: 800+</p>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleSection>
      <div className="h-6" />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Tab: AI วิเคราะห์                                                    */
/* ------------------------------------------------------------------ */
function AIAnalysisContent({ applicant }: { applicant: ApplicantRow }) {
  const expYears = parseInt(applicant.experience) || 3;
  const firstName = applicant.name.split(" ")[0];

  return (
    <div>
      {/* Header — dark navy gradient matching ResumePanel */}
      <div className="px-7 pt-6 pb-5 bg-gradient-to-br from-[#0B1D3A] to-[#1a3560] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[#127EE3]/10 -translate-y-12 translate-x-12 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-[#0DC2FF]/10 translate-y-8 -translate-x-8 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-xl bg-[#127EE3]/25 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-[#0DC2FF]" />
            </div>
            <span className="text-[11px] font-bold text-[#0DC2FF] uppercase tracking-widest">AI ANALYSIS</span>
          </div>
          <h4 className="text-[20px] font-black text-white">{applicant.name}</h4>
          <p className="text-[13px] text-white/50 mt-0.5 mb-3">{applicant.currentTitle} · {applicant.currentCompany} · {applicant.experience}</p>
          <p className="text-[13.5px] text-white/80 leading-[1.75]">{applicant.aiSummary}</p>
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* เส้นทางอาชีพ */}
      <div className="px-7 py-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3.5 h-3.5 rounded-full bg-gray-200 flex-shrink-0" />
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">เส้นทางอาชีพ</span>
        </div>
        <div className="space-y-3">
          {[
            { text: `เริ่มสาย ${applicant.currentTitle.split(" ").slice(-1)[0]} — เติบโตเป็น ${applicant.currentTitle} ใน ${expYears} ปี`, ok: true },
            { text: "ทำงานต่อเนื่องทันทีหลังเรียนจบ ไม่มีช่วงว่างที่ผิดปกติ", ok: true },
            { text: "เงินเดือนโตสะท้อนความรับผิดชอบที่เพิ่มขึ้น — ไม่ใช่แค่อายุงาน", ok: expYears >= 3 },
            { text: expYears >= 5 ? `${expYears} ปี — ระดับที่วางแผนเชิงกลยุทธ์ได้` : `${expYears} ปี — mid-level ที่ยังมี room to grow`, ok: true },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${item.ok ? "text-emerald-500" : "text-amber-400"}`} />
              <p className="text-[13.5px] text-gray-700 leading-snug">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* WHY THIS CANDIDATE STANDS OUT */}
      <div className="px-7 py-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3.5 h-3.5 rounded-full bg-gray-200 flex-shrink-0" />
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">WHY THIS CANDIDATE STANDS OUT</span>
        </div>
        <div className="space-y-5">
          {[
            {
              headline: applicant.strengths[0] ?? "ประสบการณ์ตรงกับตำแหน่ง",
              detail: `ผ่านงานที่ต้องรับผิดชอบจริงในระดับ ${applicant.currentTitle} มาแล้ว ไม่ใช่แค่ support — เป็นคนที่ถือ ownership ของงานตั้งแต่ต้นจนส่งมอบ`,
            },
            {
              headline: applicant.strengths[1] ?? "ทักษะครอบคลุมหลาย dimension",
              detail: `Skills ที่มีไม่ได้แคบแค่ด้านเดียว — ${applicant.skills.slice(0, 3).join(", ")} และอื่นๆ ทำให้ทำงานข้ามทีมได้โดยไม่ต้องอาศัยคนกลางมาก`,
            },
            {
              headline: applicant.strengths[2] ?? "การเติบโตสะท้อนความรับผิดชอบ",
              detail: `ใน ${applicant.experience} ที่ผ่านมา ได้รับงานที่หนักขึ้นในทุกบทบาท — บ่งบอกว่าคนรอบข้างและองค์กรเดิม trust เพียงพอที่จะ delegate งานสำคัญให้`,
            },
            ...(applicant.strengths[3] ? [{
              headline: applicant.strengths[3],
              detail: `จากพื้นฐานการศึกษา ${applicant.education.split(" ").slice(0, 4).join(" ")} ประกอบกับประสบการณ์จริง ทำให้มีทั้งความเข้าใจเชิงทฤษฎีและการลงมือทำที่สมดุล`,
            }] : []),
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[13.5px] font-bold text-[#1A1A2E] leading-snug">{item.headline}</p>
                <p className="text-[13px] text-gray-500 mt-1 leading-relaxed">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
        {applicant.concerns.length > 0 && (
          <div className="mt-5 space-y-3">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">ข้อควรระวัง</p>
            {applicant.concerns.map((c, i) => (
              <div key={i} className="flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-[13.5px] text-gray-700 leading-snug">{c}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-gray-100" />

      {/* ตัวตน */}
      <div className="px-7 py-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3.5 h-3.5 rounded-full bg-gray-200 flex-shrink-0" />
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">ตัวตน</span>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">จากจุดแข็ง</p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#127EE3]/10 mb-3">
              <Zap className="w-3 h-3 text-[#127EE3]" />
              <span className="text-[11px] font-black text-[#127EE3] tracking-wide">The Strategic Executor</span>
            </div>
            <p className="text-[13px] font-bold text-[#1A1A2E] mb-4 leading-snug">"{firstName}คือคนที่ทำงานได้กว้าง รับผิดชอบสูง และมีภาวะผู้นำที่ไม่ต้องรอให้คนอื่นชี้ทาง"</p>
            <div className="space-y-2.5">
              {[
                { label: "CAREER GROWTH", icon: <TrendingUp className="w-3.5 h-3.5 text-[#127EE3]" />, value: "เติบโตทุก role — ไม่หยุดนิ่ง" },
                { label: "WORK ORIENTATION", icon: <Target className="w-3.5 h-3.5 text-emerald-500" />, value: "มุ่งผลลัพธ์ ไม่ใช่แค่ทำให้เสร็จ" },
                { label: "RELIABILITY", icon: <Shield className="w-3.5 h-3.5 text-gray-400" />, value: "รับผิดชอบสูง — trust ได้ระยะยาว" },
                { label: "WORK STYLE", icon: <Zap className="w-3.5 h-3.5 text-amber-500" />, value: "วางแผนก่อนลงมือ ไม่ยิงสะเปะสะปะ" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-lg bg-white flex items-center justify-center flex-shrink-0 border border-gray-100 mt-0.5">{item.icon}</div>
                  <div>
                    <span className="text-[9.5px] font-bold text-gray-400 uppercase tracking-wide">{item.label} </span>
                    <span className="text-[11.5px] text-gray-600">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">จาก HOBBIES & LIFE</p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100 mb-3">
              <Star className="w-3 h-3 text-emerald-500" />
              <span className="text-[11px] font-black text-emerald-600 tracking-wide">The Deliberate Creator</span>
            </div>
            <p className="text-[13px] font-bold text-[#1A1A2E] mb-4 leading-snug">"ข้างในมีทั้งความอดทนและความสุขในการทำอะไรช้าๆ อย่างตั้งใจ — ไม่ใช่แค่คนขับเคลื่อนด้วยความเร็ว"</p>
            <div className="space-y-3">
              {[
                { label: "กิจกรรมที่ต้องอดทน", insight: "ทำงานได้นานในสถานการณ์ที่ผลลัพธ์ยังไม่ชัด — ไม่หมดแรงเมื่อความสำเร็จช้า" },
                { label: "กิจกรรมที่ต้องละเอียด", insight: "ในชีวิตส่วนตัวก็ให้ความสำคัญกับทุกรายละเอียด — เหมือนในที่ทำงาน" },
                { label: "กิจกรรมทีม / สังคม", insight: "เคยคุ้นกับพลวัตของกลุ่ม รู้ว่าต้องอ่านคนและจังหวะให้ถูก" },
              ].map((item, i) => (
                <div key={i} className="border-l-2 border-gray-200 pl-3">
                  <p className="text-[11px] font-bold text-[#1A1A2E] leading-tight">{item.label}</p>
                  <p className="text-[11.5px] text-gray-600 mt-0.5 leading-relaxed">{item.insight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-2xl px-5 py-5 border border-gray-100">
          <p className="text-[11px] text-gray-400 mb-3">เมื่อผสานกัน — {firstName}เป็นคนแบบไหน</p>
          <p className="text-[15px] font-bold text-[#1A1A2E] leading-[1.75]">
            คนที่ <span className="font-black">ขับเคลื่อนได้แรงเมื่อจำเป็น</span> แต่ยัง<span className="font-black">อดทนรอได้เมื่อสถานการณ์ต้องการ</span> — ไม่ใช่คนที่ทำงานหนักเพื่อพิสูจน์ตัวเอง แต่ทำเพราะอยากเห็นผลลัพธ์ที่ดีจริงๆ
          </p>
          <p className="text-[13px] text-gray-500 mt-2">ให้งานที่มีทั้งความท้าทายเชิงกลยุทธ์และการลงมือทำจริง — จะได้เห็น{firstName}ในเวอร์ชันที่ดีที่สุด</p>
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* BEHAVIORAL SIGNALS */}
      <div className="px-7 py-5">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3.5 h-3.5 rounded-full bg-gray-200 flex-shrink-0" />
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">BEHAVIORAL SIGNALS</span>
        </div>
        <p className="text-[12.5px] text-gray-400 mb-5">วิเคราะห์เชิงลึกจาก AI — อ้างอิงจากประสบการณ์ทำงาน, จุดแข็ง, สไตล์การทำงาน และกิจกรรมในชีวิต</p>
        <div className="space-y-5">
          {[
            { title: "วิธีทำงานร่วมกับผู้อื่น", desc: `${firstName}เข้าร่วมทีมเพื่อผลักดันความคืบหน้า ไม่ใช่รับบทบาทตั้งรับ — แบ่งงานชัด คาดหวังให้ทุกคนรับผิดชอบในส่วนของตัวเอง`, note: "มิตรในแบบที่ช่วยให้งานเดิน ทำงานดีที่สุดกับเพื่อนร่วมทีมที่มีความสามารถ ตอบสนองไว และบริหารตัวเองได้" },
            { title: "วิธีสื่อสารและสร้างสรรค์", desc: "สื่อสารตรงไปตรงมา ใช้งานได้จริง — สร้างงานโดยมีผลลัพธ์ปลายทางอยู่ในใจ ไม่ใช่เพื่อแสดงออก", note: "เปลี่ยนไอเดียที่ยังหลวมให้กลายเป็นชิ้นงานและการติดตามผลได้จริง โดยไม่ต้องรอทีมผู้เชี่ยวชาญขนาดใหญ่" },
            { title: "วิธีขับเคลื่อนผลลัพธ์", desc: "ต้องการเห็นความคืบหน้าที่จับต้องได้ ทำงานในแบบที่เชื่อมกิจกรรมเข้ากับผลลัพธ์ธุรกิจโดยตรง", note: "อาจหมดพลังในบทบาทที่ความพยายามทั้งหมดจมหายไปกับกระบวนการโดยไม่มีผลลัพธ์ที่มองเห็นได้ชัด" },
            { title: "วิธีรับมือกับอำนาจและโครงสร้าง", desc: "เคารพอำนาจเมื่ออำนาจนั้นมีความสามารถและประโยชน์จริง — ต้องการเป้าหมายชัดเจนและพื้นที่ให้ลงมือทำ", note: "ภาพตัวตนที่ผูกกับภาวะผู้นำบ่งบอกว่าต้องการเติบโตสู่การมีอำนาจตัดสินใจ บทบาทที่แบนเกินไปอาจรั้งไว้ได้ไม่นาน" },
            { title: "วิธีเรียนรู้และเติบโต", desc: "เรียนรู้ได้ดีที่สุดผ่านการลงมือเจอสถานการณ์จริง ไม่รอจนกว่าจะรู้สึกว่าพร้อมเต็มที่ — สร้างความสามารถจากงานจริง", note: "รูปแบบการพัฒนาเอนเอียงไปทางประสบการณ์มากกว่าระบบ อาจต้องการแรงสนับสนุนด้าน documentation และ analytics ในองค์กรขนาดใหญ่" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#127EE3] flex-shrink-0 mt-1.5" />
              <div>
                <p className="text-[13.5px] font-bold text-[#1A1A2E] leading-snug">{item.title}</p>
                <p className="text-[13.5px] text-gray-700 mt-0.5 leading-relaxed">{item.desc}</p>
                <p className="text-[13px] text-gray-400 italic mt-1">{item.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* สรุปสำหรับ HR */}
      <div className="px-7 py-5">
        <p className="text-[13px] font-bold text-gray-400 mb-3">สรุปสำหรับ HR</p>
        <p className="text-[16px] font-bold text-[#1A1A2E] leading-[1.75]">
          {firstName}คือคนที่ <span className="font-black">"ลงมือได้กว้าง ทำได้จริง และไม่หยุดจนกว่างานจะเสร็จ"</span> — เอาใส่ role ที่ต้องการคนเชื่อมการวางแผนกับการลงมือทำ จะได้เห็นของจริง
        </p>
      </div>

      <div className="border-t border-gray-100" />

      {/* คำถามสัมภาษณ์ */}
      <div className="px-7 py-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3.5 h-3.5 rounded-full bg-gray-200 flex-shrink-0" />
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">คำถามสัมภาษณ์ (AI แนะนำ)</span>
        </div>
        <div className="space-y-3">
          {[
            { category: "Experience", q: "เล่าให้ฟังถึงโปรเจกต์ที่คุณรับผิดชอบเองตั้งแต่ต้นจนจบ วัดผลสำเร็จอย่างไร" },
            { category: "Collaboration", q: "คุณทำงานร่วมกับทีมอื่นอย่างไรเมื่อ priority ขัดแย้งกัน" },
            { category: "Ownership", q: "เคยมีครั้งไหนที่งานที่ทำ launch แล้วผลไม่เป็นไปตามที่คาด ทำอย่างไรต่อ" },
            { category: "Growth", q: "ช่วง 6 เดือนที่ผ่านมาคุณเรียนรู้หรือพัฒนาทักษะอะไรที่สำคัญบ้าง" },
            { category: "Ambition", q: "ใน 2–3 ปีข้างหน้า คุณอยากเติบโตไปในทิศทางไหน" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-[10px] font-bold text-[#127EE3] bg-[#127EE3]/10 px-2.5 py-1 rounded-lg flex-shrink-0 mt-0.5 whitespace-nowrap min-w-[120px] text-center">{item.category}</span>
              <p className="text-[13px] text-gray-600 leading-relaxed">{item.q}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mx-7 mb-6 mt-2 bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4">
        <p className="text-[13px] font-bold text-amber-800 mb-2">เกี่ยวกับการวิเคราะห์ด้วย AI</p>
        <p className="text-[12.5px] text-amber-700/80 leading-[1.7] mb-2">การวิเคราะห์นี้มองเห็น <strong>potential</strong> และจุดแข็งเป็นหลัก — เราตั้งใจไม่ตัดสินในเชิงลบ เพราะเชื่อว่าแต่ละคนมีคุณค่าในบริบทที่เหมาะสม</p>
        <p className="text-[12.5px] text-amber-700/80 leading-[1.7] mb-2">ก่อนตัดสินใจ ให้ดูเรซูเม่จริงประกอบ พิจารณาความเหมาะสมกับตำแหน่งและช่วงเงินเดือนด้วยตัวเอง</p>
        <p className="text-[12.5px] text-amber-700/80 leading-[1.7]">AI อาจมีความคลาดเคลื่อนได้ โปรดใช้วิจารณญาณของคุณในการตัดสินใจเสมอ</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tab: เอกสาร                                                           */
/* ------------------------------------------------------------------ */
interface AttachedFile {
  id: string; name: string; size: string;
  type: "pdf" | "doc" | "img" | "other";
  uploadedBy: string; uploadedAt: string; isCandidate?: boolean;
}

function fileIcon(type: AttachedFile["type"]) {
  const base = "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0";
  if (type === "pdf") return <div className={`${base} bg-red-50`}><FileText className="w-4 h-4 text-red-500" /></div>;
  if (type === "doc") return <div className={`${base} bg-blue-50`}><FileText className="w-4 h-4 text-blue-500" /></div>;
  return <div className={`${base} bg-gray-100`}><Paperclip className="w-4 h-4 text-gray-500" /></div>;
}

function DocsContent({ applicant }: { applicant: ApplicantRow }) {
  const INITIAL_FILES: AttachedFile[] = [
    { id: "f1", name: `Resume_${applicant.name.replace(/\s/g, "-")}_2025.pdf`, size: "1.2 MB", type: "pdf", uploadedBy: "ผู้สมัคร", uploadedAt: "15 เม.ย. 2568", isCandidate: true },
    { id: "f2", name: `Portfolio_${applicant.name.split(" ")[0]}_Design.pdf`, size: "8.4 MB", type: "pdf", uploadedBy: "ผู้สมัคร", uploadedAt: "15 เม.ย. 2568", isCandidate: true },
  ];

  const [files, setFiles] = useState<AttachedFile[]>(INITIAL_FILES);
  const [previewFile, setPreviewFile] = useState<AttachedFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const addFiles = (newFiles: File[]) => {
    const added: AttachedFile[] = newFiles.map((f) => ({
      id: `f${Date.now()}-${Math.random()}`, name: f.name,
      size: f.size > 1024 * 1024 ? `${(f.size / 1024 / 1024).toFixed(1)} MB` : `${(f.size / 1024).toFixed(0)} KB`,
      type: f.name.endsWith(".pdf") ? "pdf" : f.name.match(/\.(doc|docx)$/) ? "doc" : f.name.match(/\.(png|jpg|jpeg)$/) ? "img" : "other",
      uploadedBy: "HR Team", uploadedAt: "เพิ่งอัปโหลด",
    }));
    setFiles((prev) => [...added, ...prev]);
  };

  return (
    <div className="px-7 py-6 space-y-5">
      {previewFile && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm" onClick={() => setPreviewFile(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">{fileIcon(previewFile.type)}<span className="text-[14px] font-semibold text-[#1A1A2E] truncate max-w-[340px]">{previewFile.name}</span></div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-[12.5px] text-gray-600 hover:bg-gray-50 transition-colors"><Download className="w-3.5 h-3.5" />ดาวน์โหลด</button>
                <button onClick={() => setPreviewFile(null)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"><X className="w-4 h-4 text-gray-500" /></button>
              </div>
            </div>
            <div className="h-[480px] bg-gray-50 flex flex-col items-center justify-center gap-3">
              {fileIcon(previewFile.type)}
              <p className="text-[14px] font-semibold text-gray-600">{previewFile.name}</p>
              <p className="text-[12.5px] text-gray-400">{previewFile.size}</p>
              <p className="text-[12px] text-gray-400 mt-2">Preview ไม่พร้อมใช้งานในโหมด Demo</p>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#127EE3] text-white text-[13px] font-semibold hover:bg-[#0f6bc7] transition-colors mt-1">
                <ExternalLink className="w-3.5 h-3.5" />เปิดในแท็บใหม่
              </button>
            </div>
          </div>
        </div>
      )}

      {files[0] && (
        <div>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">ล่าสุด</p>
          <button onClick={() => setPreviewFile(files[0])}
            className="w-full flex items-center gap-4 p-4 rounded-2xl border border-[#127EE3]/20 bg-[#127EE3]/[0.03] hover:bg-[#127EE3]/[0.06] transition-all group text-left">
            {fileIcon(files[0].type)}
            <div className="flex-1 min-w-0">
              <p className="text-[13.5px] font-semibold text-[#127EE3] truncate group-hover:underline">{files[0].name}</p>
              <p className="text-[11.5px] text-gray-400 mt-0.5">{files[0].size} · {files[0].uploadedBy} · {files[0].uploadedAt}</p>
            </div>
            <ExternalLink className="w-4 h-4 text-[#127EE3]/50 group-hover:text-[#127EE3] flex-shrink-0 transition-colors" />
          </button>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">ไฟล์ทั้งหมด ({files.length})</p>
          <div>
            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => { if (e.target.files) addFiles(Array.from(e.target.files)); }} />
            <button onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-[12px] font-semibold text-gray-500 hover:border-[#127EE3]/40 hover:text-[#127EE3] transition-colors">
              <Upload className="w-3.5 h-3.5" />อัปโหลด
            </button>
          </div>
        </div>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(Array.from(e.dataTransfer.files)); }}
          className={`space-y-2 rounded-2xl transition-all ${dragging ? "ring-2 ring-[#127EE3]/30 ring-offset-2 bg-[#127EE3]/[0.02]" : ""}`}>
          {files.map((f) => (
            <div key={f.id} className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 bg-white hover:border-gray-200 transition-all group">
              {fileIcon(f.type)}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-[#1A1A2E] truncate">{f.name}</p>
                <p className="text-[11.5px] text-gray-400 mt-0.5">
                  {f.size} · {f.isCandidate ? <span className="text-emerald-600 font-medium">จากผู้สมัคร</span> : <span className="text-[#127EE3] font-medium">{f.uploadedBy}</span>} · {f.uploadedAt}
                </p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setPreviewFile(f)} className="w-7 h-7 rounded-lg hover:bg-[#127EE3]/10 flex items-center justify-center text-gray-400 hover:text-[#127EE3] transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                <button className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"><Download className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
          {dragging && <div className="flex items-center justify-center py-6 rounded-xl border-2 border-dashed border-[#127EE3]/40 text-[13px] text-[#127EE3] font-medium">วางไฟล์ที่นี่</div>}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
        <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0"><Search className="w-4 h-4 text-gray-500" /></div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-[#1A1A2E]">ค้นหาข้อมูลเพิ่มเติมของผู้สมัคร</p>
          <p className="text-[11.5px] text-gray-400 mt-0.5">เช็ค LinkedIn, Instagram, Behance, ผลงาน หรือ personal site บน Google</p>
        </div>
        <button
          onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(`${applicant.name} ${applicant.currentTitle} site:linkedin.com OR site:behance.net OR site:dribbble.com`)}`, "_blank")}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#127EE3]/30 text-[#127EE3] text-[12.5px] font-semibold hover:bg-[#127EE3]/5 transition-colors flex-shrink-0">
          <Globe className="w-3.5 h-3.5" />ค้นหาเลย
        </button>
      </div>

      <div className="h-2" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Activity helpers                                                      */
/* ------------------------------------------------------------------ */
interface ActivityItem {
  id: string; actor: string; actorInitials: string; actorColor: string;
  type: "stage" | "note" | "file" | "reveal" | "email" | "chat";
  text: string; detail?: string; time: string;
  emailSubject?: string; emailBody?: string; emailTo?: string;
}

interface ActivityStore {
  activities: ActivityItem[];
  addActivity: (a: ActivityItem) => void;
}

function activityIcon(type: ActivityItem["type"]) {
  if (type === "stage") return <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0"><CheckCircle2 className="w-3 h-3 text-blue-500" /></div>;
  if (type === "note") return <div className="w-6 h-6 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0"><FileText className="w-3 h-3 text-amber-500" /></div>;
  if (type === "file") return <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0"><Paperclip className="w-3 h-3 text-gray-500" /></div>;
  if (type === "reveal") return <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0"><Eye className="w-3 h-3 text-emerald-500" /></div>;
  if (type === "email") return <div className="w-6 h-6 rounded-full bg-[#127EE3]/10 border border-[#127EE3]/20 flex items-center justify-center flex-shrink-0"><Mail className="w-3 h-3 text-[#127EE3]" /></div>;
  if (type === "chat") return <div className="w-6 h-6 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center flex-shrink-0"><MessageCircle className="w-3 h-3 text-sky-500" /></div>;
  return <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0"><MoreHorizontal className="w-3 h-3 text-gray-400" /></div>;
}

/* ------------------------------------------------------------------ */
/* Tab: โน้ต                                                             */
/* ------------------------------------------------------------------ */
function NotesContent({ applicant, store }: { applicant: ApplicantRow; store: ActivityStore }) {
  const INITIAL_NOTES: ActivityItem[] = [
    { id: "n1", actor: "วิชัย Manager", actorInitials: "วช", actorColor: "bg-emerald-500", type: "note", text: "เพิ่มโน้ต", detail: "Portfolio ดีมาก น่าสนใจมาก เหมาะกับ product ใหม่ที่กำลังเปิดรับ ลองนัดคุยก่อนเลย", time: "วันนี้ 11:20" },
    { id: "n2", actor: "สมศรี HR", actorInitials: "สร", actorColor: "bg-[#127EE3]", type: "note", text: "เพิ่มโน้ต", detail: "ติดต่อแล้ว สะดวกสัมภาษณ์ช่วงต้นเดือนหน้า ตอบเร็วมาก ดูสนใจงานนี้จริงๆ", time: "วันนี้ 09:55" },
  ];

  const [note, setNote] = useState(applicant.note ?? "");
  const [attachFile, setAttachFile] = useState<File | null>(null);
  const [notes, setNotes] = useState<ActivityItem[]>(INITIAL_NOTES);
  const [showActivity, setShowActivity] = useState(false);
  const [expandedEmail, setExpandedEmail] = useState<string | null>(null);
  const noteFileRef = useRef<HTMLInputElement>(null);

  const handleSaveNote = () => {
    if (!note.trim() && !attachFile) return;
    const newNote: ActivityItem = {
      id: `n${Date.now()}`, actor: "สมศรี HR", actorInitials: "สร", actorColor: "bg-[#127EE3]",
      type: "note", text: "เพิ่มโน้ต",
      detail: note.trim() || (attachFile ? `แนบไฟล์: ${attachFile.name}` : ""),
      time: "เพิ่งเมื่อกี้",
    };
    setNotes((prev) => [newNote, ...prev]);
    store.addActivity(newNote);
    setNote("");
    setAttachFile(null);
  };

  const allActivities = store.activities;
  const emailActivities = allActivities.filter((a) => a.type === "email");

  return (
    <div className="px-7 py-6 space-y-5">
      <div>
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Key Notes</p>
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden focus-within:border-[#0DC2FF] transition-colors">
          <textarea value={note} onChange={(e) => setNote(e.target.value)}
            placeholder="บันทึกความเห็น, คะแนนหลังสัมภาษณ์, หรือ note เพิ่มเติม..."
            rows={3}
            className="w-full px-4 py-3 text-[13px] focus:outline-none resize-none placeholder:text-gray-400" />
          <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100 bg-gray-50/70">
            <div className="flex items-center gap-2">
              <input ref={noteFileRef} type="file" className="hidden" onChange={(e) => e.target.files && setAttachFile(e.target.files[0])} />
              <button onClick={() => noteFileRef.current?.click()}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] text-gray-500 hover:bg-white hover:text-[#127EE3] transition-colors border border-transparent hover:border-gray-200">
                <Paperclip className="w-3.5 h-3.5" />
                {attachFile ? <span className="text-[#127EE3] font-medium max-w-[120px] truncate">{attachFile.name}</span> : "แนบไฟล์"}
              </button>
              {attachFile && <button onClick={() => setAttachFile(null)} className="text-gray-300 hover:text-red-400 transition-colors"><X className="w-3 h-3" /></button>}
            </div>
            <button onClick={handleSaveNote} disabled={!note.trim() && !attachFile}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#127EE3] text-white text-[12.5px] font-semibold hover:bg-[#0f6bc7] transition-colors disabled:opacity-40">
              <Plus className="w-3.5 h-3.5" />บันทึก
            </button>
          </div>
        </div>
      </div>

      {notes.length > 0 && (
        <div className="space-y-2.5">
          {notes.map((n) => (
            <div key={n.id} className="rounded-2xl border border-gray-100 bg-white p-4 hover:border-gray-200 transition-colors">
              <div className="flex items-center gap-2.5 mb-2">
                <div className={`w-7 h-7 rounded-full ${n.actorColor} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-[9px] font-black text-white">{n.actorInitials}</span>
                </div>
                <span className="text-[13px] font-semibold text-[#1A1A2E]">{n.actor}</span>
                <span className="ml-auto text-[11px] text-gray-400 flex items-center gap-1 flex-shrink-0"><Clock className="w-3 h-3" />{n.time}</span>
              </div>
              {n.detail && <p className="text-[13px] text-gray-600 leading-relaxed pl-[38px]">{n.detail}</p>}
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-gray-100 pt-4">
        <button onClick={() => setShowActivity(!showActivity)}
          className="flex items-center gap-2 text-[11px] font-semibold text-gray-400 uppercase tracking-widest hover:text-gray-500 transition-colors w-full text-left mb-1">
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showActivity ? "rotate-180" : ""}`} />
          Activity ({allActivities.length}{emailActivities.length > 0 ? ` · ${emailActivities.length} อีเมล` : ""})
        </button>
        {showActivity && (
          <div className="mt-3 space-y-0">
            {allActivities.map((act, i) => (
              <div key={act.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  {activityIcon(act.type)}
                  {i < allActivities.length - 1 && <div className="w-px flex-1 bg-gray-100 min-h-[14px] my-0.5" />}
                </div>
                <div className="pb-3 flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <div className={`w-4 h-4 rounded-full ${act.actorColor} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-[7px] font-black text-white">{act.actorInitials}</span>
                    </div>
                    <span className="text-[12px] font-semibold text-gray-500">{act.actor}</span>
                    <span className="text-[12px] text-gray-400">{act.type === "email" ? `ส่งอีเมล "${act.emailSubject}"` : act.text}</span>
                    <span className="ml-auto text-[11px] text-gray-300 flex items-center gap-1 flex-shrink-0"><Clock className="w-3 h-3" />{act.time}</span>
                  </div>
                  {act.type === "email" && act.emailBody && (
                    <div className="mt-1 ml-5">
                      <button onClick={() => setExpandedEmail(expandedEmail === act.id ? null : act.id)}
                        className="text-[11.5px] text-[#127EE3] hover:underline flex items-center gap-1">
                        {expandedEmail === act.id ? "ซ่อนเนื้อหา" : "ดูเนื้อหาอีเมล"}
                        <ChevronDown className={`w-3 h-3 transition-transform ${expandedEmail === act.id ? "rotate-180" : ""}`} />
                      </button>
                      {expandedEmail === act.id && (
                        <div className="mt-1.5 bg-gray-50 rounded-xl px-3.5 py-3 border border-gray-100">
                          <p className="text-[12px] text-gray-500 mb-1">ถึง: {act.emailTo}</p>
                          <p className="text-[12.5px] text-gray-600 leading-relaxed whitespace-pre-wrap">{act.emailBody}</p>
                        </div>
                      )}
                    </div>
                  )}
                  {act.type !== "email" && act.detail && (
                    <div className="mt-1 ml-5 px-2.5 py-1.5 rounded-lg bg-gray-50">
                      <p className="text-[11.5px] text-gray-400 leading-relaxed">{act.detail}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 pt-4">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Super Chat</p>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-sky-50 border border-sky-100">
          <MessageCircle className="w-4 h-4 text-sky-500 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[12.5px] font-semibold text-sky-800">เคยคุยกันแล้ว 3 ข้อความ</p>
            <p className="text-[11.5px] text-sky-600 mt-0.5">ล่าสุด: "สนใจตำแหน่งนี้ รอฟังข่าวอยู่ครับ" · 25 เม.ย.</p>
          </div>
          <button className="text-[12px] font-semibold text-sky-600 hover:text-sky-800 transition-colors flex-shrink-0 whitespace-nowrap">ดูแชท →</button>
        </div>
      </div>

      <div className="h-2" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tab: จัดการ                                                           */
/* ------------------------------------------------------------------ */
const EMAIL_TEMPLATES_MANAGE = [
  { key: "interview", label: "นัดสัมภาษณ์", subject: "นัดสัมภาษณ์ตำแหน่งงาน", body: `สวัสดีครับ/ค่ะ,\n\nทางเราสนใจโปรไฟล์ของคุณและอยากนัดสัมภาษณ์เบื้องต้น\n\nกรุณาแจ้งวันและเวลาที่สะดวกให้ทราบด้วยนะครับ\n\nขอบคุณครับ/ค่ะ` },
  { key: "docs", label: "ขอเอกสารเพิ่มเติม", subject: "ขอเอกสารประกอบการสมัครงาน", body: `สวัสดีครับ/ค่ะ,\n\nขอบคุณสำหรับการสมัครงาน ทางเราขอเอกสารเพิ่มเติมดังนี้\n- Portfolio ล่าสุด (ถ้ามี)\n- Transcript\n\nกรุณาส่งกลับมาภายใน 3 วันทำการครับ\n\nขอบคุณครับ/ค่ะ` },
  { key: "offer", label: "แจ้งผลสัมภาษณ์", subject: "ผลการสัมภาษณ์", body: `สวัสดีครับ/ค่ะ,\n\nทางเรายินดีแจ้งว่าคุณผ่านการสัมภาษณ์แล้ว\n\nทางเราจะติดต่อกลับเพื่อแจ้งรายละเอียด Offer ในเร็วๆ นี้ครับ\n\nขอบคุณครับ/ค่ะ` },
  { key: "reject", label: "แจ้งผลไม่ผ่าน", subject: "ผลการพิจารณาใบสมัครงาน", body: `สวัสดีครับ/ค่ะ,\n\nขอบคุณสำหรับความสนใจ ทางเราได้พิจารณาโปรไฟล์อย่างละเอียดแล้ว แต่ขณะนี้ได้ตัดสินใจเดินหน้ากับผู้สมัครท่านอื่น\n\nหวังว่าจะมีโอกาสร่วมงานกันในอนาคตครับ/ค่ะ` },
];

function timelineIconAdp(type: ActivityItem["type"], text: string) {
  const isHired = text.includes("รับเข้าทำงาน");
  const isPassed = text.includes("ผ่านสัมภาษณ์");
  const isRejected = text.includes("ไม่ผ่าน") || text.includes("ยกเลิก");
  const isInterview = text.includes("สัมภาษณ์") || text.includes("นัด");
  const isOffer = text.includes("Offer");

  if (type === "chat") return <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white shadow-sm flex items-center justify-center flex-shrink-0"><FileText className="w-3.5 h-3.5 text-gray-500" /></div>;
  if (type === "reveal") return <div className="w-8 h-8 rounded-full bg-sky-50 border-2 border-white shadow-sm flex items-center justify-center flex-shrink-0"><Eye className="w-3.5 h-3.5 text-sky-500" /></div>;
  if (type === "email") return <div className="w-8 h-8 rounded-full bg-blue-50 border-2 border-white shadow-sm flex items-center justify-center flex-shrink-0"><Mail className="w-3.5 h-3.5 text-blue-500" /></div>;
  if (type === "note") return <div className="w-8 h-8 rounded-full bg-amber-50 border-2 border-white shadow-sm flex items-center justify-center flex-shrink-0"><MessageCircle className="w-3.5 h-3.5 text-amber-500" /></div>;
  if (type === "file") return <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white shadow-sm flex items-center justify-center flex-shrink-0"><Paperclip className="w-3.5 h-3.5 text-gray-500" /></div>;
  if (type === "stage") {
    if (isHired) return <div className="w-8 h-8 rounded-full bg-emerald-50 border-2 border-white shadow-sm flex items-center justify-center flex-shrink-0"><Award className="w-3.5 h-3.5 text-emerald-500" /></div>;
    if (isPassed) return <div className="w-8 h-8 rounded-full bg-emerald-50 border-2 border-white shadow-sm flex items-center justify-center flex-shrink-0"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /></div>;
    if (isRejected) return <div className="w-8 h-8 rounded-full bg-red-50 border-2 border-white shadow-sm flex items-center justify-center flex-shrink-0"><ThumbsDown className="w-3.5 h-3.5 text-red-400" /></div>;
    if (isInterview) return <div className="w-8 h-8 rounded-full bg-orange-50 border-2 border-white shadow-sm flex items-center justify-center flex-shrink-0"><Calendar className="w-3.5 h-3.5 text-orange-400" /></div>;
    if (isOffer) return <div className="w-8 h-8 rounded-full bg-sky-50 border-2 border-white shadow-sm flex items-center justify-center flex-shrink-0"><FileText className="w-3.5 h-3.5 text-sky-500" /></div>;
    return <div className="w-8 h-8 rounded-full bg-blue-50 border-2 border-white shadow-sm flex items-center justify-center flex-shrink-0"><CheckCircle2 className="w-3.5 h-3.5 text-[#127EE3]" /></div>;
  }
  return <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white shadow-sm flex items-center justify-center flex-shrink-0"><MoreHorizontal className="w-3.5 h-3.5 text-gray-400" /></div>;
}

function TimelineContent({ store, applicant }: { store: ActivityStore; applicant: ApplicantRow }) {
  const mockBase: ActivityItem[] = [
    { id: "tlb3", actor: "สมศรี HR", actorInitials: "สร", actorColor: "bg-[#127EE3]", type: "stage", text: "ย้ายสถานะเป็น ชอร์ตลิสต์", time: "วันนี้ 09:43" },
    { id: "tlb2", actor: "สมศรี HR", actorInitials: "สร", actorColor: "bg-[#127EE3]", type: "reveal", text: "เปิดดูเรซูเม่", detail: "เปิดดูข้อมูลการติดต่อและเรซูเม่เต็ม", time: "วันนี้ 09:42" },
    { id: "tlb1", actor: "ระบบ", actorInitials: "ระ", actorColor: "bg-gray-400", type: "chat", text: "ผู้สมัครส่งใบสมัคร", detail: `ตำแหน่ง ${applicant.currentTitle} — ${applicant.location}`, time: "25 เม.ย. 2568" },
  ];
  const allItems = [...store.activities, ...mockBase];
  return (
    <div className="px-7 py-6">
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-5">ประวัติทั้งหมด ({allItems.length} รายการ)</p>
      <div className="relative">
        <div className="absolute left-[15px] top-4 bottom-4 w-px bg-gray-200" />
        <div className="space-y-0">
          {allItems.map((item, i) => (
            <div key={item.id} className="relative flex gap-4 pb-5 last:pb-0">
              <div className="relative z-10">{timelineIconAdp(item.type, item.text)}</div>
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[13px] font-semibold text-[#1A1A2E] leading-snug">{item.text}</p>
                  <span className="text-[11px] text-gray-400 whitespace-nowrap flex-shrink-0 mt-0.5">{item.time}</span>
                </div>
                {item.detail && <p className="text-[12px] text-gray-500 mt-0.5 leading-relaxed">{item.detail}</p>}
                {item.emailTo && !item.detail && <p className="text-[12px] text-gray-400 mt-0.5">ถึง: {item.emailTo}</p>}
                <p className="text-[11.5px] text-gray-400 mt-1">โดย {item.actor}</p>
                {i < allItems.length - 1 && <div className="mt-4 border-t border-gray-50" />}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="h-4" />
    </div>
  );
}

function ActionBtn({ icon, label, primary, destructive, onClick }: {
  icon: ReactNode; label: string;
  primary?: boolean; destructive?: boolean;
  onClick?: () => void;
}) {
  const base = "flex flex-col items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl border text-[11.5px] font-medium transition-all text-center leading-tight";
  const variant = destructive
    ? "border-red-200 text-red-500 bg-white hover:bg-red-50"
    : primary
    ? "border-[#3B82F6] text-[#3B82F6] bg-blue-50/40 hover:bg-blue-50"
    : "border-gray-200 text-gray-500 bg-white hover:border-gray-300 hover:text-gray-700";
  return (
    <button onClick={onClick} className={`${base} ${variant}`}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

function ManageContent({
  applicant,
  localStage,
  onSetStage,
  store,
}: {
  applicant: ApplicantRow;
  localStage: PipelineStage;
  onSetStage: (s: PipelineStage) => void;
  store: ActivityStore;
}) {
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [stageDropdownOpen, setStageDropdownOpen] = useState(false);
  const [prevStage, setPrevStage] = useState<PipelineStage | null>(null);
  const [callLogs, setCallLogs] = useState<{ id: number; label: string }[]>([]);
  const [undoEntry, setUndoEntry] = useState<{ id: number; label: string; index: number } | null>(null);
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // single active action panel
  type ActiveAction = "refer" | "schedule" | "reschedule" | "result" | "offer" | "hire" | "emailCompose" | null;
  const [activeAction, setActiveAction] = useState<ActiveAction>(null);
  const [scheduleReady, setScheduleReady] = useState(false);
  type ScheduledInfo = { date: Date; time: string; duration: number; type: string; emailSent: boolean; interviewers: InterviewerContact[] };
  const [scheduledInfo, setScheduledInfo] = useState<ScheduledInfo | null>(null);
  // result panel state
  const [interviewResult, setInterviewResult] = useState<"passed" | "rejected" | "wait_compare" | "">("") ;
  const [resultInterviewers, setResultInterviewers] = useState<InterviewerContact[]>([]);
  const [resultComments, setResultComments] = useState("");
  const [resultAttachments, setResultAttachments] = useState<File[]>([]);
  const [resultInterviewerDropdownOpen, setResultInterviewerDropdownOpen] = useState(false);
  const [resultInterviewerQuery, setResultInterviewerQuery] = useState("");
  type SavedResult = { outcome: "passed" | "rejected" | "wait_compare"; interviewers: InterviewerContact[]; comments: string; attachmentNames: string[]; savedAt: string };
  const [savedResult, setSavedResult] = useState<SavedResult | null>(null);
  const [hiredNote, setHiredNote] = useState("");
  const [hiredNoteDraft, setHiredNoteDraft] = useState("");
  const [hiredNoteEditing, setHiredNoteEditing] = useState(false);
  // refer panel state
  const [referEmailTo, setReferEmailTo] = useState("");
  const _defaultReferTpl = emailTemplates.find((t) => t.name === "ส่งเรซูเม่ให้ผู้พิจารณา");
  const [referTemplateId, setReferTemplateId] = useState<number | "">(_defaultReferTpl?.id ?? "");
  const [referEmailSubject, setReferEmailSubject] = useState(_defaultReferTpl?.subject ?? "");
  const [referEmailBody, setReferEmailBody] = useState(_defaultReferTpl?.body ?? "");
  // email compose (re-send) state
  const [referQuery, setReferQuery] = useState("");
  const [referContacts, setReferContacts] = useState<{ id: string; name: string; title: string; email: string; department: string; initials: string; color: string }[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [emailTo, setEmailTo] = useState(`${applicant.name.replace(/\s+/g, ".").toLowerCase()}@gmail.com`);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [showReferPreview, setShowReferPreview] = useState(false);
  type ReviewStatus = "รอพิจารณา" | "สนใจเรียกสัมภาษณ์" | "ไม่สนใจเรียกสัมภาษณ์";
  type AvailabilitySlot = { date: string; time: string };
  type ReviewerEntry = {
    id: string; name: string; email: string; department: string; sentAt: string;
    status: ReviewStatus; respondedAt?: string; note?: string;
    availabilitySlots?: AvailabilitySlot[];
  };
  const [reviewers, setReviewers] = useState<ReviewerEntry[]>([]);
  // record-result modal state
  const [recordingId, setRecordingId] = useState<string | null>(null);
  const [recordIsEdit, setRecordIsEdit] = useState(false);
  const [recordStatus, setRecordStatus] = useState<"สนใจเรียกสัมภาษณ์" | "ไม่สนใจเรียกสัมภาษณ์" | "">("");
  const [recordNote, setRecordNote] = useState("");
  const [recordSlots, setRecordSlots] = useState<AvailabilitySlot[]>([{ date: "", time: "" }, { date: "", time: "" }, { date: "", time: "" }]);

  const openRecordModal = (id: string, prefill?: ReviewerEntry) => {
    setRecordingId(id);
    setRecordIsEdit(!!prefill);
    setRecordStatus(prefill && prefill.status !== "รอพิจารณา" ? prefill.status : "");
    setRecordNote(prefill?.note ?? "");
    const slots: AvailabilitySlot[] = [{ date: "", time: "" }, { date: "", time: "" }, { date: "", time: "" }];
    if (prefill?.availabilitySlots) {
      prefill.availabilitySlots.forEach((s, i) => { if (i < 3) slots[i] = s; });
    }
    setRecordSlots(slots);
  };

  const handleRecordSave = () => {
    if (!recordStatus || !recordingId) return;
    const now = new Date();
    const respondedAt = `${now.getDate()} ${["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."][now.getMonth()]} ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
    const filledSlots = recordSlots.filter((s) => s.date.trim() || s.time.trim());
    setReviewers((prev) => prev.map((r) => r.id === recordingId ? {
      ...r, status: recordStatus, respondedAt,
      note: recordNote.trim() || undefined,
      availabilitySlots: recordStatus === "สนใจเรียกสัมภาษณ์" && filledSlots.length > 0 ? filledSlots : undefined,
    } : r));
    const reviewer = reviewers.find((r) => r.id === recordingId);
    store.addActivity({
      id: `a${Date.now()}`, actor: "สมศรี HR", actorInitials: "สร", actorColor: "bg-[#127EE3]",
      type: "note",
      text: recordIsEdit ? `แก้ไขผลการพิจารณาจาก ${reviewer?.name ?? ""}` : `ระบุผลการพิจารณาจาก ${reviewer?.name ?? ""}`,
      detail: recordStatus, time: "เพิ่งเมื่อกี้",
    });
    setRecordingId(null);
    setAlertMsg(recordIsEdit ? "แก้ไขผลการพิจารณาเรียบร้อยแล้ว" : "บันทึกผลการพิจารณาเรียบร้อยแล้ว");
  };

  useEffect(() => {
    if (!alertMsg) return;
    const t = setTimeout(() => setAlertMsg(null), 3000);
    return () => clearTimeout(t);
  }, [alertMsg]);

  const [rejectionReason, setRejectionReason] = useState<string | null>(null);

  const completeStageChange = (s: PipelineStage, msg?: string, skipUndo?: boolean) => {
    if (!skipUndo) setPrevStage(localStage);
    onSetStage(s);
    setActiveAction(null);
    setStageDropdownOpen(false);
    if (s !== "interview") setScheduledInfo(null);
    const found = getStageConfig(s);
    store.addActivity({
      id: `a${Date.now()}`, actor: "สมศรี HR", actorInitials: "สร", actorColor: "bg-[#127EE3]",
      type: "stage", text: `เปลี่ยนสถานะเป็น ${found.label}`, time: "เพิ่งเมื่อกี้",
    });
    setAlertMsg(msg ?? `__stage__เปลี่ยนสถานะเป็น ${found.label} แล้ว`);
  };

  const handleUndo = () => {
    if (!prevStage) return;
    const restored = prevStage;
    setPrevStage(null);
    completeStageChange(restored, `ย้อนกลับสถานะเป็น ${getStageConfig(restored).label} แล้ว`, true);
  };

  const completeTerminalAction = (reason: string) => {
    setRejectionReason(reason);
    onSetStage("rejected");
    setActiveAction(null);
    setScheduledInfo(null);
    store.addActivity({
      id: `a${Date.now()}`, actor: "สมศรี HR", actorInitials: "สร", actorColor: "bg-[#127EE3]",
      type: "stage", text: `ย้ายไป ไม่ผ่าน / ยกเลิก — ${reason}`, time: "เพิ่งเมื่อกี้",
    });
    setAlertMsg(`บันทึกแล้ว: ${reason}`);
  };

  const showSubAlert = (msg: string) => setAlertMsg(msg);

  const applyTemplate = (key: string) => {
    const t = EMAIL_TEMPLATES_MANAGE.find((t) => t.key === key);
    if (!t) return;
    setSelectedTemplate(key);
    setEmailSubject(t.subject);
    setEmailBody(t.body);
  };

  const handleSendEmail = () => {
    if (!emailSubject.trim() || !emailBody.trim()) return;
    store.addActivity({
      id: `a${Date.now()}`, actor: "สมศรี HR", actorInitials: "สร", actorColor: "bg-[#127EE3]",
      type: "email", text: "ส่งอีเมล", emailSubject, emailBody, emailTo, time: "เพิ่งเมื่อกี้",
    });
    setEmailSubject(""); setEmailBody(""); setSelectedTemplate(null); setActiveAction(null);
  };

  const handleReferSend = () => {
    if (referContacts.length === 0) return;
    const names = referContacts.map((c) => c.name).join(", ");
    const emails = referContacts.map((c) => c.email).join(", ");
    store.addActivity({
      id: `a${Date.now()}`, actor: "สมศรี HR", actorInitials: "สร", actorColor: "bg-[#127EE3]",
      type: "email", text: `ส่งต่อให้พิจารณาไปยัง ${names}`, emailSubject: referEmailSubject, emailBody: referEmailBody, emailTo: emails, time: "เพิ่งเมื่อกี้",
    });
    const now = new Date();
    const sentAt = `${now.getDate()} ${["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."][now.getMonth()]} ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
    setReviewers((prev) => {
      const existingEmails = new Set(prev.map((r) => r.email));
      const newEntries: ReviewerEntry[] = referContacts
        .filter((c) => !existingEmails.has(c.email))
        .map((c) => ({ id: `r${Date.now()}-${c.id}`, name: c.name, email: c.email, department: c.department ?? "–", sentAt, status: "รอพิจารณา" }));
      return [...prev, ...newEntries];
    });
    setActiveAction(null);
    setReferContacts([]);
    setReferQuery("");
    if (localStage === "review") {
      setAlertMsg("ส่งต่อให้พิจารณาเรียบร้อยแล้ว");
    } else {
      completeStageChange("review");
    }
  };

  const handleScheduleConfirm = (date: Date, time: string, duration: number, type: string, emailSent: boolean, interviewers: InterviewerContact[]) => {
    const isNextRound = localStage === "passed";
    setScheduledInfo({ date, time, duration, type, emailSent, interviewers });
    setActiveAction(null);
    if (isNextRound) {
      store.addActivity({
        id: `a${Date.now()}`, actor: "สมศรี HR", actorInitials: "สร", actorColor: "bg-[#127EE3]",
        type: "note", text: `นัดสัมภาษณ์รอบถัดไป ${toThaiDate(date)} · ${time} น.`, time: "เพิ่งเมื่อกี้",
      });
      completeStageChange("interview", "นัดสัมภาษณ์รอบถัดไปเรียบร้อยแล้ว");
    } else {
      completeStageChange("interview");
    }
  };

  const handleRescheduleConfirm = (date: Date, time: string, duration: number, type: string, emailSent: boolean, interviewers: InterviewerContact[]) => {
    setScheduledInfo({ date, time, duration, type, emailSent, interviewers });
    setActiveAction(null);
    store.addActivity({
      id: `a${Date.now()}`, actor: "สมศรี HR", actorInitials: "สร", actorColor: "bg-[#127EE3]",
      type: "note", text: `เปลี่ยนวันนัดสัมภาษณ์เป็น ${toThaiDate(date)} · ${time} น.`, time: "เพิ่งเมื่อกี้",
    });
    setAlertMsg("เปลี่ยนวันนัดสัมภาษณ์เรียบร้อยแล้ว");
  };

  const handleResultSave = () => {
    if (!interviewResult) return;
    const now = new Date();
    const savedAt = `${now.getDate()} ${["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."][now.getMonth()]} ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
    setSavedResult({
      outcome: interviewResult,
      interviewers: resultInterviewers,
      comments: resultComments,
      attachmentNames: resultAttachments.map((f) => f.name),
      savedAt,
    });
    setActiveAction(null);
    if (interviewResult === "rejected") {
      setRejectionReason("ไม่ผ่านสัมภาษณ์");
    }
    const outcome = interviewResult;
    setInterviewResult("");
    setResultComments("");
    setResultAttachments([]);
    setResultInterviewerDropdownOpen(false);
    if (outcome !== "wait_compare") {
      completeStageChange(outcome);
    } else {
      setAlertMsg("บันทึกสถานะรอเปรียบเทียบแล้ว");
    }
  };

  const handleOpenResult = (presetOutcome?: "passed" | "rejected" | "wait_compare") => {
    setResultInterviewers(savedResult?.interviewers ?? scheduledInfo?.interviewers ?? []);
    setResultComments(savedResult?.comments ?? "");
    setResultAttachments([]);
    setInterviewResult(presetOutcome ?? savedResult?.outcome ?? "");
    setResultInterviewerDropdownOpen(false);
    setResultInterviewerQuery("");
    setActiveAction("result");
  };

  const handleOfferConfirm = () => {
    setActiveAction(null);
    completeStageChange("offer");
  };

  const handleHireConfirm = () => {
    setActiveAction(null);
    completeStageChange("hired");
  };

  return (
    <div className="px-7 py-6 space-y-6">
      {/* Current status */}
      <div>
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">สถานะปัจจุบัน</p>
        {(() => {
          const cfg = getStageConfig(localStage);
          return (
            <div className="space-y-1.5">
              <div className="relative inline-block">
                <button
                  onClick={() => setStageDropdownOpen((o) => !o)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-[13px] font-semibold cursor-pointer transition-opacity hover:opacity-80 ${cfg.bg} ${cfg.color} border-current/20`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                  {cfg.label}
                  <ChevronDown className="w-3.5 h-3.5 flex-shrink-0 opacity-60" />
                </button>
                {stageDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setStageDropdownOpen(false)} />
                    <div className="absolute left-0 top-full mt-1 z-20 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden min-w-[188px]">
                      {PIPELINE_STAGES.map((s) => (
                        <button key={s.key} onClick={() => completeStageChange(s.key)}
                          className={`w-full text-left flex items-center gap-2 px-3.5 py-2.5 text-[12.5px] font-medium transition-colors ${localStage === s.key ? `${s.bg} ${s.color}` : "text-gray-700 hover:bg-gray-50"}`}>
                          {localStage === s.key
                            ? <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                            : <span className="w-3 h-3 flex-shrink-0" />}
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              {localStage === "rejected" && rejectionReason && (
                <p className="text-[12px] text-gray-500">เหตุผล: {rejectionReason}</p>
              )}
            </div>
          );
        })()}
      </div>

      {/* Toast / Alert banner */}
      {alertMsg && !alertMsg.startsWith("__stage__") && alertMsg !== "__undo__" && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-white border border-gray-200 shadow-sm text-[12.5px]">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-500" />
          <span className="text-gray-700">{alertMsg}</span>
        </div>
      )}
      {alertMsg && alertMsg.startsWith("__stage__") && (
        <div className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-white border border-gray-200 shadow-sm text-[12.5px]">
          <div className="flex items-center gap-2 text-gray-700">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-500" />
            <span>{alertMsg.replace("__stage__", "")}</span>
          </div>
          {prevStage && (
            <button onClick={handleUndo} className="shrink-0 text-[12px] font-semibold text-[#127EE3] hover:underline transition-colors">
              ย้อนกลับ
            </button>
          )}
        </div>
      )}

      {/* Reviewer status panel — review stage only */}
      {localStage === "review" && (
        <div>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">สถานะการพิจารณา</p>
          {reviewers.length === 0 ? (
              <div className="rounded-xl border border-gray-200 px-4 py-5 text-[12.5px] text-gray-400 text-center bg-white">ยังไม่มีการส่งต่อให้ผู้พิจารณา</div>
            ) : (
              <div className="space-y-3">
                {reviewers.map((r) => {
                  const badge =
                    r.status === "สนใจเรียกสัมภาษณ์"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : r.status === "ไม่สนใจเรียกสัมภาษณ์"
                      ? "bg-red-50 text-red-600 border-red-200"
                      : "bg-amber-50 text-amber-700 border-amber-200";
                  const isRecording = recordingId === r.id;
                  return (
                    <div key={r.id} className="bg-white rounded-xl border border-gray-200 px-4 py-3.5 space-y-2.5">
                      {/* Name + badge */}
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[13.5px] font-semibold text-[#1A1A2E] truncate">{r.name}</p>
                        <span className={`shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badge}`}>{r.status}</span>
                      </div>
                      {/* Meta: email · dept · ส่งเมื่อ · ตอบเมื่อ */}
                      <p className="text-[11.5px] text-gray-400 leading-relaxed flex flex-wrap items-center gap-x-1.5 gap-y-0">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        <span>{r.email}</span>
                        <span className="text-gray-300">·</span>
                        <span>{r.department}</span>
                        <span className="text-gray-300">·</span>
                        <span>ส่งเมื่อ <span className="text-gray-500 font-medium">{r.sentAt}</span></span>
                        {r.respondedAt && <>
                          <span className="text-gray-300">·</span>
                          <span>ตอบเมื่อ <span className="text-gray-500 font-medium">{r.respondedAt}</span></span>
                        </>}
                      </p>
                      {/* Note */}
                      {r.note && (
                        <p className="text-[12px] text-gray-600 bg-gray-50 rounded-lg px-3 py-2 leading-relaxed border border-gray-100">"{r.note}"</p>
                      )}
                      {/* Availability chips */}
                      {r.status === "สนใจเรียกสัมภาษณ์" && r.availabilitySlots && r.availabilitySlots.length > 0 && (
                        <div className="space-y-1.5">
                          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">ช่วงเวลาที่สะดวก</p>
                          <div className="flex flex-wrap gap-1.5">
                            {r.availabilitySlots.map((s, i) => (
                              <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-gray-200 text-[11.5px] font-medium text-gray-600">
                                <Clock className="w-3 h-3 flex-shrink-0 text-gray-400" />{s.date} {s.time}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* Action buttons */}
                      {!isRecording && (
                        <div className="flex flex-wrap gap-2">
                          {r.status === "รอพิจารณา" ? (
                            <>
                              <button onClick={() => openRecordModal(r.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#00ADEF] text-[#00ADEF] text-[11.5px] font-semibold hover:bg-sky-50 transition-colors">
                                <FileText className="w-3.5 h-3.5" />ระบุผล
                              </button>
                              <button onClick={() => {
                                store.addActivity({ id: `a${Date.now()}`, actor: "สมศรี HR", actorInitials: "สร", actorColor: "bg-[#127EE3]", type: "email", text: `ส่งอีเมลเตือนผู้พิจารณา ${r.name}`, time: "เพิ่งเมื่อกี้" });
                                setAlertMsg("ส่งอีเมลเตือนเรียบร้อยแล้ว");
                              }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 text-[11.5px] font-medium hover:bg-gray-50 transition-colors">
                                <Send className="w-3.5 h-3.5" />ส่งอีเมลเตือนอีกครั้ง
                              </button>
                              <button onClick={() => {
                                navigator.clipboard.writeText(`https://superrecruit.example.com/review/${applicant.id}/${r.id}`);
                                setAlertMsg("คัดลอกลิงก์พิจารณาเรียบร้อยแล้ว");
                              }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 text-[11.5px] font-medium hover:bg-gray-50 transition-colors">
                                <Copy className="w-3.5 h-3.5" />คัดลอกลิงก์พิจารณา
                              </button>
                            </>
                          ) : (
                            <button onClick={() => openRecordModal(r.id, r)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 text-[11.5px] font-semibold hover:bg-gray-50 transition-colors">
                              <FileText className="w-3.5 h-3.5" />แก้ไขผล
                            </button>
                          )}
                        </div>
                      )}
                      {/* Inline record modal */}
                      {isRecording && (
                        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden mt-1">
                          <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                            <p className="text-[12.5px] font-bold text-[#1A1A2E]">{recordIsEdit ? "แก้ไขผลการพิจารณา" : "ระบุผลการพิจารณา"} — {r.name}</p>
                          </div>
                          <div className="px-4 py-3 space-y-3">
                            {/* Status select */}
                            <div>
                              <p className="text-[11.5px] font-semibold text-gray-500 mb-1.5">ผลการพิจารณา</p>
                              <div className="flex gap-2">
                                {(["สนใจเรียกสัมภาษณ์", "ไม่สนใจเรียกสัมภาษณ์"] as const).map((s) => (
                                  <button key={s} onClick={() => setRecordStatus(s)}
                                    className={`flex-1 py-2 rounded-xl border text-[12px] font-semibold transition-all ${recordStatus === s
                                      ? s === "สนใจเรียกสัมภาษณ์" ? "bg-emerald-50 border-emerald-400 text-emerald-700" : "bg-red-50 border-red-400 text-red-600"
                                      : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                                    {s}
                                  </button>
                                ))}
                              </div>
                            </div>
                            {/* Availability slots — shown only when interested */}
                            {recordStatus === "สนใจเรียกสัมภาษณ์" && (
                              <div className="space-y-2">
                                <p className="text-[11.5px] font-semibold text-gray-500">ช่วงเวลาที่สะดวกนัดสัมภาษณ์</p>
                                {recordSlots.map((slot, i) => (
                                  <div key={i} className="flex gap-2 items-center">
                                    <span className="text-[11px] text-gray-400 w-4 shrink-0">{i + 1}.</span>
                                    <input type="date" value={slot.date}
                                      onChange={(e) => setRecordSlots((prev) => prev.map((s, idx) => idx === i ? { ...s, date: e.target.value } : s))}
                                      className="flex-1 px-2.5 py-1.5 text-[12px] bg-[#F0F2F5] rounded-lg border border-transparent focus:outline-none focus:border-[#0DC2FF] focus:bg-white transition-all" />
                                    <input type="time" value={slot.time}
                                      onChange={(e) => setRecordSlots((prev) => prev.map((s, idx) => idx === i ? { ...s, time: e.target.value } : s))}
                                      className="w-24 px-2.5 py-1.5 text-[12px] bg-[#F0F2F5] rounded-lg border border-transparent focus:outline-none focus:border-[#0DC2FF] focus:bg-white transition-all" />
                                  </div>
                                ))}
                              </div>
                            )}
                            {/* Note */}
                            <div>
                              <p className="text-[11.5px] font-semibold text-gray-500 mb-1.5">หมายเหตุ <span className="font-normal text-gray-400">(ไม่บังคับ)</span></p>
                              <textarea value={recordNote} onChange={(e) => setRecordNote(e.target.value)} rows={2}
                                placeholder="บันทึกข้อความเพิ่มเติม..."
                                className="w-full px-3 py-2 text-[12px] bg-[#F0F2F5] rounded-xl border border-transparent focus:outline-none focus:border-[#0DC2FF] focus:bg-white transition-all placeholder:text-gray-400 resize-none" />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 px-4 py-2.5 bg-gray-50 border-t border-gray-100">
                            <button onClick={() => setRecordingId(null)}
                              className="px-3.5 py-1.5 rounded-lg border border-gray-200 text-[12px] text-gray-500 hover:bg-gray-100 transition-colors">ยกเลิก</button>
                            <button onClick={handleRecordSave} disabled={!recordStatus}
                              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#127EE3] text-white text-[12px] font-bold hover:bg-[#0f6bc7] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                              <CheckCircle2 className="w-3.5 h-3.5" />บันทึก
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
        </div>
      )}

      {/* Supporting info for to_interview stage */}
      {localStage === "to_interview" && (
        <div className="space-y-3 mt-1">
          {reviewers.some((r) => r.status === "สนใจเรียกสัมภาษณ์" && r.availabilitySlots && r.availabilitySlots.length > 0) && (
            <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 space-y-2">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">ช่วงเวลาที่ผู้พิจารณาสะดวก</p>
              {reviewers.filter((r) => r.status === "สนใจเรียกสัมภาษณ์" && r.availabilitySlots && r.availabilitySlots.length > 0).map((r) => (
                <div key={r.id} className="space-y-1.5">
                  <p className="text-[11.5px] font-medium text-gray-500">{r.name}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {r.availabilitySlots!.map((s, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-gray-200 text-[11.5px] font-medium text-gray-600">
                        <Clock className="w-3 h-3 flex-shrink-0 text-gray-400" />{s.date} {s.time}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">ติดต่อผู้สมัคร</p>
            <p className="text-[13px] font-semibold text-[#1A1A2E] mb-2">{applicant.name}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1.5 text-[12.5px] text-gray-700 font-medium">
                <Phone className="w-3.5 h-3.5 text-[#0DC2FF]" />เบอร์โทร: 081-234-5678
              </span>
              <button onClick={() => { navigator.clipboard.writeText("081-234-5678"); setAlertMsg("คัดลอกเบอร์โทรเรียบร้อยแล้ว"); }}
                className="flex items-center gap-1 px-2 py-0.5 rounded-md border border-gray-200 text-[11px] text-gray-400 hover:bg-gray-50 transition-colors">
                <Copy className="w-3 h-3" />คัดลอก
              </button>
              <button onClick={() => {
                const now = new Date();
                const label = `${now.toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })} ${now.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })}`;
                setCallLogs((prev) => [{ id: now.getTime(), label }, ...prev]);
                store.addActivity({
                  id: `a${Date.now()}`, actor: "สมศรี HR", actorInitials: "สร", actorColor: "bg-[#127EE3]",
                  type: "note", text: "ติดต่อผู้สมัครไม่ได้ (ไม่รับสาย)", time: "เพิ่งเมื่อกี้",
                });
                setAlertMsg("บันทึกแล้ว");
              }} className="flex items-center gap-1 px-2 py-0.5 rounded-md border border-red-200 text-[11px] text-red-400 hover:bg-red-50 transition-colors">
                <PhoneOff className="w-3 h-3" />ไม่รับสาย
              </button>
            </div>
            {callLogs.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-[10.5px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">ประวัติการติดต่อ</p>
                <ul className="space-y-1">
                  {callLogs.map((entry, i) => (
                    <li key={entry.id} className="flex items-center gap-1.5 text-[11.5px] text-gray-400">
                      <PhoneOff className="w-3 h-3 flex-shrink-0 text-red-300" />
                      <span>โทรเมื่อ {entry.label} — <span className="text-red-400">ไม่รับสาย</span> · <button
                        onClick={() => {
                          if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
                          setUndoEntry({ ...entry, index: i });
                          setCallLogs((prev) => prev.filter((e) => e.id !== entry.id));
                          setAlertMsg("__undo__");
                          undoTimerRef.current = setTimeout(() => {
                            setUndoEntry(null);
                            setAlertMsg(null);
                          }, 3000);
                        }}
                        className="text-[10.5px] text-gray-400 hover:text-red-500 transition-colors underline-offset-2 hover:underline"
                      >ลบ</button></span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {undoEntry && alertMsg === "__undo__" && (
              <div className="mt-2 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-gray-200 shadow-sm text-[11.5px]">
                <span className="flex-1 text-gray-600">ลบแล้ว</span>
                <button
                  onClick={() => {
                    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
                    setCallLogs((prev) => {
                      const next = [...prev];
                      next.splice(undoEntry.index, 0, { id: undoEntry.id, label: undoEntry.label });
                      return next;
                    });
                    setUndoEntry(null);
                    setAlertMsg(null);
                  }}
                  className="font-semibold text-[#127EE3] hover:underline transition-colors"
                >Undo</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div>
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Actions</p>

        {/* ใหม่ */}
        {localStage === "new" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            <ActionBtn primary onClick={() => completeStageChange("shortlist")} icon={<ThumbsUp className="w-3.5 h-3.5 flex-shrink-0" />} label="ชอร์ตลิสต์" />
            <ActionBtn onClick={() => setActiveAction("refer")} icon={<Users className="w-3.5 h-3.5 flex-shrink-0" />} label="ส่งต่อให้พิจารณา" />
            <ActionBtn onClick={() => setActiveAction("schedule")} icon={<Calendar className="w-3.5 h-3.5 flex-shrink-0" />} label="ลงตารางนัดสัมภาษณ์" />
            <ActionBtn destructive onClick={() => completeStageChange("rejected")} icon={<ThumbsDown className="w-3.5 h-3.5 flex-shrink-0" />} label="ไม่ผ่าน" />
          </div>
        )}

        {/* ชอร์ตลิสต์ */}
        {localStage === "shortlist" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            <ActionBtn primary onClick={() => setActiveAction("refer")} icon={<Users className="w-3.5 h-3.5 flex-shrink-0" />} label="ส่งต่อให้พิจารณา" />
            <ActionBtn primary onClick={() => completeStageChange("to_interview")} icon={<Calendar className="w-3.5 h-3.5 flex-shrink-0" />} label="ย้ายไปลิสต์ต้องนัดสัมภาษณ์" />
            <ActionBtn primary onClick={() => setActiveAction("schedule")} icon={<Calendar className="w-3.5 h-3.5 flex-shrink-0" />} label="ลงตารางนัดสัมภาษณ์" />
            <ActionBtn onClick={() => setActiveAction("hire")} icon={<Award className="w-3.5 h-3.5 flex-shrink-0" />} label="รับเข้าทำงาน" />
            <ActionBtn destructive onClick={() => completeStageChange("rejected")} icon={<ThumbsDown className="w-3.5 h-3.5 flex-shrink-0" />} label="ไม่ผ่าน" />
          </div>
        )}

        {/* ส่งต่อให้พิจารณา */}
        {localStage === "review" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            <ActionBtn primary onClick={() => setActiveAction("refer")} icon={<Users className="w-3.5 h-3.5 flex-shrink-0" />} label="ส่งต่อให้พิจารณา" />
            <ActionBtn primary onClick={() => setActiveAction("schedule")} icon={<Calendar className="w-3.5 h-3.5 flex-shrink-0" />} label="ลงตารางนัดสัมภาษณ์" />
            <ActionBtn primary onClick={() => completeStageChange("to_interview")} icon={<Calendar className="w-3.5 h-3.5 flex-shrink-0" />} label="ย้ายไปลิสต์ต้องนัดสัมภาษณ์" />
            <ActionBtn onClick={() => setActiveAction("hire")} icon={<Award className="w-3.5 h-3.5 flex-shrink-0" />} label="รับเข้าทำงาน" />
            <ActionBtn destructive onClick={() => completeStageChange("rejected")} icon={<ThumbsDown className="w-3.5 h-3.5 flex-shrink-0" />} label="ไม่ผ่าน" />
          </div>
        )}

        {/* ลิสต์ต้องนัดสัมภาษณ์ */}
        {localStage === "to_interview" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            <ActionBtn primary onClick={() => setActiveAction("schedule")} icon={<Calendar className="w-3.5 h-3.5 flex-shrink-0" />} label="ลงตารางนัดสัมภาษณ์" />
            <ActionBtn destructive onClick={() => completeTerminalAction("ผู้สมัครปฏิเสธนัด")} icon={<Ban className="w-3.5 h-3.5 flex-shrink-0" />} label="ผู้สมัครปฏิเสธนัด" />
            <ActionBtn destructive onClick={() => completeStageChange("rejected")} icon={<ThumbsDown className="w-3.5 h-3.5 flex-shrink-0" />} label="ไม่ผ่าน" />
          </div>
        )}

        {/* สัมภาษณ์ */}
        {localStage === "interview" && (
          <div className="space-y-3">
            {scheduledInfo && (() => {
              const [hh, mm] = scheduledInfo.time.split(":").map(Number);
              const total = hh * 60 + mm + scheduledInfo.duration;
              const endTime = `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
              const googleStart = new Date(scheduledInfo.date);
              googleStart.setHours(hh, mm, 0, 0);
              const googleEnd = new Date(googleStart.getTime() + scheduledInfo.duration * 60000);
              const fmtCal = (d: Date) => d.toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
              const title = encodeURIComponent(`สัมภาษณ์ — ${applicant.name}`);
              const details = encodeURIComponent(`สัมภาษณ์ตำแหน่ง ${applicant.currentTitle}\nประเภท: ${typeLabel(scheduledInfo.type)}`);
              const location = encodeURIComponent(scheduledInfo.type === "onsite" ? "บริษัท" : scheduledInfo.type === "video" ? "Google Meet / Zoom" : "โทรศัพท์");
              const googleLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fmtCal(googleStart)}/${fmtCal(googleEnd)}&details=${details}&location=${location}`;
              const outlookLink = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&startdt=${googleStart.toISOString()}&enddt=${googleEnd.toISOString()}&body=${details}&location=${location}`;
              return (
                <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-[13.5px] font-bold text-gray-900">นัดสัมภาษณ์เรียบร้อยแล้ว</p>
                      <p className="text-[13px] text-gray-600 mt-0.5">
                        {toThaiDate(scheduledInfo.date)} · {scheduledInfo.time}–{endTime} น. · {scheduledInfo.duration} นาที · {typeLabel(scheduledInfo.type)}
                      </p>
                      {scheduledInfo.interviewers.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                          <span className="text-[12px] text-gray-500 font-medium">ผู้สัมภาษณ์:</span>
                          {scheduledInfo.interviewers.map((iv) => (
                            <span key={iv.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border border-gray-200 bg-gray-50 text-gray-700">
                              <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold ${iv.color}`}>{iv.initials}</span>
                              {iv.fullName}
                            </span>
                          ))}
                        </div>
                      )}
                      {scheduledInfo.emailSent && (
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          <p className="text-[12px] text-gray-500">ส่งอีเมลแล้ว</p>
                        </div>
                      )}
                      <div className="mt-3 flex gap-2 flex-wrap">
                        <a href={googleLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-[12px] font-medium text-gray-700 hover:border-[#127EE3] hover:text-[#127EE3] transition-colors">
                          <img src="https://www.google.com/favicon.ico" alt="" className="w-3.5 h-3.5 rounded-sm" />
                          เพิ่มใน Google Calendar
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <a href={outlookLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-[12px] font-medium text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-colors">
                          <svg viewBox="0 0 32 32" className="w-3.5 h-3.5" fill="none"><rect width="32" height="32" rx="4" fill="#0078D4" /><path d="M6 10h12v12H6z" fill="white" opacity="0.9" /><path d="M20 8h6v16h-6z" fill="white" opacity="0.6" /></svg>
                          เพิ่มใน Outlook
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              <ActionBtn primary onClick={() => handleOpenResult()} icon={<FileText className="w-3.5 h-3.5 flex-shrink-0" />} label="บันทึกผลสัมภาษณ์" />
              <ActionBtn onClick={() => setActiveAction("reschedule")} icon={<RefreshCw className="w-3.5 h-3.5 flex-shrink-0" />} label="เปลี่ยนวันนัด" />
              <ActionBtn destructive onClick={() => completeTerminalAction("ยกเลิกนัดสัมภาษณ์")} icon={<X className="w-3.5 h-3.5 flex-shrink-0" />} label="ยกเลิกนัด" />
              <ActionBtn destructive onClick={() => completeTerminalAction("ไม่มาสัมภาษณ์")} icon={<UserX className="w-3.5 h-3.5 flex-shrink-0" />} label="ไม่มาสัมภาษณ์" />
              <ActionBtn destructive onClick={() => completeTerminalAction("ไม่ผ่านสัมภาษณ์")} icon={<ThumbsDown className="w-3.5 h-3.5 flex-shrink-0" />} label="ไม่ผ่านสัมภาษณ์" />
            </div>
          </div>
        )}

        {/* ผ่านสัมภาษณ์ */}
        {localStage === "passed" && (
          <div className="space-y-3">
            {/* Interview result summary card */}
            <div className="rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[12.5px] font-bold text-gray-900">บันทึกผลสัมภาษณ์</span>
                </div>
                <button onClick={() => handleOpenResult()}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-gray-200 text-[11.5px] text-gray-500 hover:border-[#127EE3] hover:text-[#127EE3] transition-colors bg-white">
                  <Edit2 className="w-3 h-3" />แก้ไขผลสัมภาษณ์
                </button>
              </div>
              {savedResult ? (
                <div className="px-4 py-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest w-24 flex-shrink-0">ผลสัมภาษณ์</span>
                    {savedResult.outcome === "passed" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-teal-50 text-teal-700 border border-teal-100">
                        <CheckCircle2 className="w-3 h-3" />ผ่านสัมภาษณ์
                      </span>
                    )}
                    {savedResult.outcome === "wait_compare" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-amber-50 text-amber-700 border border-amber-100">
                        <Clock className="w-3 h-3" />รอเปรียบเทียบ
                      </span>
                    )}
                    {savedResult.outcome === "rejected" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-red-50 text-red-600 border border-red-100">
                        <ThumbsDown className="w-3 h-3" />ไม่ผ่านสัมภาษณ์
                      </span>
                    )}
                  </div>
                  {savedResult.interviewers.length > 0 && (
                    <div className="flex items-start gap-2">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest w-24 flex-shrink-0 mt-0.5">ผู้สัมภาษณ์</span>
                      <div className="flex flex-wrap gap-1.5">
                        {savedResult.interviewers.map((iv) => (
                          <span key={iv.id} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11.5px] font-medium border ${iv.color} border-current/20`}>
                            <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold ${iv.color}`}>{iv.initials}</span>
                            {iv.fullName}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {savedResult.comments && (
                    <div className="flex items-start gap-2">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest w-24 flex-shrink-0 mt-0.5">ความคิดเห็น</span>
                      <p className="text-[12.5px] text-gray-700 leading-relaxed flex-1">{savedResult.comments}</p>
                    </div>
                  )}
                  {savedResult.attachmentNames.length > 0 && (
                    <div className="flex items-start gap-2">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest w-24 flex-shrink-0 mt-0.5">ไฟล์แนบ</span>
                      <div className="flex flex-col gap-1">
                        {savedResult.attachmentNames.map((name, i) => (
                          <span key={i} className="flex items-center gap-1.5 text-[12px] text-[#127EE3]">
                            <Paperclip className="w-3 h-3 flex-shrink-0" />{name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest w-24 flex-shrink-0">บันทึกเมื่อ</span>
                    <span className="text-[12px] text-gray-400">{savedResult.savedAt}</span>
                  </div>
                </div>
              ) : (
                <div className="px-4 py-5 text-center">
                  <p className="text-[12.5px] text-gray-400">ยังไม่มีบันทึกผลสัมภาษณ์</p>
                  <button onClick={handleOpenResult}
                    className="mt-2 text-[12px] font-semibold text-[#127EE3] hover:text-[#0f6bc7] transition-colors">
                    + บันทึกผลสัมภาษณ์
                  </button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              <ActionBtn primary onClick={() => setActiveAction("offer")} icon={<FileText className="w-3.5 h-3.5 flex-shrink-0" />} label="ไป Offer" />
              <ActionBtn onClick={() => setActiveAction("schedule")} icon={<Calendar className="w-3.5 h-3.5 flex-shrink-0" />} label="นัดรอบถัดไป" />
              <ActionBtn onClick={() => handleOpenResult("wait_compare")} icon={<Clock className="w-3.5 h-3.5 flex-shrink-0" />} label="รอเปรียบเทียบ" />
              <ActionBtn destructive onClick={() => completeStageChange("rejected")} icon={<ThumbsDown className="w-3.5 h-3.5 flex-shrink-0" />} label="ไม่ผ่าน" />
            </div>
          </div>
        )}

        {/* Offer */}
        {localStage === "offer" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            <ActionBtn primary onClick={() => setActiveAction("hire")} icon={<Award className="w-3.5 h-3.5 flex-shrink-0" />} label="รับเข้าทำงาน" />
            <ActionBtn destructive onClick={() => completeTerminalAction("ไม่รับข้อเสนอ")} icon={<XCircle className="w-3.5 h-3.5 flex-shrink-0" />} label="ไม่รับข้อเสนอ" />
            <ActionBtn destructive onClick={() => completeStageChange("rejected")} icon={<ThumbsDown className="w-3.5 h-3.5 flex-shrink-0" />} label="ไม่ผ่าน" />
          </div>
        )}

        {/* รับเข้าทำงาน */}
        {localStage === "hired" && (
          <div className="flex items-center gap-2.5 px-4 py-3.5 rounded-xl bg-white border border-gray-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <p className="text-[13px] text-gray-700 font-medium">ผู้สมัครรายนี้ถูกบันทึกเป็นพนักงานเรียบร้อยแล้ว</p>
          </div>
        )}

        {/* ไม่ผ่าน / ยกเลิก */}
        {localStage === "rejected" && (
          <div className="space-y-2">
            <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-white border border-gray-200">
              <ThumbsDown className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[13px] text-gray-700 font-medium">ไม่ผ่าน / ยกเลิก</p>
                {rejectionReason && (
                  <p className="text-[12px] text-gray-500 mt-0.5">เหตุผล: {rejectionReason}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              <ActionBtn primary onClick={() => { setRejectionReason(null); completeStageChange("shortlist"); }} icon={<ThumbsUp className="w-3.5 h-3.5 flex-shrink-0" />} label="ย้ายกลับไปชอร์ตลิสต์" />
              <ActionBtn onClick={() => showSubAlert("คัดลอกเรซูเม่ไปตำแหน่งอื่นแล้ว")} icon={<Copy className="w-3.5 h-3.5 flex-shrink-0" />} label="คัดลอกเรซูเม่ไปตำแหน่งอื่น" />
            </div>
          </div>
        )}
      </div>

      {/* ── Action Panels ── */}

      {/* ส่งต่อให้พิจารณา panel */}
      {activeAction === "refer" && (
        <div className="rounded-2xl border border-gray-200">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 rounded-t-2xl">
            <span className="text-[12.5px] font-bold text-[#1A1A2E]">ส่งต่อให้พิจารณา</span>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="px-4 py-3">
              <div className="flex items-start gap-3">
                <span className="text-[11.5px] font-bold text-gray-400 uppercase tracking-wide w-10 flex-shrink-0 mt-2.5">ถึง</span>
                <div className="flex-1">
                  <ReferToInput
                    value={referQuery}
                    onChange={setReferQuery}
                    selectedContacts={referContacts}
                    onSelectContact={(c) => setReferContacts((prev) => [...prev, c])}
                    onRemoveContact={(id) => setReferContacts((prev) => prev.filter((c) => c.id !== id))}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="text-[11.5px] font-bold text-gray-400 uppercase tracking-wide w-10 flex-shrink-0">เทมเพลต</span>
              <select
                value={referTemplateId}
                onChange={(e) => {
                  const id = e.target.value === "" ? "" : Number(e.target.value);
                  setReferTemplateId(id as number | "");
                  if (id !== "") {
                    const tpl = emailTemplates.find((t) => t.id === id);
                    if (tpl) { setReferEmailSubject(tpl.subject); setReferEmailBody(tpl.body); }
                  }
                }}
                className="flex-1 text-[13px] focus:outline-none bg-transparent text-[#1A1A2E] cursor-pointer"
              >
                <option value="">— เลือกเทมเพลต (ไม่บังคับ) —</option>
                {emailTemplates.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="text-[11.5px] font-bold text-gray-400 uppercase tracking-wide w-10 flex-shrink-0">เรื่อง</span>
              <input value={referEmailSubject} onChange={(e) => setReferEmailSubject(e.target.value)} placeholder="หัวข้ออีเมล..." className="flex-1 text-[13px] focus:outline-none placeholder:text-gray-300" />
            </div>
            <textarea value={referEmailBody} onChange={(e) => setReferEmailBody(e.target.value)} rows={5} placeholder="เนื้อหาอีเมล..." className="w-full px-4 py-3 text-[13px] focus:outline-none resize-none placeholder:text-gray-300" />
          </div>
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-100 rounded-b-2xl">
            <p className="text-[11.5px] text-gray-400">จาก: HR Team</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setActiveAction(null)} className="px-4 py-2 rounded-xl border border-gray-200 text-[12.5px] text-gray-500 hover:bg-gray-100 transition-colors">ยกเลิก</button>
              <button onClick={handleReferSend} disabled={referContacts.length === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#127EE3] text-white text-[12.5px] font-bold hover:bg-[#0f6bc7] transition-colors disabled:opacity-40">
                <Send className="w-3.5 h-3.5" />ส่งและย้ายสถานะ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* นัดสัมภาษณ์ panel */}
      {activeAction === "schedule" && (
        <div className="rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
            <span className="text-[12.5px] font-bold text-[#1A1A2E]">นัดสัมภาษณ์</span>
            <button onClick={() => setActiveAction(null)} className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="px-4 py-4">
            <InterviewScheduler
              candidateName={applicant.name}
              candidateTitle={applicant.currentTitle}
              onScheduled={handleScheduleConfirm}
              onReadyChange={setScheduleReady}
              availabilitySlots={reviewers
                .filter((r) => r.status === "สนใจเรียกสัมภาษณ์" && r.availabilitySlots && r.availabilitySlots.length > 0)
                .map((r) => ({ reviewerName: r.name, slots: r.availabilitySlots! }))}
            />
          </div>
        </div>
      )}

      {/* เปลี่ยนวันนัด panel */}
      {activeAction === "reschedule" && (
        <div className="rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
            <span className="text-[12.5px] font-bold text-gray-900">เปลี่ยนวันนัดสัมภาษณ์</span>
            <button onClick={() => setActiveAction(null)} className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="px-4 py-4">
            <InterviewScheduler
              candidateName={applicant.name}
              candidateTitle={applicant.currentTitle}
              onScheduled={handleRescheduleConfirm}
              onReadyChange={setScheduleReady}
              initialDate={scheduledInfo?.date ?? null}
              initialTime={scheduledInfo?.time ?? null}
              initialDuration={scheduledInfo?.duration}
              initialType={scheduledInfo?.type as "phone" | "video" | "onsite" | undefined}
              initialInterviewers={scheduledInfo?.interviewers}
              availabilitySlots={reviewers
                .filter((r) => r.status === "สนใจเรียกสัมภาษณ์" && r.availabilitySlots && r.availabilitySlots.length > 0)
                .map((r) => ({ reviewerName: r.name, slots: r.availabilitySlots! }))}
            />
          </div>
        </div>
      )}

      {/* บันทึกผลสัมภาษณ์ panel */}
      {activeAction === "result" && (() => {
        const filteredResultInterviewers = emailAddressBookContacts.filter((c) => {
          const q = resultInterviewerQuery.toLowerCase();
          return (
            !resultInterviewers.some((s) => s.id === c.id) &&
            (c.fullName.toLowerCase().includes(q) || c.department.toLowerCase().includes(q))
          );
        });
        return (
          <div className="rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <span className="text-[12.5px] font-bold text-[#1A1A2E]">บันทึกผลสัมภาษณ์</span>
              <button onClick={() => setActiveAction(null)} className="w-6 h-6 rounded-lg hover:bg-gray-200 flex items-center justify-center transition-colors">
                <X className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>
            <div className="px-4 py-4 space-y-4">
              {/* Result outcome */}
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">ผลการสัมภาษณ์</p>
                <div className="grid grid-cols-3 gap-2">
                  {[{ v: "passed" as const, label: "ผ่านสัมภาษณ์", color: "border-emerald-300 text-emerald-700 bg-emerald-50" },
                    { v: "wait_compare" as const, label: "รอเปรียบเทียบ", color: "border-amber-300 text-amber-700 bg-amber-50" },
                    { v: "rejected" as const, label: "ไม่ผ่าน", color: "border-red-300 text-red-600 bg-red-50" }].map(({ v, label, color }) => (
                    <button key={v} onClick={() => setInterviewResult(v)}
                      className={`flex items-center gap-2 px-3 py-3 rounded-xl border text-[12.5px] font-medium transition-all ${interviewResult === v ? color : "border-gray-200 text-gray-500 bg-white hover:border-gray-300"}`}>
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${interviewResult === v ? "border-current bg-current" : "border-gray-300"}`} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interviewers */}
              <div className="relative">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">ผู้สัมภาษณ์</p>
                {resultInterviewers.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {resultInterviewers.map((c) => (
                      <span key={c.id} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium ${c.color}`}>
                        {c.fullName} · {c.department}
                        <button onClick={() => setResultInterviewers((prev) => prev.filter((x) => x.id !== c.id))} className="w-3.5 h-3.5 rounded-full hover:bg-black/10 flex items-center justify-center transition-colors">
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => { setResultInterviewerDropdownOpen((v) => !v); setResultInterviewerQuery(""); }}
                  className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#F0F2F5] text-[13px] text-gray-400 hover:border-gray-300 transition-colors text-left"
                >
                  <Search className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="flex-1">{resultInterviewers.length > 0 ? "เพิ่มผู้สัมภาษณ์" : "เลือกผู้สัมภาษณ์"}</span>
                  <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" />
                </button>
                {resultInterviewerDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden">
                    <div className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-100">
                      <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <input autoFocus value={resultInterviewerQuery} onChange={(e) => setResultInterviewerQuery(e.target.value)}
                        placeholder="ค้นหาชื่อหรือแผนก..." className="flex-1 text-[13px] focus:outline-none placeholder:text-gray-300" />
                    </div>
                    <div className="max-h-[180px] overflow-y-auto">
                      {filteredResultInterviewers.length === 0 ? (
                        <p className="text-[12.5px] text-gray-400 text-center py-4">ไม่พบรายชื่อ</p>
                      ) : filteredResultInterviewers.map((c) => (
                        <button key={c.id}
                          onClick={() => { setResultInterviewers((prev) => [...prev, c]); setResultInterviewerQuery(""); setResultInterviewerDropdownOpen(false); }}
                          className="w-full flex items-center gap-3 px-3.5 py-2.5 hover:bg-[#F0F8FF] transition-colors text-left"
                        >
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${c.color}`}>{c.initials}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-[#1A1A2E] truncate">{c.fullName}</p>
                            <p className="text-[11.5px] text-gray-400 truncate">{c.department} · {c.title}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Comments */}
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">ความคิดเห็นจากการสัมภาษณ์</p>
                <textarea
                  value={resultComments}
                  onChange={(e) => setResultComments(e.target.value)}
                  rows={4}
                  placeholder="เช่น จุดแข็ง จุดที่ควรพัฒนา ความเหมาะสมกับตำแหน่ง"
                  className="w-full text-[13px] text-gray-700 bg-[#F0F2F5] border border-transparent rounded-xl px-3.5 py-3 resize-none focus:outline-none focus:border-[#127EE3] focus:bg-white transition-all placeholder:text-gray-300"
                />
              </div>

              {/* Attachments */}
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">ไฟล์แนบ</p>
                {resultAttachments.length > 0 && (
                  <div className="space-y-1.5 mb-2">
                    {resultAttachments.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200">
                        <Paperclip className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span className="flex-1 text-[12.5px] text-[#1A1A2E] truncate">{f.name}</span>
                        <button onClick={() => setResultAttachments((prev) => prev.filter((_, j) => j !== i))}
                          className="text-[11px] text-red-400 hover:text-red-600 font-medium flex-shrink-0 transition-colors">ลบ</button>
                      </div>
                    ))}
                  </div>
                )}
                <label className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-dashed border-gray-300 text-[12.5px] text-gray-500 hover:border-[#127EE3] hover:text-[#127EE3] cursor-pointer transition-colors bg-white">
                  <Upload className="w-3.5 h-3.5 flex-shrink-0" />
                  + แนบไฟล์
                  <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" className="hidden"
                    onChange={(e) => { if (e.target.files) setResultAttachments((prev) => [...prev, ...Array.from(e.target.files!)]); e.target.value = ""; }} />
                </label>
                <p className="text-[11px] text-gray-400 mt-1">รองรับ PDF, รูปภาพ, DOC</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 px-4 py-3 bg-gray-50 border-t border-gray-100">
              <button onClick={() => setActiveAction(null)} className="px-4 py-2 rounded-xl border border-gray-200 text-[12.5px] text-gray-500 hover:bg-gray-100 transition-colors">ยกเลิก</button>
              <button onClick={handleResultSave} disabled={!interviewResult}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#127EE3] text-white text-[12.5px] font-bold hover:bg-[#0f6bc7] transition-colors disabled:opacity-40">
                <CheckCircle2 className="w-3.5 h-3.5" />บันทึกผล
              </button>
            </div>
          </div>
        );
      })()}

      {/* ไป Offer panel */}
      {activeAction === "offer" && (
        <div className="rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <span className="text-[12.5px] font-bold text-[#1A1A2E]">ยืนยันการส่ง Offer</span>
          </div>
          <div className="px-4 py-4">
            <p className="text-[13px] text-gray-600">ยืนยันที่จะย้ายผู้สมัครรายนี้ไปสถานะ <span className="font-semibold text-[#1A1A2E]">Offer</span>?</p>
          </div>
          <div className="flex justify-end gap-2 px-4 py-3 bg-gray-50 border-t border-gray-100">
            <button onClick={() => setActiveAction(null)} className="px-4 py-2 rounded-xl border border-gray-200 text-[12.5px] text-gray-500 hover:bg-gray-100 transition-colors">ยกเลิก</button>
            <button onClick={handleOfferConfirm} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#127EE3] text-white text-[12.5px] font-bold hover:bg-[#0f6bc7] transition-colors">
              <CheckCircle2 className="w-3.5 h-3.5" />ยืนยัน
            </button>
          </div>
        </div>
      )}

      {/* รับเข้าทำงาน panel */}
      {activeAction === "hire" && (
        <div className="rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <span className="text-[12.5px] font-bold text-[#1A1A2E]">ยืนยันรับเข้าทำงาน</span>
          </div>
          <div className="px-4 py-4">
            <p className="text-[13px] text-gray-600">ยืนยันที่จะบันทึกสถานะ <span className="font-semibold text-[#1A1A2E]">{applicant.name}</span> เป็น <span className="font-semibold text-emerald-700">รับเข้าทำงาน</span>?</p>
          </div>
          <div className="flex justify-end gap-2 px-4 py-3 bg-gray-50 border-t border-gray-100">
            <button onClick={() => setActiveAction(null)} className="px-4 py-2 rounded-xl border border-gray-200 text-[12.5px] text-gray-500 hover:bg-gray-100 transition-colors">ยกเลิก</button>
            <button onClick={handleHireConfirm} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-white text-[12.5px] font-bold hover:bg-emerald-600 transition-colors">
              <CheckCircle2 className="w-3.5 h-3.5" />ยืนยันรับเข้าทำงาน
            </button>
          </div>
        </div>
      )}

      {/* Email compose panel */}
      {activeAction === "emailCompose" && (
        <div className="rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <span className="text-[12.5px] font-bold text-[#1A1A2E]">ส่งอีเมลหาผู้สมัคร</span>
          </div>
          <div className="px-4 py-3 border-b border-gray-100 bg-white">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2">เลือก Template</p>
            <div className="flex flex-wrap gap-1.5">
              {EMAIL_TEMPLATES_MANAGE.map((t) => (
                <button key={t.key} onClick={() => applyTemplate(t.key)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all border ${selectedTemplate === t.key ? "bg-[#127EE3] text-white border-[#127EE3]" : "bg-white border-gray-200 text-gray-500 hover:border-[#127EE3]/40 hover:text-[#127EE3]"}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="text-[11.5px] font-bold text-gray-400 uppercase tracking-wide w-10 flex-shrink-0">ถึง</span>
              <input value={emailTo} onChange={(e) => setEmailTo(e.target.value)} className="flex-1 text-[13px] text-[#1A1A2E] focus:outline-none" />
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="text-[11.5px] font-bold text-gray-400 uppercase tracking-wide w-10 flex-shrink-0">เรื่อง</span>
              <input value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} placeholder="หัวข้ออีเมล" className="flex-1 text-[13px] focus:outline-none placeholder:text-gray-300" />
            </div>
            <textarea value={emailBody} onChange={(e) => setEmailBody(e.target.value)}
              placeholder="เขียนข้อความ..." rows={6}
              className="w-full px-4 py-3 text-[13px] focus:outline-none resize-none placeholder:text-gray-300" />
          </div>
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-100">
            <p className="text-[11.5px] text-gray-400">จาก: HR Team</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setActiveAction(null)} className="px-4 py-2 rounded-xl border border-gray-200 text-[12.5px] text-gray-500 hover:bg-gray-100 transition-colors">ยกเลิก</button>
              <button onClick={handleSendEmail} disabled={!emailSubject.trim() || !emailBody.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#127EE3] text-white text-[12.5px] font-bold hover:bg-[#0f6bc7] transition-colors disabled:opacity-40">
                <Send className="w-3.5 h-3.5" />ส่งอีเมล
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refer */}
      {localStage === "offer" && (
        <div>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">ส่งต่อให้</p>
          <ReferToInput
            value={referQuery}
            onChange={setReferQuery}
            selectedContacts={referContacts}
            onSelectContact={(c) => setReferContacts((prev) => [...prev, c])}
            onRemoveContact={(id) => setReferContacts((prev) => prev.filter((c) => c.id !== id))}
          />
          {referContacts.length > 0 && (
            <>
              <button onClick={() => setShowReferPreview(!showReferPreview)}
                className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-sky-200 text-sky-600 text-[13px] font-semibold hover:bg-sky-50 transition-colors">
                <Eye className="w-3.5 h-3.5" />{showReferPreview ? "ซ่อน Preview" : "ดู Preview อีเมล"}
              </button>
              {showReferPreview && (
                <div className="mt-3 rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                    <p className="text-[11.5px] font-bold text-gray-400 uppercase tracking-wide">Preview อีเมลที่จะส่ง</p>
                  </div>
                  <div className="px-5 py-4 space-y-2.5 text-[13px]">
                    <div className="flex gap-3"><span className="text-gray-400 w-12 flex-shrink-0">ถึง</span><span className="text-[#1A1A2E] font-medium">{referContacts.map((c) => c.name).join(", ")}</span></div>
                    <div className="flex gap-3"><span className="text-gray-400 w-12 flex-shrink-0">เรื่อง</span><span className="text-[#1A1A2E] font-medium">ขอส่งโปรไฟล์ผู้สมัคร — {applicant.currentTitle}</span></div>
                    <div className="border-t border-gray-100 pt-3">
                      <p className="text-gray-600 leading-[1.8]">{applicant.name} มีประสบการณ์ {applicant.experience} ด้าน {applicant.skills.slice(0, 3).join(", ")} กรุณาดู AI Summary ประกอบที่แนบมาด้วยครับ/ค่ะ</p>
                    </div>
                  </div>
                  <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 text-white text-[13px] font-bold hover:bg-sky-600 transition-colors">
                      <Send className="w-3.5 h-3.5" />ส่งต่อพร้อม AI Summary
                    </button>
                  </div>
                </div>
              )}
              {!showReferPreview && (
                <button className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 bg-sky-500 text-white text-[13px] font-bold rounded-xl hover:bg-sky-600 transition-colors">
                  <Send className="w-3.5 h-3.5" />ส่งต่อพร้อม AI Summary
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Hired — note section */}
      {localStage === "hired" && (
        <div>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">บันทึกเพิ่มเติม</p>
          {hiredNote && !hiredNoteEditing ? (
            <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 space-y-2">
              <p className="text-[13px] text-gray-700 whitespace-pre-wrap">{hiredNote}</p>
              <button onClick={() => { setHiredNoteDraft(hiredNote); setHiredNoteEditing(true); }}
                className="flex items-center gap-1 text-[12px] font-semibold text-[#127EE3] hover:underline transition-colors">
                <Edit2 className="w-3 h-3" />แก้ไข
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <textarea rows={3} value={hiredNoteDraft}
                onChange={(e) => setHiredNoteDraft(e.target.value)}
                placeholder="เช่น เริ่มงานวันที่..., เงินเดือนที่ตกลง..., เงื่อนไขพิเศษ..."
                className="w-full px-3.5 py-2.5 text-[13px] bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-[#127EE3] focus:bg-white transition-all placeholder:text-gray-400 resize-none" />
              <button onClick={() => { setHiredNote(hiredNoteDraft); setHiredNoteEditing(false); setAlertMsg("บันทึกข้อมูลเรียบร้อยแล้ว"); }}
                className="flex items-center gap-1.5 px-4 py-2 border border-[#127EE3] text-[#127EE3] text-[12.5px] font-semibold rounded-xl hover:bg-blue-50 transition-colors">
                บันทึกโน้ต
              </button>
            </div>
          )}
        </div>
      )}

      <div className="h-2" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Root component                                                        */
/* ------------------------------------------------------------------ */
export default function ApplicantDetailPanel({ applicant, onClose, onStageChange }: ApplicantDetailPanelProps) {
  const [tab, setTab] = useState<"resume" | "ai" | "docs" | "notes" | "manage" | "timeline">("resume");
  const [localStage, setLocalStage] = useState<PipelineStage>(applicant.stage);
  const [activities, setActivities] = useState<ActivityItem[]>([
    { id: "a1", actor: "สมศรี HR", actorInitials: "สร", actorColor: "bg-[#127EE3]", type: "reveal", text: "เปิดดูข้อมูลการติดต่อ", time: "วันนี้ 09:42" },
    { id: "a2", actor: "สมศรี HR", actorInitials: "สร", actorColor: "bg-[#127EE3]", type: "stage", text: "เปลี่ยนสถานะเป็น ใหม่", time: "วันนี้ 09:43" },
  ]);

  const store: ActivityStore = {
    activities,
    addActivity: (a) => setActivities((prev) => [a, ...prev]),
  };

  const handleSetStage = (s: PipelineStage) => {
    setLocalStage(s);
    onStageChange(applicant.id, s);
  };

  const tabs = [
    { key: "resume" as const, label: "Resume", icon: <FileText className="w-3.5 h-3.5" /> },
    { key: "ai" as const, label: "AI วิเคราะห์", icon: <Sparkles className="w-3.5 h-3.5" /> },
    { key: "docs" as const, label: "เอกสาร", icon: <Paperclip className="w-3.5 h-3.5" /> },
    { key: "manage" as const, label: "จัดการ", icon: <UserCheck className="w-3.5 h-3.5" /> },
    { key: "timeline" as const, label: "ไทม์ไลน์", icon: <Clock className="w-3.5 h-3.5" /> },
    { key: "notes" as const, label: "โน้ต", icon: <MessageCircle className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header — matching ResumePanel exactly */}
      <div className="flex-shrink-0 bg-white border-b border-gray-100">
        {/* Top bar */}
        <div className="flex items-center justify-between px-7 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#0DC2FF] to-[#127EE3] flex items-center justify-center flex-shrink-0">
                <span className="text-[7px] font-black text-white leading-none">SR</span>
              </div>
              <span className="text-[11px] font-bold text-[#127EE3] uppercase tracking-widest">Super Resume</span>
            </div>
            <div className="w-px h-4 bg-gray-200" />
            <h2 className="text-[16px] font-bold text-[#1A1A2E]">{applicant.name}</h2>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-[10.5px] font-bold text-emerald-600">
              <CheckCircle2 className="w-3 h-3" />เปิดเผยแล้ว
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Stage progress bar */}
        <div className="px-7 py-2 bg-[#F7F9FC] border-t border-b border-gray-100">
          <StageProgressBar current={localStage} />
        </div>

        {/* Tab bar — underline style matching ResumePanel */}
        <div className="flex items-center gap-0.5 px-7 pb-0">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 text-[12.5px] font-semibold transition-all whitespace-nowrap border-b-2 -mb-px ${
                tab === t.key
                  ? "border-[#127EE3] text-[#127EE3]"
                  : "border-transparent text-gray-400 hover:text-gray-700"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {tab === "resume" && <ResumeContent applicant={applicant} />}
        {tab === "ai" && <AIAnalysisContent applicant={applicant} />}
        {tab === "docs" && <DocsContent applicant={applicant} />}
        {tab === "notes" && <NotesContent applicant={applicant} store={store} />}
        {tab === "manage" && <ManageContent applicant={applicant} localStage={localStage} onSetStage={handleSetStage} store={store} />}
        {tab === "timeline" && <TimelineContent store={store} applicant={applicant} />}
      </div>

      {/* Bottom bar — matching ResumePanel (resume tab only) */}
      {tab === "resume" && (
        <div className="flex-shrink-0 border-t border-gray-100 bg-white px-6 py-3">
          <div className="flex items-center gap-2">
            <button onClick={() => { handleSetStage("shortlist"); setTab("manage"); }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-[#01BFF9] to-[#019EFC] text-white text-[13px] font-bold rounded-xl hover:opacity-90 transition-opacity shadow-sm shadow-[#019EFC]/20">
              <ThumbsUp className="w-4 h-4" />Shortlist
            </button>
            <button onClick={() => setTab("manage")}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 border border-gray-200 text-gray-600 text-[12.5px] font-medium rounded-xl hover:bg-gray-50 transition-colors whitespace-nowrap">
              <Mail className="w-3.5 h-3.5" />ส่งอีเมล
            </button>
            <button onClick={() => setTab("manage")}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 border border-gray-200 text-gray-600 text-[12.5px] font-medium rounded-xl hover:bg-gray-50 transition-colors whitespace-nowrap">
              <Calendar className="w-3.5 h-3.5" />ลงตารางนัดสัมภาษณ์
            </button>
            <button onClick={() => setTab("manage")}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 border border-gray-200 text-gray-600 text-[12.5px] font-medium rounded-xl hover:bg-gray-50 transition-colors whitespace-nowrap">
              <Users className="w-3.5 h-3.5" />ส่งต่อ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
