"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { AlertTriangle, Baby, CheckCircle2, Heart, MessageCircle, RefreshCcw, Scale, ShieldCheck, Stethoscope, TriangleAlert } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";

interface CaseData {
  key: string;
  title: string;
  afflictions: string[];
  relief: string[];
  missingRelief: string[];
  d7: string;
  dasha: string;
}

const CASES: CaseData[] = [
  {
    key: "jupiter-relief",
    title: "Saturn + Rāhu in the 5th, Jupiter strong in kendra",
    afflictions: ["Malefics tenant the 5th (Saturn, Rāhu)", "5th lord sits in the 8th"],
    relief: ["Jupiter strong in a kendra and aspects the 5th", "5th lord is in a friendly sign"],
    missingRelief: ["D7 and daśā still pending"],
    d7: "pending",
    dasha: "pending",
  },
  {
    key: "heavy-affliction",
    title: "Mars in the 5th, lord debilitated, no Jupiter aspect",
    afflictions: ["Mars tenants the 5th", "5th lord is debilitated", "No Jupiter aspect"],
    relief: ["Venus aspects the 5th mildly", "5th lord receives Mercury's association"],
    missingRelief: ["No strong Jupiter relief", "D7 must be checked"],
    d7: "pending",
    dasha: "pending",
  },
  {
    key: "nodal-delay",
    title: "Ketu in the 5th, Moon aspecting, lord in own sign",
    afflictions: ["Ketu tenants the 5th"],
    relief: ["Moon aspects the 5th", "5th lord is in own sign", "Jupiter aspects the lord"],
    missingRelief: ["Timing still depends on daśā"],
    d7: "clean",
    dasha: "pending",
  },
  {
    key: "clean-base",
    title: "5th house clear, Jupiter aspects, lord strong",
    afflictions: ["No major affliction"],
    relief: ["Jupiter aspects the 5th", "5th lord is exalted", "Benefic Moon tenants the 5th"],
    missingRelief: ["Timing still depends on daśā"],
    d7: "clean",
    dasha: "supportive",
  },
];

const STEPS = [
  {
    key: "identify",
    label: "Identify the affliction accurately",
    icon: <AlertTriangle size={18} />,
    color: VERMILION,
    explain: "Name the real stress patterns without inflating them.",
  },
  {
    key: "relief",
    label: "Weigh every relief factor",
    icon: <Scale size={18} />,
    color: GREEN,
    explain: "Jupiter, benefic aspect, lord dignity, D7, and daśā all matter.",
  },
  {
    key: "cap",
    label: "Cap the verdict at challenge-or-delay",
    icon: <ShieldCheck size={18} />,
    color: BLUE,
    explain: "Never foreclose biological possibility.",
  },
  {
    key: "frame",
    label: "Frame without fear",
    icon: <MessageCircle size={18} />,
    color: GOLD,
    explain: "Use tendency language; refuse curse/doṣa alarm.",
  },
  {
    key: "route",
    label: "Route the clinical concern",
    icon: <Stethoscope size={18} />,
    color: PURPLE,
    explain: "Fertility specialists handle conception; the chart is one input.",
  },
];

