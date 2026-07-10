"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { AlertTriangle, BookOpenText, Brush, CheckCircle2, Clock3, Gauge, GraduationCap, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";

type Planet = "Mercury" | "Jupiter" | "Venus";
type ActiveView = "formation" | "capacity" | "dasha" | "streams";
type DashaLord = Planet | "Saturn";

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
  [GREEN]: "#E8F5E9",
  [BLUE]: "#E3F2FD",
  [PURPLE]: "#EDE7F6",
  [VERMILION]: "#FFEBEE",
  [GOLD]: "#FFF3E0",
};

const PLANETS: Array<{ planet: Planet; gift: string; color: string; icon: ReactNode }> = [
  { planet: "Mercury", gift: "language, analysis, writing", color: GREEN, icon: <BookOpenText size={16} /> },
  { planet: "Jupiter", gift: "wisdom, teaching, scholarship", color: GOLD, icon: <GraduationCap size={16} /> },
  { planet: "Venus", gift: "art, aesthetics, refinement", color: PURPLE, icon: <Brush size={16} /> },
];

const VIEW_COPY: Record<ActiveView, { label: string; title: string; body: string; color: string; icon: ReactNode }> = {
  formation: {
    label: "Formation",
    title: "Check the classical Sarasvati conditions first",
    body: "Mercury, Jupiter, and Venus should be well placed in kendras, trikonas, or the 2nd, with dignity support and a strong Jupiter.",
    color: GOLD,
    icon: <Sparkles size={16} />,
  },
  capacity: {
    label: "Capacity",
    title: "A yoga is only as strong as its forming planets",
    body: "Strong, dignified planets make the yoga potent. Weak or afflicted planets reduce it to an inclination or partial talent.",
    color: BLUE,
    icon: <Gauge size={16} />,
  },
  dasha: {
    label: "Dasha",
    title: "The yoga flowers in Mercury, Jupiter, or Venus periods",
    body: "A strong Sarasvati yoga can still be latent when the current period does not belong to one of its forming planets.",
    color: GREEN,
    icon: <Clock3 size={16} />,
  },
  streams: {
    label: "Streams",
    title: "Use the yoga to name the vocation type",
    body: "The yoga points to learning, teaching, writing, speech, and arts; the 10th/D10, AmK, KP, and dasha place and time the vocation.",
    color: PURPLE,
    icon: <ShieldCheck size={16} />,
  },
};

