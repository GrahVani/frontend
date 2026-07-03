"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Flame, GitCompare, HeartHandshake, Orbit, RotateCcw, Scale, ShieldCheck, Sparkles, Venus } from "lucide-react";

type Dignity = "exalted" | "own" | "neutral" | "debilitated";
type Support = "strong" | "mixed" | "weak";
type Focus = "dignity" | "states" | "cancellation" | "combine";

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
  dignity: {
    label: "Dignity",
    title: "Dignity sets Venus's baseline strength",
    body: "Exalted Pisces is strongest, Taurus/Libra are strong, neutral signs are workable, and Virgo debility needs cancellation/context.",
    icon: <Venus size={16} />,
    color: PURPLE,
  },
  states: {
    label: "States",
    title: "Combustion and retrogression modify expression",
    body: "Combustion can show ego-vs-affection strain; retrogression intensifies and internalises love and values. Neither is automatic failure.",
    icon: <Flame size={16} />,
    color: GOLD,
  },
  cancellation: {
    label: "Bhanga",
    title: "Debilitated Venus must be checked for neecha-bhanga",
    body: "Cancellation can soften or reverse a Virgo debility. Do not conclude before checking the dispositor, kendras, aspects, and D9.",
    icon: <ShieldCheck size={16} />,
    color: GREEN,
  },
  combine: {
    label: "Combine",
    title: "Venus strength is weighted within the whole reading",
    body: "Cross-check D9 Venus, the 7th, and aspects. A weak Venus is a care theme, not a standalone marriage verdict.",
    icon: <GitCompare size={16} />,
    color: BLUE,
  },
};

