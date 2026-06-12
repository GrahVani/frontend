"use client";

import { useState } from "react";
import { ArrowDownWideNarrow, CheckCircle2, CircleDot, GitBranch, RotateCcw, SlidersHorizontal, Table2 } from "lucide-react";
import { grahas, ink, type GrahaSlug } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from "../../chrome/typography";
import { formatDegree } from "../cara-karaka-ranker/data";
import { ROLE_ASSIGNER_PLANETS, ROLE_COMPARISONS, ROLE_SEQUENCE, rankRoleAssignerPlanets, type RoleAssignerPlanet } from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";
const GOLD = ink.goldAccent;

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

/** Darken pale graha colors so they remain readable on cream/parchment backgrounds. */
function readableColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  if (luminance > 0.72) {
    const scale = (c: number) => Math.round(c * 0.5).toString(16).padStart(2, "0");
    return `#${scale(r)}${scale(g)}${scale(b)}`;
  }
  return hex;
}

function RoleRailSvg({
  ranked,
  selectedRoleShort,
  onSelectRole,
}: {
  ranked: ReturnType<typeof rankRoleAssignerPlanets>;
  selectedRoleShort: string;
  onSelectRole: (roleShort: string) => void;
}) {
  return (
    <section className="w-full min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 900 300" className="h-auto w-full min-w-0" role="img" aria-label="Seven cara karaka roles assigned from highest to lowest degree">
        <rect x="22" y="22" width="856" height="244" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="450" y="54" textAnchor="middle" fill={GOLD} fontSize="13" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          FIXED ROLE ORDER, VARIABLE PLANET CASTING
        </text>
        <line x1="100" y1="116" x2="800" y2="116" stroke={HAIRLINE} strokeWidth="10" strokeLinecap="round" />
        <text x="100" y="94" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          highest degree
        </text>
        <text x="800" y="94" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          lowest degree
        </text>

        {ranked.map(({ planet, role }, index) => {
          const color = grahas[planet.slug].primary;
          const active = role.short === selectedRoleShort;
          const x = 100 + index * 116;
          return (
            <g
              key={role.short}
              role="button"
              tabIndex={0}
              onClick={() => onSelectRole(role.short)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") onSelectRole(role.short);
              }}
              style={{ cursor: "pointer" }}
            >
              <circle cx={x} cy="116" r={active ? 16 : 11} fill={active ? wash(color, "1A") : SURFACE} stroke={active ? color : HAIRLINE} strokeWidth={active ? 3 : 1.5} />
              <rect x={x - 48} y="148" width="96" height="70" rx="14" fill={active ? wash(color, "12") : SURFACE} stroke={active ? color : HAIRLINE} strokeWidth={active ? 2.2 : 1.2} />
              <text x={x} y="170" textAnchor="middle" fill={readableColor(color)} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {role.short}
              </text>
              <text x={x} y="190" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {planet.label}
              </text>
              <text x={x} y="207" textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {formatDegree(planet.degree)}
              </text>
              <text x={x} y="239" textAnchor="middle" fill={active ? readableColor(color) : INK_SECONDARY} fontSize="9" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                rank {role.rank}
              </text>
            </g>
          );
        })}

        <rect x="258" y="232" width="384" height="28" rx="12" fill="transparent" stroke={HAIRLINE} strokeDasharray="5 6" />
        <text x="450" y="251" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          nudge a degree below: roles swap hands, role meanings stay fixed
        </text>
      </svg>
    </section>
  );
}

function getPlanetBySlug(planets: RoleAssignerPlanet[], slug: GrahaSlug) {
  return planets.find((planet) => planet.slug === slug) ?? planets[0];
}

