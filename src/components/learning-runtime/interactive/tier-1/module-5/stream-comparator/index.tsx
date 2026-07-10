"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { BadgeAlert, BadgeCheck, BookOpen, GitCompare, RotateCcw, ShieldCheck } from "lucide-react";

type StreamKey = "parashari" | "jaimini" | "kp" | "lal-kitab" | "tajika";
type Scenario = "mars-1" | "mercury-6" | "rahu-10";

interface Stream {
  key: StreamKey;
  name: string;
  module: string;
  role: string;
  grahaTreatment: string;
  color: string;
}

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const LAL = "#7A3E4A";

const STREAMS: Stream[] = [
  {
    key: "parashari",
    name: "Parashari",
    module: "Module 05 here",
    role: "Tier 1 default",
    grahaTreatment: "Foundational nature, dignity, friendship, aspects, states, and strength layers.",
    color: BLUE,
  },
  {
    key: "jaimini",
    name: "Jaimini",
    module: "Module 17",
    role: "Degree-based significators",
    grahaTreatment: "Keeps grahas, but reassigns key roles through cara-karakas and rashi-based logic.",
    color: "#6B5AA8",
  },
  {
    key: "kp",
    name: "KP",
    module: "Module 16",
    role: "Sub-lord precision",
    grahaTreatment: "Overlays nakshatra lords and sub-lords on standard planetary placements.",
    color: GREEN,
  },
  {
    key: "lal-kitab",
    name: "Lal Kitab",
    module: "Module 18",
    role: "House-defined grahas",
    grahaTreatment: "Redefines Mars and Mercury by house, fixes Aries as house 1, and uses its own remedies.",
    color: LAL,
  },
  {
    key: "tajika",
    name: "Tajika",
    module: "Module 19",
    role: "Annual-chart specialization",
    grahaTreatment: "Focuses on yearly charts, muntha, sahams, and annual predictive structures.",
    color: GOLD,
  },
];

const SCENARIOS: Record<Scenario, { label: string; parashari: string; lal: string; warning: string }> = {
  "mars-1": {
    label: "Mars in the 1st house",
    parashari: "By Parashari, Mars is a natural malefic in Lagna: energetic, sharp, potentially harsh, and relevant to Mangala-dosha logic.",
    lal: "By Lal Kitab, Mars in the 1st can be Mangal-Nek: a benefic Mars. The house changes the planet's nature.",
    warning: "Do not mix Mangal-Nek with Parashari Mangala-dosha as one hybrid rule.",
  },
  "mercury-6": {
    label: "Mercury in a difficult house",
    parashari: "By Parashari, Mercury borrows nature by association, dignity, lordship, and aspects.",
    lal: "By Lal Kitab, Mercury's benefic or malefic quality can be defined directly by house placement.",
    warning: "Do not replace Parashari association logic with Lal Kitab house logic unless you name the stream.",
  },
  "rahu-10": {
    label: "Rahu in the 10th house",
    parashari: "By Parashari, Rahu is read through sign, house, conjunction, aspects, dispositor, and dasha context.",
    lal: "By Lal Kitab, Rahu is strongly house-register based, with its own remedy logic.",
    warning: "Do not transfer Lal Kitab remedies into a Parashari reading without saying so.",
  },
};

