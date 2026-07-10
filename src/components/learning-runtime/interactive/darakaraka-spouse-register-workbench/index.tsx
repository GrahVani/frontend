"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { ArrowDownWideNarrow, BadgeCheck, GitCompare, HeartHandshake, RotateCcw, Scale, ShieldCheck, SlidersHorizontal, Sparkles, TriangleAlert, UserRound } from "lucide-react";
import { workbenchTwoColumnStyle, workbenchDiagramLayoutStyle } from "../lib/layouts";

type Scheme = "seven" | "eight";
type PlanetKey = "sun" | "moon" | "mars" | "mercury" | "jupiter" | "venus" | "saturn" | "rahu";
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

const PLANETS: Record<PlanetKey, { label: string; short: string; degree: number; color: string; tendency: string }> = {
  sun: { label: "Sun", short: "Su", degree: 20, color: VERMILION, tendency: "visible, principled, leadership-oriented" },
  moon: { label: "Moon", short: "Mo", degree: 17, color: BLUE, tendency: "responsive, caring, adaptive" },
  mars: { label: "Mars", short: "Ma", degree: 6, color: VERMILION, tendency: "direct, active, protective" },
  mercury: { label: "Mercury", short: "Me", degree: 2, color: GREEN, tendency: "communicative, youthful, intellectually engaged" },
  jupiter: { label: "Jupiter", short: "Ju", degree: 9, color: GREEN, tendency: "wise, ethical, guiding" },
  venus: { label: "Venus", short: "Ve", degree: 14, color: GOLD, tendency: "harmonizing, artistic, relational" },
  saturn: { label: "Saturn", short: "Sa", degree: 27, color: PURPLE, tendency: "mature, dutiful, steady" },
  rahu: { label: "Rahu", short: "Ra", degree: 29, color: PURPLE, tendency: "unconventional, foreign, boundary-crossing" },
};

const ROLE_LABELS_SEVEN = ["AK", "AmK", "BK", "MK", "PK", "GK", "DK"];
const ROLE_LABELS_EIGHT = ["AK", "AmK", "BK", "MK", "PK", "GK", "PiK", "DK"];

