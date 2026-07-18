"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Circle,
  Copy,
  FileText,
  Heart,
  Layers,
  Lock,
  MapPin,
  MessageSquareQuote,
  RotateCcw,
  Scale,
  Sparkles,
  Star,
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
const PURPLE = "#6B5AA8";

type TabKey = "detail" | "synthesis" | "script" | "reflection";
type Status = "favourable" | "neutral" | "clearing" | "workable";

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
    title: "Generic foundational screening",
    short: "Foundational",
    summary: "Candidate 3 cleared tithi, vāra, nakṣatra, yoga, karaṇa, tārā-bala and candra-bala; Candidates 1 and 2 were rejected.",
    detail: "This is the Chapter-1 base layer. Every generic pañcāṅga limb was checked against the general favoured/avoided classes, and the personal tārā-bala and candra-bala overlays were applied. Candidate 3 survived cleanly; the other candidates failed specific limbs.",
    source: "Lesson 16.1.1 §6",
    color: BLUE,
    icon: Scale,
  },
  {
    id: 2,
    title: "Wedding-specific pañcāṅga refinement",
    short: "Wedding pañcāṅga",
    summary: "The same limbs were re-checked against marriage's own favoured/avoided lists; Rohiṇī gained 'most-favoured, especially' status.",
    detail: "Marriage has its own preferred tithis, nakṣatras, and karaṇas. Re-screening Candidate 3 at this depth strengthened the original finding, especially Rohiṇī's wedding-specific standing.",
    source: "Lesson 16.2.1 §4.2, §6",
    color: PURPLE,
    icon: Heart,
  },
  {
    id: 3,
    title: "The Jupiter-Venus gate, corrected",
    short: "Jupiter-Venus gate",
    summary: "Jupiter is exalted and trikoṇa; Venus is friendly-sign and non-combust, but originally 3rd-house. The gate clears on Jupiter's strength alone.",
    detail: "An earlier draft claimed Venus was in the 7th house. The corrected computation placed Venus in the 3rd at the originally-screened Scorpio-lagna moment. The gate still clears because Jupiter is unambiguously strong; Venus is workable, not flawless.",
    source: "Lesson 16.2.1 §6 Example 1",
    color: GOLD,
    icon: Star,
  },
  {
    id: 4,
    title: "Wedding-specific cancellation-doṣas",
    short: "Cancellation doṣas",
    summary: "Tri-bāla-śuddhi, Maṅgala-doṣa interaction, and Kuhū-yoga all cleared for the refined moment.",
    detail: "Tri-bāla-śuddhi requires candra-bala, tārā-bala and lagna-śuddhi to be favourable for both parties. Maṅgala-doṣa interaction is inapplicable under this module's disclosed no-natal-doṣa working assumption. Kuhū-yoga clears because Pūrṇā tithi is furthest from Amāvasyā.",
    source: "Lesson 16.2.2 §6",
    color: GREEN,
    icon: CheckCircle2,
  },
  {
    id: 5,
    title: "Paired tārā-bala, structurally explained",
    short: "Paired tārā-bala",
    summary: "Rohiṇī is one of only 9 of 27 nakṣatras that give both Meera and Arjun auspicious tārā-bala simultaneously.",
    detail: "For two people, the simultaneous tārā-bala pattern repeats every nine nakṣatras. Candidate 3's Rohiṇī falls in one of the couple's own both-auspicious windows, so the good result is structural, not accidental.",
    source: "Lesson 16.2.3 §4.2, §6",
    color: BLUE,
    icon: Layers,
  },
  {
    id: 6,
    title: "Same-day moment refinement",
    short: "Moment refinement",
    summary: "The Pisces-lagna moment improves Venus's house and the lagna-sign preference while keeping the day's pañcāṅga/tārā-bala foundation constant.",
    detail: "Comparing the originally-screened Scorpio-lagna moment with a later Pisces-lagna moment on the same day showed Venus moving from house 3 to house 11, and the lagna-sign preference moving from avoided to acceptable. Candra-bala and Jupiter's trikoṇa dignity remained favourable.",
    source: "Lesson 16.2.4 §4.4-§4.5",
    color: PURPLE,
    icon: MapPin,
  },
];

interface SynthesisRow {
  check: string;
  result: string;
  status: Status;
  source: string;
}

