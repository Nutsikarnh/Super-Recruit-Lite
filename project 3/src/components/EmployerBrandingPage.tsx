import { useState } from "react";
import EmployerBrandingReviewsPage from "./EmployerBrandingReviewsPage";
import { Star, Heart, TrendingUp, TrendingDown, Award, Users, Sparkles, Camera, CreditCard as Edit3, MessageSquare, ThumbsUp, ArrowUpRight, CheckCircle2, Clock, Zap, Building2, Globe, ChevronRight, ChevronLeft, Plus, Eye, BarChart2, Trophy, Smile, Sun, Target, Image, Bookmark, Share2, AlertCircle, PenLine, BadgeCheck, ArrowRight, Copy, Check, Download, Code2, Linkedin, Facebook, Twitter, Instagram, X, ExternalLink, Mail } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type BrandPillar = "ชีวิตดี" | "งานดี" | "เงินดี" | "สังคมดี";

type SubItemValue = number | string;

interface PillarDetail {
  score: number;
  items: { label: string; value: SubItemValue; isText?: boolean }[];
}

interface YouSayReview {
  id: string;
  role: string;
  tenure: string;
  isFormer: boolean;
  quote: string;
  overallScore: number;
  details: Record<BrandPillar, PillarDetail>;
  date: string;
  helpful: number;
}

interface CandidateImpression {
  id: string;
  name: string;
  role: string;
  avatar: string;
  text: string;
  appliedAfter: boolean;
  date: string;
  sentiment: "positive" | "very_positive";
}

