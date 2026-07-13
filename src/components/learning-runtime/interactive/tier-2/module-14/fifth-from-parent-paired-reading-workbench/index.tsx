"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  Baby,
  BadgeCheck,
  ChevronRight,
  Eye,
  GraduationCap,
  RefreshCw,
  RotateCcw,
  User,
} from "lucide-react";
import { workbenchDiagramLayoutStyle, workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ParentKey = "ansh" | "bhavna";
type StepKey = 0 | 1 | 2 | 3 | 4;

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const VERMILION = "var(--gl-vermilion-accent)";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";

const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const SIGN_SHORT = ["Ar", "Ta", "Ge", "Ca", "Le", "Vi", "Li", "Sc", "Sg", "Cp", "Aq", "Pi"];
const SIGN_COLORS = [
  "#A23A1E", "#B88421", "#2F7D55", "#356CAB", "#A23A1E", "#B88421",
  "#2F7D55", "#356CAB", "#A23A1E", "#B88421", "#2F7D55", "#356CAB",
];

const PARENTS = {
  ansh: {
    label: "MC1 (Ansh)",
    lagnaSign: 6, // Libra
    lagnaSignName: "Libra",
    fifthSign: 10, // Aquarius
    fifthSignName: "Aquarius",
    occupant: "Saturn",
    occupantShort: "Sa",
    occupantColor: "#6B5AA8",
    dignity: "own sign",
    childContact: "Chandra's own Lagna sign",
    childContactSign: 10, // Aquarius
  },
  bhavna: {
    label: "MC2 (Bhavna)",
    lagnaSign: 3, // Cancer
    lagnaSignName: "Cancer",
    fifthSign: 7, // Scorpio
    fifthSignName: "Scorpio",
    occupant: "Mars",
    occupantShort: "Ma",
    occupantColor: "#A23A1E",
    dignity: "own sign",
    childContact: "Chandra's own Mercury sign",
    childContactSign: 7, // Scorpio
  },
};

const CHILD = {
  label: "MC3 (Chandra)",
  lagnaSign: 10, // Aquarius
  planets: [
    { name: "Sun", short: "Su", sign: 11, color: "#D97706" }, // Pisces (debilitated, per lesson reference)
    { name: "Moon", short: "Mo", sign: 10, color: "#356CAB" }, // Aquarius
    { name: "Mars", short: "Ma", sign: 1, color: "#A23A1E" }, // Taurus
    { name: "Mercury", short: "Me", sign: 7, color: "#2F7D55" }, // Scorpio
    { name: "Jupiter", short: "Ju", sign: 4, color: "#B88421" }, // Leo
    { name: "Venus", short: "Ve", sign: 9, color: "#9C27B0" }, // Capricorn
    { name: "Saturn", short: "Sa", sign: 10, color: "#6B5AA8" }, // Aquarius
  ],
};

export function FifthFromParentPairedReadingWorkbench() {
  const [parent, setParent] = useState<ParentKey>("ansh");
  const [step, setStep] = useState<StepKey>(0);
  const [showMisattribution, setShowMisattribution] = useState(false);
  const [discipline, setDiscipline] = useState({ parent: true, child: true, contact: true });

  const p = PARENTS[parent];

  const statement = useMemo(() => {
    const parentPart = `${p.label}'s own 5th house is ${p.fifthSignName}, occupied by ${p.occupant} in ${p.dignity} — a dignified engagement with the domain of children.`;
    const contactPart = `That 5th-house sign, ${p.fifthSignName}, appears as ${p.childContact} — a real, checkable point of contact.`;
    const limitPart = `This does not establish Chandra's own overall nature; it establishes only a resonance between the parent's children-domain and a specific point in the child's chart.`;
    return `${parentPart} ${contactPart} ${limitPart}`;
  }, [p]);

  const misattributedStatement = `${p.label}'s own 5th house is ${p.fifthSignName}, occupied by ${p.occupant} in ${p.dignity}, so Chandra must be a fortunate child with a bright destiny.`;

  const allDisciplines = discipline.parent && discipline.child && discipline.contact;

  const reset = () => {
    setParent("ansh");
    setStep(0);
    setShowMisattribution(false);
    setDiscipline({ parent: true, child: true, contact: true });
  };

  return (
    <div data-interactive="fifth-from-parent-paired-reading-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>5th-from-parent paired reading</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.35rem", fontWeight: 500 }}>
              Two charts, two different claims
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Compute the 5th house from the parent&apos;s Lagna, read it as a claim about the parent, then check where that sign appears in the child&apos;s chart.
            </p>
          </div>
          <button type="button" onClick={reset} style={softButtonStyle}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Select parent</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.75rem" }}>
          {(Object.keys(PARENTS) as ParentKey[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={parent === key}
              onClick={() => { setParent(key); setStep(0); }}
              style={smallChipStyle(parent === key, key === "ansh" ? BLUE : PURPLE)}
            >
              {PARENTS[key].label}
            </button>
          ))}
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Step from Lagna to 5th house</p>
              <h3 style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "1.15rem", fontWeight: 500 }}>
                {p.label}: {p.lagnaSignName} → {p.fifthSignName}
              </h3>
            </div>
            <button type="button" onClick={() => setStep((s) => Math.min(4, s + 1) as StepKey)} disabled={step === 4} style={softButtonStyle}>
              <ChevronRight size={16} />
              {step === 0 ? "Start stepping" : "Next house"}
            </button>
          </div>
          <ZodiacStepWheel lagna={p.lagnaSign} fifth={p.fifthSign} step={step} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.55rem", marginTop: "0.75rem" }}>
            <MiniFact icon={<User size={16} />} title="Lagna" body={p.lagnaSignName} color={BLUE} />
            <MiniFact icon={<GraduationCap size={16} />} title="5th house" body={p.fifthSignName} color={GREEN} />
            <MiniFact icon={<Eye size={16} />} title="Occupant" body={`${p.occupant} (${p.dignity})`} color={p.occupantColor} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Parent-side reading</p>
            <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
              {p.label}&apos;s own 5th house is {p.fifthSignName}, occupied by {p.occupant} in {p.dignity}. This is a statement about {p.label}&apos;s own relationship to the domain of children.
            </p>
            <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.85rem" }}>
              <button type="button" aria-pressed={!showMisattribution} onClick={() => setShowMisattribution(false)} style={togglePanelStyle(!showMisattribution, GREEN)}>
                <BadgeCheck size={18} aria-hidden="true" />
                <span>
                  <strong style={{ fontWeight: 600 }}>Correct reading</strong>
                  <span>Claim is about the parent&apos;s own relationship to children.</span>
                </span>
              </button>
              <button type="button" aria-pressed={showMisattribution} onClick={() => setShowMisattribution(true)} style={togglePanelStyle(showMisattribution, VERMILION)}>
                <AlertTriangle size={18} aria-hidden="true" />
                <span>
                  <strong style={{ fontWeight: 600 }}>Misattribution</strong>
                  <span>Claim is wrongly shifted onto the child&apos;s own character.</span>
                </span>
              </button>
            </div>
            {showMisattribution ? (
              <div style={{ ...noticeStyle(VERMILION), marginTop: "0.85rem" }}>
                <AlertTriangle size={18} />
                <span>This overreach reads the parent&apos;s chart as if it were the child&apos;s verdict. The child must be read on their own chart&apos;s terms.</span>
              </div>
            ) : null}
          </section>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Cross-reference against Chandra&apos;s natal chart</p>
        <p style={{ margin: "0.35rem 0 0.75rem", color: INK_SECONDARY }}>
          {p.label}&apos;s 5th-house sign <strong style={{ color: SIGN_COLORS[p.fifthSign], fontWeight: 600 }}>{p.fifthSignName}</strong> appears as {p.childContact}.
        </p>
        <ChildChartHighlight parentFifthSign={p.fifthSign} contactSign={p.childContactSign} />
      </section>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Paired-reading discipline</p>
          <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.75rem" }}>
            <button type="button" aria-pressed={discipline.parent} onClick={() => setDiscipline((d) => ({ ...d, parent: !d.parent }))} style={togglePanelStyle(discipline.parent, GREEN)}>
              <User size={18} aria-hidden="true" />
              <span>
                <strong style={{ fontWeight: 600 }}>Report the parent&apos;s own finding</strong>
                <span>The 5th house belongs to the parent&apos;s chart.</span>
              </span>
            </button>
            <button type="button" aria-pressed={discipline.child} onClick={() => setDiscipline((d) => ({ ...d, child: !d.child }))} style={togglePanelStyle(discipline.child, BLUE)}>
              <Baby size={18} aria-hidden="true" />
              <span>
                <strong style={{ fontWeight: 600 }}>Read the child independently</strong>
                <span>Chandra&apos;s own chart answers questions about Chandra.</span>
              </span>
            </button>
            <button type="button" aria-pressed={discipline.contact} onClick={() => setDiscipline((d) => ({ ...d, contact: !d.contact }))} style={togglePanelStyle(discipline.contact, ACCENT)}>
              <RefreshCw size={18} aria-hidden="true" />
              <span>
                <strong style={{ fontWeight: 600 }}>Name the contact as resonance</strong>
                <span>Do not let the point of contact become a verdict.</span>
              </span>
            </button>
          </div>
        </section>

        <section style={{ ...cardStyle, borderColor: allDisciplines ? `${GREEN}66` : `${VERMILION}66`, background: allDisciplines ? `${GREEN}0F` : `${VERMILION}0F` }}>
          <p style={eyebrowStyle}>Draft paired-reading statement</p>
          <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
            {showMisattribution ? misattributedStatement : statement}
          </p>
          {!allDisciplines ? (
            <div style={{ ...noticeStyle(VERMILION), marginTop: "0.85rem" }}>
              <AlertTriangle size={18} />
              <span>Activate all three discipline toggles to complete the paired-reading framework.</span>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}

function ZodiacStepWheel({ lagna, fifth, step }: { lagna: number; fifth: number; step: StepKey }) {
  const radius = 110;
  const center = 150;

  return (
    <svg viewBox="0 0 300 260" role="img" aria-label="Zodiac wheel stepping from Lagna to fifth house" style={{ width: "100%", maxHeight: 320, display: "block", margin: "0.85rem auto 0" }}>
      <circle cx={center} cy={center} r={radius} fill="none" stroke={HAIRLINE} strokeWidth="1.5" />
      <circle cx={center} cy={center} r={radius - 36} fill="none" stroke={HAIRLINE} strokeWidth="1" />
      {SIGNS.map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x1 = center + (radius - 36) * Math.cos(angle);
        const y1 = center + (radius - 36) * Math.sin(angle);
        const x2 = center + radius * Math.cos(angle);
        const y2 = center + radius * Math.sin(angle);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={HAIRLINE} strokeWidth="1" />;
      })}
      {SIGNS.map((sign, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x = center + (radius - 18) * Math.cos(angle);
        const y = center + (radius - 18) * Math.sin(angle);
        const isLagna = i === lagna;
        const isFifth = i === fifth;
        const isStep = step > 0 && ((lagna + step) % 12) === i && !isFifth;
        const highlight = isLagna || isFifth || isStep;
        return (
          <g key={sign}>
            {highlight ? (
              <circle cx={x} cy={y} r={20} fill={isLagna ? `${BLUE}22` : isFifth ? `${GREEN}22` : `${ACCENT}18`} stroke={isLagna ? BLUE : isFifth ? GREEN : ACCENT} strokeWidth="2" />
            ) : null}
            <text x={x} y={y - 3} textAnchor="middle" fill={highlight ? INK_PRIMARY : INK_MUTED} fontSize="11" fontWeight={highlight ? 600 : 500}>{SIGN_SHORT[i]}</text>
            <text x={x} y={y + 10} textAnchor="middle" fill={highlight ? INK_SECONDARY : INK_MUTED} fontSize="9">{i + 1}</text>
          </g>
        );
      })}
      <text x={center} y={center - 6} textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight={600}>Step {step} of 4</text>
      <text x={center} y={center + 14} textAnchor="middle" fill={INK_MUTED} fontSize="11">{step === 0 ? "Lagna selected" : step === 4 ? "5th house reached" : `Counting ${step} house${step === 1 ? "" : "s"} forward`}</text>
    </svg>
  );
}

