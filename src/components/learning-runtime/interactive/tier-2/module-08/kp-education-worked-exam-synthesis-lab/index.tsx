"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { GitCompare, RotateCcw, Scale, ShieldCheck, Sparkles, Venus } from "lucide-react";

type HouseKey = "4" | "5" | "9";
type LensKey = "kp" | "comparison" | "client" | "caution";

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

const HOUSES: Record<HouseKey, { label: string; domain: string; kpCarrier: string; wholeCarrier: string; relation: string; kpDetail: string; wholeDetail: string; color: string }> = {
  "4": {
    label: "4th",
    domain: "foundational education",
    kpCarrier: "Jupiter + Sun/Venus",
    wholeCarrier: "Jupiter",
    relation: "converges by different mechanisms",
    kpDetail: "KP uses Jupiter as cuspal sub-lord, with Sun and Venus as top significators.",
    wholeDetail: "Whole-sign reading emphasizes Jupiter as strong lord in own sign.",
    color: BLUE,
  },
  "5": {
    label: "5th",
    domain: "exam performance",
    kpCarrier: "Venus",
    wholeCarrier: "Mars",
    relation: "converges on favourability, diverges sharply on carrier",
    kpDetail: "KP gives Venus as cuspal sub-lord, top significator, and running dasha/bhukti lord.",
    wholeDetail: "Whole-sign reading is carried by exalted Mars as 5th-house occupant.",
    color: GOLD,
  },
  "9": {
    label: "9th",
    domain: "higher learning",
    kpCarrier: "Venus + Moon/Ketu",
    wholeCarrier: "Venus + Ketu",
    relation: "converges closely",
    kpDetail: "KP uses Venus as cuspal sub-lord, Moon as top significator, and Ketu as occupant.",
    wholeDetail: "Whole-sign reading emphasizes strong Venus and the same unconventional Ketu signature.",
    color: PURPLE,
  },
};

const LENSES: Record<LensKey, { label: string; title: string; body: string; icon: ReactNode; color: string; house: HouseKey }> = {
  kp: {
    label: "KP assembly",
    title: "Venus carries the finished KP picture",
    body: "The 5th and 9th cuspal sub-lords are Venus, Venus signifies all three education houses, and Venus runs the late-teens period.",
    icon: <Venus size={16} />,
    color: GREEN,
    house: "5",
  },
  comparison: {
    label: "Compare",
    title: "Report verdict and mechanism separately",
    body: "Chart E1 converges on overall favourability, but the 5th house is Mars-carried in whole-sign and Venus-carried in KP.",
    icon: <GitCompare size={16} />,
    color: GOLD,
    house: "5",
  },
  client: {
    label: "Client line",
    title: "Make the answer usable without overclaiming",
    body: "The client-ready statement names the strong Venus alignment and frames it as high probability, not certainty.",
    icon: <Sparkles size={16} />,
    color: BLUE,
    house: "5",
  },
  caution: {
    label: "Caution",
    title: "This convergence is chart-specific",
    body: "Do not generalize Chart E1 into a rule that KP and whole-sign always agree, and do not average both systems into one score.",
    icon: <ShieldCheck size={16} />,
    color: VERMILION,
    house: "4",
  },
};

