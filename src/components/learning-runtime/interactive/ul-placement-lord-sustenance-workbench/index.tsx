"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, GitCompare, HeartHandshake, Layers3, MapPinned, RotateCcw, Scale, ShieldCheck, Sparkles, TriangleAlert } from "lucide-react";

type Focus = "ul" | "second" | "lord" | "synthesis";
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
  ul: {
    label: "UL",
    title: "Read the Upapada itself",
    body: "The UL sign, occupants, and aspects color the manifest image of marriage. Benefics support; malefics name themes to manage.",
    icon: <MapPinned size={16} />,
    color: PURPLE,
  },
  second: {
    label: "2nd from UL",
    title: "Judge sustenance and endurance",
    body: "The 2nd-from-UL is the distinctive Jaimini indicator for how the marriage is sustained over time.",
    icon: <HeartHandshake size={16} />,
    color: GREEN,
  },
  lord: {
    label: "UL lord",
    title: "Read placement and dignity",
    body: "The lord of the UL sign gives the tenor of marriage: direction, support, distance, effort, or transformation.",
    icon: <Scale size={16} />,
    color: BLUE,
  },
  synthesis: {
    label: "Synthesis",
    title: "Combine without decreeing",
    body: "Classical stability indications are recognition-level only. Weigh benefic protection, cancellations, and the 7th/D9/Venus stream.",
    icon: <ShieldCheck size={16} />,
    color: GOLD,
  },
};

