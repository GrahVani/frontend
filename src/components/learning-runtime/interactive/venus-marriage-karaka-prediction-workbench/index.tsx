"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, GitCompare, HeartHandshake, Orbit, RotateCcw, Scale, ShieldCheck, Sparkles, TriangleAlert, Venus } from "lucide-react";

type Layer = "significations" | "alongside" | "trap" | "nuance";
type Strength = "strong" | "moderate" | "weak";

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

const LAYER_COPY: Record<Layer, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  significations: {
    label: "Venus",
    title: "Venus is the kalatra-karaka",
    body: "Read Venus for spouse-relationship, love, affection, harmony, refinement, pleasure, desire, and the capacity for relational grace.",
    icon: <Venus size={16} />,
    color: PURPLE,
  },
  alongside: {
    label: "Layers",
    title: "Karaka is read alongside the 7th and D9",
    body: "The 7th gives the structural promise, the D9 gives depth, and Venus qualifies the affective quality.",
    icon: <GitCompare size={16} />,
    color: BLUE,
  },
  trap: {
    label: "Trap",
    title: "One karaka is not the marriage",
    body: "Weak Venus is not no marriage or no love. Strong Venus is not guaranteed bliss if the 7th and D9 are stressed.",
    icon: <TriangleAlert size={16} />,
    color: GOLD,
  },
  nuance: {
    label: "Nuance",
    title: "Classical conventions need respectful framing",
    body: "Venus remains central to love and spouse-relationship for every chart; Jupiter's husband-karaka convention is noted without rigid stereotyping.",
    icon: <ShieldCheck size={16} />,
    color: GREEN,
  },
};

