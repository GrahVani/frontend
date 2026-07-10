"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Eye,
  Footprints,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { grahas, ink, rashis, type GrahaSlug, type RashiSlug } from "@/design-tokens/grahvani-learning/colors";
import { fontFamilies } from "@/design-tokens/grahvani-learning/typography";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";

type BodyPart = {
  house: number;
  part: string;
  short: string;
  zodiacSign: RashiSlug;
  chartSign: RashiSlug;
  occupant: GrahaSlug[];
  note: string;
  y: number;
  h: number;
  w: number;
  shape: "circle" | "rect";
};

const BODY_PARTS: BodyPart[] = [
  { house: 1, part: "Head, brain, face (upper)", short: "Head", zodiacSign: "mesha", chartSign: "mithuna", occupant: ["surya", "mangala"], note: "Sun and Mars occupy", y: 30, h: 60, w: 90, shape: "circle" },
  { house: 2, part: "Face (lower), throat, neck, vocal cords", short: "Face / throat", zodiacSign: "vrishabha", chartSign: "karka", occupant: ["candra", "guru"], note: "Moon own-sign, Jupiter exalted", y: 98, h: 36, w: 46, shape: "rect" },
  { house: 3, part: "Shoulders, arms, hands, lungs", short: "Shoulders / arms", zodiacSign: "mithuna", chartSign: "simha", occupant: ["shukra"], note: "Venus in enemy sign", y: 142, h: 44, w: 150, shape: "rect" },
  { house: 4, part: "Chest, breasts, heart, ribs", short: "Chest", zodiacSign: "karka", chartSign: "kanya", occupant: [], note: "Unoccupied", y: 192, h: 44, w: 118, shape: "rect" },
  { house: 5, part: "Stomach, upper back, spine", short: "Stomach / back", zodiacSign: "simha", chartSign: "tula", occupant: [], note: "Unoccupied", y: 242, h: 44, w: 108, shape: "rect" },
  { house: 6, part: "Abdomen, intestines, digestive tract", short: "Abdomen", zodiacSign: "kanya", chartSign: "vrishchika", occupant: [], note: "Unoccupied", y: 292, h: 44, w: 104, shape: "rect" },
  { house: 7, part: "Kidneys, lower back", short: "Kidneys / lower back", zodiacSign: "tula", chartSign: "dhanus", occupant: [], note: "Unoccupied", y: 342, h: 44, w: 108, shape: "rect" },
  { house: 8, part: "Sexual/reproductive organs, bladder, excretory system", short: "Reproductive", zodiacSign: "vrishchika", chartSign: "makara", occupant: [], note: "Unoccupied", y: 392, h: 44, w: 104, shape: "rect" },
  { house: 9, part: "Thighs, hips", short: "Thighs / hips", zodiacSign: "dhanus", chartSign: "kumbha", occupant: [], note: "Unoccupied", y: 442, h: 52, w: 120, shape: "rect" },
  { house: 10, part: "Knees, joints", short: "Knees", zodiacSign: "makara", chartSign: "mina", occupant: [], note: "Unoccupied", y: 500, h: 40, w: 72, shape: "rect" },
  { house: 11, part: "Calves, ankles", short: "Calves / ankles", zodiacSign: "kumbha", chartSign: "mesha", occupant: ["shani"], note: "Saturn debilitated-but-cancelled", y: 546, h: 52, w: 66, shape: "rect" },
  { house: 12, part: "Feet, toes", short: "Feet", zodiacSign: "mina", chartSign: "vrishabha", occupant: [], note: "Unoccupied", y: 604, h: 34, w: 120, shape: "rect" },
];

const SLOKA = {
  devanagari: "लग्नात् शिरः क्रमेण याति यावत् पादौ द्वादशे स्थिते।\nकालपुरुषदेहोऽयं भावेषु विभजेत् क्रमात्॥",
  iast: "lagnāt śiraḥ krameṇa yāti yāvat pādau dvādaśe sthite |\nkālapuruṣa-deho'yaṁ bhāveṣu vibhajet kramāt ||",
  english: "From the head at the ascendant, proceeding in order, until the feet reside in the twelfth — thus is this cosmic body distributed among the houses, in sequence.",
};

