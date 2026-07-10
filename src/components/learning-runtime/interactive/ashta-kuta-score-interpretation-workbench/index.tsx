"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, GitCompare, HeartHandshake, RotateCcw, Scale, ShieldCheck, SlidersHorizontal, TriangleAlert, Users } from "lucide-react";
import { workbenchTwoColumnStyle, workbenchDiagramLayoutStyle } from "../lib/layouts";

type ScenarioId = "lowRawGood" | "familyThreshold" | "highScoreGap";
type FocusId = "score" | "distribution" | "cancellations" | "natal" | "family";

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

const SCENARIOS: Record<
  ScenarioId,
  {
    label: string;
    raw: number;
    effective: number;
    title: string;
    context: string;
    distribution: string;
    cancellation: string;
    natal: string;
    family: string;
    color: string;
  }
> = {
  lowRawGood: {
    label: "16/36 with cancellation",
    raw: 16,
    effective: 27,
    title: "A low raw score that becomes workable",
    context: "Raw score is 16/36. The main loss is Nadi, but the Nadi dosha is classically cancelled.",
    distribution: "Graha-Maitri and Bhakuta are intact, so the emotional and mental registers are not the source of the low total.",
    cancellation: "Cancelled Nadi means the effective reading is stronger than the number suggests.",
    natal: "Both charts show supported natal marriage promise, so compatibility remains one layer of a fuller judgment.",
    family: "Explain the low number honestly, then show why this is not a failure verdict.",
    color: GREEN,
  },
  familyThreshold: {
    label: "17/36 family concern",
    raw: 17,
    effective: 25,
    title: "A family wants to reject solely below 18",
    context: "The family is worried because the score is 17/36 and they have been told below 18 means incompatible.",
    distribution: "The practitioner must name which kutas lost points and which dimensions remain sound.",
    cancellation: "Any Nadi or Bhakuta loss must be checked before the number is interpreted.",
    natal: "If both natal promises are sound, the score cannot replace the charts' own marriage indications.",
    family: "Honor the concern, explain that below 18 is modern shorthand, give specifics, and return agency.",
    color: BLUE,
  },
  highScoreGap: {
    label: "30/36 with hidden gap",
    raw: 30,
    effective: 26,
    title: "A high total that still needs inspection",
    context: "Raw score is 30/36, but the missing points sit in a heavy uncancelled dimension.",
    distribution: "A high score can hide one serious gap when the missing points are concentrated.",
    cancellation: "If a heavy Bhakuta or Nadi issue is uncancelled, do not let the high total flatten it.",
    natal: "Natal promise and synastry decide whether the gap is manageable or central.",
    family: "Do not sell reassurance through the number; describe the specific dimension needing care.",
    color: GOLD,
  },
};

const FOCUS: Record<FocusId, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  score: {
    label: "Score",
    title: "The total is a diagnostic summary",
    body: "A 36-point total starts the reading. It does not end it, and it never becomes a pass/fail decree.",
    icon: <Scale size={16} />,
    color: GOLD,
  },
  distribution: {
    label: "Distribution",
    title: "The shape of the score carries meaning",
    body: "Which kutas are strong or weak matters more than the total alone, especially around Nadi, Bhakuta, and Graha-Maitri.",
    icon: <GitCompare size={16} />,
    color: BLUE,
  },
  cancellations: {
    label: "Cancellations",
    title: "Cancelled heavy doshas change the effective reading",
    body: "Nadi and Bhakuta can strongly lower the raw total, but classical cancellations must be checked before judgment.",
    icon: <ShieldCheck size={16} />,
    color: GREEN,
  },
  natal: {
    label: "Natal",
    title: "Compatibility is one layer, not a substitute",
    body: "Each person's natal marriage promise remains part of the reading. A match score cannot replace Chapters 1-5.",
    icon: <HeartHandshake size={16} />,
    color: PURPLE,
  },
  family: {
    label: "Family",
    title: "Respect concern while refusing the single number",
    body: "The practitioner explains the nuance, avoids scolding, avoids rubber-stamping, and returns agency to the family and couple.",
    icon: <Users size={16} />,
    color: VERMILION,
  },
};

