"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Heart,
  Info,
  MapPin,
  Moon,
  RefreshCw,
  Scale,
  Sparkles,
  Star,
  Sun,
  XCircle,
} from "lucide-react";
import { workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type LagnaKey =
  | "aries"
  | "taurus"
  | "gemini"
  | "cancer"
  | "leo"
  | "virgo"
  | "libra"
  | "scorpio"
  | "sagittarius"
  | "capricorn"
  | "aquarius"
  | "pisces";

type Preference = "favoured" | "acceptable" | "avoided";

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

const LAGNAS: Record<
  LagnaKey,
  {
    label: string;
    startLongitude: number;
    preference: Preference;
    prefColor: string;
    signLord: string;
  }
> = {
  aries: { label: "Aries", startLongitude: 0, preference: "acceptable", prefColor: BLUE, signLord: "Mars" },
  taurus: { label: "Taurus", startLongitude: 30, preference: "favoured", prefColor: GREEN, signLord: "Venus" },
  gemini: { label: "Gemini", startLongitude: 60, preference: "acceptable", prefColor: BLUE, signLord: "Mercury" },
  cancer: { label: "Cancer", startLongitude: 90, preference: "favoured", prefColor: GREEN, signLord: "Moon" },
  leo: { label: "Leo", startLongitude: 120, preference: "acceptable", prefColor: BLUE, signLord: "Sun" },
  virgo: { label: "Virgo", startLongitude: 150, preference: "acceptable", prefColor: BLUE, signLord: "Mercury" },
  libra: { label: "Libra", startLongitude: 180, preference: "favoured", prefColor: GREEN, signLord: "Venus" },
  scorpio: { label: "Scorpio", startLongitude: 210, preference: "avoided", prefColor: VERMILION, signLord: "Mars" },
  sagittarius: { label: "Sagittarius", startLongitude: 240, preference: "acceptable", prefColor: BLUE, signLord: "Jupiter" },
  capricorn: { label: "Capricorn", startLongitude: 270, preference: "acceptable", prefColor: BLUE, signLord: "Saturn" },
  aquarius: { label: "Aquarius", startLongitude: 300, preference: "avoided", prefColor: VERMILION, signLord: "Saturn" },
  pisces: { label: "Pisces", startLongitude: 330, preference: "acceptable", prefColor: BLUE, signLord: "Jupiter" },
};

const PLANET_LONGITUDES = {
  moon: 52.5,
  jupiter: 100,
  venus: 275,
};

const PLANET_META: Record<
  keyof typeof PLANET_LONGITUDES,
  { label: string; color: string; icon: typeof Moon }
> = {
  moon: { label: "Moon", color: BLUE, icon: Moon },
  jupiter: { label: "Jupiter", color: GREEN, icon: Star },
  venus: { label: "Venus", color: GOLD, icon: Heart },
};

const CANDRA_FAVOURABLE = new Set([1, 2, 3, 6, 7, 10, 11]);
const JUPITER_FAVOURABLE = new Set([1, 4, 5, 7, 9, 10]);
const VENUS_FAVOURABLE = new Set([1, 4, 5, 7, 9, 10, 11]);

function houseFromLagna(planetLongitude: number, lagnaLongitude: number): number {
  const diff = (planetLongitude - lagnaLongitude + 360) % 360;
  return Math.floor(diff / 30) + 1;
}

function isFavourable(planet: keyof typeof PLANET_LONGITUDES, house: number): boolean {
  if (planet === "moon") return CANDRA_FAVOURABLE.has(house);
  if (planet === "jupiter") return JUPITER_FAVOURABLE.has(house);
  return VENUS_FAVOURABLE.has(house);
}

function preferenceScore(preference: Preference): number {
  if (preference === "favoured") return 1;
  if (preference === "avoided") return -1;
  return 0;
}

function computeMoment(lagnaKey: LagnaKey) {
  const lagna = LAGNAS[lagnaKey];
  const lagnaLongitude = lagna.startLongitude + 5;

  const moonHouse = houseFromLagna(PLANET_LONGITUDES.moon, lagnaLongitude);
  const jupiterHouse = houseFromLagna(PLANET_LONGITUDES.jupiter, lagnaLongitude);
  const venusHouse = houseFromLagna(PLANET_LONGITUDES.venus, lagnaLongitude);

  const moonOk = isFavourable("moon", moonHouse);
  const jupiterOk = isFavourable("jupiter", jupiterHouse);
  const venusOk = isFavourable("venus", venusHouse);

  const score =
    (moonOk ? 1 : 0) +
    (jupiterOk ? 1 : 0) +
    (venusOk ? 1 : 0) +
    preferenceScore(lagna.preference);

  return {
    lagnaKey,
    lagna,
    lagnaLongitude,
    moon: { house: moonHouse, ok: moonOk },
    jupiter: { house: jupiterHouse, ok: jupiterOk },
    venus: { house: venusHouse, ok: venusOk },
    score,
  };
}

type Moment = ReturnType<typeof computeMoment>;

function MiniWheel({ moment, label }: { moment: Moment; label: string }) {
  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const r = 58;

  const planetAngles = useMemo(() => {
    return (Object.keys(PLANET_LONGITUDES) as (keyof typeof PLANET_LONGITUDES)[]).map(
      (key) => {
        const longitude = PLANET_LONGITUDES[key];
        const diff = (longitude - moment.lagnaLongitude + 360) % 360;
        const rad = ((diff - 90) * Math.PI) / 180;
        return { key, rad, ...PLANET_META[key] };
      }
    );
  }, [moment.lagnaLongitude]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`${label} lagna wheel for ${moment.lagna.label}`}
      >
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={HAIRLINE}
          strokeWidth={1}
        />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
          const a = ((i * 30 - 90) * Math.PI) / 180;
          const x1 = cx + (r - 6) * Math.cos(a);
          const y1 = cy + (r - 6) * Math.sin(a);
          const x2 = cx + r * Math.cos(a);
          const y2 = cy + r * Math.sin(a);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={INK_MUTED}
              strokeWidth={1}
            />
          );
        })}
        <text
          x={cx}
          y={cy - r + 18}
          textAnchor="middle"
          fontSize={10}
          fill={INK_PRIMARY}
          fontWeight={500}
        >
          Lagna
        </text>
        <polygon
          points={`${cx},${cy - r - 6} ${cx - 5},${cy - r + 4} ${cx + 5},${cy - r + 4}`}
          fill={PURPLE}
        />
        {planetAngles.map(({ key, rad, color, icon: Icon }) => {
          const x = cx + (r - 22) * Math.cos(rad);
          const y = cy + (r - 22) * Math.sin(rad);
          return (
            <g key={key}>
              <circle cx={x} cy={y} r={10} fill={SURFACE} stroke={color} strokeWidth={2} />
              <foreignObject x={x - 6} y={y - 6} width={12} height={12}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color,
                    width: 12,
                    height: 12,
                  }}
                >
                  <Icon size={10} />
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>
      <span style={{ fontSize: "0.75rem", color: INK_MUTED, fontWeight: 500 }}>
        {label} — {moment.lagna.label} lagna
      </span>
    </div>
  );
}

