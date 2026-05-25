import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, CheckCircle2, Clipboard, ClipboardCheck, Sparkles, Filter, RotateCcw } from "lucide-react";

const STORAGE_KEY = "byetension_web_dashboard_jun_dec_2026_v1";

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
  { key: "2026-06", label: "June 2026", short: "Jun", focus: "Summer Seasonal Launch", note: "เริ่ม Seasonal ตั้งแต่เดือนหน้า แต่ยังไม่ล็อกภาพจริง ให้ GPT เช็กชีทแล้วแตกไอเดียสด", days: 30, startOffset: 1 },
  { key: "2026-07", label: "July 2026", short: "Jul", focus: "Late Summer + Early Fall Prep", note: "เริ่มขยับเข้า early fall แบบนุ่ม ๆ แต่ยังคุม summer และ evergreen ให้ร้านไม่เอียง", days: 31, startOffset: 3 },
  { key: "2026-08", label: "August 2026", short: "Aug", focus: "Fall Soft Prep + Cozy Home", note: "เพิ่ม cozy home, fall-soft, slow living และ cottage mood เตรียม Q4", days: 31, startOffset: 6 },
  { key: "2026-09", label: "September 2026", short: "Sep", focus: "Early Winter / Soft Seasonal Prep", note: "เริ่ม winter และ early holiday แบบเบา ๆ ไม่ Christmas จ๋าเกินไป", days: 30, startOffset: 2 },
  { key: "2026-10", label: "October 2026", short: "Oct", focus: "Holiday Ramp Up", note: "ดัน seasonal / holiday ให้ชัดขึ้น แต่ยังต้องดูเป็น home decor ไม่ใช่โปสเตอร์เทศกาล", days: 31, startOffset: 4 },
  { key: "2026-11", label: "November 2026", short: "Nov", focus: "Christmas / Gift Push", note: "เดือนขาย giftable printable, retirement gift, grandparent gift และ cozy holiday decor", days: 30, startOffset: 0 },
  { key: "2026-12", label: "December 2026", short: "Dec", focus: "Holiday + Winter Shift", note: "ครึ่งแรก holiday ได้ ครึ่งหลังหมุนไป winter / New Year / home refresh", days: 31, startOffset: 2 },
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
  "Seasonal Wall Art": [
    "open seasonal direction for the month, no locked subject",
    "seasonal home decor direction, no locked object or scene",
    "soft seasonal wall art direction, GPT must choose fresh visual after sheet check",
    "seasonal nature or home mood direction, no pre-decided image",
    "holiday or seasonal decor direction when appropriate for the month, no locked subject",
  ],
  "Retirement Wall Art": [
    "core retirement lifestyle / next chapter direction, no locked subject",
    "peaceful home or scenic retirement direction, no locked scene",
    "slow living retirement mood direction, GPT must choose fresh idea after sheet check",
    "meaningful calm home decor direction, no pre-decided image",
    "broad peaceful retirement wall art direction, no locked subject",
  ],
  "Cottage Garden Wall Art": [
    "cottage garden / floral / botanical direction, no locked plant or scene",
    "garden-inspired decor direction, GPT must choose fresh subject after sheet check",
    "botanical or cottage nature direction, no locked object",
    "soft garden wall art direction, no pre-decided visual",
    "floral, greenhouse, garden, or botanical family direction only, no locked image",
  ],
  "Animal & Nature Wall Art": [
    "animal or nature companion direction, no locked animal",
    "calm animal-led or nature-led wall art direction, GPT must choose fresh subject",
    "peaceful wildlife / pet / nature companion direction, no locked scene",
    "adult decor-friendly animal or nature mood direction, no pre-decided subject",
    "gentle nature companion direction, avoid repeating animal family from sheet",
  ],
  "Still Life Wall Art": [
    "slow living object / hobby / tabletop direction, no locked object",
    "object-led decorative wall art direction, GPT must choose fresh object family",
    "cozy still life or hobby setup direction, no pre-decided object",
    "quiet home object direction, avoid repeating prop family from sheet",
    "nostalgic object / handmade / kitchen / library mood direction, no locked image",
  ],
  "Travel Window Views": [
    "view-led / travel-feeling direction, no locked place or subject",
    "window, balcony, porch, road, or destination-feeling direction, no locked location",
    "peaceful scenic escape direction, GPT must choose fresh place-feeling after sheet check",
    "travel memory / view-led wall art direction, no famous place, no locked scene",
    "open scenic or travel-view direction, no pre-decided visual",
  ],
  "Leisure Sports Wall Art": [
    "calm leisure sport direction, no locked sport object",
    "retirement-friendly leisure / hobby-sport direction, GPT must choose fresh subject",
    "peaceful outdoor leisure direction, no action sport, no locked scene",
    "slow sport or leisure lifestyle direction, no pre-decided object",
    "golf, tennis, fishing, boating, or walking-trail family direction only, choose fresh after sheet check",
  ],
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

