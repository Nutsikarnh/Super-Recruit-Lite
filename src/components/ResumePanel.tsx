import { useState, useRef, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X, Phone, Mail, MapPin, GraduationCap, Briefcase, Star, Music, Dumbbell, Languages, Eye, User, ChevronDown, ChevronUp, MessageCircle, Calendar, ThumbsUp, ThumbsDown, Send, FileText, Sparkles, UserCheck, CheckCircle2, AlertCircle, Award, TrendingUp, Target, Shield, Zap, Bookmark, BookmarkCheck, Lock, Search, Paperclip, Users as Users2, Upload, Clock, Download, ExternalLink, Plus, MoreHorizontal, Globe, Info, Printer, FileDown, PhoneOff, Ban, RefreshCw, UserX, XCircle, CreditCard as Edit2, Copy } from "lucide-react";
import InterviewScheduler, { toThaiDate, typeLabel } from "./InterviewScheduler";
import type { InterviewerContact } from "./InterviewScheduler";
import ReferToInput from "./ReferToInput";
import type { JobRow } from "../data/jobs";
import { emailTemplates } from "../data/emailTemplates";
import { emailAddressBookContacts } from "../data/emailAddressBook";

import type { ApplicantRow, PipelineStage } from "../data/applicants";
import { PIPELINE_STAGES } from "../data/applicants";

interface CandidateDisplay {
  name: string;
  initials: string;
  avatarColor: string;
  title: string;
  company: string;
  experience: string;
  location: string;
  salaryExpect: string;
  skills: string[];
  aiSummary?: string;
  stage?: string;
}

interface ResumePanelProps { onClose: () => void; job?: JobRow; onContact?: () => void; isApplicant?: boolean; isRevealed?: boolean; applicant?: ApplicantRow; onApplicantStageChange?: (id: string, stage: PipelineStage) => void; }

const REVEALED_NAME = "นายอนันต์ สุริยะพร";
const REVEALED_PHONE = "081-234-5678";
const REVEALED_EMAIL = "anant.suriyaporn@gmail.com";
const REVEALED_PHOTO_INITIALS = "อส";

