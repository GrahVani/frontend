"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Eclipse, Eye, Moon, RotateCcw, Scale, Sun } from "lucide-react";

type BalanceMode = "rahu" | "balanced" | "ketu";
type LightContact = "none" | "sun" | "moon";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const RAHU = "#6B5AA8";
const KETU = "#8A6A2A";
const SUN = "#D99622";
const MOON = "#6D7FA8";
const GREEN = "#2F7D55";
const RED = "#A44135";

const HOUSES = [
  { house: 1, label: "Self", rahu: "identity, visibility, personal hunger", ketu: "release through the other" },
  { house: 2, label: "Speech / wealth", rahu: "resources, voice, family patterns", ketu: "release through crisis and shared resources" },
  { house: 3, label: "Effort", rahu: "courage, skills, communication", ketu: "release through faith and long-distance meaning" },
  { house: 4, label: "Home", rahu: "roots, property, inner security", ketu: "release through public duty" },
  { house: 5, label: "Creativity", rahu: "children, learning, performance", ketu: "release through groups and collective work" },
  { house: 6, label: "Service", rahu: "work, conflict, health discipline", ketu: "release through retreat and surrender" },
  { house: 7, label: "Partnership", rahu: "marriage, contracts, the other", ketu: "release through self-definition" },
  { house: 8, label: "Transformation", rahu: "secrets, depth, inheritance, occult", ketu: "release through stability and simple values" },
  { house: 9, label: "Dharma", rahu: "teachers, pilgrimage, belief systems", ketu: "release through immediate effort" },
  { house: 10, label: "Career", rahu: "status, authority, public achievement", ketu: "release through inner security and home" },
  { house: 11, label: "Networks", rahu: "gains, communities, large ambitions", ketu: "release through personal creativity" },
  { house: 12, label: "Beyond", rahu: "foreign lands, isolation, moksha hunger", ketu: "release through daily service" },
];

function opposite(house: number) {
  return ((house + 5) % 12) + 1;
}

function point(house: number, radius: number) {
  const angle = ((house - 1) * 30 - 90) * (Math.PI / 180);
  return { x: 180 + radius * Math.cos(angle), y: 180 + radius * Math.sin(angle) };
}

