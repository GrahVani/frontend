"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  BriefcaseBusiness,
  Map,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  Target,
} from "lucide-react";

type PlanetKey = "mercury" | "moon" | "saturn" | "sun" | "jupiter";
type FieldKey = "commerce" | "care" | "authority" | "teaching" | "structure";
type StrengthKey = "strong" | "mixed" | "weak";
type RelationKey = "same" | "close" | "independent" | "none";
type ReportMode = "layer" | "pickAmk" | "pickTenth";

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

const PLANETS = {
  mercury: { label: "Mercury", color: GREEN, cue: "commerce, communication, analytics" },
  moon: { label: "Moon", color: BLUE, cue: "care, public contact, responsiveness" },
  saturn: { label: "Saturn", color: PURPLE, cue: "structure, service, administration" },
  sun: { label: "Sun", color: VERMILION, cue: "authority, rank, visibility" },
  jupiter: { label: "Jupiter", color: GREEN, cue: "teaching, counsel, law" },
} as const;

const FIELDS = {
  commerce: { label: "Commerce / communication", color: GREEN, note: "trade, finance, writing, analysis, advisory exchange" },
  care: { label: "Care / public service", color: BLUE, note: "healthcare, hospitality, public-facing support, nurture" },
  authority: { label: "Authority / status", color: VERMILION, note: "rank, leadership, administration, visible command" },
  teaching: { label: "Teaching / counsel", color: GOLD, note: "education, law, guidance, publishing, dharma-linked work" },
  structure: { label: "Structure / operations", color: PURPLE, note: "systems, governance, process, service, long-term building" },
} as const;

const STRENGTHS = {
  strong: { label: "Strong", color: GREEN, score: 28, note: "well-supported and reliable" },
  mixed: { label: "Mixed", color: GOLD, score: 0, note: "usable but conditional" },
  weak: { label: "Weak", color: VERMILION, score: -26, note: "compromised or under-resourced" },
} as const;

const RELATIONS = {
  same: { label: "AmK is 10th lord", color: GREEN, score: 30, note: "strongest convergence: one planet wears both crowns" },
  close: { label: "Close relation", color: GREEN, score: 18, note: "AmK connects to the 10th, the 10th lord, or the 10th lord sign" },
  independent: { label: "Independent agreement", color: GOLD, score: 8, note: "different planets independently agree on field and quality" },
  none: { label: "No close relation", color: PURPLE, score: -8, note: "comparison depends on field and strength synthesis" },
} as const;

