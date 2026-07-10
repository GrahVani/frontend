"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BriefcaseBusiness,
  CircleDot,
  Landmark,
  RotateCcw,
  ShieldCheck,
  Sun,
} from "lucide-react";

type StrengthKey = "strong" | "moderate" | "weak";
type OccupantKey = "saturn" | "mercury" | "venus" | "mars" | "none";
type ProfessionKarakaKey = "sun" | "mercury" | "jupiter" | "saturn";

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

const STRENGTHS = {
  strong: {
    label: "Strong",
    color: GREEN,
    score: 86,
    status: "cleanly supported",
    note: "The significator can speak clearly and deliver its own dimension with confidence.",
  },
  moderate: {
    label: "Moderate",
    color: GOLD,
    score: 58,
    status: "usable but qualified",
    note: "The significator contributes, but dignity, aspects, and timing must refine the judgment.",
  },
  weak: {
    label: "Weak / afflicted",
    color: VERMILION,
    score: 30,
    status: "strained",
    note: "The dimension remains present, but its delivery is muted, delayed, or pressured.",
  },
} as const;

const OCCUPANTS = {
  saturn: {
    label: "Saturn in 10th",
    planet: "Saturn",
    abbr: "Sa",
    color: PURPLE,
    flavour:
      "labour, service, structure, administration, responsibility, the long climb",
    field:
      "administration, engineering, law-and-order, structured service, work for the masses",
  },
  mercury: {
    label: "Mercury in 10th",
    planet: "Mercury",
    abbr: "Me",
    color: GREEN,
    flavour:
      "commerce, communication, analysis, calculation, writing, adaptability",
    field: "trade, analytics, media, writing, consulting, business operations",
  },
  venus: {
    label: "Venus in 10th",
    planet: "Venus",
    abbr: "Ve",
    color: BLUE,
    flavour:
      "arts, luxury, aesthetics, comfort, relationships, pleasing public work",
    field:
      "design, arts, luxury goods, hospitality, relationship-based professions",
  },
  mars: {
    label: "Mars in 10th",
    planet: "Mars",
    abbr: "Ma",
    color: VERMILION,
    flavour:
      "engineering, defence, surgery, competition, decisive action, technical force",
    field:
      "technical work, military, surgery, policing, competitive operations",
  },
  none: {
    label: "Empty 10th",
    planet: "No occupant",
    abbr: "--",
    color: INK_MUTED,
    flavour: "no karaka by tenancy; do not invent one",
    field: "lean on the 10th lord, the Sun, aspects, and later D10 refinement",
  },
} as const;

const PROFESSION_KARAKAS = {
  sun: {
    label: "Sun",
    color: GOLD,
    domain: "authority, government, medicine, leadership, public command",
    connection:
      "status and power dimension; also one of the profession-type karakas",
  },
  mercury: {
    label: "Mercury",
    color: GREEN,
    domain: "commerce, communication, intellect, analysis, skills, trade",
    connection:
      "type indicator when strong and connected to the 10th, lord, or navamsha",
  },
  jupiter: {
    label: "Jupiter",
    color: GOLD,
    domain: "teaching, law, counsel, finance, wisdom, advisory work",
    connection:
      "type indicator for guidance, knowledge, and counsel professions",
  },
  saturn: {
    label: "Saturn",
    color: PURPLE,
    domain: "labour, service, structure, industry, masses, endurance",
    connection:
      "type indicator for organised, durable, service-heavy professional fields",
  },
} as const;

