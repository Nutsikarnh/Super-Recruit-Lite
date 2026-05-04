export interface EmailAddressBookContact {
  id: string;
  fullName: string;
  email: string;
  department: string;
  title: string;
  initials: string;
  color: string;
}

export const emailAddressBookContacts: EmailAddressBookContact[] = [
  { id: "c1", fullName: "ดร. ประภา วิจิตรกุล",    title: "HR Director",         email: "prappha.w@company.com",  department: "HR",          initials: "ปว", color: "bg-blue-100 text-blue-700"    },
  { id: "c2", fullName: "คุณสมศักดิ์ อินทรสุวรรณ", title: "VP of Engineering",   email: "somsak.i@company.com",   department: "Engineering", initials: "สอ", color: "bg-emerald-100 text-emerald-700" },
  { id: "c3", fullName: "คุณณัฐพร เกียรติมงคล",    title: "Head of Design",      email: "nattaporn.k@company.com",department: "Design",      initials: "ณก", color: "bg-rose-100 text-rose-700"    },
  { id: "c4", fullName: "คุณชัยวัฒน์ มาลาวงศ์",    title: "CFO",                 email: "chaiwat.m@company.com",  department: "Finance",     initials: "ชม", color: "bg-amber-100 text-amber-700"  },
  { id: "c5", fullName: "คุณพรรณี สัมฤทธิ์ผล",     title: "CTO",                 email: "pannee.s@company.com",   department: "Technology",  initials: "พส", color: "bg-sky-100 text-sky-700"      },
  { id: "c6", fullName: "คุณอุดมชัย ตันติกุล",     title: "Product Director",    email: "udomchai.t@company.com", department: "Product",     initials: "อต", color: "bg-violet-100 text-violet-700"},
  { id: "c7", fullName: "คุณสุนันทา ฤทธิ์ดี",      title: "Marketing Manager",   email: "sunantha.r@company.com", department: "Marketing",   initials: "สฤ", color: "bg-pink-100 text-pink-700"    },
  { id: "c8", fullName: "คุณธีรยุทธ กาญจนสุนทร",   title: "Operations Manager",  email: "teerayut.k@company.com", department: "Operations",  initials: "ธก", color: "bg-teal-100 text-teal-700"    },
];
