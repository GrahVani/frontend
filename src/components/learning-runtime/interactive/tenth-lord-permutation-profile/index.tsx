"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  BriefcaseBusiness,
  Compass,
  Landmark,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { NI_HOUSE_POLYGONS, NI_HOUSE_CENTERS } from "@/lib/north-indian-chart-geometry";

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

/* ──────────────── Data ──────────────── */

const TENTH_LORD_PLACEMENTS = [
  {
    house: 1,
    name: "Tanu",
    nature: "kendra-trikona",
    color: GOLD,
    direction:
      "Career becomes identity: self-made work, public personality, and personal effort carry the profession.",
    strong:
      "High capacity makes the native visible, self-directed, and able to turn personality into professional authority.",
    weak: "Low capacity can make career identity unstable: public effort is present, but confidence or consistency needs support.",
  },
  {
    house: 2,
    name: "Dhana",
    nature: "artha",
    color: GREEN,
    direction:
      "Career enters wealth, family, food, speech, voice, finance, or accumulated resources.",
    strong:
      "High capacity supports earning through profession, finance, speech, advising, family enterprise, or food-linked work.",
    weak: "Low capacity can create uneven income, speech-resource pressure, or family obligations shaping career choices.",
  },
  {
    house: 3,
    name: "Sahaja",
    nature: "upachaya",
    color: BLUE,
    direction:
      "Career runs through effort, communication, courage, hands, media, sales, writing, performance, and initiative.",
    strong:
      "High capacity turns repeated effort into skill, enterprise, and communications-based professional momentum.",
    weak: "Low capacity still pushes effort, but the person may scatter energy or struggle to sustain independent initiative.",
  },
  {
    house: 4,
    name: "Sukha",
    nature: "kendra",
    color: BLUE,
    direction:
      "Career connects with home, land, vehicles, education, public base, homeland, comfort, or real estate.",
    strong:
      "High capacity supports property, education, public-facing service, home-based work, or stable institutional roles.",
    weak: "Low capacity can make private foundations affect the career: home, education, or property matters may interrupt delivery.",
  },
  {
    house: 5,
    name: "Putra",
    nature: "trikona",
    color: GOLD,
    direction:
      "Career flows through intelligence, teaching, creativity, counsel, speculation, politics, or advisory work.",
    strong:
      "High capacity gives creative authority, advisory skill, political intelligence, or education-linked professional rise.",
    weak: "Low capacity can make talent visible but inconsistent, especially around speculation, students, or counsel roles.",
  },
  {
    house: 6,
    name: "Shatru",
    nature: "dusthana-upachaya",
    color: VERMILION,
    direction:
      "Career enters service, employment, competition, medicine, law, litigation, conflict, and overcoming rivals.",
    strong:
      "High capacity makes the 6th productive: service, medicine, law, operations, competition, and problem-solving can thrive.",
    weak: "Low capacity emphasizes service pressure, rivalry, workplace conflict, or health-debt-obligation themes around work.",
  },
  {
    house: 7,
    name: "Yuvati",
    nature: "kendra",
    color: GREEN,
    direction:
      "Career goes through partnership, clients, trade, diplomacy, public dealing, contracts, or foreign contact.",
    strong:
      "High capacity supports business, client-facing work, negotiations, partnership-led success, and public visibility.",
    weak: "Low capacity can bring dependency on partners, unstable contracts, or public dealings that drain the career.",
  },
  {
    house: 8,
    name: "Randhra",
    nature: "dusthana",
    color: PURPLE,
    direction:
      "Career enters research, hidden matters, investigation, others resources, insurance, inheritance, occult, and transformation.",
    strong:
      "High capacity channels the 8th into research, investigation, crisis work, depth professions, or confidential expertise.",
    weak: "Low capacity can show breaks, instability, hidden obstructions, or professional volatility if the lord cannot carry the field.",
  },
  {
    house: 9,
    name: "Dharma",
    nature: "trikona-yoga",
    color: GOLD,
    direction:
      "Career fuses with dharma, law, higher learning, religion, fortune, foreign travel, teaching, or advisory work.",
    strong:
      "High capacity delivers dharma-karmadhipati strongly: distinguished, fortunate, and purpose-aligned professional rise.",
    weak: "Low capacity leaves the yoga present but under-delivered: fortune is indicated, yet realization needs correction and timing.",
  },
  {
    house: 10,
    name: "Karma",
    nature: "kendra-upachaya",
    color: GOLD,
    direction:
      "Career stays in its own field: leadership, authority, visibility, professional autonomy, and public action.",
    strong:
      "High capacity gives a sharp career engine: recognition, authority, and self-driven professional accomplishment.",
    weak: "Low capacity still makes career central, but public delivery may fluctuate until dignity, support, or timing improves.",
  },
  {
    house: 11,
    name: "Labha",
    nature: "upachaya",
    color: GREEN,
    direction:
      "Career yields gains, networks, large organizations, income, ambitions, and fulfilled professional desires.",
    strong:
      "High capacity converts profession into income, allies, scale, organizational reach, and material reward.",
    weak: "Low capacity can bring uneven gains, unreliable networks, or ambition that outpaces delivery.",
  },
  {
    house: 12,
    name: "Vyaya",
    nature: "dusthana-moksha",
    color: VERMILION,
    direction:
      "Career goes abroad, behind the scenes, into seclusion, institutions, hospitals, charities, ashrams, research, or expenditure.",
    strong:
      "High capacity makes the 12th productive: foreign work, research, spiritual or institutional service, and focused hidden labor.",
    weak: "Low capacity can show loss, obscurity, draining expenditure, isolation, or difficulty receiving recognition.",
  },
] as const;

