"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  Edit3,
  Eye,
  MessageCircle,
  RefreshCw,
  ShieldAlert,
  Target,
  XCircle
} from "lucide-react";


type TabKey = "read" | "build" | "spot" | "nonclaims";
type NativeKey = "kavya" | "meera";
type RegisterKey = "technical" | "client";
type ConfidenceKey = "confirmed" | "stipulated" | "open";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";
const AMBER = "#D97706";

const CONFIDENCE_COLORS: Record<ConfidenceKey, string> = {
  confirmed: GREEN,
  stipulated: AMBER,
  open: VERMILION
};

interface Finding {
  id: string;
  text: string;
  confidence: ConfidenceKey;
  source: string;
}

const KAVYA_FINDINGS: Finding[] = [
  { id: "k1", text: "Varṣeśa is Venus — the year's theme-setter.", confidence: "stipulated", source: "Chapter 2 (illustrative Pañcavargīya-bala edge)" },
  { id: "k2", text: "Venus is Punya-pati and 10th lord.", confidence: "confirmed", source: "Chapter 3" },
  { id: "k3", text: "Venus is the exact applying Ithasāla partner to the Sun.", confidence: "confirmed", source: "Chapter 3" },
  { id: "k4", text: "Venus is the natal Vimśottarī bhukti-lord at age 30.0.", confidence: "confirmed", source: "Lesson 17.5.2" },
  { id: "k5", text: "Natal Venus rules 4th and 11th, sits in 2nd.", confidence: "confirmed", source: "Lesson 17.5.2" },
  { id: "k6", text: "Jupiter is Muntha-pati and opens a mid-year Mudda-daśā period.", confidence: "confirmed", source: "Chapters 2 and 4" },
  { id: "k7", text: "Natal Sun→Moon mahādaśā transition is boundary-adjacent to Rāhu→Jupiter in Mudda-daśā.", confidence: "confirmed", source: "Lesson 17.5.2" }
];

const MEERA_FINDINGS: Finding[] = [
  { id: "m1", text: "Varṣeśa tie-break is open: Saturn, Mercury, or Moon.", confidence: "open", source: "Chapter 2" },
  { id: "m2", text: "Muntha is in 1st house Libra, same sign as natal Lagna; Muntha-pati is Venus.", confidence: "confirmed", source: "Chapter 2" },
  { id: "m3", text: "Punya Sāham is in 7th house Leo, lord Sun, in exact conjunction with Saturn.", confidence: "confirmed", source: "Chapter 3" },
  { id: "m4", text: "Mars is debilitated in Cancer, house 6 — Kuṭṭha.", confidence: "confirmed", source: "Chapter 3" },
  { id: "m5", text: "No Ithasāla forms in this chart this year.", confidence: "confirmed", source: "Chapter 3" },
  { id: "m6", text: "Natal Lagna-lord (Venus) equals Muntha-pati (Venus).", confidence: "confirmed", source: "Lesson 17.5.2" },
  { id: "m7", text: "Venus governs roughly two months in all three parallel Mudda-daśā hypotheses.", confidence: "confirmed", source: "Lesson 17.4.4" }
];

const SPOT_STATEMENTS = [
  {
    id: "s1",
    text: "Venus is your Varṣeśa, Punya-pati, and Ithasāla partner, so you will purchase a home this year.",
    isOverclaim: true,
    explanation: "Two errors: it drops the STIPULATED label on the Varṣeśa, and it converts a thematic convergence into a specific, deterministic event claim."
  },
  {
    id: "s2",
    text: "Three independent computations point at Venus this year — Varṣeśa election, Punya lordship, and applying Ithasāla — while the natal chart gives Venus a domestic/financial significator cluster. This is a plausible activation window, not a guarantee.",
    isOverclaim: false,
    explanation: "Correct. It keeps confidence calibrated, mentions the stipulation implicitly by naming the election separately, and avoids a specific event claim."
  },
  {
    id: "s3",
    text: "Meera's Varṣeśa is unresolved, so no synthesis statement is possible for her.",
    isOverclaim: true,
    explanation: "Overgeneralises one open question. Several other layers are fully confirmed; the statement should report what is resolved and what is open."
  },
  {
    id: "s4",
    text: "This reading does not prescribe a remedy, name a specific calendar date, or claim anything beyond what the natal chart already promises.",
    isOverclaim: false,
    explanation: "Correct. These explicit non-claims are part of a complete synthesis statement."
  }
];

