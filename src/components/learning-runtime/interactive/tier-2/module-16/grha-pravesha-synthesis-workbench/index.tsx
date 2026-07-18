"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Circle,
  Copy,
  FileText,
  Heart,
  Home,
  Info,
  Layers,
  Lock,
  MapPin,
  MessageSquareQuote,
  RotateCcw,
  Scale,
  Sparkles,
  Star,
  Sun,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

type TabKey = "detail" | "synthesis" | "seasonal" | "script" | "comparison";
type Status = "favourable" | "neutral" | "clearing" | "workable" | "stipulated";

interface EvidenceLayer {
  id: number;
  title: string;
  short: string;
  summary: string;
  detail: string;
  source: string;
  color: string;
  icon: typeof Scale;
}

const EVIDENCE_LAYERS: EvidenceLayer[] = [
  {
    id: 1,
    title: "Pañcāṅga table",
    short: "Pañcāṅga",
    summary: "Bhadrā tithi, Thursday vāra, Mṛgaśīrṣā nakṣatra, Saubhāgya yoga, Vaṇija karaṇa.",
    detail: "Tithi and vāra are favoured; nakṣatra is strongly-favoured (Mṛdu class). Yoga and karaṇa are neutral, named honestly rather than rounded up.",
    source: "Lesson 16.3.1 §4.1, §6",
    color: BLUE,
    icon: CalendarDays,
  },
  {
    id: 2,
    title: "Lagna sign",
    short: "Lagna",
    summary: "Aquarius — Sthira (fixed), most-favoured for gṛha-praveśa.",
    detail: "Aquarius is one of the Sthira signs T1-23 names as most-favoured for housewarming. Capricorn is the avoided Saturn-ruled sign; Aquarius is not.",
    source: "Lesson 16.3.1 §4.2",
    color: GREEN,
    icon: MapPin,
  },
  {
    id: 3,
    title: "House-bala",
    short: "House-bala",
    summary: "4th house unoccupied and unafflicted; Sun in 2nd; Moon in 5th (general principle, scoped).",
    detail: "The 4th house is gṛha-praveśa's most-central house. Sun's placement in the 2nd is secondary-favoured. Moon in the 5th is trikoṇa by general principle, explicitly scoped as not part of this event-type's own named house-list.",
    source: "Lesson 16.3.4 §4.1, §4.2",
    color: PURPLE,
    icon: Home,
  },
  {
    id: 4,
    title: "Venus-Moon-Jupiter triad",
    short: "Triad",
    summary: "Venus strong (friendly-sign kendra, non-combust); Jupiter strong (own-sign upachaya, non-combust).",
    detail: "Venus is in friendly Aquarius, non-combust, and in the 1st house (kendra). Jupiter is in own sign Sagittarius, non-combust, and in the 11th house (upachaya). Both planets are independently strong, not merely present.",
    source: "Lesson 16.3.1 §4.3",
    color: GOLD,
    icon: Star,
  },
  {
    id: 5,
    title: "Vāstu-purification overlay",
    short: "Vāstu overlay",
    summary: "East-facing main entry; no Vāstu concerns disclosed.",
    detail: "East is the most-auspicious entry direction per T1-22. The family disclosed that a Vāstu consultant was engaged during design and no structural concerns were raised.",
    source: "Lesson 16.3.2 §6 Example 1",
    color: GREEN,
    icon: Heart,
  },
  {
    id: 6,
    title: "Gṛha-praveśa type",
    short: "Type",
    summary: "Apūrva — newly-completed construction, first occupation; full method applies.",
    detail: "Because the Sharmas are entering a newly-built home for the first time, the candidate is unambiguously Apūrva. Both this chapter's checks therefore apply at full strength.",
    source: "Lesson 16.3.3 §4.4",
    color: BLUE,
    icon: Layers,
  },
  {
    id: 7,
    title: "Seasonal-calendar doṣa",
    short: "Seasonal",
    summary: "Uttarāyaṇa, not Adhika-Māsa, not Saṁkrānti — all three clear.",
    detail: "These three avoidances are specific to gṛha-praveśa among this module's event-types. For this designed candidate they are stipulated design parameters (not independently verified against a real calendar), following T1-23's own established practice for this check.",
    source: "Lesson 16.3.4 §4.1, §4.3",
    color: PURPLE,
    icon: Sun,
  },
];

