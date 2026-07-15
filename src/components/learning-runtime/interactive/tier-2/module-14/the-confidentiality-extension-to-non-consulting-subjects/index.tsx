"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  BookOpen,
  Eye,
  EyeOff,
  FileWarning,
  Lock,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type DisclosureVerdict = "allowed" | "blocked" | null;
type TeachingChoice = "real" | "constructed" | null;

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const VERMILION = "var(--gl-vermilion-accent)";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const GOLD = "#B88421";
const PURPLE = "#6B5AA8";

interface DisclosureScenario {
  id: string;
  situation: string;
  verdict: "allowed" | "blocked";
  explanation: string;
}

const DISCLOSURE_SCENARIOS: DisclosureScenario[] = [
  {
    id: "with-client",
    situation: "Discussing Priya's own chart-derived findings with Ansh, the consulting client who asked the original question.",
    verdict: "allowed",
    explanation: "The consulting client already supplied the data and asked the relational question; discussing the subject's findings with him is the ordinary channel.",
  },
  {
    id: "conference-real",
    situation: "Presenting the real Ansh-Priya-Meridian Labs case at a professional conference without Priya's own separate case-study consent.",
    verdict: "blocked",
    explanation: "A non-consulting subject's own real data may not be used for teaching or public presentation without that subject's own separate written consent.",
  },
  {
    id: "confirm-fact",
    situation: "Priya asks directly whether her chart was used, and the practitioner confirms that it was.",
    verdict: "allowed",
    explanation: "The right-of-access principle allows confirming the fact of processing to the data subject; this does not disclose the original consultation's substance.",
  },
  {
    id: "share-client-substance",
    situation: "Telling Priya what Ansh asked and how Ansh reacted during the consultation.",
    verdict: "blocked",
    explanation: "The original consulting client's own consultation substance remains confidential; only the fact that Priya's chart was processed may be confirmed.",
  },
  {
    id: "anonymised-post",
    situation: "Posting an anonymised chart-derived finding about Priya on social media.",
    verdict: "blocked",
    explanation: "Anonymisation does not replace case-study consent for a non-consulting subject; use a constructed example-chart instead.",
  },
];

const RESPONSE_PHRASES: { id: string; text: string; include: boolean; explanation: string }[] = [
  {
    id: "confirm",
    text: "Yes — your own chart was compared against the company's own incorporation chart as part of the founder-company reading.",
    include: true,
    explanation: "Confirms the fact of processing, satisfying the subject's right-of-access.",
  },
  {
    id: "protect-client",
    text: "I cannot share the details of Ansh's own consultation itself.",
    include: true,
    explanation: "Protects the original consulting client's own separate confidentiality.",
  },
  {
    id: "offer-fresh",
    text: "I would be glad to discuss your own chart's own findings directly with you, or to do a fresh reading with your own full participation.",
    include: true,
    explanation: "Opens the door to explicit Tier A consent going forward.",
  },
  {
    id: "deny",
    text: "I cannot confirm whether your chart was used.",
    include: false,
    explanation: "Obscuring the fact of processing conflicts with the subject's right-of-access.",
  },
];

