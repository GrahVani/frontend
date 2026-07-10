"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BriefcaseBusiness,
  Crosshair,
  RotateCcw,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "../lib/layouts";

type HouseNumber = 2 | 5 | 6 | 7 | 8 | 10 | 11 | 12;
type ReadingMode = "csl" | "houseLord";
type LayerMode = "layer" | "override";

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

const HOUSE_META: Record<HouseNumber, { label: string; group: "favourable" | "qualifying"; color: string; note: string }> = {
  2: { label: "2 income", group: "favourable", color: GREEN, note: "income, speech, resources, earnings support" },
  5: { label: "5 qualifying", group: "qualifying", color: GOLD, note: "contextual; can reduce direct work/service linkage" },
  6: { label: "6 service", group: "favourable", color: BLUE, note: "employment, service, competition, working for others" },
  7: { label: "7 business", group: "favourable", color: PURPLE, note: "business, partnership, public dealing, independent work" },
  8: { label: "8 obstruction", group: "qualifying", color: VERMILION, note: "instability, obstruction, breaks, sudden turns" },
  10: { label: "10 career", group: "favourable", color: GREEN, note: "career, status, work visibility, karma" },
  11: { label: "11 gains", group: "favourable", color: GREEN, note: "gains, fulfilment, ambition realised" },
  12: { label: "12 loss", group: "qualifying", color: VERMILION, note: "loss, expenditure, withdrawal, foreign or behind-scenes turn" },
};

const PRESETS = {
  salaried: {
    label: "10 / 6 / 11",
    houses: [10, 6, 11] as HouseNumber[],
    color: BLUE,
  },
  business: {
    label: "10 / 7 / 11",
    houses: [10, 7, 11] as HouseNumber[],
    color: PURPLE,
  },
  incomeJob: {
    label: "10 / 6 / 2",
    houses: [10, 6, 2] as HouseNumber[],
    color: GREEN,
  },
  adverse: {
    label: "12 / 8",
    houses: [12, 8] as HouseNumber[],
    color: VERMILION,
  },
};

const HOUSE_NUMBERS: HouseNumber[] = [2, 5, 6, 7, 8, 10, 11, 12];