/* ------------------------------------------------------------------ */
/* Shared helpers                                                        */
/* ------------------------------------------------------------------ */
function CollapsibleSection({ title, icon, defaultOpen = false, children }: {
  title: string; icon: React.ReactNode; defaultOpen?: boolean; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-7 py-4 hover:bg-gray-50/60 transition-colors text-left">
        <div className="flex items-center gap-2">{icon}<span className="text-[15px] font-bold text-[#1A1A2E]">{title}</span></div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && <div className="px-7 pb-5">{children}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tab: Resume                                                           */
/* ------------------------------------------------------------------ */
function ResumeContent({ contactRevealed, candidate }: { contactRevealed: boolean; candidate?: CandidateDisplay }) {
  const dispName     = candidate ? candidate.name     : (contactRevealed ? REVEALED_NAME    : "Senior Product Designer");
  const dispInitials = candidate ? candidate.initials : (contactRevealed ? REVEALED_PHOTO_INITIALS : null);
  const dispColor    = candidate?.avatarColor;
  const dispTitle    = candidate ? candidate.title    : "Senior Product Designer";
  const dispCompany  = candidate ? candidate.company  : "LINE MAN Wongnai";
  const dispExp      = candidate ? candidate.experience : "4+ ปี";
  const dispLocation = candidate ? candidate.location : "กรุงเทพฯ";
  const dispSalary   = candidate ? candidate.salaryExpect : "80,000–95,000 บาท";
  const stageCfg     = candidate?.stage ? PIPELINE_STAGES.find(s => s.key === candidate.stage) : null;

  return (
    <>
      <div className="px-7 pt-6 pb-6 border-b border-gray-100 bg-gradient-to-br from-white to-[#F7F9FC]">
        <div className="flex items-start gap-5">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md">
              {(contactRevealed || candidate) ? (
                <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: dispColor ?? "#127EE3" }}>
                  <span className="text-white text-xl font-black">{dispInitials ?? "?"}</span>
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 text-gray-300" stroke="currentColor" strokeWidth="1.2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                {!contactRevealed && !candidate && <p className="text-[13px] text-gray-400 mb-1">JTG-2024-000123</p>}
                <h3 className="text-[22px] font-bold text-[#1A1A2E] leading-tight">{dispName}</h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-[15.5px] font-semibold text-[#127EE3]">{dispCompany}</span>
                  <span className="text-gray-300 text-[13px]">·</span>
                  <span className="px-2 py-0.5 bg-blue-50 border border-blue-100 rounded-full text-[12px] font-bold text-blue-600">{dispExp}</span>
                  {stageCfg && (
                    <span className={`px-2 py-0.5 rounded-full text-[12px] font-bold ${stageCfg.bg} ${stageCfg.color}`}>{stageCfg.label}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[14.5px] text-gray-500 mb-3">
              {(contactRevealed && !candidate) ? (
                <>
                  <span className="flex items-center gap-1.5 text-[#1A1A2E] font-medium"><Phone className="w-3.5 h-3.5 text-[#0DC2FF]" />{REVEALED_PHONE}</span>
                  <span className="flex items-center gap-1.5 text-[#1A1A2E] font-medium"><Mail className="w-3.5 h-3.5 text-[#0DC2FF]" />{REVEALED_EMAIL}</span>
                </>
              ) : !candidate ? (
                <>
                  <span className="flex items-center gap-1.5 text-gray-400"><Phone className="w-3.5 h-3.5" />09x-xxx-xxxx</span>
                  <span className="flex items-center gap-1.5 text-gray-400"><Mail className="w-3.5 h-3.5" />***@gmail.com</span>
                </>
              ) : null}
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gray-300" />{dispLocation}</span>
              <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5 text-gray-300" />{candidate?.stage ? dispTitle : "จุฬาฯ นิเทศศิลป์"}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {candidate ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#01BFF9]/10 to-[#019EFC]/10 border border-[#0DC2FF]/20">
                  <span className="text-[11px] font-bold text-[#127EE3] uppercase">เงินเดือนที่คาดหวัง</span>
                  <span className="text-[14.5px] font-bold text-[#127EE3]">{dispSalary}</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white border border-gray-200 shadow-sm">
                    <span className="text-[11px] font-bold text-gray-400 uppercase">ปัจจุบัน</span>
                    <span className="text-[14.5px] font-bold text-[#1A1A2E]">75,000</span>
                    <span className="text-[11px] text-gray-400">บาท/เดือน</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#01BFF9]/10 to-[#019EFC]/10 border border-[#0DC2FF]/20">
                    <span className="text-[11px] font-bold text-[#127EE3] uppercase">คาดหวัง</span>
                    <span className="text-[14.5px] font-bold text-[#127EE3]">80,000–95,000</span>
                    <span className="text-[11px] text-[#127EE3]/70">บาท/เดือน</span>
                  </div>
                </>
              )}
            </div>
            {candidate && candidate.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {candidate.skills.slice(0, 6).map(s => (
                  <span key={s} className="px-2 py-0.5 rounded-md text-[13px] font-medium bg-[#F0F8FF] text-[#127EE3] border border-[#0DC2FF]/20">{s}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <CollapsibleSection title="My Lifestyle in Action" icon={<Star className="w-4 h-4 text-amber-400" />}>
        <div className="grid grid-cols-4 gap-2 mt-1">
          {[
            { label: "Photography projects", bg: "from-blue-100 to-blue-200" },
            { label: "International design conf.", bg: "from-emerald-100 to-emerald-200" },
            { label: "Side project showcase", bg: "from-amber-100 to-amber-200" },
            { label: "Hiking & outdoors", bg: "from-rose-100 to-rose-200" },
          ].map((item, i) => (
            <div key={i} className={`aspect-square rounded-xl bg-gradient-to-br ${item.bg} flex items-end p-2.5`}>
              <span className="text-[11px] font-medium text-gray-600 leading-tight">{item.label}</span>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="What Drives Me" icon={<Star className="w-4 h-4 text-[#0DC2FF]" />} defaultOpen>
        <ul className="space-y-2 mb-3 mt-1">
          <li className="flex gap-2.5 text-[16px] text-gray-700"><span className="w-1.5 h-1.5 rounded-full bg-[#0DC2FF] flex-shrink-0 mt-[7px]" />สร้างงาน design ที่มีผลกระทบต่อผู้ใช้งานจริง</li>
          <li className="flex gap-2.5 text-[16px] text-gray-700"><span className="w-1.5 h-1.5 rounded-full bg-[#0DC2FF] flex-shrink-0 mt-[7px]" />เติบโตเป็น design leader ที่ mentor คนรุ่นต่อไปได้</li>
        </ul>
        <p className="text-[15px] text-gray-600 leading-[1.7] bg-gray-50 rounded-xl p-4">ผมเชื่อว่า great design ไม่ใช่แค่สิ่งที่สวยงาม แต่คือสิ่งที่แก้ปัญหาได้จริง</p>
      </CollapsibleSection>

      <CollapsibleSection title="Experience" icon={<Briefcase className="w-4 h-4 text-gray-400" />} defaultOpen>
        <div className="space-y-5 mt-1">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#0DC2FF]/10 flex items-center justify-center flex-shrink-0 text-[11px] font-black text-[#0DC2FF]">LMW</div>
            <div className="flex-1">
              <p className="text-[17px] font-bold text-[#1A1A2E]">Senior Product Designer</p>
              <p className="text-[15px] text-[#127EE3] font-semibold mt-0.5">LINE MAN Wongnai</p>
              <p className="text-[14px] text-gray-400 mt-1">Full Time · มี.ค. 2020 – ปัจจุบัน (4+ ปี) · 75,000 บาท/เดือน</p>
              <div className="mt-3 space-y-1.5">
                <p className="flex gap-2 text-[14.5px] text-gray-700"><span className="w-1 h-1 rounded-full bg-gray-400 flex-shrink-0 mt-[7px]" />ออกแบบ UX/UI ให้ feature หลักของ LINE MAN ตั้งแต่ discovery ถึง launch</p>
                <p className="flex gap-2 text-[14.5px] text-gray-700"><span className="w-1 h-1 rounded-full bg-gray-400 flex-shrink-0 mt-[7px]" />นำ design system ทีม 8 คน พัฒนา component library กว่า 120 components</p>
                <p className="flex gap-2 text-[14.5px] text-gray-700"><span className="w-1 h-1 rounded-full bg-gray-400 flex-shrink-0 mt-[7px]" />วาง user research framework ลด design rework ลง 35%</p>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 text-[11px] font-black text-amber-600">SCB</div>
            <div className="flex-1">
              <p className="text-[17px] font-bold text-[#1A1A2E]">UX Designer</p>
              <p className="text-[15px] text-[#127EE3] font-semibold mt-0.5">SCB (Siam Commercial Bank)</p>
              <p className="text-[14px] text-gray-400 mt-1">Full Time · มิ.ย. 2018 – ก.พ. 2020 (1 ปี 8 เดือน)</p>
              <div className="mt-2.5"><p className="flex gap-2 text-[14.5px] text-gray-700"><span className="w-1 h-1 rounded-full bg-gray-400 flex-shrink-0 mt-[7px]" />ออกแบบ mobile banking flow ลด step checkout จาก 7 เหลือ 3 ขั้นตอน</p></div>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Education" icon={<GraduationCap className="w-4 h-4 text-gray-400" />} defaultOpen>
        <div className="flex gap-4 mt-1">
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0 text-[11px] font-black text-rose-500">CU</div>
          <div>
            <p className="text-[17px] font-bold text-[#1A1A2E]">จุฬาลงกรณ์มหาวิทยาลัย</p>
            <p className="text-[15.5px] text-gray-600 mt-0.5">ปริญญาตรี นิเทศศิลป์ สาขา Visual Communication</p>
            <p className="text-[14px] text-gray-400 mt-1">ปีที่จบ 2018 · GPA: 3.72</p>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Skills and Languages" icon={<Star className="w-4 h-4 text-gray-400" />} defaultOpen>
        <div className="space-y-4 mt-1">
          <div>
            <p className="text-[14.5px] font-bold text-[#1A1A2E] mb-2 flex items-center gap-2"><Dumbbell className="w-3.5 h-3.5 text-gray-400" />My Skills</p>
            <p className="text-[15.5px] text-gray-700">Figma, Design System, Prototyping, User Research, Motion Design, A/B Testing</p>
          </div>
          <div>
            <p className="text-[14.5px] font-bold text-[#1A1A2E] mb-2 flex items-center gap-2"><Music className="w-3.5 h-3.5 text-gray-400" />Music I Love</p>
            <p className="text-[15.5px] text-gray-700">Indie · Lo-Fi · Jazz · Electronic · Acoustic</p>
          </div>
          <div>
            <p className="text-[14.5px] font-bold text-[#1A1A2E] mb-2 flex items-center gap-2"><Languages className="w-3.5 h-3.5 text-gray-400" />Languages</p>
            <div className="space-y-2.5">
              <div><p className="text-[16px] font-semibold text-[#1A1A2E]">ภาษาไทย</p><p className="text-[14px] text-gray-400 mt-0.5">Native</p></div>
              <div>
                <p className="text-[16px] font-semibold text-[#1A1A2E]">English</p>
                <p className="text-[15px] text-gray-600 mt-0.5">Listening: Advanced · Speaking: Upper-Intermediate · Reading: Advanced</p>
                <p className="text-[15px] text-[#0DC2FF] font-semibold mt-1">TOEIC: 885</p>
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
/* Job Fit Section                                                       */
/* ------------------------------------------------------------------ */

// Candidate resume data (static for this demo)
const RESUME_SKILLS = ["Figma", "Design System", "Prototyping", "User Research", "Motion Design", "A/B Testing"];
const RESUME_YOE = 4; // years of experience from resume
const RESUME_SALARY_EXPECT_MIN = 80000;
const RESUME_SALARY_EXPECT_MAX = 95000;
// Last resume update — older than 6 months = stale
const RESUME_LAST_UPDATED = new Date("2024-08-15");

function parseYoEMin(expLevel: string): number {
  const m = expLevel.match(/(\d+)/);
  return m ? parseInt(m[1]) : 0;
}

function parseSalaryRange(salaryStr: string): { min: number; max: number } | null {
  const nums = salaryStr.match(/[\d,]+/g);
  if (!nums || nums.length < 2) return null;
  return {
    min: parseInt(nums[0].replace(/,/g, "")),
    max: parseInt(nums[1].replace(/,/g, "")),
  };
}

function DownloadAnalysisButton() {
  const [downloading, setDownloading] = useState(false);
  const [done, setDone] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    // Simulate generating a text report
    setTimeout(() => {
      const content = [
        "AI ANALYSIS REPORT",
        "==================",
        `Candidate: ${REVEALED_NAME}`,
        `Position: Senior Product Designer`,
        `Generated: ${new Date().toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })}`,
        "",
        "SUMMARY",
        "-------",
        "ผู้สมัครมีทักษะ UX/UI ครบ pipeline ตั้งแต่ research ถึง delivery มีประวัติวาง design system ระดับ production จบจุฬาฯ GPA 3.72 และมี stability สูง — ทำงานองค์กรเดิมต่อเนื่องมา 4 ปี เหมาะสมกับตำแหน่งนี้มาก",
        "",
        "STRENGTHS",
        "---------",
        "- Portfolio แข็งแกร่ง",
        "- ประสบการณ์ตรง 4+ ปี",
        "- เคยทำ Design System",
        "- Lead ทีมได้",
        "",
        "PERSONA",
        "-------",
        "The Strategic Executor — คนที่ทำงานได้กว้าง รับผิดชอบสูง และมีภาวะผู้นำที่ไม่ต้องรอให้คนอื่นชี้ทาง",
        "",
        "INTERVIEW QUESTIONS",
        "-------------------",
        "1. [Experience] เล่าให้ฟังถึงโปรเจกต์ที่คุณรับผิดชอบเองตั้งแต่ต้นจนจบ วัดผลสำเร็จอย่างไร",
        "2. [Collaboration] คุณทำงานร่วมกับทีมอื่นอย่างไรเมื่อ priority ขัดแย้งกัน",
        "3. [Ownership] เคยมีครั้งไหนที่งานที่ทำ launch แล้วผลไม่เป็นไปตามที่คาด ทำอย่างไรต่อ",
        "4. [Growth] ช่วง 6 เดือนที่ผ่านมาคุณเรียนรู้หรือพัฒนาทักษะอะไรที่สำคัญบ้าง",
        "5. [Ambition] ใน 2-3 ปีข้างหน้า คุณอยากเติบโตไปในทิศทางไหน",
        "",
        "---",
        "Generated by AI Analysis · ข้อมูลนี้ใช้เป็นข้อมูลประกอบการพิจารณาเท่านั้น",
      ].join("\n");

      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `AI_Analysis_${REVEALED_NAME.replace(/\s/g, "_")}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      setDownloading(false);
      setDone(true);
      setTimeout(() => setDone(false), 2500);
    }, 800);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className={`w-full flex items-center justify-center gap-2.5 py-3 rounded-xl border text-[15.5px] font-semibold transition-all ${
        done
          ? "bg-emerald-50 border-emerald-100 text-emerald-600"
          : "bg-white border-gray-200 text-gray-600 hover:border-[#127EE3]/40 hover:text-[#127EE3] hover:bg-[#127EE3]/[0.02]"
      } ${downloading ? "opacity-60 cursor-not-allowed" : ""}`}
    >
      {downloading ? (
        <>
          <div className="w-4 h-4 border-2 border-gray-300 border-t-[#127EE3] rounded-full animate-spin" />
          กำลังสร้างไฟล์...
        </>
      ) : done ? (
        <>
          <CheckCircle2 className="w-4 h-4" />
          ดาวน์โหลดสำเร็จ
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          ดาวน์โหลด AI Analysis
        </>
      )}
    </button>
  );
}

function JobFitSection({ job }: { job: JobRow }) {
  const monthsOld = Math.floor((Date.now() - RESUME_LAST_UPDATED.getTime()) / (1000 * 60 * 60 * 24 * 30));
  const isStale = monthsOld >= 6;

  const JD_KEYWORDS: Record<string, string[]> = {
    "Product Designer (UI/UX)": ["Figma", "Design System", "Prototyping", "User Research", "Motion Design"],
    "Senior Backend Engineer": ["Node.js", "Python", "API Design", "SQL", "System Architecture"],
    "Frontend Developer (React)": ["React", "TypeScript", "CSS", "Figma", "Testing"],
    "DevOps Engineer": ["Kubernetes", "CI/CD", "Terraform", "AWS", "Docker"],
  };
  const jdSkills = JD_KEYWORDS[job.title] ?? [];
  const matchedSkills = jdSkills.filter(s => RESUME_SKILLS.includes(s));

  const yoeMin = job.expLevel ? parseYoEMin(job.expLevel) : null;
  const yoeFit = yoeMin !== null && RESUME_YOE >= yoeMin;

  const jobSalary = job.salary ? parseSalaryRange(job.salary) : null;
  const salaryFit = jobSalary
    ? RESUME_SALARY_EXPECT_MIN <= jobSalary.max + 5000
    : null;

  // Collect positive signals only
  const signals: { label: string; detail: string }[] = [];
  if (matchedSkills.length > 0) {
    signals.push({
      label: `มี ${matchedSkills.length} ทักษะที่ตรงกับตำแหน่ง`,
      detail: matchedSkills.join(" · "),
    });
  }
  if (yoeMin !== null && yoeFit) {
    signals.push({
      label: `ประสบการณ์ผ่าน requirement`,
      detail: `JD ต้องการ ${job.expLevel} — resume ระบุ ${RESUME_YOE} ปี`,
    });
  }
  if (salaryFit) {
    signals.push({
      label: `เงินเดือนอยู่ในช่วงที่คุยได้`,
      detail: `Budget ${job.salary}`,
    });
  }

  const hasAnyData = jdSkills.length > 0 || yoeMin !== null || jobSalary !== null;

  return (
    <div>
      <div className="border-t border-gray-100" />
      <div className="px-7 py-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3.5 h-3.5 rounded-full bg-[#127EE3]/30 flex-shrink-0" />
          <span className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">FIT กับตำแหน่งนี้</span>
        </div>

        {!hasAnyData ? (
          <p className="text-[15px] text-gray-400">ไม่มีข้อมูล JD เพียงพอ</p>
        ) : signals.length === 0 ? (
          <p className="text-[15px] text-gray-500">ยังไม่พบ signal ที่ match ชัดเจนจาก resume ที่มีอยู่</p>
        ) : (
          <div className="space-y-3">
            {signals.map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                </div>
                <div>
                  <p className="text-[15.5px] font-semibold text-[#1A1A2E]">{s.label}</p>
                  <p className="text-[14.5px] text-gray-400 mt-0.5">{s.detail}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {isStale && (
          <div className="flex items-start gap-2.5 mt-4 pt-4 border-t border-gray-100">
            <Info className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
            <p className="text-[14px] text-gray-400 leading-relaxed">
              Resume อัปเดตล่าสุดเมื่อ {monthsOld} เดือนที่แล้ว — อาจมีทักษะหรือโปรเจกต์ล่าสุดที่ยังไม่ปรากฏ ควรถามในการสัมภาษณ์
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tab: AI วิเคราะห์                                                    */
/* ------------------------------------------------------------------ */
function AIAnalysisContent({ contactRevealed, onRevealRequest, job, candidate }: { contactRevealed: boolean; onRevealRequest: () => void; job?: JobRow; candidate?: CandidateDisplay }) {
  if (!contactRevealed) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-5 px-10 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center"><Lock className="w-7 h-7 text-gray-400" /></div>
        <div>
          <p className="text-[18px] font-bold text-[#1A1A2E] mb-1">AI วิเคราะห์ยังไม่พร้อมใช้งาน</p>
          <p className="text-[15.5px] text-gray-500 leading-relaxed">ต้องเปิดดูข้อมูลการติดต่อก่อน จึงจะสามารถดู AI วิเคราะห์ได้</p>
        </div>
        <button onClick={onRevealRequest} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#127EE3] text-white text-[16px] font-bold hover:bg-[#0f6bc7] transition-colors shadow-sm">
          <Eye className="w-4 h-4" />ดูข้อมูลการติดต่อ
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="px-7 pt-6 pb-5 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-xl bg-[#EBF5FF] flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-[#127EE3]" />
          </div>
          <span className="text-[13px] font-bold text-[#127EE3] uppercase tracking-widest">AI ANALYSIS</span>
        </div>
        <h4 className="text-[22px] font-black text-[#1A1A2E]">{candidate?.name ?? REVEALED_NAME}</h4>
        <p className="text-[15px] text-gray-400 mt-0.5 mb-3">{candidate ? `${candidate.title} · ${candidate.company} · ${candidate.experience}` : "Senior Product Designer · LINE MAN Wongnai · 4+ ปี"}</p>
        <div className="bg-[#F4F9FF] border border-[#C3DFFE] rounded-xl px-4 py-3.5">
          <p className="text-[15.5px] text-[#1A1A2E] leading-[1.75]">{candidate?.aiSummary ?? "ผู้สมัครมีทักษะ UX/UI ครบ pipeline ตั้งแต่ research ถึง delivery มีประวัติวาง design system ระดับ production จบจุฬาฯ GPA 3.72 และมี stability สูง — ทำงานองค์กรเดิมต่อเนื่องมา 4 ปี เหมาะสมกับตำแหน่งนี้มาก"}</p>
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* เส้นทางอาชีพ */}
      <div className="px-7 py-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3.5 h-3.5 rounded-full bg-gray-200 flex-shrink-0" />
          <span className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">เส้นทางอาชีพ</span>
        </div>
        <div className="space-y-3">
          {[
            "เริ่มสาย Designer — เติบโตเป็น Senior ใน 4 ปี",
            "ทำงานต่อเนื่องทันทีหลังเรียนจบ ไม่มีช่วงว่างที่ผิดปกติ",
            "เงินเดือนโตสะท้อนความรับผิดชอบที่เพิ่มขึ้น — ไม่ใช่แค่อายุงาน",
            "4 ปี — ระดับที่วางแผนเชิงกลยุทธ์ได้",
          ].map((text, i) => (
            <div key={i} className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <p className="text-[15.5px] text-gray-700 leading-snug">{text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* WHY THIS CANDIDATE STANDS OUT */}
      <div className="px-7 py-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3.5 h-3.5 rounded-full bg-gray-200 flex-shrink-0" />
          <span className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">WHY THIS CANDIDATE STANDS OUT</span>
        </div>
        <div className="space-y-5">
          {[
            {
              headline: "Portfolio แข็งแกร่ง",
              detail: "ผ่านงานที่ต้องรับผิดชอบจริงในระดับ Senior มาแล้ว ไม่ใช่แค่ support — เป็นคนที่ถือ ownership ของงานตั้งแต่ต้นจนส่งมอบ",
            },
            {
              headline: "ประสบการณ์ตรง 4+ ปี",
              detail: "Skills ที่มีไม่ได้แคบแค่ด้านเดียว — Figma, Design System, Prototyping และอื่นๆ ทำให้ทำงานข้ามทีมได้โดยไม่ต้องอาศัยคนกลางมาก",
            },
            {
              headline: "เคยทำ Design System",
              detail: "ใน 4 ปีที่ผ่านมา ได้รับงานที่หนักขึ้นในทุกบทบาท — บ่งบอกว่าคนรอบข้างและองค์กรเดิม trust เพียงพอที่จะ delegate งานสำคัญให้",
            },
            {
              headline: "Lead ทีมได้",
              detail: "จากพื้นฐานการศึกษา วิทยาศาสตรบัณฑิต ออกแบบนิเทศศิลป์ จุฬาลงกรณ์มหาวิทยาลัย ประกอบกับประสบการณ์จริง ทำให้มีทั้งความเข้าใจเชิงทฤษฎีและการลงมือทำที่สมดุล",
            },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[15.5px] font-bold text-[#1A1A2E] leading-snug">{item.headline}</p>
                <p className="text-[15px] text-gray-500 mt-1 leading-relaxed">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 space-y-3">
          <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">ข้อควรระวัง</p>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-[15.5px] text-gray-700 leading-snug">เงินเดือนสูงกว่า budget เล็กน้อย</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* ตัวตน */}
      <div className="px-7 py-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3.5 h-3.5 rounded-full bg-gray-200 flex-shrink-0" />
          <span className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">ตัวตน</span>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          {/* Left card */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">จากจุดแข็ง</p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#127EE3]/10 mb-3">
              <Zap className="w-3 h-3 text-[#127EE3]" />
              <span className="text-[13px] font-black text-[#127EE3] tracking-wide">The Strategic Executor</span>
            </div>
            <p className="text-[15px] font-bold text-[#1A1A2E] mb-4 leading-snug">"คนที่ทำงานได้กว้าง รับผิดชอบสูง และมีภาวะผู้นำที่ไม่ต้องรอให้คนอื่นชี้ทาง"</p>
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
                    <span className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wide">{item.label} </span>
                    <span className="text-[13.5px] text-gray-600">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Right card */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">จาก HOBBIES & LIFE</p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100 mb-3">
              <Star className="w-3 h-3 text-emerald-500" />
              <span className="text-[13px] font-black text-emerald-600 tracking-wide">The Deliberate Creator</span>
            </div>
            <p className="text-[15px] font-bold text-[#1A1A2E] mb-4 leading-snug">"ข้างในเธอมีทั้งความอดทนและความสุขในการทำอะไรช้าๆ อย่างตั้งใจ — ไม่ใช่แค่คนที่ขับเคลื่อนด้วยความเร็ว"</p>
            <div className="space-y-3">
              {[
                {
                  label: "กิจกรรมที่ต้องอดทน",
                  insight: "ทำงานได้นานในสถานการณ์ที่ผลลัพธ์ยังไม่ชัด — ไม่หมดแรงเมื่อความสำเร็จช้า",
                },
                {
                  label: "กิจกรรมที่ต้องละเอียด",
                  insight: "ในชีวิตส่วนตัว เธอก็เป็นคนที่ให้ความสำคัญกับทุกรายละเอียด — เหมือนในที่ทำงาน",
                },
                {
                  label: "กิจกรรมทีม / สังคม",
                  insight: "เคยคุ้นกับพลวัตของกลุ่ม รู้ว่าต้องอ่านคนและจังหวะให้ถูก",
                },
              ].map((item, i) => (
                <div key={i} className="border-l-2 border-gray-200 pl-3">
                  <p className="text-[13px] font-bold text-[#1A1A2E] leading-tight">{item.label}</p>
                  <p className="text-[13.5px] text-gray-600 mt-0.5 leading-relaxed">{item.insight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Summary box */}
        <div className="bg-gray-50 rounded-2xl px-5 py-5 border border-gray-100">
          <p className="text-[13px] text-gray-400 mb-3">เมื่อผสานกัน — อนันต์เป็นคนแบบไหน</p>
          <p className="text-[17px] font-bold text-[#1A1A2E] leading-[1.75]">
            คนที่ <span className="font-black">ขับเคลื่อนได้แรงเมื่อจำเป็น</span> แต่ยัง<span className="font-black">อดทนรอได้เมื่อสถานการณ์ต้องการ</span> — ไม่ใช่คนที่ทำงานหนักเพื่อพิสูจน์ตัวเอง แต่ทำเพราะอยากเห็นผลลัพธ์ที่ดีจริงๆ
          </p>
          <p className="text-[15px] text-gray-500 mt-2">ให้งานที่มีทั้งความท้าทายเชิงกลยุทธ์และการลงมือทำจริง — จะได้เห็นอนันต์ในเวอร์ชันที่ดีที่สุด</p>
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* BEHAVIORAL SIGNALS */}
      <div className="px-7 py-5">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3.5 h-3.5 rounded-full bg-gray-200 flex-shrink-0" />
          <span className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">BEHAVIORAL SIGNALS</span>
        </div>
        <p className="text-[14.5px] text-gray-400 mb-5">วิเคราะห์เชิงลึกจาก AI — อ้างอิงจากประสบการณ์ทำงาน, จุดแข็ง, สไตล์การทำงาน และกิจกรรมในชีวิต</p>
        <div className="space-y-5">
          {[
            {
              title: "วิธีทำงานร่วมกับผู้อื่น",
              desc: "อนันต์เข้าร่วมทีมเพื่อผลักดันความคืบหน้า ไม่ใช่รับบทบาทตั้งรับ — แบ่งงานชัด คาดหวัง ให้ทุกคนรับผิดชอบในส่วนของตัวเอง",
              note: "มิตรในแบบที่ช่วยให้งานเดิน ทำงานดีที่สุดกับเพื่อนร่วมทีมที่มีความสามารถ ตอบสนองไว และบริหารตัวเองได้",
            },
            {
              title: "วิธีสื่อสารและสร้างสรรค์",
              desc: "สื่อสารตรงไปตรงมา ใช้งานได้จริง — สร้างงานโดยมีผลลัพธ์ปลายทางอยู่ในใจ ไม่ใช่เพื่อแสดงออก",
              note: "เปลี่ยนไอเดียที่ยังหลวม ให้กลายเป็นชิ้นงานและการติดตามผลได้จริง โดยไม่ต้องรอทีมผู้เชี่ยวชาญขนาดใหญ่",
            },
            {
              title: "วิธีขับเคลื่อนผลลัพธ์",
              desc: "ต้องการเห็นความคืบหน้าที่จับต้องได้ ทำงานในแบบที่เชื่อมกิจกรรมเข้ากับผลลัพธ์ธุรกิจโดยตรง",
              note: "อาจหมดพลังในบทบาทที่ความพยายามทั้งหมดจมหายไปกับกระบวนการ โดยไม่มีผลลัพธ์ที่มองเห็นได้ชัด",
            },
            {
              title: "วิธีรับมือกับอำนาจและโครงสร้าง",
              desc: "เคารพอำนาจเมื่ออำนาจนั้นมีความสามารถและประโยชน์จริง — ต้องการเป้าหมายชัดเจนและพื้นที่ให้ลงมือทำ",
              note: "ภาพตัวตนที่ผูกกับภาวะผู้นำบ่งบอกว่าต้องการเติบโตสู่การมีอำนาจตัดสินใจ บทบาทที่แบนเกินไปอาจรั้งไว้ได้ไม่นาน",
            },
            {
              title: "วิธีเรียนรู้และเติบโต",
              desc: "เรียนรู้ได้ดีที่สุดผ่านการลงมือเจอสถานการณ์จริง ไม่รอจนกว่าจะรู้สึกว่าพร้อมเต็มที่ — สร้างความสามารถจากงานจริง",
              note: "รูปแบบการพัฒนาเอนเอียงไปทางประสบการณ์มากกว่าระบบ อาจต้องการแรงสนับสนุนด้าน documentation และ analytics ในองค์กรขนาดใหญ่",
            },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#127EE3] flex-shrink-0 mt-1.5" />
              <div>
                <p className="text-[15.5px] font-bold text-[#1A1A2E] leading-snug">{item.title}</p>
                <p className="text-[15.5px] text-gray-700 mt-0.5 leading-relaxed">{item.desc}</p>
                <p className="text-[15px] text-gray-400 italic mt-1">{item.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* สรุปสำหรับ HR */}
      <div className="px-7 py-5">
        <p className="text-[15px] font-bold text-gray-400 mb-3">สรุปสำหรับ HR</p>
        <p className="text-[18px] font-bold text-[#1A1A2E] leading-[1.75]">
          อนันต์คือคนที่ "ลงมือได้กว้าง ทำได้จริง และไม่หยุดจนกว่างานจะเสร็จ" — เอาใส่ role ที่ต้องการคนเชื่อมการวางแผนกับการลงมือทำ จะได้เห็นของจริง
        </p>
      </div>

      <div className="border-t border-gray-100" />

      {/* Job Fit Analysis */}
      {job && <JobFitSection job={job} />}

      {/* คำถามสัมภาษณ์ */}
      <div className="border-t border-gray-100" />
      <div className="px-7 py-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3.5 h-3.5 rounded-full bg-gray-200 flex-shrink-0" />
          <span className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">คำถามสัมภาษณ์ (AI แนะนำ)</span>
        </div>
        <div className="space-y-3">
          {[
            { category: "Experience", q: "เล่าให้ฟังถึง โปรเจกต์ที่คุณรับผิดชอบเองตั้งแต่ต้นจนจบ วัดผลสำเร็จอย่างไร" },
            { category: "Collaboration", q: "คุณทำงานร่วมกับทีมอื่นอย่างไรเมื่อ priority ขัดแย้งกัน" },
            { category: "Ownership", q: "เคยมีครั้งไหนที่งานที่ทำ launch แล้วผลไม่เป็นไปตามที่คาด ทำอย่างไรต่อ" },
            { category: "Growth", q: "ช่วง 6 เดือนที่ผ่านมาคุณเรียนรู้หรือพัฒนาทักษะอะไรที่สำคัญบ้าง" },
            { category: "Ambition", q: "ใน 2–3 ปีข้างหน้า คุณอยากเติบโตไปในทิศทางไหน" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-[11px] font-bold text-[#127EE3] bg-[#127EE3]/10 px-2.5 py-1 rounded-lg flex-shrink-0 mt-0.5 whitespace-nowrap min-w-[120px] text-center">{item.category}</span>
              <p className="text-[15px] text-gray-600 leading-relaxed">{item.q}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer + Download */}
      <div className="mx-7 mb-6 mt-2 space-y-3">
        <div className="bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4">
          <p className="text-[15px] font-bold text-amber-800 mb-2">เกี่ยวกับการวิเคราะห์ด้วย AI</p>
          <p className="text-[14.5px] text-amber-700/80 leading-[1.7] mb-2">การวิเคราะห์นี้มองเห็น <strong>potential</strong> และจุดแข็ง เป็นหลัก — เราตั้งใจไม่ตัดสินในเชิงลบ เพราะเชื่อว่าแต่ละคนมีคุณค่าในบริบทที่เหมาะสม</p>
          <p className="text-[14.5px] text-amber-700/80 leading-[1.7] mb-2">ก่อนตัดสินใจ ให้ดูเรซูเม่จริงประกอบ พิจารณาความเหมาะสมกับตำแหน่งและช่วงเงินเดือนด้วยตัวเอง AI วิเคราะห์ใช้เป็นข้อมูลประกอบการพิจารณา ไม่ใช่บทสรุป</p>
          <p className="text-[14.5px] text-amber-700/80 leading-[1.7]">สรุปสุดท้าย AI อาจมีความคลาดเคลื่อนได้ โปรดใช้วิจารณญาณของคุณในการตัดสินใจเสมอ</p>
        </div>
        <DownloadAnalysisButton />
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

const INITIAL_FILES: AttachedFile[] = [
  { id: "f1", name: "Resume_Anant-Suriyaporn_2025.pdf", size: "1.2 MB", type: "pdf", uploadedBy: "ผู้สมัคร", uploadedAt: "15 เม.ย. 2568", isCandidate: true },
  { id: "f2", name: "Portfolio_Anant_Design.pdf", size: "8.4 MB", type: "pdf", uploadedBy: "ผู้สมัคร", uploadedAt: "15 เม.ย. 2568", isCandidate: true },
];

function fileIcon(type: AttachedFile["type"]) {
  const base = "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0";
  if (type === "pdf") return <div className={`${base} bg-red-50`}><FileText className="w-4 h-4 text-red-500" /></div>;
  if (type === "doc") return <div className={`${base} bg-blue-50`}><FileText className="w-4 h-4 text-blue-500" /></div>;
  return <div className={`${base} bg-gray-100`}><Paperclip className="w-4 h-4 text-gray-500" /></div>;
}

function DocsContent({ contactRevealed, onRevealRequest }: { contactRevealed: boolean; onRevealRequest: () => void }) {
  const [files, setFiles] = useState<AttachedFile[]>(INITIAL_FILES);
  const [previewFile, setPreviewFile] = useState<AttachedFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const addFiles = (newFiles: File[]) => {
    const added: AttachedFile[] = newFiles.map((f) => ({
      id: `f${Date.now()}-${Math.random()}`, name: f.name,
      size: f.size > 1024 * 1024 ? `${(f.size / 1024 / 1024).toFixed(1)} MB` : `${(f.size / 1024).toFixed(0)} KB`,
      type: f.name.endsWith(".pdf") ? "pdf" : f.name.match(/\.(doc|docx)$/) ? "doc" : f.name.match(/\.(png|jpg|jpeg)$/) ? "img" : "other",
      uploadedBy: "สมศรี HR", uploadedAt: "เพิ่งอัปโหลด",
    }));
    setFiles((prev) => [...added, ...prev]);
  };

  if (!contactRevealed) {
    return (
      <div className="px-7 py-6 space-y-5">
        {/* Info banner */}
        <div className="flex items-start gap-3 px-4 py-3.5 bg-[#EBF5FF] border border-[#C3DFFE] rounded-xl">
          <Info className="w-4 h-4 text-[#127EE3] flex-shrink-0 mt-0.5" />
          <p className="text-[14.5px] text-[#127EE3] leading-relaxed">
            ข้อมูลนี้ดึงมาจากไฟล์แนบของผู้หางาน เพื่อช่วยให้คุณประเมินเบื้องต้นก่อนเปิดข้อมูลการติดต่อ
          </p>
        </div>

        {/* Work Experience */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
            <Briefcase className="w-4 h-4 text-[#127EE3]" />
            <span className="text-[15px] font-bold text-[#1A1A2E]">ประสบการณ์การทำงาน</span>
          </div>
          <div className="px-5 py-4 space-y-4">
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#0DC2FF]/10 flex items-center justify-center flex-shrink-0 text-[10px] font-black text-[#0DC2FF]">LMW</div>
              <div className="flex-1 min-w-0">
                <p className="text-[15.5px] font-bold text-[#1A1A2E]">Senior Product Designer</p>
                <p className="text-[14.5px] text-[#127EE3] font-semibold">LINE MAN Wongnai</p>
                <p className="text-[13.5px] text-gray-400 mt-0.5">มี.ค. 2020 – ปัจจุบัน · 4+ ปี</p>
                <ul className="mt-2 space-y-1">
                  {[
                    "ออกแบบ UX/UI สำหรับฟีเจอร์หลักของแอป (Food Delivery / Mart)",
                    "ทำงานร่วมกับ Product Manager และ Engineer เพื่อพัฒนาฟีเจอร์ใหม่",
                    "ปรับปรุง Conversion และ User Flow จาก Data และ User Research",
                    "วาง Design System ระดับ Production ใช้ข้ามทีม",
                  ].map((line) => (
                    <li key={line} className="flex items-start gap-1.5 text-[14px] text-gray-600 leading-snug">
                      <span className="mt-0.5 flex-shrink-0 text-gray-400">•</span>
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0 text-[10px] font-black text-amber-600">SCB</div>
              <div className="flex-1 min-w-0">
                <p className="text-[15.5px] font-bold text-[#1A1A2E]">UX Designer</p>
                <p className="text-[14.5px] text-[#127EE3] font-semibold">SCB (Siam Commercial Bank)</p>
                <p className="text-[13.5px] text-gray-400 mt-0.5">มิ.ย. 2018 – ก.พ. 2020 · 1 ปี 8 เดือน</p>
                <ul className="mt-2 space-y-1">
                  {[
                    "ออกแบบ Mobile Banking Experience สำหรับผู้ใช้กว่า 10 ล้านคน",
                    "ทำ User Research และ Usability Testing เพื่อพัฒนา UI",
                    "พัฒนาระบบ Design System ภายในทีมดิจิทัล",
                  ].map((line) => (
                    <li key={line} className="flex items-start gap-1.5 text-[14px] text-gray-600 leading-snug">
                      <span className="mt-0.5 flex-shrink-0 text-gray-400">•</span>
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
            <GraduationCap className="w-4 h-4 text-[#127EE3]" />
            <span className="text-[15px] font-bold text-[#1A1A2E]">ประวัติการศึกษา</span>
          </div>
          <div className="px-5 py-4">
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0 text-[10px] font-black text-rose-500">CU</div>
              <div>
                <p className="text-[15.5px] font-bold text-[#1A1A2E]">จุฬาลงกรณ์มหาวิทยาลัย</p>
                <p className="text-[14.5px] text-gray-600">ปริญญาตรี นิเทศศิลป์ · Visual Communication</p>
                <p className="text-[13.5px] text-gray-400 mt-0.5">ปีที่จบ 2018 · GPA 3.72</p>
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
            <Zap className="w-4 h-4 text-[#127EE3]" />
            <span className="text-[15px] font-bold text-[#1A1A2E]">ทักษะ</span>
          </div>
          <div className="px-5 py-4">
            <div className="flex flex-wrap gap-2">
              {["Figma", "Design System", "Prototyping", "User Research", "Motion Design", "A/B Testing"].map((skill) => (
                <span key={skill} className="px-3 py-1.5 bg-[#EBF5FF] text-[#127EE3] text-[14px] font-semibold rounded-lg border border-[#C3DFFE]">{skill}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Reveal CTA */}
        <div className="flex items-center justify-between px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl">
          <div>
            <p className="text-[15.5px] font-bold text-[#1A1A2E]">ต้องการดูไฟล์แนบทั้งหมด?</p>
            <p className="text-[14px] text-gray-400 mt-0.5">เปิดข้อมูลการติดต่อเพื่อเข้าถึงเอกสารเพิ่มเติม</p>
          </div>
          <button onClick={onRevealRequest} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#01BFF9] to-[#019EFC] text-white text-[14.5px] font-bold hover:opacity-90 transition-opacity shadow-sm">
            <Eye className="w-3.5 h-3.5" />ดูข้อมูลการติดต่อ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-7 py-6 space-y-5">
      {previewFile && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm" onClick={() => setPreviewFile(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">{fileIcon(previewFile.type)}<span className="text-[16px] font-semibold text-[#1A1A2E] truncate max-w-[340px]">{previewFile.name}</span></div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-[14.5px] text-gray-600 hover:bg-gray-50 transition-colors"><Download className="w-3.5 h-3.5" />ดาวน์โหลด</button>
                <button onClick={() => setPreviewFile(null)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"><X className="w-4 h-4 text-gray-500" /></button>
              </div>
            </div>
            <div className="h-[480px] bg-gray-50 flex flex-col items-center justify-center gap-3">
              {fileIcon(previewFile.type)}
              <p className="text-[16px] font-semibold text-gray-600">{previewFile.name}</p>
              <p className="text-[14.5px] text-gray-400">{previewFile.size}</p>
              <p className="text-[14px] text-gray-400 mt-2">Preview ไม่พร้อมใช้งานในโหมด Demo</p>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#127EE3] text-white text-[15px] font-semibold hover:bg-[#0f6bc7] transition-colors mt-1">
                <ExternalLink className="w-3.5 h-3.5" />เปิดในแท็บใหม่
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Latest */}
      {files[0] && (
        <div>
          <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-3">ล่าสุด</p>
          <button onClick={() => setPreviewFile(files[0])}
            className="w-full flex items-center gap-4 p-4 rounded-2xl border border-[#127EE3]/20 bg-[#127EE3]/[0.03] hover:bg-[#127EE3]/[0.06] transition-all group text-left">
            {fileIcon(files[0].type)}
            <div className="flex-1 min-w-0">
              <p className="text-[15.5px] font-semibold text-[#127EE3] truncate group-hover:underline">{files[0].name}</p>
              <p className="text-[13.5px] text-gray-400 mt-0.5">{files[0].size} · {files[0].uploadedBy} · {files[0].uploadedAt}</p>
            </div>
            <ExternalLink className="w-4 h-4 text-[#127EE3]/50 group-hover:text-[#127EE3] flex-shrink-0 transition-colors" />
          </button>
        </div>
      )}

      {/* All files */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">ไฟล์ทั้งหมด ({files.length})</p>
          <div>
            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => { if (e.target.files) addFiles(Array.from(e.target.files)); }} />
            <button onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-[14px] font-semibold text-gray-500 hover:border-[#127EE3]/40 hover:text-[#127EE3] transition-colors">
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
                <p className="text-[15px] font-medium text-[#1A1A2E] truncate">{f.name}</p>
                <p className="text-[13.5px] text-gray-400 mt-0.5">
                  {f.size} · {f.isCandidate ? <span className="text-emerald-600 font-medium">จากผู้สมัคร</span> : <span className="text-[#127EE3] font-medium">{f.uploadedBy}</span>} · {f.uploadedAt}
                </p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setPreviewFile(f)} className="w-7 h-7 rounded-lg hover:bg-[#127EE3]/10 flex items-center justify-center text-gray-400 hover:text-[#127EE3] transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                <button className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"><Download className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
          {dragging && <div className="flex items-center justify-center py-6 rounded-xl border-2 border-dashed border-[#127EE3]/40 text-[15px] text-[#127EE3] font-medium">วางไฟล์ที่นี่</div>}
        </div>
      </div>

      {/* Find online — single clean button */}
      <div className="rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
        <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0"><Search className="w-4 h-4 text-gray-500" /></div>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-semibold text-[#1A1A2E]">ค้นหาข้อมูลเพิ่มเติมของผู้สมัคร</p>
          <p className="text-[13.5px] text-gray-400 mt-0.5">เช็ค LinkedIn, Instagram, Behance, ผลงาน หรือ personal site บน Google</p>
        </div>
        <button
          onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent("อนันต์ สุริยะพร product designer site:linkedin.com OR site:instagram.com OR site:behance.net OR site:dribbble.com")}`, "_blank")}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#127EE3]/30 text-[#127EE3] text-[14.5px] font-semibold hover:bg-[#127EE3]/5 transition-colors flex-shrink-0">
          <Globe className="w-3.5 h-3.5" />ค้นหาเลย
        </button>
      </div>

      <div className="h-2" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tab: โน้ต + Activity log (shared)                                    */
/* ------------------------------------------------------------------ */
interface ActivityItem {
  id: string; actor: string; actorInitials: string; actorColor: string;
  type: "stage" | "note" | "file" | "reveal" | "email" | "chat";
  text: string; detail?: string; time: string;
  emailSubject?: string; emailBody?: string; emailTo?: string;
}

const INITIAL_ACTIVITIES: ActivityItem[] = [
  { id: "a1", actor: "สมศรี HR", actorInitials: "สร", actorColor: "bg-[#127EE3]", type: "reveal", text: "เปิดดูข้อมูลการติดต่อ", time: "วันนี้ 09:42" },
  { id: "a2", actor: "สมศรี HR", actorInitials: "สร", actorColor: "bg-[#127EE3]", type: "stage", text: "เปลี่ยนสถานะเป็น Shortlist", time: "วันนี้ 09:43" },
  { id: "a3", actor: "วิชัย Manager", actorInitials: "วช", actorColor: "bg-emerald-500", type: "note", text: "เพิ่มโน้ต", detail: "Portfolio ดีมาก น่าสนใจ ลองนัดคุยดู", time: "วันนี้ 11:20" },
  { id: "a4", actor: "สมศรี HR", actorInitials: "สร", actorColor: "bg-[#127EE3]", type: "file", text: "อัปโหลดไฟล์ Portfolio_Anant_Design.pdf", time: "เมื่อวาน 15:30" },
  { id: "a5", actor: "สมศรี HR", actorInitials: "สร", actorColor: "bg-[#127EE3]", type: "email", text: "ส่งอีเมล", emailSubject: "นัดสัมภาษณ์ตำแหน่ง Senior Product Designer", emailBody: "สวัสดีครับคุณอนันต์ ทางเราอยากนัดสัมภาษณ์เบื้องต้น สะดวกวันไหนบ้างครับ?", emailTo: REVEALED_EMAIL, time: "วันนี้ 10:05" },
];

const INITIAL_NOTES: ActivityItem[] = [
  { id: "n1", actor: "วิชัย Manager", actorInitials: "วช", actorColor: "bg-emerald-500", type: "note", text: "เพิ่มโน้ต", detail: "Portfolio ดีมาก น่าสนใจมาก เหมาะกับ product ใหม่ที่กำลังเปิดรับ ลองนัดคุยก่อนเลย", time: "วันนี้ 11:20" },
  { id: "n2", actor: "สมศรี HR", actorInitials: "สร", actorColor: "bg-[#127EE3]", type: "note", text: "เพิ่มโน้ต", detail: "ติดต่อแล้ว สะดวกสัมภาษณ์ช่วง 28–30 เม.ย. เช้า ตอบเร็วมาก ดูสนใจงานนี้จริงๆ", time: "วันนี้ 09:55" },
  { id: "n3", actor: "ปิยะ Head of Design", actorInitials: "ปย", actorColor: "bg-amber-500", type: "note", text: "เพิ่มโน้ต", detail: "เคยเห็นงานเขาใน design community — ระดับ senior จริงๆ ถ้า salary fit ให้เดินหน้าเลย", time: "เมื่อวาน 16:05" },
];

function activityIcon(type: ActivityItem["type"]) {
  if (type === "stage") return <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0"><CheckCircle2 className="w-3 h-3 text-blue-500" /></div>;
  if (type === "note") return <div className="w-6 h-6 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0"><FileText className="w-3 h-3 text-amber-500" /></div>;
  if (type === "file") return <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0"><Paperclip className="w-3 h-3 text-gray-500" /></div>;
  if (type === "reveal") return <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0"><Eye className="w-3 h-3 text-emerald-500" /></div>;
  if (type === "email") return <div className="w-6 h-6 rounded-full bg-[#127EE3]/10 border border-[#127EE3]/20 flex items-center justify-center flex-shrink-0"><Mail className="w-3 h-3 text-[#127EE3]" /></div>;
  if (type === "chat") return <div className="w-6 h-6 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center flex-shrink-0"><MessageCircle className="w-3 h-3 text-sky-500" /></div>;
  return <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0"><MoreHorizontal className="w-3 h-3 text-gray-400" /></div>;
}

/* Shared activity context — passed down */
interface ActivityStore {
  activities: ActivityItem[];
  addActivity: (a: ActivityItem) => void;
}

function NotesContent({ store }: { store: ActivityStore }) {
  const [note, setNote] = useState("");
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

  /* All activities including email, sorted newest first */
  const allActivities = store.activities;
  const emailActivities = allActivities.filter((a) => a.type === "email");
  return (
    <div className="px-7 py-6 space-y-5">

      {/* ① Key Note — compose box */}
      <div>
        <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-3">Key Notes</p>
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden focus-within:border-[#0DC2FF] transition-colors">
          <textarea value={note} onChange={(e) => setNote(e.target.value)}
            placeholder="บันทึกความเห็น, คะแนนหลังสัมภาษณ์, หรือ note เพิ่มเติม..."
            rows={3}
            className="w-full px-4 py-3 text-[15px] focus:outline-none resize-none placeholder:text-gray-400" />
          <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100 bg-gray-50/70">
            <div className="flex items-center gap-2">
              <input ref={noteFileRef} type="file" className="hidden" onChange={(e) => e.target.files && setAttachFile(e.target.files[0])} />
              <button onClick={() => noteFileRef.current?.click()}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[14px] text-gray-500 hover:bg-white hover:text-[#127EE3] transition-colors border border-transparent hover:border-gray-200">
                <Paperclip className="w-3.5 h-3.5" />
                {attachFile ? <span className="text-[#127EE3] font-medium max-w-[120px] truncate">{attachFile.name}</span> : "แนบไฟล์"}
              </button>
              {attachFile && <button onClick={() => setAttachFile(null)} className="text-gray-300 hover:text-red-400 transition-colors"><X className="w-3 h-3" /></button>}
            </div>
            <button onClick={handleSaveNote} disabled={!note.trim() && !attachFile}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#127EE3] text-white text-[14.5px] font-semibold hover:bg-[#0f6bc7] transition-colors disabled:opacity-40">
              <Plus className="w-3.5 h-3.5" />บันทึก
            </button>
          </div>
        </div>
      </div>

      {/* ② Notes list — same section, no extra heading */}
      {notes.length > 0 && (
        <div className="space-y-2.5">
          {notes.map((n) => (
            <div key={n.id} className="rounded-2xl border border-gray-100 bg-white p-4 hover:border-gray-200 transition-colors">
              <div className="flex items-center gap-2.5 mb-2">
                <div className={`w-7 h-7 rounded-full ${n.actorColor} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-[10px] font-black text-white">{n.actorInitials}</span>
                </div>
                <span className="text-[15px] font-semibold text-[#1A1A2E]">{n.actor}</span>
                <span className="ml-auto text-[13px] text-gray-400 flex items-center gap-1 flex-shrink-0"><Clock className="w-3 h-3" />{n.time}</span>
              </div>
              {n.detail && <p className="text-[15px] text-gray-600 leading-relaxed pl-[38px]">{n.detail}</p>}
            </div>
          ))}
        </div>
      )}

      {/* ③ Activity — collapsible, includes emails */}
      <div className="border-t border-gray-100 pt-4">
        <button onClick={() => setShowActivity(!showActivity)}
          className="flex items-center gap-2 text-[13px] font-semibold text-gray-400 uppercase tracking-widest hover:text-gray-500 transition-colors w-full text-left mb-1">
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
                      <span className="text-[8px] font-black text-white">{act.actorInitials}</span>
                    </div>
                    <span className="text-[14px] font-semibold text-gray-500">{act.actor}</span>
                    <span className="text-[14px] text-gray-400">{act.type === "email" ? `ส่งอีเมล "${act.emailSubject}"` : act.text}</span>
                    <span className="ml-auto text-[13px] text-gray-300 flex items-center gap-1 flex-shrink-0"><Clock className="w-3 h-3" />{act.time}</span>
                  </div>
                  {/* inline expand for email body */}
                  {act.type === "email" && act.emailBody && (
                    <div className="mt-1 ml-5">
                      <button onClick={() => setExpandedEmail(expandedEmail === act.id ? null : act.id)}
                        className="text-[13.5px] text-[#127EE3] hover:underline flex items-center gap-1">
                        {expandedEmail === act.id ? "ซ่อนเนื้อหา" : "ดูเนื้อหาอีเมล"}
                        <ChevronDown className={`w-3 h-3 transition-transform ${expandedEmail === act.id ? "rotate-180" : ""}`} />
                      </button>
                      {expandedEmail === act.id && (
                        <div className="mt-1.5 bg-gray-50 rounded-xl px-3.5 py-3 border border-gray-100">
                          <p className="text-[14px] text-gray-500 mb-1">ถึง: {act.emailTo}</p>
                          <p className="text-[14.5px] text-gray-600 leading-relaxed whitespace-pre-wrap">{act.emailBody}</p>
                        </div>
                      )}
                    </div>
                  )}
                  {act.type !== "email" && act.detail && (
                    <div className="mt-1 ml-5 px-2.5 py-1.5 rounded-lg bg-gray-50">
                      <p className="text-[13.5px] text-gray-400 leading-relaxed">{act.detail}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="h-2" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tab: จัดการ                                                           */
/* ------------------------------------------------------------------ */

const FALLBACK_STAGE_CFG = { label: "ไม่ทราบสถานะ", color: "text-gray-500", bg: "bg-gray-100" };
const getStageConfig = (key: PipelineStage) => PIPELINE_STAGES.find((s) => s.key === key) ?? FALLBACK_STAGE_CFG;

interface ReferContact {
  id: string; name: string; title: string; email: string; department: string; initials: string; color: string;
}

const EMAIL_TEMPLATES_LS_KEY = "hr_email_templates";

interface EmailTemplateItem { key: string; label: string; subject: string; body: string; custom?: boolean; }

const DEFAULT_EMAIL_TEMPLATES: EmailTemplateItem[] = [
  { key: "interested", label: "สนใจผู้สมัคร", subject: "สนใจโปรไฟล์ของคุณ", body: `สวัสดีครับ/ค่ะ,\n\nทางเราได้พิจารณาโปรไฟล์ของคุณแล้วและมีความสนใจเป็นอย่างมาก\n\nกรุณาแจ้งความสะดวกกลับมาเพื่อดำเนินการขั้นตอนถัดไปครับ/ค่ะ\n\nขอบคุณครับ/ค่ะ\nสมศรี HR` },
  {
    key: "notify_interest",
    label: "แจ้งผู้หางานว่าสนใจ",
    subject: "สนใจพูดคุยเรื่องโอกาส — [ตำแหน่งงาน]",
    body: `เรียน ผู้สมัครที่สนใจ

ทาง TechVibe Co., Ltd. มีความยินดีที่ได้พบโปรไฟล์ของคุณบนระบบ และรู้สึกสนใจเป็นอย่างมาก

"ที่นี่ชีวิตดี งานท้าทาย และทีมที่แข็งแกร่ง — คนที่นี่บอกว่าอยากแนะนำให้คนที่รัก"

เราเป็นบริษัทด้าน [Product / Tech] ที่กำลังขยายทีม Design อย่างจริงจัง และกำลังมองหา [ตำแหน่งงาน] ที่มีประสบการณ์ตรงและความสามารถที่โดดเด่น

สิ่งที่ทำให้เราสนใจโปรไฟล์ของคุณเป็นพิเศษ:
• ประสบการณ์ด้าน product design ตรงกับที่เราต้องการพอดี
• Background บ่งบอกถึง product quality ที่สูง
• Portfolio และ skill set เข้ากับ design direction ของทีมเราเป็นอย่างมาก

เราเชื่อว่าด้วยประสบการณ์ของคุณ จะเป็นประโยชน์อย่างมากต่อทิศทางของ product ที่เรากำลังพัฒนาอยู่

หากคุณสนใจ ยินดีนัดคุยเบื้องต้นแบบ informal เพื่อแนะนำทีมและ product direction ของเราให้ฟังก่อนได้เลย โดยไม่มีข้อผูกมัดใดๆ

รอฟังจากคุณด้วยความยินดี

คุณสมใจ รักษ์ดี
Head of People & Talent
TechVibe Co., Ltd.`,
  },
  { key: "interview", label: "นัดสัมภาษณ์", subject: "นัดสัมภาษณ์ตำแหน่ง Senior Product Designer", body: `สวัสดีครับ/ค่ะ,\n\nทางเราสนใจโปรไฟล์ของคุณและอยากนัดสัมภาษณ์เบื้องต้น\n\nกรุณาแจ้งวันและเวลาที่สะดวกให้ทราบด้วยนะครับ/ค่ะ\n\nขอบคุณครับ/ค่ะ\nสมศรี HR` },
  { key: "reject", label: "ปฏิเสธอย่างสุภาพ", subject: "ผลการพิจารณาใบสมัครงาน", body: `สวัสดีครับ/ค่ะ,\n\nขอบคุณสำหรับความสนใจในตำแหน่งงานของทางบริษัทครับ/ค่ะ\n\nทางเราได้พิจารณาโปรไฟล์ของคุณอย่างละเอียดแล้ว แต่ขณะนี้เราได้ตัดสินใจเดินหน้ากับผู้สมัครท่านอื่นที่ตรงกับความต้องการมากกว่าครับ/ค่ะ\n\nหวังว่าจะมีโอกาสร่วมงานกันในอนาคตครับ/ค่ะ\nขอบคุณครับ/ค่ะ` },
  { key: "docs", label: "ขอเอกสารเพิ่มเติม", subject: "ขอเอกสารประกอบการสมัครงาน", body: `สวัสดีครับ/ค่ะ,\n\nขอบคุณสำหรับการสมัครงาน\n\nทางเราขอเอกสารเพิ่มเติมดังนี้\n- Portfolio ล่าสุด (ถ้ามี)\n- Transcript ปริญญาตรี\n\nกรุณาส่งกลับมาภายใน 3 วันทำการครับ/ค่ะ\n\nขอบคุณครับ/ค่ะ` },
  { key: "offer", label: "แจ้งผลการสัมภาษณ์", subject: "ผลการสัมภาษณ์", body: `สวัสดีครับ/ค่ะ,\n\nทางเรายินดีแจ้งว่าคุณผ่านการสัมภาษณ์\n\nทางเราจะติดต่อกลับเพื่อแจ้งรายละเอียด Offer ในเร็วๆ นี้ครับ/ค่ะ\n\nขอบคุณครับ/ค่ะ` },
];

function loadEmailTemplates(): EmailTemplateItem[] {
  try {
    const saved = localStorage.getItem(EMAIL_TEMPLATES_LS_KEY);
    const custom: EmailTemplateItem[] = saved ? JSON.parse(saved) : [];
    return [...DEFAULT_EMAIL_TEMPLATES, ...custom];
  } catch {
    return [...DEFAULT_EMAIL_TEMPLATES];
  }
}

const COMPANY_CARD_HTML = `
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;border:1px solid #e5e7eb;border-radius:12px;background:#ffffff;overflow:hidden;">
  <tr>
    <td style="padding:16px 20px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <!-- Left: logo + name + tagline -->
          <td style="vertical-align:top;padding-right:24px;">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="width:48px;height:48px;background:linear-gradient(135deg,#0DC2FF 0%,#127EE3 100%);border-radius:10px;text-align:center;vertical-align:middle;" align="center">
                  <span style="font-family:Arial,sans-serif;font-size:13px;font-weight:900;color:#ffffff;">TV</span>
                </td>
                <td style="width:12px;"></td>
                <td style="vertical-align:middle;">
                  <div style="font-family:Arial,sans-serif;font-size:14px;font-weight:700;color:#1a1a2e;margin:0 0 2px 0;">TechVibe Co., Ltd.</div>
                  <div style="font-family:Arial,sans-serif;font-size:10px;color:#f43f5e;font-weight:700;margin:0;">&#9733;&#9733;&#9733; Dream Company &mdash; วิเศษสุด</div>
                </td>
              </tr>
            </table>
            <div style="font-family:Arial,sans-serif;font-size:11px;color:#9ca3af;font-style:italic;margin-top:10px;line-height:1.5;">
              &ldquo;ที่นี่ชีวิตดี งานท้าทาย และทีมที่แข็งแกร่ง &mdash; คนที่นี่บอกว่าอยากแนะนำให้คนที่รัก&rdquo;
            </div>
          </td>
          <!-- Right: score bars 2-col grid -->
          <td style="vertical-align:top;width:220px;" align="right">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding-right:16px;padding-bottom:6px;vertical-align:middle;">
                  <table cellpadding="0" cellspacing="0" border="0"><tr>
                    <td style="font-family:Arial,sans-serif;font-size:12px;color:#4b5563;width:56px;">ชีวิตดี</td>
                    <td style="width:60px;padding:0 6px;">
                      <table cellpadding="0" cellspacing="0" border="0" style="width:60px;"><tr>
                        <td style="height:6px;background:#f3f4f6;border-radius:3px;overflow:hidden;" width="60">
                          <div style="width:86%;height:6px;background:#0DC2FF;border-radius:3px;"></div>
                        </td>
                      </tr></table>
                    </td>
                    <td style="font-family:Arial,sans-serif;font-size:12px;font-weight:700;color:#0DC2FF;width:24px;text-align:right;">4.3</td>
                  </tr></table>
                </td>
                <td style="padding-bottom:6px;vertical-align:middle;">
                  <table cellpadding="0" cellspacing="0" border="0"><tr>
                    <td style="font-family:Arial,sans-serif;font-size:12px;color:#4b5563;width:56px;">งานดี</td>
                    <td style="width:60px;padding:0 6px;">
                      <table cellpadding="0" cellspacing="0" border="0" style="width:60px;"><tr>
                        <td style="height:6px;background:#f3f4f6;border-radius:3px;overflow:hidden;" width="60">
                          <div style="width:84%;height:6px;background:#0DC2FF;border-radius:3px;"></div>
                        </td>
                      </tr></table>
                    </td>
                    <td style="font-family:Arial,sans-serif;font-size:12px;font-weight:700;color:#0DC2FF;width:24px;text-align:right;">4.2</td>
                  </tr></table>
                </td>
              </tr>
              <tr>
                <td style="padding-right:16px;vertical-align:middle;">
                  <table cellpadding="0" cellspacing="0" border="0"><tr>
                    <td style="font-family:Arial,sans-serif;font-size:12px;color:#4b5563;width:56px;">เงินดี</td>
                    <td style="width:60px;padding:0 6px;">
                      <table cellpadding="0" cellspacing="0" border="0" style="width:60px;"><tr>
                        <td style="height:6px;background:#f3f4f6;border-radius:3px;overflow:hidden;" width="60">
                          <div style="width:64%;height:6px;background:#0DC2FF;border-radius:3px;"></div>
                        </td>
                      </tr></table>
                    </td>
                    <td style="font-family:Arial,sans-serif;font-size:12px;font-weight:700;color:#0DC2FF;width:24px;text-align:right;">3.2</td>
                  </tr></table>
                </td>
                <td style="vertical-align:middle;">
                  <table cellpadding="0" cellspacing="0" border="0"><tr>
                    <td style="font-family:Arial,sans-serif;font-size:12px;color:#4b5563;width:56px;">สังคมดี</td>
                    <td style="width:60px;padding:0 6px;">
                      <table cellpadding="0" cellspacing="0" border="0" style="width:60px;"><tr>
                        <td style="height:6px;background:#f3f4f6;border-radius:3px;overflow:hidden;" width="60">
                          <div style="width:78%;height:6px;background:#0DC2FF;border-radius:3px;"></div>
                        </td>
                      </tr></table>
                    </td>
                    <td style="font-family:Arial,sans-serif;font-size:12px;font-weight:700;color:#0DC2FF;width:24px;text-align:right;">3.9</td>
                  </tr></table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`.trim();

function buildEmailHtml(body: string): string {
  const escapedBody = body
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5f6f8;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f6f8;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0"
          style="background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;max-width:600px;">
          <tr>
            <td style="padding:28px 32px;">
              ${COMPANY_CARD_HTML}
              <div style="font-family:Arial,sans-serif;font-size:14px;color:#374151;line-height:1.75;">
                ${escapedBody}
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function saveCustomEmailTemplate(tpl: EmailTemplateItem) {
  try {
    const saved = localStorage.getItem(EMAIL_TEMPLATES_LS_KEY);
    const custom: EmailTemplateItem[] = saved ? JSON.parse(saved) : [];
    custom.push(tpl);
    localStorage.setItem(EMAIL_TEMPLATES_LS_KEY, JSON.stringify(custom));
  } catch { /* noop */ }
}

const MOCK_TIMELINE: ActivityItem[] = [
  { id: "tl9", actor: "คุณแพม HR", actorInitials: "พม", actorColor: "bg-[#127EE3]", type: "email", text: "ส่งต่อให้ Hiring Manager", detail: "ส่งต่อโปรไฟล์ให้คุณวิชัย Manager เพื่อพิจารณา", emailTo: "wichai.manager@company.com", time: "28 เม.ย. 14:15" },
  { id: "tl8", actor: "สมศรี HR", actorInitials: "สร", actorColor: "bg-[#127EE3]", type: "email", text: "ส่งอีเมลนัดสัมภาษณ์", detail: "นัดสัมภาษณ์วันที่ 30 เม.ย. 10:00–11:00", emailTo: REVEALED_EMAIL, time: "เมื่อวาน 10:30" },
  { id: "tl7", actor: "สมศรี HR", actorInitials: "สร", actorColor: "bg-[#127EE3]", type: "stage", text: "ย้ายสถานะเป็น ลิสต์ต้องนัดสัมภาษณ์", time: "เมื่อวาน 09:55" },
  { id: "tl6", actor: "วิชัย Manager", actorInitials: "วช", actorColor: "bg-emerald-500", type: "note", text: "เพิ่มโน้ต", detail: "Portfolio ดีมาก น่าสนใจ ลองนัดคุยดู", time: "วันนี้ 11:20" },
  { id: "tl5", actor: "สมศรี HR", actorInitials: "สร", actorColor: "bg-[#127EE3]", type: "stage", text: "ย้ายสถานะเป็น ชอร์ตลิสต์", time: "วันนี้ 09:43" },
  { id: "tl4", actor: "สมศรี HR", actorInitials: "สร", actorColor: "bg-[#127EE3]", type: "reveal", text: "เปิดดูเรซูเม่", detail: "เปิดดูข้อมูลการติดต่อและเรซูเม่เต็ม", time: "วันนี้ 09:42" },
  { id: "tl3", actor: "ระบบ", actorInitials: "ระ", actorColor: "bg-gray-400", type: "chat", text: "ผู้สมัครส่งใบสมัคร", detail: "ตำแหน่ง Senior Product Designer — Bangkok, TH", time: "25 เม.ย. 2568" },
];

function timelineIcon(type: ActivityItem["type"], text: string) {
  const isHired = text.includes("รับเข้าทำงาน");
  const isPassed = text.includes("ผ่านสัมภาษณ์");
  const isRejected = text.includes("ไม่ผ่าน") || text.includes("ยกเลิก");
  const isInterview = text.includes("สัมภาษณ์") || text.includes("นัด");
  const isOffer = text.includes("Offer");

  if (type === "chat") return (
    <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white shadow-sm flex items-center justify-center flex-shrink-0">
      <FileText className="w-3.5 h-3.5 text-gray-500" />
    </div>
  );
  if (type === "reveal") return (
    <div className="w-8 h-8 rounded-full bg-sky-50 border-2 border-white shadow-sm flex items-center justify-center flex-shrink-0">
      <Eye className="w-3.5 h-3.5 text-sky-500" />
    </div>
  );
  if (type === "email") return (
    <div className="w-8 h-8 rounded-full bg-blue-50 border-2 border-white shadow-sm flex items-center justify-center flex-shrink-0">
      <Mail className="w-3.5 h-3.5 text-blue-500" />
    </div>
  );
  if (type === "note") return (
    <div className="w-8 h-8 rounded-full bg-amber-50 border-2 border-white shadow-sm flex items-center justify-center flex-shrink-0">
      <MessageCircle className="w-3.5 h-3.5 text-amber-500" />
    </div>
  );
  if (type === "file") return (
    <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white shadow-sm flex items-center justify-center flex-shrink-0">
      <Paperclip className="w-3.5 h-3.5 text-gray-500" />
    </div>
  );
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

// ─── Timeline helpers ─────────────────────────────────────────────────────────
const TL_TYPE_COLOR: Record<ActivityItem["type"], string> = {
  stage:  "#3B82F6",
  note:   "#F59E0B",
  file:   "#6B7280",
  reveal: "#6B7280",
  email:  "#10B981",
  chat:   "#10B981",
};

function tlGroupByDate(items: ActivityItem[]): { label: string; items: ActivityItem[] }[] {
  const groups = new Map<string, ActivityItem[]>();
  for (const item of items) {
    const t = item.time ?? "";
    let label = "ก่อนหน้า";
    if (t.startsWith("วันนี้")) label = "วันนี้";
    else if (t.startsWith("เมื่อวาน")) label = "เมื่อวาน";
    else {
      const m = t.match(/^(\d{1,2}\s[\u0E00-\u0E7F.]+(?:\s\d{4})?)/);
      label = m ? m[1] : t.split(" ").slice(0, 2).join(" ");
    }
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(item);
  }
  return Array.from(groups.entries()).map(([label, items]) => ({ label, items }));
}

function tlExtractTime(t: string): string {
  const m = t.match(/(\d{1,2}:\d{2})/);
  if (m) return m[1];
  if (t.includes("เมื่อกี้") || t.includes("พึ่งเมื่อกี้")) return "เพิ่งเมื่อกี้";
  return "";
}

// Inline stage progress bar for timeline tab
const TL_STAGES: PipelineStage[] = ["new", "shortlist", "review", "to_interview", "interview", "passed", "offer", "hired"];
const TL_STAGE_LABELS: Record<string, string> = {
  new: "ใหม่", shortlist: "คัดกรอง", review: "คัดกรอง",
  to_interview: "สัมภาษณ์", interview: "สัมภาษณ์", passed: "สัมภาษณ์",
  offer: "Offer", hired: "รับเข้า",
};
const TL_MAIN_STAGES = [
  { key: "new",          label: "ใหม่" },
  { key: "shortlist",    label: "คัดกรอง" },
  { key: "to_interview", label: "สัมภาษณ์" },
  { key: "offer",        label: "Offer" },
  { key: "hired",        label: "รับเข้า" },
] as const;

function TimelineProgressBar({ current }: { current?: PipelineStage }) {
  if (!current || current === "rejected") return null;
  const stageOrder: PipelineStage[] = ["new", "shortlist", "to_interview", "offer", "hired"];
  const mainMap: Partial<Record<PipelineStage, number>> = {
    new: 0, shortlist: 1, review: 1,
    to_interview: 2, interview: 2, passed: 2,
    offer: 3, hired: 4,
  };
  const currentIdx = mainMap[current] ?? 0;

  return (
    <div className="px-6 pt-4 pb-3 bg-[#F7F9FC] border-b border-gray-100 flex-shrink-0">
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">ความคืบหน้า</p>
      <div className="flex items-center gap-1">
        {TL_MAIN_STAGES.map((s, i) => {
          const isPast = currentIdx > i;
          const isCurrent = currentIdx === i;
          return (
            <div key={s.key} className="flex items-center gap-1 flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                  isPast    ? "border-[#127EE3] bg-[#127EE3]" :
                  isCurrent ? "border-[#127EE3] bg-white" :
                              "border-gray-200 bg-white"
                }`}>
                  {isPast
                    ? <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    : <div className={`w-2 h-2 rounded-full ${isCurrent ? "bg-[#127EE3]" : "bg-gray-200"}`} />
                  }
                </div>
                <span className={`text-[10.5px] font-semibold whitespace-nowrap ${
                  isPast || isCurrent ? "text-[#127EE3]" : "text-gray-300"
                }`}>{s.label}</span>
              </div>
              {i < TL_MAIN_STAGES.length - 1 && (
                <div className={`flex-1 h-px mb-3.5 ${isPast ? "bg-[#127EE3]" : "bg-gray-200"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TimelineContent({ store, currentStage }: { store: ActivityStore; currentStage?: PipelineStage }) {
  const allItems = [...store.activities, ...MOCK_TIMELINE];
  const groups = tlGroupByDate(allItems);

  return (
    <div className="flex flex-col h-full">
      {/* Progress bar */}
      <TimelineProgressBar current={currentStage} />

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-4">
          ประวัติทั้งหมด ({allItems.length} รายการ)
        </p>

        <div className="space-y-6">
          {groups.map((group) => (
            <div key={group.label}>
              {/* Date header */}
              <div className="flex items-center gap-2.5 mb-3">
                <span className="text-[14px] font-semibold text-gray-500 whitespace-nowrap">{group.label}</span>
                <div className="flex-1 border-t border-gray-100" />
              </div>

              {/* Events */}
              <div className="relative">
                <div className="absolute left-[5px] top-3 bottom-3 w-px bg-gray-100" />
                <div className="space-y-1.5">
                  {group.items.map((item) => {
                    const dot = TL_TYPE_COLOR[item.type];
                    const timeLabel = tlExtractTime(item.time);
                    const stageName = item.type === "stage"
                      ? item.text.replace(/.*เป็น\s?/, "").replace(/.*สถานะ\s?/, "")
                      : null;
                    return (
                      <div key={item.id} className="relative flex gap-3">
                        {/* Dot */}
                        <div className="relative z-10 mt-[14px] flex-shrink-0">
                          <div className="w-[11px] h-[11px] rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: dot }} />
                        </div>
                        {/* Card */}
                        <div className="flex-1 min-w-0 bg-[#F7F9FC] rounded-xl px-3.5 py-2.5">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-[14.5px] font-semibold text-[#1A1A2E] leading-snug">
                              {item.type === "stage" && stageName
                                ? <>เปลี่ยนสถานะเป็น{" "}<span style={{ color: dot }}>{stageName}</span></>
                                : item.text
                              }
                            </p>
                            {timeLabel && (
                              <span className="text-[13px] text-gray-400 whitespace-nowrap flex-shrink-0 mt-0.5 tabular-nums">
                                {timeLabel}
                              </span>
                            )}
                          </div>
                          {item.detail && (
                            <p className="text-[13.5px] text-gray-500 mt-0.5 leading-relaxed">{item.detail}</p>
                          )}
                          {item.emailTo && !item.detail && (
                            <p className="text-[13.5px] text-gray-400 mt-0.5">ถึง: {item.emailTo}</p>
                          )}
                          <p className="text-[13px] text-gray-400 mt-1">โดย {item.actor}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="h-4" />
      </div>

      {/* Legend */}
      <div className="flex-shrink-0 border-t border-gray-100 bg-white px-6 py-3 flex items-center gap-4 flex-wrap">
        {([
          { type: "stage" as const, label: "เปลี่ยนสถานะ" },
          { type: "note"  as const, label: "โน้ต" },
          { type: "file"  as const, label: "ไฟล์" },
          { type: "email" as const, label: "อีเมล/ส่งต่อ" },
        ]).map((l) => (
          <div key={l.type} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: TL_TYPE_COLOR[l.type] }} />
            <span className="text-[13px] text-gray-500">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActionBtn({ icon, label, primary, destructive, onClick }: {
  icon: ReactNode; label: string;
  primary?: boolean; destructive?: boolean;
  onClick?: () => void;
}) {
  const base = "flex flex-col items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl border text-[13.5px] font-medium transition-all text-center leading-tight";
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

function ManageContent({ store, initialStage = "new", onStageChange, applicant, onBottomBarChange, isResumeTab, isUnlockedPreview, onSwitchToManage }: { store: ActivityStore; initialStage?: PipelineStage; onStageChange?: (s: PipelineStage) => void; applicant?: ApplicantRow; onBottomBarChange?: (node: React.ReactNode) => void; isResumeTab?: boolean; isUnlockedPreview?: boolean; onSwitchToManage?: () => void }) {
  const [stage, setStage] = useState<PipelineStage>(initialStage);

  useEffect(() => {
    setStage(initialStage);
  }, [initialStage]);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [stageDropdownOpen, setStageDropdownOpen] = useState(false);
  const [prevStage, setPrevStage] = useState<PipelineStage | null>(null);
  const [callLogs, setCallLogs] = useState<{ id: number; label: string }[]>([]);
  const [undoEntry, setUndoEntry] = useState<{ id: number; label: string; index: number } | null>(null);
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // workflow modal states
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
  const [hiredNote, setHiredNote] = useState(applicant?.hiredNote ?? "");
  const [hiredNoteDraft, setHiredNoteDraft] = useState(applicant?.hiredNote ?? "");

  useEffect(() => {
    setHiredNote(applicant?.hiredNote ?? "");
    setHiredNoteDraft(applicant?.hiredNote ?? "");
  }, [applicant?.id, applicant?.hiredNote]);
  const [hiredNoteEditing, setHiredNoteEditing] = useState(false);
  // refer panel state
  const [referQuery, setReferQuery] = useState("");
  const [referContacts, setReferContacts] = useState<ReferContact[]>([]);
  const [referEmailTo, setReferEmailTo] = useState("");
  const _defaultReferTpl = emailTemplates.find((t) => t.name === "ส่งเรซูเม่ให้ผู้พิจารณา");
  const [referTemplateId, setReferTemplateId] = useState<number | "">(_defaultReferTpl?.id ?? "");
  const [referEmailSubject, setReferEmailSubject] = useState(_defaultReferTpl?.subject ?? "");
  const [referEmailBody, setReferEmailBody] = useState(_defaultReferTpl?.body ?? "");
  // email compose (re-send) state
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [emailTo, setEmailTo] = useState(REVEALED_EMAIL);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [emailTemplateList, setEmailTemplateList] = useState<EmailTemplateItem[]>(() => loadEmailTemplates());
  const [showBottomMore, setShowBottomMore] = useState(false);
  const [showReferPreview, setShowReferPreview] = useState(false);
  type ReviewStatus = "รอพิจารณา" | "สนใจเรียกสัมภาษณ์" | "ไม่สนใจเรียกสัมภาษณ์";
  type AvailabilitySlot = { date: string; time: string };
  type ReviewerEntry = {
    id: string; name: string; email: string; department: string; sentAt: string;
    status: ReviewStatus; respondedAt?: string; note?: string;
    availabilitySlots?: AvailabilitySlot[];
  };
  const mapReviewers = (src: ApplicantRow["reviewers"], forwardedAt?: string): ReviewerEntry[] =>
    (src ?? []).map((r, i) => ({
      id: `r-init-${i}`,
      name: r.name,
      email: r.email ?? "อีเมล",
      department: r.role,
      sentAt: forwardedAt ?? "–",
      status: r.status === "interested" ? "สนใจเรียกสัมภาษณ์" : r.status === "not_sure" ? "ไม่สนใจเรียกสัมภาษณ์" : "รอพิจารณา",
      respondedAt: r.respondedAt,
      note: r.comment,
      availabilitySlots: r.availableTimes?.map((t) => ({ date: t, time: "" })),
    }));

  const [reviewers, setReviewers] = useState<ReviewerEntry[]>(() => mapReviewers(applicant?.reviewers, applicant?.forwardedAt));

  useEffect(() => {
    setReviewers(mapReviewers(applicant?.reviewers, applicant?.forwardedAt));
  }, [applicant?.id, applicant?.reviewers, applicant?.forwardedAt]);

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

  const [rejectionReason, setRejectionReason] = useState<string | null>(applicant?.rejectionReason ?? null);

  useEffect(() => {
    setRejectionReason(applicant?.rejectionReason ?? null);
  }, [applicant?.id, applicant?.rejectionReason]);

  const completeStageChange = (s: PipelineStage, msg?: string, skipUndo?: boolean) => {
    if (!skipUndo) setPrevStage(stage);
    setStage(s);
    onStageChange?.(s);
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
    setStage("rejected");
    onStageChange?.("rejected");
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
    const t = emailTemplateList.find((t) => t.key === key);
    if (!t) return;
    setSelectedTemplate(key);
    setEmailSubject(t.subject);
    setEmailBody(t.body);
  };

  const openEmailCompose = () => {
    const defaultTemplateKey: Partial<Record<typeof stage, string>> = {
      new: "notify_interest", shortlist: "notify_interest",
      to_interview: "interview", interview: "interview",
      rejected: "reject",
    };
    const tplKey = defaultTemplateKey[stage];
    const tpl = tplKey ? emailTemplateList.find((t) => t.key === tplKey) : null;
    if (tpl) {
      setSelectedTemplate(tpl.key);
      setEmailSubject(tpl.subject);
      setEmailBody(tpl.body);
    } else {
      setSelectedTemplate(null);
      setEmailSubject("");
      setEmailBody("");
    }
    setShowEmailPreview(false);
    setActiveAction("emailCompose");
  };

  const handleSaveEmailTemplate = () => {
    const name = window.prompt("ชื่อเทมเพลต:", emailSubject.trim() || "เทมเพลตใหม่");
    if (!name?.trim()) return;
    const newTpl: EmailTemplateItem = {
      key: `custom_${Date.now()}`,
      label: name.trim(),
      subject: emailSubject,
      body: emailBody,
      custom: true,
    };
    saveCustomEmailTemplate(newTpl);
    setEmailTemplateList(loadEmailTemplates());
    setSelectedTemplate(newTpl.key);
  };

  const handleSendEmail = () => {
    if (!emailSubject.trim() || !emailBody.trim()) return;
    const emailHtml = buildEmailHtml(emailBody);
    store.addActivity({
      id: `a${Date.now()}`, actor: "สมศรี HR", actorInitials: "สร", actorColor: "bg-[#127EE3]",
      type: "email", text: "ส่งอีเมล", emailSubject, emailBody, emailHtml, emailTo, time: "เพิ่งเมื่อกี้",
    });
    setEmailSubject(""); setEmailBody(""); setSelectedTemplate(null); setShowEmailPreview(false); setActiveAction(null);
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
    if (stage === "review") {
      setAlertMsg("ส่งต่อให้พิจารณาเรียบร้อยแล้ว");
    } else {
      completeStageChange("review");
    }
  };

  const handleScheduleConfirm = (date: Date, time: string, duration: number, type: string, emailSent: boolean, interviewers: InterviewerContact[]) => {
    const isNextRound = stage === "passed";
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

  // Sync bottom bar actions to ResumePanel when stage or tab changes
  useEffect(() => {
    if (!onBottomBarChange) return;
    if (!isResumeTab || !isUnlockedPreview) { onBottomBarChange(null); return; }

    const goManage = (action?: ActiveAction) => {
      if (onSwitchToManage) onSwitchToManage();
      if (action) setActiveAction(action);
    };
    const goEmail = () => { openEmailCompose(); if (onSwitchToManage) onSwitchToManage(); };

    type BtnDef = { label: string; icon: React.ReactNode; onClick: () => void; primary?: boolean; destructive?: boolean };
    const allActions: BtnDef[] = (() => {
      switch (stage) {
        case "new": return [
          { label: "ชอร์ตลิสต์", icon: <ThumbsUp className="w-3.5 h-3.5" />, onClick: () => { completeStageChange("shortlist"); if (onSwitchToManage) onSwitchToManage(); }, primary: true },
          { label: "ส่งอีเมลหาผู้สมัคร", icon: <Mail className="w-3.5 h-3.5" />, onClick: goEmail },
          { label: "ไม่ผ่านการคัดเลือก", icon: <ThumbsDown className="w-3.5 h-3.5" />, onClick: () => completeStageChange("rejected"), destructive: true },
        ];
        case "shortlist": return [
          { label: "ส่งต่อให้พิจารณา", icon: <Users2 className="w-3.5 h-3.5" />, onClick: () => goManage("refer"), primary: true },
          { label: "ลงตารางนัดสัมภาษณ์", icon: <Calendar className="w-3.5 h-3.5" />, onClick: () => goManage("schedule"), primary: true },
          { label: "ส่งอีเมลหาผู้สมัคร", icon: <Mail className="w-3.5 h-3.5" />, onClick: goEmail },
          { label: "ไม่ผ่านการคัดเลือก", icon: <ThumbsDown className="w-3.5 h-3.5" />, onClick: () => completeStageChange("rejected"), destructive: true },
        ];
        case "review": return [
          { label: "ลงตารางนัดสัมภาษณ์", icon: <Calendar className="w-3.5 h-3.5" />, onClick: () => goManage("schedule"), primary: true },
          { label: "ย้ายไปลิสต์ต้องนัดสัมภาษณ์", icon: <Calendar className="w-3.5 h-3.5" />, onClick: () => { completeStageChange("to_interview"); }, primary: true },
          { label: "ส่งอีเมลหาผู้สมัคร", icon: <Mail className="w-3.5 h-3.5" />, onClick: goEmail },
        ];
        case "to_interview": return [
          { label: "ลงตารางนัดสัมภาษณ์", icon: <Calendar className="w-3.5 h-3.5" />, onClick: () => goManage("schedule"), primary: true },
          { label: "ส่งอีเมลหาผู้สมัคร", icon: <Mail className="w-3.5 h-3.5" />, onClick: goEmail },
          { label: "ไม่ผ่านการคัดเลือก", icon: <ThumbsDown className="w-3.5 h-3.5" />, onClick: () => completeStageChange("rejected"), destructive: true },
        ];
        case "interview": return [
          { label: "บันทึกผลสัมภาษณ์", icon: <FileText className="w-3.5 h-3.5" />, onClick: () => { if (onSwitchToManage) onSwitchToManage(); handleOpenResult(); }, primary: true },
          { label: "เปลี่ยนวันนัด", icon: <RefreshCw className="w-3.5 h-3.5" />, onClick: () => goManage("reschedule") },
          { label: "ส่งอีเมลหาผู้สมัคร", icon: <Mail className="w-3.5 h-3.5" />, onClick: goEmail },
        ];
        case "passed": return [
          { label: "รับเข้าทำงาน", icon: <Award className="w-3.5 h-3.5" />, onClick: () => goManage("hire"), primary: true },
          { label: "ส่งอีเมลหาผู้สมัคร", icon: <Mail className="w-3.5 h-3.5" />, onClick: goEmail },
          { label: "ไม่ผ่าน / ยกเลิก", icon: <ThumbsDown className="w-3.5 h-3.5" />, onClick: () => completeStageChange("rejected"), destructive: true },
        ];
        case "offer": return [
          { label: "รับเข้าทำงาน", icon: <Award className="w-3.5 h-3.5" />, onClick: () => goManage("hire"), primary: true },
          { label: "ส่งอีเมลหาผู้สมัคร", icon: <Mail className="w-3.5 h-3.5" />, onClick: goEmail },
          { label: "ไม่รับข้อเสนอ", icon: <XCircle className="w-3.5 h-3.5" />, onClick: () => completeTerminalAction("ไม่รับข้อเสนอ"), destructive: true },
        ];
        case "hired": return [
          { label: "บันทึกเพิ่มเติม", icon: <FileText className="w-3.5 h-3.5" />, onClick: () => goManage() },
          { label: "ส่งอีเมลหาผู้สมัคร", icon: <Mail className="w-3.5 h-3.5" />, onClick: goEmail },
        ];
        case "rejected": return [
          { label: "ย้ายกลับไปชอร์ตลิสต์", icon: <ThumbsUp className="w-3.5 h-3.5" />, onClick: () => { setRejectionReason(null); completeStageChange("shortlist"); if (onSwitchToManage) onSwitchToManage(); }, primary: true },
          { label: "ส่งอีเมลหาผู้สมัคร", icon: <Mail className="w-3.5 h-3.5" />, onClick: goEmail },
        ];
        default: return [
          { label: "ส่งอีเมลหาผู้สมัคร", icon: <Mail className="w-3.5 h-3.5" />, onClick: goEmail },
        ];
      }
    })();

    const primary = allActions.slice(0, 3);
    const overflow = allActions.slice(3);

    onBottomBarChange(
      <div className="flex items-center gap-2 relative">
        {primary.map((a) => (
          <button key={a.label} onClick={a.onClick}
            className={`flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-[14.5px] font-semibold whitespace-nowrap transition-all ${
              a.primary
                ? "bg-gradient-to-r from-[#01BFF9] to-[#019EFC] text-white shadow-sm shadow-[#019EFC]/20 hover:opacity-90"
                : a.destructive
                ? "border border-red-200 text-red-500 bg-white hover:bg-red-50"
                : "border border-gray-200 text-gray-600 bg-white hover:border-[#127EE3] hover:text-[#127EE3] hover:bg-blue-50"
            }`}>
            {a.icon}{a.label}
          </button>
        ))}
        {overflow.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setShowBottomMore((v) => !v)}
              className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl border border-gray-200 text-gray-500 bg-white hover:border-gray-300 hover:bg-gray-50 transition-colors text-[14.5px] font-medium"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {showBottomMore && (
              <div className="absolute bottom-full right-0 mb-2 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden z-10 min-w-[180px]">
                {overflow.map((a) => (
                  <button key={a.label} onClick={() => { a.onClick(); setShowBottomMore(false); }}
                    className={`flex items-center gap-2 w-full px-4 py-2.5 text-[14.5px] text-left hover:bg-gray-50 transition-colors ${a.destructive ? "text-red-500" : "text-gray-700"}`}>
                    {a.icon}{a.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, isResumeTab, isUnlockedPreview, showBottomMore]);

  // ── Pipeline steps definition ──────────────────────────────────────────────
  type StepKey = "shortlist" | "review" | "to_interview" | "interview" | "passed" | "offer" | "hired";
  const STEPS: { key: StepKey; label: string; desc: string; icon: React.ReactNode }[] = [
    { key: "shortlist",    label: "คัดกรอง",         desc: "ตรวจ resume เบื้องต้น เห็นว่าผ่านเกณฑ์",             icon: <ThumbsUp className="w-4 h-4" /> },
    { key: "review",       label: "ส่งให้พิจารณา",   desc: "ส่งโปรไฟล์ให้ผู้จัดการหรือทีมช่วยตัดสิน",          icon: <Users2 className="w-4 h-4" /> },
    { key: "to_interview", label: "รอนัดสัมภาษณ์",   desc: "ยืนยันจะเรียกสัมภาษณ์ รอจัดตาราง",                 icon: <Calendar className="w-4 h-4" /> },
    { key: "interview",    label: "สัมภาษณ์",        desc: "นัดหมายแล้ว กำลังรอสัมภาษณ์หรือสัมภาษณ์เสร็จแล้ว", icon: <Clock className="w-4 h-4" /> },
    { key: "passed",       label: "ผ่านสัมภาษณ์",    desc: "สัมภาษณ์ผ่าน รอส่ง Offer",                          icon: <CheckCircle2 className="w-4 h-4" /> },
    { key: "offer",        label: "Offer",            desc: "ส่ง Offer แล้ว รอผู้สมัครตอบรับ",                  icon: <FileText className="w-4 h-4" /> },
    { key: "hired",        label: "รับเข้าทำงาน",    desc: "ผู้สมัครตอบรับ พร้อมเข้างานแล้ว",                   icon: <Award className="w-4 h-4" /> },
  ];

  const STAGE_RANK: Record<PipelineStage, number> = {
    new: -1, shortlist: 0, review: 1, to_interview: 2, interview: 3, passed: 4, offer: 5, hired: 6, rejected: -2,
  };
  const currentRank = STAGE_RANK[stage] ?? -1;

  const ALL_STEPPER: { key: PipelineStage; short: string }[] = [
    { key: "new",          short: "ใหม่" },
    { key: "shortlist",    short: "คัดกรอง" },
    { key: "review",       short: "ส่งต่อ" },
    { key: "to_interview", short: "รอนัด" },
    { key: "interview",    short: "สัมภาษณ์" },
    { key: "passed",       short: "ผ่าน" },
    { key: "offer",        short: "Offer" },
    { key: "hired",        short: "รับเข้า" },
  ];

  return (
    <>
    <div className="flex flex-col h-full">

      {/* ── Horizontal pipeline stepper ── */}
      <div className="flex-shrink-0 bg-[#F7F9FC] border-b border-gray-100 px-4 py-3">
        {stage === "rejected" ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-50 border border-red-100">
              <ThumbsDown className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
              <span className="text-[14.5px] font-semibold text-red-600">ไม่ผ่าน / ยกเลิก</span>
              {rejectionReason && <span className="text-[13.5px] text-red-400">— {rejectionReason}</span>}
            </div>
            <button onClick={() => { setRejectionReason(null); completeStageChange("shortlist"); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-[14px] font-semibold text-gray-700 hover:border-[#127EE3] hover:text-[#127EE3] transition-colors flex-shrink-0">
              <ThumbsUp className="w-3 h-3" />ย้ายกลับ
            </button>
          </div>
        ) : (
          <div className="flex items-center overflow-x-auto gap-0 pb-0.5" style={{ scrollbarWidth: "none" }}>
            {ALL_STEPPER.map((s, i) => {
              const isPast = currentRank > (s.key === "new" ? -1 : STAGE_RANK[s.key]);
              const isCurrent = stage === s.key;
              const cfg = PIPELINE_STAGES.find((p) => p.key === s.key)!;
              return (
                <div key={s.key} className="flex items-center flex-shrink-0">
                  <div className="flex flex-col items-center gap-1 px-2 py-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${
                      isPast ? "bg-emerald-500 text-white" :
                      isCurrent ? `${cfg.bg} ${cfg.color} ring-2 ring-offset-1 ring-current` :
                      "bg-gray-200 text-gray-400"
                    }`}>
                      {isPast ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span>{i + 1}</span>}
                    </div>
                    <span className={`text-[10.5px] font-semibold whitespace-nowrap ${
                      isCurrent ? cfg.color : isPast ? "text-emerald-600" : "text-gray-400"
                    }`}>{s.short}</span>
                  </div>
                  {i < ALL_STEPPER.length - 1 && (
                    <div className={`w-3 h-px flex-shrink-0 ${isPast ? "bg-emerald-300" : "bg-gray-200"}`} />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Toast / Alert banner ── */}
      {(alertMsg && alertMsg !== "__undo__") && (
        <div className={`mx-5 mt-4 flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl text-[14.5px] border shadow-sm ${alertMsg.startsWith("__stage__") ? "bg-white border-gray-200" : "bg-emerald-50 border-emerald-200"}`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-500" />
            <span className="text-gray-700">{alertMsg.replace("__stage__", "")}</span>
          </div>
          {prevStage && alertMsg.startsWith("__stage__") && (
            <button onClick={handleUndo} className="shrink-0 text-[14px] font-semibold text-[#127EE3] hover:underline transition-colors whitespace-nowrap">
              ย้อนกลับ
            </button>
          )}
        </div>
      )}

      {/* ── Current stage action area ── */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">

        {/* Current stage header card */}
        {stage !== "rejected" && (() => {
          const cfg = PIPELINE_STAGES.find((p) => p.key === stage)!;
          const currentStep = STEPS.find((s) => s.key === stage);
          return (
            <div className={`rounded-2xl border-2 overflow-hidden ${cfg.bg.replace("bg-", "border-").replace("50", "200")} bg-white`}>
              <div className={`flex items-center gap-3 px-4 py-3 ${cfg.bg}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${cfg.color === "text-gray-600" ? "bg-gray-200" : cfg.bg.replace("50","200")} ${cfg.color}`}>
                  {stage === "new" ? <Star className="w-4 h-4" /> :
                   stage === "shortlist" ? <ThumbsUp className="w-4 h-4" /> :
                   stage === "review" ? <Users2 className="w-4 h-4" /> :
                   stage === "to_interview" ? <Calendar className="w-4 h-4" /> :
                   stage === "interview" ? <Clock className="w-4 h-4" /> :
                   stage === "passed" ? <CheckCircle2 className="w-4 h-4" /> :
                   stage === "offer" ? <FileText className="w-4 h-4" /> :
                   <Award className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <p className={`text-[15.5px] font-bold ${cfg.color}`}>{cfg.label}</p>
                  <p className="text-[14px] text-gray-500">{currentStep?.desc ?? "ผู้สมัครใหม่ รอ HR ตรวจสอบ resume"}</p>
                </div>
                <span className={`text-[12px] font-bold px-2.5 py-1 rounded-full ${cfg.bg.replace("50","100")} ${cfg.color}`}>สถานะปัจจุบัน</span>
              </div>

              {/* Stage-specific actions inside card */}
              <div className="px-4 pb-4 pt-3 bg-white space-y-3">

                {/* ── new ── */}
                {stage === "new" && (
                  <div className="space-y-2.5">
                    <p className="text-[13.5px] font-semibold text-gray-400">ขั้นตอนต่อไป — เลือกทำอย่างใดอย่างหนึ่ง:</p>
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => completeStageChange("shortlist")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#01BFF9] to-[#019EFC] text-white text-[15px] font-bold shadow-sm hover:opacity-90 transition-opacity">
                        <ThumbsUp className="w-4 h-4" />คัดกรองผ่าน
                      </button>
                      <button onClick={() => completeStageChange("rejected")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-500 text-[15px] font-medium bg-white hover:bg-red-50 transition-colors">
                        <ThumbsDown className="w-4 h-4" />ไม่ผ่านการคัดกรอง
                      </button>
                    </div>
                  </div>
                )}

                {/* ── shortlist ── */}
                {stage === "shortlist" && (
                  <div className="space-y-2.5">
                    <p className="text-[13.5px] font-semibold text-gray-400">ตอนนี้ต้องทำอะไร?</p>
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => setActiveAction("refer")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#01BFF9] to-[#019EFC] text-white text-[15px] font-bold shadow-sm hover:opacity-90 transition-opacity">
                        <Users2 className="w-4 h-4" />ส่งให้ผู้จัดการพิจารณา
                      </button>
                      <button onClick={() => setActiveAction("schedule")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#127EE3] text-[#127EE3] text-[15px] font-semibold bg-white hover:bg-blue-50 transition-colors">
                        <Calendar className="w-4 h-4" />นัดสัมภาษณ์เลย
                      </button>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={openEmailCompose}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-gray-600 text-[14px] font-medium bg-white hover:border-[#127EE3] hover:text-[#127EE3] transition-colors">
                        <Mail className="w-3.5 h-3.5" />ส่งอีเมลผู้สมัคร
                      </button>
                      <button onClick={() => completeTerminalAction("ไม่ผ่านการคัดกรอง")}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 text-red-500 text-[14px] font-medium bg-white hover:bg-red-50 transition-colors">
                        <ThumbsDown className="w-3.5 h-3.5" />ไม่ผ่าน
                      </button>
                    </div>
                  </div>
                )}

                {/* ── review ── */}
                {stage === "review" && (
                  <div className="space-y-2.5">
                    <p className="text-[13.5px] font-semibold text-gray-400">รอผลจากผู้พิจารณา — สิ่งที่ทำได้ตอนนี้:</p>
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => setActiveAction("refer")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#01BFF9] to-[#019EFC] text-white text-[15px] font-bold shadow-sm hover:opacity-90 transition-opacity">
                        <Users2 className="w-4 h-4" />ส่งให้คนอื่นพิจารณาเพิ่ม
                      </button>
                      <button onClick={() => completeStageChange("to_interview")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#127EE3] text-[#127EE3] text-[15px] font-semibold bg-white hover:bg-blue-50 transition-colors">
                        <Calendar className="w-4 h-4" />ผ่าน → รอนัดสัมภาษณ์
                      </button>
                    </div>
                    {reviewers.length > 0 && (
                      <div className="space-y-2 pt-1">
                        {reviewers.map((r) => {
                          const badge =
                            r.status === "สนใจเรียกสัมภาษณ์"     ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                            r.status === "ไม่สนใจเรียกสัมภาษณ์"  ? "bg-red-50 text-red-600 border-red-200" :
                                                                      "bg-amber-50 text-amber-700 border-amber-200";
                          const isRecording = recordingId === r.id;
                          return (
                            <div key={r.id} className="bg-gray-50 rounded-xl border border-gray-200 px-3.5 py-3 space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-[15px] font-semibold text-[#1A1A2E] truncate">{r.name}</p>
                                <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[13px] font-semibold border ${badge}`}>{r.status}</span>
                              </div>
                              <p className="text-[13.5px] text-gray-400">{r.email} · ส่งเมื่อ {r.sentAt}</p>
                              {r.note && <p className="text-[14px] text-gray-600 italic">"{r.note}"</p>}
                              {!isRecording && r.status === "รอพิจารณา" && (
                                <div className="flex gap-1.5">
                                  <button onClick={() => openRecordModal(r.id)}
                                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#127EE3] text-[#127EE3] text-[13.5px] font-semibold hover:bg-blue-50 transition-colors">
                                    <FileText className="w-3 h-3" />ระบุผล
                                  </button>
                                  <button onClick={() => { store.addActivity({ id: `a${Date.now()}`, actor: "สมศรี HR", actorInitials: "สร", actorColor: "bg-[#127EE3]", type: "email", text: `ส่งอีเมลเตือน ${r.name}`, time: "เพิ่งเมื่อกี้" }); setAlertMsg("ส่งอีเมลเตือนแล้ว"); }}
                                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-gray-200 text-gray-500 text-[13.5px] hover:bg-gray-50 transition-colors">
                                    <Send className="w-3 h-3" />เตือน
                                  </button>
                                </div>
                              )}
                              {isRecording && (
                                <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                                  <div className="px-3 py-2.5 bg-gray-50 border-b border-gray-100">
                                    <p className="text-[14px] font-bold text-[#1A1A2E]">{recordIsEdit ? "แก้ไขผลการพิจารณา" : "ระบุผลการพิจารณา"} — {r.name}</p>
                                  </div>
                                  <div className="px-3 py-3 space-y-3">
                                    <div className="flex gap-2">
                                      {(["สนใจเรียกสัมภาษณ์", "ไม่สนใจเรียกสัมภาษณ์"] as const).map((s) => (
                                        <button key={s} onClick={() => setRecordStatus(s)}
                                          className={`flex-1 py-2 rounded-xl border text-[13.5px] font-semibold transition-all ${recordStatus === s ? s === "สนใจเรียกสัมภาษณ์" ? "bg-emerald-50 border-emerald-400 text-emerald-700" : "bg-red-50 border-red-400 text-red-600" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                                          {s}
                                        </button>
                                      ))}
                                    </div>
                                    <textarea value={recordNote} onChange={(e) => setRecordNote(e.target.value)} rows={2} placeholder="หมายเหตุ (ไม่บังคับ)..."
                                      className="w-full px-3 py-2 text-[14px] bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-[#127EE3] resize-none placeholder:text-gray-400" />
                                  </div>
                                  <div className="flex justify-end gap-2 px-3 py-2.5 bg-gray-50 border-t border-gray-100">
                                    <button onClick={() => setRecordingId(null)} className="px-3 py-1.5 rounded-lg border border-gray-200 text-[14px] text-gray-500 hover:bg-gray-100 transition-colors">ยกเลิก</button>
                                    <button onClick={handleRecordSave} disabled={!recordStatus} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#127EE3] text-white text-[14px] font-bold hover:bg-[#0f6bc7] disabled:opacity-40 transition-colors">
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
                    <div className="flex gap-2 flex-wrap pt-1">
                      <button onClick={openEmailCompose}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-gray-600 text-[14px] font-medium bg-white hover:border-[#127EE3] hover:text-[#127EE3] transition-colors">
                        <Mail className="w-3.5 h-3.5" />ส่งอีเมลผู้สมัคร
                      </button>
                      <button onClick={() => completeTerminalAction("ไม่ผ่านการพิจารณา")}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 text-red-500 text-[14px] font-medium bg-white hover:bg-red-50 transition-colors">
                        <ThumbsDown className="w-3.5 h-3.5" />ไม่ผ่าน
                      </button>
                    </div>
                  </div>
                )}

                {/* ── to_interview ── */}
                {stage === "to_interview" && (
                  <div className="space-y-2.5">
                    <p className="text-[13.5px] font-semibold text-gray-400">รอนัดวันสัมภาษณ์ — กดเพื่อจัดตาราง:</p>
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => setActiveAction("schedule")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#01BFF9] to-[#019EFC] text-white text-[15px] font-bold shadow-sm hover:opacity-90 transition-opacity">
                        <Calendar className="w-4 h-4" />จัดตารางสัมภาษณ์
                      </button>
                      <button onClick={openEmailCompose}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#127EE3] text-[#127EE3] text-[15px] font-semibold bg-white hover:bg-blue-50 transition-colors">
                        <Mail className="w-4 h-4" />ส่งอีเมลผู้สมัคร
                      </button>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3">
                      <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-2">ติดต่อผู้สมัคร</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="flex items-center gap-1.5 text-[14.5px] text-gray-700 font-medium">
                          <Phone className="w-3.5 h-3.5 text-[#0DC2FF]" />{REVEALED_PHONE}
                        </span>
                        <button onClick={() => { navigator.clipboard.writeText(REVEALED_PHONE); setAlertMsg("คัดลอกเบอร์โทรแล้ว"); }}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-md border border-gray-200 text-[13px] text-gray-400 hover:bg-gray-50 transition-colors">
                          <Copy className="w-3 h-3" />คัดลอก
                        </button>
                        <button onClick={() => { const now = new Date(); const label = now.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }); setCallLogs((prev) => [{ id: now.getTime(), label }, ...prev]); store.addActivity({ id: `a${Date.now()}`, actor: "สมศรี HR", actorInitials: "สร", actorColor: "bg-[#127EE3]", type: "note", text: "ติดต่อผู้สมัครไม่ได้ (ไม่รับสาย)", time: "เพิ่งเมื่อกี้" }); setAlertMsg("บันทึกแล้ว"); }}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-md border border-red-200 text-[13px] text-red-400 hover:bg-red-50 transition-colors">
                          <PhoneOff className="w-3 h-3" />ไม่รับสาย
                        </button>
                      </div>
                      {callLogs.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {callLogs.map((entry) => (
                            <li key={entry.id} className="flex items-center gap-1.5 text-[13px] text-gray-400">
                              <PhoneOff className="w-3 h-3 flex-shrink-0 text-red-300" />ไม่รับสายเวลา {entry.label}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => completeTerminalAction("ผู้สมัครปฏิเสธนัด")}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 text-red-500 text-[14px] font-medium bg-white hover:bg-red-50 transition-colors">
                        <Ban className="w-3.5 h-3.5" />ผู้สมัครปฏิเสธนัด
                      </button>
                      <button onClick={() => completeTerminalAction("ไม่ผ่านการพิจารณา")}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 text-red-500 text-[14px] font-medium bg-white hover:bg-red-50 transition-colors">
                        <ThumbsDown className="w-3.5 h-3.5" />ไม่ผ่าน
                      </button>
                    </div>
                  </div>
                )}

                {/* ── interview ── */}
                {stage === "interview" && (
                  <div className="space-y-2.5">
                    {/* Interview date info card — always shown */}
                    <div className={`rounded-xl border px-3.5 py-3 flex items-start gap-2.5 ${scheduledInfo || applicant?.interviewDate ? "border-emerald-200 bg-emerald-50/50" : "border-amber-200 bg-amber-50/50"}`}>
                      <Calendar className={`w-4 h-4 flex-shrink-0 mt-0.5 ${scheduledInfo || applicant?.interviewDate ? "text-emerald-500" : "text-amber-500"}`} />
                      <div>
                        <p className={`text-[14.5px] font-semibold ${scheduledInfo || applicant?.interviewDate ? "text-emerald-800" : "text-amber-700"}`}>
                          {scheduledInfo || applicant?.interviewDate ? "วันนัดสัมภาษณ์" : "ยังไม่ได้บันทึกวันนัด"}
                        </p>
                        {(scheduledInfo || applicant?.interviewDate) && (
                          <p className="text-[14px] text-emerald-700 mt-0.5 font-medium">
                            {scheduledInfo
                              ? `${toThaiDate(scheduledInfo.date)} · ${scheduledInfo.time} น. · ${scheduledInfo.duration} นาที · ${typeLabel(scheduledInfo.type)}`
                              : applicant?.interviewDate}
                          </p>
                        )}
                        {scheduledInfo?.interviewers && scheduledInfo.interviewers.length > 0 && (
                          <p className="text-[13.5px] text-emerald-600 mt-1">
                            ผู้สัมภาษณ์: {scheduledInfo.interviewers.map(iv => iv.fullName).join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="text-[13.5px] font-semibold text-gray-400">สัมภาษณ์เสร็จแล้วหรือยัง?</p>
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => handleOpenResult()}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#01BFF9] to-[#019EFC] text-white text-[15px] font-bold shadow-sm hover:opacity-90 transition-opacity">
                        <FileText className="w-4 h-4" />บันทึกผลสัมภาษณ์
                      </button>
                      <button onClick={() => setActiveAction("reschedule")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-[15px] font-medium bg-white hover:border-[#127EE3] hover:text-[#127EE3] transition-colors">
                        <RefreshCw className="w-4 h-4" />เปลี่ยนวันนัด
                      </button>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => completeTerminalAction("ยกเลิกนัดสัมภาษณ์")}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 text-red-500 text-[14px] font-medium bg-white hover:bg-red-50 transition-colors">
                        <X className="w-3.5 h-3.5" />ยกเลิกนัด
                      </button>
                      <button onClick={() => completeTerminalAction("ไม่มาสัมภาษณ์")}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 text-red-500 text-[14px] font-medium bg-white hover:bg-red-50 transition-colors">
                        <UserX className="w-3.5 h-3.5" />ไม่มาสัมภาษณ์
                      </button>
                      <button onClick={openEmailCompose}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-gray-600 text-[14px] font-medium bg-white hover:border-[#127EE3] hover:text-[#127EE3] transition-colors">
                        <Mail className="w-3.5 h-3.5" />ส่งอีเมลผู้สมัคร
                      </button>
                    </div>
                  </div>
                )}

                {/* ── passed ── */}
                {stage === "passed" && (
                  <div className="space-y-2.5">
                    {savedResult && (
                      <div className="rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <p className="text-[13.5px] font-bold text-emerald-700">ผลสัมภาษณ์: ผ่าน</p>
                          <button onClick={() => handleOpenResult()} className="text-[13px] text-gray-400 hover:text-[#127EE3] border border-gray-200 rounded-lg px-2 py-0.5 bg-white transition-colors">แก้ไข</button>
                        </div>
                        {savedResult.comments && <p className="text-[14px] text-gray-600 italic">"{savedResult.comments}"</p>}
                      </div>
                    )}
                    <p className="text-[13.5px] font-semibold text-gray-400">ขั้นตอนต่อไป:</p>
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => setActiveAction("offer")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#01BFF9] to-[#019EFC] text-white text-[15px] font-bold shadow-sm hover:opacity-90 transition-opacity">
                        <FileText className="w-4 h-4" />ส่ง Offer
                      </button>
                      <button onClick={() => setActiveAction("schedule")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#127EE3] text-[#127EE3] text-[15px] font-semibold bg-white hover:bg-blue-50 transition-colors">
                        <Calendar className="w-4 h-4" />นัดสัมภาษณ์รอบถัดไป
                      </button>
                    </div>
                    <div className="flex gap-2">
                      {!savedResult && (
                        <button onClick={() => handleOpenResult()}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-gray-600 text-[14px] font-medium bg-white hover:border-[#127EE3] hover:text-[#127EE3] transition-colors">
                          <FileText className="w-3.5 h-3.5" />บันทึกผลสัมภาษณ์
                        </button>
                      )}
                      <button onClick={() => completeTerminalAction("ไม่ผ่านสัมภาษณ์")}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 text-red-500 text-[14px] font-medium bg-white hover:bg-red-50 transition-colors">
                        <ThumbsDown className="w-3.5 h-3.5" />ไม่ผ่านท้ายที่สุด
                      </button>
                    </div>
                  </div>
                )}

                {/* ── offer ── */}
                {stage === "offer" && (
                  <div className="space-y-2.5">
                    <p className="text-[13.5px] font-semibold text-gray-400">รอผู้สมัครตอบรับ Offer:</p>
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => setActiveAction("hire")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 text-white text-[15px] font-bold shadow-sm hover:opacity-90 transition-opacity">
                        <Award className="w-4 h-4" />รับเข้าทำงาน
                      </button>
                      <button onClick={openEmailCompose}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#127EE3] text-[#127EE3] text-[15px] font-semibold bg-white hover:bg-blue-50 transition-colors">
                        <Mail className="w-4 h-4" />ส่งอีเมลผู้สมัคร
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => completeTerminalAction("ไม่รับข้อเสนอ")}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 text-red-500 text-[14px] font-medium bg-white hover:bg-red-50 transition-colors">
                        <XCircle className="w-3.5 h-3.5" />ผู้สมัครไม่รับ Offer
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Move to any stage — always visible ── */}
                {stage !== "rejected" && stage !== "hired" && (
                  <MoveToStageDropdown stage={stage} onMove={completeStageChange} />
                )}

                {/* ── hired ── */}
                {stage === "hired" && (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200">
                      <Award className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <p className="text-[15px] font-semibold text-emerald-800">ยินดีด้วย! บันทึกเป็นพนักงานเรียบร้อยแล้ว</p>
                    </div>
                    <div>
                      <p className="text-[13.5px] font-semibold text-gray-400 mb-2">บันทึกเพิ่มเติม <span className="font-normal">(ไม่บังคับ)</span></p>
                      {hiredNote && !hiredNoteEditing ? (
                        <div className="rounded-xl border border-gray-200 bg-white px-3.5 py-3">
                          <p className="text-[14.5px] text-gray-700 whitespace-pre-wrap">{hiredNote}</p>
                          <button onClick={() => { setHiredNoteDraft(hiredNote); setHiredNoteEditing(true); }}
                            className="flex items-center gap-1 mt-1.5 text-[13.5px] font-semibold text-[#127EE3] hover:underline">
                            <Edit2 className="w-3 h-3" />แก้ไข
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <textarea rows={3} value={hiredNoteDraft} onChange={(e) => setHiredNoteDraft(e.target.value)}
                            placeholder="เช่น เริ่มงานวันที่..., เงินเดือนที่ตกลง..."
                            className="w-full px-3.5 py-2.5 text-[14.5px] bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-[#127EE3] focus:bg-white transition-all placeholder:text-gray-400 resize-none" />
                          <button onClick={() => { setHiredNote(hiredNoteDraft); setHiredNoteEditing(false); setAlertMsg("บันทึกข้อมูลเรียบร้อยแล้ว"); }}
                            className="flex items-center gap-1.5 px-4 py-2 border border-[#127EE3] text-[#127EE3] text-[14.5px] font-semibold rounded-xl hover:bg-blue-50 transition-colors">
                            บันทึก
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>
          );
        })()}

      </div>

      {/* ── Action Panels (refer, schedule, result, etc.) ── */}

      {/* ส่งต่อให้พิจารณา panel */}
      {activeAction === "refer" && (
        <div className="rounded-2xl border border-gray-200">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 rounded-t-2xl">
            <span className="text-[14.5px] font-bold text-[#1A1A2E]">ส่งต่อให้พิจารณา</span>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="px-4 py-3">
              <div className="flex items-start gap-3">
                <span className="text-[13.5px] font-bold text-gray-400 uppercase tracking-wide w-10 flex-shrink-0 mt-2.5">ถึง</span>
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
              <span className="text-[13.5px] font-bold text-gray-400 uppercase tracking-wide w-10 flex-shrink-0">เทมเพลต</span>
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
                className="flex-1 text-[15px] focus:outline-none bg-transparent text-[#1A1A2E] cursor-pointer"
              >
                <option value="">— เลือกเทมเพลต (ไม่บังคับ) —</option>
                {emailTemplates.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="text-[13.5px] font-bold text-gray-400 uppercase tracking-wide w-10 flex-shrink-0">เรื่อง</span>
              <input value={referEmailSubject} onChange={(e) => setReferEmailSubject(e.target.value)} placeholder="หัวข้ออีเมล..." className="flex-1 text-[15px] focus:outline-none placeholder:text-gray-300" />
            </div>
            <textarea value={referEmailBody} onChange={(e) => setReferEmailBody(e.target.value)} rows={5} placeholder="เนื้อหาอีเมล..." className="w-full px-4 py-3 text-[15px] focus:outline-none resize-none placeholder:text-gray-300" />
          </div>
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-100 rounded-b-2xl">
            <p className="text-[13.5px] text-gray-400">จาก: สมศรี HR &lt;somsri@company.com&gt;</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setActiveAction(null)} className="px-4 py-2 rounded-xl border border-gray-200 text-[14.5px] text-gray-500 hover:bg-gray-100 transition-colors">ยกเลิก</button>
              <button onClick={handleReferSend} disabled={referContacts.length === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#127EE3] text-white text-[14.5px] font-bold hover:bg-[#0f6bc7] transition-colors disabled:opacity-40">
                <Send className="w-3.5 h-3.5" />ส่งและย้ายสถานะ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ลงตารางนัดสัมภาษณ์ panel */}
      {activeAction === "schedule" && (
        <div className="rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
            <span className="text-[14.5px] font-bold text-[#1A1A2E]">นัดสัมภาษณ์</span>
            <button onClick={() => setActiveAction(null)} className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="px-4 py-4">
            <InterviewScheduler
              candidateName="Senior Product Designer"
              candidateTitle="LINE MAN Wongnai"
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
            <div>
              <span className="text-[14.5px] font-bold text-gray-900">เปลี่ยนวันนัดสัมภาษณ์</span>
              {(scheduledInfo || applicant?.interviewDate) && (
                <p className="text-[13.5px] text-gray-500 mt-0.5 flex items-center gap-1">
                  <Calendar className="w-3 h-3 flex-shrink-0" />
                  นัดเดิม:&nbsp;
                  <span className="font-semibold text-gray-700">
                    {scheduledInfo
                      ? `${toThaiDate(scheduledInfo.date)} · ${scheduledInfo.time} น.${scheduledInfo.duration ? ` · ${scheduledInfo.duration} นาที` : ""}${scheduledInfo.type ? ` · ${typeLabel(scheduledInfo.type)}` : ""}`
                      : applicant?.interviewDate}
                  </span>
                </p>
              )}
            </div>
            <button onClick={() => setActiveAction(null)} className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="px-4 py-4">
            <InterviewScheduler
              candidateName="Senior Product Designer"
              candidateTitle="LINE MAN Wongnai"
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
              <span className="text-[14.5px] font-bold text-[#1A1A2E]">บันทึกผลสัมภาษณ์</span>
              <button onClick={() => setActiveAction(null)} className="w-6 h-6 rounded-lg hover:bg-gray-200 flex items-center justify-center transition-colors">
                <X className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>
            <div className="px-4 py-4 space-y-4">
              {/* Result outcome */}
              <div>
                <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-2">ผลการสัมภาษณ์</p>
                <div className="grid grid-cols-3 gap-2">
                  {[{ v: "passed" as const, label: "ผ่านสัมภาษณ์", color: "border-emerald-300 text-emerald-700 bg-emerald-50" },
                    { v: "wait_compare" as const, label: "รอเปรียบเทียบ", color: "border-amber-300 text-amber-700 bg-amber-50" },
                    { v: "rejected" as const, label: "ไม่ผ่าน", color: "border-red-300 text-red-600 bg-red-50" }].map(({ v, label, color }) => (
                    <button key={v} onClick={() => setInterviewResult(v)}
                      className={`flex items-center gap-2 px-3 py-3 rounded-xl border text-[14.5px] font-medium transition-all ${interviewResult === v ? color : "border-gray-200 text-gray-500 bg-white hover:border-gray-300"}`}>
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${interviewResult === v ? "border-current bg-current" : "border-gray-300"}`} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interviewers */}
              <div className="relative">
                <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-2">ผู้สัมภาษณ์</p>
                {resultInterviewers.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {resultInterviewers.map((c) => (
                      <span key={c.id} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[14px] font-medium ${c.color}`}>
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
                  className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#F0F2F5] text-[15px] text-gray-400 hover:border-gray-300 transition-colors text-left"
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
                        placeholder="ค้นหาชื่อหรือแผนก..." className="flex-1 text-[15px] focus:outline-none placeholder:text-gray-300" />
                    </div>
                    <div className="max-h-[180px] overflow-y-auto">
                      {filteredResultInterviewers.length === 0 ? (
                        <p className="text-[14.5px] text-gray-400 text-center py-4">ไม่พบรายชื่อ</p>
                      ) : filteredResultInterviewers.map((c) => (
                        <button key={c.id}
                          onClick={() => { setResultInterviewers((prev) => [...prev, c]); setResultInterviewerQuery(""); setResultInterviewerDropdownOpen(false); }}
                          className="w-full flex items-center gap-3 px-3.5 py-2.5 hover:bg-[#F0F8FF] transition-colors text-left"
                        >
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-bold flex-shrink-0 ${c.color}`}>{c.initials}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-[15px] font-semibold text-[#1A1A2E] truncate">{c.fullName}</p>
                            <p className="text-[13.5px] text-gray-400 truncate">{c.department} · {c.title}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Comments */}
              <div>
                <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-2">ความคิดเห็นจากการสัมภาษณ์</p>
                <textarea
                  value={resultComments}
                  onChange={(e) => setResultComments(e.target.value)}
                  rows={4}
                  placeholder="เช่น จุดแข็ง จุดที่ควรพัฒนา ความเหมาะสมกับตำแหน่ง"
                  className="w-full text-[15px] text-gray-700 bg-[#F0F2F5] border border-transparent rounded-xl px-3.5 py-3 resize-none focus:outline-none focus:border-[#127EE3] focus:bg-white transition-all placeholder:text-gray-300"
                />
              </div>

              {/* Attachments */}
              <div>
                <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-2">ไฟล์แนบ</p>
                {resultAttachments.length > 0 && (
                  <div className="space-y-1.5 mb-2">
                    {resultAttachments.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200">
                        <Paperclip className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span className="flex-1 text-[14.5px] text-[#1A1A2E] truncate">{f.name}</span>
                        <button onClick={() => setResultAttachments((prev) => prev.filter((_, j) => j !== i))}
                          className="text-[13px] text-red-400 hover:text-red-600 font-medium flex-shrink-0 transition-colors">ลบ</button>
                      </div>
                    ))}
                  </div>
                )}
                <label className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-dashed border-gray-300 text-[14.5px] text-gray-500 hover:border-[#127EE3] hover:text-[#127EE3] cursor-pointer transition-colors bg-white">
                  <Upload className="w-3.5 h-3.5 flex-shrink-0" />
                  + แนบไฟล์
                  <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" className="hidden"
                    onChange={(e) => { if (e.target.files) setResultAttachments((prev) => [...prev, ...Array.from(e.target.files!)]); e.target.value = ""; }} />
                </label>
                <p className="text-[13px] text-gray-400 mt-1">รองรับ PDF, รูปภาพ, DOC</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 px-4 py-3 bg-gray-50 border-t border-gray-100">
              <button onClick={() => setActiveAction(null)} className="px-4 py-2 rounded-xl border border-gray-200 text-[14.5px] text-gray-500 hover:bg-gray-100 transition-colors">ยกเลิก</button>
              <button onClick={handleResultSave} disabled={!interviewResult}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#127EE3] text-white text-[14.5px] font-bold hover:bg-[#0f6bc7] transition-colors disabled:opacity-40">
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
            <span className="text-[14.5px] font-bold text-[#1A1A2E]">ยืนยันการส่ง Offer</span>
          </div>
          <div className="px-4 py-4">
            <p className="text-[15px] text-gray-600">ยืนยันที่จะย้ายผู้สมัครรายนี้ไปสถานะ <span className="font-semibold text-[#1A1A2E]">Offer</span>?</p>
          </div>
          <div className="flex justify-end gap-2 px-4 py-3 bg-gray-50 border-t border-gray-100">
            <button onClick={() => setActiveAction(null)} className="px-4 py-2 rounded-xl border border-gray-200 text-[14.5px] text-gray-500 hover:bg-gray-100 transition-colors">ยกเลิก</button>
            <button onClick={handleOfferConfirm} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#127EE3] text-white text-[14.5px] font-bold hover:bg-[#0f6bc7] transition-colors">
              <CheckCircle2 className="w-3.5 h-3.5" />ยืนยัน
            </button>
          </div>
        </div>
      )}

      {/* รับเข้าทำงาน panel */}
      {activeAction === "hire" && (
        <div className="rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <span className="text-[14.5px] font-bold text-[#1A1A2E]">ยืนยันรับเข้าทำงาน</span>
          </div>
          <div className="px-4 py-4">
            <p className="text-[15px] text-gray-600">ยืนยันที่จะบันทึกสถานะผู้สมัครรายนี้เป็น <span className="font-semibold text-emerald-700">รับเข้าทำงาน</span>?</p>
          </div>
          <div className="flex justify-end gap-2 px-4 py-3 bg-gray-50 border-t border-gray-100">
            <button onClick={() => setActiveAction(null)} className="px-4 py-2 rounded-xl border border-gray-200 text-[14.5px] text-gray-500 hover:bg-gray-100 transition-colors">ยกเลิก</button>
            <button onClick={handleHireConfirm} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-white text-[14.5px] font-bold hover:bg-emerald-600 transition-colors">
              <CheckCircle2 className="w-3.5 h-3.5" />ยืนยันรับเข้าทำงาน
            </button>
          </div>
        </div>
      )}

      {/* Email compose panel */}
      {activeAction === "emailCompose" && (
        <div className="rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <span className="text-[14.5px] font-bold text-[#1A1A2E]">ส่งอีเมลหาผู้สมัคร</span>
          </div>

          {/* Template picker */}
          <div className="px-4 py-3 border-b border-gray-100 bg-white">
            <label className="text-[13px] font-bold text-gray-400 uppercase tracking-wide block mb-2">เลือกเทมเพลต</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <select
                  value={selectedTemplate ?? ""}
                  onChange={(e) => { if (e.target.value) applyTemplate(e.target.value); else setSelectedTemplate(null); }}
                  className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-3 py-2 pr-8 text-[14.5px] text-gray-700 focus:outline-none focus:border-[#127EE3] cursor-pointer"
                >
                  <option value="">— เลือกเทมเพลต —</option>
                  {emailTemplateList.map((t) => (
                    <option key={t.key} value={t.key}>{t.label}{t.custom ? " ★" : ""}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
              <button
                onClick={handleSaveEmailTemplate}
                disabled={!emailSubject.trim() && !emailBody.trim()}
                title="บันทึกเป็นเทมเพลต"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-[14px] text-gray-600 hover:border-[#127EE3] hover:text-[#127EE3] hover:bg-blue-50 transition-colors disabled:opacity-40 whitespace-nowrap"
              >
                <Bookmark className="w-3.5 h-3.5 flex-shrink-0" />
                บันทึกเป็นเทมเพลต
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="text-[13.5px] font-bold text-gray-400 uppercase tracking-wide w-10 flex-shrink-0">ถึง</span>
              <input value={emailTo} onChange={(e) => setEmailTo(e.target.value)} className="flex-1 text-[15px] text-[#1A1A2E] focus:outline-none" />
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="text-[13.5px] font-bold text-gray-400 uppercase tracking-wide w-10 flex-shrink-0">เรื่อง</span>
              <input value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} placeholder="หัวข้ออีเมล" className="flex-1 text-[15px] focus:outline-none placeholder:text-gray-300" />
            </div>
            {/* Company card preview — shows what will be included at top of actual email */}
            <div className="px-4 py-3 bg-gray-50/60">
              <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wide mb-2">บริษัทที่ส่ง</p>
              <div className="flex items-start justify-between gap-4 px-4 py-3 bg-white border border-gray-100 rounded-xl">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0DC2FF] to-[#127EE3] flex items-center justify-center text-white text-[13px] font-black shadow-sm flex-shrink-0">
                    TV
                  </div>
                  <div className="min-w-0">
                    <p className="text-[15px] font-bold text-[#1A1A2E]">TechVibe Co., Ltd.</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      {[1,2,3].map(i => (
                        <svg key={i} className="w-2.5 h-2.5 text-rose-400 fill-rose-400" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                      ))}
                      <span className="text-[11px] text-rose-500 font-bold ml-0.5">Dream Company — วิเศษสุด</span>
                    </div>
                    <p className="text-[12px] text-gray-400 mt-1 leading-relaxed italic">"{`ที่นี่ชีวิตดี งานท้าทาย และทีมที่แข็งแกร่ง — คนที่นี่บอกว่าอยากแนะนำให้คนที่รัก`}"</p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {([["ชีวิตดี", 4.3], ["งานดี", 4.2], ["เงินดี", 3.2], ["สังคมดี", 3.9]] as [string, number][]).map(([label, val]) => (
                      <div key={label} className="flex items-center gap-1.5">
                        <span className="text-[13px] text-gray-500 w-12 flex-shrink-0">{label}</span>
                        <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden" style={{ minWidth: 36 }}>
                          <div className="h-full rounded-full bg-[#0DC2FF]" style={{ width: `${(val / 5) * 100}%` }} />
                        </div>
                        <span className="text-[13px] font-bold text-[#0DC2FF] w-5 text-right flex-shrink-0">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <textarea value={emailBody} onChange={(e) => setEmailBody(e.target.value)}
              placeholder="เขียนข้อความ..." rows={6}
              className="w-full px-4 py-3 text-[15px] focus:outline-none resize-none placeholder:text-gray-300" />
          </div>
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-100">
            <p className="text-[13.5px] text-gray-400">จาก: สมศรี HR &lt;somsri@company.com&gt;</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setActiveAction(null)} className="px-4 py-2 rounded-xl border border-gray-200 text-[14.5px] text-gray-500 hover:bg-gray-100 transition-colors">ยกเลิก</button>
              <button
                onClick={() => setShowEmailPreview(true)}
                disabled={!emailSubject.trim() || !emailBody.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-[14.5px] text-gray-700 font-medium hover:border-[#127EE3] hover:text-[#127EE3] hover:bg-blue-50 transition-colors disabled:opacity-40"
              >
                <Eye className="w-3.5 h-3.5" />Preview Email
              </button>
              <button onClick={handleSendEmail} disabled={!emailSubject.trim() || !emailBody.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#127EE3] text-white text-[14.5px] font-bold hover:bg-[#0f6bc7] transition-colors disabled:opacity-40">
                <Send className="w-3.5 h-3.5" />ส่งอีเมล
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Preview Modal */}
      {showEmailPreview && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]" onClick={() => setShowEmailPreview(false)}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-[720px] max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#127EE3]" />
                <span className="text-[17px] font-semibold text-[#1A1A2E]">Preview Email</span>
              </div>
              <button onClick={() => setShowEmailPreview(false)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Email envelope meta */}
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 space-y-1.5">
              <div className="flex items-baseline gap-3">
                <span className="text-[13px] font-bold text-gray-400 uppercase tracking-wide w-10 flex-shrink-0">ถึง</span>
                <span className="text-[15px] text-[#1A1A2E] font-medium">{emailTo}</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-[13px] font-bold text-gray-400 uppercase tracking-wide w-10 flex-shrink-0">จาก</span>
                <span className="text-[15px] text-gray-500">สมศรี HR <span className="text-gray-400">&lt;somsri@company.com&gt;</span></span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-[13px] font-bold text-gray-400 uppercase tracking-wide w-10 flex-shrink-0">เรื่อง</span>
                <span className="text-[16px] font-semibold text-[#1A1A2E]">{emailSubject}</span>
              </div>
            </div>

            {/* Email canvas */}
            <div className="flex-1 overflow-y-auto px-6 py-5 bg-[#f5f6f8]">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-8 py-7">
                {/* Company card — matches MessageModal reference design */}
                <div className="flex items-start justify-between gap-4 px-5 py-4 bg-white border border-gray-100 rounded-xl mb-5">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0DC2FF] to-[#127EE3] flex items-center justify-center text-white text-[14px] font-black shadow-sm flex-shrink-0">
                      TV
                    </div>
                    <div className="min-w-0">
                      <p className="text-[16px] font-bold text-[#1A1A2E]">TechVibe Co., Ltd.</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        {[1,2,3].map(i => (
                          <svg key={i} className="w-2.5 h-2.5 text-rose-400 fill-rose-400" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                        ))}
                        <span className="text-[11px] text-rose-500 font-bold ml-0.5">Dream Company — วิเศษสุด</span>
                      </div>
                      <p className="text-[13px] text-gray-400 mt-1.5 leading-relaxed italic">"{`ที่นี่ชีวิตดี งานท้าทาย และทีมที่แข็งแกร่ง — คนที่นี่บอกว่าอยากแนะนำให้คนที่รัก`}"</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="grid grid-cols-2 gap-x-5 gap-y-1">
                      {([["ชีวิตดี", 4.3], ["งานดี", 4.2], ["เงินดี", 3.2], ["สังคมดี", 3.9]] as [string, number][]).map(([label, val]) => (
                        <div key={label} className="flex items-center gap-2">
                          <span className="text-[14px] text-gray-600 w-14 flex-shrink-0">{label}</span>
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden" style={{ minWidth: 48 }}>
                            <div className="h-full rounded-full bg-[#0DC2FF]" style={{ width: `${(val / 5) * 100}%` }} />
                          </div>
                          <span className="text-[14px] font-bold text-[#0DC2FF] w-6 text-right flex-shrink-0">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <pre className="text-[16px] text-gray-700 whitespace-pre-wrap font-[inherit] leading-[1.75]">{emailBody}</pre>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-gray-100 bg-white">
              <button
                onClick={() => setShowEmailPreview(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-[15px] text-gray-600 font-medium hover:bg-gray-50 transition-colors"
              >
                กลับไปแก้ไข
              </button>
              <button
                onClick={handleSendEmail}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#127EE3] text-white text-[15px] font-bold hover:bg-[#0f6bc7] transition-colors"
              >
                <Send className="w-3.5 h-3.5" />ส่งอีเมล
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}


    </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Credit confirm modal                                                  */
/* ------------------------------------------------------------------ */
function CreditConfirmModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  const [showRules, setShowRules] = useState(false);
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-7">
        <div className="flex flex-col items-center text-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
            <Eye className="w-5 h-5 text-[#127EE3]" />
          </div>
          <div className="w-full space-y-1">
            <h3 className="text-base font-semibold text-gray-900">เปิดดูข้อมูลการติดต่อ</h3>
            <p className="text-sm text-gray-700">การเปิดดูใช้ <span className="font-semibold text-gray-900">1 Talent Credit</span></p>
            <p className="text-xs text-gray-500">คุณมีเครดิตคงเหลือ <span className="font-medium text-gray-700">47 credits</span></p>
          </div>
          <div className="w-full text-center">
            <p className="text-xs text-gray-400">เรซูเม่นี้ใช้ 1 เครดิต เนื่องจากเงินเดือนน้อยกว่า 50,000 บาท</p>
            <button onClick={() => setShowRules(!showRules)} className="text-xs text-gray-400 hover:text-gray-600 hover:underline mt-1.5 block mx-auto">
              {showRules ? "ซ่อนเงื่อนไขเครดิต" : "ดูเงื่อนไขเครดิต"}
            </button>
            {showRules && (
              <div className="mt-1.5 space-y-0.5">
                <p className="text-xs text-gray-400">น้อยกว่า 50,000 บาท = 1 เครดิต</p>
                <p className="text-xs text-gray-400">50,000–100,000 บาท = 2 เครดิต</p>
                <p className="text-xs text-gray-400">มากกว่า 100,000 บาท = 4 เครดิต</p>
              </div>
            )}
          </div>
          <div className="w-full flex flex-col gap-2">
            <button onClick={onConfirm} className="w-full py-3 rounded-xl bg-[#127EE3] text-white text-[16px] font-bold hover:bg-[#0f6bc7] transition-colors">ยืนยัน — ใช้ 1 Credit</button>
            <button onClick={onCancel} className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-500 text-[15.5px] font-medium hover:bg-gray-50 transition-colors">ยกเลิก</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Forward Resume Modal                                                  */
/* ------------------------------------------------------------------ */
function ForwardResumeModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
    setEmail("");
    setMessage("");
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-[18px] font-bold text-[#1A1A2E]">ส่งเรซูเม่ให้ผู้อื่นดู</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[15px] font-semibold text-gray-700">อีเมลผู้รับ</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@company.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-[16px] text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-[#00ADEF] focus:ring-2 focus:ring-[#00ADEF]/10 transition"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[15px] font-semibold text-gray-700">
              ข้อความเพิ่มเติม
              <span className="ml-1.5 text-[14px] font-normal text-gray-400">(ไม่บังคับ)</span>
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="เช่น ฝากพิจารณาเรซูเม่นี้เพิ่มเติมครับ"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-[16px] text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-[#00ADEF] focus:ring-2 focus:ring-[#00ADEF]/10 transition resize-none"
            />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-[15px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-[#01BFF9] to-[#019EFC] text-white text-[15px] font-bold hover:opacity-90 transition-opacity shadow-sm shadow-[#019EFC]/20"
            >
              <Send className="w-3.5 h-3.5" />ส่งอีเมล
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/* Move-to-stage dropdown                                               */
/* ------------------------------------------------------------------ */
const MOVEABLE_STAGES: { key: PipelineStage; label: string }[] = [
  { key: "new",          label: "ใหม่" },
  { key: "shortlist",    label: "คัดกรอง" },
  { key: "review",       label: "ส่งต่อ" },
  { key: "to_interview", label: "รอนัด" },
  { key: "interview",    label: "สัมภาษณ์" },
  { key: "passed",       label: "ผ่านสัมภาษณ์" },
  { key: "offer",        label: "Offer" },
  { key: "hired",        label: "รับเข้าทำงาน" },
];

function MoveToStageDropdown({ stage, onMove }: { stage: PipelineStage; onMove: (s: PipelineStage) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);
  const others = MOVEABLE_STAGES.filter((s) => s.key !== stage);
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-gray-500 text-[14px] font-medium bg-white hover:border-[#127EE3] hover:text-[#127EE3] transition-colors">
        <MoreHorizontal className="w-3.5 h-3.5" />ย้ายไปขั้นตอนอื่น
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-0 bottom-full mb-1.5 bg-white rounded-xl border border-gray-200 shadow-lg z-50 min-w-[180px] overflow-hidden">
          <p className="px-3 py-2 text-[12px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">ย้ายไปที่</p>
          {others.map((s) => (
            <button key={s.key} onClick={() => { onMove(s.key); setOpen(false); }}
              className="w-full text-left px-3 py-2.5 text-[14.5px] text-gray-700 hover:bg-gray-50 hover:text-[#127EE3] transition-colors flex items-center gap-2">
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* Root component                                                        */
/* ------------------------------------------------------------------ */
export default function ResumePanel({ onClose, job, onContact, isApplicant = false, isRevealed = false, applicant, onApplicantStageChange }: ResumePanelProps) {
  const [tab, setTab] = useState<"resume" | "docs" | "ai" | "notes" | "manage" | "timeline">("resume");
  const [contactRevealed, setContactRevealed] = useState(false);
  const [revealLoading, setRevealLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [bottomBarContent, setBottomBarContent] = useState<React.ReactNode>(null);

  const isUnlockedPreview = contactRevealed || isApplicant || isRevealed;

  const candidateDisplay: CandidateDisplay | undefined = applicant ? {
    name:        applicant.name,
    initials:    applicant.initials,
    avatarColor: applicant.avatarColor,
    title:       applicant.currentTitle,
    company:     applicant.currentCompany,
    experience:  applicant.experience,
    location:    applicant.location,
    salaryExpect: applicant.salaryExpect,
    skills:      applicant.skills,
    aiSummary:   applicant.aiSummary,
    stage:       applicant.stage,
  } : undefined;
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);

  const store: ActivityStore = {
    activities,
    addActivity: (a) => setActivities((prev) => [a, ...prev]),
  };

  const handleRevealRequest = () => setShowConfirm(true);
  const handleConfirm = () => {
    setShowConfirm(false);
    setRevealLoading(true);
    setTimeout(() => { setRevealLoading(false); setContactRevealed(true); }, 900);
  };

  const tabs = [
    { key: "resume" as const, label: "Resume", icon: <FileText className="w-3.5 h-3.5" /> },
    { key: "ai" as const, label: "AI วิเคราะห์", icon: <Sparkles className="w-3.5 h-3.5" />, locked: !isUnlockedPreview },
    { key: "docs" as const, label: "เอกสาร", icon: <Paperclip className="w-3.5 h-3.5" /> },
    { key: "manage" as const, label: "จัดการ", icon: <UserCheck className="w-3.5 h-3.5" />, locked: !isUnlockedPreview },
    { key: "timeline" as const, label: "ไทม์ไลน์", icon: <Clock className="w-3.5 h-3.5" /> },
    { key: "notes" as const, label: "โน้ต", icon: <MessageCircle className="w-3.5 h-3.5" /> },
  ];

  return createPortal(
    <>
      {showConfirm && !isApplicant && <CreditConfirmModal onConfirm={handleConfirm} onCancel={() => setShowConfirm(false)} />}
      {showForwardModal && <ForwardResumeModal onClose={() => setShowForwardModal(false)} />}
      <div className="fixed inset-0 z-50 flex justify-end">
        <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px]" onClick={onClose} />
        <div className="relative w-[75vw] max-w-[1100px] min-w-[720px] h-full bg-white shadow-2xl flex flex-col animate-slide-in-right overflow-hidden">

          {/* Header */}
          <div className="flex-shrink-0 bg-white border-b border-gray-100">
            {/* Top bar */}
            <div className="flex items-center justify-between px-7 py-3.5">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#0DC2FF] to-[#127EE3] flex items-center justify-center flex-shrink-0">
                    <span className="text-[8px] font-black text-white leading-none">SR</span>
                  </div>
                  <span className="text-[13px] font-bold text-[#127EE3] uppercase tracking-widest">Super Resume</span>
                </div>
                <div className="w-px h-4 bg-gray-200" />
                <h2 className="text-[18px] font-bold text-[#1A1A2E]">{candidateDisplay?.name ?? (isUnlockedPreview ? REVEALED_NAME : "Profile Preview")}</h2>
                {isUnlockedPreview && (() => {
                  const stageCfg = candidateDisplay?.stage
                    ? PIPELINE_STAGES.find(s => s.key === candidateDisplay.stage)
                    : null;
                  return stageCfg ? (
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[12px] font-bold ${stageCfg.bg} ${stageCfg.color} border-current/20`}>
                      <CheckCircle2 className="w-3 h-3" />{stageCfg.label}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-[12px] font-bold text-emerald-600">
                      <CheckCircle2 className="w-3 h-3" />เปิดเผยแล้ว
                    </div>
                  );
                })()}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  title="Print"
                  aria-label="Print"
                  className="w-8 h-8 rounded-xl flex items-center justify-center bg-gray-50 border border-gray-100 text-gray-400 hover:text-[#127EE3] hover:border-[#127EE3]/20 hover:bg-[#127EE3]/5 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => window.print()}
                  title="Save as PDF"
                  aria-label="Save as PDF"
                  className="w-8 h-8 rounded-xl flex items-center justify-center bg-gray-50 border border-gray-100 text-gray-400 hover:text-[#127EE3] hover:border-[#127EE3]/20 hover:bg-[#127EE3]/5 transition-colors"
                >
                  <FileDown className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-gray-200" />
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
            {/* Tab bar */}
            <div className="flex items-center gap-0.5 px-7 pb-0">
              {tabs.map((t) => (
                <button key={t.key}
                  onClick={() => { if (!t.locked) setTab(t.key); }}
                  title={t.locked ? "เปิดดูข้อมูลการติดต่อก่อน" : undefined}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 text-[14.5px] font-semibold transition-all whitespace-nowrap border-b-2 -mb-px ${tab === t.key ? "border-[#127EE3] text-[#127EE3]" : t.locked ? "border-transparent text-gray-300 cursor-not-allowed" : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-t-lg cursor-pointer"}`}>
                  {t.locked ? <Lock className="w-3 h-3" /> : t.icon}
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {tab === "resume" && <ResumeContent contactRevealed={isUnlockedPreview} candidate={candidateDisplay} />}
            {tab === "docs" && <DocsContent contactRevealed={isUnlockedPreview} onRevealRequest={handleRevealRequest} />}
            {tab === "ai" && <AIAnalysisContent contactRevealed={isUnlockedPreview} onRevealRequest={handleRevealRequest} job={job} candidate={candidateDisplay} />}
            {tab === "notes" && <NotesContent store={store} />}
            <div className={tab === "manage" ? "" : "hidden"}>
              <ManageContent
                store={store}
                initialStage={applicant?.stage ?? "new"}
                onStageChange={(s) => { if (applicant && onApplicantStageChange) onApplicantStageChange(applicant.id, s); }}
                applicant={applicant}
                onBottomBarChange={setBottomBarContent}
                isResumeTab={tab === "resume"}
                isUnlockedPreview={isUnlockedPreview}
                onSwitchToManage={() => setTab("manage")}
              />
            </div>
            {tab === "timeline" && <TimelineContent store={store} currentStage={applicant?.stage} />}
          </div>

          {/* Bottom bar — Resume only */}
          {tab === "resume" && (
            <div className="flex-shrink-0 border-t border-gray-100 bg-white px-4 py-3">
              {isUnlockedPreview ? (
                <div className="flex items-center gap-2">{bottomBarContent}</div>
              ) : (
                <div className="flex items-center gap-2">
                  <button onClick={handleRevealRequest} disabled={revealLoading}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-[#01BFF9] to-[#019EFC] text-white text-[15px] font-bold hover:opacity-90 transition-opacity disabled:opacity-60 shadow-sm shadow-[#019EFC]/20">
                    {revealLoading
                      ? <><span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />กำลังเปิด...</>
                      : <><Eye className="w-3.5 h-3.5" />ดูข้อมูลการติดต่อ</>}
                  </button>
                  <button onClick={() => setShowForwardModal(true)}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#00ADEF] text-[#00ADEF] bg-white text-[15px] font-bold hover:bg-[#00ADEF]/5 transition-colors whitespace-nowrap">
                    <Send className="w-3.5 h-3.5" />ส่งเรซูเม่นี้ให้ผู้อื่นดู
                  </button>
                  <button onClick={() => setBookmarked(!bookmarked)}
                    className={`w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center transition-colors border ${bookmarked ? "bg-[#127EE3]/10 border-[#127EE3]/20 text-[#127EE3]" : "bg-white border-gray-200 text-gray-400 hover:text-[#127EE3] hover:border-[#127EE3]/30"}`}>
                    {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>,
    document.body
  );
}