const SYNTHESIS_ROWS: SynthesisRow[] = [
  { check: "Tithi", result: "Pūrṇā (Śukla Pūrṇimā) — favoured (generic and wedding-specific)", status: "favourable", source: "16.1.1 §6; 16.2.1 §4.2" },
  { check: "Vāra", result: "Wednesday — acceptable", status: "neutral", source: "16.1.1 §6; 16.2.1 §4.2" },
  { check: "Nakṣatra", result: "Rohiṇī — Sthira class, most-favoured (wedding-specific), one of the couple's 9 both-auspicious nakṣatras", status: "favourable", source: "16.1.1 §6; 16.2.1 §4.2; 16.2.3 §4.2" },
  { check: "Yoga", result: "Sādhya — neutral", status: "neutral", source: "16.1.1 §6" },
  { check: "Karaṇa", result: "Bava — favoured", status: "favourable", source: "16.1.1 §6; 16.2.1 §4.2" },
  { check: "Tārā bala (Meera)", result: "Sampat — auspicious", status: "favourable", source: "16.1.1 §6; 16.2.3 §4.2" },
  { check: "Tārā bala (Arjun)", result: "Sādhaka — auspicious", status: "favourable", source: "16.1.1 §6; 16.2.3 §4.2" },
  { check: "Candra bala", result: "House 3 from Pisces lagna — favourable", status: "favourable", source: "16.2.4 §4.4" },
  { check: "Jupiter", result: "Exalted, house 5 from Pisces lagna — trikoṇa", status: "favourable", source: "16.2.4 §4.4" },
  { check: "Venus", result: "Friendly-sign (Capricorn), non-combust, house 11 from Pisces lagna — upachaya", status: "workable", source: "16.2.4 §4.4" },
  { check: "Lagna-sign preference", result: "Pisces — acceptable", status: "neutral", source: "16.2.4 §4.4" },
  { check: "Tri-bāla-śuddhi", result: "Clears (candra-bala, tārā-bala, lagna-śuddhi all favourable, both parties)", status: "clearing", source: "16.2.2 §4.2" },
  { check: "Maṅgala-doṣa interaction", result: "Not triggered (disclosed working assumption: no natal doṣa for either party)", status: "neutral", source: "16.2.2 §4.3, §6" },
  { check: "Kuhū-yoga", result: "Clears (Pūrṇā tithi, furthest point from Amāvasyā)", status: "clearing", source: "16.2.2 §4.4, §6" },
];

const LOCKED_VERBATIM = `It supports favourable conditions for your wedding, but it is one input among many to how your marriage actually unfolds -- your own preparation, your own decisions together, and the broader context of your lives all also operate.`;

function statusColor(status: Status): string {
  switch (status) {
    case "favourable":
      return GREEN;
    case "clearing":
      return GREEN;
    case "workable":
      return GOLD;
    default:
      return INK_MUTED;
  }
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
        {`Candidate 3's refined Pisces-lagna moment, assembled row by row. Every value was mechanically verified; none was hand-asserted.`}
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
        {`Honest scope: Venus's improved upachaya placement is still not kendra or trikoṇa. The table is complete, not manufactured-perfect.`}
      </div>
    </div>
  );
}

