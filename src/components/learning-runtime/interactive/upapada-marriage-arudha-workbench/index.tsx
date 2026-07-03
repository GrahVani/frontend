"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, GitCompare, HeartHandshake, MapPinned, Orbit, RotateCcw, Route, Scale, ShieldCheck, TriangleAlert } from "lucide-react";

type Focus = "compute" | "meaning" | "compare" | "frame";
type Support = "strong" | "mixed" | "stressed";

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

const FOCUS_COPY: Record<Focus, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  compute: {
    label: "Compute",
    title: "UL is the arudha of the 12th",
    body: "Find the 12th house, count to its lord, count the same distance onward, then apply the arudha exceptions.",
    icon: <Route size={16} />,
    color: BLUE,
  },
  meaning: {
    label: "Meaning",
    title: "UL is the Jaimini marriage image",
    body: "It shows how spouse, marriage, and partnership manifest as an arudha register, distinct from the Parashari 7th.",
    icon: <MapPinned size={16} />,
    color: PURPLE,
  },
  compare: {
    label: "Compare",
    title: "Use UL as an independent corroborating stream",
    body: "Convergence with 7th/D9/Venus raises confidence. Divergence is named and investigated.",
    icon: <GitCompare size={16} />,
    color: GREEN,
  },
  frame: {
    label: "Frame",
    title: "A stressed UL is care with agency",
    body: "UL does not become a standalone oracle. Stress is a manifest-marriage theme to tend, not a failure decree.",
    icon: <ShieldCheck size={16} />,
    color: GOLD,
  },
};

