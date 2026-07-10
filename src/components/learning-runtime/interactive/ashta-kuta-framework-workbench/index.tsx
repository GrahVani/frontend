"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, CircleDot, GitCompare, HeartHandshake, Moon, RotateCcw, Scale, ShieldCheck, Sparkles, TriangleAlert } from "lucide-react";
import { workbenchTwoColumnStyle, workbenchDiagramLayoutStyle } from "../lib/layouts";

type KutaId = "varna" | "vashya" | "tara" | "yoni" | "graha" | "gana" | "bhakuta" | "nadi";
type BasisMode = "moon" | "lagna";

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

const KUTAS: Array<{
  id: KutaId;
  name: string;
  points: number;
  score: number;
  dimension: string;
  source: string;
  color: string;
  note: string;
}> = [
  { id: "varna", name: "Varna", points: 1, score: 1, dimension: "spiritual and ego fit", source: "Moon sign class", color: BLUE, note: "Small point value; useful as one soft register." },
  { id: "vashya", name: "Vashya", points: 2, score: 2, dimension: "attraction and influence", source: "Moon sign group", color: PURPLE, note: "Shows mutual pull, not control as a verdict." },
  { id: "tara", name: "Tara", points: 3, score: 3, dimension: "health and well-being", source: "nakshatra count both ways", color: GREEN, note: "Counted from each Moon nakshatra to the other." },
  { id: "yoni", name: "Yoni", points: 4, score: 3, dimension: "physical and instinctual fit", source: "nakshatra animal symbols", color: GOLD, note: "A physical register; do not confuse it with mental rapport." },
  { id: "graha", name: "Graha-Maitri", points: 5, score: 5, dimension: "mental and intellectual rapport", source: "Moon sign lords", color: GREEN, note: "Uses planetary friendship of the two rashi lords." },
  { id: "gana", name: "Gana", points: 6, score: 5, dimension: "temperament", source: "deva, manushya, rakshasa", color: BLUE, note: "Temperament difference is a conversation area, not a label." },
  { id: "bhakuta", name: "Bhakuta", points: 7, score: 0, dimension: "emotional and family well-being", source: "Moon sign distance", color: VERMILION, note: "Heavy dosha when the Moon signs fall on difficult axes, but cancellations matter." },
  { id: "nadi", name: "Nadi", points: 8, score: 8, dimension: "constitution, health, progeny", source: "nakshatra nadi class", color: GREEN, note: "Heaviest kuta; same nadi gives zero unless classical cancellation applies." },
];

const FOCUS_COPY: Record<KutaId | "distribution", { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  distribution: {
    label: "Distribution",
    title: "Read the shape, not only the total",
    body: "The total is a sum across eight different dimensions. A high score can hide one heavy gap, and a low score can hide cancelled doshas.",
    icon: <GitCompare size={16} />,
    color: GOLD,
  },
  varna: { label: "Varna", title: "Varna is the 1-point spiritual/ego register", body: "It is the lightest factor and should never dominate the reading.", icon: <CircleDot size={16} />, color: BLUE },
  vashya: { label: "Vashya", title: "Vashya measures attraction and influence", body: "Read as a relational tendency, not as control or superiority.", icon: <HeartHandshake size={16} />, color: PURPLE },
  tara: { label: "Tara", title: "Tara uses nakshatra counting", body: "It checks star compatibility and well-being by counting between the two Moon nakshatras.", icon: <Sparkles size={16} />, color: GREEN },
  yoni: { label: "Yoni", title: "Yoni is the physical and instinctual register", body: "It should not be inflated into the whole compatibility reading.", icon: <HeartHandshake size={16} />, color: GOLD },
  graha: { label: "Graha", title: "Graha-Maitri is mental rapport", body: "It comes from friendship between the two Moon-sign lords.", icon: <BadgeCheck size={16} />, color: GREEN },
  gana: { label: "Gana", title: "Gana is temperament", body: "It distinguishes temperament modes without turning them into fixed character judgments.", icon: <Scale size={16} />, color: BLUE },
  bhakuta: { label: "Bhakuta", title: "Bhakuta is a heavy emotional/family axis", body: "A zero must be checked for cancellation before it is interpreted.", icon: <TriangleAlert size={16} />, color: VERMILION },
  nadi: { label: "Nadi", title: "Nadi is the heaviest kuta", body: "Same nadi is a major classical dosha, but cancellations must be checked before reading it.", icon: <ShieldCheck size={16} />, color: PURPLE },
};

