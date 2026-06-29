"use client";

import { useMemo, useState } from "react";
import { CalendarDays, CircleDot, Clock3, Moon, RotateCcw, Sigma, SunMedium, Swords, Table2 } from "lucide-react";
import { grahas, ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from "../../chrome/typography";
import {
  KALA_BALA_COMPONENTS,
  KALA_BALA_GROUPS,
  KALA_BALA_PRESETS,
  defaultKalaBalaValues,
  getKalaBalaComponent,
  getKalaBalaGroup,
  sumKalaBala,
  type KalaBalaComponent,
  type KalaBalaGroup,
  type KalaBalaValues,
} from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";

const GROUP_COLORS: Record<KalaBalaGroup, string> = {
  diurnal: grahas.surya.primary,
  lunar: grahas.candra.primary,
  calendar: grahas.budha.primary,
  solar: grahas.guru.primary,
  event: grahas.mangala.primary,
};

const GROUP_ICONS = {
  diurnal: Clock3,
  lunar: Moon,
  calendar: CalendarDays,
  solar: SunMedium,
  event: Swords,
} satisfies Record<KalaBalaGroup, typeof Clock3>;

type GroupFilter = "all" | KalaBalaGroup;

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function polar(cx: number, cy: number, radius: number, angle: number) {
  const radians = (angle - 90) * (Math.PI / 180);
  return { x: cx + Math.cos(radians) * radius, y: cy + Math.sin(radians) * radius };
}

function TemporalMandala({
  selected,
  values,
  filter,
  onSelect,
}: {
  selected: KalaBalaComponent;
  values: KalaBalaValues;
  filter: GroupFilter;
  onSelect: (slug: string) => void;
}) {
  const cx = 248;
  const cy = 226;
  const total = sumKalaBala(values);
  const nodes = KALA_BALA_COMPONENTS.map((component, index) => {
    const angle = -8 + index * 40;
    const point = polar(cx, cy, 128, angle);
    const label = polar(cx, cy, 158, angle);
    return { component, angle, point, label };
  });

  return (
    <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 640 500" className="mx-auto h-auto w-full" role="img" aria-label="Nine Kala Bala sub-components grouped around total temporal strength">
        <rect x="18" y="18" width="604" height="464" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="42" y="52" fill={ink.goldAccent} fontSize="12" fontWeight="900" letterSpacing="1.1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          NINE TIME SOURCES, ONE SUM
        </text>

        <circle cx={cx} cy={cy} r="162" fill={SURFACE} stroke={HAIRLINE} />
        <circle cx={cx} cy={cy} r="128" fill="rgba(232, 199, 114, 0.08)" stroke={HAIRLINE} strokeDasharray="5 8" />
        <circle cx={cx} cy={cy} r="78" fill="rgba(255, 249, 234, 0.72)" stroke={HAIRLINE} />

        {nodes.map(({ component, angle, point, label }) => {
          const color = GROUP_COLORS[component.group];
          const active = selected.slug === component.slug;
          const dimmed = filter !== "all" && filter !== component.group;
          const score = values[component.slug] ?? 0;
          const stem = polar(cx, cy, 102, angle);
          return (
            <g
              key={component.slug}
              role="button"
              tabIndex={0}
              aria-label={`Select ${component.iast}`}
              onClick={() => onSelect(component.slug)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") onSelect(component.slug);
              }}
              style={{ cursor: "pointer", opacity: dimmed ? 0.3 : 1 }}
            >
              <line x1={stem.x} y1={stem.y} x2={point.x} y2={point.y} stroke={active ? color : HAIRLINE} strokeWidth={active ? 2.5 : 1.5} />
              <circle cx={point.x} cy={point.y} r={active ? 24 : 19} fill={active ? wash(color, "22") : SURFACE} stroke={active ? color : HAIRLINE} strokeWidth={active ? 2.5 : 1.2} />
              <text x={point.x} y={point.y - 2} textAnchor="middle" fill={active ? color : INK_PRIMARY} fontSize="14" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {component.number}
              </text>
              <text x={point.x} y={point.y + 13} textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {score}v
              </text>
              <text x={label.x} y={label.y - 2} textAnchor="middle" fill={active ? color : INK_SECONDARY} fontSize={active ? 11 : 10} fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {component.name}
              </text>
            </g>
          );
        })}

        <circle cx={cx} cy={cy} r="56" fill={SURFACE} stroke="var(--gl-gold-accent)" strokeWidth="2.5" />
        <text x={cx} y={cy - 18} textAnchor="middle" fill={ink.goldAccent} fontSize="11" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          KALA BALA
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill={INK_PRIMARY} fontSize="34" fontWeight="900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
          {total}
        </text>
        <text x={cx} y={cy + 31} textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          virupas / {Math.round(total / 60 * 100) / 100} rupas
        </text>

        {KALA_BALA_GROUPS.map((group, index) => {
          const color = GROUP_COLORS[group.slug];
          const x = 456;
          const y = 96 + index * 30;
          const active = filter === "all" || filter === group.slug;
          return (
            <g key={group.slug} opacity={active ? 1 : 0.35}>
              <circle cx={x} cy={y} r="6" fill={wash(color, "36")} stroke={color} />
              <text x={x + 15} y={y + 4} fill={INK_SECONDARY} fontSize="11" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {group.shortLabel}
              </text>
            </g>
          );
        })}

        <text x="320" y="460" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          The diagram is structural: exact sub-formulas are computed by the Astro Engine.
        </text>
      </svg>
    </section>
  );
}

