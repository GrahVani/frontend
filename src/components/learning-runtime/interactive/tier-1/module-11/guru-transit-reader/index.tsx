"use client";

import { useState, useMemo } from "react";
import { Sparkles, ShieldCheck, AlertTriangle } from "lucide-react";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import { RASHIS, polarToCartesian, describeArc } from '@/components/learning-runtime/interactive/rashi-data';

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";
const GREEN = "#2F7D55";
const BLUE = "#3b82f6";
const RED = "#A8412B";
const PURPLE = "#7c3aed";
const SATURN_DARK = "#475569";

interface GuruHouseDetail {
  houseNum: number;
  quality: "Very Favourable" | "Favourable" | "Mildly Supportive";
  color: string;
  theme: string;
  details: string;
  icon: string;
}

const GURU_HOUSE_DATA: Record<number, GuruHouseDetail> = {
  1: { houseNum: 1, quality: "Mildly Supportive", color: BLUE, theme: "Self-growth & Health", details: "Mental optimism, self-confidence, protective health blessings.", icon: "🌱" },
  2: { houseNum: 2, quality: "Favourable", color: GREEN, theme: "Wealth & Family", details: "Wealth enhancement, family stability, truthful speech.", icon: "💰" },
  3: { houseNum: 3, quality: "Mildly Supportive", color: BLUE, theme: "Travels & Siblings", details: "Short journeys, communications, courage, sibling support.", icon: "✈️" },
  4: { houseNum: 4, quality: "Mildly Supportive", color: BLUE, theme: "Home & Mother", details: "Domestic happiness, mother's health, comfortable living.", icon: "🏡" },
  5: { houseNum: 5, quality: "Very Favourable", color: GREEN, theme: "Children & Creativity", details: "Prime fortune. Creative study, intelligence, children's birth, wisdom.", icon: "✨" },
  6: { houseNum: 6, quality: "Mildly Supportive", color: BLUE, theme: "Service & Healing", details: "Resolves disputes, protects against health setbacks.", icon: "🩺" },
  7: { houseNum: 7, quality: "Very Favourable", color: GREEN, theme: "Marriage & Partners", details: "Highly supportive for marriage negotiations and business alliances.", icon: "💖" },
  8: { houseNum: 8, quality: "Mildly Supportive", color: BLUE, theme: "Research & Legacy", details: "Protects during crises. Deep research, occult, inheritances.", icon: "🔍" },
  9: { houseNum: 9, quality: "Very Favourable", color: GREEN, theme: "Dharma & Fortune", details: "Deep fortune, spiritual teachers, father's blessings, long journeys.", icon: "🕉️" },
  10: { houseNum: 10, quality: "Mildly Supportive", color: BLUE, theme: "Career & Status", details: "Career guidance, ethics in work, public recognition.", icon: "💼" },
  11: { houseNum: 11, quality: "Very Favourable", color: GREEN, theme: "Gains & Networks", details: "Abundant financial expansion, elder associates, wish fulfillment.", icon: "📈" },
  12: { houseNum: 12, quality: "Mildly Supportive", color: BLUE, theme: "Spiritual Release", details: "Charitable expenditure, peaceful sleep, isolated retreats.", icon: "🧘" }
};

const SHORT_SIGNS = ["ARI", "TAU", "GEM", "CAN", "LEO", "VIR", "LIB", "SCO", "SAG", "CAP", "AQU", "PIS"];

const HOUSE_QUALITY_GROUPS = [
  { label: "Very favourable", houses: [5, 7, 9, 11], color: GREEN, note: "Peak windows — act with daśā support" },
  { label: "Favourable", houses: [2], color: GREEN, note: "Classically favourable — wealth & family" },
  { label: "Mildly supportive", houses: [1, 3, 4, 6, 8, 10, 12], color: BLUE, note: "Less intense, still protective" },
];

const AFFLICTION_GUIDE = [
  { graha: "Saturn", symbol: "♄", effect: "-30%", desc: "Delays and disciplines the expansion; blessing arrives slowly." },
  { graha: "Rāhu", symbol: "☊", effect: "-35%", desc: "Guru-Chāṇḍāla effect — distorts wisdom into ideological rigidity." },
];

