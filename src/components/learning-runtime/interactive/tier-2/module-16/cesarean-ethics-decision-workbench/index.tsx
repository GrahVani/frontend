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
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
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
const VERMILION_TINT = "#FDEBE6";
const GREEN_TINT = "#EAF4EE";
const BLUE_TINT = "#EAF0F8";
const GOLD_TINT = "#FFF8E8";

type RequestKey = "A" | "B" | "C";
type PanelKey = "response" | "combined" | "pcpndt";

interface RequestType {
  key: RequestKey;
  title: string;
  label: string;
  description: string;
  color: string;
  icon: typeof Stethoscope;
  responseTitle: string;
  responseBody: string;
  mistake: string;
}

const REQUESTS: RequestType[] = [
  {
    key: "A",
    title: "Request A — Medically-determined window",
    label: "Legitimate",
    description: "A physician has independently decided a cesarean is needed and offers a range of medically-acceptable times.",
    color: GREEN,
    icon: Stethoscope,
    responseTitle: "Handled as surgical-window screening",
    responseBody: "This is structurally identical to Lesson 16.5.2's own general surgical-window service. Screen the physician-given window exactly as given, apply the Tuesday-Mars and Tīkṣṇa-nakṣatra exceptions, and recommend only within the range. No new doctrine is needed.",
    mistake: "Mistake: declining this request because all cesarean-related questions are assumed to be refused. The surface language can sound identical to Request B, but the structural difference is decisive.",
  },
  {
    key: "B",
    title: "Request B — Elective instrumentalization",
    label: "Declined",
    description: "A client asks to select or encourage a specific birth-time via cesarean to secure a predicted astrological outcome for the child.",
    color: GOLD,
    icon: HeartPulse,
    responseTitle: "Declined, not routed",
    responseBody: "I can hear how much you want the best for your child, and that's beautiful. But I won't choose a birth-time by scheduling a surgery — a delivery's timing has to be your doctor's decision, made for safety, and I don't think it's right to arrange a medical procedure around a chart. What I'd warmly offer instead is to look at your child's chart once they're born, and to support them as they grow.",
    mistake: "Mistake: treating this as a competence-boundary referral. The request itself is the problem: no one, of any discipline, should schedule medically-unnecessary surgery to chase an astrological outcome.",
  },
  {
    key: "C",
    title: "Request C — Sex-determination or sex-selection",
    label: "Categorically refused",
    description: "A request that touches, in any way, on determining, predicting, communicating, or selecting a child's sex.",
    color: VERMILION,
    icon: ShieldAlert,
    responseTitle: "Refuse the entire category, every time",
    responseBody: "If any part of what you're asking involves finding out or influencing your baby's sex, I can't help with that in any way. Under the PCPNDT Act, even hinting at it is a serious criminal offence. Beyond the law, I don't think astrology can reliably tell you this anyway, so it would be a doubled harm, not a considered answer.",
    mistake: "Mistake: trying to locate the exact boundary of what might or might not be covered. The discipline-compliant response refuses the entire category cleanly, without searching for a technically-permissible middle ground.",
  },
];

const COMBINED_SCRIPT = `I understand the hope behind this question, and I'm not going to make you feel bad for asking. But I have to be honest about two separate things. First: if any part of what you're asking involves finding out or influencing your baby's sex, I can't help with that in any way -- under the PCPNDT Act, even hinting at it is a serious criminal offence, and beyond the law, I don't think astrology can reliably tell you this anyway, so it would be a doubled harm, not a considered answer. Second, and separately: I won't help pick a birth-time by scheduling a cesarean for an astrological outcome, even a wonderful one like a great career. That's a medical decision, and it has to be made by your doctor on safety grounds alone -- not around a chart. What I can genuinely offer: if your doctor has independently decided a cesarean is medically needed and has given you a window of safe times, I'm glad to look at that window with you. And once your baby is born, I'd love to look at their actual chart and talk about how to support them as they grow.`;

function tintForColor(color: string): string {
  if (color === VERMILION) return VERMILION_TINT;
  if (color === GREEN) return GREEN_TINT;
  if (color === BLUE) return BLUE_TINT;
  if (color === GOLD || color === ACCENT) return GOLD_TINT;
  return SURFACE;
}

