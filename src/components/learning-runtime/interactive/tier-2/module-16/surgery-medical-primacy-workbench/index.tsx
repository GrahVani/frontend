"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  HeartPulse,
  Info,
  Lock,
  MessageSquareQuote,
  RotateCcw,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
  Swords,
  XCircle,
} from "lucide-react";
import { workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

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
const VERMILION_TINT = "#FDEBE6";
const GREEN_TINT = "#EAF4EE";
const BLUE_TINT = "#EAF0F8";
const GOLD_TINT = "#FFF8E8";
const PURPLE_TINT = "#F1EEFA";

type ScenarioKey = "hip-window" | "bypass-fixed" | "cesarean-window" | "emergency-fixed";
type PanelKey = "exceptions" | "safety" | "adhikara";

interface Scenario {
  key: ScenarioKey;
  title: string;
  request: string;
  hasWindow: boolean;
  verdict: string;
  verdictColor: string;
  icon: typeof Stethoscope;
}

const SCENARIOS: Scenario[] = [
  {
    key: "hip-window",
    title: "Hip replacement",
    request: "The surgeon says any weekday morning in the next three weeks works medically. Can you help pick the best one?",
    hasWindow: true,
    verdict: "Genuine candidate window — muhūrta-selection applies within the medical range only.",
    verdictColor: GREEN,
    icon: Stethoscope,
  },
  {
    key: "bypass-fixed",
    title: "Bypass surgery",
    request: "The bypass surgery is scheduled for this Thursday at 7 AM. Can you tell me if it's a good muhūrta?",
    hasWindow: false,
    verdict: "No candidate window — fixed time. Offer honest commentary only; never suggest rescheduling.",
    verdictColor: BLUE,
    icon: HeartPulse,
  },
  {
    key: "cesarean-window",
    title: "Cesarean section",
    request: "The doctor says any morning next week is medically acceptable. Can we choose an auspicious day?",
    hasWindow: true,
    verdict: "Genuine candidate window — muhūrta-selection applies within the medical range only.",
    verdictColor: GREEN,
    icon: Stethoscope,
  },
  {
    key: "emergency-fixed",
    title: "Emergency appendectomy",
    request: "The surgeon says the appendectomy must happen tonight. There is no flexibility.",
    hasWindow: false,
    verdict: "Fixed time plus safety priority — medical judgment is absolute. Muhūrta commentary, if any, is secondary.",
    verdictColor: VERMILION,
    icon: ShieldAlert,
  },
];

const TIKSHNA_NAKSHATRAS = ["Ārdrā", "Āśleṣā", "Jyeṣṭhā", "Mūla"];

const LOCKED_VERBATIM = `I would not recommend asking the medical team to reschedule based on it -- the medical and surgical considerations should take precedence; muhūrta-input is one consideration among several and should not over-ride medical-team judgment.`;

function tintForColor(color: string): string {
  if (color === VERMILION) return VERMILION_TINT;
  if (color === GREEN) return GREEN_TINT;
  if (color === BLUE) return BLUE_TINT;
  if (color === GOLD || color === ACCENT) return GOLD_TINT;
  if (color === PURPLE) return PURPLE_TINT;
  return SURFACE;
}

export function SurgeryMedicalPrimacyWorkbench() {
  const [scenario, setScenario] = useState<ScenarioKey>("hip-window");
  const [showError, setShowError] = useState(false);
  const [openPanel, setOpenPanel] = useState<PanelKey>("exceptions");

  const active = SCENARIOS.find((s) => s.key === scenario) ?? SCENARIOS[0];

  function reset() {
    setScenario("hip-window");
    setShowError(false);
    setOpenPanel("exceptions");
  }

  return (
    <div data-interactive="surgery-medical-primacy-workbench" style={{ display: "flex", flexDirection: "column", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Surgery muhūrta — medical-primacy doctrine</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.25rem", fontWeight: 600 }}>
              Apply the one test that governs every surgery request
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              {`The medical team's own judgment about WHEN is prior to, and never overridden by, muhūrta-timing. First ask: is there a genuine candidate-window?`}
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
            background: BLUE_TINT,
            color: BLUE,
            fontSize: "0.72rem",
            fontWeight: 500,
          }}
        >
          <BookOpen size={10} />
          Source: T1-23 Lessons 23.1.1, 23.2.2, 23.2.3, 23.4.4, 23.6.2; T1-24 Lesson 24.2.4
        </div>
      </section>

      <div style={workbenchTwoColumnStyle}>
        <section style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <p style={eyebrowStyle}>Choose a request scenario</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
            {SCENARIOS.map((s) => {
              const Icon = s.icon;
              const selected = s.key === scenario;
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setScenario(s.key)}
                  style={{
                    textAlign: "left",
                    padding: "0.75rem",
                    borderRadius: 8,
                    border: `1px solid ${selected ? s.verdictColor : HAIRLINE}`,
                    background: selected ? tintForColor(s.verdictColor) : SURFACE,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Icon size={16} color={selected ? s.verdictColor : INK_MUTED} />
                    <span style={{ fontWeight: 600, fontSize: "0.9rem", color: selected ? s.verdictColor : INK_PRIMARY }}>{s.title}</span>
                    {selected ? <CheckCircle2 size={14} color={s.verdictColor} style={{ marginLeft: "auto" }} /> : null}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: INK_SECONDARY, marginTop: "0.35rem", lineHeight: 1.5 }}>{s.request}</div>
                </button>
              );
            })}
          </div>

          <div
            style={{
              marginTop: "auto",
              padding: "0.65rem",
              borderRadius: 6,
              border: `1px solid ${active.verdictColor}`,
              background: tintForColor(active.verdictColor),
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: active.verdictColor, marginBottom: "0.25rem" }}>
              {active.hasWindow ? <CheckCircle2 size={12} /> : <Info size={12} />}
              Verdict
            </div>
            <div style={{ fontSize: "0.9rem", color: INK_PRIMARY, lineHeight: 1.55 }}>{active.verdict}</div>
          </div>
        </section>

        <section style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <p style={eyebrowStyle}>The candidate-window test</p>
          <DecisionSvg hasWindow={active.hasWindow} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            <button type="button" onClick={() => setShowError(false)} style={buttonStyle(!showError, GREEN)}>
              <ShieldCheck size={14} />
              Discipline response
            </button>
            <button type="button" onClick={() => setShowError(true)} style={buttonStyle(showError, VERMILION)}>
              <AlertTriangle size={14} />
              Show the error
            </button>
          </div>

          {showError ? (
            <div
              style={{
                padding: "0.85rem",
                borderRadius: 8,
                border: `1px solid ${VERMILION}`,
                background: VERMILION_TINT,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: VERMILION, marginBottom: "0.35rem" }}>
                <XCircle size={12} />
                Violation of medical primacy
              </div>
              <p style={{ margin: 0, fontSize: "0.9rem", color: INK_PRIMARY, lineHeight: 1.65 }}>
                {active.hasWindow
                  ? `Even with a candidate window, the practitioner expands the range or pressures the medical team. The muhūrta must stay inside the range the medical team gave, never override it.`
                  : `"This timing isn't great astrologically — you might want to ask if they can move it a day." This suggests the medical team should reschedule based on astrology, which §4.3 explicitly forbids.`}
              </p>
            </div>
          ) : (
            <div
              style={{
                padding: "0.85rem",
                borderRadius: 8,
                border: `1px solid ${GREEN}`,
                background: GREEN_TINT,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: GREEN, marginBottom: "0.35rem" }}>
                <MessageSquareQuote size={12} />
                Discipline-compliant response
              </div>
              {active.hasWindow ? (
                <p style={{ margin: 0, fontSize: "0.9rem", color: INK_PRIMARY, lineHeight: 1.65 }}>
                  {`Yes, I can help — but only within the range your medical team has already approved. I will not second-guess their clinical constraints. Within that window I can apply the classical surgical-timing preferences: Tuesday/Mars and Tīkṣṇa-class nakṣatras become favourable here because their sharp-incisive character matches surgical action.`}
                </p>
              ) : (
                <>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: INK_PRIMARY, lineHeight: 1.65 }}>
                    {`I can cast the muhūrta-chart for the scheduled time and analyse it — whether it is more-favourable or less-favourable per classical muhūrta-criteria. This is commentary on a fixed time, not muhūrta-selection.`}
                  </p>
                  <blockquote
                    style={{
                      margin: "0.65rem 0 0",
                      padding: "0.55rem 0.75rem",
                      borderLeft: `3px solid ${GOLD}`,
                      background: GOLD_TINT,
                      borderRadius: "0 6px 6px 0",
                      fontSize: "0.88rem",
                      color: INK_SECONDARY,
                      lineHeight: 1.6,
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: GOLD, marginBottom: "0.25rem" }}>
                      <Lock size={12} />
                      Locked T1-23 language
                    </span>
                    {LOCKED_VERBATIM}
                  </blockquote>
                </>
              )}
            </div>
          )}
        </section>
      </div>

      <section style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.65rem" }}>
          <PanelButton label="Surgical exceptions" active={openPanel === "exceptions"} onClick={() => setOpenPanel("exceptions")} icon={<Swords size={14} />} />
          <PanelButton label="Safety-context priority" active={openPanel === "safety"} onClick={() => setOpenPanel("safety")} icon={<ShieldCheck size={14} />} />
          <PanelButton label="Adhikāra grounding" active={openPanel === "adhikara"} onClick={() => setOpenPanel("adhikara")} icon={<Scale size={14} />} />
        </div>

        {openPanel === "exceptions" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <p style={{ margin: 0, fontSize: "0.875rem", color: INK_SECONDARY, lineHeight: 1.55 }}>
              {`Tuesday (Maṅgala-vāra) and Tīkṣṇa-class nakṣatras are generally avoided for auspicious initiations — but they carry a named exception for surgical procedures because their sharp, incisive character matches the event.`}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.65rem" }}>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${VERMILION}`, background: VERMILION_TINT }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: VERMILION, marginBottom: "0.35rem" }}>Tuesday / Mars vāra</div>
                <div style={{ fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
                  {`Normally avoided for initiations. For surgery, Mars-character matches cutting and intervention — a named exception.`}
                </div>
              </div>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${PURPLE}`, background: PURPLE_TINT }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: PURPLE, marginBottom: "0.35rem" }}>Tīkṣṇa-class nakṣatras</div>
                <div style={{ fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
                  {TIKSHNA_NAKSHATRAS.join(", ")}. Sharp, incisive energy that aligns with surgical action.
                </div>
              </div>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${GREEN}`, background: GREEN_TINT }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: GREEN, marginBottom: "0.35rem" }}>Combined window</div>
                <div style={{ fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
                  {`Tuesday + Tīkṣṇa-nakṣatra is considered a strong surgical-timing window inside a medically-approved candidate range.`}
                </div>
              </div>
            </div>
          </div>
        )}

        {openPanel === "safety" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <p style={{ margin: 0, fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.65 }}>
              {`T1-23 Lesson 23.4.4 §4.7 develops safety-context priority for travel — flight schedules, driving safety, medical-emergency travel, natural hazards all override muhūrta-optimisation. The same principle extends to surgery.`}
            </p>
            <div
              style={{
                padding: "0.65rem 0.85rem",
                borderRadius: 6,
                border: `1px solid ${BLUE}`,
                background: BLUE_TINT,
                fontSize: "0.85rem",
                color: INK_SECONDARY,
                lineHeight: 1.55,
              }}
            >
              <Info size={14} color={BLUE} style={{ display: "inline", marginRight: 6, verticalAlign: "text-bottom" }} />
              {`Muhūrta-practitioner expertise is muhūrta-discipline, not safety-engineering or medical-judgment. When safety or medical urgency fixes the time, that decision is final.`}
            </div>
          </div>
        )}

        {openPanel === "adhikara" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <p style={{ margin: 0, fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.65 }}>
              {`The medical-primacy rule is not a courtesy — it is a competence boundary. T1-24 Lesson 24.2.4's adhikāra doctrine states that a practitioner's expertise has real edges. Prescribing or second-guessing surgical timing is outside the astrologer's adhikāra.`}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.65rem" }}>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${GREEN}`, background: GREEN_TINT }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: GREEN, marginBottom: "0.35rem" }}>Inside adhikāra</div>
                <div style={{ fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
                  {`Casting and commenting on the muhūrta-chart; selecting within a medically-approved range; naming classical surgical exceptions.`}
                </div>
              </div>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${VERMILION}`, background: VERMILION_TINT }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: VERMILION, marginBottom: "0.35rem" }}>Outside adhikāra</div>
                <div style={{ fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
                  {`Overruling the medical team's fixed time; suggesting reschedule for astrological reasons; claiming surgical safety expertise.`}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function DecisionSvg({ hasWindow }: { hasWindow: boolean }) {
  return (
    <svg viewBox="0 0 480 220" role="img" aria-label="Decision flowchart: medical team provides a range, then candidate window test branches to selection or commentary only" style={{ width: "100%", maxHeight: 220, display: "block" }}>
      <rect x={190} y={12} width={100} height={36} rx={6} fill={BLUE_TINT} stroke={BLUE} strokeWidth={1.5} />
      <text x={240} y={35} textAnchor="middle" fontSize={10} fill={BLUE} fontWeight={600}>
        Medical range
      </text>

      <line x1={240} y1={48} x2={240} y2={72} stroke={HAIRLINE} strokeWidth={1.5} />
      <polygon points={`240,72 236,64 244,64`} fill={INK_MUTED} />

      <polygon points="240,72 210,96 270,96" fill={SURFACE} stroke={GOLD} strokeWidth={1.5} />
      <text x={240} y={90} textAnchor="middle" fontSize={9} fill={GOLD} fontWeight={600}>
        Candidate window?
      </text>

      <line x1={210} y1={96} x2={120} y2={140} stroke={hasWindow ? GREEN : HAIRLINE} strokeWidth={hasWindow ? 2.5 : 1.5} />
      <line x1={270} y1={96} x2={360} y2={140} stroke={!hasWindow ? VERMILION : HAIRLINE} strokeWidth={!hasWindow ? 2.5 : 1.5} />

      <rect x={45} y={140} width={150} height={48} rx={6} fill={hasWindow ? GREEN_TINT : SURFACE} stroke={hasWindow ? GREEN : HAIRLINE} strokeWidth={hasWindow ? 2 : 1} />
      <text x={120} y={162} textAnchor="middle" fontSize={10} fill={hasWindow ? GREEN : INK_SECONDARY} fontWeight={600}>
        Muhūrta-selection
      </text>
      <text x={120} y={178} textAnchor="middle" fontSize={9} fill={INK_SECONDARY}>
        inside range only
      </text>

      <rect x={285} y={140} width={150} height={48} rx={6} fill={!hasWindow ? VERMILION_TINT : SURFACE} stroke={!hasWindow ? VERMILION : HAIRLINE} strokeWidth={!hasWindow ? 2 : 1} />
      <text x={360} y={162} textAnchor="middle" fontSize={10} fill={!hasWindow ? VERMILION : INK_SECONDARY} fontWeight={600}>
        Commentary only
      </text>
      <text x={360} y={178} textAnchor="middle" fontSize={9} fill={INK_SECONDARY}>
        never reschedule
      </text>

      <line x1={120} y1={188} x2={120} y2={208} stroke={hasWindow ? GREEN : HAIRLINE} strokeWidth={1.5} />
      <line x1={360} y1={188} x2={360} y2={208} stroke={!hasWindow ? VERMILION : HAIRLINE} strokeWidth={1.5} />
      <rect x={150} y={200} width={180} height={18} rx={4} fill={GOLD_TINT} stroke={ACCENT} strokeWidth={1} />
      <text x={240} y={212} textAnchor="middle" fontSize={9} fill={ACCENT} fontWeight={600}>
        Medical judgment is the hard boundary
      </text>
    </svg>
  );
}

function PanelButton({
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
        background: active ? GOLD_TINT : SURFACE,
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

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    padding: "0.45rem 0.75rem",
    borderRadius: 6,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? tintForColor(color) : SURFACE,
    color: active ? color : INK_SECONDARY,
    fontWeight: 600,
    fontSize: "0.82rem",
    cursor: "pointer",
  };
}
