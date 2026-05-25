import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clipboard,
  ClipboardCheck,
  Filter,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react";

const STORAGE_KEY = "byetension_web_dashboard_jun_dec_2026_v2";
const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRHrsxbp7le306LK9lR59v0660NvCrK_Z65Jyf3_rxr83ET5_sHYxQIwMQwjXJ1d0Wrh5BzT4XcwG4M/pub?output=csv";

const quickPrompts = [
  {
    id: "seo-mockup",
    title: "SEO + Mockup Prompt",
    description: "ใช้หลังสร้างภาพเสร็จแล้ว แนบภาพแล้วกดก็อปคำสั่งนี้",
    text: `อ่านชีท ByeTension_Simple_Idea_Log_Checkbox ก่อน

ใช้ข้อมูลชีทจากรอบแรกในแชทนี้
วิเคราะห์ภาพว่าเป็นภาพอะไรก่อน แล้วเหมาะกับกรอบแบบไหน แล้วอธิบายด้วย
สร้าง SEO + Mockup Prompt / ส่งเป็น txt แยก 2 ไฟล์ / ห้ามสร้างรูปภาพ
ห้ามซ้ำแนวเดิมในชีท
ห้ามอัปเดตชีทจริงอัตโนมัติ
ส่งมาเป็นไฟล์ให้ดาวน์โหลดเลย ไม่ต้องอธิบายยาว`,
  },
  {
    id: "image-generation",
    title: "Create Image From Idea",
    description: "ใช้หลังเลือกไอเดียแล้ว เอา prompt สั้นจากไอเดียมาใส่ในวงเล็บ",
    text: `สร้างภาพจากไอเดีย : ()
ได้เลย (ไม่ต้องคุยอะไรกัน)
ยึดตามไอเดียทุกอย่าง ทั้ง subject, mood, orientation, color mood, และ color direction ห้ามเปลี่ยนคอนเซปต์เอง ใช้สัดส่วนตามที่แนะนำในไอเดียนั้น no text, no logo, no watermark
Style: 
Use ByeTension’s fixed signature heirloom oil painting style for all artworks, so every piece looks cohesive and clearly painted by the same artist. expressive traditional oil painting, confident visible brushstrokes, layered oil paint surface, broken color, scumbled light, dry-brush texture, painterly lost-and-found edges, soft atmospheric blending, rich but muted color mixing, hand-painted surface variation, visible directional brush movement, refined old-world painterly realism, warm natural light, airy peaceful atmosphere, calm decor-friendly composition, elegant retirement lifestyle mood, premium printable wall art, realistic proportions, believable real-world scene, not photorealistic, not digital smooth, not glossy, not plastic, not overly clean AI rendering, not dark, not muddy, not cartoon, not watercolor, not flat illustration 
------- 
Premium Texture Style: 
visible linen canvas weave under layered oil paint, tactile brush ridges, broken pigment deposits, soft palette-knife-like paint variation without extreme thickness, scumbled highlights, dry-brush texture, thick oil pigment embedded into canvas tooth, natural pigment absorption into linen weave, matte museum finish, soft diffused natural light only, no gloss, no reflections, no digital smoothness, no plastic finish, rich painterly surface, fixed composition, no extra elements, no scene change, centered balanced layout`,
  },
  {
    id: "video-promo",
    title: "Create Product Promo Video",
    description: "ใช้หลังมี mockup แล้ว เอาไปสร้างวิดีโอโปรโมตสินค้า 10 วิ",
    text: `Create a 10-second Etsy product promo video using the attached wall art mockup.

Audio:
Add soft gentle background music throughout the entire video from 0–10 seconds.
Music style: calm piano, peaceful ambient acoustic, warm cozy instrumental.
The music must be audible but subtle, relaxing, and premium.
No voice, no dialogue, no talking.
Do not remove the background music.

Visual:
Use slow cinematic movement: gentle zoom in, slight side pan, warm sunlight glow, subtle curtain movement. Keep the framed wall art clear, centered, and the main focus.

Text overlay timing:
0–3 seconds: “Printable Wall Art”
3.2–6.5 seconds: “Instant Digital Download”
6.7–10 seconds: “Available on Etsy”

Important text rules:
Only show one text phrase at a time.
Each text phrase must fade in and fade out before the next phrase appears.
No overlapping text.
No stacked text.
No extra captions.
Place text in the lower third area with clean elegant typography.
Text must not cover the main artwork.

Style:
cozy cream interior, warm natural light, peaceful cottage home decor, premium Etsy listing mood, calm slow living atmosphere.

Restrictions:
No people, no hands, no talking, no dramatic motion, no loud music, no voiceover, no logo, no watermark, no extra objects, no animation inside the framed artwork.
Keep the scene clean and elegant.`,
  },
];

