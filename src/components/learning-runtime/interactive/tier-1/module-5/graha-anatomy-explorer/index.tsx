"use client";

import { useMemo, useState } from "react";
import {
  BadgeCheck,
  CircleDot,
  Gem,
  Orbit,
  RotateCcw,
  Sparkles,
  Sun,
} from "lucide-react";

type GrahaKey = "sun" | "moon" | "mars" | "mercury" | "jupiter" | "venus" | "saturn" | "rahu" | "ketu";
type LensKey = "identity" | "correspondence" | "karaka" | "placement" | "behaviour";

interface Graha {
  key: GrahaKey;
  name: string;
  sanskrit: string;
  color: string;
  nature: string;
  element: string;
  gem: string;
  metal: string;
  direction: string;
  karakas: string[];
  exalted: string;
  debilitated: string;
  behaviour: string;
}

const GRAHAS: Graha[] = [
  { key: "sun", name: "Sun", sanskrit: "Surya", color: "#C9821E", nature: "Royal, steady, sattvic authority", element: "Bones and vitality", gem: "Ruby", metal: "Copper", direction: "East", karakas: ["Self", "Father", "King", "Status", "Vitality"], exalted: "Aries", debilitated: "Libra", behaviour: "Direct, illuminating, separating what is central from what is secondary." },
  { key: "moon", name: "Moon", sanskrit: "Chandra", color: "#6F86B7", nature: "Reflective, nourishing, changeable", element: "Fluids and mind", gem: "Pearl", metal: "Silver", direction: "North-west", karakas: ["Mind", "Mother", "Comfort", "Public", "Memory"], exalted: "Taurus", debilitated: "Scorpio", behaviour: "Waxing and waning; it shows receptivity, mood, and adaptation." },
  { key: "mars", name: "Mars", sanskrit: "Mangala", color: "#B94832", nature: "Sharp, active, protective", element: "Blood and muscle", gem: "Red coral", metal: "Copper", direction: "South", karakas: ["Courage", "Siblings", "Land", "Conflict", "Surgery"], exalted: "Capricorn", debilitated: "Cancer", behaviour: "Cuts, defends, competes, and acts under pressure." },
  { key: "mercury", name: "Mercury", sanskrit: "Budha", color: "#2F8A61", nature: "Adaptive, analytical, verbal", element: "Skin and nerves", gem: "Emerald", metal: "Bronze", direction: "North", karakas: ["Speech", "Learning", "Trade", "Writing", "Calculation"], exalted: "Virgo", debilitated: "Pisces", behaviour: "Copies nearby influence; association matters more than reputation." },
  { key: "jupiter", name: "Jupiter", sanskrit: "Guru", color: "#B88719", nature: "Wise, expansive, protective", element: "Fat and growth", gem: "Yellow sapphire", metal: "Gold", direction: "North-east", karakas: ["Wisdom", "Children", "Teacher", "Dharma", "Wealth"], exalted: "Cancer", debilitated: "Capricorn", behaviour: "Expands, blesses, teaches, and gives meaning to the chart story." },
  { key: "venus", name: "Venus", sanskrit: "Shukra", color: "#A85C87", nature: "Refined, relational, artistic", element: "Reproductive vitality", gem: "Diamond", metal: "Silver", direction: "South-east", karakas: ["Marriage", "Pleasure", "Art", "Vehicles", "Luxury"], exalted: "Pisces", debilitated: "Virgo", behaviour: "Harmonizes, beautifies, negotiates, and seeks enjoyment." },
  { key: "saturn", name: "Saturn", sanskrit: "Shani", color: "#56616F", nature: "Slow, dry, disciplined", element: "Nerves and chronic strain", gem: "Blue sapphire", metal: "Iron", direction: "West", karakas: ["Labor", "Delay", "Service", "Age", "Endurance"], exalted: "Libra", debilitated: "Aries", behaviour: "Tests durability, makes consequences visible, and matures through time." },
  { key: "rahu", name: "Rahu", sanskrit: "Rahu", color: "#6D5CA8", nature: "Amplifying, foreign, obsessive", element: "Smoke and appetite", gem: "Hessonite", metal: "Mixed metals", direction: "South-west", karakas: ["Desire", "Foreignness", "Technology", "Disruption", "Ambition"], exalted: "Tradition-sensitive", debilitated: "Tradition-sensitive", behaviour: "Magnifies the field it touches and breaks ordinary boundaries." },
  { key: "ketu", name: "Ketu", sanskrit: "Ketu", color: "#8A6A3F", nature: "Severing, inward, moksha-oriented", element: "Subtle fire", gem: "Cat's eye", metal: "Mixed metals", direction: "North-west", karakas: ["Release", "Insight", "Past karma", "Renunciation", "Precision"], exalted: "Tradition-sensitive", debilitated: "Tradition-sensitive", behaviour: "Cuts attachment, sharpens perception, and makes worldly results less sticky." },
];

