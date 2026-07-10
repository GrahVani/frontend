"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, CircleDot, FileText, Heart, HeartHandshake, Moon, Orbit, RotateCcw, ShieldCheck, Sparkles, TriangleAlert, Venus } from "lucide-react";
import { workbenchDiagramLayoutStyle } from "../lib/layouts";

type ViewMode = "questions" | "references" | "anchor" | "ethics";
type SubQuestion = "promise" | "nature" | "quality" | "partnership";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

const OPAQUE_LIGHT_FILL: Record<string, string> = {
  [BLUE]: "#E3EEF9",
  [GREEN]: "#E8F5E9",
  [GOLD]: "#FDF4E3",
  [VERMILION]: "#F9E8E3",
  [PURPLE]: "#EDE9F6",
};

const SUB_QUESTIONS: Record<SubQuestion, { label: string; prompt: string; factors: string; caution: string; icon: ReactNode; color: string }> = {
  promise: {
    label: "Promise",
    prompt: "Will marriage happen?",
    factors: "Strength and integrity of the 7th, 7th lord, Venus, and supporting factors.",
    caution: "Never conclude from one stressed factor.",
    icon: <BadgeCheck size={18} />,
    color: GREEN,
  },
  nature: {
    label: "Spouse Nature",
    prompt: "What is the partner like?",
    factors: "Sign on the 7th, planets in the 7th, and the 7th lord's character.",
    caution: "Read tendencies, not rigid stereotypes.",
    icon: <Heart size={18} />,
    color: PURPLE,
  },
  quality: {
    label: "Union Quality",
    prompt: "Will the relationship be harmonious?",
    factors: "Benefic and malefic influence on the 7th and its lord.",
    caution: "Stress means care and effort, not doom.",
    icon: <HeartHandshake size={18} />,
    color: GOLD,
  },
  partnership: {
    label: "Partnership",
    prompt: "What about business or public dealings?",
    factors: "The 7th as 'the other': partnerships, transactions, public dealings.",
    caution: "Secondary for marriage unless the client asks it.",
    icon: <Orbit size={18} />,
    color: BLUE,
  },
};

const VIEW_COPY: Record<ViewMode, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  questions: {
    label: "Questions",
    title: "Marriage is several questions",
    body: "Promise, spouse nature, quality of union, and partnership are different readings. Name the sub-question before choosing factors.",
    icon: <FileText size={16} />,
    color: BLUE,
  },
  references: {
    label: "References",
    title: "Read Lagna, Moon, and Venus",
    body: "The Lagna 7th gives the structural register, Moon gives lived experience, and Venus gives the kalatra-karaka cross-check.",
    icon: <CircleDot size={16} />,
    color: GREEN,
  },
  anchor: {
    label: "D1 Anchor",
    title: "D1 comes before D9 and later streams",
    body: "The D9, Venus depth, Jaimini, KP, and compatibility layers refine the D1 7th. They do not replace it.",
    icon: <Sparkles size={16} />,
    color: GOLD,
  },
  ethics: {
    label: "Ethics",
    title: "A stressed 7th is not doom",
    body: "One factor is never a marriage conclusion. Frame stress as an area needing care, agency, and fuller assessment.",
    icon: <ShieldCheck size={16} />,
    color: VERMILION,
  },
};