export function AmkTenthLordComparisonWorkbench() {
  const [amkPlanet, setAmkPlanet] = useState<PlanetKey>("mercury");
  const [tenthPlanet, setTenthPlanet] = useState<PlanetKey>("mercury");
  const [amkField, setAmkField] = useState<FieldKey>("commerce");
  const [tenthField, setTenthField] = useState<FieldKey>("commerce");
  const [amkStrength, setAmkStrength] = useState<StrengthKey>("strong");
  const [tenthStrength, setTenthStrength] = useState<StrengthKey>("strong");
  const [relation, setRelation] = useState<RelationKey>("same");
  const [reportMode, setReportMode] = useState<ReportMode>("layer");
  const [uncertainTime, setUncertainTime] = useState(false);

  const fieldDivergence = amkField !== tenthField;
  const strengthDivergence = amkStrength !== tenthStrength && (amkStrength === "weak" || tenthStrength === "weak");
  const strongestConvergence = relation === "same" || amkPlanet === tenthPlanet;
  const closeConvergence = relation === "close";
  const independentAgreement = !fieldDivergence && !strengthDivergence && relation === "independent";
  const divergence = fieldDivergence || strengthDivergence;
  const pickError = reportMode !== "layer" && divergence;
  const dataSignal = uncertainTime && divergence;
  const relationScore = strongestConvergence ? RELATIONS.same.score : RELATIONS[relation].score;
  const score = Math.max(8, Math.min(98, 48 + STRENGTHS[amkStrength].score * 0.45 + STRENGTHS[tenthStrength].score * 0.45 + relationScore - (fieldDivergence ? 16 : 0)));
  const patternColor = pickError || dataSignal ? VERMILION : strongestConvergence || closeConvergence ? GREEN : fieldDivergence ? PURPLE : strengthDivergence ? GOLD : BLUE;

  const synthesis = useMemo(() => {
    const amk = `AmK voice: ${PLANETS[amkPlanet].label} points toward ${FIELDS[amkField].label.toLowerCase()} and is ${STRENGTHS[amkStrength].label.toLowerCase()}.`;
    const tenth = `10th-lord voice: ${PLANETS[tenthPlanet].label} points toward ${FIELDS[tenthField].label.toLowerCase()} and is ${STRENGTHS[tenthStrength].label.toLowerCase()}.`;
    const relationText = strongestConvergence
      ? "The same planet carries both significations, the strongest convergence."
      : `${RELATIONS[relation].label}: ${RELATIONS[relation].note}.`;
    const pattern = fieldDivergence
      ? "Field divergence: read combination, reframing, or tension between structural career and soul instrument."
      : strengthDivergence
        ? "Strength divergence: report the mixed signal by dimension; do not average it away."
        : "Convergence: the two independent career voices raise confidence.";
    const discipline = pickError ? "Picking one preferred voice violates the layer-not-substitute rule." : "Layer both voices; neither overrides the other.";
    const data = dataSignal ? "Because birth time is uncertain, this sharp divergence is also a possible rectification signal." : "Birth-time/data flag is not active.";
    return `${amk} ${tenth} ${relationText} ${pattern} ${discipline} ${data}`;
  }, [amkField, amkPlanet, amkStrength, dataSignal, fieldDivergence, pickError, relation, strengthDivergence, strongestConvergence, tenthField, tenthPlanet, tenthStrength]);

  return (
    <div data-interactive="amk-tenth-lord-comparison-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>AmK vs 10th lord cross-check</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Compare Jaimini&apos;s minister with Parashari&apos;s career ruler
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Two independent career voices become a true cross-check: convergence raises confidence, divergence becomes information.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setAmkPlanet("mercury");
              setTenthPlanet("mercury");
              setAmkField("commerce");
              setTenthField("commerce");
              setAmkStrength("strong");
              setTenthStrength("strong");
              setRelation("same");
              setReportMode("layer");
              setUncertainTime(false);
            }}
            style={buttonStyle(false, GOLD)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Two career voices</p>
              <h3 style={{ margin: "0.15rem 0 0", color: patternColor, fontSize: "1.2rem" }}>
                {patternTitle({ strongestConvergence, closeConvergence, independentAgreement, fieldDivergence, strengthDivergence, dataSignal, pickError })}
              </h3>
            </div>
            <span style={{ color: patternColor, fontWeight: 700 }}>{Math.round(score)}% signal</span>
          </div>
          <ComparisonSvg
            amkPlanet={amkPlanet}
            tenthPlanet={tenthPlanet}
            amkField={amkField}
            tenthField={tenthField}
            relation={strongestConvergence ? "same" : relation}
            divergence={divergence}
            pickError={pickError}
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))", gap: "0.65rem" }}>
            <MiniFact icon={<BriefcaseBusiness size={16} />} title="AmK" body="soul instrument" color={PLANETS[amkPlanet].color} />
            <MiniFact icon={<Target size={16} />} title="10th lord" body="career structure" color={PLANETS[tenthPlanet].color} />
            <MiniFact icon={<BadgeCheck size={16} />} title="Relation" body={strongestConvergence ? "same planet" : RELATIONS[relation].label} color={patternColor} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Pattern presets" icon={<SlidersHorizontal size={18} />} color={patternColor}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <PresetButton color={GREEN} onClick={() => { setAmkPlanet("mercury"); setTenthPlanet("mercury"); setAmkField("commerce"); setTenthField("commerce"); setAmkStrength("strong"); setTenthStrength("strong"); setRelation("same"); setReportMode("layer"); }}>
                Same planet
              </PresetButton>
              <PresetButton color={GREEN} onClick={() => { setAmkPlanet("mercury"); setTenthPlanet("saturn"); setAmkField("commerce"); setTenthField("commerce"); setAmkStrength("strong"); setTenthStrength("strong"); setRelation("close"); setReportMode("layer"); }}>
                Close relation
              </PresetButton>
              <PresetButton color={PURPLE} onClick={() => { setAmkPlanet("moon"); setTenthPlanet("mercury"); setAmkField("care"); setTenthField("commerce"); setAmkStrength("strong"); setTenthStrength("strong"); setRelation("none"); setReportMode("layer"); }}>
                Field divergence
              </PresetButton>
              <PresetButton color={GOLD} onClick={() => { setAmkPlanet("moon"); setTenthPlanet("mercury"); setAmkField("commerce"); setTenthField("commerce"); setAmkStrength("weak"); setTenthStrength("strong"); setRelation("independent"); setReportMode("layer"); }}>
                Strength divergence
              </PresetButton>
            </div>
          </Panel>

          <Panel title="Report discipline" icon={pickError ? <AlertTriangle size={18} /> : <ShieldCheck size={18} />} color={pickError ? VERMILION : GREEN}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <button type="button" aria-pressed={reportMode === "layer"} onClick={() => setReportMode("layer")} style={smallChipStyle(reportMode === "layer", GREEN)}>
                Layer both
              </button>
              <button type="button" aria-pressed={reportMode === "pickAmk"} onClick={() => setReportMode("pickAmk")} style={smallChipStyle(reportMode === "pickAmk", VERMILION)}>
                Pick AmK
              </button>
              <button type="button" aria-pressed={reportMode === "pickTenth"} onClick={() => setReportMode("pickTenth")} style={smallChipStyle(reportMode === "pickTenth", VERMILION)}>
                Pick 10th lord
              </button>
            </div>
            <p style={bodyTextStyle}>{pickError ? "Divergence must be read by layering, not resolved by preference." : "Correct: both streams remain in the synthesis."}</p>
          </Panel>
        </section>
      </div>

      <div style={responsiveTwoColumnStyle}>
        <VoiceControl
          title="Jaimini voice: AmK"
          icon={<Map size={18} />}
          planet={amkPlanet}
          field={amkField}
          strength={amkStrength}
          onPlanet={setAmkPlanet}
          onField={setAmkField}
          onStrength={setAmkStrength}
          color={PLANETS[amkPlanet].color}
        />
        <VoiceControl
          title="Parashari voice: 10th lord"
          icon={<BriefcaseBusiness size={18} />}
          planet={tenthPlanet}
          field={tenthField}
          strength={tenthStrength}
          onPlanet={setTenthPlanet}
          onField={setTenthField}
          onStrength={setTenthStrength}
          color={PLANETS[tenthPlanet].color}
        />
      </div>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Relation and data signal</p>
          <ControlGroup label="AmK relation to the 10th voice">
            {(Object.keys(RELATIONS) as RelationKey[]).map((key) => (
              <button key={key} type="button" aria-pressed={(strongestConvergence && key === "same") || (!strongestConvergence && relation === key)} onClick={() => setRelation(key)} style={smallChipStyle((strongestConvergence && key === "same") || (!strongestConvergence && relation === key), RELATIONS[key].color)}>
                {RELATIONS[key].label}
              </button>
            ))}
          </ControlGroup>
          <button type="button" aria-pressed={uncertainTime} onClick={() => setUncertainTime((value) => !value)} style={togglePanelStyle(uncertainTime, VERMILION)}>
            <AlertTriangle size={18} aria-hidden="true" />
            <span>
              <span style={{ display: "block", fontWeight: 700 }}>Uncertain birth time</span>
              <span>{uncertainTime ? "A sharp divergence becomes a possible rectification signal." : "Turn on when time quality is uncertain."}</span>
            </span>
          </button>
        </section>

        <section style={{ ...cardStyle, borderColor: pickError || dataSignal ? `${VERMILION}66` : `${patternColor}66`, background: pickError || dataSignal ? `${VERMILION}0F` : `${patternColor}0F` }}>
          <p style={eyebrowStyle}>Synthesis</p>
          <h3 style={{ margin: "0.15rem 0 0", color: pickError || dataSignal ? VERMILION : patternColor, fontSize: "1.18rem" }}>
            {pickError ? "Preference error" : dataSignal ? "Divergence plus data flag" : "Layered career reading"}
          </h3>
          <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{synthesis}</p>
        </section>
      </div>
    </div>
  );
}