const TENTH_LORD_CAPACITY = {
  strong: {
    label: "Strong / dignified",
    color: GREEN,
    score: 88,
    note: "The placement direction delivers cleanly. The house signature becomes usable professional strength.",
  },
  mixed: {
    label: "Mixed / average",
    color: GOLD,
    score: 58,
    note: "The direction is real but uneven. Read aspects, dignity, cancellation, and timing before final judgment.",
  },
  weak: {
    label: "Weak / afflicted",
    color: VERMILION,
    score: 30,
    note: "The same direction struggles to deliver. Do not erase the signature, but qualify its outcome carefully.",
  },
} as const;

const TENTH_LORD_CONNECTIONS = {
  direct: {
    label: "10th lord in 9th",
    activeHouse: 9,
    note: "The most direct dharma-karmadhipati expression: karma flows into dharma, fortune, law, teaching, and higher meaning.",
  },
  reverse: {
    label: "9th lord in 10th",
    activeHouse: 10,
    note: "Reverse connection: dharma flows into karma, supporting authority, public work, and fortune-backed action.",
  },
  exchange: {
    label: "9th-10th exchange",
    activeHouse: 9,
    note: "Exchange or conjunction ties fortune and action mutually. Capacity decides whether the yoga is fully delivered.",
  },
} as const;

type TenthLordPlacement = (typeof TENTH_LORD_PLACEMENTS)[number];
type TenthLordCapacityKey = keyof typeof TENTH_LORD_CAPACITY;
type TenthLordConnectionKey = keyof typeof TENTH_LORD_CONNECTIONS;

/* ──────────────── Main component ──────────────── */