export function TheConfidentialityExtensionToNonConsultingSubjects() {
  const [disclosureAnswers, setDisclosureAnswers] = useState<Record<string, DisclosureVerdict>>({});
  const [teachingChoice, setTeachingChoice] = useState<TeachingChoice>(null);
  const [responseSelection, setResponseSelection] = useState<Record<string, boolean>>({});

  const reset = () => {
    setDisclosureAnswers({});
    setTeachingChoice(null);
    setResponseSelection({});
  };

  const allDisclosureCorrect = DISCLOSURE_SCENARIOS.every((s) => disclosureAnswers[s.id] === s.verdict);
  const allDisclosureAnswered = DISCLOSURE_SCENARIOS.every((s) => disclosureAnswers[s.id] !== undefined);

  const responseCorrect = RESPONSE_PHRASES.every((p) => responseSelection[p.id] === p.include);
  const responseAnswered = RESPONSE_PHRASES.every((p) => responseSelection[p.id] !== undefined);

  const setDisclosure = (id: string, verdict: DisclosureVerdict) => {
    setDisclosureAnswers((prev) => ({ ...prev, [id]: verdict }));
  };

  const toggleResponse = (id: string) => {
    setResponseSelection((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div data-interactive="the-confidentiality-extension-to-non-consulting-subjects" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      {/* Header */}
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Confidentiality extension</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.35rem" }}>
              The second chart in the room belongs to someone who never walked in
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Apply T1-24 24.2.3&apos;s privileged-information protections to a non-consulting subject: who may hear what, how teaching cases are handled, and how to respond if the subject asks directly.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, ACCENT)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      {/* Diagram + disclosure scenarios */}
      <div style={workbenchDiagramLayoutStyle as CSSProperties}>
        <section style={{ ...cardStyle, flex: "2 1 520px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Disclosure boundary</p>
              <h3 style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "1.2rem" }}>
                Decide what may be shared
              </h3>
            </div>
          </div>

          <ConfidentialityFlowSvg />

          <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.65rem" }}>
            {DISCLOSURE_SCENARIOS.map((scenario) => {
              const selected = disclosureAnswers[scenario.id];
              return (
                <div key={scenario.id} style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${selected ? (selected === scenario.verdict ? GREEN : VERMILION) : HAIRLINE}`, background: selected ? (selected === scenario.verdict ? `${GREEN}08` : `${VERMILION}08`) : SURFACE }}>
                  <p style={{ margin: 0, color: INK_PRIMARY, fontSize: "0.9rem", lineHeight: 1.55 }}>{scenario.situation}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.55rem" }}>
                    <button type="button" aria-pressed={selected === "allowed"} onClick={() => setDisclosure(scenario.id, "allowed")} style={smallChipStyle(selected === "allowed", GREEN)}>
                      <Eye size={14} aria-hidden="true" />
                      Allowed
                    </button>
                    <button type="button" aria-pressed={selected === "blocked"} onClick={() => setDisclosure(scenario.id, "blocked")} style={smallChipStyle(selected === "blocked", VERMILION)}>
                      <EyeOff size={14} aria-hidden="true" />
                      Blocked
                    </button>
                  </div>
                  {selected && (
                    <div style={{ marginTop: "0.55rem", padding: "0.55rem", borderRadius: 6, background: selected === scenario.verdict ? `${GREEN}10` : `${VERMILION}10`, border: `1px solid ${selected === scenario.verdict ? GREEN : VERMILION}`, color: selected === scenario.verdict ? GREEN : VERMILION, fontSize: "0.85rem" }}>
                      {selected === scenario.verdict ? scenario.explanation : `This disclosure is ${scenario.verdict}. ${scenario.explanation}`}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {allDisclosureAnswered && (
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, background: allDisclosureCorrect ? `${GREEN}10` : `${VERMILION}10`, border: `1px solid ${allDisclosureCorrect ? GREEN : VERMILION}`, color: allDisclosureCorrect ? GREEN : VERMILION, fontSize: "0.9rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {allDisclosureCorrect ? <BadgeCheck size={18} aria-hidden="true" /> : <AlertTriangle size={18} aria-hidden="true" />}
                <span style={{ fontWeight: 600 }}>{allDisclosureCorrect ? "All disclosure boundaries correct." : "Some boundaries need correction — review the feedback above."}</span>
              </div>
            </div>
          )}
        </section>

        {/* Sidebar */}
        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Teaching-use rule" icon={<BookOpen size={18} />} color={PURPLE}>
            <p style={{ margin: "0 0 0.55rem", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
              A real multi-chart case may be used for teaching only with the non-consulting subject&apos;s own separate written case-study consent. Otherwise, use a fully constructed example-chart.
            </p>
            <div style={{ display: "grid", gap: "0.45rem" }}>
              <button type="button" aria-pressed={teachingChoice === "real"} onClick={() => setTeachingChoice("real")} style={toggleRowStyle(teachingChoice === "real", VERMILION)}>
                <FileWarning size={16} aria-hidden="true" />
                <span>Present the real case</span>
              </button>
              <button type="button" aria-pressed={teachingChoice === "constructed"} onClick={() => setTeachingChoice("constructed")} style={toggleRowStyle(teachingChoice === "constructed", GREEN)}>
                <ShieldCheck size={16} aria-hidden="true" />
                <span>Use a constructed example-chart</span>
              </button>
            </div>
            {teachingChoice && (
              <div style={{ marginTop: "0.55rem", padding: "0.55rem", borderRadius: 6, background: teachingChoice === "constructed" ? `${GREEN}10` : `${VERMILION}10`, border: `1px solid ${teachingChoice === "constructed" ? GREEN : VERMILION}`, color: teachingChoice === "constructed" ? GREEN : VERMILION, fontSize: "0.85rem" }}>
                {teachingChoice === "constructed"
                  ? "Correct. A constructed example-chart protects the non-consulting subject and is very often the only available option."
                  : "Risk. Without Priya's own separate written case-study consent, the real case cannot be used for teaching or public presentation."}
              </div>
            )}
          </Panel>

          <Panel title="Core rule" icon={<Lock size={18} />} color={BLUE}>
            <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.55 }}>
              A non-consulting subject&apos;s own birth data and chart-derived findings are fully privileged. They may be discussed with the consulting client only, absent the subject&apos;s own separate consent.
            </p>
          </Panel>
        </section>
      </div>

      {/* Response builder */}
      <section style={cardStyle}>
        <p style={eyebrowStyle}>Direct-question response builder</p>
        <h3 style={{ margin: "0.15rem 0 0.65rem", color: INK_PRIMARY, fontSize: "1.2rem" }}>
          Priya asks: &quot;Was my own chart actually used in whatever you did with Ansh?&quot;
        </h3>
        <p style={{ margin: "0 0 0.75rem", color: INK_SECONDARY, fontSize: "0.9rem", lineHeight: 1.55 }}>
          Select the sentences that belong in a well-formed response. The goal: confirm the fact of processing while protecting the original consultation&apos;s substance.
        </p>
        <div style={{ display: "grid", gap: "0.55rem" }}>
          {RESPONSE_PHRASES.map((phrase) => {
            const selected = responseSelection[phrase.id];
            return (
              <button
                key={phrase.id}
                type="button"
                onClick={() => toggleResponse(phrase.id)}
                style={{
                  display: "flex",
                  alignItems: "start",
                  gap: "0.55rem",
                  padding: "0.65rem",
                  borderRadius: 8,
                  border: `1px solid ${selected === undefined ? HAIRLINE : selected ? GREEN : VERMILION}`,
                  background: selected === undefined ? SURFACE : selected ? `${GREEN}08` : `${VERMILION}08`,
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <span style={{ color: selected === undefined ? INK_MUTED : selected ? GREEN : VERMILION, fontWeight: 700, fontSize: "0.9rem" }}>
                  {selected === undefined ? "?" : selected ? "+" : "−"}
                </span>
                <span style={{ color: INK_PRIMARY, fontSize: "0.9rem", lineHeight: 1.5 }}>{phrase.text}</span>
              </button>
            );
          })}
        </div>

        {responseAnswered && (
          <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, background: responseCorrect ? `${GREEN}10` : `${VERMILION}10`, border: `1px solid ${responseCorrect ? GREEN : VERMILION}`, color: responseCorrect ? GREEN : VERMILION, fontSize: "0.9rem" }}>
            <div style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
              {responseCorrect ? <BadgeCheck size={18} aria-hidden="true" style={{ flexShrink: 0 }} /> : <AlertTriangle size={18} aria-hidden="true" style={{ flexShrink: 0 }} />}
              <span style={{ fontWeight: 600 }}>
                {responseCorrect
                  ? "Response selection correct: fact confirmed, client substance protected, and future participation invited."
                  : "Some selections are off — the response must confirm the fact of processing, protect Ansh's consultation substance, and avoid denial."}
              </span>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function ConfidentialityFlowSvg() {
  return (
    <svg viewBox="0 0 560 220" role="img" aria-label="Confidentiality flow: a non-consulting subject's data may reach the consulting client but not third parties or public teaching without separate consent" style={{ width: "100%", maxHeight: 280, margin: "0.4rem auto 0.75rem", display: "block" }}>
      <rect x="12" y="12" width="536" height="196" rx="8" fill={`${ACCENT}08`} stroke={HAIRLINE} />

      {/* Nodes */}
      <circle cx="100" cy="110" r="36" fill={`${BLUE}18`} stroke={BLUE} strokeWidth="2" />
      <text x="100" y="106" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight={600}>Ansh</text>
      <text x="100" y="120" textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight={600}>client</text>

      <circle cx="280" cy="60" r="36" fill={`${PURPLE}18`} stroke={PURPLE} strokeWidth="2" />
      <text x="280" y="56" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight={600}>Practitioner</text>
      <text x="280" y="70" textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight={600}>records</text>

      <circle cx="460" cy="110" r="36" fill={`${GOLD}18`} stroke={GOLD} strokeWidth="2" />
      <text x="460" y="106" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight={600}>Priya</text>
      <text x="460" y="120" textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight={600}>non-consulting</text>

      <circle cx="280" cy="170" r="36" fill={`${VERMILION}10`} stroke={VERMILION} strokeWidth="2" />
      <text x="280" y="166" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight={600}>Third parties</text>
      <text x="280" y="180" textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight={600}>teaching / public</text>

      {/* Arrows */}
      {/* Client -> Practitioner (data supply) */}
      <line x1="135" y1="95" x2="245" y2="70" stroke={HAIRLINE} strokeWidth="2" markerEnd="url(#arrow)" />
      <text x="190" y="75" textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight={600}>supplies data</text>

      {/* Practitioner -> Subject (computes) */}
      <line x1="316" y1="60" x2="425" y2="95" stroke={HAIRLINE} strokeWidth="2" markerEnd="url(#arrow)" />
      <text x="370" y="70" textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight={600}>computes</text>

      {/* Subject -> Client (allowed) */}
      <path d="M 425 125 Q 330 160 135 125" fill="none" stroke={GREEN} strokeWidth="3" strokeLinecap="round" markerEnd="url(#arrowGreen)" />
      <text x="280" y="155" textAnchor="middle" fill={GREEN} fontSize="9" fontWeight={700}>findings allowed</text>

      {/* Practitioner -> Third parties (blocked) */}
      <line x1="280" y1="96" x2="280" y2="135" stroke={VERMILION} strokeWidth="3" strokeDasharray="4 3" />
      <text x="280" y="128" textAnchor="middle" fill={VERMILION} fontSize="9" fontWeight={700}>blocked without consent</text>

      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8" fill={HAIRLINE} />
        </marker>
        <marker id="arrowGreen" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8" fill={GREEN} />
        </marker>
      </defs>
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ ...cardStyle, borderColor: color }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.65rem" }}>
        <span style={{ color }}>{icon}</span>
        <p style={{ margin: 0, color, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{title}</p>
      </div>
      {children}
    </section>
  );
}

function toggleRowStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: "0.45rem",
    padding: "0.55rem",
    borderRadius: 6,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? `${color}10` : SURFACE,
    color: active ? color : INK_PRIMARY,
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
    textAlign: "left",
  };
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