function VoiceControl({
  title,
  icon,
  planet,
  field,
  strength,
  onPlanet,
  onField,
  onStrength,
  color,
}: {
  title: string;
  icon: ReactNode;
  planet: PlanetKey;
  field: FieldKey;
  strength: StrengthKey;
  onPlanet: (value: PlanetKey) => void;
  onField: (value: FieldKey) => void;
  onStrength: (value: StrengthKey) => void;
  color: string;
}) {
  return (
    <Panel title={title} icon={icon} color={color}>
      <ControlGroup label="Planet">
        {(Object.keys(PLANETS) as PlanetKey[]).map((key) => (
          <button key={key} type="button" aria-pressed={planet === key} onClick={() => onPlanet(key)} style={smallChipStyle(planet === key, PLANETS[key].color)}>
            {PLANETS[key].label}
          </button>
        ))}
      </ControlGroup>
      <ControlGroup label="Field">
        {(Object.keys(FIELDS) as FieldKey[]).map((key) => (
          <button key={key} type="button" aria-pressed={field === key} onClick={() => onField(key)} style={smallChipStyle(field === key, FIELDS[key].color)}>
            {FIELDS[key].label}
          </button>
        ))}
      </ControlGroup>
      <ControlGroup label="Strength">
        {(Object.keys(STRENGTHS) as StrengthKey[]).map((key) => (
          <button key={key} type="button" aria-pressed={strength === key} onClick={() => onStrength(key)} style={smallChipStyle(strength === key, STRENGTHS[key].color)}>
            {STRENGTHS[key].label}
          </button>
        ))}
      </ControlGroup>
      <p style={bodyTextStyle}>{PLANETS[planet].cue}; {FIELDS[field].note}; {STRENGTHS[strength].note}.</p>
    </Panel>
  );
}