export function StreamComparator() {
  const [selectedStream, setSelectedStream] = useState<StreamKey>("lal-kitab");
  const [scenario, setScenario] = useState<Scenario>("mars-1");
  const [nameStream, setNameStream] = useState(true);
  const stream = STREAMS.find((item) => item.key === selectedStream) ?? STREAMS[0];
  const sample = SCENARIOS[scenario];

  return (
    <div data-interactive="stream-comparator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Multi-stream graha view
            </p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.35rem" }}>
              Name the stream before you read the planet
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedStream("lal-kitab");
              setScenario("mars-1");
              setNameStream(true);
            }}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_SECONDARY, padding: "0.55rem 0.75rem", fontWeight: 850, cursor: "pointer" }}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(330px, 100%), 1fr))", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }} aria-label="Five stream overview">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: BLUE, fontWeight: 950, marginBottom: "0.8rem" }}>
            <BookOpen size={18} aria-hidden="true" />
            Five streams at a glance
          </div>
          <div style={{ display: "grid", gap: "0.6rem" }}>
            {STREAMS.map((item) => (
              <button
                key={item.key}
                type="button"
                aria-pressed={selectedStream === item.key}
                onClick={() => setSelectedStream(item.key)}
                style={{
                  border: `1px solid ${selectedStream === item.key ? item.color : HAIRLINE}`,
                  borderRadius: 8,
                  background: selectedStream === item.key ? `${item.color}18` : "transparent",
                  color: selectedStream === item.key ? item.color : INK_SECONDARY,
                  padding: "0.75rem",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <strong style={{ display: "block", fontSize: "1rem" }}>{item.name}</strong>
                <span style={{ display: "block", marginTop: "0.25rem", color: INK_MUTED }}>{item.role} - {item.module}</span>
              </button>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }} aria-label="Selected stream detail">
          <Panel title={stream.name} icon={<ShieldCheck size={18} />} color={stream.color}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>{stream.grahaTreatment}</p>
            <p style={{ margin: "0.55rem 0 0", color: INK_MUTED, fontWeight: 850 }}>Deep dive: {stream.module}</p>
          </Panel>

          <Panel title="Lal Kitab divergences" icon={<BadgeAlert size={18} />} color={LAL}>
            <ul style={{ margin: 0, paddingLeft: "1.15rem", color: INK_SECONDARY, lineHeight: 1.65 }}>
              <li>Mars split by house: Mangal-Nek and Mangal-Bad.</li>
              <li>Mercury split by house rather than association only.</li>
              <li>Aries can be fixed as house 1 regardless of actual Lagna.</li>
              <li>Nodes and remedies use a distinctive house-based register.</li>
            </ul>
          </Panel>
        </section>
      </div>

      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }} aria-label="Same placement across streams">
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap", marginBottom: "0.85rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: BLUE, fontWeight: 950 }}>
            <GitCompare size={18} aria-hidden="true" />
            Same placement, two coherent readings
          </div>
          <select value={scenario} onChange={(event) => setScenario(event.target.value as Scenario)} style={inputStyle}>
            {Object.entries(SCENARIOS).map(([key, item]) => <option key={key} value={key}>{item.label}</option>)}
          </select>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.8rem" }}>
          <ReadingCard title="By Parashari" color={BLUE} body={sample.parashari} />
          <ReadingCard title="By Lal Kitab" color={LAL} body={sample.lal} />
        </div>

        <div style={{ marginTop: "0.85rem", border: `1px solid ${nameStream ? GREEN : VERMILION}55`, borderRadius: 8, background: `${nameStream ? GREEN : VERMILION}12`, padding: "1rem" }}>
          <button
            type="button"
            aria-pressed={nameStream}
            onClick={() => setNameStream((value) => !value)}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", border: `1px solid ${nameStream ? GREEN : VERMILION}`, borderRadius: 8, background: nameStream ? GREEN : VERMILION, color: "#fff", padding: "0.55rem 0.7rem", fontWeight: 900, cursor: "pointer" }}
          >
            {nameStream ? <BadgeCheck size={16} /> : <BadgeAlert size={16} />}
            Name the stream {nameStream ? "on" : "off"}
          </button>
          <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
            {nameStream
              ? "Clean reading: both statements can stand because each is clearly labelled inside its own system."
              : `Blended reading error: ${sample.warning}`}
          </p>
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.8rem" }} aria-label="Module 5 closure">
        <Closure title="Module 05 completed" body="You now have the nine grahas, upagrahas, dignity, friendships, and special states." />
        <Closure title="Tier 1 default" body="Read Parashari by default until a stream is explicitly named." />
        <Closure title="Deep dives ahead" body="KP, Jaimini, Lal Kitab, and Tajika each receive their own later module." />
        <Closure title="Next core triad piece" body="Module 06 moves from planets to houses: where life receives the grahas." />
      </section>
    </div>
  );
}

const inputStyle = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: "rgba(255,251,241,0.78)",
  color: INK_PRIMARY,
  padding: "0.58rem 0.65rem",
  fontWeight: 850,
} as const;

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 950 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function ReadingCard({ title, color, body }: { title: string; color: string; body: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}10`, padding: "0.95rem" }}>
      <strong style={{ color }}>{title}</strong>
      <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{body}</p>
    </div>
  );
}

function Closure({ title, body }: { title: string; body: string }) {
  return (
    <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "0.9rem" }}>
      <strong style={{ color: GOLD }}>{title}</strong>
      <p style={{ margin: "0.4rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{body}</p>
    </div>
  );
}
