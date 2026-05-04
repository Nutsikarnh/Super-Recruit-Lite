import { useState } from "react";
import {
  ArrowLeft,
  Sparkles,
  BookOpen,
  Heart,
  BookmarkPlus,
  Clock,
  Briefcase,
  GraduationCap,
  MapPin,
  Banknote,
  CheckCircle2,
  Star,
  Zap,
  MessageCircle,
  X,
  Brain,
  Palette,
  Music,
  Camera,
  Gamepad2,
  Globe,
  TrendingUp,
  AlertCircle,
  FileText,
  Award,
  Wrench,
  Send,
  RefreshCw,
  Undo2,
  Calendar,
  Eye,
  ChevronDown,
} from "lucide-react";
import ResumePanel from "./ResumePanel";
import MessageModal from "./MessageModal";
import type { JobRow } from "../data/jobs";

interface Candidate {
  id: number;
  title: string;
  company: string;
  exp: string;
  location: string;
  education: string;
  salary: string;
  matchScore?: number;
  isPerfectFit?: boolean;
  status?: "sent" | "shortlisted" | "snoozed" | null;
  whyYoullLike: string[];
  hardSkills: { name: string; level: number }[];
  softSkills: string[];
  experienceYears: number;
  hobbies: string[];
  strengths: string[];
  runnerTag?: { label: string; color: "teal" | "amber" | "rose" | "sky" | "emerald" | "orange" | "slate" };
  competencies?: string[];
  deepAnalysis?: { label: string; detail: string }[];
  matchedSkills?: string[];
  characterDescription?: string;
  hobbyDescription?: string;
  strengthDescription?: string;
}

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

const hobbyIconMap: Record<string, React.ReactNode> = {
  "Photography": <Camera className="w-3 h-3" />,
  "Music Production": <Music className="w-3 h-3" />,
  "Gaming": <Gamepad2 className="w-3 h-3" />,
  "Travel": <Globe className="w-3 h-3" />,
  "Illustration": <Palette className="w-3 h-3" />,
};

const tagColorMap = {
  teal: "bg-teal-50 text-teal-700 border-teal-200",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  rose: "bg-rose-50 text-rose-700 border-rose-200",
  sky: "bg-sky-50 text-sky-700 border-sky-200",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
  orange: "bg-orange-50 text-orange-700 border-orange-200",
  slate: "bg-slate-50 text-slate-600 border-slate-200",
};

const tagIconMap: Record<string, React.ReactNode> = {
  "Rare Skill Set": <Star className="w-2.5 h-2.5" />,
  "Likely to Move Soon": <TrendingUp className="w-2.5 h-2.5" />,
  "Nice to Try": <Sparkles className="w-2.5 h-2.5" />,
  "High Potential": <Zap className="w-2.5 h-2.5" />,
  "Global Standard": <Globe className="w-2.5 h-2.5" />,
  "Research Depth": <Brain className="w-2.5 h-2.5" />,
};

const perfectFitCandidates: Candidate[] = [
  {
    id: 1,
    title: "Senior Product Designer",
    company: "LINE MAN Wongnai",
    exp: "6 ปี",
    location: "กรุงเทพฯ",
    education: "จุฬาลงกรณ์มหาวิทยาลัย นิเทศศิลป์",
    salary: "75,000 – 95,000 THB",
    isPerfectFit: true,
    status: null,
    whyYoullLike: [
      "ผ่านการทำงานบน product ที่คนใช้จริงหลักล้านคนมา 6 ปี — ประสบการณ์แบบนี้ให้ความเข้าใจ scale และ impact ที่คนในสายอื่นไม่มีทาง calibrate ได้",
      "ทำได้ครบตั้งแต่ออกแบบ component library, สร้าง design system, ไปจนถึงเก็บ user insight ด้วยตัวเอง — หาคนที่ทำได้ทั้งสามในคนเดียวได้ยากมากในตลาดนี้",
      "เชื่อม design decision เข้ากับ business goal ได้ชัดเจน ไม่ใช่แค่ทำหน้าจอสวย — สิ่งนี้เห็นได้จากวิธีที่เขา present งานและเหตุผลที่อยู่เบื้องหลังการออกแบบแต่ละชิ้น",
      "Photography และ Film ใน hobbies บ่งบอกว่ามองโลกผ่าน visual storytelling — คนแบบนี้ออกแบบโดยคิดถึง narrative ของ user ก่อนเสมอ ไม่ใช่แค่ layout",
      "AI หยิบโปรไฟล์นี้มาให้เพราะ pattern ของประสบการณ์และ strengths ตรงกับสิ่งที่ทีมคุณขาดอยู่ — ไม่ใช่คนที่กำลังมองหางาน แต่เป็นคนที่น่าเปิดบทสนทนา",
    ],
    characterDescription: "คิดและสร้างได้เองตั้งแต่ต้น ไม่ต้องรอ brief ซ้ำ",
    hobbyDescription: "สังเกตโลกรอบข้างแล้วแปลงเป็น visual ได้เสมอ",
    strengthDescription: "ออกแบบได้อย่างมีระบบและเข้าใจ user อย่างลึกซึ้ง",
    hardSkills: [{ name: "Figma", level: 98 }, { name: "Design System", level: 95 }, { name: "Prototyping", level: 92 }, { name: "User Research", level: 89 }],
    softSkills: ["Creative Thinking", "Collaboration", "Presentation", "Ownership"],
    experienceYears: 6,
    hobbies: ["Photography", "Film", "Sketching"],
    strengths: ["Storytelling", "Strategic Thinking", "Negotiation"],
    competencies: ["มีความคิดสร้างสรรค์", "มีทักษะเรื่องสี", "กล้าลองผิดลองถูก"],
    deepAnalysis: [
      { label: "การคิดและการสร้าง", detail: "มีแนวโน้มคิดไอเดียใหม่และหาวิธีแก้ปัญหา จาก innovative และกิจกรรมที่ต้องใช้การตัดสินใจ" },
      { label: "การทำผลลัพธ์", detail: "มีแรงขับในการทำงานที่มีเป้าหมายชัด จาก negotiation และ target รายได้" },
      { label: "การทำงานกับคน", detail: "สามารถปรับตัวและทำงานร่วมกับผู้อื่นได้ จาก adaptable และลักษณะ hobbies" },
    ],
    matchedSkills: ["Figma", "Adobe XD", "Design System", "Prototyping", "User Research"],
  },
  {
    id: 2,
    title: "Lead UX Designer",
    company: "Agoda",
    exp: "5 ปี",
    location: "กรุงเทพฯ",
    education: "มหาวิทยาลัยมหิดล วิทยาการและเทคโนโลยีสารสนเทศ",
    salary: "68,000 – 82,000 THB",
    isPerfectFit: true,
    status: "shortlisted",
    whyYoullLike: [
      "5 ปีใน Agoda หมายถึงทำงานกับ multi-market product ที่ user มีพฤติกรรมต่างกันในแต่ละภูมิภาค — ความเข้าใจ complexity แบบนี้ใช้เวลาสะสม ไม่มี shortcut",
      "ทำ research แล้ววัดผลได้ด้วยตัวเองโดยไม่ต้องพึ่ง data team — คนที่ครบ loop แบบนี้ช่วยให้ทีมเดินหน้าได้เร็วขึ้นชัดเจน",
      "Analytical Thinking กับ Empathy อยู่ด้วยกัน ซึ่งโดยปกติสองอย่างนี้มักไปคนละทาง — คนที่ balance ได้มักตัดสินใจได้ดีกว่าในสถานการณ์ที่ data กับ human insight ขัดกัน",
      "ชอบ Travel และ Podcast — pattern ของคนที่ดูดซับ perspective หลายแบบมาตลอด ซึ่งสะท้อนออกมาในงาน research ที่ไม่ติดกรอบมุมมองเดิม",
      "AI เลือกโปรไฟล์นี้เพราะ Facilitation strength ตรงกับสิ่งที่ทีม product ส่วนใหญ่ขาด — คนที่นำ workshop และ align stakeholder ได้ในคนเดียวนั้นมีผลต่อ velocity ของทีมมากกว่าที่คิด",
    ],
    characterDescription: "วิเคราะห์แหลม ฟังคนเป็น ทำงานด้วยข้อมูลไม่ใช่ความเห็น",
    hobbyDescription: "มองโลกกว้าง ชอบเรียนรู้จากประสบการณ์ใหม่ๆ",
    strengthDescription: "สืบค้นจนเข้าใจ และตัดสินใจด้วย data เสมอ",
    hardSkills: [{ name: "User Research", level: 94 }, { name: "Figma", level: 96 }, { name: "A/B Testing", level: 91 }, { name: "Analytics", level: 87 }],
    softSkills: ["Empathy", "Data-Driven", "Facilitation", "Strategic Thinking"],
    experienceYears: 5,
    hobbies: ["Travel", "Podcast", "Reading"],
    strengths: ["Analytical Thinking", "Facilitation", "Empathy"],
    competencies: ["คิดวิเคราะห์เป็นระบบ", "มุ่งมั่นในผลลัพธ์"],
    deepAnalysis: [
      { label: "การคิดวิเคราะห์", detail: "มีความสามารถในการประมวลผลข้อมูลและวิเคราะห์อย่างเป็นระบบ จากความใส่ใจในการทำความเข้าใจอย่างลึกซึ้ง" },
      { label: "การทำผลลัพธ์", detail: "มีแรงขับในการทำงานที่มีเป้าหมายชัด จากประสบการณ์วัดผลด้วย data มาตลอด" },
      { label: "การทำงานกับคน", detail: "ทำงานร่วมกับ cross-functional team ได้ดี จาก Facilitation และ Empathy ที่โดดเด่น" },
    ],
    matchedSkills: ["Figma", "A/B Testing", "Analytics", "Maze", "Hotjar"],
  },
  {
    id: 3,
    title: "Product Designer",
    company: "Bitkub Online",
    exp: "4 ปี",
    location: "กรุงเทพฯ",
    education: "มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี Industrial Design",
    salary: "55,000 – 70,000 THB",
    isPerfectFit: true,
    status: null,
    whyYoullLike: [
      "4 ปีใน Bitkub คือการออกแบบใน environment ที่ user ไม่ยอมรับ confusion — ทุก interaction ต้องสร้าง trust ทันที ซึ่งเป็นมาตรฐานที่สูงกว่า product ทั่วไปมาก",
      "ทำ motion prototype ได้เองโดยไม่ต้องพึ่ง developer — ในทีมที่ iteration เร็ว การลด handoff round ออกไปได้แม้ครั้งเดียวมีผลมาก",
      "Innovation กับ Execution อยู่ใน strengths พร้อมกัน — คนที่คิดใหม่ได้แต่ก็ส่งงานได้จริงนั้นหายากกว่าคนที่ถนัดอย่างใดอย่างหนึ่ง",
      "Music Production และ DIY บ่งบอกถึง maker mindset ที่แท้จริง — คนที่สร้างสิ่งของด้วยมือเองมักออกแบบโดยคำนึงถึง constraint และ feasibility ไว้ก่อนเสมอ",
      "AI หยิบโปรไฟล์นี้มาเพราะ pattern ของงานที่ผ่านมาตรงกับ challenge ที่ทีมคุณกำลังเผชิญอยู่ — น่าเปิดบทสนทนาเพื่อดูว่า fit จริงไหม",
    ],
    characterDescription: "สร้างสรรค์สิ่งใหม่และลงมือทำให้เสร็จได้เองโดยไม่ต้องรอ",
    hobbyDescription: "ชอบทดลองและสร้างสิ่งใหม่ด้วยมือตัวเอง",
    strengthDescription: "คิดนอกกรอบและ deliver ได้จริงทุกครั้ง",
    hardSkills: [{ name: "Figma", level: 93 }, { name: "Responsive Design", level: 92 }, { name: "UI Systems", level: 90 }, { name: "After Effects", level: 88 }],
    softSkills: ["Attention to Detail", "Self-starter", "Curiosity", "Communication"],
    experienceYears: 4,
    hobbies: ["Music Production", "Gaming", "DIY"],
    strengths: ["Innovation", "Problem Solving", "Execution"],
    competencies: ["กล้าลองผิดลองถูก", "ใส่ใจทุกรายละเอียด"],
    deepAnalysis: [
      { label: "การคิดและการสร้าง", detail: "มีแนวโน้มสร้างสรรค์สิ่งใหม่และทดลองแนวทางที่ไม่เคยมีมาก่อน จาก Music Production และ DIY" },
      { label: "การตัดสินใจเชิงรุก", detail: "สามารถตัดสินใจและลงมือทำได้อย่างรวดเร็วในสถานการณ์ที่ท้าทาย จากความกล้าและความมั่นใจในการเผชิญความเสี่ยง" },
      { label: "การทำงานกับคน", detail: "ชอบทำงานเองและมีความรับผิดชอบสูง ทำงานในทีมได้โดยไม่ต้องการการดูแลมาก" },
    ],
    matchedSkills: ["Figma", "After Effects", "Lottie", "Motion Design", "UI Systems"],
  },
  {
    id: 4,
    title: "UX/Product Designer",
    company: "SCB TechX",
    exp: "5 ปี",
    location: "กรุงเทพฯ",
    education: "มหาวิทยาลัยเกษตรศาสตร์ คณะมนุษยศาสตร์ ศิลปกรรม",
    salary: "60,000 – 78,000 THB",
    isPerfectFit: true,
    status: null,
    whyYoullLike: [
      "5 ปีใน SCB TechX คือการออกแบบในระบบที่ mistake ไม่ได้รับอนุญาต — ทุก decision ต้องผ่าน stakeholder หลายระดับ ซึ่งฝึกให้ทำงานได้ในองค์กรที่ซับซ้อนโดยไม่สะดุด",
      "นำ Design Sprint และ workshop ได้จริงจากประสบการณ์ ไม่ใช่แค่อ่านหนังสือมา — skill นี้สร้างจาก repetition ในสนามจริงเท่านั้น",
      "ทำงานได้ตั้งแต่ lead session, เขียน documentation, จนถึง present ต่อผู้บริหาร — breadth แบบนี้หมายความว่าไม่ต้องมี PM คอย translate งานให้ทุกครั้ง",
      "Facilitation อยู่ใน strengths หลัก — designer ที่ขับเคลื่อนทีมได้โดยไม่ต้องการ spotlight มักสร้าง output ที่ consistent กว่าในระยะยาว",
      "AI เลือกโปรไฟล์นี้เพราะ pattern ของงานที่ผ่านมาตรงกับ team structure และ challenge ที่คุณกำลังเผชิญ — น่าคุยเพื่อดูว่า culture fit ด้วยไหม",
    ],
    characterDescription: "สงบ มีสมาธิ และ lead ได้โดยไม่ต้องการ spotlight",
    hobbyDescription: "ใช้ชีวิตอย่างมีสติ และชาร์จพลังจากภายในตัวเอง",
    strengthDescription: "นำทีมโดยไม่ต้องการเครดิต และ facilitate ได้อย่างมืออาชีพ",
    hardSkills: [{ name: "Design Sprint", level: 95 }, { name: "Figma", level: 91 }, { name: "Stakeholder Mgt", level: 88 }, { name: "Prototyping", level: 89 }],
    softSkills: ["Leadership", "Adaptability", "Critical Thinking", "Workshop Facilitation"],
    experienceYears: 5,
    hobbies: ["Yoga", "Writing", "Cooking"],
    strengths: ["Facilitation", "Leadership", "Communication"],
    competencies: ["สื่อสารและถ่ายทอดได้ดี", "ยึดมั่นในมาตรฐาน"],
    deepAnalysis: [
      { label: "การสื่อสารและถ่ายทอด", detail: "สามารถถ่ายทอดความคิดและสร้างอิทธิพลต่อผู้อื่น จากทักษะการสื่อสารและการนำเสนอ" },
      { label: "การยึดมั่นในมาตรฐาน", detail: "มีความรับผิดชอบและทำงานตามกรอบที่ชัดเจน จาก mindset ที่ให้ความสำคัญกับความถูกต้องและความน่าเชื่อถือ" },
      { label: "การทำงานกับคน", detail: "ทำงานร่วมกับ stakeholder หลายระดับได้ดี จาก Leadership และ Facilitation ที่แข็งแกร่ง" },
    ],
    matchedSkills: ["Figma", "Miro", "Design Sprint", "Prototyping", "Stitch"],
  },
  {
    id: 5,
    title: "Senior UI/UX Designer",
    company: "Lazada Thailand",
    exp: "7 ปี",
    location: "กรุงเทพฯ (Remote OK)",
    education: "มหาวิทยาลัยกรุงเทพ Digital Media Design",
    salary: "80,000 – 100,000 THB",
    isPerfectFit: true,
    status: null,
    whyYoullLike: [
      "7 ปีบน platform e-commerce ที่ user นับสิบล้านคน — ประสบการณ์ระดับนี้ให้ความเข้าใจเรื่อง scale, performance และ edge case ที่ designer ส่วนใหญ่ไม่มีโอกาสเจอ",
      "สร้าง design system ที่ทีมทั้งหมดใช้งานได้จริงและ sustain ได้ในระยะยาว — นี่คือสิ่งที่วัดได้จากคนจริงๆ ที่ผ่านการสร้างระบบให้ทีมใหญ่มาแล้ว",
      "เคยเล่นได้ทั้ง individual contributor, design lead, และ mentor — ความยืดหยุ่นของบทบาทนี้หมายความว่าเข้าได้กับทุก team structure โดยไม่ต้อง adjust มาก",
      "Vision และ Mentoring อยู่ใน strengths หลัก — คนที่กำหนด direction ได้และพัฒนาคนรอบข้างไปพร้อมกัน มีผลต่อ output ของทีมมากกว่าการเพิ่ม headcount อย่างเดียว",
      "AI หยิบโปรไฟล์นี้มาให้เพราะเห็น gap ระหว่างสิ่งที่ทีมคุณต้องการกับสิ่งที่คนนี้สะสมมา — น่าเป็นคนที่คุณพูดคุยก่อนเลยในกลุ่มนี้",
    ],
    characterDescription: "มองภาพระยะยาวได้ชัด และยกคนรอบข้างขึ้นไปด้วยเสมอ",
    hobbyDescription: "คิดเชิงกลยุทธ์แม้แต่ในชีวิตประจำวัน",
    strengthDescription: "วางระบบที่ทีมอื่นพึ่งพาได้ และพัฒนาคนรอบข้างไปพร้อมกัน",
    hardSkills: [{ name: "Design System", level: 97 }, { name: "Figma", level: 95 }, { name: "Leadership", level: 90 }, { name: "Mentoring", level: 88 }],
    softSkills: ["Mentorship", "Cross-functional", "Vision", "Execution"],
    experienceYears: 7,
    hobbies: ["Board Games", "Cycling", "Reading"],
    strengths: ["Mentoring", "Vision", "Strategic Thinking"],
    competencies: ["คิดเชิงลึก", "มีวิสัยทัศน์", "กล้าตัดสินใจ"],
    deepAnalysis: [
      { label: "การคิดเชิงลึก", detail: "มีแนวโน้มในการเชื่อมโยงแนวคิดและมองภาพเชิงนามธรรม จากความสามารถในการตีความและเข้าใจบริบทที่ซับซ้อน" },
      { label: "การตัดสินใจเชิงรุก", detail: "สามารถตัดสินใจและลงมือทำได้อย่างรวดเร็วในสถานการณ์ที่ท้าทาย จากความกล้าและความมั่นใจในการเผชิญความเสี่ยง" },
      { label: "การสื่อสารและถ่ายทอด", detail: "สามารถถ่ายทอดความคิดและสร้างอิทธิพลต่อผู้อื่น จากประสบการณ์ Speaker และ Mentoring" },
    ],
    matchedSkills: ["Figma", "Design System", "Adobe CC", "Sketch", "Zeplin"],
  },
];

