"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  ArrowLeftRight,
  Eye,
  EyeOff,
  House,
  Info,
  LayoutList,
  RotateCcw,
  Scale,
  Sparkles,
  XCircle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

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
const SAFFRON = "#C78D26";

const SIGNS = [
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
] as const;

type Sign = (typeof SIGNS)[number];
type HouseNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type PlanetKey = "sun" | "moon" | "mercury" | "venus" | "mars" | "jupiter" | "saturn";
type Dignity = "own" | "exalted" | "friendly" | "neutral" | "debilitated";

const LORDS: Record<Sign, string> = {
  Aries: "Mars",
  Taurus: "Venus",
  Gemini: "Mercury",
  Cancer: "Moon",
  Leo: "Sun",
  Virgo: "Mercury",
  Libra: "Venus",
  Scorpio: "Mars",
  Sagittarius: "Jupiter",
  Capricorn: "Saturn",
  Aquarius: "Saturn",
  Pisces: "Jupiter",
};

const LORD_TO_PLANET: Record<string, PlanetKey> = {
  Mars: "mars",
  Venus: "venus",
  Mercury: "mercury",
  Moon: "moon",
  Sun: "sun",
  Jupiter: "jupiter",
  Saturn: "saturn",
};

const PLANET_META: Record<PlanetKey, { label: string; short: string; color: string; nature: "benefic" | "malefic" | "neutral" }> = {
  sun: { label: "Sun", short: "Su", color: SAFFRON, nature: "malefic" },
  moon: { label: "Moon", short: "Mo", color: BLUE, nature: "benefic" },
  mercury: { label: "Mercury", short: "Me", color: GREEN, nature: "neutral" },
  venus: { label: "Venus", short: "Ve", color: BLUE, nature: "benefic" },
  mars: { label: "Mars", short: "Ma", color: VERMILION, nature: "malefic" },
  jupiter: { label: "Jupiter", short: "Ju", color: GOLD, nature: "benefic" },
  saturn: { label: "Saturn", short: "Sa", color: PURPLE, nature: "malefic" },
};

const DIGNITY_META: Record<Dignity, { label: string; color: string; strong: boolean }> = {
  own: { label: "Own sign", color: GREEN, strong: true },
  exalted: { label: "Exalted", color: GREEN, strong: true },
  friendly: { label: "Friendly", color: BLUE, strong: false },
  neutral: { label: "Neutral", color: INK_MUTED, strong: false },
  debilitated: { label: "Debilitated", color: VERMILION, strong: false },
};

interface PlanetPlacement {
  planet: PlanetKey;
  sign: Sign;
  degree?: number;
  dignity: Dignity;
}

const ANANYA_CHART: { lagna: Sign; placements: PlanetPlacement[] } = {
  lagna: "Virgo",
  placements: [
    { planet: "jupiter", sign: "Cancer", degree: 15, dignity: "exalted" },
    { planet: "moon", sign: "Virgo", dignity: "neutral" },
    { planet: "venus", sign: "Taurus", degree: 2, dignity: "own" },
    { planet: "sun", sign: "Taurus", dignity: "neutral" },
    { planet: "mercury", sign: "Taurus", dignity: "friendly" },
  ],
};

function signIndex(sign: Sign): number {
  return SIGNS.indexOf(sign);
}

function houseFromLagna(sign: Sign, lagna: Sign): HouseNumber {
  return (((signIndex(sign) - signIndex(lagna) + 12) % 12) + 1) as HouseNumber;
}

function houseSign(lagna: Sign, house: HouseNumber): Sign {
  return SIGNS[(signIndex(lagna) + house - 1) % 12];
}

function planetInHouse(placement: PlanetPlacement, lagna: Sign): HouseNumber {
  return houseFromLagna(placement.sign, lagna);
}

function jupiterAspectTargets(fromSign: Sign): Sign[] {
  const ix = signIndex(fromSign);
  return [
    SIGNS[(ix + 4) % 12],
    SIGNS[(ix + 6) % 12],
    SIGNS[(ix + 8) % 12],
  ];
}

function aspectFromPlanetToHouse(planet: PlanetKey, fromSign: Sign, targetHouseSign: Sign): boolean {
  if (planet === "jupiter") {
    return jupiterAspectTargets(fromSign).includes(targetHouseSign);
  }
  return SIGNS[(signIndex(fromSign) + 6) % 12] === targetHouseSign;
}