function FieldLabelLines({ label, color, x }: { label: string; color: string; x: number }) {
  const [first, second] = label.split(" / ");
  return (
    <>
      <text x={x} y="170" textAnchor="middle" fill={color} fontSize="10" fontWeight="600">{first}</text>
      {second && <text x={x} y="183" textAnchor="middle" fill={color} fontSize="10" fontWeight="600">/ {second}</text>}
    </>
  );
}

function ComparisonSvg({ amkPlanet, tenthPlanet, amkField, tenthField, relation, divergence, pickError }: { amkPlanet: PlanetKey; tenthPlanet: PlanetKey; amkField: FieldKey; tenthField: FieldKey; relation: RelationKey; divergence: boolean; pickError: boolean }) {
  const relationColor = pickError ? VERMILION : relation === "same" || relation === "close" ? GREEN : divergence ? PURPLE : GOLD;
  return (
    <svg viewBox="0 0 560 330" role="img" aria-label="AmK versus 10th lord comparison" style={{ width: "100%", maxHeight: 430, margin: "0.4rem auto 0.85rem", display: "block" }}>
      <rect x="26" y="40" width="508" height="230" rx="8" fill={`${GOLD}0F`} stroke={HAIRLINE} />
      {relation === "same" ? (
        <circle cx="280" cy="145" r="48" fill={OPAQUE_LIGHT_FILL[GREEN]} stroke={GREEN} strokeWidth="5" />
      ) : (
        <path d="M 219 145 C 260 86, 320 86, 341 145" fill="none" stroke={relationColor} strokeWidth="5" strokeLinecap="round" strokeDasharray={relation === "none" ? "9 8" : undefined} />
      )}
      <circle cx="155" cy="145" r="64" fill={OPAQUE_LIGHT_FILL[PLANETS[amkPlanet].color] || `${PLANETS[amkPlanet].color}18`} stroke={PLANETS[amkPlanet].color} strokeWidth="4" />
      <text x="155" y="130" textAnchor="middle" fill={PLANETS[amkPlanet].color} fontSize="15" fontWeight="700">AmK</text>
      <text x="155" y="152" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="700">{PLANETS[amkPlanet].label}</text>
      <FieldLabelLines label={FIELDS[amkField].label} color={FIELDS[amkField].color} x={155} />
      <circle cx="405" cy="145" r="64" fill={OPAQUE_LIGHT_FILL[PLANETS[tenthPlanet].color] || `${PLANETS[tenthPlanet].color}18`} stroke={PLANETS[tenthPlanet].color} strokeWidth="4" />
      <text x="405" y="130" textAnchor="middle" fill={PLANETS[tenthPlanet].color} fontSize="15" fontWeight="700">10th</text>
      <text x="405" y="152" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="700">{PLANETS[tenthPlanet].label}</text>
      <FieldLabelLines label={FIELDS[tenthField].label} color={FIELDS[tenthField].color} x={405} />
      <text x="280" y="137" textAnchor="middle" fill={relationColor} fontSize="13" fontWeight="700">{relation === "same" ? "ONE" : relation === "close" ? "LINKED" : divergence ? "DIVERGE" : "AGREE"}</text>
      <text x="280" y="158" textAnchor="middle" fill={relationColor} fontSize="13" fontWeight="700">{relation === "same" ? "PLANET" : "VOICES"}</text>
      {pickError ? (
        <>
          <path d="M 238 228 L 322 228" stroke={VERMILION} strokeWidth="5" strokeLinecap="round" />
          <path d="M 268 204 L 292 252 M 292 204 L 268 252" stroke={VERMILION} strokeWidth="5" strokeLinecap="round" />
          <text x="280" y="288" textAnchor="middle" fill={VERMILION} fontSize="12" fontWeight="700">Do not pick one voice on divergence</text>
        </>
      ) : (
        <text x="280" y="288" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="700">Layer the structural career and the soul instrument</text>
      )}
    </svg>
  );
}

function patternTitle(flags: { strongestConvergence: boolean; closeConvergence: boolean; independentAgreement: boolean; fieldDivergence: boolean; strengthDivergence: boolean; dataSignal: boolean; pickError: boolean }) {
  if (flags.pickError) return "Pick-a-voice error";
  if (flags.dataSignal) return "Divergence as data signal";
  if (flags.strongestConvergence) return "Strongest convergence";
  if (flags.closeConvergence) return "Strong relation convergence";
  if (flags.fieldDivergence) return "Field divergence";
  if (flags.strengthDivergence) return "Strength divergence";
  if (flags.independentAgreement) return "Independent agreement";
  return "Layered comparison";
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

function PresetButton({ color, onClick, children }: { color: string; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} style={smallChipStyle(false, color)}>
      {children}
    </button>
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

const responsiveTwoColumnStyle: CSSProperties = {
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