export function TenthKarakaTriangulation() {
  const [sunStrength, setSunStrength] = useState<StrengthKey>("strong");
  const [lordStrength, setLordStrength] = useState<StrengthKey>("moderate");
  const [occupant, setOccupant] = useState<OccupantKey>("saturn");
  const [professionKaraka, setProfessionKaraka] =
    useState<ProfessionKarakaKey>("saturn");
  const [showDivergence, setShowDivergence] = useState(true);
  const [emptyTenthGuard, setEmptyTenthGuard] = useState(true);

  const sun = STRENGTHS[sunStrength];
  const lord = STRENGTHS[lordStrength];
  const tenant = OCCUPANTS[occupant];
  const profession = PROFESSION_KARAKAS[professionKaraka];
  const hasTenant = occupant !== "none";
  const diverges = sunStrength === "strong" && lordStrength === "weak";
  const coherenceScore = (sun.score + lord.score + (hasTenant ? 76 : 42)) / 3;

  const synthesis = useMemo(() => {
    const status = `Sun as fixed naisargika karaka shows the status, authority, and honour dimension as ${sun.status}.`;
    const flavour = hasTenant
      ? `${tenant.planet} as karaka by tenancy gives the work flavour: ${tenant.flavour}.`
      : "The 10th is empty, so there is no karaka by tenancy; do not create an occupant-significator.";
    const delivery = `The 10th lord gives delivery and is ${lord.status}.`;
    const professionType = `${profession.label} as profession karaka points toward ${profession.domain}.`;
    const divergence =
      diverges && showDivergence
        ? " This is the lesson's key divergence: high status potential with weak career delivery. Report the tension instead of averaging it away."
        : " Combine the three perspectives without conflating their roles.";
    return `${status} ${flavour} ${delivery} ${professionType}${divergence}`;
  }, [
    diverges,
    hasTenant,
    lord.status,
    profession.domain,
    profession.label,
    showDivergence,
    sun.status,
    tenant.flavour,
    tenant.planet,
  ]);

  return (
    <div
      data-interactive="tenth-karaka-triangulation"
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
            <p style={eyebrowStyle}>10th karaka triangulation</p>
            <h2
              style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}
            >
              Sun, tenant, and lord are three different witnesses
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 860,
              }}
            >
              Keep the fixed Sun, the chart-specific 10th occupant, and the 10th
              lord side by side so status, flavour, and delivery do not blur
              together.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSunStrength("strong");
              setLordStrength("moderate");
              setOccupant("saturn");
              setProfessionKaraka("saturn");
              setShowDivergence(true);
              setEmptyTenthGuard(true);
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
              <p style={eyebrowStyle}>Three-perspective map</p>
              <h3
                style={{
                  margin: "0.15rem 0 0",
                  color: diverges ? VERMILION : GOLD,
                  fontSize: "1.2rem",
                }}
              >
                {diverges
                  ? "Status and delivery diverge"
                  : "Career signature triangulated"}
              </h3>
            </div>
            <strong style={{ color: diverges ? VERMILION : GREEN }}>
              {Math.round(coherenceScore)}% coherence
            </strong>
          </div>
          <TriangulationSvg
            sunColor={sun.color}
            tenantColor={tenant.color}
            lordColor={lord.color}
            occupant={tenant}
            hasTenant={hasTenant}
            diverges={diverges && showDivergence}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
              gap: "0.65rem",
            }}
          >
            <MiniFact
              icon={<Sun size={16} />}
              title="Sun"
              body="fixed status karaka"
              color={sun.color}
            />
            <MiniFact
              icon={<CircleDot size={16} />}
              title="Occupant"
              body={hasTenant ? "tenancy flavour" : "no tenant"}
              color={tenant.color}
            />
            <MiniFact
              icon={<ShieldCheck size={16} />}
              title="10th lord"
              body="career delivery"
              color={lord.color}
            />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel
            title="Sun: fixed naisargika karaka"
            icon={<Sun size={18} />}
            color={sun.color}
          >
            <StrengthPicker value={sunStrength} onChange={setSunStrength} />
            <p
              style={{
                margin: "0.65rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.5,
              }}
            >
              The Sun always speaks for status, authority, recognition, power,
              and honour in the 10th-house reading.
            </p>
          </Panel>

          <Panel
            title="10th lord: delivery"
            icon={<ShieldCheck size={18} />}
            color={lord.color}
          >
            <StrengthPicker value={lordStrength} onChange={setLordStrength} />
            <p
              style={{
                margin: "0.65rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.5,
              }}
            >
              The lord shows where the career energy goes and how well the
              professional promise can actually deliver.
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
          <p style={eyebrowStyle}>Karaka by tenancy</p>
          <h3
            style={{
              margin: "0.15rem 0 0.8rem",
              color: tenant.color,
              fontSize: "1.18rem",
            }}
          >
            Occupant gives the work&apos;s flavour
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "0.55rem",
            }}
          >
            {(Object.keys(OCCUPANTS) as OccupantKey[]).map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={occupant === key}
                onClick={() => setOccupant(key)}
                style={choiceCardStyle(occupant === key, OCCUPANTS[key].color)}
              >
                <strong>{OCCUPANTS[key].label}</strong>
                <span style={{ color: INK_MUTED, lineHeight: 1.35 }}>
                  {OCCUPANTS[key].flavour}
                </span>
              </button>
            ))}
          </div>
          <section
            style={{
              marginTop: "0.85rem",
              border: `1px solid ${tenant.color}44`,
              borderRadius: 8,
              background: `${tenant.color}12`,
              padding: "0.85rem",
            }}
          >
            <strong style={{ color: tenant.color }}>{tenant.label}</strong>
            <p
              style={{
                margin: "0.4rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.5,
              }}
            >
              {tenant.field}
            </p>
          </section>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel
            title="Profession karaka comparer"
            icon={<BriefcaseBusiness size={18} />}
            color={profession.color}
          >
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap",
                marginBottom: "0.65rem",
              }}
            >
              {(Object.keys(PROFESSION_KARAKAS) as ProfessionKarakaKey[]).map(
                (key) => (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={professionKaraka === key}
                    onClick={() => setProfessionKaraka(key)}
                    style={smallChipStyle(
                      professionKaraka === key,
                      PROFESSION_KARAKAS[key].color,
                    )}
                  >
                    {PROFESSION_KARAKAS[key].label}
                  </button>
                ),
              )}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
              {profession.domain}
            </p>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_MUTED,
                lineHeight: 1.45,
              }}
            >
              {profession.connection}
            </p>
          </Panel>

          <Panel
            title="Empty-10th guard"
            icon={<AlertTriangle size={18} />}
            color={emptyTenthGuard ? GREEN : VERMILION}
          >
            <button
              type="button"
              aria-pressed={emptyTenthGuard}
              onClick={() => setEmptyTenthGuard((value) => !value)}
              style={smallChipStyle(emptyTenthGuard, GREEN)}
            >
              {emptyTenthGuard ? "Guard active" : "Reactivate guard"}
            </button>
            <p
              style={{
                margin: "0.65rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.5,
              }}
            >
              An empty 10th has no karaka by tenancy. Lean on the lord, the Sun,
              and aspects instead of inventing an occupant.
            </p>
          </Panel>

          <Panel
            title="Divergence reader"
            icon={<Landmark size={18} />}
            color={showDivergence ? VERMILION : GOLD}
          >
            <button
              type="button"
              aria-pressed={showDivergence}
              onClick={() => setShowDivergence((value) => !value)}
              style={smallChipStyle(showDivergence, VERMILION)}
            >
              {showDivergence ? "Divergence visible" : "Show divergence"}
            </button>
            <p
              style={{
                margin: "0.65rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.5,
              }}
            >
              Strong Sun with weak 10th lord means high recognition-potential
              with strained structural delivery. It is not an average verdict.
            </p>
          </Panel>
        </section>
      </div>

      <section
        style={{
          border: `1px solid ${diverges ? VERMILION : GOLD}66`,
          borderRadius: 8,
          background: `${diverges ? VERMILION : GOLD}14`,
          padding: "1rem",
        }}
      >
        <strong style={{ color: diverges ? VERMILION : GOLD }}>
          Combined, not conflated
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
    </div>
  );
}

