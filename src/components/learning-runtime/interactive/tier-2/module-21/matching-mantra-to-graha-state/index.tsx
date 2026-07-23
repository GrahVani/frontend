"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Lock,
  Music,
  RotateCcw,
  Sparkles,
  Unlock,
  Volume2,
  XCircle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle, workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type Direction = "strengthen" | "pacify";
type GrahaKey =
  | "surya"
  | "chandra"
  | "mangala"
  | "budha"
  | "guru"
  | "shukra"
  | "shani"
  | "rahu"
  | "ketu";
type CommitmentKey = "directionFirst" | "namaskaraDefault" | "notOneAtATime";

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
const TEAL = "#2E7A78";

const GRAHAS: Record<GrahaKey, {
  label: string;
  devanagari: string;
  devata: string;
  mantraIAST: string;
  mantraDevanagari: string;
  color: string;
}> = {
  surya: { label: "Sūrya", devanagari: "सूर्य", devata: "Sūrya", mantraIAST: "Oṁ Sūryāya Namaḥ", mantraDevanagari: "ॐ सूर्याय नमः", color: VERMILION },
  chandra: { label: "Candra", devanagari: "चन्द्र", devata: "Candra", mantraIAST: "Oṁ Candrāya Namaḥ", mantraDevanagari: "ॐ चन्द्राय नमः", color: BLUE },
  mangala: { label: "Maṅgala", devanagari: "मङ्गल", devata: "Aṅgāraka", mantraIAST: "Oṁ Aṅgārakāya Namaḥ", mantraDevanagari: "ॐ अङ्गारकाय नमः", color: VERMILION },
  budha: { label: "Budha", devanagari: "बुध", devata: "Budha", mantraIAST: "Oṁ Budhāya Namaḥ", mantraDevanagari: "ॐ बुधाय नमः", color: GREEN },
  guru: { label: "Bṛhaspati", devanagari: "बृहस्पति", devata: "Bṛhaspati", mantraIAST: "Oṁ Bṛhaspataye Namaḥ", mantraDevanagari: "ॐ बृहस्पतये नमः", color: GOLD },
  shukra: { label: "Śukra", devanagari: "शुक्र", devata: "Śukra", mantraIAST: "Oṁ Śukrāya Namaḥ", mantraDevanagari: "ॐ शुक्राय नमः", color: TEAL },
  shani: { label: "Śani", devanagari: "शनि", devata: "Śanaiścara", mantraIAST: "Oṁ Śanaiścarāya Namaḥ", mantraDevanagari: "ॐ शनैश्चराय नमः", color: PURPLE },
  rahu: { label: "Rāhu", devanagari: "राहु", devata: "Rāhu", mantraIAST: "Oṁ Rāhave Namaḥ", mantraDevanagari: "ॐ राहवे नमः", color: PURPLE },
  ketu: { label: "Ketu", devanagari: "केतु", devata: "Ketu", mantraIAST: "Oṁ Ketave Namaḥ", mantraDevanagari: "ॐ केतवे नमः", color: TEAL },
};

const COMMITMENTS: Record<CommitmentKey, { label: string; detail: string }> = {
  directionFirst: {
    label: "Confirm direction before opening the table",
    detail: "Mantra is strengthen-only. A pacify-indicated graha never receives a graha-mantra, no matter how simple the mantra looks.",
  },
  namaskaraDefault: {
    label: "Namaskāra is the safe default, not a lesser form",
    detail: "Deeper bīja forms exist, but they are audio-delivered and require more caution. The simple namaskāra is the prescription default.",
  },
  notOneAtATime: {
    label: "Mantra is not one-at-a-time like ratna",
    detail: "Multiple strengthen-indicated grahas can be matched to their mantras and practiced together, unlike gemstones on the body.",
  },
};

