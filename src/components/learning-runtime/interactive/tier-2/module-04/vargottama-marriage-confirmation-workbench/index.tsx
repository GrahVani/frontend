"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, CircleDot, GitCompare, HeartHandshake, Link2, Orbit, RotateCcw, Scale, ShieldCheck, Sparkles, TriangleAlert, Venus } from "lucide-react";
import { workbenchDiagramLayoutStyle } from '@/components/learning-runtime/interactive/lib/layouts';

type Factor = "venus" | "seventhLord" | "lagna";
type Condition = "sound" | "mixed" | "afflicted";
type Focus = "definition" | "marriage" | "amplification" | "synthesis";

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

const OPAQUE_LIGHT_FILL: Record<string, string> = {
  [BLUE]: "#E3EEF9",
  [GREEN]: "#E8F5E9",
  [GOLD]: "#FDF4E3",
  [VERMILION]: "#F9E8E3",
  [PURPLE]: "#EDE9F6",
};

const SIGNS = ["Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Mina"] as const;

const FOCUS_COPY: Record<Focus, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  definition: {
    label: "Definition",
    title: "Vargottama means same sign in D1 and D9",
    body: "The same planet or Lagna repeats its sign across the surface chart and the marriage-depth chart.",
    icon: <Link2 size={16} />,
    color: BLUE,
  },
  marriage: {
    label: "Marriage",
    title: "Check Venus, the 7th lord, and the Lagna",
    body: "These are the marriage-relevant vargottama factors: karaka, direction, and foundation.",
    icon: <HeartHandshake size={16} />,
    color: PURPLE,
  },
  amplification: {
    label: "Amplify",
    title: "Vargottama amplifies what the factor already is",
    body: "A sound factor becomes more reliable. An afflicted factor becomes a confirmed area needing care.",
    icon: <Scale size={16} />,
    color: GOLD,
  },
  synthesis: {
    label: "Synthesis",
    title: "Use it as a confirmation modifier",
    body: "Vargottama raises confidence inside the combined D1-D9 reading. It is not a standalone blessing or doom.",
    icon: <GitCompare size={16} />,
    color: GREEN,
  },
};

const FACTOR_COPY: Record<Factor, { label: string; role: string; icon: ReactNode; color: string }> = {
  venus: {
    label: "Venus",
    role: "confirmed marriage karaka",
    icon: <Venus size={16} />,
    color: PURPLE,
  },
  seventhLord: {
    label: "7th lord",
    role: "confirmed marriage direction",
    icon: <HeartHandshake size={16} />,
    color: GOLD,
  },
  lagna: {
    label: "Lagna",
    role: "stable marriage foundation",
    icon: <CircleDot size={16} />,
    color: BLUE,
  },
};