export function CesareanEthicsDecisionWorkbench() {
  const [request, setRequest] = useState<RequestKey>("A");
  const [showMistake, setShowMistake] = useState(false);
  const [panel, setPanel] = useState<PanelKey>("response");

  const active = REQUESTS.find((r) => r.key === request) ?? REQUESTS[0];

  function reset() {
    setRequest("A");
    setShowMistake(false);
    setPanel("response");
  }

  return (
    <div data-interactive="cesarean-ethics-decision-workbench" style={{ display: "flex", flexDirection: "column", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Cesarean-section time selection — explicit refusal</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.25rem", fontWeight: 600 }}>
              Distinguish three genuinely different requests
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              {`Conflating a legitimate window-screening request with elective instrumentalization or sex-selection is the single biggest risk this lesson exists to prevent.`}
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
          Source: T2-03 Lesson 3.7.4; T2-06 Lesson 6.5.4; T1-24 Lesson 24.2.4
        </div>
      </section>

      <section
        style={{
          ...cardStyle,
          borderColor: VERMILION,
          background: VERMILION_TINT,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Lock size={18} color={VERMILION} />
          <p style={{ ...eyebrowStyle, margin: 0 }}>Non-negotiable lines</p>
        </div>
        <h3 style={{ margin: "0.35rem 0 0", color: VERMILION, fontSize: "1.05rem", fontWeight: 600 }}>
          Two requests are refused; one is legitimate
        </h3>
        <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
          {`Request A is handled exactly as Lesson 16.5.2. Request B is declined because it instrumentalises a medical decision. Request C is categorically refused under the PCPNDT Act and extends beyond any one jurisdiction.`}
        </p>
      </section>

      <div style={workbenchTwoColumnStyle}>
        <section style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <p style={eyebrowStyle}>Select a request type</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
            {REQUESTS.map((r) => {
              const Icon = r.icon;
              const selected = r.key === request;
              return (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => {
                    setRequest(r.key);
                    setShowMistake(false);
                  }}
                  style={{
                    textAlign: "left",
                    padding: "0.75rem",
                    borderRadius: 8,
                    border: `1px solid ${selected ? r.color : HAIRLINE}`,
                    background: selected ? tintForColor(r.color) : SURFACE,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Icon size={16} color={selected ? r.color : INK_MUTED} />
                    <span style={{ fontWeight: 600, fontSize: "0.85rem", color: selected ? r.color : INK_PRIMARY }}>{r.title}</span>
                  </div>
                  <div style={{ fontSize: "0.78rem", color: INK_SECONDARY, marginTop: "0.3rem", lineHeight: 1.5 }}>{r.description}</div>
                  <div style={{ marginTop: "0.35rem" }}>
                    <MiniChip label={r.label} color={r.color} />
                  </div>
                </button>
              );
            })}
          </div>

          <div
            style={{
              marginTop: "auto",
              padding: "0.65rem",
              borderRadius: 6,
              border: `1px solid ${active.color}`,
              background: tintForColor(active.color),
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: active.color, marginBottom: "0.25rem" }}>
              {active.key === "A" ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
              {active.label}
            </div>
            <div style={{ fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.55 }}>{active.responseTitle}</div>
          </div>
        </section>

        <section style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <DecisionSvg active={request} />

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            <PanelButton label="Correct response" active={panel === "response"} onClick={() => setPanel("response")} icon={<ShieldCheck size={14} />} />
            <PanelButton label="Combined script" active={panel === "combined"} onClick={() => setPanel("combined")} icon={<MessageSquareQuote size={14} />} />
            <PanelButton label="PCPNDT facts" active={panel === "pcpndt"} onClick={() => setPanel("pcpndt")} icon={<Info size={14} />} />
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            <button type="button" onClick={() => setShowMistake(false)} style={buttonStyle(!showMistake, GREEN)}>
              <ShieldCheck size={14} />
              Correct handling
            </button>
            <button type="button" onClick={() => setShowMistake(true)} style={buttonStyle(showMistake, VERMILION)}>
              <AlertTriangle size={14} />
              Common mistake
            </button>
          </div>

          {panel === "response" && (
            <div
              style={{
                padding: "0.85rem",
                borderRadius: 8,
                border: `1px solid ${showMistake ? VERMILION : active.color}`,
                background: showMistake ? VERMILION_TINT : tintForColor(active.color),
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: showMistake ? VERMILION : active.color, marginBottom: "0.35rem" }}>
                {showMistake ? <AlertTriangle size={12} /> : <MessageSquareQuote size={12} />}
                {showMistake ? "Common mistake" : active.responseTitle}
              </div>
              <p style={{ margin: 0, fontSize: "0.9rem", color: INK_PRIMARY, lineHeight: 1.65 }}>
                {showMistake ? active.mistake : active.responseBody}
              </p>
            </div>
          )}

          {panel === "combined" && (
            <div
              style={{
                padding: "0.85rem",
                borderRadius: 8,
                border: `1px solid ${BLUE}`,
                background: BLUE_TINT,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: BLUE, marginBottom: "0.35rem" }}>
                <MessageSquareQuote size={12} />
                Combined refusal script
              </div>
              <p style={{ margin: 0, fontSize: "0.9rem", color: INK_PRIMARY, lineHeight: 1.65 }}>{COMBINED_SCRIPT}</p>
            </div>
          )}

          {panel === "pcpndt" && (
            <div
              style={{
                padding: "0.85rem",
                borderRadius: 8,
                border: `1px solid ${VERMILION}`,
                background: VERMILION_TINT,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: VERMILION, marginBottom: "0.35rem" }}>
                <ShieldAlert size={12} />
                PCPNDT Act — categorical refusal
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.65 }}>
                <p style={{ margin: 0 }}>
                  <strong style={{ fontWeight: 600, color: VERMILION }}>Act:</strong> Pre-Conception and Pre-Natal Diagnostic Techniques (Prohibition of Sex Selection) Act, 1994, as amended 2003.
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ fontWeight: 600, color: VERMILION }}>Section 6:</strong> criminal offence to conduct any prenatal diagnostic technique for sex-determination.
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ fontWeight: 600, color: VERMILION }}>Section 5:</strong> prohibits any person from communicating a foetus&apos;s sex to anyone, by any means whatsoever — words, signs, gestures, or any other method.
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ fontWeight: 600, color: VERMILION }}>Penalties:</strong> up to five years&apos; imprisonment and a ₹1 lakh fine. Offences are cognizable, non-bailable, and non-compoundable.
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ fontWeight: 600, color: VERMILION }}>Practitioner discipline:</strong> refuse the entire category, every time, without exception. Do not search for the exact legal boundary.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function DecisionSvg({ active }: { active: RequestKey }) {
  return (
    <svg viewBox="0 0 480 180" role="img" aria-label="Decision classifier for cesarean-timing requests: A is legitimate window-screening, B is declined elective instrumentalization, C is categorically refused sex-determination" style={{ width: "100%", maxHeight: 180, display: "block" }}>
      <rect x={170} y={8} width={140} height={34} rx={6} fill={GOLD_TINT} stroke={ACCENT} strokeWidth={1.5} />
      <text x={240} y={30} textAnchor="middle" fontSize={10} fill={ACCENT} fontWeight={600}>
        Cesarean-timing request
      </text>

      <line x1={240} y1={42} x2={240} y2={62} stroke={HAIRLINE} strokeWidth={1.5} />
      <polygon points="240,62 236,54 244,54" fill={INK_MUTED} />

      <polygon points="240,62 200,86 280,86" fill={SURFACE} stroke={GOLD} strokeWidth={1.5} />
      <text x={240} y={80} textAnchor="middle" fontSize={9} fill={GOLD} fontWeight={600}>
        What is being asked?
      </text>

      <line x1={200} y1={86} x2={90} y2={124} stroke={active === "A" ? GREEN : HAIRLINE} strokeWidth={active === "A" ? 2.5 : 1.5} />
      <line x1={240} y1={86} x2={240} y2={124} stroke={active === "B" ? GOLD : HAIRLINE} strokeWidth={active === "B" ? 2.5 : 1.5} />
      <line x1={280} y1={86} x2={390} y2={124} stroke={active === "C" ? VERMILION : HAIRLINE} strokeWidth={active === "C" ? 2.5 : 1.5} />

      <rect x={20} y={124} width={140} height={44} rx={6} fill={active === "A" ? GREEN_TINT : SURFACE} stroke={active === "A" ? GREEN : HAIRLINE} strokeWidth={active === "A" ? 2 : 1} />
      <text x={90} y={146} textAnchor="middle" fontSize={10} fill={active === "A" ? GREEN : INK_SECONDARY} fontWeight={600}>
        A — Physician window
      </text>
      <text x={90} y={160} textAnchor="middle" fontSize={9} fill={INK_SECONDARY}>
        Legitimate
      </text>

      <rect x={170} y={124} width={140} height={44} rx={6} fill={active === "B" ? GOLD_TINT : SURFACE} stroke={active === "B" ? GOLD : HAIRLINE} strokeWidth={active === "B" ? 2 : 1} />
      <text x={240} y={146} textAnchor="middle" fontSize={10} fill={active === "B" ? GOLD : INK_SECONDARY} fontWeight={600}>
        B — Elective instrumentalization
      </text>
      <text x={240} y={160} textAnchor="middle" fontSize={9} fill={INK_SECONDARY}>
        Declined
      </text>

      <rect x={320} y={124} width={140} height={44} rx={6} fill={active === "C" ? VERMILION_TINT : SURFACE} stroke={active === "C" ? VERMILION : HAIRLINE} strokeWidth={active === "C" ? 2 : 1} />
      <text x={390} y={146} textAnchor="middle" fontSize={10} fill={active === "C" ? VERMILION : INK_SECONDARY} fontWeight={600}>
        C — Sex-determination
      </text>
      <text x={390} y={160} textAnchor="middle" fontSize={9} fill={INK_SECONDARY}>
        Categorically refused
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

function MiniChip({ label, color }: { label: string; color: string }) {
  return (
    <span
      style={{
        fontSize: "0.65rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.03em",
        color,
        border: `1px solid ${color}`,
        borderRadius: 999,
        padding: "0.1rem 0.4rem",
      }}
    >
      {label}
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