export function VenusDignityStrengthMarriageConsole() {
  const [focus, setFocus] = useState<Focus>("dignity");
  const [dignity, setDignity] = useState<Dignity>("exalted");
  const [combust, setCombust] = useState(false);
  const [retrograde, setRetrograde] = useState(false);
  const [neechaBhanga, setNeechaBhanga] = useState(false);
  const [jupiterSupport, setJupiterSupport] = useState(true);
  const [d9Venus, setD9Venus] = useState<Support>("strong");
  const [seventhD9Context, setSeventhD9Context] = useState<Support>("strong");
  const [combined, setCombined] = useState(true);
  const [agencyFrame, setAgencyFrame] = useState(true);

  const cancellationActive = dignity === "debilitated" && neechaBhanga;
  const methodOk = combined && agencyFrame;
  const score = Math.max(
    5,
    Math.min(
      98,
      dignityScore(dignity) +
        supportScore(d9Venus) +
        supportScore(seventhD9Context) +
        (jupiterSupport ? 12 : 0) +
        (cancellationActive ? 18 : 0) -
        (combust ? 10 : 0) +
        (retrograde ? 4 : 0) +
        (combined ? 10 : -18) +
        (agencyFrame ? 10 : -24),
    ),
  );

  const tier = useMemo(() => {
    if (!methodOk) return "method warning";
    if (dignity === "debilitated" && !neechaBhanga) return "care theme";
    if ((dignity === "exalted" || dignity === "own") && !combust && d9Venus === "strong" && seventhD9Context !== "weak") return "strong karaka";
    if (combust || d9Venus === "weak" || seventhD9Context === "weak") return "qualified strength";
    return "moderate strength";
  }, [combust, d9Venus, dignity, methodOk, neechaBhanga, seventhD9Context]);

  const interpretation = useMemo(() => {
    if (!combined) return "Pause: Venus strength is being read in isolation. Combine dignity and states with the 7th, D9 Venus, aspects, and the D9 promise.";
    if (!agencyFrame) return "Pause: weak Venus is being turned into doom. Restore the lesson frame: affection and harmony are areas to nurture.";
    if (dignity === "debilitated" && neechaBhanga) return "Venus is debilitated, but neecha-bhanga is active. Read the debility as modified, then weigh D9 Venus, aspects, combustion, and the 7th.";
    if (dignity === "debilitated") return "Venus is debilitated without cancellation selected. This is a real care theme for affection and harmony, not a loveless-marriage decree.";
    if (combust && retrograde) return "Venus is dignified by sign but modified by combustion and retrogression: affection may be intense, internalised, and strained by ego themes. Weigh the D9 and supports.";
    if (combust) return "Combust Venus is a quality theme: ego or self-focus may scorch softness. It modifies the karaka; it does not erase love.";
    if (retrograde) return "Retrograde Venus is intensified and internalised. Treat it as depth and re-evaluation of love and values, not deficiency.";
    if (dignity === "exalted" || dignity === "own") return "Venus is dignified and undimmed. This is a strong positive for marital grace and harmony, weighted inside the combined reading.";
    return "Venus is moderate by dignity. The affective register is workable and should be refined by D9 Venus, aspects, and the 7th/D9 context.";
  }, [agencyFrame, combined, combust, dignity, neechaBhanga, retrograde]);

  return (
    <div data-interactive="venus-dignity-strength-marriage-console" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Venus strength console</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.35rem" }}>Dignity, states, cancellation, context</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 920 }}>
              Build the marriage-karaka strength reading from sign dignity, combustion, retrogression, neecha-bhanga, D9 Venus, and the 7th/D9 promise.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setFocus("dignity");
              setDignity("exalted");
              setCombust(false);
              setRetrograde(false);
              setNeechaBhanga(false);
              setJupiterSupport(true);
              setD9Venus("strong");
              setSeventhD9Context("strong");
              setCombined(true);
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
              <p style={eyebrowStyle}>Karaka strength</p>
              <h3 style={{ margin: "0.15rem 0 0", color: tierColor(tier), fontSize: "1.2rem" }}>{tier}</h3>
            </div>
            <strong style={{ color: tierColor(tier) }}>{score}% support</strong>
          </div>
          <VenusStrengthSvg dignity={dignity} combust={combust} retrograde={retrograde} cancellationActive={cancellationActive} d9Venus={d9Venus} tier={tier} methodOk={methodOk} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 135px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="Dignity" body={dignityLabel(dignity)} color={dignityColor(dignity)} icon={<Venus size={16} />} />
            <MiniFact title="State" body={combust ? "combust" : retrograde ? "retrograde" : "undimmed"} color={combust ? GOLD : retrograde ? BLUE : GREEN} icon={<Flame size={16} />} />
            <MiniFact title="D9 check" body={d9Venus} color={supportColor(d9Venus)} icon={<GitCompare size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Dignity baseline" icon={<Venus size={18} />} color={dignityColor(dignity)}>
            <Segmented
              label="Venus dignity"
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
          </Panel>

          <Panel title="State modifiers" icon={<Flame size={18} />} color={combust ? GOLD : retrograde ? BLUE : GREEN}>
            <Toggle active={combust} color={combust ? GOLD : GREEN} icon={<Flame size={18} />} title="Combustion present" body={combust ? "Read ego-vs-affection as a quality theme." : "No combustion strain selected."} onClick={() => setCombust((value) => !value)} />
            <Toggle active={retrograde} color={retrograde ? BLUE : GREEN} icon={<Orbit size={18} />} title="Retrogression present" body={retrograde ? "Read as intensified and internalised." : "No retrograde modifier selected."} onClick={() => setRetrograde((value) => !value)} />
          </Panel>

          <Panel title="Cancellation and support" icon={<ShieldCheck size={18} />} color={cancellationActive || jupiterSupport ? GREEN : GOLD}>
            <Toggle active={neechaBhanga} color={cancellationActive ? GREEN : GOLD} icon={<ShieldCheck size={18} />} title="Neecha-bhanga checked" body={cancellationActive ? "Debility is modified by cancellation." : "Cancellation is not active for current dignity."} onClick={() => setNeechaBhanga((value) => !value)} />
            <Toggle active={jupiterSupport} color={jupiterSupport ? GREEN : GOLD} icon={<Sparkles size={18} />} title="Benefic/Jupiter support" body={jupiterSupport ? "Support offsets strain in the net." : "No benefic support selected."} onClick={() => setJupiterSupport((value) => !value)} />
          </Panel>
        </section>
      </div>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Context checks</p>
          <div style={{ marginTop: "0.75rem" }}>
            <Segmented label="D9 Venus cross-check" value={d9Venus} options={[["strong", "Strong"], ["mixed", "Mixed"], ["weak", "Weak"]]} colors={{ strong: GREEN, mixed: GOLD, weak: VERMILION }} onChange={(value) => setD9Venus(value as Support)} />
            <Segmented label="7th and D9 context" value={seventhD9Context} options={[["strong", "Strong"], ["mixed", "Mixed"], ["weak", "Weak"]]} colors={{ strong: GREEN, mixed: GOLD, weak: VERMILION }} onChange={(value) => setSeventhD9Context(value as Support)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Method guards</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={combined} color={combined ? GREEN : VERMILION} icon={<GitCompare size={18} />} title="Combined with 7th and D9" body={combined ? "Venus strength is weighted, not standalone." : "Venus dignity is being used alone."} onClick={() => setCombined((value) => !value)} />
            <Toggle active={agencyFrame} color={agencyFrame ? GREEN : VERMILION} icon={<HeartHandshake size={18} />} title="Weakness framed with agency" body={agencyFrame ? "Care theme, not failed marriage." : "Weakness is becoming doom language."} onClick={() => setAgencyFrame((value) => !value)} />
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

function VenusStrengthSvg({ dignity, combust, retrograde, cancellationActive, d9Venus, tier, methodOk }: { dignity: Dignity; combust: boolean; retrograde: boolean; cancellationActive: boolean; d9Venus: Support; tier: string; methodOk: boolean }) {
  const finalColor = tierColor(tier);
  return (
    <svg viewBox="0 0 780 420" role="img" aria-label="Venus dignity strength modifier diagram" style={{ width: "100%", minHeight: 315, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="744" height="384" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <path d="M 390 180 C 390 210 156 210 156 232 M 390 180 C 390 210 320 210 320 232 M 390 180 C 390 210 484 210 484 232 M 390 180 C 390 210 636 210 636 232" fill="none" stroke={HAIRLINE} strokeWidth="3" />
      <circle cx="390" cy="118" r="62" fill={OPAQUE_LIGHT_FILL[dignityColor(dignity)]} stroke={dignityColor(dignity)} strokeWidth="4" />
      <text x="390" y="104" textAnchor="middle" fill={dignityColor(dignity)} fontSize="14" fontWeight="700">Venus</text>
      <text x="390" y="128" textAnchor="middle" fill={INK_MUTED} fontSize="11">{dignityLabel(dignity)}</text>
      <rect x="86" y="232" width="140" height="62" rx="8" fill={OPAQUE_LIGHT_FILL[combust ? GOLD : GREEN]} stroke={combust ? GOLD : GREEN} />
      <text x="156" y="258" textAnchor="middle" fill={combust ? GOLD : GREEN} fontSize="12" fontWeight="700">Combustion</text>
      <text x="156" y="278" textAnchor="middle" fill={INK_MUTED} fontSize="10.5">{combust ? "quality theme" : "not selected"}</text>
      <rect x="250" y="232" width="140" height="62" rx="8" fill={OPAQUE_LIGHT_FILL[retrograde ? BLUE : GREEN]} stroke={retrograde ? BLUE : GREEN} />
      <text x="320" y="258" textAnchor="middle" fill={retrograde ? BLUE : GREEN} fontSize="12" fontWeight="700">Retrograde</text>
      <text x="320" y="278" textAnchor="middle" fill={INK_MUTED} fontSize="10.5">{retrograde ? "internalised" : "not selected"}</text>
      <rect x="414" y="232" width="140" height="62" rx="8" fill={OPAQUE_LIGHT_FILL[cancellationActive ? GREEN : GOLD]} stroke={cancellationActive ? GREEN : GOLD} />
      <text x="484" y="258" textAnchor="middle" fill={cancellationActive ? GREEN : GOLD} fontSize="12" fontWeight="700">Bhanga</text>
      <text x="484" y="278" textAnchor="middle" fill={INK_MUTED} fontSize="10.5">{cancellationActive ? "cancels" : "not active"}</text>
      <rect x="578" y="232" width="116" height="62" rx="8" fill={OPAQUE_LIGHT_FILL[supportColor(d9Venus)]} stroke={supportColor(d9Venus)} />
      <text x="636" y="258" textAnchor="middle" fill={supportColor(d9Venus)} fontSize="12" fontWeight="700">D9 Venus</text>
      <text x="636" y="278" textAnchor="middle" fill={INK_MUTED} fontSize="10.5">{d9Venus}</text>
      <rect x="230" y="348" width="320" height="36" rx="8" fill={OPAQUE_LIGHT_FILL[finalColor]} stroke={finalColor} />
      <text x="390" y="371" textAnchor="middle" fill={finalColor} fontSize="13" fontWeight="700">{methodOk ? tier.toUpperCase() : "METHOD WARNING"}</text>
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
  if (dignity === "neutral") return "friendly/neutral";
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
  if (tier === "strong karaka") return GREEN;
  if (tier === "moderate strength") return BLUE;
  if (tier === "qualified strength") return GOLD;
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