function StrengthPicker({
  value,
  onChange,
}: {
  value: StrengthKey;
  onChange: (value: StrengthKey) => void;
}) {
  return (
    <div style={{ display: "grid", gap: "0.65rem" }}>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {(Object.keys(STRENGTHS) as StrengthKey[]).map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={value === key}
            onClick={() => onChange(key)}
            style={smallChipStyle(value === key, STRENGTHS[key].color)}
          >
            {STRENGTHS[key].label}
          </button>
        ))}
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
            width: `${STRENGTHS[value].score}%`,
            height: "100%",
            background: STRENGTHS[value].color,
            transition: "width 220ms ease",
          }}
        />
      </div>
      <p style={{ margin: 0, color: INK_MUTED, lineHeight: 1.45 }}>
        {STRENGTHS[value].note}
      </p>
    </div>
  );
}

function TriangulationSvg({
  sunColor,
  tenantColor,
  lordColor,
  occupant,
  hasTenant,
  diverges,
}: {
  sunColor: string;
  tenantColor: string;
  lordColor: string;
  occupant: (typeof OCCUPANTS)[OccupantKey];
  hasTenant: boolean;
  diverges: boolean;
}) {
  const centerX = 170;
  const centerY = 138;
  const sun = { x: 85, y: 78 };
  const tenant = { x: 255, y: 78 };
  const lord = { x: 170, y: 228 };
  const bottomLabel = diverges
    ? "report divergence; do not average"
    : "agreement makes the career signature coherent";
  const bottomColor = diverges ? VERMILION : GREEN;

  return (
    <>
      <div
        style={{
          textAlign: "center",
          color: INK_MUTED,
          fontSize: "0.78rem",
          fontWeight: 600,
          letterSpacing: "0.08em",
          lineHeight: 1.35,
          marginBottom: "0.15rem",
        }}
      >
        STATUS + FLAVOUR + DELIVERY
      </div>
      <svg
        viewBox="0 0 340 320"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Triangulation of Sun, 10th occupant, and 10th lord"
        style={{
          width: "100%",
          maxHeight: 420,
          margin: "0 auto",
          display: "block",
        }}
      >
        <rect
          x="16"
          y="18"
          width="308"
          height="268"
          rx="8"
          fill={`${GOLD}0D`}
          stroke={HAIRLINE}
        />
        <circle
          cx={centerX}
          cy={centerY}
          r={48}
          fill="#FFF9EA"
          stroke={diverges ? VERMILION : GOLD}
          strokeWidth="3"
        />
        <text
          x={centerX}
          y={centerY - 7}
          textAnchor="middle"
          fill={GOLD}
          fontSize="25"
          fontWeight="700"
        >
          10
        </text>
        <text
          x={centerX}
          y={centerY + 17}
          textAnchor="middle"
          fill={INK_SECONDARY}
          fontSize="12"
          fontWeight="500"
        >
          career
        </text>

        <path
          d={`M ${sun.x + 32} ${sun.y + 16} C 128 94, 135 104, ${centerX - 35} ${centerY - 24}`}
          fill="none"
          stroke={sunColor}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d={`M ${tenant.x - 32} ${tenant.y + 16} C 212 94, 205 104, ${centerX + 35} ${centerY - 24}`}
          fill="none"
          stroke={tenantColor}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d={`M ${lord.x} ${lord.y - 36} C 170 205, 170 195, ${centerX} ${centerY + 48}`}
          fill="none"
          stroke={lordColor}
          strokeWidth="3"
          strokeLinecap="round"
        />

        <Node
          x={sun.x}
          y={sun.y}
          color={sunColor}
          title="Sun"
          sub="status"
          icon="Su"
        />
        <Node
          x={tenant.x}
          y={tenant.y}
          color={tenantColor}
          title={hasTenant ? occupant.planet : "Empty"}
          sub="flavour"
          icon={occupant.abbr}
        />
        <Node
          x={lord.x}
          y={lord.y}
          color={lordColor}
          title="10th lord"
          sub="delivery"
          icon="L"
        />
      </svg>
      <div
        style={{
          textAlign: "center",
          color: bottomColor,
          fontSize: "0.78rem",
          fontWeight: 600,
          lineHeight: 1.35,
          marginTop: "0.15rem",
        }}
      >
        {bottomLabel}
      </div>
    </>
  );
}

