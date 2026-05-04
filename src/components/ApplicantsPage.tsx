import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, Sparkles, Search, ChevronDown, Clock, MapPin, Briefcase, CheckCircle2, AlertCircle, MessageCircle, Send, Zap, Award, Circle, Eye, GraduationCap, Banknote, Heart, Brain, ChevronRight, Camera, Music, Gamepad2, Globe, Palette, Wrench, FileText, X, TrendingUp, CalendarClock, User, Mail, Users, Calendar, CalendarDays, CalendarRange, ThumbsUp, ThumbsDown, Video, UserPlus, Star, CalendarCheck, XCircle, Wallet } from "lucide-react";
import type { ApplicantRow, TopPickApplicant, PipelineStage, Reviewer } from "../data/applicants";
import { mockApplicants, topPickApplicants, PIPELINE_STAGES } from "../data/applicants";
import ResumePanel from "./ResumePanel";



function StageBadge({ stage, prominent = false }: { stage: PipelineStage; prominent?: boolean }) {
  const cfg = PIPELINE_STAGES.find((s) => s.key === stage)!;
  return prominent ? (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[14px] font-medium ${cfg.bg} ${cfg.color}`}>
      {cfg.label}
    </span>
  ) : (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[13px] font-semibold ${cfg.bg} ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}


const REVIEWER_STATUS_LABEL: Record<Reviewer["status"], string> = {
  pending:    "รอพิจารณา",
  interested: "สนใจนัดสัมภาษณ์",
  not_sure:   "ไม่สนใจเรียกสัมภาษณ์",
};

const REVIEWER_STATUS_ICON: Record<Reviewer["status"], string> = {
  interested: "👍",
  pending:    "⏳",
  not_sure:   "⚠️",
};

function ReviewSummary({ reviewers }: { reviewers: Reviewer[] }) {
  if (reviewers.length === 0) {
    return <span className="text-gray-500">ส่งต่อให้พิจารณา</span>;
  }
  if (reviewers.length === 1) {
    const r = reviewers[0];
    return (
      <span className="text-gray-600">
        {REVIEWER_STATUS_ICON[r.status]}{" "}
        <span className="font-medium">{REVIEWER_STATUS_LABEL[r.status]}</span>
        <span className="text-gray-400"> · {r.name}</span>
      </span>
    );
  }
  return (
    <span className="text-gray-600 flex items-center gap-1.5 flex-wrap">
      {reviewers.map((r, i) => (
        <span key={i} className="inline-flex items-center gap-0.5">
          {i > 0 && <span className="text-gray-300 mr-1">·</span>}
          <span>{r.name}</span>
          <span>{REVIEWER_STATUS_ICON[r.status]}</span>
        </span>
      ))}
    </span>
  );
}

function stageSummaryText(applicant: ApplicantRow): string {
  switch (applicant.stage) {
    case "new":          return "";
    case "shortlist":    return "ชอร์ตลิสต์แล้ว";
    case "review":       return "";
    case "to_interview": return "รอนัดสัมภาษณ์";
    case "interview":
      return applicant.interviewDate
        ? `สัมภาษณ์ · ${applicant.interviewDate}`
        : "สัมภาษณ์แล้ว · รอเปรียบเทียบ";
    case "passed":    return "ผ่านสัมภาษณ์";
    case "offer":
      return applicant.offerAmount
        ? `ยื่นข้อเสนอแล้ว · ${applicant.offerAmount}`
        : "ยื่นข้อเสนอแล้ว";
    case "hired":     return "รับเข้าทำงานแล้ว";
    case "rejected":  return "ไม่ผ่านการคัดเลือก";
    default:          return "";
  }
}

const INTERVIEWERS = ["คุณสมชาย", "คุณมานี", "คุณพิมพ์", "คุณวิชัย", "คุณนภา"];

const MODAL_TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00",
];

const THAI_MONTHS_SHORT = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
function isoToThaiShort(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${THAI_MONTHS_SHORT[m - 1]} ${y + 543}`;
}

const DEFAULT_EMAIL_SUBJECT = "ยืนยันนัดสัมภาษณ์";
const DEFAULT_EMAIL_BODY = "เรียน ผู้สมัคร,\n\nเราขอเรียนเชิญคุณเข้าสัมภาษณ์ตามวันและเวลาที่นัดหมาย กรุณาตอบกลับเพื่อยืนยันการเข้าร่วม หรือแจ้งหากต้องการเปลี่ยนแปลงวันเวลา\n\nขอบคุณครับ/ค่ะ\nทีม HR";

// ─── Shared modal shell ─────────────────────────────────────────────────────
function ModalShell({
  title,
  icon,
  onClose,
  children,
  footer,
  maxWidth = "max-w-sm",
}: {
  title: string;
  icon?: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
  footer: React.ReactNode;
  maxWidth?: string;
}) {
  const backdropRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={backdropRef}
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]"
    >
      <div className={`bg-white rounded-xl border border-gray-200 shadow-2xl w-full ${maxWidth} mx-4 overflow-hidden`}>
        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="text-[16px] font-bold text-[#1A1A2E]">{title}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-4 py-4 space-y-3">{children}</div>
        <div className="flex items-center gap-2 px-4 pb-4">{footer}</div>
      </div>
    </div>
  );
}

function CancelBtn({ onClick, label = "ยกเลิก" }: { onClick: () => void; label?: string }) {
  return (
    <button onClick={onClick} className="flex-1 py-2 rounded-xl border border-gray-200 text-[15px] font-medium text-gray-600 hover:bg-gray-50 transition-colors">
      {label}
    </button>
  );
}

