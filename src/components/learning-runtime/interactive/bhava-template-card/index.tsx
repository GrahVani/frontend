"use client";

import { useState } from "react";
import { RotateCcw, Layers } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const GREEN = "#2F7D55";
const MUTED_BG = "rgba(255,251,241,0.6)";

interface House {
  num: number;
  name: string;
  domain: string;
}

const HOUSES: House[] = [
  { num: 1, name: "Tanu", domain: "self, body, health" },
  { num: 2, name: "Dhana", domain: "wealth, speech, family" },
  { num: 3, name: "Sahaja", domain: "siblings, courage, effort" },
  { num: 4, name: "Sukha", domain: "home, mother, happiness" },
  { num: 5, name: "Putra", domain: "children, intellect, past merit" },
  { num: 6, name: "Ari", domain: "enemies, illness, debt, service" },
  { num: 7, name: "Yuvati", domain: "spouse, partnership, trade" },
  { num: 8, name: "Āyu", domain: "longevity, transformation, the hidden" },
  { num: 9, name: "Bhāgya", domain: "fortune, father, dharma, guru" },
  { num: 10, name: "Karma", domain: "career, status, action" },
  { num: 11, name: "Lābha", domain: "gains, elder siblings, networks" },
  { num: 12, name: "Vyaya", domain: "loss, expense, foreign, mokṣa" },
];

// Group C classifications are all derivable from the house number.
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

// Group B + D are per-house lesson content (Chapters 2-6). Only the 1st house is
// pre-filled here as the worked model; the rest point to their own lessons so no
// deferred per-house data (esp. the naisargika-karaka table, Lesson 6.6.4) is fabricated.
const FIRST_FILL = {
  significations: "self, body, health, vitality, personality, the head — the overall “you” (full classical list in Chapter 2)",
  body: "the head and the overall constitution",
  people: "the native (you)",
  karaka: "Sun (preview — full naisargika-kāraka table in Lesson 6.6.4)",
};

// The five attributes the per-graha template (Lesson 5.1.1, fifteen attributes) has
// but a house does not — planets are agents, houses are arenas.
const GRAHA_ONLY = [
  ["Friendships", "the 9×9 grid — houses do not befriend each other"],
  ["Special states", "retrograde / combust / age — a house has bhāva-bala, computed not categorised"],
  ["Pakṣa-bala", "the lights have it; a place does not"],
  ["Daśā years", "a planet's Vimśottarī span; not a house attribute"],
  ["Gem / metal", "a remedial planet attribute; houses have none"],
];