export function DarakarakaSpouseRegisterWorkbench() {
  const [scheme, setScheme] = useState<Scheme>("seven");
  const [degrees, setDegrees] = useState<Record<PlanetKey, number>>(() => Object.fromEntries((Object.keys(PLANETS) as PlanetKey[]).map((key) => [key, PLANETS[key].degree])) as Record<PlanetKey, number>);
  const [dkDignity, setDkDignity] = useState<Support>("strong");
  const [ulRegister, setUlRegister] = useState<Support>("strong");
  const [seventhVenus, setSeventhVenus] = useState<Support>("strong");
  const [variantNoted, setVariantNoted] = useState(true);
  const [tendencyLanguage, setTendencyLanguage] = useState(true);
  const [combinedRegisters, setCombinedRegisters] = useState(true);
  const [agencyFrame, setAgencyFrame] = useState(true);
  const [showCandidateDiff, setShowCandidateDiff] = useState(true);

  const rankedSeven = useMemo(() => rankPlanets(degrees, "seven"), [degrees]);
  const rankedEight = useMemo(() => rankPlanets(degrees, "eight"), [degrees]);
  const ranked = scheme === "seven" ? rankedSeven : rankedEight;
  const dk = ranked[ranked.length - 1];
  const alternateDk = scheme === "seven" ? rankedEight[rankedEight.length - 1] : rankedSeven[rankedSeven.length - 1];
  const variantDiffers = dk.key !== alternateDk.key;
  const registerAverage = Math.round((supportScore(dkDignity) + supportScore(ulRegister) + supportScore(seventhVenus)) / 3);
  const converges = Math.abs(supportScore(dkDignity) - supportScore(ulRegister)) <= 8 && Math.abs(registerAverage - supportScore(seventhVenus)) <= 8;
  const methodOk = variantNoted && tendencyLanguage && combinedRegisters && agencyFrame;
  const score = Math.max(
    5,
    Math.min(
      98,
      supportScore(dkDignity) +
        supportScore(ulRegister) +
        supportScore(seventhVenus) +
        (converges ? 18 : -6) +
        (variantDiffers && showCandidateDiff ? 8 : 0) +
        (methodOk ? 20 : -32),
    ),
  );

  const tier = useMemo(() => {
    if (!methodOk) return "method warning";
    if (converges && dkDignity === "strong" && ulRegister === "strong" && seventhVenus === "strong") return "multi-register confirmation";
    if (!converges || variantDiffers) return "candidate cross-check";
    if (dkDignity === "stressed") return "dk care theme";
    return "tendency support";
  }, [converges, dkDignity, methodOk, seventhVenus, ulRegister, variantDiffers]);

  const statement = useMemo(() => {
    if (!variantNoted) return "Pause: the 7-vs-8 karaka variant has not been named. State the scheme and cross-check the other candidate where it differs.";
    if (!tendencyLanguage) return "Pause: the DK is becoming an exact spouse portrait. Restore gentle tendency language and remove fixed profession, age, or appearance claims.";
    if (!combinedRegisters) return "Pause: the DK is being read alone. Combine it with the UL, the Parashari 7th, and Venus before confidence rises.";
    if (!agencyFrame) return "Pause: an afflicted DK must be framed as a partnership theme to attend to, not doom.";
    if (variantDiffers && showCandidateDiff) return `${schemeLabel(scheme)} gives ${dk.label} as DK, while the other scheme gives ${alternateDk.label}. Read both as candidate spouse-significators and let convergence with UL, 7th, and Venus decide confidence.`;
    if (tier === "multi-register confirmation") return `${dk.label} is the DK and its tendencies are supported by the UL and 7th/Venus stream. This is robust corroboration, still stated as inclinations rather than a fixed portrait.`;
    if (tier === "dk care theme") return `${dk.label} is the DK, but its condition is stressed. Name the partnership theme carefully and weigh it with the UL, 7th, and Venus.`;
    return `${dk.label} is the DK. Read its nature as ${dk.tendency} tendencies, then hold the result beside the UL and Venus before forming the final marriage statement.`;
  }, [agencyFrame, alternateDk.label, combinedRegisters, dk.label, dk.tendency, scheme, showCandidateDiff, tendencyLanguage, tier, variantDiffers, variantNoted]);

  return (
    <div data-interactive="darakaraka-spouse-register-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Darakaraka spouse register</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.35rem" }}>Find the lowest-degree karaka, then corroborate</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 930 }}>
              Identify the DK, compare the 7- and 8-karaka variants, and build a spouse reading as tendencies joined to the UL, 7th, and Venus.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setScheme("seven");
              setDegrees(Object.fromEntries((Object.keys(PLANETS) as PlanetKey[]).map((key) => [key, PLANETS[key].degree])) as Record<PlanetKey, number>);
              setDkDignity("strong");
              setUlRegister("strong");
              setSeventhVenus("strong");
              setVariantNoted(true);
              setTendencyLanguage(true);
              setCombinedRegisters(true);
              setAgencyFrame(true);
              setShowCandidateDiff(true);
            }}
            style={buttonStyle(false, PURPLE)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Current DK</p>
              <h3 style={{ margin: "0.15rem 0 0", color: dk.color, fontSize: "1.2rem" }}>{dk.label} is Darakaraka</h3>
            </div>
            <strong style={{ color: tierColor(tier) }}>{score}% confidence</strong>
          </div>
          <DkRankingSvg ranked={ranked} scheme={scheme} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="AK pole" body={`${ranked[0].label}: highest`} color={GOLD} icon={<ArrowDownWideNarrow size={16} />} />
            <MiniFact title="DK pole" body={`${dk.label}: lowest`} color={dk.color} icon={<UserRound size={16} />} />
            <MiniFact title="Variant" body={variantDiffers ? `${alternateDk.label} in other scheme` : "same DK"} color={variantDiffers ? GOLD : GREEN} icon={<GitCompare size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Karaka scheme" icon={<SlidersHorizontal size={18} />} color={scheme === "seven" ? BLUE : PURPLE}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <button type="button" aria-pressed={scheme === "seven"} onClick={() => setScheme("seven")} style={buttonStyle(scheme === "seven", BLUE)}>
                7-karaka
              </button>
              <button type="button" aria-pressed={scheme === "eight"} onClick={() => setScheme("eight")} style={buttonStyle(scheme === "eight", PURPLE)}>
                8-karaka
              </button>
            </div>
            <p style={bodyTextStyle}>{scheme === "seven" ? "Sun through Saturn are ranked; the lowest of seven is DK." : "Rahu joins by reverse degree; the lowest of eight is DK."}</p>
            <Toggle active={showCandidateDiff} color={showCandidateDiff ? GOLD : INK_MUTED} icon={<GitCompare size={18} />} title="Show other-scheme candidate" body={variantDiffers ? `Other scheme points to ${alternateDk.label}.` : "Both schemes currently agree."} onClick={() => setShowCandidateDiff((value) => !value)} />
          </Panel>

          <Panel title="Register conditions" icon={<Scale size={18} />} color={converges ? GREEN : GOLD}>
            <Segmented label="DK placement and dignity" value={dkDignity} options={[["strong", "Strong"], ["mixed", "Mixed"], ["stressed", "Stressed"]]} colors={{ strong: GREEN, mixed: GOLD, stressed: VERMILION }} onChange={(value) => setDkDignity(value as Support)} />
            <Segmented label="UL register" value={ulRegister} options={[["strong", "Strong"], ["mixed", "Mixed"], ["stressed", "Stressed"]]} colors={{ strong: GREEN, mixed: GOLD, stressed: VERMILION }} onChange={(value) => setUlRegister(value as Support)} />
            <Segmented label="7th and Venus" value={seventhVenus} options={[["strong", "Strong"], ["mixed", "Mixed"], ["stressed", "Stressed"]]} colors={{ strong: GREEN, mixed: GOLD, stressed: VERMILION }} onChange={(value) => setSeventhVenus(value as Support)} />
          </Panel>
        </section>
      </div>

      <section style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", color: GOLD }}>
          <SlidersHorizontal size={18} />
          <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>Move degrees to test DK identification</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 145px), 1fr))", gap: "0.65rem", marginTop: "0.8rem" }}>
          {(Object.keys(PLANETS) as PlanetKey[]).filter((key) => scheme === "eight" || key !== "rahu").map((key) => {
            const planet = PLANETS[key];
            const rankedPlanet = ranked.find((item) => item.key === key);
            return (
              <label key={key} style={{ border: `1px solid ${rankedPlanet?.role === "DK" ? planet.color : HAIRLINE}`, borderRadius: 8, padding: "0.7rem", background: rankedPlanet?.role === "DK" ? `${planet.color}12` : "transparent", display: "grid", gap: "0.45rem" }}>
                <span style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", alignItems: "center" }}>
                  <strong style={{ color: planet.color, fontWeight: 700 }}>{planet.label}</strong>
                  <span style={{ color: INK_MUTED, fontWeight: 700 }}>{rankedPlanet?.role}</span>
                </span>
                <input type="range" min={0} max={29.99} step={0.01} value={degrees[key]} onChange={(event) => setDegrees((items) => ({ ...items, [key]: Number(event.target.value) }))} style={{ width: "100%", accentColor: planet.color }} />
                <span style={{ color: INK_SECONDARY, fontSize: "0.82rem" }}>{key === "rahu" ? `${degrees[key].toFixed(2)} natal / ${(30 - degrees[key]).toFixed(2)} ranked` : `${degrees[key].toFixed(2)} deg`}</span>
              </label>
            );
          })}
        </div>
      </section>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Discipline gates</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={variantNoted} color={variantNoted ? GREEN : VERMILION} icon={<BadgeCheck size={18} />} title="Variant noted" body={variantNoted ? "Scheme is stated and alternate candidate is acknowledged." : "One scheme is being presented as the only truth."} onClick={() => setVariantNoted((value) => !value)} />
            <Toggle active={tendencyLanguage} color={tendencyLanguage ? GREEN : VERMILION} icon={<Sparkles size={18} />} title="Tendencies, not stereotype" body={tendencyLanguage ? "Spouse traits are held gently." : "The reading is becoming a fixed portrait."} onClick={() => setTendencyLanguage((value) => !value)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Corroboration gates</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={combinedRegisters} color={combinedRegisters ? GREEN : VERMILION} icon={<GitCompare size={18} />} title="Combined with UL, 7th, Venus" body={combinedRegisters ? "DK is a third register." : "DK is being isolated."} onClick={() => setCombinedRegisters((value) => !value)} />
            <Toggle active={agencyFrame} color={agencyFrame ? GREEN : VERMILION} icon={<ShieldCheck size={18} />} title="Agency frame" body={agencyFrame ? "Affliction is a theme to attend." : "Affliction is being treated as doom."} onClick={() => setAgencyFrame((value) => !value)} />
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: `${tierColor(tier)}66`, background: `${tierColor(tier)}10` }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          {methodOk ? <HeartHandshake size={20} color={tierColor(tier)} aria-hidden="true" /> : <TriangleAlert size={20} color={tierColor(tier)} aria-hidden="true" />}
          <div>
            <p style={eyebrowStyle}>Interpretive statement</p>
            <h3 style={{ margin: "0.15rem 0 0", color: tierColor(tier), fontSize: "1.16rem" }}>{tier}</h3>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{statement}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function rankPlanets(degrees: Record<PlanetKey, number>, scheme: Scheme) {
  const included = (Object.keys(PLANETS) as PlanetKey[]).filter((key) => scheme === "eight" || key !== "rahu");
  const labels = scheme === "seven" ? ROLE_LABELS_SEVEN : ROLE_LABELS_EIGHT;
  return included
    .map((key) => ({ key, ...PLANETS[key], degree: degrees[key], rankingDegree: key === "rahu" ? 30 - degrees[key] : degrees[key] }))
    .sort((a, b) => b.rankingDegree - a.rankingDegree)
    .map((planet, index) => ({ ...planet, role: labels[index] }));
}