function ConfirmBtn({ onClick, label = "ยืนยัน", disabled = false, danger = false }: { onClick: () => void; label?: string; disabled?: boolean; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex-1 py-2 rounded-xl border text-[15px] font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
        danger
          ? "border-red-400 text-red-500 hover:bg-red-50"
          : "border-[#127EE3] text-[#127EE3] hover:bg-[#F0F8FF]"
      }`}
    >
      {label}
    </button>
  );
}

// ─── Label util ─────────────────────────────────────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">{children}</p>;
}

// ─── EmailEditModal ──────────────────────────────────────────────────────────
function EmailEditModal({
  subject,
  body,
  onSave,
  onCancel,
}: {
  subject: string;
  body: string;
  onSave: (subject: string, body: string) => void;
  onCancel: () => void;
}) {
  const [draftSubject, setDraftSubject] = useState(subject);
  const [draftBody, setDraftBody] = useState(body);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100">
          <h2 className="text-[16px] font-bold text-[#1A1A2E]">แก้ไขข้อความอีเมล</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-4 py-4 space-y-3">
          <div>
            <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">หัวข้อ</p>
            <input
              type="text"
              value={draftSubject}
              onChange={(e) => setDraftSubject(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-[15px] text-gray-800 focus:outline-none focus:border-[#0DC2FF] focus:ring-2 focus:ring-[#0DC2FF]/30 transition-all"
            />
          </div>
          <div>
            <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">ข้อความ</p>
            <textarea
              value={draftBody}
              onChange={(e) => setDraftBody(e.target.value)}
              rows={7}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-[15px] text-gray-800 resize-none focus:outline-none focus:border-[#0DC2FF] focus:ring-2 focus:ring-[#0DC2FF]/30 transition-all"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 pb-4">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-xl border border-gray-200 text-[15px] font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={() => onSave(draftSubject, draftBody)}
            className="flex-1 py-2 rounded-xl border border-[#127EE3] text-[15px] font-semibold text-[#127EE3] hover:bg-[#F0F8FF] transition-colors"
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ScheduleInterviewModal ──────────────────────────────────────────────────
function ScheduleModal({
  applicantName,
  prefillDate,
  prefillInterviewer,
  onConfirm,
  onCancel,
}: {
  applicantName: string;
  prefillDate?: string;
  prefillInterviewer?: string;
  onConfirm: (date: string, time: string, interviewer: string, sendEmail: boolean) => void;
  onCancel: () => void;
}) {
  const todayIso = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(prefillDate ?? todayIso);
  const [time, setTime] = useState<string | null>(null);
  const [interviewer, setInterviewer] = useState(prefillInterviewer ?? INTERVIEWERS[0]);
  const [sendEmail, setSendEmail] = useState(true);
  const [emailSubject, setEmailSubject] = useState(DEFAULT_EMAIL_SUBJECT);
  const [emailBody, setEmailBody] = useState(DEFAULT_EMAIL_BODY);
  const [emailEdited, setEmailEdited] = useState(false);
  const [showEmailEdit, setShowEmailEdit] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  const canConfirm = !!date && !!time && !!interviewer;

  return (
    <>
      <div
        ref={backdropRef}
        onClick={(e) => { if (e.target === backdropRef.current) onCancel(); }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]"
      >
        <div className="bg-white rounded-xl border border-gray-200 shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
          <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-[#127EE3]" />
              <h2 className="text-[16px] font-bold text-[#1A1A2E]">ลงตารางนัดสัมภาษณ์</h2>
            </div>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="w-4 h-4" /></button>
          </div>
          <div className="px-4 py-4 space-y-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-[#F0F8FF] rounded-xl border border-[#0DC2FF]/30">
              <User className="w-3.5 h-3.5 text-[#127EE3] flex-shrink-0" />
              <span className="text-[14px] text-gray-500">ผู้สมัคร:</span>
              <span className="text-[14px] font-semibold text-[#1A1A2E]">{applicantName}</span>
            </div>
            <div>
              <FieldLabel>วันที่</FieldLabel>
              <input type="date" value={date} min={todayIso}
                onChange={(e) => { setDate(e.target.value); setTime(null); }}
                className={`w-full px-3.5 py-2 rounded-xl border text-[15px] font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#0DC2FF]/40 ${date ? "border-[#0DC2FF] bg-[#F0F8FF] text-[#1A1A2E]" : "border-gray-200 bg-[#F0F2F5] text-gray-400"}`}
              />
              {date && <p className="mt-1 text-[13px] text-[#127EE3] font-medium pl-1">{isoToThaiShort(date)}</p>}
            </div>
            <div>
              <FieldLabel>เวลา</FieldLabel>
              <div className="grid grid-cols-4 gap-1.5">
                {MODAL_TIME_SLOTS.map((t) => (
                  <button key={t} onClick={() => setTime(t)}
                    className={`py-1.5 rounded-xl text-[14px] font-semibold border transition-all ${time === t ? "bg-[#127EE3] text-white border-[#127EE3] shadow-sm" : "bg-[#F0F2F5] text-gray-600 border-transparent hover:bg-[#E8EDF2] hover:border-gray-200"}`}
                  >{t}</button>
                ))}
              </div>
            </div>
            <div>
              <FieldLabel>ผู้สัมภาษณ์</FieldLabel>
              <div className="relative">
                <select value={interviewer} onChange={(e) => setInterviewer(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-xl border text-[15px] font-medium transition-all appearance-none focus:outline-none focus:ring-2 focus:ring-[#0DC2FF]/40 ${interviewer ? "border-[#0DC2FF] bg-[#F0F8FF] text-[#1A1A2E]" : "border-gray-200 bg-[#F0F2F5] text-gray-400"}`}
                >
                  {INTERVIEWERS.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-start justify-between gap-2">
                <label className="flex items-start gap-2.5 cursor-pointer select-none flex-1">
                  <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-[#127EE3] cursor-pointer flex-shrink-0"
                  />
                  <div>
                    <span className="text-sm text-gray-700 font-medium">ส่งอีเมลแจ้งผู้สมัคร</span>
                    <p className="text-xs text-gray-500 mt-0.5">ผู้สมัครจะได้รับวันและเวลาสัมภาษณ์</p>
                  </div>
                </label>
                {sendEmail && (
                  <button onClick={() => setShowEmailEdit(true)}
                    className="flex-shrink-0 flex items-center gap-1 text-[14px] font-medium text-[#127EE3] hover:text-[#0e6bc7] transition-colors mt-0.5"
                  >
                    {emailEdited && <span className="w-1.5 h-1.5 rounded-full bg-[#127EE3] flex-shrink-0" />}
                    แก้ไขข้อความ
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 pb-4">
            <CancelBtn onClick={onCancel} />
            <ConfirmBtn onClick={() => canConfirm && onConfirm(date, time!, interviewer, sendEmail)} disabled={!canConfirm} />
          </div>
        </div>
      </div>
      {showEmailEdit && createPortal(
        <EmailEditModal
          subject={emailSubject} body={emailBody}
          onSave={(s, b) => { setEmailSubject(s); setEmailBody(b); setEmailEdited(true); setShowEmailEdit(false); }}
          onCancel={() => setShowEmailEdit(false)}
        />,
        document.body
      )}
    </>
  );
}

// ─── ForwardReviewModal ──────────────────────────────────────────────────────
function ForwardReviewModal({
  applicantName,
  onConfirm,
  onCancel,
}: {
  applicantName: string;
  onConfirm: (reviewer: string, note: string, sendEmail: boolean) => void;
  onCancel: () => void;
}) {
  const [reviewer, setReviewer] = useState(INTERVIEWERS[0]);
  const [note, setNote] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  return (
    <ModalShell title="ส่งต่อให้พิจารณา" icon={<Send className="w-4 h-4 text-[#127EE3]" />} onClose={onCancel}
      footer={<><CancelBtn onClick={onCancel} /><ConfirmBtn onClick={() => onConfirm(reviewer, note, sendEmail)} /></>}
    >
      <div className="flex items-center gap-2 px-3 py-2 bg-[#F0F8FF] rounded-xl border border-[#0DC2FF]/30">
        <User className="w-3.5 h-3.5 text-[#127EE3] flex-shrink-0" />
        <span className="text-[14px] text-gray-500">ผู้สมัคร:</span>
        <span className="text-[14px] font-semibold text-[#1A1A2E]">{applicantName}</span>
      </div>
      <div>
        <FieldLabel>ผู้พิจารณา</FieldLabel>
        <div className="relative">
          <select value={reviewer} onChange={(e) => setReviewer(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-[#0DC2FF] bg-[#F0F8FF] text-[15px] font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-[#0DC2FF]/40 text-[#1A1A2E]"
          >
            {INTERVIEWERS.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        </div>
      </div>
      <div>
        <FieldLabel>ข้อความ / Note</FieldLabel>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="เหตุผลหรือข้อความสำหรับผู้พิจารณา..."
          className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-[15px] text-gray-800 resize-none focus:outline-none focus:border-[#0DC2FF] focus:ring-2 focus:ring-[#0DC2FF]/30 transition-all"
        />
      </div>
      <label className="flex items-center gap-2.5 cursor-pointer select-none">
        <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 accent-[#127EE3] cursor-pointer"
        />
        <span className="text-sm text-gray-700">ส่งอีเมลแจ้งผู้พิจารณา</span>
      </label>
    </ModalShell>
  );
}

// ─── RejectReasonModal ───────────────────────────────────────────────────────
const REJECT_REASONS = [
  "ทักษะไม่ตรงกับที่ต้องการ",
  "ประสบการณ์ไม่เพียงพอ",
  "เงินเดือนที่ต้องการสูงเกินไป",
  "ไม่ตรงกับวัฒนธรรมองค์กร",
  "ตำแหน่งถูกปิด",
  "ไม่มาสัมภาษณ์",
  "ถอนตัวเอง",
  "อื่นๆ",
];

function RejectReasonModal({
  applicantName,
  initialReason,
  initialNote,
  onConfirm,
  onCancel,
}: {
  applicantName: string;
  initialReason?: string;
  initialNote?: string;
  onConfirm: (reason: string, note: string) => void;
  onCancel: () => void;
}) {
  const [reason, setReason] = useState(initialReason ?? REJECT_REASONS[0]);
  const [note, setNote] = useState(initialNote ?? "");
  return (
    <ModalShell title="บันทึกเหตุผลที่ไม่ผ่าน" icon={<AlertCircle className="w-4 h-4 text-red-400" />} onClose={onCancel}
      footer={<><CancelBtn onClick={onCancel} /><ConfirmBtn onClick={() => onConfirm(reason, note)} label="บันทึก" danger /></>}
    >
      <div className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-xl border border-red-100">
        <User className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
        <span className="text-[14px] text-gray-500">ผู้สมัคร:</span>
        <span className="text-[14px] font-semibold text-[#1A1A2E]">{applicantName}</span>
      </div>
      <div>
        <FieldLabel>เหตุผล</FieldLabel>
        <div className="relative">
          <select value={reason} onChange={(e) => setReason(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-[15px] font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-red-200 text-gray-800"
          >
            {REJECT_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        </div>
      </div>
      <div>
        <FieldLabel>หมายเหตุเพิ่มเติม</FieldLabel>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="(ไม่บังคับ)"
          className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-[15px] text-gray-800 resize-none focus:outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all"
        />
      </div>
    </ModalShell>
  );
}

// ─── InterviewResultModal ────────────────────────────────────────────────────
type InterviewOutcome = "passed" | "compare" | "rejected";

function InterviewResultModal({
  applicantName,
  onConfirm,
  onCancel,
}: {
  applicantName: string;
  onConfirm: (outcome: InterviewOutcome, note: string) => void;
  onCancel: () => void;
}) {
  const [outcome, setOutcome] = useState<InterviewOutcome>("passed");
  const [note, setNote] = useState("");
  const options: { key: InterviewOutcome; label: string; desc: string; color: string }[] = [
    { key: "passed",   label: "ผ่านสัมภาษณ์",       desc: "เดินหน้าต่อได้",          color: "border-teal-400 bg-teal-50 text-teal-700" },
    { key: "compare",  label: "รอเปรียบเทียบ",       desc: "ยังอยู่ระหว่างพิจารณา",    color: "border-amber-400 bg-amber-50 text-amber-700" },
    { key: "rejected", label: "ไม่ผ่านสัมภาษณ์",     desc: "ไม่เหมาะสมกับตำแหน่ง",    color: "border-red-400 bg-red-50 text-red-600" },
  ];
  return (
    <ModalShell title="บันทึกผลสัมภาษณ์" icon={<CheckCircle2 className="w-4 h-4 text-[#127EE3]" />} onClose={onCancel}
      footer={<><CancelBtn onClick={onCancel} /><ConfirmBtn onClick={() => onConfirm(outcome, note)} label="บันทึก" /></>}
    >
      <div className="flex items-center gap-2 px-3 py-2 bg-[#F0F8FF] rounded-xl border border-[#0DC2FF]/30">
        <User className="w-3.5 h-3.5 text-[#127EE3] flex-shrink-0" />
        <span className="text-[14px] text-gray-500">ผู้สมัคร:</span>
        <span className="text-[14px] font-semibold text-[#1A1A2E]">{applicantName}</span>
      </div>
      <div className="space-y-1.5">
        <FieldLabel>ผลการสัมภาษณ์</FieldLabel>
        {options.map((o) => (
          <button key={o.key} onClick={() => setOutcome(o.key)}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border-2 text-left transition-all ${outcome === o.key ? o.color : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"}`}
          >
            <span className="text-[15px] font-semibold">{o.label}</span>
            <span className="text-[13px] opacity-70">{o.desc}</span>
          </button>
        ))}
      </div>
      <div>
        <FieldLabel>หมายเหตุ</FieldLabel>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="(ไม่บังคับ) ความคิดเห็นเพิ่มเติม..."
          className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-[15px] text-gray-800 resize-none focus:outline-none focus:border-[#0DC2FF] focus:ring-2 focus:ring-[#0DC2FF]/30 transition-all"
        />
      </div>
    </ModalShell>
  );
}

// ─── HiredNoteModal ──────────────────────────────────────────────────────────
function HiredNoteModal({
  applicantName,
  initialNote,
  onConfirm,
  onCancel,
}: {
  applicantName: string;
  initialNote?: string;
  onConfirm: (note: string) => void;
  onCancel: () => void;
}) {
  const [note, setNote] = useState(initialNote ?? "");
  return (
    <ModalShell title="บันทึกเพิ่มเติม" icon={<Award className="w-4 h-4 text-emerald-500" />} onClose={onCancel}
      footer={<><CancelBtn onClick={onCancel} /><ConfirmBtn onClick={() => onConfirm(note)} label="บันทึก" /></>}
    >
      <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
        <User className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
        <span className="text-[14px] text-gray-500">ผู้สมัคร:</span>
        <span className="text-[14px] font-semibold text-[#1A1A2E]">{applicantName}</span>
      </div>
      <div>
        <FieldLabel>โน้ต</FieldLabel>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} placeholder="บันทึกข้อมูลสำหรับพนักงานใหม่..."
          className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-[15px] text-gray-800 resize-none focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
        />
      </div>
    </ModalShell>
  );
}

// ─── ReasonModal (generic: no-show, cancel) ──────────────────────────────────
function ReasonModal({
  title,
  applicantName,
  onConfirm,
  onCancel,
}: {
  title: string;
  applicantName: string;
  onConfirm: (note: string) => void;
  onCancel: () => void;
}) {
  const [note, setNote] = useState("");
  return (
    <ModalShell title={title} onClose={onCancel}
      footer={<><CancelBtn onClick={onCancel} /><ConfirmBtn onClick={() => onConfirm(note)} label="บันทึก" danger /></>}
    >
      <div className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-xl border border-red-100">
        <User className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
        <span className="text-[14px] text-gray-500">ผู้สมัคร:</span>
        <span className="text-[14px] font-semibold text-[#1A1A2E]">{applicantName}</span>
      </div>
      <div>
        <FieldLabel>หมายเหตุ</FieldLabel>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="(ไม่บังคับ)"
          className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-[15px] text-gray-800 resize-none focus:outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all"
        />
      </div>
    </ModalShell>
  );
}

// ─── Bulk modals ────────────────────────────────────────────────────────────

function BulkScheduleModal({
  count,
  onConfirm,
  onCancel,
}: {
  count: number;
  onConfirm: (date: string, time: string, interviewer: string, sendEmail: boolean) => void;
  onCancel: () => void;
}) {
  const todayIso = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(todayIso);
  const [time, setTime] = useState<string | null>(null);
  const [interviewer, setInterviewer] = useState(INTERVIEWERS[0]);
  const [sendEmail, setSendEmail] = useState(true);
  const [emailSubject, setEmailSubject] = useState(DEFAULT_EMAIL_SUBJECT);
  const [emailBody, setEmailBody] = useState(DEFAULT_EMAIL_BODY);
  const [emailEdited, setEmailEdited] = useState(false);
  const [showEmailEdit, setShowEmailEdit] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const canConfirm = !!date && !!time && !!interviewer;
  return (
    <>
      <div ref={backdropRef} onClick={(e) => { if (e.target === backdropRef.current) onCancel(); }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
        <div className="bg-white rounded-xl border border-gray-200 shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
          <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-[#127EE3]" />
              <h2 className="text-[16px] font-bold text-[#1A1A2E]">ลงตารางนัดสัมภาษณ์</h2>
            </div>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="w-4 h-4" /></button>
          </div>
          <div className="px-4 py-4 space-y-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-[#F0F8FF] rounded-xl border border-[#0DC2FF]/30">
              <Users className="w-3.5 h-3.5 text-[#127EE3] flex-shrink-0" />
              <span className="text-[14px] text-gray-500">ผู้สมัครที่เลือก:</span>
              <span className="text-[14px] font-semibold text-[#127EE3]">{count} คน</span>
            </div>
            <div>
              <FieldLabel>วันที่</FieldLabel>
              <input type="date" value={date} min={todayIso}
                onChange={(e) => { setDate(e.target.value); setTime(null); }}
                className={`w-full px-3.5 py-2 rounded-xl border text-[15px] font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#0DC2FF]/40 ${date ? "border-[#0DC2FF] bg-[#F0F8FF] text-[#1A1A2E]" : "border-gray-200 bg-[#F0F2F5] text-gray-400"}`}
              />
              {date && <p className="mt-1 text-[13px] text-[#127EE3] font-medium pl-1">{isoToThaiShort(date)}</p>}
            </div>
            <div>
              <FieldLabel>เวลา</FieldLabel>
              <div className="grid grid-cols-4 gap-1.5">
                {MODAL_TIME_SLOTS.map((t) => (
                  <button key={t} onClick={() => setTime(t)}
                    className={`py-1.5 rounded-xl text-[14px] font-semibold border transition-all ${time === t ? "bg-[#127EE3] text-white border-[#127EE3] shadow-sm" : "bg-[#F0F2F5] text-gray-600 border-transparent hover:bg-[#E8EDF2] hover:border-gray-200"}`}
                  >{t}</button>
                ))}
              </div>
            </div>
            <div>
              <FieldLabel>ผู้สัมภาษณ์</FieldLabel>
              <div className="relative">
                <select value={interviewer} onChange={(e) => setInterviewer(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#0DC2FF] bg-[#F0F8FF] text-[15px] font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-[#0DC2FF]/40 text-[#1A1A2E]">
                  {INTERVIEWERS.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <div className="flex items-start justify-between gap-2">
                <label className="flex items-start gap-2.5 cursor-pointer select-none flex-1">
                  <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-[#127EE3] cursor-pointer flex-shrink-0" />
                  <div>
                    <span className="text-sm text-gray-700 font-medium">ส่งอีเมลแจ้งผู้สมัครทุกคน</span>
                    <p className="text-xs text-gray-500 mt-0.5">ผู้สมัคร {count} คนจะได้รับอีเมลนัด</p>
                  </div>
                </label>
                {sendEmail && (
                  <button onClick={() => setShowEmailEdit(true)}
                    className="flex-shrink-0 flex items-center gap-1 text-[14px] font-medium text-[#127EE3] hover:text-[#0e6bc7] transition-colors mt-0.5">
                    {emailEdited && <span className="w-1.5 h-1.5 rounded-full bg-[#127EE3] flex-shrink-0" />}
                    แก้ไขข้อความ
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 pb-4">
            <CancelBtn onClick={onCancel} />
            <ConfirmBtn onClick={() => canConfirm && onConfirm(date, time!, interviewer, sendEmail)} disabled={!canConfirm} />
          </div>
        </div>
      </div>
      {showEmailEdit && createPortal(
        <EmailEditModal subject={emailSubject} body={emailBody}
          onSave={(s, b) => { setEmailSubject(s); setEmailBody(b); setEmailEdited(true); setShowEmailEdit(false); }}
          onCancel={() => setShowEmailEdit(false)} />, document.body)}
    </>
  );
}

function BulkForwardModal({
  count,
  onConfirm,
  onCancel,
}: {
  count: number;
  onConfirm: (reviewer: string, note: string, sendEmail: boolean) => void;
  onCancel: () => void;
}) {
  const [reviewer, setReviewer] = useState(INTERVIEWERS[0]);
  const [note, setNote] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  return (
    <ModalShell title="ส่งต่อให้พิจารณา" icon={<Send className="w-4 h-4 text-[#127EE3]" />} onClose={onCancel}
      footer={<><CancelBtn onClick={onCancel} /><ConfirmBtn onClick={() => onConfirm(reviewer, note, sendEmail)} /></>}>
      <div className="flex items-center gap-2 px-3 py-2 bg-[#F0F8FF] rounded-xl border border-[#0DC2FF]/30">
        <Users className="w-3.5 h-3.5 text-[#127EE3] flex-shrink-0" />
        <span className="text-[14px] text-gray-500">ผู้สมัครที่เลือก:</span>
        <span className="text-[14px] font-semibold text-[#127EE3]">{count} คน</span>
      </div>
      <div>
        <FieldLabel>ผู้พิจารณา</FieldLabel>
        <div className="relative">
          <select value={reviewer} onChange={(e) => setReviewer(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-[#0DC2FF] bg-[#F0F8FF] text-[15px] font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-[#0DC2FF]/40 text-[#1A1A2E]">
            {INTERVIEWERS.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        </div>
      </div>
      <div>
        <FieldLabel>ข้อความ / Note</FieldLabel>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="เหตุผลหรือข้อความสำหรับผู้พิจารณา..."
          className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-[15px] text-gray-800 resize-none focus:outline-none focus:border-[#0DC2FF] focus:ring-2 focus:ring-[#0DC2FF]/30 transition-all" />
      </div>
      <label className="flex items-center gap-2.5 cursor-pointer select-none">
        <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 accent-[#127EE3] cursor-pointer" />
        <span className="text-sm text-gray-700">ส่งอีเมลแจ้งผู้พิจารณา</span>
      </label>
    </ModalShell>
  );
}

function BulkRejectModal({
  count,
  onConfirm,
  onCancel,
}: {
  count: number;
  onConfirm: (reason: string, note: string) => void;
  onCancel: () => void;
}) {
  const [reason, setReason] = useState(REJECT_REASONS[0]);
  const [note, setNote] = useState("");
  return (
    <ModalShell title="บันทึกเหตุผลที่ไม่ผ่าน" icon={<AlertCircle className="w-4 h-4 text-red-400" />} onClose={onCancel}
      footer={<><CancelBtn onClick={onCancel} /><ConfirmBtn onClick={() => onConfirm(reason, note)} label="บันทึก" danger /></>}>
      <div className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-xl border border-red-100">
        <Users className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
        <span className="text-[14px] text-gray-500">ผู้สมัครที่เลือก:</span>
        <span className="text-[14px] font-semibold text-red-500">{count} คน</span>
      </div>
      <div>
        <FieldLabel>เหตุผล</FieldLabel>
        <div className="relative">
          <select value={reason} onChange={(e) => setReason(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-[15px] font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-red-200 text-gray-800">
            {REJECT_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        </div>
      </div>
      <div>
        <FieldLabel>หมายเหตุเพิ่มเติม</FieldLabel>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="(ไม่บังคับ)"
          className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-[15px] text-gray-800 resize-none focus:outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all" />
      </div>
    </ModalShell>
  );
}

function BulkEmailModal({
  count,
  onConfirm,
  onCancel,
}: {
  count: number;
  onConfirm: (subject: string, body: string) => void;
  onCancel: () => void;
}) {
  const [subject, setSubject] = useState("ข้อมูลเพิ่มเติมเกี่ยวกับการสมัครงาน");
  const [body, setBody] = useState("เรียน ผู้สมัคร,\n\nขอบคุณที่สนใจสมัครงานกับเรา เราต้องการแจ้งข้อมูลเพิ่มเติมเกี่ยวกับกระบวนการสมัครงาน\n\nกรุณาตอบกลับหากมีข้อสงสัย\n\nขอบคุณครับ/ค่ะ\nทีม HR");
  return (
    <ModalShell title="ส่งอีเมลหาผู้สมัคร" icon={<Mail className="w-4 h-4 text-[#127EE3]" />} onClose={onCancel}
      maxWidth="max-w-md"
      footer={<><CancelBtn onClick={onCancel} /><ConfirmBtn onClick={() => onConfirm(subject, body)} label="ส่งอีเมล" disabled={!subject.trim() || !body.trim()} /></>}>
      <div className="flex items-center gap-2 px-3 py-2 bg-[#F0F8FF] rounded-xl border border-[#0DC2FF]/30">
        <Users className="w-3.5 h-3.5 text-[#127EE3] flex-shrink-0" />
        <span className="text-[14px] text-gray-500">ถึง:</span>
        <span className="text-[14px] font-semibold text-[#127EE3]">{count} ผู้สมัคร</span>
      </div>
      <div>
        <FieldLabel>หัวข้อ</FieldLabel>
        <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)}
          className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-[15px] text-gray-800 focus:outline-none focus:border-[#0DC2FF] focus:ring-2 focus:ring-[#0DC2FF]/30 transition-all" />
      </div>
      <div>
        <FieldLabel>ข้อความ</FieldLabel>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={6}
          className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-[15px] text-gray-800 resize-none focus:outline-none focus:border-[#0DC2FF] focus:ring-2 focus:ring-[#0DC2FF]/30 transition-all" />
      </div>
    </ModalShell>
  );
}

function BulkInterviewResultModal({
  count,
  onConfirm,
  onCancel,
}: {
  count: number;
  onConfirm: (outcome: InterviewOutcome, note: string) => void;
  onCancel: () => void;
}) {
  const [outcome, setOutcome] = useState<InterviewOutcome>("passed");
  const [note, setNote] = useState("");
  const options: { key: InterviewOutcome; label: string; desc: string; color: string }[] = [
    { key: "passed",   label: "ผ่านสัมภาษณ์",   desc: "เดินหน้าต่อได้",       color: "border-teal-400 bg-teal-50 text-teal-700" },
    { key: "compare",  label: "รอเปรียบเทียบ",   desc: "ยังอยู่ระหว่างพิจารณา", color: "border-amber-400 bg-amber-50 text-amber-700" },
    { key: "rejected", label: "ไม่ผ่านสัมภาษณ์", desc: "ไม่เหมาะสมกับตำแหน่ง",  color: "border-red-400 bg-red-50 text-red-600" },
  ];
  return (
    <ModalShell title="บันทึกผลสัมภาษณ์" icon={<CheckCircle2 className="w-4 h-4 text-[#127EE3]" />} onClose={onCancel}
      footer={<><CancelBtn onClick={onCancel} /><ConfirmBtn onClick={() => onConfirm(outcome, note)} label="บันทึก" /></>}>
      <div className="flex items-center gap-2 px-3 py-2 bg-[#F0F8FF] rounded-xl border border-[#0DC2FF]/30">
        <Users className="w-3.5 h-3.5 text-[#127EE3] flex-shrink-0" />
        <span className="text-[14px] text-gray-500">ผู้สมัครที่เลือก:</span>
        <span className="text-[14px] font-semibold text-[#127EE3]">{count} คน</span>
      </div>
      <div className="space-y-1.5">
        <FieldLabel>ผลการสัมภาษณ์</FieldLabel>
        {options.map((o) => (
          <button key={o.key} onClick={() => setOutcome(o.key)}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border-2 text-left transition-all ${outcome === o.key ? o.color : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"}`}>
            <span className="text-[15px] font-semibold">{o.label}</span>
            <span className="text-[13px] opacity-70">{o.desc}</span>
          </button>
        ))}
      </div>
      <div>
        <FieldLabel>หมายเหตุ</FieldLabel>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="(ไม่บังคับ)"
          className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-[15px] text-gray-800 resize-none focus:outline-none focus:border-[#0DC2FF] focus:ring-2 focus:ring-[#0DC2FF]/30 transition-all" />
      </div>
    </ModalShell>
  );
}

// ─── BulkActionBar ───────────────────────────────────────────────────────────
type BulkAction = "shortlist" | "reject" | "email" | "forward" | "schedule" | "to_interview" | "interview_result" | "reschedule" | "hire" | "offer_reject" | "restore_shortlist";

type BulkActionDef = { key: BulkAction; label: string; icon: React.ReactNode; variant: "primary" | "secondary" | "danger" };

function getBulkActions(stage: PipelineStage | "all"): BulkActionDef[] {
  const emailBtn: BulkActionDef = { key: "email", label: "ส่งอีเมล", icon: <Mail className="w-3.5 h-3.5" />, variant: "secondary" };
  switch (stage) {
    case "new": return [
      { key: "shortlist",  label: "ชอร์ตลิสต์",          icon: <ThumbsUp className="w-3.5 h-3.5" />,   variant: "primary" },
      { key: "reject",     label: "ไม่ผ่านการคัดเลือก",   icon: <ThumbsDown className="w-3.5 h-3.5" />, variant: "danger" },
      emailBtn,
    ];
    case "shortlist": return [
      { key: "forward",    label: "ส่งต่อให้พิจารณา",     icon: <Send className="w-3.5 h-3.5" />,       variant: "primary" },
      { key: "schedule",   label: "ลงตารางนัดสัมภาษณ์",   icon: <Calendar className="w-3.5 h-3.5" />,   variant: "secondary" },
      { key: "reject",     label: "ไม่ผ่านการคัดเลือก",   icon: <ThumbsDown className="w-3.5 h-3.5" />, variant: "danger" },
      emailBtn,
    ];
    case "review": return [
      { key: "schedule",      label: "ลงตารางนัดสัมภาษณ์",       icon: <Calendar className="w-3.5 h-3.5" />,   variant: "primary" },
      { key: "to_interview",  label: "ย้ายไปลิสต์ต้องนัดสัมภาษณ์", icon: <ThumbsUp className="w-3.5 h-3.5" />,   variant: "secondary" },
      emailBtn,
    ];
    case "to_interview": return [
      { key: "schedule",   label: "ลงตารางนัดสัมภาษณ์",   icon: <Calendar className="w-3.5 h-3.5" />,   variant: "primary" },
      { key: "reject",     label: "ไม่ผ่านการคัดเลือก",   icon: <ThumbsDown className="w-3.5 h-3.5" />, variant: "danger" },
      emailBtn,
    ];
    case "interview": return [
      { key: "interview_result", label: "บันทึกผลสัมภาษณ์", icon: <CheckCircle2 className="w-3.5 h-3.5" />, variant: "primary" },
      { key: "reschedule",       label: "เปลี่ยนวันนัด",    icon: <Calendar className="w-3.5 h-3.5" />,    variant: "secondary" },
      emailBtn,
    ];
    case "passed": return [
      { key: "hire",    label: "รับเข้าทำงาน",     icon: <Award className="w-3.5 h-3.5" />,       variant: "primary" },
      { key: "reject",  label: "ไม่ผ่าน / ยกเลิก", icon: <ThumbsDown className="w-3.5 h-3.5" />,  variant: "danger" },
      emailBtn,
    ];
    case "offer": return [
      { key: "hire",         label: "รับเข้าทำงาน",   icon: <Award className="w-3.5 h-3.5" />,       variant: "primary" },
      { key: "offer_reject", label: "ไม่รับข้อเสนอ",  icon: <ThumbsDown className="w-3.5 h-3.5" />,  variant: "danger" },
      emailBtn,
    ];
    case "hired": return [emailBtn];
    case "rejected": return [
      { key: "restore_shortlist", label: "ย้ายกลับไปชอร์ตลิสต์", icon: <ThumbsUp className="w-3.5 h-3.5" />, variant: "primary" },
      emailBtn,
    ];
    default: return [emailBtn];
  }
}

function BulkActionBar({
  count,
  stage,
  onAction,
  onClear,
}: {
  count: number;
  stage: PipelineStage | "all";
  onAction: (action: BulkAction) => void;
  onClear: () => void;
}) {
  const actions = getBulkActions(stage);
  const btnCls = {
    primary:   "border-[#127EE3]/60 text-[#127EE3] hover:bg-[#127EE3]/5 hover:border-[#127EE3]",
    secondary: "border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300",
    danger:    "border-red-100 text-red-400 hover:bg-red-50 hover:border-red-200",
  };
  return (
    <div className="bg-white border border-[#127EE3]/20 rounded-2xl shadow-sm px-5 py-3.5 mb-4 flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-5 h-5 rounded-md bg-[#127EE3] flex items-center justify-center">
          <CheckCircle2 className="w-3 h-3 text-white" />
        </div>
        <span className="text-[15px] font-semibold text-[#1A1A2E]">
          เลือกแล้ว <span className="text-[#127EE3]">{count}</span> คน
        </span>
      </div>
      <div className="w-px h-5 bg-gray-100 flex-shrink-0" />
      <div className="flex items-center gap-2 flex-wrap flex-1">
        {actions.map((a) => (
          <button key={a.key} onClick={() => onAction(a.key)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[14.5px] font-medium border transition-all ${btnCls[a.variant]}`}>
            {a.icon}{a.label}
          </button>
        ))}
      </div>
      <button onClick={onClear}
        className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[14px] font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all border border-transparent">
        <X className="w-3.5 h-3.5" />ยกเลิก
      </button>
    </div>
  );
}

// ─── Reusable card action button components ──────────────────────────────────
function CardActionBtn({ label, onClick, variant = "primary" }: { label: string; onClick: () => void; variant?: "primary" | "secondary" | "danger" }) {
  const cls = {
    primary:   "bg-[#127EE3] text-white hover:bg-[#0f6cc7] border-transparent shadow-sm",
    secondary: "border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 bg-white",
    danger:    "border-red-100 text-red-500 hover:bg-red-50 hover:border-red-300 bg-white",
  }[variant];
  return (
    <button onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`px-3.5 py-1.5 rounded-lg text-[14px] font-medium border transition-all ${cls}`}
    >
      {label}
    </button>
  );
}

// ─── Adaptive ApplicantCard ───────────────────────────────────────────────────
type CardAction =
  | { type: "schedule" }
  | { type: "forward_review" }
  | { type: "reject" }
  | { type: "shortlist" }
  | { type: "to_interview" }
  | { type: "interview_result" }
  | { type: "reschedule" }
  | { type: "no_show" }
  | { type: "cancel_interview" }
  | { type: "hire" }
  | { type: "wait_compare" }
  | { type: "edit_reject" }
  | { type: "restore_shortlist" }
  | { type: "hired_note" }
  | { type: "offer_hire" }
  | { type: "offer_reject" };

function ApplicantCard({
  applicant,
  onSelect,
  onAction,
  isSelected,
  onToggleSelect,
  checkboxDisabled,
}: {
  applicant: ApplicantRow;
  onSelect: (a: ApplicantRow) => void;
  onAction: (id: string, action: CardAction) => void;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  checkboxDisabled?: boolean;
}) {
  const { stage } = applicant;

  const renderMeta = () => {
    switch (stage) {
      case "new":
      case "shortlist":
        return (
          <div className="mt-3 space-y-2.5">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5 text-[15px] text-gray-500"><Briefcase className="w-3.5 h-3.5 text-gray-400" />{applicant.experience}</span>
              <span className="flex items-center gap-1.5 text-[15px] text-gray-500"><MapPin className="w-3.5 h-3.5 text-gray-400" />{applicant.location}</span>
              <span className="flex items-center gap-1.5 text-[15px] text-gray-500"><Banknote className="w-3.5 h-3.5 text-gray-400" />{applicant.salaryExpect}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {applicant.skills.slice(0, 4).map((s) => (
                <span key={s} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[14px] font-medium bg-gray-50 text-gray-600 border border-gray-200">
                  <Zap className="w-3 h-3 text-gray-400" />{s}
                </span>
              ))}
            </div>
            {stage === "shortlist" && applicant.note && (
              <p className="text-[14px] text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 truncate">{applicant.note}</p>
            )}
          </div>
        );
      case "review":
        return (
          <div className="mt-2.5 space-y-1.5">
            {(applicant.reviewers ?? []).length === 0
              ? <p className="text-[14px] text-gray-400">ยังไม่มี feedback</p>
              : (applicant.reviewers ?? []).map((r, i) => (
                <p key={i} className="text-[14px] text-gray-600 flex items-center gap-1">
                  <span>{REVIEWER_STATUS_ICON[r.status]}</span>
                  <span className="font-medium">{REVIEWER_STATUS_LABEL[r.status]}</span>
                  <span className="text-gray-300 mx-0.5">·</span>
                  <span className="text-gray-400">{r.name}</span>
                </p>
              ))
            }
          </div>
        );
      case "to_interview":
        return (
          <div className="mt-2.5 space-y-1">
            <p className="flex items-center gap-1.5 text-[14px] text-amber-600">
              <Clock className="w-3.5 h-3.5 text-amber-400" />รอนัดสัมภาษณ์
            </p>
            {applicant.note && <p className="text-[14px] text-gray-400 truncate">{applicant.note}</p>}
          </div>
        );
      case "interview":
        return (
          <div className="mt-2.5 space-y-1.5">
            {applicant.interviewType && (
              <p className="text-[14px] text-gray-500 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-gray-400" />
                {applicant.interviewType === "video" ? "Video Call" : applicant.interviewType === "onsite" ? "Onsite" : applicant.interviewType}
                {applicant.interviewers && applicant.interviewers.length > 0 && (
                  <><span className="text-gray-300">·</span><span className="text-gray-400">{applicant.interviewers[0]}</span></>
                )}
              </p>
            )}
            {!applicant.interviewType && !applicant.interviewDateIso && applicant.interviewDate && (
              <p className="text-[14px] text-gray-500 flex items-center gap-1.5">
                <CalendarClock className="w-3.5 h-3.5 text-gray-400" />{applicant.interviewDate}
              </p>
            )}
            {(applicant.interviewNote || applicant.note) && (
              <p className="text-[14px] text-gray-400 truncate">{applicant.interviewNote ?? applicant.note}</p>
            )}
          </div>
        );
      case "passed":
        return (
          <div className="mt-2.5 space-y-1">
            <p className="flex items-center gap-1.5 text-[14px] text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />ผ่านสัมภาษณ์แล้ว
            </p>
            {applicant.note && <p className="text-[14px] text-gray-400 truncate">{applicant.note}</p>}
          </div>
        );
      case "offer":
        return (
          <div className="mt-2.5 space-y-1.5">
            {applicant.offerAmount && (
              <p className="text-[14.5px] text-gray-600">เสนอเงินเดือน: <span className="text-[#127EE3] font-semibold">{applicant.offerAmount}</span></p>
            )}
            <p className="flex items-center gap-1.5 text-[14px] text-amber-600">
              <Clock className="w-3.5 h-3.5 text-amber-400" />รอผู้สมัครตอบรับ
            </p>
          </div>
        );
      case "hired":
        return (
          <div className="mt-2.5 space-y-1">
            <p className="flex items-center gap-1.5 text-[14px] text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />รับเข้าทำงานแล้ว
            </p>
            {applicant.note && <p className="text-[14px] text-gray-400 truncate">{applicant.note}</p>}
          </div>
        );
      case "rejected":
        return (
          <div className="mt-2.5 space-y-1.5">
            {applicant.rejectionReason && (
              <p className="flex items-center gap-1.5 text-[14px] text-red-500">
                <AlertCircle className="w-3.5 h-3.5 text-red-400" />{applicant.rejectionReason}
              </p>
            )}
            {applicant.note && <p className="text-[14px] text-gray-400 truncate">{applicant.note}</p>}
          </div>
        );
      default:
        return null;
    }
  };

  const renderActions = () => {
    const act = (action: CardAction) => () => onAction(applicant.id, action);
    switch (stage) {
      case "new":
        return <>
          <CardActionBtn label="ไม่ผ่านการคัดเลือก" onClick={act({ type: "reject" })} variant="danger" />
          <CardActionBtn label="ชอร์ตลิสต์" onClick={act({ type: "shortlist" })} variant="primary" />
        </>;
      case "shortlist":
        return <>
          <CardActionBtn label="ไม่ผ่าน" onClick={act({ type: "reject" })} variant="danger" />
          <CardActionBtn label="ลงตารางนัด" onClick={act({ type: "schedule" })} variant="secondary" />
          <CardActionBtn label="ส่งต่อให้พิจารณา" onClick={act({ type: "forward_review" })} variant="primary" />
        </>;
      case "review":
        return <>
          <CardActionBtn label="ย้ายไปลิสต์ต้องนัด" onClick={act({ type: "to_interview" })} variant="secondary" />
          <CardActionBtn label="ลงตารางนัดสัมภาษณ์" onClick={act({ type: "schedule" })} variant="primary" />
        </>;
      case "to_interview":
        return <>
          <CardActionBtn label="ไม่ผ่าน" onClick={act({ type: "reject" })} variant="danger" />
          <CardActionBtn label="ส่งต่อให้พิจารณา" onClick={act({ type: "forward_review" })} variant="secondary" />
          <CardActionBtn label="ลงตารางนัดสัมภาษณ์" onClick={act({ type: "schedule" })} variant="primary" />
        </>;
      case "interview":
        return <>
          <CardActionBtn label="ไม่มาสัมภาษณ์" onClick={act({ type: "no_show" })} variant="danger" />
          <CardActionBtn label="เปลี่ยนวันนัด" onClick={act({ type: "reschedule" })} variant="secondary" />
          <CardActionBtn label="บันทึกผลสัมภาษณ์" onClick={act({ type: "interview_result" })} variant="primary" />
        </>;
      case "passed":
        return <>
          <CardActionBtn label="ไม่ผ่าน" onClick={act({ type: "reject" })} variant="danger" />
          <CardActionBtn label="รอเปรียบเทียบ" onClick={act({ type: "wait_compare" })} variant="secondary" />
          <CardActionBtn label="รับเข้าทำงาน" onClick={act({ type: "hire" })} variant="primary" />
        </>;
      case "offer":
        return <>
          <CardActionBtn label="ไม่รับข้อเสนอ" onClick={act({ type: "offer_reject" })} variant="danger" />
          <CardActionBtn label="รับเข้าทำงาน" onClick={act({ type: "offer_hire" })} variant="primary" />
        </>;
      case "hired":
        return <CardActionBtn label="บันทึก / แก้ไขโน้ต" onClick={act({ type: "hired_note" })} variant="secondary" />;
      case "rejected":
        return <>
          <CardActionBtn label="แก้ไขเหตุผล" onClick={act({ type: "edit_reject" })} variant="secondary" />
          <CardActionBtn label="ย้ายกลับไปชอร์ตลิสต์" onClick={act({ type: "restore_shortlist" })} variant="primary" />
        </>;
      default:
        return null;
    }
  };

  const actions = renderActions();

  return (
    <div
      onClick={() => onSelect(applicant)}
      className={`bg-white rounded-2xl border cursor-pointer transition-all duration-150 group ${
        isSelected
          ? "border-[#127EE3]/40 ring-2 ring-[#127EE3]/10"
          : "border-gray-200 hover:border-gray-300 hover:shadow-md"
      }`}
    >
      <div className="px-5 pt-5 pb-4">
        {/* Top row: checkbox + avatar + name/title */}
        <div className="flex items-start gap-3.5">
          {onToggleSelect && (
            <div
              className={`flex-shrink-0 pt-1 ${checkboxDisabled ? "opacity-25" : ""}`}
              onClick={(e) => e.stopPropagation()}
              title={checkboxDisabled ? "เลือกได้เฉพาะผู้สมัครที่อยู่สถานะเดียวกัน" : undefined}
            >
              <input
                type="checkbox"
                checked={!!isSelected}
                disabled={checkboxDisabled}
                onChange={() => !checkboxDisabled && onToggleSelect(applicant.id)}
                className={`w-4 h-4 rounded border-gray-300 accent-[#127EE3] ${checkboxDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
              />
            </div>
          )}
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-[15px] font-bold shadow-sm"
              style={{ backgroundColor: applicant.avatarColor }}
            >
              {applicant.initials}
            </div>
            {!applicant.isRead && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#127EE3] rounded-full border-2 border-white" />
            )}
          </div>
          {/* Name + title/company */}
          <div className="flex-1 min-w-0">
            <p className="text-[17px] font-semibold text-[#111827] leading-tight group-hover:text-[#127EE3] transition-colors truncate">
              {applicant.name}
            </p>
            <p className="text-[15px] text-gray-500 mt-0.5 truncate leading-snug">
              <span className="font-medium text-gray-600">{applicant.currentTitle}</span>
              <span className="text-gray-400"> · {applicant.currentCompany}</span>
            </p>
          </div>
          {/* Stage badge top-right */}
          <div className="flex-shrink-0">
            <StageBadge stage={stage} />
          </div>
        </div>

        {/* Meta + skills */}
        {renderMeta()}
      </div>

      {/* Divider + actions bottom bar */}
      {actions && (
        <div
          className="flex items-center justify-end gap-2 px-5 py-3 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {actions}
        </div>
      )}
    </div>
  );
}

const hobbyIconMap: Record<string, React.ReactNode> = {
  "Photography": <Camera className="w-3 h-3" />,
  "Music Production": <Music className="w-3 h-3" />,
  "Gaming": <Gamepad2 className="w-3 h-3" />,
  "Travel": <Globe className="w-3 h-3" />,
  "Illustration": <Palette className="w-3 h-3" />,
};

const hobbyAdjectiveMap: Record<string, string> = {
  "Photography": "Creative",
  "Film": "Narrative",
  "Sketching": "Expressive",
  "Music Production": "Rhythmic",
  "Gaming": "Systematic",
  "Cooking": "Methodical",
  "Travel": "Curious",
  "Rock Climbing": "Determined",
  "Yoga": "Balanced",
  "Writing": "Articulate",
  "DIY": "Inventive",
  "Illustration": "Visual",
  "Podcast": "Communicative",
  "Board Games": "Tactical",
  "Dance": "Dynamic",
  "Reading": "Thoughtful",
  "Cycling": "Persistent",
};

const strengthNounMap: Record<string, string> = {
  "Negotiation": "Negotiator",
  "Strategic Thinking": "Strategist",
  "Storytelling": "Storyteller",
  "Leadership": "Leader",
  "Empathy": "Empath",
  "Execution": "Executor",
  "Facilitation": "Facilitator",
  "Analytical Thinking": "Analyst",
  "Innovation": "Innovator",
  "Communication": "Communicator",
  "Problem Solving": "Problem-Solver",
  "Mentoring": "Mentor",
  "Vision": "Visionary",
  "Research": "Researcher",
  "Collaboration": "Collaborator",
};

function deriveCharacter(hobbies: string[], strengths: string[]) {
  const adj1 = hobbyAdjectiveMap[hobbies[0]] ?? hobbies[0] ?? "Creative";
  const noun1 = strengthNounMap[strengths[0]] ?? strengths[0] ?? "Thinker";
  const noun2 = strengthNounMap[strengths[1]] ?? strengths[1] ?? noun1;
  return {
    fromHobbies: `${adj1} ${noun2}`,
    fromStrengths: `${adj1} ${noun1}`,
  };
}

function TopPickCard({ candidate }: { candidate: TopPickApplicant }) {
  const [messageSent, setMessageSent] = useState(false);
  const character = deriveCharacter(candidate.hobbies, candidate.strengths);
  const hobbyIcon = hobbyIconMap[candidate.hobbies[0]];

  return (
    <div className="rounded-2xl border border-[#0DC2FF]/35 bg-white overflow-hidden shadow-[0_4px_24px_rgba(13,194,255,0.10)] hover:shadow-[0_8px_32px_rgba(13,194,255,0.16)] transition-all duration-300">
      <div className="h-1.5 bg-gradient-to-r from-[#0DC2FF] via-[#127EE3] to-[#0DC2FF]" />
      <div className="p-6 flex gap-6">

        <div className="w-[290px] flex-shrink-0 border-r border-gray-100 pr-6">
          <div className="flex items-start gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-[#F0F2F5] border border-gray-200 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-gray-300" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[16px] text-[#1A1A2E] font-bold leading-snug">{candidate.currentTitle}</p>
              <div className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-gradient-to-r from-[#0DC2FF] to-[#127EE3] text-white shadow-sm tracking-wide uppercase">
                <Zap className="w-2.5 h-2.5" />
                AI Top Pick
              </div>
            </div>
          </div>

          <div className="space-y-2 text-[15px] border border-gray-100 rounded-xl px-3.5 py-3 bg-gray-50/50">
            <div className="flex items-start gap-2">
              <Briefcase className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
              <span className="font-semibold text-[#1A1A2E] leading-snug">{candidate.currentCompany}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span>{candidate.experience} ประสบการณ์</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span>{candidate.location}</span>
            </div>
            <div className="flex items-start gap-2 text-gray-500">
              <GraduationCap className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
              <span className="leading-snug">{candidate.education}</span>
            </div>
            <div className="flex items-center gap-2 pt-1 border-t border-gray-100 mt-1">
              <Banknote className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="font-bold text-[#1A1A2E]">{candidate.salaryExpect}</span>
            </div>
          </div>


        </div>

        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-400" />
              <span className="text-[13px] font-bold text-gray-400 uppercase tracking-wider">Why This Candidate Stands Out</span>
            </div>
          </div>
          <ul className="space-y-2.5 mb-5">
            {candidate.whyYoullLike.map((item, i) => (
              <li key={i} className="flex gap-2.5 text-[15.5px] text-gray-700 leading-relaxed">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#0DC2FF] mt-[7px]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mb-4 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-[#0DC2FF]" />
              <span className="text-[13px] font-bold text-gray-400 uppercase tracking-wider">ตัวตน (Character)</span>
            </div>
            <div className="grid grid-cols-[1fr_auto_1fr] gap-x-2 items-start">
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-[14px] font-bold px-2.5 py-1 rounded-full bg-[#0DC2FF]/10 text-[#0277a8] border border-[#0DC2FF]/20 whitespace-nowrap">
                    {hobbyIcon && <span>{hobbyIcon}</span>}
                    {character.fromHobbies}
                  </span>
                  <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">Hobbies</span>
                </div>
                {candidate.hobbyDescription && (
                  <p className="text-[13px] text-gray-400 pl-0.5 leading-relaxed">{candidate.hobbyDescription}</p>
                )}
              </div>
              <ChevronRight className="w-3 h-3 text-gray-300 mt-2 flex-shrink-0" />
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-[14px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 whitespace-nowrap">
                    {character.fromStrengths}
                  </span>
                  <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">Strengths</span>
                </div>
                {candidate.strengthDescription && (
                  <p className="text-[13px] text-gray-400 pl-0.5 leading-relaxed">{candidate.strengthDescription}</p>
                )}
              </div>
            </div>
          </div>

          {candidate.deepAnalysis && candidate.deepAnalysis.length > 0 && (
            <div className="mb-4 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-2.5">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#127EE3]/8 border border-[#127EE3]/15">
                  <Brain className="w-3 h-3 text-[#127EE3]" />
                  <span className="text-[11px] font-bold text-[#127EE3] uppercase tracking-wider">Behavioral Signals</span>
                </div>
                <span className="text-[11px] text-gray-300">วิเคราะห์จาก AI</span>
              </div>
              <ul className="space-y-1.5">
                {candidate.deepAnalysis.map((item, i) => (
                  <li key={i} className="flex gap-2.5 text-[14.5px] leading-relaxed text-gray-600">
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#127EE3]/50 mt-[6px]" />
                    <span><span className="font-semibold text-[#1A1A2E]">{item.label}</span> — {item.detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center gap-2 mt-auto pt-2">
            <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[16px] font-bold bg-gradient-to-r from-[#0DC2FF] to-[#127EE3] text-white shadow-md shadow-[#0DC2FF]/25 hover:shadow-[#0DC2FF]/40 transition-all">
              <FileText className="w-4 h-4" />
              ดูเรซูเม่
            </button>
            <button
              onClick={() => setMessageSent(true)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[16px] font-semibold transition-all ${
                messageSent
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                  : "border border-[#127EE3] text-[#127EE3] hover:bg-[#127EE3] hover:text-white"
              }`}
            >
              {messageSent ? <><CheckCircle2 className="w-4 h-4" />ส่งแล้ว</> : <><MessageCircle className="w-4 h-4" />ส่งข้อความสนใจ</>}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Interview grouping helpers ──────────────────────────────────────────────
function getTodayDateStr() {
  return new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
}

function parseInterviewIso(iso: string) {
  return new Date(iso);
}

type InterviewGroup = "today" | "upcoming" | "past";

function getInterviewGroup(applicant: ApplicantRow): InterviewGroup {
  if (!applicant.interviewDateIso) return "past"; // should not reach here after filtering
  const today = getTodayDateStr();
  const dateStr = applicant.interviewDateIso.split("T")[0];
  if (dateStr === today) return "today";
  if (dateStr > today) return "upcoming";
  return "past";
}

function formatInterviewDateTime(iso: string): { day: string; time: string; relative?: string } {
  const d = new Date(iso);
  const today = getTodayDateStr();
  const dateStr = iso.split("T")[0];
  const timeStr = iso.split("T")[1]?.slice(0, 5) ?? "";

  const dayNames = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
  const thaiMonths = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  const dayLabel = `${dayNames[d.getDay()]} ${d.getDate()} ${thaiMonths[d.getMonth()]}`;

  const nowMs = Date.now();
  const diffMs = d.getTime() - nowMs;
  const diffMin = Math.round(diffMs / 60000);

  let relative: string | undefined;
  if (dateStr === today) {
    if (diffMin > 0 && diffMin <= 120) relative = `อีก ${diffMin} นาที`;
    else if (diffMin <= 0 && diffMin >= -60) relative = "กำลังสัมภาษณ์";
    else if (diffMin > 120) {
      const hr = Math.floor(diffMin / 60);
      relative = `อีก ${hr} ชม.`;
    }
  }

  return { day: dayLabel, time: timeStr, relative };
}

// ─── Interview Weekly / Monthly calendar views ───────────────────────────────

function InterviewWeeklyView({
  applicants,
  onSelect,
  weekStart,
}: {
  applicants: ApplicantRow[];
  onSelect: (a: ApplicantRow) => void;
  weekStart: Date;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const thaiDayNames = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
  const thaiMonths = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

  const byDate = new Map<string, ApplicantRow[]>();
  for (const a of applicants) {
    if (!a.interviewDateIso) continue;
    const key = a.interviewDateIso.split("T")[0];
    if (!byDate.has(key)) byDate.set(key, []);
    byDate.get(key)!.push(a);
  }

  const todayStr = today.toISOString().split("T")[0];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="grid grid-cols-7 border-b border-gray-100">
        {days.map((d, i) => {
          const dateStr = d.toISOString().split("T")[0];
          const isToday = dateStr === todayStr;
          return (
            <div key={i} className={`py-2.5 px-2 text-center border-r last:border-r-0 border-gray-100 ${isToday ? "bg-blue-50" : ""}`}>
              <div className={`text-[13px] font-medium uppercase tracking-wide ${isToday ? "text-[#127EE3]" : "text-gray-400"}`}>{thaiDayNames[d.getDay()]}</div>
              <div className={`text-[18px] font-semibold mt-0.5 w-7 h-7 mx-auto flex items-center justify-center rounded-full ${isToday ? "bg-[#127EE3] text-white" : "text-gray-700"}`}>{d.getDate()}</div>
              <div className={`text-[11px] mt-0.5 ${isToday ? "text-[#127EE3]" : "text-gray-300"}`}>{thaiMonths[d.getMonth()]}</div>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-7 divide-x divide-gray-100 min-h-[200px]">
        {days.map((d, i) => {
          const dateStr = d.toISOString().split("T")[0];
          const isToday = dateStr === todayStr;
          const items = byDate.get(dateStr) ?? [];
          return (
            <div key={i} className={`p-1.5 space-y-1 ${isToday ? "bg-blue-50/40" : ""}`}>
              {items.map(a => {
                const time = a.interviewDateIso?.split("T")[1]?.slice(0, 5) ?? "";
                return (
                  <button
                    key={a.id}
                    onClick={() => onSelect(a)}
                    className="w-full text-left rounded-lg px-2 py-1.5 bg-white border border-[#127EE3]/20 hover:border-[#127EE3]/50 hover:shadow-sm transition-all group"
                  >
                    {time && <div className="text-[11px] font-semibold text-[#127EE3]">{time}</div>}
                    <div className="text-[13px] font-medium text-gray-700 leading-tight truncate">{a.name}</div>
                    <div className="text-[11px] text-gray-400 truncate">{a.position}</div>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InterviewMonthlyView({
  applicants,
  onSelect,
  monthDate,
}: {
  applicants: ApplicantRow[];
  onSelect: (a: ApplicantRow) => void;
  monthDate: Date;
}) {
  const now = new Date();
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = firstDay.getDay(); // 0=Sun

  const totalCells = Math.ceil((startOffset + lastDay.getDate()) / 7) * 7;
  const cells = Array.from({ length: totalCells }, (_, i) => {
    const dayNum = i - startOffset + 1;
    if (dayNum < 1 || dayNum > lastDay.getDate()) return null;
    return dayNum;
  });

  const thaiDayNames = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
  const thaiMonths = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

  const byDate = new Map<number, ApplicantRow[]>();
  for (const a of applicants) {
    if (!a.interviewDateIso) continue;
    const d = new Date(a.interviewDateIso);
    if (d.getFullYear() !== year || d.getMonth() !== month) continue;
    const day = d.getDate();
    if (!byDate.has(day)) byDate.set(day, []);
    byDate.get(day)!.push(a);
  }

  const todayDate = now.getDate();
  const isCurrentMonth = now.getMonth() === month && now.getFullYear() === year;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="grid grid-cols-7 border-b border-gray-100">
        {thaiDayNames.map(n => (
          <div key={n} className="py-2 text-center text-[13px] font-medium text-gray-400 uppercase tracking-wide border-r last:border-r-0 border-gray-100">{n}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 divide-x divide-gray-100">
        {cells.map((dayNum, i) => {
          if (dayNum === null) {
            return <div key={i} className="min-h-[80px] bg-gray-50/50 border-b border-gray-100" />;
          }
          const isToday = isCurrentMonth && dayNum === todayDate;
          const items = byDate.get(dayNum) ?? [];
          const visible = items.slice(0, 2);
          const extra = items.length - visible.length;
          return (
            <div key={i} className={`min-h-[80px] p-1.5 border-b border-gray-100 ${isToday ? "bg-blue-50/50" : ""}`}>
              <div className={`text-[14px] font-semibold w-6 h-6 flex items-center justify-center rounded-full mb-1 ${isToday ? "bg-[#127EE3] text-white" : "text-gray-500"}`}>{dayNum}</div>
              <div className="space-y-0.5">
                {visible.map(a => {
                  const time = a.interviewDateIso?.split("T")[1]?.slice(0, 5) ?? "";
                  return (
                    <button
                      key={a.id}
                      onClick={() => onSelect(a)}
                      className="w-full text-left rounded px-1.5 py-0.5 bg-[#127EE3]/8 hover:bg-[#127EE3]/15 transition-colors"
                    >
                      <span className="text-[11px] text-[#127EE3] font-medium truncate block">{time && `${time} `}{a.name}</span>
                    </button>
                  );
                })}
                {extra > 0 && (
                  <div className="text-[11px] text-gray-400 px-1">+{extra} เพิ่มเติม</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InterviewSectionHeader({ group, count }: { group: InterviewGroup; count: number }) {
  const cfg: Record<InterviewGroup, { label: string; dotColor: string }> = {
    today:    { label: "วันนี้",              dotColor: "bg-orange-400" },
    upcoming: { label: "กำลังจะมาถึง",        dotColor: "bg-blue-400"  },
    past:     { label: "ผ่านมาแล้ว / พลาด",   dotColor: "bg-gray-300"  },
  };
  const c = cfg[group];
  return (
    <div className="flex items-center gap-2.5 mb-3">
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${c.dotColor}`} />
      <span className="text-[15px] font-semibold text-gray-700">{c.label}</span>
      <span className="text-[14px] text-gray-400">({count})</span>
      <div className="flex-1 border-t border-gray-100" />
    </div>
  );
}

function InterviewCard({
  applicant,
  onSelect,
  onAction,
  isSelected,
  onToggleSelect,
  checkboxDisabled,
}: {
  applicant: ApplicantRow;
  onSelect: (a: ApplicantRow) => void;
  onAction: (id: string, action: CardAction) => void;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  checkboxDisabled?: boolean;
}) {
  const { day, time, relative } = applicant.interviewDateIso
    ? formatInterviewDateTime(applicant.interviewDateIso)
    : { day: "", time: "", relative: undefined };
  const group = applicant.interviewDateIso ? getInterviewGroup(applicant) : "past";

  const timeColor =
    group === "today"    ? "text-orange-600" :
    group === "upcoming" ? "text-[#127EE3]"  :
                           "text-gray-400";

  const act = (action: CardAction) => () => onAction(applicant.id, action);

  return (
    <div
      onClick={() => onSelect(applicant)}
      className={`bg-white rounded-xl border cursor-pointer transition-all duration-150 group ${
        isSelected
          ? "border-[#127EE3]/40 ring-1 ring-[#127EE3]/15"
          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
      }`}
    >
      <div className="px-4 py-3.5 flex items-start gap-3">

        {/* Checkbox + avatar */}
        <div className="flex items-start gap-2.5 flex-shrink-0 pt-0.5">
          {onToggleSelect && (
            <div
              className={`flex-shrink-0 ${checkboxDisabled ? "opacity-25" : ""}`}
              onClick={(e) => e.stopPropagation()}
              title={checkboxDisabled ? "เลือกได้เฉพาะผู้สมัครที่อยู่สถานะเดียวกัน" : undefined}
            >
              <input
                type="checkbox"
                checked={!!isSelected}
                disabled={checkboxDisabled}
                onChange={() => !checkboxDisabled && onToggleSelect(applicant.id)}
                className={`w-4 h-4 rounded border-gray-300 accent-[#127EE3] ${checkboxDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
              />
            </div>
          )}
          <div className="relative">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-[13.5px] font-bold"
              style={{ backgroundColor: applicant.avatarColor }}
            >
              {applicant.initials}
            </div>
            {!applicant.isRead && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#127EE3] rounded-full border-2 border-white" />
            )}
          </div>
        </div>

        {/* Candidate info + actions */}
        <div className="flex-1 min-w-0">
          <p className="text-[16px] font-semibold text-[#111827] group-hover:text-[#127EE3] transition-colors truncate leading-snug">
            {applicant.name}
          </p>
          <p className="text-[14.5px] text-gray-400 mt-0.5 truncate">
            {applicant.currentTitle} · {applicant.currentCompany}
          </p>
          {applicant.interviewType && (
            <p className="text-[14px] text-gray-500 mt-1.5 flex items-center gap-1.5">
              <Video className="w-3 h-3 text-gray-400 flex-shrink-0" />
              <span>
                {applicant.interviewType === "video" ? "Video Call" : applicant.interviewType === "onsite" ? "Onsite" : applicant.interviewType}
              </span>
              {applicant.interviewers?.[0] && (
                <>
                  <span className="text-gray-300">·</span>
                  <span className="text-gray-400">{applicant.interviewers[0]}</span>
                </>
              )}
            </p>
          )}
          <div className="flex items-center gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
            <CardActionBtn label="บันทึกผลสัมภาษณ์" onClick={act({ type: "interview_result" })} variant="primary" />
            <CardActionBtn label="เปลี่ยนวันนัด"     onClick={act({ type: "reschedule" })}       variant="secondary" />
            <CardActionBtn label="ไม่มาสัมภาษณ์"     onClick={act({ type: "no_show" })}          variant="danger" />
          </div>
        </div>

        {/* Time — top right */}
        {time && (
          <div className="flex-shrink-0 text-right pl-3 pt-0.5 min-w-[64px]">
            <p className={`text-[17px] font-semibold tabular-nums leading-none ${timeColor}`}>{time}</p>
            <p className="text-[13.5px] text-gray-400 mt-0.5 leading-snug">{day}</p>
            {relative && (
              <span className={`inline-flex mt-1.5 px-1.5 py-0.5 rounded-md text-[12px] font-semibold ${
                relative === "กำลังสัมภาษณ์"
                  ? "bg-green-50 text-green-600"
                  : "bg-orange-50 text-orange-600"
              }`}>
                {relative}
              </span>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

// ─── Main stage groupings ────────────────────────────────────────────────────
type MainStage = "all" | "new" | "screen" | "interview" | "offer" | "hired" | "rejected";

const MAIN_STAGE_PIPELINE_MAP: Record<Exclude<MainStage, "all">, PipelineStage[]> = {
  new:       ["new"],
  screen:    ["shortlist", "review"],
  interview: ["to_interview", "interview", "passed"],
  offer:     ["offer"],
  hired:     ["hired"],
  rejected:  ["rejected"],
};


function pipelineStageToMainStage(stage: PipelineStage): Exclude<MainStage, "all"> {
  for (const [main, stages] of Object.entries(MAIN_STAGE_PIPELINE_MAP)) {
    if ((stages as PipelineStage[]).includes(stage)) return main as Exclude<MainStage, "all">;
  }
  return "new";
}

interface ApplicantsPageProps {
  jobTitle?: string;
  onBack: () => void;
  initialTab?: PipelineStage | "all";
}

type ActiveModal =
  | { type: "schedule"; id: string; reschedule?: boolean }
  | { type: "forward_review"; id: string }
  | { type: "reject"; id: string }
  | { type: "interview_result"; id: string }
  | { type: "hired_note"; id: string }
  | { type: "reason"; id: string; title: string; rejectStage: boolean }
  | { type: "edit_reject"; id: string }
  | { type: "bulk_schedule"; ids: string[] }
  | { type: "bulk_forward"; ids: string[] }
  | { type: "bulk_reject"; ids: string[] }
  | { type: "bulk_email"; ids: string[] }
  | { type: "bulk_interview_result"; ids: string[] };

function initMainStage(tab?: PipelineStage | "all"): MainStage {
  if (!tab || tab === "all") return "all";
  return pipelineStageToMainStage(tab);
}

function initSubStatus(tab?: PipelineStage | "all"): PipelineStage | "all_sub" {
  if (!tab || tab === "all") return "all_sub";
  const main = pipelineStageToMainStage(tab);
  if (main === "screen" || main === "interview" || main === "offer") return tab;
  return "all_sub";
}

export default function ApplicantsPage({ jobTitle = "Product Designer (UI/UX)", onBack, initialTab }: ApplicantsPageProps) {
  const [mainStage, setMainStage] = useState<MainStage>(() => initMainStage(initialTab));
  const [subStatus, setSubStatus] = useState<PipelineStage | "all_sub">(() => initSubStatus(initialTab));

  const effectiveStages: PipelineStage[] | null = (() => {
    if (mainStage === "all") return null;
    if (subStatus !== "all_sub") return [subStatus as PipelineStage];
    return MAIN_STAGE_PIPELINE_MAP[mainStage as Exclude<MainStage, "all">];
  })();

  useEffect(() => {
    setMainStage(initMainStage(initialTab));
    setSubStatus(initSubStatus(initialTab));
  }, [initialTab]);
  useEffect(() => { setSelectedIds(new Set()); }, [mainStage, subStatus]);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"appliedAt">("appliedAt");
  const [interviewSort, setInterviewSort] = useState<"asc" | "desc">("asc");
  const [interviewView, setInterviewView] = useState<"day" | "week" | "month">("day");
  const [selectedWeekStart, setSelectedWeekStart] = useState<Date>(() => {
    const d = new Date(); d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - d.getDay());
    return d;
  });
  const [selectedMonth, setSelectedMonth] = useState<Date>(() => {
    const d = new Date(); d.setDate(1); d.setHours(0, 0, 0, 0); return d;
  });
  const [selected, setSelected] = useState<ApplicantRow | null>(null);
  const [applicants, setApplicants] = useState<ApplicantRow[]>(mockApplicants);
  const [activeModal, setActiveModal] = useState<ActiveModal | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const selectedStage: PipelineStage | null = (() => {
    if (selectedIds.size === 0) return null;
    return applicants.find((a) => selectedIds.has(a.id))?.stage ?? null;
  })();

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const closeModal = () => setActiveModal(null);
  const updateApplicant = (id: string, patch: Partial<ApplicantRow>) => {
    setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
    setSelected((prev) => (prev && prev.id === id ? { ...prev, ...patch } : prev));
  };

  const updateManyApplicants = (ids: string[], patch: Partial<ApplicantRow>) => {
    setApplicants((prev) => prev.map((a) => ids.includes(a.id) ? { ...a, ...patch } : a));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const handleBulkAction = (action: BulkAction) => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    switch (action) {
      case "shortlist":
        updateManyApplicants(ids, { stage: "shortlist" });
        showToast(`ย้าย ${ids.length} คนไปชอร์ตลิสต์แล้ว`);
        clearSelection();
        break;
      case "to_interview":
        updateManyApplicants(ids, { stage: "to_interview" });
        showToast(`ย้าย ${ids.length} คนไปลิสต์ต้องนัดสัมภาษณ์แล้ว`);
        clearSelection();
        break;
      case "hire":
        updateManyApplicants(ids, { stage: "hired" });
        showToast(`รับ ${ids.length} คนเข้าทำงานแล้ว`);
        clearSelection();
        break;
      case "offer_reject":
        updateManyApplicants(ids, { stage: "rejected", rejectionReason: "ไม่รับข้อเสนอ" });
        showToast(`บันทึก ${ids.length} คนไม่รับข้อเสนอแล้ว`);
        clearSelection();
        break;
      case "restore_shortlist":
        updateManyApplicants(ids, { stage: "shortlist", rejectionReason: undefined });
        showToast(`ย้าย ${ids.length} คนกลับไปชอร์ตลิสต์แล้ว`);
        clearSelection();
        break;
      case "schedule":
      case "reschedule":
        setActiveModal({ type: "bulk_schedule", ids });
        break;
      case "forward":
        setActiveModal({ type: "bulk_forward", ids });
        break;
      case "reject":
        setActiveModal({ type: "bulk_reject", ids });
        break;
      case "email":
        setActiveModal({ type: "bulk_email", ids });
        break;
      case "interview_result":
        setActiveModal({ type: "bulk_interview_result", ids });
        break;
    }
  };

  const handleAction = (id: string, action: CardAction) => {
    switch (action.type) {
      case "shortlist":
        updateApplicant(id, { stage: "shortlist" });
        showToast("เพิ่มเข้า Shortlist แล้ว");
        break;
      case "to_interview":
        updateApplicant(id, { stage: "to_interview" });
        showToast("ย้ายไปลิสต์ต้องนัดสัมภาษณ์แล้ว");
        break;
      case "hire":
      case "offer_hire":
        updateApplicant(id, { stage: "hired" });
        showToast("รับเข้าทำงานเรียบร้อยแล้ว");
        break;
      case "wait_compare":
        updateApplicant(id, { note: "รอเปรียบเทียบ" });
        showToast("บันทึกสถานะรอเปรียบเทียบแล้ว");
        break;
      case "restore_shortlist":
        updateApplicant(id, { stage: "shortlist", rejectionReason: undefined });
        showToast("ย้ายกลับไป Shortlist แล้ว");
        break;
      case "schedule":
      case "reschedule":
        setActiveModal({ type: "schedule", id, reschedule: action.type === "reschedule" });
        break;
      case "forward_review":
        setActiveModal({ type: "forward_review", id });
        break;
      case "reject":
      case "offer_reject":
        setActiveModal({ type: "reject", id });
        break;
      case "edit_reject":
        setActiveModal({ type: "edit_reject", id });
        break;
      case "interview_result":
        setActiveModal({ type: "interview_result", id });
        break;
      case "hired_note":
        setActiveModal({ type: "hired_note", id });
        break;
      case "no_show":
        setActiveModal({ type: "reason", id, title: "ไม่มาสัมภาษณ์", rejectStage: true });
        break;
      case "cancel_interview":
        setActiveModal({ type: "reason", id, title: "ยกเลิกนัดสัมภาษณ์", rejectStage: true });
        break;
    }
  };

  const handleScheduleConfirm = (id: string, date: string, time: string, interviewer: string, sendEmail: boolean) => {
    const d = new Date(date);
    const thaiDate = d.toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });
    const interviewDate = `${thaiDate} ${time} น.`;
    const isReschedule = activeModal?.type === "schedule" && activeModal.reschedule;
    updateApplicant(id, { stage: "interview", interviewDate });
    if (sendEmail) console.log(`[Email] to: ${applicants.find(a=>a.id===id)?.name} | date: ${interviewDate} | interviewer: ${interviewer}`);
    closeModal();
    showToast(isReschedule ? "เปลี่ยนวันนัดแล้ว" : "นัดสัมภาษณ์เรียบร้อยแล้ว");
  };

  const filtered = applicants.filter((a) => {
    if (effectiveStages && !effectiveStages.includes(a.stage)) return false;
    if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.currentTitle.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort(() => 0);

  const stageStats = PIPELINE_STAGES.reduce((acc, s) => {
    acc[s.key] = applicants.filter((a) => a.stage === s.key).length;
    return acc;
  }, {} as Record<PipelineStage, number>);

  const unreadCount = applicants.filter((a) => !a.isRead).length;

  const buildMixedList = () => {
    const result: (ApplicantRow | TopPickApplicant)[] = [];
    let tpIdx = 0;
    for (let i = 0; i < filtered.length; i++) {
      result.push(filtered[i]);
      if ((i + 1) % 8 === 0 && tpIdx < topPickApplicants.length) result.push(topPickApplicants[tpIdx++]);
    }
    return result;
  };

  const mixedList = buildMixedList();
  const modalTarget = activeModal ? applicants.find((a) => a.id === activeModal.id) ?? null : null;

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      {/* ── Modals ── */}
      {activeModal?.type === "schedule" && modalTarget && (
        <ScheduleModal
          applicantName={modalTarget.name}
          onConfirm={(d, t, i, se) => handleScheduleConfirm(activeModal.id, d, t, i, se)}
          onCancel={closeModal}
        />
      )}
      {activeModal?.type === "forward_review" && modalTarget && (
        <ForwardReviewModal
          applicantName={modalTarget.name}
          onConfirm={(reviewer, note, sendEmail) => {
            updateApplicant(activeModal.id, {
              stage: "review",
              reviewers: [{ name: reviewer, role: "Reviewer", status: "pending" }],
              note,
            });
            if (sendEmail) console.log(`[Email] forward review to ${reviewer}`);
            closeModal(); showToast("ส่งต่อให้พิจารณาแล้ว");
          }}
          onCancel={closeModal}
        />
      )}
      {(activeModal?.type === "reject" || activeModal?.type === "edit_reject") && modalTarget && (
        <RejectReasonModal
          applicantName={modalTarget.name}
          initialReason={modalTarget.rejectionReason}
          initialNote={activeModal.type === "edit_reject" ? modalTarget.note : undefined}
          onConfirm={(reason, note) => {
            updateApplicant(activeModal.id, { stage: "rejected", rejectionReason: reason, note });
            closeModal(); showToast("บันทึกเหตุผลแล้ว");
          }}
          onCancel={closeModal}
        />
      )}
      {activeModal?.type === "interview_result" && modalTarget && (
        <InterviewResultModal
          applicantName={modalTarget.name}
          onConfirm={(outcome, note) => {
            const patch: Partial<ApplicantRow> =
              outcome === "passed"   ? { stage: "passed", note } :
              outcome === "compare"  ? { note: `รอเปรียบเทียบ${note ? ` — ${note}` : ""}` } :
              { stage: "rejected", rejectionReason: "ไม่ผ่านสัมภาษณ์", note };
            updateApplicant(activeModal.id, patch);
            closeModal(); showToast("บันทึกผลสัมภาษณ์แล้ว");
          }}
          onCancel={closeModal}
        />
      )}
      {activeModal?.type === "hired_note" && modalTarget && (
        <HiredNoteModal
          applicantName={modalTarget.name}
          initialNote={modalTarget.note}
          onConfirm={(note) => { updateApplicant(activeModal.id, { note }); closeModal(); showToast("บันทึกแล้ว"); }}
          onCancel={closeModal}
        />
      )}
      {activeModal?.type === "reason" && modalTarget && (
        <ReasonModal
          title={activeModal.title}
          applicantName={modalTarget.name}
          onConfirm={(note) => {
            if (activeModal.rejectStage) updateApplicant(activeModal.id, { stage: "rejected", rejectionReason: activeModal.title, note });
            closeModal(); showToast("บันทึกแล้ว");
          }}
          onCancel={closeModal}
        />
      )}

      {/* Bulk modals */}
      {activeModal?.type === "bulk_schedule" && (
        <BulkScheduleModal
          count={activeModal.ids.length}
          onConfirm={(date, time, interviewer, sendEmail) => {
            const d = new Date(date);
            const thaiDate = d.toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });
            const interviewDate = `${thaiDate} ${time} น.`;
            updateManyApplicants(activeModal.ids, { stage: "interview", interviewDate });
            if (sendEmail) console.log(`[Bulk Email] schedule for ${activeModal.ids.length} applicants at ${interviewDate}`);
            closeModal(); clearSelection();
            showToast(`นัดสัมภาษณ์ ${activeModal.ids.length} คนเรียบร้อยแล้ว`);
          }}
          onCancel={closeModal}
        />
      )}
      {activeModal?.type === "bulk_forward" && (
        <BulkForwardModal
          count={activeModal.ids.length}
          onConfirm={(reviewer, note, sendEmail) => {
            updateManyApplicants(activeModal.ids, {
              stage: "review",
              reviewers: [{ name: reviewer, role: "Reviewer", status: "pending" }],
              note,
            });
            if (sendEmail) console.log(`[Bulk Email] forward to ${reviewer}`);
            closeModal(); clearSelection();
            showToast(`ส่งต่อ ${activeModal.ids.length} คนให้พิจารณาแล้ว`);
          }}
          onCancel={closeModal}
        />
      )}
      {activeModal?.type === "bulk_reject" && (
        <BulkRejectModal
          count={activeModal.ids.length}
          onConfirm={(reason, note) => {
            updateManyApplicants(activeModal.ids, { stage: "rejected", rejectionReason: reason, note });
            closeModal(); clearSelection();
            showToast(`บันทึกไม่ผ่าน ${activeModal.ids.length} คนแล้ว`);
          }}
          onCancel={closeModal}
        />
      )}
      {activeModal?.type === "bulk_email" && (
        <BulkEmailModal
          count={activeModal.ids.length}
          onConfirm={(subject, body) => {
            console.log(`[Bulk Email] subject: ${subject} | to: ${activeModal.ids.length} applicants`);
            closeModal(); clearSelection();
            showToast(`ส่งอีเมลหา ${activeModal.ids.length} คนแล้ว`);
          }}
          onCancel={closeModal}
        />
      )}
      {activeModal?.type === "bulk_interview_result" && (
        <BulkInterviewResultModal
          count={activeModal.ids.length}
          onConfirm={(outcome, note) => {
            const patch: Partial<ApplicantRow> =
              outcome === "passed"   ? { stage: "passed", note } :
              outcome === "compare"  ? { note: `รอเปรียบเทียบ${note ? ` — ${note}` : ""}` } :
              { stage: "rejected", rejectionReason: "ไม่ผ่านสัมภาษณ์", note };
            updateManyApplicants(activeModal.ids, patch);
            closeModal(); clearSelection();
            showToast(`บันทึกผลสัมภาษณ์ ${activeModal.ids.length} คนแล้ว`);
          }}
          onCancel={closeModal}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-2.5 bg-[#1A1A2E] text-white text-[15px] font-medium rounded-2xl shadow-xl flex items-center gap-2.5 border border-white/5">
          <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
          </div>
          {toast}
        </div>
      )}

      <div className="max-w-screen-2xl mx-auto px-6 py-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:border-[#127EE3]/50 hover:text-[#127EE3] transition-all shadow-sm flex-shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-[13.5px] font-semibold text-[#0DC2FF] uppercase tracking-widest">ผู้สมัคร</p>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#127EE3] text-white text-[12px] font-bold">{unreadCount} ใหม่</span>
              )}
            </div>
            <h1 className="text-[24px] font-bold text-[#1A1A2E] leading-snug truncate">{jobTitle}</h1>
            <p className="text-[14.5px] text-gray-400 mt-0.5">
              {mockApplicants.length} คนทั้งหมด · {stageStats.new ?? 0} ใหม่ · {(stageStats.interview ?? 0) + (stageStats.to_interview ?? 0)} สัมภาษณ์
            </p>
          </div>
        </div>

        {/* ── Main stage tab bar ── */}
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
          {([
            {
              key: "new" as MainStage,
              label: "ใหม่",
              icon: <UserPlus className="w-4 h-4" />,
              accent: "#3B82F6",
              iconBg: "bg-blue-50",
              iconColor: "text-blue-500",
              stages: ["new"] as PipelineStage[],
            },
            {
              key: "screen" as MainStage,
              label: "คัดกรอง",
              icon: <Star className="w-4 h-4" />,
              accent: "#0EA5E9",
              iconBg: "bg-sky-50",
              iconColor: "text-sky-500",
              stages: ["shortlist", "review"] as PipelineStage[],
              subLabel: ["ขอร์ตลิสต์", "ส่งต่อให้พิจารณา"],
            },
            {
              key: "interview" as MainStage,
              label: "สัมภาษณ์",
              icon: <CalendarCheck className="w-4 h-4" />,
              accent: "#F97316",
              iconBg: "bg-orange-50",
              iconColor: "text-orange-500",
              stages: ["to_interview", "interview", "passed"] as PipelineStage[],
              subLabel: ["รอนัด", "นัดแล้ว", "ผ่านสัมภาษณ์"],
            },
            {
              key: "offer" as MainStage,
              label: "เสนอ Offer",
              icon: <Wallet className="w-4 h-4" />,
              accent: "#10B981",
              iconBg: "bg-emerald-50",
              iconColor: "text-emerald-600",
              stages: ["offer"] as PipelineStage[],
              subLabel: ["รอตอบรับ", "ตอบรับแล้ว"],
            },
            {
              key: "hired" as MainStage,
              label: "รับเข้าทำงาน",
              icon: <Award className="w-4 h-4" />,
              accent: "#0EA5E9",
              iconBg: "bg-sky-50",
              iconColor: "text-sky-500",
              stages: ["hired"] as PipelineStage[],
            },
            {
              key: "rejected" as MainStage,
              label: "ไม่ผ่าน / ยกเลิก",
              icon: <XCircle className="w-4 h-4" />,
              accent: "#EF4444",
              iconBg: "bg-red-50",
              iconColor: "text-red-500",
              stages: ["rejected"] as PipelineStage[],
            },
          ]).map((s) => {
            const isActive = mainStage === s.key;
            const cnt = s.stages.reduce((sum, ps) => sum + (stageStats[ps] ?? 0), 0);
            return (
              <button
                key={s.key}
                onClick={() => {
                  if (mainStage === s.key) {
                    setMainStage("all");
                    setSubStatus("all_sub");
                  } else {
                    setMainStage(s.key);
                    setSubStatus("all_sub");
                  }
                }}
                style={isActive ? { borderColor: s.accent } : {}}
                className={`flex-shrink-0 flex flex-col gap-2 px-4 py-3.5 rounded-2xl border text-left transition-all min-w-[120px] ${
                  isActive
                    ? "bg-white shadow-sm"
                    : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${s.iconBg} ${s.iconColor}`}>
                    {s.icon}
                  </span>
                  <span className="text-[12px] font-semibold uppercase tracking-wide text-gray-400 leading-tight">
                    {s.label}
                  </span>
                </div>
                <p className="text-[30px] font-black leading-none tracking-tight" style={{ color: isActive ? s.accent : "#1A1A2E" }}>
                  {cnt}
                </p>
                {/* Sub-status breakdown — always visible */}
                {s.subLabel && s.stages.length > 1 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {s.stages.map((ps, i) => {
                      const subCnt = stageStats[ps] ?? 0;
                      const isSubActive = isActive && subStatus === ps;
                      return (
                        <button
                          key={ps}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isActive) {
                              setMainStage(s.key);
                              setSubStatus(ps);
                            } else {
                              setSubStatus(isSubActive ? "all_sub" : ps);
                            }
                          }}
                          className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[11px] font-medium border transition-all ${
                            isSubActive
                              ? "text-white border-transparent"
                              : isActive
                                ? "bg-white/60 text-gray-500 border-gray-200 hover:border-gray-300"
                                : "bg-gray-50 text-gray-400 border-gray-100 hover:border-gray-200 hover:text-gray-600"
                          }`}
                          style={isSubActive ? { backgroundColor: s.accent, borderColor: s.accent } : {}}
                        >
                          <span>{s.subLabel![i]}</span>
                          <span className={`font-bold tabular-nums ${isSubActive ? "text-white/90" : "text-gray-400"}`}>{subCnt}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {selected && (
          <ResumePanel
            onClose={() => setSelected(null)}
            isApplicant={true}
            applicant={selected}
            onApplicantStageChange={(id, stage) => updateApplicant(id, { stage })}
          />
        )}

        <div className="flex gap-5">
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl border border-gray-100 px-4 py-3 mb-4 flex items-center gap-3 flex-wrap shadow-sm">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-350" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="ค้นหาชื่อหรือตำแหน่ง..."
                  className="w-full pl-10 pr-3 py-2 text-[15px] bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-[#127EE3]/40 focus:bg-white focus:ring-2 focus:ring-[#127EE3]/8 transition-all placeholder:text-gray-350"
                />
              </div>
              <div className="relative">
                <select
                  value={subStatus !== "all_sub" ? subStatus : mainStage}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === "all") { setMainStage("all"); setSubStatus("all_sub"); return; }
                    // check if it's a main stage
                    if (["new","screen","interview","offer","hired","rejected"].includes(v)) {
                      setMainStage(v as MainStage); setSubStatus("all_sub");
                    } else {
                      // it's a pipeline stage (sub-status)
                      const ms = pipelineStageToMainStage(v as PipelineStage);
                      setMainStage(ms); setSubStatus(v as PipelineStage);
                    }
                  }}
                  className="appearance-none bg-gray-50 rounded-xl pl-3.5 pr-8 py-2 text-[14.5px] font-medium text-gray-600 focus:outline-none border border-gray-100 focus:border-[#127EE3]/40 focus:ring-2 focus:ring-[#127EE3]/8 transition-all cursor-pointer"
                >
                  <option value="all">สถานะทั้งหมด</option>
                  <option value="new">ใหม่</option>
                  <optgroup label="คัดกรอง">
                    <option value="screen">คัดกรองทั้งหมด</option>
                    <option value="shortlist">· ขอร์ตลิสต์</option>
                    <option value="review">· ส่งต่อให้พิจารณา</option>
                  </optgroup>
                  <optgroup label="สัมภาษณ์">
                    <option value="interview">สัมภาษณ์ทั้งหมด</option>
                    <option value="to_interview">· รอนัด</option>
                    <option value="interview">· นัดแล้ว</option>
                    <option value="passed">· ผ่านสัมภาษณ์</option>
                  </optgroup>
                  <optgroup label="เสนอ Offer">
                    <option value="offer">เสนอ Offer</option>
                  </optgroup>
                  <option value="hired">รับเข้าทำงาน</option>
                  <option value="rejected">ไม่ผ่าน / ยกเลิก</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
              {mainStage === "interview" ? (
                interviewView === "day" ? (
                  <div className="relative">
                    <select value={interviewSort} onChange={(e) => setInterviewSort(e.target.value as "asc" | "desc")}
                      className="appearance-none bg-gray-50 rounded-xl pl-3.5 pr-8 py-2 text-[14.5px] font-medium text-gray-600 focus:outline-none border border-gray-100 focus:border-[#127EE3]/40 focus:ring-2 focus:ring-[#127EE3]/8 transition-all cursor-pointer"
                    >
                      <option value="asc">วันสัมภาษณ์ (ใกล้สุดก่อน)</option>
                      <option value="desc">วันสัมภาษณ์ (ไกลสุดก่อน)</option>
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  </div>
                ) : null
              ) : (
                <div className="relative">
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="appearance-none bg-gray-50 rounded-xl pl-3.5 pr-8 py-2 text-[14.5px] font-medium text-gray-600 focus:outline-none border border-gray-100 focus:border-[#127EE3]/40 focus:ring-2 focus:ring-[#127EE3]/8 transition-all cursor-pointer"
                  >
                    <option value="appliedAt">วันที่สมัคร</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>
              )}
            </div>

            {mainStage === "interview" && (() => {
              const thaiMonthsFull = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
              const thaiMonthsShort = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];

              const weekEnd = new Date(selectedWeekStart);
              weekEnd.setDate(selectedWeekStart.getDate() + 6);
              const sameMonth = selectedWeekStart.getMonth() === weekEnd.getMonth();
              const weekLabel = sameMonth
                ? `${selectedWeekStart.getDate()}–${weekEnd.getDate()} ${thaiMonthsShort[weekEnd.getMonth()]}`
                : `${selectedWeekStart.getDate()} ${thaiMonthsShort[selectedWeekStart.getMonth()]} – ${weekEnd.getDate()} ${thaiMonthsShort[weekEnd.getMonth()]}`;

              const todayMidnight = new Date(); todayMidnight.setHours(0,0,0,0);
              const currentWeekStart = new Date(todayMidnight);
              currentWeekStart.setDate(todayMidnight.getDate() - todayMidnight.getDay());
              const isCurrentWeek = selectedWeekStart.getTime() === currentWeekStart.getTime();

              const monthLabel = `${thaiMonthsFull[selectedMonth.getMonth()]} ${selectedMonth.getFullYear() + 543}`;
              const now = new Date();
              const isCurrentMonth = selectedMonth.getFullYear() === now.getFullYear() && selectedMonth.getMonth() === now.getMonth();

              return (
                <div className="flex items-center justify-between mb-5">
                  <div className="inline-flex items-center bg-white border border-gray-200 rounded-xl shadow-sm p-1 gap-1">
                    {(["day", "week", "month"] as const).map((v) => {
                      const config = {
                        day:   { label: "รายวัน",    icon: <CalendarDays  className="w-3.5 h-3.5 flex-shrink-0" /> },
                        week:  { label: "รายสัปดาห์", icon: <CalendarRange className="w-3.5 h-3.5 flex-shrink-0" /> },
                        month: { label: "รายเดือน",  icon: <Calendar      className="w-3.5 h-3.5 flex-shrink-0" /> },
                      };
                      const active = interviewView === v;
                      return (
                        <button
                          key={v}
                          onClick={() => setInterviewView(v)}
                          className={`h-8 px-3 rounded-lg text-[14.5px] font-medium flex items-center gap-1.5 transition-all duration-150 ${
                            active
                              ? "bg-[#127EE3] text-white shadow-sm"
                              : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                          }`}
                        >
                          {config[v].icon}
                          {config[v].label}
                        </button>
                      );
                    })}
                  </div>

                  {interviewView === "week" && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => { const d = new Date(selectedWeekStart); d.setDate(d.getDate() - 7); setSelectedWeekStart(d); }}
                        className="w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:text-[#127EE3] hover:border-[#127EE3]/40 transition-all"
                      >
                        <ChevronDown className="w-3.5 h-3.5 rotate-90" />
                      </button>
                      <span className={`text-[14.5px] font-medium px-2 ${isCurrentWeek ? "text-[#127EE3]" : "text-gray-600"}`}>{weekLabel}</span>
                      <button
                        onClick={() => { const d = new Date(selectedWeekStart); d.setDate(d.getDate() + 7); setSelectedWeekStart(d); }}
                        className="w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:text-[#127EE3] hover:border-[#127EE3]/40 transition-all"
                      >
                        <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                      </button>
                    </div>
                  )}

                  {interviewView === "month" && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => { const d = new Date(selectedMonth); d.setMonth(d.getMonth() - 1); setSelectedMonth(d); }}
                        className="w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:text-[#127EE3] hover:border-[#127EE3]/40 transition-all"
                      >
                        <ChevronDown className="w-3.5 h-3.5 rotate-90" />
                      </button>
                      <span className={`text-[14.5px] font-medium px-2 min-w-[130px] text-center ${isCurrentMonth ? "text-[#127EE3]" : "text-gray-600"}`}>{monthLabel}</span>
                      <button
                        onClick={() => { const d = new Date(selectedMonth); d.setMonth(d.getMonth() + 1); setSelectedMonth(d); }}
                        className="w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:text-[#127EE3] hover:border-[#127EE3]/40 transition-all"
                      >
                        <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}

            {selectedIds.size > 0 && selectedStage && (
              <BulkActionBar
                count={selectedIds.size}
                stage={selectedStage}
                onAction={handleBulkAction}
                onClear={clearSelection}
              />
            )}

            {mainStage === "interview" ? (() => {
              const interviewApplicants = (filtered as ApplicantRow[]).filter(a => !!a.interviewDateIso);
              const groups: Record<InterviewGroup, ApplicantRow[]> = { today: [], upcoming: [], past: [] };
              for (const a of interviewApplicants) groups[getInterviewGroup(a)].push(a);
              const sortFn = (a: ApplicantRow, b: ApplicantRow) => {
                const ta = parseInterviewIso(a.interviewDateIso!).getTime();
                const tb = parseInterviewIso(b.interviewDateIso!).getTime();
                return interviewSort === "asc" ? ta - tb : tb - ta;
              };
              (["today", "upcoming", "past"] as InterviewGroup[]).forEach(g => groups[g].sort(sortFn));
              const ORDER: InterviewGroup[] = ["today", "upcoming", "past"];
              const hasAny = ORDER.some(g => groups[g].length > 0);
              if (!hasAny) return (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
                    <CalendarClock className="w-7 h-7 text-gray-300" />
                  </div>
                  <p className="text-[16.5px] font-semibold text-gray-500">ยังไม่มีผู้สมัครที่มีนัดสัมภาษณ์</p>
                  <p className="text-[14.5px] text-gray-400 mt-1.5">ผู้สมัครที่ยังไม่ได้นัด จะอยู่ในสถานะ 'รอนัดสัมภาษณ์'</p>
                </div>
              );
              if (interviewView === "week") {
                return <InterviewWeeklyView applicants={interviewApplicants} onSelect={setSelected} weekStart={selectedWeekStart} />;
              }
              if (interviewView === "month") {
                return <InterviewMonthlyView applicants={interviewApplicants} onSelect={setSelected} monthDate={selectedMonth} />;
              }
              return (
                <div className="space-y-6">
                  {ORDER.filter(g => groups[g].length > 0).map(g => (
                    <div key={g}>
                      <InterviewSectionHeader group={g} count={groups[g].length} />
                      <div className="space-y-2.5">
                        {groups[g].map(applicant => (
                          <InterviewCard
                            key={applicant.id}
                            applicant={applicant}
                            onSelect={setSelected}
                            onAction={handleAction}
                            isSelected={selectedIds.has(applicant.id)}
                            onToggleSelect={toggleSelect}
                            checkboxDisabled={selectedStage !== null && applicant.stage !== selectedStage}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })() : (
              <>
                {mixedList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
                      <Search className="w-7 h-7 text-gray-300" />
                    </div>
                    <p className="text-[16.5px] font-semibold text-gray-500">ไม่พบผู้สมัคร</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {mixedList.map((item) =>
                      "isTopPick" in item ? (
                        <TopPickCard key={`tp-${item.id}`} candidate={item as TopPickApplicant} />
                      ) : (
                        <ApplicantCard
                          key={item.id}
                          applicant={item as ApplicantRow}
                          onSelect={setSelected}
                          onAction={handleAction}
                          isSelected={selectedIds.has((item as ApplicantRow).id)}
                          onToggleSelect={toggleSelect}
                          checkboxDisabled={selectedStage !== null && (item as ApplicantRow).stage !== selectedStage}
                        />
                      )
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
