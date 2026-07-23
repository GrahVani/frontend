"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Flame,
  Layers,
  Lock,
  RotateCcw,
  ShieldCheck,
  Wind,
} from "lucide-react";
import { grahas, ink, rashis, type GrahaSlug, type RashiSlug } from "@/design-tokens/grahvani-learning/colors";
import { fontFamilies } from "@/design-tokens/grahvani-learning/typography";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";

type DoshaSlug = "vata" | "pitta" | "kapha";
type Reinforcement = "reinforces" | "partial" | "does-not";

type GrahaEntry = {
  slug: GrahaSlug;
  correspondences: string[];
  dosha: DoshaSlug | null;
  chartHouse: number;
  chartSign: RashiSlug;
  dignity: string;
  reinforcement: Reinforcement;
  reading: string;
};

const HOUSE_PARTS = [
  { house: 1, part: "Head, brain, face (upper)", sign: "mithuna" as RashiSlug },
  { house: 2, part: "Face (lower), throat, neck, vocal cords", sign: "karka" as RashiSlug },
  { house: 3, part: "Shoulders, arms, hands, lungs", sign: "simha" as RashiSlug },
  { house: 4, part: "Chest, breasts, heart, ribs", sign: "kanya" as RashiSlug },
  { house: 5, part: "Stomach, upper back, spine", sign: "tula" as RashiSlug },
  { house: 6, part: "Abdomen, intestines, digestive tract", sign: "vrishchika" as RashiSlug },
  { house: 7, part: "Kidneys, lower back", sign: "dhanus" as RashiSlug },
  { house: 8, part: "Sexual/reproductive organs, bladder, excretory system", sign: "makara" as RashiSlug },
  { house: 9, part: "Thighs, hips", sign: "kumbha" as RashiSlug },
  { house: 10, part: "Knees, joints", sign: "mina" as RashiSlug },
  { house: 11, part: "Calves, ankles", sign: "mesha" as RashiSlug },
  { house: 12, part: "Feet, toes", sign: "vrishabha" as RashiSlug },
];

const GRAHA_DATA: GrahaEntry[] = [
  {
    slug: "surya",
    correspondences: ["Eyes (especially with Moon)", "Bones", "Heart", "General vitality and fevers"],
    dosha: "pitta",
    chartHouse: 1,
    chartSign: "mithuna",
    dignity: "neutral",
    reinforcement: "reinforces",
    reading: "Sun's vitality-signification reinforces the 1st house's general constitutional theme.",
  },
  {
    slug: "candra",
    correspondences: ["Mind and mental health", "Bodily fluids", "Breasts", "Stomach", "Reproductive system", "Eyes"],
    dosha: "kapha",
    chartHouse: 2,
    chartSign: "karka",
    dignity: "own sign",
    reinforcement: "partial",
    reading: "Moon is the strongest-dignity planet in the chart, occupying the 2nd house. Its fluid/mental correspondences add a planetary layer to the face/throat house.",
  },
  {
    slug: "mangala",
    correspondences: ["Blood", "Muscle tissue", "Injuries and accidents", "Inflammation", "Surgery"],
    dosha: "pitta",
    chartHouse: 1,
    chartSign: "mithuna",
    dignity: "enemy sign",
    reinforcement: "partial",
    reading: "Mars's blood/injury signature can connect to the head, but it is not a clean bone/joint match like Saturn-in-the-11th.",
  },
  {
    slug: "budha",
    correspondences: ["Nervous system", "Skin", "Speech", "Digestive tract", "Lungs", "Hands"],
    dosha: null,
    chartHouse: 9,
    chartSign: "kumbha",
    dignity: "neutral",
    reinforcement: "does-not",
    reading: "Mercury occupies the 9th house (thighs/hips). Its nervous-system/skin/speech emphasis does not thematically overlap with that house.",
  },
  {
    slug: "guru",
    correspondences: ["Liver", "Fat metabolism", "Hormonal balance"],
    dosha: "kapha",
    chartHouse: 2,
    chartSign: "karka",
    dignity: "exalted",
    reinforcement: "does-not",
    reading: "Jupiter is exalted in the 2nd house (face/throat/neck), but its liver/fat/hormone correspondences do not coincide with that body region.",
  },
  {
    slug: "shukra",
    correspondences: ["Reproductive organs", "Throat", "Neck", "Skin", "Hormonal balance"],
    dosha: "kapha",
    chartHouse: 3,
    chartSign: "simha",
    dignity: "enemy sign",
    reinforcement: "does-not",
    reading: "Venus's throat signification points toward the 2nd house, but Venus occupies the 3rd house (shoulders/arms/lungs). The two layers do not align here.",
  },
  {
    slug: "shani",
    correspondences: ["Bones", "Teeth", "Joints", "Chronic and degenerative conditions", "Lungs"],
    dosha: "vata",
    chartHouse: 11,
    chartSign: "mesha",
    dignity: "debilitated, cancelled",
    reinforcement: "reinforces",
    reading: "Saturn's bone/joint signification directly reinforces the 11th house's calves/ankles meaning — the clearest two-layer reinforcement in Chart H1.",
  },
];