export function CaraKarakaRoleAssigner() {
  const [planets, setPlanets] = useState<RoleAssignerPlanet[]>(ROLE_ASSIGNER_PLANETS);
  const [selectedRoleShort, setSelectedRoleShort] = useState("AK");
  const ranked = rankRoleAssignerPlanets(planets);
  const selectedAssignment = ranked.find(({ role }) => role.short === selectedRoleShort) ?? ranked[0];
  const selectedPlanet = selectedAssignment.planet;
  const selectedColor = grahas[selectedPlanet.slug].primary;
  const comparison = ROLE_COMPARISONS.find((item) => item.roleShort === selectedRoleShort);

  function updateDegree(slug: GrahaSlug, degree: number) {
    setPlanets((items) => items.map((planet) => (planet.slug === slug ? { ...planet, degree } : planet)));
  }

  function reset() {
    setPlanets(ROLE_ASSIGNER_PLANETS);
    setSelectedRoleShort("AK");
  }

  return (
    <div
      className="w-full min-w-0"
      data-interactive="cara-karaka-role-assigner"
      style={{
        maxWidth: "none",
        background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))",
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 16,
        padding: 20,
        color: INK_PRIMARY,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div className="mb-5 flex flex-col gap-4">
        <div>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
            Cara-karaka role assigner
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Seven fixed roles, newly cast in every chart
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Click a role, then move planetary degrees to see the role stay fixed while the planet wearing it changes.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex self-start items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset role casting
        </button>
      </div>

      <div className="grid min-w-0 gap-4">
        <section className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ROLE_SEQUENCE.map((role) => {
            const assignment = ranked.find((item) => item.role.short === role.short) ?? ranked[role.rank - 1];
            const color = grahas[assignment.planet.slug].primary;
            const active = role.short === selectedRoleShort;
            return (
              <button key={role.short} type="button" onClick={() => setSelectedRoleShort(role.short)} className="min-w-0 rounded-xl p-4 text-left" style={{ background: active ? wash(color, "12") : SURFACE, border: `1px solid ${active ? color : HAIRLINE}` }}>
                {active ? <CheckCircle2 size={17} color={readableColor(color)} /> : <CircleDot size={17} color={INK_MUTED} />}
                <p className="mt-2 text-sm font-bold" style={{ color: readableColor(color) }}>{role.short} · {role.iast}</p>
                <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{role.domain}</p>
              </button>
            );
          })}
        </section>

        <RoleRailSvg ranked={ranked} selectedRoleShort={selectedRoleShort} onSelectRole={setSelectedRoleShort} />

        <section className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(selectedColor, "10"), border: `1px solid ${selectedColor}` }}>
            <div className="flex min-w-0 items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="m-0 text-xs font-bold uppercase" style={{ color: readableColor(selectedColor), letterSpacing: "0.08em" }}>
                  Selected role
                </p>
                <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                  {selectedAssignment.role.short}: <IAST>{selectedAssignment.role.iast}</IAST>
                </h3>
                <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>
                  Cast as {selectedPlanet.label} in this chart
                </p>
                <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>
                  {selectedPlanet.reading}
                </p>
              </div>
              <Devanagari size="md" className="shrink-0 opacity-80" style={{ color: readableColor(selectedColor) }}>
                {selectedAssignment.role.devanagari}
              </Devanagari>
            </div>
            <div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-3">
              <div className="rounded-lg p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
                <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD }}>Occupancy</p>
                <p className="mt-1 text-sm font-bold" style={{ color: INK_PRIMARY }}>House {selectedPlanet.house}</p>
              </div>
              <div className="rounded-lg p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
                <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD }}>Ownership</p>
                <p className="mt-1 text-sm font-bold" style={{ color: INK_PRIMARY }}>{selectedPlanet.owns}</p>
              </div>
              <div className="rounded-lg p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
                <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD }}>Degree rank</p>
                <p className="mt-1 text-sm font-bold" style={{ color: INK_PRIMARY }}>{formatDegree(selectedPlanet.degree)}</p>
              </div>
            </div>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <GitBranch size={17} color={GOLD} />
            <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>Cara plus naisargika</p>
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>
              {comparison ? comparison.reminder : "This role is chart-specific; compare it with the natural significator for the same life area."}
            </p>
            <p className="mt-3 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
              Natural reference
            </p>
            <p className="m-0 text-lg font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
              {comparison?.naturalPlanet ?? selectedPlanet.naisargika}
            </p>
          </article>
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <SlidersHorizontal size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
              Nudge the casting
            </p>
          </div>
          <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {planets.map((planet) => {
              const assignment = ranked.find((item) => item.planet.slug === planet.slug);
              const color = grahas[planet.slug].primary;
              return (
                <div key={planet.slug} className="min-w-0 rounded-lg p-3" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="m-0 text-sm font-bold" style={{ color: readableColor(color) }}>{planet.label}</p>
                    <span className="rounded-full px-2 py-1 text-xs font-bold" style={{ color: readableColor(color), border: `1px solid ${color}`, background: wash(color, "0D") }}>
                      {assignment?.role.short}
                    </span>
                  </div>
                  <input type="range" min="0" max="29.99" step="0.01" value={planet.degree} onChange={(event) => updateDegree(planet.slug, Number(event.target.value))} className="mt-3 w-full" aria-label={`${planet.label} degree`} />
                  <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{formatDegree(getPlanetBySlug(planets, planet.slug).degree)} in {planet.sign}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Table2 size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
              Seven-role assignment table
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
            <table className="w-full min-w-0 border-collapse text-sm">
              <thead style={{ background: SURFACE_2 }}>
                <tr>
                  {["Rank", "Role", "Planet", "Degree", "Life-area", "Read by"].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: INK_SECONDARY, letterSpacing: "0.06em" }}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ranked.map(({ planet, role }) => {
                  const color = grahas[planet.slug].primary;
                  const active = role.short === selectedRoleShort;
                  return (
                    <tr key={role.short} onClick={() => setSelectedRoleShort(role.short)} className="cursor-pointer align-top" style={{ background: active ? wash(color, "0D") : SURFACE, borderTop: `1px solid ${HAIRLINE}` }}>
                      <td className="px-4 py-3 font-bold" style={{ color: readableColor(color) }}>{role.rank}</td>
                      <td className="px-4 py-3 font-bold" style={{ color: readableColor(color) }}>{role.short} / {role.iast}</td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{planet.label}</td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{formatDegree(planet.degree)}</td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{role.domain}</td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>House {planet.house}; owns {planet.owns}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid min-w-0 gap-3 md:grid-cols-3">
          {[
            { icon: ArrowDownWideNarrow, title: "Two poles", text: "Highest degree becomes AK; lowest degree becomes DK." },
            { icon: CheckCircle2, title: "Middle order", text: "AmK, BK, MK, PK, and GK never change sequence." },
            { icon: CircleDot, title: "Seven-role scheme", text: "No separate Pitrkaraka is introduced in this lesson." },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
                <Icon size={17} color={GOLD} />
                <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{item.title}</p>
                <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{item.text}</p>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
}