function isEmphasised(part: BodyPart): boolean {
  return part.occupant.length > 0;
}

export function KalapurushaBodyMapExplorer() {
  const [tab, setTab] = useState<"map" | "table" | "compare" | "scope">("map");

  function reset() {
    setTab("map");
  }

  return (
    <div
      data-interactive="kalapurusha-body-map-explorer"
      className="w-full min-w-0"
      style={{
        color: INK_PRIMARY,
        background: SURFACE,
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 16,
        padding: 20,
        boxSizing: "border-box",
        overflow: "hidden",
        fontFamily: fontFamilies.body,
      }}
    >
      <header className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <Eyebrow>Kālapuruṣa body-map explorer</Eyebrow>
          <h2
            className="mt-1 text-xl sm:text-2xl"
            style={{ color: ink.goldAccent, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
          >
            The classical body-part-to-house mapping
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            Explore the Kālapuruṣa doctrine: the twelve houses read as a cosmic body from head (1st) to feet (12th). This
            is descriptive classical knowledge only — not a diagnostic tool.
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 self-start rounded-lg px-3 py-2 text-sm"
          style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY, fontWeight: 500 }}
        >
          <RotateCcw size={15} aria-hidden="true" />
          Restart
        </button>
      </header>

      <nav className="mb-5 flex flex-wrap gap-2" aria-label="Kālapuruṣa sections">
        {[
          { key: "map", label: "Body map" },
          { key: "table", label: "Table view" },
          { key: "compare", label: "Zodiac vs house" },
          { key: "scope", label: "Scope gate" },
        ].map((item) => (
          <TabButton key={item.key} active={tab === (item.key as typeof tab)} onClick={() => setTab(item.key as typeof tab)}>
            {item.label}
          </TabButton>
        ))}
      </nav>

      {tab === "map" && <MapTab />}
      {tab === "table" && <TableTab />}
      {tab === "compare" && <CompareTab />}
      {tab === "scope" && <ScopeTab />}
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className="rounded-lg px-3 py-2 text-sm"
      style={{
        border: `1px solid ${active ? ink.goldAccent : HAIRLINE}`,
        background: active ? ink.goldAccent : "transparent",
        color: active ? "#1A1408" : INK_SECONDARY,
        fontWeight: 500,
      }}
    >
      {children}
    </button>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, letterSpacing: "0.08em", fontWeight: 600 }}>
      {children}
    </p>
  );
}