export function UlPlacementLordSustenanceWorkbench() {
  const [focus, setFocus] = useState<Focus>("second");
  const [ulCondition, setUlCondition] = useState<Support>("strong");
  const [secondFromUl, setSecondFromUl] = useState<Support>("strong");
  const [ulLord, setUlLord] = useState<Support>("mixed");
  const [parashariVenus, setParashariVenus] = useState<Support>("strong");
  const [beneficProtection, setBeneficProtection] = useState(true);
  const [maleficStress, setMaleficStress] = useState(false);
  const [cancellationsChecked, setCancellationsChecked] = useState(true);
  const [wholeChartWeighed, setWholeChartWeighed] = useState(true);
  const [recognitionOnly, setRecognitionOnly] = useState(true);
  const [agencyFrame, setAgencyFrame] = useState(true);

  const methodOk = cancellationsChecked && wholeChartWeighed && recognitionOnly && agencyFrame;
  const jaiminiAverage = Math.round((supportScore(ulCondition) + supportScore(secondFromUl) + supportScore(ulLord)) / 3);
  const converges = Math.abs(jaiminiAverage - supportScore(parashariVenus)) <= 8;
  const score = Math.max(
    5,
    Math.min(
      98,
      supportScore(ulCondition) +
        supportScore(secondFromUl) +
        supportScore(ulLord) +
        supportScore(parashariVenus) +
        (beneficProtection ? 10 : 0) -
        (maleficStress ? 12 : 0) +
        (converges ? 10 : -6) +
        (methodOk ? 16 : -28),
    ),
  );

  const tier = useMemo(() => {
    if (!methodOk) return "method warning";
    if (secondFromUl === "stressed") return "endurance care theme";
    if (ulCondition === "strong" && secondFromUl === "strong" && ulLord !== "stressed" && parashariVenus !== "stressed" && beneficProtection && converges) return "robust sustenance";
    if (!converges) return "qualified divergence";
    if (ulCondition === "stressed" || ulLord === "stressed" || maleficStress) return "managed pressure";
    return "balanced support";
  }, [beneficProtection, converges, maleficStress, methodOk, parashariVenus, secondFromUl, ulCondition, ulLord]);

  const interpretation = useMemo(() => {
    if (!recognitionOnly) return "Pause: the classical stability and number doctrines are being treated as a deterministic decree. Restore recognition-level language before judging.";
    if (!cancellationsChecked) return "Pause: benefic protection and cancellations have not been weighed. One afflicted point is not a verdict.";
    if (!wholeChartWeighed) return "Pause: the UL stream is being isolated. Compare it with the Parashari 7th, D9, and Venus before confidence rises.";
    if (!agencyFrame) return "Pause: the reading needs care language. A stressed 2nd-from-UL names an endurance area to tend, not guaranteed divorce.";
    if (secondFromUl === "stressed") return "The 2nd-from-UL is stressed, so the honest statement is endurance needs care. Benefic protection, the UL lord, and the other streams decide how strongly this is weighted.";
    if (tier === "robust sustenance") return "UL, its sustaining house, the UL lord, and the Parashari/Venus stream are broadly supportive. This is a strong likelihood of stable sustenance, stated modestly.";
    if (tier === "qualified divergence") return "The Jaimini UL triad and the Parashari/Venus stream do not fully agree. Name the divergence and treat the UL as a qualification, not a standalone verdict.";
    if (tier === "managed pressure") return "There is pressure in the UL field, but the method keeps it usable: locate the stress, check protection, and frame it as effort, distance, or transformation.";
    return "The reading shows balanced support. Keep UL, 2nd-from-UL, and UL lord together, then state convergence or qualification with care.";
  }, [agencyFrame, cancellationsChecked, recognitionOnly, secondFromUl, tier, wholeChartWeighed]);

  return (
    <div data-interactive="ul-placement-lord-sustenance-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>UL placement and lord</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.35rem" }}>Read marriage sustenance without fatalism</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 920 }}>
              Build a disciplined UL reading from the Upapada, the 2nd-from-UL, the UL lord, and the corroborating Parashari/Venus stream.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setFocus("second");
              setUlCondition("strong");
              setSecondFromUl("strong");
              setUlLord("mixed");
              setParashariVenus("strong");
              setBeneficProtection(true);
              setMaleficStress(false);
              setCancellationsChecked(true);
              setWholeChartWeighed(true);
              setRecognitionOnly(true);
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
              <p style={eyebrowStyle}>Sustenance grade</p>
              <h3 style={{ margin: "0.15rem 0 0", color: tierColor(tier), fontSize: "1.2rem" }}>{tier}</h3>
            </div>
            <strong style={{ color: tierColor(tier) }}>{score}% confidence</strong>
          </div>
          <UlSustenanceSvg ulCondition={ulCondition} secondFromUl={secondFromUl} ulLord={ulLord} parashariVenus={parashariVenus} tier={tier} converges={converges} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 130px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="UL itself" body={ulCondition} color={supportColor(ulCondition)} icon={<MapPinned size={16} />} />
            <MiniFact title="2nd-from-UL" body={secondFromUl} color={supportColor(secondFromUl)} icon={<HeartHandshake size={16} />} />
            <MiniFact title="UL lord" body={ulLord} color={supportColor(ulLord)} icon={<Scale size={16} />} />
            <MiniFact title="Other stream" body={converges ? "converges" : "diverges"} color={converges ? GREEN : GOLD} icon={<GitCompare size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="UL triad" icon={<Layers3 size={18} />} color={PURPLE}>
            <Segmented label="UL sign, occupants, aspects" value={ulCondition} options={[["strong", "Strong"], ["mixed", "Mixed"], ["stressed", "Stressed"]]} colors={{ strong: GREEN, mixed: GOLD, stressed: VERMILION }} onChange={(value) => setUlCondition(value as Support)} />
            <Segmented label="2nd-from-UL sustenance" value={secondFromUl} options={[["strong", "Strong"], ["mixed", "Mixed"], ["stressed", "Stressed"]]} colors={{ strong: GREEN, mixed: GOLD, stressed: VERMILION }} onChange={(value) => setSecondFromUl(value as Support)} />
            <Segmented label="UL lord placement and dignity" value={ulLord} options={[["strong", "Strong"], ["mixed", "Mixed"], ["stressed", "Stressed"]]} colors={{ strong: GREEN, mixed: GOLD, stressed: VERMILION }} onChange={(value) => setUlLord(value as Support)} />
          </Panel>

          <Panel title="Mitigation and comparison" icon={<Sparkles size={18} />} color={GOLD}>
            <Segmented label="7th/D9/Venus stream" value={parashariVenus} options={[["strong", "Strong"], ["mixed", "Mixed"], ["stressed", "Stressed"]]} colors={{ strong: GREEN, mixed: GOLD, stressed: VERMILION }} onChange={(value) => setParashariVenus(value as Support)} />
            <Toggle active={beneficProtection} color={beneficProtection ? GREEN : GOLD} icon={<BadgeCheck size={18} />} title="Benefic protection present" body={beneficProtection ? "Support mitigates pressure on UL or 2nd-from-UL." : "No visible mitigation is being added."} onClick={() => setBeneficProtection((value) => !value)} />
            <Toggle active={maleficStress} color={maleficStress ? VERMILION : GREEN} icon={<TriangleAlert size={18} />} title="Malefic stress active" body={maleficStress ? "Pressure is present and must be named carefully." : "No extra stress layer selected."} onClick={() => setMaleficStress((value) => !value)} />
          </Panel>
        </section>
      </div>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Ethical gates</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={recognitionOnly} color={recognitionOnly ? GREEN : VERMILION} icon={<ShieldCheck size={18} />} title="Recognition level only" body={recognitionOnly ? "No divorce or second-marriage decree." : "Classical doctrine is becoming deterministic."} onClick={() => setRecognitionOnly((value) => !value)} />
            <Toggle active={agencyFrame} color={agencyFrame ? GREEN : VERMILION} icon={<HeartHandshake size={18} />} title="Agency and care language" body={agencyFrame ? "Stress is framed as something to tend." : "The statement is losing the care frame."} onClick={() => setAgencyFrame((value) => !value)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Method gates</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={cancellationsChecked} color={cancellationsChecked ? GREEN : VERMILION} icon={<BadgeCheck size={18} />} title="Cancellations checked" body={cancellationsChecked ? "Protection and mitigation are included." : "Affliction is being read at face value."} onClick={() => setCancellationsChecked((value) => !value)} />
            <Toggle active={wholeChartWeighed} color={wholeChartWeighed ? GREEN : VERMILION} icon={<GitCompare size={18} />} title="Whole chart weighed" body={wholeChartWeighed ? "UL is combined with 7th, D9, and Venus." : "UL is isolated from the other streams."} onClick={() => setWholeChartWeighed((value) => !value)} />
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: `${tierColor(tier)}66`, background: `${tierColor(tier)}10` }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          <ShieldCheck size={20} color={tierColor(tier)} aria-hidden="true" />
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

function UlSustenanceSvg({ ulCondition, secondFromUl, ulLord, parashariVenus, tier, converges }: { ulCondition: Support; secondFromUl: Support; ulLord: Support; parashariVenus: Support; tier: string; converges: boolean }) {
  const finalColor = tierColor(tier);
  return (
    <svg viewBox="0 0 780 430" role="img" aria-label="UL, second from UL, UL lord, and corroborating stream synthesis diagram" style={{ width: "100%", minHeight: 320, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="744" height="394" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <path d="M 222 119 L 315 119 M 465 119 L 558 119" stroke={finalColor} strokeWidth="4" strokeDasharray="8 8" />
      <path d="M 296 260 L 484 260" stroke={converges ? GREEN : GOLD} strokeWidth="4" strokeDasharray={converges ? "0" : "8 8"} />
      <rect x="72" y="80" width="150" height="78" rx="8" fill={OPAQUE_LIGHT_FILL[supportColor(ulCondition)]} stroke={supportColor(ulCondition)} strokeWidth="3" />
      <text x="147" y="109" textAnchor="middle" fill={supportColor(ulCondition)} fontSize="17" fontWeight="700">UL</text>
      <text x="147" y="137" textAnchor="middle" fill={INK_SECONDARY} fontSize="13">{ulCondition}</text>
      <rect x="315" y="80" width="150" height="78" rx="8" fill={OPAQUE_LIGHT_FILL[supportColor(secondFromUl)]} stroke={supportColor(secondFromUl)} strokeWidth="3" />
      <text x="390" y="109" textAnchor="middle" fill={supportColor(secondFromUl)} fontSize="16" fontWeight="700">2nd from UL</text>
      <text x="390" y="137" textAnchor="middle" fill={INK_SECONDARY} fontSize="12.5">sustenance: {secondFromUl}</text>
      <rect x="558" y="80" width="150" height="78" rx="8" fill={OPAQUE_LIGHT_FILL[supportColor(ulLord)]} stroke={supportColor(ulLord)} strokeWidth="3" />
      <text x="633" y="109" textAnchor="middle" fill={supportColor(ulLord)} fontSize="17" fontWeight="700">UL Lord</text>
      <text x="633" y="137" textAnchor="middle" fill={INK_SECONDARY} fontSize="13">{ulLord}</text>
      <circle cx="238" cy="260" r="58" fill={OPAQUE_LIGHT_FILL[supportColor(parashariVenus)]} stroke={supportColor(parashariVenus)} strokeWidth="3" />
      <text x="238" y="248" textAnchor="middle" fill={supportColor(parashariVenus)} fontSize="16" fontWeight="700">7th/D9</text>
      <text x="238" y="274" textAnchor="middle" fill={INK_SECONDARY} fontSize="13">Venus: {parashariVenus}</text>
      <circle cx="542" cy="260" r="58" fill={OPAQUE_LIGHT_FILL[finalColor]} stroke={finalColor} strokeWidth="3" />
      <text x="542" y="248" textAnchor="middle" fill={finalColor} fontSize="16" fontWeight="700">Synthesis</text>
      <text x="542" y="274" textAnchor="middle" fill={INK_SECONDARY} fontSize="13">{converges ? "converges" : "diverges"}</text>
      <rect x="220" y="356" width="340" height="38" rx="8" fill={OPAQUE_LIGHT_FILL[finalColor]} stroke={finalColor} />
      <text x="390" y="382" textAnchor="middle" fill={finalColor} fontSize="16" fontWeight="700">{tier.toUpperCase()}</text>
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
  if (tier === "robust sustenance") return GREEN;
  if (tier === "balanced support") return BLUE;
  if (tier === "qualified divergence") return GOLD;
  if (tier === "managed pressure") return GOLD;
  if (tier === "endurance care theme") return GOLD;
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