export function SarasvatiLearningArtsWorkbench() {
  const [activeView, setActiveView] = useState<ActiveView>("formation");
  const [wellPlaced, setWellPlaced] = useState<Record<Planet, boolean>>({ Mercury: true, Jupiter: true, Venus: true });
  const [dignified, setDignified] = useState<Record<Planet, boolean>>({ Mercury: true, Jupiter: true, Venus: true });
  const [jupiterStrong, setJupiterStrong] = useState(true);
  const [dashaLord, setDashaLord] = useState<DashaLord>("Jupiter");
  const [buddhadityaCombust, setBuddhadityaCombust] = useState(false);
  const [gajaKesariSupport, setGajaKesariSupport] = useState(true);
  const [streamConfirm, setStreamConfirm] = useState(true);

  const placementCount = PLANETS.filter(({ planet }) => wellPlaced[planet]).length;
  const dignityCount = PLANETS.filter(({ planet }) => dignified[planet]).length;
  const fullFormation = placementCount === 3 && dignityCount === 3 && jupiterStrong;
  const partialFormation = placementCount >= 2 && dignityCount >= 2;
  const activeDasha = dashaLord !== "Saturn";
  const capacityScore = Math.max(5, Math.min(98, placementCount * 18 + dignityCount * 14 + (jupiterStrong ? 18 : -12) + (gajaKesariSupport ? 6 : 0) - (buddhadityaCombust ? 12 : 0)));
  const totalScore = Math.max(5, Math.min(98, capacityScore + (activeDasha ? 16 : -18) + (streamConfirm ? 10 : -10)));

  const verdict = useMemo(() => {
    if (!partialFormation) return "Incomplete yoga: the three-planet learning signature is too weak to call a full Sarasvati yoga.";
    if (!fullFormation) return "Partial Sarasvati signal: learning and arts are indicated, but the promise should be stated as moderate or muted.";
    if (!activeDasha) return "Strong but latent: Sarasvati yoga is well formed, but Saturn-Mars style timing does not activate Mercury, Jupiter, or Venus now.";
    if (!streamConfirm) return "Potent and active as a talent, but the career streams still need to place it before declaring it the main profession.";
    return "Potent and active: a strong Sarasvati yoga is running through a forming-planet period and is supported as a learning/arts vocation.";
  }, [activeDasha, fullFormation, partialFormation, streamConfirm]);

  return (
    <div data-interactive="sarasvati-learning-arts-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Sarasvati learning and arts yoga</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>Name the vocation, then test capacity and timing</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Build Sarasvati yoga from Mercury, Jupiter, and Venus, then decide whether it is potent, muted, active, or latent.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveView("formation");
              setWellPlaced({ Mercury: true, Jupiter: true, Venus: true });
              setDignified({ Mercury: true, Jupiter: true, Venus: true });
              setJupiterStrong(true);
              setDashaLord("Jupiter");
              setBuddhadityaCombust(false);
              setGajaKesariSupport(true);
              setStreamConfirm(true);
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
          {(Object.keys(VIEW_COPY) as ActiveView[]).map((view) => (
            <button key={view} type="button" aria-pressed={activeView === view} onClick={() => setActiveView(view)} style={buttonStyle(activeView === view, VIEW_COPY[view].color)}>
              {VIEW_COPY[view].icon}
              {VIEW_COPY[view].label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "0.8rem", border: `1px solid ${VIEW_COPY[activeView].color}55`, borderRadius: 8, background: `${VIEW_COPY[activeView].color}10`, padding: "0.85rem" }}>
          <h3 style={{ margin: 0, color: VIEW_COPY[activeView].color, fontSize: "1.12rem", fontWeight: 600 }}>{VIEW_COPY[activeView].title}</h3>
          <p style={bodyTextStyle}>{VIEW_COPY[activeView].body}</p>
        </div>
      </section>

      <div style={diagramLayoutStyle}>
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Yoga diagnostic mandala</p>
              <h3 style={{ margin: "0.15rem 0 0", color: fullFormation && activeDasha ? GREEN : partialFormation ? GOLD : VERMILION, fontSize: "1.2rem", fontWeight: 600 }}>
                {fullFormation ? (activeDasha ? "Potent and active" : "Potent but latent") : partialFormation ? "Partial or muted" : "Incomplete"}
              </h3>
            </div>
            <span style={{ color: totalScore > 70 ? GREEN : totalScore > 45 ? GOLD : VERMILION, fontWeight: 600 }}>{totalScore}% vocation signal</span>
          </div>
          <SarasvatiSvg wellPlaced={wellPlaced} dignified={dignified} jupiterStrong={jupiterStrong} activeDasha={activeDasha} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 135px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="Capacity" body={`${capacityScore}% planet support`} color={capacityScore > 70 ? GREEN : GOLD} icon={<Gauge size={16} />} />
            <MiniFact title="Dasha" body={activeDasha ? `${dashaLord} activates` : "off-dasha latent"} color={activeDasha ? GREEN : VERMILION} icon={<Clock3 size={16} />} />
            <MiniFact title="Vocation" body="learning, speech, arts" color={PURPLE} icon={<Brush size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Forming planets" icon={<Sparkles size={18} />} color={GOLD}>
            <div style={{ display: "grid", gap: "0.6rem" }}>
              {PLANETS.map(({ planet, gift, color, icon }) => (
                <div key={planet} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.65rem", background: SURFACE }}>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", color }}>
                    {icon}
                    <span style={{ fontWeight: 600 }}>{planet}</span>
                  </div>
                  <p style={{ ...bodyTextStyle, marginTop: "0.35rem" }}>{gift}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginTop: "0.55rem" }}>
                    <button type="button" aria-pressed={wellPlaced[planet]} onClick={() => setWellPlaced((current) => ({ ...current, [planet]: !current[planet] }))} style={buttonStyle(wellPlaced[planet], color)}>
                      well placed
                    </button>
                    <button type="button" aria-pressed={dignified[planet]} onClick={() => setDignified((current) => ({ ...current, [planet]: !current[planet] }))} style={buttonStyle(dignified[planet], color)}>
                      dignified
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </section>
      </div>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Capacity and related yogas</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={jupiterStrong} color={jupiterStrong ? GREEN : VERMILION} icon={<GraduationCap size={18} />} title="Jupiter strong" body={jupiterStrong ? "Classical capacity condition is satisfied." : "Weak Jupiter breaks or mutes Sarasvati."} onClick={() => setJupiterStrong((value) => !value)} />
            <Toggle active={!buddhadityaCombust} color={!buddhadityaCombust ? GREEN : VERMILION} icon={<BookOpenText size={18} />} title="Buddhaditya combustion check" body={buddhadityaCombust ? "Mercury-Sun intelligence signal is muted by combustion." : "Mercury-Sun support is not muted by combustion."} onClick={() => setBuddhadityaCombust((value) => !value)} />
            <Toggle active={gajaKesariSupport} color={gajaKesariSupport ? GREEN : GOLD} icon={<ShieldCheck size={18} />} title="Gaja-Kesari support" body={gajaKesariSupport ? "Jupiter-Moon kendra supports repute and teaching." : "Repute support is absent or not emphasized."} onClick={() => setGajaKesariSupport((value) => !value)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Dasha and career streams</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <div>
              <p style={{ ...eyebrowStyle, marginBottom: "0.45rem" }}>Current period</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {(["Mercury", "Jupiter", "Venus", "Saturn"] as DashaLord[]).map((lord) => (
                  <button key={lord} type="button" aria-pressed={dashaLord === lord} onClick={() => setDashaLord(lord)} style={buttonStyle(dashaLord === lord, lord === "Saturn" ? VERMILION : GREEN)}>
                    {lord}
                  </button>
                ))}
              </div>
            </div>
            <Toggle active={streamConfirm} color={streamConfirm ? GREEN : GOLD} icon={<CheckCircle2 size={18} />} title="10th/D10/AmK confirm vocation" body={streamConfirm ? "Streams place the yoga as career, not hobby only." : "Yoga names a talent, but streams have not confirmed profession."} onClick={() => setStreamConfirm((value) => !value)} />
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: totalScore > 70 ? `${GREEN}66` : totalScore > 45 ? `${GOLD}66` : `${VERMILION}66`, background: totalScore > 70 ? `${GREEN}10` : totalScore > 45 ? `${GOLD}10` : `${VERMILION}0F` }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          <AlertTriangle size={20} color={totalScore > 70 ? GREEN : totalScore > 45 ? GOLD : VERMILION} aria-hidden="true" />
          <div>
            <p style={eyebrowStyle}>Honest career reading</p>
            <h3 style={{ margin: "0.15rem 0 0", color: totalScore > 70 ? GREEN : totalScore > 45 ? GOLD : VERMILION, fontSize: "1.16rem", fontWeight: 600 }}>
              {fullFormation && activeDasha ? "Learning and arts vocation flowering now" : activeDasha ? "Learning and arts signal needs proportion" : "Promise separated from timing"}
            </h3>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{verdict}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function SarasvatiSvg({ wellPlaced, dignified, jupiterStrong, activeDasha }: { wellPlaced: Record<Planet, boolean>; dignified: Record<Planet, boolean>; jupiterStrong: boolean; activeDasha: boolean }) {
  const cx = 360;
  const cy = 220;
  const r = 78;
  const points = [
    { planet: "Mercury" as Planet, x: 170, y: 86, color: GREEN },
    { planet: "Jupiter" as Planet, x: cx, y: 58, color: GOLD },
    { planet: "Venus" as Planet, x: 550, y: 86, color: PURPLE },
  ];
  return (
    <svg viewBox="0 0 720 390" role="img" aria-label="Sarasvati yoga capacity and dasha diagram" style={{ width: "100%", minHeight: 290, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="684" height="354" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <circle cx={cx} cy={cy} r={r} fill={OPAQUE_LIGHT_FILL[GOLD]} stroke={activeDasha ? GREEN : GOLD} strokeWidth="3" />
      <text x={cx} y={cy - 6} textAnchor="middle" fill={INK_PRIMARY} fontSize="22" fontWeight="600">Sarasvati</text>
      <text x={cx} y={cy + 20} textAnchor="middle" fill={INK_MUTED} fontSize="16">{activeDasha ? "forming-planet dasha active" : "off-dasha latent"}</text>
      {points.map((point) => {
        const formed = wellPlaced[point.planet] && dignified[point.planet] && (point.planet !== "Jupiter" || jupiterStrong);
        const planetR = 46;
        const endAngle = point.planet === "Mercury" ? (5 * Math.PI) / 4 : point.planet === "Venus" ? (7 * Math.PI) / 4 : -Math.PI / 2;
        const endX = cx + r * Math.cos(endAngle);
        const endY = cy + r * Math.sin(endAngle);
        return (
          <g key={point.planet}>
            <path d={`M ${point.x} ${point.y + planetR} C ${point.x + (cx - point.x) * 0.45} ${cy - 40}, ${cx + (point.x - cx) * 0.2} ${endY - 20}, ${endX} ${endY}`} fill="none" stroke={formed ? point.color : HAIRLINE} strokeWidth={formed ? 3 : 1.5} strokeDasharray={formed ? undefined : "5 5"} />
            <circle cx={point.x} cy={point.y} r={planetR} fill={formed ? OPAQUE_LIGHT_FILL[point.color] || `${point.color}18` : "transparent"} stroke={formed ? point.color : HAIRLINE} strokeWidth={formed ? 3 : 1.5} />
            <text x={point.x} y={point.y - 3} textAnchor="middle" fill={formed ? point.color : INK_MUTED} fontSize="18" fontWeight="600">{point.planet}</text>
            <text x={point.x} y={point.y + 19} textAnchor="middle" fill={INK_MUTED} fontSize="15">{formed ? "capacity ok" : "muted"}</text>
          </g>
        );
      })}
      <rect x="210" y="305" width="300" height="38" rx="8" fill={activeDasha ? OPAQUE_LIGHT_FILL[GREEN] : OPAQUE_LIGHT_FILL[VERMILION]} stroke={activeDasha ? GREEN : VERMILION} />
      <text x="360" y="328" textAnchor="middle" fill={activeDasha ? GREEN : VERMILION} fontSize="15" fontWeight="600">Yoga fruit is judged through dasha</text>
    </svg>
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
        <span style={{ display: "block", fontWeight: 600 }}>{title}</span>
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
        <span style={{ fontSize: "0.86rem", fontWeight: 600 }}>{title}</span>
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

const responsiveTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))",
  gap: "1rem",
};

const diagramLayoutStyle: CSSProperties = {
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
    fontWeight: 500,
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