export function SantanaObstructionHonestyWorkbench() {
  const [selectedCase, setSelectedCase] = useState("jupiter-relief");
  const [stepsDone, setStepsDone] = useState<Record<string, boolean>>({
    identify: true,
    relief: true,
    cap: true,
    frame: true,
    route: true,
  });
  const [refuseFearSale, setRefuseFearSale] = useState(true);
  const [pauseDistress, setPauseDistress] = useState(true);

  const currentCase = CASES.find((c) => c.key === selectedCase) ?? CASES[0];
  const completedCount = STEPS.filter((s) => stepsDone[s.key]).length + (refuseFearSale ? 1 : 0) + (pauseDistress ? 1 : 0);
  const maxCount = STEPS.length + 2;
  const honestyPercent = (completedCount / maxCount) * 100;

  const verdict = useMemo(() => {
    if (honestyPercent === 100) return { label: "Honest handling", color: GREEN };
    if (honestyPercent >= 60) return { label: "Mostly honest — close the gaps", color: GOLD };
    return { label: "Risk of fearmongering or over-claim", color: VERMILION };
  }, [honestyPercent]);

  const synthesis = useMemo(() => {
    const caseText = `Case: ${currentCase.title}. Afflictions: ${currentCase.afflictions.join("; ")}. Relief: ${currentCase.relief.join("; ")}.`;
    const stepNotes = STEPS.map((s) => {
      if (stepsDone[s.key]) return `${s.label}: done.`;
      return `${s.label}: missing — ${s.explain}`;
    }).join(" ");
    const fear = refuseFearSale
      ? "Refuses fear-sold remedies."
      : "Warning: selling or implying a remedy as a cure for childlessness is fearmongering.";
    const pause = pauseDistress
      ? "Pauses for visible distress."
      : "Warning: continuing through grief or despair overrides client wellbeing.";
    const frame = `Verdict: ${verdict.label}. ${caseText} ${stepNotes} ${fear} ${pause}`;
    return frame;
  }, [currentCase, pauseDistress, refuseFearSale, stepsDone, verdict.label]);

  function reset() {
    setSelectedCase("jupiter-relief");
    setStepsDone({ identify: true, relief: true, cap: true, frame: true, route: true });
    setRefuseFearSale(true);
    setPauseDistress(true);
  }

  return (
    <div data-interactive="santana-obstruction-honesty-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Obstruction yoga — honest handling</p>
            <h2 style={{ margin: "0.2rem 0 0", color: VERMILION, fontSize: "1.28rem", fontWeight: 600 }}>Identify, weigh, cap, frame, route</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Practice the five-step discipline for 5th-house affliction patterns. Real doctrine is read with relief, agency, and medical humility — never fear.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Case diagram</p>
              <h3 style={{ margin: "0.15rem 0 0", color: verdict.color, fontSize: "1.12rem", fontWeight: 600 }}>{verdict.label}</h3>
            </div>
            <strong style={{ color: verdict.color, fontWeight: 600 }}>{Math.round(honestyPercent)}% honest</strong>
          </div>
          <CaseDiagram currentCase={currentCase} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.65rem" }}>
            <MiniFact icon={<TriangleAlert size={16} />} title="Afflictions" body={`${currentCase.afflictions.length}`} color={VERMILION} />
            <MiniFact icon={<Scale size={16} />} title="Relief factors" body={`${currentCase.relief.length}`} color={GREEN} />
            <MiniFact icon={<Baby size={16} />} title="D7" body={currentCase.d7} color={currentCase.d7 === "clean" ? GREEN : GOLD} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Select a case" icon={<ShieldCheck size={18} />} color={BLUE}>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              {CASES.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  aria-pressed={selectedCase === c.key}
                  onClick={() => setSelectedCase(c.key)}
                  style={caseButtonStyle(selectedCase === c.key, BLUE)}
                >
                  {c.title}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Five-step discipline" icon={<CheckCircle2 size={18} />} color={GREEN}>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              {STEPS.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  aria-pressed={stepsDone[s.key]}
                  onClick={() => setStepsDone((prev) => ({ ...prev, [s.key]: !prev[s.key] }))}
                  style={stepToggleStyle(stepsDone[s.key], s.color)}
                >
                  <span style={{ color: s.color }}>{s.icon}</span>
                  <span>
                    <span style={{ display: "block", fontWeight: 600 }}>{s.label}</span>
                    <span style={{ color: INK_SECONDARY, fontSize: "0.86rem" }}>{s.explain}</span>
                  </span>
                </button>
              ))}
            </div>
          </Panel>
        </section>
      </div>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Fear thermometer</p>
          <FearThermometer percent={honestyPercent} />
          <p style={{ margin: "0.75rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
            {honestyPercent === 100
              ? "All discipline steps are in place. The client hears a tendency, sees relief, and knows the clinical path."
              : honestyPercent >= 60
                ? "The handling is mostly honest, but missing steps leave room for fear or over-claim."
                : "Several discipline steps are missing. This framing risks fearmongering, foreclosure, or absorbing the medical domain."}
          </p>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Extra safeguards</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <Toggle active={refuseFearSale} color={refuseFearSale ? GREEN : VERMILION} icon={<TriangleAlert size={18} />} title="Refuse fear-sold remedies" body={refuseFearSale ? "No putra-doṣa remedy sold on alarm." : "Selling remedies as childlessness cures is exploitation."} onClick={() => setRefuseFearSale((value) => !value)} />
            <Toggle active={pauseDistress} color={pauseDistress ? GREEN : PURPLE} icon={<Heart size={18} />} title="Pause for visible distress" body={pauseDistress ? "Care before technique." : "Continuing through grief overrides wellbeing."} onClick={() => setPauseDistress((value) => !value)} />
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: verdict.color + "66", background: verdict.color + "10" }}>
        <p style={eyebrowStyle}>Synthesis</p>
        <h3 style={{ margin: "0.15rem 0 0", color: verdict.color, fontSize: "1.12rem", fontWeight: 600 }}>{verdict.label}</h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{synthesis}</p>
      </section>
    </div>
  );
}

