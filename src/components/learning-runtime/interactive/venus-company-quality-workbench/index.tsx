"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, Flame, GitCompare, HeartHandshake, Moon, Orbit, RotateCcw, Scale, ShieldCheck, Sparkles, TriangleAlert, Zap } from "lucide-react";

type Focus = "benefic" | "malefic" | "net" | "combine";
type Support = "strong" | "mixed" | "weak";

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
  benefic: {
    label: "Benefic",
    title: "Benefic company refines Venus",
    body: "Jupiter protects and graces, Mercury supports rapport, and waxing Moon brings tenderness and warmth.",
    icon: <Sparkles size={16} />,
    color: GREEN,
  },
  malefic: {
    label: "Malefic",
    title: "Malefic company names themes to manage",
    body: "Mars, Saturn, Rahu, Ketu, and the Sun colour the affective quality as passion, duty, intensity, detachment, or ego strain.",
    icon: <TriangleAlert size={16} />,
    color: GOLD,
  },
  net: {
    label: "Net",
    title: "Conjunction usually weighs more than aspect",
    body: "Read all company together. A strong benefic conjunction can outweigh a malefic aspect; one malefic is not the whole story.",
    icon: <Scale size={16} />,
    color: BLUE,
  },
  combine: {
    label: "Combine",
    title: "Venus company colours quality, not the whole promise",
    body: "Carry the Venus net into the 7th and D9 reading. It is an affective-quality note, never a standalone verdict.",
    icon: <GitCompare size={16} />,
    color: PURPLE,
  },
};

