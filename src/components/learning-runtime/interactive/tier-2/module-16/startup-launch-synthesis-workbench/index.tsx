"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Circle,
  Copy,
  FileText,
  Info,
  LayoutTemplate,
  Lock,
  MessageSquareQuote,
  RotateCcw,
  Scale,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

type TabKey = "synthesis" | "chart" | "script" | "comparison";
type RowStatus = "favourable" | "strong" | "indirect" | "incomplete" | "neutral";

interface SynthesisRow {
  id: string;
  check: string;
  result: string;
  status: RowStatus;
  source: string;
  category: "pancanga" | "mercury-jupiter" | "house-bala" | "wealth-yoga" | "tech-refinement";
}

const SYNTHESIS_ROWS: SynthesisRow[] = [
  { id: "tithi", check: "Tithi", result: "Śukla Daśamī — Pūrṇā class, favoured", status: "favourable", source: "16.4.1 §4.1, §4.5", category: "pancanga" },
  { id: "vara", check: "Vāra", result: "Wednesday — most-favoured", status: "favourable", source: "16.4.1 §4.1, §4.5", category: "pancanga" },
  { id: "nakshatra", check: "Nakṣatra", result: "Hasta — most-favoured", status: "favourable", source: "16.4.1 §4.1, §4.5", category: "pancanga" },
  { id: "yoga", check: "Yoga", result: "Siddhi — most-favoured", status: "favourable", source: "16.4.1 §4.1, §4.5", category: "pancanga" },
  { id: "karana", check: "Karaṇa", result: "Taitila — favoured", status: "favourable", source: "16.4.1 §4.1, §4.5", category: "pancanga" },
  { id: "mercury", check: "Mercury", result: "Own sign (Gemini), non-combust (19° from Sun), 10th house (kendra, lagna lord) — strong", status: "strong", source: "16.4.1 §4.2; 16.4.2 §4.4", category: "mercury-jupiter" },
  { id: "jupiter", check: "Jupiter", result: "Exalted (Cancer), non-combust (54° from Sun), 11th house (upachaya, most-central) — strong", status: "strong", source: "16.4.1 §4.2", category: "mercury-jupiter" },
  { id: "house-1", check: "1st house (self/founder)", result: "Occupied by the Moon (kendra by definition, the lagna itself)", status: "strong", source: "16.4.3 §4.4", category: "house-bala" },
  { id: "house-2", check: "2nd house (wealth/finances)", result: "Unoccupied by the five charted planets; lord Venus own-sign but placed in the 9th, not the 2nd — indirect, quieter signal", status: "indirect", source: "16.4.3 §4.4", category: "house-bala" },
  { id: "house-10", check: "10th house (career, most-central)", result: "Occupied by own-sign Mercury (lagna lord) — strong, direct", status: "strong", source: "16.4.1 §4.3; 16.4.2 §4.4", category: "house-bala" },
  { id: "house-11", check: "11th house (gains, most-central)", result: "Occupied by exalted Jupiter — strong, direct; lord Moon angularly placed in 1st", status: "strong", source: "16.4.1 §4.3; 16.4.3 §4.4", category: "house-bala" },
  { id: "wealth-yoga", check: "Wealth-yoga-structure echo", result: "Venus (9th lord) own-sign in the 9th (trikoṇa); Mercury (lagna lord) own-sign in the 10th (kendra) — both criteria independently satisfied", status: "strong", source: "16.4.2 §6 Example 1", category: "wealth-yoga" },
  { id: "tech-mercury", check: "Technology-type refinement (Mercury)", result: "Already strong per the 10th-house/lagna-lord finding above; doubles as this refinement's own named significator", status: "strong", source: "16.4.1 §4.4", category: "tech-refinement" },
  { id: "tech-3rd", check: "Technology-type refinement (3rd house)", result: "Unoccupied by the five charted planets; lord Mars not included in this candidate's own charted planet-set — no finding possible, disclosed as a genuine scope gap", status: "incomplete", source: "This lesson §4.3", category: "tech-refinement" },
];

const LOCKED_VERBATIM = `It supports favourable conditions for your launch, but it is one input among many to how your venture actually unfolds -- your own execution, your team, your market, and broader economic conditions all also operate.`;

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

interface Planet {
  key: string;
  label: string;
  short: string;
  signIndex: number;
  degree?: string;
  color: string;
  note: string;
}