function CaseDiagram({ currentCase }: { currentCase: CaseData }) {
  const hasJupiter = currentCase.relief.some((r) => r.toLowerCase().includes("jupiter"));
  const hasMalefic = currentCase.afflictions.some((a) => /saturn|rahu|mars|ketu|malefics/i.test(a));
  const hasNodes = currentCase.afflictions.some((a) => /rahu|ketu/i.test(a));
  const isClean = currentCase.key === "clean-base";

  return (
    <svg viewBox="0 0 340 260" role="img" aria-label={`Diagram of the case: ${currentCase.title}`} style={{ width: "100%", maxHeight: 320, margin: "0.4rem auto 0.85rem", display: "block" }}>
      <rect x="10" y="10" width="320" height="240" rx="10" fill={`${VERMILION}${"05"}`} stroke={HAIRLINE} strokeWidth="1.5" />

      {/* 5th house field */}
      <rect x="130" y="90" width="80" height="80" rx="8" fill={isClean ? `${GREEN}${"18"}` : `${VERMILION}${"14"}`} stroke={isClean ? GREEN : VERMILION} strokeWidth="2.5" />
      <text x="170" y="130" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="600">
        5th House
      </text>
      <text x="170" y="148" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="600">
        saṁtāna
      </text>

      {/* Jupiter relief ray */}
      {hasJupiter ? (
        <>
          <line x1="170" y1="40" x2="170" y2="90" stroke={GOLD} strokeWidth="4" strokeLinecap="round" />
          <circle cx="170" cy="35" r="16" fill={GOLD} />
          <text x="170" y="40" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="600">
            ♃
          </text>
          <text x="170" y="68" textAnchor="middle" fill={GOLD} fontSize="10" fontWeight="600">
            relief
          </text>
        </>
      ) : null}

      {/* Malefic planets in 5th */}
      {hasMalefic && !isClean ? (
        <g transform="translate(225 115)">
          <circle cx="0" cy="0" r="16" fill={VERMILION} />
          <text x="0" y="5" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="600">
            ⚠
          </text>
          <text x="0" y="28" textAnchor="middle" fill={VERMILION} fontSize="9" fontWeight="600">
            stress
          </text>
        </g>
      ) : null}

      {hasNodes ? (
        <g transform="translate(115 115)">
          <circle cx="0" cy="0" r="14" fill={PURPLE} />
          <text x="0" y="5" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="600">
            ☊
          </text>
        </g>
      ) : null}

      {/* 5th lord */}
      <g transform="translate(170 210)">
        <circle cx="0" cy="0" r="18" fill={SURFACE} stroke={BLUE} strokeWidth="2" />
        <text x="0" y="5" textAnchor="middle" fill={BLUE} fontSize="11" fontWeight="600">
          5L
        </text>
      </g>
      <line x1="170" y1="170" x2="170" y2="192" stroke={HAIRLINE} strokeWidth="1.5" strokeDasharray="3 3" />

      {/* Legend */}
      <g transform="translate(28 235)">
        <circle cx="0" cy="0" r="6" fill={GOLD} />
        <text x="12" y="4" fill={INK_SECONDARY} fontSize="9" fontWeight="600">
          Jupiter relief
        </text>
        <circle cx="88" cy="0" r="6" fill={VERMILION} />
        <text x="100" y="4" fill={INK_SECONDARY} fontSize="9" fontWeight="600">
          Malefic stress
        </text>
        <circle cx="184" cy="0" r="6" fill={PURPLE} />
        <text x="196" y="4" fill={INK_SECONDARY} fontSize="9" fontWeight="600">
          Nodal axis
        </text>
      </g>
    </svg>
  );
}