interface RunnerCandidate extends Candidate {
  runnerTag?: { label: string; color: "teal" | "amber" | "rose" | "sky" | "emerald" | "orange" | "slate" };
}

const runnerUpCandidates: RunnerCandidate[] = [
  {
    id: 6,
    title: "Product Designer",
    company: "Grab Thailand",
    exp: "3 ปี",
    location: "กรุงเทพฯ",
    education: "มหาวิทยาลัยอัสสัมชัญ คณะออกแบบนิเทศศิลป์",
    salary: "45,000 – 58,000 THB",
    matchScore: 82,
    whyYoullLike: [
      "3 ปีใน Grab regional team มีความหนาแน่นของ experience ที่หลายที่ทำได้ไม่ถึงใน 5 ปี — ผ่าน product ระดับ regional มาแล้ว",
      "ถ้ากรองแค่จำนวนปี จะพลาด specialist ที่เก่งและยังมี headroom เติบโตต่อได้อีกมาก",
      "ทำงาน cross-culture ในทีม regional ได้ทันที ซึ่งหาได้ยากในผู้สมัครระดับนี้",
    ],
    characterDescription: "ปรับตัวเร็ว มองโลกกว้าง และทำงานในทีม cross-culture ได้ทันที",
    hobbyDescription: "เปิดรับประสบการณ์ใหม่และปรับตัวได้เสมอ",
    strengthDescription: "เรียนรู้เร็วและทำงานร่วมกับคนหลายแบบได้ดี",
    hardSkills: [{ name: "Mobile UI", level: 88 }, { name: "Figma", level: 85 }, { name: "Prototyping", level: 80 }, { name: "User Research", level: 75 }],
    softSkills: ["Adaptability", "Fast Learner", "Teamwork"],
    experienceYears: 3,
    hobbies: ["Travel", "Photography", "Cycling"],
    strengths: ["Collaboration", "Analytical Thinking", "Communication"],
    runnerTag: { label: "Nice to Try", color: "teal" },
    competencies: ["ปรับตัวเร็ว", "มีความคิดสร้างสรรค์"],
    deepAnalysis: [
      { label: "การคิดและการสร้าง", detail: "มีความสนใจในการถ่ายภาพและการเดินทาง ซึ่งสะท้อนถึงการมองโลกในแง่มุมใหม่ๆ" },
      { label: "การตัดสินใจเชิงรุก", detail: "สามารถปรับตัวและลงมือทำได้รวดเร็วในสภาพแวดล้อม Agile ระดับ regional" },
      { label: "การทำงานกับคน", detail: "ทำงานเป็นทีมในองค์กรขนาดใหญ่ได้ดี มีทักษะ Collaboration โดดเด่น" },
    ],
    matchedSkills: ["Figma", "Mobile UI", "Prototyping", "User Research"],
  },
  {
    id: 7,
    title: "UI Designer",
    company: "KBTG (Kasikorn Business Technology Group)",
    exp: "4 ปี",
    location: "กรุงเทพฯ",
    education: "จุฬาลงกรณ์มหาวิทยาลัย นิเทศศาสตร์",
    salary: "50,000 – 65,000 THB",
    matchScore: 79,
    whyYoullLike: [
      "portfolio ครอบคลุมตั้งแต่ component-level ถึง brand identity ทำงานใน design system ได้ทันทีโดยไม่ต้องเทรนเพิ่ม",
      "degree ด้านนิเทศศาสตร์อาจดูไม่ตรงกับ design role ในสายตา HR — แต่คนที่เข้าใจ communication theory มักอธิบาย design rationale ได้ดีกว่าคนที่จบตรงมา",
      "Visual Designer ที่มี Storytelling ใน strengths เป็นสิ่งที่ JD ไม่เคยระบุ แต่ทีมที่มีคนแบบนี้จะ pitch งานกับ stakeholder ได้ง่ายกว่ามาก",
    ],
    characterDescription: "มีรสนิยมทางสายตาสูง และถ่ายทอดงานออกมาได้อย่างมีชีวิต",
    hobbyDescription: "แสดงออกผ่านงาน visual และมี aesthetic ที่ชัดเจน",
    strengthDescription: "สื่อสารได้อย่างตรงใจและมีสไตล์เป็นของตัวเอง",
    hardSkills: [{ name: "Visual Design", level: 93 }, { name: "Figma", level: 90 }, { name: "Brand Design", level: 85 }, { name: "Illustration", level: 78 }],
    softSkills: ["Creativity", "Detail-oriented", "Communication"],
    experienceYears: 4,
    hobbies: ["Illustration", "Dance", "Podcast"],
    strengths: ["Storytelling", "Communication", "Empathy"],
    runnerTag: undefined,
    competencies: ["มีทักษะเรื่องสี", "ใส่ใจทุกรายละเอียด", "กล้าแสดงออก"],
    deepAnalysis: [
      { label: "การคิดและการสร้าง", detail: "มี Illustration และ Storytelling ที่โดดเด่น ช่วยเพิ่มมิติ visual ให้ product" },
      { label: "การสื่อสารและถ่ายทอด", detail: "สามารถถ่ายทอดความคิดสร้างสรรค์ผ่าน visual ได้ดีมาก จาก Dance และ Podcast" },
      { label: "การทำงานกับคน", detail: "มี Empathy สูง ทำให้เข้าใจความต้องการของ user และ stakeholder ได้ดี" },
    ],
    matchedSkills: ["Figma", "Adobe Illustrator", "Visual Design", "Brand Design"],
  },
  {
    id: 8,
    title: "UX Researcher",
    company: "AIS (Advanced Info Service)",
    exp: "3 ปี",
    location: "กรุงเทพฯ",
    education: "มหาวิทยาลัยธรรมศาสตร์ สังคมวิทยาและมานุษยวิทยา",
    salary: "42,000 – 55,000 THB",
    matchScore: 76,
    whyYoullLike: [
      "ทำ research ได้ทั้ง qual และ quant ในคนเดียว ไม่ต้องแบ่งงานหรือจ้างเพิ่ม ครบ feedback loop ด้วยตัวเอง",
      "จบ Sociology ไม่ใช่ Design — HR ส่วนใหญ่จะกรองออกทันที แต่นั่นคือสิ่งที่ทำให้ UX Research ของคนนี้เข้าใจ human behavior เชิงระบบในแบบที่คนจบตรงทำไม่ได้",
      "ถ้าต้องการคนที่ทำ research แล้ว translate เป็น action ได้เลยโดยไม่ต้องรอ designer อีกคน — คนที่มี background นอกสายตรงมักทำสิ่งนี้ได้ดีกว่า",
    ],
    characterDescription: "ชอบถามลึก สังเกตเยอะ และเปลี่ยน insight ให้เป็น action ได้",
    hobbyDescription: "อ่านเยอะ คิดเยอะ และมองเห็น pattern ที่คนอื่นมองข้าม",
    strengthDescription: "ค้นหาความจริงและเปลี่ยน insight ให้เป็นการกระทำได้",
    hardSkills: [{ name: "User Research", level: 92 }, { name: "Usability Testing", level: 90 }, { name: "Analytics", level: 85 }, { name: "Figma", level: 72 }],
    softSkills: ["Analytical", "Curiosity", "Empathy"],
    experienceYears: 3,
    hobbies: ["Reading", "Writing", "Board Games"],
    strengths: ["Analytical Thinking", "Research", "Empathy"],
    runnerTag: { label: "Rare Skill Set", color: "rose" },
    competencies: ["คิดวิเคราะห์เป็นระบบ", "ใส่ใจทุกรายละเอียด"],
    deepAnalysis: [
      { label: "การคิดวิเคราะห์", detail: "มีทักษะวิเคราะห์ข้อมูลเชิงลึก ทั้ง Quant และ Qual ในคนเดียว" },
      { label: "การคิดเชิงลึก", detail: "มีแนวโน้มในการเชื่อมโยงแนวคิดและมองภาพเชิงนามธรรม จากการอ่านและ Board Games" },
      { label: "การทำงานกับคน", detail: "Empathy สูงทำให้ทำ user research ได้ลึกและได้ insight ที่มีคุณค่า" },
    ],
    matchedSkills: ["User Research", "Usability Testing", "Analytics", "Maze"],
  },
  {
    id: 9,
    title: "Product Designer",
    company: "DTAC (Total Access Communication)",
    exp: "2 ปี",
    location: "กรุงเทพฯ",
    education: "มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี Digital Media",
    salary: "38,000 – 48,000 THB",
    matchScore: 74,
    whyYoullLike: [
      "ด้วยประสบการณ์เพียง 2 ปี growth curve ชันผิดปกติ — ทักษะอยู่ในระดับที่คนส่วนใหญ่ต้องใช้เวลานานกว่าสองเท่าถึงจะถึง",
      "Innovation + Execution ที่อยู่คู่กันตั้งแต่ต้นบ่งชี้ว่าคนนี้จะโตเร็วกว่า timeline บอก — อย่าตัดสินจาก title ในปัจจุบัน",
      "เงินเดือนที่ขอต่ำกว่า market rate — ไม่ใช่เพราะไม่รู้มูลค่าตัวเอง แต่เพราะสนใจงานที่ได้โต ซึ่งเป็นสัญญาณ retention ที่ดีกว่าการจ่ายแพง",
    ],
    characterDescription: "กล้าคิด กล้าทำ และไม่กลัวที่จะเผชิญกับความท้าทายใหม่",
    hobbyDescription: "ค้นหาความสมดุลในชีวิต และเรียนรู้ผ่านการลงมือทำ",
    strengthDescription: "ลงมือทำก่อน เรียนรู้ระหว่างทาง ไม่รอความสมบูรณ์แบบ",
    hardSkills: [{ name: "UI Design", level: 85 }, { name: "Figma", level: 82 }, { name: "Prototyping", level: 78 }, { name: "Design System", level: 72 }],
    softSkills: ["Growth Mindset", "Resourceful", "Positive Energy"],
    experienceYears: 2,
    hobbies: ["Yoga", "Photography", "Cooking"],
    strengths: ["Innovation", "Execution", "Collaboration"],
    runnerTag: { label: "High Potential", color: "amber" },
    competencies: ["กล้าลองผิดลองถูก", "มีความคิดสร้างสรรค์"],
    deepAnalysis: [
      { label: "การคิดและการสร้าง", detail: "มีแนวโน้มนำ innovation มาใช้ในงาน และเรียนรู้ได้เร็วจากการทดลอง" },
      { label: "การทำงานกับคน", detail: "ทำงานร่วมกับทีมได้ดีและมี Positive Energy ที่ช่วยสร้างบรรยากาศในทีม" },
      { label: "การตัดสินใจเชิงรุก", detail: "ลงมือ execute ได้รวดเร็วและรับ feedback เพื่อปรับปรุงงานได้ไว" },
    ],
    matchedSkills: ["Figma", "UI Design", "Prototyping", "Design System"],
  },
  {
    id: 10,
    title: "Senior UX Designer",
    company: "True Digital Group",
    exp: "5 ปี",
    location: "Remote",
    education: "สถาบันบัณฑิตพัฒนบริหารศาสตร์ บริหารธุรกิจ",
    salary: "58,000 – 72,000 THB",
    matchScore: 73,
    whyYoullLike: [
      "คิดได้ทั้ง strategic layer และ execution layer ในคนเดียว ไม่ต้องการ PM มา bridge ระหว่าง vision กับ delivery",
      "จบบริหารธุรกิจ ไม่ใช่ design — ฟังดูผิดสาย แต่นั่นคือเหตุผลที่คนนี้พูดภาษา business กับ stakeholder ได้โดยไม่ต้องแปล design เป็น ROI ทุกครั้ง",
      "ถ้าต้องการคนที่คิดได้ทั้ง journey ไม่ใช่แค่ screen — อย่าปล่อยคนนี้ไปเพราะ title ไม่ตรงเป๊ะ",
    ],
    characterDescription: "คิดเชิงกลยุทธ์ ทำงานอิสระได้ และเห็น big picture เสมอ",
    hobbyDescription: "ชอบสำรวจโลกคนเดียวและค้นหา insight จากทุกที่",
    strengthDescription: "วางกลยุทธ์ได้ชัดและทำงานได้โดยไม่ต้องรอ direction",
    hardSkills: [{ name: "User Journey", level: 90 }, { name: "UX Strategy", level: 88 }, { name: "Figma", level: 85 }, { name: "Service Design", level: 82 }],
    softSkills: ["Strategic", "Independent", "Proactive"],
    experienceYears: 5,
    hobbies: ["Travel", "Cycling", "Gaming"],
    strengths: ["Strategic Thinking", "Vision", "Problem Solving"],
    runnerTag: { label: "Rare Skill Set", color: "rose" },
  },
  {
    id: 11,
    title: "UI/UX Designer",
    company: "Flash Express",
    exp: "3 ปี",
    location: "กรุงเทพฯ",
    education: "มหาวิทยาลัยเทคโนโลยีราชมงคลกรุงเทพ Graphic Design",
    salary: "40,000 – 52,000 THB",
    matchScore: 71,
    whyYoullLike: [
      "ทำ product ได้ครบตั้งแต่ component เล็กสุดถึง full page layout ในคนเดียว ไม่ต้องแบ่งงานระหว่าง UI กับ graphic designer",
      "Graphic Design background อาจดูไม่ตรงกับ Product Designer ใน JD — แต่คนที่มี visual foundation แน่นมักทำ design ที่ user ไว้วางใจได้เร็วกว่าคนที่เรียน UX process มาโดยตรง",
      "คนที่ทำ micro-detail ได้ดีมักทำ interaction quality ได้ดีกว่า — เป็น signal ที่ portfolio ไม่ค่อยแสดงออกมาตรงๆ",
    ],
    characterDescription: "ไม่ยอมแพ้กับโจทย์ยาก และลงมือทำจนเสร็จด้วยตัวเอง",
    hobbyDescription: "ชอบสร้างสิ่งของจับต้องได้และแก้ปัญหาด้วยมือ",
    strengthDescription: "ไม่หยุดจนกว่างานจะเสร็จ และหาทางออกได้เสมอ",
    hardSkills: [{ name: "Icon Design", level: 85 }, { name: "Mobile UI", level: 82 }, { name: "Figma", level: 80 }, { name: "Responsive", level: 78 }],
    softSkills: ["Hustle", "Adaptable", "Problem-solver"],
    experienceYears: 3,
    hobbies: ["DIY", "Music Production", "Rock Climbing"],
    strengths: ["Execution", "Innovation", "Problem Solving"],
    runnerTag: undefined,
  },
  {
    id: 12,
    title: "Product Designer",
    company: "Pomelo Fashion",
    exp: "4 ปี",
    location: "กรุงเทพฯ",
    education: "มหาวิทยาลัยกรุงเทพ Fashion & Media",
    salary: "48,000 – 62,000 THB",
    matchScore: 70,
    whyYoullLike: [
      "ทำ premium brand และ product design ได้ในคนเดียว ไม่ต้องจ้างทีม brand แยก ครอบคลุมตั้งแต่ identity ถึง UI",
      "จบ Fashion & Media — ไม่ใช่ UX ตรงสาย แต่คนที่เข้าใจ aesthetic ระดับ fashion มักทำ premium product ได้โดยไม่ต้อง brief ซ้ำซากในสิ่งที่ดู 'แพง'",
      "Storytelling + Vision ใน strengths แต่ไม่เคยถือ lead role — อย่ารอให้เขา prove ตัวเองด้วย title ก่อน เพราะ impact แบบนี้เห็นได้จาก output ไม่ใช่ org chart",
    ],
    characterDescription: "มีสายตา premium โดยธรรมชาติ และเล่าเรื่องผ่าน visual ได้อย่างชัดเจน",
    hobbyDescription: "แสดงออกตัวเองผ่านงานสร้างสรรค์และ visual storytelling",
    strengthDescription: "เล่าเรื่องด้วยภาพและสร้าง feeling ของ premium ได้โดยธรรมชาติ",
    hardSkills: [{ name: "Visual Design", level: 92 }, { name: "Brand Identity", level: 88 }, { name: "Figma", level: 84 }, { name: "Motion", level: 76 }],
    softSkills: ["Aesthetic Sensibility", "Storytelling", "Collaboration"],
    experienceYears: 4,
    hobbies: ["Dance", "Illustration", "Photography"],
    strengths: ["Storytelling", "Communication", "Vision"],
    runnerTag: { label: "Likely to Move Soon", color: "orange" },
  },
  {
    id: 13,
    title: "UX Designer",
    company: "Central Technology (CPN Group)",
    exp: "3 ปี",
    location: "กรุงเทพฯ",
    education: "มหาวิทยาลัยธรรมศาสตร์ วิทยาการคอมพิวเตอร์",
    salary: "44,000 – 56,000 THB",
    matchScore: 68,
    whyYoullLike: [
      "ครบทั้ง discovery และ delivery ในคนเดียว — CS background ช่วยลด handoff friction ระหว่าง design กับ dev ได้จริง",
      "วิทยาการคอมพิวเตอร์ไม่ใช่ design — แต่ HR ที่กรองแค่ degree จะพลาดคนที่เข้าใจ technical constraint จริงและออกแบบ state ที่ implement ได้จริงทุกครั้ง",
      "Analytical Thinking แต่ไม่ได้เย็นชา — Collaboration อยู่ใน top strengths ซึ่งพบยากมากในคนที่มี CS background และมักเป็นสิ่งที่ทีม miss มากที่สุด",
    ],
    characterDescription: "คิดเป็นระบบ ทำงานกับทีมได้ดี และเข้าใจทั้งสองฝั่งของ design กับ tech",
    hobbyDescription: "หาความสนุกในระบบและกฎกติกาที่ซ่อนอยู่",
    strengthDescription: "คิดเป็นระบบและทำงานร่วมกับ dev ได้โดยไม่ต้องแปลทุกอย่าง",
    hardSkills: [{ name: "Wireframing", level: 85 }, { name: "UX Research", level: 80 }, { name: "Figma", level: 78 }, { name: "Prototyping", level: 76 }],
    softSkills: ["Analytical", "Curious", "Reliable"],
    experienceYears: 3,
    hobbies: ["Gaming", "Board Games", "Reading"],
    strengths: ["Analytical Thinking", "Problem Solving", "Collaboration"],
    runnerTag: undefined,
  },
  {
    id: 14,
    title: "Junior Product Designer",
    company: "Wongnai Media",
    exp: "2 ปี",
    location: "กรุงเทพฯ",
    education: "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง เทคโนโลยีสารสนเทศ",
    salary: "35,000 – 45,000 THB",
    matchScore: 66,
    whyYoullLike: [
      "ครบ feedback loop ตั้งแต่ออกแบบจนถึงทดสอบในคนเดียว ทำ iteration ได้เองโดยไม่ต้องรอทีม — ด้วยประสบการณ์เพียง 2 ปี",
      "IT background อาจทำให้ HR มองว่าไม่ใช่ designer ตัวจริง — แต่คนที่พูดได้ทั้งภาษา dev และภาษา user ในคนเดียวลด misalignment ได้มากกว่าการจ้าง PM มาเชื่อมกลาง",
      "เงินเดือนต่ำกว่า market อย่าด่วนสรุปว่า skill ยังไม่ถึง — สัญญาณนี้มักบอกว่ากำลังหางานที่ได้เรียนรู้ ไม่ใช่แค่งานที่จ่ายดี",
    ],
    characterDescription: "ใส่ใจทุกรายละเอียด ทำงานเป็นขั้นตอน และเชื่อมคนสองฝั่งได้",
    hobbyDescription: "ชอบทำงานอย่างพิถีพิถันและหาความหมายในชีวิตประจำวัน",
    strengthDescription: "ทีมงานและผู้ร่วมงานพึ่งพาได้เสมอ ไม่มีงานตก",
    hardSkills: [{ name: "UI Design", level: 80 }, { name: "Figma", level: 78 }, { name: "User Testing", level: 74 }, { name: "Prototyping", level: 72 }],
    softSkills: ["Eagerness", "Team Player", "Detail-oriented"],
    experienceYears: 2,
    hobbies: ["Cooking", "Yoga", "Writing"],
    strengths: ["Collaboration", "Empathy", "Communication"],
    runnerTag: { label: "Nice to Try", color: "teal" },
  },
  {
    id: 15,
    title: "Interaction Designer",
    company: "Microsoft Thailand",
    exp: "4 ปี",
    location: "Remote",
    education: "Mahidol University International College Communication Design",
    salary: "62,000 – 78,000 THB",
    matchScore: 65,
    whyYoullLike: [
      "มี skillset ที่หาได้ยากมาก ครอบคลุม quality ทั้ง interaction design, accessibility และ design ops ในคนเดียว",
      "International education อาจดูเหมือน over-qualified สำหรับบาง JD — แต่ Global mindset ที่ได้มานั้นทำให้คิด accessibility และ inclusive design ได้โดย default",
      "4 ปีและ Microsoft background อาจดูเหมือน overqualified หรือ culture-fit ยาก — แต่คนที่ผ่าน enterprise design process มาแล้วมักทำให้ทีมมี discipline ที่ scale ได้",
    ],
    characterDescription: "ละเอียด มีมาตรฐานสูง และออกแบบโดยคิดถึงทุกคนเสมอ",
    hobbyDescription: "ชอบ challenge ตัวเองและมีมาตรฐานสูงในทุกสิ่งที่ทำ",
    strengthDescription: "ออกแบบโดยคิดถึง edge case และ user ทุกกลุ่มเสมอ",
    hardSkills: [{ name: "Interaction Design", level: 90 }, { name: "Accessibility", level: 88 }, { name: "Figma", level: 86 }, { name: "Design Ops", level: 82 }],
    softSkills: ["Global Mindset", "Precision", "Systems Thinking"],
    experienceYears: 4,
    hobbies: ["Rock Climbing", "Board Games", "Podcast"],
    strengths: ["Strategic Thinking", "Mentoring", "Vision"],
    runnerTag: { label: "Global Standard", color: "sky" },
  },
  {
    id: 16,
    title: "Product Designer",
    company: "Sea (Shopee Thailand)",
    exp: "4 ปี",
    location: "กรุงเทพฯ",
    education: "มหาวิทยาลัยกรุงเทพ Digital Arts",
    salary: "52,000 – 66,000 THB",
    matchScore: 64,
    whyYoullLike: [
      "ผ่านสภาพแวดล้อม high-stakes ของ e-commerce มาแล้ว ทำงานได้ครบทั้ง strategy และ execution โดยไม่ต้องปรับตัวใหม่",
      "Digital Arts degree อาจดูเหมือนไม่ตรงกับ product role — แต่ fine arts training ให้ aesthetic judgment ที่ทำให้ product ดูน่าเชื่อถือแม้แต่กับ user ที่ไม่รู้จัก brand",
      "ถ้า JD ต้องการ 5+ ปี คนนี้อาจไม่ผ่าน filter — แต่ A/B Testing ที่แข็งแกร่งคู่กับ Analytical Thinking คือ combination ที่ designer 5 ปีจำนวนมากยังไม่มี",
    ],
    characterDescription: "ทนแรงกดดันได้ เรียนรู้เร็ว และตัดสินใจด้วย data เสมอ",
    hobbyDescription: "ชอบเคลื่อนไหวและหาแรงบันดาลใจจากโลกรอบข้าง",
    strengthDescription: "ทดสอบ วัดผล และปรับ solution ได้อย่างต่อเนื่อง",
    hardSkills: [{ name: "E-commerce UX", level: 88 }, { name: "Figma", level: 86 }, { name: "A/B Testing", level: 83 }, { name: "Mobile UI", level: 80 }],
    softSkills: ["Data-driven", "Resilient", "Fast Learner"],
    experienceYears: 4,
    hobbies: ["Photography", "Travel", "Cycling"],
    strengths: ["Analytical Thinking", "Execution", "Collaboration"],
    runnerTag: { label: "Likely to Move Soon", color: "orange" },
  },
  {
    id: 17,
    title: "UX/UI Designer",
    company: "Foodpanda Thailand",
    exp: "3 ปี",
    location: "กรุงเทพฯ",
    education: "มหาวิทยาลัยศิลปากร ออกแบบนิเทศศิลป์",
    salary: "44,000 – 57,000 THB",
    matchScore: 63,
    whyYoullLike: [
      "ทำได้ครบทั้ง 4 ด้านหลัก — mobile UX, visual design, prototyping และ Figma ในคนเดียว ทำงานได้ตั้งแต่ concept จนถึง prototype พร้อม handoff",
      "จบออกแบบนิเทศศิลป์จากศิลปากรซึ่งหลาย HR มองว่า 'graphic-only' — แต่คนที่มี fine arts foundation มักทำ visual storytelling ได้ในระดับที่ UX bootcamp ไม่สอน",
      "Title ยังไม่ใช่ senior แต่ output ที่วัดได้สูงกว่า title บอก — อย่าให้ job level เป็นตัวกรองที่ทำให้พลาดคนนี้",
    ],
    characterDescription: "ทำงานเร็ว ทำงานได้ภายใต้แรงกดดัน และ output ออกมาสวยเสมอ",
    hobbyDescription: "แสดงออกตัวเองผ่านงาน visual และชอบบอกเล่าเรื่องราว",
    strengthDescription: "ทำงานเร็วและ deliver คุณภาพสูงได้แม้ใน deadline แน่น",
    hardSkills: [{ name: "Mobile UX", level: 86 }, { name: "Figma", level: 84 }, { name: "Prototyping", level: 80 }, { name: "Visual Design", level: 79 }],
    softSkills: ["Speed", "Adaptable", "Visual Sense"],
    experienceYears: 3,
    hobbies: ["Illustration", "Travel", "Dance"],
    strengths: ["Execution", "Storytelling", "Collaboration"],
    runnerTag: undefined,
  },
  {
    id: 18,
    title: "Product Designer",
    company: "Sertis (AI & Data)",
    exp: "3 ปี",
    location: "กรุงเทพฯ",
    education: "จุฬาลงกรณ์มหาวิทยาลัย วิศวกรรมคอมพิวเตอร์",
    salary: "50,000 – 64,000 THB",
    matchScore: 62,
    whyYoullLike: [
      "rare skill set ที่ทำ data product ได้ครบตั้งแต่ concept ออกแบบ dashboard จนถึง dev handoff ในคนเดียว",
      "วิศวกรรมคอมพิวเตอร์จาก Chula อาจดูเหมือน 'ไม่ใช่ designer จริงๆ' — แต่ CS foundation ทำให้ออกแบบ data-heavy interface ได้โดยไม่มี technical blind spot",
      "Data visualization เป็น skill ที่ designer ส่วนใหญ่หลีกเลี่ยง — ถ้าทีมมี data product หรือ analytics คนนี้คือ shortcut ที่ไม่ต้องเทรนใหม่",
    ],
    characterDescription: "หา pattern ใหม่ในข้อมูล และออกแบบให้ความซับซ้อนดูเข้าใจง่าย",
    hobbyDescription: "ชอบสร้างสิ่งใหม่และหาทางแก้ปัญหาจากมุมที่ไม่เคยลองมาก่อน",
    strengthDescription: "มองเห็น pattern ในข้อมูลและทำให้เรื่องยากดูเข้าใจง่าย",
    hardSkills: [{ name: "Data Viz", level: 87 }, { name: "Dashboard Design", level: 85 }, { name: "Figma", level: 83 }, { name: "Dev Handoff", level: 82 }],
    softSkills: ["Technical Depth", "Precision", "Curiosity"],
    experienceYears: 3,
    hobbies: ["Gaming", "Reading", "DIY"],
    strengths: ["Analytical Thinking", "Problem Solving", "Innovation"],
    runnerTag: { label: "Rare Skill Set", color: "rose" },
  },
  {
    id: 19,
    title: "UI Designer",
    company: "Krungsri (Bank of Ayudhya)",
    exp: "4 ปี",
    location: "กรุงเทพฯ",
    education: "มหาวิทยาลัยมหิดล สื่อและนิเทศศาสตร์",
    salary: "46,000 – 58,000 THB",
    matchScore: 61,
    whyYoullLike: [
      "ครอบคลุมทุก layer ของ UI quality ในคนเดียว ตั้งแต่ visual design, design system จนถึง accessibility — หาได้ยากมากในตลาด",
      "4 ปีในธนาคารอาจดูเหมือน slow-paced ไม่ match กับ tech startup — แต่คนที่ผ่าน compliance design มาแล้วมักไม่ทำ mistake ที่แพงที่สุดในการ launch product",
      "ถ้าต้องการคนที่ทำ design system ที่ scale ได้โดยไม่ต้องรื้อใหม่ทุกครั้ง — คนนี้ผ่าน compliance environment ที่ยากที่สุดมาแล้ว",
    ],
    characterDescription: "ทำงานถูกต้องในทุก edge case และสร้างระบบที่ไม่ต้องรื้อใหม่",
    hobbyDescription: "ชอบทำสิ่งที่ถูกต้องแบบค่อยๆ สะสม ไม่รีบร้อน",
    strengthDescription: "สร้างระบบที่ทนทานและทำงานถูกต้องทุก use case",
    hardSkills: [{ name: "UI Design", level: 88 }, { name: "Figma", level: 86 }, { name: "Design System", level: 83 }, { name: "Accessibility", level: 80 }],
    softSkills: ["Meticulous", "Patient", "Process-oriented"],
    experienceYears: 4,
    hobbies: ["Reading", "Cooking", "Yoga"],
    strengths: ["Facilitation", "Communication", "Empathy"],
    runnerTag: undefined,
  },
  {
    id: 20,
    title: "Product Designer",
    company: "OPN (Omise Payment)",
    exp: "3 ปี",
    location: "กรุงเทพฯ (Hybrid)",
    education: "มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี Creative Technology",
    salary: "48,000 – 61,000 THB",
    matchScore: 60,
    whyYoullLike: [
      "ทำ high-stakes payment interaction ได้ถูกต้องทั้ง flow และ detail — ผ่านงานที่ user trust เป็นเรื่อง critical มาแล้ว",
      "Creative Technology อาจดูเป็นสาย experimental เกินไปสำหรับ product role — แต่ foundation นี้ทำให้ออกแบบ interaction ที่รู้สึก natural โดยไม่ต้อง A/B test ซ้ำหลายรอบ",
      "Strategic Thinking + Innovation + Execution ครบสาม แต่ title ยังไม่ senior — ถ้ากรองแค่ level คุณจะพลาดคนที่คิดได้ในหลายระดับพร้อมกัน",
    ],
    characterDescription: "คิดได้ทั้ง strategy และ detail พร้อมกัน และลงมือทำเองได้เสมอ",
    hobbyDescription: "มองหา inspiration จากหลายสาขา และชอบสร้างสิ่งใหม่",
    strengthDescription: "เห็นภาพใหญ่ได้ และยังลงมือทำ detail ได้เองโดยไม่สะดุด",
    hardSkills: [{ name: "Payment UX", level: 85 }, { name: "Figma", level: 83 }, { name: "Prototyping", level: 80 }, { name: "Mobile UI", level: 79 }],
    softSkills: ["Independent", "Trust-aware Design", "Proactive"],
    experienceYears: 3,
    hobbies: ["Photography", "Music Production", "Reading"],
    strengths: ["Strategic Thinking", "Innovation", "Execution"],
    runnerTag: { label: "Likely to Move Soon", color: "orange" },
  },
];

