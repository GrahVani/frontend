"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Calculator,
  CheckSquare,
  HeartPulse,
  Home,
  RotateCcw,
  Route,
  ShieldCheck,
  Square,
} from "lucide-react";
import { workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ItemStatus = "pass" | "fail" | null;
type DraftKey = "honest" | "overclaim";
type ClusterKey = "workflow" | "event" | "medical" | "cross";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

interface LiteracyItem {
  id: number;
  text: string;
  cluster: ClusterKey;
}

const ITEMS: LiteracyItem[] = [
  { id: 1, text: "Run the full four-pillar workflow (tithi, vāra, nakṣatra, yoga, karaṇa) plus lagna-śuddhi, tārā-bala, and candra-bala for any candidate moment.", cluster: "workflow" },
  { id: 2, text: "Generate a genuine candidate-window from a client's own real constraints, and classify an event's own stakes tier honestly.", cluster: "workflow" },
  { id: 3, text: "Screen a marriage candidate across the full prohibited-tithi list, paired tārā-bala, and synastry-sensitive moment-selection.", cluster: "event" },
  { id: 4, text: "Apply gṛha-praveśa's own three-type framework (Apūrva/Sa-pūrva/Dvandva) and know exactly where Vāstu-remediation competence ends and referral begins.", cluster: "event" },
  { id: 5, text: "Apply the Mercury-Jupiter discipline and house-bala for business-launch, and read a launch-moment's own wealth-yoga-structure echo without ever claiming to 'activate' anyone's natal fortune.", cluster: "event" },
  { id: 6, text: "Apply the medical-primacy doctrine correctly: distinguish a genuine candidate-window from an already-fixed time, and never suggest a medical reschedule for astrological reasons.", cluster: "medical" },
  { id: 7, text: "Distinguish the three genuinely different cesarean-timing requests, and apply T2-03's and T2-06's own real refusal scripts accurately and compassionately.", cluster: "medical" },
  { id: 8, text: "Apply Diśā-Śūla direction-timing correctly, and explain why it is not the same concept as dik-bala.", cluster: "medical" },
  { id: 9, text: "Name the sixteen saṁskāras accurately, with their own real classical-source count-variance disclosed rather than hidden.", cluster: "cross" },
  { id: 10, text: "Recognise cross-stream and regional variance as technique-variance within shared principles, and disclose an open item honestly rather than either hiding it or fabricating a false closure.", cluster: "cross" },
];

const CLUSTER_META: Record<ClusterKey, { label: string; color: string; icon: ReactNode }> = {
  workflow: { label: "Workflow", color: BLUE, icon: <Calculator size={16} /> },
  event: { label: "Event types", color: GREEN, icon: <Home size={16} /> },
  medical: { label: "Medical / journey / ethics", color: GOLD, icon: <HeartPulse size={16} /> },
  cross: { label: "Saṁskāras & cross-stream", color: PURPLE, icon: <Route size={16} /> },
};

const DRAFTS: Record<DraftKey, { label: string; text: string; expected: Record<number, ItemStatus> }> = {
  honest: {
    label: "Honest literacy framing",
    text: "Module 16 gives me real, substantial competence — the full workflow, five event-types at genuine depth, and the ethical discipline to handle the hardest cases correctly. That's not nothing, and it's not a formality either. But 'literacy' is the honest word, not 'mastery' — I should still work under supervision or careful self-review for my first real consultations, especially high-stakes and ethically-sensitive ones, until the judgment this module has given me becomes fully my own in live practice.",
    expected: { 1: "pass", 2: "pass", 3: "pass", 4: "pass", 5: "pass", 6: "pass", 7: "pass", 8: "pass", 9: "pass", 10: "pass" },
  },
  overclaim: {
    label: "Mastery overclaim",
    text: "I have completed Module 16, so I am now a qualified muhūrta consultant. I can handle cesarean-timing requests, suggest rescheduling medical procedures when the chart is strong, give authoritative readings in Tājika and regional variants, and guide all sixteen saṁskāras at full classical depth.",
    expected: { 1: "pass", 2: "pass", 3: "pass", 4: "pass", 5: "pass", 6: "fail", 7: "fail", 8: "pass", 9: "fail", 10: "fail" },
  },
};

export function MuhurtaAdvancedLiteracyBar() {
  const [selfChecks, setSelfChecks] = useState<Record<number, boolean>>({});
  const [selectedDraft, setSelectedDraft] = useState<DraftKey>("honest");
  const [auditAnswers, setAuditAnswers] = useState<Record<number, ItemStatus>>({});
  const [auditRun, setAuditRun] = useState(false);

  const reset = () => {
    setSelfChecks({});
    setSelectedDraft("honest");
    setAuditAnswers({});
    setAuditRun(false);
  };

  const selfCheckedCount = ITEMS.filter((item) => selfChecks[item.id]).length;
  const toggleSelfCheck = (id: number) => {
    setSelfChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const setAudit = (id: number, status: ItemStatus) => {
    setAuditAnswers((prev) => ({ ...prev, [id]: status }));
    setAuditRun(false);
  };

  const expected = DRAFTS[selectedDraft].expected;
  const allAnswered = ITEMS.every((item) => auditAnswers[item.id] !== undefined);
  const allCorrect = allAnswered && ITEMS.every((item) => auditAnswers[item.id] === expected[item.id]);

  const overclaimMismatches = useMemo(() => {
    return ITEMS.filter((item) => expected[item.id] === "fail").map((item) => item.id);
  }, [expected]);

  return (
    <div data-interactive="muhurta-advanced-literacy-bar" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      {/* Header */}
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Muhūrta-advanced literacy bar</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.35rem", fontWeight: 600 }}>
              Ten checks, drawn from six chapters
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              The bar is a self-check discipline, not a one-time credential. A statement can pass nine items and still fail one.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, ACCENT)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      {/* Literacy bar SVG */}
      <section style={cardStyle}>
        <p style={eyebrowStyle}>The bar</p>
        <h3 style={{ margin: "0.15rem 0 0.65rem", color: INK_PRIMARY, fontSize: "1.2rem", fontWeight: 600 }}>
          Four clusters, ten items
        </h3>
        <LiteracyBarSvg />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.55rem", marginTop: "0.75rem" }}>
          {(Object.keys(CLUSTER_META) as Array<ClusterKey>).map((key) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: CLUSTER_META[key].color }} />
              <span style={{ color: INK_SECONDARY, fontSize: "0.85rem" }}>{CLUSTER_META[key].label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Self-check + auditor */}
      <div style={workbenchTwoColumnStyle as CSSProperties}>
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Self-check</p>
              <h3 style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "1.2rem", fontWeight: 600 }}>
                Check your own readiness
              </h3>
            </div>
            <span style={{ color: INK_MUTED, fontSize: "0.85rem", fontWeight: 600 }}>
              {selfCheckedCount} / {ITEMS.length}
            </span>
          </div>
          <div style={{ marginTop: "0.65rem", display: "grid", gap: "0.45rem" }}>
            {ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleSelfCheck(item.id)}
                style={{
                  display: "flex",
                  alignItems: "start",
                  gap: "0.5rem",
                  padding: "0.55rem",
                  borderRadius: 6,
                  border: `1px solid ${selfChecks[item.id] ? CLUSTER_META[item.cluster].color : HAIRLINE}`,
                  background: selfChecks[item.id] ? `${CLUSTER_META[item.cluster].color}08` : SURFACE,
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                {selfChecks[item.id] ? (
                  <CheckSquare size={16} style={{ color: CLUSTER_META[item.cluster].color, flexShrink: 0 }} />
                ) : (
                  <Square size={16} style={{ color: INK_MUTED, flexShrink: 0 }} />
                )}
                <span style={{ color: selfChecks[item.id] ? INK_PRIMARY : INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
                  <span style={{ color: CLUSTER_META[item.cluster].color, fontWeight: 600 }}>{item.id}.</span> {item.text}
                </span>
              </button>
            ))}
          </div>
          {selfCheckedCount === ITEMS.length && (
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, background: `${GREEN}10`, border: `1px solid ${GREEN}`, color: GREEN, fontSize: "0.9rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <BadgeCheck size={18} aria-hidden="true" />
                <span style={{ fontWeight: 600 }}>All ten items self-checked. Remember: this is a per-statement discipline, not a one-time credential.</span>
              </div>
            </div>
          )}
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Statement auditor</p>
          <h3 style={{ margin: "0.15rem 0 0.65rem", color: INK_PRIMARY, fontSize: "1.2rem", fontWeight: 600 }}>
            Audit a draft item by item
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.75rem" }}>
            {(Object.keys(DRAFTS) as DraftKey[]).map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={selectedDraft === key}
                onClick={() => { setSelectedDraft(key); setAuditAnswers({}); setAuditRun(false); }}
                style={smallChipStyle(selectedDraft === key, key === "honest" ? GREEN : VERMILION)}
              >
                {DRAFTS[key].label}
              </button>
            ))}
          </div>
          <div style={{ padding: "0.75rem", borderRadius: 8, background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <p style={{ margin: 0, color: INK_PRIMARY, fontSize: "0.9rem", lineHeight: 1.6 }}>{DRAFTS[selectedDraft].text}</p>
          </div>

          <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.45rem" }}>
            {ITEMS.map((item) => {
              const answer = auditAnswers[item.id];
              return (
                <div key={item.id} style={{ padding: "0.5rem", borderRadius: 6, border: `1px solid ${answer ? (answer === expected[item.id] ? GREEN : VERMILION) : HAIRLINE}`, background: answer ? (answer === expected[item.id] ? `${GREEN}08` : `${VERMILION}08`) : SURFACE }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", alignItems: "start" }}>
                    <span style={{ color: answer === expected[item.id] ? INK_PRIMARY : INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
                      <span style={{ color: CLUSTER_META[item.cluster].color, fontWeight: 600 }}>{item.id}.</span> {item.text}
                    </span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.4rem" }}>
                    <button type="button" aria-pressed={answer === "pass"} onClick={() => setAudit(item.id, "pass")} style={smallChipStyle(answer === "pass", GREEN)}>
                      Pass
                    </button>
                    <button type="button" aria-pressed={answer === "fail"} onClick={() => setAudit(item.id, "fail")} style={smallChipStyle(answer === "fail", VERMILION)}>
                      Fail
                    </button>
                  </div>
                  {auditRun && answer !== undefined && answer !== expected[item.id] && (
                    <div style={{ marginTop: "0.4rem", color: VERMILION, fontSize: "0.78rem" }}>
                      Expected: {expected[item.id] === "pass" ? "Pass" : "Fail"}.
                      {selectedDraft === "overclaim" && overclaimMismatches.includes(item.id)
                        ? " This draft overstates what Module 16 confers."
                        : ""}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button type="button" onClick={() => setAuditRun(true)} style={{ ...buttonStyle(false, BLUE), marginTop: "0.75rem" }}>
            <ShieldCheck size={15} aria-hidden="true" />
            Check audit
          </button>

          {auditRun && (
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, background: allCorrect ? `${GREEN}10` : `${VERMILION}10`, border: `1px solid ${allCorrect ? GREEN : VERMILION}`, color: allCorrect ? GREEN : VERMILION, fontSize: "0.9rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {allCorrect ? <BadgeCheck size={18} aria-hidden="true" /> : <AlertTriangle size={18} aria-hidden="true" />}
                <span style={{ fontWeight: 600 }}>{allCorrect ? "Audit matches the literacy bar." : "Some items need correction — review the expected results above."}</span>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function LiteracyBarSvg() {
  const segmentWidth = 44;
  const gap = 4;
  const startX = 30;
  const totalWidth = startX * 2 + 10 * segmentWidth + 9 * gap;

  return (
    <svg viewBox={`0 0 ${totalWidth} 80`} role="img" aria-label="Ten-item literacy bar grouped into workflow, event types, medical-journey-ethics, and samskaras-cross-stream clusters" style={{ width: "100%", maxHeight: 180, margin: "0.4rem auto 0", display: "block" }}>
      <rect x="12" y="12" width={totalWidth - 24} height="56" rx="8" fill={`${ACCENT}08`} stroke={HAIRLINE} />
      {ITEMS.map((item, index) => {
        const x = startX + index * (segmentWidth + gap);
        const color = CLUSTER_META[item.cluster].color;
        return (
          <g key={item.id}>
            <rect x={x} y="24" width={segmentWidth} height="32" rx="4" fill={`${color}18`} stroke={color} strokeWidth="2" />
            <text x={x + segmentWidth / 2} y="45" textAnchor="middle" fill={color} fontSize="14" fontWeight={700}>
              {item.id}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "1rem",
  background: SURFACE,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: ACCENT,
  fontSize: "0.75rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

function buttonStyle(primary: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    padding: "0.45rem 0.75rem",
    borderRadius: 6,
    border: `1px solid ${primary ? color : HAIRLINE}`,
    background: primary ? color : SURFACE,
    color: primary ? "#fff" : color,
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.3rem",
    padding: "0.35rem 0.6rem",
    borderRadius: 999,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? `${color}12` : SURFACE,
    color: active ? color : INK_PRIMARY,
    fontSize: "0.8rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}
