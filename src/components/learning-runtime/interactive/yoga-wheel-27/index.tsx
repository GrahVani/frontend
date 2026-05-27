"use client";

import { useState, useMemo } from "react";
import { IAST } from "../../chrome/typography";

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const JADE = "#3A8C5A";
const VERMILION = "#A23A1E";
const AMBER = "#C28220";

interface YogaData {
  number: number;
  name: string;
  devanagari: string;
  nature: "auspicious" | "inauspicious" | "mixed";
  ruler: string;
  deity: string;
  effects: string;
}

const YOGA_DB: YogaData[] = [
  { number: 1, name: "Viṣkambha", devanagari: "विष्कम्भ", nature: "mixed", ruler: "Indra", deity: "Indra", effects: "Obstacles overcome with effort; mixed results depending on other pañcāṅga elements" },
  { number: 2, name: "Prīti", devanagari: "प्रीति", nature: "auspicious", ruler: "Viśvedevā", deity: "Viśvedevāḥ", effects: "Love, affection, prosperity, joy; excellent for social and domestic activities" },
  { number: 3, name: "Āyuṣmān", devanagari: "आयुष्मान्", nature: "auspicious", ruler: "Vāyu", deity: "Vāyu", effects: "Longevity, health, vitality; favourable for health-related actions" },
  { number: 4, name: "Saubhāgya", devanagari: "सौभाग्य", nature: "auspicious", ruler: "Brahmā", deity: "Brahmā", effects: "Good fortune, marital bliss, success; excellent for beginnings" },
  { number: 5, name: "Śobhana", devanagari: "शोभन", nature: "auspicious", ruler: "Indra", deity: "Indra", effects: "Splendour, brilliance, auspicious undertakings; fame and beauty" },
  { number: 6, name: "Atigaṇḍa", devanagari: "अतिगण्ड", nature: "inauspicious", ruler: "Śiva", deity: "Rudra", effects: "Danger, accidents, disputes; avoid new ventures and travel" },
  { number: 7, name: "Sukarman", devanagari: "सुकर्मन्", nature: "auspicious", ruler: "Viśvedevā", deity: "Viśvedevāḥ", effects: "Good deeds, merit, righteous actions rewarded; excellent for dharma" },
  { number: 8, name: "Dhṛti", devanagari: "धृति", nature: "auspicious", ruler: "Varuṇa", deity: "Varuṇa", effects: "Determination, steadiness, wealth accumulation; perseverance succeeds" },
  { number: 9, name: "Śūla", devanagari: "शूल", nature: "inauspicious", ruler: "Āditya", deity: "Nirṛti", effects: "Pain, conflict, violence; avoid journeys, disputes, and arguments" },
  { number: 10, name: "Gaṇḍa", devanagari: "गण्ड", nature: "inauspicious", ruler: "Soma", deity: "Yama", effects: "Obstacles, calamity, danger; extremely unfavourable for beginnings" },
  { number: 11, name: "Vṛddhi", devanagari: "वृद्धि", nature: "auspicious", ruler: "Viśvedevā", deity: "Viśvedevāḥ", effects: "Growth, increase, prosperity, learning; accumulation of wealth" },
  { number: 12, name: "Dhruva", devanagari: "ध्रुव", nature: "auspicious", ruler: "Pṛthivī", deity: "Pṛthivī", effects: "Stability, permanence, firm success; excellent for long-term commitments" },
  { number: 13, name: "Vyāghāta", devanagari: "व्याघात", nature: "inauspicious", ruler: "Vāyu", deity: "Vāyu", effects: "Violence, hindrance, obstruction; avoid all important undertakings" },
  { number: 14, name: "Harṣaṇa", devanagari: "हर्षण", nature: "auspicious", ruler: "Brahmā", deity: "Brahmā", effects: "Delight, exhilaration, joy, success; happiness and celebration" },
  { number: 15, name: "Vajra", devanagari: "वज्र", nature: "mixed", ruler: "Indra", deity: "Indra", effects: "Thunderbolt energy; forceful results, sudden and mixed outcomes" },
  { number: 16, name: "Siddhi", devanagari: "सिद्धि", nature: "auspicious", ruler: "Mitra", deity: "Gaṇapati", effects: "Accomplishment, perfection, magical attainment; success in all endeavours" },
  { number: 17, name: "Vyatīpāta", devanagari: "व्यतीपात", nature: "inauspicious", ruler: "Ravi", deity: "Ravi", effects: "Great calamity, reversal; most dangerous of all yogas — avoid everything new" },
  { number: 18, name: "Variyas", devanagari: "वरियस्", nature: "auspicious", ruler: "Viśvedevā", deity: "Viśvedevāḥ", effects: "Excellence, choice, noble deeds; distinction and honour" },
  { number: 19, name: "Parigha", devanagari: "परिघ", nature: "inauspicious", ruler: "Indra", deity: "Indra", effects: "Obstruction, iron-bar; imprisonment, confinement, limitation" },
  { number: 20, name: "Śiva", devanagari: "शिव", nature: "auspicious", ruler: "Pṛthivī", deity: "Śiva", effects: "Auspiciousness, divine grace, spiritual success; supreme auspiciousness" },
  { number: 21, name: "Siddha", devanagari: "सिद्ध", nature: "auspicious", ruler: "Pitṛ", deity: "Pitṛ", effects: "Attainment, perfection, completion; success in spiritual and material realms" },
  { number: 22, name: "Sādhya", devanagari: "साध्य", nature: "auspicious", ruler: "Brahmā", deity: "Brahmā", effects: "Feasible, achievable; good for all undertakings and resolutions" },
  { number: 23, name: "Śubha", devanagari: "शुभ", nature: "auspicious", ruler: "Lakṣmī", deity: "Lakṣmī", effects: "Auspiciousness, beauty, wealth, grace; excellent for all beginnings" },
  { number: 24, name: "Śukla", devanagari: "शुक्ल", nature: "mixed", ruler: "Brahmā", deity: "Brahmā", effects: "Purity, clarity; mixed but generally favourable for knowledge" },
  { number: 25, name: "Brahma", devanagari: "ब्रह्म", nature: "auspicious", ruler: "Indra", deity: "Brahmā", effects: "Knowledge, sacred study, priestly success; vedāntic and dharma pursuits" },
  { number: 26, name: "Indra", devanagari: "इन्द्र", nature: "auspicious", ruler: "Śiva", deity: "Indra", effects: "Royal power, lordship, victory, rulership; authority and command" },
  { number: 27, name: "Vaidhṛti", devanagari: "वैधृति", nature: "inauspicious", ruler: "Dharma", deity: "Dharma", effects: "Great obstruction; avoid all new ventures, journeys, and ceremonies" },
];