interface SynthesisRow {
  check: string;
  result: string;
  status: Status;
  source: string;
}

const SYNTHESIS_ROWS: SynthesisRow[] = [
  { check: "Tithi", result: "Bhadrā (Śukla Saptamī) — favoured", status: "favourable", source: "16.3.1 §4.1, §6" },
  { check: "Vāra", result: "Thursday — favoured", status: "favourable", source: "16.3.1 §4.1, §6" },
  { check: "Nakṣatra", result: "Mṛgaśīrṣā — Mṛdu class, strongly-favoured", status: "favourable", source: "16.3.1 §4.1, §6" },
  { check: "Yoga", result: "Saubhāgya — neutral", status: "neutral", source: "16.3.4 §4.2" },
  { check: "Karaṇa", result: "Vaṇija — neutral", status: "neutral", source: "16.3.4 §4.2" },
  { check: "Lagna sign", result: "Aquarius — Sthira, most-favoured", status: "favourable", source: "16.3.1 §4.2" },
  { check: "4th house", result: "Unoccupied by any of the four charted planets; no affliction", status: "clearing", source: "16.3.4 §4.1" },
  { check: "Sun's house", result: "2nd house — secondary-favoured", status: "favourable", source: "16.3.1 §4.2" },
  { check: "Moon's house", result: "5th house — trikoṇa by general principle (not event-specific house-list)", status: "workable", source: "16.3.4 §4.1" },
  { check: "Venus", result: "Friendly sign (Aquarius), non-combust, 1st house (kendra) — strong", status: "favourable", source: "16.3.1 §4.3" },
  { check: "Jupiter", result: "Own sign (Sagittarius), non-combust, 11th house (upachaya) — strong", status: "favourable", source: "16.3.1 §4.3" },
  { check: "Vāstu-overlay", result: "East-facing entry (most-auspicious); no Vāstu concerns disclosed", status: "clearing", source: "16.3.2 §6 Example 1" },
  { check: "Gṛha-praveśa type", result: "Apūrva — full method applies", status: "clearing", source: "16.3.3 §4.4" },
  { check: "Seasonal-calendar doṣa", result: "Clears — Uttarāyaṇa, not Adhika-Māsa, not Saṁkrānti (stipulated design parameters)", status: "stipulated", source: "16.3.4 §4.3" },
];

const LOCKED_VERBATIM = `It supports favourable conditions for your gṛha-praveśa, but it is one input among many to how settling into your new home actually unfolds -- your own preparation, your own daily life there, and the broader context of your family's circumstances all also operate.`;

function statusColor(status: Status): string {
  if (status === "favourable" || status === "clearing") return GREEN;
  if (status === "workable") return GOLD;
  if (status === "stipulated") return BLUE;
  return INK_MUTED;
}

function StatusChip({ status }: { status: Status }) {
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
      {status === "favourable" || status === "clearing" ? <CheckCircle2 size={10} /> : null}
      {status === "workable" ? <Sparkles size={10} /> : null}
      {status === "stipulated" ? <Info size={10} /> : null}
      {status}
    </span>
  );
}

function LayerCard({
  layer,
  active,
  reviewed,
  onSelect,
  onToggleReview,
}: {
  layer: EvidenceLayer;
  active: boolean;
  reviewed: boolean;
  onSelect: () => void;
  onToggleReview: (e: React.MouseEvent) => void;
}) {
  const Icon = layer.icon;
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect();
      }}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.5rem",
        padding: "0.65rem",
        borderRadius: 8,
        border: `1px solid ${active ? layer.color : HAIRLINE}`,
        background: active ? `${layer.color}10` : SURFACE,
        cursor: "pointer",
        outline: "none",
      }}
    >
      <button
        type="button"
        onClick={onToggleReview}
        aria-pressed={reviewed}
        style={{
          flex: "0 0 auto",
          padding: 0,
          margin: 0,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color: reviewed ? GREEN : INK_MUTED,
        }}
      >
        {reviewed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            color: active ? layer.color : INK_PRIMARY,
            fontWeight: 600,
            fontSize: "0.85rem",
          }}
        >
          <Icon size={13} />
          {layer.title}
        </div>
        <div style={{ fontSize: "0.75rem", color: INK_SECONDARY, marginTop: "0.2rem", lineHeight: 1.4 }}>
          {layer.summary}
        </div>
      </div>
      <ChevronRight size={14} color={active ? layer.color : INK_MUTED} />
    </div>
  );
}