const PLANETS: Planet[] = [
  { key: "sun", label: "Sun", short: "Su", signIndex: 1, degree: "21°", color: GOLD, note: "2nd house" },
  { key: "moon", label: "Moon", short: "Mo", signIndex: 5, degree: "11°", color: BLUE, note: "1st house, Hasta pāda 1" },
  { key: "mercury", label: "Mercury", short: "Me", signIndex: 2, degree: "10°", color: GREEN, note: "10th house, own sign" },
  { key: "venus", label: "Venus", short: "Ve", signIndex: 1, degree: "2°", color: BLUE, note: "9th house, own sign" },
  { key: "jupiter", label: "Jupiter", short: "Ju", signIndex: 3, degree: "15°", color: GOLD, note: "11th house, exalted" },
];

const LAGNA_INDEX = 5;

function statusColor(status: RowStatus): string {
  if (status === "favourable" || status === "strong") return GREEN;
  if (status === "indirect") return GOLD;
  if (status === "incomplete") return BLUE;
  return INK_MUTED;
}

function statusLabel(status: RowStatus): string {
  if (status === "favourable") return "favourable";
  if (status === "strong") return "strong";
  if (status === "indirect") return "indirect / quieter";
  if (status === "incomplete") return "incomplete";
  return "neutral";
}

function StatusChip({ status }: { status: RowStatus }) {
  const color = statusColor(status);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.25rem",
        padding: "0.125rem 0.5rem",
        borderRadius: "9999px",
        border: `1px solid ${color}`,
        color,
        fontSize: "0.7rem",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.03em",
      }}
    >
      {status === "incomplete" ? <Info size={10} /> : <CheckCircle2 size={10} />}
      {statusLabel(status)}
    </span>
  );
}