export function AshtaKutaFrameworkWorkbench() {
  const [selected, setSelected] = useState<KutaId | "distribution">("distribution");
  const [basisMode, setBasisMode] = useState<BasisMode>("moon");
  const [nadiCancellation, setNadiCancellation] = useState(true);
  const [bhakutaCancellation, setBhakutaCancellation] = useState(false);
  const [readDistribution, setReadDistribution] = useState(true);
  const [combineFullReading, setCombineFullReading] = useState(true);
  const [singleNumberVerdict, setSingleNumberVerdict] = useState(false);

  const rawTotal = KUTAS.reduce((sum, kuta) => sum + kuta.score, 0);
  const effectiveTotal = rawTotal + (bhakutaCancellation ? 4 : 0) + (nadiCancellation && KUTAS.find((item) => item.id === "nadi")?.score === 0 ? 4 : 0);
  const heavyDoshaOpen = KUTAS.some((kuta) => kuta.id === "bhakuta" && kuta.score === 0 && !bhakutaCancellation) || KUTAS.some((kuta) => kuta.id === "nadi" && kuta.score === 0 && !nadiCancellation);
  const methodOk = basisMode === "moon" && readDistribution && combineFullReading && !singleNumberVerdict;
  const tier = useMemo(() => {
    if (!methodOk) return "method warning";
    if (heavyDoshaOpen) return "strong total with heavy gap";
    if (effectiveTotal >= 28) return "strong distributed support";
    if (effectiveTotal >= 18) return "mixed diagnostic";
    return "low score, inspect shape";
  }, [effectiveTotal, heavyDoshaOpen, methodOk]);

  const statement = useMemo(() => {
    if (basisMode !== "moon") return "Pause: Ashta-kuta is computed from the Moon nakshatra and Moon sign, not from the ascendant.";
    if (singleNumberVerdict) return "Pause: the total is being treated as the verdict. Read the eight dimensions, dosha cancellations, and the full marriage charts.";
    if (!readDistribution) return "Pause: the distribution is hidden. A total without the kuta-by-kuta shape is misleading.";
    if (!combineFullReading) return "Pause: compatibility is replacing the natal marriage promise. Keep Ashta-kuta as one layer alongside the full reading.";
    if (heavyDoshaOpen) return "The total looks strong, but Bhakuta is zero and uncancelled in this scenario. Read the emotional/family dimension specifically before making any compatibility statement.";
    return `The raw score is ${rawTotal}/36 and the effective working score is ${effectiveTotal}/36 after cancellation checks. Read this as eight compatibility dimensions, not a pass/fail verdict.`;
  }, [basisMode, combineFullReading, effectiveTotal, heavyDoshaOpen, rawTotal, readDistribution, singleNumberVerdict]);

  return (
    <div data-interactive="ashta-kuta-framework-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Ashta-kuta framework</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.35rem" }}>Read eight compatibility dimensions, not one verdict</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 930 }}>
              Explore the 36-point framework by distribution, Moon-basis computation, and the heavy Nadi/Bhakuta dosha cancellations.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelected("distribution");
              setBasisMode("moon");
              setNadiCancellation(true);
              setBhakutaCancellation(false);
              setReadDistribution(true);
              setCombineFullReading(true);
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
          {(["distribution", ...KUTAS.map((kuta) => kuta.id)] as Array<KutaId | "distribution">).map((key) => (
            <button key={key} type="button" aria-pressed={selected === key} onClick={() => setSelected(key)} style={buttonStyle(selected === key, FOCUS_COPY[key].color)}>
              {FOCUS_COPY[key].icon}
              {FOCUS_COPY[key].label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "0.8rem", border: `1px solid ${FOCUS_COPY[selected].color}55`, borderRadius: 8, background: `${FOCUS_COPY[selected].color}10`, padding: "0.85rem" }}>
          <h3 style={{ margin: 0, color: FOCUS_COPY[selected].color, fontSize: "1.12rem" }}>{FOCUS_COPY[selected].title}</h3>
          <p style={bodyTextStyle}>{FOCUS_COPY[selected].body}</p>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Compatibility distribution</p>
              <h3 style={{ margin: "0.15rem 0 0", color: tierColor(tier), fontSize: "1.2rem" }}>{tier}</h3>
            </div>
            <strong style={{ color: tierColor(tier) }}>{effectiveTotal}/36 effective</strong>
          </div>
          <AshtaKutaSvg selected={selected} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 135px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="Raw total" body={`${rawTotal}/36`} color={GOLD} icon={<Scale size={16} />} />
            <MiniFact title="Heaviest checks" body="Nadi + Bhakuta" color={heavyDoshaOpen ? VERMILION : GREEN} icon={<TriangleAlert size={16} />} />
            <MiniFact title="Basis" body={basisMode === "moon" ? "Moon sign/nakshatra" : "wrong: Lagna"} color={basisMode === "moon" ? GREEN : VERMILION} icon={<Moon size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Computation basis" icon={<Moon size={18} />} color={basisMode === "moon" ? GREEN : VERMILION}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <button type="button" aria-pressed={basisMode === "moon"} onClick={() => setBasisMode("moon")} style={buttonStyle(basisMode === "moon", GREEN)}>
                Moon basis
              </button>
              <button type="button" aria-pressed={basisMode === "lagna"} onClick={() => setBasisMode("lagna")} style={buttonStyle(basisMode === "lagna", VERMILION)}>
                Lagna mistake
              </button>
            </div>
            <p style={bodyTextStyle}>Use the couple&apos;s Moon nakshatras and Moon signs for the kuta tables.</p>
          </Panel>

          <Panel title="Heavy dosha cancellations" icon={<ShieldCheck size={18} />} color={heavyDoshaOpen ? VERMILION : GREEN}>
            <Toggle active={bhakutaCancellation} color={bhakutaCancellation ? GREEN : VERMILION} icon={<ShieldCheck size={18} />} title="Bhakuta cancellation" body={bhakutaCancellation ? "Moon-sign axis is mitigated." : "Bhakuta zero remains active."} onClick={() => setBhakutaCancellation((value) => !value)} />
            <Toggle active={nadiCancellation} color={nadiCancellation ? GREEN : GOLD} icon={<ShieldCheck size={18} />} title="Nadi cancellation checked" body={nadiCancellation ? "Nadi cancellation check is included." : "Nadi cancellation not checked."} onClick={() => setNadiCancellation((value) => !value)} />
          </Panel>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Eight kuta table</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 170px), 1fr))", gap: "0.6rem", marginTop: "0.75rem" }}>
          {KUTAS.map((kuta) => (
            <button key={kuta.id} type="button" aria-pressed={selected === kuta.id} onClick={() => setSelected(kuta.id)} style={kutaCardStyle(selected === kuta.id, kuta.color)}>
              <span style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", alignItems: "center" }}>
                <strong style={{ color: kuta.color }}>{kuta.name}</strong>
                <span style={{ color: INK_MUTED, fontWeight: 600 }}>{kuta.score}/{kuta.points}</span>
              </span>
              <span style={{ display: "block", marginTop: "0.4rem", color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.35 }}>{kuta.dimension}</span>
              <span style={{ display: "block", marginTop: "0.35rem", color: INK_MUTED, fontSize: "0.78rem", lineHeight: 1.35 }}>{kuta.source}</span>
            </button>
          ))}
        </div>
      </section>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Interpretation guards</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={readDistribution} color={readDistribution ? GREEN : VERMILION} icon={<GitCompare size={18} />} title="Distribution visible" body={readDistribution ? "Which kuta scores is part of the reading." : "Only the total is being read."} onClick={() => setReadDistribution((value) => !value)} />
            <Toggle active={combineFullReading} color={combineFullReading ? GREEN : VERMILION} icon={<HeartHandshake size={18} />} title="Combined with full reading" body={combineFullReading ? "Compatibility remains one layer." : "Score is replacing natal promise and synastry."} onClick={() => setCombineFullReading((value) => !value)} />
            <Toggle active={singleNumberVerdict} color={singleNumberVerdict ? VERMILION : GREEN} icon={<TriangleAlert size={18} />} title="Single-number verdict" body={singleNumberVerdict ? "Error active: total is being treated as pass/fail." : "Correct: no pass/fail decree."} onClick={() => setSingleNumberVerdict((value) => !value)} />
          </div>
        </section>

        <section style={{ ...cardStyle, borderColor: `${tierColor(tier)}66`, background: `${tierColor(tier)}10` }}>
          <p style={eyebrowStyle}>Diagnostic statement</p>
          <h3 style={{ margin: "0.15rem 0 0", color: tierColor(tier), fontSize: "1.16rem" }}>{tier}</h3>
          <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{statement}</p>
        </section>
      </div>
    </div>
  );
}

