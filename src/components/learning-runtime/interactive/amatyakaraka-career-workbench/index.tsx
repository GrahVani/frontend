"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BriefcaseBusiness,
  Crown,
  RotateCcw,
  Scale,
  ShieldCheck,
  SlidersHorizontal,
  UserRoundCog,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "../lib/layouts";

type SchemeKey = "seven" | "eight";
type PlanetKey = "saturn" | "mercury" | "moon" | "venus" | "sun" | "jupiter" | "mars" | "rahu";
type SelectionMode = "degree" | "natural";

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

const PLANETS: Record<PlanetKey, { label: string; short: string; degree: number; color: string; nature: string }> = {
  saturn: { label: "Saturn", short: "Sa", degree: 28, color: PURPLE, nature: "structure, discipline, service, administration, long climb" },
  mercury: { label: "Mercury", short: "Me", degree: 24, color: GREEN, nature: "commerce, communication, analytics, intellect, adaptable skill" },
  moon: { label: "Moon", short: "Mo", degree: 19, color: BLUE, nature: "public contact, care, responsiveness, fluctuation, support roles" },
  venus: { label: "Venus", short: "Ve", degree: 15, color: GOLD, nature: "design, negotiation, aesthetics, relationship-based work" },
  sun: { label: "Sun", short: "Su", degree: 11, color: VERMILION, nature: "authority, visibility, status, leadership, honour" },
  jupiter: { label: "Jupiter", short: "Ju", degree: 7, color: GREEN, nature: "teaching, counsel, law, wisdom, expansion" },
  mars: { label: "Mars", short: "Ma", degree: 3, color: VERMILION, nature: "engineering, action, command, competition, technical force" },
  rahu: { label: "Rahu", short: "Ra", degree: 8, color: PURPLE, nature: "unconventional, foreign, technical, disruptive ambition" },
};

const ROLE_LABELS_SEVEN = ["AK", "AmK", "BK", "MK", "PK", "GK", "DK"];
const ROLE_LABELS_EIGHT = ["AK", "AmK", "BK", "MK", "PK", "GK", "DK", "PiK"];

