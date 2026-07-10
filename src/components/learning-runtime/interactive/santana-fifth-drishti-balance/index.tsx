"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Heart, HeartPulse, Orbit, RefreshCcw, Scale, Sparkles, Target, TriangleAlert } from "lucide-react";
import { workbenchDiagramLayoutStyle } from "../lib/layouts";

type TargetKey = "house" | "lord";
type StrengthKey = "mild" | "strong";

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

type PlanetNature = "jupiter" | "benefic" | "neutral" | "malefic";

interface Planet {
  key: string;
  name: string;
  glyph: string;
  nature: PlanetNature;
  color: string;
  angle: number;
}

const PLANETS: Planet[] = [
  { key: "jupiter", name: "Jupiter", glyph: "♃", nature: "jupiter", color: GOLD, angle: 270 },
  { key: "venus", name: "Venus", glyph: "♀", nature: "benefic", color: GOLD, angle: 310 },
  { key: "moon", name: "Moon", glyph: "☽", nature: "benefic", color: BLUE, angle: 350 },
  { key: "mercury", name: "Mercury", glyph: "☿", nature: "benefic", color: GREEN, angle: 30 },
  { key: "sun", name: "Sun", glyph: "☉", nature: "neutral", color: VERMILION, angle: 70 },
  { key: "mars", name: "Mars", glyph: "♂", nature: "malefic", color: VERMILION, angle: 110 },
  { key: "rahu", name: "Rāhu", glyph: "☊", nature: "malefic", color: PURPLE, angle: 150 },
  { key: "ketu", name: "Ketu", glyph: "☋", nature: "malefic", color: PURPLE, angle: 190 },
  { key: "saturn", name: "Saturn", glyph: "♄", nature: "malefic", color: PURPLE, angle: 230 },
];

const CENTER = { x: 170, y: 170 };
const ORBIT_RADIUS = 118;
const PLANET_RADIUS = 20;