function ScriptPanel({
  coupleNames,
  setCoupleNames,
  date,
  setDate,
  time,
  setTime,
}: {
  coupleNames: string;
  setCoupleNames: (value: string) => void;
  date: string;
  setDate: (value: string) => void;
  time: string;
  setTime: (value: string) => void;
}) {
  const fullScript = useMemo(() => {
    return `Based on the full screening we've now completed for ${coupleNames} -- both the general muhūrta checks and the marriage-specific analysis this deserves -- ${date}, at ${time}, is the best-available selection from the candidates we evaluated.\n\n${LOCKED_VERBATIM}\n\nSpecifically: your nakṣatra match is strong -- Rohiṇī is especially favoured for weddings, and it's one of the small number of star-combinations that work well for both of you together, not just one of you. Jupiter, one of the two planets classical practice weights most heavily for marriage, is in its strongest possible placement at this time. Venus, the other of those two planets, is in a workable but not flawless placement -- we checked, and we're telling you honestly rather than rounding it up. We also refined the exact time within the day: an earlier option we first identified had this same weaker Venus placement without the offsetting benefit our final choice has, so we moved the specific time later in the day, within the same date, to improve it. We are not claiming a perfect moment exists -- we are reporting the strongest one we could find, with what it is and is not strongest on, both named.`;
  }, [coupleNames, date, time]);

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
          Couple names
          <input
            type="text"
            value={coupleNames}
            onChange={(e) => setCoupleNames(e.target.value)}
            style={inputStyle}
          />
        </label>
        <label style={fieldLabelStyle}>
          Date
          <input type="text" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
        </label>
        <label style={fieldLabelStyle}>
          Time / moment
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
          {`Based on the full screening we've now completed for `}
          <strong style={{ fontWeight: 600, color: GOLD }}>{coupleNames}</strong>
          {` -- both the general muhūrta checks and the marriage-specific analysis this deserves -- `}
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
          {`Specifically: your nakṣatra match is strong -- Rohiṇī is especially favoured for weddings, and it's one of the small number of star-combinations that work well for both of you together, not just one of you. Jupiter, one of the two planets classical practice weights most heavily for marriage, is in its strongest possible placement at this time. Venus, the other of those two planets, is in a workable but not flawless placement -- we checked, and we're telling you honestly rather than rounding it up. We also refined the exact time within the day: an earlier option we first identified had this same weaker Venus placement without the offsetting benefit our final choice has, so we moved the specific time later in the day, within the same date, to improve it. We are not claiming a perfect moment exists -- we are reporting the strongest one we could find, with what it is and is not strongest on, both named.`}
        </p>
      </div>
    </div>
  );
}

function ReflectionPanel() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <p style={{ margin: 0, fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.65 }}>
        {`Chapter 2 opened by re-screening a candidate Chapter 1 had already cleared, at marriage's own specific depth. That re-screening caught a real error -- an astronomically impossible Venus placement -- and rather than quietly patching it, the chapter followed the correction to where it actually led.`}
      </p>
      <p style={{ margin: 0, fontSize: "0.875rem", color: INK_SECONDARY, lineHeight: 1.65 }}>
        {`The corrected Jupiter-Venus gate (Lesson 16.2.1), the structural explanation of paired tārā-bala (Lesson 16.2.3), and the same-day moment-search demonstration (Lesson 16.2.4) all came directly from taking that error seriously. Had the original false 'flawless Venus' claim stood, this chapter would have had no real question to answer.`}
      </p>
      <p style={{ margin: 0, fontSize: "0.875rem", color: INK_SECONDARY, lineHeight: 1.65 }}>
        {`This is not a coincidence specific to this chapter. It is the curriculum's standing practice: a caught error is followed through to wherever it leads.`}
      </p>
    </div>
  );
}

function ProcessSvg({ reviewedCount }: { reviewedCount: number }) {
  return (
    <svg viewBox="0 0 720 130" role="img" aria-label="Six evidence layers converge on the final recommendation" style={{ width: "100%", maxHeight: 180, display: "block" }}>
      <rect x="10" y="10" width="100" height="28" rx="6" fill={`${BLUE}10`} stroke={HAIRLINE} />
      <text x="60" y="29" textAnchor="middle" fontSize="10" fill={INK_PRIMARY} fontWeight={500}>Foundational</text>
      <rect x="120" y="10" width="100" height="28" rx="6" fill={`${PURPLE}10`} stroke={HAIRLINE} />
      <text x="170" y="29" textAnchor="middle" fontSize="10" fill={INK_PRIMARY} fontWeight={500}>Wedding</text>
      <rect x="230" y="10" width="100" height="28" rx="6" fill={`${GOLD}10`} stroke={HAIRLINE} />
      <text x="280" y="29" textAnchor="middle" fontSize="10" fill={INK_PRIMARY} fontWeight={500}>Jupiter-Venus</text>
      <rect x="340" y="10" width="100" height="28" rx="6" fill={`${GREEN}10`} stroke={HAIRLINE} />
      <text x="390" y="29" textAnchor="middle" fontSize="10" fill={INK_PRIMARY} fontWeight={500}>Doṣas</text>
      <rect x="450" y="10" width="100" height="28" rx="6" fill={`${BLUE}10`} stroke={HAIRLINE} />
      <text x="500" y="29" textAnchor="middle" fontSize="10" fill={INK_PRIMARY} fontWeight={500}>Paired tārā</text>
      <rect x="560" y="10" width="100" height="28" rx="6" fill={`${PURPLE}10`} stroke={HAIRLINE} />
      <text x="610" y="29" textAnchor="middle" fontSize="10" fill={INK_PRIMARY} fontWeight={500}>Refinement</text>

      {[60, 170, 280, 390, 500, 610].map((cx, i) => (
        <line key={i} x1={cx} y1={38} x2={360} y2={80} stroke={i < reviewedCount ? GREEN : HAIRLINE} strokeWidth={i < reviewedCount ? 2 : 1} strokeDasharray={i < reviewedCount ? undefined : "3 3"} />
      ))}

      <rect x="250" y="78" width="220" height="44" rx="8" fill={`${GREEN}10`} stroke={GREEN} strokeWidth={reviewedCount === 6 ? 2 : 1} />
      <text x="360" y="100" textAnchor="middle" fontSize="12" fill={reviewedCount === 6 ? GREEN : INK_PRIMARY} fontWeight={600}>
        Candidate 3, Pisces-lagna moment
      </text>
      <text x="360" y="115" textAnchor="middle" fontSize="9" fill={INK_SECONDARY}>
        {reviewedCount === 6 ? "All six layers reviewed" : `${reviewedCount} of 6 layers reviewed`}
      </text>
    </svg>
  );
}