function PreferenceBadge({ preference, color }: { preference: Preference; color: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.25rem",
        padding: "0.125rem 0.5rem",
        borderRadius: "9999px",
        border: `1px solid ${color}`,
        color,
        fontSize: "0.7rem",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.03em",
      }}
    >
      {preference === "favoured" && <CheckCircle2 size={10} />}
      {preference === "avoided" && <XCircle size={10} />}
      {preference === "acceptable" && <Info size={10} />}
      {preference}
    </span>
  );
}

function PlanetRow({
  planet,
  house,
  ok,
}: {
  planet: keyof typeof PLANET_LONGITUDES;
  house: number;
  ok: boolean;
}) {
  const meta = PLANET_META[planet];
  const Icon = meta.icon;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.5rem 0",
        borderBottom: `1px solid ${HAIRLINE}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Icon size={14} color={meta.color} />
        <span style={{ fontSize: "0.875rem", color: INK_PRIMARY, fontWeight: 500 }}>
          {meta.label}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ fontSize: "0.875rem", color: INK_SECONDARY, fontWeight: 500 }}>
          House {house}
        </span>
        <span
          style={{
            fontSize: "0.7rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.03em",
            color: ok ? GREEN : VERMILION,
          }}
        >
          {ok ? "favourable" : "less favourable"}
        </span>
      </div>
    </div>
  );
}

function MomentCard({
  label,
  moment,
  value,
  onChange,
}: {
  label: string;
  moment: Moment;
  value: LagnaKey;
  onChange: (key: LagnaKey) => void;
}) {
  return (
    <div
      style={{
        background: SURFACE,
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 8,
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.75rem",
        }}
      >
        <span
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: INK_MUTED,
          }}
        >
          {label}
        </span>
        <PreferenceBadge preference={moment.lagna.preference} color={moment.lagna.prefColor} />
      </div>

      <div style={{ position: "relative" }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as LagnaKey)}
          style={{
            width: "100%",
            padding: "0.5rem 2rem 0.5rem 0.75rem",
            borderRadius: 6,
            border: `1px solid ${HAIRLINE}`,
            background: "transparent",
            color: INK_PRIMARY,
            fontSize: "0.875rem",
            fontWeight: 500,
            appearance: "none",
            cursor: "pointer",
          }}
        >
          {(Object.keys(LAGNAS) as LagnaKey[]).map((key) => (
            <option key={key} value={key}>
              {LAGNAS[key].label} — lord {LAGNAS[key].signLord}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          color={INK_MUTED}
          style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)" }}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "0.5rem 0",
        }}
      >
        <MiniWheel moment={moment} label={label} />
      </div>

      <div>
        <PlanetRow planet="moon" house={moment.moon.house} ok={moment.moon.ok} />
        <PlanetRow planet="jupiter" house={moment.jupiter.house} ok={moment.jupiter.ok} />
        <PlanetRow planet="venus" house={moment.venus.house} ok={moment.venus.ok} />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "0.25rem",
        }}
      >
        <span style={{ fontSize: "0.75rem", color: INK_MUTED, fontWeight: 500 }}>
          Moment score
        </span>
        <span
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            color: moment.score >= 3 ? GREEN : moment.score >= 1 ? GOLD : VERMILION,
          }}
        >
          {moment.score}
        </span>
      </div>
    </div>
  );
}

function SequencingRibbon() {
  const stepStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 0.75rem",
    borderRadius: 6,
    border: `1px solid ${HAIRLINE}`,
    background: SURFACE,
    fontSize: "0.8rem",
    fontWeight: 500,
    color: INK_PRIMARY,
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.75rem",
        borderRadius: 8,
        border: `1px solid ${HAIRLINE}`,
        background: SURFACE,
      }}
    >
      <span style={stepStyle}>
        <Heart size={14} color={VERMILION} />
        T2-04 compatibility match
      </span>
      <ArrowRight size={14} color={INK_MUTED} />
      <span style={stepStyle}>
        <CalendarDayIcon />
        Favourable day (Candidate 3)
      </span>
      <ArrowRight size={14} color={INK_MUTED} />
      <span
        style={{
          ...stepStyle,
          borderColor: PURPLE,
          color: PURPLE,
        }}
      >
        <Sparkles size={14} />
        Moment search (this workbench)
      </span>
    </div>
  );
}

function CalendarDayIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth={2}>
      <rect x={3} y={4} width={18} height={18} rx={2} />
      <line x1={16} y1={2} x2={16} y2={6} />
      <line x1={8} y1={2} x2={8} y2={6} />
      <line x1={3} y1={10} x2={21} y2={10} />
    </svg>
  );
}

export function SynastrySensitiveMomentWorkbench() {
  const [lagnaA, setLagnaA] = useState<LagnaKey>("scorpio");
  const [lagnaB, setLagnaB] = useState<LagnaKey>("pisces");

  const momentA = useMemo(() => computeMoment(lagnaA), [lagnaA]);
  const momentB = useMemo(() => computeMoment(lagnaB), [lagnaB]);

  const { winner, reason } = useMemo(() => {
    if (momentB.score > momentA.score) {
      return { winner: "B" as const, reason: "higher moment score" };
    }
    if (momentA.score > momentB.score) {
      return { winner: "A" as const, reason: "higher moment score" };
    }
    if (momentB.lagna.preference === "acceptable" && momentA.lagna.preference === "avoided") {
      return { winner: "B" as const, reason: "better lagna-sign preference tier" };
    }
    if (momentA.lagna.preference === "acceptable" && momentB.lagna.preference === "avoided") {
      return { winner: "A" as const, reason: "better lagna-sign preference tier" };
    }
    return { winner: "tie" as const, reason: "no decisive difference" };
  }, [momentA, momentB]);

  function handleReset() {
    setLagnaA("scorpio");
    setLagnaB("pisces");
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        color: INK_PRIMARY,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: "1rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Sparkles size={18} color={GOLD} />
            Synastry-Sensitive Moment Workbench
          </h3>
          <p style={{ margin: "0.25rem 0 0", fontSize: "0.875rem", color: INK_SECONDARY }}>
            Candidate 3&apos;s pañcāṅga/tārā-bala foundation is fixed. Sweep the lagna and watch
            Venus, Jupiter, and the Moon shift house.
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            padding: "0.375rem 0.75rem",
            borderRadius: 6,
            border: `1px solid ${HAIRLINE}`,
            background: "transparent",
            color: INK_PRIMARY,
            fontSize: "0.8rem",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          <RefreshCw size={14} />
          Reset to Scorpio vs Pisces
        </button>
      </div>

      <SequencingRibbon />

      <div
        style={{
          background: SURFACE,
          border: `1px solid ${HAIRLINE}`,
          borderRadius: 8,
          padding: "0.75rem 1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "0.8rem",
          color: INK_SECONDARY,
        }}
      >
        <Info size={14} color={INK_MUTED} />
        <span>
          Compatibility-matching is already settled before this stage. This workbench only refines
          the moment within an already-favourable day.
        </span>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <MomentCard label="Moment A" moment={momentA} value={lagnaA} onChange={setLagnaA} />
        <MomentCard label="Moment B" moment={momentB} value={lagnaB} onChange={setLagnaB} />
      </div>

      <div
        style={{
          background: SURFACE,
          border: `1px solid ${HAIRLINE}`,
          borderRadius: 8,
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        <h4
          style={{
            margin: 0,
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: INK_MUTED,
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
          }}
        >
          <Scale size={14} />
          Side-by-side comparison
        </h4>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.875rem",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "0.5rem",
                    borderBottom: `1px solid ${HAIRLINE}`,
                    color: INK_MUTED,
                    fontWeight: 600,
                  }}
                >
                  Factor
                </th>
                <th
                  style={{
                    textAlign: "center",
                    padding: "0.5rem",
                    borderBottom: `1px solid ${HAIRLINE}`,
                    color: INK_PRIMARY,
                    fontWeight: 600,
                  }}
                >
                  Moment A ({LAGNAS[lagnaA].label})
                </th>
                <th
                  style={{
                    textAlign: "center",
                    padding: "0.5rem",
                    borderBottom: `1px solid ${HAIRLINE}`,
                    color: INK_PRIMARY,
                    fontWeight: 600,
                  }}
                >
                  Moment B ({LAGNAS[lagnaB].label})
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "0.5rem", borderBottom: `1px solid ${HAIRLINE}` }}>
                  Tithi / nakṣatra / tārā-bala
                </td>
                <td
                  colSpan={2}
                  style={{
                    textAlign: "center",
                    padding: "0.5rem",
                    borderBottom: `1px solid ${HAIRLINE}`,
                    color: INK_SECONDARY,
                  }}
                >
                  Pūrṇā / Rohiṇī / Sampat + Sādhaka — identical for both moments
                </td>
              </tr>
              <ComparisonRow
                label="Candra-bala"
                a={momentA.moon}
                b={momentB.moon}
                reason={(h) => (CANDRA_FAVOURABLE.has(h) ? "favourable" : "less favourable")}
              />
              <ComparisonRow
                label="Jupiter house"
                a={momentA.jupiter}
                b={momentB.jupiter}
                reason={(h) => (JUPITER_FAVOURABLE.has(h) ? "kendra/trikoṇa" : "less favourable")}
              />
              <ComparisonRow
                label="Venus house"
                a={momentA.venus}
                b={momentB.venus}
                reason={(h) => (VENUS_FAVOURABLE.has(h) ? "kendra/trikoṇa/upachaya" : "less favourable")}
              />
              <tr>
                <td style={{ padding: "0.5rem", borderBottom: `1px solid ${HAIRLINE}` }}>
                  Lagna-sign preference
                </td>
                <td
                  style={{
                    textAlign: "center",
                    padding: "0.5rem",
                    borderBottom: `1px solid ${HAIRLINE}`,
                    color: momentA.lagna.prefColor,
                    fontWeight: 600,
                    textTransform: "capitalize",
                  }}
                >
                  {momentA.lagna.preference}
                </td>
                <td
                  style={{
                    textAlign: "center",
                    padding: "0.5rem",
                    borderBottom: `1px solid ${HAIRLINE}`,
                    color: momentB.lagna.prefColor,
                    fontWeight: 600,
                    textTransform: "capitalize",
                  }}
                >
                  {momentB.lagna.preference}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0.5rem" }}>Moment score</td>
                <td
                  style={{
                    textAlign: "center",
                    padding: "0.5rem",
                    fontWeight: 700,
                    color: momentA.score >= 3 ? GREEN : momentA.score >= 1 ? GOLD : VERMILION,
                  }}
                >
                  {momentA.score}
                </td>
                <td
                  style={{
                    textAlign: "center",
                    padding: "0.5rem",
                    fontWeight: 700,
                    color: momentB.score >= 3 ? GREEN : momentB.score >= 1 ? GOLD : VERMILION,
                  }}
                >
                  {momentB.score}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div
        style={{
          background:
            winner === "B"
              ? "rgba(47,125,85,0.08)"
              : winner === "A"
                ? "rgba(47,125,85,0.08)"
                : SURFACE,
          border: `1px solid ${winner === "tie" ? HAIRLINE : GREEN}`,
          borderRadius: 8,
          padding: "1rem",
          display: "flex",
            flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <h4
          style={{
            margin: 0,
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: winner === "tie" ? INK_MUTED : GREEN,
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
          }}
        >
          <MapPin size={14} />
          Refined recommendation
        </h4>
        {winner === "tie" ? (
          <p style={{ margin: 0, fontSize: "0.875rem", color: INK_SECONDARY }}>
            Both moments score equally on the available axes. In full practice, couple-specific
            synastry sensitivities from T2-04 would break the tie.
          </p>
        ) : (
          <p style={{ margin: 0, fontSize: "0.875rem", color: INK_PRIMARY }}>
            Prefer <strong style={{ color: GREEN }}>Moment {winner}</strong> ({LAGNAS[winner === "A" ? lagnaA : lagnaB].label}{" "}
            lagna) — {reason}. The day itself remains Candidate 3; only the within-day window changes.
          </p>
        )}
      </div>

      <div
        style={{
          background: SURFACE,
          border: `1px solid ${HAIRLINE}`,
          borderRadius: 8,
          padding: "0.75rem 1rem",
          fontSize: "0.8rem",
          color: INK_SECONDARY,
        }}
      >
        <Sun size={14} color={GOLD} style={{ display: "inline", marginRight: 6 }} />
        This comparison uses general wedding doctrine. Couple-specific findings from T2-04 would be
        folded into the same within-day search in full practice, but are not fabricated here.
      </div>
    </div>
  );
}

function ComparisonRow({
  label,
  a,
  b,
  reason,
}: {
  label: string;
  a: { house: number; ok: boolean };
  b: { house: number; ok: boolean };
  reason: (house: number) => string;
}) {
  return (
    <tr>
      <td style={{ padding: "0.5rem", borderBottom: `1px solid ${HAIRLINE}` }}>{label}</td>
      <td
        style={{
          textAlign: "center",
          padding: "0.5rem",
          borderBottom: `1px solid ${HAIRLINE}`,
          color: a.ok ? GREEN : VERMILION,
          fontWeight: 600,
        }}
      >
        House {a.house} — {reason(a.house)}
      </td>
      <td
        style={{
          textAlign: "center",
          padding: "0.5rem",
          borderBottom: `1px solid ${HAIRLINE}`,
          color: b.ok ? GREEN : VERMILION,
          fontWeight: 600,
        }}
      >
        House {b.house} — {reason(b.house)}
      </td>
    </tr>
  );
}