const rotationExtras = [
  "Travel Window Views",
  "Leisure Sports Wall Art",
  "Cottage Garden Wall Art",
  "Animal & Nature Wall Art",
  "Still Life Wall Art",
  "Retirement Wall Art",
];

function pad(n) { return String(n).padStart(2, "0"); }
function getDateKey(month, day) { return `${month.key}-${pad(day)}`; }

function shuffleDailySections(monthKey, day) {
  const base = [...(monthSectionRatios[monthKey] || monthSectionRatios["2026-06"] )];
  const extra = rotationExtras[(day + monthKey.charCodeAt(6)) % rotationExtras.length];
  if (!base.includes(extra)) base[4] = extra;
  const shift = day % base.length;
  const rotated = [...base.slice(shift), ...base.slice(0, shift)];
  const result = [];
  for (const section of rotated) if (result.length < 5) result.push(section);
  while (result.length < 5) result.push(rotationExtras[(day + result.length) % rotationExtras.length]);
  return result.slice(0, 5);
}

function getDailyPlan(month, day) {
  const dailySections = shuffleDailySections(month.key, day);
  return dailySections.map((section, index) => {
    const dirs = openDirections[section];
    const dir = dirs[(day + index + month.key.length) % dirs.length];
    return { number: index + 1, section, direction: dir };
  });
}

function buildPrompt(month, day) {
  const date = getDateKey(month, day);
  const plan = getDailyPlan(month, day);
  const themeList = plan.map((item) => `${item.number}. ${item.section} — ${item.direction}`).join("\n");

  return `อ่านชีท ByeTension_Simple_Idea_Log_Checkbox ก่อน\n\nวันที่ลง: ${date}\nMonthly Focus: ${month.focus}\n\nธีม 1-5 ที่ต้องใช้รอบนี้:\n${themeList}\n\nขอไอเดีย Wall Art Product Concept Only จำนวน 5 ไอเดีย\nที่คนซื้อมองเห็นแล้วเข้าใจทันทีว่า “อ๋อ ภาพนี้แต่งบ้านสวย” มีเรื่องเล่า และอารมณ์ศิลปิน\n(อ่าน วิเคราะห์ให้เข้าใจ แล้วค่อยค้นหาไอเดียและอธิบายให้ฟัง)\n\nเงื่อนไข:\n1. ห้ามซ้ำ และห้ามใกล้เคียงกับแนวเดิมในชีท ทั้ง subject, mood, scene, object family, composition, View Type, color mood และ shop section pattern\n2. ห้ามคิดต่อยอดจากของเดิมแบบเปลี่ยนของเล็กน้อย ให้คิดเป็น “โลกใหม่” ของภาพจริง ไม่ใช่ variation ของงานเก่า\n3. ต้องใช้ธีม 1-5 ด้านบนให้ครบ โดย 1 ธีม = 1 ไอเดีย และ Best Shop Section ต้องตรงกับ section ของธีมนั้น\n4. ห้ามล็อกภาพตาม planner ล่วงหน้า ให้ GPT คิด subject / scene / object / view type ใหม่หลังอ่านชีทเท่านั้น\n5. ให้ไอเดียทั้ง 5 ภาพหลากหลายมาก ทั้ง subject family, scene family, View Type, orientation, color mood และ composition\n6. ให้สุ่มหมวดหมู่ให้กว้าง เช่น architecture detail, quiet workshop object, vintage kitchen object, weather scene, farm detail, porch object, old book/library mood, simple food still life, handmade object, countryside animal, seasonal nature detail, soft abstract landscape\n7. ทุกไอเดียต้องเป็น printable wall art ที่ขายบน Etsy ได้จริง เหมาะกับ retirement lifestyle, peaceful home decor, slow living และ calm next chapter\n8. ห้ามทำ SEO, ห้ามทำ mockup prompt, ห้ามสร้างภาพจริง, ห้ามทำไฟล์ดาวน์โหลด\n9. ใน text block ให้ใส่เฉพาะ English image idea prompt สั้น ๆ เท่านั้น ห้ามใส่ Style block หรือ Premium Texture block\n\nฟอร์แมตต่อไอเดีย:\n[เลข] English Idea Title\nหมวดหมู่:\nBest Shop Section:\nประเภทภาพ:\nView Type:\nOrientation:\nColor Mood:\nColor Direction:\nอธิบายภาพภาษาไทย:\nเหตุผลที่ไม่ซ้ำกับชีท:\n\n\`\`\`text\nEnglish short image idea prompt only\n\`\`\``;
}