export function VenusCompanyQualityWorkbench() {
  const [focus, setFocus] = useState<Focus>("benefic");
  const [jupiterConj, setJupiterConj] = useState(true);
  const [mercuryMoonSupport, setMercuryMoonSupport] = useState(false);
  const [marsAspect, setMarsAspect] = useState(true);
  const [saturnConj, setSaturnConj] = useState(false);
  const [rahuKetuTheme, setRahuKetuTheme] = useState(false);
  const [sunCombustion, setSunCombustion] = useState(false);
  const [conjunctionWeighted, setConjunctionWeighted] = useState(true);
  const [allCompanyTallied, setAllCompanyTallied] = useState(true);
  const [dignityContext, setDignityContext] = useState<Support>("strong");
  const [seventhD9Context, setSeventhD9Context] = useState<Support>("strong");
  const [combined, setCombined] = useState(true);
  const [agencyFrame, setAgencyFrame] = useState(true);

  const beneficScore = (jupiterConj ? 28 : 0) + (mercuryMoonSupport ? 12 : 0);
  const maleficScore = (marsAspect ? 10 : 0) + (saturnConj ? 22 : 0) + (rahuKetuTheme ? 14 : 0) + (sunCombustion ? 12 : 0);
  const methodOk = conjunctionWeighted && allCompanyTallied && combined && agencyFrame;
  const score = Math.max(
    5,
    Math.min(
      98,
      42 +
        beneficScore -
        maleficScore +
        supportScore(dignityContext) +
        supportScore(seventhD9Context) +
        (methodOk ? 14 : -26),
    ),
  );

  const tier = useMemo(() => {
    if (!methodOk) return "method warning";
    if (beneficScore >= maleficScore + 12) return "warm supported net";
    if (maleficScore > beneficScore + 10) return "care theme net";
    return "mixed quality net";
  }, [beneficScore, maleficScore, methodOk]);

  const interpretation = useMemo(() => {
    if (!conjunctionWeighted) return "Pause: conjunction and aspect are being weighed equally. Same-house company usually colours Venus more strongly than an aspect.";
    if (!allCompanyTallied) return "Pause: one influence is being isolated. Tally benefic and malefic company together before judging the affective quality.";
    if (!combined) return "Pause: Venus company is being used alone. Combine the net with Venus dignity, the 7th, and the D9.";
    if (!agencyFrame) return "Pause: a malefic combination is becoming a curse. Restore the quality-theme frame.";
    if (beneficScore >= maleficScore + 12) return "The net on Venus is predominantly benefic. The affective quality reads warm and supported, with any malefic influence named as a manageable texture.";
    if (maleficScore > beneficScore + 10) return "The net on Venus is stressed. Name the themes to manage in affection and harmony, then weigh dignity, the 7th, and the D9 before confidence.";
    return "The net on Venus is mixed: warmth and support are present, but there is a clear theme to manage. State both sides and avoid a single-factor verdict.";
  }, [agencyFrame, allCompanyTallied, beneficScore, combined, conjunctionWeighted, maleficScore]);

  return (
    <div data-interactive="venus-company-quality-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Venus company quality</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.35rem" }}>Weigh the net around Venus</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 920 }}>
              Toggle benefic and malefic company, distinguish conjunction from aspect, then carry the net into the 7th and D9 reading.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setFocus("benefic");
              setJupiterConj(true);
              setMercuryMoonSupport(false);
              setMarsAspect(true);
              setSaturnConj(false);
              setRahuKetuTheme(false);
              setSunCombustion(false);
              setConjunctionWeighted(true);
              setAllCompanyTallied(true);
              setDignityContext("strong");
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
              <p style={eyebrowStyle}>Affective-quality net</p>
              <h3 style={{ margin: "0.15rem 0 0", color: tierColor(tier), fontSize: "1.2rem" }}>{tier}</h3>
            </div>
            <strong style={{ color: tierColor(tier) }}>{score}% warmth</strong>
          </div>
          <VenusCompanySvg beneficScore={beneficScore} maleficScore={maleficScore} tier={tier} methodOk={methodOk} jupiterConj={jupiterConj} saturnConj={saturnConj} marsAspect={marsAspect} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 135px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="Benefic side" body={beneficScore > 0 ? "active" : "none"} color={beneficScore > 0 ? GREEN : GOLD} icon={<Sparkles size={16} />} />
            <MiniFact title="Malefic side" body={maleficScore > 0 ? "theme" : "quiet"} color={maleficScore > 0 ? GOLD : GREEN} icon={<TriangleAlert size={16} />} />
            <MiniFact title="Weighting" body={conjunctionWeighted ? "conj > aspect" : "warning"} color={conjunctionWeighted ? BLUE : VERMILION} icon={<Scale size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Benefic company" icon={<Sparkles size={18} />} color={GREEN}>
            <Toggle active={jupiterConj} color={jupiterConj ? GREEN : GOLD} icon={<BadgeCheck size={18} />} title="Jupiter conjunct Venus" body={jupiterConj ? "Grace and devotion are strong because this is conjunction." : "No Jupiter conjunction selected."} onClick={() => setJupiterConj((value) => !value)} />
            <Toggle active={mercuryMoonSupport} color={mercuryMoonSupport ? GREEN : GOLD} icon={<Moon size={18} />} title="Mercury or waxing Moon support" body={mercuryMoonSupport ? "Rapport, refinement, or tenderness is included." : "No Mercury/Moon support selected."} onClick={() => setMercuryMoonSupport((value) => !value)} />
          </Panel>

          <Panel title="Malefic company" icon={<TriangleAlert size={18} />} color={maleficScore > 0 ? GOLD : GREEN}>
            <Toggle active={marsAspect} color={marsAspect ? GOLD : GREEN} icon={<Zap size={18} />} title="Mars aspect" body={marsAspect ? "Passion and friction to manage." : "No Mars heat selected."} onClick={() => setMarsAspect((value) => !value)} />
            <Toggle active={saturnConj} color={saturnConj ? GOLD : GREEN} icon={<Orbit size={18} />} title="Saturn conjunct Venus" body={saturnConj ? "Duty, maturity, delay, and durability." : "No Saturn conjunction selected."} onClick={() => setSaturnConj((value) => !value)} />
            <Toggle active={rahuKetuTheme} color={rahuKetuTheme ? GOLD : GREEN} icon={<Flame size={18} />} title="Rahu/Ketu theme" body={rahuKetuTheme ? "Unconventional intensity or detachment is included." : "No nodal theme selected."} onClick={() => setRahuKetuTheme((value) => !value)} />
            <Toggle active={sunCombustion} color={sunCombustion ? GOLD : GREEN} icon={<Flame size={18} />} title="Sun combustion theme" body={sunCombustion ? "Ego-vs-affection strain is included." : "No combustion theme selected."} onClick={() => setSunCombustion((value) => !value)} />
          </Panel>
        </section>
      </div>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Context</p>
          <div style={{ marginTop: "0.75rem" }}>
            <Segmented label="Venus dignity context" value={dignityContext} options={[["strong", "Strong"], ["mixed", "Mixed"], ["weak", "Weak"]]} colors={{ strong: GREEN, mixed: GOLD, weak: VERMILION }} onChange={(value) => setDignityContext(value as Support)} />
            <Segmented label="7th and D9 context" value={seventhD9Context} options={[["strong", "Strong"], ["mixed", "Mixed"], ["weak", "Weak"]]} colors={{ strong: GREEN, mixed: GOLD, weak: VERMILION }} onChange={(value) => setSeventhD9Context(value as Support)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Method guards</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={conjunctionWeighted} color={conjunctionWeighted ? GREEN : VERMILION} icon={<Scale size={18} />} title="Conjunction weighted more" body={conjunctionWeighted ? "Same-house influence is treated as stronger." : "Aspect and conjunction are being flattened."} onClick={() => setConjunctionWeighted((value) => !value)} />
            <Toggle active={allCompanyTallied} color={allCompanyTallied ? GREEN : VERMILION} icon={<BadgeCheck size={18} />} title="All company tallied" body={allCompanyTallied ? "Benefic and malefic influences are both counted." : "A single factor is being isolated."} onClick={() => setAllCompanyTallied((value) => !value)} />
            <Toggle active={combined} color={combined ? GREEN : VERMILION} icon={<GitCompare size={18} />} title="Combined with 7th and D9" body={combined ? "Venus net colours quality within the full reading." : "Venus company is being used standalone."} onClick={() => setCombined((value) => !value)} />
            <Toggle active={agencyFrame} color={agencyFrame ? GREEN : VERMILION} icon={<ShieldCheck size={18} />} title="Theme, not doom" body={agencyFrame ? "Malefic company is framed as manageable texture." : "Malefic company is becoming curse language."} onClick={() => setAgencyFrame((value) => !value)} />
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

function VenusCompanySvg({ beneficScore, maleficScore, tier, methodOk, jupiterConj, saturnConj, marsAspect }: { beneficScore: number; maleficScore: number; tier: string; methodOk: boolean; jupiterConj: boolean; saturnConj: boolean; marsAspect: boolean }) {
  const finalColor = tierColor(tier);
  return (
    <svg viewBox="0 0 780 420" role="img" aria-label="Venus company net influence diagram" style={{ width: "100%", minHeight: 315, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="744" height="384" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <path d="M 264 120 C 308 120 326 154 328 154 M 516 120 C 472 120 454 154 452 154" fill="none" stroke={methodOk ? BLUE : VERMILION} strokeWidth="4" strokeDasharray={methodOk ? "0" : "8 8"} />
      <circle cx="390" cy="154" r="62" fill={OPAQUE_LIGHT_FILL[PURPLE]} stroke={PURPLE} strokeWidth="4" />
      <text x="390" y="145" textAnchor="middle" fill={PURPLE} fontSize="18" fontWeight="700">Venus</text>
      <text x="390" y="173" textAnchor="middle" fill={INK_MUTED} fontSize="13">affective quality</text>
      <rect x="74" y="84" width="190" height="72" rx="8" fill={OPAQUE_LIGHT_FILL[GREEN]} stroke={GREEN} strokeWidth="3" />
      <text x="169" y="111" textAnchor="middle" fill={GREEN} fontSize="16" fontWeight="700">Benefic company</text>
      <text x="169" y="138" textAnchor="middle" fill={INK_MUTED} fontSize="13">{jupiterConj ? "Jupiter conjunction" : beneficScore > 0 ? "support present" : "quiet"}</text>
      <rect x="516" y="84" width="190" height="72" rx="8" fill={OPAQUE_LIGHT_FILL[GOLD]} stroke={GOLD} strokeWidth="3" />
      <text x="611" y="111" textAnchor="middle" fill={GOLD} fontSize="16" fontWeight="700">Malefic company</text>
      <text x="611" y="138" textAnchor="middle" fill={INK_MUTED} fontSize="13">{saturnConj ? "Saturn conjunction" : marsAspect ? "Mars aspect" : maleficScore > 0 ? "theme present" : "quiet"}</text>
      <rect x="222" y="290" width="336" height="44" rx="8" fill={OPAQUE_LIGHT_FILL[finalColor]} stroke={finalColor} />
      <text x="390" y="318" textAnchor="middle" fill={finalColor} fontSize="16" fontWeight="700">{methodOk ? tier.toUpperCase() : "METHOD WARNING"}</text>
      <rect x="110" y="354" width="560" height="30" rx="8" fill={OPAQUE_LIGHT_FILL[BLUE]} stroke={HAIRLINE} />
      <text x="390" y="374" textAnchor="middle" fill={INK_MUTED} fontSize="13">Net company colours quality; 7th and D9 carry the promise.</text>
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

function supportScore(support: Support): number {
  if (support === "strong") return 12;
  if (support === "mixed") return 6;
  return -8;
}

function tierColor(tier: string): string {
  if (tier === "warm supported net") return GREEN;
  if (tier === "mixed quality net") return BLUE;
  if (tier === "care theme net") return GOLD;
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