function FearThermometer({ percent }: { percent: number }) {
  const level = Math.min(100, Math.max(0, 100 - percent));
  return (
    <div style={{ marginTop: "0.75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: INK_MUTED, marginBottom: "0.35rem" }}>
        <span>Calm, honest framing</span>
        <span>Fearmongering risk</span>
      </div>
      <div style={{ height: 18, borderRadius: 10, background: `${GREEN}${"22"}`, overflow: "hidden", border: `1px solid ${HAIRLINE}`, position: "relative" }}>
        <div style={{ position: "absolute", right: 0, top: 0, height: "100%", width: `${level}%`, background: level > 50 ? VERMILION : GOLD, transition: "width 240ms ease" }} />
        <div style={{ position: "absolute", left: `${100 - level}%`, top: -4, width: 2, height: 26, background: INK_PRIMARY }} />
      </div>
    </div>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}${"44"}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", color, fontWeight: 600 }}>
        {icon}
        {title}
      </div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}${"44"}`, borderRadius: 8, background: `${color}${"10"}`, padding: "0.7rem" }}>
      <div style={{ display: "flex", gap: "0.45rem", alignItems: "center", color, fontWeight: 600 }}>
        {icon}
        {title}
      </div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.86rem", lineHeight: 1.35 }}>{body}</p>
    </div>
  );
}

function Toggle({ active, color, icon, title, body, onClick }: { active: boolean; color: string; icon: ReactNode; title: string; body: string; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} style={toggleStyle(active, color)}>
      <span style={{ color }}>{icon}</span>
      <span>
        <span style={{ display: "block", fontWeight: 600 }}>{title}</span>
        <span>{body}</span>
      </span>
    </button>
  );
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: "var(--gl-shadow-soft)",
};

const responsiveTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
  gap: "1rem",
  alignItems: "start",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontSize: "0.75rem",
  fontWeight: 600,
};

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}${"16"}` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.58rem 0.75rem",
    minHeight: 38,
    display: "inline-flex",
    gap: "0.45rem",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function caseButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}${"12"}` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.65rem 0.75rem",
    textAlign: "left",
    fontWeight: 600,
    cursor: "pointer",
    lineHeight: 1.4,
  };
}

function stepToggleStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}${"12"}` : "transparent",
    color: INK_PRIMARY,
    padding: "0.75rem",
    display: "flex",
    gap: "0.7rem",
    alignItems: "start",
    textAlign: "left",
    cursor: "pointer",
    fontWeight: 400,
  };
}

function toggleStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}${"12"}` : "transparent",
    color: INK_PRIMARY,
    padding: "0.75rem",
    display: "flex",
    gap: "0.7rem",
    alignItems: "start",
    textAlign: "left",
    cursor: "pointer",
    fontWeight: 400,
  };
}