const DOSHA_DATA: Record<DoshaSlug, { label: string; sanskrit: string; quality: string; color: string; grahas: GrahaSlug[] }> = {
  vata: {
    label: "Vata",
    sanskrit: "वात",
    quality: "movement",
    color: "#5A8AC8",
    grahas: ["shani", "rahu"],
  },
  pitta: {
    label: "Pitta",
    sanskrit: "पित्त",
    quality: "transformation / heat",
    color: "#D8472E",
    grahas: ["surya", "mangala"],
  },
  kapha: {
    label: "Kapha",
    sanskrit: "कफ",
    quality: "structure / fluid",
    color: "#2F7D55",
    grahas: ["candra", "guru", "shukra"],
  },
};

const SLOKA = {
  devanagari: "शनैश्चरोऽस्थिसन्धीनां कारकः कुजितो रुधिरस्य च।\nएवं सप्तग्रहाणां स्वं स्वं शरीराङ्गं प्रकीर्तितम्॥",
  iast: "śanaiścaro'sthi-sandhīnāṁ kārakaḥ kujito rudhirasya ca |\nevaṁ sapta-grahāṇāṁ svaṁ svaṁ śarīrāṅgaṁ prakīrtitam ||",
  english: "Saturn is the significator of bones and joints, and Mars of blood; thus, for each of the seven grahas, its own bodily domain is proclaimed.",
};

const MATCHER_SCENARIOS: { slug: GrahaSlug; house: number; answer: Reinforcement; reason: string }[] = [
  {
    slug: "shani",
    house: 11,
    answer: "reinforces",
    reason: "Saturn governs bones/joints; the 11th house governs calves/ankles. Both layers point to the skeletal/structural theme.",
  },
  {
    slug: "budha",
    house: 9,
    answer: "does-not",
    reason: "Mercury's nervous-system/skin/speech emphasis does not thematically overlap with the 9th house's thighs/hips.",
  },
  {
    slug: "shukra",
    house: 3,
    answer: "does-not",
    reason: "Venus's throat-signification points toward the 2nd house, but Venus occupies the 3rd house (shoulders/arms/lungs).",
  },
  {
    slug: "guru",
    house: 2,
    answer: "does-not",
    reason: "Jupiter is exalted in the 2nd, yet its liver/fat/hormone correspondences do not coincide with face/throat/neck.",
  },
  {
    slug: "mangala",
    house: 1,
    answer: "partial",
    reason: "Mars's blood/injury/inflammation can connect to the head, but it is not as clean a match as Saturn-in-the-11th.",
  },
];

function ordinalSuffix(n: number): string {
  if (n === 1) return "st";
  if (n === 2) return "nd";
  if (n === 3) return "rd";
  return "th";
}

function getHousePart(house: number) {
  return HOUSE_PARTS.find((h) => h.house === house) ?? HOUSE_PARTS[0];
}