export function BhavaTemplateCard() {
  const [houseNum, setHouseNum] = useState(1);
  const [showGraha, setShowGraha] = useState(false);

  const house = HOUSES[houseNum - 1];
  const isModel = houseNum === 1;

  return (
    <div data-interactive="bhava-template-card" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "end", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Bhāva template card</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>Ten attributes, four groups</h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setHouseNum(1);
              setShowGraha(false);
            }}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_SECONDARY, padding: "0.55rem 0.75rem", fontWeight: 850, cursor: "pointer" }}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.85rem" }}>
          {HOUSES.map((h) => (
            <button
              key={h.num}
              type="button"
              aria-pressed={h.num === houseNum}
              onClick={() => setHouseNum(h.num)}
              style={{ border: `1px solid ${h.num === houseNum ? GOLD : HAIRLINE}`, borderRadius: 8, background: h.num === houseNum ? GOLD : "transparent", color: h.num === houseNum ? "#fff" : INK_SECONDARY, padding: "0.35rem 0.6rem", fontWeight: 850, fontSize: "0.85rem", cursor: "pointer" }}
            >
              {h.num}
            </button>
          ))}
          <button
            type="button"
            aria-pressed={showGraha}
            onClick={() => setShowGraha((v) => !v)}
            style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: "0.4rem", border: `1px solid ${showGraha ? GREEN : HAIRLINE}`, borderRadius: 8, background: showGraha ? GREEN : "transparent", color: showGraha ? "#fff" : INK_SECONDARY, padding: "0.35rem 0.7rem", fontWeight: 850, fontSize: "0.85rem", cursor: "pointer" }}
          >
            <Layers size={14} aria-hidden="true" />
            Per-graha template
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: showGraha ? "repeat(auto-fit, minmax(280px, 1fr))" : "1fr", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${GOLD}`, borderRadius: 8, background: SURFACE, padding: "1rem" }} aria-label={`Template for the ${house.num} house`}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.6rem", flexWrap: "wrap" }}>
            <strong style={{ color: GOLD, fontSize: "1.1rem" }}>{house.num}{ordinal(house.num)} house — {house.name}</strong>
            {isModel ? <span style={{ fontSize: "0.72rem", fontWeight: 900, color: GOLD, border: `1px solid ${GOLD}`, borderRadius: 999, padding: "0.05rem 0.5rem" }}>PRE-FILLED MODEL</span> : null}
          </div>

          <Group label="A — Identity (3)">
            <Row n="1" k="Sanskrit name" v={house.name} />
            <Row n="2" k="Number" v={`${house.num}${ordinal(house.num)}`} />
            <Row n="3" k="Primary life-domain" v={house.domain} />
          </Group>

          <Group label="B — Significations (3)">
            <Row n="4" k="Full classical significations" v={isModel ? FIRST_FILL.significations : "→ documented in this house's lesson (Ch 2–5)"} dim={!isModel} />
            <Row n="5" k="Body parts" v={isModel ? FIRST_FILL.body : "→ this house's lesson"} dim={!isModel} />
            <Row n="6" k="People (roles)" v={isModel ? FIRST_FILL.people : "→ this house's lesson"} dim={!isModel} />
          </Group>

          <Group label="C — Classifications (3)">
            <Row n="7" k="Kendra / Paṇaphara / Āpoklima" v={kendraClass(house.num)} />
            <Row n="8" k="Trikoṇa / Dusthāna / Upachaya" v={qualityClass(house.num)} />
            <Row n="9" k="Artha / Dharma / Kāma / Mokṣa" v={purushartha(house.num)} />
          </Group>

          <Group label="D — Significator (1)">
            <Row n="10" k="Naisargika kāraka" v={isModel ? FIRST_FILL.karaka : "→ full table in Lesson 6.6.4"} dim={!isModel} />
          </Group>
        </section>

        {showGraha ? (
          <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: MUTED_BG, padding: "1rem" }} aria-label="The five planet-only attributes a house lacks">
            <div style={{ color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Per-graha template — the 5 dropped attributes</div>
            <p style={{ margin: "0.4rem 0 0.7rem", color: INK_SECONDARY, lineHeight: 1.55 }}>Planets are agents; houses are arenas. The per-graha template (Lesson 5.1.1) had fifteen attributes; these five do not apply to a place:</p>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              {GRAHA_ONLY.map(([k, why]) => (
                <div key={k} style={{ border: `1px dashed ${HAIRLINE}`, borderRadius: 8, padding: "0.55rem 0.7rem" }}>
                  <strong style={{ color: INK_PRIMARY }}>{k}</strong>
                  <span style={{ color: INK_MUTED }}> — house? <strong style={{ color: "#A23A1E" }}>no</strong>. {why}.</span>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
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

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: "0.6rem" }}>
      <div style={{ color: INK_MUTED, fontSize: "0.74rem", fontWeight: 900, letterSpacing: "0.05em", textTransform: "uppercase", margin: "0.3rem 0" }}>{label}</div>
      <div style={{ display: "grid", gap: "0.3rem" }}>{children}</div>
    </div>
  );
}

function Row({ n, k, v, dim }: { n: string; k: string; v: string; dim?: boolean }) {
  return (
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "baseline", borderBottom: `1px dashed ${HAIRLINE}`, paddingBottom: "0.25rem" }}>
      <span style={{ color: INK_MUTED, fontWeight: 900, fontSize: "0.78rem", minWidth: "1.3rem" }}>{n}</span>
      <span style={{ color: INK_SECONDARY, fontWeight: 800, fontSize: "0.84rem", minWidth: "11rem" }}>{k}</span>
      <span style={{ color: dim ? INK_MUTED : INK_PRIMARY, fontStyle: dim ? "italic" : "normal", fontSize: "0.9rem" }}>{v}</span>
    </div>
  );
}