function SynthesisPanel() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <p style={{ margin: 0, fontSize: "0.875rem", color: INK_SECONDARY, lineHeight: 1.55 }}>
        {`The Sharma family's candidate assembled row by row. Mechanically computed values are shown alongside the stipulated seasonal parameters, which are disclosed as design choices.`}
      </p>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
          <thead>
            <tr>
              <th style={thStyle}>Check</th>
              <th style={thStyle}>Result</th>
              <th style={{ ...thStyle, textAlign: "center" }}>Status</th>
              <th style={thStyle}>Source</th>
            </tr>
          </thead>
          <tbody>
            {SYNTHESIS_ROWS.map((row) => (
              <tr key={row.check}>
                <td style={tdStyle}>{row.check}</td>
                <td style={tdStyle}>{row.result}</td>
                <td style={{ ...tdStyle, textAlign: "center" }}>
                  <StatusChip status={row.status} />
                </td>
                <td style={{ ...tdStyle, color: INK_MUTED, fontSize: "0.78rem" }}>{row.source}</td>
              </tr>
            ))}
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
        <Sparkles size={14} color={GOLD} />
        {`Honest scope: yoga and karaṇa are neutral, and Moon's 5th-house placement is explicitly noted as a general-principle observation, not a claim from this event-type's own named house-list.`}
      </div>
    </div>
  );
}

function SeasonalPanel() {
  const [dak, setDak] = useState(true);
  const [adhika, setAdhika] = useState(true);
  const [sankranti, setSankranti] = useState(true);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <p style={{ margin: 0, fontSize: "0.875rem", color: INK_SECONDARY, lineHeight: 1.55 }}>
        {`T1-23 Lesson 23.4.3 §4.4 names three gṛha-praveśa-specific seasonal-calendar avoidances. For this designed candidate they are stipulated design parameters, not independently verified against a real calendar.`}
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.65rem" }}>
        <SeasonalToggle label="Dakṣiṇāyana" description="Sun's southward course — avoided" cleared={dak} onChange={setDak} />
        <SeasonalToggle label="Adhika-Māsa" description="Intercalary month — avoided" cleared={adhika} onChange={setAdhika} />
        <SeasonalToggle label="Saṁkrānti" description="Solar-ingress day — avoided" cleared={sankranti} onChange={setSankranti} />
      </div>
      <div
        style={{
          padding: "0.65rem 0.85rem",
          borderRadius: 6,
          border: `1px solid ${BLUE}`,
          background: `${BLUE}08`,
          fontSize: "0.8rem",
          color: INK_SECONDARY,
          lineHeight: 1.55,
        }}
      >
        <Info size={14} color={BLUE} style={{ display: "inline", marginRight: 6 }} />
        {`All three set to "clears" matches the Sharma candidate's stipulated design. Toggle any to "does not clear" to see how the final verdict would change.`}
      </div>
      {dak && adhika && sankranti ? (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", fontWeight: 600, color: GREEN }}>
          <CheckCircle2 size={16} />
          Seasonal-calendar doṣa clears
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", fontWeight: 600, color: VERMILION }}>
          <Info size={16} />
          A seasonal concern is present — disclose and reconsider timing
        </div>
      )}
    </div>
  );
}

function SeasonalToggle({
  label,
  description,
  cleared,
  onChange,
}: {
  label: string;
  description: string;
  cleared: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!cleared)}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "0.65rem",
        borderRadius: 8,
        border: `1px solid ${cleared ? GREEN : VERMILION}`,
        background: cleared ? `${GREEN}08` : `${VERMILION}08`,
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
        <span style={{ fontSize: "0.9rem", fontWeight: 600, color: cleared ? GREEN : VERMILION }}>{label}</span>
        {cleared ? <CheckCircle2 size={16} color={GREEN} /> : <Info size={16} color={VERMILION} />}
      </div>
      <div style={{ fontSize: "0.78rem", color: INK_SECONDARY, marginTop: "0.2rem" }}>{description}</div>
      <div style={{ fontSize: "0.75rem", fontWeight: 600, color: cleared ? GREEN : VERMILION, marginTop: "0.25rem", textTransform: "uppercase" }}>
        {cleared ? "Clears" : "Does not clear"}
      </div>
    </button>
  );
}