export function KpTenthCuspalDoctrineWorkbench() {
  const [selectedHouses, setSelectedHouses] = useState<HouseNumber[]>([10, 6, 11]);
  const [kpSettings, setKpSettings] = useState(true);
  const [readingMode, setReadingMode] = useState<ReadingMode>("csl");
  const [layerMode, setLayerMode] = useState<LayerMode>("layer");
  const [uncertainTime, setUncertainTime] = useState(false);

  const hasCareerSupport = selectedHouses.some((house) => [10, 6, 7, 2, 11].includes(house));
  const adverseCount = selectedHouses.filter((house) => HOUSE_META[house].group === "qualifying").length;
  const favorableCount = selectedHouses.filter((house) => HOUSE_META[house].group === "favourable").length;
  const hasSixth = selectedHouses.includes(6);
  const hasSeventh = selectedHouses.includes(7);
  const invalidSettings = !kpSettings;
  const switchError = readingMode === "houseLord";
  const overrideError = layerMode === "override";
  const dataSignal = uncertainTime && (invalidSettings || adverseCount > favorableCount);
  const warning = invalidSettings || switchError || overrideError || dataSignal;
  const score = Math.max(6, Math.min(96, 42 + favorableCount * 14 - adverseCount * 18 + (hasCareerSupport ? 12 : -18) + (invalidSettings ? -45 : 0)));

  const mode = useMemo(() => {
    if (!hasCareerSupport || adverseCount > favorableCount) return "difficulty";
    if (hasSixth && hasSeventh) return "mixed";
    if (hasSeventh) return "business";
    if (hasSixth) return "salaried";
    return "favourable";
  }, [adverseCount, favorableCount, hasCareerSupport, hasSeventh, hasSixth]);

  const synthesis = useMemo(() => {
    const houses = selectedHouses.length ? selectedHouses.map((house) => house).join(", ") : "none";
    const validity = kpSettings ? "KP settings are valid: KP ayanamsha with Placidus cusps." : "Invalid setup: the 10th CSL must be computed in KP ayanamsha with Placidus cusps.";
    const doctrine = readingMode === "csl" ? "Reading mode is correct: the 10th cuspal sub-lord and its significations decide." : "Switch error: this is KP, so do not replace the CSL with the Parashari 10th lord.";
    const verdict =
      mode === "difficulty"
        ? "Career result is difficult or qualifying because adverse houses dominate or career houses are weak."
        : mode === "business"
          ? "Career is favourable and leans independent/business because the 7th is prominent."
          : mode === "salaried"
            ? "Career is favourable and leans salaried/service because the 6th is prominent."
            : mode === "mixed"
              ? "Career is favourable but may combine salaried and independent modes because both 6th and 7th are signified."
              : "Career is supported; use the detailed significator hierarchy to sharpen the type.";
    const layer = layerMode === "layer" ? "KP is treated as one cross-checking voice." : "Layering error: KP should not override Parashari, D10, or Jaimini.";
    const data = dataSignal ? "Because the time or setup is sensitive, treat this as a possible data/rectification signal." : "No data-signal warning is active.";
    return `10th CSL signifies houses ${houses}. ${validity} ${doctrine} ${verdict} ${layer} ${data}`;
  }, [dataSignal, kpSettings, layerMode, mode, readingMode, selectedHouses]);

  return (
    <div data-interactive="kp-tenth-cuspal-doctrine-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>KP 10th cuspal sub-lord doctrine</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Let the 10th CSL&apos;s signified houses give the career verdict
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              In KP, the 10th cusp sub-lord decides career favourability; the houses it signifies decide job, business, gains, or difficulty.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedHouses([10, 6, 11]);
              setKpSettings(true);
              setReadingMode("csl");
              setLayerMode("layer");
              setUncertainTime(false);
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
              <p style={eyebrowStyle}>CSL verdict vector</p>
              <h3 style={{ margin: "0.15rem 0 0", color: warning ? VERMILION : verdictColor(mode), fontSize: "1.2rem" }}>
                {warning ? "Discipline warning" : verdictTitle(mode)}
              </h3>
            </div>
            <span style={{ color: warning ? VERMILION : verdictColor(mode), fontWeight: 700 }}>{Math.round(score)}% KP signal</span>
          </div>
          <CslVerdictSvg selectedHouses={selectedHouses} mode={mode} warning={warning} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))", gap: "0.65rem" }}>
            <MiniFact icon={<Crosshair size={16} />} title="10th CSL" body="decides matter" color={GOLD} />
            <MiniFact icon={<BriefcaseBusiness size={16} />} title="Career houses" body="10 / 6 / 7 / 2 / 11" color={GREEN} />
            <MiniFact icon={<Users size={16} />} title="Mode key" body="6 job, 7 business" color={hasSeventh ? PURPLE : BLUE} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Worked presets" icon={<SlidersHorizontal size={18} />} color={verdictColor(mode)}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {(Object.keys(PRESETS) as Array<keyof typeof PRESETS>).map((key) => (
                <button key={key} type="button" onClick={() => setSelectedHouses(PRESETS[key].houses)} style={smallChipStyle(false, PRESETS[key].color)}>
                  {PRESETS[key].label}
                </button>
              ))}
            </div>
            <p style={bodyTextStyle}>Use presets to reproduce the lesson examples: 10/6/11 for salaried, 10/7/11 for business, 12/8 for difficulty.</p>
          </Panel>

          <Panel title="KP settings guard" icon={<Settings2 size={18} />} color={kpSettings ? GREEN : VERMILION}>
            <button type="button" aria-pressed={kpSettings} onClick={() => setKpSettings((value) => !value)} style={togglePanelStyle(kpSettings, GREEN)}>
              <ShieldCheck size={18} aria-hidden="true" />
              <span>
                <span style={{ display: "block", fontWeight: 700 }}>KP ayanamsha + Placidus</span>
                <span>{kpSettings ? "Valid CSL context." : "Invalid: wrong settings can change the sub-lord."}</span>
              </span>
            </button>
          </Panel>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Signified houses</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))", gap: "0.55rem", marginTop: "0.75rem" }}>
          {HOUSE_NUMBERS.map((house) => {
            const active = selectedHouses.includes(house);
            const meta = HOUSE_META[house];
            return (
              <button
                key={house}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setSelectedHouses((current) => current.includes(house) ? current.filter((item) => item !== house) : [...current, house].sort((a, b) => a - b));
                }}
                style={{
                  border: `1px solid ${active ? meta.color : HAIRLINE}`,
                  borderRadius: 8,
                  background: active ? `${meta.color}14` : "transparent",
                  color: active ? meta.color : INK_SECONDARY,
                  padding: "0.75rem",
                  textAlign: "left",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                <span style={{ display: "block" }}>{meta.label}</span>
                <span style={{ display: "block", marginTop: "0.35rem", color: INK_MUTED, fontSize: "0.78rem", lineHeight: 1.35 }}>{meta.note}</span>
              </button>
            );
          })}
        </div>
      </section>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>KP discipline</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <ControlGroup label="Read by">
              <button type="button" aria-pressed={readingMode === "csl"} onClick={() => setReadingMode("csl")} style={smallChipStyle(readingMode === "csl", GREEN)}>
                10th CSL
              </button>
              <button type="button" aria-pressed={readingMode === "houseLord"} onClick={() => setReadingMode("houseLord")} style={smallChipStyle(readingMode === "houseLord", VERMILION)}>
                10th lord
              </button>
            </ControlGroup>
            <ControlGroup label="Use as">
              <button type="button" aria-pressed={layerMode === "layer"} onClick={() => setLayerMode("layer")} style={smallChipStyle(layerMode === "layer", GREEN)}>
                Cross-check voice
              </button>
              <button type="button" aria-pressed={layerMode === "override"} onClick={() => setLayerMode("override")} style={smallChipStyle(layerMode === "override", VERMILION)}>
                Override streams
              </button>
            </ControlGroup>
            <button type="button" aria-pressed={uncertainTime} onClick={() => setUncertainTime((value) => !value)} style={togglePanelStyle(uncertainTime, VERMILION)}>
              <AlertTriangle size={18} aria-hidden="true" />
              <span>
                <span style={{ display: "block", fontWeight: 700 }}>Uncertain birth time</span>
                <span>{uncertainTime ? "CSL sensitivity can become a rectification signal." : "Turn on for uncertain time cases."}</span>
              </span>
            </button>
          </div>
        </section>

        <section style={{ ...cardStyle, borderColor: warning ? `${VERMILION}66` : `${verdictColor(mode)}66`, background: warning ? `${VERMILION}0F` : `${verdictColor(mode)}0F` }}>
          <p style={eyebrowStyle}>KP career voice</p>
          <h3 style={{ margin: "0.15rem 0 0", color: warning ? VERMILION : verdictColor(mode), fontSize: "1.18rem" }}>
            {warning ? "Guardrail active" : verdictTitle(mode)}
          </h3>
          <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{synthesis}</p>
        </section>
      </div>
    </div>
  );
}