function DirectionGateDiagram({ direction }: { direction: Direction }) {
  const isStrengthen = direction === "strengthen";
  const gateColor = isStrengthen ? GREEN : VERMILION;
  const gateFill = isStrengthen ? "#E8F5E9" : "#FBE9E7";
  const stepFill = "#FDFAF2";

  return (
    <svg width="100%" height="100%" viewBox="0 0 640 160" style={{ maxWidth: 640 }}>
      {/* Graha-state block */}
      <rect x={20} y={40} width={160} height={80} rx={8} fill={stepFill} stroke={HAIRLINE} strokeWidth={2} />
      <text x={100} y={70} fontSize={12} fill={INK_MUTED} fontWeight={600} textAnchor="middle">Graha-state</text>
      <text x={100} y={88} fontSize={11} fill={INK_PRIMARY} fontWeight={600} textAnchor="middle">Functional role</text>
      <text x={100} y={105} fontSize={10} fill={INK_SECONDARY} textAnchor="middle">+ dignity + daśā</text>

      {/* Arrow */}
      <line x1={180} y1={80} x2={240} y2={80} stroke={HAIRLINE} strokeWidth={2} />
      <polygon points="240,80 230,75 230,85" fill={HAIRLINE} />

      {/* Direction gate */}
      <rect x={260} y={30} width={120} height={100} rx={8} fill={gateFill} stroke={gateColor} strokeWidth={2} />
      <text x={320} y={60} fontSize={12} fill={gateColor} fontWeight={600} textAnchor="middle">Direction gate</text>
      <text x={320} y={85} fontSize={11} fill={INK_PRIMARY} fontWeight={600} textAnchor="middle">
        {isStrengthen ? "Strengthen" : "Pacify"}
      </text>
      <text x={320} y={110} fontSize={10} fill={INK_SECONDARY} textAnchor="middle">
        {isStrengthen ? "Table open" : "Table locked"}
      </text>
      {isStrengthen ? (
        <Unlock x={305} y={115} size={18} color={GREEN} />
      ) : (
        <Lock x={305} y={115} size={18} color={VERMILION} />
      )}

      {/* Arrow */}
      <line x1={380} y1={80} x2={440} y2={80} stroke={HAIRLINE} strokeWidth={2} />
      <polygon points="440,80 430,75 430,85" fill={HAIRLINE} />

      {/* Mantra table block */}
      <rect x={460} y={40} width={160} height={80} rx={8} fill={stepFill} stroke={isStrengthen ? GREEN : HAIRLINE} strokeWidth={2} />
      <text x={540} y={70} fontSize={12} fill={INK_MUTED} fontWeight={600} textAnchor="middle">Navagraha table</text>
      <text x={540} y={88} fontSize={11} fill={INK_PRIMARY} fontWeight={600} textAnchor="middle">
        {isStrengthen ? "Match mantra" : "No match"}
      </text>
      <text x={540} y={105} fontSize={10} fill={INK_SECONDARY} textAnchor="middle">
        {isStrengthen ? "Oṁ ...-ya Namaḥ" : "Resonance would amplify harm"}
      </text>
    </svg>
  );
}

function CommitmentToggle({
  held,
  onToggle,
  label,
  detail,
}: {
  held: boolean;
  onToggle: () => void;
  label: string;
  detail: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        ...togglePanelStyle(held, held ? GREEN : VERMILION),
        width: "100%",
        textAlign: "left",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {held ? <CheckCircle2 size={18} color={GREEN} /> : <XCircle size={18} color={VERMILION} />}
        <span style={{ fontWeight: 600, color: INK_PRIMARY }}>{label}</span>
      </span>
      <span style={{ color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5, marginTop: "0.3rem" }}>
        {held ? detail : <span style={{ color: VERMILION }}>Released — discipline gap open.</span>}
      </span>
    </button>
  );
}