const LENSES: { key: LensKey; label: string; icon: React.ReactNode }[] = [
  { key: "identity", label: "Identity", icon: <Sun size={16} /> },
  { key: "correspondence", label: "Correspondence", icon: <Gem size={16} /> },
  { key: "karaka", label: "Karaka", icon: <Sparkles size={16} /> },
  { key: "placement", label: "Placement", icon: <CircleDot size={16} /> },
  { key: "behaviour", label: "Behaviour", icon: <Orbit size={16} /> },
];

const lensCopy: Record<LensKey, { title: string; body: string }> = {
  identity: { title: "Who the graha is", body: "Start with nature, temperament, and role before jumping into chart results." },
  correspondence: { title: "What it corresponds to", body: "Gem, metal, direction, and body register form the physical memory hooks." },
  karaka: { title: "What it signifies", body: "Karaka meanings are the workhorse layer: the topics this graha naturally points toward." },
  placement: { title: "Where it gains or loses strength", body: "Dignity does not replace interpretation, but it tells you whether the graha speaks with ease." },
  behaviour: { title: "How it behaves", body: "State, motion, and association show the graha's operating style in context." },
};

const bucketAnswers: Record<string, LensKey> = {
  Ruby: "correspondence",
  Father: "karaka",
  Exaltation: "placement",
  Retrograde: "behaviour",
  "Royal nature": "identity",
};