export function AmatyakarakaCareerWorkbench() {
  const [scheme, setScheme] = useState<SchemeKey>("seven");
  const [selectionMode, setSelectionMode] = useState<SelectionMode>("degree");
  const [selectedNatural, setSelectedNatural] = useState<PlanetKey>("sun");
  const [showRahuReverse, setShowRahuReverse] = useState(true);
  const [layerMode, setLayerMode] = useState<"layer" | "replace">("layer");

  const rankedPlanets = useMemo(() => {
    const included = (Object.keys(PLANETS) as PlanetKey[]).filter((key) => scheme === "eight" || key !== "rahu");
    return included
      .map((key) => {
        const planet = PLANETS[key];
        const rankingDegree = key === "rahu" ? 30 - planet.degree : planet.degree;
        return { key, ...planet, rankingDegree };
      })
      .sort((a, b) => b.rankingDegree - a.rankingDegree);
  }, [scheme]);

  const amk = rankedPlanets[1];
  const ak = rankedPlanets[0];
  const displayedAmk = selectionMode === "degree" ? amk : { key: selectedNatural, ...PLANETS[selectedNatural], rankingDegree: PLANETS[selectedNatural].degree };
  const switchError = selectionMode === "natural" && selectedNatural !== amk.key;
  const substitutionError = layerMode === "replace";

  const synthesis = useMemo(() => {
    const schemeText = scheme === "seven" ? "7-karaka scheme: Sun through Saturn only." : "8-karaka scheme: Rahu is included with reverse-counted degree.";
    const identity = `Degree ranking gives ${ak.label} as AK and ${amk.label} as AmK.`;
    const career = `${amk.label} becomes the Jaimini career voice, so its nature gives the first professional flavour: ${amk.nature}.`;
    const guard = switchError
      ? `Switch error: ${PLANETS[selectedNatural].label} was chosen as a natural career planet, but it is not second by degree.`
      : "Correct: AmK is identified by degree, not by a fixed natural significator.";
    const layer = substitutionError
      ? "Layering error: AmK complements the Parashari 10th; it does not replace it."
      : "Layering is correct: AmK cross-checks the Parashari 10th as an independent Jaimini voice.";
    return `${schemeText} ${identity} ${career} ${guard} ${layer}`;
  }, [ak.label, amk.label, amk.nature, scheme, selectedNatural, substitutionError, switchError]);

  return (
    <div data-interactive="amatyakaraka-career-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Amatyakaraka career workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Find the minister by degree, then layer it with the 10th
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              The AmK is the second-highest-degree cara-karaka. It is Jaimini&apos;s independent career voice, not a preset career planet.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setScheme("seven");
              setSelectionMode("degree");
              setSelectedNatural("sun");
              setShowRahuReverse(true);
              setLayerMode("layer");
            }}
            style={buttonStyle(false, GOLD)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Royal court ranking</p>
              <h3 style={{ margin: "0.15rem 0 0", color: switchError ? VERMILION : amk.color, fontSize: "1.2rem" }}>
                {switchError ? "Switch error detected" : `${amk.label} is the AmK`}
              </h3>
            </div>
            <strong style={{ color: scheme === "seven" ? BLUE : PURPLE, fontWeight: 700 }}>{scheme === "seven" ? "7-karaka" : "8-karaka"} scheme</strong>
          </div>
          <CourtSvg rankedPlanets={rankedPlanets} displayedAmk={displayedAmk.key} switchError={switchError} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))", gap: "0.65rem" }}>
            <MiniFact icon={<Crown size={16} />} title="AK" body={`${ak.label}: king`} color={GOLD} />
            <MiniFact icon={<UserRoundCog size={16} />} title="AmK" body={`${amk.label}: minister`} color={amk.color} />
            <MiniFact icon={<BriefcaseBusiness size={16} />} title="Career voice" body={amk.nature.split(",")[0]} color={GREEN} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Karaka scheme" icon={<SlidersHorizontal size={18} />} color={scheme === "seven" ? BLUE : PURPLE}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <button type="button" aria-pressed={scheme === "seven"} onClick={() => setScheme("seven")} style={smallChipStyle(scheme === "seven", BLUE)}>
                7-karaka
              </button>
              <button type="button" aria-pressed={scheme === "eight"} onClick={() => setScheme("eight")} style={smallChipStyle(scheme === "eight", PURPLE)}>
                8-karaka
              </button>
            </div>
            <p style={bodyTextStyle}>
              {scheme === "seven" ? "Rao-style seven planets, Sun through Saturn. State this scheme for reproducibility." : "Rahu enters the ranking; its degree is counted in reverse."}
            </p>
            {scheme === "eight" ? (
              <button type="button" aria-pressed={showRahuReverse} onClick={() => setShowRahuReverse((value) => !value)} style={{ ...togglePanelStyle(showRahuReverse, PURPLE), marginTop: "0.75rem" }}>
                <Scale size={18} aria-hidden="true" />
                <span>
                  <strong style={{ fontWeight: 700 }}>Rahu reverse degree</strong>
                  <span>{showRahuReverse ? `Rahu 8deg ranks as ${30 - PLANETS.rahu.degree}deg.` : "Reminder hidden; assignment still uses reverse degree."}</span>
                </span>
              </button>
            ) : null}
          </Panel>

          <Panel title="Identification discipline" icon={switchError ? <AlertTriangle size={18} /> : <ShieldCheck size={18} />} color={switchError ? VERMILION : GREEN}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <button type="button" aria-pressed={selectionMode === "degree"} onClick={() => setSelectionMode("degree")} style={smallChipStyle(selectionMode === "degree", GREEN)}>
                By degree
              </button>
              <button type="button" aria-pressed={selectionMode === "natural"} onClick={() => setSelectionMode("natural")} style={smallChipStyle(selectionMode === "natural", VERMILION)}>
                Natural career planet
              </button>
            </div>
            {selectionMode === "natural" ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginTop: "0.75rem" }}>
                {(["sun", "saturn", "mercury", "jupiter"] as PlanetKey[]).map((key) => (
                  <button key={key} type="button" aria-pressed={selectedNatural === key} onClick={() => setSelectedNatural(key)} style={smallChipStyle(selectedNatural === key, PLANETS[key].color)}>
                    {PLANETS[key].label}
                  </button>
                ))}
              </div>
            ) : null}
            <p style={bodyTextStyle}>{switchError ? `${PLANETS[selectedNatural].label} is not AmK here. The AmK is ${amk.label}, second by degree.` : "Correct: rank degrees and take the second-highest planet."}</p>
          </Panel>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Degree ranking table</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))", gap: "0.55rem", marginTop: "0.75rem" }}>
          {rankedPlanets.map((planet, index) => {
            const role = scheme === "seven" ? ROLE_LABELS_SEVEN[index] : ROLE_LABELS_EIGHT[index];
            const isAmk = index === 1;
            const isAk = index === 0;
            return (
              <div key={planet.key} style={{ border: `1px solid ${isAmk ? planet.color : isAk ? GOLD : HAIRLINE}`, borderRadius: 8, background: isAmk ? `${planet.color}12` : isAk ? `${GOLD}12` : "transparent", padding: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", alignItems: "center" }}>
                  <strong style={{ color: isAk ? GOLD : isAmk ? planet.color : INK_PRIMARY, fontWeight: 700 }}>{role}</strong>
                  <span style={{ color: INK_MUTED, fontWeight: 700 }}>#{index + 1}</span>
                </div>
                <p style={{ margin: "0.35rem 0 0", color: planet.color, fontWeight: 700 }}>{planet.label}</p>
                <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem" }}>
                  {planet.key === "rahu" ? `${planet.degree}deg natal / ${planet.rankingDegree}deg ranked` : `${planet.degree}deg`}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Independent voice</p>
          <h3 style={{ margin: "0.15rem 0 0.75rem", color: GREEN, fontSize: "1.18rem" }}>
            AmK complements the 10th; it does not replace it
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.85rem" }}>
            <button type="button" aria-pressed={layerMode === "layer"} onClick={() => setLayerMode("layer")} style={smallChipStyle(layerMode === "layer", GREEN)}>
              Layer both
            </button>
            <button type="button" aria-pressed={layerMode === "replace"} onClick={() => setLayerMode("replace")} style={smallChipStyle(layerMode === "replace", VERMILION)}>
              Replace 10th
            </button>
          </div>
          <CrossCheckSvg substitutionError={substitutionError} />
        </section>

        <section style={{ ...cardStyle, borderColor: switchError || substitutionError ? `${VERMILION}66` : `${GREEN}66`, background: switchError || substitutionError ? `${VERMILION}0F` : `${GREEN}0F` }}>
          <p style={eyebrowStyle}>Career synthesis</p>
          <h3 style={{ margin: "0.15rem 0 0", color: switchError || substitutionError ? VERMILION : GREEN, fontSize: "1.18rem" }}>
            {switchError || substitutionError ? "Discipline warning" : "Valid AmK reading"}
          </h3>
          <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{synthesis}</p>
        </section>
      </div>
    </div>
  );
}

function CourtSvg({ rankedPlanets, displayedAmk, switchError }: { rankedPlanets: Array<{ key: PlanetKey; label: string; short: string; rankingDegree: number; color: string }>; displayedAmk: PlanetKey; switchError: boolean }) {
  const ak = rankedPlanets[0];
  const amk = rankedPlanets[1];
  const selected = PLANETS[displayedAmk];
  const maxDegree = Math.max(...rankedPlanets.map((planet) => planet.rankingDegree));

  return (
    <svg viewBox="0 0 560 330" role="img" aria-label="Cara-karaka royal court ranking" style={{ width: "100%", maxHeight: 430, margin: "0.4rem auto 0.85rem", display: "block" }}>
      <rect x="24" y="34" width="512" height="244" rx="8" fill={`${GOLD}0F`} stroke={HAIRLINE} />
      <circle cx="170" cy="138" r="52" fill={`${GOLD}22`} stroke={GOLD} strokeWidth="4" />
      <text x="170" y="130" textAnchor="middle" fill={GOLD} fontSize="15" fontWeight="700">AK</text>
      <text x="170" y="151" textAnchor="middle" fill={INK_PRIMARY} fontSize="14" fontWeight="700">{ak.label}</text>
      <text x="170" y="170" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="600">king / soul</text>
      <circle cx="385" cy="138" r="52" fill={`${amk.color}18`} stroke={switchError ? VERMILION : amk.color} strokeWidth="4" />
      <text x="385" y="130" textAnchor="middle" fill={switchError ? VERMILION : amk.color} fontSize="15" fontWeight="700">AmK</text>
      <text x="385" y="151" textAnchor="middle" fill={INK_PRIMARY} fontSize="14" fontWeight="700">{switchError ? selected.label : amk.label}</text>
      <text x="385" y="170" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="600">{switchError ? "wrong pick" : "minister / career"}</text>
      <path d="M 222 138 C 270 82, 300 82, 333 138" fill="none" stroke={switchError ? VERMILION : GREEN} strokeWidth="5" strokeLinecap="round" />
      <text x="280" y="82" textAnchor="middle" fill={switchError ? VERMILION : GREEN} fontSize="13" fontWeight="700">degree order</text>
      <g transform="translate(70 260)">
        {rankedPlanets.map((planet, index) => {
          const width = Math.max(18, (planet.rankingDegree / maxDegree) * 64);
          const x = index * 58;
          const isAmk = index === 1;
          return (
            <g key={planet.key} transform={`translate(${x} 0)`}>
              <rect x="0" y={-width} width="38" height={width} rx="8" fill={isAmk ? planet.color : `${planet.color}66`} stroke={isAmk ? "#fff" : HAIRLINE} strokeWidth={isAmk ? 3 : 1.5} />
              <text x="19" y="18" textAnchor="middle" fill={INK_SECONDARY} fontSize="11" fontWeight="700">{planet.short}</text>
              <text x="19" y={-width - 8} textAnchor="middle" fill={isAmk ? planet.color : INK_MUTED} fontSize="11" fontWeight="600">{planet.rankingDegree}deg</text>
            </g>
          );
        })}
      </g>
      <text x="280" y="305" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="700">Highest degree is AK; second-highest degree is AmK</text>
    </svg>
  );
}

function CrossCheckSvg({ substitutionError }: { substitutionError: boolean }) {
  return (
    <svg viewBox="0 0 560 220" role="img" aria-label="AmK and Parashari 10th cross-check" style={{ width: "100%", maxHeight: 280, display: "block" }}>
      <rect x="24" y="30" width="512" height="150" rx="8" fill={`${GOLD}0F`} stroke={HAIRLINE} />
      <circle cx="150" cy="105" r="46" fill={`${GREEN}18`} stroke={GREEN} strokeWidth="4" />
      <text x="150" y="100" textAnchor="middle" fill={GREEN} fontSize="15" fontWeight="700">AmK</text>
      <text x="150" y="120" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="600">soul instrument</text>
      <circle cx="410" cy="105" r="46" fill={`${BLUE}18`} stroke={BLUE} strokeWidth="4" />
      <text x="410" y="100" textAnchor="middle" fill={BLUE} fontSize="15" fontWeight="700">10th</text>
      <text x="410" y="120" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="600">structure</text>
      {substitutionError ? (
        <>
          <path d="M 194 105 L 366 105" stroke={VERMILION} strokeWidth="6" strokeLinecap="round" />
          <path d="M 264 72 L 296 138 M 296 72 L 264 138" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
          <path d="M 264 72 L 296 138 M 296 72 L 264 138" stroke={VERMILION} strokeWidth="4" strokeLinecap="round" />
          <text x="280" y="166" textAnchor="middle" fill={VERMILION} fontSize="13" fontWeight="700">Do not replace one with the other</text>
        </>
      ) : (
        <>
          <path d="M 194 105 C 242 58, 318 58, 366 105" fill="none" stroke={GREEN} strokeWidth="5" strokeLinecap="round" />
          <path d="M 194 105 C 242 152, 318 152, 366 105" fill="none" stroke={BLUE} strokeWidth="5" strokeLinecap="round" />
          <text x="280" y="166" textAnchor="middle" fill={GREEN} fontSize="13" fontWeight="700">Layered cross-check</text>
        </>
      )}
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 700 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0F`, padding: "0.7rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color, fontWeight: 700 }}>{icon}{title}</div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.35 }}>{body}</p>
    </div>
  );
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.55rem 0.75rem",
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

function togglePanelStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "24px 1fr",
    gap: "0.65rem",
    alignItems: "start",
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}14` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.75rem",
    cursor: "pointer",
  };
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
};

const workbenchTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
  gap: "1rem",
  alignItems: "start",
};

const bodyTextStyle: CSSProperties = {
  margin: "0.55rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.5,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