export function SeventhHouseMarriageProfileWorkbench() {
  const [viewMode, setViewMode] = useState<ViewMode>("references");
  const [subQuestion, setSubQuestion] = useState<SubQuestion>("promise");
  const [lagnaRef, setLagnaRef] = useState(true);
  const [moonRef, setMoonRef] = useState(true);
  const [venusRef, setVenusRef] = useState(true);
  const [d1Anchored, setD1Anchored] = useState(true);
  const [beneficSupport, setBeneficSupport] = useState(true);
  const [stressPresent, setStressPresent] = useState(false);
  const [doomAvoided, setDoomAvoided] = useState(true);
  const [tendencyFramed, setTendencyFramed] = useState(true);

  const activeRefs = [lagnaRef, moonRef, venusRef].filter(Boolean).length;
  const ethicalOk = doomAvoided && tendencyFramed;
  const score = Math.max(5, Math.min(98, activeRefs * 18 + (d1Anchored ? 18 : -10) + (beneficSupport ? 16 : 0) + (stressPresent ? -12 : 8) + (ethicalOk ? 18 : -24)));

  const tier = useMemo(() => {
    if (!ethicalOk) return "method warning";
    if (!d1Anchored) return "unanchored";
    if (stressPresent) return "qualified / care-needed";
    if (activeRefs === 3 && beneficSupport) return "clear convergence";
    if (activeRefs >= 2) return "moderate";
    return "thin evidence";
  }, [activeRefs, beneficSupport, d1Anchored, ethicalOk, stressPresent]);

  const interpretation = useMemo(() => {
    if (!ethicalOk) return "Pause: the reading is becoming rigid or fatalistic. Restore agency, read tendencies only, and avoid doom from a single stressed 7th factor.";
    if (!d1Anchored) return "Start again from the D1 7th: establish promise, spouse tenor, and quality before using D9, Venus depth, Jaimini, KP, or compatibility layers.";
    if (stressPresent) return "The 7th shows stress, so frame this as an area needing care, patience, or effort. Check lord, Venus, Moon reference, benefic aspects, and cancellations before assigning confidence.";
    return `${SUB_QUESTIONS[subQuestion].label}: ${SUB_QUESTIONS[subQuestion].factors} With all three references active and benefic support present, confidence rises while the answer remains a likelihood, not a decree.`;
  }, [d1Anchored, ethicalOk, stressPresent, subQuestion]);

  return (
    <div data-interactive="seventh-house-marriage-profile-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>7th-house marriage profile</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>Read the 7th by question, reference, and ethics</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 920 }}>
              Build the D1 7th anchor, choose the marriage sub-question, compare Lagna/Moon/Venus, and keep stressed factors inside a care-with-agency frame.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setViewMode("references");
              setSubQuestion("promise");
              setLagnaRef(true);
              setMoonRef(true);
              setVenusRef(true);
              setD1Anchored(true);
              setBeneficSupport(true);
              setStressPresent(false);
              setDoomAvoided(true);
              setTendencyFramed(true);
            }}
            style={buttonStyle(false, GOLD)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(Object.keys(VIEW_COPY) as ViewMode[]).map((mode) => (
            <button key={mode} type="button" aria-pressed={viewMode === mode} onClick={() => setViewMode(mode)} style={buttonStyle(viewMode === mode, VIEW_COPY[mode].color)}>
              {VIEW_COPY[mode].icon}
              {VIEW_COPY[mode].label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "0.8rem", border: `1px solid ${VIEW_COPY[viewMode].color}55`, borderRadius: 8, background: `${VIEW_COPY[viewMode].color}10`, padding: "0.85rem" }}>
          <h3 style={{ margin: 0, color: VIEW_COPY[viewMode].color, fontSize: "1.12rem" }}>{VIEW_COPY[viewMode].title}</h3>
          <p style={bodyTextStyle}>{VIEW_COPY[viewMode].body}</p>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Reading confidence</p>
              <h3 style={{ margin: "0.15rem 0 0", color: tierColor(tier), fontSize: "1.2rem" }}>{tier}</h3>
            </div>
            <strong style={{ color: tierColor(tier), fontWeight: 600 }}>{score}% support</strong>
          </div>
          <SeventhHouseSvg lagnaRef={lagnaRef} moonRef={moonRef} venusRef={venusRef} d1Anchored={d1Anchored} stressPresent={stressPresent} ethicalOk={ethicalOk} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 135px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="References" body={`${activeRefs}/3 active`} color={activeRefs === 3 ? GREEN : GOLD} icon={<CircleDot size={16} />} />
            <MiniFact title="Anchor" body={d1Anchored ? "D1 first" : "skipped"} color={d1Anchored ? GREEN : VERMILION} icon={<Sparkles size={16} />} />
            <MiniFact title="Frame" body={ethicalOk ? "agency" : "warning"} color={ethicalOk ? GREEN : VERMILION} icon={<ShieldCheck size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Sub-question chooser" icon={<FileText size={18} />} color={SUB_QUESTIONS[subQuestion].color}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 145px), 1fr))", gap: "0.55rem" }}>
              {(Object.keys(SUB_QUESTIONS) as SubQuestion[]).map((key) => (
                <button key={key} type="button" aria-pressed={subQuestion === key} onClick={() => setSubQuestion(key)} style={buttonStyle(subQuestion === key, SUB_QUESTIONS[key].color)}>
                  {SUB_QUESTIONS[key].icon}
                  {SUB_QUESTIONS[key].label}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title={SUB_QUESTIONS[subQuestion].prompt} icon={SUB_QUESTIONS[subQuestion].icon} color={SUB_QUESTIONS[subQuestion].color}>
            <StreamRow label="Read from" body={SUB_QUESTIONS[subQuestion].factors} verdict="factors" color={SUB_QUESTIONS[subQuestion].color} />
            <StreamRow label="Caution" body={SUB_QUESTIONS[subQuestion].caution} verdict="frame" color={GOLD} />
          </Panel>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Reference points</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={lagnaRef} color={lagnaRef ? GREEN : GOLD} icon={<CircleDot size={18} />} title="7th from Lagna" body={lagnaRef ? "Primary structural register of marriage and spouse." : "Primary D1 reference is missing."} onClick={() => setLagnaRef((value) => !value)} />
            <Toggle active={moonRef} color={moonRef ? GREEN : GOLD} icon={<Moon size={18} />} title="7th from Moon" body={moonRef ? "Emotional and lived experience cross-check." : "Lived register is not cross-checked."} onClick={() => setMoonRef((value) => !value)} />
            <Toggle active={venusRef} color={venusRef ? GREEN : GOLD} icon={<Venus size={18} />} title="7th from Venus" body={venusRef ? "Kalatra-karaka reference and Venus condition included." : "Karaka-based cross-check is missing."} onClick={() => setVenusRef((value) => !value)} />
            <Toggle active={d1Anchored} color={d1Anchored ? GREEN : VERMILION} icon={<Sparkles size={18} />} title="D1 7th anchored first" body={d1Anchored ? "D9 and later streams refine the D1 base." : "Reading jumped to a later layer too early."} onClick={() => setD1Anchored((value) => !value)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Support and ethics</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={beneficSupport} color={beneficSupport ? GREEN : GOLD} icon={<BadgeCheck size={18} />} title="Benefic support present" body={beneficSupport ? "Supportive influences raise confidence." : "Supportive modification is not visible."} onClick={() => setBeneficSupport((value) => !value)} />
            <Toggle active={stressPresent} color={stressPresent ? GOLD : GREEN} icon={<TriangleAlert size={18} />} title="Stressed 7th factor" body={stressPresent ? "Read as delay/friction/care-needed, not doom." : "No major stress selected."} onClick={() => setStressPresent((value) => !value)} />
            <Toggle active={doomAvoided} color={doomAvoided ? GREEN : VERMILION} icon={<ShieldCheck size={18} />} title="Doom verdict avoided" body={doomAvoided ? "No 'no marriage' or 'failure' from one factor." : "Reading has become fatalistic."} onClick={() => setDoomAvoided((value) => !value)} />
            <Toggle active={tendencyFramed} color={tendencyFramed ? GREEN : VERMILION} icon={<Heart size={18} />} title="Spouse read as tendency" body={tendencyFramed ? "Descriptions stay respectful and non-rigid." : "Spouse indication is becoming a stereotype."} onClick={() => setTendencyFramed((value) => !value)} />
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: `${tierColor(tier)}66`, background: `${tierColor(tier)}10` }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          <FileText size={20} color={tierColor(tier)} aria-hidden="true" />
          <div>
            <p style={eyebrowStyle}>Interpretive frame</p>
            <h3 style={{ margin: "0.15rem 0 0", color: tierColor(tier), fontSize: "1.16rem" }}>{tier}</h3>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{interpretation}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function edgeLine(x1: number, y1: number, r1: number, x2: number, y2: number, r2: number): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;
  return `M ${(x1 + r1 * ux).toFixed(1)} ${(y1 + r1 * uy).toFixed(1)} L ${(x2 - r2 * ux).toFixed(1)} ${(y2 - r2 * uy).toFixed(1)}`;
}

function SeventhHouseSvg({ lagnaRef, moonRef, venusRef, d1Anchored, stressPresent, ethicalOk }: { lagnaRef: boolean; moonRef: boolean; venusRef: boolean; d1Anchored: boolean; stressPresent: boolean; ethicalOk: boolean }) {
  const finalColor = !ethicalOk || !d1Anchored ? VERMILION : stressPresent ? GOLD : GREEN;
  const refs = [
    { label: "Lagna", active: lagnaRef, x: 170, color: GREEN },
    { label: "Moon", active: moonRef, x: 380, color: BLUE },
    { label: "Venus", active: venusRef, x: 590, color: PURPLE },
  ];

  return (
    <svg viewBox="0 0 760 430" role="img" aria-label="Three reference points for 7th-house marriage reading" style={diagramSvgStyle}>
      <rect x="18" y="18" width="724" height="378" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <circle cx="380" cy="204" r="56" fill={OPAQUE_LIGHT_FILL[GOLD]} stroke={d1Anchored ? GOLD : VERMILION} strokeWidth="3" />
      <text x="380" y="198" textAnchor="middle" fill={d1Anchored ? GOLD : VERMILION} fontSize="18" fontWeight="600">D1 7th</text>
      <text x="380" y="221" textAnchor="middle" fill={INK_MUTED} fontSize="13">{d1Anchored ? "anchor first" : "anchor missing"}</text>
      {refs.map((ref) => (
        <g key={ref.label}>
          <path d={edgeLine(ref.x, 102, 42, 380, 204, 56)} stroke={ref.active ? ref.color : HAIRLINE} strokeWidth={ref.active ? 3 : 1.5} strokeDasharray={ref.active ? "0" : "6 8"} />
          <circle cx={ref.x} cy="102" r="42" fill={ref.active ? OPAQUE_LIGHT_FILL[ref.color] : "transparent"} stroke={ref.active ? ref.color : HAIRLINE} strokeWidth={ref.active ? 3 : 1.5} />
          <text x={ref.x} y="99" textAnchor="middle" fill={ref.active ? ref.color : INK_MUTED} fontSize="14" fontWeight="600">{ref.label}</text>
          <text x={ref.x} y="117" textAnchor="middle" fill={INK_MUTED} fontSize="13">7th from</text>
        </g>
      ))}
      <path d="M 380 260 L 380 268" stroke={HAIRLINE} strokeWidth="3" />
      <circle cx="380" cy="310" r="42" fill={OPAQUE_LIGHT_FILL[finalColor]} stroke={finalColor} strokeWidth="3" />
      <text x="380" y="305" textAnchor="middle" fill={finalColor} fontSize="15" fontWeight="600">{ethicalOk ? "FRAME" : "WARNING"}</text>
      <text x="380" y="323" textAnchor="middle" fill={INK_MUTED} fontSize="13">{stressPresent ? "care, not doom" : "not decree"}</text>
      <rect x="90" y="374" width="580" height="34" rx="8" fill={OPAQUE_LIGHT_FILL[GOLD]} stroke={HAIRLINE} />
      <text x="380" y="396" textAnchor="middle" fill={INK_MUTED} fontSize="14" fontWeight="600">Promise, nature, and quality use different factors.</text>
    </svg>
  );
}

function StreamRow({ label, body, verdict, color }: { label: string; body: string; verdict: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0D`, padding: "0.65rem", marginTop: "0.6rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "center" }}>
        <strong style={{ color }}>{label}</strong>
        <span style={{ color, fontSize: "0.78rem", fontWeight: 600 }}>{verdict}</span>
      </div>
      <p style={{ ...bodyTextStyle, marginTop: "0.35rem" }}>{body}</p>
    </div>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ ...cardStyle, padding: "0.9rem" }}>
      <div style={{ display: "flex", gap: "0.55rem", alignItems: "center", color }}>
        {icon}
        <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>{title}</h3>
      </div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function Toggle({ active, color, icon, title, body, onClick }: { active: boolean; color: string; icon: ReactNode; title: string; body: string; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} style={toggleStyle(active, color)}>
      <span style={{ color }}>{icon}</span>
      <span>
        <strong style={{ fontWeight: 600 }}>{title}</strong>
        <span>{body}</span>
      </span>
    </button>
  );
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}10`, padding: "0.65rem" }}>
      <div style={{ display: "flex", gap: "0.45rem", alignItems: "center", color }}>
        {icon}
        <strong style={{ fontSize: "0.86rem", fontWeight: 600 }}>{title}</strong>
      </div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.35 }}>{body}</p>
    </div>
  );
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: "var(--gl-shadow-soft)",
};

const workbenchTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
  gap: "1rem",
};

const diagramSvgStyle: CSSProperties = {
  display: "block",
  width: "100%",
  height: "auto",
  margin: "0.7rem 0",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontSize: "0.75rem",
  fontWeight: 600,
};

const bodyTextStyle: CSSProperties = {
  margin: "0.45rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.55,
  fontSize: "0.92rem",
};

function tierColor(tier: string): string {
  if (tier === "clear convergence") return GREEN;
  if (tier === "qualified / care-needed") return GOLD;
  if (tier === "moderate") return BLUE;
  if (tier === "thin evidence") return PURPLE;
  return VERMILION;
}

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
  };
}