type TabType = "recommended" | "read" | "shortlisted" | "liked" | "snoozed";

const snoozeReasons = [
  "ประสบการณ์ยังไม่พอสำหรับตำแหน่งนี้",
  "Salary ที่ต้องการสูงเกินงบของเรา",
  "ไม่ตรงกับ Culture ของทีม",
  "Location ไม่สะดวก",
  "Hard Skills ยังไม่ครบตามที่ต้องการ",
  "อยากรอดูผู้สมัครคนอื่นก่อน",
  "อื่นๆ",
];

interface SnoozeModalProps {
  onClose: () => void;
  onSubmit: (reason: string, note: string) => void;
}

function SnoozeModal({ onClose, onSubmit }: SnoozeModalProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [otherNote, setOtherNote] = useState("");

  const handleSubmit = () => {
    if (!selected) return;
    const note = selected === "อื่นๆ" ? otherNote : "";
    onSubmit(selected, note);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-[16px] font-bold text-[#1A1A2E]">ทำไมถึงยังไม่สนใจ?</h3>
            <p className="text-[13px] text-gray-400 mt-0.5">บอก AI เพื่อนำเสนอได้ตรงกว่าเดิม</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="px-6 pt-4 pb-2">
          <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl bg-[#F0F8FF] border border-[#0DC2FF]/20 mb-5">
            <Brain className="w-4 h-4 text-[#127EE3] flex-shrink-0 mt-0.5" />
            <p className="text-[13px] text-[#127EE3] leading-relaxed">
              AI จะเรียนรู้จากคำตอบนี้ เพื่อนำเสนอผู้สมัครที่ตรงกับความต้องการของคุณมากขึ้นในครั้งต่อไป
            </p>
          </div>

          <p className="text-[13px] font-semibold text-[#1A1A2E] mb-3">เหตุผลที่ไว้ก่อน</p>
          <div className="space-y-2">
            {snoozeReasons.map((reason) => (
              <button
                key={reason}
                onClick={() => setSelected(reason)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] text-left border transition-all ${
                  selected === reason
                    ? "border-[#127EE3] bg-[#127EE3]/5 text-[#127EE3] font-semibold"
                    : "border-gray-100 hover:border-gray-200 text-gray-600"
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                  selected === reason ? "border-[#127EE3]" : "border-gray-300"
                }`}>
                  {selected === reason && <div className="w-2 h-2 rounded-full bg-[#127EE3]" />}
                </div>
                {reason}
              </button>
            ))}
          </div>

          {selected === "อื่นๆ" && (
            <div className="mt-3">
              <textarea
                value={otherNote}
                onChange={(e) => setOtherNote(e.target.value)}
                placeholder="บอก AI เพิ่มเติมว่าอะไรที่ไม่ตรง..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-gray-600 placeholder-gray-300 resize-none focus:outline-none focus:border-[#127EE3] transition-colors"
                rows={2}
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 px-6 py-4">
          <button
            onClick={handleSubmit}
            disabled={!selected}
            className={`flex-1 py-3 rounded-xl text-[14px] font-bold transition-all ${
              selected
                ? "bg-[#1A1A2E] text-white hover:bg-[#2a2a3e]"
                : "bg-gray-100 text-gray-300 cursor-not-allowed"
            }`}
          >
            ยืนยัน — บอก AI
          </button>
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl text-[14px] font-semibold text-gray-400 hover:text-gray-600 border border-gray-100 hover:border-gray-200 transition-colors"
          >
            ข้าม
          </button>
        </div>
      </div>
    </div>
  );
}

function CharacterSection({ hobbies, strengths, hobbyDescription, strengthDescription }: { hobbies: string[]; strengths: string[]; hobbyDescription?: string; strengthDescription?: string }) {
  const character = deriveCharacter(hobbies, strengths);
  const hobbyIcon = hobbyIconMap[hobbies[0]];

  return (
    <div className="mb-4 pt-3 border-t border-gray-100">
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">ตัวตน (Character)</p>
      <div className="flex items-stretch gap-2">
        <div className="flex-1 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2.5">
          <p className="text-[9px] font-medium text-gray-400 mb-1.5">Hobbies</p>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[12px] font-semibold text-gray-700 leading-tight">{character.fromHobbies}</span>
          </div>
          {hobbyDescription && (
            <p className="text-[12px] text-gray-500 leading-relaxed">{hobbyDescription}</p>
          )}
        </div>
        <div className="flex-1 rounded-lg bg-pink-50 border border-pink-100 px-3 py-2.5">
          <p className="text-[9px] font-medium text-gray-400 mb-1.5">Strengths</p>
          <span className="text-[12px] font-semibold text-gray-700 leading-tight block mb-1">{character.fromStrengths}</span>
          {strengthDescription && (
            <p className="text-[12px] text-gray-500 leading-relaxed">{strengthDescription}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function AnonymousAvatar({ size = "lg" }: { size?: "lg" | "md" }) {
  const isLg = size === "lg";
  return (
    <div className={`${isLg ? "w-12 h-12 rounded-2xl" : "w-10 h-10 rounded-xl"} bg-[#F0F2F5] border border-gray-200 flex items-center justify-center flex-shrink-0`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={`${isLg ? "w-7 h-7" : "w-6 h-6"} text-gray-300`}
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    </div>
  );
}

function PerfectFitCard({ candidate, showResume }: { candidate: Candidate; showResume?: boolean }) {
  const [status, setStatus] = useState<"sent" | "shortlisted" | "snoozed" | null>(candidate.status ?? null);
  const [showSnoozeModal, setShowSnoozeModal] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="h-[3px] bg-gradient-to-r from-[#01BFF9] to-[#019EFC]" />
        <div className="p-6 flex gap-6">
          {/* LEFT — Profile */}
          <div className="w-[256px] flex-shrink-0 border-r border-gray-100 pr-6">
            {/* Header */}
            <div className="flex items-start gap-3 mb-5">
              <AnonymousAvatar size="lg" />
              <div className="min-w-0 flex-1">
                <p className="text-[15px] text-[#111827] font-semibold leading-snug mb-1">{candidate.title}</p>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#EBF8FF] text-[#0277a8] tracking-wide uppercase">
                  <Zap className="w-2.5 h-2.5" />
                  Perfectly Fit
                </span>
              </div>
            </div>

            {/* Key info rows */}
            <div className="space-y-2 text-[12.5px] mb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <span className="font-medium text-[#111827] leading-snug">{candidate.company}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Clock className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                <span>{candidate.exp} ประสบการณ์</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                <span>{candidate.location}</span>
              </div>
              <div className="flex items-start gap-2 text-gray-500">
                <GraduationCap className="w-3.5 h-3.5 text-gray-300 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{candidate.education}</span>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                <Banknote className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <span className="font-semibold text-[#111827] text-[13px]">{candidate.salary}</span>
              </div>
            </div>

            {candidate.matchedSkills && candidate.matchedSkills.length > 0 && (
              <div className="pt-3 border-t border-gray-100">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Matched Skills</p>
                <div className="flex flex-wrap gap-1">
                  {candidate.matchedSkills.map((s) => (
                    <span key={s} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {candidate.competencies && candidate.competencies.length > 0 && (
              <div className="pt-3 mt-3 border-t border-gray-100">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Core Competencies</p>
                <div className="flex flex-wrap gap-1">
                  {candidate.competencies.map((c) => (
                    <span key={c} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-teal-50 text-teal-700">{c}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — Why + Character + Signals + CTAs */}
          <div className="flex-1 min-w-0 flex flex-col">
            {/* Why label */}
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Why This Candidate Stands Out</p>

            {/* Why insights */}
            <ul className="space-y-2.5 mb-5">
              {candidate.whyYoullLike.slice(0, 3).map((item, i) => (
                <li key={i} className="flex gap-3 text-[13px] text-gray-700 leading-[1.65]">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 text-gray-400 text-[10px] font-bold flex items-center justify-center mt-[1px]">{i + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <CharacterSection hobbies={candidate.hobbies} strengths={candidate.strengths} hobbyDescription={candidate.hobbyDescription} strengthDescription={candidate.strengthDescription} />

            {candidate.deepAnalysis && candidate.deepAnalysis.length > 0 && (
              <div className="mb-4 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1.5 mb-2">
                  <Brain className="w-3 h-3 text-gray-400" />
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Behavioral Signals</span>
                  <span className="text-[10px] text-gray-300 ml-1">· AI</span>
                </div>
                <ul className="space-y-1.5">
                  {candidate.deepAnalysis.map((item, i) => (
                    <li key={i} className="flex gap-2.5 text-[12px] leading-relaxed text-gray-500">
                      <span className="flex-shrink-0 w-1 h-1 rounded-full bg-gray-300 mt-[7px]" />
                      <span><span className="font-medium text-gray-700">{item.label}</span> — {item.detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTAs */}
            <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-100 flex-wrap">
              {showResume ? (
                <button
                  onClick={() => setResumeOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold bg-gradient-to-r from-[#01BFF9] to-[#019EFC] text-white hover:opacity-90 transition-opacity"
                >
                  <FileText className="w-3.5 h-3.5" />
                  ดูเรซูเม่
                </button>
              ) : (
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold bg-gradient-to-r from-[#01BFF9] to-[#019EFC] text-white hover:opacity-90 transition-opacity">
                  <FileText className="w-3.5 h-3.5" />
                  ดูเรซูเม่
                </button>
              )}
              <button
                onClick={() => setMessageOpen(true)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium transition-all ${
                  status === "sent"
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                    : "border border-gray-300 text-gray-600 hover:border-[#019EFC] hover:text-[#019EFC]"
                }`}
              >
                {status === "sent" ? <><CheckCircle2 className="w-3.5 h-3.5" />ส่งแล้ว</> : <><MessageCircle className="w-3.5 h-3.5" />ส่งข้อความสนใจ</>}
              </button>
              <button
                onClick={() => setStatus(status === "shortlisted" ? null : "shortlisted")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-medium border transition-all ${
                  status === "shortlisted"
                    ? "bg-amber-50 text-amber-600 border-amber-200"
                    : "border-gray-200 text-gray-500 hover:border-amber-200 hover:text-amber-600"
                }`}
              >
                <BookmarkPlus className="w-3.5 h-3.5" />
                {status === "shortlisted" ? "ชอร์ตลิสต์แล้ว" : "ชอร์ตลิสต์"}
              </button>
              <button
                onClick={() => {
                  if (status === "snoozed") { setStatus(null); } else { setShowSnoozeModal(true); }
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12.5px] transition-colors ml-auto ${
                  status === "snoozed"
                    ? "text-gray-400 bg-gray-50"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                {status === "snoozed" ? "ยังไม่สนใจแล้ว" : "ยังไม่สนใจ"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSnoozeModal && (
        <SnoozeModal
          onClose={() => setShowSnoozeModal(false)}
          onSubmit={(reason, note) => {
            console.log("Snooze feedback:", { candidate: candidate.id, reason, note });
            setStatus("snoozed");
            setShowSnoozeModal(false);
          }}
        />
      )}

      {resumeOpen && <ResumePanel onClose={() => setResumeOpen(false)} />}

      {messageOpen && (
        <MessageModal
          candidateTitle={candidate.title}
          candidateCompany={candidate.company}
          candidateExp={candidate.exp}
          onClose={() => {
            setMessageOpen(false);
            setStatus("sent");
          }}
        />
      )}
    </>
  );
}

function RunnerUpCard({ candidate }: { candidate: RunnerCandidate }) {
  const [status, setStatus] = useState<"sent" | "shortlisted" | "snoozed" | null>(candidate.status ?? null);
  const [showSnoozeModal, setShowSnoozeModal] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const tagClass = candidate.runnerTag ? tagColorMap[candidate.runnerTag.color] : "";
  const tagIcon = candidate.runnerTag ? tagIconMap[candidate.runnerTag.label] : null;

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="p-5 flex gap-5">
          {/* LEFT */}
          <div className="w-[244px] flex-shrink-0 border-r border-gray-100 pr-5">
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
              <AnonymousAvatar size="lg" />
              <div className="min-w-0 flex-1">
                <p className="text-[14px] text-[#111827] font-semibold leading-snug mb-1">{candidate.title}</p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {candidate.runnerTag && (
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${tagClass}`}>
                      {tagIcon}
                      {candidate.runnerTag.label}
                    </span>
                  )}
                  {candidate.matchScore && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-gray-100 text-gray-500">
                      {candidate.matchScore}% match
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Info rows */}
            <div className="space-y-2 text-[12px]">
              <div className="flex items-center gap-2 text-gray-700">
                <Briefcase className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <span className="font-medium leading-snug">{candidate.company}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                {candidate.exp} ประสบการณ์
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                {candidate.location}
              </div>
              <div className="flex items-start gap-2 text-gray-400">
                <GraduationCap className="w-3.5 h-3.5 text-gray-300 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{candidate.education}</span>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                <Banknote className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <span className="font-semibold text-[#111827]">{candidate.salary}</span>
              </div>
            </div>

            {candidate.matchedSkills && candidate.matchedSkills.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Matched Skills</p>
                <div className="flex flex-wrap gap-1">
                  {candidate.matchedSkills.map((s) => (
                    <span key={s} className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {candidate.competencies && candidate.competencies.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Core Competencies</p>
                <div className="flex flex-wrap gap-1">
                  {candidate.competencies.map((c) => (
                    <span key={c} className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-teal-50 text-teal-600">{c}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Why This Candidate Stands Out</p>
              {candidate.matchScore && (
                <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                  {candidate.matchScore}%
                </span>
              )}
            </div>

            <ul className="space-y-2.5 mb-4">
              {candidate.whyYoullLike.map((item, i) => (
                <li key={i} className="flex gap-3 text-[12.5px] text-gray-700 leading-[1.65]">
                  <span className="flex-shrink-0 w-4 h-4 rounded-full bg-gray-100 text-gray-400 text-[9px] font-bold flex items-center justify-center mt-[2px]">{i + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* Character inline */}
            {candidate.hobbies && candidate.strengths && (() => {
              const ch = deriveCharacter(candidate.hobbies, candidate.strengths);
              const icon = hobbyIconMap[candidate.hobbies[0]];
              return (
                <div className="mb-4 pt-3 border-t border-gray-100">
                  <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider mb-2">ตัวตน (Character)</p>
                  <div className="flex items-stretch gap-2">
                    <div className="flex-1 rounded-lg bg-blue-50 border border-blue-100 px-2.5 py-2">
                      <p className="text-[9px] font-medium text-gray-400 mb-1">Hobbies</p>
                      <div className="flex items-center gap-1">
                        <span className="text-[11.5px] font-semibold text-gray-700">{ch.fromHobbies}</span>
                      </div>
                      {candidate.hobbyDescription && <p className="text-[12px] text-gray-500 mt-0.5 leading-relaxed">{candidate.hobbyDescription}</p>}
                    </div>
                    <div className="flex-1 rounded-lg bg-pink-50 border border-pink-100 px-2.5 py-2">
                      <p className="text-[9px] font-medium text-gray-400 mb-1">Strengths</p>
                      <span className="text-[11.5px] font-semibold text-gray-700">{ch.fromStrengths}</span>
                      {candidate.strengthDescription && <p className="text-[12px] text-gray-500 mt-0.5 leading-relaxed">{candidate.strengthDescription}</p>}
                    </div>
                  </div>
                </div>
              );
            })()}

            {candidate.deepAnalysis && candidate.deepAnalysis.length > 0 && (
              <div className="mb-4 pt-3 border-t border-gray-100">
                <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Behavioral Signals · AI</p>
                <ul className="space-y-1.5">
                  {candidate.deepAnalysis.map((item, i) => (
                    <li key={i} className="flex gap-2 text-[11.5px] leading-relaxed text-gray-500">
                      <span className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0 mt-[7px]" />
                      <span><span className="font-medium text-gray-700">{item.label}:</span> {item.detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-100 flex-wrap">
              <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12.5px] font-semibold bg-gradient-to-r from-[#01BFF9] to-[#019EFC] text-white hover:opacity-90 transition-opacity">
                <FileText className="w-3.5 h-3.5" />
                ดูเรซูเม่
              </button>
              <button
                onClick={() => setMessageOpen(true)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12.5px] font-medium transition-all ${
                  status === "sent"
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                    : "border border-gray-300 text-gray-600 hover:border-[#019EFC] hover:text-[#019EFC]"
                }`}
              >
                {status === "sent" ? <><CheckCircle2 className="w-3.5 h-3.5" />ส่งแล้ว</> : <><MessageCircle className="w-3.5 h-3.5" />ส่งข้อความสนใจ</>}
              </button>
              <button
                onClick={() => setStatus(status === "shortlisted" ? null : "shortlisted")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12.5px] font-medium border transition-all ${
                  status === "shortlisted"
                    ? "bg-amber-50 text-amber-600 border-amber-200"
                    : "border-gray-200 text-gray-500 hover:border-amber-200 hover:text-amber-600"
                }`}
              >
                <BookmarkPlus className="w-3.5 h-3.5" />
                {status === "shortlisted" ? "ชอร์ตลิสต์แล้ว" : "ชอร์ตลิสต์"}
              </button>
              <button
                onClick={() => {
                  if (status === "snoozed") { setStatus(null); } else { setShowSnoozeModal(true); }
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12.5px] transition-colors ml-auto ${
                  status === "snoozed" ? "text-gray-400 bg-gray-50" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                {status === "snoozed" ? "ยังไม่สนใจแล้ว" : "ยังไม่สนใจ"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSnoozeModal && (
        <SnoozeModal
          onClose={() => setShowSnoozeModal(false)}
          onSubmit={(reason, note) => {
            console.log("Snooze feedback:", { candidate: candidate.id, reason, note });
            setStatus("snoozed");
            setShowSnoozeModal(false);
          }}
        />
      )}

      {messageOpen && (
        <MessageModal
          candidateTitle={candidate.title}
          candidateCompany={candidate.company}
          candidateExp={candidate.exp}
          onClose={() => {
            setMessageOpen(false);
            setStatus("sent");
          }}
        />
      )}
    </>
  );
}

interface TopPicksPageProps {
  onBack: () => void;
  jobs?: JobRow[];
  initialJobId?: string;
}

export default function TopPicksPage({ onBack, jobs = [], initialJobId }: TopPicksPageProps) {
  const [activeTab, setActiveTab] = useState<TabType>("recommended");
  const [jobSelectorOpen, setJobSelectorOpen] = useState(false);

  const jobsWithPicks = jobs.filter((j) => j.topPicks > 0).sort((a, b) => b.topPicks - a.topPicks);
  const defaultJobId = initialJobId ?? jobsWithPicks[0]?.id ?? "j1";
  const [selectedJobId, setSelectedJobId] = useState<string>(defaultJobId);

  const selectedJob = jobsWithPicks.find((j) => j.id === selectedJobId) ?? jobsWithPicks[0];
  const topPicksCount = selectedJob?.topPicks ?? 142;
  const topPicksNew = selectedJob?.topPicksNew ?? 0;
  const jobTitle = selectedJob?.title ?? "Product Designer (UI/UX)";
  const perfectFitCount = Math.max(3, Math.min(5, Math.floor(topPicksCount * 0.04)));
  const runnerCount = topPicksCount - perfectFitCount;

  const tabs: { key: TabType; label: string; icon: React.ReactNode; count: number }[] = [
    { key: "recommended", label: "แนะนำ", icon: <Sparkles className="w-4 h-4" />, count: topPicksCount },
    { key: "read", label: "อ่านแล้ว", icon: <BookOpen className="w-4 h-4" />, count: 18 },
    { key: "shortlisted", label: "ชอร์ตลิสต์", icon: <BookmarkPlus className="w-4 h-4" />, count: 6 },
    { key: "liked", label: "สนใจแล้ว", icon: <Heart className="w-4 h-4" />, count: 4 },
    { key: "snoozed", label: "ยังไม่สนใจ", icon: <Clock className="w-4 h-4" />, count: 4 },
  ];

  return (
    <div className="bg-[#F0F2F5] flex flex-col">
      <div className="max-w-screen-lg mx-auto w-full px-6 py-6 flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[14px] font-medium text-gray-500 hover:text-[#1A1A2E] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            กลับ
          </button>

          {jobsWithPicks.length > 1 && (
            <div className="relative ml-auto">
              <button
                onClick={() => setJobSelectorOpen((v) => !v)}
                className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white border border-gray-200 shadow-sm hover:border-[#127EE3]/40 hover:shadow-md transition-all text-[14px] font-semibold text-[#1A1A2E]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#0DC2FF]" />
                <span className="max-w-[220px] truncate">{jobTitle}</span>
                {topPicksNew > 0 && (
                  <span className="flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#127EE3] text-white">+{topPicksNew} ใหม่</span>
                )}
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${jobSelectorOpen ? "rotate-180" : ""}`} />
              </button>

              {jobSelectorOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setJobSelectorOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 z-50 bg-white rounded-2xl border border-gray-100 shadow-2xl overflow-hidden w-[360px]">
                    <div className="px-4 pt-4 pb-2 border-b border-gray-50">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">เลือกตำแหน่งงาน</p>
                      <p className="text-[12px] text-gray-400 mt-0.5">ตำแหน่งที่มี AI Top Picks พร้อมให้ดู</p>
                    </div>
                    <div className="py-1.5 max-h-[320px] overflow-y-auto">
                      {jobsWithPicks.map((job) => {
                        const isActive = job.id === selectedJobId;
                        return (
                          <button
                            key={job.id}
                            onClick={() => {
                              setSelectedJobId(job.id);
                              setJobSelectorOpen(false);
                              setActiveTab("recommended");
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                              isActive ? "bg-[#F0F8FF]" : "hover:bg-gray-50"
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isActive ? "bg-[#127EE3]" : "bg-gray-200"}`} />
                            <div className="flex-1 min-w-0">
                              <p className={`text-[13.5px] font-semibold leading-snug truncate ${isActive ? "text-[#127EE3]" : "text-[#1A1A2E]"}`}>{job.title}</p>
                              <p className="text-[11.5px] text-gray-400 mt-0.5">{job.location} · {job.type}</p>
                            </div>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              <span className={`text-[12px] font-bold px-2.5 py-1 rounded-full ${isActive ? "bg-[#127EE3]/10 text-[#127EE3]" : "bg-gray-100 text-gray-500"}`}>
                                {job.topPicks}
                              </span>
                              {job.topPicksNew && job.topPicksNew > 0 ? (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#127EE3] text-white">+{job.topPicksNew}</span>
                              ) : null}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-7 py-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#0DC2FF]/6 to-transparent rounded-full translate-x-32 -translate-y-32 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#127EE3]/4 to-transparent rounded-full -translate-x-12 translate-y-12 pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#0DC2FF]/15 to-[#127EE3]/10 border border-[#0DC2FF]/25">
                <Sparkles className="w-3 h-3 text-[#0DC2FF]" />
                <span className="text-[10px] font-bold text-[#0277a8] tracking-widest uppercase">AI Curated · Live</span>
              </div>
              <span className="text-[12px] text-gray-400">อัพเดทล่าสุด 2 ชั่วโมงที่แล้ว</span>
            </div>
            <h1 className="text-[28px] font-bold text-[#1A1A2E] leading-tight mb-1.5 tracking-tight">
              Top Picks
              <span className="text-[#127EE3] font-semibold"> — {jobTitle}</span>
            </h1>
            <p className="text-[14px] text-gray-400 mb-5 leading-relaxed">
              AI วิเคราะห์ผู้สมัครหลายพันคน คัดมาให้แล้ว <span className="font-semibold text-[#1A1A2E]">{topPicksCount}</span> คนที่น่าคุยที่สุด — เรียงตามความตรงกับ JD และ culture signal
            </p>
            <div className="flex items-center gap-4 text-[12.5px] text-gray-400 flex-wrap">
              <div className="flex items-center gap-1.5 bg-[#F0F8FF] border border-[#0DC2FF]/20 px-3 py-1.5 rounded-full">
                <Zap className="w-3 h-3 text-[#0DC2FF]" />
                <span><strong className="text-[#1A1A2E]">{perfectFitCount} Perfectly Fit</strong> — คัดแล้วว่าตรงที่สุด</span>
              </div>
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-full">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span><strong className="text-[#1A1A2E]">{runnerCount}+</strong> น่าสนใจ แต่ละคนมีจุดเด่นต่างกัน</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400">
                <AlertCircle className="w-3 h-3" />
                <span>ไม่เปิดเผยชื่อจนกว่าจะสนใจ</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-dashed border-gray-100 flex items-start gap-2.5">
              <span className="text-[13px] flex-shrink-0 mt-0.5">💡</span>
              <p className="text-[12.5px] text-gray-400 leading-relaxed">
                <span className="font-semibold text-gray-500">Top Talent ต้องจีบ</span> — โทรไม่ติดหรือยังไม่ตอบ อย่าเพิ่งถอดใจ
                {" "}ในทางปฏิบัติ ติดต่อ 10 คน มักได้คุยจริงๆ ประมาณ 2–3 คน ลองส่งหลายๆ คนพร้อมกันแล้วรอสัญญาณตอบรับ
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          {/* Tab bar */}
          <div className="flex border-b border-gray-100 px-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative flex items-center gap-1.5 py-3.5 px-4 text-[13px] font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                  activeTab === tab.key ? "text-[#1565C0]" : "text-gray-400 hover:text-gray-700"
                }`}
              >
                {tab.label}
                <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-semibold min-w-[20px] text-center ${
                  activeTab === tab.key ? "bg-[#1565C0]/10 text-[#1565C0]" : "bg-gray-100 text-gray-400"
                }`}>
                  {tab.count}
                </span>
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1565C0] rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          {activeTab === "recommended" && (
            <div className="p-6">
              {/* Count + sort row */}
              <div className="flex items-center justify-between mb-5">
                <p className="text-[13px] text-gray-500">
                  <span className="font-semibold text-[#111827]">{topPicksCount}</span> ผู้สมัครใหม่ · ยังไม่เคยเปิดดู
                </p>
                <div className="flex items-center gap-1.5 text-[12px] text-gray-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                  เรียงตาม AI Score
                </div>
              </div>

              {/* Perfectly Fit section */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Perfectly Fit</span>
                    <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">{perfectFitCount}</span>
                  </div>
                  <span className="text-[12px] text-gray-400">AI คัดแล้วว่าตรงที่สุดทั้ง experience, skills และ culture fit</span>
                </div>
                <div className="space-y-4">
                  {perfectFitCandidates.map((c, idx) => (
                    <PerfectFitCard key={c.id} candidate={c} showResume={idx === 0} />
                  ))}
                </div>
              </div>

              {/* Shortlist section */}
              <div className="border-t border-gray-100 pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Shortlist</span>
                    <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">{runnerCount}</span>
                  </div>
                  <span className="text-[12px] text-gray-400">แต่ละคนมีจุดเด่นต่างกัน — ดูว่าคนไหนตรงทิศทางทีม</span>
                </div>
                <div className="space-y-3">
                  {runnerUpCandidates.map((c) => (
                    <RunnerUpCard key={c.id} candidate={c} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "read" && <ReadTab />}
          {activeTab === "shortlisted" && <ShortlistedTab />}
          {activeTab === "liked" && <LikedTab />}
          {activeTab === "snoozed" && <SnoozedTab />}
        </div>
      </div>
    </div>
  );
}

interface StatusCandidate {
  id: number;
  title: string;
  company: string;
  exp: string;
  location: string;
  education: string;
  salary: string;
  matchScore: number;
  skills: string[];
  highlights: string[];
  hobbies?: string[];
  strengths?: string[];
  hobbyDescription?: string;
  strengthDescription?: string;
  competencies?: string[];
  deepAnalysis?: { label: string; detail: string }[];
  readAt?: string;
  likedAt?: string;
  snoozedAt?: string;
  snoozeReason?: string;
  sentMessage?: string;
}

const readCandidates: StatusCandidate[] = [
  {
    id: 101,
    title: "Senior Product Designer",
    company: "LINE MAN Wongnai",
    exp: "6 ปี",
    location: "กรุงเทพฯ",
    education: "จุฬาลงกรณ์มหาวิทยาลัย นิเทศศิลป์",
    salary: "75,000 – 95,000 THB",
    matchScore: 94,
    skills: ["Figma", "Design System", "Prototyping", "User Research"],
    highlights: [
      "ทำงานบน product หลักล้านคนมา 6 ปี — เข้าใจ scale ที่คนในสายอื่นไม่มีทาง calibrate ได้",
      "ทำได้ครบตั้งแต่ design system ถึง user research ในคนเดียว — หายากมากในตลาดนี้",
      "เชื่อม design decision กับ business goal ได้ชัดเจน ไม่ใช่แค่ทำหน้าจอสวย",
    ],
    hobbies: ["Photography", "Film"],
    strengths: ["Storytelling", "Strategic Thinking"],
    hobbyDescription: "สังเกตโลกรอบข้างแล้วแปลงเป็น visual ได้เสมอ",
    strengthDescription: "ออกแบบได้อย่างมีระบบและเล่าเรื่องผ่าน product ได้ชัดเจน",
    competencies: ["มีความคิดสร้างสรรค์", "มีทักษะเรื่องสี", "สื่อสารและถ่ายทอดได้ดี"],
    deepAnalysis: [
      { label: "การคิดและการสร้าง", detail: "มีแนวโน้มคิดไอเดียใหม่และหาวิธีแก้ปัญหา จาก Photography และ Film" },
      { label: "การทำผลลัพธ์", detail: "มีแรงขับในการทำงานที่มีเป้าหมายชัด จาก Strategic Thinking และประสบการณ์ใน scale product" },
      { label: "การทำงานกับคน", detail: "สามารถเชื่อม design กับ business ได้ดี จาก Storytelling และการนำเสนองาน" },
    ],
    readAt: "เมื่อ 2 ชั่วโมงที่แล้ว",
  },
  {
    id: 102,
    title: "Lead UX Designer",
    company: "Agoda",
    exp: "5 ปี",
    location: "กรุงเทพฯ",
    education: "มหาวิทยาลัยมหิดล วิทยาการสารสนเทศ",
    salary: "68,000 – 82,000 THB",
    matchScore: 88,
    skills: ["User Research", "Figma", "A/B Testing", "Analytics"],
    highlights: [
      "5 ปีกับ multi-market product — เข้าใจ user behaviour ต่างภูมิภาคในแบบที่ไม่มี shortcut",
      "ทำ research แล้ววัดผลได้ด้วยตัวเองโดยไม่ต้องพึ่ง data team",
      "Analytical Thinking กับ Empathy อยู่คู่กัน — ตัดสินใจดีกว่าในสถานการณ์ที่ data กับ human insight ขัดกัน",
    ],
    hobbies: ["Travel", "Podcast"],
    strengths: ["Analytical Thinking", "Facilitation"],
    hobbyDescription: "มองโลกกว้าง ชอบเรียนรู้จากประสบการณ์ใหม่ๆ",
    strengthDescription: "สืบค้นจนเข้าใจและนำทีมตัดสินใจด้วย data เสมอ",
    competencies: ["คิดวิเคราะห์เป็นระบบ", "มุ่งมั่นในผลลัพธ์", "ทำงานร่วมกันได้ดี"],
    deepAnalysis: [
      { label: "การคิดวิเคราะห์", detail: "มีความสามารถในการประมวลผลข้อมูลอย่างเป็นระบบ จาก Analytical Thinking และการวัดผล A/B" },
      { label: "การทำผลลัพธ์", detail: "มีแรงขับในการทำงานที่มีเป้าหมายชัด จากประสบการณ์วัดผลด้วย data มาตลอด 5 ปี" },
      { label: "การทำงานกับคน", detail: "ทำงานร่วมกับ cross-functional team ได้ดี จาก Facilitation และการนำ workshop" },
    ],
    readAt: "เมื่อวาน",
  },
  {
    id: 103,
    title: "Product Designer",
    company: "Bitkub Online",
    exp: "4 ปี",
    location: "กรุงเทพฯ",
    education: "มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี Industrial Design",
    salary: "55,000 – 70,000 THB",
    matchScore: 85,
    skills: ["Figma", "After Effects", "Motion Design", "UI Systems"],
    highlights: [
      "ออกแบบใน environment ที่ user ไม่ยอมรับ confusion — ทุก interaction ต้องสร้าง trust ทันที",
      "ทำ motion prototype ได้เองโดยไม่ต้องพึ่ง developer — ลด handoff round ได้จริง",
      "Innovation กับ Execution อยู่ใน strengths พร้อมกัน — คนที่คิดใหม่ได้และส่งงานได้จริง",
    ],
    hobbies: ["Music Production", "DIY"],
    strengths: ["Innovation", "Execution"],
    hobbyDescription: "ชอบทดลองและสร้างสิ่งใหม่ด้วยมือตัวเอง",
    strengthDescription: "คิดนอกกรอบและ deliver ได้จริงทุกครั้งโดยไม่รอความสมบูรณ์",
    competencies: ["กล้าลองผิดลองถูก", "ใส่ใจทุกรายละเอียด", "มีความคิดสร้างสรรค์"],
    deepAnalysis: [
      { label: "การคิดและการสร้าง", detail: "มีแนวโน้มสร้างสรรค์สิ่งใหม่ จาก Music Production และ DIY ที่ต้องลงมือทำเอง" },
      { label: "การตัดสินใจเชิงรุก", detail: "สามารถตัดสินใจและลงมือทำได้รวดเร็ว จาก Execution strength และ maker mindset" },
      { label: "การทำงานกับคน", detail: "มีความรับผิดชอบสูง ทำงานในทีมได้โดยไม่ต้องการการดูแลมาก" },
    ],
    readAt: "2 วันที่แล้ว",
  },
  {
    id: 104,
    title: "UX/Product Designer",
    company: "SCB TechX",
    exp: "5 ปี",
    location: "กรุงเทพฯ",
    education: "มหาวิทยาลัยเกษตรศาสตร์ ศิลปกรรม",
    salary: "60,000 – 78,000 THB",
    matchScore: 81,
    skills: ["Design Sprint", "Figma", "Stakeholder Mgt", "Prototyping"],
    highlights: [
      "ออกแบบในระบบที่ mistake ไม่ได้รับอนุญาต — ผ่านการ present ต่อ stakeholder หลายระดับ",
      "นำ Design Sprint และ workshop ได้จริงจากประสบการณ์ ไม่ใช่แค่อ่านหนังสือมา",
      "ทำงานได้ตั้งแต่ lead session จนถึง present ต่อผู้บริหาร — ไม่ต้องมี PM คอย translate",
    ],
    hobbies: ["Yoga", "Writing"],
    strengths: ["Facilitation", "Leadership"],
    hobbyDescription: "ใช้ชีวิตอย่างมีสติและชาร์จพลังจากภายในตัวเอง",
    strengthDescription: "นำทีมโดยไม่ต้องการเครดิตและ facilitate ได้อย่างมืออาชีพ",
    competencies: ["สื่อสารและถ่ายทอดได้ดี", "ยึดมั่นในมาตรฐาน", "นำทีมได้อย่างมีประสิทธิภาพ"],
    deepAnalysis: [
      { label: "การสื่อสารและถ่ายทอด", detail: "สามารถถ่ายทอดความคิดและสร้างอิทธิพลต่อผู้อื่น จากทักษะ workshop และการนำเสนอ" },
      { label: "การยึดมั่นในมาตรฐาน", detail: "มีความรับผิดชอบและทำงานตามกรอบที่ชัดเจน จาก mindset ใน financial enterprise" },
      { label: "การทำงานกับคน", detail: "ทำงานร่วมกับ stakeholder หลายระดับได้ดี จาก Leadership และ Facilitation ที่แข็งแกร่ง" },
    ],
    readAt: "3 วันที่แล้ว",
  },
  {
    id: 105,
    title: "Senior UI/UX Designer",
    company: "Lazada Thailand",
    exp: "7 ปี",
    location: "กรุงเทพฯ (Remote OK)",
    education: "มหาวิทยาลัยกรุงเทพ Digital Media Design",
    salary: "80,000 – 100,000 THB",
    matchScore: 78,
    skills: ["Design System", "Figma", "Mentoring", "Leadership"],
    highlights: [
      "7 ปีบน platform ที่ user นับสิบล้านคน — เข้าใจ scale, performance และ edge case จริงๆ",
      "สร้าง design system ที่ทีมทั้งหมดใช้งานได้จริงและ sustain ในระยะยาว",
      "เล่นได้ทั้ง IC, design lead, และ mentor — เข้าได้กับทุก team structure",
    ],
    hobbies: ["Board Games", "Cycling"],
    strengths: ["Mentoring", "Vision"],
    hobbyDescription: "คิดเชิงกลยุทธ์แม้แต่ในชีวิตประจำวัน",
    strengthDescription: "วางระบบที่ทีมอื่นพึ่งพาได้และพัฒนาคนรอบข้างไปพร้อมกัน",
    competencies: ["คิดเชิงลึก", "มีวิสัยทัศน์", "กล้าตัดสินใจ"],
    deepAnalysis: [
      { label: "การคิดเชิงลึก", detail: "มีแนวโน้มเชื่อมโยงแนวคิดและมองภาพระยะยาว จาก Board Games และประสบการณ์ 7 ปี" },
      { label: "การพัฒนาคน", detail: "มีความสามารถในการ mentor และยกระดับคนรอบข้าง จาก Mentoring strength ที่โดดเด่น" },
      { label: "การสื่อสารและถ่ายทอด", detail: "สามารถถ่ายทอดความคิดและ vision ต่อทีมได้ จากประสบการณ์ design lead และ IC" },
    ],
    readAt: "3 วันที่แล้ว",
  },
  {
    id: 106,
    title: "UI Designer",
    company: "KBTG",
    exp: "4 ปี",
    location: "กรุงเทพฯ",
    education: "จุฬาลงกรณ์มหาวิทยาลัย นิเทศศาสตร์",
    salary: "50,000 – 65,000 THB",
    matchScore: 74,
    skills: ["Visual Design", "Figma", "Brand Design"],
    highlights: [
      "Portfolio ครอบคลุมตั้งแต่ component-level ถึง brand identity — เข้า design system ได้ทันที",
      "นิเทศศาสตร์อาจดูไม่ตรง แต่เข้าใจ communication theory ทำให้อธิบาย design rationale ได้ดีกว่า",
    ],
    hobbies: ["Illustration", "Dance"],
    strengths: ["Storytelling", "Communication"],
    hobbyDescription: "แสดงออกผ่านงาน visual และมี aesthetic ที่ชัดเจนเป็นของตัวเอง",
    strengthDescription: "สื่อสารได้อย่างตรงใจและมีสไตล์การนำเสนอที่โดดเด่น",
    competencies: ["มีทักษะเรื่องสี", "ใส่ใจทุกรายละเอียด", "กล้าแสดงออก"],
    deepAnalysis: [
      { label: "การคิดและการสร้าง", detail: "มี Illustration และ Storytelling ที่โดดเด่น ช่วยเพิ่มมิติ visual ให้ product" },
      { label: "การสื่อสารและถ่ายทอด", detail: "สามารถถ่ายทอดความคิดสร้างสรรค์ผ่าน visual ได้ดีมาก จาก Dance และ Communication" },
      { label: "การทำงานกับคน", detail: "มี Empathy สูง ทำให้เข้าใจความต้องการของ user และ stakeholder ได้ดี" },
    ],
    readAt: "4 วันที่แล้ว",
  },
  {
    id: 107,
    title: "UX Researcher",
    company: "AIS",
    exp: "3 ปี",
    location: "กรุงเทพฯ",
    education: "มหาวิทยาลัยธรรมศาสตร์ สังคมวิทยา",
    salary: "42,000 – 55,000 THB",
    matchScore: 71,
    skills: ["User Research", "Usability Testing", "Analytics"],
    highlights: [
      "ทำ research ได้ทั้ง qual และ quant ในคนเดียว — ครบ feedback loop ด้วยตัวเอง",
      "จบ Sociology ทำให้เข้าใจ human behaviour เชิงระบบในแบบที่คนจบตรงทำไม่ได้",
    ],
    hobbies: ["Reading", "Writing"],
    strengths: ["Analytical Thinking", "Research"],
    hobbyDescription: "อ่านเยอะ คิดเยอะ และมองเห็น pattern ที่คนอื่นมองข้าม",
    strengthDescription: "ค้นหาความจริงและเปลี่ยน insight ให้เป็นการกระทำได้",
    competencies: ["คิดวิเคราะห์เป็นระบบ", "ใส่ใจทุกรายละเอียด", "มุ่งมั่นในผลลัพธ์"],
    deepAnalysis: [
      { label: "การคิดวิเคราะห์", detail: "มีทักษะวิเคราะห์ข้อมูลเชิงลึก ทั้ง Qual และ Quant จาก Sociology background" },
      { label: "การคิดเชิงลึก", detail: "มีแนวโน้มเชื่อมโยงแนวคิดและมองภาพเชิงนามธรรม จากการอ่านและการเขียน" },
      { label: "การทำงานกับคน", detail: "เข้าใจ human behaviour เชิงระบบ ทำให้ทำ research ได้ลึกและมี insight มีคุณค่า" },
    ],
    readAt: "5 วันที่แล้ว",
  },
];

const likedCandidates: StatusCandidate[] = [
  {
    id: 201,
    title: "Lead UX Designer",
    company: "Agoda",
    exp: "5 ปี",
    location: "กรุงเทพฯ",
    education: "มหาวิทยาลัยมหิดล วิทยาการสารสนเทศ",
    salary: "68,000 – 82,000 THB",
    matchScore: 91,
    skills: ["User Research", "Figma", "A/B Testing", "Analytics"],
    highlights: [
      "5 ปีกับ multi-market product — เข้าใจ user behaviour ต่างภูมิภาคในแบบที่ไม่มี shortcut",
      "ทำ research แล้ววัดผลได้ด้วยตัวเองโดยไม่ต้องพึ่ง data team",
      "Facilitation strength — คนที่นำ workshop และ align stakeholder ได้ในคนเดียว",
    ],
    hobbies: ["Travel", "Podcast"],
    strengths: ["Analytical Thinking", "Facilitation"],
    hobbyDescription: "มองโลกกว้าง ชอบเรียนรู้จากประสบการณ์ใหม่ๆ",
    strengthDescription: "สืบค้นจนเข้าใจและนำทีมตัดสินใจด้วย data เสมอ",
    competencies: ["คิดวิเคราะห์เป็นระบบ", "มุ่งมั่นในผลลัพธ์", "ทำงานร่วมกันได้ดี"],
    deepAnalysis: [
      { label: "การคิดวิเคราะห์", detail: "มีความสามารถในการประมวลผลข้อมูลอย่างเป็นระบบ จาก Analytical Thinking และ A/B Testing" },
      { label: "การทำผลลัพธ์", detail: "มีแรงขับในการทำงานที่มีเป้าหมายชัด จากประสบการณ์วัดผลด้วย data มาตลอด 5 ปี" },
      { label: "การทำงานกับคน", detail: "ทำงานร่วมกับ cross-functional team ได้ดี จาก Facilitation และการนำ workshop" },
    ],
    likedAt: "เมื่อวาน",
    sentMessage: "สวัสดีครับ ประทับใจ profile ของคุณมากเลย โดยเฉพาะ research framework ที่ทำ ทีมเรากำลังมองหา UX Designer อยู่พอดี อยากชวนมาคุยกันครับ",
  },
  {
    id: 202,
    title: "Senior Product Designer",
    company: "LINE MAN Wongnai",
    exp: "6 ปี",
    location: "กรุงเทพฯ",
    education: "จุฬาลงกรณ์มหาวิทยาลัย นิเทศศิลป์",
    salary: "75,000 – 95,000 THB",
    matchScore: 94,
    skills: ["Figma", "Design System", "Prototyping", "User Research"],
    highlights: [
      "ทำได้ครบตั้งแต่ design system ถึง user research ในคนเดียว — หายากมากในตลาดนี้",
      "เชื่อม design decision กับ business goal ได้ชัดเจน ไม่ใช่แค่ทำหน้าจอสวย",
    ],
    hobbies: ["Photography", "Film"],
    strengths: ["Storytelling", "Strategic Thinking"],
    hobbyDescription: "สังเกตโลกรอบข้างแล้วแปลงเป็น visual ได้เสมอ",
    strengthDescription: "ออกแบบได้อย่างมีระบบและเล่าเรื่องผ่าน product ได้ชัดเจน",
    competencies: ["มีความคิดสร้างสรรค์", "มีทักษะเรื่องสี", "สื่อสารและถ่ายทอดได้ดี"],
    deepAnalysis: [
      { label: "การคิดและการสร้าง", detail: "มีแนวโน้มคิดไอเดียใหม่และหาวิธีแก้ปัญหา จาก Photography และ Film" },
      { label: "การทำผลลัพธ์", detail: "มีแรงขับในการทำงานที่มีเป้าหมายชัด จาก Strategic Thinking และประสบการณ์ scale product 6 ปี" },
      { label: "การทำงานกับคน", detail: "สามารถเชื่อม design กับ business ได้ดี จาก Storytelling และการนำเสนองาน" },
    ],
    likedAt: "2 วันที่แล้ว",
    sentMessage: "ทางเราประทับใจ case study mobile banking ของคุณมากเลย อยากชวนมาคุยเรื่อง Senior Product Designer ตำแหน่งใหม่ของเราครับ",
  },
  {
    id: 203,
    title: "Interaction Designer",
    company: "Microsoft Thailand",
    exp: "4 ปี",
    location: "Remote",
    education: "Mahidol University International College",
    salary: "62,000 – 78,000 THB",
    matchScore: 87,
    skills: ["Interaction Design", "Accessibility", "Figma", "Design Ops"],
    highlights: [
      "Skillset หายาก — ครอบคลุม interaction design, accessibility และ design ops ในคนเดียว",
      "Global mindset ทำให้คิด accessibility และ inclusive design ได้โดย default",
      "4 ปี enterprise design process — ทำให้ทีมมี discipline ที่ scale ได้",
    ],
    hobbies: ["Rock Climbing", "Board Games"],
    strengths: ["Strategic Thinking", "Mentoring"],
    hobbyDescription: "ชอบ challenge ตัวเองและมีมาตรฐานสูงในทุกสิ่งที่ทำ",
    strengthDescription: "ออกแบบโดยคิดถึง edge case และ user ทุกกลุ่มเสมอ",
    competencies: ["ละเอียดรอบคอบ", "มีมาตรฐานสูง", "คิดเชิงระบบ"],
    deepAnalysis: [
      { label: "การคิดเชิงระบบ", detail: "มีแนวโน้มคิด accessibility และ inclusive design โดย default จาก global education" },
      { label: "การพัฒนาคน", detail: "มีความสามารถใน Mentoring ทำให้ทีมมี discipline และ standard ที่ scale ได้" },
      { label: "การตัดสินใจเชิงรุก", detail: "สามารถตัดสินใจและออกแบบ edge case ได้ดี จาก Rock Climbing และ enterprise experience" },
    ],
    likedAt: "3 วันที่แล้ว",
  },
  {
    id: 204,
    title: "Senior UX Designer",
    company: "True Digital Group",
    exp: "5 ปี",
    location: "Remote",
    education: "สถาบันบัณฑิตพัฒนบริหารศาสตร์ บริหารธุรกิจ",
    salary: "58,000 – 72,000 THB",
    matchScore: 83,
    skills: ["UX Strategy", "User Journey", "Figma", "Service Design"],
    highlights: [
      "คิดได้ทั้ง strategic layer และ execution layer ในคนเดียว — ไม่ต้องการ PM มา bridge",
      "จบ MBA ทำให้พูดภาษา business กับ stakeholder ได้โดยไม่ต้องแปล design เป็น ROI",
    ],
    hobbies: ["Travel", "Cycling"],
    strengths: ["Strategic Thinking", "Vision"],
    hobbyDescription: "ชอบสำรวจโลกคนเดียวและค้นหา insight จากทุกที่",
    strengthDescription: "วางกลยุทธ์ได้ชัดและทำงานได้โดยไม่ต้องรอ direction",
    competencies: ["คิดเชิงกลยุทธ์", "มีวิสัยทัศน์", "ทำงานอิสระได้"],
    deepAnalysis: [
      { label: "การคิดเชิงกลยุทธ์", detail: "มีความสามารถมองภาพรวมและวางแผนระยะยาว จาก MBA background และ UX Strategy" },
      { label: "การตัดสินใจเชิงรุก", detail: "สามารถตัดสินใจและทำงานอิสระได้ จาก Vision strength และ Remote work experience" },
      { label: "การสื่อสารและถ่ายทอด", detail: "พูดภาษา business กับ stakeholder ได้โดยไม่ต้องแปล จาก MBA และ Service Design" },
    ],
    likedAt: "4 วันที่แล้ว",
  },
  {
    id: 205,
    title: "Product Designer",
    company: "Sea (Shopee Thailand)",
    exp: "4 ปี",
    location: "กรุงเทพฯ",
    education: "มหาวิทยาลัยกรุงเทพ Digital Arts",
    salary: "52,000 – 66,000 THB",
    matchScore: 79,
    skills: ["E-commerce UX", "Figma", "A/B Testing", "Mobile UI"],
    highlights: [
      "ผ่านสภาพแวดล้อม high-stakes e-commerce — ทำงานได้ครบทั้ง strategy และ execution",
      "A/B Testing แข็งแกร่งคู่กับ Analytical Thinking — combination ที่ designer 5 ปีหลายคนยังไม่มี",
    ],
    hobbies: ["Photography", "Travel"],
    strengths: ["Analytical Thinking", "Execution"],
    hobbyDescription: "ชอบเคลื่อนไหวและหาแรงบันดาลใจจากโลกรอบข้าง",
    strengthDescription: "ทดสอบ วัดผล และปรับ solution ได้อย่างต่อเนื่อง",
    competencies: ["ทนแรงกดดันได้", "เรียนรู้เร็ว", "ตัดสินใจด้วย data"],
    deepAnalysis: [
      { label: "การคิดวิเคราะห์", detail: "มีความสามารถด้าน A/B Testing และ data-driven decision จาก Analytical Thinking" },
      { label: "การทำผลลัพธ์", detail: "สามารถ execute ได้จริงในสภาพแวดล้อมที่มีแรงกดดันสูง จาก e-commerce experience" },
      { label: "การตัดสินใจเชิงรุก", detail: "เรียนรู้เร็วและปรับตัวได้ดีในสภาพแวดล้อม high-stakes จาก Photography และ Travel" },
    ],
    likedAt: "5 วันที่แล้ว",
  },
];

const snoozedCandidates: StatusCandidate[] = [
  {
    id: 301,
    title: "Junior Product Designer",
    company: "Wongnai Media",
    exp: "2 ปี",
    location: "กรุงเทพฯ",
    education: "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง IT",
    salary: "35,000 – 45,000 THB",
    matchScore: 66,
    skills: ["UI Design", "Figma", "User Testing"],
    highlights: [
      "ครบ feedback loop ตั้งแต่ออกแบบจนถึงทดสอบในคนเดียว ด้วยประสบการณ์เพียง 2 ปี",
      "IT background พูดได้ทั้งภาษา dev และภาษา user — ลด misalignment ได้มาก",
    ],
    hobbies: ["Cooking", "Yoga"],
    strengths: ["Collaboration", "Empathy"],
    hobbyDescription: "ชอบทำงานอย่างพิถีพิถันและหาความหมายในชีวิตประจำวัน",
    strengthDescription: "ทีมงานและผู้ร่วมงานพึ่งพาได้เสมอ ไม่มีงานตก",
    competencies: ["ใส่ใจในรายละเอียด", "ทำงานเป็นทีมได้ดี", "มีความกระตือรือร้น"],
    deepAnalysis: [
      { label: "การทำงานกับคน", detail: "มี Empathy สูงและ Collaboration ดี ทำให้เข้ากับทีมได้ง่ายแม้มีประสบการณ์น้อย" },
      { label: "การคิดและการสร้าง", detail: "สามารถทำ feedback loop ครบได้ในคนเดียว จาก IT background และ User Testing" },
      { label: "การตัดสินใจเชิงรุก", detail: "เรียนรู้เร็วและปรับตัวได้ดีในสภาพแวดล้อม startup จาก Yoga และ Cooking" },
    ],
    snoozedAt: "เมื่อวาน",
    snoozeReason: "ประสบการณ์ยังไม่พอสำหรับตำแหน่งนี้",
  },
  {
    id: 302,
    title: "UX/UI Designer",
    company: "Foodpanda Thailand",
    exp: "3 ปี",
    location: "กรุงเทพฯ",
    education: "มหาวิทยาลัยศิลปากร ออกแบบนิเทศศิลป์",
    salary: "44,000 – 57,000 THB",
    matchScore: 63,
    skills: ["Mobile UX", "Figma", "Prototyping", "Visual Design"],
    highlights: [
      "ทำได้ครบทั้ง mobile UX, visual design, prototyping ในคนเดียว",
      "Fine arts foundation ทำ visual storytelling ได้ในระดับที่ UX bootcamp ไม่สอน",
    ],
    hobbies: ["Illustration", "Travel"],
    strengths: ["Execution", "Storytelling"],
    hobbyDescription: "แสดงออกตัวเองผ่านงานสร้างสรรค์และชอบบอกเล่าเรื่องราว",
    strengthDescription: "ทำงานเร็วและ deliver คุณภาพสูงได้แม้ใน deadline แน่น",
    competencies: ["มีสายตา aesthetic", "ทำงานเร็ว", "สร้างสรรค์ได้หลากหลาย"],
    deepAnalysis: [
      { label: "การคิดและการสร้าง", detail: "มี Illustration และ Storytelling ที่โดดเด่น ช่วยเพิ่มมิติ visual ให้ mobile product" },
      { label: "การทำผลลัพธ์", detail: "สามารถ execute ได้จริงในสภาพแวดล้อม fast-paced จาก Execution strength" },
      { label: "การสื่อสารและถ่ายทอด", detail: "ถ่ายทอดความคิดผ่าน visual storytelling ได้ดีมาก จาก fine arts foundation" },
    ],
    snoozedAt: "3 วันที่แล้ว",
    snoozeReason: "Salary ที่ต้องการสูงเกินงบของเรา",
  },
  {
    id: 303,
    title: "Product Designer",
    company: "OPN (Omise Payment)",
    exp: "3 ปี",
    location: "กรุงเทพฯ (Hybrid)",
    education: "มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี Creative Technology",
    salary: "48,000 – 61,000 THB",
    matchScore: 60,
    skills: ["Payment UX", "Figma", "Prototyping", "Mobile UI"],
    highlights: [
      "ทำ high-stakes payment interaction ได้ถูกต้อง — user trust เป็นเรื่อง critical",
      "Strategic Thinking + Innovation + Execution ครบสาม แต่ title ยังไม่ senior",
    ],
    hobbies: ["Photography", "Music Production"],
    strengths: ["Strategic Thinking", "Innovation"],
    hobbyDescription: "มองหา inspiration จากหลายสาขาและชอบสร้างสิ่งใหม่",
    strengthDescription: "เห็นภาพใหญ่ได้และยังลงมือทำ detail ได้เองโดยไม่สะดุด",
    competencies: ["คิดได้ทั้ง strategy และ detail", "มุ่งมั่นในผลลัพธ์", "กล้าลองสิ่งใหม่"],
    deepAnalysis: [
      { label: "การคิดเชิงกลยุทธ์", detail: "มีความสามารถมองภาพรวมและวางแผน จาก Strategic Thinking และ payment product experience" },
      { label: "การคิดและการสร้าง", detail: "มี Innovation strength ทำให้หาทางออกใหม่ๆ ได้ จาก Photography และ Music Production" },
      { label: "การทำผลลัพธ์", detail: "สามารถ execute ได้จริงในสภาพแวดล้อมที่ user trust เป็นเรื่อง critical" },
    ],
    snoozedAt: "1 สัปดาห์ที่แล้ว",
    snoozeReason: "อยากรอดูผู้สมัครคนอื่นก่อน",
  },
  {
    id: 304,
    title: "UX Designer",
    company: "Central Technology",
    exp: "3 ปี",
    location: "กรุงเทพฯ",
    education: "มหาวิทยาลัยธรรมศาสตร์ วิทยาการคอมพิวเตอร์",
    salary: "44,000 – 56,000 THB",
    matchScore: 58,
    skills: ["Wireframing", "UX Research", "Figma"],
    highlights: [
      "CS background ช่วยลด handoff friction ระหว่าง design กับ dev ได้จริง",
      "Analytical Thinking แต่ไม่เย็นชา — Collaboration อยู่ใน top strengths ด้วย",
    ],
    hobbies: ["Gaming", "Board Games"],
    strengths: ["Analytical Thinking", "Problem Solving"],
    hobbyDescription: "หาความสนุกในระบบและกฎกติกาที่ซ่อนอยู่",
    strengthDescription: "คิดเป็นระบบและทำงานร่วมกับ dev ได้โดยไม่ต้องแปลทุกอย่าง",
    competencies: ["คิดวิเคราะห์เป็นระบบ", "เข้าใจทั้ง design และ tech", "ทำงานร่วมกับ dev ได้ดี"],
    deepAnalysis: [
      { label: "การคิดวิเคราะห์", detail: "มีทักษะวิเคราะห์เชิงระบบ จาก CS background และ Analytical Thinking strength" },
      { label: "การทำงานกับคน", detail: "มี Collaboration สูง ทำงานร่วมกับ dev และ designer ได้ในคนเดียว" },
      { label: "การตัดสินใจเชิงรุก", detail: "สามารถแก้ปัญหาได้รวดเร็ว จาก Problem Solving และ Gaming mindset" },
    ],
    snoozedAt: "1 สัปดาห์ที่แล้ว",
    snoozeReason: "Hard Skills ยังไม่ครบตามที่ต้องการ",
  },
];

function StatusCandidateCard({ candidate, tabType }: { candidate: StatusCandidate; tabType: "read" | "liked" | "snoozed" }) {
  const [resumeOpen, setResumeOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [messageSent, setMessageSent] = useState(!!candidate.sentMessage);
  const [likedBack, setLikedBack] = useState(false);
  const [moved, setMoved] = useState(false);

  if (moved) return null;

  const matchColor = candidate.matchScore >= 85 ? "text-emerald-600 bg-emerald-50 border-emerald-100" :
    candidate.matchScore >= 70 ? "text-[#127EE3] bg-[#EBF5FF] border-[#127EE3]/20" :
    "text-gray-500 bg-gray-50 border-gray-200";

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="p-6 flex gap-6">
          {/* LEFT — Profile */}
          <div className="w-[256px] flex-shrink-0 border-r border-gray-100 pr-6">
            {/* Header */}
            <div className="flex items-start gap-3 mb-5">
              <AnonymousAvatar size="lg" />
              <div className="min-w-0 flex-1">
                <p className="text-[15px] text-[#111827] font-semibold leading-snug mb-1">{candidate.title}</p>
                <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md border ${matchColor}`}>
                  {candidate.matchScore}% match
                </span>
              </div>
            </div>

            {/* Key info rows */}
            <div className="space-y-2 text-[12.5px] mb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <span className="font-medium text-[#111827] leading-snug">{candidate.company}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Clock className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                <span>{candidate.exp} ประสบการณ์</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                <span>{candidate.location}</span>
              </div>
              <div className="flex items-start gap-2 text-gray-500">
                <GraduationCap className="w-3.5 h-3.5 text-gray-300 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{candidate.education}</span>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                <Banknote className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <span className="font-semibold text-[#111827] text-[13px]">{candidate.salary}</span>
              </div>
            </div>

            {candidate.skills && candidate.skills.length > 0 && (
              <div className="pt-3 border-t border-gray-100">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Matched Skills</p>
                <div className="flex flex-wrap gap-1">
                  {candidate.skills.map((s) => (
                    <span key={s} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {candidate.competencies && candidate.competencies.length > 0 && (
              <div className="pt-3 mt-3 border-t border-gray-100">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Core Competencies</p>
                <div className="flex flex-wrap gap-1">
                  {candidate.competencies.map((c) => (
                    <span key={c} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-teal-50 text-teal-700">{c}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — Status + Why + Character + CTAs */}
          <div className="flex-1 min-w-0 flex flex-col">
            {/* Tab-specific status badges */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {tabType === "read" && candidate.readAt && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-[11px] font-semibold text-blue-600">
                  <Eye className="w-3 h-3" />
                  เปิดดูแล้ว {candidate.readAt}
                </div>
              )}
              {tabType === "liked" && candidate.likedAt && (
                <>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-100 text-[11px] font-semibold text-rose-600">
                    <Heart className="w-3 h-3 fill-rose-500" />
                    สนใจเมื่อ {candidate.likedAt}
                  </div>
                  {messageSent && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[11px] font-semibold text-emerald-600">
                      <CheckCircle2 className="w-3 h-3" />
                      ส่งข้อความแล้ว
                    </div>
                  )}
                </>
              )}
              {tabType === "snoozed" && candidate.snoozedAt && (
                <>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 border border-gray-200 text-[11px] font-semibold text-gray-500">
                    <Clock className="w-3 h-3" />
                    ไว้ก่อนเมื่อ {candidate.snoozedAt}
                  </div>
                  {candidate.snoozeReason && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-100 text-[11px] text-amber-700">
                      {candidate.snoozeReason}
                    </div>
                  )}
                </>
              )}
            </div>

            {tabType === "liked" && candidate.sentMessage && (
              <div className="mb-3 p-3 bg-[#F0F8FF] border border-[#0DC2FF]/20 rounded-xl">
                <p className="text-[10.5px] font-bold text-[#127EE3] mb-1 flex items-center gap-1">
                  <Send className="w-2.5 h-2.5" />
                  ข้อความที่ส่งไป
                </p>
                <p className="text-[12px] text-gray-600 leading-relaxed italic line-clamp-2">"{candidate.sentMessage}"</p>
              </div>
            )}

            {/* Why label */}
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Why This Candidate Stands Out</p>

            {/* Why insights */}
            <ul className="space-y-2.5 mb-5">
              {candidate.highlights.map((h, i) => (
                <li key={i} className="flex gap-3 text-[13px] text-gray-700 leading-[1.65]">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 text-gray-400 text-[10px] font-bold flex items-center justify-center mt-[1px]">{i + 1}</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            {candidate.hobbies && candidate.strengths && (
              <CharacterSection hobbies={candidate.hobbies} strengths={candidate.strengths} hobbyDescription={candidate.hobbyDescription} strengthDescription={candidate.strengthDescription} />
            )}

            {candidate.deepAnalysis && candidate.deepAnalysis.length > 0 && (
              <div className="mb-4 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1.5 mb-2">
                  <Brain className="w-3 h-3 text-gray-400" />
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Behavioral Signals</span>
                  <span className="text-[10px] text-gray-300 ml-1">· AI</span>
                </div>
                <ul className="space-y-1.5">
                  {candidate.deepAnalysis.map((item, i) => (
                    <li key={i} className="flex gap-2.5 text-[12px] leading-relaxed text-gray-500">
                      <span className="flex-shrink-0 w-1 h-1 rounded-full bg-gray-300 mt-[7px]" />
                      <span><span className="font-medium text-gray-700">{item.label}</span> — {item.detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTAs */}
            <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-100 flex-wrap">
              <button
                onClick={() => setResumeOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold bg-gradient-to-r from-[#01BFF9] to-[#019EFC] text-white hover:opacity-90 transition-opacity"
              >
                <FileText className="w-3.5 h-3.5" />
                ดูเรซูเม่
              </button>

              {tabType === "read" && (
                <>
                  <button
                    onClick={() => setMessageOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium border border-gray-300 text-gray-600 hover:border-[#019EFC] hover:text-[#019EFC] transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    ส่งข้อความสนใจ
                  </button>
                  <button
                    onClick={() => { setLikedBack(true); setMoved(true); }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-medium border border-gray-200 text-gray-500 hover:border-rose-200 hover:text-rose-600 transition-all"
                  >
                    <Heart className="w-3.5 h-3.5" />
                    สนใจ
                  </button>
                  <button
                    onClick={() => setMoved(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12.5px] text-gray-400 hover:text-gray-600 transition-all ml-auto"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    ไว้ก่อน
                  </button>
                </>
              )}

              {tabType === "liked" && (
                <>
                  {!messageSent ? (
                    <button
                      onClick={() => setMessageOpen(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium border border-gray-300 text-gray-600 hover:border-[#019EFC] hover:text-[#019EFC] transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      ส่งข้อความสนใจ
                    </button>
                  ) : (
                    <button
                      onClick={() => setMessageOpen(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium border border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      ส่งแล้ว · ส่งอีกครั้ง
                    </button>
                  )}
                  <button
                    onClick={() => setMoved(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-medium border border-gray-200 text-gray-500 hover:border-gray-300 transition-all"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    นัด Interview
                  </button>
                  <button
                    onClick={() => setMoved(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12.5px] text-gray-400 hover:text-red-400 transition-all ml-auto"
                  >
                    <X className="w-3.5 h-3.5" />
                    ถอน
                  </button>
                </>
              )}

              {tabType === "snoozed" && (
                <>
                  <button
                    onClick={() => setMoved(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium border border-gray-300 text-gray-600 hover:border-[#019EFC] hover:text-[#019EFC] transition-all"
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                    นำกลับมาพิจารณา
                  </button>
                  <button
                    onClick={() => setMessageOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium border border-gray-200 text-gray-500 hover:border-gray-300 transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    ส่งข้อความสนใจ
                  </button>
                  <button
                    onClick={() => setMoved(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12.5px] text-gray-400 hover:text-red-400 transition-all ml-auto"
                  >
                    <X className="w-3.5 h-3.5" />
                    ลบออก
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {resumeOpen && <ResumePanel onClose={() => setResumeOpen(false)} />}
      {messageOpen && (
        <MessageModal
          candidateTitle={candidate.title}
          candidateCompany={candidate.company}
          candidateExp={candidate.exp}
          onClose={() => {
            setMessageOpen(false);
            setMessageSent(true);
          }}
        />
      )}
    </>
  );
}

function ReadTab() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5 px-1">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-500" />
          <span className="text-[14px] font-bold text-[#1A1A2E]">อ่านแล้ว</span>
          <span className="text-[12px] text-gray-400 font-normal ml-1">— โปรไฟล์ที่คุณเปิดดูแล้วแต่ยังไม่ได้ตัดสินใจ</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11.5px] text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
          <RefreshCw className="w-3 h-3" />
          {readCandidates.length} รายการ
        </div>
      </div>

      <div className="mb-4 p-3.5 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-2.5">
        <BookOpen className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-[12.5px] text-blue-700 leading-relaxed">
          โปรไฟล์เหล่านี้คุณเปิดดูแล้ว ถ้าสนใจสามารถ <strong>กดสนใจ</strong> หรือ <strong>ส่งข้อความ</strong> ได้เลย ก่อนที่คนอื่นจะติดต่อไปก่อน
        </p>
      </div>

      <div className="space-y-3">
        {readCandidates.map((c) => (
          <StatusCandidateCard key={c.id} candidate={c} tabType="read" />
        ))}
      </div>
    </div>
  );
}

function ShortlistedTab() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5 px-1">
        <div className="flex items-center gap-2">
          <BookmarkPlus className="w-4 h-4 text-amber-500" />
          <span className="text-[14px] font-bold text-[#1A1A2E]">ชอร์ตลิสต์</span>
          <span className="text-[12px] text-gray-400 font-normal ml-1">— คนที่คุณสนใจและบันทึกไว้แล้ว</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11.5px] text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
          <BookmarkPlus className="w-3 h-3" />
          {likedCandidates.length} รายการ
        </div>
      </div>

      <div className="mb-4 p-3.5 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-2.5">
        <Send className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-[12.5px] text-amber-700 leading-relaxed">
          คนเหล่านี้คุณบันทึกไว้แล้ว — ถ้าพร้อมแล้วลองกด <strong>ส่งข้อความสนใจ</strong> เพื่อเปิดบทสนทนาก่อนที่คู่แข่งจะติดต่อไปก่อน
        </p>
      </div>

      <div className="space-y-3">
        {likedCandidates.map((c) => (
          <StatusCandidateCard key={c.id} candidate={c} tabType="liked" />
        ))}
      </div>
    </div>
  );
}

function LikedTab() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5 px-1">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-400" />
          <span className="text-[14px] font-bold text-[#1A1A2E]">สนใจแล้ว</span>
          <span className="text-[12px] text-gray-400 font-normal ml-1">— คนที่คุณส่งข้อความสนใจไปแล้ว</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11.5px] text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
          <Heart className="w-3 h-3" />
          {likedCandidates.length} รายการ
        </div>
      </div>

      <div className="mb-4 p-3.5 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2.5">
        <CheckCircle2 className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
        <p className="text-[12.5px] text-rose-700 leading-relaxed">
          คุณส่งข้อความสนใจไปแล้ว — รอการตอบกลับ หรือ <strong>นัด Interview</strong> ได้เลยถ้าพร้อม
        </p>
      </div>

      <div className="space-y-3">
        {likedCandidates.map((c) => (
          <StatusCandidateCard key={c.id} candidate={c} tabType="liked" />
        ))}
      </div>
    </div>
  );
}

function SnoozedTab() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5 px-1">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-[14px] font-bold text-[#1A1A2E]">ยังไม่สนใจ</span>
          <span className="text-[12px] text-gray-400 font-normal ml-1">— AI เรียนรู้เหตุผลเพื่อแนะนำดีขึ้น</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11.5px] text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
          <Clock className="w-3 h-3" />
          {snoozedCandidates.length} รายการ
        </div>
      </div>

      <div className="mb-4 p-3.5 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-2.5">
        <Brain className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-[12.5px] text-amber-700 leading-relaxed">
          AI บันทึกเหตุผลไว้แล้ว และจะนำเสนอโปรไฟล์ที่ตรงกว่าในครั้งหน้า ถ้าต้องการนำใครกลับมาพิจารณาก็สามารถทำได้ตลอดเวลา
        </p>
      </div>

      <div className="space-y-3">
        {snoozedCandidates.map((c) => (
          <StatusCandidateCard key={c.id} candidate={c} tabType="snoozed" />
        ))}
      </div>
    </div>
  );
}
