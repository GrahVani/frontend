"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  Award,
  Eye,
  Layers,
  MapPinned,
  RotateCcw,
  Scale,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

const RASHI_NAMES = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

const RASHI_SHORT = [
  "Ar",
  "Ta",
  "Ge",
  "Ca",
  "Le",
  "Vi",
  "Li",
  "Sc",
  "Sg",
  "Cp",
  "Aq",
  "Pi",
];

const SIGN_LORDS = [
  "Mars",
  "Venus",
  "Mercury",
  "Moon",
  "Sun",
  "Mercury",
  "Venus",
  "Mars",
  "Jupiter",
  "Saturn",
  "Saturn",
  "Jupiter",
];

const PLANET_GLYPHS: Record<string, string> = {
  Sun: "Su",
  Moon: "Mo",
  Mercury: "Me",
  Venus: "Ve",
  Mars: "Ma",
  Jupiter: "Ju",
  Saturn: "Sa",
  Rahu: "Ra",
  Ketu: "Ke",
};

const HOUSE_THEMES: Record<number, string> = {
  1: "Self & identity: personal beginnings, vitality, and physical focus.",
  2: "Speech & finance: resources, family, and vocal expression.",
  3: "Efforts & siblings: courage, communications, and short journeys.",
  4: "Home & emotion: domestic environment and inner happiness.",
  5: "Intellect & children: creativity, scholarship, and progeny.",
  6: "Service & discipline: healing, challenges, routine, and debt management.",
  7: "Relationship & partnership: legal bonds and public contracts.",  8: "Depth & transformation: research, major changes, and longevity awareness.",
  9: "Higher wisdom & dharma: philosophy, mentorship, and righteous action.",
  10: "Career & action: professional responsibilities and public visibility.",
  11: "Gains & aspirations: goals, secondary income, and supportive networks.",
  12: "Retreat & charity: solitude, contemplation, letting go, and distant connections.",
};

interface ChartPoint {
  id: string;
  name: string;
  longitude: number;
}

interface ChartSet {
  label: string;
  natalLagnaIndex: number;
  varshaLagnaIndex: number;
  natalPoints: ChartPoint[];
  yearPoints: ChartPoint[];
}

const KAVYA_YEAR_30: ChartSet = {
  label: "Kavya — year 30",
  natalLagnaIndex: 3, // Cancer
  varshaLagnaIndex: 9, // Capricorn
  natalPoints: [
    { id: "su", name: "Sun", longitude: 125 },
    { id: "mo", name: "Moon", longitude: 245 },
    { id: "me", name: "Mercury", longitude: 105 },
    { id: "ve", name: "Venus", longitude: 115 },
    { id: "ma", name: "Mars", longitude: 210 },
    { id: "ju", name: "Jupiter", longitude: 35 },
    { id: "sa", name: "Saturn", longitude: 300 },
    { id: "ra", name: "Rahu", longitude: 85 },
    { id: "ke", name: "Ketu", longitude: 265 },
  ],
  yearPoints: [
    { id: "ju", name: "Jupiter", longitude: 350 },
    { id: "sa", name: "Saturn", longitude: 302 },
    { id: "mo", name: "Moon", longitude: 15 },
    { id: "ma", name: "Mars", longitude: 200 },
    { id: "su", name: "Sun", longitude: 110 },
    { id: "me", name: "Mercury", longitude: 118 },
    { id: "ve", name: "Venus", longitude: 95 },
    { id: "ra", name: "Rahu", longitude: 80 },
    { id: "ke", name: "Ketu", longitude: 260 },
  ],
};

const DIGNITY_DATA: Record<string, { own: number[]; exalt: number; debil: number }> = {
  Sun: { own: [4], exalt: 0, debil: 6 },
  Moon: { own: [3], exalt: 1, debil: 7 },
  Mercury: { own: [2, 5], exalt: 5, debil: 11 },
  Venus: { own: [1, 6], exalt: 11, debil: 5 },
  Mars: { own: [0, 7], exalt: 9, debil: 3 },
  Jupiter: { own: [8, 11], exalt: 3, debil: 9 },
  Saturn: { own: [9, 10], exalt: 6, debil: 0 },
  Rahu: { own: [], exalt: 5, debil: 11 },
  Ketu: { own: [], exalt: 11, debil: 5 },
};