export function AshtaKutaScoreInterpretationWorkbench() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>("lowRawGood");
  const [focus, setFocus] = useState<FocusId>("score");
  const [readDistribution, setReadDistribution] = useState(true);
  const [cancellationsChecked, setCancellationsChecked] = useState(true);
  const [natalChecked, setNatalChecked] = useState(true);
  const [synastryAgency, setSynastryAgency] = useState(true);
  const [familyRespect, setFamilyRespect] = useState(true);
  const [refuseThreshold, setRefuseThreshold] = useState(true);
  const [singleNumberVerdict, setSingleNumberVerdict] = useState(false);

  const scenario = SCENARIOS[scenarioId];
  const methodOk = readDistribution && cancellationsChecked && natalChecked && synastryAgency && familyRespect && refuseThreshold && !singleNumberVerdict;

  const verdict = useMemo(() => {
    if (singleNumberVerdict || !refuseThreshold) return { label: "threshold trap", color: VERMILION };
    if (!readDistribution) return { label: "distribution missing", color: GOLD };
    if (!cancellationsChecked) return { label: "cancellation gap", color: VERMILION };
    if (!natalChecked) return { label: "natal layer missing", color: GOLD };
    if (!familyRespect) return { label: "family handling risk", color: VERMILION };
    if (scenarioId === "highScoreGap") return { label: "high score, inspect gap", color: GOLD };
    if (scenarioId === "familyThreshold") return { label: "respectful nuance response", color: BLUE };
    return { label: "low raw, workable match", color: GREEN };
  }, [cancellationsChecked, familyRespect, natalChecked, readDistribution, refuseThreshold, scenarioId, singleNumberVerdict]);

  const statement = useMemo(() => {
    if (singleNumberVerdict || !refuseThreshold) return "Pause: the score is being used as a verdict. Below 18 is modern shorthand, not classical doctrine.";
    if (!readDistribution) return "Pause: the kuta distribution is hidden. A total without the strong and weak dimensions is misleading.";
    if (!cancellationsChecked) return "Pause: heavy dosha cancellations are not checked. A cancelled Nadi or Bhakuta changes the effective reading.";
    if (!natalChecked) return "Pause: compatibility is replacing the natal marriage promise. Keep the score as one layer.";
    if (!synastryAgency) return "Pause: synastry and the couple's agency are absent. The reading should guide, not decree.";
    if (!familyRespect) return "Pause: the family concern needs respect. Explain and equip without scolding or rubber-stamping.";
    if (scenarioId === "lowRawGood") {
      return "Honest reading: the raw 16/36 is misleading because the main loss is cancelled, key heavy dimensions are intact, and both natal promises are supported. Workable, even good, not a fail.";
    }
    if (scenarioId === "familyThreshold") {
      return "Honest response: honor the family's concern, explain the below-18 shorthand, show the distribution and cancellations, include the natal promise, then return agency.";
    }
    return "Honest reading: the high 30/36 should not become automatic approval. The missing points sit in a heavy dimension, so inspect that gap before offering guidance.";
  }, [cancellationsChecked, familyRespect, natalChecked, readDistribution, refuseThreshold, scenarioId, singleNumberVerdict, synastryAgency]);

  return (
    <div data-interactive="ashta-kuta-score-interpretation-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>36-point interpretation</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.35rem" }}>Refuse the single-number verdict</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 940 }}>
              Use scenario switches and guard toggles to turn a raw Ashta-kuta total into a qualitative, multi-layer compatibility statement.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setScenarioId("lowRawGood");
              setFocus("score");
              setReadDistribution(true);
              setCancellationsChecked(true);
              setNatalChecked(true);
              setSynastryAgency(true);
              setFamilyRespect(true);
              setRefuseThreshold(true);
              setSingleNumberVerdict(false);
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
          {(Object.keys(SCENARIOS) as ScenarioId[]).map((id) => (
            <button key={id} type="button" aria-pressed={scenarioId === id} onClick={() => setScenarioId(id)} style={buttonStyle(scenarioId === id, SCENARIOS[id].color)}>
              <SlidersHorizontal size={16} aria-hidden="true" />
              {SCENARIOS[id].label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "0.8rem", border: `1px solid ${scenario.color}55`, borderRadius: 8, background: `${scenario.color}10`, padding: "0.85rem" }}>
          <h3 style={{ margin: 0, color: scenario.color, fontSize: "1.14rem" }}>{scenario.title}</h3>
          <p style={bodyTextStyle}>{scenario.context}</p>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(Object.keys(FOCUS) as FocusId[]).map((id) => (
            <button key={id} type="button" aria-pressed={focus === id} onClick={() => setFocus(id)} style={buttonStyle(focus === id, FOCUS[id].color)}>
              {FOCUS[id].icon}
              {FOCUS[id].label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "0.8rem", border: `1px solid ${FOCUS[focus].color}55`, borderRadius: 8, background: `${FOCUS[focus].color}10`, padding: "0.85rem" }}>
          <h3 style={{ margin: 0, color: FOCUS[focus].color, fontSize: "1.1rem" }}>{FOCUS[focus].title}</h3>
          <p style={bodyTextStyle}>{FOCUS[focus].body}</p>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Raw score to honest guidance</p>
              <h3 style={{ margin: "0.15rem 0 0", color: verdict.color, fontSize: "1.18rem" }}>{verdict.label}</h3>
            </div>
            <strong style={{ color: verdict.color }}>{scenario.raw}/36 raw</strong>
          </div>
          <ScoreInterpretationSvg scenario={scenario} focus={focus} methodOk={methodOk} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 145px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="Raw total" body={`${scenario.raw}/36`} color={scenario.color} icon={<Scale size={16} />} />
            <MiniFact title="Effective view" body={`${scenario.effective}/36`} color={methodOk ? GREEN : GOLD} icon={<BadgeCheck size={16} />} />
            <MiniFact title="Practice mode" body={methodOk ? "multi-layer" : "repair needed"} color={methodOk ? GREEN : VERMILION} icon={<ShieldCheck size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Scenario reading notes" icon={<GitCompare size={18} />} color={scenario.color}>
            <NoteRow title="Distribution" body={scenario.distribution} color={BLUE} />
            <NoteRow title="Cancellation" body={scenario.cancellation} color={GREEN} />
            <NoteRow title="Natal promise" body={scenario.natal} color={PURPLE} />
            <NoteRow title="Family handling" body={scenario.family} color={VERMILION} />
          </Panel>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Interpretation guards</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <Toggle active={readDistribution} color={readDistribution ? GREEN : VERMILION} icon={<GitCompare size={18} />} title="Read kuta distribution" body={readDistribution ? "Strong and weak dimensions are visible." : "Only the total is being read."} onClick={() => setReadDistribution((value) => !value)} />
            <Toggle active={cancellationsChecked} color={cancellationsChecked ? GREEN : VERMILION} icon={<ShieldCheck size={18} />} title="Check Nadi/Bhakuta cancellations" body={cancellationsChecked ? "Heavy dosha modifiers are included." : "Raw score is being taken at face value."} onClick={() => setCancellationsChecked((value) => !value)} />
            <Toggle active={natalChecked} color={natalChecked ? GREEN : GOLD} icon={<HeartHandshake size={18} />} title="Compare natal promises" body={natalChecked ? "Compatibility is combined with both charts." : "The score is replacing the charts."} onClick={() => setNatalChecked((value) => !value)} />
            <Toggle active={synastryAgency} color={synastryAgency ? GREEN : GOLD} icon={<Users size={18} />} title="Include synastry and agency" body={synastryAgency ? "Guidance stays practical and non-fatalistic." : "The couple's lived work is absent."} onClick={() => setSynastryAgency((value) => !value)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Ethical handling</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <Toggle active={familyRespect} color={familyRespect ? GREEN : VERMILION} icon={<Users size={18} />} title="Respect family concern" body={familyRespect ? "Explain without scolding." : "Concern is being dismissed."} onClick={() => setFamilyRespect((value) => !value)} />
            <Toggle active={refuseThreshold} color={refuseThreshold ? GREEN : VERMILION} icon={<TriangleAlert size={18} />} title="Refuse below-18 verdict" body={refuseThreshold ? "Modern shorthand is named as shorthand." : "Threshold is treated as doctrine."} onClick={() => setRefuseThreshold((value) => !value)} />
            <Toggle active={singleNumberVerdict} color={singleNumberVerdict ? VERMILION : GREEN} icon={<Scale size={18} />} title="Single-number verdict" body={singleNumberVerdict ? "Error active: total is the verdict." : "Correct: no pass/fail decree."} onClick={() => setSingleNumberVerdict((value) => !value)} />
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: `${verdict.color}66`, background: `${verdict.color}10` }}>
        <p style={eyebrowStyle}>Practice statement</p>
        <h3 style={{ margin: "0.15rem 0 0", color: verdict.color, fontSize: "1.18rem" }}>{verdict.label}</h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{statement}</p>
      </section>
    </div>
  );
}

function ScoreInterpretationSvg({ scenario, focus, methodOk }: { scenario: (typeof SCENARIOS)[ScenarioId]; focus: FocusId; methodOk: boolean }) {
  const steps: Array<{ id: FocusId; label: string; x: number; color: string }> = [
    { id: "score", label: "Raw score", x: 92, color: GOLD },
    { id: "distribution", label: "Distribution", x: 242, color: BLUE },
    { id: "cancellations", label: "Cancellations", x: 392, color: GREEN },
    { id: "natal", label: "Natal promise", x: 542, color: PURPLE },
    { id: "family", label: "Guidance", x: 692, color: VERMILION },
  ];

  return (
    <svg viewBox="0 0 780 390" role="img" aria-label="Ashta-kuta raw score interpretation flow" style={{ width: "100%", minHeight: 300, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="744" height="354" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="390" y="52" textAnchor="middle" fill={GOLD} fontSize="15" fontWeight="700">A NUMBER BECOMES A JUDGMENT ONLY AFTER MODIFIERS</text>
      <line x1="92" y1="150" x2="692" y2="150" stroke={HAIRLINE} strokeWidth="4" />
      {steps.map((step, index) => {
        const active = focus === step.id;
        return (
          <g key={step.id}>
            {index < steps.length - 1 ? <path d={`M ${step.x + 46} 150 L ${steps[index + 1].x - 52} 150`} stroke={step.color} strokeWidth={active ? 5 : 3} opacity={active ? 1 : 0.45} /> : null}
            <circle cx={step.x} cy="150" r={active ? 47 : 41} fill={OPAQUE_LIGHT_FILL[step.color]} stroke={step.color} strokeWidth={active ? 4 : 2.5} />
            <text x={step.x} y="145" textAnchor="middle" fill={step.color} fontSize="14" fontWeight="700">{step.label}</text>
            <text x={step.x} y="166" textAnchor="middle" fill={INK_MUTED} fontSize="13">{index + 1}</text>
          </g>
        );
      })}
      <path d="M 354 268 C 405 222, 468 222, 520 268" fill="none" stroke={methodOk ? GREEN : VERMILION} strokeWidth="4" strokeDasharray="8 7" />
      <rect x="95" y="240" width="250" height="54" rx="8" fill={OPAQUE_LIGHT_FILL[scenario.color]} stroke={scenario.color} />
      <text x="220" y="262" textAnchor="middle" fill={scenario.color} fontSize="15" fontWeight="700">raw total: {scenario.raw}/36</text>
      <text x="220" y="282" textAnchor="middle" fill={INK_MUTED} fontSize="13">diagnostic summary</text>
      <rect x="535" y="240" width="250" height="54" rx="8" fill={OPAQUE_LIGHT_FILL[methodOk ? GREEN : VERMILION]} stroke={methodOk ? GREEN : VERMILION} />
      <text x="660" y="262" textAnchor="middle" fill={methodOk ? GREEN : VERMILION} fontSize="15" fontWeight="700">effective view: {scenario.effective}/36</text>
      <text x="660" y="282" textAnchor="middle" fill={INK_MUTED} fontSize="13">{methodOk ? "guidance, not decree" : "method repair needed"}</text>
      <text x="390" y="332" textAnchor="middle" fill={INK_SECONDARY} fontSize="14">Distribution + cancellations + natal promise + agency protect the reading from threshold harm.</text>
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
      <span style={{ color, flexShrink: 0 }}>{icon}</span>
      <span>
        <strong style={{ display: "block", fontWeight: 700, marginBottom: "0.15rem" }}>{title}</strong>
        <span style={{ color: INK_SECONDARY, lineHeight: 1.45 }}>{body}</span>
      </span>
    </button>
  );
}

function NoteRow({ title, body, color }: { title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}10`, padding: "0.7rem" }}>
      <strong style={{ color, fontSize: "0.9rem", fontWeight: 600 }}>{title}</strong>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.86rem", lineHeight: 1.45 }}>{body}</p>
    </div>
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