function DkRankingSvg({ ranked, scheme }: { ranked: ReturnType<typeof rankPlanets>; scheme: Scheme }) {
  const dk = ranked[ranked.length - 1];
  return (
    <svg viewBox="0 0 780 380" role="img" aria-label="Cara-karaka degree ranking from AK highest to DK lowest" style={{ width: "100%", minHeight: 290, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="744" height="344" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="390" y="56" textAnchor="middle" fill={GOLD} fontSize="20" fontWeight="700">{schemeLabel(scheme).toUpperCase()} DEGREE RANKING</text>
      <line x1="90" y1="130" x2="690" y2="130" stroke={HAIRLINE} strokeWidth="10" strokeLinecap="round" />
      <text x="90" y="101" textAnchor="middle" fill={INK_SECONDARY} fontSize="14" fontWeight="700">highest degree</text>
      <text x="690" y="101" textAnchor="middle" fill={INK_SECONDARY} fontSize="14" fontWeight="700">lowest degree</text>
      {ranked.map((planet, index) => {
        const x = 90 + (index * 600) / Math.max(1, ranked.length - 1);
        const active = planet.role === "DK";
        return (
          <g key={planet.key}>
            <circle cx={x} cy="130" r={active ? 16 : 11} fill={active ? OPAQUE_LIGHT_FILL[planet.color] : SURFACE} stroke={active ? planet.color : HAIRLINE} strokeWidth={active ? 3 : 1.5} />
            <rect x={x - 43} y="168" width="86" height="78" rx="8" fill={active ? OPAQUE_LIGHT_FILL[planet.color] : "transparent"} stroke={active ? planet.color : HAIRLINE} strokeWidth={active ? 2.5 : 1.2} />
            <text x={x} y="191" textAnchor="middle" fill={active ? planet.color : INK_SECONDARY} fontSize="18" fontWeight="700">{planet.role}</text>
            <text x={x} y="216" textAnchor="middle" fill={planet.color} fontSize="15" fontWeight="700">{planet.short}</text>
            <text x={x} y="238" textAnchor="middle" fill={INK_SECONDARY} fontSize="13.5" fontWeight="600">{planet.rankingDegree.toFixed(2)} deg</text>
          </g>
        );
      })}
      <rect x="148" y="288" width="484" height="46" rx="8" fill={OPAQUE_LIGHT_FILL[dk.color]} stroke={dk.color} />
      <text x="390" y="317" textAnchor="middle" fill={dk.color} fontSize="18" fontWeight="700">DK = {dk.label}, the lowest-degree spouse significator</text>
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

function tierColor(tier: string): string {
  if (tier === "multi-register confirmation") return GREEN;
  if (tier === "tendency support") return BLUE;
  if (tier === "candidate cross-check") return GOLD;
  if (tier === "dk care theme") return GOLD;
  return VERMILION;
}

function schemeLabel(scheme: Scheme): string {
  return scheme === "seven" ? "7-karaka" : "8-karaka";
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