export function VargottamaMarriageConfirmationWorkbench() {
  const [focus, setFocus] = useState<Focus>("definition");
  const [factor, setFactor] = useState<Factor>("venus");
  const [d1Sign, setD1Sign] = useState(6);
  const [d9Sign, setD9Sign] = useState(6);
  const [condition, setCondition] = useState<Condition>("sound");
  const [beneficSupport, setBeneficSupport] = useState(true);
  const [maleficStress, setMaleficStress] = useState(false);
  const [conditionReadFirst, setConditionReadFirst] = useState(true);
  const [combinedReading, setCombinedReading] = useState(true);
  const [agencyFrame, setAgencyFrame] = useState(true);

  const sameSign = d1Sign === d9Sign;
  const methodOk = conditionReadFirst && combinedReading && agencyFrame;
  const score = Math.max(
    5,
    Math.min(
      98,
      (sameSign ? 28 : 8) +
        conditionScore(condition) +
        (beneficSupport ? 12 : 0) -
        (maleficStress ? 12 : 0) +
        (conditionReadFirst ? 10 : -20) +
        (combinedReading ? 10 : -18) +
        (agencyFrame ? 10 : -24),
    ),
  );

  const tier = useMemo(() => {
    if (!methodOk) return "method warning";
    if (!sameSign) return "not vargottama";
    if (condition === "sound" && beneficSupport && !maleficStress) return "confirmed support";
    if (condition === "afflicted") return "confirmed care theme";
    return "confirmed mixed factor";
  }, [beneficSupport, condition, maleficStress, methodOk, sameSign]);

  const interpretation = useMemo(() => {
    if (!conditionReadFirst) return "Pause: vargottama is being treated as automatically good. Read the factor's actual condition first.";
    if (!combinedReading) return "Pause: vargottama is being used as a standalone verdict. Combine it with D1, D9 Lagna, D9 7th, Venus, and the relevant streams.";
    if (!agencyFrame) return "Pause: the confirmed difficulty is becoming doom. Frame it as a stable area needing attention and support.";
    if (!sameSign) return `${FACTOR_COPY[factor].label} is not vargottama because the D1 and D9 signs differ. Continue the normal D1-D9 comparison.`;
    if (condition === "sound") return `${FACTOR_COPY[factor].label} is vargottama and sound, so vargottama confirms support: ${FACTOR_COPY[factor].role}. State it as a strong modifier inside the combined reading.`;
    if (condition === "afflicted") return `${FACTOR_COPY[factor].label} is vargottama but afflicted. The difficulty is confirmed, not erased; report an area needing care with agency.`;
    return `${FACTOR_COPY[factor].label} is vargottama with mixed condition. It gives consistency, but the final grade remains qualified by dignity, aspects, and the D1-D9 synthesis.`;
  }, [agencyFrame, combinedReading, condition, conditionReadFirst, factor, sameSign]);

  return (
    <div data-interactive="vargottama-marriage-confirmation-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Vargottama marriage confirmation</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>Same sign, then ask what it confirms</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 920 }}>
              Compare D1 and D9 signs for marriage factors, then decide whether vargottama is confirming support, mixed evidence, or a care theme.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setFocus("definition");
              setFactor("venus");
              setD1Sign(6);
              setD9Sign(6);
              setCondition("sound");
              setBeneficSupport(true);
              setMaleficStress(false);
              setConditionReadFirst(true);
              setCombinedReading(true);
              setAgencyFrame(true);
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
          {(Object.keys(FOCUS_COPY) as Focus[]).map((mode) => (
            <button key={mode} type="button" aria-pressed={focus === mode} onClick={() => setFocus(mode)} style={buttonStyle(focus === mode, FOCUS_COPY[mode].color)}>
              {FOCUS_COPY[mode].icon}
              {FOCUS_COPY[mode].label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "0.8rem", border: `1px solid ${FOCUS_COPY[focus].color}55`, borderRadius: 8, background: `${FOCUS_COPY[focus].color}10`, padding: "0.85rem" }}>
          <h3 style={{ margin: 0, color: FOCUS_COPY[focus].color, fontSize: "1.12rem" }}>{FOCUS_COPY[focus].title}</h3>
          <p style={bodyTextStyle}>{FOCUS_COPY[focus].body}</p>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Confirmation grade</p>
              <h3 style={{ margin: "0.15rem 0 0", color: tierColor(tier), fontSize: "1.2rem" }}>{tier}</h3>
            </div>
            <strong style={{ color: tierColor(tier) }}>{score}% confidence</strong>
          </div>
          <VargottamaMarriageSvg factor={factor} d1Sign={SIGNS[d1Sign]} d9Sign={SIGNS[d9Sign]} sameSign={sameSign} condition={condition} tier={tier} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 135px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="Factor" body={FACTOR_COPY[factor].role} color={FACTOR_COPY[factor].color} icon={FACTOR_COPY[factor].icon} />
            <MiniFact title="D1-D9" body={sameSign ? "same sign" : "different signs"} color={sameSign ? GREEN : GOLD} icon={<Link2 size={16} />} />
            <MiniFact title="Condition" body={condition} color={conditionColor(condition)} icon={<Scale size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Choose marriage factor" icon={<HeartHandshake size={18} />} color={FACTOR_COPY[factor].color}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
              {(Object.keys(FACTOR_COPY) as Factor[]).map((item) => (
                <button key={item} type="button" aria-pressed={factor === item} onClick={() => setFactor(item)} style={buttonStyle(factor === item, FACTOR_COPY[item].color)}>
                  {FACTOR_COPY[item].icon}
                  {FACTOR_COPY[item].label}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Compare D1 and D9 signs" icon={<GitCompare size={18} />} color={sameSign ? GREEN : GOLD}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))", gap: "0.65rem" }}>
              <SignSelect label="D1 sign" value={d1Sign} onChange={setD1Sign} />
              <SignSelect label="D9 sign" value={d9Sign} onChange={setD9Sign} />
            </div>
            <Toggle active={sameSign} color={sameSign ? GREEN : GOLD} icon={<BadgeCheck size={18} />} title={sameSign ? "Vargottama found" : "Not vargottama"} body={sameSign ? "Surface and depth repeat the sign." : "Same house or same lord would not count here."} onClick={() => setD9Sign(d1Sign)} />
          </Panel>

          <Panel title="Read what is confirmed" icon={<Scale size={18} />} color={conditionColor(condition)}>
            <Segmented label="Actual condition" value={condition} options={[["sound", "Sound"], ["mixed", "Mixed"], ["afflicted", "Afflicted"]]} colors={{ sound: GREEN, mixed: GOLD, afflicted: VERMILION }} onChange={(value) => setCondition(value as Condition)} />
            <Toggle active={beneficSupport} color={beneficSupport ? GREEN : GOLD} icon={<Sparkles size={18} />} title="Benefic support" body={beneficSupport ? "Support is part of the confirmed picture." : "No benefic support selected."} onClick={() => setBeneficSupport((value) => !value)} />
            <Toggle active={maleficStress} color={maleficStress ? GOLD : GREEN} icon={<TriangleAlert size={18} />} title="Affliction or stress" body={maleficStress ? "Stress is included in what gets confirmed." : "No major stress selected."} onClick={() => setMaleficStress((value) => !value)} />
          </Panel>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Method guards</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={conditionReadFirst} color={conditionReadFirst ? GREEN : VERMILION} icon={<Scale size={18} />} title="Condition read first" body={conditionReadFirst ? "Vargottama amplifies the actual condition." : "Vargottama is being treated as automatically auspicious."} onClick={() => setConditionReadFirst((value) => !value)} />
            <Toggle active={combinedReading} color={combinedReading ? GREEN : VERMILION} icon={<GitCompare size={18} />} title="Combined reading" body={combinedReading ? "Used as a modifier inside D1-D9 synthesis." : "Being used as a standalone verdict."} onClick={() => setCombinedReading((value) => !value)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Ethical frame</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={agencyFrame} color={agencyFrame ? GREEN : VERMILION} icon={<ShieldCheck size={18} />} title="Care, not doom" body={agencyFrame ? "Confirmed difficulty is an area to attend to." : "Confirmed difficulty is being overstated."} onClick={() => setAgencyFrame((value) => !value)} />
            <MiniFact title="Question to ask" body="Vargottama confirming what?" color={GOLD} icon={<Orbit size={16} />} />
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: `${tierColor(tier)}66`, background: `${tierColor(tier)}10` }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          <Orbit size={20} color={tierColor(tier)} aria-hidden="true" />
          <div>
            <p style={eyebrowStyle}>Interpretive statement</p>
            <h3 style={{ margin: "0.15rem 0 0", color: tierColor(tier), fontSize: "1.16rem" }}>{tier}</h3>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{interpretation}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function VargottamaMarriageSvg({ factor, d1Sign, d9Sign, sameSign, condition, tier }: { factor: Factor; d1Sign: string; d9Sign: string; sameSign: boolean; condition: Condition; tier: string }) {
  const factorColor = FACTOR_COPY[factor].color;
  const finalColor = tierColor(tier);
  return (
    <svg viewBox="0 0 800 440" role="img" aria-label="Vargottama marriage confirmation diagram" style={{ width: "100%", minHeight: 330, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="764" height="404" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <path d="M 320 150 L 480 150" stroke={sameSign ? GREEN : GOLD} strokeWidth="5" strokeDasharray={sameSign ? "0" : "8 8"} />
      <path d="M 400 202 L 400 232" stroke={factorColor} strokeWidth="3" />
      <rect x="60" y="85" width="260" height="130" rx="8" fill={OPAQUE_LIGHT_FILL[BLUE]} stroke={BLUE} strokeWidth="4" />
      <text x="192" y="127" textAnchor="middle" fill={BLUE} fontSize="16" fontWeight="600">D1 surface</text>
      <text x="192" y="156" textAnchor="middle" fill={INK_SECONDARY} fontSize="13">{FACTOR_COPY[factor].label}</text>
      <text x="192" y="184" textAnchor="middle" fill={INK_MUTED} fontSize="13">{d1Sign}</text>

      <rect x="480" y="85" width="260" height="130" rx="8" fill={OPAQUE_LIGHT_FILL[PURPLE]} stroke={PURPLE} strokeWidth="4" />
      <text x="588" y="127" textAnchor="middle" fill={PURPLE} fontSize="16" fontWeight="600">D9 depth</text>
      <text x="588" y="156" textAnchor="middle" fill={INK_SECONDARY} fontSize="13">{FACTOR_COPY[factor].label}</text>
      <text x="588" y="184" textAnchor="middle" fill={INK_MUTED} fontSize="13">{d9Sign}</text>

      <circle cx="400" cy="150" r="52" fill={OPAQUE_LIGHT_FILL[sameSign ? GREEN : GOLD]} stroke={sameSign ? GREEN : GOLD} strokeWidth="4" />
      <text x="400" y="143" textAnchor="middle" fill={sameSign ? GREEN : GOLD} fontSize="14" fontWeight="600">{sameSign ? "SAME SIGN" : "DIFFER"}</text>
      <text x="400" y="165" textAnchor="middle" fill={INK_MUTED} fontSize="11.5">{sameSign ? "vargottama" : "not vargottama"}</text>

      <circle cx="400" cy="290" r="68" fill={OPAQUE_LIGHT_FILL[conditionColor(condition)]} stroke={conditionColor(condition)} strokeWidth="4" />
      <text x="400" y="282" textAnchor="middle" fill={conditionColor(condition)} fontSize="15" fontWeight="600">{condition.toUpperCase()}</text>
      <text x="400" y="306" textAnchor="middle" fill={INK_MUTED} fontSize="12">read condition first</text>

      <rect x="200" y="370" width="400" height="44" rx="8" fill={OPAQUE_LIGHT_FILL[finalColor]} stroke={finalColor} />
      <text x="390" y="397" textAnchor="middle" fill={finalColor} fontSize="15" fontWeight="600">{tier.toUpperCase()}</text>
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ ...cardStyle, padding: "0.9rem" }}>
      <div style={{ display: "flex", gap: "0.55rem", alignItems: "center", color }}>
        {icon}
        <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>{title}</h3>
      </div>
      <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function Toggle({ active, color, icon, title, body, onClick }: { active: boolean; color: string; icon: ReactNode; title: string; body: string; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} style={toggleStyle(active, color)}>
      <span style={{ color }}>{icon}</span>
      <span>
        <strong style={{ fontWeight: 700 }}>{title}</strong>
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
        <strong style={{ fontSize: "0.86rem", fontWeight: 700 }}>{title}</strong>
      </div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.35 }}>{body}</p>
    </div>
  );
}

function SignSelect({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label style={{ display: "grid", gap: "0.35rem", color: INK_MUTED, fontWeight: 600, fontSize: "0.82rem" }}>
      {label}
      <select value={value} onChange={(event) => onChange(Number(event.target.value))} style={selectStyle}>
        {SIGNS.map((sign, index) => (
          <option key={sign} value={index}>
            {sign}
          </option>
        ))}
      </select>
    </label>
  );
}

function Segmented({ label, value, options, colors, onChange }: { label: string; value: string; options: Array<[string, string]>; colors: Record<string, string>; onChange: (value: string) => void }) {
  return (
    <div>
      <p style={{ ...eyebrowStyle, marginBottom: "0.45rem" }}>{label}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
        {options.map(([key, text]) => (
          <button key={key} type="button" aria-pressed={value === key} onClick={() => onChange(key)} style={buttonStyle(value === key, colors[key])}>
            {text}
          </button>
        ))}
      </div>
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
  gridTemplateColumns: "minmax(360px, 1.25fr) minmax(320px, 1fr)",
  gap: "1rem",
};

const selectStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: "rgba(255,251,241,0.72)",
  color: INK_PRIMARY,
  padding: "0.58rem 0.68rem",
  fontWeight: 600,
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

function conditionScore(condition: Condition): number {
  if (condition === "sound") return 24;
  if (condition === "mixed") return 14;
  return 6;
}

function conditionColor(condition: Condition): string {
  if (condition === "sound") return GREEN;
  if (condition === "mixed") return GOLD;
  return VERMILION;
}

function tierColor(tier: string): string {
  if (tier === "confirmed support") return GREEN;
  if (tier === "confirmed mixed factor") return BLUE;
  if (tier === "not vargottama") return GOLD;
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