export function KalaBalaOverview() {
  const [selectedSlug, setSelectedSlug] = useState(KALA_BALA_COMPONENTS[0].slug);
  const [filter, setFilter] = useState<GroupFilter>("all");
  const [values, setValues] = useState<KalaBalaValues>(() => defaultKalaBalaValues());
  const selected = getKalaBalaComponent(selectedSlug);
  const selectedGroup = getKalaBalaGroup(selected.group);
  const selectedColor = GROUP_COLORS[selected.group];
  const total = useMemo(() => sumKalaBala(values), [values]);
  const filteredComponents = useMemo(
    () => KALA_BALA_COMPONENTS.filter((component) => filter === "all" || component.group === filter),
    [filter],
  );

  function applyPreset(presetSlug: string) {
    const preset = KALA_BALA_PRESETS.find((item) => item.slug === presetSlug) ?? KALA_BALA_PRESETS[0];
    setValues({ ...preset.values });
    setSelectedSlug(KALA_BALA_COMPONENTS[0].slug);
    setFilter("all");
  }

  function updateSelectedValue(value: number) {
    setValues((current) => ({ ...current, [selected.slug]: value }));
  }

  function reset() {
    setValues(defaultKalaBalaValues());
    setSelectedSlug("nathonnata");
    setFilter("all");
  }

  return (
    <div
      className="w-full min-w-0 space-y-5"
      data-interactive="kala-bala-overview"
      style={{
        background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))",
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 16,
        padding: 20,
        color: INK_PRIMARY,
        boxSizing: "border-box",
      }}
    >
      <div className="mb-5 flex flex-col gap-4">
        <div>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
            Temporal strength ledger
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            <IAST>Kāla Bala</IAST>: nine clocks feeding one score
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Group the nine sub-components, adjust an illustrative virupa ledger, and watch the total prove the lesson: temporal strength is a sum, not one shortcut.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex self-start items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset overview
        </button>
      </div>

      <div className="grid gap-4">
        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <CircleDot size={17} color={ink.goldAccent} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
              Group by time dimension
            </p>
          </div>
          <div className="grid min-w-0 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {(["all", ...KALA_BALA_GROUPS.map((group) => group.slug)] as GroupFilter[]).map((item) => {
              const active = filter === item;
              const color = item === "all" ? ink.goldAccent : GROUP_COLORS[item];
              const Icon = item === "all" ? Sigma : GROUP_ICONS[item];
              const label = item === "all" ? "All nine" : getKalaBalaGroup(item).shortLabel;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-bold"
                  style={{ background: active ? wash(color, "18") : SURFACE_2, border: `1px solid ${active ? color : HAIRLINE}`, color: active ? color : INK_SECONDARY }}
                >
                  <Icon size={16} />
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        <div className="grid min-w-0 gap-4">
          <TemporalMandala selected={selected} values={values} filter={filter} onSelect={setSelectedSlug} />

          <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex min-w-0 items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="m-0 text-xs font-bold uppercase" style={{ color: selectedColor, letterSpacing: "0.08em" }}>
                  Selected component
                </p>
                <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                  <IAST>{selected.iast}</IAST>
                </h3>
                <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>
                  {selected.measures}
                </p>
              </div>
              <Devanagari size="md" className="shrink-0 opacity-80" style={{ color: selectedColor }}>
                {selected.devanagari}
              </Devanagari>
            </div>

            <div className="mt-5 min-w-0 rounded-xl p-4" style={{ background: wash(selectedColor, "10"), border: `1px solid ${selectedColor}44` }}>
              <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>
                    Illustrative virupas for this part
                  </p>
                  <p className="m-0 text-xs" style={{ color: INK_MUTED }}>
                    This is a teaching ledger; engine formulas supply the real values.
                  </p>
                </div>
                <span className="rounded-full px-3 py-1 text-xs font-bold uppercase" style={{ background: SURFACE, color: selectedColor, border: `1px solid ${selectedColor}` }}>
                  {values[selected.slug] ?? 0} virupas
                </span>
              </div>
              <input
                type="range"
                min={selected.slug === "yuddha" ? -30 : 0}
                max={60}
                step={1}
                value={values[selected.slug] ?? 0}
                onChange={(event) => updateSelectedValue(Number(event.target.value))}
                className="w-full accent-[var(--gl-gold-accent)]"
                aria-label={`${selected.name} illustrative virupas`}
              />
              <p className="mt-3 text-sm" style={{ color: INK_SECONDARY }}>
                <strong>{selectedGroup.label}:</strong> {selectedGroup.teaching}
              </p>
            </div>

            <div className="mt-4 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
              <div className="flex items-center gap-2">
                <Sigma size={17} color={ink.goldAccent} />
                <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                  Running sum
                </p>
              </div>
              <p className="mt-3 text-5xl font-bold" style={{ color: ink.goldAccent, fontFamily: "var(--font-cormorant), serif" }}>
                {total}
              </p>
              <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>
                total virupas = {Math.round(total / 60 * 100) / 100} rupas
              </p>
            </div>
          </section>
        </div>

        <section className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 min-w-0">
          {KALA_BALA_PRESETS.map((preset) => (
            <button
              key={preset.slug}
              type="button"
              onClick={() => applyPreset(preset.slug)}
              className="rounded-xl p-4 text-left min-w-0"
              style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
            >
              <p className="m-0 text-sm font-bold" style={{ color: ink.goldAccent }}>
                {preset.label}
              </p>
              <p className="mt-1 text-sm break-words" style={{ color: INK_SECONDARY }}>
                {preset.description}
              </p>
            </button>
          ))}
        </section>

        <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 min-w-0">
          <article className="rounded-xl p-4 min-w-0" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
              Nine parts
            </p>
            <p className="mt-3 text-sm break-words" style={{ color: INK_SECONDARY }}>
              Nathonnata, Paksha, Tribhaga, Abda, Masa, Vara, Hora, Ayana, and Yuddha are separate temporal checks.
            </p>
          </article>
          <article className="rounded-xl p-4 min-w-0" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
              Distinct dimensions
            </p>
            <p className="mt-3 text-sm break-words" style={{ color: INK_SECONDARY }}>
              Diurnal, lunar, calendar, solar, and war/event timing are not interchangeable.
            </p>
          </article>
          <article className="rounded-xl p-4 min-w-0" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
              Engine discipline
            </p>
            <p className="mt-3 text-sm break-words" style={{ color: INK_SECONDARY }}>
              The learner should name and group the parts here; exact formula work belongs to verified computation.
            </p>
          </article>
        </section>

        <section className="rounded-xl p-4 min-w-0" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Table2 size={17} color={ink.goldAccent} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Nine sub-components reference
              </p>
            </div>
            <p className="m-0 text-sm font-bold" style={{ color: INK_SECONDARY }}>
              Showing {filteredComponents.length} of 9
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead style={{ background: SURFACE_2 }}>
                <tr>
                  {["#", "Sub-component", "Dimension", "Measures", "Sample", "Engine note"].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: INK_SECONDARY, letterSpacing: "0.06em" }}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredComponents.map((component) => {
                  const color = GROUP_COLORS[component.group];
                  const active = component.slug === selected.slug;
                  return (
                    <tr
                      key={component.slug}
                      onClick={() => setSelectedSlug(component.slug)}
                      className="cursor-pointer"
                      style={{ background: active ? wash(color, "12") : SURFACE, borderTop: `1px solid ${HAIRLINE}` }}
                    >
                      <td className="px-4 py-3 font-bold" style={{ color }}>
                        {component.number}
                      </td>
                      <td className="px-4 py-3">
                        <p className="m-0 font-bold" style={{ color: active ? color : INK_PRIMARY }}>
                          <IAST>{component.iast}</IAST>
                        </p>
                        <p className="m-0 text-xs" style={{ color: INK_MUTED }}>
                          {component.devanagari}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: wash(color, "16"), color, border: `1px solid ${color}55` }}>
                          {getKalaBalaGroup(component.group).shortLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>
                        {component.measures}
                      </td>
                      <td className="px-4 py-3 font-bold" style={{ color }}>
                        {values[component.slug] ?? 0}v
                      </td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>
                        {component.engineNote}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
