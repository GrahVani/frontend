"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  CheckSquare,
  RotateCcw,
  ShieldCheck,
  Square,
} from "lucide-react";
import { workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ItemStatus = "pass" | "fail" | null;
type DraftKey = "complete" | "flawed";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const VERMILION = "var(--gl-vermilion-accent)";
const VERMILION_TINT = "#FDEBE6";
const GREEN = "#2F7D55";
const GREEN_TINT = "#EAF4EE";
const BLUE = "#356CAB";
const BLUE_TINT = "#EAF0F8";
const GOLD = "#B88421";
const GOLD_TINT = "#FFF8E8";

interface LiteracyItem {
  id: number;
  text: string;
  cluster: "citation" | "people" | "consent";
  chapter: string;
}

const ITEMS: LiteracyItem[] = [
  { id: 1, text: "Every classical citation is distinguished from any modern extension.", cluster: "citation", chapter: "Ch. 1 & 6" },
  { id: 2, text: "Confidence tier is based on genuine technique convergence, not register breadth.", cluster: "citation", chapter: "Ch. 3" },
  { id: 3, text: "Thematic convergence is named as thematic, not mechanical.", cluster: "citation", chapter: "Ch. 2" },
  { id: 4, text: "Multiple people's charts are never blended into one combined score.", cluster: "people", chapter: "Ch. 4 & 6" },
  { id: 5, text: "Classification and confidence tier are treated as independent axes.", cluster: "people", chapter: "Ch. 5" },
  { id: 6, text: "Mixed and complicating findings are reported honestly alongside favourable ones.", cluster: "people", chapter: "Ch. 2 & 5" },
  { id: 7, text: "No finding becomes a verdict on a real person's competence, character, or worth.", cluster: "people", chapter: "Ch. 6" },
  { id: 8, text: "No finding becomes a real governance, authority, or business recommendation.", cluster: "people", chapter: "Ch. 6" },
  { id: 9, text: "Every chart's consent tier is checked and stated individually.", cluster: "consent", chapter: "Ch. 7" },
  { id: 10, text: "The statement names what it can never assess and includes referral language.", cluster: "consent", chapter: "Ch. 5 & 6" },
];

const CLUSTER_META = {
  citation: { label: "Citation & technique", color: BLUE },
  people: { label: "People", color: GREEN },
  consent: { label: "Consent & scope", color: GOLD },
};

const DRAFTS: Record<DraftKey, { label: string; text: string; expected: Record<number, ItemStatus> }> = {
  complete: {
    label: "Complete draft",
    text: "Tier A, both consenting. Your two charts show a Strong, three-technique-corroborated axis [named and sourced], alongside two honestly-mixed findings [named]. Neither of you is more or less suited to this partnership because of what your own chart shows — that is not a claim this reading can make. This does not substitute for legal or financial advice, which you should seek regardless of what any chart shows.",
    expected: { 1: "pass", 2: "pass", 3: "pass", 4: "pass", 5: "pass", 6: "pass", 7: "pass", 8: "pass", 9: "pass", 10: "pass" },
  },
  flawed: {
    label: "Flawed draft",
    text: "Tier A, both consenting. Ansh's own chart shows a much cleaner pattern than Priya's — his is Strong tier, hers is more mixed. Given this, Ansh is really the stronger fit to lead this company, astrologically speaking. This doesn't replace legal or financial advice.",
    expected: { 1: "pass", 2: "pass", 3: "pass", 4: "pass", 5: "pass", 6: "pass", 7: "pass", 8: "fail", 9: "pass", 10: "pass" },
  },
};

export function MultiChartSynthesisLiteracyBar() {
  const [selfChecks, setSelfChecks] = useState<Record<number, boolean>>({});
  const [selectedDraft, setSelectedDraft] = useState<DraftKey>("complete");
  const [auditAnswers, setAuditAnswers] = useState<Record<number, ItemStatus>>({});
  const [auditRun, setAuditRun] = useState(false);

  const reset = () => {
    setSelfChecks({});
    setSelectedDraft("complete");
    setAuditAnswers({});
    setAuditRun(false);
  };

  const selfCheckedCount = ITEMS.filter((i) => selfChecks[i.id]).length;
  const toggleSelfCheck = (id: number) => {
    setSelfChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const setAudit = (id: number, status: ItemStatus) => {
    setAuditAnswers((prev) => ({ ...prev, [id]: status }));
    setAuditRun(false);
  };

  const expected = DRAFTS[selectedDraft].expected;
  const allAnswered = ITEMS.every((i) => auditAnswers[i.id] !== undefined);
  const allCorrect = allAnswered && ITEMS.every((i) => auditAnswers[i.id] === expected[i.id]);

  return (
    <div data-interactive="multi-chart-synthesis-literacy-bar" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      {/* Header */}
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Multi-chart-synthesis literacy bar</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.35rem" }}>
              Ten checks, drawn from seven chapters
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              The bar is a self-check discipline applied to each statement, not a one-time credential. A statement can pass nine items and still fail one.
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
        <h3 style={{ margin: "0.15rem 0 0.65rem", color: INK_PRIMARY, fontSize: "1.2rem" }}>
          Three clusters, ten items
        </h3>
        <LiteracyBarSvg />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.55rem", marginTop: "0.75rem" }}>
          {(Object.keys(CLUSTER_META) as Array<keyof typeof CLUSTER_META>).map((key) => (
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
              <h3 style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "1.2rem" }}>
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
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, background: GREEN_TINT, border: `1px solid ${GREEN}`, color: GREEN, fontSize: "0.9rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <BadgeCheck size={18} aria-hidden="true" />
                <span style={{ fontWeight: 600 }}>All ten items self-checked. Remember: this is a per-statement discipline, not a one-time credential.</span>
              </div>
            </div>
          )}
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Statement auditor</p>
          <h3 style={{ margin: "0.15rem 0 0.65rem", color: INK_PRIMARY, fontSize: "1.2rem" }}>
            Audit a draft item by item
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.75rem" }}>
            {(Object.keys(DRAFTS) as DraftKey[]).map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={selectedDraft === key}
                onClick={() => { setSelectedDraft(key); setAuditAnswers({}); setAuditRun(false); }}
                style={smallChipStyle(selectedDraft === key, key === "complete" ? GREEN : VERMILION)}
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
                <div key={item.id} style={{ padding: "0.5rem", borderRadius: 6, border: `1px solid ${answer ? (answer === expected[item.id] ? GREEN : VERMILION) : HAIRLINE}`, background: answer ? (answer === expected[item.id] ? GREEN_TINT : VERMILION_TINT) : SURFACE }}>
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
                      Expected: {expected[item.id] === "pass" ? "Pass" : "Fail"}. {expected[item.id] === "fail" && item.id === 8 ? "This draft converts an asymmetric finding into a leadership recommendation." : ""}
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
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, background: allCorrect ? GREEN_TINT : VERMILION_TINT, border: `1px solid ${allCorrect ? GREEN : VERMILION}`, color: allCorrect ? GREEN : VERMILION, fontSize: "0.9rem" }}>
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
    <svg viewBox={`0 0 ${totalWidth} 80`} role="img" aria-label="Ten-item literacy bar grouped into citation-and-technique, people, and consent-and-scope clusters" style={{ width: "100%", maxHeight: 180, margin: "0.4rem auto 0", display: "block" }}>
      <rect x="12" y="12" width={totalWidth - 24} height="56" rx="8" fill={GOLD_TINT} stroke={HAIRLINE} />
      {ITEMS.map((item, index) => {
        const x = startX + index * (segmentWidth + gap);
        const color = CLUSTER_META[item.cluster].color;
        return (
          <g key={item.id}>
            <rect x={x} y="24" width={segmentWidth} height="32" rx={4} fill={tintForColor(color)} stroke={color} strokeWidth="2" />
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

function tintForColor(color: string): string {
  if (color === VERMILION) return VERMILION_TINT;
  if (color === GREEN) return GREEN_TINT;
  if (color === BLUE) return BLUE_TINT;
  if (color === GOLD || color === ACCENT) return GOLD_TINT;
  return SURFACE;
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.3rem",
    padding: "0.35rem 0.6rem",
    borderRadius: 999,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? tintForColor(color) : SURFACE,
    color: active ? color : INK_PRIMARY,
    fontSize: "0.8rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}