function ChildChartHighlight({ parentFifthSign, contactSign }: { parentFifthSign: number; contactSign: number }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem" }}>
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.85rem", background: SURFACE }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase" }}>Chandra&apos;s key placements</p>
        <div style={{ marginTop: "0.55rem", display: "grid", gap: "0.35rem" }}>
          <p style={{ margin: 0, color: INK_PRIMARY }}>Lagna: <span style={{ color: SIGN_COLORS[CHILD.lagnaSign], fontWeight: 600 }}>{SIGNS[CHILD.lagnaSign]}</span></p>
          {CHILD.planets.map((p) => (
            <p key={p.name} style={{ margin: 0, color: INK_SECONDARY }}>
              {p.name}: <span style={{ color: p.color, fontWeight: p.sign === contactSign ? 600 : 500 }}>{SIGNS[p.sign]}</span>
              {p.sign === contactSign ? <span style={{ color: GREEN, marginLeft: 6 }}>← contact</span> : null}
            </p>
          ))}
        </div>
      </div>
      <div style={{ border: `1px solid ${SIGN_COLORS[parentFifthSign]}66`, borderRadius: 8, padding: "0.85rem", background: `${SIGN_COLORS[parentFifthSign]}0F` }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase" }}>Resonance found</p>
        <p style={{ margin: "0.55rem 0 0", color: INK_PRIMARY, lineHeight: 1.5 }}>
          The parent&apos;s 5th-house sign <strong style={{ color: SIGN_COLORS[parentFifthSign], fontWeight: 600 }}>{SIGNS[parentFifthSign]}</strong> appears in Chandra&apos;s chart at the highlighted placement.
        </p>
        <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, fontSize: "0.9rem" }}>
          This is a point of contact, not a verdict about Chandra&apos;s overall nature.
        </p>
      </div>
    </div>
  );
}

function MiniFact({ icon, title, body, color }: { icon: React.ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0F`, padding: "0.7rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color, fontWeight: 600 }}>{icon}{title}</div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.35 }}>{body}</p>
    </div>
  );
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.48rem 0.68rem",
    fontWeight: 500,
    cursor: "pointer",
  };
}

function togglePanelStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "24px 1fr",
    gap: "0.65rem",
    alignItems: "start",
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}14` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.75rem",
    cursor: "pointer",
  };
}

function noticeStyle(color: string): CSSProperties {
  return {
    border: `1px solid ${color}55`,
    borderRadius: 8,
    background: `${color}14`,
    color,
    padding: "0.75rem",
    display: "flex",
    gap: "0.5rem",
    alignItems: "start",
    fontWeight: 500,
    lineHeight: 1.45,
  };
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
};

const softButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.45rem",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "0.55rem 0.75rem",
  background: SURFACE,
  color: INK_PRIMARY,
  cursor: "pointer",
  font: "inherit",
  fontSize: "0.9rem",
  fontWeight: 500,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: ACCENT,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  fontSize: "0.78rem",
  fontWeight: 600,
};

export default FifthFromParentPairedReadingWorkbench;