function normalizeDeg(deg: number): number {
  let v = deg % 360;
  if (v < 0) v += 360;
  return v;
}

function signIndex(deg: number): number {
  return Math.floor(normalizeDeg(deg) / 30) % 12;
}

function formatDms(deg: number): string {
  const normalized = normalizeDeg(deg);
  const inSign = normalized % 30;
  const d = Math.floor(inSign);
  const m = Math.floor((inSign - d) * 60);
  const s = Math.round(((inSign - d) * 60 - m) * 60);
  return `${d}° ${m.toString().padStart(2, "0")}′ ${s.toString().padStart(2, "0")}″`;
}

function munthaHouse(yearN: number): number {
  if (yearN <= 0) return 1;
  return ((yearN - 1) % 12) + 1;
}

function classifyDignity(planet: string, sign: number): { label: string; color: string; description: string } {
  const data = DIGNITY_DATA[planet];
  if (!data) return { label: "Neutral", color: INK_MUTED, description: "No strong dignity classification in this simplified model." };
  if (data.own.includes(sign)) {
    return { label: "Own sign", color: GREEN, description: "The planet is in one of its own signs; it has steady resources to carry the theme." };
  }
  if (data.exalt === sign) {
    return { label: "Exalted", color: GREEN, description: "The planet is exalted; its supportive capacity is heightened." };
  }
  if (data.debil === sign) {
    return { label: "Debilitated", color: VERMILION, description: "The planet is debilitated; support for the theme is strained." };
  }
  return { label: "Neutral", color: INK_MUTED, description: "The planet is in a sign where it is neither especially strong nor weak." };
}