export function NodeAxisReader() {
  const [rahuHouse, setRahuHouse] = useState(10);
  const [mode, setMode] = useState<BalanceMode>("balanced");
  const [lightContact, setLightContact] = useState<LightContact>("none");
  const ketuHouse = opposite(rahuHouse);
  const rahuData = HOUSES[rahuHouse - 1];
  const ketuData = HOUSES[ketuHouse - 1];
  const rahuPoint = point(rahuHouse, 124);
  const ketuPoint = point(ketuHouse, 124);

  const balanceText = useMemo(() => {
    if (mode === "rahu") return "Rahu-heavy: grasping outruns release. Watch over-amplification, obsession, and addiction to the Rahu house.";
    if (mode === "ketu") return "Ketu-heavy: release outruns engagement. Watch withdrawal, bypassing, and drifting away from the Rahu task.";
    return "Balanced axis: Rahu engages life outwardly while Ketu teaches release inwardly. Both ends are read together.";
  }, [mode]);

  const shadowText = useMemo(() => {
    if (lightContact === "sun") return "Node on Sun: the eclipse-grudge touches authority, vitality, father, and identity.";
    if (lightContact === "moon") return "Node on Moon: the eclipse-grudge touches mind, mother, comfort, memory, and emotional safety.";
    return "No light contact selected: read the lifelong axis first, then add eclipse-shadow only when Sun or Moon is involved.";
  }, [lightContact]);

  return (
    <div data-interactive="node-axis-reader" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "end", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Node axis reader
            </p>
            <h2 style={{ margin: "0.2rem 0 0", color: RAHU, fontSize: "1.35rem" }}>
              One severed being, one axis-theme
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setRahuHouse(10);
              setMode("balanced");
              setLightContact("none");
            }}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_SECONDARY, padding: "0.55rem 0.75rem", fontWeight: 850, cursor: "pointer" }}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }} aria-label="Rahu Ketu house axis">
          <svg viewBox="0 0 360 360" role="img" aria-label="Rahu and Ketu opposite house axis" style={{ width: "100%", height: "auto", display: "block" }}>
            <circle cx="180" cy="180" r="148" fill="rgba(255,251,241,0.7)" stroke={HAIRLINE} />
            <line x1={rahuPoint.x} y1={rahuPoint.y} x2={ketuPoint.x} y2={ketuPoint.y} stroke="rgba(75,58,35,0.38)" strokeWidth="4" strokeDasharray="8 6" />
            {[...Array(12)].map((_, index) => {
              const house = index + 1;
              const p = point(house, 124);
              const isRahu = house === rahuHouse;
              const isKetu = house === ketuHouse;
              const fill = isRahu ? RAHU : isKetu ? KETU : "#fff";
              const stroke = isRahu ? RAHU : isKetu ? KETU : HAIRLINE;
              return (
                <g
                  key={house}
                  role="button"
                  tabIndex={0}
                  aria-label={`Place Rahu in house ${house}`}
                  aria-pressed={isRahu}
                  onClick={() => setRahuHouse(house)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setRahuHouse(house);
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <circle cx={p.x} cy={p.y} r={isRahu || isKetu ? 24 : 19} fill={fill} stroke={stroke} strokeWidth={isRahu || isKetu ? 3 : 1.5} />
                  <text x={p.x} y={p.y + 4} textAnchor="middle" fill={isRahu || isKetu ? "#fff" : INK_SECONDARY} fontSize="11" fontWeight="900" pointerEvents="none">
                    {isRahu ? "Ra" : isKetu ? "Ke" : house}
                  </text>
                </g>
              );
            })}
            <circle cx="180" cy="180" r="52" fill="rgba(107,90,168,0.12)" stroke={RAHU} strokeWidth="2" />
            <text x="180" y="174" textAnchor="middle" fill={RAHU} fontSize="18" fontWeight="900">Axis</text>
            <text x="180" y="197" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="800">read both ends</text>
          </svg>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }} aria-label="Axis interpretation">
          <Step title={`Rahu in ${rahuHouse}: ${rahuData.label}`} color={RAHU} icon={<Eye size={18} aria-hidden="true" />}>
            The head grasps outward through {rahuData.rahu}.
          </Step>
          <Step title={`Ketu in ${ketuHouse}: ${ketuData.label}`} color={KETU} icon={<Scale size={18} aria-hidden="true" />}>
            The body releases inward through {ketuData.ketu}.
          </Step>
          <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
            <div style={{ color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Single axis-theme</div>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.65 }}>
              Build {rahuData.label.toLowerCase()} engagement without using it as a substitute for peace; release through {ketuData.label.toLowerCase()} without disappearing from the Rahu task.
            </p>
          </section>
        </section>
      </div>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.85rem" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
          <div style={{ color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Balance toggle</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.5rem", marginTop: "0.75rem" }}>
            {[
              ["rahu", "Rahu-heavy", RAHU],
              ["balanced", "Balanced", GREEN],
              ["ketu", "Ketu-heavy", KETU],
            ].map(([key, label, color]) => (
              <button
                key={key}
                type="button"
                aria-pressed={mode === key}
                onClick={() => setMode(key as BalanceMode)}
                style={{ border: `1px solid ${mode === key ? color : HAIRLINE}`, borderRadius: 8, background: mode === key ? color : "transparent", color: mode === key ? "#fff" : INK_SECONDARY, padding: "0.62rem 0.45rem", fontWeight: 850, cursor: "pointer" }}
              >
                {label}
              </button>
            ))}
          </div>
          <p style={{ margin: "0.8rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{balanceText}</p>
        </section>

        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: RED, fontWeight: 900 }}>
            <Eclipse size={18} aria-hidden="true" />
            Eclipse-shadow contact
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.5rem", marginTop: "0.75rem" }}>
            {[
              ["none", "None", INK_MUTED],
              ["sun", "Sun", SUN],
              ["moon", "Moon", MOON],
            ].map(([key, label, color]) => (
              <button
                key={key}
                type="button"
                aria-pressed={lightContact === key}
                onClick={() => setLightContact(key as LightContact)}
                style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.35rem", border: `1px solid ${lightContact === key ? color : HAIRLINE}`, borderRadius: 8, background: lightContact === key ? color : "transparent", color: lightContact === key ? "#fff" : INK_SECONDARY, padding: "0.62rem 0.45rem", fontWeight: 850, cursor: "pointer" }}
              >
                {key === "sun" ? <Sun size={15} aria-hidden="true" /> : key === "moon" ? <Moon size={15} aria-hidden="true" /> : null}
                {label}
              </button>
            ))}
          </div>
          <p style={{ margin: "0.8rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{shadowText}</p>
        </section>
      </section>
    </div>
  );
}

function Step({ title, color, icon, children }: { title: string; color: string; icon: ReactNode; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 900 }}>
        {icon}
        {title}
      </div>
      <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{children}</p>
    </section>
  );
}
