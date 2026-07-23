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
  MapPin,
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
type RowStatus = "favourable" | "strong" | "unremarkable" | "neutral" | "not-applicable";

interface SynthesisRow {
  id: string;
  check: string;
  result: string;
  status: RowStatus;
  source: string;
  category: "pancanga" | "direction" | "house-bala";
}

const SYNTHESIS_ROWS: SynthesisRow[] = [
  { id: "tithi", check: "Tithi", result: "Kṛṣṇa Pratipadā — Nandā class, favoured", status: "favourable", source: "16.5.4 §4.2", category: "pancanga" },
  { id: "vara", check: "Vāra", result: "Thursday — universally-favourable per direction-pairing", status: "favourable", source: "16.5.4 §4.3", category: "pancanga" },
  { id: "pairing", check: "Direction-day-pairing (West)", result: "Thursday not specifically paired with West, but universally favourable", status: "favourable", source: "16.5.4 §4.3", category: "direction" },
  { id: "disha-sula", check: "Diśā-Śūla (West)", result: "Thursday's own Diśā-Śūla is South, not West — not blocked", status: "strong", source: "16.5.4 §4.4, §6 Example 1", category: "direction" },
  { id: "nakshatra", check: "Nakṣatra", result: "Śravaṇa — Cara class, most-favoured", status: "favourable", source: "16.5.4 §4.2", category: "pancanga" },
  { id: "yoga", check: "Yoga", result: "Prīti — neither favoured nor avoided per the travel-specific list; named honestly as neutral", status: "neutral", source: "This lesson §4.1", category: "pancanga" },
  { id: "karana", check: "Karaṇa", result: "Bālava — Cara karaṇa, favoured", status: "favourable", source: "16.5.4 §4.2", category: "pancanga" },
  { id: "lagna-sign", check: "Lagna sign", result: "Cancer — Cara-rāśi, most-favoured", status: "favourable", source: "16.5.4 §4.6", category: "house-bala" },
  { id: "house-1", check: "1st house (self/traveller)", result: "Occupied by Mercury (neutral dignity, no own-sign/exaltation) — a travel-favoured house, occupied, but by a planet without added dignity here", status: "unremarkable", source: "This lesson §4.1", category: "house-bala" },
  { id: "house-9", check: "9th house (long-journey, most-central)", result: "Occupied by Jupiter, own sign — strong, direct", status: "strong", source: "This lesson §4.1", category: "house-bala" },
  { id: "lagna-lord", check: "Lagna lord (Moon)", result: "Placed in the 7th house — not itself named among travel's own favoured houses (1st/3rd/9th/12th); an honestly unremarkable house-placement, though Moon's own nakṣatra (Śravaṇa) is independently strong", status: "unremarkable", source: "This lesson §4.3", category: "house-bala" },
  { id: "brahma", check: "Brahma-muhūrta", result: "Not applicable to this candidate's own daytime departure; not claimed", status: "not-applicable", source: "This lesson §4.1", category: "pancanga" },
];

const LOCKED_VERBATIM = `It supports favourable conditions for your journey, but it is one input among many to how the trip actually unfolds -- your own preparation, road or flight conditions, and the broader circumstances of the trip all also operate.`;

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
  { key: "sun", label: "Sun", short: "Su", signIndex: 3, degree: "10°", color: GOLD, note: "1st house" },
  { key: "moon", label: "Moon", short: "Mo", signIndex: 9, degree: "15°", color: BLUE, note: "7th house, Śravaṇa pāda 2" },
  { key: "mercury", label: "Mercury", short: "Me", signIndex: 3, degree: "18°", color: GREEN, note: "1st house, non-combust" },
  { key: "jupiter", label: "Jupiter", short: "Ju", signIndex: 11, degree: "10°", color: GOLD, note: "9th house, own sign" },
];

const LAGNA_INDEX = 3;

function statusColor(status: RowStatus): string {
  if (status === "favourable" || status === "strong") return GREEN;
  if (status === "unremarkable") return GOLD;
  if (status === "neutral") return BLUE;
  return INK_MUTED;
}

function statusLabel(status: RowStatus): string {
  if (status === "favourable") return "favourable";
  if (status === "strong") return "strong";
  if (status === "unremarkable") return "unremarkable";
  if (status === "neutral") return "neutral";
  return "not applicable";
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
      {status === "not-applicable" ? <Info size={10} /> : <CheckCircle2 size={10} />}
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
        {`Priya's candidate assembled row by row. Toggle rows to see how the script's "specifically" paragraph changes. The lagna-lord's unremarkable placement and the neutral yoga are included as honest disclosures, not rounded up.`}
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
                <tr key={row.id} style={{ opacity: active ? 1 : 0.55, background: row.status === "unremarkable" || row.status === "neutral" ? `${GOLD}06` : undefined }}>
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
          border: `1px solid ${GOLD}`,
          background: `${GOLD}10`,
          fontSize: "0.8rem",
          color: INK_SECONDARY,
        }}
      >
        <Info size={14} color={GOLD} />
        {`Honest scope: the lagna-lord's 7th-house placement is unremarkable for travel and the yoga is neutral. Both are included as disclosures rather than silently upgraded.`}
      </div>
    </div>
  );
}