export function MatchingMantraToGrahaState() {
  const [direction, setDirection] = useState<Direction>("strengthen");
  const [selectedGraha, setSelectedGraha] = useState<GrahaKey | null>("guru");
  const [commitments, setCommitments] = useState<Record<CommitmentKey, boolean>>({
    directionFirst: true,
    namaskaraDefault: true,
    notOneAtATime: true,
  });

  const selected = selectedGraha ? GRAHAS[selectedGraha] : null;
  const tableLocked = direction !== "strengthen";

  const reset = () => {
    setDirection("strengthen");
    setSelectedGraha("guru");
    setCommitments({ directionFirst: true, namaskaraDefault: true, notOneAtATime: true });
  };

  return (
    <div data-interactive="matching-mantra-to-graha-state" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Matching mantra to graha-state</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              From graha-state to the right namaskāra mantra
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Mantra is a resonance-based category: it amplifies the graha. It is reserved for the strengthen direction, just like ratna.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={{ ...cardStyle, background: "#FAF5E8" }}>
        <p style={eyebrowStyle}>Direction gate</p>
        <div style={workbenchDiagramLayoutStyle}>
          <DirectionGateDiagram direction={direction} />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.75rem" }}>
          <button
            type="button"
            aria-pressed={direction === "strengthen"}
            onClick={() => setDirection("strengthen")}
            style={smallChipStyle(direction === "strengthen", GREEN)}
          >
            <Sparkles size={14} aria-hidden="true" />
            Strengthen
          </button>
          <button
            type="button"
            aria-pressed={direction === "pacify"}
            onClick={() => setDirection("pacify")}
            style={smallChipStyle(direction === "pacify", VERMILION)}
          >
            <AlertTriangle size={14} aria-hidden="true" />
            Pacify
          </button>
        </div>
      </section>

      <div style={workbenchTwoColumnStyle}>
        <section style={{ ...cardStyle, flex: "1 1 360px" }}>
          <p style={eyebrowStyle}>Navagraha namaskāra table</p>
          <p style={{ margin: "0.3rem 0 0.75rem", color: INK_SECONDARY, fontSize: "0.9rem" }}>
            {tableLocked
              ? "Switch to Strengthen to unlock the table."
              : "Select a graha to see its matching mantra."}
          </p>
          <div style={{ display: "grid", gap: "0.55rem" }}>
            {(Object.keys(GRAHAS) as GrahaKey[]).map((key) => {
              const graha = GRAHAS[key];
              const isSelected = selectedGraha === key;
              return (
                <button
                  key={key}
                  type="button"
                  disabled={tableLocked}
                  onClick={() => setSelectedGraha(key)}
                  style={{
                    ...rowStyle,
                    borderColor: isSelected ? graha.color : HAIRLINE,
                    background: isSelected ? `${graha.color}08` : SURFACE,
                    opacity: tableLocked ? 0.55 : 1,
                    cursor: tableLocked ? "not-allowed" : "pointer",
                  }}
                >
                  <span style={{ color: graha.color, fontWeight: 600, minWidth: 90, textAlign: "left" }}>
                    {graha.label}
                  </span>
                  <span style={{ color: INK_SECONDARY, fontSize: "0.85rem" }}>
                    Oṁ {graha.devata}-ya Namaḥ
                  </span>
                  {(key === "rahu" || key === "ketu") && (
                    <span style={{ marginLeft: "auto", color: PURPLE, fontSize: "0.75rem", fontWeight: 600 }}>Caution</span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 320px" }}>
          <div style={cardStyle}>
            <p style={eyebrowStyle}>Selected match</p>
            {selected ? (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <span style={{ color: selected.color, fontSize: "1.6rem", fontWeight: 600 }}>{selected.label}</span>
                  <span style={{ color: INK_MUTED, fontSize: "0.85rem" }}>({selected.devanagari})</span>
                </div>
                <div style={{ border: `1.5px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.85rem", background: "#FAF5E8" }}>
                  <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.75rem", fontWeight: 600 }}>IAST</p>
                  <p style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "1.1rem", fontWeight: 600 }}>{selected.mantraIAST}</p>
                  <p style={{ margin: "0.75rem 0 0", color: INK_MUTED, fontSize: "0.75rem", fontWeight: 600 }}>Devanāgarī</p>
                  <p style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "1.25rem" }}>{selected.mantraDevanagari}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.75rem", color: INK_MUTED, fontSize: "0.85rem" }}>
                  <Volume2 size={16} aria-hidden="true" />
                  Deeper bīja forms exist but are audio-delivered, not transcribed inline.
                </div>
              </div>
            ) : (
              <p style={{ color: INK_SECONDARY }}>Select a graha from the table to see its mantra.</p>
            )}
          </div>

          <div style={cardStyle}>
            <p style={eyebrowStyle}>Rohan&apos;s case</p>
            <p style={{ margin: "0.3rem 0 0.75rem", color: INK_SECONDARY, fontSize: "0.9rem" }}>
              Jupiter is strengthen-indicated. Load the match.
            </p>
            <button
              type="button"
              onClick={() => { setDirection("strengthen"); setSelectedGraha("guru"); }}
              style={buttonStyle(false, GOLD)}
            >
              <Music size={15} aria-hidden="true" />
              Load Rohan&apos;s Guru mantra
            </button>
            {selectedGraha === "guru" && direction === "strengthen" && (
              <p style={{ margin: "0.75rem 0 0", color: GREEN, fontSize: "0.85rem" }}>
                <CheckCircle2 size={14} style={{ verticalAlign: "middle", marginRight: 4 }} aria-hidden="true" />
                Match confirmed: Oṁ Bṛhaspataye Namaḥ.
              </p>
            )}
          </div>

          <div style={{ ...cardStyle, borderColor: PURPLE, background: `${PURPLE}08` }}>
            <p style={eyebrowStyle}>Rāhu / Ketu caution</p>
            <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, fontSize: "0.9rem", lineHeight: 1.55 }}>
              The simple namaskāra forms are open and safe. Beyond this level, Rāhu and Ketu remedial practice draws more heavily on the tantric stream; refer to a qualified teacher rather than intensifying independently.
            </p>
            {selected && (selectedGraha === "rahu" || selectedGraha === "ketu") && (
              <p style={{ margin: "0.75rem 0 0", color: PURPLE, fontSize: "0.85rem", fontWeight: 600 }}>
                <AlertTriangle size={14} style={{ verticalAlign: "middle", marginRight: 4 }} aria-hidden="true" />
                {selected.label} selected — extra caution applies.
              </p>
            )}
          </div>

          <div style={cardStyle}>
            <p style={eyebrowStyle}>Mantra vs ratna</p>
            <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, fontSize: "0.9rem", lineHeight: 1.55 }}>
              Unlike gemstones, multiple graha-mantras can be practiced together. There is no one-item-at-a-time body constraint.
            </p>
          </div>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Discipline commitments</p>
        <p style={{ margin: "0.3rem 0 0.75rem", color: INK_SECONDARY, fontSize: "0.9rem" }}>
          Hold these three guards while matching mantras to graha-states.
        </p>
        <div style={{ display: "grid", gap: "0.65rem" }}>
          {(Object.keys(COMMITMENTS) as CommitmentKey[]).map((key) => (
            <CommitmentToggle
              key={key}
              held={commitments[key]}
              onToggle={() => setCommitments((prev) => ({ ...prev, [key]: !prev[key] }))}
              label={COMMITMENTS[key].label}
              detail={COMMITMENTS[key].detail}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

const cardStyle: CSSProperties = {
  background: "var(--gl-card-surface-solid)",
  border: "1.5px solid var(--gl-gold-hairline)",
  borderRadius: 8,
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontSize: "0.72rem",
  fontWeight: 700,
  color: "var(--gl-gold-accent)",
  margin: 0,
};

const buttonStyle = (active: boolean, color: string): CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.4rem",
  padding: "0.45rem 0.75rem",
  borderRadius: 8,
  border: `1.5px solid ${active ? color : HAIRLINE}`,
  background: active ? `${color}15` : "transparent",
  color: active ? color : INK_PRIMARY,
  fontWeight: 600,
  cursor: "pointer",
  fontSize: "0.85rem",
});

const smallChipStyle = (active: boolean, color: string): CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.35rem",
  padding: "0.4rem 0.65rem",
  borderRadius: 8,
  border: `1.5px solid ${active ? color : HAIRLINE}`,
  background: active ? `${color}15` : "transparent",
  color: active ? color : INK_PRIMARY,
  fontWeight: 600,
  cursor: "pointer",
  fontSize: "0.82rem",
});

const rowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  padding: "0.65rem 0.75rem",
  borderRadius: 8,
  border: `1.5px solid ${HAIRLINE}`,
  background: "var(--gl-card-surface-solid)",
  textAlign: "left",
};

const togglePanelStyle = (active: boolean, color: string): CSSProperties => ({
  display: "flex",
  flexDirection: "column",
  gap: "0.2rem",
  padding: "0.75rem",
  borderRadius: 8,
  border: `1.5px solid ${active ? color : HAIRLINE}`,
  background: active ? `${color}08` : "transparent",
  cursor: "pointer",
});

MatchingMantraToGrahaState.displayName = "MatchingMantraToGrahaState";