export function TenthLordPermutationProfile() {
  const [placementHouse, setPlacementHouse] = useState(9);
  const [capacity, setCapacity] = useState<TenthLordCapacityKey>("strong");
  const [connection, setConnection] =
    useState<TenthLordConnectionKey>("direct");
  const [showNature, setShowNature] = useState(true);
  const [destinyGuard, setDestinyGuard] = useState(true);
  const placement =
    TENTH_LORD_PLACEMENTS.find((item) => item.house === placementHouse) ??
    TENTH_LORD_PLACEMENTS[8];
  const capacityState = TENTH_LORD_CAPACITY[capacity];
  const connectionState = TENTH_LORD_CONNECTIONS[connection];
  const yogaFlag =
    placementHouse === 9 ||
    (connection !== "direct" && connectionState.activeHouse === placementHouse);
  const deliveryText =
    capacity === "weak"
      ? placement.weak
      : capacity === "strong"
        ? placement.strong
        : `${placement.strong} But keep the delivery qualified until dignity, aspects, and timing agree.`;

  const synthesis = useMemo(() => {
    const yoga = yogaFlag
      ? ` Dharma-karmadhipati is flagged: ${connectionState.note}`
      : " No 9th-10th lord connection is selected for this placement.";
    const guard = destinyGuard
      ? " Keep the two-step discipline: direction first, delivery second."
      : " The guard is off: this is where placement-as-destiny mistakes creep in.";
    return `${placement.direction} ${deliveryText} ${capacityState.note}${yoga} ${guard}`;
  }, [
    capacityState.note,
    connectionState.note,
    deliveryText,
    destinyGuard,
    placement.direction,
    yogaFlag,
  ]);

  return (
    <div
      data-interactive="tenth-lord-permutation-profile"
      style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}
    >
      <section
        style={{
          border: `1px solid ${HAIRLINE}`,
          borderRadius: 8,
          background: SURFACE,
          padding: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <p style={eyebrowStyle}>10th lord permutation workbench</p>
            <h2
              style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}
            >
              Direction from house, delivery from capacity
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 850,
              }}
            >
              Move the career-lord through all twelve houses, then change its
              capacity to see why a placement is a direction rather than a fixed
              verdict.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setPlacementHouse(9);
              setCapacity("strong");
              setConnection("direct");
              setShowNature(true);
              setDestinyGuard(true);
            }}
            style={buttonStyle(false)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(320px, 1.05fr) minmax(320px, 0.95fr)",
          gap: "1rem",
          alignItems: "start",
        }}
      >
        <section
          style={{
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 8,
            background: SURFACE,
            padding: "1rem",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div>
              <p style={eyebrowStyle}>Twelve placements</p>
              <h3
                style={{
                  margin: "0.15rem 0 0",
                  color: placement.color,
                  fontSize: "1.2rem",
                }}
              >
                10th lord in {placementHouse}: {placement.name}
              </h3>
            </div>
            <strong style={{ color: capacityState.color }}>
              {capacityState.label}
            </strong>
          </div>
          <TenthLordNorthIndianSvg
            placement={placement}
            capacity={capacity}
            showNature={showNature}
            yogaFlag={yogaFlag}
            onSelectHouse={setPlacementHouse}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
              gap: "0.65rem",
            }}
          >
            <MiniFact
              icon={<Compass size={16} />}
              title="Direction"
              body={`House ${placementHouse}: ${placement.name}`}
              color={placement.color}
            />
            <MiniFact
              icon={<ShieldCheck size={16} />}
              title="Delivery"
              body={capacityState.label}
              color={capacityState.color}
            />
            <MiniFact
              icon={<Landmark size={16} />}
              title="Nature"
              body={placement.nature}
              color={showNature ? BLUE : INK_MUTED}
            />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel
            title="Place the 10th lord"
            icon={<BriefcaseBusiness size={18} />}
            color={placement.color}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: "0.45rem",
              }}
            >
              {TENTH_LORD_PLACEMENTS.map((item) => (
                <button
                  key={item.house}
                  type="button"
                  aria-pressed={placementHouse === item.house}
                  onClick={() => setPlacementHouse(item.house)}
                  style={smallChipStyle(
                    placementHouse === item.house,
                    item.color,
                  )}
                >
                  H{item.house}
                </button>
              ))}
            </div>
            <p
              style={{
                margin: "0.75rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.5,
              }}
            >
              {placement.direction}
            </p>
          </Panel>

          <Panel
            title="Lord capacity"
            icon={<ShieldCheck size={18} />}
            color={capacityState.color}
          >
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap",
                marginBottom: "0.65rem",
              }}
            >
              {(Object.keys(TENTH_LORD_CAPACITY) as TenthLordCapacityKey[]).map(
                (key) => (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={capacity === key}
                    onClick={() => setCapacity(key)}
                    style={smallChipStyle(
                      capacity === key,
                      TENTH_LORD_CAPACITY[key].color,
                    )}
                  >
                    {TENTH_LORD_CAPACITY[key].label}
                  </button>
                ),
              )}
            </div>
            <div
              style={{
                height: 12,
                borderRadius: 8,
                background: `${GOLD}22`,
                overflow: "hidden",
                border: `1px solid ${HAIRLINE}`,
              }}
            >
              <div
                style={{
                  width: `${capacityState.score}%`,
                  height: "100%",
                  background: capacityState.color,
                  transition: "width 240ms ease",
                }}
              />
            </div>
            <p
              style={{
                margin: "0.65rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.5,
              }}
            >
              {deliveryText}
            </p>
          </Panel>
        </section>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 0.95fr)",
          gap: "1rem",
          alignItems: "start",
        }}
      >
        <section
          style={{
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 8,
            background: SURFACE,
            padding: "1rem",
          }}
        >
          <p style={eyebrowStyle}>Placement table</p>
          <h3
            style={{
              margin: "0.15rem 0 0.8rem",
              color: GOLD,
              fontSize: "1.18rem",
            }}
          >
            Tour the twelve directions
          </h3>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {TENTH_LORD_PLACEMENTS.map((item) => {
              const active = item.house === placementHouse;
              const dusthana = item.nature.includes("dusthana");
              const yoga = item.house === 9;
              return (
                <button
                  key={item.house}
                  type="button"
                  onClick={() => setPlacementHouse(item.house)}
                  style={{
                    textAlign: "left",
                    border: `1px solid ${active ? item.color : HAIRLINE}`,
                    borderRadius: 8,
                    background: active
                      ? `${item.color}14`
                      : "rgba(255,251,241,0.58)",
                    padding: "0.7rem",
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "0.8rem",
                      alignItems: "center",
                    }}
                  >
                    <strong
                      style={{ color: active ? item.color : INK_SECONDARY }}
                    >
                      H{item.house} {item.name}
                    </strong>
                    <span
                      style={{
                        color: yoga ? GOLD : dusthana ? VERMILION : INK_MUTED,
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      {yoga ? "yoga" : item.nature}
                    </span>
                  </span>
                  <span
                    style={{
                      display: "block",
                      marginTop: "0.35rem",
                      color: INK_SECONDARY,
                      lineHeight: 1.4,
                    }}
                  >
                    {item.direction}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel
            title="Dharma-karmadhipati check"
            icon={<Sparkles size={18} />}
            color={yogaFlag ? GOLD : INK_MUTED}
          >
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap",
                marginBottom: "0.65rem",
              }}
            >
              {(
                Object.keys(TENTH_LORD_CONNECTIONS) as TenthLordConnectionKey[]
              ).map((key) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={connection === key}
                  onClick={() => setConnection(key)}
                  style={smallChipStyle(connection === key, GOLD)}
                >
                  {TENTH_LORD_CONNECTIONS[key].label}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
              {connectionState.note}
            </p>
          </Panel>

          <Panel
            title="House nature overlay"
            icon={<Landmark size={18} />}
            color={showNature ? BLUE : GOLD}
          >
            <button
              type="button"
              aria-pressed={showNature}
              onClick={() => setShowNature((value) => !value)}
              style={smallChipStyle(showNature, BLUE)}
            >
              {showNature ? "Nature visible" : "Show nature"}
            </button>
            <p
              style={{
                margin: "0.65rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.5,
              }}
            >
              Kendra and trikona placements support visibility and flow;
              dusthana placements are not automatic failure, but they need
              capacity to become productive.
            </p>
          </Panel>

          <Panel
            title="Placement-as-destiny guard"
            icon={<AlertTriangle size={18} />}
            color={destinyGuard ? GREEN : VERMILION}
          >
            <button
              type="button"
              aria-pressed={destinyGuard}
              onClick={() => setDestinyGuard((value) => !value)}
              style={smallChipStyle(destinyGuard, GREEN)}
            >
              {destinyGuard ? "Guard active" : "Reactivate guard"}
            </button>
            <p
              style={{
                margin: "0.65rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.5,
              }}
            >
              Same placement, different outcomes: a strong 12th can give foreign
              or institutional success; a weak 12th can show loss and obscurity.
            </p>
          </Panel>

          <section
            style={{
              border: `1px solid ${placement.color}66`,
              borderRadius: 8,
              background: `${placement.color}14`,
              padding: "1rem",
            }}
          >
            <strong style={{ color: placement.color }}>
              Direction + delivery synthesis
            </strong>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
              }}
            >
              {synthesis}
            </p>
          </section>
        </section>
      </div>
    </div>
  );
}

/* ──────────────── North Indian SVG chart ──────────────── */

function TenthLordNorthIndianSvg({
  placement,
  capacity,
  showNature,
  yogaFlag,
  onSelectHouse,
}: {
  placement: TenthLordPlacement;
  capacity: TenthLordCapacityKey;
  showNature: boolean;
  yogaFlag: boolean;
  onSelectHouse: (house: number) => void;
}) {
  const center = 170;
  const capacityState = TENTH_LORD_CAPACITY[capacity];

  const activeCenter = NI_HOUSE_CENTERS[placement.house];
  const tenthCenter = NI_HOUSE_CENTERS[10];

  const topLabel = `CAREER-LORD CARRIES KARMA INTO HOUSE ${placement.house}`;

  return (
    <>
      <div
        style={{
          textAlign: "center",
          color: INK_MUTED,
          fontSize: "0.72rem",
          letterSpacing: "0.04em",
          lineHeight: 1.35,
          marginBottom: "0.2rem",
        }}
      >
        {topLabel}
      </div>
      <svg
        viewBox="0 0 340 340"
        role="img"
        aria-label="Tenth lord placement in North Indian chart with capacity and house nature overlay"
        style={{
          width: "100%",
          maxHeight: 430,
          margin: "0 auto",
          display: "block",
        }}
      >
        {/* Outer border */}
        <rect
          x="10"
          y="10"
          width="320"
          height="320"
          fill={`${GOLD}05`}
          stroke={HAIRLINE}
          strokeWidth="1.5"
        />

        {/* North Indian chart structural lines */}
        <line
          x1="10"
          y1="10"
          x2="330"
          y2="330"
          stroke={HAIRLINE}
          strokeWidth="1"
        />
        <line
          x1="330"
          y1="10"
          x2="10"
          y2="330"
          stroke={HAIRLINE}
          strokeWidth="1"
        />
        <polygon
          points="170,10 10,170 170,330 330,170"
          fill="none"
          stroke={HAIRLINE}
          strokeWidth="1"
        />

        {/* Connector line from 10th house to lord's placement */}
        <line
          x1={tenthCenter.x}
          y1={tenthCenter.y}
          x2={activeCenter.x}
          y2={activeCenter.y}
          stroke={placement.color}
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Render all 12 house polygons */}
        {TENTH_LORD_PLACEMENTS.map((item) => {
          const h = item.house;
          const active = h === placement.house;
          const source = h === 10;
          const dusthana = item.nature.includes("dusthana");
          const support =
            item.nature.includes("kendra") || item.nature.includes("trikona");

          const polyFill = active
            ? `${placement.color}25`
            : source
              ? `${GOLD}20`
              : showNature && dusthana
                ? `${VERMILION}15`
                : showNature && support
                  ? `${GREEN}15`
                  : "transparent";

          const strokeColor = active
            ? placement.color
            : source
              ? `${GOLD}99`
              : showNature && dusthana
                ? `${VERMILION}55`
                : showNature && support
                  ? `${GREEN}55`
                  : "rgba(168, 120, 48, 0.4)";

          const c = NI_HOUSE_CENTERS[h];

          return (
            <g
              key={h}
              role="button"
              tabIndex={0}
              onClick={() => onSelectHouse(h)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ")
                  onSelectHouse(h);
              }}
              style={{ cursor: "pointer" }}
            >
              <polygon
                points={NI_HOUSE_POLYGONS[h]}
                fill={polyFill}
                stroke={strokeColor}
                strokeWidth={active || source ? 2.5 : 1}
                style={{ transition: "fill 0.2s ease, stroke 0.2s ease" }}
              />
              {/* House number badge */}
              <circle
                cx={c.x}
                cy={c.y}
                r={active ? 14 : source ? 13 : 11}
                fill={active ? placement.color : source ? GOLD : "#fff"}
                stroke={active || source ? "#fff" : strokeColor}
                strokeWidth="1.5"
              />
              <text
                x={c.x}
                y={c.y + 4}
                textAnchor="middle"
                fill={active || source ? "#fff" : INK_SECONDARY}
                fontSize="12"
                fontWeight="400"
              >
                {h}
              </text>

              {/* "lord sits" label for active placement */}
              {active ? (
                <text
                  x={c.x}
                  y={c.y + 26}
                  textAnchor="middle"
                  fill={placement.color}
                  fontSize="9"
                  fontWeight="400"
                >
                  lord sits
                </text>
              ) : null}

              {/* "yoga" label when dharma-karmadhipati flagged on house 9 */}
              {yogaFlag && h === 9 ? (
                <text
                  x={c.x}
                  y={c.y - 20}
                  textAnchor="middle"
                  fill={GOLD}
                  fontSize="9"
                  fontWeight="400"
                >
                  yoga
                </text>
              ) : null}
            </g>
          );
        })}

        {/* Capacity dot on the active house */}
        <circle
          cx={activeCenter.x + (placement.house <= 6 ? 12 : -12)}
          cy={activeCenter.y - 16}
          r="7"
          fill={capacityState.color}
          stroke="#fff"
          strokeWidth="1.5"
        />

        {/* Center overlay circle */}
        <circle
          cx={center}
          cy={center}
          r={34}
          fill="#FFF9EA"
          stroke={capacityState.color}
          strokeWidth="2.5"
        />
        <text
          x={center}
          y={center - 12}
          textAnchor="middle"
          fill={INK_MUTED}
          fontSize="8"
          fontWeight="400"
        >
          10TH LORD
        </text>
        <text
          x={center}
          y={center + 5}
          textAnchor="middle"
          fill={placement.color}
          fontSize="15"
          fontWeight="400"
        >
          H{placement.house}
        </text>
        <text
          x={center}
          y={center + 19}
          textAnchor="middle"
          fill={capacityState.color}
          fontSize="9"
          fontWeight="400"
        >
          {capacity === "strong"
            ? "full delivery"
            : capacity === "weak"
              ? "qualified"
              : "mixed"}
        </text>
      </svg>
      {yogaFlag ? (
        <div
          style={{
            textAlign: "center",
            color: GOLD,
            fontSize: "0.78rem",
            lineHeight: 1.35,
            marginTop: "0.2rem",
          }}
        >
          9th-10th connection: dharma-karmadhipati flagged
        </div>
      ) : null}
    </>
  );
}

