"use client";

import { useState, useMemo } from "react";
import { IAST } from "../../chrome/typography";

/* ─── Data ─── */
const MONTHS = [
  "Caitra", "Vaiśākha", "Jyaiṣṭha", "Āṣāḍha", "Śrāvaṇa", "Bhādrapada",
  "Āśvina", "Kārtika", "Mārgaśīrṣa", "Pauṣa", "Māgha", "Phālguna",
];

interface FestivalDef {
  name: string;
  amanta: string;
  purnimanta: string;
  paksha: "śukla" | "kṛṣṇa";
  note: string;
  month: string;
}

const FESTIVALS: FestivalDef[] = [
  { name: "Mahā-Śivarātri", amanta: "Māgha Kṛṣṇa Caturdaśī", purnimanta: "Phālguna Kṛṣṇa Caturdaśī", paksha: "kṛṣṇa", note: "Kṛṣṇa-pakṣa festival shifts to the following month in Pūrṇimānta", month: "Māgha" },
  { name: "Janmāṣṭamī", amanta: "Śrāvaṇa Kṛṣṇa Aṣṭamī", purnimanta: "Bhādrapada Kṛṣṇa Aṣṭamī", paksha: "kṛṣṇa", note: "Kṛṣṇa-pakṣa festival shifts to the following month in Pūrṇimānta", month: "Śrāvaṇa" },
  { name: "Diwali / Amāvāsyā", amanta: "Āśvina Kṛṣṇa Amāvāsyā", purnimanta: "Kārtika Kṛṣṇa Amāvāsyā", paksha: "kṛṣṇa", note: "New-moon festival shifts to the following month in Pūrṇimānta", month: "Āśvina" },
  { name: "Holi / Pūrṇimā", amanta: "Phālguna Śukla Pūrṇimā", purnimanta: "Phālguna Śukla Pūrṇimā", paksha: "śukla", note: "Śukla-pakṣa festival keeps the same month name in both conventions", month: "Phālguna" },
  { name: "Rāma Navamī", amanta: "Caitra Śukla Navamī", purnimanta: "Caitra Śukla Navamī", paksha: "śukla", note: "Śukla-pakṣa festival keeps the same month name in both conventions", month: "Caitra" },
  { name: "Gaṇeśa Caturthī", amanta: "Bhādrapada Śukla Caturthī", purnimanta: "Bhādrapada Śukla Caturthī", paksha: "śukla", note: "Śukla-pakṣa festival keeps the same month name in both conventions", month: "Bhādrapada" },
];

const REGIONS = [
  { name: "Kerala", convention: "Amānta" as const, festivals: "Onam, Vishu" },
  { name: "Tamil Nadu", convention: "Amānta" as const, festivals: "Pongal, Tamil New Year" },
  { name: "Karnataka", convention: "Amānta" as const, festivals: "Ugadi" },
  { name: "Andhra Pradesh", convention: "Amānta" as const, festivals: "Ugadi" },
  { name: "Maharashtra", convention: "Amānta" as const, festivals: "Gudi Padwa, Ganesh Chaturthi" },
  { name: "Gujarat", convention: "Amānta" as const, festivals: "Bestu Varas, Uttarayan" },
  { name: "Uttar Pradesh", convention: "Pūrṇimānta" as const, festivals: "Diwali, Holi" },
  { name: "Bihar", convention: "Pūrṇimānta" as const, festivals: "Chhath Puja" },
  { name: "Rajasthan", convention: "Pūrṇimānta" as const, festivals: "Teej, Gangaur" },
  { name: "Punjab", convention: "Pūrṇimānta" as const, festivals: "Lohri, Vaisakhi" },
];

function getPrevMonth(month: string) {
  const idx = MONTHS.indexOf(month);
  return MONTHS[(idx - 1 + MONTHS.length) % MONTHS.length];
}