export function GrahaAnatomyExplorer() {
  const [selectedGraha, setSelectedGraha] = useState<GrahaKey>("sun");
  const [selectedLens, setSelectedLens] = useState<LensKey>("identity");
  const [answers, setAnswers] = useState<Record<string, LensKey | null>>(
    Object.fromEntries(Object.keys(bucketAnswers).map((key) => [key, null]))
  );

  const graha = useMemo(
    () => GRAHAS.find((item) => item.key === selectedGraha) ?? GRAHAS[0],
    [selectedGraha]
  );
  const correctCount = Object.entries(answers).filter(([chip, answer]) => answer === bucketAnswers[chip]).length;

  return (
    <div data-interactive="graha-anatomy-explorer" style={{ display: "grid", gap: "1rem", color: "var(--gl-ink-on-cream-primary)" }}>
      <div className="gl-surface-twilight-glass" style={{ padding: "1rem", display: "grid", gap: "0.9rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
          {GRAHAS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setSelectedGraha(item.key)}
              className="gl-focus-ring"
              style={{
                border: `1px solid ${selectedGraha === item.key ? item.color : "var(--gl-gold-hairline)"}`,
                background: selectedGraha === item.key ? `${item.color}22` : "var(--gl-card-surface-solid)",
                color: "var(--gl-ink-on-cream-primary)",
                borderRadius: "999px",
                padding: "0.45rem 0.7rem",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              {item.name}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(220px, 0.9fr) minmax(260px, 1.1fr)", gap: "1rem" }}>
          <section style={{ border: "1px solid var(--gl-gold-hairline)", background: "var(--gl-card-surface-solid)", padding: "1rem", borderRadius: "8px", textAlign: "center" }}>
            <div
              aria-hidden="true"
              style={{
                width: "170px",
                height: "170px",
                borderRadius: "50%",
                margin: "0 auto 1rem",
                display: "grid",
                placeItems: "center",
                color: "#FFF8DE",
                background: `radial-gradient(circle at 35% 30%, #fff3 0 18%, ${graha.color} 45%, #2D241C 100%)`,
                boxShadow: `0 0 42px ${graha.color}55`,
                fontSize: "2.2rem",
                fontWeight: 900,
              }}
            >
              {graha.sanskrit.slice(0, 2)}
            </div>
            <h3 style={{ margin: 0, fontSize: "1.35rem", color: "var(--gl-ink-on-cream-primary)" }}>{graha.sanskrit}</h3>
            <p style={{ margin: "0.25rem 0 0", color: "var(--gl-ink-on-cream-secondary)" }}>{graha.name}</p>
          </section>

          <section style={{ border: "1px solid var(--gl-gold-hairline)", background: "var(--gl-card-surface-solid)", padding: "1rem", borderRadius: "8px" }}>
            <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", marginBottom: "0.9rem" }}>
              {LENSES.map((lens) => (
                <button
                  key={lens.key}
                  type="button"
                  onClick={() => setSelectedLens(lens.key)}
                  className="gl-focus-ring"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    border: `1px solid ${selectedLens === lens.key ? graha.color : "var(--gl-gold-hairline)"}`,
                    background: selectedLens === lens.key ? `${graha.color}18` : "transparent",
                    color: "var(--gl-ink-on-cream-primary)",
                    borderRadius: "8px",
                    padding: "0.5rem 0.65rem",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  {lens.icon}
                  {lens.label}
                </button>
              ))}
            </div>

            <h3 style={{ margin: "0 0 0.4rem", color: graha.color }}>{lensCopy[selectedLens].title}</h3>
            <p style={{ margin: "0 0 1rem", color: "var(--gl-ink-on-cream-secondary)", lineHeight: 1.5 }}>{lensCopy[selectedLens].body}</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.65rem" }}>
              {selectedLens === "identity" && <Fact label="Nature" value={graha.nature} />}
              {selectedLens === "correspondence" && (
                <>
                  <Fact label="Gem" value={graha.gem} />
                  <Fact label="Metal" value={graha.metal} />
                  <Fact label="Body register" value={graha.element} />
                  <Fact label="Direction" value={graha.direction} />
                </>
              )}
              {selectedLens === "karaka" && graha.karakas.map((item) => <Fact key={item} label="Karaka" value={item} />)}
              {selectedLens === "placement" && (
                <>
                  <Fact label="Exalted" value={graha.exalted} />
                  <Fact label="Debilitated" value={graha.debilitated} />
                </>
              )}
              {selectedLens === "behaviour" && <Fact label="Operating style" value={graha.behaviour} />}
            </div>
          </section>
        </div>
      </div>

      <section className="gl-surface-twilight-glass" style={{ padding: "1rem", display: "grid", gap: "0.85rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <h3 style={{ margin: 0, color: "var(--gl-ink-on-cream-primary)" }}>Build the template</h3>
            <p style={{ margin: "0.2rem 0 0", color: "var(--gl-ink-on-cream-secondary)" }}>Sort each attribute into its correct graha lens.</p>
          </div>
          <button
            type="button"
            onClick={() => setAnswers(Object.fromEntries(Object.keys(bucketAnswers).map((key) => [key, null])))}
            className="gl-focus-ring"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", border: "1px solid var(--gl-gold-hairline)", background: "var(--gl-card-surface-solid)", borderRadius: "8px", padding: "0.5rem 0.75rem", cursor: "pointer", fontWeight: 800 }}
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.65rem" }}>
          {Object.keys(bucketAnswers).map((chip) => (
            <label key={chip} style={{ border: "1px solid var(--gl-gold-hairline)", background: "var(--gl-card-surface-solid)", borderRadius: "8px", padding: "0.75rem", display: "grid", gap: "0.45rem" }}>
              <span style={{ fontWeight: 900 }}>{chip}</span>
              <select
                value={answers[chip] ?? ""}
                onChange={(event) => setAnswers((current) => ({ ...current, [chip]: event.target.value as LensKey }))}
                style={{ width: "100%", border: "1px solid var(--gl-gold-hairline)", borderRadius: "6px", padding: "0.45rem", background: "#FFFDF5" }}
              >
                <option value="">Choose lens</option>
                {LENSES.map((lens) => <option key={lens.key} value={lens.key}>{lens.label}</option>)}
              </select>
              {answers[chip] && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", color: answers[chip] === bucketAnswers[chip] ? "#2F7D55" : "#A23A1E", fontWeight: 800 }}>
                  <BadgeCheck size={15} />
                  {answers[chip] === bucketAnswers[chip] ? "Correct" : "Try another lens"}
                </span>
              )}
            </label>
          ))}
        </div>

        <div style={{ borderTop: "1px solid var(--gl-gold-hairline)", paddingTop: "0.75rem", color: "var(--gl-ink-on-cream-secondary)", fontWeight: 800 }}>
          Template fluency: {correctCount} of {Object.keys(bucketAnswers).length}
        </div>
      </section>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ border: "1px solid var(--gl-gold-hairline)", borderRadius: "8px", padding: "0.75rem", background: "#FFFDF7" }}>
      <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--gl-ink-on-cream-muted)", fontWeight: 900 }}>{label}</div>
      <div style={{ marginTop: "0.25rem", fontWeight: 800, color: "var(--gl-ink-on-cream-primary)" }}>{value}</div>
    </div>
  );
}