const months = [
  { key: "2026-06", label: "June 2026", short: "Jun", focus: "Summer Seasonal Launch", note: "เริ่ม Seasonal ตั้งแต่เดือนหน้า แต่ยังไม่ล็อกภาพจริง", days: 30, startOffset: 1 },
  { key: "2026-07", label: "July 2026", short: "Jul", focus: "Late Summer + Early Fall Prep", note: "เริ่มขยับเข้า early fall แบบนุ่ม ๆ", days: 31, startOffset: 3 },
  { key: "2026-08", label: "August 2026", short: "Aug", focus: "Fall Soft Prep + Cozy Home", note: "เพิ่ม cozy home และ slow living เตรียม Q4", days: 31, startOffset: 6 },
  { key: "2026-09", label: "September 2026", short: "Sep", focus: "Early Winter / Soft Seasonal Prep", note: "เริ่ม winter และ early holiday แบบเบา ๆ", days: 30, startOffset: 2 },
  { key: "2026-10", label: "October 2026", short: "Oct", focus: "Holiday Ramp Up", note: "ดัน seasonal / holiday ให้ชัดขึ้น", days: 31, startOffset: 4 },
  { key: "2026-11", label: "November 2026", short: "Nov", focus: "Christmas / Gift Push", note: "เดือนขาย giftable printable และ cozy holiday decor", days: 30, startOffset: 0 },
  { key: "2026-12", label: "December 2026", short: "Dec", focus: "Holiday + Winter Shift", note: "ครึ่งแรก holiday ครึ่งหลัง winter / New Year", days: 31, startOffset: 2 },
];

const sections = [
  "Seasonal Wall Art",
  "Retirement Wall Art",
  "Cottage Garden Wall Art",
  "Animal & Nature Wall Art",
  "Still Life Wall Art",
  "Travel Window Views",
  "Leisure Sports Wall Art",
];

const sectionStyle = {
  "Seasonal Wall Art": "bg-amber-100 text-amber-950 border-amber-200",
  "Retirement Wall Art": "bg-violet-100 text-violet-950 border-violet-200",
  "Cottage Garden Wall Art": "bg-lime-100 text-lime-950 border-lime-200",
  "Animal & Nature Wall Art": "bg-emerald-100 text-emerald-950 border-emerald-200",
  "Still Life Wall Art": "bg-stone-200 text-stone-950 border-stone-300",
  "Travel Window Views": "bg-sky-100 text-sky-950 border-sky-200",
  "Leisure Sports Wall Art": "bg-orange-100 text-orange-950 border-orange-200",
};

