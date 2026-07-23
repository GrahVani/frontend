"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { RefreshCcw, Scale, ShieldCheck, Sparkles } from "lucide-react";
import { workbenchDiagramLayoutStyle } from '@/components/learning-runtime/interactive/lib/layouts';

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

export function JupiterThreeRegistersConvergence() {
  const [jupiterStrong, setJupiterStrong] = useState(true);
  const [jupiterInFifth, setJupiterInFifth] = useState(false);
  const [jupiterIsFifthLord, setJupiterIsFifthLord] = useState(false);
  const [fifthHouseSupportive, setFifthHouseSupportive] = useState(true);
  const [fifthLordStrong, setFifthLordStrong] = useState(true);

  const unified = jupiterInFifth;
  const karakaAndBhavaMerged = unified && jupiterStrong && fifthHouseSupportive;
  const independentCount = unified
    ? (karakaAndBhavaMerged ? 1 : 0) + (fifthLordStrong ? 1 : 0)
    : (jupiterStrong ? 1 : 0) + (fifthHouseSupportive ? 1 : 0) + (fifthLordStrong ? 1 : 0);
  const maxCount = unified ? 2 : 3;

  const verdict = useMemo(() => {
    if (jupiterIsFifthLord && !unified) {
      if (independentCount === 3) return { label: "structural strength + full convergence", color: GREEN };
      if (independentCount === 2) return { label: "structural strength + partial convergence", color: GREEN };
      return { label: "structural strength but other registers weak", color: GOLD };
    }
    if (unified) {
      if (karakaAndBhavaMerged && fifthLordStrong) return { label: "strong unified signal + lord support", color: GREEN };
      if (karakaAndBhavaMerged || fifthLordStrong) return { label: "one strong register + one mixed", color: GOLD };
      return { label: "weak unified signal", color: VERMILION };
    }
    if (independentCount === 3) return { label: "three independent registers converge", color: GREEN };
    if (independentCount === 2) return { label: "two independent registers converge", color: GREEN };
    if (independentCount === 1) return { label: "only one register supports", color: GOLD };
    return { label: "no register supports", color: VERMILION };
  }, [fifthLordStrong, independentCount, jupiterIsFifthLord, karakaAndBhavaMerged, unified]);

  const synthesis = useMemo(() => {
    const karaka = `Jupiter (kāraka) is ${jupiterStrong ? "strong" : "weak"}${jupiterInFifth ? " and occupies the 5th house" : ""}${jupiterIsFifthLord ? " and is also the 5th lord" : ""}.`;
    const bhava = `The 5th house (bhāva) is ${fifthHouseSupportive ? "supportive" : "stressed"}.`;
    const lord = `The 5th lord is ${fifthLordStrong ? "strong" : "weak"}.`;
    const caution = unified
      ? "Because Jupiter occupies its own signified house, kāraka and bhāva count as one unified signal, not two."
      : jupiterIsFifthLord
        ? "Jupiter as the 5th lord by ascendant is a structural strength, distinct from kāraka-in-bhāva."
        : "Kāraka, bhāva, and lord are read as independent registers.";
    return `${karaka} ${bhava} ${lord} ${caution} Independent confirmations: ${independentCount}/${maxCount}. Verdict: ${verdict.label}.`;
  }, [fifthHouseSupportive, fifthLordStrong, jupiterInFifth, jupiterIsFifthLord, jupiterStrong, maxCount, unified, independentCount, verdict.label]);

  function reset() {
    setJupiterStrong(true);
    setJupiterInFifth(false);
    setJupiterIsFifthLord(false);
    setFifthHouseSupportive(true);
    setFifthLordStrong(true);
  }

  return (
    <div data-interactive="jupiter-three-registers-convergence" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Kāraka, bhāva, and lord</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.28rem", fontWeight: 600 }}>Count convergence honestly</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Jupiter is the saṁtāna-kāraka, the 5th house is the bhāva, and the 5th lord is the chart-specific ruler. When Jupiter sits in the 5th, the kāraka and bhāva merge into one signal.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Three registers</p>
              <h3 style={{ margin: "0.15rem 0 0", color: verdict.color, fontSize: "1.12rem", fontWeight: 600 }}>{verdict.label}</h3>
            </div>
            <strong style={{ color: verdict.color, fontWeight: 600 }}>{independentCount} independent</strong>
          </div>
          <RegistersSvg
            jupiterStrong={jupiterStrong}
            jupiterInFifth={jupiterInFifth}
            jupiterIsFifthLord={jupiterIsFifthLord}
            fifthHouseSupportive={fifthHouseSupportive}
            fifthLordStrong={fifthLordStrong}
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.65rem" }}>
            <MiniFact icon={<Sparkles size={16} />} title="Kāraka" body={jupiterStrong ? "Jupiter strong" : "Jupiter weak"} color={jupiterStrong ? GREEN : VERMILION} />
            <MiniFact icon={<ShieldCheck size={16} />} title="Bhāva" body={fifthHouseSupportive ? "5th supportive" : "5th stressed"} color={fifthHouseSupportive ? GREEN : VERMILION} />
            <MiniFact icon={<Scale size={16} />} title="Lord" body={fifthLordStrong ? "5th lord strong" : "5th lord weak"} color={fifthLordStrong ? GREEN : VERMILION} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Jupiter (kāraka)" icon={<Sparkles size={18} />} color={GOLD}>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              <Toggle active={jupiterStrong} color={jupiterStrong ? GREEN : VERMILION} icon={<Sparkles size={18} />} title="Jupiter strong" body={jupiterStrong ? "Dignified, well-aspected, or own/exalted." : "Debilitated, combust, or afflicted."} onClick={() => setJupiterStrong((value) => !value)} />
              <Toggle active={jupiterInFifth} color={jupiterInFifth ? BLUE : GOLD} icon={<ShieldCheck size={18} />} title="Jupiter occupies the 5th" body={jupiterInFifth ? "Kāraka and bhāva unify — count as one signal." : "Kāraka and bhāva are separate registers."} onClick={() => setJupiterInFifth((value) => !value)} />
              <Toggle active={jupiterIsFifthLord} color={jupiterIsFifthLord ? PURPLE : GOLD} icon={<Scale size={18} />} title="Jupiter is the 5th lord" body={jupiterIsFifthLord ? "Sagittarius/Pisces ascendant: structural strength." : "5th lord is a different planet."} onClick={() => setJupiterIsFifthLord((value) => !value)} />
            </div>
          </Panel>

          <Panel title="Bhāva and lord" icon={<ShieldCheck size={18} />} color={BLUE}>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              <Toggle active={fifthHouseSupportive} color={fifthHouseSupportive ? GREEN : VERMILION} icon={<ShieldCheck size={18} />} title="5th house supportive" body={fifthHouseSupportive ? "Benefic occupant/aspect or clean." : "Malefic occupant/aspect or afflicted."} onClick={() => setFifthHouseSupportive((value) => !value)} />
              <Toggle active={fifthLordStrong} color={fifthLordStrong ? GREEN : VERMILION} icon={<Scale size={18} />} title="5th lord strong" body={fifthLordStrong ? "Dignified and well-placed." : "Debilitated, afflicted, or weak."} onClick={() => setFifthLordStrong((value) => !value)} />
            </div>
          </Panel>
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

function RegistersSvg({
  jupiterStrong,
  jupiterInFifth,
  jupiterIsFifthLord,
  fifthHouseSupportive,
  fifthLordStrong,
}: {
  jupiterStrong: boolean;
  jupiterInFifth: boolean;
  jupiterIsFifthLord: boolean;
  fifthHouseSupportive: boolean;
  fifthLordStrong: boolean;
}) {
  const jupiterColor = jupiterStrong ? GOLD : VERMILION;
  const bhavaColor = fifthHouseSupportive ? GREEN : VERMILION;
  const lordColor = fifthLordStrong ? BLUE : VERMILION;
  const merged = jupiterInFifth && jupiterStrong && fifthHouseSupportive;
  const mergedColor = merged ? GREEN : GOLD;

  return (
    <svg viewBox="0 0 340 220" role="img" aria-label="Diagram of kāraka, bhāva, and lord registers" style={{ width: "100%", maxHeight: 280, margin: "0.4rem auto 0.85rem", display: "block" }}>
      <rect x="10" y="10" width="320" height="200" rx="10" fill={`${GOLD}05`} stroke={HAIRLINE} strokeWidth="1.5" />

      {/* Jupiter node */}
      <circle cx="170" cy="55" r="28" fill={`${jupiterColor}22`} stroke={jupiterColor} strokeWidth="3" />
      <text x="170" y="50" textAnchor="middle" fill={jupiterColor} fontSize="12" fontWeight="600">
        Jupiter
      </text>
      <text x="170" y="65" textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight="600">
        kāraka
      </text>

      {/* 5th house node */}
      <circle cx="80" cy="150" r="28" fill={jupiterInFifth ? `${mergedColor}22` : `${bhavaColor}22`} stroke={jupiterInFifth ? mergedColor : bhavaColor} strokeWidth="3" />
      <text x="80" y="145" textAnchor="middle" fill={jupiterInFifth ? mergedColor : bhavaColor} fontSize="12" fontWeight="600">
        5th House
      </text>
      <text x="80" y="160" textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight="600">
        bhāva
      </text>

      {/* 5th lord node */}
      <circle cx="260" cy="150" r="28" fill={`${lordColor}22`} stroke={lordColor} strokeWidth="3" />
      <text x="260" y="145" textAnchor="middle" fill={lordColor} fontSize="12" fontWeight="600">
        5th Lord
      </text>
      <text x="260" y="160" textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight="600">
        bhāva-lord
      </text>

      {/* Connection lines */}
      {jupiterInFifth ? (
        <path d="M 170 83 L 80 122" stroke={mergedColor} strokeWidth="4" strokeLinecap="round" />
      ) : (
        <line x1="150" y1="78" x2="100" y2="125" stroke={HAIRLINE} strokeWidth="2" />
      )}
      <line x1="190" y1="78" x2="240" y2="125" stroke={jupiterIsFifthLord ? PURPLE : HAIRLINE} strokeWidth={jupiterIsFifthLord ? 3 : 2} />

      {/* Merge badge */}
      {jupiterInFifth ? (
        <g transform="translate(110 100)">
          <rect x="-46" y="-10" width="92" height="20" rx="6" fill={mergedColor} />
          <text x="0" y="4" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="600">
            unified signal
          </text>
        </g>
      ) : null}

      {/* Jupiter-as-lord badge */}
      {jupiterIsFifthLord && !jupiterInFifth ? (
        <g transform="translate(230 95)">
          <rect x="-40" y="-10" width="80" height="20" rx="6" fill={PURPLE} />
          <text x="0" y="4" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="600">
            also lord
          </text>
        </g>
      ) : null}
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
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
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}10`, padding: "0.7rem" }}>
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
    background: active ? `${color}16` : "transparent",
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

function toggleStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}12` : "transparent",
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