/* ──────────────── Shared UI helpers ──────────────── */

function Panel({
  title,
  icon,
  color,
  children,
}: {
  title: string;
  icon: ReactNode;
  color: string;
  children: ReactNode;
}) {
  return (
    <section
      style={{
        border: `1px solid ${color}44`,
        borderRadius: 8,
        background: SURFACE,
        padding: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          color,
          fontWeight: 600,
        }}
      >
        {icon}
        {title}
      </div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function MiniFact({
  icon,
  title,
  body,
  color,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  color: string;
}) {
  return (
    <div
      style={{
        border: `1px solid ${color}44`,
        borderRadius: 8,
        background: `${color}0F`,
        padding: "0.7rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.45rem",
          color,
          fontWeight: 600,
        }}
      >
        {icon}
        {title}
      </div>
      <p
        style={{
          margin: "0.35rem 0 0",
          color: INK_SECONDARY,
          lineHeight: 1.35,
        }}
      >
        {body}
      </p>
    </div>
  );
}

function buttonStyle(active: boolean): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? BLUE : HAIRLINE}`,
    borderRadius: 8,
    background: active ? BLUE : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.55rem 0.75rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function smallChipStyle(active: boolean, color: string): React.CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.48rem 0.62rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

const eyebrowStyle: React.CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