function ScriptPanel({
  family,
  setFamily,
  date,
  setDate,
  time,
  setTime,
}: {
  family: string;
  setFamily: (value: string) => void;
  date: string;
  setDate: (value: string) => void;
  time: string;
  setTime: (value: string) => void;
}) {
  const fullScript = useMemo(() => {
    return `Based on the full screening we've completed for ${family} -- the pañcāṅga check, your own home's house-and-planetary strength, the Vāstu-direction overlay, and the seasonal calendar -- ${date}, at ${time}, is the best-available selection from the candidates we evaluated.\n\n${LOCKED_VERBATIM}\n\nSpecifically: your nakṣatra and nine strength-and-dignity checks on Venus, Moon, and Jupiter -- the three planets that matter most for this occasion -- are all genuinely strong. Your entry faces east, the most-favoured direction, and we confirmed there are no known Vāstu concerns. We also checked the seasonal calendar specifically for this occasion, since housewarming carries its own seasonal considerations no other event-type in our practice does, and this date clears all three. We are not claiming a perfect moment exists -- your yoga and karaṇa are simply neutral, not standout-favourable, and we are naming that honestly rather than rounding it up.`;
  }, [family, date, time]);

  const [copied, setCopied] = useState(false);

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
          Family name
          <input type="text" value={family} onChange={(e) => setFamily(e.target.value)} style={inputStyle} />
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
          <strong style={{ fontWeight: 600, color: GOLD }}>{family}</strong>
          {` -- the pañcāṅga check, your own home's house-and-planetary strength, the Vāstu-direction overlay, and the seasonal calendar -- `}
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
        <p style={{ margin: 0, fontSize: "0.9rem", color: INK_PRIMARY, lineHeight: 1.65 }}>
          {`Specifically: your nakṣatra and nine strength-and-dignity checks on Venus, Moon, and Jupiter -- the three planets that matter most for this occasion -- are all genuinely strong. Your entry faces east, the most-favoured direction, and we confirmed there are no known Vāstu concerns. We also checked the seasonal calendar specifically for this occasion, since housewarming carries its own seasonal considerations no other event-type in our practice does, and this date clears all three. We are not claiming a perfect moment exists -- your yoga and karaṇa are simply neutral, not standout-favourable, and we are naming that honestly rather than rounding it up.`}
        </p>
      </div>
    </div>
  );
}

