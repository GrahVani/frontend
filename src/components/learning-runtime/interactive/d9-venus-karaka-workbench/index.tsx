"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, CircleDot, GitCompare, HeartHandshake, Orbit, RotateCcw, Scale, ShieldCheck, Sparkles, TriangleAlert, Venus } from "lucide-react";

type Dignity = "exalted" | "own" | "neutral" | "debilitated";
type Support = "strong" | "mixed" | "weak";
type Focus = "karaka" | "dignity" | "net" | "context";

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
  karaka: {
    label: "Karaka",
    title: "Venus is the marriage karaka inside the marriage chart",
    body: "This is the double-weight premise: Venus signifies affection and marriage, and the D9 refines marriage at depth.",
    icon: <Venus size={16} />,
    color: PURPLE,
  },
  dignity: {
    label: "Dignity",
    title: "Dignity sets the base condition of D9 Venus",
    body: "Exalted, own, friendly, neutral, and debilitated Venus are read as strength or care themes, never as a standalone verdict.",
    icon: <CircleDot size={16} />,
    color: BLUE,
  },
  net: {
    label: "Net",
    title: "Aspects and conjunctions change the net",
    body: "Jupiter protection, benefic support, malefic pressure, and Sun-related karaka pollution all modify the D9 Venus reading.",
    icon: <Scale size={16} />,
    color: GOLD,
  },
  context: {
    label: "Context",
    title: "D9 Venus must be combined with D1 Venus and the 7th",
    body: "Vargottama confirms. Neecha-bhanga can cancel debility. D1 context turns one factor into a confidence-graded reading.",
    icon: <GitCompare size={16} />,
    color: GREEN,
  },
};

