"use client";

import { useState, useMemo } from "react";
import { IAST, Devanagari } from "../../chrome/typography";

const GOLD = "#C28220";
const JADE = "#2d7d46";
const VERMILION = "#A23A1E";
const AMBER = "#B8860B";

interface YogaData {
  number: number;
  name: string;
  devanagari: string;
  nature: "auspicious" | "inauspicious" | "mixed";
  ruler: string;
  effects: string;
}

const YOGA_DB: YogaData[] = [
  { number: 1, name: "Viṣkambha", devanagari: "विष्कम्भ", nature: "mixed", ruler: "Indra", effects: "Obstacles overcome with effort; mixed results" },
  { number: 2, name: "Prīti", devanagari: "प्रीति", nature: "auspicious", ruler: "Viśvedevā", effects: "Love, affection, prosperity, joy" },
  { number: 3, name: "Āyuṣmān", devanagari: "आयुष्मान्", nature: "auspicious", ruler: "Vāyu", effects: "Longevity, health, vitality" },
  { number: 4, name: "Saubhāgya", devanagari: "सौभाग्य", nature: "auspicious", ruler: "Brahmā", effects: "Good fortune, marital bliss, success" },
  { number: 5, name: "Śobhana", devanagari: "शोभन", nature: "auspicious", ruler: "Indra", effects: "Splendour, brilliance, auspicious undertakings" },
  { number: 6, name: "Atigaṇḍa", devanagari: "अतिगण्ड", nature: "inauspicious", ruler: "Śiva", effects: "Danger, accidents, disputes; avoid new ventures" },
  { number: 7, name: "Sukarman", devanagari: "सुकर्मन्", nature: "auspicious", ruler: "Viśvedevā", effects: "Good deeds, merit, righteous actions rewarded" },
  { number: 8, name: "Dhṛti", devanagari: "धृति", nature: "auspicious", ruler: "Varuṇa", effects: "Determination, steadiness, wealth accumulation" },
  { number: 9, name: "Śūla", devanagari: "शूल", nature: "inauspicious", ruler: "Āditya", effects: "Pain, conflict, violence; avoid journeys and disputes" },
  { number: 10, name: "Gaṇḍa", devanagari: "गण्ड", nature: "inauspicious", ruler: "Soma", effects: "Obstacles, calamity; dangerous for new beginnings" },
  { number: 11, name: "Vṛddhi", devanagari: "वृद्धि", nature: "auspicious", ruler: "Viśvedevā", effects: "Growth, increase, prosperity, learning" },
  { number: 12, name: "Dhruva", devanagari: "ध्रुव", nature: "auspicious", ruler: "Pṛthivī", effects: "Stability, permanence, firm success" },
  { number: 13, name: "Vyāghāta", devanagari: "व्याघात", nature: "inauspicious", ruler: "Vāyu", effects: "Violence, hindrance; avoid important undertakings" },
  { number: 14, name: "Harṣaṇa", devanagari: "हर्षण", nature: "auspicious", ruler: "Brahmā", effects: "Delight, exhilaration, joy, success" },
  { number: 15, name: "Vajra", devanagari: "वज्र", nature: "mixed", ruler: "Indra", effects: "Thunderbolt energy; forceful results, mixed" },
  { number: 16, name: "Siddhi", devanagari: "सिद्धि", nature: "auspicious", ruler: "Mitra", effects: "Accomplishment, perfection, magical attainment" },
  { number: 17, name: "Vyatīpāta", devanagari: "व्यतीपात", nature: "inauspicious", ruler: "Ravi", effects: "Great calamity; most dangerous of all yogas" },
  { number: 18, name: "Varīyas", devanagari: "वरीयस्", nature: "auspicious", ruler: "Viśvedevā", effects: "Excellence, choice, noble deeds" },
  { number: 19, name: "Parigha", devanagari: "परिघ", nature: "inauspicious", ruler: "Indra", effects: "Obstruction, iron-bar; imprisonment, confinement" },
  { number: 20, name: "Śiva", devanagari: "शिव", nature: "auspicious", ruler: "Pṛthivī", effects: "Auspiciousness, divine grace, spiritual success" },
  { number: 21, name: "Siddha", devanagari: "सिद्ध", nature: "auspicious", ruler: "Pitṛ", effects: "Attainment, perfection, completion of endeavours" },
  { number: 22, name: "Sādhya", devanagari: "साध्य", nature: "auspicious", ruler: "Brahmā", effects: "Feasible, achievable; good for all undertakings" },
  { number: 23, name: "Śubha", devanagari: "शुभ", nature: "auspicious", ruler: "Lakṣmī", effects: "Auspiciousness, beauty, wealth, grace" },
  { number: 24, name: "Śukla", devanagari: "शुक्ल", nature: "mixed", ruler: "Brahmā", effects: "Purity, clarity; mixed but generally favourable" },
  { number: 25, name: "Brahma", devanagari: "ब्रह्म", nature: "auspicious", ruler: "Indra", effects: "Knowledge, sacred study, priestly success" },
  { number: 26, name: "Indra", devanagari: "इन्द्र", nature: "auspicious", ruler: "Śiva", effects: "Royal power, lordship, victory, rulership" },
  { number: 27, name: "Vaidhṛti", devanagari: "वैधृति", nature: "inauspicious", ruler: "Dharma", effects: "Great obstruction; avoid all new ventures" },
];

