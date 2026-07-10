"use client";

import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, CircleDot, Coins, Crown, RotateCcw, Sparkles, Table2 } from "lucide-react";
import { grahas, ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import {
  CLASS_META,
  HOUSE_SET_INFO,
  OVERLAP_CASES,
  classifyRelationship,
  getHouseInfo,
  isWealthHouse,
  type YogaClass,
} from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";
const RAJA = grahas.surya.primary;
const DHANA = grahas.shukra.primary;
const BOTH = grahas.guru.primary;

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function classIcon(yogaClass: YogaClass, color: string) {
  if (yogaClass === "both") return <Sparkles size={17} color={color} />;
  if (yogaClass === "raja-only") return <Crown size={17} color={color} />;
  if (yogaClass === "dhana-only") return <Coins size={17} color={color} />;
  return <CircleDot size={17} color={color} />;
}

function SetOverlapDiagram({
  first,
  second,
  yogaClass,
}: {
  first: number;
  second: number;
  yogaClass: YogaClass;
}) {
  const selected = new Set([first, second]);

  return (
    <section className="mx-auto w-full max-w-[620px] rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 520 350" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label="Raja and dhana yoga overlap map">
        <rect x="18" y="18" width="484" height="310" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="260" y="50" textAnchor="middle" fill={ink.goldAccent} fontSize="12" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          RAJA SET AND DHANA SET OVERLAP
        </text>
        <circle cx="205" cy="178" r="108" fill={wash(RAJA, "13")} stroke={RAJA} strokeWidth="2" />
        <circle cx="315" cy="178" r="108" fill={wash(DHANA, "13")} stroke={DHANA} strokeWidth="2" />
        <text x="170" y="95" textAnchor="middle" fill={RAJA} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          Raja
        </text>
        <text x="170" y="113" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          kendra x trikona
        </text>
        <text x="350" y="95" textAnchor="middle" fill={DHANA} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          Dhana
        </text>
        <text x="350" y="113" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          2 / 5 / 9 / 11
        </text>
        <rect x="224" y="182" width="72" height="46" rx="13" fill={wash(BOTH, "16")} stroke={BOTH} />
        <text x="260" y="202" textAnchor="middle" fill={BOTH} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          5 + 9
        </text>
        <text x="260" y="219" textAnchor="middle" fill={INK_PRIMARY} fontSize="9.5" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          dual
        </text>

        {[
          { house: 4, x: 128, y: 170 },
          { house: 10, x: 146, y: 226 },
          { house: 1, x: 202, y: 246 },
          { house: 5, x: 232, y: 145 },
          { house: 9, x: 288, y: 145 },
          { house: 2, x: 374, y: 170 },
          { house: 11, x: 356, y: 226 },
        ].map((item) => {
          const active = selected.has(item.house);
          const inBoth = item.house === 5 || item.house === 9;
          const color = inBoth ? BOTH : isWealthHouse(item.house) ? DHANA : RAJA;
          return (
            <g key={item.house}>
              <circle cx={item.x} cy={item.y} r={active ? 20 : 17} fill={active ? wash(color, "24") : SURFACE} stroke={active ? color : HAIRLINE} strokeWidth={active ? 2.5 : 1.2} />
              <text x={item.x} y={item.y + 5} textAnchor="middle" fill={active ? color : INK_SECONDARY} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {item.house}
              </text>
            </g>
          );
        })}

        <rect x="82" y="284" width="356" height="30" rx="12" fill={wash(CLASS_META[yogaClass].color, "12")} stroke={CLASS_META[yogaClass].color} />
        <text x="260" y="304" textAnchor="middle" fill={CLASS_META[yogaClass].color} fontSize="10.5" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          H{first} + H{second}: {CLASS_META[yogaClass].label}
        </text>
      </svg>
    </section>
  );
}

function HouseButton({
  house,
  active,
  onClick,
}: {
  house: number;
  active: boolean;
  onClick: () => void;
}) {
  const info = getHouseInfo(house);
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl p-3 text-left"
      style={{
        background: active ? wash(info.color, "14") : SURFACE_2,
        border: `1px solid ${active ? info.color : HAIRLINE}`,
        color: INK_PRIMARY,
      }}
    >
      <span className="block text-xs font-bold uppercase" style={{ color: active ? info.color : INK_MUTED, letterSpacing: "0.06em" }}>
        House {house}
      </span>
      <span className="mt-1 block text-sm font-bold">{info.label}</span>
      <span className="block text-xs" style={{ color: INK_SECONDARY }}>
        <IAST>{info.iast}</IAST> · {info.roles.join(" + ")}
      </span>
    </button>
  );
}