const openDirections = {
  "Seasonal Wall Art": ["open seasonal direction for the month, no locked subject", "seasonal home decor direction, no locked object or scene", "soft seasonal wall art direction, GPT must choose fresh visual after sheet check"],
  "Retirement Wall Art": ["core retirement lifestyle / next chapter direction, no locked subject", "peaceful home or scenic retirement direction, no locked scene", "slow living retirement mood direction, GPT must choose fresh idea after sheet check"],
  "Cottage Garden Wall Art": ["cottage garden / floral / botanical direction, no locked plant or scene", "garden-inspired decor direction, GPT must choose fresh subject after sheet check", "botanical or cottage nature direction, no locked object"],
  "Animal & Nature Wall Art": ["animal or nature companion direction, no locked animal", "calm animal-led or nature-led wall art direction, GPT must choose fresh subject", "peaceful wildlife / pet / nature companion direction, no locked scene"],
  "Still Life Wall Art": ["slow living object / hobby / tabletop direction, no locked object", "object-led decorative wall art direction, GPT must choose fresh object family", "cozy still life or hobby setup direction, no pre-decided object"],
  "Travel Window Views": ["view-led / travel-feeling direction, no locked place or subject", "window, balcony, porch, road, or destination-feeling direction, no locked location", "peaceful scenic escape direction, GPT must choose fresh place-feeling after sheet check"],
  "Leisure Sports Wall Art": ["calm leisure sport direction, no locked sport object", "retirement-friendly leisure / hobby-sport direction, GPT must choose fresh subject", "peaceful outdoor leisure direction, no action sport, no locked scene"],
};

const monthSectionRatios = {
  "2026-06": ["Seasonal Wall Art", "Retirement Wall Art", "Cottage Garden Wall Art", "Travel Window Views", "Animal & Nature Wall Art"],
  "2026-07": ["Seasonal Wall Art", "Retirement Wall Art", "Travel Window Views", "Cottage Garden Wall Art", "Still Life Wall Art"],
  "2026-08": ["Seasonal Wall Art", "Retirement Wall Art", "Cottage Garden Wall Art", "Animal & Nature Wall Art", "Still Life Wall Art"],
  "2026-09": ["Seasonal Wall Art", "Retirement Wall Art", "Animal & Nature Wall Art", "Cottage Garden Wall Art", "Still Life Wall Art"],
  "2026-10": ["Seasonal Wall Art", "Seasonal Wall Art", "Retirement Wall Art", "Animal & Nature Wall Art", "Still Life Wall Art"],
  "2026-11": ["Seasonal Wall Art", "Seasonal Wall Art", "Retirement Wall Art", "Cottage Garden Wall Art", "Still Life Wall Art"],
  "2026-12": ["Seasonal Wall Art", "Retirement Wall Art", "Animal & Nature Wall Art", "Travel Window Views", "Still Life Wall Art"],
};

const rotationExtras = ["Travel Window Views", "Leisure Sports Wall Art", "Cottage Garden Wall Art", "Animal & Nature Wall Art", "Still Life Wall Art", "Retirement Wall Art"];