function clampInt(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

export function MunthaHouseEmphasisWorkbench() {
  const [yearN, setYearN] = useState<number>(30);
  const [showNatalLayer, setShowNatalLayer] = useState<boolean>(true);
  const [showLordLayer, setShowLordLayer] = useState<boolean>(true);
  const [chartSet, setChartSet] = useState<ChartSet>(KAVYA_YEAR_30);
  const [customLagna, setCustomLagna] = useState<number>(KAVYA_YEAR_30.natalLagnaIndex);
  const [customYearLagna, setCustomYearLagna] = useState<number>(KAVYA_YEAR_30.varshaLagnaIndex);

  const isCustom = false; // reserved for future custom mode; Kavya preset only for now

  const natalLagnaIndex = isCustom ? customLagna : chartSet.natalLagnaIndex;
  const varshaLagnaIndex = isCustom ? customYearLagna : chartSet.varshaLagnaIndex;
  const natalPoints = chartSet.natalPoints;
  const yearPoints = chartSet.yearPoints;

  const munthaHouseNum = munthaHouse(yearN);
  const munthaSignIndex = (natalLagnaIndex + munthaHouseNum - 1 + 12) % 12;
  const munthaLord = SIGN_LORDS[munthaSignIndex];

  const natalOccupants = useMemo(
    () => natalPoints.filter((pt) => signIndex(pt.longitude) === munthaSignIndex),
    [natalPoints, munthaSignIndex]
  );

  const lordYearPoint = useMemo(
    () => yearPoints.find((pt) => pt.name === munthaLord),
    [yearPoints, munthaLord]
  );

  const lordSignIndex = lordYearPoint ? signIndex(lordYearPoint.longitude) : -1;
  const lordHouseFromVarsha = lordSignIndex >= 0 ? (lordSignIndex - varshaLagnaIndex + 12) % 12 + 1 : 0;
  const lordDignity = lordYearPoint ? classifyDignity(munthaLord, lordSignIndex) : null;

  const isDifficultHouse = [6, 8, 12].includes(munthaHouseNum);

  const convergenceFactors = useMemo(() => {
    const factors: Array<{ label: string; color: string }> = [
      { label: `House ${munthaHouseNum} theme`, color: GOLD },
    ];
    if (showNatalLayer) {
      if (natalOccupants.length > 0) {
        factors.push({ label: "Natal reinforcement", color: BLUE });
      } else {
        factors.push({ label: "Natally empty", color: INK_MUTED });
      }
    }
    if (showLordLayer && lordDignity) {
      if (lordDignity.label === "Own sign" || lordDignity.label === "Exalted") {
        factors.push({ label: "Well-dignified lord", color: GREEN });
      } else if (lordDignity.label === "Debilitated") {
        factors.push({ label: "Strained lord", color: VERMILION });
      } else {
        factors.push({ label: "Neutral lord", color: INK_MUTED });
      }
    }
    if (isDifficultHouse) {
      factors.push({ label: "Non-fatal framing", color: PURPLE });
    }
    return factors;
  }, [munthaHouseNum, showNatalLayer, showLordLayer, natalOccupants.length, lordDignity, isDifficultHouse]);

  const reset = () => {
    setYearN(30);
    setShowNatalLayer(true);
    setShowLordLayer(true);
    setChartSet(KAVYA_YEAR_30);
    setCustomLagna(KAVYA_YEAR_30.natalLagnaIndex);
    setCustomYearLagna(KAVYA_YEAR_30.varshaLagnaIndex);
  };

  return (
    <div data-interactive="muntha-house-emphasis-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      {/* Header */}
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Munthā house emphasis</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Read the yearly life-domain foreground in layers
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              The munthā-house gives the year&apos;s domain-theme. Cross-reference it against natal occupants,
              then read the munthā-lord&apos;s own dignity and placement in this year&apos;s chart. Neither layer overrides the theme; both modulate it.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      {/* Controls */}
      <section style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "end" }}>
          <label style={{ ...fieldStyle, flex: "1 1 220px" }}>
            <span style={fieldLabelStyle}>Year N</span>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <input
                type="range"
                min={1}
                max={60}
                value={yearN}
                onChange={(e) => setYearN(clampInt(parseInt(e.target.value, 10), 1, 60))}
                style={{ flex: 1, accentColor: GOLD }}
              />
              <span style={{ fontWeight: 600, color: GOLD, minWidth: "3.5rem", textAlign: "right" }}>N = {yearN}</span>
            </div>
          </label>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            <button
              type="button"
              aria-pressed={showNatalLayer}
              onClick={() => setShowNatalLayer((v) => !v)}
              style={smallChipStyle(showNatalLayer, BLUE)}
            >
              <Layers size={14} />
              Natal cross-reference
            </button>
            <button
              type="button"
              aria-pressed={showLordLayer}
              onClick={() => setShowLordLayer((v) => !v)}
              style={smallChipStyle(showLordLayer, GREEN)}
            >
              <Scale size={14} />
              Munthā-lord condition
            </button>
          </div>
        </div>
      </section>

      {/* Diagram + summary */}
      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap", marginBottom: "0.5rem" }}>
            <div>
              <p style={eyebrowStyle}>Natal zodiac map</p>
              <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.2rem", fontWeight: 600 }}>
                Munthā in {RASHI_NAMES[munthaSignIndex]} (House {munthaHouseNum})
              </h3>
            </div>
            <strong style={{ color: isDifficultHouse ? VERMILION : INK_MUTED, fontWeight: 600, fontSize: "0.85rem" }}>
              Lagna = {RASHI_NAMES[natalLagnaIndex]}
            </strong>
          </div>
          <NatalZodiacSvg
            natalLagnaIndex={natalLagnaIndex}
            munthaSignIndex={munthaSignIndex}
            natalPoints={natalPoints}
            showNatalLayer={showNatalLayer}
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))", gap: "0.65rem", marginTop: "0.75rem" }}>
            <MiniFact icon={<MapPinned size={16} />} title="Munthā house" body={`House ${munthaHouseNum}`} color={GOLD} />
            <MiniFact icon={<Sparkles size={16} />} title="Munthā sign" body={RASHI_NAMES[munthaSignIndex]} color={GOLD} />
            <MiniFact icon={<Scale size={16} />} title="Munthā lord" body={munthaLord} color={GOLD} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Base house theme" icon={<Eye size={18} />} color={GOLD}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
              {HOUSE_THEMES[munthaHouseNum]}
            </p>
          </Panel>

          <Panel title="Layer switches" icon={<Layers size={18} />} color={BLUE}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>
              Toggle the two analytical layers T1-19&apos;s concept treatment could not reach.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.75rem" }}>
              <button type="button" aria-pressed={showNatalLayer} onClick={() => setShowNatalLayer((v) => !v)} style={smallChipStyle(showNatalLayer, BLUE)}>
                Natal
              </button>
              <button type="button" aria-pressed={showLordLayer} onClick={() => setShowLordLayer((v) => !v)} style={smallChipStyle(showLordLayer, GREEN)}>
                Lord condition
              </button>
            </div>
          </Panel>
        </section>
      </div>

      {/* Layer cards */}
      <div style={workbenchTwoColumnStyle}>
        <section style={{ ...cardStyle, borderColor: showNatalLayer ? `${BLUE}66` : HAIRLINE, background: showNatalLayer ? `${BLUE}0A` : SURFACE }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <Layers size={18} color={BLUE} />
            <p style={{ ...eyebrowStyle, margin: 0, color: BLUE }}>Natal cross-reference</p>
          </div>
          <h3 style={{ margin: "0 0 0.5rem", color: showNatalLayer ? BLUE : INK_MUTED, fontSize: "1.1rem", fontWeight: 600 }}>
            {RASHI_NAMES[munthaSignIndex]} in the natal chart
          </h3>
          {showNatalLayer ? (
            natalOccupants.length > 0 ? (
              <>
                <p style={{ margin: "0 0 0.75rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
                  This munthā-sign is <strong style={{ fontWeight: 600, color: INK_PRIMARY }}>not natally empty</strong>. The following planets already occupy it, giving the year-theme pre-existing weight.
                </p>
                <div style={{ display: "grid", gap: "0.5rem" }}>
                  {natalOccupants.map((pt) => (
                    <div key={pt.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.55rem 0.7rem", border: `1px solid ${HAIRLINE}`, borderRadius: 6, background: SURFACE }}>
                      <span style={{ fontWeight: 600, color: INK_PRIMARY }}>{pt.name}</span>
                      <span style={{ color: INK_MUTED, fontSize: "0.85rem" }}>{formatDms(pt.longitude)} {RASHI_NAMES[signIndex(pt.longitude)]}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
                This munthā-sign is <strong style={{ fontWeight: 600, color: INK_PRIMARY }}>natally empty</strong>. The year-theme is therefore a more purely transient foreground shift, without pre-existing natal reinforcement.
              </p>
            )
          ) : (
            <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.85rem" }}>Turn on the natal layer to see occupants.</p>
          )}
        </section>

        <section style={{ ...cardStyle, borderColor: showLordLayer ? `${GREEN}66` : HAIRLINE, background: showLordLayer ? `${GREEN}0A` : SURFACE }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <Scale size={18} color={GREEN} />
            <p style={{ ...eyebrowStyle, margin: 0, color: GREEN }}>Munthā-lord condition</p>
          </div>
          {showLordLayer && lordYearPoint ? (
            <>
              <h3 style={{ margin: "0 0 0.5rem", color: lordDignity?.color ?? GREEN, fontSize: "1.1rem", fontWeight: 600 }}>
                {munthaLord} in {RASHI_NAMES[lordSignIndex]} — {lordDignity?.label}
              </h3>
              <div style={{ display: "grid", gap: "0.5rem" }}>
                <MiniFact icon={<MapPinned size={14} />} title="Year chart house" body={`House ${lordHouseFromVarsha} from varṣa-Lagna`} color={GREEN} />
                <MiniFact icon={<Sparkles size={14} />} title="Dignity reading" body={lordDignity?.description ?? ""} color={lordDignity?.color ?? GREEN} />
              </div>
            </>
          ) : (
            <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.85rem" }}>Turn on the lord-condition layer to see how {munthaLord} is placed this year.</p>
          )}
        </section>
      </div>

      {/* Convergence + non-fatalism */}
      <section style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.65rem" }}>
          <Award size={18} color={GOLD} />
          <p style={{ ...eyebrowStyle, margin: 0 }}>Convergence tally</p>
        </div>
        <p style={{ margin: "0 0 0.75rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
          Count independent factors that point the same direction. This is not a numeric score — it is a checklist against over-reading or under-reading the year.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {convergenceFactors.map((f) => (
            <span
              key={f.label}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.4rem 0.7rem",
                borderRadius: 999,
                border: `1px solid ${f.color}`,
                background: `${f.color}12`,
                color: f.color,
                fontWeight: 600,
                fontSize: "0.82rem",
              }}
            >
              <Sparkles size={13} />
              {f.label}
            </span>
          ))}
        </div>
      </section>

      {isDifficultHouse && (
        <section style={{ ...cardStyle, borderColor: `${PURPLE}66`, background: `${PURPLE}0A` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ShieldAlert size={18} color={PURPLE} />
            <p style={{ margin: 0, color: PURPLE, fontWeight: 600 }}>
              Non-fatalism reminder: House {munthaHouseNum} is a difficult-house foreground, not a warning sign. The practitioner frames it as a domain to engage constructively.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

function NatalZodiacSvg({
  natalLagnaIndex,
  munthaSignIndex,
  natalPoints,
  showNatalLayer,
}: {
  natalLagnaIndex: number;
  munthaSignIndex: number;
  natalPoints: ChartPoint[];
  showNatalLayer: boolean;
}) {
  const cellWidth = 54;
  const gap = 4;
  const startX = 16;
  const y = 20;
  const height = 90;

  return (
    <svg viewBox={`0 0 ${startX * 2 + 12 * cellWidth + 11 * gap} 150`} role="img" aria-label="Natal zodiac strip with muntha sign highlighted" style={{ width: "100%", maxHeight: 260, display: "block" }}>
      {RASHI_SHORT.map((short, idx) => {
        const x = startX + idx * (cellWidth + gap);
        const isMuntha = idx === munthaSignIndex;
        const isLagna = idx === natalLagnaIndex;
        const fill = isMuntha ? `${GOLD}22` : isLagna ? `${BLUE}14` : "transparent";
        const stroke = isMuntha ? GOLD : isLagna ? BLUE : HAIRLINE;
        const occupants = showNatalLayer ? natalPoints.filter((pt) => signIndex(pt.longitude) === idx) : [];

        return (
          <g key={short}>
            <rect x={x} y={y} width={cellWidth} height={height} rx={6} fill={fill} stroke={stroke} strokeWidth={isMuntha ? 2.5 : 1.2} />
            <text x={x + cellWidth / 2} y={y + 18} textAnchor="middle" fill={isMuntha ? GOLD : INK_MUTED} fontSize="11" fontWeight={isMuntha ? 700 : 500}>
              {idx + 1}
            </text>
            <text x={x + cellWidth / 2} y={y + 34} textAnchor="middle" fill={isMuntha ? GOLD_DEEP : INK_PRIMARY} fontSize="10" fontWeight={isMuntha ? 700 : 500}>
              {short}
            </text>
            {isLagna && (
              <text x={x + cellWidth / 2} y={y + 48} textAnchor="middle" fill={BLUE} fontSize="8" fontWeight={600}>
                LAGNA
              </text>
            )}
            {isMuntha && (
              <text x={x + cellWidth / 2} y={y + (isLagna ? 60 : 48)} textAnchor="middle" fill={GOLD_DEEP} fontSize="8" fontWeight={700}>
                MUNTHA
              </text>
            )}
            {occupants.map((pt, i) => {
              const cx = x + cellWidth / 2;
              const cy = y + height - 16 - i * 14;
              return (
                <g key={pt.id}>
                  <circle cx={cx} cy={cy} r={6} fill={GOLD} />
                  <text x={cx} y={cy + 3} textAnchor="middle" fill="#fff" fontSize="7" fontWeight={600}>
                    {PLANET_GLYPHS[pt.name]}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
      <text x={startX + (12 * cellWidth + 11 * gap) / 2} y={138} textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight={600}>
        Signs are numbered 1–12 from Aries. Munthā sign = {RASHI_NAMES[munthaSignIndex]}.
      </text>
    </svg>
  );
}

const GOLD_DEEP = "#7A5E1E";

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 600 }}>
        {icon}
        {title}
      </div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0F`, padding: "0.7rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color, fontWeight: 600 }}>
        {icon}
        {title}
      </div>
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
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 999,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.4rem 0.65rem",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "0.82rem",
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

const fieldStyle: CSSProperties = {
  display: "grid",
  gap: "0.3rem",
};

const fieldLabelStyle: CSSProperties = {
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