const NATURE_COLORS = {
  auspicious: { text: JADE, bg: "#E8F5EE", border: "#A8D4B8" },
  inauspicious: { text: VERMILION, bg: "#FDE8E5", border: "#E8AFA8" },
  mixed: { text: AMBER, bg: "#FDF6E3", border: "#E8D5A3" },
};

function toDms(deg: number) {
  const d = Math.floor(deg);
  const mFloat = (deg - d) * 60;
  const m = Math.floor(mFloat);
  const s = Math.round((mFloat - m) * 60);
  return { d, m, s };
}

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

/* ─── Sun-Moon Summation SVG ─── */
function SummationSVG({ sunLon, moonLon, sum }: { sunLon: number; moonLon: number; sum: number }) {
  const W = 360;
  const H = 120;
  const barW = 280;
  const barH = 16;
  const barX = (W - barW) / 2;
  const barY = 50;

  const sunPct = (sunLon / 360) * barW;
  const moonPct = (moonLon / 360) * barW;
  const sumPct = (sum / 360) * barW;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 360 }}>
      <defs>
        <marker id="smArr" markerWidth={6} markerHeight={4} refX={5} refY={2} orient="auto"><polygon points="0 0, 6 2, 0 4" fill={GOLD} /></marker>
      </defs>

      {/* Sun bar */}
      <text x={barX} y={barY - 22} fill="#B8860B" fontSize={10} fontWeight={700}>☉ Sun: {sunLon.toFixed(1)}°</text>
      <rect x={barX} y={barY - 12} width={barW} height={barH} rx={4} fill="#FDF6E3" stroke="#E8D5A3" strokeWidth={1} />
      <rect x={barX} y={barY - 12} width={sunPct} height={barH} rx={4} fill="#E89E2A" opacity={0.5} />
      <line x1={barX + sunPct} y1={barY - 16} x2={barX + sunPct} y2={barY + 8} stroke="#E89E2A" strokeWidth={1.5} strokeDasharray="2 2" />

      {/* Moon bar */}
      <text x={barX} y={barY + 28} fill="#708090" fontSize={10} fontWeight={700}>☽ Moon: {moonLon.toFixed(1)}°</text>
      <rect x={barX} y={barY + 32} width={barW} height={barH} rx={4} fill="#F0F1F5" stroke="#B8C0CC" strokeWidth={1} />
      <rect x={barX} y={barY + 32} width={moonPct} height={barH} rx={4} fill="#708090" opacity={0.4} />
      <line x1={barX + moonPct} y1={barY + 28} x2={barX + moonPct} y2={barY + 52} stroke="#708090" strokeWidth={1.5} strokeDasharray="2 2" />

      {/* Sum arrow */}
      <line x1={barX + barW / 2} y1={barY + 56} x2={barX + barW / 2} y2={barY + 72} stroke={GOLD} strokeWidth={2} markerEnd="url(#smArr)" />
      <text x={barX + barW / 2 + 8} y={barY + 68} fill={GOLD} fontSize={10} fontWeight={700}>Sum = {sum.toFixed(1)}°</text>
    </svg>
  );
}