function pad(n) {
  return String(n).padStart(2, "0");
}
function getDateKey(month, day) {
  return `${month.key}-${pad(day)}`;
}
function shuffleDailySections(monthKey, day) {
  const base = [...(monthSectionRatios[monthKey] || monthSectionRatios["2026-06"] )];
  const extra = rotationExtras[(day + monthKey.charCodeAt(6)) % rotationExtras.length];
  if (!base.includes(extra)) base[4] = extra;
  const shift = day % base.length;
  return [...base.slice(shift), ...base.slice(0, shift)].slice(0, 5);
}
function getDailyPlan(month, day) {
  return shuffleDailySections(month.key, day).map((section, index) => ({
    number: index + 1,
    section,
    direction: openDirections[section][(day + index) % openDirections[section].length],
  }));
}
function buildPrompt(month, day) {
  const date = getDateKey(month, day);
  const themeList = getDailyPlan(month, day)
    .map((item) => `${item.number}. ${item.section} — ${item.direction}`)
    .join("\n");
  return `อ่านชีท ByeTension_Simple_Idea_Log_Checkbox ก่อน\n\nวันที่ลง: ${date}\nMonthly Focus: ${month.focus}\n\nธีม 1-5 ที่ต้องใช้รอบนี้:\n${themeList}\n\nขอไอเดีย Wall Art Product Concept Only จำนวน 5 ไอเดีย\nที่คนซื้อมองเห็นแล้วเข้าใจทันทีว่า “อ๋อ ภาพนี้แต่งบ้านสวย” มีเรื่องเล่า และอารมณ์ศิลปิน\n(อ่าน วิเคราะห์ให้เข้าใจ แล้วค่อยค้นหาไอเดียและอธิบายให้ฟัง)\n\nเงื่อนไข:\n1. ห้ามซ้ำ และห้ามใกล้เคียงกับแนวเดิมในชีท ทั้ง subject, mood, scene, object family, composition, View Type, color mood และ shop section pattern\n2. ห้ามคิดต่อยอดจากของเดิมแบบเปลี่ยนของเล็กน้อย ให้คิดเป็น “โลกใหม่” ของภาพจริง ไม่ใช่ variation ของงานเก่า\n3. ต้องใช้ธีม 1-5 ด้านบนให้ครบ โดย 1 ธีม = 1 ไอเดีย และ Best Shop Section ต้องตรงกับ section ของธีมนั้น\n4. ห้ามล็อกภาพตาม planner ล่วงหน้า ให้ GPT คิด subject / scene / object / view type ใหม่หลังอ่านชีทเท่านั้น\n5. ให้ไอเดียทั้ง 5 ภาพหลากหลายมาก ทั้ง subject family, scene family, View Type, orientation, color mood และ composition\n6. ให้สุ่มหมวดหมู่ให้กว้าง เช่น architecture detail, quiet workshop object, vintage kitchen object, weather scene, farm detail, porch object, old book/library mood, simple food still life, handmade object, countryside animal, seasonal nature detail, soft abstract landscape\n7. ทุกไอเดียต้องเป็น printable wall art ที่ขายบน Etsy ได้จริง เหมาะกับ retirement lifestyle, peaceful home decor, slow living และ calm next chapter\n8. ห้ามทำ SEO, ห้ามทำ mockup prompt, ห้ามสร้างภาพจริง, ห้ามทำไฟล์ดาวน์โหลด\n9. ใน text block ให้ใส่เฉพาะ English image idea prompt สั้น ๆ เท่านั้น ห้ามใส่ Style block หรือ Premium Texture block\n\nฟอร์แมตต่อไอเดีย:\n[เลข] English Idea Title\nหมวดหมู่:\nBest Shop Section:\nประเภทภาพ:\nView Type:\nOrientation:\nColor Mood:\nColor Direction:\nอธิบายภาพภาษาไทย:\nเหตุผลที่ไม่ซ้ำกับชีท:\n\n\`\`\`text\nEnglish short image idea prompt only\n\`\`\``;
}
function countSectionsForMonth(month) {
  const counts = Object.fromEntries(sections.map((s) => [s, 0]));
  for (let d = 1; d <= month.days; d += 1) {
    getDailyPlan(month, d).forEach((item) => { counts[item.section] += 1; });
  }
  return counts;
}
function parseCSV(text) {
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"' && inQuotes && next === '"') {
      value += '"';
      i += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(value.trim());
      value = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(value.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      value = "";
    } else {
      value += char;
    }
  }
  row.push(value.trim());
  if (row.some(Boolean)) rows.push(row);
  const headers = rows[0] || [];
  return rows.slice(1).map((cells, index) => {
    const record = { _rowNumber: index + 2 };
    headers.forEach((header, hIndex) => {
      record[header || `Column ${hIndex + 1}`] = cells[hIndex] || "";
    });
    return record;
  });
}
function loadDone() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}
function saveDone(done) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
  } catch {}
}

