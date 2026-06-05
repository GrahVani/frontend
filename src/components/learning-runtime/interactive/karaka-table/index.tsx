"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { CircleDot, Eye, Moon, RotateCcw, Sparkles, Sun } from "lucide-react";

type PlanetKey = "Sun" | "Moon" | "Mars" | "Mercury" | "Jupiter" | "Venus" | "Saturn" | "Ketu" | "Mixed";
type HighlightKey = "all" | "jupiter" | "saturn";
type NativeGender = "man" | "woman";

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

const PLANET_COLORS: Record<PlanetKey, string> = {
  Sun: VERMILION,
  Moon: BLUE,
  Mars: VERMILION,
  Mercury: GREEN,
  Jupiter: GOLD,
  Venus: PURPLE,
  Saturn: BLUE,
  Ketu: PURPLE,
  Mixed: INK_MUTED,
};

const PLANET_ICONS: Partial<Record<PlanetKey, ReactNode>> = {
  Sun: <Sun size={16} />,
  Moon: <Moon size={16} />,
  Mars: <CircleDot size={16} />,
  Jupiter: <CircleDot size={16} />,
  Venus: <CircleDot size={16} />,
  Saturn: <CircleDot size={16} />,
};

const KARAKA_ROWS = [
  { house: 1, name: "Tanu", theme: "Self", primary: ["Sun"], secondary: ["Mars"], note: "Sun shows self and soul; Mars adds vitality." },
  { house: 2, name: "Dhana", theme: "Wealth / speech", primary: ["Jupiter"], secondary: ["Mercury"], note: "Jupiter signifies wealth; Mercury refines speech." },
  { house: 3, name: "Sahaja", theme: "Siblings / courage", primary: ["Mars"], secondary: ["Mercury"], note: "Mars gives valour and sibling force; Mercury adds communication." },
  { house: 4, name: "Sukha", theme: "Mother / home", primary: ["Moon"], secondary: ["Mars", "Mercury", "Venus"], note: "Moon is mother and comfort; Mars land, Mercury education, Venus vehicles." },
  { house: 5, name: "Putra", theme: "Children / intellect", primary: ["Jupiter"], secondary: ["Mercury"], note: "Jupiter is children and wisdom; Mercury helps intellect." },
  { house: 6, name: "Shatru", theme: "Conflict / illness", primary: ["Mars"], secondary: ["Saturn"], note: "Mars handles conflict; Saturn adds illness, service, and hardship." },
  { house: 7, name: "Yuvati", theme: "Spouse / trade", primary: ["Venus", "Jupiter"], secondary: ["Mercury"], note: "Spouse karaka is Venus for wife in a man's chart, Jupiter for husband in a woman's chart." },
  { house: 8, name: "Ayu", theme: "Longevity / hidden", primary: ["Saturn"], secondary: ["Mars", "Ketu"], note: "Saturn signifies longevity; Mars sudden events, Ketu occult depth." },
  { house: 9, name: "Bhagya", theme: "Father / dharma", primary: ["Sun", "Jupiter"], secondary: ["Ketu"], note: "Sun shows father; Jupiter shows dharma, guru, and fortune." },
  { house: 10, name: "Karma", theme: "Work / status", primary: ["Saturn"], secondary: ["Sun", "Mercury", "Jupiter"], note: "Saturn is work and karma; career type can bring Sun, Mercury, or Jupiter forward." },
  { house: 11, name: "Labha", theme: "Gains", primary: ["Jupiter"], secondary: [], note: "Jupiter signifies gains, abundance, and fulfilment." },
  { house: 12, name: "Vyaya", theme: "Loss / moksha", primary: ["Saturn"], secondary: ["Ketu"], note: "Saturn shows loss and renunciation; Ketu shows detachment and moksha." },
] as const;

function effectivePrimary(row: (typeof KARAKA_ROWS)[number], gender: NativeGender) {
  if (row.house !== 7) return row.primary;
  return gender === "man" ? ["Venus"] : ["Jupiter"];
}

function shouldHighlight(row: (typeof KARAKA_ROWS)[number], highlight: HighlightKey, gender: NativeGender) {
  if (highlight === "all") return true;
  const planet = highlight === "jupiter" ? "Jupiter" : "Saturn";
  return [...effectivePrimary(row, gender), ...row.secondary].includes(planet);
}

function planetColor(planets: readonly string[]) {
  if (planets.length !== 1) return PLANET_COLORS.Mixed;
  return PLANET_COLORS[planets[0] as PlanetKey] ?? INK_MUTED;
}