function CslVerdictSvg({ selectedHouses, mode, warning }: { selectedHouses: HouseNumber[]; mode: string; warning: boolean }) {
  const color = warning ? VERMILION : verdictColor(mode);
  const houses: HouseNumber[] = selectedHouses.length ? selectedHouses : [10];
  return (
    <svg viewBox="0 0 560 330" role="img" aria-label="10th cuspal sub-lord significator verdict" style={{ width: "100%", maxHeight: 430, margin: "0.4rem auto 0.85rem", display: "block" }}>
      <rect x="26" y="40" width="508" height="230" rx="8" fill={`${GOLD}0F`} stroke={HAIRLINE} />
      <path d="M 162 145 C 195 86, 230 86, 232 145" fill="none" stroke={GOLD} strokeWidth="4" strokeLinecap="round" />
      <path d="M 334 145 C 365 92, 388 92, 402 105" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <path d="M 334 145 C 365 198, 388 198, 402 169" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <circle cx="112" cy="145" r="50" fill={OPAQUE_LIGHT_FILL[GOLD]} stroke={GOLD} strokeWidth="4" />
      <text x="112" y="137" textAnchor="middle" fill={GOLD} fontSize="14" fontWeight="700">10th</text>
      <text x="112" y="157" textAnchor="middle" fill={GOLD} fontSize="14" fontWeight="700">cusp</text>
      <circle cx="280" cy="145" r="54" fill={OPAQUE_LIGHT_FILL[color] || `${color}18`} stroke={color} strokeWidth="5" />
      <text x="280" y="136" textAnchor="middle" fill={color} fontSize="15" fontWeight="700">CSL</text>
      <text x="280" y="157" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="600">decides</text>
      <g>
        {houses.slice(0, 6).map((house, index) => {
          const x = 410 + (index % 3) * 46;
          const y = 105 + Math.floor(index / 3) * 64;
          const meta = HOUSE_META[house];
          return (
            <g key={`${house}-${index}`}>
              <circle cx={x} cy={y} r="22" fill={OPAQUE_LIGHT_FILL[meta.color] || `${meta.color}18`} stroke={meta.color} strokeWidth="3" />
              <text x={x} y={y + 5} textAnchor="middle" fill={meta.color} fontSize="14" fontWeight="700">{house}</text>
            </g>
          );
        })}
      </g>
      <text x="280" y="268" textAnchor="middle" fill={color} fontSize="14" fontWeight="700">{verdictTitle(mode)}</text>
      <text x="280" y="292" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="700">The signified houses are the KP verdict</text>
    </svg>
  );
}

function verdictTitle(mode: string) {
  if (mode === "business") return "Favourable business / independent";
  if (mode === "salaried") return "Favourable salaried / service";
  if (mode === "mixed") return "Favourable mixed mode";
  if (mode === "difficulty") return "Difficulty or qualifying result";
  return "Career supported";
}

function verdictColor(mode: string) {
  if (mode === "business") return PURPLE;
  if (mode === "salaried") return BLUE;
  if (mode === "mixed") return GOLD;
  if (mode === "difficulty") return VERMILION;
  return GREEN;
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 700 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function ControlGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: "grid", gap: "0.45rem", marginBottom: "0.7rem" }}>
      <span style={{ color: INK_MUTED, fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase" }}>{label}</span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>{children}</div>
    </div>
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