function polarToCartesian(cx: number, cy: number, radius: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

function planetScore(planet: Planet, strength: StrengthKey, dignified: boolean): number {
  const s = strength === "strong" ? 1 : 0.5;
  let base = 0;
  if (planet.nature === "jupiter") base = 3 * s;
  else if (planet.nature === "benefic") base = 1 * s;
  else if (planet.nature === "malefic") base = -2 * s;
  else base = 0;
  if (planet.nature === "malefic" && dignified) base = base * 0.5;
  return base;
}

function netBarMetrics(score: number): { marginLeft: string; width: string; percent: number } {
  const min = -10;
  const max = 10;
  const percent = Math.max(0, Math.min(100, ((score - min) / (max - min)) * 100));
  const offset = percent - 50;
  return {
    marginLeft: offset >= 0 ? "50%" : `${50 + offset}%`,
    width: `${Math.abs(offset)}%`,
    percent,
  };
}

export function SantanaFifthDrishtiBalance() {
  const [target, setTarget] = useState<TargetKey>("house");
  const [active, setActive] = useState<Record<string, boolean>>({ jupiter: true, saturn: true });
  const [strength, setStrength] = useState<Record<string, StrengthKey>>({ jupiter: "strong", saturn: "strong" });
  const [dignified, setDignified] = useState<Record<string, boolean>>({});
  const [showRays, setShowRays] = useState(true);
  const [nonFatalistic, setNonFatalistic] = useState(true);
  const [medicalRoute, setMedicalRoute] = useState(true);
  const [distressPause, setDistressPause] = useState(true);

  const activePlanets = useMemo(() => PLANETS.filter((p) => active[p.key]), [active]);
  const netScore = useMemo(
    () => activePlanets.reduce((sum, p) => sum + planetScore(p, strength[p.key] ?? "mild", dignified[p.key] ?? false), 0),
    [activePlanets, dignified, strength]
  );
  const careFrame = nonFatalistic && medicalRoute && distressPause;

  const verdict = useMemo(() => {
    if (!careFrame) return { label: "care frame needs repair", color: VERMILION };
    if (netScore >= 3) return { label: "strongly favourable net", color: GREEN };
    if (netScore > 0) return { label: "favourable net", color: GREEN };
    if (netScore === 0) return { label: "mixed net", color: GOLD };
    if (netScore <= -3) return { label: "challenging net", color: VERMILION };
    return { label: "mildly challenging net", color: GOLD };
  }, [careFrame, netScore]);

  const synthesis = useMemo(() => {
    const targetName = target === "house" ? "the 5th house" : "the 5th lord";
    const benefics = activePlanets.filter((p) => p.nature === "jupiter" || p.nature === "benefic");
    const malefics = activePlanets.filter((p) => p.nature === "malefic");
    const relief = benefics.length ? `Benefic relief from ${benefics.map((p) => p.name).join(", ")}.` : "No benefic relief selected.";
    const stress = malefics.length
      ? `Malefic stress from ${malefics.map((p) => `${p.name}${dignified[p.key] ? " (dignified)" : ""}`).join(", ")}.`
      : "No malefic stress selected.";
    const dignityNote = malefics.some((p) => dignified[p.key])
      ? "A dignified malefic softens its stress — dignity modifies the aspect."
      : "";
    const frame = careFrame
      ? "Framed as a graded tendency, with medical routing and distress awareness intact."
      : "Repair the care frame before giving the reading.";
    return `Reading aspects on ${targetName}. ${relief} ${stress} ${dignityNote} The net score is ${netScore > 0 ? "+" : ""}${netScore.toFixed(1)}: ${verdict.label}. ${frame}`;
  }, [activePlanets, careFrame, dignified, netScore, target, verdict.label]);

  function togglePlanet(key: string) {
    setActive((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (next[key] && !strength[key]) {
        setStrength((s) => ({ ...s, [key]: "strong" }));
      }
      return next;
    });
  }

  function setPlanetStrength(key: string, value: StrengthKey) {
    setStrength((prev) => ({ ...prev, [key]: value }));
    setActive((prev) => ({ ...prev, [key]: true }));
  }

  function setPlanetDignified(key: string, value: boolean) {
    setDignified((prev) => ({ ...prev, [key]: value }));
    setActive((prev) => ({ ...prev, [key]: true }));
  }

  function reset() {
    setTarget("house");
    setActive({ jupiter: true, saturn: true });
    setStrength({ jupiter: "strong", saturn: "strong" });
    setDignified({});
    setShowRays(true);
    setNonFatalistic(true);
    setMedicalRoute(true);
    setDistressPause(true);
  }

  return (
    <div data-interactive="santana-fifth-drishti-balance" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Dṛṣṭi net for saṁtāna</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.28rem", fontWeight: 600 }}>Weigh benefic relief against malefic stress</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Build the aspect picture on the 5th house and the 5th lord. Jupiter&apos;s glance is the strongest relief; malefics bring stress to weigh, never a verdict.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Aspect diagram</p>
              <h3 style={{ margin: "0.15rem 0 0", color: verdict.color, fontSize: "1.12rem", fontWeight: 600 }}>{verdict.label}</h3>
            </div>
            <strong style={{ color: netScore >= 0 ? GREEN : VERMILION, fontWeight: 600 }}>{netScore > 0 ? "+" : ""}{netScore.toFixed(1)} net</strong>
          </div>
          <AspectNetSvg active={active} target={target} showRays={showRays} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "0.65rem" }}>
            <MiniFact icon={<Target size={16} />} title="Target" body={target === "house" ? "5th house" : "5th lord"} color={BLUE} />
            <MiniFact icon={<Sparkles size={16} />} title="Relief" body={`${activePlanets.filter((p) => p.nature === "jupiter" || p.nature === "benefic").length} planet(s)`} color={GREEN} />
            <MiniFact icon={<TriangleAlert size={16} />} title="Stress" body={`${activePlanets.filter((p) => p.nature === "malefic").length} planet(s)`} color={VERMILION} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Aspect target" icon={<Target size={18} />} color={BLUE}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <button type="button" aria-pressed={target === "house"} onClick={() => setTarget("house")} style={smallChipStyle(target === "house", BLUE)}>
                5th house
              </button>
              <button type="button" aria-pressed={target === "lord"} onClick={() => setTarget("lord")} style={smallChipStyle(target === "lord", PURPLE)}>
                5th lord
              </button>
            </div>
            <p style={bodyTextStyle}>Assess both targets in a real reading. The house is the field; the lord is the agent carrying the saṁtāna signal.</p>
          </Panel>

          <Panel title="Ray overlay" icon={<Orbit size={18} />} color={showRays ? BLUE : GOLD}>
            <button type="button" aria-pressed={showRays} onClick={() => setShowRays((value) => !value)} style={smallChipStyle(showRays, BLUE)}>
              {showRays ? "Rays visible" : "Show rays"}
            </button>
            <p style={bodyTextStyle}>Gold rays carry Jupiter&apos;s relief; green rays carry benefic support; vermilion/purple rays carry malefic stress.</p>
          </Panel>

          <Panel title="Planet roster" icon={<Scale size={18} />} color={GOLD}>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              {PLANETS.map((planet) => {
                const isActive = active[planet.key] ?? false;
                const isMalefic = planet.nature === "malefic";
                const isStrong = (strength[planet.key] ?? "mild") === "strong";
                return (
                  <div key={planet.key} style={{ border: `1px solid ${isActive ? planet.color : HAIRLINE}`, borderRadius: 8, background: isActive ? `${planet.color}10` : "transparent", padding: "0.65rem" }}>
                    <div style={{ display: "flex", gap: "0.55rem", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
                      <button type="button" aria-pressed={isActive} onClick={() => togglePlanet(planet.key)} style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", border: "none", background: "transparent", color: isActive ? planet.color : INK_SECONDARY, fontWeight: 600, cursor: "pointer", padding: 0 }}>
                        <span style={{ fontSize: "1.15rem" }}>{planet.glyph}</span>
                        {planet.name}
                      </button>
                      <div style={{ display: "flex", gap: "0.35rem" }}>
                        <button type="button" aria-pressed={isActive && isStrong} onClick={() => setPlanetStrength(planet.key, "strong")} style={microChipStyle(isActive && isStrong, planet.color)}>
                          Strong
                        </button>
                        <button type="button" aria-pressed={isActive && !isStrong} onClick={() => setPlanetStrength(planet.key, "mild")} style={microChipStyle(isActive && !isStrong, planet.color)}>
                          Mild
                        </button>
                      </div>
                    </div>
                    {isMalefic ? (
                      <label style={{ display: "flex", gap: "0.45rem", alignItems: "center", marginTop: "0.55rem", color: INK_SECONDARY, fontSize: "0.85rem", cursor: "pointer" }}>
                        <input type="checkbox" checked={dignified[planet.key] ?? false} onChange={(e) => setPlanetDignified(planet.key, e.target.checked)} aria-label={`${planet.name} dignified`} />
                        Dignified / yogakāraka (softens stress)
                      </label>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </Panel>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Net balance</p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginTop: "0.75rem" }}>
            <span style={{ color: VERMILION, fontWeight: 600, fontSize: "0.86rem" }}>Stress</span>
            <div style={{ flex: 1, height: 14, borderRadius: 8, background: `${HAIRLINE}`, overflow: "hidden", border: `1px solid ${HAIRLINE}` }}>
              {(() => {
                const bar = netBarMetrics(netScore);
                return <div style={{ width: bar.width, marginLeft: bar.marginLeft, height: "100%", background: netScore >= 0 ? GREEN : VERMILION, transition: "all 240ms ease" }} />;
              })()}
            </div>
            <span style={{ color: GREEN, fontWeight: 600, fontSize: "0.86rem" }}>Relief</span>
          </div>
          <p style={{ margin: "0.75rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
            {netScore > 0
              ? "Relief outweighs stress. The saṁtāna picture is supported; timing and dignity still refine the reading."
              : netScore === 0
                ? "Relief and stress balance. Look to the 5th lord, D7, and daśā to tilt the reading."
                : "Stress outweighs relief. Read this as a challenge with agency, never a foreclosure."}
          </p>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Care frame</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <Toggle active={nonFatalistic} color={nonFatalistic ? GREEN : VERMILION} icon={<TriangleAlert size={18} />} title="Indication, not decree" body={nonFatalistic ? "No childlessness foreclosure." : "Forbidden foreclosure claim active."} onClick={() => setNonFatalistic((value) => !value)} />
            <Toggle active={medicalRoute} color={medicalRoute ? GREEN : VERMILION} icon={<HeartPulse size={18} />} title="Medical routing intact" body={medicalRoute ? "Clinical concerns go to specialists." : "Chart replacing medical care."} onClick={() => setMedicalRoute((value) => !value)} />
            <Toggle active={distressPause} color={distressPause ? GREEN : PURPLE} icon={<Heart size={18} />} title="Pause for visible distress" body={distressPause ? "Care before technique." : "Continuing through distress."} onClick={() => setDistressPause((value) => !value)} />
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: `${verdict.color}66`, background: `${verdict.color}10` }}>
        <p style={eyebrowStyle}>Synthesis</p>
        <h3 style={{ margin: "0.15rem 0 0", color: verdict.color, fontSize: "1.12rem", fontWeight: 600 }}>{verdict.label}</h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{synthesis}</p>
      </section>
    </div>
  );
}

function AspectNetSvg({ active, target, showRays }: { active: Record<string, boolean>; target: TargetKey; showRays: boolean }) {
  return (
    <svg viewBox="0 0 340 340" role="img" aria-label="Aspect net showing planets aspecting the 5th house or 5th lord" style={{ width: "100%", maxHeight: 400, margin: "0.4rem auto 0.85rem", display: "block" }}>
      <rect x="10" y="10" width="320" height="320" rx="10" fill={`${GOLD}05`} stroke={HAIRLINE} strokeWidth="1.5" />

      {/* Orbit ring */}
      <circle cx={CENTER.x} cy={CENTER.y} r={ORBIT_RADIUS} fill="none" stroke={HAIRLINE} strokeWidth="1" strokeDasharray="4 4" />

      {/* Rays to target */}
      {showRays &&
        PLANETS.filter((p) => active[p.key]).map((planet) => {
          const pos = polarToCartesian(CENTER.x, CENTER.y, ORBIT_RADIUS, planet.angle);
          const width = planet.nature === "jupiter" ? 4 : 2;
          const color = planet.nature === "jupiter" ? GOLD : planet.nature === "benefic" ? GREEN : planet.nature === "malefic" ? (planet.color === PURPLE ? PURPLE : VERMILION) : INK_MUTED;
          return (
            <line
              key={`ray-${planet.key}`}
              x1={pos.x}
              y1={pos.y}
              x2={CENTER.x}
              y2={CENTER.y}
              stroke={color}
              strokeWidth={width}
              strokeLinecap="round"
              opacity={0.85}
            />
          );
        })}

      {/* Target center */}
      <circle cx={CENTER.x} cy={CENTER.y} r={38} fill={SURFACE} stroke={target === "house" ? BLUE : PURPLE} strokeWidth="3" />
      <text x={CENTER.x} y={CENTER.y - 6} textAnchor="middle" fill={target === "house" ? BLUE : PURPLE} fontSize="13" fontWeight="600">
        {target === "house" ? "5th House" : "5th Lord"}
      </text>
      <text x={CENTER.x} y={CENTER.y + 12} textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="600">
        saṁtāna target
      </text>

      {/* Planet circles */}
      {PLANETS.map((planet) => {
        const pos = polarToCartesian(CENTER.x, CENTER.y, ORBIT_RADIUS, planet.angle);
        const isActive = active[planet.key];
        const isMalefic = planet.nature === "malefic";
        return (
          <g key={planet.key}>
            <circle cx={pos.x} cy={pos.y} r={PLANET_RADIUS} fill={isActive ? planet.color : SURFACE} stroke={isActive ? "#fff" : HAIRLINE} strokeWidth={isActive ? 2.5 : 1.5} />
            <text x={pos.x} y={pos.y + 5} textAnchor="middle" fill={isActive ? "#fff" : planet.color} fontSize="16" fontWeight="600">
              {planet.glyph}
            </text>
            {isMalefic && isActive ? (
              <circle cx={pos.x + 13} cy={pos.y - 13} r="5" fill={VERMILION} />
            ) : null}
          </g>
        );
      })}

      {/* Legend */}
      <g transform="translate(28 300)">
        <line x1="0" y1="0" x2="18" y2="0" stroke={GOLD} strokeWidth="4" strokeLinecap="round" />
        <text x="24" y="4" fill={INK_SECONDARY} fontSize="10" fontWeight="600">Jupiter relief</text>
        <line x1="92" y1="0" x2="110" y2="0" stroke={GREEN} strokeWidth="2" strokeLinecap="round" />
        <text x="116" y="4" fill={INK_SECONDARY} fontSize="10" fontWeight="600">Benefic</text>
        <line x1="172" y1="0" x2="190" y2="0" stroke={VERMILION} strokeWidth="2" strokeLinecap="round" />
        <text x="196" y="4" fill={INK_SECONDARY} fontSize="10" fontWeight="600">Malefic</text>
      </g>
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", color, fontWeight: 600 }}>
        {icon}
        {title}
      </div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}10`, padding: "0.7rem" }}>
      <div style={{ display: "flex", gap: "0.45rem", alignItems: "center", color, fontWeight: 600 }}>
        {icon}
        {title}
      </div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.86rem", lineHeight: 1.35 }}>{body}</p>
    </div>
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

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: "var(--gl-shadow-soft)",
};

const workbenchTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
  gap: "1rem",
  alignItems: "start",
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
  margin: "0.55rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.5,
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
    fontWeight: 600,
    cursor: "pointer",
  };
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.48rem 0.68rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function microChipStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 6,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.28rem 0.5rem",
    fontSize: "0.78rem",
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
    fontWeight: 400,
  };
}