function Panel({ title, eyebrow, children, accent = ink.goldAccent }: { title?: string; eyebrow?: string; children: ReactNode; accent?: string }) {
  return (
    <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${accent}44` }}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      {title && (
        <h3 className="mt-1 text-lg" style={{ color: accent, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          {title}
        </h3>
      )}
      <div className="mt-3">{children}</div>
    </section>
  );
}

function MapTab() {
  const [mode, setMode] = useState<"zodiac" | "chart">("chart");
  const [activeHouse, setActiveHouse] = useState<number | null>(1);
  const [showEmphasis, setShowEmphasis] = useState(true);

  const activePart = useMemo(() => BODY_PARTS.find((p) => p.house === activeHouse) ?? BODY_PARTS[0], [activeHouse]);
  const activeSign = mode === "zodiac" ? activePart.zodiacSign : activePart.chartSign;

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)]">
      <div className="grid gap-4">
        <Panel eyebrow="§4.1" title="Click a body region">
          <div className="flex flex-wrap gap-2">
            <ModeChip active={mode === "zodiac"} onClick={() => setMode("zodiac")} color={ink.goldAccent}>
              Zodiacal Kālapuruṣa
            </ModeChip>
            <ModeChip active={mode === "chart"} onClick={() => setMode("chart")} color={streams.parashara.primary}>
              Chart H1 houses
            </ModeChip>
          </div>
          <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm" style={{ color: INK_SECONDARY }}>
            <input
              type="checkbox"
              checked={showEmphasis}
              onChange={(e) => setShowEmphasis(e.target.checked)}
              className="h-4 w-4"
            />
            Highlight Chart H1 structural emphasis
          </label>
          <BodyMapSvg mode={mode} activeHouse={activeHouse} onSelect={setActiveHouse} showEmphasis={showEmphasis} />
        </Panel>

        <Panel accent={ink.vermilionAccent}>
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} style={{ color: ink.vermilionAccent, flexShrink: 0 }} aria-hidden="true" />
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              This map is classical description only. Any connection to a real medical situation is taught in Lesson 7.6.3,
              not here.
            </p>
          </div>
        </Panel>
      </div>

      <div className="grid gap-4">
        <Panel eyebrow="Selected region" title={activePart.part} accent={rashis[activeSign].primary}>
          <div className="grid gap-3 sm:grid-cols-3">
            <DetailTile label="House" value={`${activePart.house}${ordinalSuffix(activePart.house)}`} color={rashis[activeSign].primary} />
            <DetailTile label={mode === "zodiac" ? "Zodiac sign" : "Chart H1 sign"} value={rashis[activeSign].english} color={rashis[activeSign].primary} />
            <DetailTile label="Body region" value={activePart.short} color={rashis[activeSign].primary} />
          </div>

          {mode === "chart" && (
            <div className="mt-4 rounded-lg p-3" style={{ background: `${rashis[activePart.chartSign].primary}10`, border: `1px solid ${rashis[activePart.chartSign].primary}55` }}>
              <p className="m-0 text-xs uppercase" style={{ color: rashis[activePart.chartSign].primary, fontWeight: 600 }}>
                Chart H1 structural note
              </p>
              <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
                {activePart.note}
              </p>
              {activePart.occupant.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {activePart.occupant.map((slug) => (
                    <span key={slug} className="rounded-full px-2 py-1 text-xs" style={{ background: `${grahas[slug].primary}22`, color: grahas[slug].primary, fontWeight: 500 }}>
                      {grahas[slug].iast}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {mode === "zodiac" && (
            <p className="m-0 mt-3 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              In the universal zodiacal Kālapuruṣa, {rashis[activePart.zodiacSign].english} corresponds to the{" "}
              {activePart.short.toLowerCase()}. This is a property of the zodiac itself, independent of any individual chart.
            </p>
          )}
        </Panel>

        <Panel eyebrow="§5" title="Composed teaching verse">
          <p className="m-0 text-base" style={{ fontFamily: "var(--font-devanagari), serif", color: INK_PRIMARY, lineHeight: 1.6 }}>
            {SLOKA.devanagari}
          </p>
          <p className="m-0 mt-2 text-sm italic" style={{ fontFamily: fontFamilies.literarySerif, color: INK_SECONDARY, lineHeight: 1.55 }}>
            {SLOKA.iast}
          </p>
          <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            {SLOKA.english}
          </p>
        </Panel>
      </div>
    </div>
  );
}

function ordinalSuffix(n: number): string {
  if (n === 1) return "st";
  if (n === 2) return "nd";
  if (n === 3) return "rd";
  return "th";
}

function ModeChip({ active, onClick, children, color }: { active: boolean; onClick: () => void; children: ReactNode; color: string }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className="rounded-full px-3 py-1.5 text-xs"
      style={{
        background: active ? color : "transparent",
        border: `1px solid ${color}`,
        color: active ? (color === ink.goldAccent ? "#1A1408" : "#fff") : color,
        fontWeight: 500,
      }}
    >
      {children}
    </button>
  );
}

function DetailTile({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-lg p-3" style={{ background: `${color}10`, border: `1px solid ${color}55` }}>
      <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>{label}</p>
      <p className="m-0 mt-1 text-base" style={{ color, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>{value}</p>
    </div>
  );
}

function BodyMapSvg({ mode, activeHouse, onSelect, showEmphasis }: { mode: "zodiac" | "chart"; activeHouse: number | null; onSelect: (house: number) => void; showEmphasis: boolean }) {
  return (
    <svg viewBox="0 0 240 680" role="img" aria-label="Kālapuruṣa body map from head to feet" className="mx-auto mt-4 h-auto w-full max-w-[220px]">
      <rect x="20" y="10" width="200" height="660" rx="16" fill={`${ink.goldAccent}08`} stroke={HAIRLINE} />
      {BODY_PARTS.map((part) => {
        const sign = mode === "zodiac" ? part.zodiacSign : part.chartSign;
        const color = rashis[sign].primary;
        const active = activeHouse === part.house;
        const emphasised = showEmphasis && isEmphasised(part);
        const x = 120 - part.w / 2;
        const fill = active ? `${color}35` : emphasised ? `${color}18` : `${color}0A`;
        const stroke = active ? color : emphasised ? color : HAIRLINE;
        return (
          <g
            key={part.house}
            role="button"
            tabIndex={0}
            aria-label={`House ${part.house}, ${part.part}`}
            aria-pressed={active}
            onClick={() => onSelect(part.house)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onSelect(part.house);
            }}
            style={{ cursor: "pointer" }}
          >
            {part.shape === "circle" ? (
              <circle cx="120" cy={part.y + part.h / 2} r={part.w / 2} fill={fill} stroke={stroke} strokeWidth={active ? 3 : emphasised ? 2 : 1.5} />
            ) : (
              <rect x={x} y={part.y} width={part.w} height={part.h} rx="10" fill={fill} stroke={stroke} strokeWidth={active ? 3 : emphasised ? 2 : 1.5} />
            )}
            <text x="120" y={part.y + part.h / 2 - 4} textAnchor="middle" fill={active ? color : INK_PRIMARY} fontSize="12" fontWeight="600">
              {part.house}
            </text>
            <text x="120" y={part.y + part.h / 2 + 10} textAnchor="middle" fill={active ? INK_SECONDARY : INK_MUTED} fontSize="9" fontWeight="500">
              {part.short}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function TableTab() {
  const [filter, setFilter] = useState<"all" | "emphasised">("all");
  const rows = useMemo(() => {
    return filter === "emphasised" ? BODY_PARTS.filter(isEmphasised) : BODY_PARTS;
  }, [filter]);

  return (
    <div className="grid min-w-0 gap-4">
      <Panel eyebrow="§4.2" title="Complete twelve-house body-part table">
        <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          The table proceeds anatomically from head (1st) to feet (12th). Use the filter to see only the houses that are
          structurally emphasised in Chart H1.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <ModeChip active={filter === "all"} onClick={() => setFilter("all")} color={ink.goldAccent}>All houses</ModeChip>
          <ModeChip active={filter === "emphasised"} onClick={() => setFilter("emphasised")} color={ink.vermilionAccent}>Emphasised in Chart H1</ModeChip>
        </div>
      </Panel>

      <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
        <table className="w-full min-w-0 border-collapse text-sm">
          <thead style={{ background: "var(--gl-surface-2, #F5EDD8)" }}>
            <tr>
              {["House", "Body part(s)", "Zodiac sign", "Chart H1 sign", "Emphasis"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs uppercase" style={{ color: INK_SECONDARY, fontWeight: 600, letterSpacing: "0.05em" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((part) => {
              const emphasised = isEmphasised(part);
              return (
                <tr key={part.house} style={{ background: emphasised ? `${rashis[part.chartSign].primary}08` : SURFACE, borderTop: `1px solid ${HAIRLINE}` }}>
                  <td className="px-4 py-3" style={{ color: INK_PRIMARY, fontWeight: 500 }}>
                    {part.house}{ordinalSuffix(part.house)}
                  </td>
                  <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{part.part}</td>
                  <td className="px-4 py-3">
                    <SignBadge sign={part.zodiacSign} />
                  </td>
                  <td className="px-4 py-3">
                    <SignBadge sign={part.chartSign} />
                  </td>
                  <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>
                    {emphasised ? (
                      <span className="inline-flex flex-wrap gap-1">
                        {part.occupant.map((slug) => (
                          <span key={slug} className="rounded-full px-2 py-1 text-xs" style={{ background: `${grahas[slug].primary}22`, color: grahas[slug].primary, fontWeight: 500 }}>
                            {grahas[slug].iast}
                          </span>
                        ))}
                      </span>
                    ) : (
                      <span className="text-xs" style={{ color: INK_MUTED }}>—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SignBadge({ sign }: { sign: RashiSlug }) {
  return (
    <span className="rounded-full px-2 py-1 text-xs" style={{ background: `${rashis[sign].primary}22`, color: rashis[sign].primary, fontWeight: 500 }}>
      {rashis[sign].english}
    </span>
  );
}

function CompareTab() {
  const [house, setHouse] = useState(1);
  const part = BODY_PARTS.find((p) => p.house === house) ?? BODY_PARTS[0];

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <Panel eyebrow="§6 Example 2" title="Zodiacal Kālapuruṣa vs. chart-specific house mapping">
        <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          The same doctrine is used two ways. For an individual chart, always count from that chart&apos;s own 1st house,
          not from the fixed zodiacal signs.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {BODY_PARTS.map((p) => (
            <button
              key={p.house}
              type="button"
              aria-pressed={house === p.house}
              onClick={() => setHouse(p.house)}
              className="rounded-lg px-3 py-2 text-sm"
              style={{
                background: house === p.house ? `${rashis[p.zodiacSign].primary}22` : "transparent",
                border: `1px solid ${house === p.house ? rashis[p.zodiacSign].primary : HAIRLINE}`,
                color: house === p.house ? rashis[p.zodiacSign].primary : INK_SECONDARY,
                fontWeight: 500,
              }}
            >
              {p.house}{ordinalSuffix(p.house)}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl p-4" style={{ background: `${rashis[part.zodiacSign].primary}10`, border: `1px solid ${rashis[part.zodiacSign].primary}` }}>
            <p className="m-0 text-xs uppercase" style={{ color: rashis[part.zodiacSign].primary, fontWeight: 600 }}>Zodiacal Kālapuruṣa</p>
            <p className="m-0 mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
              {rashis[part.zodiacSign].english} = {part.short}
            </p>
            <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>Universal property of the zodiac</p>
          </div>
          <div className="rounded-xl p-4" style={{ background: `${rashis[part.chartSign].primary}10`, border: `1px solid ${rashis[part.chartSign].primary}` }}>
            <p className="m-0 text-xs uppercase" style={{ color: rashis[part.chartSign].primary, fontWeight: 600 }}>Chart H1 house mapping</p>
            <p className="m-0 mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
              {part.house}{ordinalSuffix(part.house)} house = {part.short}
            </p>
            <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>Counted from Gemini lagna</p>
          </div>
        </div>
      </Panel>

      <Panel eyebrow="Critical insight" title="Why the distinction matters">
        <div className="space-y-3">
          <div className="flex items-start gap-3 rounded-lg p-3" style={{ background: `${ink.vermilionAccent}10`, border: `1px solid ${ink.vermilionAccent}55` }}>
            <AlertTriangle size={18} style={{ color: ink.vermilionAccent, flexShrink: 0 }} aria-hidden="true" />
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              A learner reads &quot;Aries = head&quot; and concludes a native&apos;s head matters are shown wherever Aries
              falls, instead of in their 1st house.
            </p>
          </div>
          <div className="flex items-start gap-3 rounded-lg p-3" style={{ background: `${"#2F7D55"}10`, border: `1px solid ${"#2F7D55"}55` }}>
            <CheckCircle2 size={18} style={{ color: "#2F7D55", flexShrink: 0 }} aria-hidden="true" />
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              For Chart H1, the 1st house is Gemini — so Gemini is the head house for this native, even though Aries is
              the universal head sign.
            </p>
          </div>
        </div>
      </Panel>
    </div>
  );
}

function ScopeTab() {
  const [diagnosisMode, setDiagnosisMode] = useState(false);

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-2">
      <Panel eyebrow="§1, §3, §8" title="Scope gate: is this a diagnosis?">
        <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          This lesson teaches the classical mapping as pure knowledge. Toggle the switch to see what happens if someone
          tries to use it diagnostically before Lesson 7.6.3.
        </p>

        <button
          type="button"
          onClick={() => setDiagnosisMode((v) => !v)}
          className="mt-4 inline-flex items-center gap-3 rounded-lg px-4 py-3 text-sm"
          style={{
            background: diagnosisMode ? `${ink.vermilionAccent}14` : `${"#2F7D55"}14`,
            border: `1px solid ${diagnosisMode ? ink.vermilionAccent : "#2F7D55"}`,
            color: diagnosisMode ? ink.vermilionAccent : "#2F7D55",
            fontWeight: 500,
          }}
        >
          {diagnosisMode ? <AlertTriangle size={18} aria-hidden="true" /> : <CheckCircle2 size={18} aria-hidden="true" />}
          {diagnosisMode ? "Diagnosis mode is ON" : "Descriptive mode is ON"}
        </button>

        {diagnosisMode ? (
          <div className="mt-4 rounded-lg p-3" style={{ background: `${ink.vermilionAccent}10`, border: `1px solid ${ink.vermilionAccent}55` }}>
            <p className="m-0 text-sm" style={{ color: ink.vermilionAccent, fontWeight: 500 }}>Stop — this is outside this lesson&apos;s scope.</p>
            <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              Knowing which body part a house governs is not the same as knowing a native has a condition in that body
              part. The contextualisation-not-diagnosis discipline is Lesson 7.6.3.
            </p>
          </div>
        ) : (
          <div className="mt-4 rounded-lg p-3" style={{ background: `${"#2F7D55"}10`, border: `1px solid ${"#2F7D55"}55` }}>
            <p className="m-0 text-sm" style={{ color: "#2F7D55", fontWeight: 500 }}>Good — stay in descriptive mode.</p>
            <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              You can catalogue which body-part-houses are structurally emphasised, but you stop there. Real medical
              application requires the framing taught later in this chapter.
            </p>
          </div>
        )}
      </Panel>

      <Panel eyebrow="What this lesson is" title="Allowed uses right now">
        <div className="space-y-3">
          <div className="flex items-start gap-3 rounded-lg p-3" style={{ background: `${ink.goldAccent}10`, border: `1px solid ${HAIRLINE}` }}>
            <BookOpen size={18} style={{ color: ink.goldAccent, flexShrink: 0 }} aria-hidden="true" />
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>Learn the complete twelve-house body-part table.</p>
          </div>
          <div className="flex items-start gap-3 rounded-lg p-3" style={{ background: `${ink.goldAccent}10`, border: `1px solid ${HAIRLINE}` }}>
            <Eye size={18} style={{ color: ink.goldAccent, flexShrink: 0 }} aria-hidden="true" />
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>Identify which body-part-houses are structurally emphasised in a chart.</p>
          </div>
          <div className="flex items-start gap-3 rounded-lg p-3" style={{ background: `${ink.goldAccent}10`, border: `1px solid ${HAIRLINE}` }}>
            <ShieldCheck size={18} style={{ color: ink.goldAccent, flexShrink: 0 }} aria-hidden="true" />
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>Hold the line until Lesson 7.6.3 before applying it to any real medical situation.</p>
          </div>
          <div className="flex items-start gap-3 rounded-lg p-3" style={{ background: `${ink.goldAccent}10`, border: `1px solid ${HAIRLINE}` }}>
            <Footprints size={18} style={{ color: ink.goldAccent, flexShrink: 0 }} aria-hidden="true" />
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>Next: planet-disease correspondences in Lesson 7.6.2.</p>
          </div>
        </div>
      </Panel>
    </div>
  );
}

const streams = {
  parashara: { primary: ink.goldAccent },
};