export function KpEducationWorkedExamSynthesisLab() {
  const [activeHouse, setActiveHouse] = useState<HouseKey>("5");
  const [lensKey, setLensKey] = useState<LensKey>("kp");
  const [showComparison, setShowComparison] = useState(true);
  const [keepSeparate, setKeepSeparate] = useState(true);
  const [avoidUniversalRule, setAvoidUniversalRule] = useState(true);

  const house = HOUSES[activeHouse];
  const lens = LENSES[lensKey];
  const synthesisScore = useMemo(() => {
    const base = activeHouse === "5" ? 42 : activeHouse === "4" ? 34 : 36;
    return Math.max(10, Math.min(96, base + (showComparison ? 18 : -8) + (keepSeparate ? 20 : -28) + (avoidUniversalRule ? 16 : -18)));
  }, [activeHouse, avoidUniversalRule, keepSeparate, showComparison]);

  const verdict = useMemo(() => {
    if (!keepSeparate) return { label: "false combined score", color: VERMILION };
    if (!avoidUniversalRule) return { label: "overgeneralized convergence", color: GOLD };
    if (!showComparison) return { label: "comparison missing", color: GOLD };
    if (activeHouse === "5") return { label: "strong convergence, different carrier", color: GREEN };
    return { label: "favourable convergence stated cleanly", color: GREEN };
  }, [activeHouse, avoidUniversalRule, keepSeparate, showComparison]);

  const clientLine = useMemo(() => {
    if (!keepSeparate) return "Repair the synthesis: do not average KP and whole-sign into a single confidence score.";
    if (!avoidUniversalRule) return "Repair the conclusion: Chart E1 converges because this chart is clean, not because all charts must converge.";
    if (!showComparison) return "Add the comparison layer so the reading does not become two unintegrated reports.";
    return `For the ${house.label} house, both systems support favourability. The honest nuance is that ${house.relation}: KP is carried by ${house.kpCarrier}, while whole-sign is carried by ${house.wholeCarrier}.`;
  }, [avoidUniversalRule, house.kpCarrier, house.label, house.relation, house.wholeCarrier, keepSeparate, showComparison]);

  function loadLens(key: LensKey) {
    setLensKey(key);
    setActiveHouse(LENSES[key].house);
    setShowComparison(true);
    setKeepSeparate(true);
    setAvoidUniversalRule(key !== "caution");
  }

  return (
    <div data-interactive="kp-education-worked-exam-synthesis-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>KP exam synthesis lab</p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.28rem", fontWeight: 600 }}>
              Assemble the KP answer and compare it without flattening the methods
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 940 }}>
              Build the final Chart E1 exam reading from cusps, significators, and dasha timing, then name how KP and whole-sign converge or diverge.
            </p>
          </div>
          <button type="button" onClick={() => { setActiveHouse("5"); setLensKey("kp"); setShowComparison(true); setKeepSeparate(true); setAvoidUniversalRule(true); }} style={buttonStyle(false, BLUE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(Object.keys(LENSES) as LensKey[]).map((key) => (
            <button key={key} type="button" onClick={() => loadLens(key)} style={buttonStyle(lensKey === key, LENSES[key].color)}>
              {LENSES[key].icon}
              {LENSES[key].label}
            </button>
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.08fr) minmax(300px, 0.92fr)", gap: "1rem" }}>
        <div style={cardStyle}>
          <SynthesisSvg house={house} verdict={verdict} score={synthesisScore} showComparison={showComparison} />
        </div>
        <div style={{ display: "grid", gap: "1rem" }}>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>lesson lens</p>
            <h3 style={{ margin: 0, color: lens.color, fontSize: "1.06rem", fontWeight: 600 }}>{lens.title}</h3>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{lens.body}</p>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>choose house</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.5rem" }}>
              {(Object.keys(HOUSES) as HouseKey[]).map((key) => (
                <button key={key} type="button" onClick={() => setActiveHouse(key)} style={houseStyle(activeHouse === key, HOUSES[key].color)}>
                  <span style={{ fontWeight: 600 }}>{HOUSES[key].label}</span>
                  <span style={{ color: activeHouse === key ? HOUSES[key].color : INK_MUTED, fontSize: "0.78rem" }}>{HOUSES[key].domain}</span>
                </button>
              ))}
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>synthesis discipline</p>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              <ToggleRow title="Show whole-sign comparison" body="Compare relationship, not just two reports side by side." color={GOLD} value={showComparison} onToggle={() => setShowComparison((value) => !value)} />
              <ToggleRow title="Keep systems separate" body="Do not average KP and whole-sign into one score." color={GREEN} value={keepSeparate} onToggle={() => setKeepSeparate((value) => !value)} />
              <ToggleRow title="Avoid universal rule" body="Treat convergence as Chart E1 specific, not automatic." color={VERMILION} value={avoidUniversalRule} onToggle={() => setAvoidUniversalRule((value) => !value)} />
            </div>
          </section>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start", flexWrap: "wrap" }}>
          <div style={{ color: verdict.color, marginTop: "0.15rem" }}><Scale size={18} aria-hidden="true" /></div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={eyebrowStyle}>client-ready synthesis</p>
            <h3 style={{ margin: 0, color: verdict.color, fontSize: "1.1rem", fontWeight: 600 }}>{verdict.label}</h3>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{clientLine}</p>
            <p style={{ margin: "0.35rem 0 0", color: INK_MUTED, lineHeight: 1.45 }}>{house.kpDetail} {house.wholeDetail}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function SynthesisSvg({
  house,
  verdict,
  score,
  showComparison,
}: {
  house: (typeof HOUSES)[HouseKey];
  verdict: { label: string; color: string };
  score: number;
  showComparison: boolean;
}) {
  return (
    <svg viewBox="0 0 760 460" role="img" aria-label="KP and whole-sign education synthesis diagram" style={{ width: "100%", minHeight: 360, display: "block" }}>
      <rect x="12" y="12" width="736" height="436" rx="20" fill={SURFACE} stroke={HAIRLINE} />
      <text x="380" y="48" textAnchor="middle" fill={GOLD} fontSize="13" fontWeight="600">CHART E1 EXAM SYNTHESIS</text>
      <text x="380" y="78" textAnchor="middle" fill={house.color} fontSize="18" fontWeight="600">{house.label} house: {house.domain}</text>
      <rect x="74" y="125" width="250" height="130" rx="18" fill={GREEN} fillOpacity="0.1" stroke={GREEN} />
      <text x="199" y="154" textAnchor="middle" fill={GREEN} fontSize="13" fontWeight="600">KP-cuspal mechanism</text>
      <text x="199" y="187" textAnchor="middle" fill={INK_PRIMARY} fontSize="17">{house.kpCarrier}</text>
      <text x="199" y="218" textAnchor="middle" fill={INK_SECONDARY} fontSize="12">cusps + significators + dasha</text>
      <rect x="436" y="125" width="250" height="130" rx="18" fill={showComparison ? BLUE : SURFACE} fillOpacity={showComparison ? "0.1" : "1"} stroke={showComparison ? BLUE : HAIRLINE} />
      <text x="561" y="154" textAnchor="middle" fill={showComparison ? BLUE : INK_MUTED} fontSize="13" fontWeight="600">Whole-sign mechanism</text>
      <text x="561" y="187" textAnchor="middle" fill={showComparison ? INK_PRIMARY : INK_MUTED} fontSize="17">{showComparison ? house.wholeCarrier : "hidden"}</text>
      <text x="561" y="218" textAnchor="middle" fill={INK_SECONDARY} fontSize="12">{showComparison ? "lordship + occupant picture" : "comparison must be restored"}</text>
      <path d="M327 190 C372 155 388 155 433 190" fill="none" stroke={verdict.color} strokeWidth="4" strokeLinecap="round" />
      <circle cx="380" cy="190" r="22" fill={verdict.color} fillOpacity="0.14" stroke={verdict.color} />
      <text x="380" y="195" textAnchor="middle" fill={verdict.color} fontSize="13" fontWeight="600">vs</text>
      <rect x="118" y="310" width="524" height="72" rx="18" fill={verdict.color} fillOpacity="0.1" stroke={verdict.color} />
      <text x="380" y="338" textAnchor="middle" fill={verdict.color} fontSize="13" fontWeight="600">{verdict.label}</text>
      <text x="380" y="363" textAnchor="middle" fill={INK_SECONDARY} fontSize="12">{house.relation}</text>
      <text x="380" y="425" textAnchor="middle" fill={verdict.color} fontSize="12" fontWeight="600">Synthesis discipline: {score}%</text>
    </svg>
  );
}

function ToggleRow({ title, body, color, value, onToggle }: { title: string; body: string; color: string; value: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} style={toggleStyle(value, color)}>
      <span style={{ display: "grid", gap: "0.15rem", textAlign: "left" }}>
        <span style={{ fontWeight: 600 }}>{title}</span>
        <span style={{ color: INK_MUTED, fontSize: "0.82rem", lineHeight: 1.35 }}>{body}</span>
      </span>
      <span style={{ width: 42, height: 23, borderRadius: 999, border: `1px solid ${value ? color : HAIRLINE}`, background: value ? `${color}24` : SURFACE, padding: 2, display: "flex", justifyContent: value ? "flex-end" : "flex-start", flex: "0 0 auto" }}>
        <span style={{ width: 17, height: 17, borderRadius: 999, background: value ? color : INK_MUTED }} />
      </span>
    </button>
  );
}

const cardStyle: CSSProperties = { border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, boxShadow: "var(--gl-shadow-soft)", padding: "1rem" };
const eyebrowStyle: CSSProperties = { margin: 0, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.72rem", fontWeight: 600 };

function buttonStyle(active: boolean, color: string): CSSProperties {
  return { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 999, background: active ? `${color}18` : SURFACE, color: active ? color : INK_SECONDARY, padding: "0.55rem 0.78rem", cursor: "pointer", fontWeight: 600 };
}

function houseStyle(active: boolean, color: string): CSSProperties {
  return { display: "grid", gap: "0.18rem", textAlign: "left", border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 8, background: active ? `${color}12` : SURFACE, color: active ? color : INK_SECONDARY, padding: "0.72rem", cursor: "pointer" };
}

function toggleStyle(active: boolean, color: string): CSSProperties {
  return { width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 8, background: active ? `${color}10` : SURFACE, color: INK_SECONDARY, padding: "0.72rem", cursor: "pointer" };
}
