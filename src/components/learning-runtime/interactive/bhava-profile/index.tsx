"use client";

import { useState } from "react";
import { RotateCcw, Anchor, Sparkles } from "lucide-react";
import { useLessonSlug } from "../rashi-attribute-wheel";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const GREEN = "#2F7D55";
const RED = "#A23A1E";

interface HouseProfile {
  num: number;
  name: string;
  domain: string;
  significations: string;
  body: string;
  people: string;
  karaka: string;
}

// Canonical core profile for each bhava. Full classical significations live in
// each house's lesson prose; the naisargika-karaka full table is Lesson 6.6.4.
const HOUSES: HouseProfile[] = [
  { num: 1, name: "Tanu", domain: "self, body, health", significations: "self, body, appearance, vitality, personality, beginnings, life-direction", body: "head and brain", people: "the native (you)", karaka: "Sun (Mars for vitality)" },
  { num: 2, name: "Dhana", domain: "wealth, speech, family", significations: "accumulated wealth, savings, speech, food, family, values", body: "face, mouth, teeth, throat, right eye", people: "immediate family (kuṭumba)", karaka: "Jupiter" },
  { num: 3, name: "Sahaja", domain: "siblings, courage, effort", significations: "courage, effort, skills, communication, younger siblings, short journeys", body: "arms, shoulders, hands, right ear, upper chest", people: "younger siblings", karaka: "Mars" },
  { num: 4, name: "Sukha", domain: "home, mother, happiness", significations: "home, mother, happiness, land, property, vehicles, education, the heart", body: "chest, heart, lungs", people: "the mother", karaka: "Moon" },
  { num: 5, name: "Putra", domain: "children, intellect, past merit", significations: "children, intelligence, creativity, pūrva-puṇya, mantra, romance, speculation", body: "upper abdomen, stomach", people: "children", karaka: "Jupiter" },
  { num: 6, name: "Ari / Śatru", domain: "enemies, illness, debt, service", significations: "enemies, disease, debt, service, obstacles, litigation, daily work", body: "lower abdomen, intestines", people: "enemies, maternal uncle, servants", karaka: "Mars (and Saturn)" },
  { num: 7, name: "Yuvati", domain: "spouse, partnership, trade", significations: "spouse, marriage, partnership, business, trade, passion, travel", body: "pelvis, lower back, reproductive organs", people: "the spouse / partner", karaka: "Venus" },
  { num: 8, name: "Āyu", domain: "longevity, transformation, the hidden", significations: "longevity, death, transformation, the occult, inheritance, sudden events, chronic illness", body: "external genitalia, excretory organs", people: "in-laws; others' resources", karaka: "Saturn" },
  { num: 9, name: "Bhāgya", domain: "fortune, father, dharma, guru", significations: "fortune, dharma, father, guru, higher learning, pilgrimage, religion, long journeys", body: "hips and thighs", people: "father, guru", karaka: "Jupiter (dharma); Sun (father)" },
  { num: 10, name: "Karma", domain: "career, status, action", significations: "career, profession, status, action, authority, fame, public life", body: "knees", people: "authority figures / employer", karaka: "Saturn (also Sun, Mercury, Jupiter)" },
  { num: 11, name: "Lābha", domain: "gains, elder siblings, networks", significations: "gains, income, fulfilment of desires, elder siblings, friends, networks, ambitions", body: "calves, ankles, left ear", people: "elder siblings, friends", karaka: "Jupiter" },
  { num: 12, name: "Vyaya", domain: "loss, expense, foreign, mokṣa", significations: "loss, expense, foreign lands, isolation, mokṣa, sleep, charity, the hidden", body: "feet, left eye", people: "foreigners; the hidden", karaka: "Saturn" },
];

function houseFromSlug(slug: string): number {
  const m = slug.match(/^(\d+)(?:st|nd|rd|th)-bhava/);
  if (m) {
    const n = Number(m[1]);
    if (n >= 1 && n <= 12) return n;
  }
  return 1;
}