export function VenusMarriageKarakaPredictionWorkbench() {
  const [layer, setLayer] = useState<Layer>("significations");
  const [venusStrength, setVenusStrength] = useState<Strength>("moderate");
  const [seventhStrength, setSeventhStrength] = useState<Strength>("strong");
  const [d9Strength, setD9Strength] = useState<Strength>("strong");
  const [readAlongside, setReadAlongside] = useState(true);
  const [promiseQualitySeparated, setPromiseQualitySeparated] = useState(true);
  const [weakVenusAgency, setWeakVenusAgency] = useState(true);
  const [strongVenusNotBliss, setStrongVenusNotBliss] = useState(true);
  const [genderNuance, setGenderNuance] = useState(true);

  const methodOk = readAlongside && promiseQualitySeparated && weakVenusAgency && strongVenusNotBliss && genderNuance;
  const structuralScore = strengthScore(seventhStrength) + strengthScore(d9Strength);
  const venusScore = strengthScore(venusStrength);
  const score = Math.max(
    5,
    Math.min(
      98,
      structuralScore +
        venusScore +
        (readAlongside ? 12 : -22) +
        (promiseQualitySeparated ? 10 : -18) +
        (weakVenusAgency ? 10 : -22) +
        (strongVenusNotBliss ? 8 : -14) +
        (genderNuance ? 8 : -12),
    ),
  );

  const tier = useMemo(() => {
    if (!methodOk) return "method warning";
    if (seventhStrength !== "weak" && d9Strength !== "weak" && venusStrength === "weak") return "strong promise, Venus care";
    if (seventhStrength === "weak" || d9Strength === "weak") return "qualified promise";
    if (venusStrength === "strong" && seventhStrength === "strong" && d9Strength === "strong") return "well-supported";
    return "qualified support";
  }, [d9Strength, methodOk, seventhStrength, venusStrength]);

  const interpretation = useMemo(() => {
    if (!readAlongside) return "Pause: Venus is being read instead of the 7th and D9. Restore the layer-not-substitute method.";
    if (!promiseQualitySeparated) return "Pause: promise and affective quality are being conflated. Read marriage promise from the 7th and D9; let Venus qualify warmth and harmony.";
    if (!weakVenusAgency) return "Pause: weak Venus is becoming a no-love verdict. Frame it as affection and harmony to nurture.";
    if (!strongVenusNotBliss) return "Pause: strong Venus is being overstated. It supports love and harmony but cannot override stressed 7th or D9 factors.";
    if (!genderNuance) return "Pause: the Venus/Jupiter convention is being handled rigidly. Keep the language respectful and non-stereotyping.";
    if (seventhStrength !== "weak" && d9Strength !== "weak" && venusStrength === "weak") return "The structural promise is carried by the 7th and D9, while Venus marks affection and harmony as a dimension to nurture. This is not no marriage or no love.";
    if (seventhStrength === "weak" || d9Strength === "weak") return "The structure needs qualification. Venus can support the affective register, but the 7th and D9 still lower confidence in the promise.";
    if (venusStrength === "strong") return "Venus strongly supports the affective soul of the marriage, and the 7th/D9 structure is sound. State this as well-supported, not guaranteed bliss.";
    return "Venus gives a moderate affective register within a sound structural promise. The reading is supportive, with warmth and harmony named as something to cultivate.";
  }, [d9Strength, genderNuance, promiseQualitySeparated, readAlongside, seventhStrength, strongVenusNotBliss, venusStrength, weakVenusAgency]);

  return (
    <div data-interactive="venus-marriage-karaka-prediction-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Venus at prediction stakes</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.35rem" }}>Let Venus qualify, not decree</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 920 }}>
              Compare the marriage karaka with the 7th house and D9 so the reading separates structural promise from love-and-harmony quality.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setLayer("significations");
              setVenusStrength("moderate");
              setSeventhStrength("strong");
              setD9Strength("strong");
              setReadAlongside(true);
              setPromiseQualitySeparated(true);
              setWeakVenusAgency(true);
              setStrongVenusNotBliss(true);
              setGenderNuance(true);
            }}
            style={buttonStyle(false, PURPLE)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(Object.keys(LAYER_COPY) as Layer[]).map((mode) => (
            <button key={mode} type="button" aria-pressed={layer === mode} onClick={() => setLayer(mode)} style={buttonStyle(layer === mode, LAYER_COPY[mode].color)}>
              {LAYER_COPY[mode].icon}
              {LAYER_COPY[mode].label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "0.8rem", border: `1px solid ${LAYER_COPY[layer].color}55`, borderRadius: 8, background: `${LAYER_COPY[layer].color}10`, padding: "0.85rem" }}>
          <h3 style={{ margin: 0, color: LAYER_COPY[layer].color, fontSize: "1.12rem" }}>{LAYER_COPY[layer].title}</h3>
          <p style={bodyTextStyle}>{LAYER_COPY[layer].body}</p>
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Combined reading</p>
              <h3 style={{ margin: "0.15rem 0 0", color: tierColor(tier), fontSize: "1.2rem" }}>{tier}</h3>
            </div>
            <strong style={{ color: tierColor(tier) }}>{score}% confidence</strong>
          </div>
          <VenusKarakaSvg venusStrength={venusStrength} seventhStrength={seventhStrength} d9Strength={d9Strength} methodOk={methodOk} tier={tier} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 135px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="7th/D9 promise" body={seventhStrength === "weak" || d9Strength === "weak" ? "qualified" : "supported"} color={seventhStrength === "weak" || d9Strength === "weak" ? GOLD : GREEN} icon={<HeartHandshake size={16} />} />
            <MiniFact title="Venus quality" body={venusStrength} color={strengthColor(venusStrength)} icon={<Venus size={16} />} />
            <MiniFact title="Method" body={methodOk ? "combined" : "warning"} color={methodOk ? GREEN : VERMILION} icon={<Scale size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Set the three layers" icon={<GitCompare size={18} />} color={BLUE}>
            <Segmented label="7th house and lord promise" value={seventhStrength} options={[["strong", "Strong"], ["moderate", "Moderate"], ["weak", "Weak"]]} colors={{ strong: GREEN, moderate: GOLD, weak: VERMILION }} onChange={(value) => setSeventhStrength(value as Strength)} />
            <Segmented label="D9 depth promise" value={d9Strength} options={[["strong", "Strong"], ["moderate", "Moderate"], ["weak", "Weak"]]} colors={{ strong: GREEN, moderate: GOLD, weak: VERMILION }} onChange={(value) => setD9Strength(value as Strength)} />
            <Segmented label="Venus affective quality" value={venusStrength} options={[["strong", "Strong"], ["moderate", "Moderate"], ["weak", "Weak"]]} colors={{ strong: GREEN, moderate: GOLD, weak: VERMILION }} onChange={(value) => setVenusStrength(value as Strength)} />
          </Panel>

          <Panel title="Layer discipline" icon={<Scale size={18} />} color={readAlongside && promiseQualitySeparated ? GREEN : VERMILION}>
            <Toggle active={readAlongside} color={readAlongside ? GREEN : VERMILION} icon={<BadgeCheck size={18} />} title="Venus read alongside" body={readAlongside ? "Karaka, 7th, and D9 are all in the reading." : "Venus is replacing the 7th/D9."} onClick={() => setReadAlongside((value) => !value)} />
            <Toggle active={promiseQualitySeparated} color={promiseQualitySeparated ? GREEN : VERMILION} icon={<Orbit size={18} />} title="Promise and quality separated" body={promiseQualitySeparated ? "7th/D9 promise is distinct from Venus quality." : "Promise and quality are being conflated."} onClick={() => setPromiseQualitySeparated((value) => !value)} />
          </Panel>
        </section>
      </div>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Single-karaka guardrails</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={weakVenusAgency} color={weakVenusAgency ? GREEN : VERMILION} icon={<ShieldCheck size={18} />} title="Weak Venus is care" body={weakVenusAgency ? "Affection and harmony are framed as areas to nurture." : "Weak Venus is being read as no love."} onClick={() => setWeakVenusAgency((value) => !value)} />
            <Toggle active={strongVenusNotBliss} color={strongVenusNotBliss ? GREEN : VERMILION} icon={<Sparkles size={18} />} title="Strong Venus is not guaranteed bliss" body={strongVenusNotBliss ? "Strong Venus supports, but does not override all layers." : "Strong Venus is being over-claimed."} onClick={() => setStrongVenusNotBliss((value) => !value)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Nuanced convention</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={genderNuance} color={genderNuance ? GREEN : VERMILION} icon={<HeartHandshake size={18} />} title="Gender convention handled with nuance" body={genderNuance ? "Venus remains love/spouse relationship karaka for every chart." : "Karaka convention is being applied rigidly."} onClick={() => setGenderNuance((value) => !value)} />
            <MiniFact title="Output rule" body="Venus qualifies the affective register." color={PURPLE} icon={<Venus size={16} />} />
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: `${tierColor(tier)}66`, background: `${tierColor(tier)}10` }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          <Scale size={20} color={tierColor(tier)} aria-hidden="true" />
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

function VenusKarakaSvg({ venusStrength, seventhStrength, d9Strength, methodOk, tier }: { venusStrength: Strength; seventhStrength: Strength; d9Strength: Strength; methodOk: boolean; tier: string }) {
  const finalColor = tierColor(tier);
  return (
    <svg viewBox="0 0 780 420" role="img" aria-label="Venus karaka alongside seventh house and D9 diagram" style={{ width: "100%", minHeight: 315, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="744" height="384" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <path d="M 222 138 L 332 138 M 448 138 L 558 138" stroke={methodOk ? GREEN : VERMILION} strokeWidth="4" strokeDasharray={methodOk ? "0" : "8 8"} />
      <circle cx="164" cy="138" r="58" fill={OPAQUE_LIGHT_FILL[strengthColor(seventhStrength)]} stroke={strengthColor(seventhStrength)} strokeWidth="3" />
      <text x="164" y="124" textAnchor="middle" fill={strengthColor(seventhStrength)} fontSize="17" fontWeight="700">7th House</text>
      <text x="164" y="151" textAnchor="middle" fill={INK_MUTED} fontSize="13">promise: {seventhStrength}</text>

      <circle cx="390" cy="138" r="58" fill={OPAQUE_LIGHT_FILL[strengthColor(d9Strength)]} stroke={strengthColor(d9Strength)} strokeWidth="3" />
      <text x="390" y="124" textAnchor="middle" fill={strengthColor(d9Strength)} fontSize="17" fontWeight="700">D9</text>
      <text x="390" y="151" textAnchor="middle" fill={INK_MUTED} fontSize="13">depth: {d9Strength}</text>

      <circle cx="616" cy="138" r="58" fill={OPAQUE_LIGHT_FILL[strengthColor(venusStrength)]} stroke={strengthColor(venusStrength)} strokeWidth="3" />
      <text x="616" y="124" textAnchor="middle" fill={strengthColor(venusStrength)} fontSize="17" fontWeight="700">Venus</text>
      <text x="616" y="151" textAnchor="middle" fill={INK_MUTED} fontSize="13">quality: {venusStrength}</text>

      <circle cx="390" cy="278" r="58" fill={OPAQUE_LIGHT_FILL[finalColor]} stroke={finalColor} strokeWidth="3" />
      <text x="390" y="263" textAnchor="middle" fill={finalColor} fontSize="16" fontWeight="700">{methodOk ? "COMBINE" : "WARNING"}</text>
      <text x="390" y="289" textAnchor="middle" fill={INK_MUTED} fontSize="13">promise + depth + quality</text>
      <rect x="126" y="350" width="528" height="30" rx="8" fill={OPAQUE_LIGHT_FILL[PURPLE]} stroke={HAIRLINE} />
      <text x="390" y="370" textAnchor="middle" fill={INK_MUTED} fontSize="13">Venus qualifies love and harmony; it does not replace the 7th or D9.</text>
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

const responsiveTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
  gap: "1rem",
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

function strengthScore(strength: Strength): number {
  if (strength === "strong") return 20;
  if (strength === "moderate") return 12;
  return 4;
}

function strengthColor(strength: Strength): string {
  if (strength === "strong") return GREEN;
  if (strength === "moderate") return GOLD;
  return VERMILION;
}

function tierColor(tier: string): string {
  if (tier === "well-supported") return GREEN;
  if (tier === "strong promise, Venus care") return GOLD;
  if (tier === "qualified support") return BLUE;
  if (tier === "qualified promise") return GOLD;
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
    fontWeight: 700,
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