function ChartPanel() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
      <p style={{ margin: 0, fontSize: "0.875rem", color: INK_SECONDARY, lineHeight: 1.55 }}>
        {`Priya's designed candidate: Cancer lagna, Thursday departure, Śravaṇa nakṣatra, Jupiter own-sign in the 9th, Moon in the 7th, Sun and Mercury in the 1st.`}
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

  const highlightedHouses = [1, 7, 9];
  const houseColors: Record<number, string> = { 1: PURPLE, 7: GOLD, 9: GREEN };

  return (
    <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Priya's journey-moment chart: Cancer lagna with 1st, 7th and 9th houses highlighted" style={{ width: "100%", maxWidth: 320, display: "block" }}>
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
        const offset = (idx - 1.5) * 14;
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
  traveller,
  setTraveller,
  direction,
  setDirection,
  date,
  setDate,
  time,
  setTime,
}: {
  included: Set<string>;
  traveller: string;
  setTraveller: (value: string) => void;
  direction: string;
  setDirection: (value: string) => void;
  date: string;
  setDate: (value: string) => void;
  time: string;
  setTime: (value: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  const includedRows = useMemo(() => SYNTHESIS_ROWS.filter((r) => included.has(r.id)), [included]);
  const strongRows = includedRows.filter((r) => r.status === "favourable" || r.status === "strong");
  const caveatRows = includedRows.filter((r) => r.status === "unremarkable" || r.status === "neutral");

  const specifically = useMemo(() => {
    const parts: string[] = [];
    if (included.has("disha-sula")) {
      parts.push(`this is one of the few days each week that is neither blocked by Diśā-Śūla for your specific ${direction}-direction route nor a generally-avoided travel day`);
    }
    if (strongRows.length > 0) {
      const labels = strongRows.filter((r) => r.id !== "disha-sula").map((r) => r.check);
      if (labels.length > 0) {
        const joined = labels.length > 1 ? `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}` : labels[0];
        parts.push(`${joined} ${labels.length > 1 ? "are" : "is"} genuinely strong`);
      }
    }
    if (caveatRows.length > 0) {
      const labels = caveatRows.map((r) => r.check.toLowerCase());
      const joined = labels.length > 1 ? `${labels.slice(0, -1).join(" and ")}` : labels[0];
      parts.push(`not every element is a standout — ${joined} ${labels.length > 1 ? "are" : "is"} honestly neutral or unremarkable, and I want to be clear about that rather than rounding ${labels.length > 1 ? "them" : "it"} up`);
    }
    const sentence = parts.length > 0 ? `Specifically: ${parts.join("; ")}.` : "No specific checks are selected for the script.";
    return `${sentence} If your journey is medical in nature or time-constrained by circumstances beyond your control, please know that safety and practical constraints always take precedence over this screening -- we would adjust our approach accordingly.`;
  }, [strongRows, caveatRows, direction, included]);

  const fullScript = useMemo(
    () => `Based on the full screening we've completed for ${traveller} -- the pañcāṅga check, the direction-day-pairing for your specific ${direction}-direction route, and the Diśā-Śūla direction-avoidance check -- ${date}, at ${time}, is the best-available selection from the candidates we evaluated.\n\n${LOCKED_VERBATIM}\n\n${specifically}`,
    [traveller, direction, date, time, specifically],
  );

  function handleCopy() {
    void navigator.clipboard.writeText(fullScript).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.65rem" }}>
        <label style={fieldLabelStyle}>
          Traveller name
          <input type="text" value={traveller} onChange={(e) => setTraveller(e.target.value)} style={inputStyle} />
        </label>
        <label style={fieldLabelStyle}>
          Direction
          <input type="text" value={direction} onChange={(e) => setDirection(e.target.value)} style={inputStyle} />
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
          <strong style={{ fontWeight: 600, color: GOLD }}>{traveller}</strong>
          {` -- the pañcāṅga check, the direction-day-pairing for your specific `}
          <strong style={{ fontWeight: 600, color: GOLD }}>{direction}</strong>
          {`-direction route, and the Diśā-Śūla direction-avoidance check -- `}
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
        {`This module closes with five distinct actor-structures. The underlying multi-layer synthesis method is identical; what differs is the actor and the distinctive additional layer each event-type requires.`}
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.65rem" }}>
        <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: SURFACE }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: INK_MUTED, marginBottom: "0.35rem" }}>Marriage (Lesson 16.2.5)</div>
          <div style={{ fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
            {`Paired-actor synthesis: two individuals' own compatibility-matching and tārā-bala checked simultaneously.`}
          </div>
        </div>
        <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: SURFACE }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: INK_MUTED, marginBottom: "0.35rem" }}>Gṛha-praveśa (Lesson 16.3.4)</div>
          <div style={{ fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
            {`Single-actor synthesis: one family unit served by one set of pañcāṅga, house-bala, triad, Vāstu, and seasonal-calendar checks.`}
          </div>
        </div>
        <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: SURFACE }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: INK_MUTED, marginBottom: "0.35rem" }}>Business-launch (Lesson 16.4.4)</div>
          <div style={{ fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
            {`Founder-plus-venture synthesis: one founder plus a venture that will eventually have its own incorporation chart.`}
          </div>
        </div>
        <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${BLUE}`, background: `${BLUE}08` }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: BLUE, marginBottom: "0.35rem" }}>Surgery-window (Lesson 16.5.2)</div>
          <div style={{ fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
            {`Single-actor synthesis plus medical-primacy discipline: screen only within the physician's given window.`}
          </div>
        </div>
        <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${GREEN}`, background: `${GREEN}08` }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: GREEN, marginBottom: "0.35rem" }}>Journey-direction (this lesson)</div>
          <div style={{ fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
            {`Single-actor synthesis plus Diśā-Śūla direction-timing overlay for a specific route.`}
          </div>
        </div>
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

export function JourneySynthesisWorkbench() {
  const [tab, setTab] = useState<TabKey>("synthesis");
  const [included, setIncluded] = useState<Set<string>>(new Set(SYNTHESIS_ROWS.map((r) => r.id)));
  const [traveller, setTraveller] = useState("Priya");
  const [direction, setDirection] = useState("West");
  const [date, setDate] = useState("the selected date");
  const [time, setTime] = useState("the selected time");

  const includedCount = included.size;
  const hasDirectionClearance = included.has("disha-sula");
  const hasCaveats = included.has("yoga") || included.has("lagna-lord") || included.has("house-1");

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
    setTraveller("Priya");
    setDirection("West");
    setDate("the selected date");
    setTime("the selected time");
  }

  return (
    <div data-interactive="journey-synthesis-workbench" style={{ display: "flex", flexDirection: "column", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Journey complete synthesis</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.25rem", fontWeight: 600 }}>
              {`Assemble Priya's full evidence file and draft the extended client script`}
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              {`Eleven rows converge on one West-direction recommendation. Strengths are reported at their actual strength; the lagna-lord's unremarkable placement and the neutral yoga are disclosed honestly.`}
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
          Source: Lesson 16.5.4; T1-23 Lesson 23.6.1
        </div>
      </section>

      <section
        style={{
          ...cardStyle,
          borderColor: hasDirectionClearance ? `${GREEN}66` : `${GOLD}66`,
          background: hasDirectionClearance ? `${GREEN}0F` : `${GOLD}0F`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {hasDirectionClearance ? <MapPin size={18} color={GREEN} /> : <Info size={18} color={GOLD} />}
          <p style={{ ...eyebrowStyle, margin: 0 }}>Verdict</p>
        </div>
        <h3 style={{ margin: "0.35rem 0 0", color: hasDirectionClearance ? GREEN : GOLD, fontSize: "1.1rem", fontWeight: 600 }}>
          {hasDirectionClearance
            ? "Priya's candidate clears the direction-specific checks with honest caveats."
            : "Diśā-Śūla clearance is currently hidden — re-enable it to see the decisive directional finding."}
        </h3>
        <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
          {`${includedCount} of ${SYNTHESIS_ROWS.length} rows are included. ${hasCaveats ? "Neutral and unremarkable rows are included as disclosures." : "Caveat rows are hidden; the script would lose its honest non-uniform character."}`}
        </p>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "1 1 260px", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <p style={eyebrowStyle}>Evidence categories</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[
              { label: "Pañcāṅga", count: 6, color: PURPLE },
              { label: "Direction overlay", count: 2, color: BLUE },
              { label: "Travel house-bala", count: 3, color: GREEN },
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
            {`Rounding the lagna-lord's unremarkable 7th-house placement up to match the chart's otherwise-strong character. Report it exactly as found.`}
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
              traveller={traveller}
              setTraveller={setTraveller}
              direction={direction}
              setDirection={setDirection}
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