const WORKED_EXAMPLES = [
  { label: "Guru 5th from Moon", text: "Favourable window for children, creativity, or study." },
  { label: "Guru 7th from Moon", text: "Supportive for marriage and partnership timing." },
  { label: "Afflicted Guru", text: "Saturn aspecting Jupiter dampens the blessing." },
];

export function GuruTransitReader() {
  const [moonSignNum, setMoonSignNum] = useState<number>(1);
  const [guruHouse, setGuruHouse] = useState<number>(5);
  const [saturnAffliction, setSaturnAffliction] = useState<boolean>(false);
  const [rahuAffliction, setRahuAffliction] = useState<boolean>(false);

  const moonRashi = useMemo(() => RASHIS.find(r => r.number === moonSignNum) || RASHIS[0], [moonSignNum]);
  const jupiterSignNum = useMemo(() => ((moonSignNum + guruHouse - 1 - 1) % 12) + 1, [moonSignNum, guruHouse]);
  const jupiterRashi = useMemo(() => RASHIS.find(r => r.number === jupiterSignNum) || RASHIS[0], [jupiterSignNum]);
  const activeHouseData = useMemo(() => GURU_HOUSE_DATA[guruHouse], [guruHouse]);

  const blessingIndexDetails = useMemo(() => {
    let score = activeHouseData.quality === "Very Favourable" ? 100 : activeHouseData.quality === "Favourable" ? 85 : 65;
    const dampeners: { label: string; text: string }[] = [];
    if (saturnAffliction) { score -= 30; dampeners.push({ label: "Saturn aspect", text: "Dampens expansion through delays and discipline." }); }
    if (rahuAffliction) { score -= 35; dampeners.push({ label: "Rāhu aspect — Guru-Chāṇḍāla", text: "Distorts wisdom into ideological rigidity." }); }
    score = Math.max(10, score);
    let label = "";
    let color = "";
    if (score >= 75) { label = "Radiant Blessing"; color = GREEN; }
    else if (score >= 45) { label = "Dampened Grace"; color = BLUE; }
    else { label = "Afflicted Jupiter"; color = RED; }
    return { score, label, color, dampeners };
  }, [activeHouseData, saturnAffliction, rahuAffliction]);

  return (
    <div data-interactive="guru-transit-reader" style={{ padding: "16px", borderRadius: "14px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", boxShadow: "0 8px 32px rgba(72, 48, 16, 0.05)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "10px" }}>

      {/* Header */}
      <div>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
          <IAST>Gurugochara-Yantra</IAST> — Jupiter Transit Reader
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
          Jupiter is the great benefic — generally protective, especially in the 5th/7th/9th/11th from the Moon. Saturn or Rāhu aspect can dampen the grace.
        </p>
      </div>

      {/* Controls */}
      <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
        <SignSelect label="Moon sign" value={moonSignNum} onChange={setMoonSignNum} />
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "10px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase" }}>Jupiter house</span>
          <select value={guruHouse} onChange={e => setGuruHouse(Number(e.target.value))} style={{ border: "1px solid rgba(156,122,47,0.25)", borderRadius: "5px", background: "#ffffff", color: INK_PRIMARY, padding: "4px 5px", fontSize: "11px", fontWeight: 700, minWidth: "110px" }}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
              <option key={h} value={h}>H{h} — {GURU_HOUSE_DATA[h].theme}</option>
            ))}
          </select>
        </div>
        <Toggle checked={saturnAffliction} onChange={setSaturnAffliction} label="Saturn aspecting Jupiter (-30%)" />
        <Toggle checked={rahuAffliction} onChange={setRahuAffliction} label={<><IAST>Guru-Chāṇḍāla</IAST> (Rāhu, -35%)</>} />
      </div>

      {/* Main two-column layout */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "stretch" }}>

        {/* Left — wheel + reference */}
        <div style={{ flex: "1 1 280px", minWidth: "260px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ background: "#ffffff", padding: "12px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h4 style={{ margin: 0, fontSize: "10px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase", alignSelf: "flex-start" }}>Jupiter from the Moon</h4>
            <GuruWheel moonSign={moonSignNum} guruHouse={guruHouse} saturnAffliction={saturnAffliction} rahuAffliction={rahuAffliction} onSelectHouse={setGuruHouse} />
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", fontSize: "9px", color: INK_MUTED, marginTop: "6px" }}>
              <LegendDot color={GREEN} label="Very favourable" />
              <LegendDot color={BLUE} label="Mildly supportive" />
              <LegendDot color={GOLD} label="Jupiter" />
              <LegendDot color={SATURN_DARK} label="Saturn affliction" />
              <LegendDot color={PURPLE} label="Rāhu affliction" />
            </div>
          </div>

          {/* House quality groups */}
          <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <div style={{ fontSize: "9px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase", marginBottom: "6px" }}>House-quality map from Moon</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              {HOUSE_QUALITY_GROUPS.map(g => (
                <div key={g.label} style={{ display: "flex", gap: "6px", alignItems: "center", fontSize: "10px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: g.color, flexShrink: 0 }} />
                  <span style={{ fontWeight: 800, color: g.color, minWidth: "95px" }}>{g.label}</span>
                  <span style={{ color: INK_SECONDARY }}>H{g.houses.join(", ")}</span>
                  <span style={{ color: INK_MUTED, fontSize: "9px" }}>— {g.note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — verdict + education */}
        <div style={{ flex: "1 1 280px", minWidth: "260px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {/* Blessing index */}
          <div style={{ background: `${blessingIndexDetails.color}08`, border: `1.2px solid ${blessingIndexDetails.color}`, borderRadius: "10px", padding: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
              <h4 style={{ margin: 0, fontSize: "13px", fontWeight: 800, color: blessingIndexDetails.color, display: "flex", alignItems: "center", gap: "5px" }}>
                {blessingIndexDetails.score >= 75 ? <ShieldCheck size={14} /> : <AlertTriangle size={14} />}
                {blessingIndexDetails.label}
              </h4>
              <span style={{ fontSize: "16px", fontWeight: 900, color: blessingIndexDetails.color }}>{blessingIndexDetails.score}%</span>
            </div>
            <div style={{ fontSize: "10px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase", marginBottom: "6px" }}>
              {activeHouseData.icon} House {guruHouse} from Moon — {activeHouseData.theme}
            </div>
            <p style={{ margin: 0, fontSize: "11px", lineHeight: "1.45", color: INK_SECONDARY }}>
              Moon in <strong>{moonRashi.nameEnglish} (<IAST>{moonRashi.nameIAST}</IAST>)</strong>, Jupiter in <strong>{jupiterRashi.nameEnglish} (<IAST>{jupiterRashi.nameIAST}</IAST>)</strong>. {activeHouseData.details}
            </p>
            {blessingIndexDetails.dampeners.length > 0 && (
              <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "3px" }}>
                {blessingIndexDetails.dampeners.map((d, idx) => (
                  <div key={idx} style={{ fontSize: "10px", color: RED, background: `${RED}08`, padding: "4px 6px", borderRadius: "4px", border: `1px solid ${RED}40`, display: "flex", gap: "4px" }}>
                    <span>⚠️</span><span><strong>{d.label}</strong> — {d.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Affliction guide */}
          <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <div style={{ fontSize: "9px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase", marginBottom: "5px" }}>When Guru turns challenging</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              {AFFLICTION_GUIDE.map(a => (
                <div key={a.graha} style={{ display: "flex", gap: "6px", alignItems: "flex-start", fontSize: "10px", padding: "4px 6px", borderRadius: "4px", background: "rgba(156,122,47,0.04)" }}>
                  <span style={{ fontSize: "12px" }}>{a.symbol}</span>
                  <span style={{ fontWeight: 800, color: INK_PRIMARY, minWidth: "60px" }}>{a.graha} {a.effect}</span>
                  <span style={{ color: INK_SECONDARY }}>{a.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Worked examples */}
          <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <div style={{ fontSize: "9px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase", marginBottom: "5px" }}>Worked examples</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {WORKED_EXAMPLES.map(ex => (
                <div key={ex.label} style={{ display: "flex", gap: "6px", fontSize: "10px", padding: "4px 6px", borderRadius: "4px", background: "rgba(156,122,47,0.04)" }}>
                  <span style={{ fontWeight: 900, color: GOLD_DEEP, minWidth: "120px" }}>{ex.label}</span>
                  <span style={{ color: INK_SECONDARY }}>{ex.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Jupiter cycle reminder */}
          <div style={{ background: `${GOLD}08`, border: `1px solid ${GOLD}`, borderRadius: "8px", padding: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px" }}>✨</span>
            <p style={{ margin: 0, fontSize: "10px", lineHeight: "1.45", color: INK_SECONDARY }}>
              <strong style={{ color: GOLD_DEEP }}>Jupiter cycle:</strong> ~1 year per sign, ~12 years through the zodiac. The 5th/7th/9th/11th from the Moon are windows to act — confirmed against daśā.
            </p>
          </div>

          {/* Source footer */}
          <div style={{ background: SURFACE_MANUSCRIPT, border: "1px solid rgba(156,122,47,0.12)", borderRadius: "8px", padding: "8px", fontSize: "9px", color: INK_MUTED, lineHeight: "1.4" }}>
            <strong>Source:</strong> Classical gochara — Jupiter transits from the Moon. <IAST>Bṛhat Pārāśara Horā Śāstra</IAST> — Jupiter&apos;s 1st/5th/7th/9th aspects are protective <IAST>dṛṣṭi</IAST>. <IAST>Guru-Chāṇḍāla Yoga</IAST> (Jupiter + Rāhu) distorts wisdom.
          </div>
        </div>
      </div>
    </div>
  );
}

function SignSelect({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
      <span style={{ fontSize: "10px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase" }}>{label}</span>
      <select value={value} onChange={e => onChange(Number(e.target.value))} style={{ border: "1px solid rgba(156,122,47,0.25)", borderRadius: "5px", background: "#ffffff", color: INK_PRIMARY, padding: "4px 5px", fontSize: "11px", fontWeight: 700, minWidth: "130px" }}>
        {RASHIS.map(r => <option key={r.number} value={r.number}>{r.nameEnglish} (<IAST>{r.nameIAST}</IAST>)</option>)}
      </select>
    </span>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: React.ReactNode }) {
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "11px", color: checked ? GOLD_DEEP : INK_SECONDARY, cursor: "pointer", fontWeight: checked ? 800 : 600 }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ accentColor: GOLD }} />
      {label}
    </label>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: color }} />
      {label}
    </span>
  );
}

function GuruWheel({ moonSign, guruHouse, saturnAffliction, rahuAffliction, onSelectHouse }: {
  moonSign: number;
  guruHouse: number;
  saturnAffliction: boolean;
  rahuAffliction: boolean;
  onSelectHouse: (h: number) => void;
}) {
  const size = 260;
  const cx = size / 2;
  const cy = size / 2;
  const R = 118;
  const rInner = 55;

  const coords = useMemo(() => {
    const c: Record<number, { start: number; end: number; mid: number; signNum: number }> = {};
    for (let h = 1; h <= 12; h++) {
      const start = (h - 1) * 30;
      const end = start + 30;
      const signNum = ((moonSign + h - 2 + 12) % 12) + 1;
      c[h] = { start, end, mid: start + 15, signNum };
    }
    return c;
  }, [moonSign]);

  const jupiterPt = polarToCartesian(cx, cy, 68, coords[guruHouse].mid);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block", maxWidth: "100%" }}>
      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(156,122,47,0.18)" strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={rInner} fill="none" stroke="rgba(156,122,47,0.1)" strokeWidth={1} />

      {/* Sectors */}
      {Array.from({ length: 12 }, (_, i) => i + 1).map(h => {
        const { start, end, signNum, mid } = coords[h];
        const hData = GURU_HOUSE_DATA[h];
        const isCurrent = h === guruHouse;
        const sign = RASHIS[signNum - 1];
        const pEng = polarToCartesian(cx, cy, 100, mid);
        const pDev = polarToCartesian(cx, cy, 86, mid);
        const pIcon = polarToCartesian(cx, cy, 72, mid);
        const pHouse = polarToCartesian(cx, cy, 62, mid);
        const qualityFill = hData.quality === "Very Favourable" ? GREEN : hData.quality === "Favourable" ? GREEN : BLUE;

        return (
          <g key={h} style={{ cursor: "pointer" }} onClick={() => onSelectHouse(h)}>
            <path
              d={describeArc(cx, cy, R - 1, start, end)}
              fill={qualityFill}
              fillOpacity={isCurrent ? 0.14 : 0.06}
              stroke={isCurrent ? GOLD : "rgba(156,122,47,0.08)"}
              strokeWidth={isCurrent ? 2 : 1}
            />
            <line x1={cx} y1={cy} x2={cx + R * Math.cos((start * Math.PI) / 180)} y2={cy + R * Math.sin((start * Math.PI) / 180)} stroke="rgba(156,122,47,0.1)" strokeWidth={1} />
            <text x={pEng.x} y={pEng.y} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "8px", fontWeight: 800, fill: INK_PRIMARY }}>{SHORT_SIGNS[signNum - 1]}</text>
            <text x={pDev.x} y={pDev.y + 1} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "7px", fill: INK_MUTED }}>{sign.nameDevanagari}</text>
            <text x={pIcon.x} y={pIcon.y} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "9px" }}>{hData.icon}</text>
            <text x={pHouse.x} y={pHouse.y} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "8px", fontWeight: 900, fill: isCurrent ? GOLD_DEEP : INK_MUTED }}>H{h}</text>
          </g>
        );
      })}

      {/* Affliction rays */}
      {saturnAffliction && (
        <>
          <line x1={cx + 68 * Math.cos(((coords[guruHouse].mid + 180) * Math.PI) / 180)} y1={cy + 68 * Math.sin(((coords[guruHouse].mid + 180) * Math.PI) / 180)} x2={jupiterPt.x} y2={jupiterPt.y} stroke={SATURN_DARK} strokeWidth={2} strokeDasharray="4 3" />
          <circle cx={cx + 68 * Math.cos(((coords[guruHouse].mid + 180) * Math.PI) / 180)} cy={cy + 68 * Math.sin(((coords[guruHouse].mid + 180) * Math.PI) / 180)} r={9} fill={SATURN_DARK} stroke="#ffffff" strokeWidth={1} />
          <text x={cx + 68 * Math.cos(((coords[guruHouse].mid + 180) * Math.PI) / 180)} y={cy + 68 * Math.sin(((coords[guruHouse].mid + 180) * Math.PI) / 180) + 0.5} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "8px", fill: "#ffffff", fontWeight: 700 }}>♄</text>
        </>
      )}
      {rahuAffliction && (
        <>
          <line x1={cx + 68 * Math.cos(((coords[guruHouse].mid + 120) * Math.PI) / 180)} y1={cy + 68 * Math.sin(((coords[guruHouse].mid + 120) * Math.PI) / 180)} x2={jupiterPt.x} y2={jupiterPt.y} stroke={PURPLE} strokeWidth={2} strokeDasharray="4 3" />
          <circle cx={cx + 68 * Math.cos(((coords[guruHouse].mid + 120) * Math.PI) / 180)} cy={cy + 68 * Math.sin(((coords[guruHouse].mid + 120) * Math.PI) / 180)} r={9} fill={PURPLE} stroke="#ffffff" strokeWidth={1} />
          <text x={cx + 68 * Math.cos(((coords[guruHouse].mid + 120) * Math.PI) / 180)} y={cy + 68 * Math.sin(((coords[guruHouse].mid + 120) * Math.PI) / 180) + 0.5} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "8px", fill: "#ffffff", fontWeight: 700 }}>☊</text>
        </>
      )}

      {/* Jupiter marker */}
      <circle cx={jupiterPt.x} cy={jupiterPt.y} r={11} fill={GOLD} stroke="#ffffff" strokeWidth={1.5} />
      <text x={jupiterPt.x} y={jupiterPt.y + 0.5} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "10px", fill: "#ffffff", fontWeight: 700 }}>♃</text>

      {/* Center hub / Moon */}
      <circle cx={cx} cy={cy} r={16} fill="#ffffff" stroke={GOLD} strokeWidth={1.5} />
      <text x={cx} y={cy - 2} textAnchor="middle" style={{ fontSize: "8px", fill: GOLD }}>☽</text>
      <text x={cx} y={cy + 8} textAnchor="middle" style={{ fontSize: "7px", fontWeight: 800, fill: INK_MUTED }}>CHANDRA</text>
    </svg>
  );
}