export function GrahaDiseaseCorrespondenceExplorer() {
  const [tab, setTab] = useState<"planets" | "combine" | "dosha" | "scope">("planets");

  function reset() {
    setTab("planets");
  }

  return (
    <div
      data-interactive="graha-disease-correspondence-explorer"
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
          <Eyebrow>Planet-disease correspondences</Eyebrow>
          <h2
            className="mt-1 text-xl sm:text-2xl"
            style={{ color: ink.goldAccent, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
          >
            The seven grahas and the two-layer descriptive system
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            Learn each classical graha&apos;s bodily correspondences, see how they combine with the house-based body map,
            and practise keeping the reading descriptive only.
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

      <nav className="mb-5 flex flex-wrap gap-2" aria-label="Planet-disease sections">
        {[
          { key: "planets", label: "Seven grahas" },
          { key: "combine", label: "Combine layers" },
          { key: "dosha", label: "Tridoṣa bridge" },
          { key: "scope", label: "Scope gate" },
        ].map((item) => (
          <TabButton key={item.key} active={tab === (item.key as typeof tab)} onClick={() => setTab(item.key as typeof tab)}>
            {item.label}
          </TabButton>
        ))}
      </nav>

      {tab === "planets" && <PlanetsTab />}
      {tab === "combine" && <CombineTab />}
      {tab === "dosha" && <DoshaTab />}
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

function PlanetsTab() {
  const [selected, setSelected] = useState<GrahaSlug>("shani");
  const entry = useMemo(() => GRAHA_DATA.find((g) => g.slug === selected) ?? GRAHA_DATA[0], [selected]);
  const house = getHousePart(entry.chartHouse);

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <Panel eyebrow="§4.1" title="Select a graha to read its bodily correspondences">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-7">
          {GRAHA_DATA.map((g) => {
            const active = g.slug === selected;
            return (
              <button
                key={g.slug}
                type="button"
                aria-pressed={active}
                onClick={() => setSelected(g.slug)}
                className="rounded-xl p-3 text-center"
                style={{
                  background: active ? `${grahas[g.slug].primary}22` : `${grahas[g.slug].primary}08`,
                  border: `1px solid ${active ? grahas[g.slug].primary : HAIRLINE}`,
                }}
              >
                <span className="block text-lg" style={{ color: grahas[g.slug].primary, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
                  {grahas[g.slug].iast}
                </span>
                <span className="block text-xs" style={{ color: INK_SECONDARY }}>
                  {grahas[g.slug].devanagari}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <DetailTile label="Graha" value={grahas[entry.slug].iast} color={grahas[entry.slug].primary} />
          <DetailTile label="Dignity in Chart H1" value={entry.dignity} color={grahas[entry.slug].primary} />
          <DetailTile label="Tridoṣa" value={entry.dosha ? DOSHA_DATA[entry.dosha].label : "Not assigned"} color={entry.dosha ? DOSHA_DATA[entry.dosha].color : INK_MUTED} />
        </div>

        <div className="mt-4 rounded-lg p-3" style={{ background: `${grahas[entry.slug].primary}10`, border: `1px solid ${grahas[entry.slug].primary}55` }}>
          <p className="m-0 text-xs uppercase" style={{ color: grahas[entry.slug].primary, fontWeight: 600 }}>Primary correspondences</p>
          <ul className="m-0 mt-2 list-disc space-y-1 pl-5 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            {entry.correspondences.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </Panel>

      <div className="grid gap-4">
        <Panel eyebrow="Chart H1 placement" title={`${grahas[entry.slug].iast} in the ${entry.chartHouse}${ordinalSuffix(entry.chartHouse)} house`} accent={rashis[entry.chartSign].primary}>
          <div className="grid gap-3 sm:grid-cols-2">
            <DetailTile label="House body part" value={house.part} color={rashis[entry.chartSign].primary} />
            <DetailTile label="House sign" value={rashis[entry.chartSign].english} color={rashis[entry.chartSign].primary} />
          </div>
          <p className="m-0 mt-3 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            {entry.reading}
          </p>
          <div
            className="mt-3 rounded-lg p-3"
            style={{
              background: entry.reinforcement === "reinforces" ? `${"#2F7D55"}10` : entry.reinforcement === "partial" ? `${ink.goldAccent}10` : `${ink.vermilionAccent}10`,
              border: `1px solid ${entry.reinforcement === "reinforces" ? "#2F7D55" : entry.reinforcement === "partial" ? ink.goldAccent : ink.vermilionAccent}55`,
            }}
          >
            <p
              className="m-0 text-sm"
              style={{
                color: entry.reinforcement === "reinforces" ? "#2F7D55" : entry.reinforcement === "partial" ? ink.goldAccent : ink.vermilionAccent,
                fontWeight: 500,
              }}
            >
              {entry.reinforcement === "reinforces" ? "Two layers reinforce" : entry.reinforcement === "partial" ? "Partial overlap" : "Layers do not reinforce"}
            </p>
          </div>
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

function DetailTile({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-lg p-3" style={{ background: `${color}10`, border: `1px solid ${color}55` }}>
      <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>{label}</p>
      <p className="m-0 mt-1 text-sm" style={{ color, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>{value}</p>
    </div>
  );
}

function CombineTab() {
  const [planetSlug, setPlanetSlug] = useState<GrahaSlug>("shani");
  const [houseNumber, setHouseNumber] = useState(11);

  const entry = useMemo(() => GRAHA_DATA.find((g) => g.slug === planetSlug) ?? GRAHA_DATA[0], [planetSlug]);
  const house = getHousePart(houseNumber);

  const verdict = useMemo(() => {
    if (planetSlug === "shani" && houseNumber === 11) return "reinforces" as Reinforcement;
    if (planetSlug === "budha" && houseNumber === 9) return "does-not" as Reinforcement;
    if (planetSlug === "shukra" && houseNumber === 3) return "does-not" as Reinforcement;
    if (planetSlug === "guru" && houseNumber === 2) return "does-not" as Reinforcement;
    if (planetSlug === "mangala" && houseNumber === 1) return "partial" as Reinforcement;
    if (planetSlug === "surya" && houseNumber === 1) return "reinforces" as Reinforcement;
    if (planetSlug === "candra" && houseNumber === 2) return "partial" as Reinforcement;
    return "does-not" as Reinforcement;
  }, [planetSlug, houseNumber]);

  return (
    <div className="grid min-w-0 gap-4">
      <Panel eyebrow="§4.2" title="Combine planetary and house layers">
        <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          A full descriptive picture reads a planet&apos;s own disease-signification together with the body-part house it
          occupies. Reinforcement occurs only when both layers genuinely overlap.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm" style={{ color: INK_SECONDARY }}>Planet</label>
            <select
              value={planetSlug}
              onChange={(e) => setPlanetSlug(e.target.value as GrahaSlug)}
              className="mt-2 w-full rounded-lg p-2 text-sm"
              style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
            >
              {GRAHA_DATA.map((g) => (
                <option key={g.slug} value={g.slug}>
                  {grahas[g.slug].iast} — {g.correspondences[0]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm" style={{ color: INK_SECONDARY }}>House</label>
            <select
              value={houseNumber}
              onChange={(e) => setHouseNumber(Number(e.target.value))}
              className="mt-2 w-full rounded-lg p-2 text-sm"
              style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
            >
              {HOUSE_PARTS.map((h) => (
                <option key={h.house} value={h.house}>
                  {h.house}{ordinalSuffix(h.house)} — {h.part}
                </option>
              ))}
            </select>
          </div>
        </div>

        <LayerVenn planet={entry} house={house} verdict={verdict} />
      </Panel>

      <Panel eyebrow="Practise" title="Does this placement reinforce?">
        <Matcher />
      </Panel>
    </div>
  );
}

function LayerVenn({ planet, house, verdict }: { planet: GrahaEntry; house: (typeof HOUSE_PARTS)[0]; verdict: Reinforcement }) {
  const color = verdict === "reinforces" ? "#2F7D55" : verdict === "partial" ? ink.goldAccent : ink.vermilionAccent;
  const label = verdict === "reinforces" ? "Reinforces" : verdict === "partial" ? "Partial overlap" : "Does not reinforce";

  return (
    <div className="mt-4 grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,180px)_minmax(0,1fr)]">
      <div className="rounded-xl p-4" style={{ background: `${grahas[planet.slug].primary}10`, border: `1px solid ${grahas[planet.slug].primary}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: grahas[planet.slug].primary, fontWeight: 600 }}>{grahas[planet.slug].iast}</p>
        <ul className="m-0 mt-2 list-disc pl-5 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          {planet.correspondences.slice(0, 4).map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl p-4" style={{ background: `${color}10`, border: `1px solid ${color}` }}>
        <Layers size={20} style={{ color }} aria-hidden="true" />
        <p className="m-0 mt-2 text-center text-sm" style={{ color, fontWeight: 600 }}>{label}</p>
      </div>

      <div className="rounded-xl p-4" style={{ background: `${rashis[house.sign].primary}10`, border: `1px solid ${rashis[house.sign].primary}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: rashis[house.sign].primary, fontWeight: 600 }}>
          {house.house}{ordinalSuffix(house.house)} house
        </p>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>{house.part}</p>
      </div>
    </div>
  );
}

function Matcher() {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<Reinforcement | null>(null);
  const scenario = MATCHER_SCENARIOS[index];
  const entry = GRAHA_DATA.find((g) => g.slug === scenario.slug)!;
  const house = getHousePart(scenario.house);

  function choose(option: Reinforcement) {
    setAnswer(option);
  }

  function next() {
    setAnswer(null);
    setIndex((i) => (i + 1) % MATCHER_SCENARIOS.length);
  }

  return (
    <div>
      <div className="rounded-xl p-4" style={{ background: `${grahas[entry.slug].primary}08`, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-lg px-2 py-1 text-sm" style={{ background: `${grahas[entry.slug].primary}22`, color: grahas[entry.slug].primary, fontWeight: 500 }}>
            {grahas[entry.slug].iast}
          </span>
          <span style={{ color: INK_MUTED }}>occupies</span>
          <span className="rounded-lg px-2 py-1 text-sm" style={{ background: `${rashis[house.sign].primary}22`, color: rashis[house.sign].primary, fontWeight: 500 }}>
            {house.house}{ordinalSuffix(house.house)} house ({house.part})
          </span>
        </div>
        <p className="m-0 mt-3 text-sm" style={{ color: INK_SECONDARY }}>Do the planetary and house layers reinforce?</p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {(["reinforces", "partial", "does-not"] as Reinforcement[]).map((option) => (
          <button
            key={option}
            type="button"
            disabled={answer !== null}
            onClick={() => choose(option)}
            className="rounded-lg px-3 py-2 text-sm"
            style={{
              background: answer === option ? (option === "reinforces" ? "#2F7D55" : option === "partial" ? ink.goldAccent : ink.vermilionAccent) : SURFACE,
              border: `1px solid ${answer === option ? (option === "reinforces" ? "#2F7D55" : option === "partial" ? ink.goldAccent : ink.vermilionAccent) : HAIRLINE}`,
              color: answer === option ? "#fff" : INK_SECONDARY,
              fontWeight: 500,
              opacity: answer !== null && answer !== option ? 0.55 : 1,
            }}
          >
            {option === "reinforces" ? "Reinforces" : option === "partial" ? "Partial overlap" : "Does not reinforce"}
          </button>
        ))}
      </div>

      {answer !== null && (
        <div
          className="mt-3 rounded-lg p-3"
          style={{
            background: answer === scenario.answer ? `${"#2F7D55"}10` : `${ink.vermilionAccent}10`,
            border: `1px solid ${answer === scenario.answer ? "#2F7D55" : ink.vermilionAccent}55`,
          }}
        >
          <p className="m-0 text-sm" style={{ color: answer === scenario.answer ? "#2F7D55" : ink.vermilionAccent, fontWeight: 500 }}>
            {answer === scenario.answer ? "Correct" : "Not quite"}
          </p>
          <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>{scenario.reason}</p>
          <button
            type="button"
            onClick={next}
            className="mt-3 rounded-lg px-3 py-2 text-sm"
            style={{ background: ink.goldAccent, color: "#1A1408", fontWeight: 500 }}
          >
            Next example
          </button>
        </div>
      )}
    </div>
  );
}

function DoshaTab() {
  const [selected, setSelected] = useState<DoshaSlug | null>(null);
  const [attemptDeepAyurveda, setAttemptDeepAyurveda] = useState(false);

  return (
    <div className="grid min-w-0 gap-4">
      <Panel eyebrow="§4.3" title="A bounded aside: the tridoṣa-graha bridge">
        <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Classical sources connect the grahas to Vata, Pitta, and Kapha. Click a doṣa to see which grahas are associated.
          Full Āyurvedic doctrine is outside this curriculum&apos;s scope.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {(Object.keys(DOSHA_DATA) as DoshaSlug[]).map((key) => {
            const d = DOSHA_DATA[key];
            const active = selected === key;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={active}
                onClick={() => setSelected(key)}
                className="rounded-xl p-4 text-left"
                style={{
                  background: active ? `${d.color}18` : `${d.color}08`,
                  border: `1px solid ${active ? d.color : HAIRLINE}`,
                }}
              >
                <div className="flex items-center gap-2">
                  {key === "vata" && <Wind size={18} style={{ color: d.color }} aria-hidden="true" />}
                  {key === "pitta" && <Flame size={18} style={{ color: d.color }} aria-hidden="true" />}
                  {key === "kapha" && <Layers size={18} style={{ color: d.color }} aria-hidden="true" />}
                  <span className="text-lg" style={{ color: d.color, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
                    {d.label}
                  </span>
                  <span className="text-sm" style={{ color: INK_MUTED, fontFamily: "var(--font-devanagari), serif" }}>
                    {d.sanskrit}
                  </span>
                </div>
                <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{d.quality}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {d.grahas.map((slug) => (
                    <span key={slug} className="rounded-full px-2 py-1 text-xs" style={{ background: `${grahas[slug].primary}22`, color: grahas[slug].primary, fontWeight: 500 }}>
                      {grahas[slug].iast}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm" style={{ color: INK_SECONDARY }}>
            <input
              type="checkbox"
              checked={attemptDeepAyurveda}
              onChange={(e) => setAttemptDeepAyurveda(e.target.checked)}
              className="h-4 w-4"
            />
            Try to use this for full Āyurvedic constitutional typing
          </label>
          {attemptDeepAyurveda && (
            <div className="mt-3 rounded-lg p-3" style={{ background: `${ink.vermilionAccent}10`, border: `1px solid ${ink.vermilionAccent}55` }}>
              <p className="m-0 text-sm" style={{ color: ink.vermilionAccent, fontWeight: 500 }}>Out of scope.</p>
              <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
                The tridoṣa-graha bridge is stated here as a real, citable connection, but constitutional typing, diet,
                lifestyle, and treatment belong to Āyurveda itself — not this curriculum.
              </p>
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}

function ScopeTab() {
  const [diagnosisMode, setDiagnosisMode] = useState(false);

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-2">
      <Panel eyebrow="§1, §4.4, §6" title="Scope gate: pattern is not diagnosis">
        <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Even a clean two-layer reinforcement (like Saturn in the 11th for bones/joints + calves/ankles) is structurally
          satisfying — and precisely because it is satisfying, it is the most likely place to overstep this lesson&apos;s
          boundary.
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
            <p className="m-0 text-sm" style={{ color: ink.vermilionAccent, fontWeight: 500 }}>Stop — this lesson has not taught contextualisation.</p>
            <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              Identifying a clean reinforcement is correctly-identified pattern. It is not, on its own, evidence of any
              actual condition. Lesson 7.6.3 teaches the higher bar for real application.
            </p>
          </div>
        ) : (
          <div className="mt-4 rounded-lg p-3" style={{ background: `${"#2F7D55"}10`, border: `1px solid ${"#2F7D55"}55` }}>
            <p className="m-0 text-sm" style={{ color: "#2F7D55", fontWeight: 500 }}>Good — stay in descriptive mode.</p>
            <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              Catalogue planetary and house correspondences, note reinforcements, and stop there until the next lesson.
            </p>
          </div>
        )}
      </Panel>

      <Panel eyebrow="What this lesson allows" title="Allowed uses right now">
        <div className="space-y-3">
          <div className="flex items-start gap-3 rounded-lg p-3" style={{ background: `${ink.goldAccent}10`, border: `1px solid ${HAIRLINE}` }}>
            <BookOpen size={18} style={{ color: ink.goldAccent, flexShrink: 0 }} aria-hidden="true" />
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>State each graha&apos;s classical disease/body-system correspondences.</p>
          </div>
          <div className="flex items-start gap-3 rounded-lg p-3" style={{ background: `${ink.goldAccent}10`, border: `1px solid ${HAIRLINE}` }}>
            <Layers size={18} style={{ color: ink.goldAccent, flexShrink: 0 }} aria-hidden="true" />
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>Combine planetary and house layers and check whether they genuinely reinforce.</p>
          </div>
          <div className="flex items-start gap-3 rounded-lg p-3" style={{ background: `${ink.goldAccent}10`, border: `1px solid ${HAIRLINE}` }}>
            <ShieldCheck size={18} style={{ color: ink.goldAccent, flexShrink: 0 }} aria-hidden="true" />
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>Hold the line until Lesson 7.6.3 before applying any pattern to a real medical situation.</p>
          </div>
          <div className="flex items-start gap-3 rounded-lg p-3" style={{ background: `${ink.goldAccent}10`, border: `1px solid ${HAIRLINE}` }}>
            <Lock size={18} style={{ color: ink.goldAccent, flexShrink: 0 }} aria-hidden="true" />
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>Cite the tridoṣa bridge as a bounded aside, not an Āyurvedic licence.</p>
          </div>
        </div>
      </Panel>
    </div>
  );
}