function countSectionsForMonth(month) {
  const counts = Object.fromEntries(sections.map((s) => [s, 0]));
  for (let d = 1; d <= month.days; d++) {
    for (const item of getDailyPlan(month, d)) counts[item.section] += 1;
  }
  return counts;
}

function loadDone() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch { return {}; }
}

function saveDone(done) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(done)); } catch {}
}

export default function App() {
  const [monthIndex, setMonthIndex] = useState(0);
  const [selectedDay, setSelectedDay] = useState(1);
  const [done, setDone] = useState({});
  const [copied, setCopied] = useState(false);
  const [quickCopied, setQuickCopied] = useState(null);
  const [view, setView] = useState("all");

  useEffect(() => setDone(loadDone()), []);
  useEffect(() => saveDone(done), [done]);

  const month = months[monthIndex];
  const selectedKey = getDateKey(month, selectedDay);
  const selectedPlan = getDailyPlan(month, selectedDay);
  const selectedPrompt = buildPrompt(month, selectedDay);

  const monthCounts = useMemo(() => countSectionsForMonth(month), [month]);
  const monthDoneCount = Array.from({ length: month.days }, (_, i) => i + 1).filter((day) => done[getDateKey(month, day)]).length;
  const progress = Math.round((monthDoneCount / month.days) * 100);
  const totalCounts = useMemo(() => {
    const total = Object.fromEntries(sections.map((s) => [s, 0]));
    for (const m of months) {
      const counts = countSectionsForMonth(m);
      for (const s of sections) total[s] += counts[s];
    }
    return total;
  }, []);
  const totalDone = months.reduce((sum, m) => {
    let c = 0;
    for (let d = 1; d <= m.days; d++) if (done[getDateKey(m, d)]) c++;
    return sum + c;
  }, 0);
  const totalDays = months.reduce((sum, m) => sum + m.days, 0);

  function toggleDone(day = selectedDay) {
    const key = getDateKey(month, day);
    setDone((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function copyText(text, onDone) {
    try { await navigator.clipboard.writeText(text); }
    catch {
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
      setTimeout(() => setCopied(false), 1400);
    });
  }

  async function copyQuickPrompt(prompt) {
    await copyText(prompt.text, () => {
      setQuickCopied(prompt.id);
      setTimeout(() => setQuickCopied(null), 1400);
    });
  }

  function dayVisible(day) {
    const isDone = !!done[getDateKey(month, day)];
    if (view === "done") return isDone;
    if (view === "notdone") return !isDone;
    return true;
  }

  const calendarDays = Array.from({ length: month.days }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-[#f8f3ec] text-stone-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.header initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-stone-900 via-stone-800 to-[#5d4b3f] text-white p-6 md:p-8 shadow-xl">
          <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-amber-200/20 blur-3xl" />
          <div className="absolute -left-16 -bottom-16 h-52 w-52 rounded-full bg-sage-200/20 blur-3xl" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur"><Sparkles className="h-4 w-4" /> ByeTension Web Dashboard</div>
              <h1 className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight">Content Planner Calendar</h1>
              <p className="mt-3 max-w-3xl text-stone-200 text-base md:text-lg">แดชบอร์ดปฏิทินสำหรับวาง section/theme รายวัน กดก็อป prompt ไปใช้กับ GPT และติ๊ก Done เป็นรายวันโดยไม่ล็อกภาพจริงล่วงหน้า</p>
            </div>
            <div className="grid grid-cols-3 gap-3 min-w-[280px]">
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur"><div className="text-xs text-stone-300">Total Done</div><div className="text-2xl font-bold">{totalDone}/{totalDays}</div></div>
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur"><div className="text-xs text-stone-300">This Month</div><div className="text-2xl font-bold">{monthDoneCount}/{month.days}</div></div>
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur"><div className="text-xs text-stone-300">Slots/Day</div><div className="text-2xl font-bold">5</div></div>
            </div>
          </div>
        </motion.header>

        <section className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          <div className="lg:col-span-3 rounded-[2rem] bg-white border border-stone-200 shadow-sm p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="flex items-center gap-2 text-stone-500 text-sm"><CalendarDays className="h-4 w-4" /> Selected Month</div>
                <h2 className="text-2xl font-semibold mt-1">{month.label}</h2>
                <p className="text-stone-600 mt-1"><b>{month.focus}</b> — {month.note}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {months.map((m, index) => (
                  <button key={m.key} onClick={() => { setMonthIndex(index); setSelectedDay(1); }} className={`rounded-2xl px-4 py-2 text-sm font-semibold border transition ${index === monthIndex ? "bg-stone-900 text-white border-stone-900" : "bg-stone-50 hover:bg-stone-100 border-stone-200"}`}>{m.short}</button>
                ))}
              </div>
            </div>
            <div className="mt-5 h-3 rounded-full bg-stone-100 overflow-hidden"><div className="h-full bg-emerald-600 rounded-full" style={{ width: `${progress}%` }} /></div>
            <div className="mt-2 text-sm text-stone-500">{progress}% complete this month</div>
          </div>
          <div className="rounded-[2rem] bg-white border border-stone-200 shadow-sm p-5">
            <div className="flex items-center gap-2 text-stone-500 text-sm"><Filter className="h-4 w-4" /> View Filter</div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {["all", "notdone", "done"].map((v) => (
                <button key={v} onClick={() => setView(v)} className={`rounded-xl px-3 py-2 text-sm font-semibold border ${view === v ? "bg-stone-900 text-white border-stone-900" : "bg-stone-50 border-stone-200"}`}>{v === "all" ? "All" : v === "notdone" ? "Open" : "Done"}</button>
              ))}
            </div>
            <button onClick={() => setDone({})} className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-semibold hover:bg-stone-100"><RotateCcw className="h-4 w-4" /> Reset Done</button>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {quickPrompts.map((prompt) => (
            <div key={prompt.id} className="rounded-[2rem] bg-white border border-stone-200 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4">
                <div><div className="text-sm text-stone-500">Quick Copy Command</div><h3 className="mt-1 text-xl font-semibold">{prompt.title}</h3><p className="mt-1 text-sm text-stone-600">{prompt.description}</p></div>
                <button onClick={() => copyQuickPrompt(prompt)} className={`shrink-0 inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold transition ${quickCopied === prompt.id ? "bg-emerald-600 text-white" : "bg-stone-900 text-white hover:bg-stone-700"}`}>{quickCopied === prompt.id ? <ClipboardCheck className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}{quickCopied === prompt.id ? "Copied" : "Copy"}</button>
              </div>
              <div className="mt-4 max-h-36 overflow-auto rounded-2xl bg-stone-50 border border-stone-200 p-4 text-xs text-stone-700 whitespace-pre-wrap leading-relaxed">{prompt.text}</div>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <div className="xl:col-span-3 rounded-[2rem] bg-white border border-stone-200 shadow-sm p-5">
            <div className="grid grid-cols-7 gap-2 mb-3 text-center text-xs font-bold text-stone-500">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d}>{d}</div>)}</div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: month.startOffset }, (_, i) => <div key={`blank-${i}`} className="min-h-24" />)}
              {calendarDays.map((day) => {
                if (!dayVisible(day)) return null;
                const key = getDateKey(month, day);
                const isDone = !!done[key];
                const isSelected = day === selectedDay;
                const plan = getDailyPlan(month, day);
                return (
                  <button key={key} onClick={() => setSelectedDay(day)} className={`min-h-28 rounded-2xl border p-2 text-left transition shadow-sm ${isSelected ? "ring-2 ring-stone-900 border-stone-900" : "border-stone-200"} ${isDone ? "bg-emerald-50" : "bg-stone-50 hover:bg-white"}`}>
                    <div className="flex items-center justify-between"><span className="font-bold">{day}</span>{isDone ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <span className="h-4 w-4 rounded-full border border-stone-300" />}</div>
                    <div className="mt-2 space-y-1">{plan.slice(0, 3).map((p) => <div key={`${key}-${p.number}`} className={`h-1.5 rounded-full border ${sectionStyle[p.section] || "bg-stone-200 border-stone-300"}`} />)}<div className="text-[10px] text-stone-500 pt-1">5 theme slots</div></div>
                  </button>
                );
              })}
            </div>
          </div>
          <aside className="xl:col-span-2 space-y-5">
            <motion.div key={selectedKey} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] bg-white border border-stone-200 shadow-sm p-5">
              <div className="flex items-start justify-between gap-3">
                <div><div className="text-sm text-stone-500">Selected Day</div><h2 className="text-3xl font-semibold">{selectedKey}</h2><p className="text-stone-600 mt-1">{month.focus}</p></div>
                <button onClick={() => toggleDone()} className={`rounded-2xl px-4 py-2 text-sm font-bold border transition ${done[selectedKey] ? "bg-emerald-600 text-white border-emerald-600" : "bg-stone-50 border-stone-200 hover:bg-stone-100"}`}>{done[selectedKey] ? "Done ✓" : "Mark Done"}</button>
              </div>
              <div className="mt-5 space-y-3">{selectedPlan.map((item) => <div key={item.number} className={`rounded-2xl border p-4 ${sectionStyle[item.section] || "bg-stone-50 border-stone-200"}`}><div className="text-xs opacity-70">Theme {item.number}</div><div className="font-bold">{item.section}</div><div className="text-sm mt-1 opacity-90">{item.direction}</div></div>)}</div>
              <button onClick={copyPrompt} className={`mt-5 w-full inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-4 font-bold transition ${copied ? "bg-emerald-600 text-white" : "bg-stone-900 text-white hover:bg-stone-700"}`}>{copied ? <ClipboardCheck className="h-5 w-5" /> : <Clipboard className="h-5 w-5" />}{copied ? "Copied Prompt" : "Copy Prompt For GPT"}</button>
            </motion.div>
            <div className="rounded-[2rem] bg-white border border-stone-200 shadow-sm p-5"><h3 className="text-xl font-semibold">Month Section Mix</h3><div className="mt-4 space-y-2">{sections.map((s) => <div key={s} className="flex items-center justify-between gap-3 text-sm"><span className={`rounded-xl border px-3 py-1 ${sectionStyle[s]}`}>{s}</span><b>{monthCounts[s]}</b></div>)}</div></div>
          </aside>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="rounded-[2rem] bg-white border border-stone-200 shadow-sm p-5"><h3 className="text-xl font-semibold">Overall Section Plan</h3><p className="text-stone-600 text-sm mt-1">รวม June–December 2026 จากปฏิทินนี้</p><div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">{sections.map((s) => <div key={s} className={`rounded-2xl border p-3 ${sectionStyle[s]}`}><div className="text-sm font-semibold">{s}</div><div className="text-2xl font-bold mt-1">{totalCounts[s]}</div></div>)}</div></div>
          <div className="rounded-[2rem] bg-white border border-stone-200 shadow-sm p-5"><h3 className="text-xl font-semibold">How This Planner Works</h3><div className="mt-4 space-y-3 text-stone-700"><p><b>1.</b> เลือกเดือนและวันที่ต้องการทำงาน</p><p><b>2.</b> ดู Theme 1–5 ที่เป็น section + open direction เท่านั้น</p><p><b>3.</b> กด Copy Prompt For GPT แล้วเอาไปวางในแชท</p><p><b>4.</b> GPT ต้องอ่านชีทก่อน แล้วค่อยแตกไอเดียใหม่ที่ไม่ซ้ำ</p><p><b>5.</b> ทำครบวันนั้นแล้วกด Mark Done</p></div><div className="mt-5 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-950">Planner นี้ไม่กำหนดทะเล นก ดอกไม้ หรือวัตถุใด ๆ ล่วงหน้า เพื่อไม่ให้ไอเดียซ้ำและไม่ทำให้ร้านตันเร็ว</div></div>
        </section>
      </div>
    </div>
  );
}