export function UpapadaMarriageArudhaWorkbench() {
  const [focus, setFocus] = useState<Focus>("compute");
  const [twelfthLordDistance, setTwelfthLordDistance] = useState(5);
  const [exceptionApplied, setExceptionApplied] = useState(true);
  const [ulCondition, setUlCondition] = useState<Support>("strong");
  const [parashariReading, setParashariReading] = useState<Support>("strong");
  const [ulLordIncluded, setUlLordIncluded] = useState(true);
  const [readAsJaimini, setReadAsJaimini] = useState(true);
  const [layerNotSubstitute, setLayerNotSubstitute] = useState(true);
  const [agencyFrame, setAgencyFrame] = useState(true);

  const ulOffset = exceptionApplied && (twelfthLordDistance === 1 || twelfthLordDistance === 7) ? 10 : twelfthLordDistance;
  const converges = ulCondition === parashariReading;
  const methodOk = exceptionApplied && ulLordIncluded && readAsJaimini && layerNotSubstitute && agencyFrame;
  const score = Math.max(
    5,
    Math.min(
      98,
      supportScore(ulCondition) +
        supportScore(parashariReading) +
        (converges ? 16 : 0) +
        (ulLordIncluded ? 8 : -12) +
        (readAsJaimini ? 10 : -16) +
        (layerNotSubstitute ? 10 : -20) +
        (agencyFrame ? 10 : -24) +
        (exceptionApplied ? 8 : -14),
    ),
  );

  const tier = useMemo(() => {
    if (!methodOk) return "method warning";
    if (converges && ulCondition === "strong") return "two-stream confirmation";
    if (!converges) return "named divergence";
    if (ulCondition === "stressed") return "shared care theme";
    return "qualified support";
  }, [converges, methodOk, ulCondition]);

  const interpretation = useMemo(() => {
    if (!exceptionApplied) return "Pause: the arudha exceptions have not been checked. Same-house or 7th-from-source results need the standard 10th adjustment.";
    if (!ulLordIncluded) return "Pause: the UL sign is not enough. Include the UL lord and influences before judging the Jaimini register.";
    if (!readAsJaimini) return "Pause: the UL is being forced into Parashari logic. Read it in Jaimini terms first, then combine.";
    if (!layerNotSubstitute) return "Pause: the UL is replacing the 7th, D9, and Venus. Use it as an independent corroborating stream.";
    if (!agencyFrame) return "Pause: a stressed UL is becoming a failure verdict. Restore the care-with-agency frame.";
    if (converges && ulCondition === "strong") return "The Parashari/Venus picture and the independently-computed UL both support marriage. This is two-stream confirmation, so confidence rises.";
    if (!converges) return "The UL and Parashari/Venus reading diverge. Name the tension: one stream is qualifying the other, and the next step is to investigate the UL lord and context.";
    if (ulCondition === "stressed") return "Both streams point to a care theme. State the pressure clearly, but frame it as something to tend within the whole reading.";
    return "The UL gives qualified support. Keep it independent, combine with the 7th/D9/Venus, and state confidence modestly.";
  }, [agencyFrame, converges, exceptionApplied, layerNotSubstitute, readAsJaimini, ulCondition, ulLordIncluded]);

  return (
    <div data-interactive="upapada-marriage-arudha-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Upapada marriage arudha</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.35rem" }}>Compute the UL, then corroborate</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 920 }}>
              Practice the UL as the arudha of the 12th: independently computed, read in Jaimini terms, and compared with the 7th, D9, and Venus.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setFocus("compute");
              setTwelfthLordDistance(5);
              setExceptionApplied(true);
              setUlCondition("strong");
              setParashariReading("strong");
              setUlLordIncluded(true);
              setReadAsJaimini(true);
              setLayerNotSubstitute(true);
              setAgencyFrame(true);
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

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Corroboration grade</p>
              <h3 style={{ margin: "0.15rem 0 0", color: tierColor(tier), fontSize: "1.2rem" }}>{tier}</h3>
            </div>
            <strong style={{ color: tierColor(tier) }}>{score}% confidence</strong>
          </div>
          <UpapadaSvg distance={twelfthLordDistance} offset={ulOffset} ulCondition={ulCondition} parashariReading={parashariReading} tier={tier} methodOk={methodOk} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 135px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="UL register" body={ulCondition} color={supportColor(ulCondition)} icon={<MapPinned size={16} />} />
            <MiniFact title="7th/D9/Venus" body={parashariReading} color={supportColor(parashariReading)} icon={<HeartHandshake size={16} />} />
            <MiniFact title="Stream result" body={converges ? "converges" : "diverges"} color={converges ? GREEN : GOLD} icon={<GitCompare size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Compute the UL" icon={<Route size={18} />} color={BLUE}>
            <label style={{ display: "grid", gap: "0.45rem", color: INK_SECONDARY, fontWeight: 600 }}>
              12th lord distance: {twelfthLordDistance} sign{twelfthLordDistance === 1 ? "" : "s"}
              <input type="range" min={1} max={12} step={1} value={twelfthLordDistance} onChange={(event) => setTwelfthLordDistance(Number(event.target.value))} style={{ width: "100%", accentColor: BLUE }} />
            </label>
            <MiniFact title="UL count" body={`Count ${ulOffset} onward from the 12th lord`} color={BLUE} icon={<Orbit size={16} />} />
            <Toggle active={exceptionApplied} color={exceptionApplied ? GREEN : VERMILION} icon={<BadgeCheck size={18} />} title="Arudha exceptions checked" body={exceptionApplied ? "Same-house/7th cases are handled." : "Exception check is missing."} onClick={() => setExceptionApplied((value) => !value)} />
          </Panel>

          <Panel title="Read and compare" icon={<Scale size={18} />} color={converges ? GREEN : GOLD}>
            <Segmented label="UL condition" value={ulCondition} options={[["strong", "Strong"], ["mixed", "Mixed"], ["stressed", "Stressed"]]} colors={{ strong: GREEN, mixed: GOLD, stressed: VERMILION }} onChange={(value) => setUlCondition(value as Support)} />
            <Segmented label="Parashari/Venus reading" value={parashariReading} options={[["strong", "Strong"], ["mixed", "Mixed"], ["stressed", "Stressed"]]} colors={{ strong: GREEN, mixed: GOLD, stressed: VERMILION }} onChange={(value) => setParashariReading(value as Support)} />
            <Toggle active={ulLordIncluded} color={ulLordIncluded ? GREEN : VERMILION} icon={<MapPinned size={18} />} title="UL lord included" body={ulLordIncluded ? "UL sign, lord, and influences are included." : "UL sign is being read alone."} onClick={() => setUlLordIncluded((value) => !value)} />
          </Panel>
        </section>
      </div>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Stream discipline</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={readAsJaimini} color={readAsJaimini ? GREEN : VERMILION} icon={<Route size={18} />} title="Read in Jaimini terms" body={readAsJaimini ? "UL is not forced into Parashari house logic." : "UL is being forced into another stream."} onClick={() => setReadAsJaimini((value) => !value)} />
            <Toggle active={layerNotSubstitute} color={layerNotSubstitute ? GREEN : VERMILION} icon={<GitCompare size={18} />} title="Layer, not substitute" body={layerNotSubstitute ? "UL corroborates the 7th/D9/Venus." : "UL is replacing the other layers."} onClick={() => setLayerNotSubstitute((value) => !value)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Ethical frame</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={agencyFrame} color={agencyFrame ? GREEN : VERMILION} icon={<ShieldCheck size={18} />} title="Stressed UL is care" body={agencyFrame ? "Stress is framed as a manifest-marriage theme to tend." : "Stress is becoming failure language."} onClick={() => setAgencyFrame((value) => !value)} />
            <MiniFact title="Core rule" body="UL corroborates; it does not decree alone." color={GOLD} icon={<TriangleAlert size={16} />} />
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: `${tierColor(tier)}66`, background: `${tierColor(tier)}10` }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          <HeartHandshake size={20} color={tierColor(tier)} aria-hidden="true" />
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

function UpapadaSvg({ distance, offset, ulCondition, parashariReading, tier, methodOk }: { distance: number; offset: number; ulCondition: Support; parashariReading: Support; tier: string; methodOk: boolean }) {
  const finalColor = tierColor(tier);
  return (
    <svg viewBox="0 0 780 420" role="img" aria-label="Upapada Lagna computation and comparison diagram" style={{ width: "100%", minHeight: 315, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="744" height="384" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <path d="M 222 120 L 314 120 M 464 120 L 556 120" stroke={methodOk ? BLUE : VERMILION} strokeWidth="4" strokeDasharray={methodOk ? "0" : "8 8"} />
      <path d="M 334 252 L 446 252" stroke={finalColor} strokeWidth="4" strokeDasharray={ulCondition === parashariReading ? "0" : "8 8"} />
      <rect x="72" y="82" width="150" height="76" rx="8" fill={OPAQUE_LIGHT_FILL[BLUE]} stroke={BLUE} strokeWidth="3" />
      <text x="147" y="112" textAnchor="middle" fill={BLUE} fontSize="13" fontWeight="700">12th House</text>
      <text x="147" y="135" textAnchor="middle" fill={INK_MUTED} fontSize="10.5">source</text>
      <rect x="314" y="82" width="150" height="76" rx="8" fill={OPAQUE_LIGHT_FILL[PURPLE]} stroke={PURPLE} strokeWidth="3" />
      <text x="389" y="112" textAnchor="middle" fill={PURPLE} fontSize="13" fontWeight="700">12th Lord</text>
      <text x="389" y="135" textAnchor="middle" fill={INK_MUTED} fontSize="10.5">distance {distance}</text>
      <rect x="556" y="82" width="150" height="76" rx="8" fill={OPAQUE_LIGHT_FILL[supportColor(ulCondition)]} stroke={supportColor(ulCondition)} strokeWidth="3" />
      <text x="631" y="112" textAnchor="middle" fill={supportColor(ulCondition)} fontSize="13" fontWeight="700">UL</text>
      <text x="631" y="135" textAnchor="middle" fill={INK_MUTED} fontSize="10.5">offset {offset}: {ulCondition}</text>
      <circle cx="280" cy="252" r="54" fill={OPAQUE_LIGHT_FILL[supportColor(parashariReading)]} stroke={supportColor(parashariReading)} strokeWidth="3" />
      <text x="280" y="240" textAnchor="middle" fill={supportColor(parashariReading)} fontSize="13" fontWeight="700">7th/D9</text>
      <text x="280" y="263" textAnchor="middle" fill={INK_MUTED} fontSize="10.5">{parashariReading}</text>
      <circle cx="500" cy="252" r="54" fill={OPAQUE_LIGHT_FILL[supportColor(ulCondition)]} stroke={supportColor(ulCondition)} strokeWidth="3" />
      <text x="500" y="240" textAnchor="middle" fill={supportColor(ulCondition)} fontSize="13" fontWeight="700">UL Stream</text>
      <text x="500" y="263" textAnchor="middle" fill={INK_MUTED} fontSize="10.5">{ulCondition}</text>
      <rect x="222" y="348" width="336" height="36" rx="8" fill={OPAQUE_LIGHT_FILL[finalColor]} stroke={finalColor} />
      <text x="390" y="371" textAnchor="middle" fill={finalColor} fontSize="13" fontWeight="700">{tier.toUpperCase()}</text>
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
    <div style={{ marginBottom: "0.75rem" }}>
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

function supportScore(support: Support): number {
  if (support === "strong") return 22;
  if (support === "mixed") return 14;
  return 6;
}

function supportColor(support: Support): string {
  if (support === "strong") return GREEN;
  if (support === "mixed") return GOLD;
  return VERMILION;
}

function tierColor(tier: string): string {
  if (tier === "two-stream confirmation") return GREEN;
  if (tier === "qualified support") return BLUE;
  if (tier === "named divergence") return GOLD;
  if (tier === "shared care theme") return GOLD;
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