/* ─── Compact 27-Yoga Wheel ─── */
function YogaWheel({ yogaNumber }: { yogaNumber: number }) {
  const CX = 180;
  const CY = 180;
  const R_OUTER = 160;
  const R_INNER = 48;

  return (
    <svg viewBox="0 0 360 360" className="w-full h-auto" style={{ maxWidth: 280, display: "block", margin: "0 auto" }}>
      <defs>
        <filter id="ywShadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy={1} stdDeviation={2} floodColor="#6B4423" floodOpacity="0.1" /></filter>
      </defs>
      <circle cx={CX} cy={CY} r={R_OUTER + 8} fill="none" stroke="var(--gl-gold-hairline)" strokeWidth={1} opacity={0.3} />

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
        const isActive = yoga.number === yogaNumber;
        const col = NATURE_COLORS[yoga.nature];
        const midAngle = (startAngle + endAngle) / 2;
        const labelR = (R_INNER + R_OUTER) / 2;
        const lx = CX + labelR * Math.cos((midAngle - 90) * (Math.PI / 180));
        const ly = CY + labelR * Math.sin((midAngle - 90) * (Math.PI / 180));

        return (
          <g key={yoga.number} style={{ opacity: isActive ? 1 : 0.35, transition: "opacity 0.3s ease" }}>
            <path d={`M ${xi1} ${yi1} L ${x1} ${y1} A ${R_OUTER} ${R_OUTER} 0 0 1 ${x2} ${y2} L ${xi2} ${yi2} A ${R_INNER} ${R_INNER} 0 0 0 ${xi1} ${yi1} Z`}
              fill={isActive ? col.bg : "var(--gl-card-surface-solid, #FFF9F0)"}
              stroke={isActive ? col.border : "var(--gl-gold-hairline)"}
              strokeWidth={isActive ? 2 : 0.5}
            />
            <text x={lx} y={ly + 3} textAnchor="middle" fill={isActive ? col.text : "var(--gl-ink-muted)"} fontSize={9} fontWeight={isActive ? 800 : 500} style={{ fontFamily: "var(--font-sans), sans-serif", pointerEvents: "none" }}>
              {yoga.number}
            </text>
          </g>
        );
      })}

      <circle cx={CX} cy={CY} r={R_INNER - 3} fill="var(--gl-card-surface-solid, #FFF9F0)" stroke={GOLD} strokeWidth={1} strokeOpacity={0.35} filter="url(#ywShadow)" />
      <text x={CX} y={CY - 4} textAnchor="middle" fill={GOLD} fontSize={11} fontWeight={700}>{yogaNumber}</text>
      <text x={CX} y={CY + 10} textAnchor="middle" fill="var(--gl-ink-muted)" fontSize={8} fontWeight={600}>of 27</text>
    </svg>
  );
}