function ComparisonPanel() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <p style={{ margin: 0, fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.65 }}>
        {`The underlying method is identical across Chapter 2 (marriage) and Chapter 3 (gṛha-praveśa): assemble every check, build one honest table, and extend the mandated client-communication script. What differs is the number of actors the method is applied to.`}
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.65rem" }}>
        <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: SURFACE }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: INK_MUTED, marginBottom: "0.35rem" }}>Marriage (Lesson 16.2.5)</div>
          <div style={{ fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
            {`Paired-actor synthesis: two people's own tārā-bala, lagna-śuddhi, and compatibility-matching must be checked simultaneously.`}
          </div>
        </div>
        <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${GREEN}`, background: `${GREEN}08` }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: GREEN, marginBottom: "0.35rem" }}>Gṛha-praveśa (this lesson)</div>
          <div style={{ fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
            {`Single-actor synthesis: the family unit is served by one set of pañcāṅga, house-bala, triad, Vāstu-overlay, and seasonal-calendar checks.`}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProcessSvg({ reviewedCount }: { reviewedCount: number }) {
  const labels = ["Pañcāṅga", "Lagna", "House-bala", "Triad", "Vāstu", "Type", "Seasonal"];
  const total = labels.length;
  return (
    <svg viewBox="0 0 720 120" role="img" aria-label="Seven evidence layers converge on the final gṛha-praveśa recommendation" style={{ width: "100%", maxHeight: 160, display: "block" }}>
      {labels.map((label, i) => {
        const x = 40 + i * 95;
        const active = i < reviewedCount;
        return (
          <g key={label}>
            <rect x={x} y={18} width={82} height={34} rx={6} fill={active ? `${GREEN}10` : SURFACE} stroke={active ? GREEN : HAIRLINE} strokeWidth={active ? 2 : 1} />
            <text x={x + 41} y={39} textAnchor="middle" fontSize={9} fill={active ? GREEN : INK_SECONDARY} fontWeight={600}>
              {label}
            </text>
            <line x1={x + 41} y1={52} x2={360} y2={82} stroke={active ? GREEN : HAIRLINE} strokeWidth={active ? 2 : 1} strokeDasharray={active ? undefined : "3 3"} />
          </g>
        );
      })}
      <rect x={250} y={78} width={220} height="40" rx={8} fill={`${GREEN}10`} stroke={GREEN} strokeWidth={reviewedCount === total ? 2 : 1} />
      <text x={360} y={100} textAnchor="middle" fontSize={12} fill={reviewedCount === total ? GREEN : INK_PRIMARY} fontWeight={600}>
        Sharma candidate clears
      </text>
      <text x={360} y={114} textAnchor="middle" fontSize={9} fill={INK_SECONDARY}>
        {reviewedCount === total ? "All 7 layers reviewed" : `${reviewedCount} of ${total} layers reviewed`}
      </text>
    </svg>
  );
}

export function GrhaPraveshaSynthesisWorkbench() {
  const [activeLayer, setActiveLayer] = useState(1);
  const [reviewed, setReviewed] = useState<Set<number>>(new Set([1, 2, 3, 4, 5, 6, 7]));
  const [tab, setTab] = useState<TabKey>("detail");
  const [family, setFamily] = useState("the Sharma family");
  const [date, setDate] = useState("the selected date");
  const [time, setTime] = useState("the selected time");

  const active = EVIDENCE_LAYERS.find((l) => l.id === activeLayer) ?? EVIDENCE_LAYERS[0];
  const reviewedCount = reviewed.size;
  const allReviewed = reviewedCount === EVIDENCE_LAYERS.length;

  function toggleReview(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    setReviewed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function markAllReviewed() {
    setReviewed(new Set(EVIDENCE_LAYERS.map((l) => l.id)));
  }

  function handleReset() {
    setActiveLayer(1);
    setReviewed(new Set([1, 2, 3, 4, 5, 6, 7]));
    setTab("detail");
    setFamily("the Sharma family");
    setDate("the selected date");
    setTime("the selected time");
  }

  return (
    <div data-interactive="grha-pravesha-synthesis-workbench" style={{ display: "flex", flexDirection: "column", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Gṛha-praveśa synthesis workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.25rem", fontWeight: 600 }}>
              {`Assemble the Sharma family's complete, honestly-communicated gṛha-praveśa recommendation`}
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              {`Seven evidence layers converge on one final recommendation. The script keeps T1-23's mandated language verbatim.`}
            </p>
          </div>
          <button type="button" onClick={handleReset} style={buttonStyle(false, GOLD)}>
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
          Source: T1-23 Lesson 23.4.3 / 23.6.1, extended to single-actor gṛha-praveśa
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 460px", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <ProcessSvg reviewedCount={reviewedCount} />

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            <TabButton label="Layer detail" active={tab === "detail"} onClick={() => setTab("detail")} icon={<BookOpen size={14} />} />
            <TabButton label="Synthesis table" active={tab === "synthesis"} onClick={() => setTab("synthesis")} icon={<FileText size={14} />} />
            <TabButton label="Seasonal" active={tab === "seasonal"} onClick={() => setTab("seasonal")} icon={<Sun size={14} />} />
            <TabButton label="Script composer" active={tab === "script"} onClick={() => setTab("script")} icon={<MessageSquareQuote size={14} />} />
            <TabButton label="Comparison" active={tab === "comparison"} onClick={() => setTab("comparison")} icon={<Scale size={14} />} />
          </div>

          {tab === "detail" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <active.icon size={18} color={active.color} />
                <h3 style={{ margin: 0, color: active.color, fontSize: "1.1rem", fontWeight: 600 }}>{active.title}</h3>
              </div>
              <p style={{ margin: 0, fontSize: "0.9rem", color: INK_SECONDARY, lineHeight: 1.65 }}>{active.detail}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.25rem" }}>
                <SourceChip source={active.source} />
              </div>
            </div>
          ) : null}

          {tab === "synthesis" ? <SynthesisPanel /> : null}
          {tab === "seasonal" ? <SeasonalPanel /> : null}
          {tab === "script" ? <ScriptPanel family={family} setFamily={setFamily} date={date} setDate={setDate} time={time} setTime={setTime} /> : null}
          {tab === "comparison" ? <ComparisonPanel /> : null}

          <div
            style={{
              marginTop: "auto",
              padding: "0.75rem 1rem",
              borderRadius: 8,
              border: `1px solid ${allReviewed ? GREEN : GOLD}`,
              background: allReviewed ? `${GREEN}10` : `${GOLD}10`,
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            <CheckCircle2 size={20} color={allReviewed ? GREEN : GOLD} />
            <div>
              <div style={{ fontSize: "0.9rem", fontWeight: 600, color: allReviewed ? GREEN : GOLD }}>
                {allReviewed ? "Final recommendation is fully supported" : "Review every layer to lock the recommendation"}
              </div>
              <div style={{ fontSize: "0.8rem", color: INK_SECONDARY }}>
                {`Sharma candidate clears every check; yoga and karaṇa are honestly neutral.`}
              </div>
            </div>
          </div>
        </section>

        <section style={{ display: "flex", flexDirection: "column", gap: "0.85rem", flex: "1 1 280px" }}>
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", marginBottom: "0.65rem" }}>
              <p style={{ ...eyebrowStyle, margin: 0 }}>Evidence file</p>
              {!allReviewed ? (
                <button type="button" onClick={markAllReviewed} style={{ ...buttonStyle(false, GREEN), fontSize: "0.7rem", padding: "0.25rem 0.5rem" }}>
                  Mark all
                </button>
              ) : null}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {EVIDENCE_LAYERS.map((layer) => (
                <LayerCard
                  key={layer.id}
                  layer={layer}
                  active={activeLayer === layer.id}
                  reviewed={reviewed.has(layer.id)}
                  onSelect={() => {
                    setActiveLayer(layer.id);
                    setTab("detail");
                  }}
                  onToggleReview={(e) => toggleReview(layer.id, e)}
                />
              ))}
            </div>
            <div
              style={{
                marginTop: "0.65rem",
                fontSize: "0.75rem",
                color: INK_MUTED,
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
              }}
            >
              <CheckCircle2 size={12} />
              {`${reviewedCount} of ${EVIDENCE_LAYERS.length} layers marked reviewed`}
            </div>
          </div>
        </section>
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
      aria-pressed={active}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.375rem",
        padding: "0.4rem 0.65rem",
        borderRadius: 6,
        border: `1px solid ${active ? GOLD : HAIRLINE}`,
        background: active ? `${GOLD}15` : "transparent",
        color: active ? GOLD : INK_SECONDARY,
        fontSize: "0.8rem",
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function SourceChip({ source }: { source: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.25rem",
        padding: "0.15rem 0.5rem",
        borderRadius: 4,
        background: `${BLUE}10`,
        color: BLUE,
        fontSize: "0.72rem",
        fontWeight: 500,
      }}
    >
      <BookOpen size={10} />
      {source}
    </span>
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
  color: INK_MUTED,
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

const buttonStyle = (active: boolean, color: string): CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.375rem",
  padding: "0.45rem 0.85rem",
  borderRadius: 6,
  border: `1px solid ${active ? color : HAIRLINE}`,
  background: active ? `${color}15` : "transparent",
  color: active ? color : INK_PRIMARY,
  fontSize: "0.85rem",
  fontWeight: 500,
  cursor: "pointer",
});

const thStyle: CSSProperties = {
  textAlign: "left",
  padding: "0.55rem 0.45rem",
  borderBottom: `1px solid ${HAIRLINE}`,
  color: INK_MUTED,
  fontSize: "0.72rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.03em",
};

const tdStyle: CSSProperties = {
  padding: "0.55rem 0.45rem",
  borderBottom: `1px solid ${HAIRLINE}`,
  color: INK_PRIMARY,
  verticalAlign: "top",
};

const inputStyle: CSSProperties = {
  width: "100%",
  marginTop: "0.35rem",
  padding: "0.45rem 0.6rem",
  borderRadius: 6,
  border: `1px solid ${HAIRLINE}`,
  background: "transparent",
  color: INK_PRIMARY,
  fontSize: "0.85rem",
  fontWeight: 500,
};

const fieldLabelStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  fontSize: "0.78rem",
  fontWeight: 600,
  color: INK_MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.03em",
};