export function RajaDhanaOverlapMap() {
  const [first, setFirst] = useState(5);
  const [second, setSecond] = useState(9);
  const yogaClass = classifyRelationship(first, second);
  const meta = CLASS_META[yogaClass];
  const firstInfo = getHouseInfo(first);
  const secondInfo = getHouseInfo(second);
  const activeRoles = useMemo(
    () => [
      { label: "Raja condition", active: yogaClass === "raja-only" || yogaClass === "both", color: RAJA },
      { label: "Dhana condition", active: yogaClass === "dhana-only" || yogaClass === "both", color: DHANA },
      { label: "Shared 5-9 field", active: yogaClass === "both", color: BOTH },
    ],
    [yogaClass],
  );

  function pickPreset(houses: [number, number]) {
    setFirst(houses[0]);
    setSecond(houses[1]);
  }

  function reset() {
    setFirst(5);
    setSecond(9);
  }

  return (
    <div
      className="mx-auto w-full min-w-0"
      data-interactive="raja-dhana-overlap-map"
      style={{
        maxWidth: 860,
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
            Raja-dhana overlap map
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Wealth and eminence: where the sets meet
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Pick two house lords and classify the relationship as pure raja, pure dhana, both, or neither.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex self-start items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset 5-9 dual
        </button>
      </div>

      <div className="grid gap-4">
        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <CircleDot size={17} color={ink.goldAccent} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
              Pick two house lords
            </p>
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            <div>
              <p className="m-0 mb-2 text-sm font-bold" style={{ color: INK_SECONDARY }}>First lord</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {HOUSE_SET_INFO.map((house) => (
                  <HouseButton key={`first-${house.house}`} house={house.house} active={first === house.house} onClick={() => setFirst(house.house)} />
                ))}
              </div>
            </div>
            <div>
              <p className="m-0 mb-2 text-sm font-bold" style={{ color: INK_SECONDARY }}>Second lord</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {HOUSE_SET_INFO.map((house) => (
                  <HouseButton key={`second-${house.house}`} house={house.house} active={second === house.house} onClick={() => setSecond(house.house)} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <SetOverlapDiagram first={first} second={second} yogaClass={yogaClass} />

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="m-0 text-xs font-bold uppercase" style={{ color: meta.color, letterSpacing: "0.08em" }}>
                Classification
              </p>
              <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                {meta.label}
              </h3>
              <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>
                H{first} <IAST>{firstInfo.iast}</IAST> plus H{second} <IAST>{secondInfo.iast}</IAST>. {meta.description}
              </p>
            </div>
            <Devanagari size="md" className="shrink-0 opacity-80" style={{ color: meta.color }}>
              {meta.devanagari}
            </Devanagari>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {activeRoles.map((role) => (
              <article key={role.label} className="rounded-xl p-4" style={{ background: role.active ? wash(role.color, "12") : SURFACE_2, border: `1px solid ${role.active ? role.color : HAIRLINE}` }}>
                {role.active ? <CheckCircle2 size={17} color={role.color} /> : <CircleDot size={17} color={INK_MUTED} />}
                <p className="mt-2 text-sm font-bold" style={{ color: role.active ? role.color : INK_PRIMARY }}>{role.label}</p>
                <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>
                  {role.active ? "Present in this pair." : "Not present in this pair."}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {OVERLAP_CASES.map((item) => {
            const active = item.houses[0] === first && item.houses[1] === second;
            const itemClass = classifyRelationship(item.houses[0], item.houses[1]);
            const itemMeta = CLASS_META[itemClass];
            return (
              <button key={item.slug} type="button" onClick={() => pickPreset(item.houses)} className="rounded-xl p-4 text-left" style={{ background: active ? wash(itemMeta.color, "14") : SURFACE, border: `1px solid ${active ? itemMeta.color : HAIRLINE}`, color: INK_PRIMARY }}>
                {classIcon(itemClass, itemMeta.color)}
                <p className="mt-2 text-sm font-bold" style={{ color: itemMeta.color }}>{item.label}</p>
                <p className="m-0 text-xl font-semibold" style={{ fontFamily: "var(--font-cormorant), serif" }}>
                  H{item.houses[0]} <ArrowRight className="inline" size={15} /> H{item.houses[1]}
                </p>
                <p className="mt-1 text-sm" style={{ color: INK_SECONDARY }}>{item.note}</p>
              </button>
            );
          })}
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Table2 size={17} color={ink.goldAccent} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
              Classification reference
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
            <table className="w-full min-w-0 table-fixed border-collapse text-sm">
              <thead style={{ background: SURFACE_2 }}>
                <tr>
                  {[
                    { label: "Relationship", width: "w-[140px]" },
                    { label: "Raja?", width: "w-[80px]" },
                    { label: "Dhana?", width: "w-[80px]" },
                    { label: "Classification", width: "w-[130px]" },
                    { label: "Reason", width: "" },
                  ].map((heading) => (
                    <th key={heading.label} className={`px-4 py-3 text-left text-xs font-bold uppercase ${heading.width}`} style={{ color: INK_SECONDARY, letterSpacing: "0.06em" }}>
                      {heading.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {OVERLAP_CASES.map((item) => {
                  const itemClass = classifyRelationship(item.houses[0], item.houses[1]);
                  const itemMeta = CLASS_META[itemClass];
                  return (
                    <tr key={item.slug} onClick={() => pickPreset(item.houses)} className="cursor-pointer align-top" style={{ background: first === item.houses[0] && second === item.houses[1] ? wash(itemMeta.color, "12") : SURFACE, borderTop: `1px solid ${HAIRLINE}` }}>
                      <td className="px-4 py-3 font-bold" style={{ color: itemMeta.color }}>H{item.houses[0]} x H{item.houses[1]}</td>
                      <td className="px-4 py-3" style={{ color: itemClass === "raja-only" || itemClass === "both" ? RAJA : INK_MUTED }}>{itemClass === "raja-only" || itemClass === "both" ? "Yes" : "No"}</td>
                      <td className="px-4 py-3" style={{ color: itemClass === "dhana-only" || itemClass === "both" ? DHANA : INK_MUTED }}>{itemClass === "dhana-only" || itemClass === "both" ? "Yes" : "No"}</td>
                      <td className="px-4 py-3" style={{ color: itemMeta.color }}>{itemMeta.label}</td>
                      <td className="px-4 py-3 break-words" style={{ color: INK_SECONDARY }}>{item.note}</td>
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