function Node({
  x,
  y,
  color,
  title,
  sub,
  icon,
}: {
  x: number;
  y: number;
  color: string;
  title: string;
  sub: string;
  icon: string;
}) {
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={35}
        fill={`${color}18`}
        stroke={color}
        strokeWidth="2.5"
      />
      <circle
        cx={x + 23}
        cy={y - 24}
        r={12}
        fill={color}
        stroke="#fff"
        strokeWidth="2"
      />
      <text
        x={x + 23}
        y={y - 20}
        textAnchor="middle"
        fill="#fff"
        fontSize="8"
        fontWeight="600"
      >
        {icon}
      </text>
      <text
        x={x}
        y={y + 1}
        textAnchor="middle"
        fill={color}
        fontSize="12"
        fontWeight="600"
      >
        {title}
      </text>
      <text
        x={x}
        y={y + 17}
        textAnchor="middle"
        fill={INK_MUTED}
        fontSize="10"
        fontWeight="500"
      >
        {sub}
      </text>
    </g>
  );
}

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
          fontWeight: 950,
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
          fontWeight: 950,
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

function buttonStyle(active: boolean): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? BLUE : HAIRLINE}`,
    borderRadius: 8,
    background: active ? BLUE : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.55rem 0.75rem",
    fontWeight: 850,
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
    fontWeight: 850,
    cursor: "pointer",
  };
}

function choiceCardStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "grid",
    gap: "0.35rem",
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}16` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.72rem",
    cursor: "pointer",
    minHeight: 118,
  };
}

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 900,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