const NONCLAIMS = [
  { text: "No upāya / remedy is prescribed.", reason: "That is Lal Kitab's contribution, not Tājika's." },
  { text: "No specific calendar date is named for any event.", reason: "Chapter 4 found no reliable dina-praveśa formula." },
  { text: "Meera's Varṣeśa tie-break is not resolved.", reason: "The required Pañcavargīya-bala point-value table is a documented gap." },
  { text: "Neither statement exceeds what each natal chart already promises.", reason: "T1-19's cannot-exceed-the-natal-promise doctrine." }
];

export function WorkedSynthesisStatementBuilder() {
  const [tab, setTab] = useState<TabKey>("read");
  const [native, setNative] = useState<NativeKey>("kavya");
  const [register, setRegister] = useState<RegisterKey>("technical");
  const [selectedFindingIds, setSelectedFindingIds] = useState<Set<string>>(new Set());
  const [judgments, setJudgments] = useState<Record<string, "undecided" | "overclaim" | "correct">(
    Object.fromEntries(SPOT_STATEMENTS.map((s) => [s.id, "undecided"]))
  );
  const [copied, setCopied] = useState(false);

  const findings = native === "kavya" ? KAVYA_FINDINGS : MEERA_FINDINGS;

  const selectedFindings = useMemo(
    () => findings.filter((f) => selectedFindingIds.has(f.id)),
    [findings, selectedFindingIds]
  );

  function reset() {
    setTab("read");
    setNative("kavya");
    setRegister("technical");
    setSelectedFindingIds(new Set());
    setJudgments(Object.fromEntries(SPOT_STATEMENTS.map((s) => [s.id, "undecided"])));
    setCopied(false);
  }

  function toggleFinding(id: string) {
    setSelectedFindingIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function judge(id: string, value: "overclaim" | "correct") {
    setJudgments((prev) => ({ ...prev, [id]: value }));
  }

  const clientStatement = useMemo(() => {
    if (native === "kavya") {
      return "This year centres on themes of home, family finances, and relationships — several independent parts of your chart are pointing the same direction at once, which gives this reading more confidence than usual. It's a good year to pay attention to domestic and financial decisions, though I can't tell you a specific date or guarantee a specific outcome.";
    }
    return "Your year has several clear structural themes — especially around identity, relationships, and the need to manage conflict or health matters carefully — but the single dominant year-lord remains unresolved. I can describe the year's shape honestly; I cannot yet name one planet as the definite theme-setter.";
  }, [native]);

  function copyStatement() {
    navigator.clipboard.writeText(register === "technical" ? selectedFindings.map((f) => f.text).join(" ") : clientStatement);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div data-interactive="worked-synthesis-statement-builder" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Worked synthesis statement builder</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Compose a capstone answer to &quot;what does this year hold?&quot;
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Read Kavya&apos;s and Meera&apos;s full synthesis statements, practise labelling findings by confidence, spot overclaimed sentences, and list the explicit non-claims that keep a statement honest.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {[
          { key: "read", label: "Read statements", icon: Eye },
          { key: "build", label: "Build statement", icon: Edit3 },
          { key: "spot", label: "Spot overclaim", icon: Target },
          { key: "nonclaims", label: "Non-claims", icon: ShieldAlert }
        ].map(({ key, label, icon: Icon }) => {
          const active = tab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key as TabKey)}
              style={{ ...smallChipStyle(active, active ? GOLD : INK_MUTED), height: "44px", padding: "0 1rem", fontSize: "13px", display: "flex", alignItems: "center", gap: "0.4rem" }}
            >
              <Icon size={16} />
              {label}
            </button>
          );
        })}
      </div>

      {tab === "read" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Select native and register</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <button type="button" aria-pressed={native === "kavya"} onClick={() => setNative("kavya")} style={smallChipStyle(native === "kavya", GREEN)}>
                Kavya
              </button>
              <button type="button" aria-pressed={native === "meera"} onClick={() => setNative("meera")} style={smallChipStyle(native === "meera", BLUE)}>
                Meera
              </button>
              <button type="button" aria-pressed={register === "technical"} onClick={() => setRegister("technical")} style={smallChipStyle(register === "technical", PURPLE)}>
                Technical
              </button>
              <button type="button" aria-pressed={register === "client"} onClick={() => setRegister("client")} style={smallChipStyle(register === "client", AMBER)}>
                Client-facing
              </button>
            </div>
          </section>

          <section style={{ ...cardStyle, borderLeft: `4px solid ${native === "kavya" ? GREEN : BLUE}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
              <p style={eyebrowStyle}>{native === "kavya" ? "Kavya's synthesis statement" : "Meera's synthesis statement"}</p>
              <button type="button" onClick={copyStatement} style={buttonStyle(false, GOLD)}>
                {copied ? <CheckCircle2 size={15} /> : <Copy size={15} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            {register === "technical" ? (
              <div style={{ display: "grid", gap: "0.55rem" }}>
                {findings.map((f) => (
                  <div key={f.id} style={{ padding: "0.65rem 0.85rem", borderRadius: "8px", border: `1px solid ${CONFIDENCE_COLORS[f.confidence]}`, background: `${CONFIDENCE_COLORS[f.confidence]}08` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                      <span style={{ color: INK_PRIMARY, lineHeight: 1.5 }}>{f.text}</span>
                      <ConfidenceBadge confidence={f.confidence} />
                    </div>
                    <p style={{ margin: "0.35rem 0 0", color: INK_MUTED, fontSize: "0.8rem" }}>Source: {f.source}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: "0.85rem", borderRadius: "8px", background: `${AMBER}08`, border: `1px solid ${AMBER}40` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: AMBER, fontWeight: 700, fontSize: "0.85rem", marginBottom: "0.4rem" }}>
                  <MessageCircle size={16} />
                  In client language
                </div>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.7 }}>{clientStatement}</p>
              </div>
            )}
          </section>
        </>
      )}

      {tab === "build" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Build your own statement</p>
            <p style={{ margin: "0 0 0.65rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
              Select findings for {native === "kavya" ? "Kavya" : "Meera"} and assemble a synthesis statement. The labels below show the correct confidence for each finding.
            </p>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button type="button" aria-pressed={native === "kavya"} onClick={() => { setNative("kavya"); setSelectedFindingIds(new Set()); }} style={smallChipStyle(native === "kavya", GREEN)}>
                Kavya
              </button>
              <button type="button" aria-pressed={native === "meera"} onClick={() => { setNative("meera"); setSelectedFindingIds(new Set()); }} style={smallChipStyle(native === "meera", BLUE)}>
                Meera
              </button>
            </div>
          </section>

          <div style={{ display: "grid", gap: "0.55rem" }}>
            {findings.map((f) => {
              const selected = selectedFindingIds.has(f.id);
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleFinding(f.id)}
                  style={{ textAlign: "left", padding: "0.75rem", borderRadius: "8px", border: `1.5px solid ${selected ? CONFIDENCE_COLORS[f.confidence] : HAIRLINE}`, background: selected ? `${CONFIDENCE_COLORS[f.confidence]}0A` : SURFACE, cursor: "pointer" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                    <span style={{ color: INK_PRIMARY, lineHeight: 1.5 }}>{f.text}</span>
                    <ConfidenceBadge confidence={f.confidence} />
                  </div>
                </button>
              );
            })}
          </div>

          <section style={{ ...cardStyle, borderLeft: `4px solid ${selectedFindings.length > 0 ? GREEN : GOLD}` }}>
            <p style={eyebrowStyle}>Your assembled statement</p>
            {selectedFindings.length > 0 ? (
              <>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.7 }}>
                  {selectedFindings.map((f) => f.text).join(" ")}
                </p>
                <p style={{ margin: "0.65rem 0 0", color: INK_MUTED, fontSize: "0.82rem", lineHeight: 1.5 }}>
                  Compare this to the full technical statement in the Read tab. Did you keep the CONFIRMED/STIPULATED/OPEN distinction visible?
                </p>
              </>
            ) : (
              <p style={{ margin: 0, color: INK_MUTED }}>Select at least one finding above.</p>
            )}
          </section>
        </>
      )}

      {tab === "spot" && (
        <>
          <section style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <Target size={18} color={VERMILION} />
              <p style={{ ...eyebrowStyle, margin: 0 }}>Spot the overclaim</p>
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              For each sentence, decide whether it is a properly calibrated synthesis claim or an overclaim. Read the feedback to see why.
            </p>
          </section>

          <div style={{ display: "grid", gap: "0.85rem" }}>
            {SPOT_STATEMENTS.map((item) => {
              const chosen = judgments[item.id];
              const showFeedback = chosen !== "undecided";
              const isCorrect = (chosen === "overclaim" && item.isOverclaim) || (chosen === "correct" && !item.isOverclaim);
              return (
                <section key={item.id} style={{ ...cardStyle, borderLeft: `4px solid ${showFeedback ? (isCorrect ? GREEN : VERMILION) : HAIRLINE}` }}>
                  <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.5, fontSize: "0.95rem" }}>{item.text}</p>
                  <div style={{ display: "flex", gap: "0.45rem", marginTop: "0.65rem", flexWrap: "wrap" }}>
                    <button type="button" aria-pressed={chosen === "overclaim"} onClick={() => judge(item.id, "overclaim")} style={smallChipStyle(chosen === "overclaim", VERMILION)}>
                      Overclaim
                    </button>
                    <button type="button" aria-pressed={chosen === "correct"} onClick={() => judge(item.id, "correct")} style={smallChipStyle(chosen === "correct", GREEN)}>
                      Properly calibrated
                    </button>
                  </div>
                  {showFeedback && (
                    <div style={{ marginTop: "0.65rem", padding: "0.55rem 0.75rem", borderRadius: "8px", background: isCorrect ? `${GREEN}0F` : `${VERMILION}0F`, border: `1px solid ${isCorrect ? GREEN : VERMILION}40` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: isCorrect ? GREEN : VERMILION, fontWeight: 700, fontSize: "0.9rem" }}>
                        {isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                        {isCorrect ? "Right call" : "Try again"}
                      </div>
                      <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.55 }}>{item.explanation}</p>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </>
      )}

      {tab === "nonclaims" && (
        <>
          <section style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <ShieldAlert size={18} color={GOLD} />
              <p style={{ ...eyebrowStyle, margin: 0 }}>Explicit non-claims</p>
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              A complete synthesis statement states its boundaries as clearly as its findings. These non-claims apply to both Kavya and Meera unless noted.
            </p>
          </section>

          <div style={{ display: "grid", gap: "0.65rem" }}>
            {NONCLAIMS.map((item) => (
              <section key={item.text} style={{ ...cardStyle, borderLeft: `4px solid ${GOLD}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: GOLD, fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.35rem" }}>
                  <AlertCircle size={16} />
                  {item.text}
                </div>
                <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.55 }}>{item.reason}</p>
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ConfidenceBadge({ confidence }: { confidence: ConfidenceKey }) {
  const labels = { confirmed: "Confirmed", stipulated: "Stipulated", open: "Open" };
  const color = CONFIDENCE_COLORS[confidence];
  return (
    <span style={{ padding: "0.2rem 0.55rem", borderRadius: "999px", background: `${color}18`, color, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", whiteSpace: "nowrap" }}>
      {labels[confidence]}
    </span>
  );
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.55rem 0.75rem",
    fontWeight: 600,
    cursor: "pointer"
  };
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.48rem 0.68rem",
    fontWeight: 600,
    cursor: "pointer"
  };
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem"
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase"
};