function ordinal(n: number) {
  if (n >= 11 && n <= 13) return "th";
  switch (n % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

function kendraClass(n: number) {
  if ([1, 4, 7, 10].includes(n)) return "Kendra (angle)";
  if ([2, 5, 8, 11].includes(n)) return "Paṇaphara (succedent)";
  return "Āpoklima (cadent)";
}
function qualityClass(n: number) {
  const tags: string[] = [];
  if ([1, 5, 9].includes(n)) tags.push("Trikoṇa");
  if ([6, 8, 12].includes(n)) tags.push("Dusthāna");
  if ([3, 6, 10, 11].includes(n)) tags.push("Upachaya");
  return tags.length ? tags.join(" + ") : "neutral (none of the three)";
}
function purushartha(n: number) {
  if ([1, 5, 9].includes(n)) return "Dharma";
  if ([2, 6, 10].includes(n)) return "Artha";
  if ([3, 7, 11].includes(n)) return "Kāma";
  return "Mokṣa";
}

export function BhavaProfile() {
  const slug = useLessonSlug();
  const houseNum = houseFromSlug(slug);
  const h = HOUSES[houseNum - 1];

  const [lordIn, setLordIn] = useState<number>(houseNum); // where the house-lord sits
  const [drop, setDrop] = useState<"none" | "benefic" | "malefic">("none");

  const target = HOUSES[lordIn - 1];
  const dual = [1, 4, 7, 10].includes(houseNum) && [1, 5, 9].includes(houseNum); // only the 1st

  const dropNote =
    drop === "benefic"
      ? `A benefic in the ${houseNum}${ordinal(houseNum)} tends to protect and smooth its matters (${h.domain}).`
      : drop === "malefic"
        ? `A malefic in the ${houseNum}${ordinal(houseNum)} tends to stress or activate-through-difficulty its matters (${h.domain})${[6, 8, 12].includes(houseNum) ? " — though in a dusthāna a malefic can paradoxically help (a later topic)" : ""}.`
        : "Drop a benefic or a malefic to compare how each colours the house's matters.";

  return (
    <div data-interactive="bhava-profile" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "end", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Bhāva profile</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>{houseNum}{ordinal(houseNum)} house — {h.name}</h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setLordIn(houseNum);
              setDrop("none");
            }}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_SECONDARY, padding: "0.55rem 0.75rem", fontWeight: 850, cursor: "pointer" }}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "1rem", alignItems: "start" }}>
        {/* Ten-attribute profile card */}
        <section style={{ border: `1px solid ${GOLD}`, borderRadius: 8, background: SURFACE, padding: "1rem" }} aria-label={`Ten-attribute profile of the ${houseNum} house`}>
          <Row k="Sanskrit name" v={h.name} />
          <Row k="Number" v={`${houseNum}${ordinal(houseNum)}`} />
          <Row k="Primary life-domain" v={h.domain} />
          <Row k="Significations" v={h.significations} />
          <Row k="Body parts" v={h.body} />
          <Row k="People (roles)" v={h.people} />
          <Row k="Kendra / Paṇaphara / Āpoklima" v={kendraClass(houseNum)} />
          <Row k="Trikoṇa / Dusthāna / Upachaya" v={qualityClass(houseNum) + (dual ? " — the only Kendra-AND-Trikoṇa house" : "")} />
          <Row k="Artha / Dharma / Kāma / Mokṣa" v={purushartha(houseNum)} />
          <Row k="Naisargika kāraka" v={`${h.karaka} (full table: Lesson 6.6.4)`} last />
        </section>

        {/* Interactive: house-lord mover + benefic/malefic drop */}
        <section style={{ display: "grid", gap: "0.85rem" }} aria-label="House-lord and planet-drop controls">
          <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: GOLD, fontWeight: 900 }}>
              <Anchor size={16} aria-hidden="true" />
              {houseNum === 1 ? "Lagneśa (1st-lord) — the chart anchor" : `${houseNum}${ordinal(houseNum)}-lord placement`}
            </div>
            <label style={{ display: "block", marginTop: "0.6rem" }}>
              <span style={{ color: INK_SECONDARY, fontWeight: 800, fontSize: "0.85rem" }}>Place the {h.name}-lord in house:</span>
              <select value={lordIn} onChange={(e) => setLordIn(Number(e.target.value))} style={{ display: "block", width: "100%", marginTop: "0.4rem", padding: "0.5rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: SURFACE, color: INK_PRIMARY, fontWeight: 800 }}>
                {HOUSES.map((x) => <option key={x.num} value={x.num}>{x.num}{ordinal(x.num)} — {x.name}</option>)}
              </select>
            </label>
            <p style={{ margin: "0.6rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
              The {houseNum}{ordinal(houseNum)}-lord in the {lordIn}{ordinal(lordIn)} carries <strong>{h.domain}</strong> into the field of <strong>{target.domain}</strong> — the house's matters go where its lord goes.
              {houseNum === 1 ? " As the Lagneśa, this is the chart's key planet — check it first." : ""}
            </p>
          </section>

          <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              <Sparkles size={15} aria-hidden="true" />
              Drop a planet into the {houseNum}{ordinal(houseNum)}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: "0.5rem", marginTop: "0.6rem" }}>
              {([["none", "None", INK_MUTED], ["benefic", "Benefic", GREEN], ["malefic", "Malefic", RED]] as const).map(([k, label, color]) => (
                <button
                  key={k}
                  type="button"
                  aria-pressed={drop === k}
                  onClick={() => setDrop(k)}
                  style={{ border: `1px solid ${drop === k ? color : HAIRLINE}`, borderRadius: 8, background: drop === k ? color : "transparent", color: drop === k ? "#fff" : INK_SECONDARY, padding: "0.55rem 0.4rem", fontWeight: 850, cursor: "pointer" }}
                >
                  {label}
                </button>
              ))}
            </div>
            <p style={{ margin: "0.6rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{dropNote}</p>
          </section>
        </section>
      </div>
    </div>
  );
}

function Row({ k, v, last }: { k: string; v: string; last?: boolean }) {
  return (
    <div style={{ display: "flex", gap: "0.6rem", alignItems: "baseline", borderBottom: last ? "none" : `1px dashed ${HAIRLINE}`, padding: "0.32rem 0" }}>
      <span style={{ color: INK_SECONDARY, fontWeight: 800, fontSize: "0.82rem", minWidth: "11rem" }}>{k}</span>
      <span style={{ color: INK_PRIMARY, fontSize: "0.9rem", lineHeight: 1.5 }}>{v}</span>
    </div>
  );
}