export function FullMarriageMuhurtaWorkbench() {
  const [activeLayer, setActiveLayer] = useState(1);
  const [reviewed, setReviewed] = useState<Set<number>>(new Set([1, 2, 3, 4, 5, 6]));
  const [tab, setTab] = useState<TabKey>("detail");
  const [coupleNames, setCoupleNames] = useState("Meera and Arjun");
  const [date, setDate] = useState("11 November 2026");
  const [time, setTime] = useState("the Pisces-lagna window");
  const [showReflection, setShowReflection] = useState(false);

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
    setReviewed(new Set([1, 2, 3, 4, 5, 6]));
    setTab("detail");
    setCoupleNames("Meera and Arjun");
    setDate("11 November 2026");
    setTime("the Pisces-lagna window");
    setShowReflection(false);
  }

  return (
    <div data-interactive="full-marriage-muhurta-workbench" style={{ display: "flex", flexDirection: "column", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Full marriage muhūrta workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.25rem", fontWeight: 600 }}>
              Assemble the evidence file, table, script and reflection for Meera and Arjun
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              {`Six screening layers converge on one final, honestly-communicated recommendation. The script keeps T1-23's mandated language verbatim.`}
            </p>
          </div>
          <button type="button" onClick={handleReset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 460px", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <ProcessSvg reviewedCount={reviewedCount} />

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            <TabButton label="Layer detail" active={tab === "detail"} onClick={() => setTab("detail")} icon={<BookOpen size={14} />} />
            <TabButton label="Synthesis table" active={tab === "synthesis"} onClick={() => setTab("synthesis")} icon={<FileText size={14} />} />
            <TabButton label="Script composer" active={tab === "script"} onClick={() => setTab("script")} icon={<MessageSquareQuote size={14} />} />
            <TabButton label="Reflection" active={tab === "reflection"} onClick={() => setTab("reflection")} icon={<Sparkles size={14} />} />
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

          {tab === "script" ? (
            <ScriptPanel
              coupleNames={coupleNames}
              setCoupleNames={setCoupleNames}
              date={date}
              setDate={setDate}
              time={time}
              setTime={setTime}
            />
          ) : null}

          {tab === "reflection" ? <ReflectionPanel /> : null}

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
                {`Candidate 3, Pisces-lagna moment -- survives every check; Venus remains the named limitation.`}
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

          <div style={cardStyle}>
            <button
              type="button"
              onClick={() => setShowReflection((value) => !value)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.5rem",
                padding: "0.5rem 0.75rem",
                borderRadius: 6,
                border: `1px solid ${HAIRLINE}`,
                background: "transparent",
                color: INK_PRIMARY,
                cursor: "pointer",
                fontSize: "0.85rem",
                fontWeight: 500,
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Sparkles size={16} color={PURPLE} />
                {showReflection ? "Hide chapter reflection" : "Show chapter reflection"}
              </span>
              <ChevronRight size={14} color={INK_MUTED} style={{ transform: showReflection ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
            </button>
            {showReflection ? (
              <div style={{ marginTop: "0.75rem" }}>
                <ReflectionPanel />
              </div>
            ) : null}
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