function AshtaKutaSvg({ selected }: { selected: KutaId | "distribution" }) {
  return (
    <svg viewBox="0 0 980 560" role="img" aria-label="Ashta-kuta 36 point distribution diagram" style={{ width: "100%", minHeight: 430, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="944" height="524" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="490" y="64" textAnchor="middle" fill={GOLD} fontSize="22" fontWeight="700">EIGHT KUTAS SUM TO 36, BUT THE SHAPE MATTERS</text>
      {KUTAS.map((kuta, index) => {
        const cardWidth = 104;
        const currentX = 58 + index * 112;
        const active = selected === kuta.id || selected === "distribution";
        const labelLines = kuta.name === "Graha-Maitri" ? ["Graha", "Maitri"] : [kuta.name];
        return (
          <g key={kuta.id}>
            <rect x={currentX} y="100" width={cardWidth} height="98" rx="8" fill={active ? OPAQUE_LIGHT_FILL[kuta.color] : "transparent"} stroke={selected === kuta.id ? kuta.color : HAIRLINE} strokeWidth={selected === kuta.id ? 3.5 : 1.6} />
            {labelLines.map((line, lineIndex) => (
              <text key={line} x={currentX + cardWidth / 2} y={labelLines.length === 1 ? 132 : 123 + lineIndex * 19} textAnchor="middle" fill={kuta.color} fontSize="16" fontWeight="700">{line}</text>
            ))}
            <text x={currentX + cardWidth / 2} y="171" textAnchor="middle" fill={INK_SECONDARY} fontSize="15" fontWeight="600">{kuta.points} pts</text>
            <rect x={currentX + 10} y="220" width={cardWidth - 20} height="22" rx="8" fill={HAIRLINE} opacity="0.6" />
            <rect x={currentX + 10} y="220" width={Math.max(4, ((kuta.score || 0) / kuta.points) * (cardWidth - 20))} height="22" rx="8" fill={kuta.color} opacity={kuta.score === 0 ? 0.25 : 1} />
            <text x={currentX + cardWidth / 2} y="270" textAnchor="middle" fill={INK_PRIMARY} fontSize="16" fontWeight="700">{kuta.score}/{kuta.points}</text>
          </g>
        );
      })}
      <path d="M 372 410 C 438 350, 542 350, 608 410" fill="none" stroke={GOLD} strokeWidth="5" strokeDasharray="10 8" />
      <circle cx="300" cy="410" r="70" fill={OPAQUE_LIGHT_FILL[VERMILION]} stroke={VERMILION} strokeWidth="4.5" />
      <text x="300" y="400" textAnchor="middle" fill={VERMILION} fontSize="21" fontWeight="700">Bhakuta</text>
      <text x="300" y="434" textAnchor="middle" fill={INK_SECONDARY} fontSize="16" fontWeight="600">heavy gap</text>
      <circle cx="680" cy="410" r="70" fill={OPAQUE_LIGHT_FILL[PURPLE]} stroke={PURPLE} strokeWidth="4.5" />
      <text x="680" y="400" textAnchor="middle" fill={PURPLE} fontSize="21" fontWeight="700">Nadi</text>
      <text x="680" y="434" textAnchor="middle" fill={INK_SECONDARY} fontSize="16" fontWeight="600">heaviest</text>
      <text x="490" y="335" textAnchor="middle" fill={GOLD} fontSize="18" fontWeight="700">always check cancellations</text>
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

function tierColor(tier: string): string {
  if (tier === "strong distributed support") return GREEN;
  if (tier === "strong total with heavy gap") return GOLD;
  if (tier === "mixed diagnostic") return BLUE;
  if (tier === "low score, inspect shape") return GOLD;
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

function kutaCardStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}12` : "transparent",
    color: INK_PRIMARY,
    padding: "0.75rem",
    textAlign: "left",
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