export function KarakaTable() {
  const [selectedHouse, setSelectedHouse] = useState(5);
  const [highlight, setHighlight] = useState<HighlightKey>("jupiter");
  const [gender, setGender] = useState<NativeGender>("man");
  const selected = KARAKA_ROWS[selectedHouse - 1];
  const selectedPrimary = effectivePrimary(selected, gender);
  const selectedColor = planetColor(selectedPrimary);

  const synthesis = useMemo(() => {
    if (selected.house === 7) {
      return gender === "man"
        ? "For a man's spouse question, use Venus as the wife-karaka, then read the 7th house, its lord, occupants, and aspects."
        : "For a woman's spouse question, use Jupiter as the husband-karaka, then read the 7th house, its lord, occupants, and aspects.";
    }
    if (selected.house === 9) return "The 9th needs both Sun and Jupiter: Sun for father, Jupiter for dharma, guru, and fortune.";
    return `Read ${selected.name} twice: first through the ${selected.house}th house, its lord, occupants, and aspects; then through ${selectedPrimary.join(" + ")} as the natural karaka.`;
  }, [gender, selected, selectedPrimary]);

  return (
    <div data-interactive="karaka-table" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Naisargika karaka table</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Natural significator of each bhava
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 850 }}>
              Select a house, highlight Jupiter or Saturn patterns, and practise reading the house through both its own condition and its natural karaka.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedHouse(5);
              setHighlight("jupiter");
              setGender("man");
            }}
            style={buttonStyle(false)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(340px, 1fr) minmax(320px, 0.82fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap", marginBottom: "0.8rem" }}>
            <div>
              <p style={eyebrowStyle}>Twelve-row table</p>
              <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.18rem" }}>
                Click any house
              </h3>
            </div>
            <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
              <button type="button" aria-pressed={highlight === "all"} onClick={() => setHighlight("all")} style={smallChipStyle(highlight === "all", GOLD)}>All</button>
              <button type="button" aria-pressed={highlight === "jupiter"} onClick={() => setHighlight("jupiter")} style={smallChipStyle(highlight === "jupiter", GOLD)}>Jupiter</button>
              <button type="button" aria-pressed={highlight === "saturn"} onClick={() => setHighlight("saturn")} style={smallChipStyle(highlight === "saturn", BLUE)}>Saturn</button>
            </div>
          </div>
          <div style={{ display: "grid", gap: "0.45rem" }}>
            {KARAKA_ROWS.map((row) => {
              const active = selectedHouse === row.house;
              const visible = shouldHighlight(row, highlight, gender);
              const primary = effectivePrimary(row, gender);
              const color = planetColor(primary);
              return (
                <button key={row.house} type="button" onClick={() => setSelectedHouse(row.house)} style={rowStyle(active, visible, color)}>
                  <strong style={{ color }}>{row.house}. {row.name}</strong>
                  <span style={{ color: INK_SECONDARY }}>{row.theme}</span>
                  <span style={{ color: color, fontWeight: 900 }}>{primary.join(" + ")}</span>
                  <span style={{ color: INK_MUTED }}>{row.secondary.length ? row.secondary.join(", ") : "none"}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title={`${selected.house}. ${selected.name}`} icon={<CircleDot size={18} />} color={selectedColor}>
            <KarakaGlyph planets={selectedPrimary} color={selectedColor} />
            <p style={{ margin: "0.7rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{selected.note}</p>
          </Panel>

          <Panel title="7th-house spouse karaka" icon={<CircleDot size={18} />} color={selected.house === 7 ? selectedColor : PURPLE}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button type="button" aria-pressed={gender === "man"} onClick={() => { setGender("man"); setSelectedHouse(7); }} style={smallChipStyle(gender === "man", PURPLE)}>Man&apos;s chart</button>
              <button type="button" aria-pressed={gender === "woman"} onClick={() => { setGender("woman"); setSelectedHouse(7); }} style={smallChipStyle(gender === "woman", GOLD)}>Woman&apos;s chart</button>
            </div>
            <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>
              Choose the spouse karaka by the native: Venus for wife in a man&apos;s chart, Jupiter for husband in a woman&apos;s chart.
            </p>
          </Panel>

          <section style={{ border: `1px solid ${GOLD}66`, borderRadius: 8, background: `${GOLD}16`, padding: "1rem" }}>
            <strong style={{ color: GOLD }}>House + karaka synthesis</strong>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{synthesis}</p>
          </section>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 1fr)", gap: "1rem", alignItems: "start" }}>
        <Panel title="Jupiter pattern" icon={<CircleDot size={18} />} color={GOLD}>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
            Jupiter naturally signifies the 2nd, 5th, 9th, and 11th: wealth, children, dharma, and gains. It also becomes the husband-karaka in a woman&apos;s chart.
          </p>
          <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", marginTop: "0.7rem" }}>
            {[2, 5, 9, 11].map((house) => <button key={house} type="button" onClick={() => setSelectedHouse(house)} style={smallChipStyle(selectedHouse === house, GOLD)}>{house}</button>)}
          </div>
        </Panel>

        <Panel title="Saturn pattern" icon={<CircleDot size={18} />} color={BLUE}>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
            Saturn naturally signifies the 6th, 8th, 10th, and 12th: struggle, longevity, work, and loss. Its nature predicts its effortful houses.
          </p>
          <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", marginTop: "0.7rem" }}>
            {[6, 8, 10, 12].map((house) => <button key={house} type="button" onClick={() => setSelectedHouse(house)} style={smallChipStyle(selectedHouse === house, BLUE)}>{house}</button>)}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function KarakaGlyph({ planets, color }: { planets: readonly string[]; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", flexWrap: "wrap" }}>
      {planets.map((planet) => (
        <div key={planet} style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", border: `1px solid ${color}44`, borderRadius: 8, background: `${color}12`, color, padding: "0.55rem 0.7rem", fontWeight: 950 }}>
          {PLANET_ICONS[planet as PlanetKey] ?? <Sparkles size={16} />}
          {planet}
        </div>
      ))}
      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", color: INK_MUTED, fontWeight: 850 }}>
        <Eye size={15} /> natural significator
      </span>
    </div>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 950 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
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

function rowStyle(active: boolean, visible: boolean, color: string): CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "84px minmax(130px, 1fr) minmax(96px, 0.7fr) minmax(130px, 0.9fr)",
    gap: "0.65rem",
    alignItems: "center",
    textAlign: "left",
    border: `1px solid ${active ? color : visible ? `${color}55` : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}18` : visible ? `${color}0D` : "transparent",
    opacity: visible ? 1 : 0.42,
    padding: "0.65rem",
    cursor: "pointer",
  };
}

const eyebrowStyle: CSSProperties = {
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 900,
};