export function FinancialHouseEmphasisWorkbench() {
  const [lagna, setLagna] = useState<Sign>(ANANYA_CHART.lagna);
  const [placements, setPlacements] = useState<PlanetPlacement[]>(ANANYA_CHART.placements);
  const [showAspects, setShowAspects] = useState(true);
  const [showBlendMistake, setShowBlendMistake] = useState(false);
  const [showEmptyMistake, setShowEmptyMistake] = useState(false);
  const [activeHouse, setActiveHouse] = useState<"second" | "eleventh" | "both">("both");

  const secondSign = houseSign(lagna, 2);
  const eleventhSign = houseSign(lagna, 11);
  const secondLord = LORDS[secondSign];
  const eleventhLord = LORDS[eleventhSign];

  const secondLordPlacement = placements.find((p) => p.planet === LORD_TO_PLANET[secondLord]);
  const eleventhLordPlacement = placements.find((p) => p.planet === LORD_TO_PLANET[eleventhLord]);

  const secondOccupants = placements.filter((p) => planetInHouse(p, lagna) === 2);
  const eleventhOccupants = placements.filter((p) => planetInHouse(p, lagna) === 11);

  const jupiterPlacement = placements.find((p) => p.planet === "jupiter");

  const jupiterAspectsSecond = jupiterPlacement
    ? jupiterAspectTargets(jupiterPlacement.sign).includes(secondSign)
    : false;
  const jupiterAspectsEleventh = jupiterPlacement
    ? jupiterAspectTargets(jupiterPlacement.sign).includes(eleventhSign)
    : false;
  const jupiterAspectsSecondLord = secondLordPlacement
    ? aspectFromPlanetToHouse("jupiter", jupiterPlacement!.sign, secondLordPlacement.sign)
    : false;
  const jupiterAspectsEleventhLord = eleventhLordPlacement
    ? aspectFromPlanetToHouse("jupiter", jupiterPlacement!.sign, eleventhLordPlacement.sign)
    : false;

  const secondVerdict = useMemo(() => {
    if (showEmptyMistake && secondOccupants.length === 0) {
      return {
        label: "Mistake: unoccupied = afflicted",
        color: VERMILION,
        note: "This is wrong. An empty house is not automatically weak; check the lord and aspects.",
      };
    }
    const lordStrong = secondLordPlacement ? DIGNITY_META[secondLordPlacement.dignity].strong : false;
    const lordInOwnHouse = secondLordPlacement && planetInHouse(secondLordPlacement, lagna) === 2;
    const hasOccupant = secondOccupants.length > 0;
    const hasJupiterAspect = jupiterAspectsSecond || jupiterAspectsSecondLord;

    if (lordStrong && (lordInOwnHouse || hasOccupant || hasJupiterAspect)) {
      return {
        label: "Direct reservoir signal",
        color: GREEN,
        note: "The 2nd lord is strong and connected to its own house.",
      };
    }
    if (lordStrong) {
      return {
        label: "Quieter indirect reservoir signal",
        color: GOLD,
        note: "The 2nd lord is dignified but not placed in or aspecting its own house.",
      };
    }
    return {
      label: "Weak reservoir signal",
      color: VERMILION,
      note: "The 2nd lord is not strongly placed.",
    };
  }, [jupiterAspectsSecond, jupiterAspectsSecondLord, lagna, secondLordPlacement, secondOccupants.length, showEmptyMistake]);

  const eleventhVerdict = useMemo(() => {
    const lordAngular = eleventhLordPlacement && [1, 4, 7, 10].includes(planetInHouse(eleventhLordPlacement, lagna));
    const hasExaltedOccupant = eleventhOccupants.some((p) => p.dignity === "exalted");
    const hasJupiterAspect = jupiterAspectsEleventh || jupiterAspectsEleventhLord;

    if (hasExaltedOccupant || (lordAngular && (eleventhOccupants.length > 0 || hasJupiterAspect))) {
      return {
        label: "Strong direct inflow signal",
        color: GREEN,
        note: "The 11th shows strong upachaya/inflow support for a new venture.",
      };
    }
    if (lordAngular || eleventhOccupants.length > 0) {
      return {
        label: "Moderate inflow signal",
        color: BLUE,
        note: "The 11th has support but not the strongest possible signal.",
      };
    }
    return {
      label: "Quieter inflow signal",
      color: GOLD,
      note: "The 11th is not directly occupied or strongly reinforced.",
    };
  }, [eleventhLordPlacement, eleventhOccupants, jupiterAspectsEleventh, jupiterAspectsEleventhLord, lagna]);

  const synthesis = useMemo(() => {
    const second = `2nd house (${secondSign}, reservoir): ${secondVerdict.label.toLowerCase()}.`;
    const eleventh = `11th house (${eleventhSign}, inflow/upachaya): ${eleventhVerdict.label.toLowerCase()}.`;
    const asymmetry =
      eleventhVerdict.color === GREEN && secondVerdict.color !== GREEN
        ? "The launch moment shows a stronger direct inflow signal than reservoir signal. This is a plausible fit for a brand-new venture, whose reservoir does not yet exist."
        : secondVerdict.color === GREEN && eleventhVerdict.color !== GREEN
          ? "The launch moment shows a stronger reservoir signal than inflow signal."
          : "The two houses are broadly aligned.";
    const blendWarning = showBlendMistake
      ? " Mistake shown: collapsing these two distinct signals into one blended verdict would lose information."
      : " Both findings are reported separately; they are not averaged into a single wealth score.";
    return `${second} ${eleventh} ${asymmetry}${blendWarning}`;
  }, [eleventhSign, eleventhVerdict, secondSign, secondVerdict, showBlendMistake]);

  function loadAnanya() {
    setLagna(ANANYA_CHART.lagna);
    setPlacements(ANANYA_CHART.placements);
    setShowAspects(true);
    setShowBlendMistake(false);
    setShowEmptyMistake(false);
    setActiveHouse("both");
  }

  function reset() {
    loadAnanya();
  }

  return (
    <div data-interactive="financial-house-emphasis-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Financial-house emphasis at the launch moment</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.25rem", fontWeight: 600 }}>
              Compare the launch-moment&apos;s own 2nd and 11th houses side by side
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              The 2nd house is the reservoir (what is held); the 11th is the inflow (what is gained). Check lord, occupant, and aspect for each house separately — no blended wealth score.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
        <div
          style={{
            marginTop: "0.65rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            padding: "0.25rem 0.5rem",
            borderRadius: 4,
            background: `${BLUE}10`,
            color: BLUE,
            fontSize: "0.72rem",
            fontWeight: 500,
          }}
        >
          <Info size={10} />
          Scope note: this reads the launch-moment chart, not the founder&apos;s natal chart.
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "1 1 340px", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
            <p style={eyebrowStyle}>Launch-moment chart</p>
            <div style={{ display: "flex", gap: "0.35rem" }}>
              <button
                type="button"
                aria-pressed={activeHouse === "second"}
                onClick={() => setActiveHouse(activeHouse === "second" ? "both" : "second")}
                style={smallChipStyle(activeHouse === "second", BLUE)}
              >
                2nd
              </button>
              <button
                type="button"
                aria-pressed={activeHouse === "eleventh"}
                onClick={() => setActiveHouse(activeHouse === "eleventh" ? "both" : "eleventh")}
                style={smallChipStyle(activeHouse === "eleventh", GREEN)}
              >
                11th
              </button>
            </div>
          </div>
          <ChartSvg
            lagna={lagna}
            placements={placements}
            showAspects={showAspects}
            highlightSecond={activeHouse === "second" || activeHouse === "both"}
            highlightEleventh={activeHouse === "eleventh" || activeHouse === "both"}
          />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
            <LegendDot color={PURPLE} label="Lagna" />
            <LegendDot color={BLUE} label="2nd house" />
            <LegendDot color={GREEN} label="11th house" />
            <LegendDot color={GOLD} label="Jupiter aspect" />
          </div>
          <button type="button" onClick={loadAnanya} style={{ ...buttonStyle(false, PURPLE), alignSelf: "center" }}>
            <Sparkles size={14} />
            Load Ananya Rao preset
          </button>
        </section>

        <section style={{ ...cardStyle, flex: "2 1 420px", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 500, color: INK_PRIMARY }}>Launch lagna</span>
            <select value={lagna} onChange={(e) => setLagna(e.target.value as Sign)} style={selectStyle}>
              {SIGNS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div style={{ padding: "0.65rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: SURFACE }}>
            <div style={{ fontSize: "0.8rem", color: INK_MUTED, marginBottom: "0.25rem" }}>Computed from lagna</div>
            <div style={{ fontSize: "0.9rem", color: INK_PRIMARY }}>
              2nd house: <span style={{ color: BLUE, fontWeight: 600 }}>{secondSign}</span> — lord: <span style={{ color: BLUE, fontWeight: 600 }}>{secondLord}</span>
            </div>
            <div style={{ fontSize: "0.9rem", color: INK_PRIMARY, marginTop: "0.15rem" }}>
              11th house: <span style={{ color: GREEN, fontWeight: 600 }}>{eleventhSign}</span> — lord: <span style={{ color: GREEN, fontWeight: 600 }}>{eleventhLord}</span>
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            <button
              type="button"
              aria-pressed={showAspects}
              onClick={() => setShowAspects((v) => !v)}
              style={buttonStyle(showAspects, GOLD)}
            >
              {showAspects ? <Eye size={14} /> : <EyeOff size={14} />}
              Jupiter aspects
            </button>
            <button
              type="button"
              aria-pressed={showBlendMistake}
              onClick={() => setShowBlendMistake((v) => !v)}
              style={buttonStyle(showBlendMistake, VERMILION)}
            >
              <Scale size={14} />
              Blend mistake
            </button>
            <button
              type="button"
              aria-pressed={showEmptyMistake}
              onClick={() => setShowEmptyMistake((v) => !v)}
              style={buttonStyle(showEmptyMistake, VERMILION)}
            >
              <XCircle size={14} />
              Empty = afflicted mistake
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.65rem" }}>
            <HousePanel
              title="2nd house — reservoir"
              houseNumber={2}
              sign={secondSign}
              lord={secondLord}
              lordPlacement={secondLordPlacement}
              occupants={secondOccupants}
              jupiterAspectsHouse={jupiterAspectsSecond}
              jupiterAspectsLord={jupiterAspectsSecondLord}
              verdict={secondVerdict}
              emptyMistake={showEmptyMistake}
            />
            <HousePanel
              title="11th house — inflow"
              houseNumber={11}
              sign={eleventhSign}
              lord={eleventhLord}
              lordPlacement={eleventhLordPlacement}
              occupants={eleventhOccupants}
              jupiterAspectsHouse={jupiterAspectsEleventh}
              jupiterAspectsLord={jupiterAspectsEleventhLord}
              verdict={eleventhVerdict}
            />
          </div>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.65rem" }}>
        <section style={{ ...cardStyle, borderColor: `${VERMILION}50`, background: `${VERMILION}08` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: VERMILION, marginBottom: "0.35rem" }}>
            <AlertTriangle size={12} />
            Common mistake
          </div>
          <div style={{ fontSize: "0.85rem", fontWeight: 600, color: INK_PRIMARY, marginBottom: "0.25rem" }}>
            Treating unoccupied 2nd as afflicted
          </div>
          <div style={{ fontSize: "0.8rem", color: INK_SECONDARY, lineHeight: 1.55 }}>
            An empty house is an absence of occupants, not a negative. Always check the lord&apos;s condition and any aspects before deciding.
          </div>
        </section>
        <section style={{ ...cardStyle, borderColor: `${VERMILION}50`, background: `${VERMILION}08` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: VERMILION, marginBottom: "0.35rem" }}>
            <AlertTriangle size={12} />
            Common mistake
          </div>
          <div style={{ fontSize: "0.85rem", fontWeight: 600, color: INK_PRIMARY, marginBottom: "0.25rem" }}>
            Blending the two houses into one verdict
          </div>
          <div style={{ fontSize: "0.8rem", color: INK_SECONDARY, lineHeight: 1.55 }}>
            A strong 11th and a quieter 2nd are two distinct signals. Averaging them into &ldquo;wealth is good&rdquo; loses the asymmetric information.
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: showBlendMistake ? `${VERMILION}66` : `${GREEN}66`, background: showBlendMistake ? `${VERMILION}0F` : `${GREEN}0F` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <LayoutList size={18} color={showBlendMistake ? VERMILION : GREEN} />
          <p style={{ ...eyebrowStyle, margin: 0 }}>Separate-house synthesis</p>
        </div>
        <h3 style={{ margin: "0.35rem 0 0", color: showBlendMistake ? VERMILION : GREEN, fontSize: "1.1rem", fontWeight: 600 }}>
          {showBlendMistake ? "Discipline warning — findings blended" : "Asymmetric finding preserved"}
        </h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{synthesis}</p>
      </section>
    </div>
  );
}

function ChartSvg({
  lagna,
  placements,
  showAspects,
  highlightSecond,
  highlightEleventh,
}: {
  lagna: Sign;
  placements: PlanetPlacement[];
  showAspects: boolean;
  highlightSecond: boolean;
  highlightEleventh: boolean;
}) {
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const r = 110;

  const lagnaIx = signIndex(lagna);

  function coords(index: number, radius: number) {
    const angle = ((index - lagnaIx) * 30 - 90) * (Math.PI / 180);
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  }

  const secondIx = signIndex(houseSign(lagna, 2));
  const eleventhIx = signIndex(houseSign(lagna, 11));
  const jupiter = placements.find((p) => p.planet === "jupiter");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Launch moment chart with 2nd and 11th houses highlighted" style={{ width: "100%", maxWidth: 340, margin: "0 auto", display: "block" }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={HAIRLINE} strokeWidth={1} />
      {SIGNS.map((_, i) => {
        const a = ((i - lagnaIx) * 30 - 90) * (Math.PI / 180);
        const x1 = cx + (r - 10) * Math.cos(a);
        const y1 = cy + (r - 10) * Math.sin(a);
        const x2 = cx + r * Math.cos(a);
        const y2 = cy + r * Math.sin(a);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK_MUTED} strokeWidth={1} />;
      })}
      {SIGNS.map((sign, i) => {
        const pos = coords(i, r - 26);
        const isLagna = i === lagnaIx;
        const isSecond = i === secondIx;
        const isEleventh = i === eleventhIx;
        const fill = isLagna ? `${PURPLE}18` : isSecond && highlightSecond ? `${BLUE}18` : isEleventh && highlightEleventh ? `${GREEN}18` : "transparent";
        const stroke = isLagna ? PURPLE : isSecond && highlightSecond ? BLUE : isEleventh && highlightEleventh ? GREEN : HAIRLINE;
        const strokeWidth = isLagna || isSecond || isEleventh ? 2.5 : 1;
        return (
          <g key={sign}>
            <circle cx={pos.x} cy={pos.y} r={20} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
            <text x={pos.x} y={pos.y + 4} textAnchor="middle" fontSize={10} fill={isLagna || isSecond || isEleventh ? INK_PRIMARY : INK_SECONDARY} fontWeight={600}>
              {sign.slice(0, 3)}
            </text>
            {(isSecond || isEleventh) && (
              <text x={pos.x} y={pos.y + 34} textAnchor="middle" fontSize={9} fill={isSecond ? BLUE : GREEN} fontWeight={600}>
                {isSecond ? "2nd" : "11th"}
              </text>
            )}
          </g>
        );
      })}
      <polygon points={`${cx},${cy - r - 10} ${cx - 6},${cy - r + 6} ${cx + 6},${cy - r + 6}`} fill={PURPLE} />
      <text x={cx} y={cy - r - 16} textAnchor="middle" fontSize={10} fill={PURPLE} fontWeight={600}>
        Lagna
      </text>

      {showAspects && jupiter && (
        <g>
          {jupiterAspectTargets(jupiter.sign).map((target, i) => {
            const targetIx = signIndex(target);
            const from = coords(signIndex(jupiter.sign), r - 55);
            const to = coords(targetIx, r - 55);
            const isSecond = target === houseSign(lagna, 2);
            const isEleventh = target === houseSign(lagna, 11);
            const color = isSecond || isEleventh ? GOLD : `${GOLD}55`;
            return (
              <path
                key={i}
                d={`M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`}
                fill="none"
                stroke={color}
                strokeWidth={isSecond || isEleventh ? 3 : 1.5}
                strokeDasharray="6 4"
              />
            );
          })}
        </g>
      )}

      {placements.map((p, i) => {
        const ix = signIndex(p.sign);
        const pos = coords(ix, r - 55);
        const meta = PLANET_META[p.planet];
        const offset = i * 14 - ((placements.length - 1) * 14) / 2;
        return (
          <g key={p.planet} transform={`translate(${offset} 0)`}>
            <circle cx={pos.x} cy={pos.y} r={12} fill={SURFACE} stroke={meta.color} strokeWidth={2} />
            <text x={pos.x} y={pos.y + 4} textAnchor="middle" fontSize={8} fill={meta.color} fontWeight={700}>
              {meta.short}
            </text>
            {p.dignity === "exalted" && (
              <text x={pos.x} y={pos.y - 16} textAnchor="middle" fontSize={8} fill={GREEN} fontWeight={600}>
                ex
              </text>
            )}
            {p.dignity === "own" && (
              <text x={pos.x} y={pos.y - 16} textAnchor="middle" fontSize={8} fill={GREEN} fontWeight={600}>
                own
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function HousePanel({
  title,
  houseNumber,
  sign,
  lord,
  lordPlacement,
  occupants,
  jupiterAspectsHouse,
  jupiterAspectsLord,
  verdict,
  emptyMistake,
}: {
  title: string;
  houseNumber: 2 | 11;
  sign: Sign;
  lord: string;
  lordPlacement?: PlanetPlacement;
  occupants: PlanetPlacement[];
  jupiterAspectsHouse: boolean;
  jupiterAspectsLord: boolean;
  verdict: { label: string; color: string; note: string };
  emptyMistake?: boolean;
}) {
  const color = houseNumber === 2 ? BLUE : GREEN;
  const upachayaNote = houseNumber === 11 ? "Upachaya house — strengthens with age and effort." : null;

  return (
    <div style={{ ...cardStyle, borderColor: `${verdict.color}55`, background: `${verdict.color}08` }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", fontWeight: 600, color, marginBottom: "0.5rem" }}>
        <House size={16} />
        {title}
      </div>

      <div style={{ display: "grid", gap: "0.5rem" }}>
        <MiniRow label="Sign" value={sign} />
        <MiniRow label="Lord" value={lord} />
        {lordPlacement && (
          <MiniRow
            label="Lord placement"
            value={`${PLANET_META[lordPlacement.planet].label} in ${lordPlacement.sign} (${DIGNITY_META[lordPlacement.dignity].label})`}
            valueColor={DIGNITY_META[lordPlacement.dignity].color}
          />
        )}
        <MiniRow
          label="Occupants"
          value={occupants.length > 0 ? occupants.map((p) => PLANET_META[p.planet].label).join(", ") : "Unoccupied"}
          valueColor={occupants.length > 0 ? (houseNumber === 11 ? GREEN : GOLD) : INK_MUTED}
        />
        <MiniRow
          label="Jupiter aspect"
          value={jupiterAspectsHouse ? "Aspects the house" : jupiterAspectsLord ? "Aspects the lord" : "No Jupiter aspect"}
          valueColor={jupiterAspectsHouse || jupiterAspectsLord ? GREEN : INK_MUTED}
        />
        {upachayaNote && (
          <div style={{ fontSize: "0.78rem", color: GREEN, lineHeight: 1.45 }}>
            <ArrowLeftRight size={12} style={{ verticalAlign: "middle", marginRight: 4 }} />
            {upachayaNote}
          </div>
        )}
      </div>

      <div style={{ marginTop: "0.65rem", padding: "0.55rem", borderRadius: 6, border: `1px solid ${verdict.color}66`, background: `${verdict.color}12` }}>
        <div style={{ fontSize: "0.85rem", fontWeight: 600, color: verdict.color }}>{verdict.label}</div>
        <div style={{ fontSize: "0.78rem", color: INK_SECONDARY, lineHeight: 1.5, marginTop: "0.25rem" }}>{verdict.note}</div>
      </div>

      {emptyMistake && houseNumber === 2 && occupants.length === 0 && (
        <div style={{ marginTop: "0.55rem", fontSize: "0.78rem", color: VERMILION, lineHeight: 1.5 }}>
          <XCircle size={12} style={{ verticalAlign: "middle", marginRight: 4 }} />
          Wrong reading suppressed: the unoccupied status is neutral, not negative.
        </div>
      )}
    </div>
  );
}

function MiniRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", fontSize: "0.8rem" }}>
      <span style={{ color: INK_MUTED }}>{label}</span>
      <span style={{ color: valueColor || INK_PRIMARY, fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", fontSize: "0.72rem", color: INK_SECONDARY }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
      {label}
    </span>
  );
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    padding: "0.35rem 0.65rem",
    borderRadius: 6,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? `${color}15` : "transparent",
    color: active ? color : INK_PRIMARY,
    fontSize: "0.82rem",
    fontWeight: 500,
    cursor: "pointer",
  };
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    padding: "0.25rem 0.55rem",
    borderRadius: 6,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? `${color}15` : "transparent",
    color: active ? color : INK_SECONDARY,
    fontSize: "0.75rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

const cardStyle: CSSProperties = {
  background: SURFACE,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

const selectStyle: CSSProperties = {
  width: "100%",
  padding: "0.45rem 0.6rem",
  borderRadius: 6,
  border: `1px solid ${HAIRLINE}`,
  background: "transparent",
  color: INK_PRIMARY,
  fontSize: "0.85rem",
  fontWeight: 500,
  appearance: "none",
  cursor: "pointer",
};