const NATURE_META: Record<string, { color: string; bg: string; label: string }> = {
  auspicious: { color: JADE, bg: "rgba(58,140,90,0.10)", label: "Auspicious" },
  inauspicious: { color: VERMILION, bg: "rgba(162,58,30,0.10)", label: "Inauspicious" },
  mixed: { color: AMBER, bg: "rgba(194,130,32,0.10)", label: "Mixed" },
};

function WheelDiagram({ selected, onSelect, filter }: { selected: number | null; onSelect: (n: number) => void; filter: string }) {
  const CX = 300;
  const CY = 300;
  const R_OUTER = 230;
  const R_INNER = 70;

  const getOpacity = (yoga: YogaData) => {
    if (filter === "all") return 1;
    return yoga.nature === filter ? 1 : 0.18;
  };

  const getFill = (yoga: YogaData, isActive: boolean) => {
    const col = NATURE_META[yoga.nature];
    if (isActive) return col.bg.replace("0.10", "0.28");
    return col.bg.replace("0.10", "0.05");
  };

  const getStroke = (yoga: YogaData, isActive: boolean) => {
    const col = NATURE_META[yoga.nature];
    if (isActive) return col.color;
    return `${col.color}44`;
  };

  return (
    <svg viewBox="0 0 600 600" className="w-full h-auto" style={{ maxWidth: 520, display: "block", margin: "0 auto" }}>
      <defs>
        <filter id="y27Shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#6B4423" floodOpacity="0.18" />
        </filter>
      </defs>
      <circle cx={CX} cy={CY} r={R_OUTER + 14} fill="none" stroke="#E8DCC8" strokeWidth={1} opacity={0.35} />
      <circle cx={CX} cy={CY} r={R_OUTER + 6} fill="none" stroke="#E8DCC8" strokeWidth={0.5} opacity={0.25} strokeDasharray="4 4" />

      {YOGA_DB.map((yoga) => {
        const startAngle = (yoga.number - 1) * (360 / 27);
        const endAngle = yoga.number * (360 / 27);
        const startRad = (startAngle - 90) * (Math.PI / 180);
        const endRad = (endAngle - 90) * (Math.PI / 180);
        const x1 = CX + R_OUTER * Math.cos(startRad);
        const y1 = CY + R_OUTER * Math.sin(startRad);
        const x2 = CX + R_OUTER * Math.cos(endRad);
        const y2 = CY + R_OUTER * Math.sin(endRad);
        const xi1 = CX + R_INNER * Math.cos(startRad);
        const yi1 = CY + R_INNER * Math.sin(startRad);
        const xi2 = CX + R_INNER * Math.cos(endRad);
        const yi2 = CY + R_INNER * Math.sin(endRad);
        const isSelected = selected === yoga.number;
        const opacity = getOpacity(yoga);
        const midAngle = (startAngle + endAngle) / 2;
        const labelR = (R_INNER + R_OUTER) / 2;
        const lx = CX + labelR * Math.cos((midAngle - 90) * (Math.PI / 180));
        const ly = CY + labelR * Math.sin((midAngle - 90) * (Math.PI / 180));
        const col = NATURE_META[yoga.nature];

        return (
          <g key={yoga.number} style={{ cursor: "pointer", opacity, transition: "opacity 0.25s ease" }} onClick={() => onSelect(yoga.number)}>
            <path d={`M ${xi1} ${yi1} L ${x1} ${y1} A ${R_OUTER} ${R_OUTER} 0 0 1 ${x2} ${y2} L ${xi2} ${yi2} A ${R_INNER} ${R_INNER} 0 0 0 ${xi1} ${yi1} Z`}
              fill={getFill(yoga, isSelected)} stroke={getStroke(yoga, isSelected)} strokeWidth={isSelected ? 2.5 : 0.7} style={{ transition: "all 0.2s ease" }}
            />
            <text x={lx} y={ly - 3} textAnchor="middle" fill={isSelected ? col.color : `${col.color}88`} fontSize={9} fontWeight={isSelected ? 800 : 600} style={{ fontFamily: "var(--font-sans), sans-serif", pointerEvents: "none" }}>
              {yoga.number}
            </text>
            <text x={lx} y={ly + 8} textAnchor="middle" fill={isSelected ? col.color : `${col.color}66`} fontSize={7} fontWeight={isSelected ? 700 : 500} style={{ fontFamily: "var(--font-sans), sans-serif", pointerEvents: "none" }}>
              {yoga.name.length > 7 ? yoga.name.slice(0, 6) + "…" : yoga.name}
            </text>
          </g>
        );
      })}

      <circle cx={CX} cy={CY} r={R_INNER - 3} fill="#FFF9F0" stroke="#C9A24D" strokeWidth={1.2} strokeOpacity={0.35} filter="url(#y27Shadow)" />
      <text x={CX} y={CY + 5} textAnchor="middle" fill="#9C7A2F" fontSize={24} fontWeight={700} style={{ fontFamily: "var(--font-devanagari), serif" }}>ॐ</text>
      {selected === null && (
        <text x={CX} y={CY + 22} textAnchor="middle" fill="#9C7A2F" fontSize={9} fontWeight={600} letterSpacing={0.08} style={{ fontFamily: "var(--font-sans), sans-serif", textTransform: "uppercase" }}>Click a segment</text>
      )}
    </svg>
  );
}