export function TimeYogaCalculator() {
  const [sunDeg, setSunDeg] = useState(30);
  const [sunMin, setSunMin] = useState(0);
  const [moonDeg, setMoonDeg] = useState(75);
  const [moonMin, setMoonMin] = useState(36);
  const [showSteps, setShowSteps] = useState(true);

  const sunLon = sunDeg + sunMin / 60;
  const moonLon = moonDeg + moonMin / 60;
  const sum = (sunLon + moonLon) % 360;
  const sumWrapped = sum < 0 ? sum + 360 : sum;
  const yogaSpan = 40 / 3;
  const yogaIndex = Math.floor(sumWrapped / yogaSpan);
  const yogaNumber = yogaIndex + 1;
  const elapsedFraction = sumWrapped / yogaSpan - yogaIndex;
  const yogaData = YOGA_DB.find((y) => y.number === yogaNumber) ?? YOGA_DB[0];

  const sunDms = toDms(sunLon);
  const moonDms = toDms(moonLon);
  const sumDms = toDms(sumWrapped);
  const nc = NATURE_COLORS[yogaData.nature];

  const steps = [
    { label: "Step 1 — Sum Longitudes", math: `Y = (λ☉ + λ☽) mod 360°`, subst: `Y = (${sunDeg}°${pad2(sunMin)}' + ${moonDeg}°${pad2(moonMin)}') mod 360° = ${sumWrapped.toFixed(2)}°`, note: "Add the true (spaṣṭa) longitudes of Sun and Moon. Wrap to 0–360° if needed." },
    { label: "Step 2 — Division by 13°20′", math: `Y / 13°20′ = ${(sumWrapped / yogaSpan).toFixed(4)}`, subst: "Each yoga spans 13°20′ (40/3°). The quotient tells us how many full segments have passed.", note: "Floor = full yogas elapsed. Fractional part = elapsed portion of current yoga." },
    { label: "Step 3 — Yoga Number", math: `Yoga = ⌊${(sumWrapped / yogaSpan).toFixed(4)}⌋ + 1 = ${yogaNumber}`, subst: `Yoga number (1–27): ${yogaNumber}`, note: "+1 converts from 0-indexed to 1-indexed (classical convention)." },
    { label: "Step 4 — Nature & Ruler", math: `${yogaData.name} · ${yogaData.nature}`, subst: `Ruler: ${yogaData.ruler} · ${Math.round(elapsedFraction * 100)}% elapsed`, note: "Auspicious yogas favour beginnings; inauspicious yogas warn against new ventures." },
  ];

  // Each preset's (Sun+Moon) sum lands inside the labelled yoga's 13°20′ band.
  const presets = [
    { label: "Viṣkambha (1)", s: 0, sm: 0, m: 0, mm: 20 },   // sum 0°20′ → yoga 1
    { label: "Siddhi (16)", s: 100, sm: 0, m: 105, mm: 0 },  // sum 205° → yoga 16
    { label: "Vyatīpāta (17)", s: 100, sm: 0, m: 120, mm: 0 }, // sum 220° → yoga 17 (inauspicious)
    { label: "Vaidhṛti (27)", s: 180, sm: 0, m: 173, mm: 0 }, // sum 353° → yoga 27 (inauspicious)
  ];

  return (
    <div
      className="w-full"
      style={{ background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))", border: "1px solid var(--gl-border-subtle, var(--gl-gold-hairline))", borderRadius: "16px", padding: "20px" }}
      data-interactive="time-yoga-calculator"
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold" style={{ color: "var(--gl-ink-primary)" }}><IAST>Time-Yoga Calculator</IAST></h2>
        <p className="text-sm mt-1" style={{ color: "var(--gl-ink-muted)" }}>Enter Sun and Moon longitudes. Walk through the classical formula step-by-step.</p>
      </div>

      {/* Summation SVG */}
      <div className="rounded-xl p-3 mb-4" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)" }}>
        <SummationSVG sunLon={sunLon} moonLon={moonLon} sum={sumWrapped} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
        {/* Inputs */}
        <div className="rounded-xl p-4" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)" }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: GOLD }}>Input Longitudes</p>
          <div className="mb-3">
            <label className="flex items-center gap-2 text-sm mb-2 font-semibold" style={{ color: "var(--gl-ink-primary)" }}><span style={{ fontSize: 16 }}>☉</span> λ Sun (true)</label>
            <div className="flex gap-2">
              <div className="flex-1"><label className="text-xs block mb-1" style={{ color: "var(--gl-ink-muted)" }}>Degrees</label><input type="number" min={0} max={359} value={sunDeg} onChange={(e) => setSunDeg(Number(e.target.value))} className="w-full px-2.5 py-1.5 rounded-lg text-sm outline-none" style={{ border: "1px solid var(--gl-gold-hairline)", background: "var(--gl-card-surface-solid)", color: "var(--gl-ink-primary)" }} /></div>
              <div className="flex-1"><label className="text-xs block mb-1" style={{ color: "var(--gl-ink-muted)" }}>Minutes</label><input type="number" min={0} max={59} value={sunMin} onChange={(e) => setSunMin(Number(e.target.value))} className="w-full px-2.5 py-1.5 rounded-lg text-sm outline-none" style={{ border: "1px solid var(--gl-gold-hairline)", background: "var(--gl-card-surface-solid)", color: "var(--gl-ink-primary)" }} /></div>
            </div>
            <p className="text-xs mt-1" style={{ color: "var(--gl-ink-muted)" }}>= {sunDms.d}° {pad2(sunDms.m)}' {pad2(sunDms.s)}"</p>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm mb-2 font-semibold" style={{ color: "var(--gl-ink-primary)" }}><span style={{ fontSize: 16 }}>☽</span> λ Moon (true)</label>
            <div className="flex gap-2">
              <div className="flex-1"><label className="text-xs block mb-1" style={{ color: "var(--gl-ink-muted)" }}>Degrees</label><input type="number" min={0} max={359} value={moonDeg} onChange={(e) => setMoonDeg(Number(e.target.value))} className="w-full px-2.5 py-1.5 rounded-lg text-sm outline-none" style={{ border: "1px solid var(--gl-gold-hairline)", background: "var(--gl-card-surface-solid)", color: "var(--gl-ink-primary)" }} /></div>
              <div className="flex-1"><label className="text-xs block mb-1" style={{ color: "var(--gl-ink-muted)" }}>Minutes</label><input type="number" min={0} max={59} value={moonMin} onChange={(e) => setMoonMin(Number(e.target.value))} className="w-full px-2.5 py-1.5 rounded-lg text-sm outline-none" style={{ border: "1px solid var(--gl-gold-hairline)", background: "var(--gl-card-surface-solid)", color: "var(--gl-ink-primary)" }} /></div>
            </div>
            <p className="text-xs mt-1" style={{ color: "var(--gl-ink-muted)" }}>= {moonDms.d}° {pad2(moonDms.m)}' {pad2(moonDms.s)}"</p>
          </div>
        </div>

        {/* Result */}
        <div className="rounded-xl p-4" style={{ background: nc.bg, border: `2px solid ${nc.border}` }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: nc.text }}>Result</p>
          <div className="flex items-baseline gap-2 mb-1">
            <span style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "32px", fontWeight: 600, color: nc.text }}><IAST>{yogaData.name}</IAST></span>
            <span className="text-sm" style={{ color: "var(--gl-ink-muted)" }}>#{yogaNumber}</span>
          </div>
          <Devanagari size="sm">{yogaData.devanagari}</Devanagari>
          <div className="flex items-center gap-2 mb-3 mt-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase" style={{ background: nc.bg, color: nc.text, border: `1px solid ${nc.border}` }}>{yogaData.nature}</span>
            <span className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>Ruler: {yogaData.ruler}</span>
          </div>
          <p className="text-sm mb-3 italic" style={{ color: "var(--gl-ink-secondary)", lineHeight: 1.5 }}>{yogaData.effects}</p>
          <div className="relative h-2 rounded-full overflow-hidden mb-2" style={{ background: "var(--gl-card-surface-solid)" }}>
            <div className="absolute top-0 left-0 h-full rounded-full" style={{ width: `${elapsedFraction * 100}%`, background: nc.text }} />
          </div>
          <p className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>{Math.round(elapsedFraction * 100)}% elapsed · Sum = {sumDms.d}° {pad2(sumDms.m)}' {pad2(sumDms.s)}"</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Steps */}
        <div className="rounded-xl p-4" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)" }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: GOLD }}>Step-by-Step Formula</p>
            <button onClick={() => setShowSteps((v) => !v)} className="text-xs" style={{ color: GOLD, textDecoration: "underline", cursor: "pointer", background: "none", border: "none" }}>{showSteps ? "Hide steps" : "Show steps"}</button>
          </div>
          {showSteps && (
            <div className="space-y-2">
              {steps.map((step, i) => (
                <div key={i} className="p-3 rounded-lg" style={{ background: "var(--gl-card-surface-solid)", border: "1px solid var(--gl-gold-hairline)" }}>
                  <p className="text-xs font-bold mb-1" style={{ color: GOLD, textTransform: "uppercase", letterSpacing: "0.06em" }}>{step.label}</p>
                  <p className="text-sm font-mono mb-1" style={{ color: "var(--gl-ink-primary)", fontFamily: "ui-monospace, monospace" }}>{step.math}</p>
                  <p className="text-sm mb-1" style={{ color: "var(--gl-ink-secondary)" }}>{step.subst}</p>
                  <p className="text-xs italic" style={{ color: "var(--gl-ink-muted)" }}>{step.note}</p>
                </div>
              ))}
            </div>
          )}
          <div className="mt-3 p-3 rounded-lg text-center" style={{ background: "#FDF6E3", border: "1px dashed var(--gl-gold-hairline)" }}>
            <p className="text-xs uppercase mb-1" style={{ color: GOLD, letterSpacing: "0.1em", fontWeight: 700 }}>Consolidated Formula</p>
            <p className="text-base" style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--gl-ink-primary)", fontStyle: "italic" }}>Yoga = ⌊((λ☉ + λ☽) mod 360°) / 13°20′⌋ + 1</p>
            <p className="text-xs mt-1" style={{ color: "var(--gl-ink-muted)" }}>True (spaṣṭa) longitudes required per Sūrya Siddhānta</p>
          </div>
        </div>

        {/* Wheel + Presets */}
        <div className="space-y-3">
          <div className="rounded-xl p-4" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)" }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: GOLD }}>27-Yoga Wheel</p>
            <YogaWheel yogaNumber={yogaNumber} />
            <div className="flex justify-center gap-4 mt-2">
              <span className="flex items-center gap-1.5 text-xs" style={{ color: JADE }}><span className="inline-block rounded-full" style={{ width: 8, height: 8, background: JADE }} />Auspicious</span>
              <span className="flex items-center gap-1.5 text-xs" style={{ color: VERMILION }}><span className="inline-block rounded-full" style={{ width: 8, height: 8, background: VERMILION }} />Inauspicious</span>
              <span className="flex items-center gap-1.5 text-xs" style={{ color: AMBER }}><span className="inline-block rounded-full" style={{ width: 8, height: 8, background: AMBER }} />Mixed</span>
            </div>
          </div>
          <div className="rounded-xl p-3" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)" }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: GOLD }}>Quick Presets</p>
            <div className="flex flex-wrap gap-2">
              {presets.map((p) => (
                <button key={p.label} onClick={() => { setSunDeg(p.s); setSunMin(p.sm); setMoonDeg(p.m); setMoonMin(p.mm); }} className="px-3 py-1.5 rounded text-xs font-medium transition-all" style={{ border: "1px solid var(--gl-gold-hairline)", background: "#FDF6E3", color: GOLD, cursor: "pointer" }}>{p.label}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