function getNextMonth(month: string) {
  const idx = MONTHS.indexOf(month);
  return MONTHS[(idx + 1) % MONTHS.length];
}

/* ─── Palette ─── */
const AMANTA_BG = "rgba(74, 111, 165, 0.10)";
const AMANTA_BORDER = "rgba(74, 111, 165, 0.45)";
const AMANTA_TEXT = "#4A6FA5";
const PURNIMANTA_BG = "rgba(107, 63, 160, 0.10)";
const PURNIMANTA_BORDER = "rgba(107, 63, 160, 0.45)";
const PURNIMANTA_TEXT = "#6B3FA0";
const GOLD = "#C28220";
const RUST = "#A23A1E";

/* ─── Component ─── */
export function AmantaPurnimantaConverter() {
  const [tab, setTab] = useState<"converter" | "festivals" | "regions">("converter");
  const [month, setMonth] = useState("Caitra");
  const [paksha, setPaksha] = useState<"śukla" | "kṛṣṇa">("śukla");
  const [source, setSource] = useState<"Amānta" | "Pūrṇimānta">("Amānta");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const result = useMemo(() => {
    const target = source === "Amānta" ? "Pūrṇimānta" : "Amānta";
    if (paksha === "śukla") {
      return { target, month, paksha, shifted: false };
    }
    // Kṛṣṇa pakṣa: Pūrṇimānta names it for the FOLLOWING month (it opens the
    // month that ends at the next Pūrṇimā), so Pūrṇimānta = Amānta + 1.
    if (source === "Amānta") {
      return { target, month: getNextMonth(month), paksha, shifted: true };
    }
    return { target, month: getPrevMonth(month), paksha, shifted: true };
  }, [month, paksha, source]);

  const simulateFestival = (f: FestivalDef) => {
    setMonth(f.month);
    setPaksha(f.paksha);
    setSource("Amānta");
    setTab("converter");
  };

  const tabBtn = (t: typeof tab, label: string) => (
    <button
      key={t}
      onClick={() => setTab(t)}
      role="tab"
      aria-selected={tab === t}
      className="px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap"
      style={{
        background: tab === t ? "var(--gl-gold-accent)" : "var(--gl-surface-card)",
        color: tab === t ? "#0a0a0f" : "var(--gl-ink-primary)",
        border: `1px solid ${tab === t ? "var(--gl-gold-accent)" : "var(--gl-border-subtle)"}`,
      }}
    >
      {label}
    </button>
  );

  return (
    <div
      className="w-full"
      style={{
        background: "var(--gl-surface-card, var(--gl-card-surface))",
        border: "1px solid var(--gl-border-subtle, var(--gl-gold-hairline))",
        borderRadius: "16px",
        padding: "24px",
      }}
      data-interactive="amanta-purnimanta-converter"
      role="tablist"
    >
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-xl font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
          <IAST>Amānta–Pūrṇimānta Converter</IAST>
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--gl-ink-muted)" }}>
          Cross-convention lunar calendar conversion
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 flex-wrap mb-5" role="tablist">
        {tabBtn("converter", "Pakṣa-Month Converter")}
        {tabBtn("festivals", "Festival Cross-Reference")}
        {tabBtn("regions", "Regional Identifier")}
      </div>

      {/* ── Converter ── */}
      {tab === "converter" && (
        <div className="space-y-5" role="tabpanel">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Input card */}
            <div className="rounded-xl p-5 space-y-4" style={{ background: "var(--gl-surface-card)", border: "1px solid var(--gl-border-subtle)" }}>
              <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--gl-gold-accent)" }}>Input</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--gl-ink-muted)" }}>Lunar Month</label>
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
                    style={{ background: "rgba(0,0,0,0.08)", border: "1px solid var(--gl-border-subtle)", color: "var(--gl-ink-primary)" }}
                  >
                    {MONTHS.map((m) => (<option key={m} value={m}>{m}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--gl-ink-muted)" }}>Pakṣa</label>
                  <div className="flex gap-2">
                    {(["śukla", "kṛṣṇa"] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPaksha(p)}
                        className="flex-1 px-3 py-2.5 rounded-lg text-sm font-bold transition-all"
                        style={{
                          background: paksha === p ? "rgba(201,162,77,0.15)" : "rgba(0,0,0,0.08)",
                          border: `1.5px solid ${paksha === p ? "var(--gl-gold-accent)" : "var(--gl-border-subtle)"}`,
                          color: paksha === p ? "var(--gl-gold-accent)" : "var(--gl-ink-secondary)",
                        }}
                      >
                        {p === "śukla" ? "Śukla (waxing)" : "Kṛṣṇa (waning)"}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--gl-ink-muted)" }}>Source Convention</label>
                  <div className="flex gap-2">
                    {(["Amānta", "Pūrṇimānta"] as const).map((c) => (
                      <button
                        key={c}
                        onClick={() => setSource(c)}
                        className="flex-1 px-3 py-2.5 rounded-lg text-sm font-bold transition-all"
                        style={{
                          background: source === c ? (c === "Amānta" ? AMANTA_BG : PURNIMANTA_BG) : "rgba(0,0,0,0.08)",
                          border: `1.5px solid ${source === c ? (c === "Amānta" ? AMANTA_BORDER : PURNIMANTA_BORDER) : "var(--gl-border-subtle)"}`,
                          color: source === c ? (c === "Amānta" ? AMANTA_TEXT : PURNIMANTA_TEXT) : "var(--gl-ink-secondary)",
                        }}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Output card */}
            <div className="rounded-xl p-5 space-y-4" style={{ background: "var(--gl-surface-card)", border: "1px solid var(--gl-border-subtle)" }}>
              <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--gl-gold-accent)" }}>Equivalent in {result.target}</h3>
              <div
                className="rounded-xl p-5 space-y-3 transition-all"
                style={{
                  background: result.target === "Amānta" ? AMANTA_BG : PURNIMANTA_BG,
                  border: `2px solid ${result.target === "Amānta" ? AMANTA_BORDER : PURNIMANTA_BORDER}`,
                }}
              >
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span
                    className="text-4xl font-bold"
                    style={{ color: result.target === "Amānta" ? AMANTA_TEXT : PURNIMANTA_TEXT, fontFamily: "var(--font-cormorant), serif", lineHeight: 1 }}
                  >
                    {result.month}
                  </span>
                  <span className="text-sm font-medium" style={{ color: "var(--gl-ink-muted)" }}>{result.paksha} pakṣa</span>
                </div>
                {result.shifted ? (
                  <p className="text-sm leading-relaxed" style={{ color: "var(--gl-ink-secondary)" }}>
                    The <strong>{source}</strong> month <strong>{month}</strong> in {paksha} pakṣa maps to <strong>{result.month}</strong> in <strong>{result.target}</strong> because kṛṣṇa pakṣa shifts by one month.
                  </p>
                ) : (
                  <p className="text-sm leading-relaxed" style={{ color: "var(--gl-ink-secondary)" }}>
                    Śukla pakṣa keeps the same month name in both conventions. No shift is needed.
                  </p>
                )}
              </div>
              <div
                className="rounded-lg p-4 text-xs leading-relaxed"
                style={{ background: "rgba(0,0,0,0.08)", border: "1px solid var(--gl-gold-hairline)", color: "var(--gl-ink-muted)" }}
              >
                <strong style={{ color: "var(--gl-gold-accent)" }}>Rule of thumb:</strong>{" "}
                Śukla pakṣa = same month name in both conventions. Kṛṣṇa pakṣa = shift by one month:
                Amānta → Pūrṇimānta is the <em>following</em> month (+1); Pūrṇimānta → Amānta is the <em>previous</em> month (−1).
              </div>
            </div>
          </div>

          {/* Month Cycle Ring */}
          <div className="flex justify-center">
            <MonthCycleRing source={source} month={month} paksha={paksha} shifted={result.shifted} targetMonth={result.month} />
          </div>
        </div>
      )}

      {/* ── Festivals ── */}
      {tab === "festivals" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="tabpanel">
          {FESTIVALS.map((f) => (
            <div
              key={f.name}
              className="rounded-xl p-5 space-y-3 transition-all hover:scale-[1.01]"
              style={{ background: "var(--gl-surface-card)", border: "1px solid var(--gl-border-subtle)" }}
            >
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold" style={{ color: "var(--gl-ink-primary)" }}>{f.name}</h4>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{
                    background: f.paksha === "śukla" ? "rgba(232,158,42,0.12)" : "rgba(212,80,46,0.12)",
                    color: f.paksha === "śukla" ? GOLD : RUST,
                    border: `1px solid ${f.paksha === "śukla" ? "rgba(194,130,32,0.35)" : "rgba(162,58,30,0.35)"}`,
                  }}
                >
                  {f.paksha}
                </span>
              </div>
              <div className="space-y-2">
                <div className="rounded-lg p-3" style={{ background: AMANTA_BG, border: `1px solid ${AMANTA_BORDER}` }}>
                  <span className="text-xs font-bold block mb-1" style={{ color: AMANTA_TEXT }}>Amānta</span>
                  <span className="text-sm font-medium" style={{ color: "var(--gl-ink-primary)" }}>{f.amanta}</span>
                </div>
                <div className="rounded-lg p-3" style={{ background: PURNIMANTA_BG, border: `1px solid ${PURNIMANTA_BORDER}` }}>
                  <span className="text-xs font-bold block mb-1" style={{ color: PURNIMANTA_TEXT }}>Pūrṇimānta</span>
                  <span className="text-sm font-medium" style={{ color: "var(--gl-ink-primary)" }}>{f.purnimanta}</span>
                </div>
              </div>
              <p className="text-xs italic leading-relaxed" style={{ color: "var(--gl-ink-muted)" }}>{f.note}</p>
              <button
                onClick={() => simulateFestival(f)}
                className="w-full px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                style={{
                  background: "rgba(201,162,77,0.10)",
                  border: "1px solid rgba(201,162,77,0.30)",
                  color: "var(--gl-gold-accent)",
                }}
              >
                Simulate in Converter →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Regions ── */}
      {tab === "regions" && (
        <div className="space-y-5" role="tabpanel">
          {/* India Map SVG */}
          <div className="flex justify-center mb-4">
            <IndiaMapSVG selectedRegion={selectedRegion} onSelect={setSelectedRegion} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Amānta regions */}
            <div className="rounded-xl p-5 space-y-3" style={{ background: AMANTA_BG, border: `1.5px solid ${AMANTA_BORDER}` }}>
              <h4 className="text-sm font-bold uppercase tracking-wider" style={{ color: AMANTA_TEXT }}>Amānta — South & West</h4>
              <div className="flex flex-wrap gap-2">
                {REGIONS.filter((r) => r.convention === "Amānta").map((r) => (
                  <button
                    key={r.name}
                    onClick={() => setSelectedRegion(r.name)}
                    className="px-3 py-1.5 rounded-full text-sm font-bold transition-all"
                    style={{
                      background: selectedRegion === r.name ? AMANTA_TEXT : "rgba(255,255,255,0.3)",
                      color: selectedRegion === r.name ? "#fff" : AMANTA_TEXT,
                      border: `1px solid ${AMANTA_BORDER}`,
                    }}
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            </div>
            {/* Pūrṇimānta regions */}
            <div className="rounded-xl p-5 space-y-3" style={{ background: PURNIMANTA_BG, border: `1.5px solid ${PURNIMANTA_BORDER}` }}>
              <h4 className="text-sm font-bold uppercase tracking-wider" style={{ color: PURNIMANTA_TEXT }}>Pūrṇimānta — North</h4>
              <div className="flex flex-wrap gap-2">
                {REGIONS.filter((r) => r.convention === "Pūrṇimānta").map((r) => (
                  <button
                    key={r.name}
                    onClick={() => setSelectedRegion(r.name)}
                    className="px-3 py-1.5 rounded-full text-sm font-bold transition-all"
                    style={{
                      background: selectedRegion === r.name ? PURNIMANTA_TEXT : "rgba(255,255,255,0.3)",
                      color: selectedRegion === r.name ? "#fff" : PURNIMANTA_TEXT,
                      border: `1px solid ${PURNIMANTA_BORDER}`,
                    }}
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {selectedRegion ? (
            <div
              className="rounded-xl p-4 text-sm"
              style={{ background: "var(--gl-surface-card)", border: "1px solid var(--gl-gold-hairline)", color: "var(--gl-ink-secondary)" }}
            >
              <strong style={{ color: "var(--gl-gold-accent)" }}>{selectedRegion}</strong> follows the{" "}
              <strong>{REGIONS.find((r) => r.name === selectedRegion)?.convention}</strong> convention.
              <br />
              <span className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>
                Notable festivals: {REGIONS.find((r) => r.name === selectedRegion)?.festivals}
              </span>
            </div>
          ) : (
            <div
              className="rounded-xl p-4 text-center text-sm"
              style={{ background: "var(--gl-surface-card)", border: "1px dashed var(--gl-gold-hairline)", color: "var(--gl-ink-muted)" }}
            >
              Select a region on the map or from the lists above to see its convention details.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Month Cycle Ring SVG with animated transitions ─── */
function MonthCycleRing({ source, month, paksha, shifted, targetMonth }: { source: string; month: string; paksha: string; shifted: boolean; targetMonth: string }) {
  const CX = 250;
  const CY = 250;
  const R = 180;
  const monthIdx = MONTHS.indexOf(month);
  const targetIdx = MONTHS.indexOf(targetMonth);

  return (
    <svg viewBox="0 0 500 500" className="w-full h-auto" style={{ maxWidth: 380 }}>
      <defs>
        <filter id="mShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#6B4423" floodOpacity="0.12" />
        </filter>
        <marker id="arrowhead" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
          <polygon points="0 0, 7 2.5, 0 5" fill={PURNIMANTA_TEXT} />
        </marker>
      </defs>

      {/* Outer ring */}
      <circle cx={CX} cy={CY} r={R + 10} fill="none" stroke="var(--gl-gold-hairline)" strokeWidth={1} opacity={0.35} />

      {/* Month segments */}
      {MONTHS.map((m, i) => {
        const startAngle = i * (360 / 12) - 90;
        const endAngle = (i + 1) * (360 / 12) - 90;
        const midAngle = (startAngle + endAngle) / 2;
        const lx = CX + (R - 30) * Math.cos((midAngle * Math.PI) / 180);
        const ly = CY + (R - 30) * Math.sin((midAngle * Math.PI) / 180);
        const isSource = i === monthIdx;
        const isTarget = i === targetIdx;

        const x1 = CX + R * Math.cos((startAngle * Math.PI) / 180);
        const y1 = CY + R * Math.sin((startAngle * Math.PI) / 180);
        const x2 = CX + R * Math.cos((endAngle * Math.PI) / 180);
        const y2 = CY + R * Math.sin((endAngle * Math.PI) / 180);
        const largeArc = endAngle - startAngle > 180 ? 1 : 0;

        return (
          <g key={m}>
            <path
              d={`M ${CX} ${CY} L ${x1} ${y1} A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2} Z`}
              fill={isSource ? `${AMANTA_TEXT}20` : isTarget ? `${PURNIMANTA_TEXT}20` : "transparent"}
              stroke={isSource ? AMANTA_TEXT : isTarget ? PURNIMANTA_TEXT : "var(--gl-gold-hairline)"}
              strokeWidth={isSource || isTarget ? 2.5 : 0.6}
              filter="url(#mShadow)"
              style={{ transition: "all 0.35s cubic-bezier(0.32, 0.72, 0.24, 1)" }}
            />
            <text
              x={lx} y={ly}
              textAnchor="middle"
              fill={isSource ? AMANTA_TEXT : isTarget ? PURNIMANTA_TEXT : "var(--gl-ink-muted)"}
              fontSize={isSource || isTarget ? 12 : 10}
              fontWeight={isSource || isTarget ? 800 : 500}
              style={{ pointerEvents: "none", fontFamily: "var(--font-sans), sans-serif", transition: "all 0.35s ease" }}
            >
              {m.slice(0, 4)}
            </text>
          </g>
        );
      })}

      {/* Centre disc */}
      <circle cx={CX} cy={CY} r={54} fill="var(--gl-card-surface-solid, #FFF9F0)" stroke="var(--gl-gold-accent)" strokeWidth={2} filter="url(#mShadow)" />
      <text x={CX} y={CY - 10} textAnchor="middle" fill="var(--gl-ink-primary)" fontSize={12} fontWeight={800} style={{ fontFamily: "var(--font-sans), sans-serif" }}>{source}</text>
      <text x={CX} y={CY + 8} textAnchor="middle" fill={paksha === "śukla" ? GOLD : RUST} fontSize={11} fontWeight={700} style={{ fontFamily: "var(--font-sans), sans-serif", transition: "fill 0.35s ease" }}>{paksha}</text>
      {shifted && (
        <text x={CX} y={CY + 26} textAnchor="middle" fill="var(--gl-ink-muted)" fontSize={9} fontWeight={700} style={{ fontFamily: "var(--font-sans), sans-serif" }}>→ shifts</text>
      )}

      {/* Animated arrow from source to target */}
      {shifted && (
        <path
          d={`M ${CX + 62 * Math.cos(((monthIdx * 30 + 15 - 90) * Math.PI) / 180)} ${CY + 62 * Math.sin(((monthIdx * 30 + 15 - 90) * Math.PI) / 180)}
              A 62 62 0 ${Math.abs(targetIdx - monthIdx) > 6 ? 1 : 0} ${targetIdx > monthIdx ? 1 : 0}
              ${CX + 62 * Math.cos(((targetIdx * 30 + 15 - 90) * Math.PI) / 180)} ${CY + 62 * Math.sin(((targetIdx * 30 + 15 - 90) * Math.PI) / 180)}`}
          fill="none"
          stroke={PURNIMANTA_TEXT}
          strokeWidth={2.5}
          strokeDasharray="5 3"
          markerEnd="url(#arrowhead)"
          style={{ transition: "all 0.5s cubic-bezier(0.32, 0.72, 0.24, 1)" }}
        />
      )}
    </svg>
  );
}

/* ─── India Map SVG (smoother, more recognizable) ─── */
function IndiaMapSVG({ selectedRegion, onSelect }: { selectedRegion: string | null; onSelect: (r: string) => void }) {
  const regions = [
    { name: "Kerala", cx: 155, cy: 395, convention: "Amānta" },
    { name: "Tamil Nadu", cx: 185, cy: 385, convention: "Amānta" },
    { name: "Karnataka", cx: 145, cy: 345, convention: "Amānta" },
    { name: "Andhra Pradesh", cx: 185, cy: 325, convention: "Amānta" },
    { name: "Maharashtra", cx: 135, cy: 275, convention: "Amānta" },
    { name: "Gujarat", cx: 95, cy: 235, convention: "Amānta" },
    { name: "Uttar Pradesh", cx: 210, cy: 185, convention: "Pūrṇimānta" },
    { name: "Bihar", cx: 265, cy: 195, convention: "Pūrṇimānta" },
    { name: "Rajasthan", cx: 125, cy: 185, convention: "Pūrṇimānta" },
    { name: "Punjab", cx: 145, cy: 135, convention: "Pūrṇimānta" },
  ];

  // Smoother India outline using bezier curves
  const indiaPath = "M95,120 C105,110 115,100 130,95 C145,90 160,88 175,90 C190,92 205,95 220,100 C235,105 248,115 255,130 C262,145 265,160 262,175 C259,190 252,205 245,220 C238,235 232,250 228,265 C224,280 220,295 215,310 C210,325 202,340 192,355 C182,370 170,382 160,395 C155,402 150,408 145,405 C140,402 138,395 135,388 C132,381 130,374 128,367 C126,360 124,353 122,346 C120,339 118,332 116,325 C114,318 112,311 110,304 C108,297 106,290 104,283 C102,276 100,269 98,262 C96,255 94,248 92,241 C90,234 88,227 87,220 C86,213 85,206 84,199 C83,192 82,185 82,178 C82,171 83,164 84,157 C85,150 87,143 89,136 C91,129 93,124 95,120 Z";

  return (
    <svg viewBox="0 0 350 450" className="w-full h-auto" style={{ maxWidth: 340 }}>
      <defs>
        <filter id="iShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#6B4423" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* Stylised India outline with bezier curves */}
      <path
        d={indiaPath}
        fill="var(--gl-card-surface-solid, #FFF9F0)"
        stroke="var(--gl-gold-hairline)"
        strokeWidth={1.5}
        filter="url(#iShadow)"
      />

      {/* Inner decorative lines (rivers / stylized) */}
      <path d="M110,200 Q150,210 200,195" fill="none" stroke="rgba(74,111,165,0.20)" strokeWidth={0.8} strokeDasharray="3 3" />
      <path d="M120,280 Q160,290 190,270" fill="none" stroke="rgba(74,111,165,0.20)" strokeWidth={0.8} strokeDasharray="3 3" />

      {/* Region markers */}
      {regions.map((r) => {
        const isSelected = selectedRegion === r.name;
        const color = r.convention === "Amānta" ? AMANTA_TEXT : PURNIMANTA_TEXT;
        return (
          <g key={r.name} style={{ cursor: "pointer" }} onClick={() => onSelect(r.name)}>
            <circle
              cx={r.cx}
              cy={r.cy}
              r={isSelected ? 9 : 6}
              fill={color}
              opacity={isSelected ? 1 : 0.75}
              style={{ transition: "all 0.25s cubic-bezier(0.32, 0.72, 0.24, 1)" }}
            />
            {isSelected && (
              <circle
                cx={r.cx}
                cy={r.cy}
                r={13}
                fill="none"
                stroke={color}
                strokeWidth={1.5}
                strokeDasharray="2 2"
                opacity={0.5}
              />
            )}
            <text
              x={r.cx}
              y={r.cy - (isSelected ? 14 : 11)}
              textAnchor="middle"
              fill={color}
              fontSize={isSelected ? 10 : 8}
              fontWeight={isSelected ? 800 : 600}
              style={{ pointerEvents: "none", fontFamily: "var(--font-sans), sans-serif", transition: "all 0.2s ease" }}
            >
              {r.name}
            </text>
          </g>
        );
      })}

      {/* Legend */}
      <g transform="translate(20, 425)">
        <circle cx={5} cy={-3} r={5} fill={AMANTA_TEXT} />
        <text x={16} y={0} fill={AMANTA_TEXT} fontSize={9} fontWeight={700}>Amānta</text>
        <circle cx={85} cy={-3} r={5} fill={PURNIMANTA_TEXT} />
        <text x={96} y={0} fill={PURNIMANTA_TEXT} fontSize={9} fontWeight={700}>Pūrṇimānta</text>
      </g>
    </svg>
  );
}