interface Office24Post {
  id: string;
  author: string;
  role: string;
  avatar: string;
  pillar: BrandPillar;
  caption: string;
  imageUrl: string;
  likes: number;
  comments: number;
  date: string;
  isNew?: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const YOU_SAY_REVIEWS: YouSayReview[] = [
  {
    id: "r1", role: "Software Engineer", tenure: "3 ปี", isFormer: false,
    quote: "มีความท้าทายและเติบโตได้จริง",
    overallScore: 4.5,
    date: "2 วันที่แล้ว", helpful: 24,
    details: {
      "ชีวิตดี": {
        score: 4,
        items: [
          { label: "การลาพักร้อน", value: "อนุมัติได้ปกติ", isText: true },
          { label: "สนับสนุนคุณภาพชีวิตพนักงาน", value: 4 },
          { label: "ส่งเสริมวิสัยทัศน์ รสนิยม", value: 4 },
          { label: "ชั่วโมงทำงานต่อวัน", value: "8 ชั่วโมง", isText: true },
        ],
      },
      "งานดี": {
        score: 5,
        items: [
          { label: "ความท้าทาย", value: 5 },
          { label: "โอกาสสร้างผลงาน", value: 5 },
          { label: "ส่งเสริมความเป็นมืออาชีพ", value: 4 },
          { label: "ระบบบริหารจัดการทันสมัย", value: 4 },
        ],
      },
      "เงินดี": {
        score: 4,
        items: [
          { label: "การขึ้นเงินเดือน", value: "ขึ้นตามผลงาน", isText: true },
          { label: "โบนัสต่อปี", value: "มีโบนัส", isText: true },
          { label: "พอใจสวัสดิการ", value: 4 },
          { label: "ระดับรายได้", value: "กลุ่มที่จ่ายสูง", isText: true },
        ],
      },
      "สังคมดี": {
        score: 5,
        items: [
          { label: "สังคมดีในบริษัท", value: 5 },
          { label: "การเมือง", value: "น้อยมาก", isText: true },
          { label: "ความช่วยเหลือจากเพื่อนร่วมงาน", value: 5 },
          { label: "การสอนงานและดูแลของหัวหน้า", value: 4 },
        ],
      },
    },
  },
  {
    id: "r2", role: "Product Designer", tenure: "1.5 ปี", isFormer: false,
    quote: "Work-life balance ดีมากจริงๆ ทีมเคารพเวลาส่วนตัว",
    overallScore: 4.5,
    date: "5 วันที่แล้ว", helpful: 18,
    details: {
      "ชีวิตดี": {
        score: 5,
        items: [
          { label: "การลาพักร้อน", value: "อนุมัติง่าย", isText: true },
          { label: "สนับสนุนคุณภาพชีวิตพนักงาน", value: 5 },
          { label: "ส่งเสริมวิสัยทัศน์ รสนิยม", value: 4 },
          { label: "ชั่วโมงทำงานต่อวัน", value: "7-8 ชั่วโมง", isText: true },
        ],
      },
      "งานดี": {
        score: 4,
        items: [
          { label: "ความท้าทาย", value: 4 },
          { label: "โอกาสสร้างผลงาน", value: 5 },
          { label: "ส่งเสริมความเป็นมืออาชีพ", value: 4 },
          { label: "ระบบบริหารจัดการทันสมัย", value: 4 },
        ],
      },
      "เงินดี": {
        score: 4,
        items: [
          { label: "การขึ้นเงินเดือน", value: "ขึ้นทุกปี", isText: true },
          { label: "โบนัสต่อปี", value: "มีโบนัส", isText: true },
          { label: "พอใจสวัสดิการ", value: 4 },
          { label: "ระดับรายได้", value: "กลุ่มที่จ่ายค่อนข้างสูง", isText: true },
        ],
      },
      "สังคมดี": {
        score: 5,
        items: [
          { label: "สังคมดีในบริษัท", value: 5 },
          { label: "การเมือง", value: "น้อย", isText: true },
          { label: "ความช่วยเหลือจากเพื่อนร่วมงาน", value: 5 },
          { label: "การสอนงานและดูแลของหัวหน้า", value: 4 },
        ],
      },
    },
  },
  {
    id: "r3", role: "Data Analyst", tenure: "2 ปี", isFormer: false,
    quote: "เงินเดือน competitive มี bonus ชัดเจน",
    overallScore: 4.2,
    date: "1 สัปดาห์ที่แล้ว", helpful: 31,
    details: {
      "ชีวิตดี": {
        score: 4,
        items: [
          { label: "การลาพักร้อน", value: "อนุมัติปานกลาง", isText: true },
          { label: "สนับสนุนคุณภาพชีวิตพนักงาน", value: 4 },
          { label: "ส่งเสริมวิสัยทัศน์ รสนิยม", value: 3 },
          { label: "ชั่วโมงทำงานต่อวัน", value: "8-9 ชั่วโมง", isText: true },
        ],
      },
      "งานดี": {
        score: 4,
        items: [
          { label: "ความท้าทาย", value: 4 },
          { label: "โอกาสสร้างผลงาน", value: 4 },
          { label: "ส่งเสริมความเป็นมืออาชีพ", value: 4 },
          { label: "ระบบบริหารจัดการทันสมัย", value: 4 },
        ],
      },
      "เงินดี": {
        score: 5,
        items: [
          { label: "การขึ้นเงินเดือน", value: "ขึ้นทุก 6 เดือน", isText: true },
          { label: "โบนัสต่อปี", value: "มีโบนัสดี", isText: true },
          { label: "พอใจสวัสดิการ", value: 5 },
          { label: "ระดับรายได้", value: "กลุ่มบริษัทที่จ่ายสูง", isText: true },
        ],
      },
      "สังคมดี": {
        score: 4,
        items: [
          { label: "สังคมดีในบริษัท", value: 4 },
          { label: "การเมือง", value: "น้อย", isText: true },
          { label: "ความช่วยเหลือจากเพื่อนร่วมงาน", value: 4 },
          { label: "การสอนงานและดูแลของหัวหน้า", value: 4 },
        ],
      },
    },
  },
  {
    id: "r4", role: "Marketing Lead", tenure: "4 ปี", isFormer: false,
    quote: "ทีมเป็นมิตร ไม่มีการเมืองออฟฟิศ",
    overallScore: 4.5,
    date: "2 สัปดาห์ที่แล้ว", helpful: 42,
    details: {
      "ชีวิตดี": {
        score: 5,
        items: [
          { label: "การลาพักร้อน", value: "อนุมัติง่าย", isText: true },
          { label: "สนับสนุนคุณภาพชีวิตพนักงาน", value: 5 },
          { label: "ส่งเสริมวิสัยทัศน์ รสนิยม", value: 4 },
          { label: "ชั่วโมงทำงานต่อวัน", value: "8 ชั่วโมง", isText: true },
        ],
      },
      "งานดี": {
        score: 4,
        items: [
          { label: "ความท้าทาย", value: 4 },
          { label: "โอกาสสร้างผลงาน", value: 4 },
          { label: "ส่งเสริมความเป็นมืออาชีพ", value: 4 },
          { label: "ระบบบริหารจัดการทันสมัย", value: 4 },
        ],
      },
      "เงินดี": {
        score: 4,
        items: [
          { label: "การขึ้นเงินเดือน", value: "ขึ้นตามผลงาน", isText: true },
          { label: "โบนัสต่อปี", value: "มีโบนัส", isText: true },
          { label: "พอใจสวัสดิการ", value: 4 },
          { label: "ระดับรายได้", value: "กลุ่มที่จ่ายค่อนข้างสูง", isText: true },
        ],
      },
      "สังคมดี": {
        score: 5,
        items: [
          { label: "สังคมดีในบริษัท", value: 5 },
          { label: "การเมือง", value: "น้อยมาก", isText: true },
          { label: "ความช่วยเหลือจากเพื่อนร่วมงาน", value: 5 },
          { label: "การสอนงานและดูแลของหัวหน้า", value: 5 },
        ],
      },
    },
  },
  {
    id: "r5", role: "Backend Engineer", tenure: "<1 ปี", isFormer: true,
    quote: "Stack ทันสมัย ทีม engineering เก่ง",
    overallScore: 4.0,
    date: "3 สัปดาห์ที่แล้ว", helpful: 15,
    details: {
      "ชีวิตดี": {
        score: 4,
        items: [
          { label: "การลาพักร้อน", value: "อนุมัติปานกลาง", isText: true },
          { label: "สนับสนุนคุณภาพชีวิตพนักงาน", value: 4 },
          { label: "ส่งเสริมวิสัยทัศน์ รสนิยม", value: 3 },
          { label: "ชั่วโมงทำงานต่อวัน", value: "8 ชั่วโมง", isText: true },
        ],
      },
      "งานดี": {
        score: 5,
        items: [
          { label: "ความท้าทาย", value: 5 },
          { label: "โอกาสสร้างผลงาน", value: 5 },
          { label: "ส่งเสริมความเป็นมืออาชีพ", value: 4 },
          { label: "ระบบบริหารจัดการทันสมัย", value: 5 },
        ],
      },
      "เงินดี": {
        score: 3,
        items: [
          { label: "การขึ้นเงินเดือน", value: "ไม่ได้รับการขึ้นเงินเดือน", isText: true },
          { label: "โบนัสต่อปี", value: "ไม่มีโบนัส", isText: true },
          { label: "พอใจสวัสดิการ", value: 3 },
          { label: "ระดับรายได้", value: "กลุ่มบริษัทที่จ่ายเงินเดือนค่อนข้างสูง", isText: true },
        ],
      },
      "สังคมดี": {
        score: 4,
        items: [
          { label: "สังคมดีในบริษัท", value: 4 },
          { label: "การเมือง", value: "ปานกลาง", isText: true },
          { label: "ความช่วยเหลือจากเพื่อนร่วมงาน", value: 4 },
          { label: "การสอนงานและดูแลของหัวหน้า", value: 3 },
        ],
      },
    },
  },
];

const CANDIDATE_IMPRESSIONS: CandidateImpression[] = [
  { id: "c1", name: "อนุชา พรหมเทพ", role: "Senior Full Stack Developer", avatar: "อพ", text: "อ่าน HR SAY แล้วรู้สึกว่า HR ที่นี่ honest จริงๆ เขียนทั้งจุดเด่นและความท้าทาย ไม่ได้ขายฝัน ทำให้อยากเข้าร่วมมากขึ้น เพราะรู้สึกว่าองค์กรนี้ตรงไปตรงมา", appliedAfter: true, date: "เมื่อวาน", sentiment: "very_positive" },
  { id: "c2", name: "ชนิดา วงษ์สวรรค์", role: "UX Researcher", avatar: "ชว", text: "ประทับใจที่ HR SAY เล่าถึงวัฒนธรรมองค์กรได้ชัดเจนมาก ไม่ใช่แค่ benefit list แต่เห็นภาพว่าทำงานที่นี่จะเป็นยังไง ทำให้ตัดสินใจสมัครได้ง่ายขึ้น", appliedAfter: true, date: "3 วันที่แล้ว", sentiment: "very_positive" },
  { id: "c3", name: "ปรัชญา สิทธิโชค", role: "DevOps Engineer", avatar: "ปส", text: "อ่านรีวิวจากพนักงานปัจจุบันแล้วรู้สึกว่า match กับสิ่งที่ตามหามาก โดยเฉพาะเรื่อง work-life balance และ ownership งาน อยากลองมาคุยดู", appliedAfter: false, date: "5 วันที่แล้ว", sentiment: "positive" },
  { id: "c4", name: "วิมลรัตน์ โชติกา", role: "Product Manager", avatar: "วโ", text: "HR SAY ของที่นี่โดดเด่นมากในบรรดาที่ฉันอ่านมา บอกเล่า mission ของทีมได้ inspiring และยังตอบโจทย์ว่าคนที่จะ fit กับที่นี่เป็นแบบไหน ทำให้รู้ว่าตัวเองใช่หรือเปล่า", appliedAfter: true, date: "1 สัปดาห์ที่แล้ว", sentiment: "very_positive" },
  { id: "c5", name: "ธนกร ศิริมงคล", role: "Backend Engineer", avatar: "ธศ", text: "ชอบที่ HR SAY พูดถึง tech stack และ engineering culture ตรงๆ ทำให้ประเมินได้เลยว่า match กับทักษะที่มีไหม ไม่ต้องรอถึงรอบสัมภาษณ์", appliedAfter: false, date: "1 สัปดาห์ที่แล้ว", sentiment: "positive" },
  { id: "c6", name: "พิมพ์ใจ ลาภวิบูลย์", role: "Marketing Specialist", avatar: "พล", text: "รีวิวของพนักงานที่นี่พูดถึงเรื่อง growth โดยเฉพาะ ทำให้รู้ว่ามีโอกาสเติบโตจริงๆ ไม่ใช่แค่คำสัญญา ตัดสินใจสมัครได้เลย", appliedAfter: true, date: "2 สัปดาห์ที่แล้ว", sentiment: "very_positive" },
  { id: "c7", name: "กิตติศักดิ์ ทองดี", role: "Data Engineer", avatar: "กท", text: "สิ่งที่ประทับใจคือ HR SAY ไม่ได้ดูเหมือน copy-paste จากบริษัทอื่น มีเอกลักษณ์ชัดเจน รู้สึกว่าองค์กรนี้รู้ว่าตัวเองเป็นใคร", appliedAfter: false, date: "2 สัปดาห์ที่แล้ว", sentiment: "positive" },
  { id: "c8", name: "สุภาพร เจริญสุข", role: "QA Engineer", avatar: "สจ", text: "อ่านรีวิวแล้วรู้สึกว่าบริษัทนี้ให้ความสำคัญกับ quality จริงๆ ทั้ง product และ process ตรงกับสิ่งที่มองหามาตลอด", appliedAfter: true, date: "2 สัปดาห์ที่แล้ว", sentiment: "very_positive" },
  { id: "c9", name: "นภัสสร ประเสริฐ", role: "UI/UX Designer", avatar: "นป", text: "HR SAY เล่าเรื่อง design process ได้น่าสนใจมาก เห็นว่า designer มี voice ใน product team จริงๆ ไม่ใช่แค่ pixel pusher", appliedAfter: false, date: "3 สัปดาห์ที่แล้ว", sentiment: "positive" },
  { id: "c10", name: "ณรงค์ฤทธิ์ แก้วประดิษฐ์", role: "Cloud Architect", avatar: "ณก", text: "ดูจาก HR SAY แล้วรู้ว่าบริษัทนี้ลงทุนกับ infrastructure จริงจัง ไม่ใช่แค่พูดเรื่อง cloud transformation แต่ทำจริง", appliedAfter: true, date: "3 สัปดาห์ที่แล้ว", sentiment: "very_positive" },
  { id: "c11", name: "เบญจมาศ วิริยะ", role: "Scrum Master", avatar: "บว", text: "อ่านรีวิวแล้วรู้ว่าทีมที่นี่ใช้ agile จริงๆ ไม่ใช่แค่ตามกระแส วัฒนธรรมการทำงานดูโปร่งใสและ collaborative มาก", appliedAfter: false, date: "3 สัปดาห์ที่แล้ว", sentiment: "positive" },
  { id: "c12", name: "วรวิทย์ ชัยภูมิ", role: "Mobile Developer", avatar: "วช", text: "HR SAY บอกชัดเรื่อง tech decision making process ทำให้รู้ว่า developer ที่นี่มีส่วนร่วมใน roadmap จริง อยากเป็นส่วนหนึ่งของทีมนี้", appliedAfter: true, date: "1 เดือนที่แล้ว", sentiment: "very_positive" },
  { id: "c13", name: "จิดาภา รุ่งเรือง", role: "Business Analyst", avatar: "จร", text: "ชอบที่ HR SAY พูดถึงความสัมพันธ์ระหว่าง business และ tech team ได้ชัดเจน รู้ว่า BA ที่นี่ทำงานใกล้ชิดกับ developer จริงๆ", appliedAfter: false, date: "1 เดือนที่แล้ว", sentiment: "positive" },
  { id: "c14", name: "สมพงษ์ ดวงแก้ว", role: "Security Engineer", avatar: "สด", text: "รีวิวพนักงานพูดถึงเรื่อง security culture ที่แข็งแกร่ง ทีม security ที่นี่ดูมีบทบาทสำคัญและไม่ถูกมองข้าม ตรงกับที่มองหา", appliedAfter: true, date: "1 เดือนที่แล้ว", sentiment: "very_positive" },
  { id: "c15", name: "ปวีณา หลวงพิทักษ์", role: "HR Specialist", avatar: "ปห", text: "อ่าน HR SAY แล้วเห็นว่า HR ที่นี่ทำงานเชิงรุก ไม่ได้แค่ admin งาน แต่เป็น business partner จริงๆ อยากมาเรียนรู้กับทีมนี้", appliedAfter: false, date: "1 เดือนที่แล้ว", sentiment: "positive" },
  { id: "c16", name: "ชาญวิทย์ สุขสมบูรณ์", role: "Platform Engineer", avatar: "ชส", text: "ดู HR SAY แล้วรู้ว่าบริษัทนี้ให้ความสำคัญกับ developer experience มาก มี internal tooling และ automation ที่ดี ทำให้อยากทำงานที่นี่", appliedAfter: true, date: "5 สัปดาห์ที่แล้ว", sentiment: "very_positive" },
  { id: "c17", name: "อัจฉรา พิมพ์สุวรรณ", role: "Content Strategist", avatar: "อพ", text: "HR SAY อธิบาย brand voice และ content strategy ได้ชัดเจนมาก รู้ว่าทีม content ที่นี่มีทิศทางที่แน่นอน ไม่ใช่แค่สร้าง content ตาม request", appliedAfter: false, date: "5 สัปดาห์ที่แล้ว", sentiment: "positive" },
  { id: "c18", name: "ไพโรจน์ อินทร์สุข", role: "ML Engineer", avatar: "ไอ", text: "รีวิวพนักงานพูดถึง AI projects ที่น่าสนใจมาก และ culture ที่สนับสนุนการทดลองสิ่งใหม่ๆ ทำให้รู้ว่าที่นี่เป็นที่ที่จะได้เติบโตในสายนี้จริงๆ", appliedAfter: true, date: "6 สัปดาห์ที่แล้ว", sentiment: "very_positive" },
  { id: "c19", name: "ศิริพร ตันติกุล", role: "Finance Analyst", avatar: "ศต", text: "อ่าน HR SAY แล้วเห็นว่าบริษัทนี้โปร่งใสเรื่องการเงินองค์กรและ compensation philosophy มาก ทำให้รู้สึกไว้วางใจและอยากมาร่วมงาน", appliedAfter: false, date: "6 สัปดาห์ที่แล้ว", sentiment: "positive" },
  { id: "c20", name: "ทวีศักดิ์ บุญประเสริฐ", role: "Engineering Manager", avatar: "ทบ", text: "HR SAY พูดถึงวิธีที่ engineering manager ที่นี่ทำงานและ lead ทีมได้ชัดเจนมาก ทำให้รู้ว่า management style ที่นี่ตรงกับที่เชื่อและปฏิบัติ", appliedAfter: true, date: "7 สัปดาห์ที่แล้ว", sentiment: "very_positive" },
];

const OFFICE24_POSTS: Office24Post[] = [
  {
    id: "p1", author: "มินตรา ศรีสุวรรณ", role: "Marketing Manager",
    avatar: "มศ", pillar: "ชีวิตดี",
    caption: "วันนี้ work from beach day ใน Samui 🌊 ขอบคุณ flexible remote policy ที่ทำให้ชีวิตมีสีสัน งานก็ดี ชีวิตก็ดี",
    imageUrl: "https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=600",
    likes: 87, comments: 12, date: "วันนี้", isNew: true,
  },
  {
    id: "p2", author: "ณัฐวุฒิ กาญจนา", role: "Engineering Lead",
    avatar: "ณก", pillar: "งานดี",
    caption: "Hackathon ภายใน 48 ชั่วโมงเพิ่งจบ ทีมเราสร้าง feature ที่ user รอมาตลอด ภูมิใจมากที่ได้ทำงานกับคนเก่งๆ",
    imageUrl: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=600",
    likes: 124, comments: 18, date: "เมื่อวาน", isNew: true,
  },
  {
    id: "p3", author: "อรนุช ทวีสุข", role: "HR Business Partner",
    avatar: "อท", pillar: "สังคมดี",
    caption: "Company volunteer day ปีนี้ไปช่วยสอนเด็กๆ โรงเรียนในชนบท ความสุขแบบนี้ไม่มีขาย ทีม HR ร่วมทริปนี้กันทั้งหมด",
    imageUrl: "https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=600",
    likes: 201, comments: 34, date: "3 วันที่แล้ว",
  },
  {
    id: "p4", author: "ภูวนัย รัตนพันธุ์", role: "Senior Designer",
    avatar: "ภร", pillar: "เงินดี",
    caption: "ปีนี้ได้ stock vesting ครั้งแรก เอาไปซื้อรถคันใหม่ได้เลย ขอบคุณที่ให้โอกาสเติบโตไปด้วยกัน",
    imageUrl: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600",
    likes: 156, comments: 22, date: "5 วันที่แล้ว",
  },
  {
    id: "p5", author: "สิริมา เตชะวงค์", role: "Data Scientist",
    avatar: "สต", pillar: "ชีวิตดี",
    caption: "Company gym + yoga class ทุกวันพุธ ตอนนี้ fit กว่าตอนนักศึกษาอีก สุขภาพดีทำงานได้ดีขึ้นจริงๆ",
    imageUrl: "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=600",
    likes: 93, comments: 8, date: "1 สัปดาห์ที่แล้ว",
  },
  {
    id: "p6", author: "กิตติศักดิ์ สมบูรณ์", role: "Product Manager",
    avatar: "กส", pillar: "งานดี",
    caption: "Feature ที่ทีมเราทำเพิ่งไปถึง 1M users แรก เป็น milestone ที่ทุกคนในทีมช่วยกันสร้าง ภูมิใจมากกว่าสิ่งใดๆ",
    imageUrl: "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=600",
    likes: 312, comments: 45, date: "1 สัปดาห์ที่แล้ว",
  },
];

const PILLAR_CONFIG: Record<BrandPillar, { icon: React.ReactNode; color: string; bg: string; border: string; dot: string; desc: string }> = {
  "ชีวิตดี": {
    icon: <Sun className="w-4 h-4" />, color: "text-rose-600", bg: "bg-rose-50",
    border: "border-rose-200", dot: "bg-rose-400", desc: "Work-life balance · สุขภาพ · ความยืดหยุ่น",
  },
  "งานดี": {
    icon: <Zap className="w-4 h-4" />, color: "text-[#127EE3]", bg: "bg-[#F0F8FF]",
    border: "border-[#0DC2FF]/30", dot: "bg-[#0DC2FF]", desc: "Growth · ความท้าทาย · Impact",
  },
  "เงินดี": {
    icon: <TrendingUp className="w-4 h-4" />, color: "text-emerald-700", bg: "bg-emerald-50",
    border: "border-emerald-200", dot: "bg-emerald-500", desc: "เงินเดือน · Bonus · Benefits",
  },
  "สังคมดี": {
    icon: <Heart className="w-4 h-4" />, color: "text-amber-600", bg: "bg-amber-50",
    border: "border-amber-200", dot: "bg-amber-400", desc: "ทีม · Culture · Community",
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`w-3.5 h-3.5 ${s <= value ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
      ))}
    </div>
  );
}

function AvatarBubble({ initials, size = "sm", color = "bg-[#127EE3]/10 text-[#127EE3]" }: { initials: string; size?: "sm" | "md" | "lg"; color?: string }) {
  const sz = size === "lg" ? "w-12 h-12 text-[14px]" : size === "md" ? "w-9 h-9 text-[12px]" : "w-7 h-7 text-[10px]";
  return (
    <div className={`${sz} rounded-xl flex items-center justify-center font-bold flex-shrink-0 ${color}`}>
      {initials}
    </div>
  );
}

function PillarBadge({ pillar }: { pillar: BrandPillar }) {
  const cfg = PILLAR_CONFIG[pillar];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
      {cfg.icon}
      {pillar}
    </span>
  );
}

function ScoreGauge({ score, max = 5, label, color }: { score: number; max?: number; label: string; color: string }) {
  const pct = Math.round((score / max) * 100);
  const display = Number.isInteger(score) ? score.toString() : score.toFixed(1);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-gray-500 font-medium">{label}</span>
        <span className="text-[13px] font-black text-[#1A1A2E]">{display}<span className="text-[10px] text-gray-400 font-normal">/{max}</span></span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ─── Dream Kit ────────────────────────────────────────────────────────────────

const DREAM_BADGE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="88" viewBox="0 0 200 88">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff0f4"/>
      <stop offset="100%" stop-color="#fff6f9"/>
    </linearGradient>
  </defs>
  <rect width="200" height="88" rx="16" fill="url(#bg)" stroke="#f43f76" stroke-opacity="0.25" stroke-width="2"/>
  <text x="50%" y="22" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="900" fill="#f43f76" letter-spacing="1">Dream Company</text>
  <text x="37" y="52" font-family="sans-serif" font-size="20" fill="#f43f76">❧</text>
  <text x="85" y="52" font-family="sans-serif" font-size="20" fill="#f43f76">❧</text>
  <text x="133" y="52" font-family="sans-serif" font-size="20" fill="#f43f76">❧</text>
  <text x="50%" y="72" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="700" fill="#f43f76" letter-spacing="3" opacity="0.7">Finest 2026</text>
</svg>`;

const EMBED_HTML = `<!-- Dream Company Badge by Super Recruit -->
<a href="https://superrecruit.co.th/dream-company" target="_blank" rel="noopener" style="display:inline-block;">
  <img src="https://superrecruit.co.th/badges/dream-company-2569.svg"
       alt="Dream Company 2569 - Super Recruit"
       width="200" height="88"
       style="border-radius:12px;" />
</a>`;

const POST_TEMPLATES = [
  {
    id: "announce",
    label: "ประกาศรางวัล",
    platform: "all",
    caption: "🏆 เราภูมิใจที่ได้รับตรา Dream Company 2569 จาก Super Recruit!\n\nตรานี้มาจากเสียงของทีมงานจริงๆ — คะแนน Work-life balance, ความเติบโต, และวัฒนธรรมองค์กรที่พวกเขาให้เรา\n\nถ้าคุณอยากเป็นส่วนหนึ่งของทีมที่ดีแบบนี้ → ลิงก์ใน Bio 👇\n\n#DreamCompany #SuperRecruit #TechVibeSolutions #Hiring",
    bg: "from-[#fff0f4] to-[#ffe4ec]",
    accent: "#f43f76",
    size: "1:1",
  },
  {
    id: "culture",
    label: "Culture Highlight",
    platform: "instagram",
    caption: "วัฒนธรรมที่เราสร้างกัน 💙\n\nคะแนน สังคมดี 4.7/5 ไม่ใช่ตัวเลข — มันคือสิ่งที่ทีมงานบอกว่ารู้สึกทุกวัน\n\n\"ที่นี่รู้สึกปลอดภัยที่จะแสดงความคิดเห็น\" — Software Engineer, 3 ปี\n\n#DreamCompany #CompanyCulture #TeamLife",
    bg: "from-[#F0F8FF] to-[#e0efff]",
    accent: "#127EE3",
    size: "1:1",
  },
  {
    id: "linkedin",
    label: "LinkedIn Article",
    platform: "linkedin",
    caption: "ยินดีที่ได้แชร์ข่าวดี — TechVibe Solutions ได้รับรางวัล Dream Company 2569 จาก Super Recruit ซึ่งมาจากการประเมินของพนักงานในด้าน Work-life balance, การเติบโต, สวัสดิการ และวัฒนธรรมองค์กร\n\nเราเชื่อว่าองค์กรที่ดีเริ่มต้นจากการฟังเสียงคนในทีม และนำ feedback มาพัฒนาจริงๆ รางวัลนี้จึงเป็นของทุกคนในทีม\n\nถ้าคุณสนใจร่วมงานกับเรา เปิดรับสมัครหลายตำแหน่งอยู่ครับ\n\n#DreamCompany #EmployerBranding #WeAreHiring",
    bg: "from-[#f0f4ff] to-[#e8eeff]",
    accent: "#0077B5",
    size: "16:9",
  },
  {
    id: "hiring",
    label: "Hiring Announcement",
    platform: "all",
    caption: "🌟 We're Hiring! และเรามาพร้อมตรา Dream Company 2569\n\nอยากทำงานกับทีมที่คนในให้คะแนน Work-life 4.4 · Growth 4.6 · Culture 4.7?\n\nดูตำแหน่งที่เปิดรับ → [ลิงก์]\n\n#WeAreHiring #DreamCompany #JoinUs",
    bg: "from-[#f0fff8] to-[#dcfce7]",
    accent: "#059669",
    size: "1:1",
  },
];

function DreamBadgePreview({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const pad = size === "sm" ? "px-3 py-2" : size === "lg" ? "px-6 py-4" : "px-5 py-3";
  const gap = size === "sm" ? "gap-2"     : size === "lg" ? "gap-4"     : "gap-3";
  return (
    <div className={`inline-flex items-center ${gap} ${pad} rounded-2xl bg-gradient-to-r from-[#fff0f4] to-[#fff6f9] border-2 border-[#f43f76]/20 shadow-sm`}>
      <img src="/Ratings.svg" alt="Dream Company Badge" className={`${size === "sm" ? "h-8" : size === "lg" ? "h-14" : "h-10"} object-contain flex-shrink-0`} />
    </div>
  );
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).catch(()=>{});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy}
      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12.5px] font-bold transition-all ${copied ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-[#F0F8FF] border border-[#0DC2FF]/30 text-[#127EE3] hover:bg-[#E0F0FF]"}`}>
      {copied ? <Check size={13}/> : <Copy size={13}/>}
      {copied ? "คัดลอกแล้ว!" : label}
    </button>
  );
}

function PostCard({ t, selected, onSelect }: { t: typeof POST_TEMPLATES[0]; selected: boolean; onSelect: ()=>void }) {
  const platformIcons: Record<string, React.ReactNode> = {
    linkedin: <Linkedin size={13}/>, instagram: <Instagram size={13}/>, all: <Share2 size={13}/>
  };
  return (
    <button onClick={onSelect}
      className={`text-left w-full rounded-2xl border-2 overflow-hidden transition-all ${selected ? "border-[#127EE3] shadow-md shadow-[#127EE3]/10" : "border-gray-100 hover:border-gray-200"}`}>
      <div className={`bg-gradient-to-br ${t.bg} px-4 pt-4 pb-3 relative`}>
        {selected && <div className="absolute top-2 right-2 w-5 h-5 bg-[#127EE3] rounded-full flex items-center justify-center"><Check size={11} className="text-white"/></div>}
        {/* Mini post preview */}
        <div className="bg-white/80 backdrop-blur rounded-xl p-3 shadow-sm border border-white/60">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-[#0F1724] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[9px] font-bold tracking-tight">HiB</span>
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#1A1A2E] leading-none">TechVibe Solutions</p>
              <p className="text-[10px] text-gray-400">Dream Company 2569</p>
            </div>
          </div>
          <p className="text-[10.5px] text-gray-600 leading-relaxed line-clamp-3">{t.caption}</p>
          <div className="mt-2 pt-2 border-t border-gray-100 flex items-center gap-1.5">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-gradient-to-r from-[#fff0f4] to-[#fff6f9] border border-[#f43f76]/20">
              <span className="text-[9px] font-black text-[#f43f76]">Dream Company</span>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 py-2.5 bg-white flex items-center justify-between">
        <p className="text-[12.5px] font-bold text-[#1A1A2E]">{t.label}</p>
        <span className="flex items-center gap-1 text-[11px] text-gray-400" style={{color: t.accent}}>
          {platformIcons[t.platform]}
          {t.platform === "all" ? "ทุก platform" : t.platform}
        </span>
      </div>
    </button>
  );
}

function DreamKitTab() {
  const [embedTab, setEmbedTab] = useState<"html" | "image">("html");
  const [selectedPost, setSelectedPost] = useState(POST_TEMPLATES[0].id);
  const [badgeSize, setBadgeSize] = useState<"sm"|"md"|"lg">("md");

  const currentPost = POST_TEMPLATES.find(t => t.id === selectedPost)!;

  return (
    <div className="flex flex-col gap-5">

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#fff0f4] via-white to-[#F0F8FF] rounded-2xl border border-[#f43f76]/15 px-7 py-6 flex items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-xl bg-[#f43f76]/10 flex items-center justify-center">
              <Trophy size={15} className="text-[#f43f76]"/>
            </div>
            <span className="text-[11px] font-bold text-[#f43f76] uppercase tracking-widest">Dream Company Kit</span>
          </div>
          <h2 className="text-[22px] font-black text-[#1A1A2E] leading-tight">เอาตรา Dream Company ไปแปะได้เลย</h2>
          <p className="text-[13.5px] text-gray-500 mt-1.5 max-w-xl">นำตราองค์กรไปใช้บนเว็บไซต์ ลิงก์ตำแหน่งงาน หรือแชร์ลง Social เพื่อให้คนรู้ว่าองค์กรคุณผ่านการรับรองจากพนักงานจริง</p>
        </div>
        <DreamBadgePreview size="lg"/>
      </div>

      <div className="grid grid-cols-5 gap-5">

        {/* Left: Badge embed — 3 cols */}
        <div className="col-span-3 flex flex-col gap-4">

          {/* Badge variants */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
              <BadgeCheck size={16} className="text-[#f43f76]"/>
              <h3 className="text-[14px] font-bold text-[#1A1A2E]">Badge สำหรับเว็บไซต์</h3>
            </div>
            <div className="px-6 py-5 space-y-5">

              {/* Size selector */}
              <div>
                <p className="text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-2.5">ขนาด Badge</p>
                <div className="flex gap-2">
                  {([["sm","เล็ก"],["md","กลาง"],["lg","ใหญ่"]] as const).map(([k,l])=>(
                    <button key={k} onClick={()=>setBadgeSize(k)}
                      className={`px-4 py-2 rounded-xl text-[12.5px] font-semibold border transition-all ${badgeSize===k?"bg-[#127EE3] text-white border-[#127EE3]":"bg-white text-gray-500 border-gray-200 hover:border-gray-300"}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div>
                <p className="text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-2.5">ตัวอย่าง</p>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-5 min-h-[100px] flex items-center">
                  <DreamBadgePreview size={badgeSize}/>
                </div>
              </div>

              {/* Light / Dark bg preview */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white border border-gray-100 p-4 flex items-center justify-center">
                  <DreamBadgePreview size="sm"/>
                </div>
                <div className="rounded-xl bg-[#1A1A2E] p-4 flex items-center justify-center">
                  <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/10 border border-white/15">
                    <div className="flex flex-col items-center gap-0.5">
                      <p className="text-[11px] font-black text-white tracking-wide leading-none">Dream Company</p>
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {[0,1,2].map(i=>(
                          <svg key={i} viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                            <path d="M12 12 C12 12 7 9.5 7 6.5 C7 4.5 8.5 3 10.5 3 C11.4 3 12 3.6 12 3.6 C12 3.6 12.6 3 13.5 3 C15.5 3 17 4.5 17 6.5 C17 9.5 12 12 12 12Z M12 12 C12 12 14.5 17 17.5 17 C19.5 17 21 15.5 21 13.5 C21 12.6 20.4 12 20.4 12 C20.4 12 21 11.4 21 10.5 C21 8.5 19.5 7 17.5 7 C14.5 7 12 12 12 12Z M12 12 C12 12 17 14.5 17 17.5 C17 19.5 15.5 21 13.5 21 C12.6 21 12 20.4 12 20.4 C12 20.4 11.4 21 10.5 21 C8.5 21 7 19.5 7 17.5 C7 14.5 12 12 12 12Z M12 12 C12 12 9.5 7 6.5 7 C4.5 7 3 8.5 3 10.5 C3 11.4 3.6 12 3.6 12 C3.6 12 3 12.6 3 13.5 C3 15.5 4.5 17 6.5 17 C9.5 17 12 12 12 12Z"/>
                          </svg>
                        ))}
                      </div>
                      <p className="text-[8px] font-bold text-white/60 tracking-widest uppercase">2569</p>
                    </div>
                    <div className="w-px h-8 bg-white/20"/>
                    <div>
                      <p className="text-[10px] text-white/50 font-medium">Top 8%</p>
                      <p className="text-[12px] font-black text-white">อุตสาหกรรม</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <p className="text-[11.5px] text-gray-400 flex-1">Light background</p>
                <p className="text-[11.5px] text-gray-400 flex-1 text-center">Dark background</p>
              </div>

              {/* Embed tabs */}
              <div>
                <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-xl border border-gray-100 w-fit mb-3">
                  {([["html","HTML Embed"],["image","ดาวน์โหลดรูป"]] as const).map(([k,l])=>(
                    <button key={k} onClick={()=>setEmbedTab(k)}
                      className={`px-4 py-1.5 rounded-lg text-[12.5px] font-semibold transition-all ${embedTab===k?"bg-white text-[#1A1A2E] shadow-sm":"text-gray-400 hover:text-gray-600"}`}>
                      {k==="html" ? <><Code2 size={12} className="inline mr-1.5"/>HTML</> : <><Download size={12} className="inline mr-1.5"/>รูปภาพ</>}
                      <span className="ml-1">{l.split(" ").slice(1).join(" ")}</span>
                    </button>
                  ))}
                </div>

                {embedTab === "html" ? (
                  <div className="space-y-2">
                    <pre className="bg-[#0f1d3a] text-[#0DC2FF] text-[11.5px] rounded-xl p-4 overflow-x-auto leading-relaxed whitespace-pre-wrap font-mono border border-[#127EE3]/20">
{EMBED_HTML}
                    </pre>
                    <div className="flex items-center gap-2">
                      <CopyButton text={EMBED_HTML} label="คัดลอก HTML Code"/>
                      <a href="#" onClick={e=>e.preventDefault()} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12.5px] font-bold bg-gray-50 border border-gray-200 text-gray-600 hover:border-gray-300 transition-all">
                        <ExternalLink size={13}/> ดูตัวอย่างสด
                      </a>
                    </div>
                    <p className="text-[11.5px] text-gray-400">วางโค้ดนี้ในเว็บไซต์ Career Page หรือ Footer ของคุณ badge จะอัปเดตอัตโนมัติทุกปี</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        {label:"PNG 1x", sub:"200×88px", size:"PNG"},
                        {label:"PNG 2x", sub:"400×176px", size:"PNG"},
                        {label:"SVG", sub:"Scalable", size:"SVG"},
                      ].map(f=>(
                        <button key={f.label} className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:border-[#127EE3] hover:bg-[#F0F8FF] transition-all group">
                          <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 group-hover:border-[#127EE3]/40 flex items-center justify-center transition-all">
                            <Image size={18} className="text-gray-400 group-hover:text-[#127EE3] transition-colors"/>
                          </div>
                          <div className="text-center">
                            <p className="text-[12px] font-bold text-[#1A1A2E]">{f.label}</p>
                            <p className="text-[11px] text-gray-400">{f.sub}</p>
                          </div>
                          <span className="flex items-center gap-1 text-[11px] font-bold text-[#127EE3]"><Download size={11}/>ดาวน์โหลด</span>
                        </button>
                      ))}
                    </div>
                    <p className="text-[11.5px] text-gray-400">ใช้ SVG เพื่อความคมชัดสูงสุดบนทุกหน้าจอ</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Usage guidelines */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500"/>
              <h3 className="text-[14px] font-bold text-[#1A1A2E]">แนวทางการใช้ Badge</h3>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  {ok:true, text:"วางใน Career Page / ลิงก์สมัครงาน"},
                  {ok:true, text:"ใช้ใน Email Signature ของ HR"},
                  {ok:true, text:"แชร์ใน Job Posting บน LinkedIn"},
                  {ok:true, text:"ติดใน Pitch Deck / Investor Deck"},
                  {ok:false, text:"แก้ไขสี ข้อความ หรือโลโก้"},
                  {ok:false, text:"ใช้หลังจากปี 2569 โดยไม่ต่ออายุ"},
                ].map((g,i)=>(
                  <div key={i} className="flex items-start gap-2">
                    {g.ok
                      ? <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0 mt-0.5"/>
                      : <X size={14} className="text-red-400 flex-shrink-0 mt-0.5"/>
                    }
                    <p className="text-[12.5px] text-gray-600">{g.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Social post templates — 2 cols */}
        <div className="col-span-2 flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
              <Share2 size={16} className="text-[#127EE3]"/>
              <h3 className="text-[14px] font-bold text-[#1A1A2E]">Social Post Templates</h3>
            </div>
            <div className="px-5 py-4 space-y-3">
              {POST_TEMPLATES.map(t=>(
                <PostCard key={t.id} t={t} selected={selectedPost===t.id} onSelect={()=>setSelectedPost(t.id)}/>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Selected post caption editor */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PenLine size={15} className="text-[#127EE3]"/>
            <h3 className="text-[14px] font-bold text-[#1A1A2E]">Caption: {currentPost.label}</h3>
          </div>
          <div className="flex items-center gap-2">
            {[
              {icon:<Linkedin size={14}/>, label:"LinkedIn", color:"text-[#0077B5]"},
              {icon:<Facebook size={14}/>, label:"Facebook", color:"text-[#1877F2]"},
              {icon:<Twitter size={14}/>, label:"X / Twitter", color:"text-gray-700"},
              {icon:<Instagram size={14}/>, label:"Instagram", color:"text-[#E1306C]"},
            ].map(p=>(
              <button key={p.label} title={p.label}
                className={`w-8 h-8 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center hover:border-gray-200 hover:bg-white transition-all ${p.color}`}>
                {p.icon}
              </button>
            ))}
          </div>
        </div>
        <div className="px-6 py-5">
          <div className="grid grid-cols-3 gap-5">
            {/* Caption text */}
            <div className="col-span-2 space-y-3">
              <textarea
                defaultValue={currentPost.caption}
                rows={8}
                className="w-full bg-[#F8F9FA] border border-gray-200 rounded-xl px-4 py-3 text-[13.5px] text-[#1A1A2E] leading-relaxed focus:outline-none focus:border-[#127EE3] focus:bg-white transition-all resize-none placeholder-gray-400"
              />
              <div className="flex items-center gap-2">
                <CopyButton text={currentPost.caption} label="คัดลอก Caption"/>
                <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12.5px] font-bold bg-[#1A1A2E] text-white hover:bg-[#2a2a3e] transition-colors">
                  <Download size={13}/> ดาวน์โหลดรูป + Caption
                </button>
              </div>
            </div>

            {/* Post preview card */}
            <div className="col-span-1">
              <p className="text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-2">ตัวอย่างโพสต์</p>
              <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <div className={`bg-gradient-to-br ${currentPost.bg} p-4`}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-[#0F1724] flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold tracking-tight">HiB</span>
                    </div>
                    <div>
                      <p className="text-[11.5px] font-bold text-[#1A1A2E]">TechVibe Solutions</p>
                      <p className="text-[10px] text-gray-400">Dream Company 2569</p>
                    </div>
                  </div>
                  {/* Badge in post */}
                  <div className="mb-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/70 border border-[#f43f76]/20 backdrop-blur-sm">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#f43f76]">
                      <path d="M12 12 C12 12 7 9.5 7 6.5 C7 4.5 8.5 3 10.5 3 C11.4 3 12 3.6 12 3.6 C12 3.6 12.6 3 13.5 3 C15.5 3 17 4.5 17 6.5 C17 9.5 12 12 12 12Z M12 12 C12 12 14.5 17 17.5 17 C19.5 17 21 15.5 21 13.5 C21 12.6 20.4 12 20.4 12 C20.4 12 21 11.4 21 10.5 C21 8.5 19.5 7 17.5 7 C14.5 7 12 12 12 12Z M12 12 C12 12 17 14.5 17 17.5 C17 19.5 15.5 21 13.5 21 C12.6 21 12 20.4 12 20.4 C12 20.4 11.4 21 10.5 21 C8.5 21 7 19.5 7 17.5 C7 14.5 12 12 12 12Z M12 12 C12 12 9.5 7 6.5 7 C4.5 7 3 8.5 3 10.5 C3 11.4 3.6 12 3.6 12 C3.6 12 3 12.6 3 13.5 C3 15.5 4.5 17 6.5 17 C9.5 17 12 12 12 12Z"/>
                    </svg>
                    <span className="text-[10.5px] font-black text-[#f43f76]">Dream Company 2569</span>
                  </div>
                  <p className="text-[11px] text-gray-700 leading-relaxed line-clamp-5">{currentPost.caption}</p>
                </div>
                <div className="bg-white px-4 py-2.5 flex items-center justify-between border-t border-gray-100">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Heart size={13}/><span className="text-[11px]">128</span>
                    <MessageSquare size={13}/><span className="text-[11px]">24</span>
                    <Share2 size={13}/><span className="text-[11px]">47</span>
                  </div>
                  <span className="text-[10px] text-gray-300">23 เม.ย. 2569</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sharing checklist */}
      <div className="bg-gradient-to-r from-[#fff0f4] to-white rounded-2xl border border-[#f43f76]/15 px-7 py-5">
        <div className="flex items-center gap-2 mb-4">
          <Trophy size={16} className="text-[#f43f76]"/>
          <h3 className="text-[14px] font-bold text-[#1A1A2E]">Checklist การเผยแพร่ Dream Company Badge</h3>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[
            {label:"Career Page", desc:"ติด badge ใน header", done:false, icon:<Globe size={15}/>},
            {label:"LinkedIn Page", desc:"โพสต์ประกาศรางวัล", done:false, icon:<Linkedin size={15}/>},
            {label:"Job Postings", desc:"เพิ่ม badge ในประกาศ", done:false, icon:<Bookmark size={15}/>},
            {label:"Email Signature", desc:"HR team ทุกคน", done:false, icon:<Mail size={15}/>},
          ].map((item,i)=>(
            <div key={i} className="flex items-start gap-3 p-3.5 bg-white rounded-xl border border-[#f43f76]/10 hover:border-[#f43f76]/25 transition-all cursor-pointer group">
              <div className="w-8 h-8 rounded-lg bg-[#f43f76]/8 flex items-center justify-center flex-shrink-0 text-[#f43f76] group-hover:bg-[#f43f76]/15 transition-colors">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12.5px] font-bold text-[#1A1A2E]">{item.label}</p>
                <p className="text-[11.5px] text-gray-400">{item.desc}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${item.done ? "bg-emerald-500 border-emerald-500":"border-gray-200"}`}>
                {item.done && <Check size={10} className="text-white"/>}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// Missing import for Mail used in DreamKitTab checklist
// (already imported via Lucide above as Mail)

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS = ["ภาพรวม", "YOU SAY", "HR SAY", "Office 24", "ผลลัพธ์", "Dream Kit"] as const;
type Tab = typeof TABS[number];

interface EmployerBrandingPageProps {
  onBack: () => void;
}

export default function EmployerBrandingPage({ onBack }: EmployerBrandingPageProps) {
  const [activeTab, setActiveTab] = useState<Tab>("ภาพรวม");
  const [activePillarFilter, setActivePillarFilter] = useState<BrandPillar | "ทั้งหมด">("ทั้งหมด");
  const [office24Pillar, setOffice24Pillar] = useState<BrandPillar | "ทั้งหมด">("ทั้งหมด");
  const [expandedReview, setExpandedReview] = useState<string | null>(null);
  const [hrSayDraft, setHrSayDraft] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  if (showAllReviews) {
    return (
      <EmployerBrandingReviewsPage
        impressions={CANDIDATE_IMPRESSIONS}
        onBack={() => setShowAllReviews(false)}
      />
    );
  }


  const filteredPosts = office24Pillar === "ทั้งหมด"
    ? OFFICE24_POSTS
    : OFFICE24_POSTS.filter((p) => p.pillar === office24Pillar);

  const avgRating = (YOU_SAY_REVIEWS.reduce((s, r) => s + r.overallScore, 0) / YOU_SAY_REVIEWS.length).toFixed(1);

  const pillarAvg = (pillar: BrandPillar) =>
    (YOU_SAY_REVIEWS.reduce((s, r) => s + r.details[pillar].score, 0) / YOU_SAY_REVIEWS.length).toFixed(1);

  const topPillar = (r: YouSayReview): BrandPillar =>
    (["ชีวิตดี", "งานดี", "เงินดี", "สังคมดี"] as BrandPillar[]).reduce((a, b) =>
      r.details[a].score >= r.details[b].score ? a : b);

  const filteredByHighlight = activePillarFilter === "ทั้งหมด"
    ? YOU_SAY_REVIEWS
    : YOU_SAY_REVIEWS.filter((r) => topPillar(r) === activePillarFilter);

  return (
    <div className="bg-[#F0F2F5] min-h-full">
      <div className="max-w-screen-xl mx-auto px-6 py-6 flex flex-col gap-5">

        {/* Back */}
        <button onClick={onBack} className="flex items-center gap-2 text-[14px] font-medium text-gray-500 hover:text-[#1A1A2E] transition-colors w-fit">
          <ChevronLeft className="w-4 h-4" />
          กลับ
        </button>

        {/* ── Hero Header ──────────────────────────────────────────────────── */}
        <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#127EE3]/4 rounded-full translate-x-24 -translate-y-24 pointer-events-none" />

          <div className="relative px-8 py-7">
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#127EE3]/10 flex items-center justify-center">
                    <Award className="w-4 h-4 text-[#127EE3]" />
                  </div>
                  <span className="text-[11px] font-bold text-[#127EE3] uppercase tracking-widest">Employer Branding</span>
                </div>
                <h1 className="text-[28px] font-bold text-[#1A1A2E] leading-tight">แบรนด์นายจ้างของคุณ</h1>
                <p className="text-[14px] text-gray-400 mt-1.5">สร้าง brand ที่ดึงดูดคนเก่งมาหาคุณ — ก่อนที่คุณจะต้องไปตามหาพวกเขา</p>

                {/* Dream Company badge with review metrics */}
                <div className="mt-4 inline-flex items-center gap-5 px-5 py-4 rounded-2xl bg-gradient-to-r from-[#fff0f4] to-[#fff6f9] border-2 border-[#f43f76]/20 shadow-sm">
                  <img src="/Ratings.svg" alt="Dream Company Badge" className="h-14 object-contain flex-shrink-0" />
                  <div className="w-px h-12 bg-[#f43f76]/15" />
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs text-gray-500">รีวิวทั้งหมด</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-semibold text-gray-900">{YOU_SAY_REVIEWS.length}</span>
                        <span className="text-sm text-gray-500 font-normal">รีวิว</span>
                      </div>
                    </div>
                    <div className="border-l border-gray-200 pl-6 flex flex-col gap-0.5">
                      <span className="text-xs text-gray-500">คะแนนเฉลี่ย</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-semibold text-gray-900">{avgRating}</span>
                        <span className="text-sm text-gray-500 font-normal">/5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Pillars summary bar */}
            <div className="mt-6 grid grid-cols-4 gap-3">
              {(["ชีวิตดี", "งานดี", "เงินดี", "สังคมดี"] as BrandPillar[]).map((pillar) => {
                const cfg = PILLAR_CONFIG[pillar];
                const scores: Record<BrandPillar, number> = { "ชีวิตดี": 4.4, "งานดี": 4.6, "เงินดี": 3.95, "สังคมดี": 4.7 };
                const pct = (scores[pillar] / 5) * 100;
                return (
                  <div key={pillar} className="bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-[#127EE3]/30 hover:shadow-sm transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-6 h-6 rounded-lg bg-white flex items-center justify-center ${cfg.color} border border-gray-100`}>
                        {cfg.icon}
                      </div>
                      <span className="text-[12px] font-bold text-gray-600">{pillar}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[24px] font-black leading-none text-[#1A1A2E]">{scores[pillar].toFixed(1)}</span>
                      <span className="text-[11px] text-gray-400 ml-0.5">/5</span>
                    </div>
                    <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${cfg.dot}`} style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1.5">{cfg.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Action nudge bar ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              icon: <PenLine className="w-4 h-4 text-gray-500" />,
              title: "อัปเดต HR SAY",
              desc: "HR SAY ของคุณยังไม่ได้ update 14 วันแล้ว — คนที่กำลังพิจารณาสมัครกำลังอ่านอยู่",
              cta: "เขียนเลย",
              urgent: true,
              onClick: () => setActiveTab("HR SAY"),
            },
            {
              icon: <Star className="w-4 h-4 text-gray-500" />,
              title: "ขอรีวิวจากพนักงาน",
              desc: "บริษัทที่มีรีวิว 10+ รีวิว มีอัตรา apply สูงกว่า 47% — คุณมีอยู่ 5 รีวิวแล้ว",
              cta: "ส่ง invite",
              urgent: false,
              onClick: () => setActiveTab("YOU SAY"),
            },
            {
              icon: <Camera className="w-4 h-4 text-gray-500" />,
              title: "แชร์ชีวิตใน Office 24",
              desc: "โพสต์ล่าสุดในทีมได้รับ 312 likes — content จากทีมจริงๆ ดึงดูดกว่า official content 3 เท่า",
              cta: "ดู Feed",
              urgent: false,
              onClick: () => setActiveTab("Office 24"),
            },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 relative overflow-hidden">
              {item.urgent && (
                <div className="absolute top-3 right-3">
                  <span className="flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#127EE3] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#127EE3]" />
                  </span>
                </div>
              )}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="text-[13.5px] font-bold text-[#1A1A2E]">{item.title}</p>
                  <p className="text-[12.5px] text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
                  <button
                    onClick={item.onClick}
                    className="mt-3 px-4 py-1.5 rounded-xl text-[12.5px] font-bold transition-colors bg-[#1A1A2E] text-white hover:bg-[#2a2a3e]"
                  >
                    {item.cta}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Tab Nav ───────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-0 bg-white rounded-2xl border border-gray-100 shadow-sm px-2 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-[13px] font-semibold transition-all whitespace-nowrap border-b-2 ${
                activeTab === tab
                  ? "border-[#127EE3] text-[#127EE3]"
                  : "border-transparent text-gray-400 hover:text-[#1A1A2E]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: ภาพรวม */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === "ภาพรวม" && (
          <div className="flex flex-col gap-5">

            {/* ─── Weekly Achievements ─────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-7 py-5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <h3 className="text-[15px] font-bold text-[#1A1A2E]">Weekly Achievements</h3>
                </div>
              </div>
              <div className="px-7 py-6 flex flex-col gap-6">
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: "YOU SAY", sub: "Reviews", value: 140, delta: "+20" },
                    { label: "HR SAY", sub: "Likes", value: 61, delta: "+2" },
                    { label: "Impression", sub: "Messages", value: 33, delta: "+2" },
                    { label: "Office 24 Posts", sub: "โพสต์", value: OFFICE24_POSTS.length, delta: null },
                  ].map((m) => (
                    <div key={m.label} className="rounded-xl border border-gray-100 bg-gray-50 px-5 py-4">
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">{m.label}</p>
                      <div className="flex items-end gap-2">
                        <span className="text-[28px] font-black text-[#1A1A2E] leading-none">{m.value}</span>
                        {m.delta && <span className="text-[11px] text-[#127EE3] font-semibold mb-0.5">{m.delta}</span>}
                      </div>
                      <p className="text-[12px] text-gray-400 mt-0.5">{m.sub}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { title: "HR SAY of the week", desc: "Received most like this week", icon: <Heart className="w-4 h-4 text-rose-500" />, bg: "bg-rose-50 border-rose-100" },
                    { title: "Dream Company Achieved", desc: "YOU SAY · 3 Flower of hearts", icon: <Star className="w-4 h-4 text-amber-500" />, bg: "bg-amber-50 border-amber-100" },
                    { title: "Office 24 Contributor", desc: "Received most post this week", icon: <Award className="w-4 h-4 text-[#127EE3]" />, bg: "bg-[#F0F8FF] border-[#0DC2FF]/20" },
                  ].map((a) => (
                    <div key={a.title} className={`flex items-start gap-3 rounded-xl border px-4 py-3.5 ${a.bg}`}>
                      <div className="flex-shrink-0 mt-0.5">{a.icon}</div>
                      <div>
                        <p className="text-[13px] font-bold text-[#1A1A2E]">{a.title}</p>
                        <p className="text-[12px] text-gray-500 mt-0.5">{a.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Candidate Impressions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-7 py-5 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smile className="w-4 h-4 text-[#127EE3]" />
                  <h3 className="text-[15px] font-bold text-[#1A1A2E]">ความประทับใจจากผู้สมัคร</h3>
                  <span className="text-[12px] px-2 py-0.5 rounded-full bg-[#F0F8FF] text-[#127EE3] font-bold">20</span>
                </div>
                <p className="text-[12px] text-gray-400">หลังอ่าน HR SAY / รีวิว</p>
              </div>
              <div className="divide-y divide-gray-50">
                {CANDIDATE_IMPRESSIONS.slice(0, 5).map((imp) => (
                  <div key={imp.id} className="px-7 py-5">
                    <div className="flex items-start gap-4">
                      <AvatarBubble initials={imp.avatar} size="md"
                        color={imp.sentiment === "very_positive" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <span className="text-[13.5px] font-bold text-[#1A1A2E]">{imp.name}</span>
                            <span className="text-[12px] text-gray-400 ml-2">{imp.role}</span>
                          </div>
                          <span className="text-[11.5px] text-gray-400 flex-shrink-0">{imp.date}</span>
                        </div>
                        <p className="text-[13.5px] text-gray-600 mt-2 leading-relaxed">{imp.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-7 pt-4 pb-6 border-t border-gray-50 flex justify-end">
                <button
                  onClick={() => setShowAllReviews(true)}
                  className="text-sm text-[#127EE3] font-semibold hover:underline"
                >
                  ดูทั้งหมด →
                </button>
              </div>
            </div>

            {/* ─── Overall Summary ─────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-7 py-5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-[#127EE3]" />
                  <h3 className="text-[15px] font-bold text-[#1A1A2E]">Overall Summary</h3>
                </div>
              </div>
              <div className="px-7 py-6 flex flex-col gap-7">
                {/* Top metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Views", value: 140, delta: "+20 Views this week", icon: <Eye className="w-3.5 h-3.5" /> },
                    { label: "Applicant's Impressions", value: 229, delta: "+4 Messages this week", icon: <MessageSquare className="w-3.5 h-3.5" /> },
                    { label: "Likes", value: 61, delta: "+20 Likes this week", icon: <Heart className="w-3.5 h-3.5" /> },
                    { label: "Share", value: 14, delta: "+3 Shares this week", icon: <Share2 className="w-3.5 h-3.5" /> },
                  ].map((m) => (
                    <div key={m.label} className="rounded-xl border border-gray-100 bg-gray-50 px-5 py-4">
                      <div className="flex items-center gap-1.5 text-gray-400 mb-2">
                        {m.icon}
                        <p className="text-[11px] font-semibold uppercase tracking-wide">{m.label}</p>
                      </div>
                      <p className="text-[26px] font-black text-[#1A1A2E] leading-none">{m.value}</p>
                      <p className="text-[11.5px] text-[#127EE3] font-medium mt-1">{m.delta}</p>
                    </div>
                  ))}
                </div>

                {/* Job Seeker's Favorites */}
                <div>
                  <p className="text-[13px] font-bold text-[#1A1A2E] mb-3">Job Seeker's Favorites</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { name: "Good Life", likes: 43, delta: "+1" },
                      { name: "Good Work", likes: 61, delta: null },
                      { name: "Good Work", likes: 33, delta: null },
                      { name: "Good Work", likes: 40, delta: null },
                    ].map((f, i) => (
                      <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#F0F8FF] border border-[#0DC2FF]/20 flex items-center justify-center flex-shrink-0">
                          <Heart className="w-3.5 h-3.5 text-[#127EE3]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[12.5px] font-semibold text-[#1A1A2E] truncate">{f.name}</p>
                          <div className="flex items-center gap-1">
                            <span className="text-[12px] text-gray-500">{f.likes} Likes</span>
                            {f.delta && <span className="text-[11px] text-[#127EE3] font-semibold">{f.delta}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* YOU SAY Reviews */}
                <div>
                  <p className="text-[13px] font-bold text-[#1A1A2E] mb-3">Your YOU SAY Reviews</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="rounded-xl border border-gray-100 bg-gray-50 px-5 py-4">
                      <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide mb-1">Status</p>
                      <p className="text-[14px] font-bold text-amber-600">Dream Company</p>
                      <p className="text-[12px] text-gray-400 mt-0.5">3 YOU SAY Flower of hearts</p>
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-gray-50 px-5 py-4">
                      <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide mb-1">Total YOU SAY Review</p>
                      <div className="flex items-end gap-2">
                        <span className="text-[26px] font-black text-[#1A1A2E] leading-none">140</span>
                        <span className="text-[11px] text-[#127EE3] font-semibold mb-0.5">+2 Reviews</span>
                      </div>
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-gray-50 px-5 py-4">
                      <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide mb-1">Overall Rating</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        {[1,2,3,4,5].map((s) => (
                          <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
                        ))}
                        <span className="text-[13px] font-bold text-[#1A1A2E] ml-1">5 / 5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Most Liked Photo ────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-7 py-5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Image className="w-4 h-4 text-[#127EE3]" />
                  <h3 className="text-[15px] font-bold text-[#1A1A2E]">Most Liked Photo</h3>
                </div>
              </div>
              <div className="px-7 py-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { likes: 142, url: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400" },
                    { likes: 140, url: "https://images.pexels.com/photos/3184416/pexels-photo-3184416.jpeg?auto=compress&cs=tinysrgb&w=400" },
                    { likes: 21, url: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400" },
                    { likes: 19, url: "https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=400" },
                  ].map((photo, i) => (
                    <div key={i} className="relative rounded-xl overflow-hidden border border-gray-100 aspect-square">
                      <img
                        src={photo.url}
                        alt={`Most liked photo ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2.5">
                        <div className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-white fill-white" />
                          <span className="text-[12px] font-bold text-white">{photo.likes}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: YOU SAY */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === "YOU SAY" && (
          <div className="flex flex-col gap-5">

            {/* Invite nudge */}
            <div className="bg-gradient-to-r from-[#F0F8FF] to-white rounded-2xl border border-[#0DC2FF]/25 px-6 py-4 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0DC2FF]/15 flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-[#127EE3]" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[#1A1A2E]">ชวนพนักงานมาเขียนรีวิว</p>
                  <p className="text-[13px] text-gray-500 mt-0.5">บริษัทที่มีรีวิว 10+ รีวิว มีผู้สมัครมากกว่า 47% — คุณมี 5 รีวิว ขาดอีก 5</p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-[#127EE3] text-white text-[13px] font-bold rounded-xl hover:bg-[#0f6bc7] transition-colors whitespace-nowrap flex-shrink-0">
                <Plus className="w-4 h-4" />
                ส่ง Invite ให้พนักงาน
              </button>
            </div>

            {/* Filter by highlight */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[12px] font-semibold text-gray-400">highlight:</span>
              {(["ทั้งหมด", "ชีวิตดี", "งานดี", "เงินดี", "สังคมดี"] as const).map((f) => {
                const isActive = activePillarFilter === f;
                const cfg = f !== "ทั้งหมด" ? PILLAR_CONFIG[f] : null;
                const count = f === "ทั้งหมด" ? YOU_SAY_REVIEWS.length : YOU_SAY_REVIEWS.filter((r) => topPillar(r) === f).length;
                return (
                  <button
                    key={f}
                    onClick={() => setActivePillarFilter(f)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[12.5px] font-semibold border transition-all ${
                      isActive
                        ? (cfg ? `${cfg.bg} ${cfg.color} ${cfg.border}` : "bg-[#1A1A2E] text-white border-[#1A1A2E]")
                        : "bg-white text-gray-400 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {cfg && isActive && cfg.icon}
                    {f}
                    <span className="text-[10px] font-black opacity-60">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Reviews list */}
            <div className="flex flex-col gap-4">
              {filteredByHighlight.map((review) => {
                const isExpanded = expandedReview === review.id;
                const PILLARS = ["ชีวิตดี", "งานดี", "เงินดี", "สังคมดี"] as BrandPillar[];
                return (
                  <div key={review.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex">
                      {/* Left panel — identity + scores summary */}
                      <div className="w-52 flex-shrink-0 border-r border-gray-100 px-5 py-6 flex flex-col items-center text-center">
                        {/* Anonymous avatar */}
                        <div className="w-14 h-14 rounded-2xl bg-[#F0F2F5] border border-gray-200 flex items-center justify-center mb-3">
                          <Users className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-[13px] font-bold text-[#1A1A2E]">익명</p>
                        <p className="text-[12px] text-gray-500 mt-0.5">{review.role}</p>
                        <p className="text-[11.5px] text-gray-400 mt-0.5">
                          {review.tenure}{review.isFormer ? ", อดีตพนักงาน" : ", พนักงานปัจจุบัน"}
                        </p>

                        {/* Overall score */}
                        <div className="mt-4 mb-3">
                          <p className="text-[30px] font-black text-[#127EE3] leading-none">{review.overallScore.toFixed(1)}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">คะแนนรวม</p>
                        </div>

                        {/* Pillar score bars */}
                        <div className="w-full space-y-2">
                          {PILLARS.map((p) => {
                            const cfg = PILLAR_CONFIG[p];
                            const score = review.details[p].score;
                            return (
                              <div key={p} className="flex items-center gap-2">
                                <span className="text-[11px] text-gray-500 w-14 text-left flex-shrink-0">{p}</span>
                                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                  <div className={`h-full rounded-full ${cfg.dot}`} style={{ width: `${(score / 5) * 100}%` }} />
                                </div>
                                <span className={`text-[11px] font-black w-5 text-right ${cfg.color}`}>{score}</span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Helpful */}
                        <button className="mt-4 flex items-center gap-1.5 text-[11.5px] text-gray-400 hover:text-[#127EE3] transition-colors">
                          <ThumbsUp className="w-3.5 h-3.5" />
                          มีประโยชน์ ({review.helpful})
                        </button>
                        <p className="text-[10.5px] text-gray-300 mt-1">{review.date}</p>
                      </div>

                      {/* Right panel — quote + detail breakdown */}
                      <div className="flex-1 px-7 py-6">
                        {/* Quote */}
                        <p className="text-[16px] font-bold text-[#1A1A2E] mb-5">
                          <span className="text-gray-300 font-black text-[20px] leading-none mr-1">"</span>
                          {review.quote}
                          <span className="text-gray-300 font-black text-[20px] leading-none ml-1">"</span>
                        </p>

                        {/* 4-pillar detail grid */}
                        <div className={`grid grid-cols-2 gap-x-8 gap-y-5 ${!isExpanded ? "max-h-[220px] overflow-hidden" : ""}`}>
                          {PILLARS.map((p) => {
                            const cfg = PILLAR_CONFIG[p];
                            const detail = review.details[p];
                            return (
                              <div key={p}>
                                <div className={`flex items-center gap-1.5 mb-2.5 pb-1.5 border-b border-gray-100`}>
                                  <span className={cfg.color}>{cfg.icon}</span>
                                  <span className="text-[13px] font-black text-[#1A1A2E]">{p}</span>
                                </div>
                                <div className="space-y-2">
                                  {detail.items.map((item, i) => (
                                    <div key={i} className="flex items-start justify-between gap-2">
                                      <span className="text-[12.5px] text-gray-500 leading-tight">{item.label}</span>
                                      {item.isText ? (
                                        <span className="text-[12.5px] font-semibold text-[#127EE3] text-right leading-tight flex-shrink-0">{item.value}</span>
                                      ) : (
                                        <span className={`text-[12.5px] font-black flex-shrink-0 ${cfg.color}`}>{item.value}/5</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Expand toggle */}
                        <button
                          onClick={() => setExpandedReview(isExpanded ? null : review.id)}
                          className="mt-3 text-[12px] text-[#127EE3] font-semibold hover:underline flex items-center gap-1"
                        >
                          {isExpanded ? "ย่อลง" : "ดูรายละเอียดทั้งหมด"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: HR SAY */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === "HR SAY" && (
          <div className="flex flex-col gap-5">

            {/* Status banner */}
            <div className="flex items-start gap-3 px-5 py-4 rounded-2xl bg-amber-50 border border-amber-200">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-[13.5px] font-bold text-amber-700">HR SAY ยังไม่ได้ update 14 วันแล้ว</p>
                <p className="text-[12.5px] text-amber-600 mt-0.5 leading-relaxed">
                  ผู้สมัครระดับ Senior มักอ่าน HR SAY ก่อนตัดสินใจสมัคร — content ที่ fresh กว่า สื่อถึง culture ที่มีชีวิตมากกว่า
                </p>
              </div>
              <button
                onClick={() => setHrSayDraft(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white text-[12.5px] font-bold rounded-xl hover:bg-amber-600 transition-colors whitespace-nowrap flex-shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5" />
                อัปเดตเลย
              </button>
            </div>

            {/* Preview impact */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "ผู้ที่อ่าน HR SAY เดือนนี้", value: "1,284", icon: <Eye className="w-4 h-4 text-[#127EE3]" />, bg: "bg-[#F0F8FF]", color: "text-[#127EE3]" },
                { label: "สมัครหลังอ่าน HR SAY", value: "73%", icon: <ArrowUpRight className="w-4 h-4 text-emerald-500" />, bg: "bg-emerald-50", color: "text-emerald-600" },
                { label: "เวลาเฉลี่ยที่อ่าน", value: "3.2 นาที", icon: <Clock className="w-4 h-4 text-amber-500" />, bg: "bg-amber-50", color: "text-amber-600" },
              ].map((item, i) => (
                <div key={i} className={`${item.bg} rounded-2xl border border-gray-100 shadow-sm px-5 py-4`}>
                  <div className={`flex items-center gap-2 mb-2 ${item.color}`}>
                    {item.icon}
                    <p className="text-[11.5px] font-bold uppercase tracking-wider">{item.label}</p>
                  </div>
                  <p className={`text-[28px] font-black leading-none ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>

            {/* HR SAY blocks */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-7 py-5 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <h3 className="text-[15px] font-bold text-[#1A1A2E]">HR SAY ปัจจุบัน</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11.5px] text-gray-400 px-2.5 py-1 rounded-full bg-gray-100">อัปเดตล่าสุด 14 วันที่แล้ว</span>
                  <button
                    onClick={() => setHrSayDraft(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1A1A2E] text-white text-[12.5px] font-bold rounded-xl hover:bg-[#2a2a3e] transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    แก้ไข
                  </button>
                </div>
              </div>

              {hrSayDraft ? (
                <div className="px-7 py-6 space-y-5">
                  <div className="p-4 bg-[#F0F8FF] rounded-xl border border-[#0DC2FF]/20 flex items-center gap-2 text-[12.5px] text-[#127EE3]">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-semibold">เคล็ดลับ:</span> เขียนให้เหมือนคุยกับเพื่อน — honest, specific, มีเรื่องเล่า ไม่ใช่แค่ bullet point
                  </div>
                  {(["ชีวิตดี", "งานดี", "เงินดี", "สังคมดี"] as BrandPillar[]).map((pillar) => {
                    const cfg = PILLAR_CONFIG[pillar];
                    const defaults: Record<BrandPillar, string> = {
                      "ชีวิตดี": "เราเชื่อว่าคนทำงานดีต้องมีชีวิตที่สมดุลด้วย WFH 2 วัน/สัปดาห์ ไม่มี culture ทำงานดึก และ vacation policy ที่ใช้ได้จริง...",
                      "งานดี": "ที่นี่คุณจะได้ทำงานกับทีมที่เก่งจริงๆ ทุกคนมี ownership ในงาน ไม่ใช่แค่ executor ของ boss เราเชื่อใน impact-driven work...",
                      "เงินดี": "เราจ่าย competitive กับตลาดและ review ทุก 6 เดือน bonus โครงสร้างชัดเจน วัดผลได้ และมี stock option สำหรับระดับ senior...",
                      "สังคมดี": "ทีมเราคือคนที่ทำงานหนักแต่ไม่ลืม work hard play hard มีทริปทีมทุกไตรมาส gamer lounge ในออฟฟิศ และกลุ่ม interest club มากกว่า 10 กลุ่ม...",
                    };
                    return (
                      <div key={pillar}>
                        <div className={`flex items-center gap-2 mb-2 ${cfg.color}`}>
                          {cfg.icon}
                          <span className="text-[12.5px] font-bold uppercase tracking-wider">{pillar}</span>
                        </div>
                        <textarea
                          defaultValue={defaults[pillar]}
                          rows={3}
                          className={`w-full px-4 py-3 text-[13.5px] text-gray-700 leading-relaxed rounded-xl border focus:outline-none focus:border-[#0DC2FF] focus:bg-white transition-all resize-none ${cfg.bg} ${cfg.border}`}
                        />
                      </div>
                    );
                  })}
                  <div className="flex gap-3 pt-2">
                    <button className="flex-1 py-3 bg-[#1A1A2E] text-white text-[13.5px] font-bold rounded-xl hover:bg-[#2a2a3e] transition-colors">
                      บันทึกและเผยแพร่
                    </button>
                    <button onClick={() => setHrSayDraft(false)} className="px-6 py-3 border border-gray-200 text-gray-500 text-[13.5px] font-medium rounded-xl hover:border-gray-400 transition-colors">
                      ยกเลิก
                    </button>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {(["ชีวิตดี", "งานดี", "เงินดี", "สังคมดี"] as BrandPillar[]).map((pillar) => {
                    const cfg = PILLAR_CONFIG[pillar];
                    const content: Record<BrandPillar, string> = {
                      "ชีวิตดี": "เราเชื่อว่าคนทำงานดีต้องมีชีวิตที่สมดุลด้วย WFH 2 วัน/สัปดาห์ ไม่มี culture ทำงานดึก และ vacation policy ที่ใช้ได้จริง นอกจากนี้ยังมี wellness benefits ทั้ง gym membership และ mental health support",
                      "งานดี": "ที่นี่คุณจะได้ทำงานกับทีมที่เก่งจริงๆ ทุกคนมี ownership ในงาน ไม่ใช่แค่ executor ของ boss เราเชื่อใน impact-driven work และให้ space ในการทดลองสิ่งใหม่",
                      "เงินดี": "เราจ่าย competitive กับตลาดและ review ทุก 6 เดือน bonus โครงสร้างชัดเจน วัดผลได้ และมี stock option สำหรับระดับ senior ขึ้นไป",
                      "สังคมดี": "ทีมเราคือคนที่ทำงานหนักแต่ไม่ลืม work hard play hard มีทริปทีมทุกไตรมาส gamer lounge ในออฟฟิศ และกลุ่ม interest club มากกว่า 10 กลุ่ม",
                    };
                    return (
                      <div key={pillar} className="px-7 py-5">
                        <div className={`flex items-center gap-2 mb-2 ${cfg.color}`}>
                          {cfg.icon}
                          <span className="text-[12px] font-bold uppercase tracking-wider">{pillar}</span>
                        </div>
                        <p className="text-[13.5px] text-gray-600 leading-relaxed">{content[pillar]}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: Office 24 */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === "Office 24" && (
          <div className="flex flex-col gap-5">

            {/* Header */}
            <div className="bg-gradient-to-r from-[#1A1A2E] to-[#2a2a4e] rounded-2xl px-7 py-5 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Camera className="w-4 h-4 text-[#0DC2FF]" />
                  <span className="text-[11px] font-bold text-[#0DC2FF] uppercase tracking-widest">Office 24</span>
                </div>
                <h3 className="text-[18px] font-bold text-white">Social Platform ของพนักงาน</h3>
                <p className="text-[13px] text-white/50 mt-1">พนักงานแชร์ชีวิตจริงใน 4 หมวด — authentic content ดึงดูดผู้สมัครดีกว่า official content 3 เท่า</p>
              </div>
              <div className="flex items-center gap-3 text-white/60 text-[12.5px]">
                <div className="text-center">
                  <p className="text-[22px] font-black text-white leading-none">{OFFICE24_POSTS.reduce((s, p) => s + p.likes, 0).toLocaleString()}</p>
                  <p>Likes รวม</p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center">
                  <p className="text-[22px] font-black text-white leading-none">{OFFICE24_POSTS.length}</p>
                  <p>Posts</p>
                </div>
              </div>
            </div>

            {/* Pillar filter */}
            <div className="flex items-center gap-2 flex-wrap">
              {(["ทั้งหมด", "ชีวิตดี", "งานดี", "เงินดี", "สังคมดี"] as const).map((f) => {
                const isActive = office24Pillar === f;
                const cfg = f !== "ทั้งหมด" ? PILLAR_CONFIG[f] : null;
                const count = f === "ทั้งหมด" ? OFFICE24_POSTS.length : OFFICE24_POSTS.filter((p) => p.pillar === f).length;
                return (
                  <button
                    key={f}
                    onClick={() => setOffice24Pillar(f)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[12.5px] font-semibold border transition-all ${
                      isActive
                        ? (cfg ? `${cfg.bg} ${cfg.color} ${cfg.border}` : "bg-[#1A1A2E] text-white border-[#1A1A2E]")
                        : "bg-white text-gray-400 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {cfg && isActive && cfg.icon}
                    {f}
                    <span className="text-[10px] font-black opacity-60">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Posts grid */}
            <div className="grid grid-cols-3 gap-4">
              {filteredPosts.map((post) => {
                const cfg = PILLAR_CONFIG[post.pillar];
                return (
                  <div key={post.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md hover:border-gray-200 transition-all">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      {post.isNew && (
                        <div className="absolute top-3 left-3">
                          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#0DC2FF] text-white text-[10px] font-bold">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                            ใหม่
                          </span>
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <PillarBadge pillar={post.pillar} />
                      </div>
                      {/* Overlay actions */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-2">
                          <button className="w-7 h-7 rounded-lg bg-white/90 flex items-center justify-center hover:bg-white transition-colors">
                            <Share2 className="w-3.5 h-3.5 text-gray-600" />
                          </button>
                          <button className="w-7 h-7 rounded-lg bg-white/90 flex items-center justify-center hover:bg-white transition-colors">
                            <Bookmark className="w-3.5 h-3.5 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="px-4 py-4">
                      <div className="flex items-center gap-2 mb-2.5">
                        <AvatarBubble initials={post.avatar} size="sm" color={`${cfg.bg} ${cfg.color}`} />
                        <div>
                          <p className="text-[12.5px] font-bold text-[#1A1A2E] leading-none">{post.author}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{post.role}</p>
                        </div>
                      </div>
                      <p className="text-[13px] text-gray-600 leading-relaxed line-clamp-3">{post.caption}</p>
                      <div className="flex items-center gap-4 mt-3 text-[12px] text-gray-400">
                        <button className="flex items-center gap-1 hover:text-rose-500 transition-colors">
                          <Heart className="w-3.5 h-3.5" />
                          {post.likes}
                        </button>
                        <button className="flex items-center gap-1 hover:text-[#127EE3] transition-colors">
                          <MessageSquare className="w-3.5 h-3.5" />
                          {post.comments}
                        </button>
                        <span className="ml-auto">{post.date}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA to encourage more posts */}
            <div className="bg-gradient-to-r from-rose-50 to-amber-50 rounded-2xl border border-rose-100 px-7 py-5 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Image className="w-4 h-4 text-rose-500" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[#1A1A2E]">สนับสนุนให้พนักงานโพสต์มากขึ้น</p>
                  <p className="text-[13px] text-gray-500 mt-0.5">หมวด "เงินดี" มีโพสต์น้อยที่สุด — ลองชวนทีม share เรื่อง bonus, stock, หรือ perks ที่ได้รับ</p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-[#1A1A2E] text-white text-[13px] font-bold rounded-xl hover:bg-[#2a2a3e] transition-colors whitespace-nowrap flex-shrink-0">
                <Plus className="w-4 h-4" />
                ชวนพนักงานโพสต์
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: Dream Kit */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === "Dream Kit" && <DreamKitTab />}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: ผลลัพธ์ */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === "ผลลัพธ์" && (
          <div className="flex flex-col gap-5">

            {/* ROI banner */}
            <div className="bg-gradient-to-r from-[#0f1d3a] to-[#1a3561] rounded-2xl px-7 py-6 text-white">
              <div className="flex items-start gap-3 mb-5">
                <Globe className="w-5 h-5 text-[#0DC2FF] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-bold text-[#0DC2FF] uppercase tracking-widest mb-1">Branding Impact</p>
                  <h3 className="text-[20px] font-bold">Employer Branding ที่ดีลดต้นทุนสรรหาได้จริง</h3>
                  <p className="text-[13px] text-white/50 mt-1">ข้อมูลจากบริษัทที่ใช้ Super Resume Branding เต็มรูปแบบ</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "ลด cost-per-hire", value: "-34%", sub: "เฉลี่ยจากบริษัทที่ใช้งาน", icon: <TrendingDown className="w-4 h-4 text-emerald-400" /> },
                  { label: "เพิ่มอัตราผู้สมัครคุณภาพ", value: "+2.3x", sub: "Match score > 80 มากขึ้น", icon: <ArrowUpRight className="w-4 h-4 text-[#0DC2FF]" /> },
                  { label: "ลดเวลา time-to-fill", value: "-28%", sub: "วันเฉลี่ยในการปิดตำแหน่ง", icon: <Clock className="w-4 h-4 text-amber-400" /> },
                ].map((item, i) => (
                  <div key={i} className="bg-white/8 border border-white/10 rounded-xl px-4 py-4">
                    <div className="flex items-center gap-2 mb-2">
                      {item.icon}
                      <p className="text-[11.5px] text-white/60 font-medium">{item.label}</p>
                    </div>
                    <p className="text-[28px] font-black text-white leading-none">{item.value}</p>
                    <p className="text-[11.5px] text-white/40 mt-1">{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly trend */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-7 py-6">
              <div className="flex items-center gap-2 mb-5">
                <BarChart2 className="w-4 h-4 text-[#127EE3]" />
                <h3 className="text-[15px] font-bold text-[#1A1A2E]">แนวโน้ม 6 เดือนที่ผ่านมา</h3>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Profile Views", data: [420, 510, 490, 680, 820, 1284], color: "bg-[#0DC2FF]", unit: "ครั้ง" },
                  { label: "Organic Applications", data: [12, 18, 15, 28, 41, 67], color: "bg-emerald-500", unit: "คน" },
                  { label: "YOU SAY Reads", data: [200, 280, 310, 420, 580, 890], color: "bg-amber-400", unit: "ครั้ง" },
                ].map((metric) => {
                  const max = Math.max(...metric.data);
                  const months = ["พ.ย.", "ธ.ค.", "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย."];
                  return (
                    <div key={metric.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-[12.5px] font-semibold text-gray-600">{metric.label}</p>
                        <p className="text-[12.5px] font-bold text-[#1A1A2E]">
                          {metric.data[metric.data.length - 1].toLocaleString()} {metric.unit}
                          <span className="text-[11px] font-normal text-emerald-500 ml-1.5">
                            +{Math.round(((metric.data[5] - metric.data[0]) / metric.data[0]) * 100)}%
                          </span>
                        </p>
                      </div>
                      <div className="flex items-end gap-1.5 h-10">
                        {metric.data.map((val, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <div
                              className={`w-full rounded-sm ${metric.color} opacity-70 hover:opacity-100 transition-opacity`}
                              style={{ height: `${Math.round((val / max) * 36)}px` }}
                              title={`${months[i]}: ${val.toLocaleString()} ${metric.unit}`}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-1.5 mt-1">
                        {months.map((m, i) => (
                          <div key={i} className="flex-1 text-center text-[9px] text-gray-400">{m}</div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Upgrade nudge */}
            <div className="bg-gradient-to-r from-[#F0F8FF] to-white rounded-2xl border border-[#0DC2FF]/25 px-7 py-6 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0DC2FF]/15 flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-4 h-4 text-[#127EE3]" />
                </div>
                <div>
                  <p className="text-[14.5px] font-bold text-[#1A1A2E]">ยกระดับเป็น Branding Pro</p>
                  <p className="text-[13px] text-gray-500 mt-0.5 leading-relaxed">
                    ปลดล็อก: Video HR SAY · Branded Career Page · Priority placement · Benchmark vs competitor employers
                  </p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#0DC2FF] to-[#127EE3] text-white text-[13.5px] font-bold rounded-xl shadow-md shadow-[#0DC2FF]/20 hover:shadow-[#0DC2FF]/35 transition-all whitespace-nowrap flex-shrink-0">
                <Sparkles className="w-4 h-4" />
                ดู Branding Pro
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