function SynthesisPanel({
  included,
  onToggle,
}: {
  included: Set<string>;
  onToggle: (id: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <p style={{ margin: 0, fontSize: "0.875rem", color: INK_SECONDARY, lineHeight: 1.55 }}>
        {`Ananya Rao's candidate assembled row by row. Toggle rows to see how the script's "specifically" paragraph changes. The 3rd-house technology gap cannot be rounded to favourable or unfavourable.`}
      </p>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
          <thead>
            <tr>
              <th style={thStyle}>Check</th>
              <th style={thStyle}>Result</th>
              <th style={{ ...thStyle, textAlign: "center" }}>Status</th>
              <th style={thStyle}>Source</th>
              <th style={{ ...thStyle, textAlign: "center" }}>Include</th>
            </tr>
          </thead>
          <tbody>
            {SYNTHESIS_ROWS.map((row) => {
              const active = included.has(row.id);
              return (
                <tr key={row.id} style={{ opacity: active ? 1 : 0.55, background: row.status === "incomplete" ? `${BLUE}08` : undefined }}>
                  <td style={tdStyle}>
                    <span style={{ fontWeight: 600, color: active ? INK_PRIMARY : INK_MUTED }}>{row.check}</span>
                  </td>
                  <td style={tdStyle}>{row.result}</td>
                  <td style={{ ...tdStyle, textAlign: "center" }}>
                    <StatusChip status={row.status} />
                  </td>
                  <td style={{ ...tdStyle, color: INK_MUTED, fontSize: "0.78rem" }}>{row.source}</td>
                  <td style={{ ...tdStyle, textAlign: "center" }}>
                    <button
                      type="button"
                      onClick={() => onToggle(row.id)}
                      aria-pressed={active}
                      style={{
                        padding: 0,
                        margin: 0,
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        color: active ? GREEN : INK_MUTED,
                      }}
                    >
                      {active ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.5rem 0.75rem",
          borderRadius: 6,
          border: `1px solid ${BLUE}`,
          background: `${BLUE}10`,
          fontSize: "0.8rem",
          color: INK_SECONDARY,
        }}
      >
        <Info size={14} color={BLUE} />
        {`Honest scope: the 3rd-house technology-refinement row is incomplete because Mars was not computed for this teaching example. It is included in the table as a disclosed gap, not silently dropped.`}
      </div>
    </div>
  );
}

function ChartPanel() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
      <p style={{ margin: 0, fontSize: "0.875rem", color: INK_SECONDARY, lineHeight: 1.55 }}>
        {`Ananya's designed candidate: Virgo lagna, Hasta nakṣatra, Mercury own-sign in the 10th, Jupiter exalted in the 11th, Venus own-sign in the 9th, Moon in the 1st, Sun in the 2nd.`}
      </p>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <ChartSvg />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.5rem" }}>
        {PLANETS.map((p) => (
          <div key={p.key} style={{ padding: "0.55rem", borderRadius: 6, border: `1px solid ${HAIRLINE}`, background: SURFACE }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <span style={{ width: 20, height: 20, borderRadius: "50%", background: `${p.color}20`, color: p.color, fontSize: "0.7rem", fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                {p.short}
              </span>
              <span style={{ fontWeight: 600, fontSize: "0.85rem", color: INK_PRIMARY }}>{p.label}</span>
              <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: INK_MUTED }}>{p.degree}</span>
            </div>
            <div style={{ fontSize: "0.78rem", color: INK_SECONDARY, marginTop: "0.15rem" }}>
              {SIGNS[p.signIndex]} — {p.note}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartSvg() {
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const r = 110;

  function coords(index: number, radius: number) {
    const angle = ((index - LAGNA_INDEX) * 30 - 90) * (Math.PI / 180);
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  }

  const highlightedHouses = [1, 2, 9, 10, 11];
  const houseColors: Record<number, string> = { 1: PURPLE, 2: GOLD, 9: BLUE, 10: GREEN, 11: GOLD };

  return (
    <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Ananya Rao's launch-moment chart: Virgo lagna with 1st, 2nd, 9th, 10th and 11th houses highlighted" style={{ width: "100%", maxWidth: 320, display: "block" }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={HAIRLINE} strokeWidth={1} />
      {SIGNS.map((_, i) => {
        const a = ((i - LAGNA_INDEX) * 30 - 90) * (Math.PI / 180);
        const x1 = cx + (r - 10) * Math.cos(a);
        const y1 = cy + (r - 10) * Math.sin(a);
        const x2 = cx + r * Math.cos(a);
        const y2 = cy + r * Math.sin(a);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK_MUTED} strokeWidth={1} />;
      })}
      {SIGNS.map((sign, i) => {
        const houseNumber = ((i - LAGNA_INDEX + 12) % 12) + 1;
        const pos = coords(i, r - 26);
        const isLagna = i === LAGNA_INDEX;
        const highlighted = highlightedHouses.includes(houseNumber);
        const color = isLagna ? PURPLE : houseColors[houseNumber] || HAIRLINE;
        return (
          <g key={sign}>
            <circle cx={pos.x} cy={pos.y} r={20} fill={highlighted ? `${color}18` : "transparent"} stroke={color} strokeWidth={highlighted ? 2.5 : 1} />
            <text x={pos.x} y={pos.y + 4} textAnchor="middle" fontSize={10} fill={highlighted ? INK_PRIMARY : INK_SECONDARY} fontWeight={600}>
              {sign.slice(0, 3)}
            </text>
            {highlighted && (
              <text x={pos.x} y={pos.y + 34} textAnchor="middle" fontSize={9} fill={color} fontWeight={600}>
                H{houseNumber}
              </text>
            )}
          </g>
        );
      })}
      <polygon points={`${cx},${cy - r - 10} ${cx - 6},${cy - r + 6} ${cx + 6},${cy - r + 6}`} fill={PURPLE} />
      <text x={cx} y={cy - r - 16} textAnchor="middle" fontSize={10} fill={PURPLE} fontWeight={600}>
        Lagna
      </text>
      {PLANETS.map((p, idx) => {
        const pos = coords(p.signIndex, r - 55);
        const offset = (idx - 2) * 14;
        return (
          <g key={p.key}>
            <circle cx={pos.x + offset} cy={pos.y} r={14} fill={`${p.color}22`} stroke={p.color} strokeWidth={2} />
            <text x={pos.x + offset} y={pos.y + 4} textAnchor="middle" fontSize={9} fill={p.color} fontWeight={700}>
              {p.short}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function ScriptPanel({
  included,
  founder,
  setFounder,
  date,
  setDate,
  time,
  setTime,
}: {
  included: Set<string>;
  founder: string;
  setFounder: (value: string) => void;
  date: string;
  setDate: (value: string) => void;
  time: string;
  setTime: (value: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  const includedRows = useMemo(() => SYNTHESIS_ROWS.filter((r) => included.has(r.id)), [included]);
  const strongRows = includedRows.filter((r) => r.status === "favourable" || r.status === "strong");
  const incompleteRows = includedRows.filter((r) => r.status === "incomplete");
  const indirectRows = includedRows.filter((r) => r.status === "indirect");

  const specifically = useMemo(() => {
    const parts: string[] = [];
    if (strongRows.length > 0) {
      const labels = strongRows.map((r) => r.check);
      const joined = labels.length > 1 ? `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}` : labels[0];
      parts.push(`Specifically, ${joined} ${labels.length > 1 ? "are" : "is"} genuinely strong.`);
    }
    if (indirectRows.length > 0) {
      parts.push(`The ${indirectRows.map((r) => r.check).join(" and ")} ${indirectRows.length > 1 ? "are" : "is"} a quieter, indirect signal rather than a direct one — worth naming honestly.`);
    }
    if (incompleteRows.length > 0) {
      parts.push(`One technology-specific check -- involving a planet we did not compute for this teaching example -- remains open; in an actual consultation, we would complete it before finalising.`);
    }
    if (parts.length === 0) {
      parts.push("No specific checks are selected for the script.");
    }
    parts.push("We are not claiming a perfect moment exists or that this timing predicts your venture's own success -- only that, on the evidence actually gathered, it is a well-supported one.");
    return parts.join(" ");
  }, [strongRows, indirectRows, incompleteRows]);

  const fullScript = useMemo(
    () => `Based on the full screening we've completed for ${founder} -- the pañcāṅga check, the Mercury-Jupiter strength assessment, your launch moment's own house-and-planetary strength, and a wealth-yoga-structure reading -- ${date}, at ${time}, is the best-available selection from the candidates we evaluated.\n\n${LOCKED_VERBATIM}\n\n${specifically}`,
    [founder, date, time, specifically],
  );

  function handleCopy() {
    void navigator.clipboard.writeText(fullScript).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.65rem" }}>
        <label style={fieldLabelStyle}>
          Founder name
          <input type="text" value={founder} onChange={(e) => setFounder(e.target.value)} style={inputStyle} />
        </label>
        <label style={fieldLabelStyle}>
          Date
          <input type="text" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
        </label>
        <label style={fieldLabelStyle}>
          Time
          <input type="text" value={time} onChange={(e) => setTime(e.target.value)} style={inputStyle} />
        </label>
      </div>

      <div
        style={{
          background: SURFACE,
          border: `1px solid ${HAIRLINE}`,
          borderRadius: 8,
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: INK_MUTED, display: "flex", alignItems: "center", gap: "0.375rem" }}>
            <MessageSquareQuote size={14} />
            Draft script
          </span>
          <button type="button" onClick={handleCopy} style={{ ...buttonStyle(false, GOLD), fontSize: "0.78rem" }}>
            {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy full script"}
          </button>
        </div>
        <p style={{ margin: 0, fontSize: "0.9rem", color: INK_PRIMARY, lineHeight: 1.65 }}>
          {`Based on the full screening we've completed for `}
          <strong style={{ fontWeight: 600, color: GOLD }}>{founder}</strong>
          {` -- the pañcāṅga check, the Mercury-Jupiter strength assessment, your launch moment's own house-and-planetary strength, and a wealth-yoga-structure reading -- `}
          <strong style={{ fontWeight: 600, color: GOLD }}>{date}</strong>
          {`, at `}
          <strong style={{ fontWeight: 600, color: GOLD }}>{time}</strong>
          {`, is the best-available selection from the candidates we evaluated.`}
        </p>
        <blockquote
          style={{
            margin: 0,
            padding: "0.65rem 0.85rem",
            borderLeft: `3px solid ${GOLD}`,
            background: `${GOLD}08`,
            borderRadius: "0 6px 6px 0",
            fontSize: "0.9rem",
            color: INK_SECONDARY,
            lineHeight: 1.6,
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: GOLD, marginBottom: "0.35rem" }}>
            <Lock size={12} />
            Mandated verbatim language — not editable
          </span>
          {LOCKED_VERBATIM}
        </blockquote>
        <p style={{ margin: 0, fontSize: "0.9rem", color: INK_PRIMARY, lineHeight: 1.65 }}>{specifically}</p>
      </div>
    </div>
  );
}

function ComparisonPanel() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
      <p style={{ margin: 0, fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.65 }}>
        {`The underlying multi-layer synthesis method is identical across Chapters 2-4: assemble every check, build one honest table, extend the mandated script, and disclose what remains open. What differs is the actor-structure the method is applied to.`}
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.65rem" }}>
        <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: SURFACE }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: INK_MUTED, marginBottom: "0.35rem" }}>Marriage (Lesson 16.2.5)</div>
          <div style={{ fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
            {`Paired-actor synthesis: two individuals' own tārā-bala, lagna-śuddhi, and compatibility-matching are checked simultaneously.`}
          </div>
        </div>
        <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: SURFACE }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: INK_MUTED, marginBottom: "0.35rem" }}>Gṛha-praveśa (Lesson 16.3.4)</div>
          <div style={{ fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
            {`Single-actor synthesis: one family unit is served by one set of pañcāṅga, house-bala, triad, Vāstu-overlay, and seasonal-calendar checks.`}
          </div>
        </div>
        <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${GREEN}`, background: `${GREEN}08` }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: GREEN, marginBottom: "0.35rem" }}>Business-launch (this lesson)</div>
          <div style={{ fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
            {`Founder-plus-venture synthesis: one founder, plus a venture that will eventually have its own incorporation-moment chart. This chapter's timing service is distinct from T2-14's founder-vs-incorporation overlay reading.`}
          </div>
        </div>
      </div>
      <div
        style={{
          padding: "0.65rem 0.85rem",
          borderRadius: 6,
          border: `1px solid ${BLUE}`,
          background: `${BLUE}08`,
          fontSize: "0.85rem",
          color: INK_SECONDARY,
          lineHeight: 1.55,
        }}
      >
        <Info size={14} color={BLUE} style={{ display: "inline", marginRight: 6, verticalAlign: "text-bottom" }} />
        {`T2-14 Lesson 14.6.2's founder-vs-incorporation reading is a complementary, non-required analysis. It may be run on a candidate moment as one further input, or afterward as a separate retrospective reading; it is not a prerequisite for this chapter's muhūrta-timing service.`}
      </div>
    </div>
  );
}

function TabButton({
  label,
  active,
  onClick,
  icon,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        padding: "0.5rem 0.75rem",
        borderRadius: 6,
        border: `1px solid ${active ? ACCENT : HAIRLINE}`,
        background: active ? `${ACCENT}15` : SURFACE,
        color: active ? ACCENT : INK_SECONDARY,
        fontWeight: 600,
        fontSize: "0.82rem",
        cursor: "pointer",
      }}
    >
      {icon}
      {label}
    </button>
  );
}

export function StartupLaunchSynthesisWorkbench() {
  const [tab, setTab] = useState<TabKey>("synthesis");
  const [included, setIncluded] = useState<Set<string>>(new Set(SYNTHESIS_ROWS.map((r) => r.id)));
  const [founder, setFounder] = useState("Ananya Rao");
  const [date, setDate] = useState("the selected date");
  const [time, setTime] = useState("the selected time");

  const includedCount = included.size;
  const hasIncomplete = included.has("tech-3rd");

  function toggleIncluded(id: string) {
    setIncluded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function reset() {
    setTab("synthesis");
    setIncluded(new Set(SYNTHESIS_ROWS.map((r) => r.id)));
    setFounder("Ananya Rao");
    setDate("the selected date");
    setTime("the selected time");
  }

  return (
    <div data-interactive="startup-launch-synthesis-workbench" style={{ display: "flex", flexDirection: "column", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Business-launch complete synthesis</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.25rem", fontWeight: 600 }}>
              {`Assemble Ananya Rao's full evidence file and draft the extended client script`}
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              {`Fourteen rows converge on one recommendation. Every completable check is favourable; the 3rd-house technology gap is disclosed as incomplete rather than silently dropped.`}
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, ACCENT)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
        <div
          style={{
            marginTop: "0.65rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            padding: "0.25rem 0.5rem",
            borderRadius: 4,
            background: `${BLUE}10`,
            color: BLUE,
            fontSize: "0.72rem",
            fontWeight: 500,
          }}
        >
          <BookOpen size={10} />
          Source: Lessons 16.4.1-16.4.4, T1-23 Lesson 23.6.1, T2-14 Lesson 14.6.2 (complementary)
        </div>
      </section>

      <section
        style={{
          ...cardStyle,
          borderColor: hasIncomplete ? `${BLUE}66` : `${GREEN}66`,
          background: hasIncomplete ? `${BLUE}0F` : `${GREEN}0F`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {hasIncomplete ? <Info size={18} color={BLUE} /> : <CheckCircle2 size={18} color={GREEN} />}
          <p style={{ ...eyebrowStyle, margin: 0 }}>Verdict</p>
        </div>
        <h3 style={{ margin: "0.35rem 0 0", color: hasIncomplete ? BLUE : GREEN, fontSize: "1.1rem", fontWeight: 600 }}>
          {hasIncomplete
            ? "Ananya's candidate clears every completable check; the 3rd-house technology gap is disclosed as incomplete."
            : "All selected rows clear, but the 3rd-house gap is currently hidden — re-enable it to see the honest disclosure."}
        </h3>
        <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
          {`${includedCount} of ${SYNTHESIS_ROWS.length} rows are included in the synthesis table. Toggle the 3rd-house row to see how the script names an open check rather than rounding it.`}
        </p>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "1 1 260px", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <p style={eyebrowStyle}>Evidence categories</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[
              { label: "Pañcāṅga", count: 5, color: PURPLE },
              { label: "Mercury-Jupiter", count: 2, color: GREEN },
              { label: "House-bala", count: 4, color: GOLD },
              { label: "Wealth-yoga echo", count: 1, color: BLUE },
              { label: "Technology refinement", count: 2, color: VERMILION },
            ].map((cat) => (
              <div key={cat.label} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem", borderRadius: 6, border: `1px solid ${HAIRLINE}`, background: SURFACE }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: cat.color }} />
                <span style={{ flex: 1, fontSize: "0.85rem", color: INK_PRIMARY }}>{cat.label}</span>
                <span style={{ fontSize: "0.78rem", color: INK_MUTED, fontWeight: 600 }}>{cat.count} rows</span>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: "auto",
              padding: "0.65rem",
              borderRadius: 6,
              border: `1px solid ${VERMILION}`,
              background: `${VERMILION}08`,
              fontSize: "0.8rem",
              color: INK_SECONDARY,
              lineHeight: 1.55,
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: VERMILION, marginBottom: "0.25rem" }}>
              <AlertTriangle size={12} />
              Common mistake
            </span>
            {`Silently omitting the incomplete 3rd-house row makes the client believe every check was completed. §4.4 names the gap plainly in one sentence.`}
          </div>
        </section>

        <section style={{ ...cardStyle, flex: "2 1 460px", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            <TabButton label="Synthesis table" active={tab === "synthesis"} onClick={() => setTab("synthesis")} icon={<FileText size={14} />} />
            <TabButton label="Chart data" active={tab === "chart"} onClick={() => setTab("chart")} icon={<LayoutTemplate size={14} />} />
            <TabButton label="Script composer" active={tab === "script"} onClick={() => setTab("script")} icon={<MessageSquareQuote size={14} />} />
            <TabButton label="Actor comparison" active={tab === "comparison"} onClick={() => setTab("comparison")} icon={<Scale size={14} />} />
          </div>

          {tab === "synthesis" && <SynthesisPanel included={included} onToggle={toggleIncluded} />}
          {tab === "chart" && <ChartPanel />}
          {tab === "script" && (
            <ScriptPanel
              included={included}
              founder={founder}
              setFounder={setFounder}
              date={date}
              setDate={setDate}
              time={time}
              setTime={setTime}
            />
          )}
          {tab === "comparison" && <ComparisonPanel />}
        </section>
      </div>
    </div>
  );
}

const cardStyle: CSSProperties = {
  background: SURFACE,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  fontSize: "0.72rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: INK_MUTED,
  display: "flex",
  alignItems: "center",
  gap: "0.35rem",
};

const thStyle: CSSProperties = {
  textAlign: "left",
  padding: "0.55rem 0.65rem",
  borderBottom: `1px solid ${HAIRLINE}`,
  color: INK_MUTED,
  fontSize: "0.72rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const tdStyle: CSSProperties = {
  padding: "0.55rem 0.65rem",
  borderBottom: `1px solid ${HAIRLINE}`,
  color: INK_PRIMARY,
  verticalAlign: "top",
};

const inputStyle: CSSProperties = {
  width: "100%",
  marginTop: "0.35rem",
  padding: "0.45rem 0.55rem",
  borderRadius: 6,
  border: `1px solid ${HAIRLINE}`,
  background: "transparent",
  color: INK_PRIMARY,
  fontSize: "0.88rem",
  fontFamily: "inherit",
};

const fieldLabelStyle: CSSProperties = {
  fontSize: "0.72rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  color: INK_MUTED,
};

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    padding: "0.45rem 0.75rem",
    borderRadius: 6,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? `${color}15` : SURFACE,
    color: active ? color : INK_SECONDARY,
    fontWeight: 600,
    fontSize: "0.82rem",
    cursor: "pointer",
  };
}