export function D9VenusKarakaWorkbench() {
  const [focus, setFocus] = useState<Focus>("karaka");
  const [dignity, setDignity] = useState<Dignity>("own");
  const [d1Venus, setD1Venus] = useState<Support>("strong");
  const [seventhContext, setSeventhContext] = useState<Support>("strong");
  const [jupiterAspect, setJupiterAspect] = useState(true);
  const [maleficStress, setMaleficStress] = useState(false);
  const [vargottama, setVargottama] = useState(true);
  const [neechaBhanga, setNeechaBhanga] = useState(false);
  const [d1Combined, setD1Combined] = useState(true);
  const [agencyFrame, setAgencyFrame] = useState(true);

  const dignityBase = dignityScore(dignity);
  const cancellationActive = dignity === "debilitated" && neechaBhanga;
  const methodOk = d1Combined && agencyFrame;
  const score = Math.max(
    6,
    Math.min(
      98,
      dignityBase +
        supportScore(d1Venus) +
        supportScore(seventhContext) +
        (jupiterAspect ? 12 : 0) +
        (vargottama ? 12 : 0) +
        (cancellationActive ? 18 : 0) -
        (maleficStress ? 12 : 0) +
        (d1Combined ? 8 : -18) +
        (agencyFrame ? 8 : -24),
    ),
  );

  const tier = useMemo(() => {
    if (!methodOk) return "method warning";
    if (dignity === "debilitated" && !neechaBhanga) return "care theme";
    if ((dignity === "exalted" || dignity === "own") && vargottama && jupiterAspect && d1Venus === "strong") return "confirmed karaka";
    if (d1Venus === "weak" || seventhContext === "weak" || maleficStress) return "qualified support";
    return "balanced support";
  }, [d1Venus, dignity, jupiterAspect, maleficStress, methodOk, neechaBhanga, seventhContext, vargottama]);

  const interpretation = useMemo(() => {
    if (!d1Combined) return "Pause: D9 Venus is being read alone. Combine it with D1 Venus, the D9 Lagna and 7th, and the D1 7th before giving confidence.";
    if (!agencyFrame) return "Pause: the reading has become fatalistic. Restore the lesson rule: weak D9 Venus names affection and harmony as an area to nurture.";
    if (dignity === "debilitated" && neechaBhanga) return "D9 Venus is debilitated, but neecha-bhanga is active. Treat the debility as modified, then weigh aspects and the D1 before grading confidence.";
    if (dignity === "debilitated") return "D9 Venus is debilitated without cancellation selected. This is a care theme for affection and harmony, not a loveless-marriage decree.";
    if ((dignity === "exalted" || dignity === "own") && vargottama && jupiterAspect) return "D9 Venus is dignified, confirmed, and protected. This is a strong positive signal for affection and harmony, still stated within the combined D1-D9 reading.";
    if (maleficStress) return "D9 Venus has stress in the net. Name the pressure, then balance it against dignity, Jupiter support, vargottama, neecha-bhanga, and the D1.";
    return "D9 Venus is workable. Read dignity, house expression, conjunctions and aspects, then combine with D1 Venus and the 7th into a confidence-graded statement.";
  }, [agencyFrame, d1Combined, dignity, jupiterAspect, maleficStress, neechaBhanga, vargottama]);

  return (
    <div data-interactive="d9-venus-karaka-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>D9 Venus workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.35rem" }}>Weigh the marriage karaka in the marriage chart</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 920 }}>
              Test dignity, vargottama, aspects, neecha-bhanga, and D1 context before turning D9 Venus into an interpretive statement.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setFocus("karaka");
              setDignity("own");
              setD1Venus("strong");
              setSeventhContext("strong");
              setJupiterAspect(true);
              setMaleficStress(false);
              setVargottama(true);
              setNeechaBhanga(false);
              setD1Combined(true);
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
              <p style={eyebrowStyle}>Confidence grade</p>
              <h3 style={{ margin: "0.15rem 0 0", color: tierColor(tier), fontSize: "1.2rem" }}>{tier}</h3>
            </div>
            <strong style={{ color: tierColor(tier) }}>{score}% support</strong>
          </div>
          <D9VenusSvg dignity={dignity} d1Venus={d1Venus} seventhContext={seventhContext} tier={tier} jupiterAspect={jupiterAspect} maleficStress={maleficStress} vargottama={vargottama} cancellationActive={cancellationActive} methodOk={methodOk} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 135px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="D9 dignity" body={dignityLabel(dignity)} color={dignityColor(dignity)} icon={<Venus size={16} />} />
            <MiniFact title="D1 Venus" body={d1Venus} color={supportColor(d1Venus)} icon={<GitCompare size={16} />} />
            <MiniFact title="7th context" body={seventhContext} color={supportColor(seventhContext)} icon={<HeartHandshake size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="D9 Venus condition" icon={<Venus size={18} />} color={dignityColor(dignity)}>
            <Segmented
              label="Dignity in D9"
              value={dignity}
              options={[
                ["exalted", "Exalted"],
                ["own", "Own"],
                ["neutral", "Neutral"],
                ["debilitated", "Debilitated"],
              ]}
              colors={{ exalted: GREEN, own: GREEN, neutral: BLUE, debilitated: VERMILION }}
              onChange={(value) => setDignity(value as Dignity)}
            />
            <Toggle active={vargottama} color={vargottama ? GREEN : GOLD} icon={<BadgeCheck size={18} />} title="Vargottama checked" body={vargottama ? "D1 and D9 Venus confirm the same sign." : "No same-sign confirmation selected."} onClick={() => setVargottama((value) => !value)} />
            <Toggle active={neechaBhanga} color={cancellationActive ? GREEN : GOLD} icon={<ShieldCheck size={18} />} title="Neecha-bhanga checked" body={cancellationActive ? "Debility is being read with cancellation." : "Cancellation is not modifying the current dignity."} onClick={() => setNeechaBhanga((value) => !value)} />
          </Panel>

          <Panel title="Net aspects and company" icon={<Scale size={18} />} color={jupiterAspect && !maleficStress ? GREEN : GOLD}>
            <Toggle active={jupiterAspect} color={jupiterAspect ? GREEN : GOLD} icon={<Sparkles size={18} />} title="Jupiter protection" body={jupiterAspect ? "Benefic protection is included in the net." : "No Jupiter support selected."} onClick={() => setJupiterAspect((value) => !value)} />
            <Toggle active={maleficStress} color={maleficStress ? GOLD : GREEN} icon={<TriangleAlert size={18} />} title="Malefic stress" body={maleficStress ? "Stress is named and weighed, not exaggerated." : "No major stress selected."} onClick={() => setMaleficStress((value) => !value)} />
          </Panel>
        </section>
      </div>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Combine context</p>
          <div style={{ marginTop: "0.75rem" }}>
            <Segmented label="D1 Venus support" value={d1Venus} options={[["strong", "Strong"], ["mixed", "Mixed"], ["weak", "Weak"]]} colors={{ strong: GREEN, mixed: GOLD, weak: VERMILION }} onChange={(value) => setD1Venus(value as Support)} />
            <Segmented label="D1/D9 7th context" value={seventhContext} options={[["strong", "Strong"], ["mixed", "Mixed"], ["weak", "Weak"]]} colors={{ strong: GREEN, mixed: GOLD, weak: VERMILION }} onChange={(value) => setSeventhContext(value as Support)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Discipline guards</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={d1Combined} color={d1Combined ? GREEN : VERMILION} icon={<GitCompare size={18} />} title="D1 and 7th combined" body={d1Combined ? "D9 Venus is not standing alone." : "The reading is relying on D9 Venus alone."} onClick={() => setD1Combined((value) => !value)} />
            <Toggle active={agencyFrame} color={agencyFrame ? GREEN : VERMILION} icon={<HeartHandshake size={18} />} title="Care, not doom" body={agencyFrame ? "Weakness is framed as an area to nurture." : "The interpretation is becoming fatalistic."} onClick={() => setAgencyFrame((value) => !value)} />
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

function D9VenusSvg({
  dignity,
  d1Venus,
  seventhContext,
  tier,
  jupiterAspect,
  maleficStress,
  vargottama,
  cancellationActive,
  methodOk,
}: {
  dignity: Dignity;
  d1Venus: Support;
  seventhContext: Support;
  tier: string;
  jupiterAspect: boolean;
  maleficStress: boolean;
  vargottama: boolean;
  cancellationActive: boolean;
  methodOk: boolean;
}) {
  const finalColor = tierColor(tier);
  return (
    <svg viewBox="0 0 800 440" role="img" aria-label="D9 Venus marriage karaka weighing diagram" style={{ width: "100%", minHeight: 330, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="764" height="404" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <path d="M 400 197 C 400 225 140 225 140 250 M 400 197 C 400 225 310 225 310 250 M 400 197 C 400 225 500 225 500 250 M 400 197 C 400 225 660 225 660 250" fill="none" stroke={HAIRLINE} strokeWidth="3" />
      {maleficStress ? <path d="M 260 80 L 540 80" stroke={VERMILION} strokeWidth="4" strokeDasharray="9 8" /> : null}
      <circle cx="400" cy="125" r="72" fill={OPAQUE_LIGHT_FILL[dignityColor(dignity)]} stroke={dignityColor(dignity)} strokeWidth="5" />
      <text x="400" y="111" textAnchor="middle" fill={dignityColor(dignity)} fontSize="17" fontWeight="600">D9 Venus</text>
      <text x="400" y="135" textAnchor="middle" fill={INK_MUTED} fontSize="12">{dignityLabel(dignity)}</text>
      <text x="400" y="156" textAnchor="middle" fill={INK_MUTED} fontSize="12">karaka in karaka-chart</text>

      <rect x="60" y="250" width="170" height="72" rx="8" fill={OPAQUE_LIGHT_FILL[supportColor(d1Venus)]} stroke={supportColor(d1Venus)} strokeWidth="3" />
      <text x="145" y="280" textAnchor="middle" fill={supportColor(d1Venus)} fontSize="15" fontWeight="600">D1 Venus</text>
      <text x="145" y="302" textAnchor="middle" fill={INK_MUTED} fontSize="12">{d1Venus}</text>

      <rect x="250" y="250" width="170" height="72" rx="8" fill={OPAQUE_LIGHT_FILL[jupiterAspect ? GREEN : GOLD]} stroke={jupiterAspect ? GREEN : GOLD} strokeWidth="3" />
      <text x="335" y="280" textAnchor="middle" fill={jupiterAspect ? GREEN : GOLD} fontSize="15" fontWeight="600">Aspect Net</text>
      <text x="335" y="302" textAnchor="middle" fill={INK_MUTED} fontSize="12">{jupiterAspect ? "Jupiter support" : "support unset"}</text>

      <rect x="440" y="250" width="170" height="72" rx="8" fill={OPAQUE_LIGHT_FILL[cancellationActive ? GREEN : vargottama ? GREEN : GOLD]} stroke={cancellationActive || vargottama ? GREEN : GOLD} strokeWidth="3" />
      <text x="525" y="280" textAnchor="middle" fill={cancellationActive || vargottama ? GREEN : GOLD} fontSize="15" fontWeight="600">Confirmation</text>
      <text x="525" y="302" textAnchor="middle" fill={INK_MUTED} fontSize="12">{cancellationActive ? "neecha-bhanga" : vargottama ? "vargottama" : "not selected"}</text>

      <rect x="630" y="250" width="110" height="72" rx="8" fill={OPAQUE_LIGHT_FILL[supportColor(seventhContext)]} stroke={supportColor(seventhContext)} strokeWidth="3" />
      <text x="685" y="280" textAnchor="middle" fill={supportColor(seventhContext)} fontSize="15" fontWeight="600">7th</text>
      <text x="685" y="302" textAnchor="middle" fill={INK_MUTED} fontSize="12">{seventhContext}</text>

      <rect x="200" y="360" width="400" height="48" rx="8" fill={OPAQUE_LIGHT_FILL[finalColor]} stroke={finalColor} />
      <text x="400" y="390" textAnchor="middle" fill={finalColor} fontSize="16" fontWeight="600">{methodOk ? tier.toUpperCase() : "METHOD WARNING"}</text>
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
  gridTemplateColumns: "minmax(360px, 1.25fr) minmax(320px, 1fr)",
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

function dignityScore(dignity: Dignity): number {
  if (dignity === "exalted") return 34;
  if (dignity === "own") return 30;
  if (dignity === "neutral") return 20;
  return 8;
}

function supportScore(support: Support): number {
  if (support === "strong") return 14;
  if (support === "mixed") return 8;
  return 2;
}

function dignityLabel(dignity: Dignity): string {
  if (dignity === "exalted") return "exalted Pisces";
  if (dignity === "own") return "own Taurus/Libra";
  if (dignity === "neutral") return "neutral/friendly";
  return "debilitated Virgo";
}

function dignityColor(dignity: Dignity): string {
  if (dignity === "debilitated") return VERMILION;
  if (dignity === "neutral") return BLUE;
  return GREEN;
}

function supportColor(support: Support): string {
  if (support === "strong") return GREEN;
  if (support === "mixed") return GOLD;
  return VERMILION;
}

function tierColor(tier: string): string {
  if (tier === "confirmed karaka") return GREEN;
  if (tier === "balanced support") return BLUE;
  if (tier === "qualified support") return GOLD;
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