export default function App() {
  const [monthIndex, setMonthIndex] = useState(0);
  const [selectedDay, setSelectedDay] = useState(1);
  const [done, setDone] = useState({});
  const [view, setView] = useState("all");
  const [copied, setCopied] = useState(false);
  const [quickCopied, setQuickCopied] = useState(null);
  const [ideaCopied, setIdeaCopied] = useState(null);
  const [ideaRows, setIdeaRows] = useState([]);
  const [ideaLoading, setIdeaLoading] = useState(false);
  const [ideaError, setIdeaError] = useState("");
  const [ideaSearch, setIdeaSearch] = useState("");
  const [ideaSectionFilter, setIdeaSectionFilter] = useState("all");

  useEffect(() => setDone(loadDone()), []);
  useEffect(() => saveDone(done), [done]);

  const month = months[monthIndex];
  const selectedKey = getDateKey(month, selectedDay);
  const selectedPlan = getDailyPlan(month, selectedDay);
  const selectedPrompt = buildPrompt(month, selectedDay);
  const monthCounts = useMemo(() => countSectionsForMonth(month), [month]);
  const monthDoneCount = Array.from({ length: month.days }, (_, i) => i + 1).filter((day) => done[getDateKey(month, day)]).length;
  const progress = Math.round((monthDoneCount / month.days) * 100);
  const totalDays = months.reduce((sum, m) => sum + m.days, 0);
  const totalDone = months.reduce((sum, m) => {
    let count = 0;
    for (let d = 1; d <= m.days; d += 1) if (done[getDateKey(m, d)]) count += 1;
    return sum + count;
  }, 0);
  const totalCounts = useMemo(() => {
    const total = Object.fromEntries(sections.map((s) => [s, 0]));
    months.forEach((m) => {
      const counts = countSectionsForMonth(m);
      sections.forEach((s) => { total[s] += counts[s]; });
    });
    return total;
  }, []);

  async function copyText(text, onDone) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    onDone?.();
  }
  async function copyPrompt() {
    await copyText(selectedPrompt, () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  }
  async function copyQuickPrompt(prompt) {
    await copyText(prompt.text, () => {
      setQuickCopied(prompt.id);
      setTimeout(() => setQuickCopied(null), 1200);
    });
  }
  function toggleDone(day = selectedDay) {
    const key = getDateKey(month, day);
    setDone((prev) => ({ ...prev, [key]: !prev[key] }));
  }
  function dayVisible(day) {
    const isDone = !!done[getDateKey(month, day)];
    if (view === "done") return isDone;
    if (view === "notdone") return !isDone;
    return true;
  }
  async function refreshIdeaLog() {
    setIdeaLoading(true);
    setIdeaError("");
    try {
      const response = await fetch(`${SHEET_CSV_URL}&cacheBust=${Date.now()}`);
      if (!response.ok) throw new Error("CSV fetch failed");
      const text = await response.text();
      setIdeaRows(parseCSV(text));
    } catch (error) {
      setIdeaError("โหลดชีทไม่ได้ ลองเช็กว่า Publish เป็น CSV แล้ว หรือกด Refresh อีกครั้ง");
    } finally {
      setIdeaLoading(false);
    }
  }
  useEffect(() => { refreshIdeaLog(); }, []);

  const ideaHeaders = ideaRows[0] ? Object.keys(ideaRows[0]).filter((key) => key !== "_rowNumber") : [];
  const sectionHeader = ideaHeaders.find((h) => h.toLowerCase().includes("section")) || ideaHeaders.find((h) => h.toLowerCase().includes("หมวด")) || "";
  const titleHeader = ideaHeaders.find((h) => h.toLowerCase().includes("title")) || ideaHeaders.find((h) => h.toLowerCase().includes("idea")) || ideaHeaders.find((h) => h.toLowerCase().includes("ชื่อ")) || ideaHeaders[0] || "";
  const visibleIdeaHeaders = ideaHeaders.slice(0, 8);
  const ideaSections = Array.from(new Set(ideaRows.map((row) => row[sectionHeader]).filter(Boolean))).sort();
  const filteredIdeaRows = ideaRows.filter((row) => {
    const searchText = Object.values(row).join(" ").toLowerCase();
    const matchesSearch = searchText.includes(ideaSearch.toLowerCase());
    const matchesSection = ideaSectionFilter === "all" || row[sectionHeader] === ideaSectionFilter;
    return matchesSearch && matchesSection;
  });
  async function copyIdeaRow(row, index) {
    const text = visibleIdeaHeaders.map((header) => `${header}: ${row[header] || ""}`).join("\n");
    await copyText(text, () => {
      setIdeaCopied(index);
      setTimeout(() => setIdeaCopied(null), 1200);
    });
  }

  const calendarDays = Array.from({ length: month.days }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-[#f8f3ec] p-4 text-stone-900 md:p-8">
      <main className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-[2rem] bg-gradient-to-br from-stone-900 via-stone-800 to-[#5d4b3f] p-6 text-white shadow-xl md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
                <Sparkles className="h-4 w-4" /> ByeTension Web Dashboard
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">Content Planner Calendar</h1>
              <p className="mt-3 max-w-3xl text-stone-200">แดชบอร์ดปฏิทิน + Quick Prompt + Idea Log จาก Google Sheet</p>
            </div>
            <div className="grid min-w-[280px] grid-cols-3 gap-3">
              <Stat label="Total Done" value={`${totalDone}/${totalDays}`} dark />
              <Stat label="This Month" value={`${monthDoneCount}/${month.days}`} dark />
              <Stat label="Slots/Day" value="5" dark />
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-4">
          <div className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm lg:col-span-3">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm text-stone-500"><CalendarDays className="h-4 w-4" /> Selected Month</div>
                <h2 className="mt-1 text-2xl font-semibold">{month.label}</h2>
                <p className="mt-1 text-stone-600"><b>{month.focus}</b> — {month.note}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {months.map((m, index) => (
                  <button key={m.key} onClick={() => { setMonthIndex(index); setSelectedDay(1); }} className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${index === monthIndex ? "border-stone-900 bg-stone-900 text-white" : "border-stone-200 bg-stone-50 hover:bg-stone-100"}`}>{m.short}</button>
                ))}
              </div>
            </div>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-stone-100"><div className="h-full rounded-full bg-emerald-600" style={{ width: `${progress}%` }} /></div>
            <div className="mt-2 text-sm text-stone-500">{progress}% complete this month</div>
          </div>
          <div className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-stone-500"><Filter className="h-4 w-4" /> View Filter</div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[["all", "All"], ["notdone", "Open"], ["done", "Done"]].map(([value, label]) => (
                <button key={value} onClick={() => setView(value)} className={`rounded-xl border px-3 py-2 text-sm font-semibold ${view === value ? "border-stone-900 bg-stone-900 text-white" : "border-stone-200 bg-stone-50"}`}>{label}</button>
              ))}
            </div>
            <button onClick={() => setDone({})} className="mt-3 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-semibold hover:bg-stone-100">Reset Done</button>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {quickPrompts.map((prompt) => (
            <div key={prompt.id} className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-stone-500">Quick Copy Command</div>
                  <h3 className="mt-1 text-xl font-semibold">{prompt.title}</h3>
                  <p className="mt-1 text-sm text-stone-600">{prompt.description}</p>
                </div>
                <button onClick={() => copyQuickPrompt(prompt)} className={`shrink-0 rounded-2xl px-4 py-3 text-sm font-bold ${quickCopied === prompt.id ? "bg-emerald-600 text-white" : "bg-stone-900 text-white hover:bg-stone-700"}`}>{quickCopied === prompt.id ? "Copied" : "Copy"}</button>
              </div>
              <div className="mt-4 max-h-36 overflow-auto whitespace-pre-wrap rounded-2xl border border-stone-200 bg-stone-50 p-4 text-xs leading-relaxed text-stone-700">{prompt.text}</div>
            </div>
          ))}
        </section>

        <section className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-700"><Sparkles className="h-4 w-4" /> Idea Log From Google Sheet</div>
              <h2 className="mt-3 text-2xl font-semibold">ByeTension Idea Log</h2>
              <p className="mt-1 text-sm text-stone-600">ดึงข้อมูลจาก Google Sheet แบบอ่านอย่างเดียว ใช้ Search / Filter / Copy ได้</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-stone-400" />
                <input value={ideaSearch} onChange={(e) => setIdeaSearch(e.target.value)} placeholder="Search idea..." className="rounded-2xl border border-stone-200 bg-stone-50 py-3 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-stone-900" />
              </div>
              <select value={ideaSectionFilter} onChange={(e) => setIdeaSectionFilter(e.target.value)} className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-stone-900">
                <option value="all">All Sections</option>
                {ideaSections.map((section) => <option key={section} value={section}>{section}</option>)}
              </select>
              <button onClick={refreshIdeaLog} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-stone-900 px-5 py-3 text-sm font-bold text-white hover:bg-stone-700"><RefreshCw className={`h-4 w-4 ${ideaLoading ? "animate-spin" : ""}`} /> Refresh</button>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            <Stat label="Total Rows" value={ideaRows.length} />
            <Stat label="Showing" value={filteredIdeaRows.length} />
            <Stat label="Source" value="Published CSV" />
          </div>
          {ideaError && <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{ideaError}</div>}
          <div className="mt-4 max-h-[520px] overflow-auto rounded-2xl border border-stone-200">
            <table className="min-w-full text-left text-sm">
              <thead className="sticky top-0 bg-stone-900 text-white">
                <tr>
                  <th className="px-4 py-3 font-semibold">Copy</th>
                  {visibleIdeaHeaders.map((header) => <th key={header} className="whitespace-nowrap px-4 py-3 font-semibold">{header}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 bg-white">
                {ideaLoading && <tr><td colSpan={visibleIdeaHeaders.length + 1} className="px-4 py-8 text-center text-stone-500">Loading idea log...</td></tr>}
                {!ideaLoading && filteredIdeaRows.length === 0 && <tr><td colSpan={visibleIdeaHeaders.length + 1} className="px-4 py-8 text-center text-stone-500">No matching ideas found.</td></tr>}
                {!ideaLoading && filteredIdeaRows.slice(0, 250).map((row, index) => (
                  <tr key={`${row._rowNumber}-${index}`} className="hover:bg-stone-50">
                    <td className="px-4 py-3 align-top"><button onClick={() => copyIdeaRow(row, index)} className={`rounded-xl px-3 py-2 text-xs font-bold ${ideaCopied === index ? "bg-emerald-600 text-white" : "bg-stone-100 text-stone-800 hover:bg-stone-200"}`}>{ideaCopied === index ? "Copied" : "Copy"}</button></td>
                    {visibleIdeaHeaders.map((header) => <td key={header} className="max-w-xs px-4 py-3 align-top"><div className={header === titleHeader ? "font-semibold text-stone-900" : "text-stone-700"}>{row[header] || "—"}</div></td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-5">
          <div className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm xl:col-span-3">
            <div className="mb-3 grid grid-cols-7 gap-2 text-center text-xs font-bold text-stone-500">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d}>{d}</div>)}</div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: month.startOffset }, (_, i) => <div key={`blank-${i}`} className="min-h-24" />)}
              {calendarDays.map((day) => {
                if (!dayVisible(day)) return null;
                const key = getDateKey(month, day);
                const isDone = !!done[key];
                const isSelected = day === selectedDay;
                return (
                  <button key={key} onClick={() => setSelectedDay(day)} className={`min-h-28 rounded-2xl border p-2 text-left shadow-sm transition ${isSelected ? "border-stone-900 ring-2 ring-stone-900" : "border-stone-200"} ${isDone ? "bg-emerald-50" : "bg-stone-50 hover:bg-white"}`}>
                    <div className="flex items-center justify-between"><span className="font-bold">{day}</span>{isDone ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <span className="h-4 w-4 rounded-full border border-stone-300" />}</div>
                    <div className="mt-2 space-y-1">{getDailyPlan(month, day).slice(0, 3).map((p) => <div key={`${key}-${p.number}`} className={`h-1.5 rounded-full border ${sectionStyle[p.section] || "bg-stone-200 border-stone-300"}`} />)}<div className="pt-1 text-[10px] text-stone-500">5 theme slots</div></div>
                  </button>
                );
              })}
            </div>
          </div>
          <aside className="space-y-5 xl:col-span-2">
            <div className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div><div className="text-sm text-stone-500">Selected Day</div><h2 className="text-3xl font-semibold">{selectedKey}</h2><p className="mt-1 text-stone-600">{month.focus}</p></div>
                <button onClick={() => toggleDone()} className={`rounded-2xl border px-4 py-2 text-sm font-bold transition ${done[selectedKey] ? "border-emerald-600 bg-emerald-600 text-white" : "border-stone-200 bg-stone-50 hover:bg-stone-100"}`}>{done[selectedKey] ? "Done ✓" : "Mark Done"}</button>
              </div>
              <div className="mt-5 space-y-3">{selectedPlan.map((item) => <div key={item.number} className={`rounded-2xl border p-4 ${sectionStyle[item.section] || "bg-stone-50 border-stone-200"}`}><div className="text-xs opacity-70">Theme {item.number}</div><div className="font-bold">{item.section}</div><div className="mt-1 text-sm opacity-90">{item.direction}</div></div>)}</div>
              <button onClick={copyPrompt} className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 font-bold transition ${copied ? "bg-emerald-600 text-white" : "bg-stone-900 text-white hover:bg-stone-700"}`}>{copied ? <ClipboardCheck className="h-5 w-5" /> : <Clipboard className="h-5 w-5" />}{copied ? "Copied Prompt" : "Copy Prompt For GPT"}</button>
            </div>
            <div className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm"><h3 className="text-xl font-semibold">Month Section Mix</h3><div className="mt-4 space-y-2">{sections.map((s) => <div key={s} className="flex items-center justify-between gap-3 text-sm"><span className={`rounded-xl border px-3 py-1 ${sectionStyle[s]}`}>{s}</span><b>{monthCounts[s]}</b></div>)}</div></div>
          </aside>
        </section>

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm"><h3 className="text-xl font-semibold">Overall Section Plan</h3><p className="mt-1 text-sm text-stone-600">รวม June–December 2026 จากปฏิทินนี้</p><div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">{sections.map((s) => <div key={s} className={`rounded-2xl border p-3 ${sectionStyle[s]}`}><div className="text-sm font-semibold">{s}</div><div className="mt-1 text-2xl font-bold">{totalCounts[s]}</div></div>)}</div></div>
          <div className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm"><h3 className="text-xl font-semibold">How This Planner Works</h3><div className="mt-4 space-y-3 text-stone-700"><p><b>1.</b> เลือกเดือนและวันที่ต้องการทำงาน</p><p><b>2.</b> กด Copy Prompt For GPT แล้วเอาไปวางในแชท</p><p><b>3.</b> ใช้ Idea Log เช็กงานเก่าจากชีท</p><p><b>4.</b> ทำครบวันนั้นแล้วกด Mark Done</p></div><div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">Done เก็บใน browser เครื่องนี้ ส่วน Idea Log ดึงจาก Published CSV ของ Google Sheet</div></div>
        </section>
      </main>
    </div>
  );
}

function Stat({ label, value, dark = false }) {
  return <div className={`rounded-2xl p-4 ${dark ? "bg-white/10 backdrop-blur" : "border border-stone-200 bg-stone-50"}`}><div className={dark ? "text-xs text-stone-300" : "text-xs text-stone-500"}>{label}</div><div className="mt-1 text-2xl font-bold">{value}</div></div>;
}