function DetailPanel({ yoga }: { yoga: YogaData | null }) {
  if (!yoga) {
    return (
      <div className="gl-surface-twilight-glass" style={{ padding: "40px 24px", textAlign: "center", minHeight: 300, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px" }}>
        <span style={{ fontSize: "40px" }}>☸</span>
        <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "20px", fontStyle: "italic", color: "var(--gl-ink-muted)" }}>Click any segment on the wheel to explore its attributes.</p>
        <p style={{ fontSize: "13px", color: "var(--gl-ink-muted)", maxWidth: 280, lineHeight: 1.5 }}>Use the filters to highlight yogas by their nature.</p>
      </div>
    );
  }
  const col = NATURE_META[yoga.nature];
  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "24px", borderTop: `4px solid ${col.color}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "6px" }}>
        <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.16em", fontWeight: 700, color: col.color, fontFamily: "var(--font-sans), sans-serif" }}>
          Yoga {yoga.number} / 27
        </span>
        <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, color: col.color, background: col.bg, padding: "3px 10px", borderRadius: "999px", border: `1px solid ${col.color}44` }}>
          {col.label}
        </span>
      </div>
      <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "32px", fontWeight: 600, color: "var(--gl-ink-primary)", lineHeight: 1.1 }}>
        <IAST>{yoga.name}</IAST>
      </p>
      <p style={{ fontFamily: "var(--font-devanagari), serif", fontSize: "20px", color: "var(--gl-ink-secondary)", marginTop: "4px", marginBottom: "16px" }}>
        {yoga.devanagari}
      </p>
      <div style={{ height: "1px", background: "linear-gradient(to right, transparent, rgba(156,122,47,0.25) 30%, rgba(156,122,47,0.25) 70%, transparent)", marginBottom: "16px" }} />
      <div style={{ marginBottom: "16px" }}>
        <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--gl-ink-muted)", fontWeight: 700, fontFamily: "var(--font-sans), sans-serif", marginBottom: "5px" }}>Ruler</p>
        <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "19px", fontWeight: 500, color: "var(--gl-ink-primary)" }}><IAST>{yoga.ruler}</IAST></p>
      </div>
      <div style={{ marginBottom: "16px" }}>
        <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--gl-ink-muted)", fontWeight: 700, fontFamily: "var(--font-sans), sans-serif", marginBottom: "5px" }}>Associated Deity</p>
        <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "19px", fontWeight: 500, color: "var(--gl-ink-primary)" }}><IAST>{yoga.deity}</IAST></p>
      </div>
      <div>
        <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--gl-ink-muted)", fontWeight: 700, fontFamily: "var(--font-sans), sans-serif", marginBottom: "5px" }}>Effects</p>
        <p style={{ fontSize: "14px", color: "var(--gl-ink-secondary)", lineHeight: 1.6, fontFamily: "var(--font-cormorant), serif", fontStyle: "italic" }}>{yoga.effects}</p>
      </div>
    </div>
  );
}

export function YogaWheel27() {
  const [selected, setSelected] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [view, setView] = useState<"wheel" | "table">("wheel");
  const [search, setSearch] = useState("");

  const selectedYoga = useMemo(() => YOGA_DB.find((y) => y.number === selected) ?? null, [selected]);

  const stats = useMemo(() => {
    const auspicious = YOGA_DB.filter((y) => y.nature === "auspicious").length;
    const inauspicious = YOGA_DB.filter((y) => y.nature === "inauspicious").length;
    const mixed = YOGA_DB.filter((y) => y.nature === "mixed").length;
    return { auspicious, inauspicious, mixed };
  }, []);

  const filteredTable = useMemo(() => {
    let list = YOGA_DB;
    if (filter !== "all") list = list.filter((y) => y.nature === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((y) => y.name.toLowerCase().includes(q) || y.devanagari.includes(q));
    }
    return list;
  }, [filter, search]);

  const filters = [
    { key: "all", label: "All 27", color: GOLD },
    { key: "auspicious", label: `Auspicious (${stats.auspicious})`, color: JADE },
    { key: "inauspicious", label: `Inauspicious (${stats.inauspicious})`, color: VERMILION },
    { key: "mixed", label: `Mixed (${stats.mixed})`, color: AMBER },
  ];

  return (
    <div className="my-6" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <header className="gl-surface-twilight-glass" style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "auto 1fr", gap: "16px", alignItems: "center", borderLeft: "4px solid #C28220" }}>
        <div style={{ position: "relative", flexShrink: 0, width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #F5C842 0%, #E89E2A 50%, #C47A1A 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
          ☸
        </div>
        <div>
          <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--gl-ink-muted)", fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif", marginBottom: "3px" }}>27 Time Yogas Wheel</p>
          <p style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 500, fontSize: "20px", color: "#C28220", lineHeight: 1.2 }}>27 Yogas · 3 Natures · Daily Pañcāṅga Element</p>
          <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: "13px", color: "var(--gl-ink-secondary)", marginTop: "2px" }}>Click any segment. Filter by nature. Toggle between wheel and table view.</p>
        </div>
      </header>

      <div className="gl-surface-twilight-glass" style={{ padding: "14px 18px" }}>
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {filters.map((f) => {
              const isActive = filter === f.key;
              return (
                <button key={f.key} onClick={() => setFilter(f.key)} style={{ padding: "6px 14px", borderRadius: "999px", background: isActive ? `${f.color}18` : "rgba(156,122,47,0.05)", border: isActive ? `1.5px solid ${f.color}` : "1px solid rgba(156,122,47,0.20)", color: isActive ? f.color : "#9C7A2F", fontFamily: "var(--font-sans), system-ui, sans-serif", fontSize: "12px", fontWeight: isActive ? 700 : 600, letterSpacing: "0.06em", cursor: "pointer", transition: "all 180ms cubic-bezier(0.32, 0.72, 0.24, 1)", whiteSpace: "nowrap" }}>
                  {f.label}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <input type="text" placeholder="Search yoga name…" value={search} onChange={(e) => setSearch(e.target.value)} className="px-3 py-1.5 rounded-full text-xs" style={{ border: "1px solid rgba(156,122,47,0.3)", background: "rgba(255,249,234,0.6)", color: "var(--gl-ink-primary)", minWidth: 160 }} />
            <div style={{ display: "flex", borderRadius: "999px", overflow: "hidden", border: "1px solid rgba(156,122,47,0.3)" }}>
              <button onClick={() => setView("wheel")} style={{ padding: "6px 14px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", background: view === "wheel" ? GOLD : "transparent", color: view === "wheel" ? "#fff" : GOLD, border: "none", cursor: "pointer" }}>Wheel</button>
              <button onClick={() => setView("table")} style={{ padding: "6px 14px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", background: view === "table" ? GOLD : "transparent", color: view === "table" ? "#fff" : GOLD, border: "none", cursor: "pointer" }}>Table</button>
            </div>
          </div>
        </div>
      </div>

      <div className="gl-surface-twilight-glass" style={{ padding: "12px 18px" }}>
        <div className="flex flex-wrap gap-4 justify-center">
          <div className="flex items-center gap-2" style={{ fontSize: "13px", color: "var(--gl-ink-secondary)" }}>
            <span className="inline-block rounded-full" style={{ width: 10, height: 10, background: JADE }} />
            <span><strong style={{ color: JADE }}>{stats.auspicious}</strong> Auspicious</span>
          </div>
          <div className="flex items-center gap-2" style={{ fontSize: "13px", color: "var(--gl-ink-secondary)" }}>
            <span className="inline-block rounded-full" style={{ width: 10, height: 10, background: VERMILION }} />
            <span><strong style={{ color: VERMILION }}>{stats.inauspicious}</strong> Inauspicious</span>
          </div>
          <div className="flex items-center gap-2" style={{ fontSize: "13px", color: "var(--gl-ink-secondary)" }}>
            <span className="inline-block rounded-full" style={{ width: 10, height: 10, background: AMBER }} />
            <span><strong style={{ color: AMBER }}>{stats.mixed}</strong> Mixed</span>
          </div>
        </div>
      </div>

      {view === "wheel" ? (
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_380px] gap-3.5">
          <div className="gl-surface-twilight-glass" style={{ padding: "20px 16px" }}>
            <WheelDiagram selected={selected} onSelect={setSelected} filter={filter} />
          </div>
          <div>
            <DetailPanel yoga={selectedYoga} />
          </div>
        </div>
      ) : (
        <div className="gl-surface-twilight-glass p-5 overflow-x-auto">
          <table className="w-full" style={{ fontSize: "14px", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "10px 12px", borderBottom: "2px solid rgba(156,122,47,0.3)", color: GOLD, fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase" }}>#</th>
                <th style={{ textAlign: "left", padding: "10px 12px", borderBottom: "2px solid rgba(156,122,47,0.3)", color: GOLD, fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Name</th>
                <th style={{ textAlign: "left", padding: "10px 12px", borderBottom: "2px solid rgba(156,122,47,0.3)", color: GOLD, fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Ruler</th>
                <th style={{ textAlign: "left", padding: "10px 12px", borderBottom: "2px solid rgba(156,122,47,0.3)", color: GOLD, fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Nature</th>
                <th style={{ textAlign: "left", padding: "10px 12px", borderBottom: "2px solid rgba(156,122,47,0.3)", color: GOLD, fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Effects</th>
              </tr>
            </thead>
            <tbody>
              {filteredTable.map((yoga) => {
                const col = NATURE_META[yoga.nature];
                return (
                  <tr key={yoga.number} style={{ background: selected === yoga.number ? col.bg : "transparent", cursor: "pointer" }} onClick={() => setSelected(yoga.number)}>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid rgba(156,122,47,0.12)", fontWeight: 700, color: col.color }}>{yoga.number}</td>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid rgba(156,122,47,0.12)", color: "var(--gl-ink-primary)", fontWeight: 500 }}>
                      <IAST>{yoga.name}</IAST>
                      <span className="block text-xs" style={{ color: "var(--gl-ink-muted)", fontFamily: "var(--font-devanagari), serif" }}>{yoga.devanagari}</span>
                    </td>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid rgba(156,122,47,0.12)", color: "var(--gl-ink-secondary)" }}><IAST>{yoga.ruler}</IAST></td>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid rgba(156,122,47,0.12)" }}>
                      <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, color: col.color, background: col.bg, padding: "2px 8px", borderRadius: "999px" }}>{col.label}</span>
                    </td>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid rgba(156,122,47,0.12)", color: "var(--gl-ink-secondary)", fontSize: "13px", lineHeight: 1.5, fontStyle: "italic" }}>{yoga.effects}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredTable.length === 0 && (
            <p className="text-center py-8" style={{ color: "var(--gl-ink-muted)", fontStyle: "italic" }}>No yogas match your search.</p>
          )}
        </div>
      )}
    </div>
  );
}
